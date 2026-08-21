import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { evaluateGuard } from "../packages/core/src/guard/engine.js";
import { loadGuardPolicy } from "../packages/server/src/resource-loader.js";

interface GuardCheck { readonly text: string; readonly expect?: string; }

function parseGuardChecks(text: string, sectionName: string): GuardCheck[] {
  const section = text.split(`${sectionName}:`)[1]?.split(/\n[a-z_]+:/u)[0] ?? "";
  return [...section.matchAll(/text:\s*"((?:\\.|[^"])*)"(?:\s*,\s*expect:\s*([\w.]+))?/gu)].map((match) => ({
    text: (match[1] ?? "").replaceAll('\\"', '"'),
    ...(match[2] ? { expect: match[2] } : {}),
  }));
}

function countRoleCases(text: string): number {
  return [...text.matchAll(/^\s+- id:\s+(?:ooc|fact)\.[^\r\n]+/gmu)].length;
}

const root = resolve(process.cwd());
const policy = loadGuardPolicy(resolve(root, "resources"));
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
const roleCases = readFileSync(resolve(root, "evals/cases/ooc_adversarial.yaml"), "utf8");
const report = {
  generatedAt: new Date().toISOString(),
  roleEval: { caseCount: countRoleCases(roleCases), requiresModel: true, status: "not_run_without_provider" },
  guardEval: {
    forbiddenRuleCount: policy.config.forbiddenPatterns.length,
    mustBlock: { total: blockResults.length, passed: blockResults.filter((item) => item.passed).length },
    mustPass: { total: passResults.length, passed: passResults.filter((item) => item.passed).length },
  },
};
console.log(JSON.stringify(report, null, 2));
if (blockResults.some((item) => !item.passed) || passResults.some((item) => !item.passed)) process.exitCode = 1;
