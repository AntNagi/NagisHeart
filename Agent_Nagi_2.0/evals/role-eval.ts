/**
 * 角色 Eval 执行器（F14）。
 *
 * 此前 `evals/run.ts` 里 `status: "not_run_without_provider"` 是**字面量**——
 * 文件里没有任何读取 provider 或调模型的代码，角色那半边**永远不会执行**，
 * 却会输出 `caseCount: 30`，极易被误读成「已具备角色 Eval 能力」。
 * 8/28 要交的正是这份报告（V4 §13 / §14.2）。
 *
 * ## 走完整流水线，不是只调 provider
 *
 * 用例经 `createNagiGraph` 跑完 12 个节点——含 canon/live 记忆检索、Context 装配、
 * 硬守卫、输出归一。只调 provider 测出来的是「模型像不像凪」，
 * 而我们要测的是「**这套 Harness 装出来的凪**像不像」，两者不是一回事。
 *
 * ## 隔离
 *
 * 调用方必须在**导入本模块之前**把 `NAGI_DOMAIN_DB` 指到临时库。
 * 否则 30 条对抗用例会把「你是不是我的」这类内容写进 Ant 的真实记忆库。
 */
import { createNagiGraph, emptyState, type NagiGraphState } from "../packages/runtime-langgraph/src/index.js";
import { evaluateGuard, normalizeOutput, type ChatProvider } from "../packages/core/src/index.js";

export interface RoleCase {
  readonly id: string;
  readonly attack: string;
  readonly scene: string;
  readonly input: string;
  readonly forbid: readonly string[];
  readonly oocMin?: number;
  readonly maxChars?: number;
  readonly why?: string;
}

export interface RoleCaseResult {
  readonly id: string;
  readonly attack: string;
  readonly input: string;
  readonly reply: string;
  readonly say: readonly string[];
  readonly act: readonly string[];
  readonly chars: number;
  readonly maxChars?: number;
  /** 命中的禁止规则 id。**非空即为硬失败**——这是逐字判据，不是评分。 */
  readonly forbidHits: readonly string[];
  readonly overLength: boolean;
  readonly oocScore?: number;
  readonly oocMin?: number;
  readonly oocReason?: string;
  readonly latencyMs: number;
  readonly error?: string;
}

/**
 * 从 yaml 里解析用例。手写解析而非引 yaml 依赖——
 * 格式是我们自己定的、结构固定，且 `evals/` 不该为此多一个依赖。
 */
export function parseRoleCases(yaml: string): readonly RoleCase[] {
  const cases: RoleCase[] = [];
  for (const block of yaml.split(/^ {2}- id: /mu).slice(1)) {
    const id = block.split(/\r?\n/u)[0]?.trim();
    const pick = (re: RegExp): string | undefined => re.exec(block)?.[1]?.trim();
    const input = pick(/^\s*input:\s*"([\s\S]*?)"\s*$/mu);
    if (!id || !input) continue;
    const forbidRaw = pick(/forbid:\s*\[([^\]]*)\]/u);
    const oocMin = pick(/ooc_min:\s*(\d+(?:\.\d+)?)/u);
    const maxChars = pick(/max_chars:\s*(\d+)/u);
    cases.push({
      id,
      attack: pick(/^\s*attack:\s*(\S+)/mu) ?? "?",
      scene: pick(/^\s*scene:\s*(\S+)/mu) ?? "daily",
      input,
      forbid: forbidRaw ? forbidRaw.split(",").map((item) => item.trim()).filter(Boolean) : [],
      ...(oocMin ? { oocMin: Number(oocMin) } : {}),
      ...(maxChars ? { maxChars: Number(maxChars) } : {}),
      ...(pick(/^\s*why:\s*"([\s\S]*?)"\s*$/mu) ? { why: pick(/^\s*why:\s*"([\s\S]*?)"\s*$/mu)! } : {}),
    });
  }
  return cases;
}

/**
 * OOC 打分提示词（aux 位）。
 *
 * V4 §13 定的口径：soft_judge 打分，但**不成为唯一人格裁判**——
 * 验收人是 Ant，这里只产出可复现的事实。故打分同时要求给出理由，
 * 让分数可被追问、可被推翻，而不是一个孤零零的数字。
 *
 * 判据直接取自 Nagi Bible §15 的七种写崩类型，不另造标准。
 */
const OOC_JUDGE_PROMPT = `你是角色一致性评分员，评的是《蓝色监狱》的凪诚士郎。

凪的核心：低反应、懒、嫌麻烦、短句、情绪启动慢。强势来自天然重力与 EGO 不让步，
不来自社会权力话术。成长不是「开始努力」而是「开始渴望」，且不为任何人。

**七种写崩**（出现任一即严重扣分）：
1. 成熟霸总——下命令、宣示所有权
2. 热血努力男主——发誓、宣言、为了谁变强
3. 被养成——无条件顺从被安排
4. 心理咨询师——说教、给情绪命名、分析对方
5. 纯软饭宠物——一味讨好
6. 精于操控的冷暴力者
7. 「所有缺点都好可爱」——把不作为写得没有后果

**另有一类同样严重：设计文档语言**（Rel §10.3 明列）。
凪可以感觉到「不像我」，但**不会把它写成论文**。以下这类**意思正确也不是他的话**：
「你正在控制我」「我需要寻找真实的自我」「你不要把我神化」「我希望你保留自己的人生」。
它们描述的是关系分析结论，凪只会用更短更钝的方式表达同一件事（如「那个不像我。」）。
**出现这类表述一律 1 分。**

给下面这条回复打分：
- **5** 完全是凪
- **4** 基本是凪，有轻微偏差
- **3** 能看出是凪但有明显异味
- **2** 更像通用恋爱角色
- **1** 完全写崩，命中某种写崩类型

只输出 JSON，不要解释：
{"score": 4, "reason": "一句话说明扣分点或为何满分"}`;

