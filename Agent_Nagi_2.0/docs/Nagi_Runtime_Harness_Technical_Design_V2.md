> # ⚠ 本文已作废（2026-08-20）
>
> Ant 定：按部署服务器的方式做，不走「先纯客户端、再迁服务端」的分期。
> **落地依据以 `Nagi_Runtime_Harness_Technical_Design_V3.md` 为准。**
> 本文仅作历史保留，不得作为任何开发依据。

# Nagi Runtime Harness — 技术方案 V2（全 TypeScript 静态站 / BYOK）

- 文档性质：技术设计（TDD）
- 日期：2026-08-20
- 状态：**待 Ant 评审**
- **本文取代 V1。** V1（Python + LangGraph + 本地 CLI）因 D2 被推翻而作废，
  仅作历史保留，不得作为落地依据。
- 与立项书冲突处以本文为准，并回写立项书

---

## 0. V1 → V2 变更缘由

Ant 2026-08-20 定：**这个 Agent 一开始就要能发给别人用**，每人配自己的 API key（BYOK）。

BYOK 消除了「静态站点会泄露 API key」这条否决理由——没有共享秘密，每个使用者的 key 只存在他自己的浏览器里。这是 Cherry Studio / LobeChat / SillyTavern 一类客户端的标准做法。

代价是推翻 D2：**整个 harness 必须跑在浏览器里，全部改用 TypeScript。**

### 0.1 什么变了，什么没变

| 层 | V1 | V2 | 变化程度 |
|---|---|---|---|
| L0 资源 | Markdown + front-matter | **不变**（加载方式改为构建期） | 语言中立，几乎零成本迁移 |
| L1 状态 | Pydantic + SQLite | TypeScript 类型 + IndexedDB | 模型不变，存储换实现 |
| L2 记忆 | fastembed + numpy | 远端 embedding + Float32Array | 分层与排序公式不变 |
| L3 Context 装配 | Python | TypeScript | **算法与预算表一字不改** |
| L4 Runtime | LangGraph | **自写 pipeline（~150 行）** | 全新 |
| L5 接口 | CLI | **Web UI（Preact）** | 全新，净增工作量 |

**L0 和 L3 是本项目的核心价值，而它们恰好是唯一没变的两层。** 这本身就验证了立项书 H2（资源化优于 Prompt 堆叠）——换语言、换运行时、换部署形态，资源和装配策略原样存活。

### 0.2 Ant 已知悉并接受的代价

- **静态站点的所有文件公开可下载。** `resources/` 里凪的人格规则、行为约束、
  从 V17 派生的台词样本、剧情骨架，任何访问者都能取走。
- 免费版 GitHub Pages 要求仓库 public【推断，需核对当前 GitHub 计费政策】，
  因此上一条无法通过 private repo 规避。

---

## 1. 决策前提

### 1.1 已定

| # | 决策 | 工程含义 |
|---|---|---|
| D1 | **时间锚 = 通关之后的「现在」** | 剧情全量可见，不需要章节游标。记忆分 Canon（只读）/ Live（可写）两层 |
| ~~D2~~ | ~~Python + LangGraph~~ | **已作废** |
| **D2′** | **全 TypeScript 静态站，GitHub Pages 部署，BYOK** | 无服务端。所有逻辑跑在浏览器 |
| D3 | **派生 Agent 专用资源包** | 不直接读 authority 原文。触主仓库红线，需先立 decision_log |
| D5 | **LLM 接入配置驱动，首选免费 Gemini** | 业务只认 `main`/`aux` 档位，不认厂商 |

### 1.2 待定（阻塞项）

| # | 问题 | 阻塞谁 | 建议 |
|---|---|---|---|
| B1 | 以哪个结局作为「现在」的起点 | 关系初值、全部 canon memory | TRUE END。已设计为配置项 |
| B2 | **红线豁免未获批** | `resources/` 无法填充 | 需在 `00_harness/01_governance/decision_log.md` 立 DEC 条目 |
| B3 | 人格事实源优先级 | Personality 资源 | fic-writing 管人格规则，V17 管台词风格 |
| **B4** | **仓库 public 后 resources 全公开，是否接受** | 资源派生范围 | 见 §0.2。若不接受，需退回桌面端（Tauri）方案 |

---

## 2. 关键技术验证（2026-08-20 实测）

静态站方案的**全部承重假设**是「浏览器能否直连模型厂商 API」。若不能，就必须配代理服务器，方案当场作废。已实测：

**方法**：在 `https://example.com` 这个第三方 origin 下发起 `fetch`，用无效 key。
若被 CORS 拦截会抛 `TypeError: Failed to fetch`；若放行则拿到 API 自己的错误响应。

| 端点 | 结果 | 证据 | 等级 |
|---|---|---|---|
| Gemini `generateContent`（POST + 自定义头，触发 preflight） | **✅ 放行** | `400 API key not valid` | 【已验证】|
| Gemini `models` list（GET） | **✅ 放行** | `400 API key not valid` | 【已验证】|
| **Gemini `embedContent`** | **✅ 放行** | `400 API key not valid` | 【已验证】|
| Anthropic `/v1/messages`（不带 opt-in 头） | **❌ 被拦** | `TypeError: Failed to fetch` | 【已验证】|
| Anthropic `/v1/messages`（带 `anthropic-dangerous-direct-browser-access: true`） | **✅ 放行** | `401 invalid x-api-key` | 【已验证】|

**三个直接结论**：

1. **静态站直连 Gemini 成立**，不需要任何服务端。
2. **`embedContent` 可直连 ⇒ 不需要 transformers.js，省掉首次访问 30–40MB 的模型下载。** 这对「发给别人用」是决定性的——没人愿意为一个聊天页等 40MB。
3. **Anthropic 作为备选 provider 可用**，但必须带 opt-in 头。Provider 抽象里要为它单独加这个头。

> 未验证：DeepSeek 及其他 OpenAI 兼容端点的 CORS 策略。**接入前必须逐个用同一方法实测**，不得假设。

---

## 3. 系统全景

六层，自下而上依赖，**上层可换、下层不动**：

```
L5  UI              Preact + signals。只管呈现，不含业务
────────────────────────────────────────────────────────
L4  Pipeline        自写编排（~150 行）。只管流程，不含业务
────────────────────────────────────────────────────────
L3  Context Assembly 预算装箱 + 渲染。全项目核心
────────────────────────────────────────────────────────
L2  Memory          四类记忆的写入管线与检索
────────────────────────────────────────────────────────
L1  State           IndexedDB。canon / relationship / session
────────────────────────────────────────────────────────
L0  Resource        构建期打包的 .md 资源。人格 / 规则 / 时间线 / 策略
```

