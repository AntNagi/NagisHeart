import { describe, expect, it } from "vitest";
import { createLocalDependencies } from "../src/local-dependencies.js";

describe("baked canon memory", () => {
  it("loads shared TRUE END memories into the retrieval pool", async () => {
    const dependencies = createLocalDependencies();
    const results = await dependencies.retrieveContext({
      request: { requestId: "r", userId: "canon-test-user", threadId: "t", message: "作战室初遇", vendor: "local" },
      domain: { canon: { ending: "true", path: "dream", epoch: "post_ending" }, relationship: { trust: 0, intimacy: 0, friction: 0 }, session: { scene: "daily", now: new Date().toISOString(), turnId: "r", userId: "canon-test-user", conversationId: "t", relationship: { trust: 0, intimacy: 0, friction: 0 } } },
      scene: "daily",
      query: "作战室 初遇",
    });
    expect(results.some((result) => result.record.kind === "canon" && result.record.namespace === "canon:nagisheart")).toBe(true);
  });
});
