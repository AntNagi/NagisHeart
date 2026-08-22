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

---

## 本地补丁（必须记录，升级 NextChat 后要重新打）

我们**不维护 fork**（§11.1 第六条），但下面这个是**中文使用者的阻塞级 bug**，
无法靠配置绕开，故在本地源码打了最小补丁。

### 补丁 1：中文输入法选词的 Enter 被当成发送

**文件**：`app/components/chat.tsx` 的 `shouldSubmit`

**现象**（Ant 实测）：打中文时按 Enter 选候选词，字还在输入框里，
气泡已经发出去了。

**根因**：`compositionend` 在 `keydown` **之前**触发。等 keydown 走到时，
`isComposing.current` 已被置回 false、`e.nativeEvent.isComposing` 也是 false
⇒ NextChat 原有的三道守卫（`keyCode 229` / `nativeEvent.isComposing` /
`isComposing.current`）**全部失效**。

**补丁**：记录 `compositionend` 的时刻，合成结束后 120ms 内的 Enter 一律不当发送。
120ms 足以覆盖同一次按键引发的事件对，又短到不会误吞用户紧接着的第二次 Enter。

```ts
const compositionEndedAt = useRef(0);
// onCompositionEnd 里：compositionEndedAt.current = Date.now();
// shouldSubmit 里：
if (e.key === "Enter" && Date.now() - compositionEndedAt.current < 120) return false;
```

**零代码的替代方案**（若不想打补丁）：设置里把「发送键」改成 `Ctrl + Enter`，
plain Enter 就不再触发发送。代价是改变输入习惯。

### 升级流程

`git pull` NextChat 后，重新检查 `shouldSubmit` 是否已被上游修复；
若未修复，按上面重新打一次补丁。

### ⚠ 补丁 1 未验证有效（2026-08-22，暂停）

打了两次都没解决，Ant 实测「一点作用都没有」，遂暂停。

**已确认的事实**：
- 补丁代码确实进了编译产物（`.next/static` 与 `.next/server` 均可 grep 到 `compositionEndedAt`）
- 第一次失败是因为 Next.js 没重编译该组件，测到的是旧 bundle；第二次清了 `.next` 缓存

**未能验证的**：补丁对真实中文输入法的行为。
自动化环境**无法模拟输入法合成事件**（compositionstart/end），
只能验证代码在不在，验证不了它拦没拦住。⇒ 每改一次都要 Ant 手动实测，代价过高。

**恢复这条工作时的建议**：
1. 先试**零代码方案**：设置 →「发送键」改成 `Ctrl + Enter`。
   plain Enter 从此不触发发送，绕开整个竞态。**没试过，但原理上必然有效**
   （`shouldSubmit` 要求 `e.ctrlKey`，选词的 Enter 不带 ctrl）
2. 若仍要修补丁：120ms 窗口是拍的，不同输入法的事件间隔不同，可加到 300ms 再试
3. 或换个客户端——本条属于 NextChat 自身缺陷，不是 Nagi 服务端问题

---

## 选型改判（2026-08-22 晚，取代上方「选定：NextChat」）

NextChat 的中文输入法问题未能修复（Ant：「一点作用都没有，感觉你控制不了前端代码」），
工作暂停。Ant 改选 **Chatbox**，并明确要用源码、要自己改。

### 选定：Chatbox Community Edition

- 项目：[chatboxai/chatbox](https://github.com/chatboxai/chatbox)
- **锁定 commit：`348d3875c1bffa3899539e61fa960d6ccb3ccafb`**（2026-08-14）
- 许可证：**GPL-3.0**（已核 LICENSE 首行）。自用不触发分发义务；
  **若日后分发修改版，必须以 GPL-3.0 公开源码**
- 平台：Windows / macOS / Linux 桌面 + iOS / Android 原生 + Web
- 七条筛选标准（§11.1）**全满足**

### ⚠ 克隆位置改为 `D:\nagi-frontend\chatbox`（不再放 `D:\Nagi's Heart\_frontend\`）

**原因：路径里的撇号会让 Chatbox 根本无法启动。**

TanStack Router 的代码分割插件生成 import 语句时用单引号包路径：

```
import('D:/Nagi's Heart/_frontend/chatbox/src/renderer/routes/about.tsx')
                 ^ 撇号提前终止字符串
```

每个路由文件都报 `Unexpected token, expected ","`。NextChat 没这问题是因为
Next.js 不用这套代码生成——**旧约定对 Chatbox 不成立**。搬走后报错归零。

### 已知安装问题

- **Node 版本**：Chatbox 声明 `engines.node >=22.13.0 <23.0.0`，且 `.npmrc` 里
  `engine-strict=true`。本机是 Node 24，需 `pnpm install --config.engine-strict=false`。
  纯 web 开发下实测无碍；**要打包桌面版时应改用 Node 22**（原生模块 ABI 需与 Electron 对齐）。
- **Electron 二进制下载失败**（走代理拉 GitHub release 断流）。
  纯 web 模式用不到，不影响开发。

### 起法（纯 web，秒级热更新）

```bash
cd /d/nagi-frontend/chatbox && npx vite --config vite.config.web.ts
```

访问 `http://localhost:1212`。**不要用 `pnpm dev`**——那会走 Electron，需要上面那个下不来的二进制。

### 接入配置（已实测通过）

引导页是首次运行门禁（`onboardingStore.completed` + `settingActions.needEditSetting()`）。
设置存在 IndexedDB `chatboxstore` / `keyvaluepairs` / `settings`（JSON 字符串）。

自定义 provider 形状：

```js
settings.customProviders = [{ id: 'nagi', name: 'Nagi Runtime', type: 'openai', isCustom: true }]
settings.providers['nagi'] = {
  apiKey: '<NAGI_AUTH_TOKEN>',
  apiHost: 'http://127.0.0.1:8787',      // 不带 /v1，Chatbox 自己拼
  models: [{ modelId: 'nagi', type: 'chat', apiStyle: 'openai', nickname: '凪 誠士郎', contextWindow: 20000 }],
}
settings.defaultChatModel = { provider: 'nagi', model: 'nagi' }
```

**API Key 栏填的是 `NAGI_AUTH_TOKEN`，不是模型 key**——配了服务端鉴权后
Authorization 归鉴权用，模型 key 由服务端 `NAGI_DEV_LLM_KEY` 提供，
客户端与手机上因此不存任何厂商凭证。

### 实测结果（2026-08-22 23:xx）

```
GET  /v1/models          → 200 OK     （F34 补的端点，Chatbox 连上来第一件事就调它）
OPTIONS /v1/chat/...     → 204        （CORS 预检）
POST /v1/chat/completions → 200 OK
```

凪的回复（存进会话的原始形状）：

```json
{"role":"assistant","content":[{"type":"text","text":"……又问？\n不是说了在趴着。"}]}
```

**一条消息、内含 `\n` 分隔的两句**——这正是多气泡改造的输入。

### 待改：多气泡（Ant 定「每句依次冒出来」）

- 切口：`src/renderer/components/chat/Message.tsx` 的 `isBubbleLayout` 分支，
  气泡是 `px-4 py-1 rounded-lg` + 背景色的 div，assistant 内容整段塞在里面
- **不改** `message-render-items.ts`：其注释警告分组与 Virtuoso 滚动索引绑定，
  拆列表项会让「滚动到某条消息」错位
- **不需要队列或定时器**：服务端已按 beat 逐条推流（间隔 `BEAT_GAP_MS` 240ms），
  按 `\n` 拆气泡后，内容本就是一段段到达，气泡会自然逐个出现
