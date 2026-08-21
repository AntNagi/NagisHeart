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
        body: JSON.stringify({ message: "你好", stream: true }),
      });
      const text = await response.text();
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("text/event-stream");
      expect(text).toContain("event: progress");
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