**L0–L3 是零依赖的纯 TypeScript**，不 import 任何 UI 框架、不碰 DOM、不碰 `fetch`（模型调用经 Provider 注入）。判据：**L0–L3 必须能在 Node 里跑单测，不需要浏览器环境。** 做不到就说明分层破了。

这条同时天然满足了立项书的 Harness 迁移诉求——L4 本来就没用框架，换编排等于换 150 行文件。

---

## 4. 技术选型

### 4.1 选型表

| 用途 | 选型 | 理由 |
|---|---|---|
| 语言 | TypeScript 5.x（`strict`） | — |
| 构建 | Vite 5 | `import.meta.glob` 直接解决资源打包（§7.3）；HMR 让改资源即时生效 |
| UI | **Preact + @preact/signals**（~5KB） | 聊天界面 + 状态面板足够；bundle 小，首屏快。**只用在 L5** |
| 存储 | **IndexedDB**，经 `idb`（~1KB 包装） | 唯一能存结构化数据 + 向量的浏览器方案。localStorage 容量与类型都不够 |
| 向量化 | **Gemini `embedContent`（远端）** | 【已验证】可直连。零下载。备选本地 transformers.js，见 §4.3 |
| 向量检索 | **`Float32Array` + 手写余弦** | < 5000 条，全表扫描 < 5ms。见 §4.4 |
| 编排 | **自写 pipeline** | 见 §11 |
| 资源解析 | 构建期 front-matter 解析（`js-yaml`） | 校验失败 = 构建失败，不留到运行时 |
| 测试 | Vitest | 与 Vite 同源，L0–L3 纯 TS 可直接跑 |
| 部署 | GitHub Actions → GitHub Pages | 与 NagisHeart 同一套流程 |

### 4.2 被否方案

| 方案 | 否决理由 |
|---|---|
| **React** | 对一个单页聊天应用，bundle 体积不划算。Preact API 兼容，需要时可换 |
| **transformers.js 本地 embedding（作为默认）** | 首访要下 30–40MB。既然 §2 已验证 `embedContent` 可直连，没理由让使用者付这个代价。**保留为可选项**，见 §4.3 |
| **向量数据库 / WASM SQLite** | 量级不够（§4.4），纯增体积 |
| **服务端代理（Cloudflare Workers 等）** | §2 已验证不需要。引入即等于引入运维和费用，且要托管别人的 key |
| **`js-tiktoken` 精确计数** | 是 OpenAI 分词器，对 Gemini 不准；且体积不小。见 §10.4 |

### 4.3 Embedding 双实现

```ts
interface EmbeddingProvider {
  embed(texts: string[]): Promise<Float32Array[]>;
}
```

| 实现 | 何时用 | 代价 |
|---|---|---|
| `RemoteEmbedding`（默认） | 常规 | 每次检索一次网络往返；吃免费配额 |
| `LocalEmbedding`（可选，transformers.js） | 离线 / 配额撞顶 / 不愿把记忆文本发给第三方 | 首访下载 30–40MB，之后走 Cache API |
| `LexicalFallback`（兜底） | 前两者都不可用时 | 纯词面匹配，召回质量下降但不崩 |

**向量一旦算出就落 IndexedDB**，同一条记忆只 embed 一次。因此远端 embedding 的真实成本只发生在**新记忆写入时**和**每轮的查询串**上——每轮 1 次，不是 N 次。

### 4.4 为什么不上向量库

canon memory 由剧本派生约 **300–800 条**；live memory 每天约 6 条，一年约 2000 条。合计 **< 5000 条 × 768 维**。

float32 下 5000 × 768 × 4B ≈ **15MB**，可全量驻内存。一次全表余弦在现代浏览器 **< 5ms**。

这个量级引入向量库纯亏。检索接口已抽象，量级真的涨上去再换实现，上层不动。

### 4.5 Provider 抽象（配置驱动，D5）

业务代码只认两个语义档位，不认厂商和模型名：

- `main` —— 凪的正式回复，质量优先
- `aux` —— 场景分类 / 记忆抽取 / OOC 打分，便宜优先

```ts
interface LLMProvider {
  complete(req: {
    system: string;
    messages: Msg[];
    tier: 'main' | 'aux';
    jsonSchema?: object;      // aux 类调用要结构化输出
    cacheHint?: number;       // 前 N 个 block 内容稳定，可缓存
  }): Promise<string>;
}
```

配置在 `config/providers.yaml`，构建期打包进产物；使用者可在设置面板覆盖：

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
      extraHeaders:
        anthropic-dangerous-direct-browser-access: "true"   # 【已验证】必需，见 §2
embedding:
  active: remote            # remote | local | lexical
```

> 具体模型 id 与免费额度【推断】，8/22 接入时到 Google AI Studio 核对当日实际值后回填。本文不写死。

**统一层要吃掉的差异**（这是真实工作量，不是转发）：

| 差异 | 处理 |
|---|---|
| 结构化输出 | Gemini 用 `responseSchema`，Anthropic 用 tool-use，OpenAI 用 `json_schema`。统一成 `jsonSchema` 参数，各自内部翻译 |
| System prompt | Gemini 是 `systemInstruction` 独立字段，Anthropic 是顶层 `system`。统一层映射 |
| **CORS opt-in 头** | Anthropic 必须带 `anthropic-dangerous-direct-browser-access`【已验证】。写进 provider 配置的 `extraHeaders` |
| Prompt caching | 各家机制不同。统一层只暴露 `cacheHint`「前 N 块可缓存」的**意图**，能不能真缓存由各 provider 决定，业务不感知 |
| 限流 | 免费档有 RPM/RPD 硬限。内置指数退避 + 本地配额计数；超限时 `main` 自动降级到 `aux` 模型而非报错 |
| **安全过滤返回空** | Gemini safety filter 可能拦截亲密向内容返回空。**必须处理空回复**，触发时走降级模板并落日志——否则表现为「凪突然不说话了」。见 §16 |

---

## 5. 数据流全景

```
用户输入
   │
   ▼
[1] loadState ─────── IndexedDB 读 canon / relationship / session
   │
   ▼
[2] understandScene ─ aux 模型分类 → scene tag（daily / plot / conflict / intimacy …）
   │                  ⚠ 与 [7] 合并成一次调用以省免费配额，见 §9.2
   ▼
[3] retrieve ──────── 查询串 embed 一次 → 余弦检索 canon / live 记忆，分池 top-k
   │                  同时检索「风格锚」：6–8 段凪的真实台词
   ▼
[4] buildContext ──── 候选资源按 activation 求值 → 按 priority 装箱 → 渲染 block
   │
   ▼
[5] generate ──────── main 模型
   │
   ▼
[6] guard ─────────── 硬规则 + aux 打分。不合格 → 回 [5] 重试一次
   │                  空回复（safety filter）→ 走降级模板
   ▼
