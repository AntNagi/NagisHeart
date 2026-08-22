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

/**
 * 检索打分权重（`NRH-20260822-023`）。
 *
 * 这五项**就是 `scoreMemory` 实际在用的维度**。此前 `config/runtime.yaml`
 * 写的是另一套三维口径（cosine / recency / emotionIntensity），
 * 与代码维度不一致且无人读——配置存在而代码不读，比没有配置更糟，
 * 它让人以为改配置有用。Ant 裁 A：配置改写成代码口径，行为不变。
 *
 * `canonBoost` 是**加项**不是权重：canon 记忆直接加这么多分，不乘任何东西。
 * 混进「权重」里会让人以为它参与归一，改起来出错。
 */
export interface MemoryWeights {
  readonly semantic: number;
  readonly recency: number;
  readonly salience: number;
  readonly confidence: number;
  /** canon 记忆的固定加分。不是乘数。 */
  readonly canonBoost: number;
}

export interface MemoryQuery {
  readonly namespace: string;
  /** 打分权重。不传则用 `DEFAULT_MEMORY_WEIGHTS`——保证既有调用方行为不变。 */
  readonly weights?: MemoryWeights;
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
