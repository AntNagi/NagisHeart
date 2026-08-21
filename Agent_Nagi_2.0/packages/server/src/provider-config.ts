import { OpenAICompatibleProvider } from "./openai-compatible-provider.js";

export function createProviderFromEnvironment(): OpenAICompatibleProvider | undefined {
  const endpoint = process.env.NAGI_LLM_ENDPOINT?.trim();
  const model = process.env.NAGI_LLM_MODEL?.trim();
  if (!endpoint || !model || !process.env.NAGI_DEV_LLM_KEY?.trim()) return undefined;
  return new OpenAICompatibleProvider({
    endpoint,
    model,
    timeoutMs: Number(process.env.NAGI_LLM_TIMEOUT_MS ?? 60_000),
  });
}
