> # ⚠ 本文已作废（2026-08-20）
>
> V3 原始路线以自写 Pipeline 为主，后续又混入 LangGraph 修订，版本内存在两套口径。
> **落地依据以 `Nagi_Runtime_Harness_Technical_Design_V4_LangGraph.md` 为准。**
> 本文仅作历史保留，不得作为开发依据。

# Nagi Runtime Harness — 技术方案 V3（客户端 / 服务端）

- 文档性质：技术设计（TDD）
- 日期：2026-08-20
- 状态：**待 Ant 评审**
- **本文取代 V1、V2。** 两者仅作历史保留，不得作为落地依据
- 与立项书冲突处以本文为准，并回写立项书

---

## 0. V2 → V3 变更

Ant 2026-08-20 定：**按部署服务器的方式做**，不走「先纯客户端、再迁服务端」的分期。

理由是 V2 附录 A 的分析结论：Ant 要的四条（资料不被拿到 / 改资料不发版 / 跨设备同步记忆 / 资料与 App 分离）里，**前两条中的第一条和第三条只有服务端能满足**，而且资料要真保密就必须是**服务端组 prompt**，不是服务端存文件让客户端下载。既然终态如此，不如直接建。

BYOK 已定，本文不再论证：**谁用谁配自己的 key**，随请求透传，服务端用完即弃、不落库。

### 0.1 关键收益：B4 消失

V2 最大的遗留问题是「静态站部署 ⇒ `resources/` 全部公开可下载」，涉及 authority 派生物公开，属红线范畴。

**V3 下资料只存在于服务端，从不下发给客户端。** 这个问题不再存在：

- 客户端产物里没有任何 `resources/` 内容
- 仓库设为 **private**，源码里的资料也不公开
- 客户端仍可公开访问（用支持 private repo 的免费静态托管，见 §16）

### 0.2 什么变了

| 层 | V2（纯客户端） | V3 | 变化 |
|---|---|---|---|
| L0 资源 | 打包进浏览器产物 | **只在服务端** | 位置变，格式不变 |
| L1 状态 | IndexedDB | **服务端数据库** | 换实现，模型不变 |
| L2 记忆 | IndexedDB + 内存向量 | **服务端**，向量常驻进程内存 | 换实现，分层与排序不变 |
| L3 Context 装配 | 浏览器 | **服务端** | **算法一字不改** |
| L4 Pipeline | 浏览器 | **服务端** | 代码不变，换运行位置 |
| L5 UI | Preact | **Preact，只剩 UI** | 大幅简化 |
| — | — | **新增：API 层、多用户隔离、限流** | 全新 |

**L0–L4 的代码一行不用改**——V2 §3 定的「core 零依赖纯 TS、能在 Node 里跑单测」这条判据，其副产品正是「能直接跑在 Node 服务端上」。这次转向验证了那条约束的价值。

### 0.3 客户端反而变简单了

V2 里客户端要用 IndexedDB 存 state / memory / vectors，跟浏览器的异步存储 API 搏斗。
V3 下这些全在服务端，用正常数据库做。**客户端只剩 UI + 少量本地缓存**。

净排期影响：新增 API 层与多用户隔离，但省掉了整个浏览器端存储层。**大致持平。**

### 0.4 代价（须明说）

| 代价 | 说明 |
|---|---|
| **不能离线聊天** | 必须联网。PWA 只能离线查看历史对话 |
| **有运维了** | 服务要活着。免费档会休眠，首次请求有冷启动延迟 |
| **成为多用户服务** | 需要记忆隔离、限流、存储配额。见 §6 |
| **你在链路里** | 使用者的 key 和对话经过你的服务器。虽不落库，但需在界面上明示 |

---

## 1. 决策前提

### 1.1 已定

| # | 决策 | 工程含义 |
|---|---|---|
| D1 | **时间锚 = 通关之后的「现在」** | 剧情全量可见。记忆分 Canon（只读）/ Live（可写） |
| ~~D2~~ | ~~Python + LangGraph~~ | 已作废 |
| ~~D2′~~ | ~~纯客户端静态站~~ | 已作废 |
| **D2″** | **TypeScript，客户端 + 服务端。服务端承担 L0–L4** | 见 §3 |
| D3 | **派生 Agent 专用资源包** | 仍需立 decision_log（B2），但**不再涉及公开问题** |
| D5 | **LLM 接入配置驱动，首选免费 Gemini** | 业务只认 `main`/`aux` 档位 |
| **D6** | **BYOK：谁用谁配自己的 key，透传不落库** | §15 |
| **D7** | **手机端：先 PWA，之后 Capacitor 打 APK** | §14 |

### 1.2 待定（阻塞项）

| # | 问题 | 阻塞谁 | 建议 |
|---|---|---|---|
| B1 | 以哪个结局作为「现在」的起点 | 关系初值、全部 canon memory | TRUE END。已设计为配置项 |
| B2 | **红线豁免未获批** | `resources/` 无法填充 | 需在 `00_harness/01_governance/decision_log.md` 立 DEC 条目 |
| B3 | 人格事实源优先级 | Personality 资源 | fic-writing 管人格规则，V17 管台词风格 |
| ~~B4~~ | ~~资料公开~~ | — | **已消解**（§0.1）|
| **B5** | 服务端托管平台与预算上限 | §4 选型 | 建议长驻 Node 进程，免费档起步 |

---

## 2. 已验证的技术事实（2026-08-20 实测）

| 端点 | 结果 | 等级 |
|---|---|---|
| Gemini `generateContent` | ✅ 浏览器可直连 | 【已验证】|
| Gemini `embedContent` | ✅ 浏览器可直连 | 【已验证】|
| Anthropic `/v1/messages`（无 opt-in 头） | ❌ 被 CORS 拦 | 【已验证】|
| Anthropic（带 `anthropic-dangerous-direct-browser-access: true`） | ✅ 放行 | 【已验证】|

