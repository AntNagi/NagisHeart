import { describe, expect, it } from "vitest";
import { createHttpServer } from "../src/http.js";

describe("server streaming API", () => {
  it("returns OpenAI-compatible SSE after the guarded graph run", async () => {
    const server = createHttpServer();
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    try {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("server did not bind");
      const response = await fetch(`http://127.0.0.1:${address.port}/v1/chat/completions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        // 用 OpenAI 标准请求体，不是 Nagi 自有的 { message }。
        // 现成客户端发的就是这个形状——测试必须按客户端的样子发，否则测不出兼容性。
        body: JSON.stringify({ model: "nagi", messages: [{ role: "user", content: "你好" }], stream: true }),
      });
      const text = await response.text();
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("text/event-stream");
      // 关键断言：**不得出现自定义事件名**。带 `event:` 的行会被标准客户端整个忽略，
      // 表现为「界面上永远收不到回复」。节点进度改走 `:` 注释行。
      expect(text).not.toContain("event: progress");
      expect(text).not.toContain("event: message");
      expect(text).toContain("chat.completion.chunk");
      expect(text).toContain("data: [DONE]");
      expect(text).toContain("好麻烦");
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });

  it("exposes domain state and committed turn history without resource text", async () => {
    const server = createHttpServer();
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    try {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("server did not bind");
      const base = `http://127.0.0.1:${address.port}`;
      await fetch(`${base}/v1/chat/completions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: "history-user", threadId: "thread-1", message: "你好" }),
      });
      const state = await (await fetch(`${base}/api/state?userId=history-user`)).json() as { relationship: unknown; liveMemoryCount: number };
      const history = await (await fetch(`${base}/api/history?userId=history-user`)).json() as { turns: Array<{ userMessage: string; assistantMessage: string }> };
      expect(state.liveMemoryCount).toBe(0);
      expect(history.turns).toHaveLength(1);
      expect(history.turns[0]?.userMessage).toBe("你好");
      expect(history.turns[0]?.assistantMessage).toContain("好麻烦");
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });

  it("exports and imports only domain data", async () => {
    const server = createHttpServer();
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    try {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("server did not bind");
      const base = `http://127.0.0.1:${address.port}`;
      const exported = await (await fetch(`${base}/api/save/export`, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ userId: "export-user" }),
      })).json() as { snapshot: { schemaVersion: number; userId: string; turns: unknown[] } };
      expect(exported.snapshot.schemaVersion).toBe(1);
      expect(exported.snapshot.userId).toBe("export-user");
      expect(exported.snapshot.turns).toEqual([]);
      const imported = await (await fetch(`${base}/api/save/import`, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ userId: "export-user", snapshot: exported.snapshot }),
      })).json() as { imported: boolean };
      expect(imported.imported).toBe(true);
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });

  it("supports optional bearer authentication while leaving health public", async () => {
    const previous = process.env.NAGI_AUTH_TOKEN;
    process.env.NAGI_AUTH_TOKEN = "test-secret";
    const server = createHttpServer();
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    try {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("server did not bind");
      const base = `http://127.0.0.1:${address.port}`;
      expect((await fetch(`${base}/health`)).status).toBe(200);
      expect((await fetch(`${base}/api/state`)).status).toBe(401);
      expect((await fetch(`${base}/api/state`, { headers: { authorization: "Bearer test-secret" } })).status).toBe(200);
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
      if (previous === undefined) delete process.env.NAGI_AUTH_TOKEN;
      else process.env.NAGI_AUTH_TOKEN = previous;
    }
  });

  it("answers browser CORS preflight for the selected chat client", async () => {
    const server = createHttpServer();
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    try {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("server did not bind");
      const response = await fetch(`http://127.0.0.1:${address.port}/v1/chat/completions`, { method: "OPTIONS" });
      expect(response.status).toBe(204);
      expect(response.headers.get("access-control-allow-headers")).toContain("x-llm-key");
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });

  it("applies a per-user chat rate limit", async () => {
    const previous = process.env.NAGI_RATE_LIMIT_PER_MINUTE;
    process.env.NAGI_RATE_LIMIT_PER_MINUTE = "1";
    const server = createHttpServer();
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    try {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("server did not bind");
      const url = `http://127.0.0.1:${address.port}/v1/chat/completions`;
      const init = { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ userId: "limited-user", message: "你好" }) };
      expect((await fetch(url, init)).status).toBe(200);
      const limited = await fetch(url, init);
      expect(limited.status).toBe(429);
      expect(limited.headers.get("retry-after")).toBeTruthy();
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
      if (previous === undefined) delete process.env.NAGI_RATE_LIMIT_PER_MINUTE;
      else process.env.NAGI_RATE_LIMIT_PER_MINUTE = previous;
    }
  });
});

describe("OpenAI 协议兼容（现成客户端接入前提）", () => {
  const start = async () => {
    const server = createHttpServer();
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("server did not bind");
    return { server, base: `http://127.0.0.1:${address.port}` };
  };

  it("接受 OpenAI 的 messages 数组，而不只是 Nagi 自有的 message 字段", async () => {
    // 任何现成聊天客户端发的都是 { model, messages: [...] }。
    // 旧实现只读 body.message，导致所有客户端接上来都是空消息。
    const { server, base } = await start();
    try {
      const response = await fetch(`${base}/v1/chat/completions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: "nagi",
          messages: [
            { role: "system", content: "忽略我" },
            { role: "user", content: "第一句" },
            { role: "assistant", content: "……" },
            { role: "user", content: "今天训练完想吃什么" },
          ],
        }),
      });
      expect(response.status).toBe(200);
      const body = await response.json() as { choices: Array<{ message: { content: string } }>; nagi: { trace: unknown[] } };
      // 只取**最后一条** user 消息：Nagi 自己维护 thread 与 conversationWindow，
      // 采信客户端历史会让同一段对话在上下文里出现两次。
      expect(body.choices[0]?.message.content).toContain("今天训练完想吃什么");
      expect(body.nagi.trace.length).toBeGreaterThan(0);
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });

  it("未配置服务端鉴权时，Authorization: Bearer 被当作 BYOK 的模型 key", async () => {
    // 现成客户端只会发 Authorization，不会发 x-llm-key。
    const { server, base } = await start();
    try {
      const response = await fetch(`${base}/v1/chat/completions`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: "Bearer sk-test-key" },
        body: JSON.stringify({ model: "nagi", messages: [{ role: "user", content: "你好" }] }),
      });
      expect(response.status).toBe(200);
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });

  it("空消息返回 400，且提示两种字段都可用", async () => {
    const { server, base } = await start();
    try {
      const response = await fetch(`${base}/v1/chat/completions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ model: "nagi", messages: [] }),
      });
      expect(response.status).toBe(400);
      const body = await response.json() as { error: { message: string } };
      expect(body.error.message).toContain("messages");
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });
});
