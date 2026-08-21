import type { MemoryStore } from "../ports/memory.js";
import type {
  MemoryDraft,
  MemoryKind,
  MemoryQuery,
  MemoryRecord,
  MemoryScore,
  MemorySearchResult,
} from "./types.js";

const DEFAULT_LIMIT = 8;
const DAY_MS = 86_400_000;

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function cosineSimilarity(left: readonly number[] | undefined, right: readonly number[] | undefined): number {
  if (!left || !right || left.length === 0 || left.length !== right.length) return 0;
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (let index = 0; index < left.length; index += 1) {
    const l = left[index] ?? 0;
    const r = right[index] ?? 0;
    dot += l * r;
    leftNorm += l * l;
    rightNorm += r * r;
  }
  if (leftNorm === 0 || rightNorm === 0) return 0;
  return clamp((dot / Math.sqrt(leftNorm * rightNorm) + 1) / 2);
}

function recencyScore(updatedAt: string, now: string): number {
  const age = Math.max(0, Date.parse(now) - Date.parse(updatedAt));
  if (!Number.isFinite(age)) return 0;
  return Math.exp(-age / (30 * DAY_MS));
}

function lexicalScore(text: string | undefined, memory: string): number {
  if (!text?.trim()) return 0;
  const terms = [...new Set(text.toLocaleLowerCase().split(/\s+/u).filter(Boolean))];
  if (terms.length === 0) return 0;
  const haystack = memory.toLocaleLowerCase();
  return terms.filter((term) => haystack.includes(term)).length / terms.length;
}

export function scoreMemory(record: MemoryRecord, query: MemoryQuery): MemorySearchResult {
  const now = query.now ?? new Date().toISOString();
  const semantic = Math.max(cosineSimilarity(query.embedding, record.embedding), lexicalScore(query.text, record.text));
  const recency = recencyScore(record.updatedAt, now);
  const salience = clamp(record.salience);
  const confidence = clamp(record.confidence);
  const kindBoost: number = record.kind === "canon" ? 0.08 : 0;
  const components: MemoryScore = {
    semantic,
    recency,
    salience,
    confidence,
    kindBoost,
    total: semantic * 0.52 + recency * 0.16 + salience * 0.16 + confidence * 0.16 + kindBoost,
  };
  return { record, score: components.total, components };
}

export function rankMemories(records: readonly MemoryRecord[], query: MemoryQuery): readonly MemorySearchResult[] {
  const kinds = query.kinds ? new Set<MemoryKind>(query.kinds) : undefined;
  return records
    .filter((record) => record.namespace === query.namespace && (!kinds || kinds.has(record.kind)))
    .map((record) => scoreMemory(record, query))
    .sort((left, right) => right.score - left.score || right.record.updatedAt.localeCompare(left.record.updatedAt))
    .slice(0, Math.max(0, query.limit));
}

export class MemoryEngine {
  public constructor(private readonly store: MemoryStore) {}

  public retrieve(query: Omit<MemoryQuery, "limit"> & { limit?: number }): Promise<readonly MemorySearchResult[]> {
    const { limit: requestedLimit, ...withoutLimit } = query;
    return this.store.search({ ...withoutLimit, limit: requestedLimit ?? DEFAULT_LIMIT });
  }

  public async commitDrafts(
    drafts: readonly MemoryDraft[],
    metadata: { readonly namespace: string; readonly now: string },
  ): Promise<readonly MemoryRecord[]> {
    const records = drafts
      .filter((draft) => draft.text.trim().length > 0)
      .map((draft, index): MemoryRecord => ({
        id: `${metadata.namespace}:${metadata.now}:${index}`,
        namespace: metadata.namespace,
        kind: draft.kind,
        text: draft.text.trim(),
        createdAt: metadata.now,
        updatedAt: metadata.now,
        salience: clamp(draft.salience),
        confidence: clamp(draft.confidence),
        tags: [...draft.tags],
      }));
    await this.store.append(records);
    return records;
  }
}

export function parseMemoryDrafts(value: unknown, sourceTurnId: string): readonly MemoryDraft[] {
  if (!Array.isArray(value)) return [];
  const drafts: MemoryDraft[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const candidate = item as Record<string, unknown>;
    const text = typeof candidate.text === "string" ? candidate.text.trim() : "";
    const kind: MemoryKind = candidate.kind === "canon" ? "canon" : "live";
    if (!text) continue;
    const tags = Array.isArray(candidate.tags)
      ? candidate.tags.filter((tag): tag is string => typeof tag === "string").slice(0, 12)
      : [];
    drafts.push({
      kind,
      text,
      salience: typeof candidate.salience === "number" ? clamp(candidate.salience) : 0.5,
      confidence: typeof candidate.confidence === "number" ? clamp(candidate.confidence) : 0.5,
      tags,
      sourceTurnId,
    });
  }
  return drafts;
}
