import { describe, expect, it } from "vitest";
import { buildContext } from "../src/context/builder.js";
import { evaluateActivation } from "../src/context/activation.js";
import { evaluateGuard } from "../src/guard/engine.js";
import { rankMemories } from "../src/memory/engine.js";
import { parseResourceMarkdown } from "../src/resources/parser.js";

describe("activation", () => {
  it("evaluates the restricted relationship and canon expression", () => {
    const context = {
      canon: { ending: "true" },
      relationship: { trust: 85, intimacy: 70, friction: 25 },
      scene: "daily",
    };
    expect(evaluateActivation("canon.ending == 'true' && relationship.trust >= 70", context)).toBe(true);
    expect(evaluateActivation("relationship.trust < 70", context)).toBe(false);
  });
});

describe("resource parsing", () => {
  it("extracts front matter and body without filesystem access", () => {
    const parsed = parseResourceMarkdown(`---
id: core.test
kind: personality
version: 1
activation: relationship.trust >= 70
---
凪的正文`);
    expect(parsed.id).toBe("core.test");
    expect(parsed.kind).toBe("personality");
    expect(parsed.text).toContain("凪的正文");
    expect(parsed.when).toBeUndefined();
  });
});

describe("memory ranking and context budget", () => {
  it("keeps canon above unrelated live memories", () => {
    const ranked = rankMemories(
      [
        { id: "live", namespace: "canon", kind: "live", text: "今天下雨", salience: 0.2, confidence: 0.8, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", tags: [] },
        { id: "canon", namespace: "canon", kind: "canon", text: "TRUE END 已发生", salience: 0.8, confidence: 1, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", tags: [] },
      ],
      { namespace: "canon", text: "TRUE END", now: "2026-01-02T00:00:00.000Z", limit: 2 },
    );
    expect(ranked[0]?.record.id).toBe("canon");
  });

  it("includes shared canon namespace for every user and does not decay it by age", () => {
    const ranked = rankMemories([
      { id: "shared", namespace: "canon:nagisheart", kind: "canon", text: "曼城公寓", salience: 0.8, confidence: 1, createdAt: "2020-01-01T00:00:00.000Z", updatedAt: "2020-01-01T00:00:00.000Z", tags: [] },
    ], { namespace: "user-a", text: "曼城公寓", now: "2026-01-01T00:00:00.000Z", limit: 1 });
    expect(ranked).toHaveLength(1);
    expect(ranked[0]?.components?.recency).toBe(0.5);
  });

  it("skips embeddings from a different model or dimension", () => {
    const ranked = rankMemories([
      { id: "old-model", namespace: "u", kind: "live", text: "旧向量", salience: 1, confidence: 1, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", tags: [], embedding: [1, 0], embeddingModel: "old", embeddingDim: 2 },
      { id: "new-model", namespace: "u", kind: "live", text: "新向量", salience: 1, confidence: 1, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", tags: [], embedding: [1, 0, 0], embeddingModel: "new", embeddingDim: 3 },
    ], { namespace: "u", embedding: [1, 0, 0], embeddingModel: "new", limit: 2 });
    expect(ranked.map((item) => item.record.id)).toEqual(["new-model"]);
  });

  it("drops low-priority blocks when the budget is exceeded", () => {
    const result = buildContext({
      request: "今天怎么样？",
      scene: "daily",
      relationship: { trust: 50, intimacy: 50, friction: 0 },
      canon: { ending: "true" },
      resources: [
        { id: "high", kind: "personality", priority: 100, tokenBudget: 0, text: "高优先级" },
        { id: "low", kind: "style_anchor", priority: 1, tokenBudget: 0, text: "低优先级" },
      ],
      memories: [],
      recentTurns: [],
      maxTokens: 3,
    });
    expect(result.rendered).toContain("高优先级");
    expect(result.rendered).not.toContain("低优先级");
  });
});

describe("output guard", () => {
  it("blocks forbidden meta language and passes ordinary dialogue", () => {
    const config = {
      forbiddenPatterns: [{ id: "meta", severity: "block" as const, pattern: "作为AI" }],
      frequencyCaps: [], defaultLength: 50, hardMaxLength: 80, maxBeatsPerReply: 3,
    };
    expect(evaluateGuard("作为AI，我不能这样回答", config).decision).toBe("retry");
    expect(evaluateGuard("……今天还行。", config).decision).toBe("pass");
  });
});