> V3 下模型调用发生在**服务端**，不受 CORS 约束，上表的直接价值下降。
> 但它仍有两个用途：① 证明这些端点从任意来源可达；
> ② 若将来做「本地直连模式」（不经服务器、牺牲保密换隐私），已知可行。

**未验证**：DeepSeek 及其他 OpenAI 兼容端点。接入前逐个实测，不得假设。

---

## 3. 目标架构

```
┌─────────────────────────────────────────┐
│ 客户端  PWA（后续 Capacitor APK）        │
│                                          │
│  L5  UI（Preact）                        │
│      本地缓存：对话历史、设置、同步码     │
│      API key：存本地，随请求透传          │
└────────────────┬────────────────────────┘
                 │ HTTPS（SSE 流式）
┌────────────────▼────────────────────────┐
│ 服务端  长驻 Node 进程                   │
│                                          │
│  API 层    路由 / 鉴权 / 限流            │
│  ─────────────────────────────────────  │
│  L4  Pipeline      自写编排（~150 行）   │
│  L3  Context Assembly  预算装箱  ★核心   │
│  L2  Memory        向量常驻内存          │
│  L1  State         数据库                │
│  L0  Resource      ★ 从不下发            │
└────────────────┬────────────────────────┘
                 │ 用请求带来的 key
┌────────────────▼────────────────────────┐
│ LLM Provider（Gemini / Anthropic / …）   │
└─────────────────────────────────────────┘
```

### 3.1 分层判据（沿用并强化）

`src/core/`（L0–L3）**零依赖纯 TS**：不碰 DOM、不碰框架、不碰 `fetch`、不碰数据库驱动。
外部能力（模型调用、存储）一律经接口注入。

**判据：`src/core/` 必须能在 Node 里跑单测，不需要 HTTP 服务、不需要数据库。**
用 ESLint 的 import 边界规则强制，不靠自觉。

这条约束已经救过一次场：V2→V3 的转向中，L0–L4 代码一行没改。

### 3.2 客户端不许知道的事

客户端**不得**包含：资源正文、装配逻辑、prompt 模板、记忆检索。
它只发一句话，收一句话。

判据：**把客户端整个产物解包，不应能重建出凪的人格资料。**

---

## 4. 服务端选型

### 4.1 结论：长驻 Node 进程，不用 Serverless

| 方案 | 评价 |
|---|---|
| **长驻 Node 进程**（推荐） | 向量常驻内存，检索 < 5ms；无冷启动；core 直接跑，零适配 |
| Serverless（Workers / Deno Deploy / Vercel Functions） | 零运维很诱人，但**无状态与向量常驻内存冲突**：每次冷启动要重载约 15MB 向量。要么外挂托管向量库（多一个依赖和配额），要么改成两段式检索——**为了省运维而改架构，不划算** |

具体平台（Fly.io / Railway / Render / 小 VPS）留到 8/22 部署时按免费额度实测选，**本文不锁定**。要求：

- Node 18+ 长驻进程
- 持久化存储（SQLite 文件卷即可，量级见 §4.2）
- 支持 SSE（流式回复）
- 有免费档或月成本可控（B5 待 Ant 定预算上限）

> ⚠️ 免费档普遍**会休眠**，首次请求有数秒冷启动。若体验不可接受，需要付费档或定时保活。

### 4.2 数据量级

| 数据 | 量级 |
|---|---|
| Canon 记忆（剧本派生） | 300–800 条，全用户共享，只读 |
| Live 记忆 | 每用户每天约 6 条 |
| 向量 | (canon + 全部用户 live) × 768 维 float32 |

单用户一年约 2000 条 live。**十个用户一年仍不到 3 万条向量 ≈ 90MB**，常驻内存无压力。
到百用户级再考虑外挂向量库——检索接口已抽象，换实现不动上层。

数据库：**SQLite（文件）起步**，够用到几十用户。真的涨上去再迁 Postgres，
数据访问已经在接口后面。

### 4.3 向量检索

- Canon 向量**构建期预计算**，随服务端产物分发，启动即加载
- Live 向量写入时计算一次，落库 + 进内存
- 检索：`Float32Array` 全表余弦。混合排序见 §10.3
- 按用户分池：canon 池全局共享，live 池按同步码隔离

---

## 5. API 契约

薄。客户端只发一句话，收一句话。

| 方法 | 路径 | 说明 |
|---|---|---|
| `POST` | `/api/chat` | 主接口。**SSE 流式**返回凪的回复 |
| `GET` | `/api/state` | 拉当前关系状态、scene、mood、记忆条数（状态面板用）|
| `GET` | `/api/history` | 拉历史对话（分页）|
| `POST` | `/api/save/export` | 导出全部记忆与状态为 JSON |
| `POST` | `/api/save/import` | 从 JSON 恢复 |
| `GET` | `/api/health` | 存活检查 |

### 5.1 `/api/chat`

```
请求头：
  X-Sync-Code:  <用户的同步码>
  X-LLM-Key:    <使用者自己的 API key>     ← 透传，不落库（§15）
  X-LLM-Vendor: gemini | anthropic | ...

请求体：
  { "message": "..." }

响应（SSE）：
  event: token   data: {"t":"…"}          ← 逐字，让回复即时出现
  event: state   data: {relationship, scene, mood}
  event: debug   data: {blocks, tokens, dropped, timings}   ← 仅调试模式
  event: done    data: {"turn": 42}
  event: error   data: {"code":"QUOTA|FILTERED|UPSTREAM|…"}
```

**为什么必须 SSE**：服务端每轮要跑 4 次模型调用，整体延迟可能数秒。
不流式的话界面会长时间空白，体感很差。

**`debug` 事件只在调试模式下发**，对外发布时关闭——它包含装配明细，会泄露资料结构。

### 5.2 错误语义

