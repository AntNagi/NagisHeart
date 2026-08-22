import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { normalizeOutput } from "@nagi/core";
import { createNagiGraph, createSqliteCheckpointer, emptyState, streamNagiGraph, type NagiGraphState } from "@nagi/runtime-langgraph";
import { createLocalDependencies, exportLocalDomain, getLocalDomainState, getLocalHistory, getLocalMemories, importLocalDomain, maxBeatsPerReply } from "./local-dependencies.js";
import { createProviderFromEnvironment } from "./provider-config.js";
import { loadPresenceConfig, resolvePresence } from "./presence.js";

const MAX_BODY_BYTES = 1_000_000;
/**
 * beat 之间的停顿。太短读起来仍像刷屏，太长会拖慢整轮。
 * 240ms 是拍的值，未做人因验证——见 DECISIONS 低把握登记 U12。
 */
const BEAT_GAP_MS = Number(process.env.NAGI_BEAT_GAP_MS ?? 240);
const provider = createProviderFromEnvironment();

/**
 * Checkpointer。**此前服务端根本没接**——checkpoint 只在单测里跑过，
 * 真实服务从不落盘，于是 V4 §14.1 的完成判据
 * 「人为让节点失败，重新调用后从 checkpoint 恢复」**根本不可能满足**。
 *
 * 与领域库共用同一个文件（表不同），跟记忆库一样：一份文件便于整体备份。
 * 不配 `NAGI_DOMAIN_DB` 则不落 checkpoint（单测走这条，彼此隔离）。
 */
