import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { createNagiGraph, emptyState, streamNagiGraph, type NagiGraphState } from "@nagi/runtime-langgraph";
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
  readonly stream?: unknown;
}

function json(response: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(payload);
}

function writeSse(response: ServerResponse, event: string, data: unknown): void {
  response.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
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
      const stream = body.stream === true;
      const state = emptyState({ requestId, userId, threadId, message, vendor });
      const requestApiKey = typeof request.headers["x-llm-key"] === "string" ? request.headers["x-llm-key"] : undefined;
      const dependencies = createLocalDependencies(provider, requestApiKey);
      if (stream) {
        response.writeHead(200, {
          "content-type": "text/event-stream; charset=utf-8",
          "cache-control": "no-cache, no-transform",
          connection: "keep-alive",
        });
        let accepted = "";
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
        writeSse(response, "message", {
          id: `chatcmpl-${requestId}`,
          object: "chat.completion.chunk",
          choices: [{ index: 0, delta: { role: "assistant", content: accepted }, finish_reason: "stop" }],
        });
        response.write("data: [DONE]\n\n");
        response.end();
        return;
      }
      const graph = createNagiGraph(dependencies);
      const result = await graph.invoke(state as Parameters<typeof graph.invoke>[0]) as NagiGraphState;
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
