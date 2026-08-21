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
});
