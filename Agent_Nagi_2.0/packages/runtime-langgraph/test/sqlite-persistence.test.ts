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
    // 在 try 之外声明：断言失败时 finally 也要拿得到它去关连接。
    let saverToClose: ReturnType<typeof createSqliteCheckpointer> | undefined;
    try {
      const saver = createSqliteCheckpointer(databasePath);
      saverToClose = saver;
      const graph = createNagiGraph(fixtureDependencies(), { checkpointer: saver });
      const config = { configurable: { thread_id: "persisted-user:thread" } };
      await graph.invoke(emptyState({ requestId: "sqlite-1", userId: "persisted-user", threadId: "thread", message: "你好", vendor: "local" }), config);

      const restoredGraph = createNagiGraph(fixtureDependencies(), { checkpointer: saver });
      const state = await restoredGraph.getState(config);
      expect(state.values.generation.accepted).toBe("……好麻烦。");
      expect(state.config.configurable?.thread_id).toBe("persisted-user:thread");
    } finally {
      // **Windows 上必须先关连接再删目录**，否则 rmSync 报 EPERM。
      // 这条测试长期失败就是因为少了这一步：断言其实全过，挂在 finally 的清理上。
      // SqliteSaver 没有公开的 close()，但它持有 better-sqlite3 的 db 实例。
      (saverToClose as unknown as { db?: { close(): void } } | undefined)?.db?.close();
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
