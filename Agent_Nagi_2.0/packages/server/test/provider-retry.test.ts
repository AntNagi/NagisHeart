import { afterEach, describe, expect, it, vi } from "vitest";
import { OpenAICompatibleProvider } from "../src/openai-compatible-provider.js";

const ok = {
  ok: true,
  json: () => Promise.resolve({ choices: [{ message: { content: "……好麻烦。" } }] }),
};

function provider() {
  return new OpenAICompatibleProvider({
    endpoint: "https://example.invalid/v1/chat/completions",
    slots: { main: { model: "test-model" } },
    fallbackSlot: "main",
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("provider 瞬时故障重试", () => {
  it("429 后重试并成功——这正是聊到一半报错的那种抖动", async () => {
    // 实测 2026-08-23：Gemini 免费档聊到第三轮撞 429，几十秒后同一模型又是通的。
    // 没有重试时，这种抖动原样变成使用者眼前的一条错误消息。
    vi.useFakeTimers();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 429, json: () => Promise.resolve({ error: { message: "rate limit" } }) })
      .mockResolvedValueOnce(ok);
    vi.stubGlobal("fetch", fetchMock);

    const pending = provider().complete({ model: "main", messages: [{ role: "user", content: "在干嘛" }] }, { apiKey: "k" });
    await vi.runAllTimersAsync();
    const result = await pending;

    expect(result.text).toBe("……好麻烦。");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("鉴权失败立刻抛，不重试", async () => {
    // 重试 401 只会让使用者多等十几秒再看到同一条错误。
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false, status: 401, json: () => Promise.resolve({ error: { message: "invalid api key" } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      provider().complete({ model: "main", messages: [{ role: "user", content: "在干嘛" }] }, { apiKey: "bad" }),
    ).rejects.toThrow(/401/u);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("一直 429 则在退避用尽后抛出，不无限重试", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false, status: 429, json: () => Promise.resolve({ error: { message: "rate limit" } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const pending = provider().complete({ model: "main", messages: [{ role: "user", content: "在干嘛" }] }, { apiKey: "k" });
    const assertion = expect(pending).rejects.toThrow(/429/u);
    await vi.runAllTimersAsync();
    await assertion;
    // 首次 + 3 次退避重试 = 4。断言次数，否则无限重试的实现也能过前两条。
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
});
