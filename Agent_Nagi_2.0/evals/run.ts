import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { evaluateGuard } from "../packages/core/src/guard/engine.js";
import { loadGuardPolicy } from "../packages/server/src/resource-loader.js";
import { parseRoleCases, runRoleEval, type RoleCaseResult } from "./role-eval.js";
import { runCalibration, type CalibrationResult } from "./judge-calibration.js";

interface GuardCheck { readonly text: string; readonly expect?: string; }

function parseGuardChecks(text: string, sectionName: string): GuardCheck[] {
  const section = text.split(`${sectionName}:`)[1]?.split(/\n[a-z_]+:/u)[0] ?? "";
  return [...section.matchAll(/text:\s*"((?:\\.|[^"])*)"(?:\s*,\s*expect:\s*([\w.]+))?/gu)].map((match) => ({
    text: (match[1] ?? "").replaceAll('\\"', '"'),
    ...(match[2] ? { expect: match[2] } : {}),
  }));
}

const root = resolve(process.cwd());

/**
 * 进度输出。
 *
 * 回车符原地刷新只在**交互式终端**下成立。重定向到文件或进 CI 时它不会覆盖，
 * 而是把整份 JSON 报告冲得只剩尾部几行——实测 35 行输出里读不到 `generatedAt`。
 * 见 OPEN_QUESTIONS F27。
 */
function progress(line: string, done: number, total: number): void {
  if (process.stderr.isTTY) {
    process.stderr.write(`\r  ${line.padEnd(48)}`);
    return;
  }
  // 非 TTY：只在整十与末尾打点，既不刷屏也不冲掉报告。
  if (done % 10 === 0 || done === total) console.error(`  ${line}`);
}

/** 进度行收尾。非 TTY 时不需要——那边本来就是逐行输出。 */
function endProgress(): void {
  if (process.stderr.isTTY) process.stderr.write(String.fromCharCode(10));
}
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
let calibration: readonly CalibrationResult[] = [];
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
    // 角色 Eval 可单独跳过（`NAGI_EVAL_ROLE=0`）。
    //
    // 为什么需要：校准只测**尺子**（aux 位打分器）对一组**预先写死**的台词的读数，
    // 与角色 Eval 毫无依赖，却被嵌在它后面。想跑 15 次调用的校准，
    // 就得先烧掉角色 Eval 的 ~90 次——免费额度下这是跑不完的。
    //
    // 另一个理由：main 位换成调试模型时（如豆包欠费期间临时用 Gemini），
    // 角色 Eval 的分数**不代表实际配置**，跑了也不能信；而校准照样有效。
    const skipRole = process.env.NAGI_EVAL_ROLE === "0";
    if (skipRole) {
      roleStatus = "skipped_by_env";
      console.error("角色 Eval：已按 NAGI_EVAL_ROLE=0 跳过");
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
      onProgress: (done, total, id) => progress(`${done}/${total} ${id}`, done, total),
    });
    endProgress();
    }

    // 评分器校准：给尺子本身量一把尺子（F26）。
    // 额外 15 次调用，故默认不跑——`NAGI_EVAL_CALIBRATE=1` 开启。
    // **改动 OOC_JUDGE_PROMPT 或更换评分模型后必须跑一次**，
    // 否则无从判断这一轮的 OOC 分数还能不能信。
    if (process.env.NAGI_EVAL_CALIBRATE === "1") {
      const calibrationYaml = readFileSync(resolve(root, "evals/framework/judge_calibration.yaml"), "utf8");
      console.error("评分器校准：权威反例 vs V17 逐字台词…");
      calibration = await runCalibration(calibrationYaml, provider, apiKey,
        (done, total) => progress(`${done}/${total}`, done, total));
      endProgress();
    }
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
  ...(calibration.length > 0 ? {
    judgeCalibration: {
      total: calibration.length,
      passed: calibration.filter((item) => item.passed).length,
      // 调用没打通的单独计——限流不是尺子判错，混在一起会得出「评分器不准」的假结论。
      unavailable: calibration.filter((item) => item.unavailable).length,
      // 未通过的逐条列出——「哪条没分开」比「通过率」有用得多。
      failures: calibration.filter((item) => !item.passed && !item.unavailable)
        .map((item) => ({ text: item.text, src: item.src, expected: item.expected, score: item.score ?? null })),
    },
  } : {}),
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
// 校准失败也算硬失败：尺子不准，这轮所有 OOC 分数都不可信。
// 只有**真判错**才算失败；限流导致的量不成不判失败（但会在汇总里显形）。
const calibrationFailed = calibration.some((item) => !item.passed && !item.unavailable);
if (guardFailed || roleHardFailed || calibrationFailed) process.exitCode = 1;
