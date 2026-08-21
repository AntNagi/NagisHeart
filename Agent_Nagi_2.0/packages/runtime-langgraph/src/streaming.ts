import type { NagiGraphState } from "./state.js";
import { createNagiGraph } from "./graph.js";
import type { RuntimeDependencies } from "./dependencies.js";

export interface GraphStreamConfig {
  readonly threadId: string;
}

/** Emits LangGraph update chunks only after the graph has buffered/guarded its candidate. */
export async function* streamNagiGraph(
  deps: RuntimeDependencies,
  input: NagiGraphState,
  config: GraphStreamConfig,
): AsyncGenerator<unknown> {
  const graph = createNagiGraph(deps);
  const stream = await graph.stream(input as Parameters<typeof graph.stream>[0], {
    configurable: { thread_id: config.threadId },
    streamMode: "updates",
  });
  for await (const update of stream) yield update;
}
