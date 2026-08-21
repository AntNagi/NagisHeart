import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { loadGuardPolicy, loadResourceBlocks } from "../src/resource-loader.js";

describe("server resource loader", () => {
  it("loads derived resources while excluding _sources and disabled templates", () => {
    const resources = loadResourceBlocks(resolve(process.cwd(), "resources"));
    expect(resources.length).toBeGreaterThan(10);
    expect(resources.some((resource) => resource.id === "core.personality.base")).toBe(true);
    expect(resources.some((resource) => resource.id === "user_profile.template" && resource.active === false)).toBe(true);
    expect(resources.some((resource) => resource.text.includes("Character Bible v0.5 Full / Merged"))).toBe(false);
  });

  it("loads hard-guard rules and fallback candidates from the policy resource", () => {
    const policy = loadGuardPolicy(resolve(process.cwd(), "resources"));
    expect(policy.config.forbiddenPatterns).toHaveLength(10);
    expect(policy.config.frequencyCaps).toHaveLength(1);
    expect(policy.config.defaultLength).toBe(50);
    expect(policy.config.hardMaxLength).toBe(80);
    expect(policy.fallbacks).toContain("不是这个。");
  });
});