[7] extractMemory ─── aux 判定本轮是否值得记 → 写 episodic + 关系增量
   │
   ▼
[8] persist ───────── 落 IndexedDB（状态快照 + 记忆 + 向量）
   │
   ▼
回复用户
```

**每轮网络调用数**：main × 1 + aux × 2（[2]+[7] 合并、[6] 一次）+ embed × 1 = **4 次**。
免费档配额下这是可持续的量；如仍撞顶，可关掉 [6] 的软打分只留硬规则（见 §13.2）。

---

## 6. 目录布局（"放在哪里"）

```
Agent_Nagi_2.0/
├── README.md                     怎么装、怎么跑、怎么配 key、红线
├── package.json
├── vite.config.ts
├── index.html
├── .github/workflows/deploy.yml  Actions → Pages
│
├── config/
│   └── providers.yaml            ★ 挂哪个模型厂商，改这里不改代码（§4.5）
│
├── docs/
│   ├── Nagi_Runtime_Harness_Project_Plan.md            立项书（原件）
│   ├── Nagi_Runtime_Harness_Architecture_Design_V1.md  架构书（原件）
│   ├── Nagi_Runtime_Harness_Technical_Design_V1.md     ✖ 已作废，历史保留
│   ├── Nagi_Runtime_Harness_Technical_Design_V2.md     ← 本文，落地依据
│   ├── DECISIONS.md
│   └── OPEN_QUESTIONS.md
│
├── resources/                    ★ L0。纯 .md，改完重新构建即生效
│   ├── MANIFEST.md               资源清单 + 与 authority 的派生关系
│   ├── core/
│   │   ├── personality.base.md         凪是谁（常驻）
│   │   ├── personality.speech.md       说话方式（常驻）
│   │   └── behavior.*.md               行为规则，按场景激活
│   ├── world/
│   │   ├── timeline.md                 剧情骨架（压缩版，常驻）
│   │   └── events/*.md                 事件条目，检索式激活
│   ├── relationship/
│   │   └── baseline.{true,good,normal,bad}_end.md
│   ├── style_anchors/                  ★ 凪真实台词，防 OOC 的主力
│   │   └── *.md
│   └── policy/
│       ├── output_guard.md             禁用词、长度上限、OOC 判据
│       └── scene.*.md                  各场景行为策略
│
├── src/
│   ├── core/                     ★ L0–L3：零依赖纯 TS，可在 Node 跑单测
│   │   ├── types.ts              State / Resource / MemoryItem
│   │   ├── resources/
│   │   │   ├── load.ts           构建期 glob + front-matter 解析
│   │   │   └── validate.ts       schema 校验（失败即构建失败）
│   │   ├── memory/
│   │   │   ├── store.ts          存储接口（不含 IndexedDB 实现）
│   │   │   ├── search.ts         余弦 + 混合排序
│   │   │   └── extract.ts        记忆抽取的 prompt 与解析
│   │   ├── context/
│   │   │   ├── activation.ts     activation 表达式求值
│   │   │   ├── budget.ts         预算装箱
│   │   │   ├── tokens.ts         token 估算（§10.4）
│   │   │   └── build.ts          渲染 block → system prompt
│   │   └── guard/                输出守卫
│   │
│   ├── platform/                 ★ 浏览器相关实现，core 通过接口注入
│   │   ├── db.ts                 IndexedDB（idb）
│   │   ├── providers/            gemini.ts / anthropic.ts / openaiCompat.ts
│   │   ├── embedding/            remote.ts / local.ts / lexical.ts
│   │   └── keystore.ts           BYOK：key 的读写（§14.2）
│   │
│   ├── pipeline/                 ★ L4：自写编排（~150 行）
│   │   ├── runner.ts
│   │   └── steps.ts
│   │
│   └── ui/                       ★ L5：Preact
│       ├── App.tsx
│       ├── Chat.tsx
│       ├── Settings.tsx          配 key、选 provider、导入导出存档
│       └── DebugPanel.tsx        本轮装配明细（§14.1）
│
├── evals/
│   ├── cases/*.yaml
│   └── run.ts                    Vitest 驱动，Node 里跑
└── tests/
```

**放置原则（一句话）**：

- 改凪的性格 / 规则 / 知识 → 只动 `resources/`，**不碰代码**
- 改装配策略 → 动 `resources/` 里的 `activation` 字段，**仍然不碰代码**
- 改流程 → 动 `src/pipeline/`
- 改界面 → 动 `src/ui/`，**core 一行不动**

`src/core/` **不许** import `src/platform/`、`src/ui/`、任何 Preact 或 DOM API。
这条用 ESLint 规则强制，不靠自觉。**这是 §3 判据能成立的唯一保证。**

---

## 7. L0 资源层

### 7.1 格式：Markdown + YAML front-matter（与 V1 相同）

正文是自然语言，用 JSON 写多行中文是自虐；元数据需要结构化。

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

### 7.2 字段契约

| 字段 | 作用 |
|---|---|
| `id` | 全局唯一，点分命名 |
| `kind` | `personality` / `behavior_rule` / `timeline` / `event` / `relationship` / `skill` / `policy` / `style_anchor` |
| `source` | **回溯坐标**。`authority_md5` 与 `authority/MANIFEST.md` 不符 = 本资源已失效，需重新派生 |
| `activation.always` | 常驻上下文 |
| `activation.scenes` | 命中这些 scene tag 时装配 |
| `activation.when` | 对 State 求值的布尔表达式，如 `relationship.friction > 60` |
| `activation.priority` | 0–100。预算不足时从低分砍起 |
| `activation.token_budget` | 本资源占用上限 |

**`when` 表达式的安全实现**：不用 `eval()` / `new Function()`。自写受限求值器——只允许属性访问、比较、`&&`/`||`/`!`、字面量。约 60 行 TS。
在浏览器里这条尤其重要：`new Function` 会被严格 CSP（§14.3）直接禁掉。

### 7.3 加载机制：构建期（V2 与 V1 的主要差异）

静态站没有运行时文件系统，无法扫描目录。改为 Vite 构建期打包：

```ts
const raw = import.meta.glob('/resources/**/*.md', { query: '?raw', eager: true });
// → 构建期解析 front-matter → 校验 → 生成 typed 索引：byId / byKind / always
```

**这比 V1 的运行时扫描更好**：格式错误、缺字段、`authority_md5` 失配全部在
**构建阶段暴露，CI 直接失败**，不会留到用户面前才炸。

**代价（须明说）**：改 `.md` 不再是「重启即生效」。

| 环境 | 改 `.md` 后 |
|---|---|
| 开发（`vite dev`） | HMR 即时生效，体感与 V1 相同 |
| 生产 | 需重新构建 + 部署。即 `git push` → Actions → Pages，约 1–2 分钟 |

对本项目可接受：资源调优基本都在开发期做，8/27 的「只调资源不改代码」在 dev 下照常成立。

### 7.4 资源与 authority 的关系（红线）

主仓库 `CLAUDE.md` 与 `authority/MANIFEST.md` 铁律第 1 条：**禁止把权威内容复制到其他位置**。

- `resources/` **不放 authority 原文**，只放**结构化转写**与**抽取结果**
- 每条资源必带 `source`，可回溯到 authority 文件 + 章节
- **落地前必须先在 `00_harness/01_governance/decision_log.md` 立 DEC 条目**，
  并在 `authority/MANIFEST.md` 的「相关但不在本目录的权威关系」一节登记本资源包
- authority 改动 → `authority_md5` 失配 → **构建失败** → 强制重新派生

**⚠ V2 新增的红线考量**：静态站部署意味着 `resources/` 全部内容**公开可下载**。
派生范围必须按「可公开」的标准来定，而不是按「够用」来定。这是 B4，须 Ant 裁决。

**在 DEC 条目获批前，`resources/` 只有目录和本节规则，不得填入任何内容。**

---

## 8. L1 状态层

### 8.1 数据模型

```ts
interface Canon {                    // 既成事实，运行时只读
  epoch: 'post_ending';
  ending: 'true' | 'good' | 'normal' | 'bad';   // ← B1 待确认，配置项
  route: { mj: 'M' | 'J'; path: string; finalChoice: string };
  daysSinceEnding: number;           // 凪需要它才能表达「多久没见」
}

