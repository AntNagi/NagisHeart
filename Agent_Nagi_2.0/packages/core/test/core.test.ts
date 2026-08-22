import { describe, expect, it } from "vitest";
import { buildContext } from "../src/context/builder.js";
import { evaluateActivation } from "../src/context/activation.js";
import { evaluateGuard } from "../src/guard/engine.js";
import { rankMemories, findStaleEmbeddings } from "../src/memory/engine.js";
import { normalizeOutput } from "../src/output/beats.js";
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

describe("输出归一：把各家模型的排版差异吸收掉", () => {
  it("Gemini 的空行分段切成独立 beat，不留空条目", () => {
    // 实测原文（gemini-flash-lite-latest，2026-08-22）。
    // 直接渲染会得到一坨带空行的文字，Ant 的原话是「这不像对话」。
    const result = normalizeOutput("……\n\n乌冬面。\n\n你做。\n汤咸一点。");
    // 领头的「……」并进下一句：它单独成行就是个空洞，读起来像卡顿不像停顿。
    expect(result.say).toEqual(["……乌冬面。", "你做。", "汤咸一点。"]);
    expect(result.act).toEqual([]);
  });

  it("豆包的括号动作被摘进 act，不混在台词里", () => {
    // 实测原文（doubao-seed-character-260628）。
    const result = normalizeOutput("（没抬眼，指尖还在划手机）什么。");
    expect(result.say).toEqual(["什么。"]);
    expect(result.act).toEqual(["没抬眼，指尖还在划手机"]);
  });

  it("整行无换行时按句末标点切", () => {
    const result = normalizeOutput("不是这个。那个不像我。");
    expect(result.say).toEqual(["不是这个。", "那个不像我。"]);
  });

  it("句末标点保留，省略号算一个收尾", () => {
    const result = normalizeOutput("……好麻烦。");
    expect(result.say).toEqual(["……好麻烦。"]);
  });

  it("超过 beat 上限时截断而非合并", () => {
    // V17 语料 84.6% 是单句回，连发多句本身就是「解释太多」的信号（§8.1）。
    // 合并只会得到一句更长的话，与规则意图相反。
    const result = normalizeOutput("一。\n二。\n三。\n四。", 3);
    expect(result.say).toEqual(["一。", "二。", "三。"]);
  });

  it("只有动作没有台词时 say 为空——不得据此判定失败", () => {
    // 实测「手给我」→「（没动）」。此时 say 为空是**正确输出**，
    // 不是错误；聊天模式下应显示为无回复或由上层决定，不该踩降级模板。
    const result = normalizeOutput("（没动）");
    expect(result.say).toEqual([]);
    expect(result.act).toEqual(["没动"]);
  });
});

describe("说话人标签必须剥掉（气泡已标明说话人）", () => {
  it("剥掉 凪： 前缀", () => {
    // 实测原文：「凪：……那就不动。\n这样行行。」
    // 成因是 style_anchors 用剧本对照格式（`你：…` / `凪：…`），模型连标签一起学了。
    const result = normalizeOutput("凪：……那就不动。\n这样行行。");
    expect(result.say).toEqual(["……那就不动。", "这样行行。"]);
  });

  it("每句都带标签时逐句剥", () => {
    const result = normalizeOutput("凪：随便。\n凪：你决定。");
    expect(result.say).toEqual(["随便。", "你决定。"]);
  });

  it("英文名与全名一并剥，半角冒号也认", () => {
    expect(normalizeOutput("Nagi: 麻烦。").say).toEqual(["麻烦。"]);
    expect(normalizeOutput("凪诚士郎：好麻烦。").say).toEqual(["好麻烦。"]);
  });

  it("正文里出现「凪」但不是标签时不误剥", () => {
    const result = normalizeOutput("凪不想动。");
    expect(result.say).toEqual(["凪不想动。"]);
  });
});

describe("孤立的省略号并进相邻 beat", () => {
  it("首尾的孤立省略号不单独成行", () => {
    // 实测界面：「……」独占一行、中间一句、又一个「……」独占一行，
    // 读起来像卡顿不像停顿。
    const result = normalizeOutput("……\n靠过来一点。\n……");
    expect(result.say).toEqual(["……靠过来一点。……"]);
  });

  it("省略号往后并——它通常是下一句的起头", () => {
    // output_guard 的降级模板第一句就是「……好麻烦。」，这个形态必须保住。
    const result = normalizeOutput("……\n好麻烦。");
    expect(result.say).toEqual(["……好麻烦。"]);
  });

  it("整条只有省略号时原样保留，不返回空", () => {
    expect(normalizeOutput("……").say).toEqual(["……"]);
  });

  it("有实质内容的 beat 不受影响", () => {
    const result = normalizeOutput("随便。\n你决定。");
    expect(result.say).toEqual(["随便。", "你决定。"]);
  });
});

