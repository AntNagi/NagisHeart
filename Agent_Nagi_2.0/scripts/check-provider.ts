/**
 * Provider 自检。填完 key 先跑这个，再去开界面——
 * 免得在 UI 里对着一句报错猜是 key 错、网络不通还是账户问题。
 *
 * 用法：pnpm run check
 *
 * 逐层验证，**每层单独报告**，坏在哪一层一目了然：
 *   ① 环境变量读到没有（.env 加载）
 *   ② 网络能不能到厂商（代理是否生效——Node fetch 不读 HTTP_PROXY，见下）
 *   ③ key 与账户是否有效（真实发一次最小请求）
 */
import { createProviderFromEnvironment } from "../packages/server/src/provider-config.js";

const endpoint = process.env.NAGI_LLM_ENDPOINT?.trim();
const main = process.env.NAGI_LLM_MODEL?.trim();
const aux = process.env.NAGI_LLM_MODEL_AUX?.trim();
const key = process.env.NAGI_DEV_LLM_KEY?.trim();

const mask = (value: string): string =>
  value.length < 8 ? "(太短)" : `${value.slice(0, 2)}…${value.slice(-2)}（${value.length} 字符）`;

console.log("① 配置");
console.log(`   endpoint : ${endpoint ?? "(空)"}`);
console.log(`   main     : ${main ?? "(空)"}`);
console.log(`   aux      : ${aux ?? "(未配，将跳过记忆抽取)"}`);
console.log(`   key      : ${key ? mask(key) : "(空)"}`);
if (!endpoint || !main || !key) {
  console.error("\n✗ 配置不全。检查 .env 的 NAGI_LLM_ENDPOINT / NAGI_LLM_MODEL / NAGI_DEV_LLM_KEY");
  process.exit(2);
}

console.log("\n② 网络");
// Node 的 fetch **不读** HTTP_PROXY / HTTPS_PROXY 环境变量。
// curl 能通不代表 Node 能通——这点坑过一次。
// package.json 的脚本已加 --use-env-proxy（Node 内置，零依赖）。
const proxy = process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY;
console.log(`   代理变量 : ${proxy ?? "(未设置，直连)"}`);
try {
  const origin = new URL(endpoint).origin;
  const started = Date.now();
  const probe = await fetch(origin, { signal: AbortSignal.timeout(20_000) });
  console.log(`   可达     : ${origin} → HTTP ${probe.status}（${Date.now() - started}ms）`);
} catch (error) {
  console.error(`   ✗ 连不上：${error instanceof Error ? error.name : String(error)}`);
  console.error("     若 curl 能通而这里不通，多半是 Node 没走代理——");
  console.error("     确认启动命令带了 --use-env-proxy（pnpm run dev / check 已内置）。");
  process.exit(3);
}

console.log("\n③ key 与账户");
const provider = createProviderFromEnvironment();
if (!provider) {
  console.error("   ✗ Provider 未创建，回查①");
  process.exit(2);
}
for (const capability of ["main", "aux"] as const) {
  if (!provider.hasSlot(capability)) {
    console.log(`   ${capability.padEnd(5)}: 未配置，跳过`);
    continue;
  }
  try {
    const result = await provider.complete({
      model: capability,
      messages: [{ role: "user", content: "回复两个字：收到" }],
      maxTokens: 200,  // 思考型模型会先烧一批 token，16 太小会拿到空正文
    }, { apiKey: key });
    console.log(`   ${capability.padEnd(5)}: ✓ ${result.model} · ${result.latencyMs}ms · ${JSON.stringify(result.text)}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`   ${capability.padEnd(5)}: ✗ ${message}`);
    // 把最常见的三种失败翻译成可执行的下一步，省得对着厂商错误码查文档。
    if (/Overdue|balance/iu.test(message)) console.error("     → 账户欠费，去厂商控制台充值。代码无需改动。");
    else if (/key format|Authentication|invalid.*key/iu.test(message)) console.error("     → key 不对。确认复制的是 API Key 本身，不是 key 的名称。");
    else if (/NotOpen|not activated/iu.test(message)) console.error("     → 该模型未开通，去控制台「开通管理」开通后稍等生效。");
    process.exitCode = 1;
  }
}
if (!process.exitCode) console.log("\n✓ 全部通过，可以去 http://127.0.0.1:3000 聊了。");
