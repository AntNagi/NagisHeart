import type { RelationshipState, SceneId } from "../domain/state.js";
import type { MemorySearchResult } from "../memory/types.js";
import type { ActivationContext } from "./activation.js";

export type ContextBlockKind =
  | "personality"
  | "speech"
  | "style_anchor"
  | "canon"
  | "relationship"
  | "behavior"
  | "policy"
  | "memory"
  | "conversation"
  | "recap";

export interface ResourceBlock {
  readonly id: string;
  readonly kind: ContextBlockKind;
  readonly text: string;
  readonly priority: number;
  readonly tokenBudget: number;
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
}

export interface ContextBlock {
  readonly id: string;
  readonly kind: ContextBlockKind;
  readonly text: string;
  readonly tokenBudget: number;
  readonly priority: number;
}

export interface ContextBuildResult {
  readonly blocks: readonly ContextBlock[];
  readonly droppedBlockIds: readonly string[];
  readonly estimatedTokens: number;
  readonly rendered: string;
}
