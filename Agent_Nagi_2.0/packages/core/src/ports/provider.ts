export interface RequestSecret {
  /** Ephemeral request-scoped secret. Never put this in graph state, traces, or errors. */
  readonly apiKey: string;
}

/**
 * 能力位。业务只认这几个语义档位，**永远不认厂商与模型名**（V4 §10 / D7）。
 * 挂哪个厂商、哪个模型、要不要带厂商专属参数，全由 `config/providers.yaml`
 * 与 Provider Adapter 决定。
 */
export type ModelCapability = "main" | "aux";

export interface ChatRequest {
  /** 能力位，不是厂商模型名。见 {@link ModelCapability}。 */
  readonly model: ModelCapability;
  readonly messages: readonly {
    readonly role: "system" | "user" | "assistant";
    readonly content: string;
  }[];
  readonly temperature?: number;
  readonly maxTokens?: number;
}

export interface ChatResult {
  readonly text: string;
  readonly model: string;
  readonly inputTokens?: number;
  readonly outputTokens?: number;
  readonly latencyMs: number;
}

export interface ChatProvider {
  complete(request: ChatRequest, secret: RequestSecret): Promise<ChatResult>;
  /**
   * 该能力位是否已配置。调用方据此决定降级路径——例如 aux 未配置时
   * 跳过记忆抽取，而**不是**偷偷拿 main 模型去跑杂活（贵 5–10 倍且未经标定）。
   */
  hasSlot(capability: ModelCapability): boolean;
}

export interface EmbeddingProvider {
  readonly modelId: string;
  readonly dimension: number;
  embed(texts: readonly string[], secret?: RequestSecret): Promise<readonly Float32Array[]>;
}
