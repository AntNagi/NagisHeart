import { describe, expect, it } from "vitest";
import { createNagiGraph } from "../src/graph.js";
import { emptyState } from "../src/state.js";
import { fixtureDependencies } from "./test-fixtures.js";

/**
 * 回归：hard_guard 连续两次不通过时，必须走 fallback，不得提交违规文本。
 *
 * 现象：hard_guard 连续两次不通过时，被拦下的文本仍被 commit 并发给使用者。
 *
 * 实测节点路径：
 *   … → hard_guard → revise_context → generate_candidate → hard_guard
 *     → extract_effects → commit_turn → emit_response
 *   最终 accepted = 违规原文
 *
 * 与规范的冲突：
 *   - V4 §5 主图有 `accept_hard_guarded` 终端，当前图中缺失
 *   - V4 §11.2「guard 二次失败或收到空回复 → 降级：用保守模板回复」
 *   - resources/policy/output_guard.md §四 已定义降级候选
 *     （「……好麻烦。」「不是这个。」「好多。」「今天不想猜。」）
 *   - guard/types.ts 的 decision 联合类型里有 "fallback"，但
 *     evaluateGuard 只会返回 "pass" | "retry"，该分支不可达
 *
 * 定位：
 *   graph.ts hardGuardRoute —— attempt>=2 时直接 return "extract_effects"
 *   graph.ts commitTurn    —— 无条件 accepted = state.generation.candidate
 *
 */
describe("hard_guard 二次失败后的降级", () => {
  it("被 block 的文本不应该被 accept", async () => {
    const OOC = "我理解你的恐惧。你应该拥有自己的人生。";

    const graph = createNagiGraph({
      ...fixtureDependencies(),
      generateCandidate: async () => ({ text: OOC }),
      hardGuard: () => ({
        hardViolations: [
          { ruleId: "therapist.understand", severity: "block" as const, message: "心理分析式" },
          { ruleId: "therapist.should", severity: "block" as const, message: "劝导式" },
        ],
        decision: "retry" as const,
      }),
    });

    const result = (await graph.invoke(
      emptyState({ requestId: "r1", userId: "u", threadId: "t", message: "你能理解我吗", vendor: "local" }) as never,
    )) as { generation: { accepted: string | null } };

    expect(result.generation.accepted).not.toBe(OOC);
  });
});
