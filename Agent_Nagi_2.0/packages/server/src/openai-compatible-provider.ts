import type { ChatProvider, ChatRequest, ChatResult, ModelCapability, RequestSecret } from "@nagi/core";

interface OpenAIResponse {
  readonly model?: unknown;
  readonly choices?: readonly { readonly message?: { readonly content?: unknown } }[];
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

  public async complete(request: ChatRequest, secret: RequestSecret): Promise<ChatResult> {
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
      const text = result.choices?.[0]?.message?.content;
      if (typeof text !== "string") throw new Error("provider response has no assistant content");
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