客户端要能区分并给出不同提示：

| code | 含义 | 客户端表现 |
|---|---|---|
| `KEY_INVALID` | key 无效 | 引导去设置页重配 |
| `QUOTA` | 使用者的额度用尽 | 提示等配额恢复 |
| `FILTERED` | 被模型安全过滤拦截 | 已由服务端降级为保守回复，**不报错**，仅日志 |
| `RATE_LIMITED` | 撞本服务的限流 | 提示稍后再试 |
| `UPSTREAM` | 模型厂商故障 | 可重试 |

---

## 6. 多用户（V3 新增的真实成本）

从「单用户玩具」变成「小型服务」，以下不是可选项：

### 6.1 身份：同步码，不做账号系统

- 客户端首次使用生成一个**高熵同步码**（如 128 bit，base32 呈现）
- 服务端只把它当**存储键**，不做注册、不收邮箱、不存任何个人信息
- 换设备输入同码即接上同一份记忆 → **动机③ 达成**
- **丢码 = 丢记忆** ⇒ §9.4 的导出/导入仍必须保留，作为最终保险
- UI 上要显眼地提示保存同步码

比账号系统轻一个量级，且不承担个人数据责任。

### 6.2 隔离

- 所有 live 记忆、状态、对话按同步码分区，查询必带该键
- **canon 记忆全局共享只读**（同一个凪，同一份剧情）
- 服务端任何一处查询漏掉同步码过滤 = 记忆串台。**这条要有针对性单测**

### 6.3 限流与配额

即使 key 是使用者自己的，**你的服务器资源不是**：

| 限制 | 建议初值 | 目的 |
|---|---|---|
| 每同步码每分钟请求数 | 若干 | 防单用户刷爆 |
| 每同步码存储上限 | 记忆条数上限 | 防存储无限增长 |
| 全局并发上限 | 按实例内存定 | 防打挂 |
| 同步码创建速率（按 IP） | 严格 | 防批量刷码占存储 |

超限返回 `RATE_LIMITED`。具体数值 8/22 部署时按实际资源定，本文不写死。

### 6.4 日志纪律

- **绝不记录**：API key、完整对话正文
- **记录**：同步码哈希、轮次、耗时、token 用量、guard 拦截、装配丢弃
- 日志保留期设上限

---

## 7. 目录布局

```
Agent_Nagi_2.0/
├── README.md
├── package.json                  workspaces: client / server / core
├── docs/
│   ├── Nagi_Runtime_Harness_Project_Plan.md            立项书（原件）
│   ├── Nagi_Runtime_Harness_Architecture_Design_V1.md  架构书（原件）
│   ├── Nagi_Runtime_Harness_Technical_Design_V1.md     ✖ 作废
│   ├── Nagi_Runtime_Harness_Technical_Design_V2.md     ✖ 作废
│   ├── Nagi_Runtime_Harness_Technical_Design_V3.md     ← 本文
│   ├── DECISIONS.md
│   └── OPEN_QUESTIONS.md
│
├── resources/                    ★ L0。只随服务端部署，从不进客户端产物
│   ├── MANIFEST.md
│   ├── core/  personality.base.md / personality.speech.md / behavior.*.md
│   ├── world/ timeline.md / events/*.md
│   ├── relationship/ baseline.{true,good,normal,bad}_end.md
│   ├── style_anchors/*.md        凪真实台词，防 OOC 主力
│   └── policy/ output_guard.md / scene.*.md
│
├── config/
│   └── providers.yaml            挂哪个厂商，改这里不改代码
│
├── packages/
│   ├── core/                     ★ L0–L3：零依赖纯 TS，Node 可跑单测
│   │   ├── types.ts
│   │   ├── resources/  load.ts / validate.ts
│   │   ├── memory/     store.ts（接口）/ search.ts / extract.ts
│   │   ├── context/    activation.ts / budget.ts / tokens.ts / build.ts
│   │   └── guard/
│   │
│   ├── server/
│   │   ├── index.ts              HTTP + SSE
│   │   ├── api/                  chat.ts / state.ts / save.ts
│   │   ├── middleware/           syncCode.ts / rateLimit.ts / keyPassthrough.ts
│   │   ├── db/                   SQLite 实现（实现 core 的存储接口）
│   │   ├── providers/            gemini.ts / anthropic.ts / openaiCompat.ts
│   │   ├── embedding/            remote.ts
│   │   └── pipeline/             ★ L4：runner.ts / steps.ts
│   │
│   └── client/
│       ├── index.html
│       ├── src/
│       │   ├── api.ts            唯一与服务端说话的地方
│       │   ├── ui/               App / Chat / StatePanel / Settings / DebugPanel
│       │   ├── cache.ts          本地：对话历史、设置、同步码、key
│       │   └── sw.ts             PWA service worker
│       └── public/manifest.webmanifest
│
├── scripts/
│   └── bake-canon.ts             构建期预烘焙 canon 记忆 + 向量
├── evals/  cases/*.yaml / run.ts
└── tests/
```

**放置原则**：

- 改凪的性格 / 规则 / 知识 → 只动 `resources/`，**不碰代码**
- 改装配策略 → 动 `resources/` 的 `activation` 字段，**仍不碰代码**
- 改流程 → `packages/server/pipeline/`
- 改界面 → `packages/client/`，**core 与 server 一行不动**

**强制边界（ESLint）**：
`packages/core` 不许 import `server` / `client` / 任何 IO；
`packages/client` 不许 import `core` / `server` / `resources`。
第二条是 §3.2 的技术保证。

---

## 8. L0 资源层

### 8.1 格式：Markdown + YAML front-matter（历版未变）

```markdown
---
id: core.personality.base
kind: personality
version: 1.0.0
source:
  authority_path: .claude/skills/nagi-ant-fic-writing/SKILL.md
  section: 人物规则
  derivation: structured_rewrite     # 禁止 verbatim_copy，红线不允许
  authority_md5: <派生时的哈希>
activation:
  always: true
  priority: 100
  token_budget: 1500
---

（正文：凪的核心人格。）
```

