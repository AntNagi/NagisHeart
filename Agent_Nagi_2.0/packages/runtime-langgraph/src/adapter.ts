import type { RuntimeDependencies } from "./dependencies.js";
import { createNagiGraph } from "./graph.js";
import type { NagiGraphState } from "./state.js";

/** Stable outer-Harness seam: DSH supplies resources/dependencies, LangGraph owns orchestration. */
export interface NagiRuntimeAdapter {
  invoke(input: NagiGraphState, dependencies: RuntimeDependencies): Promise<NagiGraphState>;
  stream(input: NagiGraphState, dependencies: RuntimeDependencies, threadId: string): AsyncGenerator<unknown>;
}

export const langGraphRuntimeAdapter: NagiRuntimeAdapter = {
  async invoke(input, dependencies) {
    return await createNagiGraph(dependencies).invoke(input as Parameters<ReturnType<typeof createNagiGraph>["invoke"]>[0]) as NagiGraphState;
  },
  async *stream(input, dependencies, threadId) {
    const stream = await createNagiGraph(dependencies).stream(input as Parameters<ReturnType<typeof createNagiGraph>["stream"]>[0], { configurable: { thread_id: threadId }, streamMode: "updates" });
    for await (const update of stream) yield update;
  },
};
