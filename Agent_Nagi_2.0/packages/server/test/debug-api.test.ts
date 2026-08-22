import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

/**
 * Debug API（V4 §11）的服务端测试。
 *
 * 必须单独成文件、且在 **import 之前** 设 `NAGI_DOMAIN_DB`：
 * `http.ts` 的 checkpointer 是模块级常量，import 那一刻就定型了。
 * 塞进 http.test.ts 会污染同文件其它用例的持久化状态。
 */
const directory = mkdtempSync(join(tmpdir(), "nagi-debug-api-"));
process.env.NAGI_DOMAIN_DB = join(directory, "runtime.sqlite");

const { createHttpServer } = await import("../src/http.js");

afterAll(() => {
  // 尽力而为：`local-dependencies` 在**模块级**持有 SQLite 连接，没有关闭钩子，
  // Windows 上文件被占用时 rmSync 会 EPERM。这是清理问题，不是断言问题——
  // F29 就是因为把它当断言失败查了很久。留给操作系统清 temp 即可。
  try {
    rmSync(directory, { recursive: true, force: true });
  } catch {
    // 忽略
  }
});

describe("debug API", () => {
  it("explains the whole turn path after a run", async () => {
    const server = createHttpServer();
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    try {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("server did not bind");
      const base = `http://127.0.0.1:${address.port}`;

      const health = await (await fetch(`${base}/api/health`)).json() as { checkpointing: boolean };
      expect(health.checkpointing).toBe(true);

      // 跑之前：thread 上什么都没有。
      const before = await (await fetch(`${base}/api/runs?userId=dbg&threadId=t1`)).json() as { hasCheckpoint: boolean };
      expect(before.hasCheckpoint).toBe(false);

      await fetch(`${base}/v1/chat/completions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: "在干嘛" }], user: "dbg", threadId: "t1", stream: false }),
      });

      const after = await (await fetch(`${base}/api/runs?userId=dbg&threadId=t1`)).json() as {
        hasCheckpoint: boolean;
        trace: readonly { node: string }[];
        next: readonly string[];
      };
      expect(after.hasCheckpoint).toBe(true);
      // 「解释整轮路径」= 12 节点里实际走过的那条链都在 trace 里。
      const nodes = after.trace.map((entry) => entry.node);
      expect(nodes[0]).toBe("validate_request");
      expect(nodes).toContain("generate_candidate");
      expect(nodes).toContain("hard_guard");
      expect(nodes).toContain("commit_turn");
      expect(nodes.at(-1)).toBe("emit_response");
      // 正常跑完的轮次没有待执行节点；中途失败时这里非空，正是断点所在。
      expect(after.next).toEqual([]);
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });
});
