export type MemoryKind = "canon" | "live";

export interface MemoryRecord {
  readonly id: string;
  readonly namespace: string;
  readonly kind: MemoryKind;
  readonly text: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly salience: number;
  readonly confidence: number;
  readonly tags: readonly string[];
  readonly embedding?: readonly number[];
  readonly embeddingModel?: string;
  readonly embeddingDim?: number;
  readonly source?: {
    readonly path: string;
    readonly section: string;
    readonly sha256: string;
  };
}

export interface MemoryQuery {
  readonly namespace: string;
  readonly namespaces?: readonly string[];
  readonly text?: string;
  readonly embedding?: readonly number[];
  readonly embeddingModel?: string;
  readonly kinds?: readonly MemoryKind[];
  readonly limit: number;
  readonly now?: string;
}

export interface MemoryScore {
  readonly total: number;
  readonly semantic: number;
  readonly recency: number;
  readonly salience: number;
  readonly confidence: number;
  readonly kindBoost: number;
}

export interface MemorySearchResult {
  readonly record: MemoryRecord;
  readonly score: number;
  readonly components?: MemoryScore;
}

export interface MemoryDraft {
  readonly kind: MemoryKind;
  readonly text: string;
  readonly salience: number;
  readonly confidence: number;
  readonly tags: readonly string[];
  readonly sourceTurnId: string;
  readonly embedding?: readonly number[];
  readonly embeddingModel?: string;
  readonly source?: MemoryRecord["source"];
}
