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

describe("向量重建的取数（真 SQL，不是假实现）", () => {
  it.skipIf(!hasSqlite)("按「无向量 / 异模型向量」筛选，canon 优先", async () => {
    const directory = mkdtempSync(join(tmpdir(), "nagi-mem-vec-"));
    const store = new SqliteMemoryStore(join(directory, "m.sqlite"));
    try {
      await store.append([
        { ...record("no-vec-live", "u", "live", "无向量的 live") },
        { ...record("no-vec-canon", "u", "canon", "无向量的 canon") },
        { ...record("old-model", "u", "live", "旧模型向量"), embedding: [1, 0], embeddingModel: "旧模型", embeddingDim: 2 },
        { ...record("current", "u", "live", "当前模型向量"), embedding: [0, 1], embeddingModel: "当前模型", embeddingDim: 2 },
      ]);

      // 只有 current 是达标的，其余三条都要重建。
      expect(store.countNeedingEmbedding("当前模型")).toBe(3);

      const batch = store.listNeedingEmbedding("当前模型", 10);
      expect(batch.map((item) => item.id).sort()).toEqual(["no-vec-canon", "no-vec-live", "old-model"]);
      // canon 排最前：剧情记忆缺向量的伤害比 live 大——
      // live 天天在写，canon 一旦落后就是「凪忘了自己的剧情」。
      expect(batch[0]?.id).toBe("no-vec-canon");

      // limit 必须真的生效，否则分批是假的、一次会把全库塞进一个请求。
      expect(store.listNeedingEmbedding("当前模型", 2)).toHaveLength(2);

      // 补齐后计数归零——upsert 语义（INSERT OR REPLACE）成立才有这个结果。
      await store.append(batch.map((item) => ({
        ...item, embedding: [0, 1], embeddingModel: "当前模型", embeddingDim: 2,
      })));
      expect(store.countNeedingEmbedding("当前模型")).toBe(0);
    } finally {
      store.close();
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
