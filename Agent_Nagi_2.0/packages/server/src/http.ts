import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { createNagiGraph, emptyState, streamNagiGraph, type NagiGraphState } from "@nagi/runtime-langgraph";
import { createLocalDependencies, exportLocalDomain, getLocalDomainState, getLocalHistory, importLocalDomain } from "./local-dependencies.js";
import { createProviderFromEnvironment } from "./provider-config.js";

const MAX_BODY_BYTES = 1_000_000;
const provider = createProviderFromEnvironment();

interface ChatRequestBody {
  readonly message?: unknown;
  readonly userId?: unknown;
  readonly threadId?: unknown;
  readonly requestId?: unknown;
  readonly vendor?: unknown;
  readonly stream?: unknown;
}

interface SaveRequestBody { readonly userId?: unknown; readonly snapshot?: unknown; }

function json(response: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(payload);
}

function writeSse(response: ServerResponse, event: string, data: unknown): void {
  response.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function bearerMatches(request: IncomingMessage, expected: string): boolean {
  const value = request.headers.authorization;
  if (!value?.startsWith("Bearer ")) return false;
  const supplied = Buffer.from(value.slice(7), "utf8");
  const target = Buffer.from(expected, "utf8");
  return supplied.length === target.length && timingSafeEqual(supplied, target);
}

async function withThreadLock<T>(locks: Map<string, Promise<void>>, key: string, task: () => Promise<T>): Promise<T> {
  const previous = locks.get(key) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => { release = resolve; });
  locks.set(key, current);
  await previous;
  try {
    return await task();
  } finally {
    release();
    if (locks.get(key) === current) locks.delete(key);
  }
}

async function readJson(request: IncomingMessage): Promise<ChatRequestBody> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BODY_BYTES) throw new Error("request body too large");
    chunks.push(buffer);
  }
  const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (!parsed || typeof parsed !== "object") throw new Error("request body must be an object");
  return parsed as ChatRequestBody;
}

async function readSaveJson(request: IncomingMessage): Promise<SaveRequestBody> {
  return await readJson(request) as SaveRequestBody;
}

