import { describe, expect, it } from "vitest";
import { LocalDomainStore } from "../src/local-domain-store.js";

describe("LocalDomainStore idempotency", () => {
  it("does not apply the same request twice", () => {
    const store = new LocalDomainStore();
    const turn = { requestId: "r1", userId: "u", threadId: "t", userMessage: "你好", assistantMessage: "……好麻烦。", createdAt: "2026-08-21T00:00:00.000Z" };
    const input = { userId: "u", relationshipDelta: { trust: 2 }, drafts: [], turn };
    store.commitTurn(input);
    store.commitTurn(input);
    expect(store.loadRelationship("u").trust).toBe(2);
    expect(store.listTurns("u")).toHaveLength(1);
  });
});
