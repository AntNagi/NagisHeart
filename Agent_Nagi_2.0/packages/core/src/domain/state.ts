export type SceneId =
  | "daily"
  | "affection"
  | "intimacy"
  | "conflict"
  | "football"
  | "setback";

export interface RelationshipState {
  readonly trust: number;
  readonly intimacy: number;
  readonly friction: number;
  readonly stage?: string;
}

export interface SessionState {
  readonly scene: SceneId;
  readonly now: string;
  readonly turnId: string;
  readonly userId: string;
  readonly conversationId: string;
  readonly relationship: RelationshipState;
}

export interface CanonState {
  readonly ending: "true" | "good" | "normal" | "bad";
  readonly path: "dream" | "stay" | "bad";
  readonly epoch: "post_ending";
}