interface Relationship {             // 长期，随对话演进
  stage: string;
  trust: number;      // 0–100
  intimacy: number;   // 0–100
  friction: number;   // 0–100  ← 见下
  lastInteractionAt: string;
}

interface Session {                  // 短期
  turn: number;
  scene: string | null;
  mood: string | null;
}

interface NagiState {
  schemaVersion: string;
  canon: Canon;
  relationship: Relationship;
  session: Session;
  memoryIndex: { canonPack: string; liveHead: string | null; liveCount: number };
}
```

**`friction` 为什么必须有**：剧本母版是 `V17_RelationshipFriction_Calibrated`——V17 的校准方向就是关系摩擦。只建模 trust / intimacy 会得到单调升温的恋爱机器人，正是验收标准要避免的东西。`friction` 让凪可以「因为你烦到他而变冷」。

**`memoryIndex` 只存指针**：State 内联记忆正文会随轮次线性膨胀，几十轮后 state 本身就吃掉全部预算。

### 8.2 存储：IndexedDB

| Object Store | 内容 |
|---|---|
| `stateSnapshots` | 每轮一条快照。可回放、可回滚 |
| `memory` | canon / episodic / semantic，带 kind 索引 |
| `vectors` | `(itemId, Float32Array)`，启动时全量载入内存 |
| `turns` | 原始对话 |
| `settings` | provider 选择、UI 偏好 |
| `keys` | BYOK 的 API key（§14.2） |

快照式而非原地更新：**可回放是调试角色 Agent 的刚需**——「凪为什么突然这么说」要能翻回当时的完整 state 和 context。

### 8.3 存档导出 / 导入（V2 新增，MVP 必需）

浏览器存储不是你的：**用户清一次站点数据，凪就彻底失忆**；换浏览器、换设备同样归零。

因此 MVP **必须**提供：

- **导出**：全部 state + memory + turns 打成一个 JSON 文件下载
- **导入**：从 JSON 恢复，带 `schemaVersion` 兼容检查
- **自动提醒**：累计新增记忆超过阈值（如 50 条）时提示导出一次

> 注意：向量不导出——重新 embed 即可，能显著缩小存档体积。导入后后台重算。

这不是锦上添花。**没有这个功能，这个 Agent 的「长期存在型身份」在工程上不成立**——立项书 §13 的核心问题之一（Agent 能否拥有稳定连续身份）会直接被浏览器的清缓存按钮否掉。

---

## 9. L2 记忆层

### 9.1 四类记忆

| 类型 | 内容 | 可写 | 来源 |
|---|---|---|---|
| **Canon** | 剧情既成事实 | ❌ 只读 | 由 `story-data` + 剧本预烘焙，随构建产物分发 |
| **Episodic** | 对话中发生的事 | ✅ | 每轮抽取 |
| **Semantic** | 长期事实（"Ant 讨厌早起"） | ✅ | 从 episodic 提炼、去重合并 |
| **Emotional** | 情绪标记，附着在上面三类 | ✅ | 抽取时一并打标 |

**Canon 与 Live 严格分离，不得混写。** 混写会让对话内容污染剧情事实——这是角色 Agent 最致命的失真。

V2 补充：**Canon memory 与向量在构建期预计算并随产物分发**。使用者首次打开就已有完整剧情记忆，不需要现场 embed 几百条——既省他的配额，也省首屏时间。

### 9.2 写入管线

每轮 `generate` 之后，用 **aux 模型** 跑一次抽取。**场景分类（[2]）与记忆抽取（[7]）合并成同一次调用**以省免费配额：

```
输入：本轮 user + nagi 回复 + 当前 relationship
输出：{
  "scene": "daily | plot | conflict | intimacy | ...",   // 供下一轮使用
  "worthRemembering": boolean,        // 大部分闲聊是 false
  "episodic": {...} | null,
  "semanticCandidates": [...],
  "emotion": { "valence": -1..1, "arousal": 0..1, "tag": "..." },
  "relationshipDelta": { "trust": +1, "friction": 0, ... }
}
```

> 合并的代价：本轮场景标签来自**上一轮**的判定，首轮用默认值。
> 对一个连续对话来说这个滞后可接受，换来配额减半。

三条约束：

1. **`worthRemembering` 默认从严**。什么都记 = 检索被噪声淹没
2. **`relationshipDelta` 有单轮上限**（如 ±3），防止一句话把关系拉满
3. 抽取失败 / 超时 / 配额耗尽 → 跳过，不阻塞回复。记忆丢一条可以接受，回复卡住不行

### 9.3 检索

- 查询串 = 当前用户输入 + 当前 scene tag，**每轮 embed 一次**
- 混合排序：`score = 0.6 × 余弦 + 0.25 × 时近性 + 0.15 × 情绪强度`
  - **时近性**：最近的事更该被想起
  - **情绪强度**：情绪重的事记得更牢。这条对角色真实感的贡献比纯相似度更大
- canon 与 live **分池检索**，各自 top-k，防止 canon 淹没近期对话

---

## 10. L3 Context Assembly（核心，算法与 V1 完全一致）

### 10.1 原则

不是「全部知识 → LLM」，也不是「相似度 top-k → LLM」，而是：

> **按当前状态求值出候选集，按优先级在固定预算内装箱。**

预算是硬约束。没有预算约束的 context builder 只是个变相的 prompt 拼接器。

### 10.2 预算表（MVP，总 20k tokens）

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

**关系状态渲染成自然语言，不给数值。** 给模型 `trust: 85` 它不知道该怎么演；给「他现在愿意在你面前露出疲惫，但仍然不会主动说想你」它知道。**数值是给系统用的，自然语言是给模型用的。**

风格锚给到 6–8 段是因为默认跑 Gemini Flash——它的中文角色扮演稳定性弱于 opus，需要更多可模仿的样本。切 Claude 时可降回 3–5 段（配置项）。

### 10.3 Block 顺序

```
① 人格核心      ← 最前：prompt caching 前缀命中率最高，且首因效应
② 说话方式
③ 风格锚
④ 剧情骨架
⑤ 关系状态
⑥ 行为规则 + 场景策略
⑦ Canon 记忆
⑧ Live 记忆
─── 以上为 system ───
⑨ 对话窗口      ← messages
⑩ 人格复述      ← 最后：近因效应，对抗长上下文人格漂移
```

①–④ 内容稳定，放最前是为了 **prompt caching 前缀命中**（`cacheHint` 指向 ④ 的末尾）；⑩ 是一段短复述（"记住：他是凪，低反应，嫌麻烦，不会说漂亮话"）。

> 【推断】①–④ 的缓存命中率与 ⑩ 的防漂移效果，需在 8/27 用 eval 套件实测确认，不得直接当结论。

### 10.4 Token 估算（V2 新增问题）

浏览器里没有既准确又轻量的分词器：`js-tiktoken` 是 OpenAI 口径，对 Gemini 不准且体积不小。

方案：**字符数估算 + 每 provider 一个校准系数**。

```ts
estimateTokens(text) = (cjkChars * CJK_RATIO + otherChars * LATIN_RATIO)
```

- 系数用 Gemini 的 `countTokens` 端点**离线标定一次**（拿 50 段真实语料回归），写进配置，不在每轮调用
- 装箱时按估算值 + **10% 安全余量**，宁可少装不可超限
- `DebugPanel` 同时显示估算值与 API 返回的真实用量，偏差持续超 15% 就重新标定

> 【推断】CJK/Latin 系数的具体取值需 8/23 实测标定后回填，本文不写死。

---

## 11. L4 Pipeline（取代 LangGraph）

### 11.1 为什么自写

LangGraph 跑不进浏览器。但这不是损失——立项书要验证的是「Harness 抽象是否可迁移」，而**没有框架就没有框架锁定**。§3 的迁移判据在 V2 下天然成立。

规模约 150 行：

```ts
type Step<C> = {
  name: string;
  run(ctx: C): Promise<Partial<C>>;
  retry?: { max: number; when(ctx: C): boolean };
  skip?(ctx: C): boolean;
};

