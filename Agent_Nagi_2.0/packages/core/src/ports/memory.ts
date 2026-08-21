import type { MemoryQuery, MemoryRecord, MemorySearchResult } from "../memory/types.js";

export interface MemoryStore {
  search(query: MemoryQuery): Promise<readonly MemorySearchResult[]>;
  append(records: readonly MemoryRecord[]): Promise<void>;
}
