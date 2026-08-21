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
import { loadResourceBlocks } from "./resource-loader.js";
import { resolve } from "node:path";

const canon: CanonState = { ending: "true", path: "dream", epoch: "post_ending" };
const memoryStore = new InMemoryMemoryStore();
const memoryEngine = new MemoryEngine(memoryStore);
const domainStore = new LocalDomainStore();
const resourceRoot = resolve(process.env.NAGI_RESOURCE_ROOT ?? "resources");
const resources = loadResourceBlocks(resourceRoot);

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
      return memoryEngine.retrieve({ namespace: request.userId, text: query, limit: 8 });
    },
    assembleContext({ domain, scene, memories }) {
      return buildContext({
        scene,
        relationship: domain.relationship,
        resources,
        memories,
        recentTurns: [],
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
      const result = evaluateGuard(text, {
        forbiddenPatterns: [],
        frequencyCaps: [],
        defaultLength: 50,
        hardMaxLength: 80,
        maxBeatsPerReply: 3,
      });
      return {
        hardViolations: result.violations.map((violation) => ({
          code: violation.ruleId,
          message: violation.message,
          severity: violation.severity,
        })),
        decision: result.decision,
      };
    },
    fallbackResponse() {
      return "……这个不想说。";
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
