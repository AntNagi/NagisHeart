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

/**
 * 检索 topK（`retrieval.topK`）。
 *
 * **为什么要读它**：这些值此前写在配置里、代码却硬编码成 4，
 * 两边差了一倍且谁都不知道——F23 就是这么害我按错的值推算烘焙上限、
 * 51 条里降级 44 条返工一轮的。配置存在而代码不读，比没有配置更糟：
 * 它让人以为改配置有用。
 *
 * 默认值取配置里现有的 8，而不是代码原先的 4：
 * 契约里配置是权威，代码硬编码不是（见 CLAUDE.md 域 B 红线
 * 「人格规则、关系阈值不许写进 Graph 节点，一律由 resources/ 与 config/ 声明」）。
 * 这会让每轮取回的记忆数从 4+4 变成 8+8 —— 见 OPEN_QUESTIONS F23 的低把握登记。
 */
export interface RetrievalConfig {
  readonly canon: number;
  readonly live: number;
  readonly styleAnchors: number;
  /**
   * 相关性下限（F32）。0 表示关闭，永远塞满 topK 条。
   *
   * 默认关闭是**刻意的**：实测强命中(0.922)与「库里根本没有相关记忆」的
   * 基线噪声(0.899)只差约 0.023，阈值定高一点凪就会失忆——
   * 而失忆比记错更糟。合适的值是手感问题，等人工体验后再定（见 OPEN_QUESTIONS F32）。
   */
  readonly minScore: number;
}

const RETRIEVAL_DEFAULTS: RetrievalConfig = { canon: 8, live: 8, styleAnchors: 8, minScore: 0 };

export function loadRetrievalConfig(configRoot?: string): RetrievalConfig {
  const path = resolve(configRoot ?? process.env.NAGI_CONFIG_ROOT ?? "config", "runtime.yaml");
  let lines: readonly string[];
  try {
    lines = readFileSync(path, "utf8").split(/\r?\n/u);
  } catch {
    console.warn(`[runtime-config] 读不到 ${path}，检索 topK 回落为 ${RETRIEVAL_DEFAULTS.canon}`);
    return RETRIEVAL_DEFAULTS;
  }
  // 取值范围收在 1..32：0 会让检索静默返回空（凪什么都想不起来，且不报错），
  // 过大则挤爆 Context 预算。越界即回落并留声。
  const bounded = (key: keyof RetrievalConfig): number => {
    const value = numberOr(sectionScalar(lines, "retrieval", key), RETRIEVAL_DEFAULTS[key]);
    if (!Number.isInteger(value) || value < 1 || value > 32) {
      console.warn(`[runtime-config] retrieval.topK.${key}=${value} 越界（需 1..32 的整数），回落为 ${RETRIEVAL_DEFAULTS[key]}`);
      return RETRIEVAL_DEFAULTS[key];
    }
    return value;
  };
  // minScore 与 topK 的取值规则不同：它是 0..1 的小数、且 0 是合法值（表示关闭），
  // 不能套 bounded() 的「1..32 整数」规则。
  const rawMinScore = numberOr(sectionScalar(lines, "retrieval", "minScore"), 0);
  const minScore = Number.isFinite(rawMinScore) && rawMinScore >= 0 && rawMinScore < 1 ? rawMinScore : 0;
  if (minScore !== rawMinScore) {
    console.warn(`[runtime-config] retrieval.minScore=${rawMinScore} 越界（需 0 <= x < 1），回落为 0（关闭）`);
  }
  return { canon: bounded("canon"), live: bounded("live"), styleAnchors: bounded("styleAnchors"), minScore };
}
