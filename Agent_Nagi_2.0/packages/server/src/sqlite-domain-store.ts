import Database from "better-sqlite3";
import type { DomainExport } from "./local-domain-store.js";
import type { DomainStore, DomainTurn, MemoryDraft, RelationshipState } from "@nagi/core";
import type { RelationshipDelta } from "@nagi/runtime-langgraph";

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export class SqliteDomainStore implements DomainStore {
  private readonly db: InstanceType<typeof Database>;

  /**
   * @param seed 新使用者的关系初值（`NRH-20260821-1708` / Q19）。
   *   必须与 `LocalDomainStore` 口径一致——两个实现给出不同初值会让
   *   「换存储后端」变成「换人格」。
   */
  public constructor(path: string, private readonly seed: RelationshipState = { trust: 0, intimacy: 0, friction: 0 }) {
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
      CREATE TABLE IF NOT EXISTS player_overlays (
        user_id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
    this.db.exec(`
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
      const { trust, intimacy, friction } = this.seed;
      this.db.prepare("INSERT INTO user_relationships (user_id, trust, intimacy, friction) VALUES (?, ?, ?, ?)")
        .run(userId, clamp(trust), clamp(intimacy), clamp(friction));
      return { trust: clamp(trust), intimacy: clamp(intimacy), friction: clamp(friction) };
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

  /**
   * 玩家层：使用者自己写的叠加设定。
   *
   * 单独一张表而不是塞进 user_relationships：它是使用者输入的自由文本，
   * 与关系数值的性质完全不同——一个是系统算出来的，一个是人写的。
   * 混在一起，将来导出/迁移时会分不清哪些该带走、哪些该重算。
   */
  public loadPlayerOverlay(userId: string): string {
    const row = this.db
      .prepare("SELECT text FROM player_overlays WHERE user_id = ?")
      .get(userId) as { text: string } | undefined;
    return row?.text ?? "";
  }

  public savePlayerOverlay(userId: string, text: string): void {
    const trimmed = text.trim();
    if (!trimmed) {
      // 清空即删除，不留空行——否则 loadPlayerOverlay 返回空串与"从未设置过"
      // 无法区分，导出时还会多带一条无意义的记录。
      this.db.prepare("DELETE FROM player_overlays WHERE user_id = ?").run(userId);
      return;
    }
    this.db
      .prepare("INSERT OR REPLACE INTO player_overlays (user_id, text, updated_at) VALUES (?, ?, ?)")
      .run(userId, trimmed, new Date().toISOString());
  }

  public liveMemoryCount(userId: string): number {
    const row = this.db.prepare("SELECT live_memory_count FROM user_relationships WHERE user_id = ?").get(userId) as { live_memory_count: number } | undefined;
    return row?.live_memory_count ?? 0;
  }

  public importUser(snapshot: unknown, expectedUserId: string): void {
    if (!snapshot || typeof snapshot !== "object") throw new Error("save must be an object");
    const value = snapshot as Record<string, unknown>;
    if (value.schemaVersion !== 1 || value.userId !== expectedUserId) throw new Error("save schema or user mismatch");
    const relation = value.relationship;
    if (!relation || typeof relation !== "object") throw new Error("save relationship is invalid");
    const r = relation as Record<string, unknown>;
    if ([r.trust, r.intimacy, r.friction].some((item) => typeof item !== "number" || !Number.isFinite(item))) throw new Error("save relationship values are invalid");
    if (typeof value.liveMemoryCount !== "number" || !Number.isInteger(value.liveMemoryCount) || value.liveMemoryCount < 0 || !Array.isArray(value.turns)) throw new Error("save payload is invalid");
    const importedTurns = value.turns as unknown[];
    const transaction = this.db.transaction(() => {
      this.db.prepare("INSERT INTO user_relationships (user_id, trust, intimacy, friction, stage, live_memory_count) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET trust=excluded.trust, intimacy=excluded.intimacy, friction=excluded.friction, stage=excluded.stage, live_memory_count=excluded.live_memory_count").run(expectedUserId, clamp(r.trust as number), clamp(r.intimacy as number), clamp(r.friction as number), typeof r.stage === "string" ? r.stage.slice(0, 100) : null, value.liveMemoryCount);
      this.db.prepare("DELETE FROM domain_turns WHERE user_id = ?").run(expectedUserId);
      for (const item of importedTurns) {
        if (!item || typeof item !== "object") throw new Error("save turn is invalid");
        const turn = item as Record<string, unknown>;
        if (["requestId", "userId", "threadId", "userMessage", "assistantMessage", "createdAt"].some((key) => typeof turn[key] !== "string") || turn.userId !== expectedUserId) throw new Error("save turn is invalid");
        this.db.prepare("INSERT INTO domain_turns (request_id, user_id, thread_id, user_message, assistant_message, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(turn.requestId, expectedUserId, turn.threadId, turn.userMessage, turn.assistantMessage, turn.createdAt);
      }
    });
    transaction();
  }

  public close(): void { this.db.close(); }
}
