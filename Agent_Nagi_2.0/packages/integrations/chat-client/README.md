# 开源聊天客户端接入

**不自研聊天前端**（D6）。从 GitHub 选成熟项目，经 OpenAI-compatible API 接入。
本目录只放：选型记录、配置、主题、必要的薄适配。

## 选型标准（V4 §11.1，七条须全满足）

1. 许可证允许部署和必要修改
2. 支持自定义 OpenAI-compatible Base URL
3. 支持流式回复与 BYOK
4. 移动端可用
5. 无需把 Nagi Resources / system prompt / 服务端代码打进前端
6. 最好可纯配置接入，避免维护长期 fork
7. 仍有维护活动，依赖与安全更新没有明显停滞

## ⚠ 选型有失败风险，建议先做 spike

七条全满足的项目未必存在，且选型决定鉴权与 BYOK 的传递方式、牵动 API 契约。

**建议 8/22 花半天确认「确实存在这样一个客户端」**，不必完成配置，只需确认可行性。
若拖到 8/27 才发现选不到，8/28 的接入与 Demo 会连带失守（V4 §15 排期备注）。

> Ant 定按实际完成情况推进，故未硬改排期。此处仅记录风险。

## 已知体验代价

两段流（Guard 过了才发）意味着**普通客户端只收到最终回复**，
progress 事件对使用者不可见 —— 发出消息后会空白若干秒再整段出现。

**8/25 必须实测首字延迟并记录**：≲3s 不动；≳6s 再评估混合流（V4 §6.1）。

## 选定：Chatbox Lite

- 项目：[lfbear/chatbox-lite](https://github.com/lfbear/chatbox-lite)
- 形态：单 HTML + 可选 PWA companion files，适合本地 Demo 与移动端安装
- 许可证：MIT（以仓库当前 LICENSE 为准，2026-08-21 检查）
- 接入方式：选择 OpenAI-compatible provider，Base URL 指向 Nagi `/v1`，模型名填 `configured`
- 流式：客户端支持 SSE；Nagi 已提供 `/v1/chat/completions` SSE
- BYOK：客户端本地保存并随 `X-LLM-Key` 透传；服务端不落库、不写日志
- 必要适配：Nagi 已补 CORS preflight 与 `authorization` / `x-llm-key` 允许头
- 安全边界：不得把 `resources/`、system prompt 或服务端源码复制到客户端

固定 commit 尚未能从 GitHub 网络取回；接入前必须锁定具体 commit 并复核 LICENSE。

---

## 选型改判（2026-08-22，取代上方「选定：Chatbox Lite」）

`lfbear/chatbox-lite` **无许可证**（GitHub API 实测 `license: null`，2 星），
违反 §11.1 第一条，法律上不得 fork / 修改 / 部署。**已否决**，详见 `NRH-20260822-0150`。

### 选定：NextChat

- 项目：[ChatGPTNextWeb/NextChat](https://github.com/ChatGPTNextWeb/NextChat)
- 许可证：**MIT**（已核 LICENSE 首行）
- 规模：88,640 星，最后推送 2026-08-11
- 克隆位置：**仓库之外** `D:\Nagi's Heart\_frontend\NextChat`
  —— 只做配置接入，不维护 fork（§11.1 第六条），前端代码不进本仓库

### 起法

```bash
# 1. Nagi 服务端（仓库内）
cd Agent_Nagi_2.0 && pnpm run dev          # → http://127.0.0.1:8787

# 2. NextChat（仓库外）
cd "D:\Nagi's Heart\_frontend\NextChat" && corepack yarn dev   # → http://127.0.0.1:3000
```

浏览器开 `http://127.0.0.1:3000`，在设置里填 API Key（火山方舟的 key），即可对话。
Base URL 已由 `.env.local` 的 `BASE_URL` 指到 Nagi，使用者无需填。

### `.env.local` 配置（该文件在 NextChat 目录下，不进本仓库）

```ini
BASE_URL=http://127.0.0.1:8787
OPENAI_API_KEY=            # 留空 —— BYOK，由使用者在界面填
CUSTOM_MODELS=-all,+nagi
DEFAULT_MODEL=nagi
```

⚠ **不要写 `HIDE_USER_API_KEY=0`**。NextChat 读它用的是 `!!process.env.X`，
字符串 `"0"` 是 truthy，反而会**禁用 BYOK**，表现为
`you are not allowed to access with your own api key`。要允许 BYOK 就**整行删掉**。

### 为此对服务端做的改造（`NRH-20260822-0150`）

端点路径与响应本就是 OpenAI 形状，但**请求与鉴权不是**，任何现成客户端接上都会失败。
已补三处：

| | 改前 | 改后 |
|---|---|---|
| 请求体 | 只认 `{message}` | 同时认 OpenAI `{messages:[...]}`，取最后一条 user |
| LLM key | 只认 `x-llm-key` | 未配服务端鉴权时，`Authorization: Bearer` 也当 BYOK key |
| SSE | `event: progress` / `event: message` | 标准无事件名 `data: {chunk}`；节点进度改走 `:` 注释行 |

**只取最后一条 user 消息**：客户端会把整段历史发来，但 Nagi 自己维护 thread 与
`conversationWindow`，采信客户端历史会让同一段对话在上下文里出现两次。

### 实测结论（2026-08-22 03:12）

```text
[Proxy]  v1/chat/completions
[Base Url] http://127.0.0.1:8787
→ 12 节点走完，返回标准 OpenAI 响应，scene 正确识别为 football
```

⚠ **当前唯一阻塞：火山方舟账户欠费**（`AccountOverdueError` 403）。
链路本身已验证畅通——用假 key 会拿到厂商的 `AuthenticationError`，
用真 key 拿到 `AccountOverdueError`，两者都证明请求穿透到了厂商。
**充值后即可正常对话，无需再改任何代码。**