export function createHttpServer() {
  const authToken = process.env.NAGI_AUTH_TOKEN?.trim() || undefined;
  const rateLimit = Math.max(0, Number.parseInt(process.env.NAGI_RATE_LIMIT_PER_MINUTE ?? "60", 10) || 0);
  const rateWindows = new Map<string, { startedAt: number; count: number }>();
  const threadLocks = new Map<string, Promise<void>>();
  return createServer(async (request, response) => {
    let streaming = false;
    try {
      response.setHeader("access-control-allow-origin", process.env.NAGI_CORS_ORIGIN ?? "*");
      response.setHeader("access-control-allow-headers", "authorization, content-type, x-llm-key");
      response.setHeader("access-control-allow-methods", "GET, POST, OPTIONS");
      if (request.method === "OPTIONS") {
        response.writeHead(204);
        response.end();
        return;
      }
      if (request.method === "GET" && request.url === "/health") {
        json(response, 200, { status: "ok", runtime: "local" });
        return;
      }
      if (authToken && !bearerMatches(request, authToken)) {
        json(response, 401, { error: { message: "unauthorized" } });
        return;
      }
      if (request.method === "GET" && request.url?.startsWith("/api/state")) {
        const query = new URL(request.url, "http://localhost").searchParams;
        const userId = query.get("userId") ?? "local-user";
        json(response, 200, getLocalDomainState(userId));
        return;
      }
      if (request.method === "GET" && request.url?.startsWith("/api/history")) {
        const query = new URL(request.url, "http://localhost").searchParams;
        const userId = query.get("userId") ?? "local-user";
        const parsedLimit = Number(query.get("limit") ?? "50");
        const limit = Number.isFinite(parsedLimit) ? Math.max(0, Math.min(100, Math.floor(parsedLimit))) : 50;
        json(response, 200, { turns: getLocalHistory(userId, limit) });
        return;
      }
      if (request.method === "POST" && request.url === "/api/save/export") {
        const body = await readSaveJson(request);
        const userId = typeof body.userId === "string" ? body.userId : "local-user";
        json(response, 200, { snapshot: exportLocalDomain(userId) });
        return;
      }
      if (request.method === "POST" && request.url === "/api/save/import") {
        const body = await readSaveJson(request);
        const userId = typeof body.userId === "string" ? body.userId : "";
        if (!userId) throw new Error("userId is required");
        importLocalDomain(userId, body.snapshot);
        json(response, 200, { imported: true, userId });
        return;
      }
      if (request.method !== "POST" || request.url !== "/v1/chat/completions") {
        json(response, 404, { error: { message: "not found" } });
        return;
      }
      const body = await readJson(request);
      const message = typeof body.message === "string" ? body.message : "";
      const userId = typeof body.userId === "string" ? body.userId : "local-user";
      const threadId = typeof body.threadId === "string" ? body.threadId : "local-thread";
      const requestId = typeof body.requestId === "string" ? body.requestId : randomUUID();
      const vendor = typeof body.vendor === "string" ? body.vendor : "local";
      const stream = body.stream === true;
      if (rateLimit > 0) {
        const now = Date.now();
        const window = rateWindows.get(userId);
        if (!window || now - window.startedAt >= 60_000) {
          rateWindows.set(userId, { startedAt: now, count: 1 });
        } else if (window.count >= rateLimit) {
          response.setHeader("retry-after", String(Math.max(1, Math.ceil((60_000 - (now - window.startedAt)) / 1000))));
          json(response, 429, { error: { message: "rate limit exceeded" } });
          return;
        } else {
          window.count += 1;
        }
      }
      const state = emptyState({ requestId, userId, threadId, message, vendor });
      const requestApiKey = typeof request.headers["x-llm-key"] === "string" ? request.headers["x-llm-key"] : undefined;
      const dependencies = createLocalDependencies(provider, requestApiKey);
      const lockKey = `${userId}:${threadId}`;
      if (stream) {
        streaming = true;
        response.writeHead(200, {
          "content-type": "text/event-stream; charset=utf-8",
          "cache-control": "no-cache, no-transform",
          connection: "keep-alive",
        });
        let accepted = "";
        await withThreadLock(threadLocks, lockKey, async () => {
          for await (const update of streamNagiGraph(dependencies, state, { threadId })) {
            const record = update && typeof update === "object" ? update as Record<string, unknown> : {};
            const nodes = Object.keys(record);
            const commit = record.commit_turn;
            if (commit && typeof commit === "object") {
              const generation = (commit as Record<string, unknown>).generation;
              if (generation && typeof generation === "object") {
                const candidate = (generation as Record<string, unknown>).accepted;
                if (typeof candidate === "string") accepted = candidate;
              }
            }
            writeSse(response, "progress", { requestId, nodes });
          }
        });
        writeSse(response, "message", {
          id: `chatcmpl-${requestId}`,
          object: "chat.completion.chunk",
          choices: [{ index: 0, delta: { role: "assistant", content: accepted }, finish_reason: "stop" }],
        });
        response.write("data: [DONE]\n\n");
        response.end();
        return;
      }
      const result = await withThreadLock(threadLocks, lockKey, async () => {
        const graph = createNagiGraph(dependencies);
        return await graph.invoke(state as Parameters<typeof graph.invoke>[0]) as NagiGraphState;
      });
      const content = result.generation.accepted ?? result.generation.candidate;
      json(response, 200, {
        id: `chatcmpl-${requestId}`,
        object: "chat.completion",
        choices: [{ index: 0, message: { role: "assistant", content }, finish_reason: "stop" }],
        nagi: { requestId, scene: result.analysis.scene, trace: result.trace },
      });
    } catch (error) {
      if (streaming && response.headersSent) {
        response.destroy(error instanceof Error ? error : undefined);
        return;
      }
      const message = error instanceof Error ? error.message : "request failed";
      json(response, 400, { error: { message } });
    }
  });
}
