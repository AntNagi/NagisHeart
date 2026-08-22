import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createSqliteCheckpointer, createNagiGraph, emptyState } from "../src/index.js";
import { fixtureDependencies } from "./test-fixtures.js";

function sqliteAvailable(): boolean {
  try {
    createSqliteCheckpointer(":memory:");
    return true;
  } catch {
    return false;
  }
}

const hasSqliteBinding = sqliteAvailable();

/**
 * V4 §14.1 的完成判据，原文：
 *
 * >「完成判据不是『文件齐』，而是：人为让 generate_candidate 后的节点失败，
 * >  重新调用后从 checkpoint 恢复，并能通过 Debug API 解释整轮路径。」
 *
 * 这条测试就是那个判据本身，不是它的近似。三件事各自断言：
 *  1. 后置节点确实失败了（故障注入生效，不是测试自己跑绿）
 *  2. 重新调用后**没有重跑 generate_candidate**——这是「从 checkpoint 恢复」
 *     的唯一硬证据。只看最终结果对不对是查不出来的：全量重跑的结果也对，
 *     只是白烧了一次 main 位的钱、且凪可能吐出一句不一样的话。
 *  3. trace 能复述整轮路径（Debug API 读的就是它）
 */
describe("checkpoint recovery after post-generation failure", () => {
  it.skipIf(!hasSqliteBinding)("resumes without re-running generate_candidate", async () => {
    const directory = mkdtempSync(join(tmpdir(), "nagi-recovery-"));
    let saverToClose: ReturnType<typeof createSqliteCheckpointer> | undefined;
    try {
      const saver = createSqliteCheckpointer(join(directory, "runtime.sqlite"));
      saverToClose = saver;

      let generateCalls = 0;
      let extractCalls = 0;
      const base = fixtureDependencies();
      const deps = {
        ...base,
        generateCandidate: async () => {
          generateCalls += 1;
          return { text: "……好麻烦。" };
        },
        // 故障注入点：generate_candidate **之后**的节点。
        // 第一次调用抛错，第二次放行——模拟「厂商抽风 / 进程被杀」后重试。
        extractEffects: async () => {
          extractCalls += 1;
          if (extractCalls === 1) throw new Error("injected: extract_effects exploded");
          return { memoryDrafts: [] };
        },
      };

      const config = { configurable: { thread_id: "recovery-user:thread" } };
      const input = emptyState({
        requestId: "recovery-1", userId: "recovery-user", threadId: "thread",
        message: "在干嘛", vendor: "local",
      });

      // —— 第一次：应当在 extract_effects 炸掉
      await expect(
        createNagiGraph(deps, { checkpointer: saver }).invoke(input, config),
      ).rejects.toThrow(/injected/u);
      expect(generateCalls).toBe(1);

      // 断点应当落在失败节点之前，且 next 指向它——这正是 Debug API 用来
      // 回答「断在哪」的字段。
      const midway = await createNagiGraph(deps, { checkpointer: saver }).getState(config);
      expect(midway.next).toContain("extract_effects");
      // 查 candidate 而非 accepted：accepted 是 commit_turn 才写的，
      // 断在 extract_effects 之前时它本就该是 null。
      // candidate 已在 checkpoint 里，正说明这次生成的结果没丢。
      expect(midway.values.generation.candidate).toBe("……好麻烦。");

      // —— 第二次：不传 input（传 null 表示「从 checkpoint 继续」，
      //     传 input 会当成新一轮从头跑）
      const resumed = await createNagiGraph(deps, { checkpointer: saver })
        .invoke(null as unknown as typeof input, config);

      expect(extractCalls).toBe(2);
      // 判据核心：main 位只被调用过一次。
      expect(generateCalls).toBe(1);
      expect(resumed.generation.accepted).toBe("……好麻烦。");

      // —— Debug API 的可解释性：trace 要能复述整轮走过的节点
      const nodes = resumed.trace.map((entry) => entry.node);
      expect(nodes).toContain("generate_candidate");
      expect(nodes).toContain("extract_effects");
      expect(nodes).toContain("commit_turn");
    } finally {
      (saverToClose as unknown as { db?: { close(): void } } | undefined)?.db?.close();
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
