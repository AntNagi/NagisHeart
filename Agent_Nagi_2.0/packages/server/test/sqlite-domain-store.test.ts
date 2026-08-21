import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SqliteDomainStore } from "../src/sqlite-domain-store.js";

function sqliteAvailable(): boolean {
  try {
    const directory = mkdtempSync(join(tmpdir(), "nagi-domain-check-"));
    const store = new SqliteDomainStore(join(directory, "domain.sqlite"));
    store.close();
    rmSync(directory, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}

const hasSqliteBinding = sqliteAvailable();

describe("SQLite Domain Store", () => {
  it.skipIf(!hasSqliteBinding)("commits turns atomically and ignores duplicate requestId", () => {
    const directory = mkdtempSync(join(tmpdir(), "nagi-domain-"));
    const store = new SqliteDomainStore(join(directory, "domain.sqlite"));
    try {
      const turn = { requestId: "r1", userId: "u", threadId: "t", userMessage: "你好", assistantMessage: "……好麻烦。", createdAt: new Date().toISOString() };
      store.commitTurn({ userId: "u", drafts: [], relationshipDelta: { trust: 2 }, turn });
      store.commitTurn({ userId: "u", drafts: [], relationshipDelta: { trust: 2 }, turn });
      expect(store.loadRelationship("u").trust).toBe(4);
      expect(store.listTurns("u")).toHaveLength(1);
    } finally {
      store.close();
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
