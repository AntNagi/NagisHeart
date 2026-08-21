import { OpenAICompatibleProvider, type ModelSlot } from "./openai-compatible-provider.js";

/**
 * 厂商专属参数按**模型名前缀**匹配，业务层不感知（V4 §10）。
 *
 * 豆包 seed 系列默认开启深度思考。实测（2026-08-22，`doubao-seed-2-0-mini-260215`）：
 * 同一条抽取任务，默认 635 output token / 6.2s，关闭后 41 token / 0.9s，结果一致。
 * aux 每轮多次调用，不关等于用便宜模型烧贵价钱。
 *
 * main 位**不关**思考——凪的回复质量优先，且角色模型的表现已按开启状态标定过
 * （NRH-20260821-2037 的 30 条对抗用例即在默认设置下跑出）。
 */
function auxExtraBody(model: string): Readonly<Record<string, unknown>> | undefined {
  if (/^doubao-seed/u.test(model)) return { thinking: { type: "disabled" } };
  return undefined;
}

function slot(model: string, extraBody?: Readonly<Record<string, unknown>>): ModelSlot {
  return extraBody ? { model, extraBody } : { model };
}

/**
 * 从环境变量装配 Provider。
 *
 * - `NAGI_LLM_MODEL`      main 位（凪的正式回复，质量优先）
 * - `NAGI_LLM_MODEL_AUX`  aux 位（场景分类 / 记忆抽取 / OOC 打分，便宜优先）
 *
 * aux 未配置时**不伪造**——`hasSlot("aux")` 返回 false，调用方据此走确定性降级，
 * 而不是偷偷拿 main 模型去跑杂活（那会贵 5–10 倍且未经标定）。
 */
export function createProviderFromEnvironment(): OpenAICompatibleProvider | undefined {
  const endpoint = process.env.NAGI_LLM_ENDPOINT?.trim();
  const model = process.env.NAGI_LLM_MODEL?.trim();
  if (!endpoint || !model || !process.env.NAGI_DEV_LLM_KEY?.trim()) return undefined;
  const auxModel = process.env.NAGI_LLM_MODEL_AUX?.trim();
  return new OpenAICompatibleProvider({
    endpoint,
    slots: {
      main: slot(model),
      ...(auxModel ? { aux: slot(auxModel, auxExtraBody(auxModel)) } : {}),
    },
    fallbackSlot: "main",
    timeoutMs: Number(process.env.NAGI_LLM_TIMEOUT_MS ?? 60_000),
  });
}
