import { describe, expect, it } from "vitest";
import { LocalDomainStore } from "../src/local-domain-store.js";
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
    expect(config).toEqual({ canon: 8, live: 8, styleAnchors: 8, minScore: 0 });
  });

  it("配置目录不存在时回落到默认值并留声，而不是让服务起不来", () => {
    expect(loadRetrievalConfig("这个目录不存在")).toEqual({ canon: 8, live: 8, styleAnchors: 8, minScore: 0 });
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
