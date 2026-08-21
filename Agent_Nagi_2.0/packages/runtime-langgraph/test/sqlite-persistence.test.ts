import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createSqliteCheckpointer, createNagiGraph, emptyState } from "../src/index.js";
import { fixtureDependencies } from "./test-fixtures.js";

function sqliteAvailable(): boolean {
  try {
    createSqliteCheckpointer(":memory:");
    return true;
  } catch {
    return false;
  }
}

const hasSqliteBinding = sqliteAvailable();

describe("SQLite checkpoint persistence", () => {
  it.skipIf(!hasSqliteBinding)("restores thread history from a file-backed saver", async () => {
    const directory = mkdtempSync(join(tmpdir(), "nagi-checkpoint-"));
    const databasePath = join(directory, "runtime.sqlite");
    try {
      const saver = createSqliteCheckpointer(databasePath);
      const graph = createNagiGraph(fixtureDependencies(), { checkpointer: saver });
      const config = { configurable: { thread_id: "persisted-user:thread" } };
      await graph.invoke(emptyState({ requestId: "sqlite-1", userId: "persisted-user", threadId: "thread", message: "你好", vendor: "local" }), config);

      const restoredGraph = createNagiGraph(fixtureDependencies(), { checkpointer: saver });
      const state = await restoredGraph.getState(config);
      expect(state.values.generation.accepted).toBe("……好麻烦。");
      expect(state.config.configurable?.thread_id).toBe("persisted-user:thread");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
