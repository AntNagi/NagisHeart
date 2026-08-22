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
  type MemoryStore,
} from "@nagi/core";
import type { GuardState, RuntimeDependencies } from "@nagi/runtime-langgraph";
import { LocalDomainStore } from "./local-domain-store.js";
import { loadGuardPolicy, loadResourceBlocks } from "./resource-loader.js";
import { loadRelationshipConfig, resolveSeedRelationship } from "./runtime-config.js";
import { resolve } from "node:path";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

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
- salience 表示重要程度：0.9 长期身份信息，0.7 计划与偏好，0.5 一次性小事

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
function createMemoryStore(): { store: MemoryStore; liveCount?: (namespace: string) => number } {
  const databasePath = process.env.NAGI_DOMAIN_DB;
  if (!databasePath) return { store: new InMemoryMemoryStore() };
  const require = createRequire(import.meta.url);
  const { SqliteMemoryStore } = require("./sqlite-memory-store.js") as {
    SqliteMemoryStore: new (path: string) => MemoryStore & { liveCount(namespace: string): number };
  };
  const store = new SqliteMemoryStore(databasePath);
  return { store, liveCount: (namespace) => store.liveCount(namespace) };
}

const { store: memoryStore, liveCount: liveMemoryCountFromStore } = createMemoryStore();
const memoryEngine = new MemoryEngine(memoryStore);
type DomainBackend = {
  loadRelationship: LocalDomainStore["loadRelationship"];
  commitTurn: LocalDomainStore["commitTurn"];
  listTurns: LocalDomainStore["listTurns"];
  liveMemoryCount(userId: string): number;
  exportUser(userId: string): ReturnType<LocalDomainStore["exportUser"]>;
  importUser(snapshot: unknown, userId: string): void;
};

function createDomainBackend(seed: RelationshipState): DomainBackend {
  const databasePath = process.env.NAGI_DOMAIN_DB;
  if (!databasePath) return new LocalDomainStore(seed);
  const require = createRequire(import.meta.url);
  const { SqliteDomainStore } = require("./sqlite-domain-store.js") as {
    SqliteDomainStore: new (path: string, seed: RelationshipState) => DomainBackend;
  };
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
const seedRelationship = resolveSeedRelationship(relationshipConfig, isCanonReady(canonMemories));
const domainStore = createDomainBackend(seedRelationship);

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
      const [canonMemories, liveMemories] = await Promise.all([
        memoryEngine.retrieve({ namespace: request.userId, text: query, kinds: ["canon"], limit: 4 }),
        memoryEngine.retrieve({ namespace: request.userId, text: query, kinds: ["live"], limit: 4 }),
      ]);
      return [...canonMemories, ...liveMemories].sort((left, right) => right.score - left.score);
    },
    assembleContext({ domain, scene, memories }) {
      const recentTurns = getLocalHistory(domain.session.userId, 6).flatMap((turn) => [
        { role: "user" as const, content: turn.userMessage },
        { role: "assistant" as const, content: turn.assistantMessage },
      ]);
      return buildContext({
        scene,
        relationship: domain.relationship,
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
      await memoryEngine.commitDrafts(memoryDrafts, {
        namespace: request.userId,
        now: new Date().toISOString(),
      });
    },
  };
}