describe("embedding 版本化：禁止混合向量空间（V4 §8.2）", () => {
  const rec = (id: string, model?: string, dim?: number) => ({
    id, namespace: "u", kind: "live" as const, text: "曼城公寓的事",
    createdAt: "2026-08-01T00:00:00.000Z", updatedAt: "2026-08-01T00:00:00.000Z",
    salience: 0.7, confidence: 0.6, tags: [],
    ...(model ? {
      embedding: Array.from({ length: dim ?? 4 }, () => 0.5),
      embeddingModel: model, embeddingDim: dim ?? 4,
    } : {}),
  });
  const records = [rec("old", "embed-v1", 4), rec("new", "embed-v2", 8), rec("none")];

  it("换模型后旧向量被挡下——这是对的，但它是静默的", () => {
    // V4 §8.2「禁止混合向量空间检索」。过滤本身正确，
    // 但被过滤掉的记忆不会有任何提示，凪会突然想不起一批事。
    const got = rankMemories(records, {
      namespace: "u", text: "曼城公寓", limit: 9,
      embedding: Array.from({ length: 8 }, () => 0.5), embeddingModel: "embed-v2",
    });
    expect(got.map((item) => item.record.id)).not.toContain("old");
    expect(got.map((item) => item.record.id)).toContain("new");
  });

  it("纯词面查询不受影响——无向量参与就谈不上混合空间", () => {
    const got = rankMemories(records, { namespace: "u", text: "曼城公寓", limit: 9 });
    expect(got).toHaveLength(3);
  });

  it("findStaleEmbeddings 能报出与预期不符的向量，让静默退化显形", () => {
    const stale = findStaleEmbeddings(records, "embed-v2");
    expect(stale.get("embed-v1")).toBe(1);
    expect(stale.has("embed-v2"), "预期模型自身不算 stale").toBe(false);
    expect([...findStaleEmbeddings(records, "embed-v1").keys()]).toEqual(["embed-v2"]);
  });

  it("库里全是同一模型时判为干净", () => {
    expect(findStaleEmbeddings([rec("a", "embed-v2", 8), rec("b", "embed-v2", 8)], "embed-v2").size).toBe(0);
  });
});

describe("混合向量空间：部分记忆有向量、部分没有", () => {
  const base = {
    namespace: "u", createdAt: "2026-08-22T00:00:00Z", updatedAt: "2026-08-22T00:00:00Z",
    salience: 0.5, confidence: 0.6, tags: [] as string[],
  };

  it("改写型查询下，无关但有向量的记忆会压过真相关但无向量的", () => {
    // 这不是"应该"的行为，而是**必须被看见**的行为。
    // scoreMemory 取 semantic = max(余弦, 词面)，余弦经 (x+1)/2 归一后，
    // 毫不相关的中文句子也有 ~0.75 的地板；而无向量的记忆在中文改写查询下
    // 词面分常常正好是 0（零个共同 bigram）。
    //
    // 后果：canon 从 JSON 加载天生无向量、live 写入时带向量，
    // 于是「凪记得你昨天说的话，却忘了自己的剧情」。
    // 修法是把向量补齐（见 server 的 rebuildVectors），不是改打分公式——
    // 这条测试用来保证补齐之前这个坑不会被悄悄忘掉。
    const relevantNoVector = { ...base, id: "relevant", kind: "canon" as const, text: "凪怕麻烦，不愿意动" };
    const irrelevantWithVector = {
      ...base, id: "irrelevant", kind: "live" as const, text: "世界杯决赛的比分",
      embedding: [0.5, Math.sqrt(0.75), 0, 0], embeddingModel: "m1", embeddingDim: 4,
    };
    const ranked = rankMemories([relevantNoVector, irrelevantWithVector], {
      namespace: "u", text: "他是不是很懒", embedding: [1, 0, 0, 0], embeddingModel: "m1", limit: 5,
    });
    expect(ranked[0]?.record.id).toBe("irrelevant");
    expect(ranked[1]?.components.semantic).toBe(0);
  });

  it("但词面全中的无向量记忆仍然赢——不是「有向量恒赢」", () => {
    // 反向用例。少了它，上一条容易被读成"有向量就赢"，
    // 进而引出"那就别用向量了"这种错误结论。
    const exactNoVector = { ...base, id: "exact", kind: "live" as const, text: "凪在家睡觉" };
    const irrelevantWithVector = {
      ...base, id: "irrelevant", kind: "live" as const, text: "完全无关的一句话",
      embedding: [0.5, Math.sqrt(0.75), 0, 0], embeddingModel: "m1", embeddingDim: 4,
    };
    const ranked = rankMemories([exactNoVector, irrelevantWithVector], {
      namespace: "u", text: "凪在家睡觉", embedding: [1, 0, 0, 0], embeddingModel: "m1", limit: 5,
    });
    expect(ranked[0]?.record.id).toBe("exact");
    expect(ranked[0]?.components.semantic).toBe(1);
  });
});
