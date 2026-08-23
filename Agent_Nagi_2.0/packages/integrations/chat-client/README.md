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

---

## Chatbox 定制记录（2026-08-23）

fork 位置 `D:\nagi-frontend\chatbox`，**不进本仓库**（GPL-3.0，且前端代码不入库）。

### 1. 多气泡

`src/renderer/components/chat/nagi-beats.ts`（纯函数 + 单测）+ `Message.tsx`。
assistant 一次多句时按换行拆成多个气泡。

**不需要队列或定时器**：服务端本就按 beat 分段推流（间隔 `BEAT_GAP_MS` 240ms），
内容一段段到达，气泡自然逐个出现。

**不改** `message-render-items.ts`——其注释警告分组与 Virtuoso 列表项索引绑定，
在那层拆会让 `scrollToMessage` 错位。拆分只发生在单条消息内部，列表项数不变。

### 2. 功能裁剪 —— 用开关，不删代码

顺着 Chatbox 自己已有的 `src/renderer/utils/feature-flags.ts` 扩展。

关掉：生成图片、Copilots、联网搜索、文档解析、知识库、MCP、技能、
Chatbox AI 推广及其设置页、默认模型设置页、Dev Tools、关于、帮助、
首次运行引导（会调 Chatbox 自家后端且挡住设置页）、内置示例会话。

保留：会话列表与聊天、模型提供方设置、对话设置、归档、快捷键、通用设置。

**为什么不删代码**：1300+ commits 的活跃上游，删代码牵连面不可控，
且上游出安全更新时合不进来。开关的用户可见效果完全一样，
但改动集中在一个文件 + 若干处 `if`，合并成本几乎为零，回看只需改一个 `false`。

### F35 — 清理内置示例会话踩的三个坑 —— 【已验证】

值得完整记下来，因为**每一个都让「改了但没效果」看起来像「代码写错了」**。

**坑一：样板会话从两个地方种下。**
`setup/init_data.ts` 种 `defaultSessions*`；`stores/migration.ts` 在版本迁移时
**另外补种** imageCreator / artifact / mermaid。只堵第一处，「贪吃蛇」「做图表」照样在。
⇒ 改按 id 白名单（`setup/nagi-builtin-sessions.ts` 收齐 `initial_data` 的全部导出），
堵种下的地方是堵不完的。

**坑二（真正的元凶）：清理挂错了生命周期。**
`initData` **只在 `configVersion === 0`（真正的全新安装）时**才被 migration 调用。
已安装的库 `configVersion` 是 12，那段代码**一次都没执行过**——
前两轮改动全部无效，而现象与「白名单不全」完全一样，极易误判。
⇒ 改由 `index.tsx` 的 `initializeApp` 每次启动调用。

**坑三：侧栏读的是另一个库。**
会话列表来自 IndexedDB `chatbox-session-meta`，不是 `chatboxstore`。
只删后者不会让列表变化。

**验证方式（现象消失，非代码推断）**：手动往 `chatbox-session-meta` 种入内置 id
`81cfc426-…`（小红书文案生成器），刷新后该条消失，自建会话原样保留。

⚠ 清理**按 id 不按名字**：使用者可能把自己的会话起名叫「Markdown 101 (Example)」。
误删聊天记录不可逆，宁可漏删不可错删。已用两条单测锁住。

### 已知：`migration.test.ts` 是上游自带的红

`git stash` 掉本项全部改动后它照样失败（`settingsStore` 的 theme/language
过不了 zod 校验）。与定制无关，未处理。

### 起法

```bash
cd /d/nagi-frontend/chatbox && npx vite --config vite.config.web.ts
```

**不要用 `pnpm dev`**——那会走 Electron，而 Electron 二进制在本机代理下拉不到。

---

## Android 构建（2026-08-23）

**部署形态**：电脑跑服务端（含模型 key），Android 客户端经**局域网**连过来。
不部署云服务器。手机上只存 `NAGI_AUTH_TOKEN`，**不存任何厂商凭证**——手机丢了也不泄露 key。

### 上游社区版没有原生工程脚手架

Chatbox CE 有 Capacitor 依赖与 `mobile:sync:android` 之类的脚本，
但**没有 `capacitor.config.ts`，也没有 `android/` 目录**——那部分在他们的 pro 仓库。
需自建：`capacitor.config.ts` + `npx cap add android`。

`webDir` 必须是 `release/app/dist/renderer`（与 `electron.vite.config.ts` 的
production 产物目录一致）。写错的话 `cap sync` 会把空目录拷进 APK，
装上去一片白屏，**且不报任何错**。

### 明文 HTTP 必须显式放开

Android 9 起默认禁止明文流量，而服务端是 `http://<电脑IP>:8787`——
局域网自用，不该为此搞 HTTPS。已在 `capacitor.config.ts` 配
`android.allowMixedContent` + `server.cleartext`。

