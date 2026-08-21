export type GuardSeverity = "block" | "warn";

export interface ForbiddenPatternRule {
  readonly id: string;
  readonly severity: GuardSeverity;
  readonly pattern: string;
  readonly why?: string;
}

export interface FrequencyCapRule {
  readonly id: string;
  readonly phrasePattern: string;
  readonly maxPerReply: number;
  readonly maxPerWindow: number;
  readonly windowTurns: number;
  readonly severity: GuardSeverity;
  readonly why?: string;
}

export interface GuardConfig {
  readonly forbiddenPatterns: readonly ForbiddenPatternRule[];
  readonly frequencyCaps: readonly FrequencyCapRule[];
  readonly defaultLength: number;
  readonly hardMaxLength: number;
  readonly maxBeatsPerReply: number;
}

export interface GuardViolation {
  readonly ruleId: string;
  readonly severity: GuardSeverity;
  readonly message: string;
}

export interface GuardResult {
  readonly decision: "pass" | "retry" | "fallback";
  readonly violations: readonly GuardViolation[];
  readonly cjkLength: number;
  readonly beatCount: number;
}
