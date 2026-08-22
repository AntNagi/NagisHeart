import { describe, expect, it } from "vitest";
import { rankMemories, type MemoryRecord } from "@nagi/core";
import { rebuildVectors, type VectorRebuildIndex } from "../src/vector-rebuild.js";

const BASE = {
  namespace: "u", createdAt: "2026-08-22T00:00:00Z", updatedAt: "2026-08-22T00:00:00Z",
  salience: 0.5, confidence: 0.6, tags: [] as string[],
};

/** 最小可用的库：append 走 upsert（与 SqliteMemoryStore 的 INSERT OR REPLACE 同语义）。 */
function fakeIndex(initial: readonly MemoryRecord[]): {
  records: MemoryRecord[];
  store: { search: () => Promise<never[]>; append: (records: readonly MemoryRecord[]) => Promise<void> };
  index: VectorRebuildIndex;
} {
  const records = [...initial];
  const needsWork = (record: MemoryRecord, model: string): boolean =>
    record.embeddingModel === undefined || record.embeddingModel !== model;
  return {
    records,
    store: {
      search: () => Promise.resolve([]),
      append: (incoming) => {
        for (const record of incoming) {
          const at = records.findIndex((existing) => existing.id === record.id);
          if (at >= 0) records[at] = record;
          else records.push(record);
        }
        return Promise.resolve();
      },
    },
    index: {
      countNeedingEmbedding: (model) => records.filter((record) => needsWork(record, model)).length,
      listNeedingEmbedding: (model, limit) => records.filter((record) => needsWork(record, model)).slice(0, limit),
    },
  };
}

const unit = (index: number): Float32Array => {
  const vector = new Float32Array(4);
  vector[index % 4] = 1;
  return vector;
};

describe("向量重建", () => {
  it("补齐无向量的记忆，并分批直到收敛", async () => {
    const seed: MemoryRecord[] = Array.from({ length: 5 }, (_, index) => ({
      ...BASE, id: `m${index}`, kind: "canon" as const, text: `记忆 ${index}`,
    }));
    const { records, store, index } = fakeIndex(seed);
    let batches = 0;
    const result = await rebuildVectors({
      store, index, model: "m1", batchSize: 2,
      embed: (texts) => { batches += 1; return Promise.resolve(texts.map((_, position) => unit(position))); },
    });

    expect(result).toEqual({ total: 5, done: 5, interrupted: false });
    // 5 条 / 每批 2 条 = 3 批。批次数要断言：少了这条，
    // 「一次全取」和「分批」在结果上看不出区别，而前者会撞厂商单请求上限。
    expect(batches).toBe(3);
    expect(records.every((record) => record.embeddingModel === "m1" && record.embeddingDim === 4)).toBe(true);
  });

  it("换模型后重建，旧向量被替换而不是并存", async () => {
    const { records, store, index } = fakeIndex([{
      ...BASE, id: "old", kind: "live", text: "旧记忆",
      embedding: [1, 0, 0, 0], embeddingModel: "旧模型", embeddingDim: 4,
    }]);
    await rebuildVectors({
      store, index, model: "新模型",
      embed: (texts) => Promise.resolve(texts.map(() => unit(1))),
    });
    expect(records[0]?.embeddingModel).toBe("新模型");
    expect(records[0]?.embedding).toEqual([0, 1, 0, 0]);
  });

  it("某批失败即停，不把额度耗在反复重试同一批上", async () => {
    const seed: MemoryRecord[] = Array.from({ length: 6 }, (_, index) => ({
      ...BASE, id: `m${index}`, kind: "canon" as const, text: `记忆 ${index}`,
    }));
    const { store, index } = fakeIndex(seed);
    let calls = 0;
    const result = await rebuildVectors({
      store, index, model: "m1", batchSize: 2,
      embed: (texts) => {
        calls += 1;
        // 第二批失败。第一批已落库，所以「断点续跑」是真的有断点。
        return Promise.resolve(calls === 2 ? undefined : texts.map((_, position) => unit(position)));
      },
    });
    expect(result.interrupted).toBe(true);
    expect(result.done).toBe(2);
    // 关键：失败后**不再调用**。少了这条，无限重试的实现也能过前两个断言。
    expect(calls).toBe(2);
  });

  it("补齐向量后，真相关的记忆重新排到无关记忆之前", async () => {
    // 这条把重建和它要解决的问题连起来：不补齐时，
    // 「无关但有向量」压过「真相关但无向量」（见 core.test.ts 的实测）。
    const query = [1, 0, 0, 0];
    const relevant: MemoryRecord = { ...BASE, id: "relevant", kind: "canon", text: "凪怕麻烦，不愿意动" };
    const irrelevant: MemoryRecord = {
      ...BASE, id: "irrelevant", kind: "live", text: "世界杯决赛的比分",
      embedding: [0.5, Math.sqrt(0.75), 0, 0], embeddingModel: "m1", embeddingDim: 4,
    };
    const { records, store, index } = fakeIndex([relevant, irrelevant]);

    const before = rankMemories(records, { namespace: "u", text: "他是不是很懒", embedding: query, embeddingModel: "m1", limit: 5 });
    expect(before[0]?.record.id).toBe("irrelevant");

    await rebuildVectors({
      store, index, model: "m1",
      // 假装 embedding 认得这是同一个意思：给 relevant 一个与查询同向的向量。
      embed: (texts) => Promise.resolve(texts.map(() => unit(0))),
    });

    const after = rankMemories(records, { namespace: "u", text: "他是不是很懒", embedding: query, embeddingModel: "m1", limit: 5 });
    expect(after[0]?.record.id).toBe("relevant");
  });
});
