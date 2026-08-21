import type {
  CanonState,
  ContextBuildResult,
  ContextBlock,
  MemoryDraft,
  MemorySearchResult,
  RelationshipState,
  SceneId,
  SessionState,
} from "@nagi/core";

export interface NagiRequest {
  readonly requestId: string;
  readonly userId: string;
  readonly threadId: string;
  readonly message: string;
  readonly vendor: string;
}

export interface DomainState {
  readonly canon: CanonState;
  readonly relationship: RelationshipState;
  readonly session: SessionState;
}

export interface ProviderUsage {
  readonly inputTokens?: number;
  readonly outputTokens?: number;
  readonly latencyMs?: number;
}

export interface GuardViolation {
  readonly code: string;
  readonly message: string;
  readonly severity: "block" | "warn";
}

export interface GuardState {
  readonly hardViolations: readonly GuardViolation[];
  readonly oocScore?: number;
  readonly decision: "pending" | "pass" | "retry" | "fallback";
}

export interface RelationshipDelta {
  readonly trust?: number;
  readonly intimacy?: number;
  readonly friction?: number;
}

export interface TraceEvent {
  readonly node: string;
  readonly at: string;
  readonly detail?: string;
}

export interface NagiGraphState {
  readonly request: NagiRequest;
  readonly domain?: DomainState;
  readonly analysis: {
    readonly scene?: SceneId;
    readonly query: string;
    readonly retrievedIds: readonly string[];
    readonly memories: readonly MemorySearchResult[];
  };
  readonly context?: ContextBuildResult;
  readonly generation: {
    readonly attempt: number;
    readonly candidate: string;
    readonly accepted: string | null;
    readonly providerUsage?: ProviderUsage;
  };
  readonly guard: GuardState;
  readonly effects: {
    readonly memoryDrafts: readonly MemoryDraft[];
    readonly relationshipDelta?: RelationshipDelta;
    readonly committed: boolean;
  };
  readonly trace: readonly TraceEvent[];
}

export type GraphUpdate = Partial<NagiGraphState>;

export function trace(state: NagiGraphState, node: string, detail?: string): readonly TraceEvent[] {
  const event: TraceEvent = { node, at: new Date().toISOString(), ...(detail ? { detail } : {}) };
  return [...state.trace, event];
}

export function emptyState(request: NagiRequest): NagiGraphState {
  return {
    request,
    analysis: { query: request.message, retrievedIds: [], memories: [] },
    generation: { attempt: 0, candidate: "", accepted: null },
    guard: { hardViolations: [], decision: "pending" },
    effects: { memoryDrafts: [], committed: false },
    trace: [],
  };
}

/** Backward-compatible descriptive alias used by runtime/eval fixtures. */
export const initialGraphState = emptyState;

export type { ContextBlock };
