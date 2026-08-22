import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { evaluateGuard } from "../packages/core/src/guard/engine.js";
import { loadGuardPolicy } from "../packages/server/src/resource-loader.js";
import { parseRoleCases, runRoleEval, type RoleCaseResult } from "./role-eval.js";

interface GuardCheck { readonly text: string; readonly expect?: string; }

function parseGuardChecks(text: string, sectionName: string): GuardCheck[] {
  const section = text.split(`${sectionName}:`)[1]?.split(/\n[a-z_]+:/u)[0] ?? "";
  return [...section.matchAll(/text:\s*"((?:\\.|[^"])*)"(?:\s*,\s*expect:\s*([\w.]+))?/gu)].map((match) => ({
    text: (match[1] ?? "").replaceAll('\\"', '"'),
    ...(match[2] ? { expect: match[2] } : {}),
  }));
}

const root = resolve(process.cwd());
const policy = loadGuardPolicy(resolve(root, "resources"));

// ── 守卫 Eval（离线档，零模型调用，CI 可跑）──────────────────────
const guardCorpus = readFileSync(resolve(root, "evals/cases/guard_regex.yaml"), "utf8");
const mustBlock = parseGuardChecks(guardCorpus, "must_block");
const mustPass = parseGuardChecks(guardCorpus, "must_pass");
const blockResults = mustBlock.map((item) => {
  const result = evaluateGuard(item.text, policy.config);
  return { ...item, passed: result.violations.some((violation) => violation.ruleId === item.expect && violation.severity === "block") };
});
const passResults = mustPass.map((item) => {
  const result = evaluateGuard(item.text, policy.config);
  return { ...item, passed: !result.violations.some((violation) => violation.severity === "block") };
});

// ── 角色 Eval（需要模型）─────────────────────────────────────────
const roleCases = parseRoleCases(readFileSync(resolve(root, "evals/cases/ooc_adversarial.yaml"), "utf8"));

/**
 * **隔离**：把领域库指向临时文件，再动态导入 server 依赖。
 *
 * `local-dependencies` 在模块加载时就读 `NAGI_DOMAIN_DB` 并建库，
 * 所以必须**先设环境变量再 import**，静态 import 会来不及。
 * 不隔离的话，30 条对抗用例（「你会不会觉得我是你的？」这类）
 * 会被抽取成 live 记忆写进 Ant 的真实库。
 */
const evalDirectory = mkdtempSync(join(tmpdir(), "nagi-eval-"));
process.env.NAGI_DOMAIN_DB = join(evalDirectory, "eval.sqlite");

let roleResults: readonly RoleCaseResult[] = [];
let roleStatus = "not_run_without_provider";
let closeStores: (() => void) | undefined;
try {
  const { createProviderFromEnvironment } = await import("../packages/server/src/provider-config.js");
  const serverDeps = await import("../packages/server/src/local-dependencies.js");
  const { createLocalDependencies, maxBeatsPerReply } = serverDeps;
  closeStores = serverDeps.closeLocalStores;
  const provider = createProviderFromEnvironment();
  const apiKey = process.env.NAGI_DEV_LLM_KEY?.trim();
  if (!provider || !apiKey) {
    roleStatus = "not_run_without_provider";
    console.error("⚠ 未配置 provider 或 key，角色 Eval 跳过（守卫 Eval 照常）");
  } else {
    roleStatus = "run";
    console.error(`角色 Eval：${roleCases.length} 条，走完整 graph（含记忆检索与守卫）…`);
    roleResults = await runRoleEval({
      cases: roleCases,
      dependencies: createLocalDependencies(provider, apiKey),
      guardConfig: policy.config,
      maxBeats: maxBeatsPerReply,
      provider,
      apiKey,
      onProgress: (done, total, id) => process.stderr.write(`\r  ${done}/${total} ${id.padEnd(24)}`),
    });
    process.stderr.write("\n");
  }
} finally {
  // 先关句柄再删目录：Windows 上 SQLite 文件被占用时 rmSync 会 EPERM。
  closeStores?.();
  try {
    rmSync(evalDirectory, { recursive: true, force: true });
  } catch (error) {
    // 删不掉只是留个临时文件，不该让整份报告作废。
    console.error(`临时库清理失败（不影响结果）：${error instanceof Error ? error.message : String(error)}`);
  }
}

// ── 汇总 ────────────────────────────────────────────────────────
const scored = roleResults.filter((item) => item.oocScore !== undefined);
const oocScores = scored.map((item) => item.oocScore!).sort((left, right) => left - right);
const belowMin = scored.filter((item) => item.oocMin !== undefined && item.oocScore! < item.oocMin);
const report = {
  generatedAt: new Date().toISOString(),
  roleEval: {
    caseCount: roleCases.length,
    status: roleStatus,
    ...(roleStatus === "run" ? {
      errors: roleResults.filter((item) => item.error).length,
      // **禁止句式命中是硬失败**——逐字判据，不是评分。
      forbidHits: roleResults.filter((item) => item.forbidHits.length > 0).length,
      overLength: roleResults.filter((item) => item.overLength).length,
      oocScored: scored.length,
      oocMedian: oocScores[Math.floor(oocScores.length / 2)] ?? null,
      oocBelowMin: belowMin.length,
      latencyMedianMs: (() => {
        const values = roleResults.map((item) => item.latencyMs).sort((left, right) => left - right);
        return values[Math.floor(values.length / 2)] ?? null;
      })(),
    } : {}),
  },
  guardEval: {
    forbiddenRuleCount: policy.config.forbiddenPatterns.length,
    mustBlock: { total: blockResults.length, passed: blockResults.filter((item) => item.passed).length },
    mustPass: { total: passResults.length, passed: passResults.filter((item) => item.passed).length },
  },
};
console.log(JSON.stringify(report, null, 2));

// 明细单独落盘：汇总数字回答「过没过」，明细回答「哪条、为什么」。
// Ant 不审中间产物（NRH-20260822-0110），但出问题时要能立刻翻。
if (roleStatus === "run") {
  const detailPath = process.env.NAGI_EVAL_DETAIL ?? resolve(root, "var/role-eval-detail.json");
  try {
    writeFileSync(detailPath, `${JSON.stringify(roleResults, null, 2)}\n`, "utf8");
    console.error(`明细 -> ${detailPath}`);
  } catch (error) {
    console.error(`明细写入失败（不影响汇总）：${error instanceof Error ? error.message : String(error)}`);
  }
}

// 退出码只由**硬判据**决定：守卫回归、调用错误、禁止句式命中。
// OOC 分数是**参考**不是闸门——V4 §13「soft_judge 不成为唯一人格裁判」，
// 判定权在 Ant。分数低会显示在汇总里，但不让 CI 变红。
const guardFailed = blockResults.some((item) => !item.passed) || passResults.some((item) => !item.passed);
const roleHardFailed = roleResults.some((item) => item.error || item.forbidHits.length > 0);
if (guardFailed || roleHardFailed) process.exitCode = 1;
