import {
  buildContext,
  evaluateGuard,
  InMemoryMemoryStore,
  MemoryEngine,
  type CanonState,
  type SceneId,
  type SessionState,
  type ChatProvider,
  type RelationshipState,
  findStaleEmbeddings,
  type MemoryStore,
  type MemoryRecord,
} from "@nagi/core";
import type { GuardState, RuntimeDependencies } from "@nagi/runtime-langgraph";
import { LocalDomainStore } from "./local-domain-store.js";
import { loadGuardPolicy, loadResourceBlocks } from "./resource-loader.js";
import { loadRelationshipConfig, loadRetrievalConfig, resolveSeedRelationship } from "./runtime-config.js";
import { createEmbeddingProviderFromEnvironment } from "./provider-config.js";
import { rebuildVectors, type VectorRebuildIndex } from "./vector-rebuild.js";
import { resolve } from "node:path";
import { join } from "node:path";
import { readFileSync } from "node:fs";

/**
 * 记忆抽取提示词（aux 位）。
 *
 * 三条刻意的保守设计：
 *  1. **只抽使用者明说的**，不许推断——推断出来的"事实"会被当成真事存进长期记忆，
 *     而 Live 记忆一旦写错，凪之后会拿它当既成事实用。宁可漏记，不可错记。
 *  2. **不抽凪自己说的话**——那是生成结果，不是关于使用者的事实。
 *  3. **允许返回空数组**并明确举例（寒暄、语气词），否则模型倾向于"必须抽点什么"。
 */
const MEMORY_EXTRACTION_PROMPT = `你是信息抽取器，不是聊天助手。

从使用者这句话里，抽出**值得长期记住的、关于使用者的个人事实**。

规则：
- 只抽使用者**明确说出**的内容，不要推断、不要脑补
- 寒暄、语气词、闲聊、对天气的评论 —— 一律不抽，返回空数组
- 每条事实写成简短的第三人称陈述
- **指代对方时一律写 \`{{playerName}}\`，不要写「使用者」「用户」「对方」**
  —— 那是渲染时会被替换成真实称呼的占位符。写死「使用者」会让凪读到
  一个客服式的第三人称词，出戏
- salience 表示重要程度：0.9 长期身份信息，0.7 计划与偏好，0.5 一次性小事

例：
  输入「我今天换了新工作，在一家游戏公司做策划」
  输出 {"facts":[{"text":"{{playerName}}在一家游戏公司做策划","salience":0.9}]}

只输出 JSON，不要解释，不要 markdown 代码块：
{"facts":[{"text":"简短事实","salience":0.7}]}`;

interface ExtractedFact {
  readonly text: string;
  readonly salience: number;
}

