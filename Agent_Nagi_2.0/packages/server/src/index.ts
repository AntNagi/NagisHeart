import { createHttpServer } from "./http.js";

const port = Number(process.env.PORT ?? 3000);

/**
 * 监听地址。默认 `127.0.0.1`——**只有本机能连**。
 *
 * 要用手机上的客户端（Chatbox Android 等）连过来，必须改成 `0.0.0.0`，
 * 否则同一个 wifi 下也连不上：手机看到的是「连接被拒绝」，
 * 而服务端日志里什么都不会有——这种失败极难自查。
 */
const host = process.env.NAGI_HOST?.trim() || "127.0.0.1";
const isLoopback = host === "127.0.0.1" || host === "localhost" || host === "::1";

/**
 * 绑到非回环地址就**必须**配 `NAGI_AUTH_TOKEN`，否则拒绝启动。
 *
 * 不是洁癖：没有 auth token 时，`Authorization: Bearer` 会被当成使用者自带的
 * LLM key（BYOK 的设计），也就是说**任何人都能直接访问**——
 * 而这个服务上有 `/api/history`（完整对话记录）、`/api/state`（关系数值）、
 * `/api/save/export`（整份存档）。同一个 wifi 下的任何设备都能把它们读走。
 *
 * 咖啡馆、公司网络下这就是把私人对话摊开。宁可起不来，也不要静默暴露：
 * 少一个环境变量是 30 秒的事，泄露了是收不回的。
 */
if (!isLoopback && !process.env.NAGI_AUTH_TOKEN?.trim()) {
  console.error(
    `拒绝启动：监听地址是 ${host}（非本机），但未配置 NAGI_AUTH_TOKEN。\n` +
    `\n` +
    `不配 token 时任何人都能读走 /api/history（完整对话记录）、\n` +
    `/api/state（关系数值）与 /api/save/export（整份存档）。\n` +
    `\n` +
    `在 .env 里加一行即可，值随便定：\n` +
    `  NAGI_AUTH_TOKEN=<你自己定一串>\n` +
    `\n` +
    `然后在客户端的「API Key」栏填这同一串——不是模型 key。\n` +
    `配了 token 之后 Authorization 归鉴权用，模型 key 由服务端的\n` +
    `NAGI_DEV_LLM_KEY 提供（见 resolveLlmKey）。手机上因此不必也不该\n` +
    `存模型 key：它一直留在这台机器上。\n` +
    `\n` +
    `若要让客户端自带模型 key（BYOK），得让它发 x-llm-key 请求头——\n` +
    `多数现成客户端不支持自定义请求头，那条路对它们是走不通的。`,
  );
  process.exit(1);
}

const server = createHttpServer();

server.listen(port, host, () => {
  console.log(`Nagi local server listening on http://${host}:${port}`);
  if (!isLoopback) {
    console.log("已绑到非本机地址，同网段设备可访问。鉴权已开启（NAGI_AUTH_TOKEN）。");
  }
});
