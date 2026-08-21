import { describe, expect, it } from "vitest";
import { withThreadLock } from "../src/http.js";

describe("per-thread writer lock", () => {
  it("serializes writes for one thread while allowing different threads", async () => {
    const locks = new Map<string, Promise<void>>();
    const events: string[] = [];
    const write = (key: string, label: string, delay: number) => withThreadLock(locks, key, async () => {
      events.push(`${label}:start`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      events.push(`${label}:end`);
    });
    await Promise.all([write("u:t", "a", 20), write("u:t", "b", 1), write("u:other", "c", 1)]);
    expect(events.indexOf("a:end")).toBeLessThan(events.indexOf("b:start"));
    expect(events.indexOf("c:end")).toBeLessThan(events.indexOf("a:end"));
  });
});
