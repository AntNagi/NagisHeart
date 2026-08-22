import Database from "better-sqlite3";
import { rankMemories, type MemoryQuery, type MemoryRecord, type MemorySearchResult, type MemoryStore } from "@nagi/core";

interface MemoryRow {
  readonly id: string;
  readonly namespace: string;
  readonly kind: string;
  readonly text: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly salience: number;
  readonly confidence: number;
  readonly tags: string;
  readonly embedding: string | null;
  readonly embedding_model: string | null;
  readonly embedding_dim: number | null;
  readonly source_path: string | null;
  readonly source_section: string | null;
  readonly source_sha256: string | null;
}

/**
 * `MemoryStore` 的 SQLite 实现。
 *
 * **为什么需要它**（F24）：此前只有 `InMemoryMemoryStore`——它的注释自己写着
 * 「for core tests and the first development loop」，底层是个 `Map`。
 * 实测：发一条消息 → `liveMemoryCount: 1` → 重启服务端 → 归 0，对话历史清空。
 * 即凪**记得住剧情（canon 从 JSON 加载）却记不住跟你聊过的任何事**，
 * 每次重启都从零认识你——而 Q19 裁定的 `intimacy 70` 恰恰假设关系是延续的。
 * 这是立项书「长期记忆」与 V4 §14.2 的要害缺口，不是优化项。
 *
 * ⚠ `sqlite-domain-store` 只存 `live_memory_count` 这个**计数**与对话轮次，
 * 不存记忆正文，所以它救不了这条。二者共用同一个库文件但表不同。
 *
 * **排序仍复用 core 的 `rankMemories`**，不在 SQL 里重写打分逻辑——
 * 打分规则（语义 / recency / salience / confidence / kindBoost 的权重）
 * 属于 core 的领域算法，散落到 SQL 会让两处口径漂移，且 core 的单测就管不到它。
 * 代价是要把候选集读进内存再排；按 V4 §11.2 首发 50 个用户身份的规模，可接受。
 * 规模上去后再考虑把粗筛下推到 SQL（例如按 namespace + kind 预过滤后取 top-N）。
 */
export class SqliteMemoryStore implements MemoryStore {
  private readonly db: InstanceType<typeof Database>;

  public constructor(path: string) {
    this.db = new Database(path);
    this.db.pragma("journal_mode = WAL");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        namespace TEXT NOT NULL,
        kind TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        salience REAL NOT NULL,
        confidence REAL NOT NULL,
        tags TEXT NOT NULL,
        embedding TEXT,
        embedding_model TEXT,
        embedding_dim INTEGER,
        source_path TEXT,
        source_section TEXT,
        source_sha256 TEXT
      );
      CREATE INDEX IF NOT EXISTS memories_namespace_kind ON memories(namespace, kind);
    `);
  }

  private toRecord(row: MemoryRow): MemoryRecord {
    const embedding = row.embedding ? (JSON.parse(row.embedding) as number[]) : undefined;
    return {
      id: row.id,
      namespace: row.namespace,
      kind: row.kind === "canon" ? "canon" : "live",
      text: row.text,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      salience: row.salience,
      confidence: row.confidence,
      tags: JSON.parse(row.tags) as string[],
      ...(embedding ? { embedding } : {}),
      ...(row.embedding_model ? { embeddingModel: row.embedding_model } : {}),
      ...(row.embedding_dim === null ? {} : { embeddingDim: row.embedding_dim }),
      ...(row.source_path && row.source_section && row.source_sha256
        ? { source: { path: row.source_path, section: row.source_section, sha256: row.source_sha256 } }
        : {}),
    };
  }

  public search(query: MemoryQuery): Promise<readonly MemorySearchResult[]> {
    // 粗筛只按 namespace 下推——canon 是跨用户共享的，必须一并取出，
    // 否则每个新用户都读不到剧情记忆（`rankMemories` 里对
    // `canon:nagisheart` 有专门的放行规则）。精排交给 core。
    const namespaces = [query.namespace, ...(query.namespaces ?? []), "canon:nagisheart"];
    const placeholders = namespaces.map(() => "?").join(",");
    const rows = this.db
      .prepare(`SELECT * FROM memories WHERE namespace IN (${placeholders})`)
      .all(...namespaces) as MemoryRow[];
    return Promise.resolve(rankMemories(rows.map((row) => this.toRecord(row)), query));
  }

  public append(records: readonly MemoryRecord[]): Promise<void> {
    // 用 REPLACE 而非 INSERT：canon 每次启动都会重新灌一遍（从 JSON 加载），
    // 靠 id 幂等覆盖，避免重复堆积。
    const statement = this.db.prepare(`
      INSERT OR REPLACE INTO memories
        (id, namespace, kind, text, created_at, updated_at, salience, confidence, tags,
         embedding, embedding_model, embedding_dim, source_path, source_section, source_sha256)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    // 用闭包捕获而非传参：better-sqlite3 的 transaction 类型签名不接受参数。
    const insertAll = this.db.transaction(() => {
      for (const record of records) {
        statement.run(
          record.id, record.namespace, record.kind, record.text,
          record.createdAt, record.updatedAt, record.salience, record.confidence,
          JSON.stringify(record.tags),
          record.embedding ? JSON.stringify([...record.embedding]) : null,
          record.embeddingModel ?? null,
          record.embeddingDim ?? null,
          record.source?.path ?? null,
          record.source?.section ?? null,
          record.source?.sha256 ?? null,
        );
      }
    });
    insertAll();
    return Promise.resolve();
  }

  /** 某个 namespace 下的 live 记忆条数。用于 `/api/state` 的真实计数。 */
  public liveCount(namespace: string): number {
    const row = this.db
      .prepare("SELECT COUNT(*) AS n FROM memories WHERE namespace = ? AND kind = 'live'")
      .get(namespace) as { n: number };
    return row.n;
  }

  /**
   * 取出**向量与当前模型不符**（含完全没有向量）的记忆，用于重建。
   *
   * V4 §8.2 要求「模型变化时后台重建全部向量」。不重建的后果是静默的：
   * `rankMemories` 会把异模型向量的记忆过滤掉、把无向量的记忆算成语义分 0，
   * 于是它们永远排在有向量的记忆后面——凪只是「想不起一批事」，日志里什么都没有。
   *
   * @param limit 单次取多少条。分批是为了不让启动被一次大重建卡住。
   */
  public listNeedingEmbedding(model: string, limit: number): readonly MemoryRecord[] {
    const rows = this.db
      .prepare(
        "SELECT * FROM memories WHERE embedding_model IS NULL OR embedding_model != ? " +
        "ORDER BY kind = 'canon' DESC, updated_at DESC LIMIT ?",
      )
      .all(model, limit) as MemoryRow[];
    return rows.map((row) => this.toRecord(row));
  }

  /** 还有多少条待重建。用于日志和收敛判断。 */
  public countNeedingEmbedding(model: string): number {
    const row = this.db
      .prepare("SELECT COUNT(*) AS n FROM memories WHERE embedding_model IS NULL OR embedding_model != ?")
      .get(model) as { n: number };
    return row.n;
  }

  public close(): void {
    this.db.close();
  }
}