| 字段 | 作用 |
|---|---|
| `kind` | `personality` / `behavior_rule` / `timeline` / `event` / `relationship` / `skill` / `policy` / `style_anchor` |
| `source` | **回溯坐标**。`authority_md5` 与 `authority/MANIFEST.md` 不符 = 资源失效，**构建失败** |
| `activation.always` | 常驻上下文 |
| `activation.scenes` | 命中这些 scene tag 时装配 |
| `activation.when` | 对 State 求值的布尔表达式，如 `relationship.friction > 60` |
| `activation.priority` | 0–100，预算不足时从低分砍起 |
| `activation.token_budget` | 本资源占用上限 |

**`when` 用自写受限求值器**（属性访问 / 比较 / 布尔 / 字面量），不用 `eval`。
V3 下它跑在服务端，用户输入不可能进入表达式——但仍不用 `eval`，因为**资源文件是唯一事实源，
不该有执行任意代码的能力**。

### 8.2 加载：服务端启动时扫描

V3 回到运行时扫描（服务端有文件系统），但**校验在构建期先跑一遍**（CI），
格式错、`authority_md5` 失配直接构建失败，不会带到线上。

改 `.md` → 重启服务 → 生效。开发期热重载。
**8/27 的「只调资源不改代码」在 V3 下成立度最高**——不用重新构建客户端，重启服务即可。

### 8.3 与 authority 的关系（红线）

- `resources/` **不放 authority 原文**，只放结构化转写与抽取结果
- 每条必带 `source`，可回溯到 authority 文件 + 章节
- **落地前必须先在 `00_harness/01_governance/decision_log.md` 立 DEC 条目**（B2），
  并在 `authority/MANIFEST.md` 的「相关但不在本目录的权威关系」一节登记
- authority 改动 → `authority_md5` 失配 → 构建失败 → 强制重新派生

**V3 下资料不下发、仓库 private，公开风险已消（§0.1）。**
但立条目这一步仍不能省——红线管的是「复制」，不只是「公开」。

**在 DEC 条目获批前，`resources/` 只有目录与本节规则，不得填入任何内容。**

---

## 9. L1 状态 / L2 记忆（模型未变，存储改服务端）

### 9.1 状态模型

```ts
interface Canon {                    // 既成事实，只读
  epoch: 'post_ending';
  ending: 'true' | 'good' | 'normal' | 'bad';   // ← B1 待确认，配置项
  route: { mj: 'M' | 'J'; path: string; finalChoice: string };
  daysSinceEnding: number;           // 凪需要它才能表达「多久没见」
}
interface Relationship {
  stage: string;
  trust: number; intimacy: number;
  friction: number;                  // ← 见下
  lastInteractionAt: string;
}
interface Session { turn: number; scene: string | null; mood: string | null }
interface NagiState { schemaVersion, canon, relationship, session, memoryIndex }
```

**`friction` 为什么必须有**：剧本母版是 `V17_RelationshipFriction_Calibrated`，
校准方向就是关系摩擦。只建 trust / intimacy 会得到单调升温的恋爱机器人，
正是验收标准要避免的。`friction` 让凪可以「因为你烦到他而变冷」。

**`memoryIndex` 只存指针**，不内联记忆正文——否则 state 随轮次线性膨胀。

### 9.2 存储（SQLite，按同步码分区）

| 表 | 内容 | 分区 |
|---|---|---|
| `state_snapshots` | 每轮一条快照，可回放可回滚 | 按同步码 |
| `memory` | canon / episodic / semantic | canon 全局；其余按同步码 |
| `vectors` | `(itemId, BLOB)`，启动全量入内存 | 同上 |
| `turns` | 原始对话 | 按同步码 |
| `sync_codes` | 创建时间、最后活跃、配额计数 | — |

快照式而非原地更新：**可回放是调试角色 Agent 的刚需**——
「凪为什么突然这么说」要能翻回当时的完整 state 和 context。

### 9.3 四类记忆

| 类型 | 内容 | 可写 | 来源 |
|---|---|---|---|
| **Canon** | 剧情既成事实 | ❌ 只读 | `scripts/bake-canon.ts` 预烘焙，含向量 |
| **Episodic** | 对话中发生的事 | ✅ | 每轮抽取 |
| **Semantic** | 长期事实 | ✅ | 从 episodic 提炼去重 |
| **Emotional** | 情绪标记 | ✅ | 抽取时打标 |

**Canon 与 Live 严格分离，不得混写。** 混写会让对话内容污染剧情事实——
角色 Agent 最致命的失真。

### 9.4 导出 / 导入（仍是 MVP 必需）

V3 下记忆在服务端，比浏览器可靠得多。但仍必须提供：

- 丢同步码 = 丢记忆
- 服务停了 / 你不再维护了，使用者应能带走自己的数据
- 向量不导出（重新 embed 即可），显著缩小体积

### 9.5 写入管线

每轮 `generate` 后用 **aux 模型**跑一次抽取。**场景分类与记忆抽取合并成同一次调用**省配额：

```
输出：{
  "scene": "...",                     // 供下一轮使用（本轮场景来自上一轮，首轮用默认）
  "worthRemembering": boolean,        // 默认从严，大部分闲聊是 false
  "episodic": {...} | null,
  "semanticCandidates": [...],
  "emotion": { "valence": -1..1, "arousal": 0..1, "tag": "..." },
  "relationshipDelta": { "trust": +1, "friction": 0, ... }   // 单轮上限 ±3
}
```

抽取失败 / 超时 / 配额耗尽 → 跳过，不阻塞回复。**记忆丢一条可接受，回复卡住不行。**

---

## 10. L3 Context Assembly（核心，算法历版未变）

