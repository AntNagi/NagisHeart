import { SqliteSaver } from "@langchain/langgraph-checkpoint-sqlite";

/** Creates the local SQLite checkpointer required by the V4 MVP. */
export function createSqliteCheckpointer(path: string): SqliteSaver {
  return SqliteSaver.fromConnString(path);
}