const checkpointer = (() => {
  const path = process.env.NAGI_DOMAIN_DB;
  if (!path) return undefined;
  try {
    return createSqliteCheckpointer(path);
  } catch (error) {
    // checkpoint 是可恢复性能力，坏了不该让服务起不来——但必须留声。
    console.warn(`[checkpoint] 初始化失败，本次运行不落 checkpoint：${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }
})();

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
      // V4 §11 列的 Debug API。§14.1 的完成判据后半句要求
      //「能通过 Debug API 解释整轮路径」——此前该端点根本不存在。
      //
      // 按 thread 查，不按 requestId：checkpoint 是以 thread 为单位存的，
      // 一个 thread 上的多轮共享同一条 checkpoint 链。要定位某一轮，
      // 从返回的 trace 里找 requestId。
      if (request.method === "GET" && request.url?.startsWith("/api/runs")) {
        const query = new URL(request.url, "http://localhost").searchParams;
        const userId = query.get("userId") ?? "local-user";
        const threadId = query.get("threadId") ?? "local-thread";
        if (!checkpointer) {
          json(response, 200, {
            threadId: `${userId}:${threadId}`,
            checkpointing: false,
            hint: "未配置 NAGI_DOMAIN_DB，本次运行不落 checkpoint",
          });
          return;
        }
        const graph = createNagiGraph(createLocalDependencies(provider), { checkpointer });
        const config = { configurable: { thread_id: `${userId}:${threadId}` } };
        const snapshot = await graph.getState(config);
        const values = snapshot.values as Partial<NagiGraphState> | undefined;
        json(response, 200, {
          threadId: `${userId}:${threadId}`,
          checkpointing: true,
          // 有没有 checkpoint 本身就是答案之一——恢复实验先看这个。
          // **不能看 config.configurable.thread_id**：那是原样回显的入参，
          // 空 thread 也非空。createdAt 只有真落过 checkpoint 才有值。
          hasCheckpoint: snapshot.createdAt !== undefined,
          // 整轮路径：每个节点何时执行、产出了什么。这是「解释」的主体。
          trace: values?.trace ?? [],
          scene: values?.analysis?.scene ?? null,
          guard: values?.guard ?? null,
          accepted: values?.generation?.accepted ?? null,
          // 下一步要执行的节点。中途失败时非空，正是它告诉你断在哪。
          next: snapshot.next ?? [],
        });
        return;
      }
      // 凪记得你的什么。
      //
      // 记忆是这个项目的核心，却在界面上完全不可见——只能靠"他会不会提起"
      // 间接判断，既慢又不可靠。这个端点让它可见。
      //
      // 只回 live 记忆：canon 是剧情既成事实（51 条长摘要），
      // 不是"他记住了你什么"，混在一起会把真正有意义的那几条淹掉。
      //
      // **不回 embedding**：那是几千个浮点数，对使用者毫无意义，
      // 而且会让响应体积暴涨（实测单条向量 66 KB）。
      if (request.method === "GET" && request.url?.startsWith("/api/memories")) {
        const query = new URL(request.url, "http://localhost").searchParams;
        const userId = query.get("userId") ?? "local-user";
        const parsedLimit = Number(query.get("limit") ?? "50");
        const limit = Number.isFinite(parsedLimit) ? Math.max(1, Math.min(200, Math.floor(parsedLimit))) : 50;
        const memories = getLocalMemories(userId, limit).map((record) => ({
          id: record.id,
          text: record.text,
          createdAt: record.createdAt,
          salience: record.salience,
          confidence: record.confidence,
        }));
        json(response, 200, { memories });
        return;
      }
      // 「凪此刻在做什么」——客户端顶部那一行。
      //
      // 人格规则（断言了他的作息）必须由 resources/ 声明、服务端解析，
      // 客户端只负责显示。写死在 App 里就等于把人格资料下发了（域 B 红线）。
      if (request.method === "GET" && request.url?.startsWith("/api/presence")) {
        const query = new URL(request.url, "http://localhost").searchParams;
        const userId = query.get("userId") ?? "local-user";
        // 取最近一轮的时间：他正在跟你说话时不该显示「睡着」。
        const [latest] = getLocalHistory(userId, 1);
        const lastTurnAt = latest?.createdAt ? new Date(latest.createdAt) : undefined;
        const state = resolvePresence(
          loadPresenceConfig(),
          new Date(),
          lastTurnAt && Number.isFinite(lastTurnAt.getTime()) ? lastTurnAt : undefined,
        );
        json(response, 200, state);
        return;
      }
      if (request.method === "GET" && request.url === "/api/health") {
        // V4 §11 列的是 /api/health；早先只实现了 /health。两个都留着，
        // 免得按文档接的客户端拿到 404。
        json(response, 200, { status: "ok", runtime: "local", checkpointing: checkpointer !== undefined });
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
      // OpenAI 的模型列表端点。**现成客户端连上来第一件事就是拉它**，
      // 拉不到会停在「获取模型失败」，根本进不到聊天界面——
      // 而服务端日志里只有一条 404，极容易被当成客户端自己的毛病。
      //
      // 只暴露一个 id `nagi`：按 V4 §10，客户端不该知道也不该选择厂商模型，
      // main / aux 由服务端按能力位决定。这同时也挡住了「用户在客户端里
      // 把模型改成别的」——那会绕开我们对 main 位的全部标定。
      if (request.method === "GET" && request.url === "/v1/models") {
        json(response, 200, {
          object: "list",
          data: [{ id: "nagi", object: "model", created: 0, owned_by: "nagi-runtime" }],
        });
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
          for await (const update of streamNagiGraph(dependencies, state, { threadId: `${userId}:${threadId}`, ...(checkpointer ? { checkpointer } : {}) })) {
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
        // 逐 beat 发送。各家模型排版差异（豆包的括号动作、Gemini 的空行分段）
        // 在归一层被吸收，这里只负责把干净的 beat 依次送出。
        //
        // ⚠ **OpenAI 流式协议下，chunk 是增量拼进同一条消息的，不会变成多个气泡。**
        // 「一个 beat 一个气泡」在标准协议下做不到，除非改客户端。
        // 所以 beat 之间必须补一个换行——否则它们会黏成一行，
        // 比原来带空行的版本更难读（实测：「……怎么说变就变。……好啦。」）。
        // 用单换行而非空行：空行是段落分隔，读起来像文档；单换行才是聊天里的分句。
        const normalized = normalizeOutput(accepted, maxBeatsPerReply);
        for (const [index, beat] of normalized.say.entries()) {
          chunk({ content: index === 0 ? beat : `\n${beat}` }, null);
          // beat 之间留一拍，让它像被陆续敲出来，而不是整段瞬间刷屏。
          // 最后一条不等，避免白白拖长收尾。
          if (index < normalized.say.length - 1) await new Promise((r) => setTimeout(r, BEAT_GAP_MS));
        }
        chunk({}, "stop");
        response.write("data: [DONE]\n\n");
        response.end();
        return;
      }
      const result = await withThreadLock(threadLocks, lockKey, async () => {
        const graph = createNagiGraph(dependencies, checkpointer ? { checkpointer } : {});
        // 必须带 thread_id：没有它 checkpoint 无处归属，恢复也就无从谈起。
        return await graph.invoke(
          state as Parameters<typeof graph.invoke>[0],
          { configurable: { thread_id: `${userId}:${threadId}` } },
        ) as NagiGraphState;
      });
      const raw = result.generation.accepted ?? result.generation.candidate;
      // 非流式也走同一套归一，两条路的行为必须一致——否则同一句话在
      // 流式与非流式下长得不一样，排错时无从判断是模型问题还是链路问题。
      const normalized = normalizeOutput(raw, maxBeatsPerReply);
      json(response, 200, {
        id: `chatcmpl-${requestId}`,
        object: "chat.completion",
        // 非流式只有一条消息可用，beat 之间用换行连接（不留空行）。
        // 需要逐条渲染的客户端读 `nagi.say`。
        choices: [{ index: 0, message: { role: "assistant", content: normalized.say.join("\n") }, finish_reason: "stop" }],
        nagi: {
          requestId,
          scene: result.analysis.scene,
          say: normalized.say,
          act: normalized.act,
          trace: result.trace,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "request failed";
      if (streaming && response.headersSent) {
        // 流已经开头了，改不了 HTTP 状态码。但**绝不能直接 destroy** ——
        // 那样客户端只看到连接被掐断，界面上显示「network error」，
        // 真实原因（如厂商欠费 403）完全不可见，使用者无从判断该做什么。
        // 改为把错误当成一段助手消息送完，再正常收流。
        try {
          response.write(`data: ${JSON.stringify({
            id: `chatcmpl-error`,
            object: "chat.completion.chunk",
            created: Math.floor(Date.now() / 1000),
            choices: [{ index: 0, delta: { content: `⚠️ ${message}` }, finish_reason: null }],
          })}\n\n`);
          response.write(`data: ${JSON.stringify({
            id: `chatcmpl-error`,
            object: "chat.completion.chunk",
            created: Math.floor(Date.now() / 1000),
            choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
          })}\n\n`);
          response.write("data: [DONE]\n\n");
          response.end();
        } catch {
          response.destroy();
        }
        return;
      }
      json(response, 400, { error: { message } });
    }
  });
}