### 10.1 原则

> **按当前状态求值出候选集，按优先级在固定预算内装箱。**

预算是硬约束。没有预算约束的 context builder 只是个变相的 prompt 拼接器。

### 10.2 预算表（总 20k tokens）

| Block | 预算 | 激活方式 |
|---|---|---|
| 人格核心 | 1500 | always |
| 说话方式 | 800 | always |
| **风格锚（凪真实台词 6–8 段）** | 1800 | 检索 |
| 行为规则 | 800 | scene |
| 剧情骨架（压缩版） | 600 | always |
| 关系状态（渲染成自然语言） | 300 | always |
| Canon 记忆 | 2000 | 检索 top-k |
| Live 记忆 | 2500 | 近 N 条 + 检索 top-k |
| 场景策略 | 700 | scene |
| 对话窗口 | 6000 | 最近若干轮 |
| **人格复述（尾部锚）** | 400 | always |
| 保留余量 | 2600 | — |

**关系状态渲染成自然语言，不给数值。** 给模型 `trust: 85` 它不知道怎么演；
给「他现在愿意在你面前露出疲惫，但仍然不会主动说想你」它知道。
**数值是给系统用的，自然语言是给模型用的。**

风格锚 6–8 段是因为默认跑 Gemini Flash（中文角色扮演稳定性弱于 opus）。切 Claude 可降回 3–5 段，配置项。

### 10.3 Block 顺序

```
① 人格核心   ← 最前：prompt caching 前缀命中率最高 + 首因效应
② 说话方式
③ 风格锚
④ 剧情骨架
⑤ 关系状态
⑥ 行为规则 + 场景策略
⑦ Canon 记忆
⑧ Live 记忆
─── system 结束 ───
⑨ 对话窗口   ← messages
⑩ 人格复述   ← 最后：近因效应，对抗长上下文人格漂移
```

> 【推断】①–④ 的缓存命中率与 ⑩ 的防漂移效果，需在 8/27 用 eval 实测确认，不得直接当结论。

### 10.4 超预算与 token 估算

- 超预算按 `priority` 升序丢弃。**丢弃必须写日志**——「凪忘了某件事」往往就是这里被静默砍掉
- Token 估算：字符数 + 每 provider 一个校准系数，用 `countTokens` **离线标定一次**，不每轮调
- 装箱留 **10% 安全余量**；`debug` 事件同时给出估算值与真实用量，偏差持续超 15% 就重标定

> 【推断】CJK/Latin 系数取值需 8/23 实测标定后回填。

### 10.5 检索

- 查询串 = 用户输入 + scene tag，每轮 embed 一次
- 混合排序：`score = 0.6 × 余弦 + 0.25 × 时近性 + 0.15 × 情绪强度`
  - 时近性：最近的事更该被想起
  - 情绪强度：情绪重的事记得更牢——这条对角色真实感的贡献比纯相似度更大
- canon / live 分池，各自 top-k，防止 canon 淹没近期对话

---

## 11. L4 编排层：LangGraph（主实现）

### 11.1 定位：框架是本项目的研究对象，不是实现细节

立项书 §5 技术路线写明「LangGraph / Agent Runtime 作为执行基础」；
§8 核心问题第 4 条问「Harness 是否可能成为下一代 Agent 应用基础」；
8/29–31 交付物含「**LangGraph 方案评价**」。

⇒ **LangGraph 必须真正用起来，且进 MVP 关键路径。**
绕开它去手写编排，等于把立项书的中心问题连同交付物一起取消。

> 修订说明：V2 因「纯浏览器跑不了 LangGraph」而改自写 pipeline，
> 那在当时是成立的。V3 服务端回归后该前提消失，此处更正。
> 「我们的流程简单到不需要框架」是本项目**应当产出的结论**，
> 不是可以用来跳过验证的前提。

技术上：`@langchain/langgraph`（TS）跑在 §4 的长驻 Node 服务端上。
具体版本与 API 细节 8/22 接入时核对，**本文不写死**。

### 11.2 图

```
loadState → retrieve → buildContext → generate ←────┐
                                          ↓         │ conditional edge, retry ≤ 1
                                        guard ──fail┘
                                          ↓ pass
                                  extractMemory → persist
```

场景标签来自上一轮的 `extractMemory`（§9.5 合并调用）。
**每轮调用数**：main × 1 + aux × 2 + embed × 1 = 4 次。

`guard` 二次失败或收到空回复（安全过滤）→ 降级：用保守模板回复，记为 eval 样本。
**宁可回一句「……好麻烦」，不可回一句 OOC 的甜言蜜语。**

### 11.3 边界：框架只碰编排，不碰业务

这条是「能不能评价 LangGraph」的前提——**框架若渗进 core，就无法把它摘出来比较**。

| 约束 | 理由 |
|---|---|
| **`packages/core` 不许 import LangGraph**（ESLint 强制） | 保住 §3.1 判据：core 能在 Node 裸跑单测。也保住对照实验的可行性 |
| **每个节点是纯函数 `(ctx) => Partial<ctx>`**，定义在 core / server 里，由图挂载 | 节点可被两种 orchestrator 共用 |
| **节点内不得含业务判断**（「关系到多少才怎样」），一律由 `resources/policy/` 声明 | Harness 原则 |
| **状态持久化不交给 checkpointer**，仍走我们自己的 `state_snapshots`（§9.2） | 见下 |

**为什么不用 checkpointer 存状态**：这是个窄的技术判断，不是对 LangGraph 的否定。
① 我们的快照要能被 eval、DebugPanel、导出/导入三处读取，需要自有格式；
② 两种 orchestrator 必须读写**同一份**状态，才谈得上对比；
③ 避免把状态绑死在框架的持久化格式上。
**编排用 LangGraph，持久化自管**——两件事分开。

（LangGraph 的 checkpointer 与 replay 能力本身仍要**评估并写进评价**，见 §11.5。）

