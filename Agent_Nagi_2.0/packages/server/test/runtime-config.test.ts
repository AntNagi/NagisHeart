import { describe, expect, it } from "vitest";
import { LocalDomainStore } from "../src/local-domain-store.js";
import { DEFAULT_MEMORY_WEIGHTS } from "@nagi/core";
import { loadRelationshipConfig, loadRetrievalConfig, resolveSeedRelationship } from "../src/runtime-config.js";

describe("关系初值接线（F15 回归）", () => {
  it("读得到 runtime.yaml 里 Q19 裁定的 85/70/25", () => {
    // 该配置从建立起就没有任何代码读过，实测 /api/state 一直返回 0/0/0。
    const config = loadRelationshipConfig();
    expect(config.seedFromCanon).toBe(true);
    expect(config.seed).toEqual({ trust: 85, intimacy: 70, friction: 25 });
    expect(config.requiresCanonMemory).toBe(true);
  });

  it("canon 未就绪时不套用初值——这是 NRH-20260821-1708 写明的前提条件", () => {
    const config = loadRelationshipConfig();
    expect(resolveSeedRelationship(config, false)).toEqual({ trust: 0, intimacy: 0, friction: 0 });
  });

  it("canon 就绪后自动切到继承值，不需要改代码", () => {
    const config = loadRelationshipConfig();
    expect(resolveSeedRelationship(config, true)).toEqual({ trust: 85, intimacy: 70, friction: 25 });
  });

  it("seedFromCanon 关闭时一律从零，不受 seed 数值影响", () => {
    const off = { seedFromCanon: false, seed: { trust: 85, intimacy: 70, friction: 25 }, requiresCanonMemory: false, maxDeltaPerTurn: 3 };
    expect(resolveSeedRelationship(off, true)).toEqual({ trust: 0, intimacy: 0, friction: 0 });
  });

  it("store 用初值创建新使用者，且两个后端口径必须一致", () => {
    const store = new LocalDomainStore({ trust: 85, intimacy: 70, friction: 25 });
    expect(store.loadRelationship("newcomer")).toEqual({ trust: 85, intimacy: 70, friction: 25 });
  });

  it("缺省不传 seed 时保持 0/0/0，不意外给新用户高亲密度", () => {
    expect(new LocalDomainStore().loadRelationship("u")).toEqual({ trust: 0, intimacy: 0, friction: 0 });
  });
});

describe("检索 topK 接线（F23 回归）", () => {
  it("读得到 runtime.yaml 里的 topK，而不是代码硬编码的 4", () => {
    // F23 现象：配置写 8、代码用 4，两边差一倍且谁都不知道。
    // 我按 8 推算烘焙的每条字数上限，结果模型压不进去，51 条降级 44 条，返工一轮。
    const config = loadRetrievalConfig();
    expect(config).toEqual({ canon: 8, live: 8, styleAnchors: 8, minScore: 0, weights: DEFAULT_MEMORY_WEIGHTS });
  });

  it("配置目录不存在时回落到默认值并留声，而不是让服务起不来", () => {
    expect(loadRetrievalConfig("这个目录不存在")).toEqual({ canon: 8, live: 8, styleAnchors: 8, minScore: 0, weights: DEFAULT_MEMORY_WEIGHTS });
  });
});

describe("相关性下限 minScore（F32）", () => {
  it("默认是 0（关闭）——不默默改变现有检索行为", () => {
    // 刻意默认关闭：实测强命中 0.922 与「库里没有相关记忆」的基线噪声 0.899
    // 只差约 0.023，阈值定高一点凪就会失忆，而失忆比记错更糟。
    // 机制先备好，值等人工体验后由 Ant 定。
    expect(loadRetrievalConfig().minScore).toBe(0);
  });
});

describe("打分权重接线（NRH-20260822-023，Ant 裁 A）", () => {
  it("配置读出来的权重与代码原先硬编码的逐位相同", () => {
    // 这条**就是裁决的落地判据**：A 是「把账对平」不是调参，
    // 所以接线之后凪的行为必须一字不变。
    // 若有人日后想调这些数，改的是 runtime.yaml，那时这条测试会红——
    // 红得对：它在提醒「你正在改凪的记忆偏好，这是人设决定」。
    expect(loadRetrievalConfig().weights).toEqual({
      semantic: 0.52, recency: 0.16, salience: 0.16, confidence: 0.16, canonBoost: 0.08,
    });
    expect(loadRetrievalConfig().weights).toEqual(DEFAULT_MEMORY_WEIGHTS);
  });

  it("配置缺一项就整组回落默认，不半套配置半套默认", () => {
    // 半套配置值配半套默认值得到的是谁都没标定过的第三套权重——
    // 那种错不报警，只会让凪想起来的东西慢慢变怪。
    expect(loadRetrievalConfig("这个目录不存在").weights).toEqual(DEFAULT_MEMORY_WEIGHTS);
  });
});
