import { END, START, StateGraph, StateSchema } from "@langchain/langgraph";
import type { BaseCheckpointSaver } from "@langchain/langgraph";
import { z } from "zod";
// kind 白名单从 core 取，**不再抄字面量**——抄一份就会与 core 脱节，
// 表现为 core 认得的 kind 被 GraphState 判非法、整个 chat 端点返回 400。
import { CONTEXT_BLOCK_KINDS } from "@nagi/core";
import type { NagiGraphState } from "./state.js";
import { trace } from "./state.js";
import type { RuntimeDependencies } from "./dependencies.js";

const GraphState = new StateSchema({
  request: z.object({
    requestId: z.string().min(1), userId: z.string().min(1), threadId: z.string().min(1),
    message: z.string(), vendor: z.string(),
  }),
  domain: z.object({
    canon: z.object({ ending: z.enum(["true", "good", "normal", "bad"]), path: z.enum(["dream", "stay", "bad"]), epoch: z.literal("post_ending") }),
    relationship: z.object({ trust: z.number(), intimacy: z.number(), friction: z.number(), stage: z.string().optional() }),
    session: z.object({
      scene: z.enum(["daily", "affection", "intimacy", "conflict", "football", "setback"]),
      now: z.string(), turnId: z.string(), userId: z.string(), conversationId: z.string(),
      relationship: z.object({ trust: z.number(), intimacy: z.number(), friction: z.number(), stage: z.string().optional() }),
    }),
  }).optional(),
  analysis: z.object({
    scene: z.enum(["daily", "affection", "intimacy", "conflict", "football", "setback"]).optional(),
    query: z.string(), retrievedIds: z.array(z.string()),
    memories: z.array(z.object({
      record: z.object({
        id: z.string(), namespace: z.string(), kind: z.enum(["canon", "live"]), text: z.string(),
        createdAt: z.string(), updatedAt: z.string(), salience: z.number(), confidence: z.number(),
        tags: z.array(z.string()), embedding: z.array(z.number()).optional(),
      }),
      score: z.number(),
      components: z.object({ total: z.number(), semantic: z.number(), recency: z.number(), salience: z.number(), confidence: z.number(), kindBoost: z.number() }).optional(),
    })),
  }),
  context: z.object({
    blocks: z.array(z.object({ id: z.string(), kind: z.enum(CONTEXT_BLOCK_KINDS), text: z.string(), tokenBudget: z.number(), priority: z.number(), position: z.literal("tail").optional() })),
    droppedBlockIds: z.array(z.string()), estimatedTokens: z.number(), rendered: z.string(),
  }).optional(),
  generation: z.object({
    attempt: z.number(), candidate: z.string(), accepted: z.string().nullable(),
    providerUsage: z.object({ inputTokens: z.number().optional(), outputTokens: z.number().optional(), latencyMs: z.number().optional() }).optional(),
  }),
  guard: z.object({
    hardViolations: z.array(z.object({ code: z.string().optional(), ruleId: z.string().optional(), message: z.string(), severity: z.enum(["block", "warn"]) }).transform((violation) => ({ code: violation.code ?? violation.ruleId ?? "unknown", message: violation.message, severity: violation.severity }))),
    oocScore: z.number().optional(), decision: z.enum(["pending", "pass", "retry", "fallback"]),
  }),
  effects: z.object({
    memoryDrafts: z.array(z.object({ kind: z.enum(["canon", "live"]), text: z.string(), salience: z.number(), confidence: z.number(), tags: z.array(z.string()), sourceTurnId: z.string() })),
    relationshipDelta: z.object({ trust: z.number().optional(), intimacy: z.number().optional(), friction: z.number().optional() }).optional(),
    committed: z.boolean(),
  }),
  trace: z.array(z.object({ node: z.string(), at: z.string(), detail: z.string().optional() })).default([]),
});

type GraphStateValue = NagiGraphState;