不开的话手机上表现为**请求直接失败且 WebView 不给任何提示**，看起来像服务器没开。
⚠ 真要公网部署必须换 HTTPS 并关掉这两项。

### 构建环境的两个坑

**Gradle wrapper 不读 `HTTP_PROXY` 环境变量。**
必须在 `android/gradle.properties` 里写 `systemProp.http(s).proxyHost/Port`。
不配的表现是 `Connect timed out` 拉不到 `gradle-*.zip`，
看起来像 Gradle 版本有问题，实际是根本没走代理。

**改用缓存里已有的 Gradle 版本，别重下**（Ant 提出）。
`~/.gradle/wrapper/dists` 里：
- `gradle-8.11.1-all`（Chatbox 原本要的）**只有 `.part`**，是失败残骸，从未下成
- `gradle-8.13-all` **完整**（带 `.ok`），主仓库的 Android 项目在用

已把 `gradle-wrapper.properties` 改指 8.13。AGP 8.7.2 与之兼容。

⚠ **不能加 `--offline`**：AGP 8.7.2 与 google-services 等依赖不在本机缓存里
（主仓库用的是别的版本），离线会直接失败。Gradle 本体复用缓存、依赖走代理下载。

### 服务端接局域网

```bash
NAGI_HOST=0.0.0.0 pnpm run dev
```

`index.ts` 会在绑非回环地址而未配 `NAGI_AUTH_TOKEN` 时**拒绝启动**——
不配 token 时任何人都能读走 `/api/history`（完整对话记录）与 `/api/save/export`。

**实测**（2026-08-23）：`curl http://192.168.1.3:8787/v1/models` 带 token 返回正常。

**防火墙需人工放行**（改防火墙属系统安全设置，agent 不代劳）：

```powershell
New-NetFirewallRule -DisplayName "Nagi Runtime 8787" -Direction Inbound -LocalPort 8787 -Protocol TCP -Action Allow -Profile Private
```

`-Profile Private` 是有意的：只在标记为「专用网络」的 wifi 生效，公共 wifi 下自动不放行。

### 两个运行期注意

1. **电脑 IP 会变**。路由器 DHCP 重新分配后手机上填的地址失效，
   现象是「突然连不上」。建议路由器里绑固定 IP。
2. **电脑睡眠 = 手机断线**。要「一直开着」就得关掉自动睡眠。

---

## 从 Chatbox 改造成凪专属（2026-08-23，Ant 授权自主设计）

Ant：「现在这个 App 太 chatbox 了，改成 Nagi 专属，从 UI 和交互、功能等等。
改造的地方你自己想。」

### 设计原则：客户端不替他说话

贯穿这一版的一条线：**凪的语气只从服务端来**。

UI 文案一律中性（「说点什么」而非模仿他的口吻），
凡是断言他的习惯、状态、性格的内容，一律由服务端 `resources/` 声明、
客户端只负责显示。这既是域 B 红线（客户端不持有人格资料），
也更诚实——App 自己编两句"凪风"文案，和真正的他会说的话是两回事。

### 做了什么

| | 说明 |
|---|---|
| **此刻在做什么** | 侧栏与空状态显示他在干嘛。值来自 `/api/presence` |
| **配色** | 科技蓝 → 雾紫（银白发淡紫瞳）。低饱和是刻意的，高饱和的紫太张扬 |
| **图标 / 启动图** | 一个「凪」字，深底雾紫。留白比元素多 |
| **他记得的事** | 设置里新增一页，列出他从对话里记住的事。放第一位 |
| **文案** | 「Chatbox」→「凪」；去掉版本号；空状态不再是「我能帮你什么」 |

### F37 — 改默认值对已安装的库无效（第三次踩） —— 【已验证】

品牌色这一处绕了三圈，值得单独记，因为**这是本项目反复出现的同一类坑**：

1. 写 CSS 覆盖 → 输给 `useAppTheme` 运行时写的**行内样式**
   （行内优先级高于任何 CSS 规则，`:root:root` 提高特异性也没用）
2. 改 `DEFAULT_INTERFACE_COLORS` → 已装的库里 `interfaceColors` **已有值**，
   默认值永远轮不到
3. 写一次性迁移改存储 → 迁移跑在 store **水合之前**，读到的是默认值（已是紫的），
   判定"不需要迁移"直接返回，随后水合又把旧蓝加载回来

最终改在 `resolveInterfaceBrandColor`——**所有读取的必经之路**，
不碰存储、不受生命周期影响，且只映射恰好等于上游蓝的值
（使用者自己挑过的颜色不替他做主）。

⚠ 与「示例会话清不掉」（F35 坑二）**是同一个模式**：
改默认只对全新安装生效。本项目已踩三次，下次遇到"改了没效果"先问这一句。

### 两个实测抓到的细节

**状态必须共享**：`usePresence` 被侧栏与空状态同时使用，而服务端在同一时段
多个候选里随机取一条 —— 各自请求会出现「侧栏睡着、中间睡死了」。
实测撞上了，改为模块级共享 + 单一轮询定时器。

