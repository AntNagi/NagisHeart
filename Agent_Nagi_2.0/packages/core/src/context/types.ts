import type { RelationshipState, SceneId } from "../domain/state.js";
import type { MemorySearchResult } from "../memory/types.js";
import type { ActivationContext } from "./activation.js";

/**
 * 资源侧 kind 的权威是 `resources/MANIFEST.md`，其声明的分类为：
 *   personality | speech | behavior_rule | timeline | event | relationship | style_anchor | policy
 * 其余几项（canon / memory / conversation / recap）不是资源 kind，
 * 而是运行时合成块的 kind（检索记忆、近期对话、尾部锚）。
 *
 * ⚠ 曾经缺 `behavior_rule` / `timeline` / `event` 三项，而 parser 对无法识别的 kind
 * **静默回落成 `policy`**，导致 10 份资源（6 行为规则 + 2 时间线 + 2 世界事件）
 * 的 kind 被悄悄改写，装配顺序全部失真且无任何告警。见 OPEN_QUESTIONS F19。
 */
/**
 * kind 的**单一事实源**。凡需要 kind 白名单的地方（parser 校验、
 * runtime 的 GraphState zod schema）一律从这里取，**不得再抄一份字面量**。
 * 曾因 `graph.ts` 抄了一份而与本表脱节：core 认得的 kind 被 GraphState 判为非法，
 * 整个 /v1/chat/completions 返回 400。
 */
export const CONTEXT_BLOCK_KINDS = [
  "personality",
  "speech",
  "style_anchor",
  "timeline",
  "canon",
  "relationship",
  "behavior_rule",
  "behavior",
  "policy",
  /**
   * 玩家层。使用者自己叠加的设定（称呼、共同经历之类）。
   *
   * 位置是刻意的——在 `policy` **之后**、`memory` **之前**：
   *  - 在人格之后：底层人设是地基，玩家叠加是调味。放前面会让玩家一句话
   *    盖过整个 Bible
   *  - 在记忆之前：记忆是事实，不该被玩家设定挤掉预算
   *  - `recap` 仍在最后兜底：玩家写了出格的东西，末尾重申人格还能拉回来
   */
  "player_overlay",
  "event",
  "memory",
  "conversation",
  "recap",
] as const;

export type ContextBlockKind = (typeof CONTEXT_BLOCK_KINDS)[number];

export interface ResourceBlock {
  readonly id: string;
  readonly kind: ContextBlockKind;
  /**
   * front-matter 里原样声明的 kind。仅当它无法识别、`kind` 被回落成 `policy` 时才存在。
   * 存在即表示**资源与代码的分类口径不一致**，装配顺序已经失真——调用方应当报警而非忽略。
   */
  readonly unrecognizedKind?: string;
  readonly text: string;
  readonly priority: number;
  readonly tokenBudget: number;
  /**
   * `activation.position: tail` 的资源必须排在 Context 末尾，**无视 kind 顺序**。
   * 目前唯一使用者是 `core.personality.recap`——尾部锚靠近因效应对抗人格漂移（V4 §9.3）。
   * 此前该字段无任何代码消费，而 recap 声明的是 `kind: personality` + `priority: 99`，
   * 导致「尾部锚」实际被排到了整个 Context 的**最前面**。见 OPEN_QUESTIONS F20。
   */
  readonly position?: "tail";
  readonly active?: boolean;
  readonly scenes?: readonly SceneId[];
  readonly when?: string;
}

export interface ConversationTurn {
  readonly role: "user" | "assistant";
  readonly content: string;
}

export interface ContextBuildInput {
  readonly scene: SceneId;
  readonly relationship: RelationshipState;
  readonly resources: readonly ResourceBlock[];
  readonly memories: readonly MemorySearchResult[];
  readonly recentTurns: readonly ConversationTurn[];
  readonly maxTokens: number;
  readonly activationContext?: ActivationContext;
  /**
   * 玩家层：使用者自己写的叠加设定。空或未提供时**不产生任何块**。
   *
   * ⚠ 这段文本**来自使用者**，不是我们写的资源。装配时会加一层框，
   * 声明它是"使用者补充的事实"而非人格定义——见 `builder.ts` 的 `playerOverlayBlock`。
   */
  readonly playerOverlay?: string;
}

export interface ContextBlock {
  readonly id: string;
  readonly kind: ContextBlockKind;
  readonly text: string;
  readonly tokenBudget: number;
  readonly priority: number;
  /** 见 `ResourceBlock.position`：置尾，无视 kind 顺序。 */
  readonly position?: "tail";
}

export interface ContextBuildResult {
  readonly blocks: readonly ContextBlock[];
  readonly droppedBlockIds: readonly string[];
  readonly estimatedTokens: number;
  readonly rendered: string;
}
