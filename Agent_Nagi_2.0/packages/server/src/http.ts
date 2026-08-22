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
  /** OpenAI 标准字段。现成聊天客户端发的是这个，不是 `message`。 */
  readonly messages?: unknown;
  readonly user?: unknown;
}

interface OpenAIMessage {
  readonly role?: unknown;
  readonly content?: unknown;
}

/**
 * 从 OpenAI 格式的 `messages` 数组里取出本轮用户输入。
 *
 * 现成客户端会把**整段历史**发过来，但 Nagi 自己维护 thread 与 Live Memory
 * （`conversationWindow` 由 Context Builder 装配），所以只取最后一条 user 消息，
 * 不采信客户端的历史——否则同一段对话会在上下文里出现两次。
 *
 * content 可能是字符串，也可能是 OpenAI 的分段数组（vision 客户端常用）。
 */
function lastUserMessage(messages: unknown): string {
  if (!Array.isArray(messages)) return "";
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const item = messages[index] as OpenAIMessage | undefined;
    if (!item || item.role !== "user") continue;
    const { content } = item;
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      const text = content
        .map((part) => (part && typeof part === "object" && typeof (part as { text?: unknown }).text === "string"
          ? (part as { text: string }).text
          : ""))
        .filter(Boolean)
        .join("\n");
      if (text) return text;
    }
  }
  return "";
}

/**
 * 取 LLM key。
 *
 * BYOK 两条来路：
 *  - `x-llm-key`：Nagi 自有客户端用
 *  - `Authorization: Bearer`：**所有现成 OpenAI 客户端用的就是这个**
 *
 * 仅当服务端未配置自身鉴权（`NAGI_AUTH_TOKEN`）时才把 Bearer 当作 LLM key。
 * 配了 auth token 时 Bearer 归鉴权，此时客户端必须走 `x-llm-key`——
 * 否则会把服务端口令误当成模型 key 发给厂商。
 */
function resolveLlmKey(request: IncomingMessage, hasAuthToken: boolean): string | undefined {
  const explicit = request.headers["x-llm-key"];
  if (typeof explicit === "string" && explicit.trim()) return explicit.trim();
  if (hasAuthToken) return undefined;
  const authorization = request.headers.authorization;
  if (typeof authorization === "string" && authorization.startsWith("Bearer ")) {
    const token = authorization.slice(7).trim();
    if (token) return token;
  }
  return undefined;
}

interface SaveRequestBody { readonly userId?: unknown; readonly snapshot?: unknown; }

function json(response: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(payload);
}


function bearerMatches(request: IncomingMessage, expected: string): boolean {
  const value = request.headers.authorization;
  if (!value?.startsWith("Bearer ")) return false;
  const supplied = Buffer.from(value.slice(7), "utf8");
  const target = Buffer.from(expected, "utf8");
  return supplied.length === target.length && timingSafeEqual(supplied, target);
}

export async function withThreadLock<T>(locks: Map<string, Promise<void>>, key: string, task: () => Promise<T>): Promise<T> {
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
      // 兼容两种请求体：Nagi 自有 `{message}` 与 OpenAI 标准 `{messages:[...]}`。
      // 现成客户端只会发后者。
      const message = typeof body.message === "string" && body.message
        ? body.message
        : lastUserMessage(body.messages);
      // 身份推导。OpenAI 协议里没有 userId / threadId 这两个概念：
      //  - `user` 是 OpenAI 的可选字段，部分客户端会填，优先采用
      //  - 都没有时回落到固定值。**本地单人 Demo 下这是对的**；
      //    多用户部署必须改为从鉴权凭证派生，否则所有人共用一份记忆与关系
      //    （V4 §11.2 每用户独立 namespace）。见 OPEN_QUESTIONS F22。
      const userId = typeof body.userId === "string" && body.userId
        ? body.userId
        : typeof body.user === "string" && body.user ? body.user : "local-user";
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
      if (!message.trim()) {
        json(response, 400, { error: { message: "message is required (send `message` or OpenAI `messages`)" } });
        return;
      }
      const state = emptyState({ requestId, userId, threadId, message, vendor });
      const requestApiKey = resolveLlmKey(request, authToken !== undefined);
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
        const created = Math.floor(Date.now() / 1000);
        const chunk = (delta: Record<string, unknown>, finish: string | null): void => {
          // OpenAI 流式格式：**无事件名**的 `data:` 行。
          // 旧实现发的是 `event: progress` / `event: message`，
          // 而标准客户端（EventSource 默认只听 message 事件、SDK 只解析 data 行）
          // 会把带自定义事件名的行整个忽略 ⇒ 界面上永远收不到回复。
          response.write(`data: ${JSON.stringify({
            id: `chatcmpl-${requestId}`,
            object: "chat.completion.chunk",
            created,
            model: vendor,
            choices: [{ index: 0, delta, finish_reason: finish }],
          })}\n\n`);
        };
        chunk({ role: "assistant" }, null);
        await withThreadLock(threadLocks, lockKey, async () => {
          for await (const update of streamNagiGraph(dependencies, state, { threadId })) {
            const record = update && typeof update === "object" ? update as Record<string, unknown> : {};
            const commit = record.commit_turn;
            if (commit && typeof commit === "object") {
              const generation = (commit as Record<string, unknown>).generation;
              if (generation && typeof generation === "object") {
                const candidate = (generation as Record<string, unknown>).accepted;
                if (typeof candidate === "string") accepted = candidate;
              }
            }
            // 节点进度走 SSE 注释行（`:` 开头）。标准客户端按规范忽略它，
            // 不会显示成消息；Nagi 自有调试工具仍可读到。两段流下这也是唯一的心跳，
            // 能防止代理在长静默时掐断连接。
            response.write(`: nagi ${Object.keys(record).join(",")}\n\n`);
          }
        });
        // 两段流：Guard 通过后才发正文，所以这里是一次性整段送出（V4 §6.1 已知代价）。
        if (accepted) chunk({ content: accepted }, null);
        chunk({}, "stop");
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