async function runPipeline<C>(steps: Step<C>[], ctx: C, hooks?: Hooks): Promise<C>
```

`hooks` 每步前后回调——**DebugPanel 和 eval runner 都靠它取数据**，不需要在业务里埋点。

### 11.2 流程

```
loadState → understandScene* → retrieve → buildContext
                                              ↓
                                          generate ←────┐
                                              ↓         │ retry ≤ 1
                                            guard ──fail┘
                                              ↓ pass
                                        extractMemory → persist
```

`*` 场景标签实际来自上一轮的 `extractMemory`（§9.2 合并调用）。

**guard 二次失败或收到空回复 → 降级**：用保守模板回复（凪的典型短回应），记录为 eval 样本。
**宁可回一句「……好麻烦」，不可回一句 OOC 的甜言蜜语。**

### 11.3 步骤契约

每步是纯函数 `(ctx) => Partial<ctx>`，只返回要更新的字段。副作用（IndexedDB 写、网络）集中在 `persist` 和注入的 Provider 里。

**步骤内不得包含业务判断**（"关系到多少才怎样"这类），一律由 `resources/policy/` 声明。这是 §3 判据能成立的前提。

---

## 12. 人格保真机制（本项目真正的难点）

立项书把这条写成验收标准，但没给实现。**仅靠 prompt 描述人格必然漂移**，跑 Flash 档更是如此。三道防线：

### 12.1 风格锚（最有效）

每轮检索 6–8 段**凪的真实台词**（派生自 V17）注入。
**给例子远比给描述有效**——"低反应"是形容词，一段真实对白是可模仿的目标。三道防线里投入产出比最高的一条。

### 12.2 输出守卫（硬规则，零成本零延迟）

`resources/policy/output_guard.md` 声明：

- 单条回复长度上限（凪不长篇大论）
- 禁用词表（过度热情的表达、不符合他语气的词）
- 感叹号 / 问号密度上限
- 禁止的行为模式（主动嘘寒问暖、主动表白、说教）

正则 / 统计即可判定，**不花钱不花配额不占时间**。配额紧张时这道防线可以单独顶着（§13.2）。

### 12.3 OOC 打分（软检查）

aux 模型对生成结果打 0–5 分，低于阈值触发重生成。判据来自同一份 policy 文件。

**三道防线的拦截记录全部落 IndexedDB**，成为 eval 语料——线上拦截样本比人造用例更真实。

---

## 13. Eval 体系

### 13.1 五个维度与判据

| 维度 | 判据 | 自动化 |
|---|---|---|
| 人格一致性 | OOC 打分 ≥ 阈值；禁用词零命中 | ✅ 全自动 |
| **不编造剧情外事实** | 断言回复不含 canon 之外的具体事实 | ⚠️ 半自动（LLM judge + 人工抽检）|
| 记忆准确性 | 埋点记忆在后续轮次被正确召回 | ✅ 全自动 |
| 关系连续性 | 关系值变化单调合理，无跳变 | ✅ 全自动 |
| Context 效率 | 每轮实际 token 用量 vs 预算；丢弃率；**估算偏差**（§10.4） | ✅ 全自动 |

> 立项书的「避免未来信息泄露」在 D1（通关之后）下不成立，已替换为「不编造剧情外事实」。

**V2 的一个实际便利**：L0–L3 是零依赖纯 TS，eval 可在 **Node + Vitest** 里跑，不需要浏览器、不需要 UI。CI 可直接跑。

### 13.2 配额降级策略

免费档配额是硬约束，eval 一跑就是几十轮。分级：

| 档位 | 每轮调用 | 用于 |
|---|---|---|
| 完整 | main 1 + aux 2 + embed 1 | 正常对话 |
| 省配额 | main 1 + aux 1 + embed 1（关掉 OOC 软打分，只留硬规则） | 配额告急 |
| 离线 eval | 0（对固定语料跑硬规则 + 装配检查） | CI |

### 13.3 对抗性用例（8/21 先写，30 条）

**A. 诱导 OOC（约 18 条）**

- 直球索取："你爱我吗" / "说点好听的"
- 情绪索取："我今天很难过"（考察他是否变成暖男客服）
- 长度诱导：问一个需要长篇解释的问题
- 人设试探："你会永远陪着我吗"

**B. 事实压力（约 12 条）**

- 问剧情外的细节（考察是否编造）
- 问矛盾前提（"我们第一次见面在海边对吧？"）
- 问别人的内心视角
- 跨越结局边界的假设

**先有尺子再造东西。** 8/21 必须完成，否则 8/27 的「测试优化」无从谈起。

---

## 14. L5 UI 与 BYOK

### 14.1 界面（MVP）

三块，一个页面：

| 区域 | 内容 |
|---|---|
| **对话区** | 聊天。凪的回复 + 输入框 |
| **状态面板** | 当前关系状态（自然语言 + 数值）、scene、mood、记忆条数。即立项书 §6 的「状态展示 / Memory 展示」 |
| **DebugPanel** | 本轮装配了哪些 block、各占多少 token、丢弃了什么、估算 vs 真实用量、四次调用各自耗时 |

`DebugPanel` 不是锦上添花——**没有它就无法调试 context 装配**，属于 MVP 必需项。对外发布时可默认折叠。

设置面板：配 key、选 provider、选 embedding 模式、**导出/导入存档**（§8.3）。

### 14.2 BYOK 密钥处理

**本站没有服务端，key 永远不离开使用者的浏览器**，直接发往模型厂商。这句话要写在设置页上，让使用者知道自己在信任什么。

规则：

- key 存 IndexedDB（不进 localStorage，避免被同源的其他脚本顺手读走）
- **永不写进日志、永不进 URL、永不进导出的存档文件**（导出时显式剔除）
- 设置页只显示尾 4 位
- 首次打开引导使用者去 Google AI Studio 自取免费 key，附链接与步骤

### 14.3 前端安全（BYOK 下的真实风险）

BYOK 消除了「作者泄露 key」，但把风险换成了「**页面被注入脚本 → 偷使用者的 key**」。这是所有 BYOK 客户端的共同风险，对策是标准的：

- **严格 CSP**：`default-src 'self'`；`connect-src` 只列白名单的模型厂商域名；
  **禁止 `unsafe-inline` / `unsafe-eval`**
- 不引入任何第三方 CDN 脚本、不接统计分析
- 资源正文渲染到界面时一律转义，不用 `innerHTML`
- 依赖锁定 + 定期审计（供应链是静态站最现实的攻击面）

> CSP 禁 `unsafe-eval` 是 §7.2 里 `activation.when` 必须自写求值器、
> 不能用 `new Function` 的直接原因。这两条设计是绑定的。

---

## 15. 部署

### 15.1 形态

GitHub Actions 构建 → GitHub Pages 托管，与 NagisHeart 同一套流程。**无服务器、无运维、无费用。**

```
git push → Actions: npm ci && npm run build → 产物发 Pages
```

使用者：打开网址 → 填自己的 API key → 开始聊。记忆存在他自己的浏览器里。

### 15.2 必须知悉的三件事

1. **仓库需 public。** 免费版 GitHub Pages 不支持 private repo 发布【推断，需核对当前政策】。
   ⇒ `resources/` 全部公开可下载（§0.2 / B4）。
2. **每个使用者的记忆彼此独立**，存在各自浏览器里。没有云端同步，没有跨设备。
   要跨设备只能靠 §8.3 的导出/导入。
3. **清缓存 = 失忆。** §8.3 的导出功能是唯一的保险，必须在 UI 上足够显眼。

### 15.3 未来可选升级（不在本期）

| 诉求 | 方案 |
|---|---|
| 资源不公开 | 换 Tauri 桌面端。同一套 TS core 可直接复用，只换 L5 外壳 |
| 跨设备同步记忆 | 才是真正需要服务端的时候。可接使用者自己的云盘，避免自建后端 |

---

## 16. MVP 最小集

### 16.1 必须有（8/28 第一版）

| # | 组件 | 完成判据 |
|---|---|---|
| 1 | 构建期资源加载 + 校验 | 资源格式错 = 构建失败 |
| 2 | 五类资源各至少一份 + **style_anchors ≥ 30 段** | 通过校验，检索可命中 |
| 3 | Canon memory 预烘焙（含向量）随产物分发 | 首次打开即有完整剧情记忆 |
| 4 | State + IndexedDB + **导出/导入存档** | 可回放任意一轮；导出后能恢复 |
| 5 | Memory：canon + episodic + 远端 embedding 检索 | 埋点记忆可召回 |
| 6 | ContextBuilder：activation 求值 + 预算装箱 + token 估算 | DebugPanel 可见完整装配明细 |
| 7 | Pipeline（8 步 + 重试 + 降级） | 端到端跑通 |
| 8 | Provider：Gemini（含限流退避、空回复处理） | 撞配额不崩，被 filter 拦不哑 |
| 9 | Guard 三道防线 | 拦截有日志 |
| 10 | Web UI：对话 + 状态面板 + DebugPanel + 设置页 | 别人拿到网址能自己配 key 用起来 |
| 11 | Eval 30 条 + 报告（Node 里跑） | 可重复执行 |
| 12 | Actions → Pages 部署流水线 | push 即发布 |

### 16.2 明确砍掉

| 项 | 理由 |
|---|---|
| 本地 embedding（transformers.js） | §2 已验证远端可用，省 40MB 下载。留接口不做实现 |
| Semantic / Emotional 独立分层 | 先合并进 episodic 加 tag |
| 向量数据库 | §4.4，量级不够 |
| 记忆遗忘 / 衰减 | 一年内数据量不构成问题 |
| 跨设备同步 | 靠导出/导入。真同步要服务端 |
| Anthropic / DeepSeek provider 实现 | 只做抽象和配置位，Gemini 跑通再补 |
| 主动发起对话 | 不在立项范围 |
| UI 打磨 / 移动端适配 | 能用优先。§17 排期已很紧 |

**砍掉的每一项都不影响 §3 的分层判据**——这就是判断能不能砍的标准。

---

## 17. 修正后的排期

**净影响：TS 化省掉了 Python 打包，但净增了一整个 Web UI（原方案是 CLI）。总体偏紧。**

| 日期 | 内容 |
|---|---|
| 8/20 | V2 技术方案（本文）+ CORS 实测（已完成）+ **立 decision_log 条目（解 B2/B4）** |
| 8/21 | Vite/TS 工程初始化 + 类型定义 + **Eval 30 条对抗用例** + **B3 人格源比对** |
| 8/22 | Gemini Provider（含限流/空回复）+ 构建期资源加载与校验 + 最小能回话链路 |
| 8/23 | **ContextBuilder（1/2）**：activation 求值 + 预算装箱 + **token 系数标定** |
| 8/24 | **ContextBuilder（2/2）** + IndexedDB + 记忆写入管线 |
| 8/25 | 记忆检索与混合排序 + **Canon memory 预烘焙脚本** |
| 8/26 | Pipeline + Guard 三道防线 + **分层判据验证（core 在 Node 跑通单测）** |
| 8/27 | Web UI（对话 + 状态面板 + DebugPanel + 设置页）+ 导出导入 |
| 8/28 | Actions → Pages 部署 + 跑 Eval + 第一版 Demo |
| 8/29–31 | 复盘：架构总结 + Harness 抽象评价 + 迁移实验 |

**风险点**：8/27 一天做完整个 UI 偏乐观。若来不及，**优先保对话 + 设置页 + 导出**，状态面板和 DebugPanel 可用最朴素的 JSON 展示顶过去——它们是给你自己看的，不是给使用者看的。

---

## 18. 风险

| 风险 | 影响 | 应对 |
|---|---|---|
| **Gemini safety filter 拦截亲密向内容** | 凪随机不说话 | 8/22 首日用 20 条真实语料压测拦截率；空回复走降级模板并落日志 |
| **Flash 人格保真不足** | 滑向热情客服 | 风格锚 6–8 段 + 三道防线；仍不达标则改配置切 Claude（已验证可直连）|
| **免费配额撞顶** | 每天聊不了几轮 | 合并 aux 调用；三档降级（§13.2）；BYOK 下每人用自己的额度，压力分散 |
| **B4 未裁决** | 资源派生范围定不下来 | 今天连同 B2 一起立条目 |
| **8/27 UI 来不及** | Demo 不完整 | 按 §17 的优先级砍 |
| token 估算偏差 | 装箱超限被 API 拒 | 10% 安全余量 + DebugPanel 持续监测偏差 |
| 使用者清缓存失忆 | 长期身份不成立 | §8.3 导出/导入 + 主动提醒 |
| 其他 provider CORS 未知 | 备选 provider 不可用 | 接入前逐个用 §2 的方法实测，不得假设 |

---

## 19. 与立项书的差异（需回写立项书）

| 项 | 立项书 | 本文 | 原因 |
|---|---|---|---|
| 技术路线 | LangGraph / Python | **全 TS 静态站 + 自写 pipeline** | D2′：一开始就要能发给别人 |
| 部署 | 未提 | **GitHub Pages，BYOK，无服务端** | 同上 |
| Timeline Consistency | 「避免未来信息泄露」 | 「不编造剧情外事实」 | D1 下凪全知，原判据不成立 |
| 关系模型 | trust / intimacy / stage | 增加 **friction** | 剧本母版是 V17 摩擦校准版 |
| 记忆模型 | 三类 | 增加 **Canon / Live 分离** + **导出/导入** | 防污染；防浏览器清数据失忆 |
| 人格一致性 | 只有验收标准 | 增加 **§12 三道防线** | 原文无实现方案 |
| 交付物 | Demo（形态未定） | **一个别人打开就能用的网页** | 受众从「自己」变成「别人」 |

---

## 20. 待裁决

1. **B1** — 以哪个结局作为「现在」的起点？（默认 TRUE END，配置项）
2. **B2** — 是否批准派生资源包并立 decision_log 条目？**今天不批，8/21 之后全线空转**
3. **B3** — 人格事实源分工：fic-writing 管人格规则 + V17 管台词风格，是否认可？
4. **B4** — **静态站部署 = `resources/` 全部公开可下载，是否接受？**
   若不接受，需现在就退回 Tauri 桌面端方案（core 复用，只换外壳）
5. Gemini 免费档的数据条款是否可接受（使用者自己的 key、自己的额度，但内容仍提交给 Google）
6. §17 修正排期是否采纳，以及 8/27 UI 的砍法

---

# 附录 A（2026-08-20 增补）：分期路线与服务端演进

> 触发：Ant 确认「资料放服务端」四条动机**全都要**，手机端**先 PWA，8/28 后补 Capacitor**。
> 结论：**最终形态一定有服务端。** 本期（8/28）交付的是架构验证，不是终态。
> 本附录定义分期，以及 Phase 1 必须预留的接缝——**留错了 Phase 2 就是重写**。

## A.1 四条动机分别需要什么

| # | Ant 的动机 | 真正需要的 | 能被 Phase 1 满足吗 |
|---|---|---|---|
| 1 | 不想让人拿到凪的人格和剧情资料 | **服务端承担 L0–L3**（资料从不下发） | ❌ 只能提高门槛 |
| 2 | 改资料不用重新发版 | 资料在服务端（或签名资源包） | ⚠️ 可选加更新通道 |
| 3 | 跨设备同步凪的记忆 | 服务端存记忆 + 一个身份标识 | ❌ 只能靠导出/导入 |
| 4 | 资料不该和 App 混在一起 | 目录分离 | ✅ **已满足**（`resources/` 独立，改资料不碰代码）|

**1 和 3 是真的需要后端，2 和 4 不需要。** 而 1 决定了后端的形态：
资料要真保密，就必须是**服务端组 prompt**，而不是服务端存文件让客户端下载——
后者抓包即得，花了服务器的钱没买到保密。

> **诚实的边界**：即使服务端装配，别人跟凪聊得够多仍能大致还原人格。
> 服务端保护的是**原始资料文件**（人格规则原文、台词样本、剧情骨架），
> 这是有意义的差别，但不等于绝对保密。

## A.2 分期

| 阶段 | 时间 | 形态 | 服务器 | 满足的动机 |
|---|---|---|---|---|
| **Phase 1** | ~8/28 | 纯客户端 + **PWA** | 无 | 4 |
| **Phase 1.5** | 8/29–31 | + **Capacitor APK** | 无 | 4，1 部分（要解包才拿得到）|
| **Phase 2** | 9 月 | + 服务端承担 L0–L3 与记忆 | 有 | **1 / 2 / 3 / 4 全部** |

**Phase 1 的目的是验证立项书的四个核心问题**（Context 可否工程化管理、身份可否连续、
Resource Composition 是否优于 Prompt 堆叠、Harness 可否作为基础）。
这四个问题**不需要服务端就能回答**，所以先不做后端是对的——但接缝必须现在留。

## A.3 关键接缝：Engine 接口（Phase 1 就要写）

在 L4 与 L5 之间插一层，**UI 只认这个接口，不认 core**：

```ts
interface NagiEngine {
  chat(input: string): Promise<{
    reply: string;
    stateDelta: Partial<NagiState>;
    debug?: DebugTrace;          // DebugPanel 用
  }>;
  exportSave(): Promise<Blob>;
  importSave(f: Blob): Promise<void>;
}
```

两个实现：

| 实现 | 阶段 | 说明 |
|---|---|---|
| `LocalEngine` | Phase 1 | 在浏览器里直接跑 `src/core/` + `src/pipeline/` |
| `RemoteEngine` | Phase 2 | HTTP 调服务端。**服务端里跑同一份 `src/core/`，一行不改** |

切换 = 改一个配置项。**这就是 Phase 1 不白做的保证。**

同理，存储也要接口化（V2 §6 目录里 `memory/store.ts` 已是「存储接口，不含 IndexedDB 实现」，
Phase 1 就按这个写）：

```ts
interface MemoryStore { /* IndexedDBStore | RemoteStore */ }
interface StateStore  { /* IndexedDBStore | RemoteStore */ }
```

### A.3.1 为什么这条接缝几乎零成本

V2 §3 已经定死：**`src/core/`（L0–L3）零依赖纯 TS，不碰 DOM / 框架 / fetch，
判据是能在 Node 里跑单测**，并用 ESLint 规则强制。

「能在 Node 里跑单测」和「能部署成 Node 服务端」是同一件事。
**这条判据当初是为了守分层，副产品正好是 Phase 2 的迁移能力。**

## A.4 Phase 2 服务端设计（预案，不在本期实施）

### A.4.1 职责划分

```
客户端（PWA / APK）              服务端
─────────────────────           ──────────────────────────
L5  UI                    →     L0  Resource（资料不下发）
    本地缓存（离线可读历史）      L1  State
    BYOK：key 随请求透传          L2  Memory（跨设备同步的真值）
                                 L3  Context Assembly
                                 L4  Pipeline
                                     → 调 LLM → 只回 reply
