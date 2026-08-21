import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { RelationshipState } from "@nagi/core";

/**
 * `config/runtime.yaml` 的读取器。
 *
 * 放在 server 而非 core：core 不许碰 fs（V4 §12 / 域 B 红线）。
 * 与 `resource-loader.ts` 同样是手写解析，不引 YAML 依赖——
 * 只取需要的几个标量，不做通用 YAML 支持。
 *
 * 背景：`runtime.yaml` 从建立起就**没有任何代码读过它**，
 * 里面 `relationship.seed` 的 85/70/25（`NRH-20260821-1708` 对 Q19 的裁决）
 * 因此从未生效，实测 `/api/state` 一直返回 0/0/0——
 * 正是该裁决明令要避免的「凪记得走完全程，却对你像陌生人」。见 OPEN_QUESTIONS F15。
 */
export interface RelationshipSeedConfig {
  /** 是否继承 CanonWorld 的终局关系。false 时新使用者从零起步。 */
  readonly seedFromCanon: boolean;
  readonly seed: RelationshipState;
  /**
   * 继承高亲密度的前提是 canon 记忆扎实（`NRH-20260821-1708` 原文：
   * 「bake-canon 未做扎实前，继承来的亲密度是空头支票」）。
   * 调用方据此决定是否真的套用 seed。
   */
  readonly requiresCanonMemory: boolean;
  /** 单轮关系变化上限，防一句话把关系拉满（V4 §13.1）。 */
  readonly maxDeltaPerTurn: number;
}

const ZERO: RelationshipState = { trust: 0, intimacy: 0, friction: 0 };

const DEFAULTS: RelationshipSeedConfig = {
  seedFromCanon: false,
  seed: ZERO,
  requiresCanonMemory: true,
  maxDeltaPerTurn: 3,
};

/** 取 `relationship:` 段内某个键的标量。剥行内注释；只在该段内查找，避免撞名。 */
function sectionScalar(lines: readonly string[], section: string, key: string): string | undefined {
  let inSection = false;
  for (const line of lines) {
    if (/^[a-zA-Z_]/u.test(line)) inSection = line.startsWith(`${section}:`);
    if (!inSection) continue;
    const match = new RegExp(`^\\s+${key}:\\s*(.+)$`, "u").exec(line);
    if (match) return match[1]!.replace(/\s+#.*$/u, "").trim();
  }
  return undefined;
}

function numberOr(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function loadRelationshipConfig(configRoot?: string): RelationshipSeedConfig {
  const path = resolve(configRoot ?? process.env.NAGI_CONFIG_ROOT ?? "config", "runtime.yaml");
  let lines: readonly string[];
  try {
    lines = readFileSync(path, "utf8").split(/\r?\n/u);
  } catch {
    // 配置缺失不该让服务起不来，但**必须留声**——静默用默认值等于裁决再次落空。
    console.warn(`[runtime-config] 读不到 ${path}，关系初值回落为 0/0/0`);
    return DEFAULTS;
  }
  const seedFromCanon = sectionScalar(lines, "relationship", "seedFromCanon") === "true";
  return {
    seedFromCanon,
    seed: {
      trust: numberOr(sectionScalar(lines, "relationship", "trust"), 0),
      intimacy: numberOr(sectionScalar(lines, "relationship", "intimacy"), 0),
      friction: numberOr(sectionScalar(lines, "relationship", "friction"), 0),
    },
    requiresCanonMemory: sectionScalar(lines, "relationship", "requiresCanonMemory") !== "false",
    maxDeltaPerTurn: numberOr(sectionScalar(lines, "relationship", "maxDeltaPerTurn"), 3),
  };
}

/**
 * 算出新使用者的关系初值。
 *
 * `requiresCanonMemory` 是 `NRH-20260821-1708` 写明的**前提条件**，不是装饰：
 * canon 还是骨架时套用 intimacy 70，会得到「说得亲密却什么都想不起来」——
 * 该裁决自己称之为「最像恋爱机器人的失真」。
 * 故此处在 canon 未就绪时**不套 seed**，并明确告警，而不是闷头套上。
 */
export function resolveSeedRelationship(
  config: RelationshipSeedConfig,
  canonReady: boolean,
): RelationshipState {
  if (!config.seedFromCanon) return ZERO;
  if (config.requiresCanonMemory && !canonReady) {
    console.warn(
      "[runtime-config] seedFromCanon 已开启，但 canon 记忆尚未就绪（仍是骨架），" +
      "本次不套用初值以免「说得亲密却想不起事」。见 NRH-20260821-1708 的前提条件。",
    );
    return ZERO;
  }
  return config.seed;
}
