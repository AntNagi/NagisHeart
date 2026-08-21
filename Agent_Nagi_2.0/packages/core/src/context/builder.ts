import type { ContextBlockKind, ContextBuildInput, ContextBuildResult, ContextBlock, ResourceBlock } from "./types.js";
import { evaluateActivation } from "./activation.js";

/**
 * 装配顺序，与 `config/runtime.yaml` 的 `context.blocks` 一一对应（V4 §9）。
 *
 * 顺序不只是美观问题，有两个硬约束：
 *  1. `recap` 必须在最后——它是尾部锚，靠近因效应对抗长上下文人格漂移（V4 §9.3）。
 *  2. 静态块（personality→policy）必须排在**变动块之前且顺序稳定**，
 *     否则厂商的前缀缓存永远命中不了。豆包缓存命中价是输入价的两折，
 *     满配下每轮差 30% 成本。见 OPEN_QUESTIONS「缓存命中与装配顺序绑定」。
 */
const ORDER: readonly ContextBlockKind[] = [
  "personality",     // personalityCore
  "speech",          // speechStyle
  "style_anchor",    // styleAnchors
  "timeline",        // canonTimeline
  "canon",
  "relationship",    // userRelationship
  "behavior_rule",   // behaviorAndScene（行为侧）
  "behavior",
  "policy",          // behaviorAndScene（场景策略侧）
  "event",
  "memory",          // canonMemory / liveMemory
  "conversation",    // conversationWindow
  "recap",           // personalityRecap —— 必须最后
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
    ...(resource.position ? { position: resource.position } : {}),
    text: resource.text,
    priority: resource.priority,
    // A missing/zero budget must remain usable; parser defaults to zero for
    // resources that do not declare a per-block budget.
    tokenBudget: resource.tokenBudget > 0 ? resource.tokenBudget : Math.max(1, Math.ceil(resource.text.length / 2)),
  };
}

function compareBlocks(left: ContextBlock, right: ContextBlock): number {
  // position: tail 压过 kind 顺序——尾部锚必须紧贴生成点才有近因效应。
  const tailDelta = (left.position === "tail" ? 1 : 0) - (right.position === "tail" ? 1 : 0);
  if (tailDelta !== 0) return tailDelta;
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

  // 取舍与排列是两件事，必须分开做：
  //   取舍 —— runtime.yaml：「总预算是硬约束。超出按 priority 升序丢弃」(V4 §9)
  //   排列 —— ORDER + position:tail
  // 合成一步会让「排最后」等于「最先被丢」，尾部锚就会在上下文变长时率先消失，
  // 而那正是它被设计出来要对抗的场景（V4 §9.3）。
  const kept: ContextBlock[] = [];
  const dropped: string[] = [];
  let estimatedTokens = 0;
  const bySelectionPriority = [...candidates].sort(
    (left, right) => right.priority - left.priority || left.id.localeCompare(right.id),
  );
  for (const block of bySelectionPriority) {
    if (estimatedTokens + block.tokenBudget <= input.maxTokens) {
      kept.push(block);
      estimatedTokens += block.tokenBudget;
    } else {
      dropped.push(block.id);
    }
  }
  const ordered = kept.sort(compareBlocks);
  return { blocks: ordered, droppedBlockIds: dropped, estimatedTokens, rendered: render(ordered) };
}
