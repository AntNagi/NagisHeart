/**
 * 评分器校准（F26）——**给尺子本身量一把尺子**。
 *
 * 角色 Eval 的 OOC 分由 aux 模型给出。一个不会扣分的评分器测不出退化：
 * 将来谁把人格资源改坏了，它照样给 5 分，那份报告就成了摆设。
 *
 * 本校准用**权威逐字反例**（Bible §8.4 / Rel §10.3）与 V17 逐字台词做双向验证：
 * 禁止句式必须被打低分，正常台词必须被打高分。**任一方向失灵即判失败**。
 *
 * 这是 `evals/framework/` 的第一条——该目录此前一直是空的，
 * 而 V4 §13 要求框架能力与角色效果分开评。
 */
import { judgeOocForCalibration } from "./role-eval.js";
import type { ChatProvider } from "../packages/core/src/index.js";

export interface CalibrationItem {
  readonly text: string;
  readonly src: string;
  readonly kind?: string;
}

export interface CalibrationResult {
  readonly text: string;
  readonly src: string;
  readonly expected: "low" | "high";
  readonly score?: number;
  readonly reason?: string;
  readonly passed: boolean;
}

/** 阈值给上下限而非精确值——换评分模型后分布会平移，只要还能分开两类就算合格。 */
const LOW_MAX = 2;
const HIGH_MIN = 4;

/** 手写解析：格式是我们自己定的、结构固定，`evals/` 不该为此多一个 yaml 依赖。 */
export function parseCalibration(yaml: string, section: string): readonly CalibrationItem[] {
  const body = yaml.split(`${section}:`)[1]?.split(/\n[a-z_]+:/u)[0] ?? "";
  return [...body.matchAll(/\{([^}]*)\}/gu)].flatMap((match) => {
    const line = match[1] ?? "";
    const pick = (key: string): string | undefined =>
      new RegExp(`${key}:\\s*"([^"]*)"`, "u").exec(line)?.[1]
      ?? new RegExp(`${key}:\\s*([^,}]+)`, "u").exec(line)?.[1]?.trim();
    const text = pick("text");
    if (!text) return [];
    return [{ text, src: pick("src") ?? "?", ...(pick("kind") ? { kind: pick("kind")! } : {}) }];
  });
}

export async function runCalibration(
  yaml: string,
  provider: ChatProvider,
  apiKey: string,
  onProgress?: (done: number, total: number) => void,
): Promise<readonly CalibrationResult[]> {
  const low = parseCalibration(yaml, "must_score_low").map((item) => ({ item, expected: "low" as const }));
  const high = parseCalibration(yaml, "must_score_high").map((item) => ({ item, expected: "high" as const }));
  const all = [...low, ...high];
  const results: CalibrationResult[] = [];
  let done = 0;
  for (const { item, expected } of all) {
    done += 1;
    onProgress?.(done, all.length);
    // 用中性的提问包住待评文本——校准的是「这句回复像不像凪」，
    // 不该让提问内容本身影响判断。
    const verdict = await judgeOocForCalibration(provider, apiKey, "随便问一句", item.text);
    const score = verdict.score;
    const passed = score === undefined
      ? false
      : expected === "low" ? score <= LOW_MAX : score >= HIGH_MIN;
    results.push({
      text: item.text, src: item.src, expected, passed,
      ...(score === undefined ? {} : { score }),
      ...(verdict.reason === undefined ? {} : { reason: verdict.reason }),
    });
  }
  return results;
}
