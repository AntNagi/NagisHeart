import Database from "better-sqlite3";
import type { DomainExport } from "./local-domain-store.js";
import type { DomainStore, DomainTurn, MemoryDraft, RelationshipState } from "@nagi/core";
import type { RelationshipDelta } from "@nagi/runtime-langgraph";

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export class SqliteDomainStore implements DomainStore {
  private readonly db: InstanceType<typeof Database>;

  public constructor(path: string) {
    this.db = new Database(path);
    this.db.pragma("journal_mode = WAL");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_relationships (
        user_id TEXT PRIMARY KEY,
        trust INTEGER NOT NULL,
        intimacy INTEGER NOT NULL,
        friction INTEGER NOT NULL,
        stage TEXT,
        live_memory_count INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS domain_turns (
        request_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        thread_id TEXT NOT NULL,
        user_message TEXT NOT NULL,
        assistant_message TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS domain_turns_user_created ON domain_turns(user_id, created_at);
    `);
  }

  public loadRelationship(userId: string): RelationshipState {
    const row = this.db.prepare("SELECT trust, intimacy, friction, stage FROM user_relationships WHERE user_id = ?").get(userId) as { trust: number; intimacy: number; friction: number; stage?: string } | undefined;
    if (!row) {
      this.db.prepare("INSERT INTO user_relationships (user_id, trust, intimacy, friction) VALUES (?, 0, 0, 0)").run(userId);
      return { trust: 0, intimacy: 0, friction: 0 };
    }
    return { trust: row.trust, intimacy: row.intimacy, friction: row.friction, ...(row.stage === null || row.stage === undefined ? {} : { stage: row.stage }) };
  }

  public commitTurn(input: { readonly userId: string; readonly relationshipDelta?: RelationshipDelta; readonly drafts: readonly MemoryDraft[]; readonly turn: DomainTurn }): RelationshipState {
    const transaction = this.db.transaction(() => {
      const current = this.loadRelationship(input.userId);
      const existing = this.db.prepare("SELECT request_id FROM domain_turns WHERE request_id = ?").get(input.turn.requestId) as { request_id: string } | undefined;
      if (existing) return current;
      const next = {
        trust: clamp(current.trust + (input.relationshipDelta?.trust ?? 0)),
        intimacy: clamp(current.intimacy + (input.relationshipDelta?.intimacy ?? 0)),
        friction: clamp(current.friction + (input.relationshipDelta?.friction ?? 0)),
      };
      const liveCount = input.drafts.filter((draft) => draft.kind === "live").length;
      this.db.prepare("UPDATE user_relationships SET trust = ?, intimacy = ?, friction = ?, live_memory_count = live_memory_count + ? WHERE user_id = ?").run(next.trust, next.intimacy, next.friction, liveCount, input.userId);
      this.db.prepare("INSERT OR IGNORE INTO domain_turns (request_id, user_id, thread_id, user_message, assistant_message, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(input.turn.requestId, input.turn.userId, input.turn.threadId, input.turn.userMessage, input.turn.assistantMessage, input.turn.createdAt);
      return next;
    });
    return transaction() as RelationshipState;
  }

  public listTurns(userId: string, limit = 50): readonly DomainTurn[] {
    const rows = this.db.prepare("SELECT request_id, user_id, thread_id, user_message, assistant_message, created_at FROM domain_turns WHERE user_id = ? ORDER BY created_at DESC LIMIT ?").all(userId, Math.max(0, Math.min(100, Math.floor(limit)))) as Array<{ request_id: string; user_id: string; thread_id: string; user_message: string; assistant_message: string; created_at: string }>;
    return rows.reverse().map((row) => ({ requestId: row.request_id, userId: row.user_id, threadId: row.thread_id, userMessage: row.user_message, assistantMessage: row.assistant_message, createdAt: row.created_at }));
  }

  public exportUser(userId: string): DomainExport {
    const relationship = this.loadRelationship(userId);
    const row = this.db.prepare("SELECT live_memory_count FROM user_relationships WHERE user_id = ?").get(userId) as { live_memory_count: number };
    return { schemaVersion: 1, userId, relationship, liveMemoryCount: row.live_memory_count, turns: this.listTurns(userId, 100) };
  }

  public close(): void { this.db.close(); }
}
