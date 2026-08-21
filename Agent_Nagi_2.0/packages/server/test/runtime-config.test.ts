import { describe, expect, it } from "vitest";
import { LocalDomainStore } from "../src/local-domain-store.js";
import { loadRelationshipConfig, resolveSeedRelationship } from "../src/runtime-config.js";

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
