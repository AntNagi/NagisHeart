import type { ChatProvider, ChatRequest, ChatResult, ModelCapability, RequestSecret } from "@nagi/core";

interface OpenAIResponse {
  readonly model?: unknown;
  readonly choices?: readonly {
    readonly message?: { readonly content?: unknown };
    /** 空正文时用来区分成因：`length` + `completion_tokens: 0` = 思考吃光了预算。 */
    readonly finish_reason?: unknown;
  }[];
  readonly usage?: { readonly prompt_tokens?: unknown; readonly completion_tokens?: unknown };
  readonly error?: { readonly code?: unknown; readonly message?: unknown };
}

/**
 * 一个能力位（main / aux / …）到厂商实际模型的绑定。
 *
 * `extraBody` 承载厂商专属参数，业务层永远看不到它——这正是 V4 §10
 *「各家差异由 Adapter 内部吸收，业务不感知」的落点。
 *
 * 实测用途（豆包，2026-08-22）：`doubao-seed-2-0-mini` 默认开着深度思考，
 * 抽 2 条事实要烧 635 个 output token、耗时 6.2s；加上
 * `thinking: { type: "disabled" }` 后降到 41 token / 0.9s，**抽取质量不变**。
 * aux 每轮要调多次，不关思考等于拿便宜模型烧贵价钱。
 */
export interface ModelSlot {
  readonly model: string;
  readonly extraBody?: Readonly<Record<string, unknown>>;
}

export interface OpenAICompatibleProviderOptions {
  readonly endpoint: string;
  /** 能力位 → 模型绑定。键是 `ChatRequest.model` 传入的能力位名。 */
  readonly slots: Readonly<Record<string, ModelSlot>>;
  /** `ChatRequest.model` 未命中任何能力位时用哪个。缺省取 `main`。 */
  readonly fallbackSlot?: string;
  readonly timeoutMs?: number;
  readonly headers?: Readonly<Record<string, string>>;
}

/** Adapter for domestic vendors that expose an OpenAI-compatible chat endpoint. */
export class OpenAICompatibleProvider implements ChatProvider {
  public constructor(private readonly options: OpenAICompatibleProviderOptions) {}

  /** 能力位有哪些，供调用方在装配前校验（例如 aux 未配置时降级）。 */
  public hasSlot(slot: ModelCapability): boolean {
    return Object.hasOwn(this.options.slots, slot);
  }

  private resolve(slot: string): ModelSlot {
    const direct = this.options.slots[slot];
    if (direct) return direct;
    const fallbackName = this.options.fallbackSlot ?? "main";
    const fallback = this.options.slots[fallbackName];
    if (fallback) return fallback;
    const first = Object.values(this.options.slots)[0];
    if (first) return first;
    throw new Error("provider has no model slot configured");
  }

  /**
   * 瞬时故障重试。
   *
   * **为什么必须有**：厂商的限流窗口很短，一次 429 往往几秒后就恢复。
   * 没有重试时，这种抖动会**原样变成使用者眼前的一条错误消息**——
   * 实测（2026-08-23，Gemini 免费档）聊到第三轮就撞上，而同一模型
   * 几十秒后再探就是通的。Eval 早有 `withRetry`，聊天路径却没有，
   * 于是「Eval 全绿、实际聊两句就报错」这种矛盾观感一直存在。
   *
   * 只重试限流与瞬时不可用。鉴权失败、欠费、请求格式错误重试没有意义，
   * 重试只会让使用者多等几秒再看到同一条错误。
   *
   * 退避总计约 12 秒（1+3+8）。再长就不如直接报错让人重发——
   * 对话是同步交互，等待本身也是一种失败。
   */
  private static readonly RETRY_DELAYS_MS = [1_000, 3_000, 8_000];

  private static isTransient(message: string): boolean {
    return /\(429\)|\(500\)|\(502\)|\(503\)|\(504\)|rate limit|quota|UNAVAILABLE|overloaded|fetch failed|timeout|aborted/iu.test(message);
  }

