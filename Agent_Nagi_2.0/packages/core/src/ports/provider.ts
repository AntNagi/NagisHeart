export interface RequestSecret {
  /** Ephemeral request-scoped secret. Never put this in graph state, traces, or errors. */
  readonly apiKey: string;
}

export interface ChatRequest {
  readonly model: string;
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
}

export interface EmbeddingProvider {
  readonly modelId: string;
  readonly dimension: number;
  embed(texts: readonly string[], secret?: RequestSecret): Promise<readonly Float32Array[]>;
}