### 11.4 对照组：BaselineOrchestrator

编排层抽象成接口，两个实现共用同一批 steps：

```ts
interface Orchestrator {
  run(ctx: Ctx): AsyncIterable<PipelineEvent>;   // 供 SSE 转发
}
```

| 实现 | 角色 | 规模 |
|---|---|---|
| **`LangGraphOrchestrator`** | **主实现**，MVP 用它 | 图定义 |
| `BaselineOrchestrator` | **对照组**，只为评价服务 | 手写 ~150 行 |

对照组不是「备胎」，是**实验的控制变量**：没有它，「LangGraph 方案评价」只能是读文档写观感。
有了它，可以让两者跑**同一套 eval、同一批资源、同一份状态**，直接出数。

同时它让 §3 的迁移判据从「声称」变成「实测」：换 orchestrator，L0–L3 一行不改——当场证明。

### 11.5 「LangGraph 方案评价」的评价维度（立项书交付物）

立项书写了要评价，没写评什么。缺判据的评价会退化成形容词。定六项，8/29–31 据此出报告：

| 维度 | 怎么测 |
|---|---|
| **侵入性**（最重要） | 为了让图跑起来，有多少业务概念被迫写进框架的类型/结构里？统计 core 之外新增的框架耦合代码行数 |
| **表达力** | 重试、降级、流式、条件边——我们的流程能否自然表达，还是要绕 |
| **状态管理** | checkpointer vs 自管快照的实际取舍（我们选了自管，理由 §11.3，评价中要给出这个选择是否正确） |
| **可观测性** | 事件流 / 追踪对调试 **context 装配**的实际帮助有多大。这是本项目最难调的部分 |
| **迁移成本** | 换成 Baseline 要改多少行？L0–L3 是否真的零改动 |
| **运行开销** | 依赖体积、启动时间、单轮延迟增量（对照组直接给出基线） |

**结论必须标证据等级**：`【已验证】`（附命令/行号/实测数）或 `【推断】`（附待验方式）。

---

## 12. 人格保真（本项目真正的难点）

立项书只写了验收标准没给实现。**仅靠 prompt 描述人格必然漂移**，跑 Flash 档更是如此。

| 防线 | 做法 | 成本 |
|---|---|---|
| **① 风格锚**（最有效） | 每轮检索 6–8 段凪的真实台词注入。**给例子远比给描述有效**——「低反应」是形容词，一段真实对白是可模仿的目标 | 上下文 1800 tok |
| **② 输出守卫**（硬规则） | `resources/policy/output_guard.md` 声明：长度上限、禁用词表、感叹号密度、禁止的行为模式（主动嘘寒问暖 / 主动表白 / 说教）。正则统计即可判定 | **零成本零延迟** |
| **③ OOC 打分**（软检查） | aux 模型打 0–5 分，低于阈值重生成一次 | 1 次 aux 调用 |

三道防线的拦截记录全部落库，成为 eval 语料——**线上拦截样本比人造用例更真实**。
配额紧张时可只留 ②（见 §17.2）。

---

## 13. Provider 抽象（D5）

业务只认两个语义档位，不认厂商和模型名：`main`（凪的回复，质量优先）、`aux`（分类/抽取/打分，便宜优先）。

```ts
interface LLMProvider {
  complete(req: {
    system: string; messages: Msg[];
    tier: 'main' | 'aux';
    apiKey: string;              // ← 每次请求传入，不在 provider 里保存（§15）
    jsonSchema?: object;
    cacheHint?: number;
    signal?: AbortSignal;
  }): AsyncIterable<string>;     // 流式，供 SSE 转发
}
```

配置 `config/providers.yaml`，改配置不改代码：

```yaml
llm:
  active: gemini
  providers:
    gemini:
      main: <flash 系列模型 id>
      aux:  <flash-lite 系列模型 id>
      endpoint: https://generativelanguage.googleapis.com/v1beta
    anthropic:
      main: claude-opus-5
      aux:  claude-haiku-4-5
```

> 具体模型 id 与免费额度【推断】，8/22 接入时按当日实际值回填。本文不写死。

**统一层要吃掉的差异**（真实工作量，不是转发）：

| 差异 | 处理 |
|---|---|
| 结构化输出 | Gemini `responseSchema` / Anthropic tool-use / OpenAI `json_schema`，统一成 `jsonSchema` |
| System prompt | Gemini 是 `systemInstruction` 独立字段，Anthropic 是顶层 `system` |
| 流式格式 | 各家 SSE 分块格式不同，统一成 `AsyncIterable<string>` |
| Prompt caching | 只暴露 `cacheHint`「前 N 块可缓存」的**意图**，能否真缓存由各 provider 决定 |
| 限流 | 指数退避 + 配额计数；`main` 撞限时自动降级到 `aux` 模型而非报错 |
| **安全过滤返回空** | Gemini 可能拦截亲密向内容返回空。**必须处理**，触发时走降级模板并落日志——否则表现为「凪突然不说话了」。见 §18 |

---

## 14. 客户端

### 14.1 界面（MVP）

| 区域 | 内容 |
|---|---|
| **对话区** | 聊天，SSE 逐字显示 |
| **状态面板** | 关系状态（自然语言 + 数值）、scene、mood、记忆条数。即立项书 §6 的「状态展示 / Memory 展示」 |
| **DebugPanel** | 本轮装配的 block、各占多少 token、丢弃了什么、估算 vs 真实、四次调用耗时。**仅调试模式**，对外关闭 |
| **设置页** | 配 key、选 provider、同步码（显示 + 输入 + 导出提醒）、导出/导入 |

`DebugPanel` 不是锦上添花——**没有它就无法调试 context 装配**，属 MVP 必需。

### 14.2 PWA（D7 第一步）