```

**客户端拿到的只有凪的回复，永远拿不到资料。** 动机 1 达成。

### A.4.2 BYOK 怎么和服务端共存（关键设计）

服务端要调 LLM，key 只有三种来源，两种不可接受：

| 做法 | 评价 |
|---|---|
| 服务端出 key，你付钱 | ❌ 项目从零边际成本变成有成本，且随使用者增长 |
| 服务端存用户的 key | ❌ 你就担上了保管他人凭证的责任与风险 |
| **key 随每次请求透传，服务端内存中用完即弃、绝不落库** | ✅ 用户仍用自己的额度，你不保管任何凭证 |

采用第三种。必须在设置页写明：**「你的 key 会随请求发送到本服务，仅用于代你调用模型，不做存储」**——
这是使用者需要知情后自行判断的事，不能藏着。

### A.4.3 跨设备同步（动机 3）

需要一个身份标识。**不做账号系统**，用轻量方案：

- 首次使用生成一个**高熵同步码**（客户端生成，服务端只当作存储键）
- 用户在另一台设备输入同一个码即接上同一份记忆
- 丢码 = 丢记忆 ⇒ **§8.3 的导出/导入仍然保留**，作为最终保险

比账号系统轻一个量级，且不收集任何个人信息。

### A.4.4 服务端选型（Phase 2 再定，此处只记倾向）

倾向 **Serverless**：core 是 TS，可直接跑在 Node 兼容的边缘运行时上，
配一个轻量 SQL（存记忆）+ 对象存储。免费额度基本覆盖个人规模，**零运维**。

这与「不想要服务器」的直觉并不冲突——Serverless 不需要管服务器。
具体选型（Cloudflare Workers / Deno Deploy / Vercel 等）留到 Phase 2 实测后定，
**本文不预先锁定**。

> ⚠️ 需在 Phase 2 实测：向量检索（约 5000 条 × 768 维）在边缘运行时的
> CPU 时间限制内是否跑得完。若不行则改为预筛 + 精排两段式。

## A.5 手机端：PWA（Phase 1）→ Capacitor（Phase 1.5）

| | PWA | Capacitor |
|---|---|---|
| 增量工作 | manifest + service worker + 图标，**约半天** | 约 0.5–1 天 |
| 代码复用 | 100% | 100% |
| 体验 | 加到主屏幕、全屏、有图标 | 真 App |
| 分发 | 网址 | APK / 应用商店 |
| 资料保护 | 无（URL 可下载） | 中（需解包 APK） |
| 成本 | 0 | Android 免费；iOS 需 Mac + 开发者账号 |

**Phase 1 只做 PWA**，Capacitor 放 8/29–31。理由：8/27 的 UI 工期本来就紧（V2 §17 已标风险），
不在 MVP 期分心做打包。

PWA 的 service worker 只缓存**应用外壳与资料**，**不缓存 API 响应**——
凪的回复必须每次真调模型。

## A.6 对 V2 正文的修订

| V2 章节 | 修订 |
|---|---|
| §6 目录 | 新增 `src/engine/`：`types.ts` / `local.ts`（Phase 2 加 `remote.ts`）；新增 `public/manifest.webmanifest`、`src/sw.ts` |
| §14 UI | UI **只依赖 `NagiEngine` 接口**，不得直接 import `src/core/`。同样用 ESLint 规则强制 |
| §15 部署 | Phase 1 增加 PWA 产物；§15.3「未来可选升级」由本附录取代 |
| §16 MVP | 必须项增加：**#13 Engine 接口 + LocalEngine**、**#14 PWA 可安装** |
| §17 排期 | 8/27 增加 PWA（半天）；8/29–31 复盘期增加 Capacitor 打包 |
| §20 待裁决 | **B4 的性质变了**：不再是「接不接受资料公开」，而是「**Phase 1 期间**资料公开可否接受」。Phase 2 会关掉这个口子 |

## A.7 B4 的重新表述（待 Ant 裁决）

原 B4：静态站部署 = `resources/` 全部公开可下载，是否接受？

**新表述**：Phase 2 会通过服务端装配彻底解决资料公开问题。但 Phase 1（8/28 起）
到 Phase 2 上线之间，资料会以可下载状态存在于 GitHub Pages 上。三个选项：

| 选项 | 说明 |
|---|---|
| **A. 接受**（推荐） | Phase 1 就是验证期，受众实际是你自己和少数人。到 Phase 2 关口 |
| B. Phase 1 不公开发布 | 只本地 `vite dev` 跑，不发 Pages。架构验证不受影响，但失去「发给别人试」 |
| C. Phase 1 用占位资料 | 真资料等 Phase 2 再进。代价：**Eval 全部失真，人格保真无从验证**——不推荐 |

**建议 A。** 但这条要你明确点头，因为它涉及 authority 派生物的公开，属于红线范畴。
