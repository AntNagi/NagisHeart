import type { ContextBuildResult, SceneId } from "@nagi/core";
import type { RuntimeDependencies } from "../src/index.js";

const context: ContextBuildResult = { blocks: [], droppedBlockIds: [], estimatedTokens: 0, rendered: "" };

export function fixtureDependencies(): RuntimeDependencies {
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
    fallbackResponse: () => "……这个不想说。",
    softJudge: async () => ({ decision: "pass" }),
    reviseContext: () => context,
    extractEffects: async () => ({ memoryDrafts: [] }),
    commitTurn: async () => undefined,
  };
}