/** 容忍模型偶尔套 markdown 代码块；解析不出就当没抽到，绝不抛给调用方。 */
function parseExtractedFacts(raw: string): readonly ExtractedFact[] {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/u, "").replace(/\s*```$/u, "").trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return [];
  }
  const facts = (parsed as { facts?: unknown })?.facts;
  if (!Array.isArray(facts)) return [];
  return facts.flatMap((item): ExtractedFact[] => {
    const text = (item as { text?: unknown })?.text;
    const salience = (item as { salience?: unknown })?.salience;
    if (typeof text !== "string" || text.trim().length === 0) return [];
    const clamped = typeof salience === "number" && Number.isFinite(salience)
      ? Math.min(1, Math.max(0, salience))
      : 0.5;
    return [{ text: text.trim().slice(0, 200), salience: clamped }];
  });
}

const canon: CanonState = { ending: "true", path: "dream", epoch: "post_ending" };

/**
 * 记忆存储。配了 `NAGI_DOMAIN_DB` 就落 SQLite，否则退回内存（仅供单测与临时跑）。
 *
 * **不配等于凪记不住任何跟你聊过的事**——重启即清空（F24 实测）。
 * `.env` 已默认指向 `var/nagi.sqlite`；`var/` 已在 gitignore。
 * 单测不加载 `.env`，所以继续走内存，彼此隔离、互不留文件。
 *
 * 与 domain store **共用同一个库文件**（表不同）：领域库存关系与对话轮次，
 * 记忆库存记忆正文。共用一个文件才能一起备份、一起导出。
 */
/**
 * 两个 SQLite store 用**动态 import** 加载，不用静态 import 也不用 createRequire。
 *
 * - 不静态 import：它们依赖 better-sqlite3（原生模块）。静态 import 会让
 *   所有场景都必须装得上原生绑定，包括根本不落盘的单测。
 * - 不 createRequire：Node 的运行时 `.ts` 加载走类型剥离，撑不住 TS 语法；
 *   而 vitest 直接跑 `src/*.ts`，那里没有 `.js` 邻居可解析。
 *   动态 import 由打包/运行时自己做 `.js`→`.ts` 映射，三种环境都成立。
 *
 * 代价：这两个 create 变成 async，模块尾部用 top-level await 消化。
 */
/** 记忆浏览。给 /api/memories 用——让使用者看见凪记得什么。 */
interface MemoryBrowseOps {
  listLive(namespace: string, limit: number): readonly MemoryRecord[];
}

async function createMemoryStore(): Promise<{
  store: MemoryStore;
  liveCount?: (namespace: string) => number;
  rebuild?: VectorRebuildIndex;
  browse?: MemoryBrowseOps;
}> {
  const databasePath = process.env.NAGI_DOMAIN_DB;
  if (!databasePath) return { store: new InMemoryMemoryStore() };
  const { SqliteMemoryStore } = await import("./sqlite-memory-store.js");
  const store = new SqliteMemoryStore(databasePath);
  return { store, liveCount: (namespace) => store.liveCount(namespace), rebuild: store, browse: store };
}

const { store: memoryStore, liveCount: liveMemoryCountFromStore, rebuild: vectorRebuild, browse: memoryBrowse } = await createMemoryStore();
const memoryEngine = new MemoryEngine(memoryStore);
type DomainBackend = {
  loadRelationship: LocalDomainStore["loadRelationship"];
  loadProfile: LocalDomainStore["loadProfile"];
  saveProfile: LocalDomainStore["saveProfile"];
  loadPlayerOverlay: LocalDomainStore["loadPlayerOverlay"];
  savePlayerOverlay: LocalDomainStore["savePlayerOverlay"];
  commitTurn: LocalDomainStore["commitTurn"];
  listTurns: LocalDomainStore["listTurns"];
  liveMemoryCount(userId: string): number;
  exportUser(userId: string): ReturnType<LocalDomainStore["exportUser"]>;
  importUser(snapshot: unknown, userId: string): void;
};

async function createDomainBackend(seed: RelationshipState): Promise<DomainBackend> {
  const databasePath = process.env.NAGI_DOMAIN_DB;
  if (!databasePath) return new LocalDomainStore(seed);
  const { SqliteDomainStore } = await import("./sqlite-domain-store.js");
  return new SqliteDomainStore(databasePath, seed);
}

/**
 * canon 记忆是否"扎实"——`NRH-20260821-1708` 把它列为继承高亲密度的**前提条件**。
 *
 * 判据：只要还有条目是 `bake-canon` 的标题模板（即「骨架」，正文未被读取），
 * 就视为未就绪。这个判据是可确定计算的，不靠人判断。
 */
function isCanonReady(memories: readonly { readonly text: string }[]): boolean {
  if (memories.length === 0) return false;
  const skeleton = /^既成事实：在 TRUE END 时间线上，凪经历了「.+?」。这是已经发生的剧情节点/u;
  return !memories.some((memory) => skeleton.test(memory.text));
}

const resourceRoot = resolve(process.env.NAGI_RESOURCE_ROOT ?? "resources");
const resources = loadResourceBlocks(resourceRoot);
const guardPolicy = loadGuardPolicy(resourceRoot);

/** beat 上限，供输出归一层复用。来自 output_guard 的 beat_caps.max_per_reply。 */
export const maxBeatsPerReply = guardPolicy.config.maxBeatsPerReply;

function loadCanonMemories(root: string) {
  const path = join(root, "world", "events", "canon-memory.json");
  try {
    const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
    if (!parsed || typeof parsed !== "object") return [];
    const value = parsed as { schemaVersion?: unknown; memories?: unknown };
    if (value.schemaVersion !== 1 || !Array.isArray(value.memories)) return [];
    return value.memories.filter((item): item is Parameters<typeof memoryStore.append>[0][number] => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Record<string, unknown>;
      const source = candidate.source;
      return candidate.kind === "canon" && candidate.namespace === "canon:nagisheart" && typeof candidate.id === "string" &&
        typeof candidate.text === "string" && typeof candidate.createdAt === "string" && typeof candidate.updatedAt === "string" &&
        typeof candidate.salience === "number" && typeof candidate.confidence === "number" && Array.isArray(candidate.tags) &&
        !!source && typeof source === "object" && typeof (source as Record<string, unknown>).path === "string" &&
        typeof (source as Record<string, unknown>).section === "string" && typeof (source as Record<string, unknown>).sha256 === "string";
    });
  } catch {
    return [];
  }
}

