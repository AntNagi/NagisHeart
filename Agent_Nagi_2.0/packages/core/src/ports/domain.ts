import type { MemoryDraft } from "../memory/types.js";
import type { RelationshipState } from "../domain/state.js";

export interface DomainTurn {
  readonly requestId: string;
  readonly userId: string;
  readonly threadId: string;
  readonly userMessage: string;
  readonly assistantMessage: string;
  readonly createdAt: string;
}

export interface DomainStore {
  loadRelationship(userId: string): Promise<RelationshipState> | RelationshipState;
  commitTurn(input: {
    readonly userId: string;
    readonly relationshipDelta?: { readonly trust?: number; readonly intimacy?: number; readonly friction?: number };
    readonly drafts: readonly MemoryDraft[];
    readonly turn: DomainTurn;
  }): Promise<RelationshipState> | RelationshipState;
  listTurns(userId: string, limit?: number): Promise<readonly DomainTurn[]> | readonly DomainTurn[];
}
