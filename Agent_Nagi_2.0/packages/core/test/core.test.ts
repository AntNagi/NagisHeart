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

describe("资源 kind 与装配顺序（F19–F21 回归）", () => {
  const frontMatter = (extra: string) => `---\nid: t.block\n${extra}\n---\n正文`;

  it("MANIFEST 声明的 kind 全部可识别，不再静默回落成 policy", () => {
    // resources/MANIFEST.md 是资源侧分类的权威。任一项落回 policy 都会让装配顺序失真。
    for (const kind of ["personality", "speech", "behavior_rule", "timeline", "event", "relationship", "style_anchor", "policy"]) {
      const parsed = parseResourceMarkdown(frontMatter(`kind: ${kind}`));
      expect(parsed.kind, `kind=${kind} 应被原样识别`).toBe(kind);
      expect(parsed.unrecognizedKind, `kind=${kind} 不应被标记为无法识别`).toBeUndefined();
    }
  });

  it("无法识别的 kind 回落 policy，但必须留痕而非静默", () => {
    const parsed = parseResourceMarkdown(frontMatter("kind: 不存在的种类"));
    expect(parsed.kind).toBe("policy");
    expect(parsed.unrecognizedKind).toBe("不存在的种类");
  });

  it("front-matter 的行内注释必须剥掉", () => {
    // `position: tail   # 说明` 曾整行被当成值，导致尾部锚静默失效。
    const parsed = parseResourceMarkdown(frontMatter("kind: personality\nactivation:\n  position: tail   # 尾部锚说明"));
    expect(parsed.position).toBe("tail");
  });

  it("position: tail 必须排到最后，且不因预算被优先丢弃", () => {
    const tail = parseResourceMarkdown(frontMatter("kind: personality\nactivation:\n  priority: 99\n  token_budget: 10\n  position: tail"));
    const head = parseResourceMarkdown("---\nid: t.head\nkind: personality\nactivation:\n  priority: 100\n  token_budget: 10\n---\n正文");
    const built = buildContext({
      scene: "daily",
      relationship: { trust: 0, intimacy: 0, friction: 0 },
      resources: [tail, head], memories: [], recentTurns: [], maxTokens: 20_000,
    });
    expect(built.blocks.at(-1)?.id).toBe("t.block");
    expect(built.droppedBlockIds).toHaveLength(0);
  });

  it("预算不足时按 priority 升序丢弃，尾部锚不因排在末尾而先被丢", () => {
    // 取舍看 priority，排列看 ORDER/position——两者混为一步会让尾部锚在长上下文中率先消失。
    const tail = parseResourceMarkdown(frontMatter("kind: personality\nactivation:\n  priority: 99\n  token_budget: 10\n  position: tail"));
    const cheap = parseResourceMarkdown("---\nid: t.low\nkind: personality\nactivation:\n  priority: 1\n  token_budget: 10\n---\n正文");
    const built = buildContext({
      scene: "daily",
      relationship: { trust: 0, intimacy: 0, friction: 0 },
      resources: [cheap, tail], memories: [], recentTurns: [], maxTokens: 10,
    });
    // 只断言相对关系：高 priority 的尾部锚存活，低 priority 的被丢。
    // 不写死丢弃列表——buildContext 还会注入合成的 session.relationship 块。
    expect(built.blocks.map((block) => block.id)).toEqual(["t.block"]);
    expect(built.droppedBlockIds).toContain("t.low");
  });
});

describe("中文词面检索（F17 回归）", () => {
  const memory = (id: string, text: string) => ({
    id, namespace: "u1", kind: "canon" as const, text,
    createdAt: "2026-08-01T00:00:00.000Z", updatedAt: "2026-08-01T00:00:00.000Z",
    salience: 0.5, confidence: 1, tags: [],
  });
  const query = (text: string) => ({ namespace: "u1", text, limit: 3, now: "2026-08-22T00:00:00.000Z" });

  it("中文查询必须能按内容区分记忆，而不是全部同分", () => {
    // 旧实现按空白切词，中文整句变成一个 term，词面分恒为 0
    // ⇒ 所有记忆同分，检索退化成「只看 recency/salience」，与查询内容无关。
    const records = [
      memory("m1", "凪在曼城的新房间住下了"),
      memory("m2", "世界杯追加名单公布"),
      memory("m3", "在作战室第一次见面"),
    ];
    const top = rankMemories(records, query("你还记得曼城那间房间吗"));
    expect(top[0]?.record.id, "问曼城应召回曼城那条").toBe("m1");
    const scores = new Set(top.map((item) => item.score));
    expect(scores.size, "三条不应同分").toBeGreaterThan(1);
  });

  it("拉丁文与数字仍按词匹配", () => {
    const records = [memory("m1", "U-20 日本代表战"), memory("m2", "完全无关的一条")];
    const top = rankMemories(records, query("U-20 那场比赛"));
    expect(top[0]?.record.id).toBe("m1");
  });

  it("查询与记忆毫无交集时词面分为 0", () => {
    const records = [memory("m1", "凪在曼城的新房间住下了")];
    const top = rankMemories(records, query("abcdef"));
    expect(top[0]?.components?.semantic).toBe(0);
  });
});