- `manifest.webmanifest` + 图标 → 可加到主屏幕、全屏运行
- service worker **只缓存应用外壳与历史对话**，**不缓存 `/api/chat`**——凪的回复必须每次真调
- **离线只能看历史，不能聊天**（§0.4）

### 14.3 Capacitor（D7 第二步，8/29–31）

同一套客户端代码打包成 APK，复用 100%。Android 免费；iOS 需 Mac + 开发者账号。

### 14.4 客户端安全

- 严格 CSP；不引第三方 CDN 脚本、不接统计
- 资源正文不经客户端，故无渲染注入面；对话内容渲染仍一律转义，不用 `innerHTML`
- key 存本地（IndexedDB），**永不进 URL、永不进日志、永不进导出文件**

---

## 15. BYOK（D6，已定，不再论证）

**谁用谁配自己的 key。** 客户端存本地，随请求经 `X-LLM-Key` 头透传。

服务端纪律（要有针对性单测）：

- **绝不落库、绝不写日志、绝不进错误堆栈**
- 只在处理该请求的内存中存在，请求结束即释放
- 不做「记住我的 key」式的服务端缓存

界面上必须明示：**「你的 key 会随请求发送到本服务，仅用于代你调用模型，不做存储」**——
使用者需要知情后自行判断，不能藏着。

---

## 16. 部署

| 组件 | 托管 | 说明 |
|---|---|---|
| **客户端** | 支持 private repo 的免费静态托管（Cloudflare Pages / Netlify / Vercel 等） | **不用 GitHub Pages**——它免费档要求 public 仓库 |
| **服务端** | 长驻 Node 进程（§4.1） | 平台 8/22 实测后定 |
| **仓库** | **private** | 资料在仓库里，不能公开 |

流程：`git push` → CI 跑资源校验 + 单测 → 客户端发静态托管，服务端发运行平台。

> 【推断】免费版 GitHub Pages 不支持 private 仓库发布，需核对当前政策。
> 但即便支持也不改结论——V3 用其他托管一样免费，且不必让仓库公开。

**运维现实**（§0.4）：免费档会休眠，首请求有冷启动延迟。若不可接受，需付费档或定时保活。

---

## 17. Eval

### 17.1 五个维度

| 维度 | 判据 | 自动化 |
|---|---|---|
| 人格一致性 | OOC 打分 ≥ 阈值；禁用词零命中 | ✅ |
| **不编造剧情外事实** | 断言回复不含 canon 之外的具体事实 | ⚠️ LLM judge + 人工抽检 |
| 记忆准确性 | 埋点记忆在后续轮次被正确召回 | ✅ |
| 关系连续性 | 关系值变化单调合理，无跳变 | ✅ |
| Context 效率 | token 用量 vs 预算；丢弃率；估算偏差 | ✅ |
| **记忆隔离**（V3 新增）| 两个同步码的记忆互不可见 | ✅ 必测 |

> 立项书的「避免未来信息泄露」在 D1（通关之后）下不成立，已替换为「不编造剧情外事实」。

**L0–L3 是零依赖纯 TS，eval 可在 Node + Vitest 里跑**，不需要浏览器、不需要起服务。

### 17.2 配额降级

| 档位 | 每轮调用 | 用于 |
|---|---|---|
| 完整 | main 1 + aux 2 + embed 1 | 正常对话 |
| 省配额 | main 1 + aux 1 + embed 1（关软打分，只留硬规则） | 配额告急 |
| 离线 eval | 0（对固定语料跑硬规则 + 装配检查） | CI |

### 17.3 对抗性用例（8/21 先写，30 条）

**A. 诱导 OOC（约 18 条）**：直球索取（「你爱我吗」「说点好听的」）、情绪索取（「我今天很难过」，考察是否变暖男客服）、长度诱导、人设试探（「你会永远陪着我吗」）

**B. 事实压力（约 12 条）**：问剧情外细节、问矛盾前提（「我们第一次见面在海边对吧？」）、问别人的内心视角、跨越结局边界的假设

**先有尺子再造东西。** 8/21 必须完成，否则 8/27 的「测试优化」无从谈起。

---

## 18. MVP 最小集

### 18.1 必须有（8/28 第一版）

| # | 组件 | 完成判据 |
|---|---|---|
| 1 | 资源加载 + 校验（构建期 + 启动时） | 格式错 / 哈希失配 = 构建失败 |
| 2 | 五类资源各至少一份 + **style_anchors ≥ 30 段** | 通过校验，检索可命中 |
| 3 | `bake-canon.ts` 预烘焙 canon 记忆 + 向量 | 服务启动即有完整剧情记忆 |
| 4 | State + SQLite + **导出/导入** | 可回放任意一轮；导出能恢复 |
| 5 | Memory：canon + episodic + 向量检索 | 埋点记忆可召回 |
| 6 | ContextBuilder：activation + 装箱 + token 估算 | DebugPanel 可见完整装配明细 |
| 7 | **LangGraph 编排**（含条件边重试与降级） | 端到端跑通；core 不含任何 LangGraph import |
| 8 | Gemini Provider（流式 + 限流退避 + 空回复处理） | 撞配额不崩，被 filter 拦不哑 |
| 9 | Guard 三道防线 | 拦截有日志 |
| 10 | **API 层：`/api/chat` SSE + state + history + save** | 契约稳定 |
| 11 | **同步码 + 记忆隔离 + 限流** | 隔离必须有单测 |
| 12 | 客户端：对话 + 状态面板 + DebugPanel + 设置页 | 别人拿到网址能自己配 key 用起来 |
| 13 | **PWA 可安装** | 手机加到主屏幕能用 |
| 14 | Eval 30 条 + 报告（Node 里跑） | 可重复执行 |
| 15 | 部署流水线（客户端 + 服务端） | push 即发布 |

### 18.2 明确砍掉