const canonMemories = loadCanonMemories(resourceRoot);
const canonLoad = memoryStore.append(canonMemories);

// 顺序有讲究：先读 canon 判断是否就绪 → 再据此定关系初值 → 最后才建 store。
// 倒过来的话 store 已经用 0/0/0 建好了，Q19 的裁决又一次落空。
const relationshipConfig = loadRelationshipConfig();
// topK 从配置读，不再硬编码——F23 的成因就是这两处差了一倍且无人知晓。
const retrievalConfig = loadRetrievalConfig();
const seedRelationship = resolveSeedRelationship(relationshipConfig, isCanonReady(canonMemories));
const domainStore = await createDomainBackend(seedRelationship);

/**
 * embedding provider。未配置时检索退回纯词面（bigram），功能不受影响、只是变弱。
 * **与 chat 分开配置**——V4 §8.2「更换聊天 LLM 不得自动更换 embedding 模型」。
 */
export const embeddingProvider = createEmbeddingProviderFromEnvironment();

/**
 * 启动时重建缺失/过期的向量。**不 await**：重建可能要几十秒，
 * 服务不该为它等着。补到一半的状态仍然可用，只是那部分记忆暂时排得靠后。
 */
async function runVectorRebuild(): Promise<void> {
  if (!embeddingProvider || !vectorRebuild) return;
  const apiKey = process.env.NAGI_DEV_LLM_KEY ?? "";
  // 没有服务端 key 时不做后台重建——绝不拿请求方的 BYOK key 跑全库任务：
  // 那是花别人的额度，且 BYOK 的 key 不该活过单次请求（域 B 红线）。
  if (!apiKey) {
    console.warn("[embedding] 未配置 NAGI_DEV_LLM_KEY，跳过向量重建（不使用请求方的 BYOK key 跑全库任务）。");
    return;
  }
  await rebuildVectors({
    store: memoryStore,
    index: vectorRebuild,
    model: embeddingProvider.modelId,
    embed: (texts) => embedOrDegrade(texts, apiKey, "rebuild"),
    log: (message) => console.warn(message),
  });
}

if (embeddingProvider) {
  const stale = findStaleEmbeddings(canonMemories, embeddingProvider.modelId);
  if (stale.size > 0) {
    const detail = [...stale].map(([model, count]) => `${model}:${count} 条`).join("，");
    console.warn(
      `[embedding] 库中存在**其它模型**的向量（${detail}），当前配置为 ${embeddingProvider.modelId}，将重建。`,
    );
  }
  // catch 必须有——未处理的 rejection 会让整个进程退出。
  void canonLoad
    .then(() => runVectorRebuild())
    .catch((error: unknown) => {
      console.warn(`[embedding] 向量重建异常：${error instanceof Error ? error.message : String(error)}`);
    });
}

/**
 * 关闭底层存储，释放 SQLite 文件句柄。
 *
 * Windows 上句柄没关就删库文件会 EPERM——Eval 跑完清理临时库时必踩
 * （与 sqlite-persistence.test.ts 那条长期失败的测试同一个成因）。
 * 长驻服务端不需要调用它；一次性脚本跑完必须调。
 */
