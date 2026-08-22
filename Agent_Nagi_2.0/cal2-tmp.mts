import { readFileSync } from "node:fs";
import { createProviderFromEnvironment } from "./packages/server/src/provider-config.js";
import { runCalibration } from "./evals/judge-calibration.js";
const provider = createProviderFromEnvironment()!;
const key = process.env.NAGI_DEV_LLM_KEY!;
const yaml = readFileSync("evals/framework/judge_calibration.yaml", "utf8");
const results = await runCalibration(yaml, provider, key);
const pass = results.filter((r) => r.passed).length;
console.log(`\n校准 ${pass}/${results.length} 通过\n`);
for (const r of results) {
  const mark = r.passed ? "✓" : "✗";
  console.log(`${mark} 期望${r.expected === "low" ? "低" : "高"}分  得 ${r.score ?? "调用失败"}  ${JSON.stringify(r.text)}`);
  if (!r.passed && r.reason) console.log(`     ${r.reason.slice(0, 70)}`);
}