| 项 | 理由 |
|---|---|
| Capacitor 打包 | 挪到 8/29–31（D7 第二步）|
| BaselineOrchestrator 对照组 | 挪到 8/29–31。**它服务于评价，不服务于 MVP** |
| 账号系统 | 同步码够用，且不担个人数据责任 |
| 跨设备实时同步冲突处理 | 单人多设备顺序使用，先不做合并 |
| Semantic / Emotional 独立分层 | 先合并进 episodic 加 tag |
| 外挂向量库 | §4.2 量级不够 |
| 记忆遗忘 / 衰减 | 一年内数据量不构成问题 |
| Anthropic / DeepSeek provider 实现 | 只做抽象和配置位，Gemini 跑通再补 |
| 本地直连模式（不经服务器） | 有价值但非本期 |
| 主动发起对话 | 不在立项范围 |
| UI 打磨 / 深度移动端适配 | 能用优先 |

---

## 19. 排期

| 日期 | 内容 |
|---|---|
| 8/20 | V3 技术方案（本文）+ CORS 实测（已完成）+ **立 decision_log 条目（解 B2）** |
| 8/21 | monorepo 初始化 + 类型定义 + **Eval 30 条对抗用例** + **B3 人格源比对** |
| 8/22 | **服务端平台选型实测** + Gemini Provider（流式）+ 资源加载校验 + 最小能回话链路 |
| 8/23 | **ContextBuilder（1/2）**：activation + 装箱 + **token 系数标定** |
| 8/24 | **ContextBuilder（2/2）** + SQLite + 记忆写入管线 |
| 8/25 | 记忆检索与混合排序 + **canon 预烘焙脚本** |
| 8/26 | **LangGraph 编排（主实现）** + Guard 三道防线 + **API 层（SSE）** + 同步码隔离与限流 |
| 8/27 | 客户端：对话 + 状态面板 + 设置页 + DebugPanel + PWA |
| 8/28 | 部署（客户端 + 服务端）+ 跑 Eval + 第一版 Demo |
| 8/29–31 | **BaselineOrchestrator（对照组）+ 按 §11.5 六维出 LangGraph 方案评价** + Harness 抽象评价 + 架构总结 + Capacitor 打包 |

**风险**：8/26 塞了 Pipeline + Guard + API + 多用户四件事，8/27 一天做完整个客户端。两天都偏乐观。

若来不及，按此顺序砍：
1. DebugPanel 降级为原始 JSON 展示（它是给你自己看的）
2. 状态面板降级为原始 JSON
3. 限流用最粗暴的固定值（**记忆隔离不能砍**——串台是事故）
4. PWA 挪到 8/29

---

## 20. 风险

| 风险 | 影响 | 应对 |
|---|---|---|
| **Gemini safety filter 拦截亲密向内容** | 凪随机不说话 | 8/22 首日用 20 条真实语料压测拦截率；空回复走降级模板并落日志 |
| **Flash 人格保真不足** | 滑向热情客服 | 风格锚 6–8 段 + 三道防线；仍不达标改配置切 Claude |
| **记忆串台** | **事故级** | 查询必带同步码；针对性单测；code review 重点 |
| **8/26–27 工期不足** | Demo 不完整 | 按 §19 的顺序砍 |
| **LangGraph.js 接入不顺**（版本/API 与预期不符） | 8/26 卡住 | 8/22 先跑一个 hello-world 图探路，别等到 8/26 才第一次碰 |
| **免费档休眠 / 冷启动** | 首次打开等数秒 | 定时保活或付费档（B5 预算）|
| **服务被滥用** | 存储与带宽被刷 | §6.3 限流；同步码创建按 IP 严格限速 |
| token 估算偏差 | 装箱超限被 API 拒 | 10% 余量 + 持续监测偏差 |
| 使用者丢同步码 | 记忆找不回 | 导出/导入 + UI 显眼提示保存 |
| 其他 provider CORS / 接口未验 | 备选 provider 不可用 | 接入前逐个实测，不得假设 |
| **你在链路里** | 使用者的 key 与对话经过你的服务器 | §15 纪律 + 界面明示；日志绝不记正文 |

---

## 21. 与立项书的差异（需回写立项书）

| 项 | 立项书 | 本文 | 原因 |
|---|---|---|---|
| 技术路线 | LangGraph / Python | **LangGraph.js / TypeScript，客户端 + 服务端** | D2″。**框架未变，语言与部署形态变了** |
| 部署 | 未提 | **服务端承担 L0–L4；客户端只剩 UI；PWA → APK** | 资料保密 + 跨设备同步 |
| 用户 | 隐含单用户 | **多用户，同步码隔离** | 谁用谁配 key |
| Timeline Consistency | 「避免未来信息泄露」 | 「不编造剧情外事实」 | D1 下凪全知，原判据不成立 |
| 关系模型 | trust / intimacy / stage | 增加 **friction** | 剧本母版是 V17 摩擦校准版 |
| 记忆模型 | 三类 | 增加 **Canon / Live 分离** + 导出/导入 | 防污染；防丢码失忆 |
| 人格一致性 | 只有验收标准 | 增加 **§12 三道防线** | 原文无实现方案 |
| 交付物 | Demo（形态未定） | **一个别人配上自己 key 就能用的网页/App + 服务端** | 受众从「自己」变成「别人」 |

---

## 22. 待裁决

1. **B1** — 以哪个结局作为「现在」的起点？（默认 TRUE END，配置项）
2. **B2** — 是否批准派生资源包并立 decision_log 条目？**今天不批，8/21 之后全线空转**
3. **B3** — 人格事实源分工：fic-writing 管人格规则 + V17 管台词风格，是否认可？
4. ~~B4~~ — **已消解**：V3 下资料不下发、仓库 private
5. **B5** — 服务端月度预算上限？（免费档起步，但需要知道天花板在哪，以决定要不要为冷启动付费）
6. §19 排期是否采纳，以及 8/26–27 的砍法