export function closeLocalStores(): void {
  for (const candidate of [memoryStore, domainStore] as unknown[]) {
    const closable = candidate as { close?: () => void };
    if (typeof closable.close === "function") closable.close();
  }
}

export function getLocalDomainState(userId: string) {
  return {
    relationship: domainStore.loadRelationship(userId),
    // 优先读记忆库里的**真实条数**。domain store 那个 live_memory_count 是个
    // 累加计数器，导入 / 重建后可能与实际记忆对不上——真实条数才是事实。
    liveMemoryCount: liveMemoryCountFromStore?.(userId) ?? domainStore.liveMemoryCount(userId),
  };
}

/**
 * 列出凪记住了你的什么。给 /api/memories 用。
 *
 * 只有 SQLite 后端支持——内存后端（单测用）没有这个能力，返回空数组。
 * 不伪造：返回假数据会让"记忆没写进去"看起来像"记忆好好的"。
 */
export function getLocalMemories(userId: string, limit = 50) {
  return memoryBrowse?.listLive(userId, limit) ?? [];
}

/** 玩家层的读写。给 /api/player-overlay 用。 */
/** 称呼的读写。给 /api/profile 用。 */
export function getProfile(userId: string) {
  return domainStore.loadProfile(userId);
}

export function setProfile(userId: string, playerName: string, nagiName: string): void {
  domainStore.saveProfile(userId, playerName, nagiName);
}

export function getPlayerOverlay(userId: string): string {
  return domainStore.loadPlayerOverlay(userId);
}

export function setPlayerOverlay(userId: string, text: string): void {
  domainStore.savePlayerOverlay(userId, text);
}

export function getLocalHistory(userId: string, limit = 50) {
  return domainStore.listTurns(userId, limit);
}

export function exportLocalDomain(userId: string) {
  return domainStore.exportUser(userId);
}

export function importLocalDomain(userId: string, snapshot: unknown): void {
  domainStore.importUser(snapshot, userId);
}

function classify(message: string): SceneId {
  if (/(足球|训练|比赛|球场)/u.test(message)) return "football";
  if (/(喜欢|爱|想你|告白)/u.test(message)) return "affection";
  if (/(吵|生气|失望|为什么不)/u.test(message)) return "conflict";
  return "daily";
}

/**
 * 把文本转成向量。失败时返回 undefined —— **退回纯词面，不让整轮挂掉**。
 *
 * 检索是增强，不是前提：embedding 端点抽风时凪应该照常说话，只是想得浅一点。
 * 但失败必须留声，否则「一直没接上」看起来和「接上了但没帮上忙」一模一样。
 *
 * @param label 出现在日志里，用来区分查询侧与写入侧——两侧只要有一侧没跑，
 *   向量空间就是残缺的（有向量的记忆永远赢过没向量的），这是要能一眼看出来的。
 */
