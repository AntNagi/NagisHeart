import { describe, expect, it } from "vitest";
import { emptyState, streamNagiGraph } from "../src/index.js";
import { fixtureDependencies } from "./test-fixtures.js";

describe("LangGraph update stream", () => {
  it("emits node updates for a guarded run", async () => {
    const updates: unknown[] = [];
    for await (const update of streamNagiGraph(fixtureDependencies(), emptyState({ requestId: "r", userId: "u", threadId: "t", message: "你好", vendor: "local" }), { threadId: "u:t" })) {
      updates.push(update);
    }
    expect(updates.length).toBeGreaterThan(5);
  });
});
