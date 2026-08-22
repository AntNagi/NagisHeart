import type { NagiGraphState } from "./state.js";
import { createNagiGraph } from "./graph.js";
import type { RuntimeDependencies } from "./dependencies.js";
import type { NagiGraphOptions } from "./graph.js";

export interface GraphStreamConfig {
  readonly threadId: string;
  /**
   * checkpointer。**流式与非流式必须传同一个**——只给其中一条路接，
   * 会出现「非流式能恢复、流式不能」这种极难排查的半吊子状态。
   */
  readonly checkpointer?: NagiGraphOptions["checkpointer"];
}

/** Emits LangGraph update chunks only after the graph has buffered/guarded its candidate. */
export async function* streamNagiGraph(
  deps: RuntimeDependencies,
  input: NagiGraphState,
  config: GraphStreamConfig,
): AsyncGenerator<unknown> {
  const graph = createNagiGraph(deps, config.checkpointer ? { checkpointer: config.checkpointer } : {});
  const stream = await graph.stream(input as Parameters<typeof graph.stream>[0], {
    configurable: { thread_id: config.threadId },
    streamMode: "updates",
  });
  for await (const update of stream) yield update;
}