async function embedOrDegrade(
  texts: readonly string[],
  apiKey: string,
  label: string,
): Promise<readonly Float32Array[] | undefined> {
  if (!embeddingProvider || texts.length === 0 || !apiKey) return undefined;
  try {
    return await embeddingProvider.embed(texts, { apiKey });
  } catch (error) {
    // 只打印 message，不打印 error 对象——避免 key 随上下文泄进日志（域 B 红线）。
    console.warn(`[embedding:${label}] 失败，本次退回纯词面：${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }
}

export function createLocalDependencies(provider?: ChatProvider, requestApiKey?: string): RuntimeDependencies {
  return {
    validateRequest(request) {
      if (!request.requestId || !request.userId || !request.threadId) throw new Error("request identity is required");
      if (!request.message.trim()) throw new Error("message must not be empty");
      if (request.message.length > 8_000) throw new Error("message is too long");
    },
    async loadDomainState(request) {
      const relationship = domainStore.loadRelationship(request.userId);
      const session: SessionState = {
        scene: "daily",
        now: new Date().toISOString(),
        turnId: request.requestId,
        userId: request.userId,
        conversationId: request.threadId,
        relationship,
      };
      return { canon, relationship, session };
    },
    classifyScene({ message }) {
      return classify(message);
    },
    async retrieveContext({ request, query }) {
      await canonLoad;
      // 查询向量。拿不到就只传 text，rankMemories 会退回词面打分——
      // 检索仍然工作，只是同义改写命不中（实测「他是不是很懒」对
      // 「凪怕麻烦，不愿意动」余弦 0.713，而二者**零个共同 bigram**，词面分恒为 0）。
      const [queryVector] = await embedOrDegrade([query], requestApiKey ?? process.env.NAGI_DEV_LLM_KEY ?? "", "query") ?? [];
      const vectorQuery = queryVector && embeddingProvider
        ? { embedding: Array.from(queryVector), embeddingModel: embeddingProvider.modelId }
        : {};
      const [canonMemories, liveMemories] = await Promise.all([
        memoryEngine.retrieve({ namespace: request.userId, text: query, kinds: ["canon"], limit: retrievalConfig.canon, weights: retrievalConfig.weights, ...vectorQuery }),
        memoryEngine.retrieve({ namespace: request.userId, text: query, kinds: ["live"], limit: retrievalConfig.live, weights: retrievalConfig.weights, ...vectorQuery }),
      ]);
      const merged = [...canonMemories, ...liveMemories].sort((left, right) => right.score - left.score);
      // 相关性下限（F32）。minScore=0 时这一步是恒等的——默认不改变行为。
      // 过滤放在合并**之后**：canon 与 live 分桶检索，各自的最低分不可比，
      // 只有在同一把尺子下才谈得上"够不够相关"。
      if (retrievalConfig.minScore <= 0) return merged;
      const kept = merged.filter((item) => item.score >= retrievalConfig.minScore);
      // 全被滤掉是**正常结果**，不是故障：它表示"这轮没有相关记忆"。
      // 凪据此少说一点，比硬凑八条噪声去联想要好。
      return kept;
    },
    assembleContext({ domain, scene, memories }) {
      const recentTurns = getLocalHistory(domain.session.userId, 6).flatMap((turn) => [
        { role: "user" as const, content: turn.userMessage },
        { role: "assistant" as const, content: turn.assistantMessage },
      ]);
      return buildContext({
        scene,
        relationship: domain.relationship,
        // 玩家层。空的话 buildContext 不会产生块——见 builder.ts 的 playerOverlayBlock。
        playerOverlay: domainStore.loadPlayerOverlay(domain.session.userId),
        // 称呼替换。不传的话凪会在上下文里看到字面的 {{playerName}}——
        // resources/ 里有 407 处占位符，接线之前一处都没被替换过。
        names: domainStore.loadProfile(domain.session.userId),
        resources,
        memories,
        recentTurns,
        maxTokens: 20_000,
      });
    },
    async generateCandidate({ request, context }) {
      if (provider) {
        const result = await provider.complete({
          model: "main",
          messages: [
            { role: "system", content: context.rendered },
            { role: "user", content: request.message },
          ],
          maxTokens: 300,
        }, { apiKey: requestApiKey ?? process.env.NAGI_DEV_LLM_KEY ?? "" });
        return {
          text: result.text,
          usage: {
            latencyMs: result.latencyMs,
            ...(result.inputTokens === undefined ? {} : { inputTokens: result.inputTokens }),
            ...(result.outputTokens === undefined ? {} : { outputTokens: result.outputTokens }),
          },
        };
      }
      // Deliberately obvious development stub until a provider is configured.
      return { text: `【local-provider】${request.message}……好麻烦。` };
    },
    hardGuard(text): GuardState {
      const result = evaluateGuard(text, guardPolicy.config);
      return {
        hardViolations: result.violations.map((violation) => ({
          code: violation.ruleId,
          message: violation.message,
          severity: violation.severity,
        })),
        decision: result.decision,
      };
    },
    fallbackResponse({ request }) {
      const index = [...request.message].length % guardPolicy.fallbacks.length;
      return guardPolicy.fallbacks[index] ?? guardPolicy.fallbacks[0] ?? "……好麻烦。";
    },
    async softJudge() {
      return { oocScore: 0, decision: "pass" as const };
    },
    reviseContext({ context }) {
      return context;
    },
    async extractEffects({ request }) {
      // ── 记忆抽取（aux 位）────────────────────────────────────────────
      // 没有 aux 就**不抽**，而不是拿 main 模型顶上：main 是角色模型，
      // 贵 5–10 倍，且被调教成有代入感，做结构化抽取反而不如小模型规矩。
      if (!provider) { console.warn("[extract_effects] 跳过：provider 未配置"); return { memoryDrafts: [] }; }
      if (!provider.hasSlot("aux")) { console.warn("[extract_effects] 跳过：aux 能力位未配置（NAGI_LLM_MODEL_AUX）"); return { memoryDrafts: [] }; }

      const apiKey = requestApiKey ?? process.env.NAGI_DEV_LLM_KEY ?? "";
      if (!apiKey) { console.warn("[extract_effects] 跳过：无可用 key"); return { memoryDrafts: [] }; }

      try {
        const result = await provider.complete({
          model: "aux",
          messages: [
            { role: "system", content: MEMORY_EXTRACTION_PROMPT },
            { role: "user", content: request.message },
          ],
          temperature: 0.1,
          maxTokens: 400,
        }, { apiKey });
        const facts = parseExtractedFacts(result.text);
        return {
          memoryDrafts: facts.map((fact) => ({
            kind: "live" as const,
            text: fact.text,
            salience: fact.salience,
            // 抽取来自模型，不是既成事实——confidence 低于 canon 的 1.0。
            confidence: 0.6,
            tags: ["extracted", request.threadId],
            sourceTurnId: request.requestId,
          })),
        };
      } catch (error) {
        // 抽取失败不能拖垮整轮对话：凪已经回过话了，记忆是附加效果。
        // 但**必须留声**——静默 catch 会让「抽取一直没跑」看起来像「没什么可抽的」，
        // 二者在 trace 里都是 0 drafts，排查时完全无法区分。
        // ⚠ 只打印 message，不打印 error 对象——避免 key 随请求上下文泄进日志（域 B 红线）。
        console.warn(`[extract_effects] 抽取失败，本轮不写记忆：${error instanceof Error ? error.message : String(error)}`);
        return { memoryDrafts: [] };
      }

      // ── 关系变化：**故意不实现** ────────────────────────────────────
      // `RelationshipDelta` 需要「什么行为使 trust/intimacy/friction 变化多少」的规则，
      // 而 resources/ 与 V4 均未规定（已 grep 确认）。`runtime.yaml` 只给了
      // maxDeltaPerTurn: 3 这个**上限**，不是判据。
      // 契约明令「看不到明确规定的，不许按理解补」——故此处留空，
      // 待 Ant 裁决后再实现。见 OPEN_QUESTIONS F15。
    },
    async commitTurn({ request, accepted, relationshipDelta, memoryDrafts }) {
      // Local-only persistence: replace with SQLite/Postgres DomainStore later.
      domainStore.commitTurn({
        userId: request.userId,
        ...(relationshipDelta ? { relationshipDelta } : {}),
        drafts: memoryDrafts,
        turn: {
          requestId: request.requestId,
          userId: request.userId,
          threadId: request.threadId,
          userMessage: request.message,
          assistantMessage: accepted,
          createdAt: new Date().toISOString(),
        },
      });
      // 写入侧也要向量，且**必须与查询侧同一个模型**。
      // 只做一侧会让向量空间残缺：有向量的记忆恒赢过没向量的，
      // 表现为「凪只记得最近几天的事」——而日志里什么都看不出来。
      const vectors = await embedOrDegrade(
        memoryDrafts.map((draft) => draft.text),
        requestApiKey ?? process.env.NAGI_DEV_LLM_KEY ?? "",
        "commit",
      );
      const draftsWithVectors = vectors && embeddingProvider
        ? memoryDrafts.map((draft, index) => {
            const vector = vectors[index];
            return vector
              ? { ...draft, embedding: Array.from(vector), embeddingModel: embeddingProvider.modelId }
              : draft;
          })
        : memoryDrafts;
      await memoryEngine.commitDrafts(draftsWithVectors, {
        namespace: request.userId,
        now: new Date().toISOString(),
      });
    },
  };
}
