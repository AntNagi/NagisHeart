import {
  buildContext,
  evaluateGuard,
  InMemoryMemoryStore,
  MemoryEngine,
  type CanonState,
  type SceneId,
  type SessionState,
  type ChatProvider,
} from "@nagi/core";
import type { GuardState, RuntimeDependencies } from "@nagi/runtime-langgraph";
import { LocalDomainStore } from "./local-domain-store.js";
import { loadGuardPolicy, loadResourceBlocks } from "./resource-loader.js";
import { resolve } from "node:path";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const canon: CanonState = { ending: "true", path: "dream", epoch: "post_ending" };
const memoryStore = new InMemoryMemoryStore();
const memoryEngine = new MemoryEngine(memoryStore);
type DomainBackend = {
  loadRelationship: LocalDomainStore["loadRelationship"];
  commitTurn: LocalDomainStore["commitTurn"];
  listTurns: LocalDomainStore["listTurns"];
  liveMemoryCount(userId: string): number;
  exportUser(userId: string): ReturnType<LocalDomainStore["exportUser"]>;
  importUser(snapshot: unknown, userId: string): void;
};

function createDomainBackend(): DomainBackend {
  const databasePath = process.env.NAGI_DOMAIN_DB;
  if (!databasePath) return new LocalDomainStore();
  const require = createRequire(import.meta.url);
  const { SqliteDomainStore } = require("./sqlite-domain-store.js") as { SqliteDomainStore: new (path: string) => DomainBackend };
  return new SqliteDomainStore(databasePath);
}

const domainStore = createDomainBackend();
const resourceRoot = resolve(process.env.NAGI_RESOURCE_ROOT ?? "resources");
const resources = loadResourceBlocks(resourceRoot);
const guardPolicy = loadGuardPolicy(resourceRoot);

function loadCanonMemories(root: string) {
  const path = join(root, "world", "events", "canon-memory.json");
  try {
    const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
    if (!parsed || typeof parsed !== "object") return [];
    const value = parsed as { schemaVersion?: unknown; memories?: unknown };
    if (value.schemaVersion !== 1 || !Array.isArray(value.memories)) return [];
    return value.memories.filter((item): item is Parameters<typeof memoryStore.append>[0][number] => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Record<string, unknown>;
      const source = candidate.source;
      return candidate.kind === "canon" && candidate.namespace === "canon:nagisheart" && typeof candidate.id === "string" &&
        typeof candidate.text === "string" && typeof candidate.createdAt === "string" && typeof candidate.updatedAt === "string" &&
        typeof candidate.salience === "number" && typeof candidate.confidence === "number" && Array.isArray(candidate.tags) &&
        !!source && typeof source === "object" && typeof (source as Record<string, unknown>).path === "string" &&
        typeof (source as Record<string, unknown>).section === "string" && typeof (source as Record<string, unknown>).sha256 === "string";
    });
  } catch {
    return [];
  }
}

const canonLoad = memoryStore.append(loadCanonMemories(resourceRoot));

export function getLocalDomainState(userId: string) {
  return {
    relationship: domainStore.loadRelationship(userId),
    liveMemoryCount: domainStore.liveMemoryCount(userId),
  };
}

export function getLocalHistory(userId: string, limit = 50) {
  return domainStore.listTurns(userId, limit);
}

export function exportLocalDomain(userId: string) {
  return domainStore.exportUser(userId);
}

export function importLocalDomain(userId: string, snapshot: unknown): void {
  domainStore.importUser(snapshot, userId);
}

function classify(message: string): SceneId {
  if (/(足球|训练|比赛|球场)/u.test(message)) return "football";
  if (/(喜欢|爱|想你|告白)/u.test(message)) return "affection";
  if (/(吵|生气|失望|为什么不)/u.test(message)) return "conflict";
  return "daily";
}

export function createLocalDependencies(provider?: ChatProvider, requestApiKey?: string): RuntimeDependencies {
  return {
    validateRequest(request) {
      if (!request.requestId || !request.userId || !request.threadId) throw new Error("request identity is required");
      if (!request.message.trim()) throw new Error("message must not be empty");
      if (request.message.length > 8_000) throw new Error("message is too long");
    },
    async loadDomainState(request) {
      const relationship = domainStore.loadRelationship(request.userId);
      const session: SessionState = {
        scene: "daily",
        now: new Date().toISOString(),
        turnId: request.requestId,
        userId: request.userId,
        conversationId: request.threadId,
        relationship,
      };
      return { canon, relationship, session };
    },
    classifyScene({ message }) {
      return classify(message);
    },
    async retrieveContext({ request, query }) {
      await canonLoad;
      const [canonMemories, liveMemories] = await Promise.all([
        memoryEngine.retrieve({ namespace: request.userId, text: query, kinds: ["canon"], limit: 4 }),
        memoryEngine.retrieve({ namespace: request.userId, text: query, kinds: ["live"], limit: 4 }),
      ]);
      return [...canonMemories, ...liveMemories].sort((left, right) => right.score - left.score);
    },
    assembleContext({ domain, scene, memories }) {
      const recentTurns = getLocalHistory(domain.session.userId, 6).flatMap((turn) => [
        { role: "user" as const, content: turn.userMessage },
        { role: "assistant" as const, content: turn.assistantMessage },
      ]);
      return buildContext({
        scene,
        relationship: domain.relationship,
        resources,
        memories,
        recentTurns,
        maxTokens: 20_000,
      });
    },
    async generateCandidate({ request, context }) {
      if (provider) {
        const result = await provider.complete({
          model: "configured",
          messages: [
            { role: "system", content: context.rendered },
            { role: "user", content: request.message },
          ],
          maxTokens: 300,
        }, { apiKey: requestApiKey ?? process.env.NAGI_DEV_LLM_KEY ?? "" });
        return {
          text: result.text,
          usage: {
            latencyMs: result.latencyMs,
            ...(result.inputTokens === undefined ? {} : { inputTokens: result.inputTokens }),
            ...(result.outputTokens === undefined ? {} : { outputTokens: result.outputTokens }),
          },
        };
      }
      // Deliberately obvious development stub until a provider is configured.
      return { text: `【local-provider】${request.message}……好麻烦。` };
    },
    hardGuard(text): GuardState {
      const result = evaluateGuard(text, guardPolicy.config);
      return {
        hardViolations: result.violations.map((violation) => ({
          code: violation.ruleId,
          message: violation.message,
          severity: violation.severity,
        })),
        decision: result.decision,
      };
    },
    fallbackResponse({ request }) {
      const index = [...request.message].length % guardPolicy.fallbacks.length;
      return guardPolicy.fallbacks[index] ?? guardPolicy.fallbacks[0] ?? "……好麻烦。";
    },
    async softJudge() {
      return { oocScore: 0, decision: "pass" as const };
    },
    reviseContext({ context }) {
      return context;
    },
    async extractEffects() {
      return { memoryDrafts: [] };
    },
    async commitTurn({ request, accepted, relationshipDelta, memoryDrafts }) {
      // Local-only persistence: replace with SQLite/Postgres DomainStore later.
      domainStore.commitTurn({
        userId: request.userId,
        ...(relationshipDelta ? { relationshipDelta } : {}),
        drafts: memoryDrafts,
        turn: {
          requestId: request.requestId,
          userId: request.userId,
          threadId: request.threadId,
          userMessage: request.message,
          assistantMessage: accepted,
          createdAt: new Date().toISOString(),
        },
      });
      await memoryEngine.commitDrafts(memoryDrafts, {
        namespace: request.userId,
        now: new Date().toISOString(),
      });
    },
  };
}
