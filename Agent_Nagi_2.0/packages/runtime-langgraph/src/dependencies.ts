import type {
  ContextBuildResult,
  MemoryDraft,
  MemorySearchResult,
  SceneId,
} from "@nagi/core";
import type { DomainState, GuardState, NagiGraphState, ProviderUsage, RelationshipDelta } from "./state.js";

export interface RuntimeDependencies {
  validateRequest(request: NagiGraphState["request"]): Promise<void> | void;
  loadDomainState(request: NagiGraphState["request"]): Promise<DomainState>;
  classifyScene(input: { readonly message: string; readonly domain: DomainState }): Promise<SceneId> | SceneId;
  retrieveContext(input: {
    readonly request: NagiGraphState["request"];
    readonly domain: DomainState;
    readonly scene: SceneId;
    readonly query: string;
  }): Promise<readonly MemorySearchResult[]>;
  assembleContext(input: {
    readonly request: NagiGraphState["request"];
    readonly domain: DomainState;
    readonly scene: SceneId;
    readonly memories: readonly MemorySearchResult[];
  }): ContextBuildResult;
  generateCandidate(input: {
    readonly request: NagiGraphState["request"];
    readonly domain: DomainState;
    readonly context: ContextBuildResult;
    readonly attempt: number;
  }): Promise<{ readonly text: string; readonly usage?: ProviderUsage }>;
  hardGuard(text: string): GuardState;
  fallbackResponse(input: { readonly request: NagiGraphState["request"]; readonly guard: GuardState }): string;
  softJudge(input: { readonly text: string; readonly context: ContextBuildResult }): Promise<Pick<GuardState, "oocScore" | "decision">>;
  reviseContext(input: {
    readonly context: ContextBuildResult;
    readonly guard: GuardState;
  }): ContextBuildResult;
  extractEffects(input: {
    readonly request: NagiGraphState["request"];
    readonly domain: DomainState;
    readonly candidate: string;
  }): Promise<{ readonly memoryDrafts: readonly MemoryDraft[]; readonly relationshipDelta?: RelationshipDelta }>;
  commitTurn(input: {
    readonly request: NagiGraphState["request"];
    readonly domain: DomainState;
    readonly accepted: string;
    readonly memoryDrafts: readonly MemoryDraft[];
    readonly relationshipDelta?: RelationshipDelta;
  }): Promise<void>;
}
