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

/** 汉字、假名。韩文谚文不在剧本语料内，暂不处理。 */
const CJK_CHAR = /[㐀-䶿一-鿿豈-﫿぀-ヿ]/u;

/**
 * 切词。**中文没有空格，按空白切会把整句变成一个 term**——这正是旧实现
 * 让词面分恒为 0 的原因（见 OPEN_QUESTIONS F17 / Codex F6）。
 *
 * 策略：把字符串按「是否 CJK」切成同类段落，
 *  - CJK 段落取**双字 n-gram**（单字段落取该字本身）
 *  - 非 CJK 段落按非字母数字切成词
 *
 * 用 bigram 而不是引入分词器，是因为 core 必须零依赖（V4 §12 / 域 B 红线）。
 * bigram 对「曼城」「公寓」「出差」这类实词命中良好；代价是「的」「了」这类
 * 高频虚词组成的 bigram 会带来噪声，但分母按查询词数归一，噪声会被稀释。
 */
function tokenize(text: string): ReadonlySet<string> {
  const terms = new Set<string>();
  let buffer = "";
  let bufferIsCjk = false;
  const flush = (): void => {
    if (!buffer) return;
    if (bufferIsCjk) {
      if (buffer.length === 1) terms.add(buffer);
      else for (let index = 0; index + 1 < buffer.length; index += 1) terms.add(buffer.slice(index, index + 2));
    } else {
      for (const word of buffer.split(/[^\p{L}\p{N}]+/u)) if (word) terms.add(word);
    }
    buffer = "";
  };
  for (const character of text.toLocaleLowerCase()) {
    const isCjk = CJK_CHAR.test(character);
    if (isCjk !== bufferIsCjk) {
      flush();
      bufferIsCjk = isCjk;
    }
    buffer += character;
  }
  flush();
  return terms;
}

/** 包含度：查询里有多少比例的词出现在这条记忆里。沿用旧实现的归一方式。 */
function lexicalScore(text: string | undefined, memory: string): number {
  if (!text?.trim()) return 0;
  const queryTerms = tokenize(text);
  if (queryTerms.size === 0) return 0;
  const memoryTerms = tokenize(memory);
  let hits = 0;
  for (const term of queryTerms) if (memoryTerms.has(term)) hits += 1;
  return hits / queryTerms.size;
}

export function scoreMemory(record: MemoryRecord, query: MemoryQuery): MemorySearchResult {
  const now = query.now ?? new Date().toISOString();
  const semantic = Math.max(cosineSimilarity(query.embedding, record.embedding), lexicalScore(query.text, record.text));
  const recency = record.kind === "canon" ? 0.5 : recencyScore(record.updatedAt, now);
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

/**
 * 统计库里各 embedding 模型的向量数，用于发现**混合向量空间**。
 *
 * 为什么需要它：换了 embedding 模型后，用新模型查询时，
 * 带旧模型向量的记忆会被 `rankMemories` 过滤掉——**过滤本身是对的**
 * （V4 §8.2「禁止混合向量空间检索」），但它是**静默的**：
 * 凪会突然想不起一批事，而日志里什么都没有。
 *
 * V4 §8.2 要求「模型变化时后台重建全部向量」。在重建做完之前，
 * 至少要能在启动时喊一声，否则这类退化根本无从察觉。
 */
export function countEmbeddingModels(records: readonly MemoryRecord[]): ReadonlyMap<string, number> {
  const counts = new Map<string, number>();
  for (const record of records) {
    if (!record.embeddingModel) continue;
    counts.set(record.embeddingModel, (counts.get(record.embeddingModel) ?? 0) + 1);
  }
  return counts;
}

/**
 * 检查库里的向量是否都来自 `expectedModel`。
 *
 * @returns 与预期不符的模型及其条数；空 Map 表示干净。
 */
export function findStaleEmbeddings(
  records: readonly MemoryRecord[],
  expectedModel: string,
): ReadonlyMap<string, number> {
  const stale = new Map<string, number>();
  for (const [model, count] of countEmbeddingModels(records)) {
    if (model !== expectedModel) stale.set(model, count);
  }
  return stale;
}

export function rankMemories(records: readonly MemoryRecord[], query: MemoryQuery): readonly MemorySearchResult[] {
  const kinds = query.kinds ? new Set<MemoryKind>(query.kinds) : undefined;
  return records
    .filter((record) => {
      const namespaces = new Set([query.namespace, ...(query.namespaces ?? [])]);
      const namespaceMatch = namespaces.has(record.namespace) || (record.kind === "canon" && record.namespace === "canon:nagisheart");
      const embeddingMatch = !query.embeddingModel || !record.embeddingModel || query.embeddingModel === record.embeddingModel;
      const dimensionMatch = !query.embedding || !record.embeddingDim || query.embedding.length === record.embeddingDim;
      return namespaceMatch && embeddingMatch && dimensionMatch && (!kinds || kinds.has(record.kind));
    })
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
      .map((draft, index): MemoryRecord => {
        const embedding = draft.embedding;
        return {
        id: `${metadata.namespace}:${metadata.now}:${index}`,
        namespace: metadata.namespace,
        kind: draft.kind,
        text: draft.text.trim(),
        createdAt: metadata.now,
        updatedAt: metadata.now,
        salience: clamp(draft.salience),
        confidence: clamp(draft.confidence),
        tags: [...draft.tags],
        ...(embedding ? { embedding: [...embedding] } : {}),
        ...(draft.embeddingModel && embedding ? { embeddingModel: draft.embeddingModel, embeddingDim: embedding.length } : {}),
        ...(draft.source ? { source: draft.source } : {}),
        };
      });
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
      ...(Array.isArray(candidate.embedding) && candidate.embedding.every((value) => typeof value === "number")
        ? { embedding: candidate.embedding as number[] } : {}),
      ...(typeof candidate.embeddingModel === "string" ? { embeddingModel: candidate.embeddingModel } : {}),
      ...(candidate.source && typeof candidate.source === "object" ? (() => {
        const source = candidate.source as Record<string, unknown>;
        return typeof source.path === "string" && typeof source.section === "string" && typeof source.sha256 === "string"
          ? { source: { path: source.path, section: source.section, sha256: source.sha256 } } : {};
      })() : {}),
    });
  }
  return drafts;
}
