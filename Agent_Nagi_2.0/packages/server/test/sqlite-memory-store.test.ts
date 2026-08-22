import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SqliteMemoryStore } from "../src/sqlite-memory-store.js";

function sqliteAvailable(): boolean {
  try {
    const directory = mkdtempSync(join(tmpdir(), "nagi-mem-check-"));
    new SqliteMemoryStore(join(directory, "m.sqlite")).close();
    rmSync(directory, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}
const hasSqlite = sqliteAvailable();

const record = (id: string, namespace: string, kind: "canon" | "live", text: string) => ({
  id, namespace, kind, text,
  createdAt: "2026-08-22T00:00:00.000Z", updatedAt: "2026-08-22T00:00:00.000Z",
  salience: 0.7, confidence: kind === "canon" ? 1 : 0.6, tags: ["t"],
});

describe("SqliteMemoryStore（F24 回归）", () => {
  it.skipIf(!hasSqlite)("记忆跨进程存活——这正是 F24 的核心", async () => {
    // F24 现象：发一条消息 liveMemoryCount:1，重启后归 0。
    // 用「关掉再开一个新实例」模拟重启，比只测同一实例有意义。
    const directory = mkdtempSync(join(tmpdir(), "nagi-mem-"));
    const path = join(directory, "m.sqlite");
    try {
      const first = new SqliteMemoryStore(path);
      await first.append([record("u1:1", "u1", "live", "使用者下周三要去大阪出差")]);
      expect(first.liveCount("u1")).toBe(1);
      first.close();

      const reopened = new SqliteMemoryStore(path);
      expect(reopened.liveCount("u1"), "重开后记忆必须还在").toBe(1);
      const found = await reopened.search({ namespace: "u1", text: "大阪出差", limit: 5 });
      expect(found.map((item) => item.record.text)).toContain("使用者下周三要去大阪出差");
      reopened.close();
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it.skipIf(!hasSqlite)("canon 跨用户共享，新用户也能读到剧情记忆", async () => {
    const directory = mkdtempSync(join(tmpdir(), "nagi-mem-"));
    try {
      const store = new SqliteMemoryStore(join(directory, "m.sqlite"));
      await store.append([record("c1", "canon:nagisheart", "canon", "凪在曼城的新公寓住下")]);
      // 一个从没写过记忆的新用户，必须也能检索到 canon。
      const found = await store.search({ namespace: "brand-new-user", text: "曼城公寓", limit: 5 });
      expect(found.map((item) => item.record.id)).toContain("c1");
      store.close();
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it.skipIf(!hasSqlite)("同 id 重复写入是幂等的——canon 每次启动都会重灌", async () => {
    const directory = mkdtempSync(join(tmpdir(), "nagi-mem-"));
    try {
      const store = new SqliteMemoryStore(join(directory, "m.sqlite"));
      await store.append([record("dup", "u1", "live", "第一版")]);
      await store.append([record("dup", "u1", "live", "第二版")]);
      expect(store.liveCount("u1"), "不该堆积成两条").toBe(1);
      const found = await store.search({ namespace: "u1", text: "第二版", limit: 5 });
      expect(found[0]?.record.text).toBe("第二版");
      store.close();
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
