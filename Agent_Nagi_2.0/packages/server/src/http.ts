import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { createNagiGraph, emptyState, type NagiGraphState } from "@nagi/runtime-langgraph";
import { createLocalDependencies } from "./local-dependencies.js";
import { createProviderFromEnvironment } from "./provider-config.js";

const MAX_BODY_BYTES = 1_000_000;
const provider = createProviderFromEnvironment();

interface ChatRequestBody {
  readonly message?: unknown;
  readonly userId?: unknown;
  readonly threadId?: unknown;
  readonly requestId?: unknown;
  readonly vendor?: unknown;
}

function json(response: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(payload);
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

export function createHttpServer() {
  return createServer(async (request, response) => {
    try {
      if (request.method === "GET" && request.url === "/health") {
        json(response, 200, { status: "ok", runtime: "local" });
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
      const state = emptyState({ requestId, userId, threadId, message, vendor });
      const requestApiKey = typeof request.headers["x-llm-key"] === "string" ? request.headers["x-llm-key"] : undefined;
      const graph = createNagiGraph(createLocalDependencies(provider, requestApiKey));
      const result = await graph.invoke(state) as NagiGraphState;
      const content = result.generation.accepted ?? result.generation.candidate;
      json(response, 200, {
        id: `chatcmpl-${requestId}`,
        object: "chat.completion",
        choices: [{ index: 0, message: { role: "assistant", content }, finish_reason: "stop" }],
        nagi: { requestId, scene: result.analysis.scene, trace: result.trace },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "request failed";
      json(response, 400, { error: { message } });
    }
  });
}
