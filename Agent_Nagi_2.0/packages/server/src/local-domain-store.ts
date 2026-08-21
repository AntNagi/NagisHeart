import type { DomainStore, DomainTurn, MemoryDraft, RelationshipState } from "@nagi/core";
import type { RelationshipDelta } from "@nagi/runtime-langgraph";

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

interface UserRecord {
  relationship: RelationshipState;
  liveMemoryCount: number;
  turns: DomainTurn[];
}

export class LocalDomainStore implements DomainStore {
  private readonly users = new Map<string, UserRecord>();

  public loadRelationship(userId: string): RelationshipState {
    const existing = this.users.get(userId);
    if (existing) return existing.relationship;
    const relationship: RelationshipState = { trust: 0, intimacy: 0, friction: 0 };
    this.users.set(userId, { relationship, liveMemoryCount: 0, turns: [] });
    return relationship;
  }

  public commit(
    userId: string,
    delta: RelationshipDelta | undefined,
    drafts: readonly MemoryDraft[],
  ): RelationshipState {
    const current = this.loadRelationship(userId);
    const next: RelationshipState = {
      trust: clamp(current.trust + (delta?.trust ?? 0)),
      intimacy: clamp(current.intimacy + (delta?.intimacy ?? 0)),
      friction: clamp(current.friction + (delta?.friction ?? 0)),
      ...(current.stage === undefined ? {} : { stage: current.stage }),
    };
    const record = this.users.get(userId);
    if (record) {
      record.relationship = next;
      record.liveMemoryCount += drafts.filter((draft) => draft.kind === "live").length;
    }
    return next;
  }

  public commitTurn(input: {
    readonly userId: string;
    readonly relationshipDelta?: RelationshipDelta;
    readonly drafts: readonly MemoryDraft[];
    readonly turn: DomainTurn;
  }): RelationshipState {
    const relationship = this.commit(input.userId, input.relationshipDelta, input.drafts);
    const record = this.users.get(input.userId);
    if (record) record.turns.push(input.turn);
    return relationship;
  }

  public listTurns(userId: string, limit = 50): readonly DomainTurn[] {
    const turns = this.users.get(userId)?.turns ?? [];
    return turns.slice(-Math.max(0, limit));
  }

  public liveMemoryCount(userId: string): number {
    return this.users.get(userId)?.liveMemoryCount ?? 0;
  }
}
