import type { ContextBlockKind, ContextBuildInput, ContextBuildResult, ContextBlock, ResourceBlock } from "./types.js";
import { evaluateActivation } from "./activation.js";

const ORDER: readonly ContextBlockKind[] = [
  "personality",
  "speech",
  "style_anchor",
  "canon",
  "relationship",
  "behavior",
  "policy",
  "memory",
  "conversation",
  "recap",
];

function relationshipText(input: ContextBuildInput): ContextBlock {
  const { trust, intimacy, friction, stage } = input.relationship;
  const stageText = stage ? `关系阶段：${stage}。` : "关系阶段未命名。";
  return {
    id: "session.relationship",
    kind: "relationship",
    priority: 94,
    tokenBudget: 120,
    text: `${stageText}信任感：${trust >= 70 ? "稳定" : trust >= 40 ? "正在建立" : "脆弱"}；` +
      `亲密感：${intimacy >= 70 ? "熟悉" : intimacy >= 40 ? "有靠近" : "疏远"}；` +
      `关系摩擦：${friction >= 60 ? "明显" : friction >= 25 ? "存在" : "较低"}。` +
      "不要把这些数值直接说给使用者。",
  };
}

function memoryBlock(result: ContextBuildInput["memories"][number]): ContextBlock {
  return {
    id: `memory.${result.record.id}`,
    kind: "memory",
    priority: Math.round(result.score * 100),
    tokenBudget: Math.max(1, Math.ceil(result.record.text.length / 2)),
    text: `[${result.record.kind === "canon" ? "既成事实" : "近期记忆"}] ${result.record.text}`,
  };
}

function conversationBlock(turns: ContextBuildInput["recentTurns"]): ContextBlock {
  const text = turns.map((turn) => `${turn.role === "user" ? "使用者" : "凪"}：${turn.content}`).join("\n");
  return {
    id: "session.recent_conversation",
    kind: "conversation",
    priority: 80,
    tokenBudget: Math.max(1, Math.ceil(text.length / 2)),
    text,
  };
}

function toBlock(resource: ResourceBlock): ContextBlock {
  return {
    id: resource.id,
    kind: resource.kind,
    text: resource.text,
    priority: resource.priority,
    // A missing/zero budget must remain usable; parser defaults to zero for
    // resources that do not declare a per-block budget.
    tokenBudget: resource.tokenBudget > 0 ? resource.tokenBudget : Math.max(1, Math.ceil(resource.text.length / 2)),
  };
}

function compareBlocks(left: ContextBlock, right: ContextBlock): number {
  const kindDelta = ORDER.indexOf(left.kind) - ORDER.indexOf(right.kind);
  return kindDelta || right.priority - left.priority || left.id.localeCompare(right.id);
}

function render(blocks: readonly ContextBlock[]): string {
  return blocks.map((block) => `<${block.kind} id="${block.id}">\n${block.text}\n</${block.kind}>`).join("\n\n");
}

export function buildContext(input: ContextBuildInput): ContextBuildResult {
  const candidates: ContextBlock[] = input.resources
    .filter((resource) => resource.active !== false && (!resource.scenes || resource.scenes.includes(input.scene)))
    .filter((resource) => evaluateActivation(resource.when, input.activationContext ?? {}))
    .map(toBlock);
  candidates.push(relationshipText(input));
  candidates.push(...input.memories.map(memoryBlock));
  if (input.recentTurns.length > 0) candidates.push(conversationBlock(input.recentTurns));

  const kept: ContextBlock[] = [];
  const dropped: string[] = [];
  let estimatedTokens = 0;
  for (const block of candidates.sort(compareBlocks)) {
    if (estimatedTokens + block.tokenBudget <= input.maxTokens) {
      kept.push(block);
      estimatedTokens += block.tokenBudget;
    } else {
      dropped.push(block.id);
    }
  }
  return { blocks: kept, droppedBlockIds: dropped, estimatedTokens, rendered: render(kept) };
}