  public async complete(request: ChatRequest, secret: RequestSecret): Promise<ChatResult> {
    for (let attempt = 0; ; attempt += 1) {
      try {
        return await this.completeOnce(request, secret);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const delay = OpenAICompatibleProvider.RETRY_DELAYS_MS[attempt];
        if (delay === undefined || !OpenAICompatibleProvider.isTransient(message)) throw error;
        // ⚠ 只打印 message，不打印 error 对象——避免 key 随上下文泄进日志（域 B 红线）。
        console.warn(`[provider] 第 ${attempt + 1} 次重试（${delay}ms 后）：${message}`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  private async completeOnce(request: ChatRequest, secret: RequestSecret): Promise<ChatResult> {
    // `request.model` 是**能力位**（main / aux），不是厂商模型名——业务层不认厂商。
    // 此前这里直接忽略了它、恒用构造时的单一模型，导致一个 Provider 实例只能服务
    // 一个模型，aux 位无法与 main 共存（见 OPEN_QUESTIONS F11）。
    const slot = this.resolve(request.model);
    const started = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.options.timeoutMs ?? 60_000);
    try {
      const response = await fetch(this.options.endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${secret.apiKey}`,
          ...this.options.headers,
        },
        body: JSON.stringify({
          model: slot.model,
          messages: request.messages,
          ...(request.temperature === undefined ? {} : { temperature: request.temperature }),
          ...(request.maxTokens === undefined ? {} : { max_tokens: request.maxTokens }),
          stream: false,
          ...slot.extraBody,
        }),
        signal: controller.signal,
      });
      const payload: unknown = await response.json();
      if (!response.ok) throw new Error(describeFailure(response.status, slot.model, payload));
      if (!payload || typeof payload !== "object") throw new Error("provider returned an invalid response");
      const result = payload as OpenAIResponse;
      const choice = result.choices?.[0];
      const text = choice?.message?.content;
      if (typeof text !== "string") {
        // 空正文有好几种成因，笼统报「no assistant content」会让人查错方向。
        // 实测（Gemini flash，2026-08-22）：思考型模型会把整个 max_tokens 烧在
        // 思考上，返回 finish_reason="length" 且 completion_tokens=0，正文为空。
        // 另一种是厂商安全过滤（NRH-20260820-005 早就警告过「表现为凪突然不说话」）。
        const finish = typeof choice?.finish_reason === "string" ? choice.finish_reason : "unknown";
        const outputTokens = typeof result.usage?.completion_tokens === "number" ? result.usage.completion_tokens : -1;
        if (finish === "length" && outputTokens === 0) {
          throw new Error(
            `provider returned no text: model ${slot.model} spent the whole token budget on reasoning ` +
            `(finish_reason=length, completion_tokens=0). 提高 maxTokens 或改用不思考的模型。`,
          );
        }
        throw new Error(`provider response has no assistant content (finish_reason=${finish}, model=${slot.model})`);
      }
      return {
        text,
        model: typeof result.model === "string" ? result.model : slot.model,
        ...(typeof result.usage?.prompt_tokens === "number" ? { inputTokens: result.usage.prompt_tokens } : {}),
        ...(typeof result.usage?.completion_tokens === "number" ? { outputTokens: result.usage.completion_tokens } : {}),
        latencyMs: Date.now() - started,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}

/**
 * 把厂商的错误 code / message 带进异常。
 *
 * 此前只抛 `provider request failed (404)`，排查时完全无法区分是 endpoint 错、
 * 模型 id 错还是 key 错——实测那次真因是 `ModelNotOpen`（账号未开通该模型），
 * 而这个信息**本来已经在手里**（代码先 `await response.json()` 才判 `ok`），
 * 却被丢弃。见 OPEN_QUESTIONS F12。
 *
 * ⚠ 只取厂商回包里的 code / message。**绝不能把 `secret.apiKey` 或请求头带进来**
 * ——域 B 红线：使用者的 key 不落库、不写日志、不进错误对象。
 */
function describeFailure(status: number, model: string, payload: unknown): string {
  const error = (payload as OpenAIResponse | undefined)?.error;
  const code = typeof error?.code === "string" ? error.code : undefined;
  const message = typeof error?.message === "string" ? error.message : undefined;
  const detail = [code, message].filter(Boolean).join(": ");
  return detail
    ? `provider request failed (${status}) for model ${model} — ${detail}`
    : `provider request failed (${status}) for model ${model}`;
}
