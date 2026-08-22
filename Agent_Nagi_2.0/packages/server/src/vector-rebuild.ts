import type { MemoryRecord, MemoryStore } from "@nagi/core";

/** 单次 embed 多少条。太大容易撞厂商的单请求上限，太小则往返次数多。 */
export const REBUILD_BATCH = 16;

/** 重建所需的库能力。抽成接口是为了能用假实现测——不然这段只能靠上线才知道对不对。 */
export interface VectorRebuildIndex {
  listNeedingEmbedding(model: string, limit: number): readonly MemoryRecord[];
  countNeedingEmbedding(model: string): number;
}

export interface VectorRebuildOptions {
  readonly store: MemoryStore;
  readonly index: VectorRebuildIndex;
  readonly model: string;
  /** 返回 undefined 表示这批失败——重建立即停，不重试。 */
  readonly embed: (texts: readonly string[]) => Promise<readonly Float32Array[] | undefined>;
  readonly log?: (message: string) => void;
  readonly batchSize?: number;
}

export interface VectorRebuildResult {
  readonly total: number;
  readonly done: number;
  /** 因某批 embed 失败而提前退出。下次启动会从断点继续。 */
  readonly interrupted: boolean;
}

/**
 * 重建向量（V4 §8.2「模型变化时后台重建全部向量」）。
 *
 * 覆盖两种情况，二者症状相同、成因不同：
 *  1. **换了 embedding 模型** —— 旧向量与新查询不在同一空间，
 *     `rankMemories` 会把它们过滤掉。过滤是对的，但它是静默的。
 *  2. **压根没有向量** —— canon 记忆从 JSON 加载，天生无向量；
 *     而 live 记忆写入时就带向量。**两者混在一起比全都没有更糟**。
 *
 *     机制（已实测，见 core.test.ts「混合向量空间」）：
 *     `scoreMemory` 取 `semantic = max(余弦, 词面)`，余弦经 (x+1)/2 归一后，
 *     **毫不相关**的中文句子也有 ~0.75 的地板；而无向量的记忆只能拿词面分，
 *     中文改写查询下常常正好是 0。实测对查询「他是不是很懒」：
 *       「世界杯决赛的比分」（有向量、不相关）总分 0.723
 *       「凪怕麻烦，不愿意动」（无向量、真相关）总分 0.336
 *     ——不相关的赢了。canon 无向量而 live 有，表现就是
 *     「凪记得你昨天说的话，却忘了自己的剧情」。
 *
 *     反过来不成立：无向量但**词面全中**的记忆语义分是 1.0，照样赢。
 *     所以这不是「有向量恒赢」，而是「改写型查询下无向量必输」。
 *
 * 失败即停，不重试：继续循环只会拿同一批反复撞同一个错误，把额度烧光。
 */
export async function rebuildVectors(options: VectorRebuildOptions): Promise<VectorRebuildResult> {
  const { store, index, model, embed } = options;
  const log = options.log ?? ((): void => undefined);
  const batchSize = options.batchSize ?? REBUILD_BATCH;
  const total = index.countNeedingEmbedding(model);
  if (total === 0) return { total: 0, done: 0, interrupted: false };
  log(`[embedding] ${total} 条记忆缺少 ${model} 的向量，开始重建。`);

  let done = 0;
  for (;;) {
    const batch = index.listNeedingEmbedding(model, batchSize);
    if (batch.length === 0) break;
    const vectors = await embed(batch.map((record) => record.text));
    if (!vectors) {
      log(`[embedding] 重建中断，已完成 ${done}/${total}。下次启动会从断点继续。`);
      return { total, done, interrupted: true };
    }
    await store.append(batch.map((record, position) => {
      const vector = vectors[position];
      if (!vector) return record;
      return { ...record, embedding: Array.from(vector), embeddingModel: model, embeddingDim: vector.length };
    }));
    done += batch.length;
  }
  log(`[embedding] 向量重建完成：${done} 条。`);
  return { total, done, interrupted: false };
}
