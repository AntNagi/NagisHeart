import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { loadResourceBlocks } from "../src/resource-loader.js";

describe("server resource loader", () => {
  it("loads derived resources while excluding _sources and disabled templates", () => {
    const resources = loadResourceBlocks(resolve(process.cwd(), "resources"));
    expect(resources.length).toBeGreaterThan(10);
    expect(resources.some((resource) => resource.id === "core.personality.base")).toBe(true);
    expect(resources.some((resource) => resource.id === "user_profile.template" && resource.active === false)).toBe(true);
    expect(resources.some((resource) => resource.text.includes("Character Bible v0.5 Full / Merged"))).toBe(false);
  });
});
