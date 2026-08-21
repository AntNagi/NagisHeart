import { END, START, StateGraph, StateSchema } from "@langchain/langgraph";
import type { BaseCheckpointSaver } from "@langchain/langgraph";
import { z } from "zod";
import type { NagiGraphState } from "./state.js";
import { trace } from "./state.js";
import type { RuntimeDependencies } from "./dependencies.js";

const GraphState = new StateSchema({
  request: z.any(),
  domain: z.any().optional(),
  analysis: z.any(),
  context: z.any().optional(),
  generation: z.any(),
  guard: z.any(),
  effects: z.any(),
  trace: z.array(z.any()).default([]),
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
      trace: trace(state, "retrieve_context", `${memories.length} memories`),
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
    return { context, trace: trace(state, "assemble_context", `${context.estimatedTokens} tokens`) };
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
    return { effects: { ...state.effects, ...effects }, trace: trace(state, "extract_effects") };
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

  const hardGuardRoute = (state: GraphStateValue): "soft_judge" | "revise_context" | "extract_effects" => {
    if (state.guard.decision === "pass") return "soft_judge";
    if (state.generation.attempt < 2) return "revise_context";
    return "extract_effects";
  };

  const softJudgeRoute = (state: GraphStateValue): "extract_effects" | "revise_context" =>
    state.guard.decision === "retry" && state.generation.attempt < 2 ? "revise_context" : "extract_effects";

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
