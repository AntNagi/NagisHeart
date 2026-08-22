import type { EmbeddingProvider, RequestSecret } from "@nagi/core";

interface EmbeddingResponse {
  readonly data?: readonly { readonly embedding?: unknown; readonly index?: unknown }[];
  readonly model?: unknown;
  readonly error?: { readonly code?: unknown; readonly message?: unknown };
}

export interface OpenAICompatibleEmbeddingOptions {
  /** 完整的 embeddings 端点 URL。**不是** chat/completions。 */
  readonly endpoint: string;
  readonly model: string;
  /**
   * 向量维度。**必须显式配置，不从首次响应推断**——
   * 推断出来的维度一旦与库里已有向量不一致，会静默产生混合向量空间
   * （V4 §8.2 称之为「静默错误」）。写死才能在启动时就发现不匹配。
   */
  readonly dimension: number;
  readonly timeoutMs?: number;
  readonly headers?: Readonly<Record<string, string>>;
}

/**
 * OpenAI 兼容的 embedding 适配器。
 *
 * 与 chat 适配器分开是 V4 §8.2 的硬要求：
 * 「embedding provider 与 main / aux 分开配置」「更换聊天 LLM 不得自动更换
 * embedding 模型」。合在一起写，换 chat 模型时极易顺手把 embedding 也换掉，
 * 而那会让库里所有既有向量与新查询向量落在不同空间——**检索照常返回结果，
 * 只是结果没有意义**，这种失败不报错、不崩溃，只是悄悄变差。
 */
export class OpenAICompatibleEmbeddingProvider implements EmbeddingProvider {
  public constructor(private readonly options: OpenAICompatibleEmbeddingOptions) {}

  public get modelId(): string {
    return this.options.model;
  }

  public get dimension(): number {
    return this.options.dimension;
  }

  public async embed(texts: readonly string[], secret?: RequestSecret): Promise<readonly Float32Array[]> {
    if (texts.length === 0) return [];
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.options.timeoutMs ?? 60_000);
    try {
      const response = await fetch(this.options.endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(secret?.apiKey ? { authorization: `Bearer ${secret.apiKey}` } : {}),
          ...this.options.headers,
        },
        body: JSON.stringify({ model: this.options.model, input: texts }),
        signal: controller.signal,
      });
      const payload: unknown = await response.json();
      if (!response.ok) throw new Error(describeFailure(response.status, this.options.model, payload));
      const result = payload as EmbeddingResponse;
      const data = result.data;
      if (!Array.isArray(data) || data.length !== texts.length) {
        throw new Error(`embedding response size mismatch: expected ${texts.length}, got ${Array.isArray(data) ? data.length : "none"}`);
      }
      // 按 index 归位。多数厂商按序返回，但协议允许乱序，
      // 顺序错了会把 A 的向量安到 B 头上——是那种查不出来的错。
      const ordered = [...data].sort((left, right) => Number(left.index ?? 0) - Number(right.index ?? 0));
      return ordered.map((item, position) => {
        const vector = item.embedding;
        if (!Array.isArray(vector) || vector.some((value) => typeof value !== "number")) {
          throw new Error(`embedding ${position} is not a numeric vector`);
        }
        if (vector.length !== this.options.dimension) {
          // 维度对不上就**立刻失败**，绝不接受。放进去就是混合向量空间。
          throw new Error(
            `embedding dimension mismatch: config says ${this.options.dimension}, ` +
            `model ${this.options.model} returned ${vector.length}. ` +
            `改了 embedding 模型就必须重建全部向量（V4 §8.2）。`,
          );
        }
        return Float32Array.from(vector as number[]);
      });
    } finally {
      clearTimeout(timeout);
    }
  }
}

/** 与 chat 适配器同样的口径：带上厂商错误详情，但**绝不带 apiKey**（域 B 红线）。 */
function describeFailure(status: number, model: string, payload: unknown): string {
  const error = (payload as EmbeddingResponse | undefined)?.error;
  const code = typeof error?.code === "string" ? error.code : undefined;
  const message = typeof error?.message === "string" ? error.message : undefined;
  const detail = [code, message].filter(Boolean).join(": ");
  return detail
    ? `embedding request failed (${status}) for model ${model} — ${detail}`
    : `embedding request failed (${status}) for model ${model}`;
}