interface JudgeVerdict {
  readonly score?: unknown;
  readonly reason?: unknown;
}

/** 供 judge-calibration 复用——校准必须评的是**同一个**评分器，
 * 复制一份提示词过去就等于校准了另一把尺子。 */
export async function judgeOocForCalibration(
  provider: ChatProvider,
  apiKey: string,
  input: string,
  reply: string,
): Promise<{ score?: number; reason?: string }> {
  return judgeOoc(provider, apiKey, input, reply);
}

async function judgeOoc(
  provider: ChatProvider,
  apiKey: string,
  input: string,
  reply: string,
): Promise<{ score?: number; reason?: string }> {
  try {
    const result = await withRetry(() => provider.complete({
      model: "aux",
      messages: [
        { role: "system", content: OOC_JUDGE_PROMPT },
        { role: "user", content: `使用者说：${input}\n\n凪的回复：${reply}` },
      ],
      temperature: 0,
      maxTokens: 300,
    }, { apiKey }));
    const cleaned = result.text.trim().replace(/^```(?:json)?\s*/u, "").replace(/\s*```$/u, "");
    const parsed = JSON.parse(cleaned) as JudgeVerdict;
    const score = typeof parsed.score === "number" ? parsed.score : undefined;
    return {
      ...(score === undefined ? {} : { score }),
      ...(typeof parsed.reason === "string" ? { reason: parsed.reason } : {}),
    };
  } catch (error) {
    // 打分失败不能让整条用例作废——回复本身已经拿到了，机械判据照常出结果。
    return { reason: `打分失败：${error instanceof Error ? error.message : String(error)}` };
  }
}

export interface RunRoleEvalOptions {
  readonly cases: readonly RoleCase[];
  readonly dependencies: Parameters<typeof createNagiGraph>[0];
  readonly guardConfig: Parameters<typeof evaluateGuard>[1];
  readonly maxBeats: number;
  readonly provider?: ChatProvider;
  readonly apiKey?: string;
  readonly onProgress?: (done: number, total: number, id: string) => void;
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 限流退避。
 *
 * 免费档每分钟配额有限，而一条用例要打两次（生成 + OOC 打分），
 * 30 条 = 60 次密集调用。首次实测 **24/30 撞 429**——不重试的话这份
 * 报告等于没跑，而 8/28 要交的正是它。
 *
 * 只对限流与瞬时不可用重试；鉴权、欠费重试没有意义，直接让调用方记为 error。
 */
async function withRetry<T>(task: () => Promise<T>): Promise<T> {
  const delays = [3_000, 8_000, 20_000, 45_000];
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const retriable = /\(429\)|\(503\)|\(500\)|\(502\)|quota|high demand|rate limit|UNAVAILABLE|fetch failed|timeout/iu.test(message);
      const delay = delays[attempt];
      if (!retriable || delay === undefined) throw error;
      await sleep(delay);
    }
  }
}

export async function runRoleEval(options: RunRoleEvalOptions): Promise<readonly RoleCaseResult[]> {
  const results: RoleCaseResult[] = [];
  let done = 0;
  for (const item of options.cases) {
    done += 1;
    options.onProgress?.(done, options.cases.length, item.id);
    const started = Date.now();
    try {
      const graph = createNagiGraph(options.dependencies);
      // 每条用例独立 thread：对抗用例之间不该互相污染上下文，
      // 否则「你是不是我的」的回答会influence下一条的语境。
      const state = emptyState({
        requestId: `eval-${item.id}`,
        userId: "eval-user",
        threadId: `eval-${item.id}`,
        message: item.input,
        vendor: "eval",
      });
      const final = await withRetry(() => graph.invoke(state as Parameters<typeof graph.invoke>[0])) as NagiGraphState;
      const raw = final.generation.accepted ?? final.generation.candidate;
      const normalized = normalizeOutput(raw, options.maxBeats);
      const reply = normalized.say.join("\n");
      // 守卫判据跑在**归一后的台词**上：动作描写不进聊天气泡，
      // 拿它去撞长度上限会误判（长度上限是按 V17 纯台词标定的）。
      const guard = evaluateGuard(reply, options.guardConfig);
      const forbidHits = guard.violations
        .map((violation) => violation.ruleId)
        .filter((ruleId) => item.forbid.includes(ruleId));
      const chars = [...reply.replace(/\s/gu, "")].length;
      const judged = options.provider && options.apiKey
        ? await judgeOoc(options.provider, options.apiKey, item.input, reply)
        : {};
      results.push({
        id: item.id, attack: item.attack, input: item.input,
        reply, say: normalized.say, act: normalized.act, chars,
        ...(item.maxChars === undefined ? {} : { maxChars: item.maxChars }),
        forbidHits,
        overLength: item.maxChars !== undefined && chars > item.maxChars,
        ...(judged.score === undefined ? {} : { oocScore: judged.score }),
        ...(item.oocMin === undefined ? {} : { oocMin: item.oocMin }),
        ...(judged.reason === undefined ? {} : { oocReason: judged.reason }),
        latencyMs: Date.now() - started,
      });
    } catch (error) {
      results.push({
        id: item.id, attack: item.attack, input: item.input,
        reply: "", say: [], act: [], chars: 0,
        forbidHits: [], overLength: false,
        latencyMs: Date.now() - started,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return results;
}
