import { MemorySaver } from "@langchain/langgraph";
import { describe, expect, it } from "vitest";
import type { ContextBuildResult, SceneId } from "@nagi/core";
import { createNagiGraph, emptyState, type RuntimeDependencies } from "../src/index.js";

const context: ContextBuildResult = {
  blocks: [],
  droppedBlockIds: [],
  estimatedTokens: 0,
  rendered: "",
};

function fixtureDependencies(): RuntimeDependencies {
  const domain = {
    canon: { ending: "true" as const, path: "dream" as const, epoch: "post_ending" as const },
    relationship: { trust: 0, intimacy: 0, friction: 0 },
    session: { scene: "daily" as SceneId, now: new Date().toISOString(), turnId: "t", userId: "u", conversationId: "c", relationship: { trust: 0, intimacy: 0, friction: 0 } },
  };
  return {
    validateRequest: () => undefined,
    loadDomainState: () => domain,
    classifyScene: () => "daily",
    retrieveContext: async () => [],
    assembleContext: () => context,
    generateCandidate: async () => ({ text: "……好麻烦。" }),
    hardGuard: () => ({ hardViolations: [], decision: "pass" }),
    softJudge: async () => ({ decision: "pass" }),
    reviseContext: () => context,
    extractEffects: async () => ({ memoryDrafts: [] }),
    commitTurn: async () => undefined,
  };
}

describe("LangGraph checkpoint", () => {
  it("persists a thread and exposes state history", async () => {
    const saver = new MemorySaver();
    const graph = createNagiGraph(fixtureDependencies(), { checkpointer: saver });
    const config = { configurable: { thread_id: "user:u:conversation:c" } };
    const result = await graph.invoke(emptyState({ requestId: "r1", userId: "u", threadId: "c", message: "你好", vendor: "local" }), config);
    expect(result.generation.accepted).toBe("……好麻烦。");

    const history = [];
    for await (const snapshot of graph.getStateHistory(config)) history.push(snapshot);
    expect(history.length).toBeGreaterThan(1);
    expect(history.some((snapshot) => snapshot.values.generation?.accepted === "……好麻烦。")).toBe(true);
  });
});