export interface NagiGraphOptions {
  readonly checkpointer?: BaseCheckpointSaver;
}

function requireDomain(state: GraphStateValue) {
  if (!state.domain) throw new Error("domain state has not been loaded");
  return state.domain;
}

function requireContext(state: GraphStateValue) {
  if (!state.context) throw new Error("context has not been assembled");
  return state.context;
}

export function createNagiGraph(deps: RuntimeDependencies, options: NagiGraphOptions = {}) {
  const validateRequest = async (state: GraphStateValue) => {
    await deps.validateRequest(state.request);
    return { trace: trace(state, "validate_request") };
  };

  const loadDomainState = async (state: GraphStateValue) => {
    const domain = await deps.loadDomainState(state.request);
    return { domain, trace: trace(state, "load_domain_state") };
  };

  const classifyScene = async (state: GraphStateValue) => {
    const domain = requireDomain(state);
    const scene = await deps.classifyScene({ message: state.request.message, domain });
    return { analysis: { ...state.analysis, scene }, trace: trace(state, "classify_scene", scene) };
  };

  const retrieveContext = async (state: GraphStateValue) => {
    const domain = requireDomain(state);
    const scene = state.analysis.scene;
    if (!scene) throw new Error("scene has not been classified");
    const memories = await deps.retrieveContext({
      request: state.request,
      domain,
      scene,
      query: state.analysis.query,
    });
    return {
      analysis: { ...state.analysis, memories, retrievedIds: memories.map((item) => item.record.id) },
      // 只报条数无法判断检索是否真按内容命中（见 F17）。带上 id 与分数，
      // 便于对比不同查询是否取到同一批——那是语义分恒为 0 的特征。
      trace: trace(
        state,
        "retrieve_context",
        memories.length === 0
          ? "0 memories"
          : `${memories.length} memories: ${memories
              .map((item) => `${item.record.id}(${item.score.toFixed(3)})`)
              .join(" ")}`,
      ),
    };
  };

  const assembleContext = async (state: GraphStateValue) => {
    const domain = requireDomain(state);
    const scene = state.analysis.scene;
    if (!scene) throw new Error("scene has not been classified");
    const context = deps.assembleContext({
      request: state.request,
      domain,
      scene,
      memories: state.analysis.memories,
    });
    // V4 §13「Context 效率」要求可测预算 / 丢弃率 / 命中率。只报总 token 数
    // 会让装配变成黑盒——无法判断某个块究竟没进 Context，还是进了但没起作用。
    // 故这里展开分块明细（按 kind 计数）与被丢弃的块 id。
    const byKind = new Map<string, number>();
    for (const block of context.blocks) byKind.set(block.kind, (byKind.get(block.kind) ?? 0) + 1);
    const kinds = [...byKind].map(([kind, count]) => `${kind}:${count}`).join(" ");
    const dropped = context.droppedBlockIds.length > 0
      ? ` | dropped ${context.droppedBlockIds.length}: ${context.droppedBlockIds.join(",")}`
      : " | dropped 0";
    const detail = `${context.estimatedTokens} tokens | ${context.blocks.length} blocks (${kinds})${dropped}`;
    return { context, trace: trace(state, "assemble_context", detail) };
  };

  const generateCandidate = async (state: GraphStateValue) => {
    const context = requireContext(state);
    const domain = requireDomain(state);
    const result = await deps.generateCandidate({
      request: state.request,
      domain,
      context,
      attempt: state.generation.attempt + 1,
    });
    return {
      generation: {
        ...state.generation,
        attempt: state.generation.attempt + 1,
        candidate: result.text,
        accepted: null,
        ...(result.usage ? { providerUsage: result.usage } : {}),
      },
      trace: trace(state, "generate_candidate"),
    };
  };

  const hardGuard = async (state: GraphStateValue) => {
    const guard = deps.hardGuard(state.generation.candidate);
    return { guard, trace: trace(state, "hard_guard", guard.decision) };
  };

  const softJudge = async (state: GraphStateValue) => {
    const result = await deps.softJudge({ text: state.generation.candidate, context: requireContext(state) });
    return { guard: { ...state.guard, ...result }, trace: trace(state, "soft_judge", result.decision) };
  };

  const reviseContext = async (state: GraphStateValue) => {
    const context = deps.reviseContext({ context: requireContext(state), guard: state.guard });
    return { context, trace: trace(state, "revise_context") };
  };

  const extractEffects = async (state: GraphStateValue) => {
    const domain = requireDomain(state);
    const effects = await deps.extractEffects({ request: state.request, domain, candidate: state.generation.candidate });
    // 只报节点名无法区分「没抽到」与「抽了但没落库」——F16 排查时就卡在这里。
    const deltaKeys = effects.relationshipDelta ? Object.keys(effects.relationshipDelta).join(",") : "none";
    const detail = `${effects.memoryDrafts.length} drafts | delta ${deltaKeys}`;
    return { effects: { ...state.effects, ...effects }, trace: trace(state, "extract_effects", detail) };
  };

  const commitTurn = async (state: GraphStateValue) => {
    const domain = requireDomain(state);
    const accepted = state.guard.decision === "retry"
      ? deps.fallbackResponse({ request: state.request, guard: state.guard })
      : state.generation.candidate;
    const commitInput = {
      request: state.request,
      domain,
      accepted,
      memoryDrafts: state.effects.memoryDrafts,
      ...(state.effects.relationshipDelta ? { relationshipDelta: state.effects.relationshipDelta } : {}),
    };
    await deps.commitTurn(commitInput);
    return {
      generation: { ...state.generation, accepted },
      effects: { ...state.effects, committed: true },
      trace: trace(state, "commit_turn"),
    };
  };

  const emitResponse = async (state: GraphStateValue) => ({ trace: trace(state, "emit_response") });

  const hardGuardRoute = (input: unknown): "soft_judge" | "revise_context" | "extract_effects" => {
    const state = input as GraphStateValue;
    if (state.guard.decision === "pass") return "soft_judge";
    if (state.generation.attempt < 2) return "revise_context";
    return "extract_effects";
  };

  const softJudgeRoute = (input: unknown): "extract_effects" | "revise_context" => {
    const state = input as GraphStateValue;
    return state.guard.decision === "retry" && state.generation.attempt < 2 ? "revise_context" : "extract_effects";
  };

  return new StateGraph(GraphState)
    .addNode("validate_request", validateRequest)
    .addNode("load_domain_state", loadDomainState)
    .addNode("classify_scene", classifyScene)
    .addNode("retrieve_context", retrieveContext)
    .addNode("assemble_context", assembleContext)
    .addNode("generate_candidate", generateCandidate)
    .addNode("hard_guard", hardGuard)
    .addNode("soft_judge", softJudge)
    .addNode("revise_context", reviseContext)
    .addNode("extract_effects", extractEffects)
    .addNode("commit_turn", commitTurn)
    .addNode("emit_response", emitResponse)
    .addEdge(START, "validate_request")
    .addEdge("validate_request", "load_domain_state")
    .addEdge("load_domain_state", "classify_scene")
    .addEdge("classify_scene", "retrieve_context")
    .addEdge("retrieve_context", "assemble_context")
    .addEdge("assemble_context", "generate_candidate")
    .addEdge("generate_candidate", "hard_guard")
    .addConditionalEdges("hard_guard", hardGuardRoute)
    .addConditionalEdges("soft_judge", softJudgeRoute)
    .addEdge("revise_context", "generate_candidate")
    .addEdge("extract_effects", "commit_turn")
    .addEdge("commit_turn", "emit_response")
    .addEdge("emit_response", END)
    .compile(options.checkpointer ? { checkpointer: options.checkpointer } : undefined);
}

export { GraphState };