**presence 静默失败、memories 显示失败**：两者刻意相反。
presence 少一行字无所谓；而「他什么都不记得」和「没连上服务器」看起来
一模一样，不分清会被误判成记忆系统坏了。

### 未做（留给下一轮）

- 关系状态（trust / intimacy / friction）的呈现。数据在 `/api/state`，
  但**直接显示数值会很游戏化**，破坏沉浸感，需要先想清楚怎么表达
- 时段跟着**使用者**作息走，而非假定标准作息（见 `presence.md` 的低把握登记）
- 凪主动发起对话。V4 §14.4 明确后置，且需要推送能力

---

# Chatbox 配置清单（2026-08-23）

> 本节是**可回查的参照表**。Chatbox 自带几十项个性化配置，按「对凪这个产品有没有用」
> 分三类。改动一律走 `src/renderer/utils/feature-flags.ts` 的开关机制，**不删代码**
> （理由见前文「功能裁剪」一节）。
>
> 界面来源：`src/renderer/routes/settings/chat.tsx`

## 一、保留

| 界面项 | store key | 为什么留 |
|---|---|---|
| 气泡布局 | `messageLayout` | **多气泡依赖它**（`nagi-beats.ts`） |
| Show Avatar | `showAvatar` | 陪伴感 |
| show message timestamp | `showMessageTimestamp` | 同上 |
| Background Image / Opacity | `backgroundImageKey` / `backgroundImageOpacity` | 正好接已有的 `assets/bg/` |
| User Avatar | `userAvatarKey` | |
| Stream output | — | 两段流的前提 |
| Spell Check | `spellCheck` | 无害 |

**`Markdown Rendering`（`enableMarkdownRendering`）留但建议默认关**：
凪的台词不该有 markdown，开着时模型偶尔吐出的 `*` `#` 会被渲染成样式。
归一层已剥掉这些符号（`nagi-beats.ts`），关掉是双保险。

## 二、该藏

### A 组 · 概念冲突 —— **优先级最高**

| 界面项 | store key |
|---|---|
| Auto Compaction | `autoCompaction` |
| Compaction Threshold | `compactionThreshold` |
| Context Management / Context | — |
| Inject default metadata | `injectDefaultMetadata` |

**上下文管理在服务端**（Context Builder 装配 13 类块）。客户端这几个开关调的是
Chatbox 自己那套压缩逻辑，对我们**毫无作用**——用户以为调了上下文，其实什么也没调。

`Inject default metadata`（往消息里塞模型名、当前日期）**更危险**：
那些内容会混进发往服务端的消息，**污染凪看到的输入**。

### B 组 · 通用 AI 助手功能

| 界面项 | store key |
|---|---|
| Auto-Generate Chat Titles | `autoGenerateTitle` |
| LaTeX Rendering | `enableLaTeXRendering` |
| Mermaid Diagrams & Charts | `enableMermaidRendering` |
| Auto-preview artifacts | `autoPreviewArtifacts` |
| Auto-collapse code blocks | `autoCollapseCodeBlock` |
| Paste long text as a file | `pasteLongTextAsAFile` |
| Temperature | — |

`Auto-Generate Chat Titles` 会**额外调一次模型**给对话起标题——烧额度，
且标题是 AI 助手口吻。

`Temperature` 该藏是因为**采样参数归服务端**：凪的表现是按特定设置标定的
（`NRH-20260821-2037` 的 30 条对抗用例即在默认设置下跑出），客户端改了要么无效、
要么破坏标定。

### C 组 · 调试信息

| 界面项 | store key |
|---|---|
| show model name | `showModelName` |
| show first token latency | `showFirstTokenLatency` |
| show message token count | `showTokenCount` |
| show message token usage | `showTokenUsed` |
| show message word count | `showWordCount` |
| Cost | — |

⚠ **这组开发时有用**。建议挂在一个开关下（可复用 `nagiDevTools`）统一开关，
而不是硬藏——排查问题时还要看。

## 三、暂不处理 —— 玩家层入口

| 界面项 | store key |
|---|---|
| Prompt | `defaultPrompt` |
| Default Assistant Avatar | `defaultAssistantAvatarKey` |

**现状：填了不生效。**【已验证】服务端 `lastUserMessage`（`http.ts`）
**只取最后一条 user 消息**，客户端发来的 system 消息与历史全部丢弃——
当初这么写是为避免同一段对话在上下文里出现两次，副作用是玩家层配置进不来。

⚠ 这比没有更糟：用户会以为生效了。

**先别藏**：这是玩家层的入口，接线方案定了之后要用（见 `NRH-20260823-027`）。
藏掉将来还要恢复。

## 建议的开关命名

```
nagiContextControls   // A 组，概念冲突，优先
nagiGenericAiFeatures // B 组
nagiDebugInfo         // C 组，可留给开发用
```
