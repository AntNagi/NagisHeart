import type { GuardConfig, GuardResult, GuardViolation } from "./types.js";

function countMatches(text: string, pattern: RegExp): number {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  return [...text.matchAll(new RegExp(pattern.source, flags))].length;
}

function cjkLength(text: string): number {
  return [...text].filter((char) => /[\u3400-\u9fff]/u.test(char)).length;
}

function beatCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/[。！？!?\n]+/u).map((part) => part.trim()).filter(Boolean).length;
}

export function evaluateGuard(
  text: string,
  config: GuardConfig,
  recentAssistantReplies: readonly string[] = [],
): GuardResult {
  const violations: GuardViolation[] = [];
  for (const rule of config.forbiddenPatterns) {
    let pattern: RegExp;
    try {
      pattern = new RegExp(rule.pattern, "u");
    } catch {
      violations.push({ ruleId: `${rule.id}.invalid`, severity: "block", message: "invalid guard pattern" });
      continue;
    }
    if (pattern.test(text)) violations.push({ ruleId: rule.id, severity: rule.severity, message: rule.why ?? rule.id });
  }

  for (const rule of config.frequencyCaps) {
    let pattern: RegExp;
    try {
      pattern = new RegExp(rule.phrasePattern, "gu");
    } catch {
      violations.push({ ruleId: `${rule.id}.invalid`, severity: "block", message: "invalid frequency pattern" });
      continue;
    }
    const current = countMatches(text, pattern);
    const window = [...recentAssistantReplies.slice(-(Math.max(0, rule.windowTurns - 1))), text];
    const total = window.reduce((sum, reply) => sum + countMatches(reply, pattern), 0);
    if (current > rule.maxPerReply || total > rule.maxPerWindow) {
      violations.push({ ruleId: rule.id, severity: rule.severity, message: rule.why ?? rule.id });
    }
  }

  const length = cjkLength(text);
  if (length > config.hardMaxLength) {
    violations.push({ ruleId: "length.hard_max", severity: "block", message: `reply exceeds ${config.hardMaxLength} CJK characters` });
  } else if (length > config.defaultLength) {
    violations.push({ ruleId: "length.default", severity: "warn", message: `reply exceeds ${config.defaultLength} CJK characters` });
  }

  const beats = beatCount(text);
  if (beats > config.maxBeatsPerReply) {
    violations.push({ ruleId: "beats.max", severity: "warn", message: `reply contains ${beats} beats` });
  }

  const hasBlock = violations.some((violation) => violation.severity === "block");
  return {
    decision: hasBlock ? "retry" : "pass",
    violations,
    cjkLength: length,
    beatCount: beats,
  };
}
