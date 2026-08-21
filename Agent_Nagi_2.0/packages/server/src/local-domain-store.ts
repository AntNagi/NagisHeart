import type { DomainStore, DomainTurn, MemoryDraft, RelationshipState } from "@nagi/core";
import type { RelationshipDelta } from "@nagi/runtime-langgraph";

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

interface UserRecord {
  relationship: RelationshipState;
  liveMemoryCount: number;
  turns: DomainTurn[];
  committedRequestIds: Set<string>;
}

export interface DomainExport {
  readonly schemaVersion: 1;
  readonly userId: string;
  readonly relationship: RelationshipState;
  readonly liveMemoryCount: number;
  readonly turns: readonly DomainTurn[];
}

export class LocalDomainStore implements DomainStore {
  private readonly users = new Map<string, UserRecord>();

  /**
   * @param seed 新使用者的关系初值。来自 `config/runtime.yaml` 的 `relationship.seed`
   *   （`NRH-20260821-1708` 对 Q19 的裁决：继承 CanonWorld 终局关系，trust 85 / intimacy 70 / friction 25）。
   *   缺省 0/0/0 —— 该裁决明写从零会「自相矛盾：凪记得和你走完全程，却对你像陌生人」。
   */
  public constructor(private readonly seed: RelationshipState = { trust: 0, intimacy: 0, friction: 0 }) {}

  public loadRelationship(userId: string): RelationshipState {
    const existing = this.users.get(userId);
    if (existing) return existing.relationship;
    const relationship: RelationshipState = { ...this.seed };
    this.users.set(userId, { relationship, liveMemoryCount: 0, turns: [], committedRequestIds: new Set() });
    return relationship;
  }

  public commit(
    userId: string,
    delta: RelationshipDelta | undefined,
    drafts: readonly MemoryDraft[],
  ): RelationshipState {
    const current = this.loadRelationship(userId);
    const record = this.users.get(userId);
    const next: RelationshipState = {
      trust: clamp(current.trust + (delta?.trust ?? 0)),
      intimacy: clamp(current.intimacy + (delta?.intimacy ?? 0)),
      friction: clamp(current.friction + (delta?.friction ?? 0)),
      ...(current.stage === undefined ? {} : { stage: current.stage }),
    };
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
    this.loadRelationship(input.userId);
    const record = this.users.get(input.userId);
    if (record?.committedRequestIds.has(input.turn.requestId)) return record.relationship;
    const relationship = this.commit(input.userId, input.relationshipDelta, input.drafts);
    if (record) record.turns.push(input.turn);
    if (record) record.committedRequestIds.add(input.turn.requestId);
    return relationship;
  }

  public listTurns(userId: string, limit = 50): readonly DomainTurn[] {
    const turns = this.users.get(userId)?.turns ?? [];
    return turns.slice(-Math.max(0, limit));
  }

  public liveMemoryCount(userId: string): number {
    return this.users.get(userId)?.liveMemoryCount ?? 0;
  }

  public exportUser(userId: string): DomainExport {
    const record = this.users.get(userId) ?? { relationship: this.loadRelationship(userId), liveMemoryCount: 0, turns: [] };
    return {
      schemaVersion: 1,
      userId,
      relationship: record.relationship,
      liveMemoryCount: record.liveMemoryCount,
      turns: [...record.turns],
    };
  }

  public importUser(snapshot: unknown, expectedUserId: string): void {
    if (!snapshot || typeof snapshot !== "object") throw new Error("save must be an object");
    const value = snapshot as Record<string, unknown>;
    if (value.schemaVersion !== 1 || value.userId !== expectedUserId) throw new Error("save schema or user mismatch");
    const relationship = value.relationship;
    if (!relationship || typeof relationship !== "object") throw new Error("save relationship is invalid");
    const relation = relationship as Record<string, unknown>;
    const numbers = [relation.trust, relation.intimacy, relation.friction];
    if (numbers.some((item) => typeof item !== "number" || !Number.isFinite(item))) throw new Error("save relationship values are invalid");
    if (typeof value.liveMemoryCount !== "number" || !Number.isInteger(value.liveMemoryCount) || value.liveMemoryCount < 0) throw new Error("save memory count is invalid");
    if (!Array.isArray(value.turns) || value.turns.length > 10_000) throw new Error("save turns are invalid");
    const turns = value.turns.map((item) => {
      if (!item || typeof item !== "object") throw new Error("save turn is invalid");
      const turn = item as Record<string, unknown>;
      for (const key of ["requestId", "userId", "threadId", "userMessage", "assistantMessage", "createdAt"]) {
        if (typeof turn[key] !== "string" || turn[key].length > 20_000) throw new Error("save turn field is invalid");
      }
      if (turn.userId !== expectedUserId) throw new Error("save turn user mismatch");
      return turn as unknown as DomainTurn;
    });
    const next: UserRecord = {
      relationship: { trust: clamp(relation.trust as number), intimacy: clamp(relation.intimacy as number), friction: clamp(relation.friction as number), ...(typeof relation.stage === "string" ? { stage: relation.stage.slice(0, 100) } : {}) },
      liveMemoryCount: value.liveMemoryCount,
      turns,
      committedRequestIds: new Set(turns.map((turn) => turn.requestId)),
    };
    this.users.set(expectedUserId, next);
  }
}
