import type { ChatProvider, ChatRequest, ChatResult, RequestSecret } from "@nagi/core";

interface OpenAIResponse {
  readonly model?: unknown;
  readonly choices?: readonly { readonly message?: { readonly content?: unknown } }[];
  readonly usage?: { readonly prompt_tokens?: unknown; readonly completion_tokens?: unknown };
}

export interface OpenAICompatibleProviderOptions {
  readonly endpoint: string;
  readonly model: string;
  readonly timeoutMs?: number;
  readonly headers?: Readonly<Record<string, string>>;
}

/** Adapter for domestic vendors that expose an OpenAI-compatible chat endpoint. */
export class OpenAICompatibleProvider implements ChatProvider {
  public constructor(private readonly options: OpenAICompatibleProviderOptions) {}

  public async complete(request: ChatRequest, secret: RequestSecret): Promise<ChatResult> {
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
          model: this.options.model,
          messages: request.messages,
          ...(request.temperature === undefined ? {} : { temperature: request.temperature }),
          ...(request.maxTokens === undefined ? {} : { max_tokens: request.maxTokens }),
          stream: false,
        }),
        signal: controller.signal,
      });
      const payload: unknown = await response.json();
      if (!response.ok) throw new Error(`provider request failed (${response.status})`);
      if (!payload || typeof payload !== "object") throw new Error("provider returned an invalid response");
      const result = payload as OpenAIResponse;
      const text = result.choices?.[0]?.message?.content;
      if (typeof text !== "string") throw new Error("provider response has no assistant content");
      return {
        text,
        model: typeof result.model === "string" ? result.model : this.options.model,
        ...(typeof result.usage?.prompt_tokens === "number" ? { inputTokens: result.usage.prompt_tokens } : {}),
        ...(typeof result.usage?.completion_tokens === "number" ? { outputTokens: result.usage.completion_tokens } : {}),
        latencyMs: Date.now() - started,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
