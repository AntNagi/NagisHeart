import type { MemoryStore } from "../ports/memory.js";
import { rankMemories } from "./engine.js";
import type { MemoryQuery, MemoryRecord, MemorySearchResult } from "./types.js";

/** Local-only adapter for core tests and the first development loop. */
export class InMemoryMemoryStore implements MemoryStore {
  private readonly records = new Map<string, MemoryRecord>();

  public constructor(initial: readonly MemoryRecord[] = []) {
    for (const record of initial) this.records.set(record.id, record);
  }

  public search(query: MemoryQuery): Promise<readonly MemorySearchResult[]> {
    return Promise.resolve(rankMemories([...this.records.values()], query));
  }

  public append(records: readonly MemoryRecord[]): Promise<void> {
    for (const record of records) this.records.set(record.id, record);
    return Promise.resolve();
  }
}
