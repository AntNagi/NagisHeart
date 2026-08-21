> # ⚠ 本文已作废（2026-08-20）
>
> D2（Python + LangGraph + 本地 CLI）已被 Ant 推翻：这个 Agent 一开始就要能发给别人用。
> **落地依据以 `Nagi_Runtime_Harness_Technical_Design_V2.md` 为准。**
> 本文仅作历史保留，不得作为任何开发依据。

# Nagi Runtime Harness — 技术方案 V1

- 文档性质：技术设计（TDD），立项书的落地版本
- 日期：2026-08-20
- 状态：**待 Ant 评审**。本文与立项书冲突处，以本文为准并回写立项书

---

## 0. 这份文档回答什么

立项书写了"要做什么"，本文回答四个工程问题：

1. **技术栈**：用什么跑，为什么不用别的
2. **资源**：有哪些资源，长什么样，放在哪个目录
3. **实现逻辑**：一次对话从输入到落库，中间经过哪些环节
4. **最小集**：MVP 必须包含什么，什么可以砍

赶时间只看 §1（前提）、§5（目录）、§9（Context 装配）、§14（MVP 最小集）。

---

## 1. 决策前提

### 1.1 已定（2026-08-20，Ant）

| # | 决策 | 工程含义 |
|---|---|---|
| D1 | **时间锚 = 通关之后的「现在」** | 对话对象是 Ant 本人。剧情全量可见，**不需要**章节游标和未来信息屏蔽。记忆分「剧情既成事实」与「对话新增」两层 |
| D2 | **Python + LangGraph，独立子工程** | 与主仓库 web/android 零构建耦合。业务逻辑不得写进 LangGraph 节点 |
| D3 | **派生 Agent 专用资源包** | 不直接读 authority 原文。派生动作触主仓库红线，需先立 decision_log |

### 1.2 待定（阻塞项）

| # | 问题 | 阻塞谁 | 建议 |
|---|---|---|---|
| B1 | **以哪个结局作为「现在」的起点** | 关系初值、全部 canon memory | 建议 TRUE END。已设计为配置项，改动不动架构 |
| B2 | **红线豁免未获批** | `resources/` 无法填充内容 | 需在 `00_harness/01_governance/decision_log.md` 立 DEC 条目 |
| B3 | **人格事实源优先级**：`nagi-ant-fic-writing`（同人世界）vs `authority/script/V17`（VN 剧情） | Personality 资源 | 建议：**人格规则以 fic-writing 为准，台词风格样本以 V17 为准**。前者管"凪该怎么想"，后者管"凪怎么说话"，职责不重叠 |

D1 有一个副作用值得单独点出：**「避免未来信息泄露」这条验收标准在 D1 下自动失效**（凪什么都知道）。立项书 §10 的 Timeline Consistency 需改写为「**不得编造剧情外事实**」——判据完全不同，前者是屏蔽，后者是防幻觉。

---

## 2. 系统全景

六层，自下而上依赖，**上层可换、下层不动**：

```
L5  Interface        CLI（MVP） / FastAPI（Phase 1.5）
─────────────────────────────────────────────────────
L4  Runtime          LangGraph 编排。只做流程，不含业务
─────────────────────────────────────────────────────
L3  Context Assembly 预算装箱 + 渲染。全项目核心
─────────────────────────────────────────────────────
L2  Memory           四类记忆的写入管线与检索
─────────────────────────────────────────────────────
L1  State            SQLite。canon / relationship / session
─────────────────────────────────────────────────────
L0  Resource         文件系统，只读。人格 / 规则 / 时间线 / 事件 / 策略
```

**迁移判据（8/26 验收本项）**：把 L4 整层删掉换成裸 API 循环，L0–L3 应当一行不用改。做不到就说明业务逻辑漏进了 runtime。

---

## 3. 技术选型

### 3.1 选型表

| 层 | 选型 | 版本 | 理由 |
|---|---|---|---|
| 语言 | Python | 3.12.10（本机已验证） | LangGraph 生态 |
| 编排 | LangGraph | ^0.2 | 显式状态图、可中断、可重放。比手写循环更适合"节点可替换"的要求 |
| LLM 接入 | **多 Provider，配置驱动** | — | 见 §3.4。首选免费的 Gemini，随时可切 |
| 主生成模型 | 配置项 `main` | — | 默认 Gemini Flash（免费档）。质量不够时切 `claude-opus-5` |
| 辅助模型 | 配置项 `aux` | — | 场景分类、记忆抽取、OOC 打分。每轮都跑，必须便宜或免费 |
| 数据校验 | Pydantic | v2 | **Schema 用 Pydantic model 定义，JSON Schema 由它导出**，不手写两份 |
| 配置 | pydantic-settings | ^2 | `.env` + 类型校验 |
| 存储 | SQLite（stdlib `sqlite3`） | — | 单用户单机，够用，零运维 |
| 向量化 | **可配置**：本地 `fastembed`+`bge-small-zh-v1.5` / 远端 embedding API | — | 默认本地：ONNX 运行时，**不装 torch**（省 2GB），无网络无配额。远端可省依赖但吃配额 |
| 向量检索 | **numpy 暴力余弦** | — | 见 §3.3 |
| 资源格式 | Markdown + YAML front-matter | — | 见 §6.1 |
| 测试 | pytest | ^8 | — |
| Eval | 自建 pytest 套件 | — | 见 §13 |

### 3.2 被否方案

| 方案 | 否决理由 |
|---|---|
| **RAG 框架（LlamaIndex / 完整 LangChain）** | 本项目的检索是"按状态装配"，不是"按相似度召回"。框架抽象会挡住预算控制这个核心诉求 |
| **向量数据库（Chroma / Qdrant / pgvector）** | 见 §3.3。记忆量级不够，纯增运维成本 |
| **把 Memory 交给 LangGraph checkpointer** | checkpointer 把状态绑死在 LangGraph 的持久化格式上，Phase 2 迁 DSH/Cordis 要重写。**Memory 必须自持久化，LangGraph 只拿引用** |
| **Node/TypeScript** | 可复用 story-data 读取代码，但 Agent 生态弱，编排要自己写 |
| **纯 Prompt + 长上下文** | 就是要被替代的旧方案 |

### 3.3 为什么 MVP 不上向量库

估算记忆规模：canon memory 由剧本派生，约 **300–800 条**；live memory 每天 20 轮 × 30% 值得记 ≈ 每天 6 条，一年约 2000 条。合计 **< 5000 条 × 512 维**。

float32 下 5000 × 512 × 4B ≈ **10MB**，全量装内存，numpy 一次矩阵乘全表扫描 **< 5ms**。

这个量级引入向量库纯亏。**超过 5 万条再换 sqlite-vec**，检索接口 `MemoryStore.search()` 已抽象，换实现不影响上层。

### 3.4 Provider 抽象（配置驱动，首选免费 Gemini）

**模型是可替换零件，不是架构假设。** 业务代码只认两个语义档位，不认任何厂商和模型名：

- `main` —— 凪的正式回复。质量优先
- `aux` —— 场景分类 / 记忆抽取 / OOC 打分。每轮都跑，便宜优先

```python
class LLMProvider(Protocol):
    def complete(
        self, system: str, messages: list[Msg], *,
        tier: Literal["main", "aux"],
        json_schema: dict | None = None,   # aux 类调用要结构化输出
    ) -> str: ...

class EmbeddingProvider(Protocol):
    def embed(self, texts: list[str]) -> np.ndarray: ...
```

配置文件（`config/providers.yaml`）决定挂谁，**改配置不改代码**：

```yaml
llm:
  active: gemini              # gemini | anthropic | deepseek | openai_compat
  providers:
    gemini:
      main: <flash 系列模型 id>       # 免费档
      aux:  <flash-lite 系列模型 id>  # 免费档
      api_key_env: GEMINI_API_KEY
    anthropic:
      main: claude-opus-5
      aux:  claude-haiku-4-5
      api_key_env: ANTHROPIC_API_KEY
    openai_compat:            # 兜底：任何 OpenAI 兼容端点（含本地 Ollama）
      base_url: ...
embedding:
  active: local               # local | remote
```

> 具体模型 id 与免费额度【推断】，需在 8/22 接入时到 Google AI Studio 核对当日实际值后回填。本文不写死。

**统一层要吃掉的差异**（这是 Provider 抽象真正的工作量，不是简单转发）：

| 差异 | 处理 |
|---|---|
| 结构化输出 | Anthropic 用 tool-use，Gemini 用 `responseSchema`，OpenAI 用 `json_schema`。统一成 `json_schema` 参数，各 provider 内部翻译 |
| System prompt | Gemini 是 `systemInstruction` 独立字段，Anthropic 是 `system` 顶层参数。统一层负责映射 |
| Prompt caching | Anthropic 是显式 `cache_control` 标记，Gemini 是 context caching（另一套 API 和最小 token 门槛）。**统一层只暴露「这些 block 可缓存」的意图**，能不能真缓存由各 provider 自己决定，业务不感知 |
| 限流 | 免费档有 RPM/RPD 硬限。统一层内置**指数退避 + 本地配额计数器**，超限时 `main` 自动降级到 `aux` 模型而不是直接报错 |
| 安全过滤 | Gemini 的 safety filter 可能拦截情感/亲密类内容并返回空。**必须处理空回复**，触发时按 §10.1 走降级模板并落日志——否则表现为「凪突然不说话了」 |

**最后一条是选 Gemini 免费档的主要工程风险**，本项目内容有大量亲密向对话。8/22 接入时第一件事就是拿 20 条真实语料压测拦截率。

### 3.4.1 用 Gemini 免费档要接受的三件事

1. **人格保真难度上升。** Flash 系列的中文角色扮演稳定性弱于 opus，更容易滑向「热情客服」。对策：§11 三道防线权重全部上调，特别是**风格锚（§11.1）从 3–5 段提到 6–8 段**，`token_budget` 从 1200 提到 1800。§9.2 预算表已同步。
2. **免费档的数据条款。** 【推断，需核对】Google AI Studio 免费层通常允许用提交内容改进服务，付费层不会。本项目内容是**私人同人创作 + 私人对话记忆**——接入前请自己确认当前条款能否接受。这不是技术问题，是你的判断。
3. **配额天花板。** 免费档的每日请求上限决定每天能聊多少轮。架构上单轮要 3–4 次调用（主生成 1 + aux 3），**建议把 aux 的三件事合并成一次调用**省配额（场景分类前置合并进记忆抽取的同一次请求）。

这三条都不动架构，只动配置和资源——**这正是 Provider 抽象要证明的东西**。

### 3.5 成本估算

单轮对话（20k 上下文预算，见 §9.2）。**Gemini 免费档下现金成本为 0，真实约束是配额不是钱**；下表按付费档估算，用于评估「质量不够要切 Claude」时的成本：

| 调用 | 模型 | 输入 tok | 输出 tok | 说明 |
|---|---|---|---|---|
| 场景分类 | haiku | ~600 | ~30 | 可忽略 |
| 主生成 | opus | ~18000 | ~300 | **主要成本项** |
| OOC 打分 | haiku | ~800 | ~20 | 可忽略 |
| 记忆抽取 | haiku | ~1200 | ~150 | 可忽略 |

> 单价【推断】，需按接入时的实际价目表核对后回填本节。
> 降本手段（按优先级）：① 主生成走 **prompt caching**，人格/规则/剧情骨架这些常驻块命中缓存；② 日常闲聊降级 sonnet，剧情/情绪场景才上 opus；③ 缩窄对话窗口。
> **prompt caching 是本架构的天然红利**——常驻块位置固定在最前，前缀稳定，命中率高。这也是 §9.3 把 always 类资源排在最前的原因之一。

---

## 4. 数据流全景

```
用户输入
   │
   ▼
[1] load_state ──────── SQLite 读 canon / relationship / session
   │
   ▼
[2] understand_scene ── haiku 分类 → scene tag（daily / plot / conflict / intimacy …）
   │
   ▼
[3] retrieve ────────── 向量检索 canon memory + live memory，各取 top-k
   │                    同时检索「风格锚」：3–5 段凪的真实台词
   ▼
[4] build_context ───── 候选资源按 activation 求值 → 按 priority 装箱 → 渲染 block
   │
   ▼
[5] generate ────────── opus 主生成
   │
   ▼
[6] guard ───────────── 硬规则 + haiku 打分。不合格 → 回 [5] 重试一次
   │
   ▼
[7] extract_memory ──── haiku 判定本轮是否值得记 → 写 episodic
   │
   ▼
[8] update_state ────── 关系值增量、turn+1、mood 更新 → 落 SQLite
   │
   ▼
回复用户
```

---

## 5. 目录布局（"放在哪里"）

```
Agent_Nagi_2.0/
├── README.md                     开工契约：怎么装、怎么跑、红线
├── pyproject.toml                依赖与包定义
├── .env.example                  GEMINI_API_KEY / ANTHROPIC_API_KEY（.env 本身 gitignore）
│
├── config/
│   └── providers.yaml            ★ 挂哪个模型厂商，改这里不改代码（§3.4）
│
├── docs/
│   ├── Nagi_Runtime_Harness_Project_Plan.md           立项书（原件）
│   ├── Nagi_Runtime_Harness_Architecture_Design_V1.md 架构书（原件）
│   ├── Nagi_Runtime_Harness_Technical_Design_V1.md    ← 本文，落地依据
│   ├── DECISIONS.md              本子项目决策记录
│   └── OPEN_QUESTIONS.md         pre-flight 问题清单
│
├── resources/                    ★ L0 资源层。只读，人可读可改，改完即生效
│   ├── MANIFEST.md               资源清单 + 与 authority 的派生关系
│   ├── core/
│   │   ├── personality.base.md         凪是谁（常驻）
│   │   ├── personality.speech.md       说话方式（常驻）
│   │   └── behavior.*.md               行为规则，按场景激活
│   ├── world/
│   │   ├── timeline.md                 剧情骨架（压缩版，常驻）
│   │   └── events/*.md                 事件条目，检索式激活
│   ├── relationship/
│   │   ├── baseline.true_end.md        TRUE END 的关系初值与语义
│   │   └── baseline.{good,normal,bad}_end.md
│   ├── style_anchors/                  ★ 凪的真实台词样本，防 OOC 的主力
│   │   └── *.md
│   └── policy/
│       ├── output_guard.md             禁用词、长度上限、OOC 判据
│       └── scene.*.md                  各场景的行为策略
│
├── schema/                       Pydantic 导出的 JSON Schema（生成物，不手改）
│
├── src/nagi_harness/
│   ├── config.py                 配置与路径
│   ├── models.py                 ★ Pydantic：State / Resource / MemoryItem
│   ├── providers/                LLM Provider 抽象 + Anthropic 实现
│   ├── resources/loader.py       扫 resources/，解析 front-matter，建索引
│   ├── memory/
│   │   ├── store.py              SQLite + numpy 检索
│   │   └── extractor.py          从对话抽记忆
│   ├── context/
│   │   ├── activation.py         activation 表达式求值
│   │   ├── budget.py             预算装箱
│   │   └── builder.py            渲染 block → system prompt
│   ├── guard/                    输出守卫
│   ├── runtime/graph.py          ★ LangGraph 图定义（唯一可替换层）
│   └── cli.py                    入口
│
├── evals/
│   ├── cases/*.yaml              对抗性用例
│   └── run_eval.py
│
├── tests/
└── var/                          运行时产物，gitignore
    ├── state.db
    └── embeddings.npy
```

**放置原则（一句话）**：

- 想改凪的性格 / 规则 / 知识 → 只动 `resources/`，**不碰代码**
- 想改流程 → 动 `src/nagi_harness/runtime/`
- 想改装配策略 → 动 `resources/` 里的 `activation` 字段，**仍然不碰代码**

这条原则就是"Harness 化"的实际含义。做不到就是没做到。

---

## 6. L0 资源层

### 6.1 资源格式：Markdown + YAML front-matter

正文是自然语言（人格描述、行为规则），用 JSON 写多行中文是自虐；元数据需要结构化。front-matter 是唯一合理的折中。

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

### 6.2 字段契约

| 字段 | 作用 |
|---|---|
| `id` | 全局唯一，点分命名 |
| `kind` | `personality` / `behavior_rule` / `timeline` / `event` / `relationship` / `skill` / `policy` / `style_anchor` |
| `source` | **回溯坐标**。`authority_md5` 与 `authority/MANIFEST.md` 不符 = 本资源已失效，需重新派生。这是防止 Agent 与 VN 事实漂移的机制 |
| `activation.always` | 常驻上下文 |
| `activation.scenes` | 命中这些 scene tag 时装配 |
| `activation.when` | 对 State 求值的布尔表达式，如 `relationship.friction > 60` |
| `activation.priority` | 0–100。预算不足时从低分砍起 |
| `activation.token_budget` | 本资源占用上限，超出则截断并告警 |

**`when` 表达式的安全实现**：不用 `eval()`。受限求值——只允许属性访问、比较、`and/or/not`、字面量，基于 `ast` 白名单遍历，约 40 行。

### 6.3 资源生效链路（"怎么生效"）

```
启动
 └─ ResourceLoader 扫描 resources/**/*.md
     ├─ 解析 front-matter → Pydantic Resource 对象
     │  （校验失败即启动失败，不静默跳过——静默跳过会导致人格悄悄少一半）
     ├─ 校验 source.authority_md5 → 不符则 WARN 并标记 stale
     └─ 建三个索引：by_id / by_kind / always 集合

每轮对话
 └─ ContextBuilder.build(state, scene, query)
     ├─ 候选 = always ∪ {r | scene ∈ r.scenes} ∪ {r | eval(r.when, state) is True}
     ├─ 检索类（event / memory / style_anchor）另走向量 top-k 补入
     ├─ 按 priority 降序装箱，累计不超总预算，超出的丢弃并记日志
     └─ 按固定顺序渲染成 block → system prompt
```

**改一个 `.md` 文件，下次启动即生效**，无需改代码、无需重新构建。开发期加 `--watch` 热重载。

### 6.4 资源与 authority 的关系（红线）

主仓库 `CLAUDE.md` 与 `authority/MANIFEST.md` 铁律第 1 条：**禁止把权威内容复制到其他位置**。

因此：

- `resources/` 里**不放 authority 原文**，只放**结构化转写**与**抽取结果**
- 每条资源必带 `source`，可回溯到 authority 的文件 + 章节
- **落地前必须先在 `00_harness/01_governance/decision_log.md` 立 DEC 条目**，并在 `authority/MANIFEST.md` 的「相关但不在本目录的权威关系」一节登记本资源包
- authority 改动 → `authority_md5` 失配 → 资源标记 stale → 重新派生

**在 DEC 条目获批前，`resources/` 只有目录和本节规则，不得填入任何内容。**（当前状态即如此）

---

## 7. L1 状态层

### 7.1 数据模型（Pydantic）

```python
class Canon(BaseModel):           # 既成事实，运行时只读
    epoch: Literal["post_ending"] = "post_ending"
    ending: Literal["true", "good", "normal", "bad"] = "true"  # ← B1 待确认，配置项
    route: Route                   # mj / path / final_choice，取自 story-data/endings.json
    days_since_ending: int = 0     # 凪需要它才能表达「多久没见」

class Relationship(BaseModel):     # 长期，随对话演进
    stage: str
    trust: int = Field(ge=0, le=100)
    intimacy: int = Field(ge=0, le=100)
    friction: int = Field(ge=0, le=100)          # ← 见下
    last_interaction_at: datetime

class Session(BaseModel):          # 短期，不长期持久化
    turn: int
    scene: str | None
    mood: str | None

class NagiState(BaseModel):
    schema_version: str = "0.1.0"
    canon: Canon
    relationship: Relationship
    session: Session
    memory_index: MemoryIndex      # 只存指针，正文在 Memory 层
```

**`friction` 为什么必须有**：剧本母版是 `V17_RelationshipFriction_Calibrated`——V17 的校准方向就是关系摩擦。只建模 trust / intimacy 会得到一个单调升温的恋爱机器人，这正是验收标准要避免的东西。`friction` 让凪可以"因为你烦到他而变冷"。

**`memory_index` 只存指针**：State 内联记忆正文会随轮次线性膨胀，几十轮后 state 本身就吃掉全部预算。

### 7.2 存储

`var/state.db`（SQLite），表：

| 表 | 内容 |
|---|---|
| `state_snapshot` | 每轮一条快照（`turn`, `json`, `ts`）。可回放、可回滚 |
| `memory_episodic` | 事件记忆 |
| `memory_semantic` | 长期事实 |
| `conversation_turns` | 原始对话 |
| `embeddings` | `(item_id, vector BLOB)`，启动时全量载入 numpy |

快照式而非原地更新：**可回放是调试角色 Agent 的刚需**——"凪为什么突然这么说"要能翻回当时的完整 state 和 context。

---

## 8. L2 记忆层

### 8.1 四类记忆

| 类型 | 内容 | 可写 | 来源 |
|---|---|---|---|
| **Canon** | 剧情既成事实 | ❌ 只读 | 由 `story-data` + 剧本预烘焙 |
| **Episodic** | 对话中发生的事 | ✅ | 每轮抽取 |
| **Semantic** | 长期事实（"Ant 讨厌早起"） | ✅ | 从 episodic 提炼、去重合并 |
| **Emotional** | 情绪标记，附着在上面三类 | ✅ | 抽取时一并打标 |

**Canon 与 Live 严格分离，不得混写。** 混写会让对话内容污染剧情事实——这是角色 Agent 最致命的失真。

### 8.2 写入管线

每轮 `generate` 之后，用 **haiku** 跑一次抽取：

```
输入：本轮 user + nagi 回复 + 当前 relationship
输出：{
  "worth_remembering": bool,          # 大部分闲聊是 false
  "episodic": {...} | null,
  "semantic_candidates": [...],
  "emotion": {"valence": -1..1, "arousal": 0..1, "tag": "..."},
  "relationship_delta": {"trust": +1, "friction": 0, ...}
}
```

三条约束：

1. **`worth_remembering` 默认从严**。什么都记 = 检索被噪声淹没
2. **`relationship_delta` 有单轮上限**（如 ±3），防止一句话把关系拉满
3. 抽取失败 / 超时 → 跳过，不阻塞回复。记忆丢一条可以接受，回复卡住不行

### 8.3 检索

- `fastembed` + `bge-small-zh-v1.5` 向量化，512 维
- 检索键 = 当前用户输入 + 当前 scene tag 拼接
- 混合排序：`score = 0.6 × 余弦 + 0.25 × 时近性 + 0.15 × 情绪强度`
  - **时近性**：最近的事更该被想起
  - **情绪强度**：情绪重的事记得更牢。这条对角色真实感的贡献比纯相似度更大
- canon 与 live **分池检索**，各自 top-k，防止 canon 淹没近期对话

---

## 9. L3 Context Assembly（核心）

### 9.1 原则

不是「全部知识 → LLM」，也不是「相似度 top-k → LLM」，而是：

> **按当前状态求值出候选集，按优先级在固定预算内装箱。**

预算是硬约束。没有预算约束的 context builder 只是个变相的 prompt 拼接器。

### 9.2 预算表（MVP，总 20k tokens）

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

**关系状态渲染成自然语言，不给数值。** 给模型 `trust: 85` 它不知道该怎么演；给"他现在愿意在你面前露出疲惫，但仍然不会主动说想你"它知道。**数值是给系统用的，自然语言是给模型用的。**

### 9.3 Block 顺序

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

①–④ 内容稳定，放最前是为了 **prompt caching 前缀命中**；⑩ 是一段短复述（"记住：他是凪，低反应，嫌麻烦，不会说漂亮话"）。

> 【推断】①–④ 的缓存命中率与 ⑩ 的防漂移效果，需在 8/27 用 eval 套件实测确认，不得直接当结论。

### 9.4 超预算处理

按 `priority` 升序丢弃，直到装得下。丢弃动作**必须写日志**——"凪忘了某件事"往往就是这里被静默砍掉了。日志字段：`turn, dropped_ids, requested_tokens, budget`。

---

## 10. L4 Runtime

### 10.1 LangGraph 图

```
START
  ↓
load_state
  ↓
understand_scene
  ↓
retrieve
  ↓
build_context
  ↓
generate ←──────┐
  ↓             │ retry（最多 1 次）
guard ──fail────┘
  ↓ pass
extract_memory
  ↓
update_state
  ↓
END
```

`guard` 二次失败 → 降级：用保守模板回复（凪的典型短回应），并记录为 eval 样本。
**宁可回一句"……好麻烦"，不可回一句 OOC 的甜言蜜语。**

### 10.2 节点契约

每个节点是纯函数 `(NagiState, ctx) -> dict`，只返回要更新的字段。副作用（SQLite 写、API 调用）集中在 `update_state` 和 provider 里。

**节点内不得包含业务判断**（"关系到多少才怎样"这类），一律由 `resources/policy/` 声明。这是 §2 迁移判据能成立的前提。

---

## 11. 人格保真机制（本项目真正的难点）

立项书把这条写成验收标准，但没给实现。**仅靠 prompt 描述人格必然漂移。** 三道防线：

### 11.1 风格锚（最有效）

每轮从 `resources/style_anchors/` 检索 6–8 段**凪的真实台词**（派生自 V17）注入上下文。
（用 Claude 时 3–5 段即可；Gemini 免费档下上调到 6–8 段，见 §3.4.1）

**给例子远比给描述有效**——"低反应"是形容词，一段真实对白是可模仿的目标。这是三道防线里投入产出比最高的一条。

### 11.2 输出守卫（硬规则，零成本）

`resources/policy/output_guard.md` 声明：

- 单条回复长度上限（凪不长篇大论）
- 禁用词表（过度热情的表达、不符合他语气的词）
- 感叹号 / 问号密度上限
- 禁止的行为模式（主动嘘寒问暖、主动表白、说教）

正则 / 统计即可判定，不花钱不花时间。

### 11.3 OOC 打分（软检查）

haiku 对生成结果打 0–5 分，低于阈值触发重生成。判据来自同一份 policy 文件。

**三道防线的拦截记录全部落库**，直接成为 eval 语料——线上拦截样本比人造用例更真实。

---

## 12. L5 接口层与部署形态

### 12.1 接口

- **MVP**：CLI（`nagi chat`）。附 `--debug` 打印本轮装配了哪些 block、各占多少 token、丢弃了什么
- **Phase 1.5**：FastAPI + 极简 Web UI，左侧对话右侧 state / memory 面板（立项书 §6 的「状态展示 / Memory 展示」）

`--debug` 面板不是锦上添花——**没有它就无法调试 context 装配**，属于 MVP 必需项。

### 12.2 结论：不需要服务器，但也不能走 NagisHeart 的 GitHub Pages 路子

这两件事经常被混为一谈，必须分开：

| 问题 | 答案 |
|---|---|
| 需要租服务器吗？ | **不需要。** MVP 在你自己电脑上跑，零成本零运维 |
| 能像 NagisHeart 那样部署到 GitHub Pages 吗？ | **不能。** 见下 |

**NagisHeart 能上 Pages 是因为它是纯静态**：HTML + JS + JSON，浏览器把整个游戏跑完，没有任何服务端逻辑，没有秘密。本项目有四个东西过不去：

| 障碍 | 说明 |
|---|---|
| **① API key 必然泄露（致命）** | 静态站点没有服务端，key 只能写进前端 JS。任何人 F12 就能拿走你的 Gemini key 去刷你的配额。**这一条单独就足以否决** |
| ② 跑的是 Python | GitHub Pages 只发静态文件，不执行任何服务端代码 |
| ③ 需要可写存储 | `state.db` 每轮都要写。Pages 的文件系统是只读的 |
| ④ 本地 embedding 模型 | ONNX 运行时在浏览器里跑不了（要换 transformers.js，是另一套工程） |

**GitHub 仍然要用——用来存代码，不是用来运行。** 且因为内容是私人同人创作与私人对话记忆，**建议用 private repo**（NagisHeart 是 public 因为它要发 Pages，本项目没这个需求）。

### 12.3 三种可选部署形态

| 形态 | 怎么跑 | 成本 | 手机可用 | 适用阶段 |
|---|---|---|---|---|
| **A. 本地运行** ← MVP 推荐 | `git clone` → `pip install -e .` → `nagi chat` | 0 | ❌ | 8/28 第一版 |
| **B. 本地 + 内网访问** | 本机跑 FastAPI，手机连同一 WiFi 访问局域网地址 | 0 | ✅（同一网络） | Phase 1.5 |
| **C. 免费云托管** | Hugging Face Spaces / Render / Fly.io 等免费档 | 0（有休眠/配额限制） | ✅（任何地方） | 想随时随地聊时 |

**形态 C 的注意事项**：免费档普遍会休眠、重启，**容器文件系统通常不持久**——`state.db` 一重启就没了，凪的记忆归零。真要上云，得同时解决持久化（挂持久卷，或把 SQLite 换成托管数据库）。这是「要不要服务器」的真实分界线：**不是为了跑代码，是为了存记忆**。

MVP 阶段建议就 A。`var/` 整个 gitignore，记忆只在你自己机器上——这对私人对话内容也是最合适的。

### 12.4 密钥管理（三种形态通用）

- API key 只从**环境变量**读，配置文件里只写变量名（见 §3.4 的 `api_key_env`）
- `.env` 加进 `.gitignore`，仓库里只留 `.env.example`
- 加 pre-commit 钩子扫描疑似 key 的字符串，防手滑提交

## 13. Eval 体系

### 13.1 五个维度与判据

| 维度 | 判据 | 自动化 |
|---|---|---|
| 人格一致性 | OOC 打分 ≥ 阈值；禁用词零命中 | ✅ 全自动 |
| **不编造剧情外事实** | 断言回复不含 canon 之外的具体事实 | ⚠️ 半自动（LLM judge + 人工抽检）|
| 记忆准确性 | 埋点记忆在后续轮次被正确召回 | ✅ 全自动 |
| 关系连续性 | 关系值变化单调合理，无跳变 | ✅ 全自动 |
| Context 效率 | 每轮实际 token 用量 vs 预算；丢弃率 | ✅ 全自动 |

> 立项书的「避免未来信息泄露」在 D1（通关之后）下不成立，已替换为「不编造剧情外事实」。

### 13.2 对抗性用例（8/21 先写，30 条）

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

**先有尺子再造东西。** 8/21 必须完成，否则 8/27 的"测试优化"无从谈起。

---

## 14. MVP 最小集（"最小包含哪些东西"）

### 14.1 必须有（8/28 第一版）

| # | 组件 | 完成判据 |
|---|---|---|
| 1 | ResourceLoader + front-matter 解析 | 改 `.md` 重启即生效 |
| 2 | 五类资源各至少一份：personality / speech / behavior / timeline / relationship_baseline | 通过 schema 校验 |
| 3 | style_anchors 至少 30 段凪真实台词 | 检索可命中 |
| 4 | State（Pydantic + SQLite 快照） | 可回放任意一轮 |
| 5 | Memory：canon + episodic + 向量检索 | 埋点记忆可召回 |
| 6 | ContextBuilder：activation 求值 + 预算装箱 | `--debug` 可见完整装配明细 |
| 7 | LangGraph 8 节点图 | 端到端跑通 |
| 8 | Guard：硬规则 + OOC 打分 + 降级 | 拦截有日志 |
| 9 | CLI + `--debug` | — |
| 10 | Eval 30 条 + 报告 | 可重复执行 |

### 14.2 明确砍掉（Phase 1.5 及以后）

| 项 | 理由 |
|---|---|
| Web UI / API | CLI + debug 面板足够验证架构 |
| Semantic / Emotional 独立分层 | MVP 先合并进 episodic 加 tag |
| 向量数据库 | numpy 够用（§3.3） |
| 记忆遗忘 / 衰减机制 | 一年内数据量不构成问题 |
| 多用户 / 多会话 | 本项目就一个用户 |
| 主动发起对话 | 不在立项范围 |
| DeepSeek / Cordis 迁移 | Phase 2 |

**砍掉的每一项都不影响 §2 的迁移判据**——这就是判断"能不能砍"的标准。

---

## 15. 修正后的排期

原排期把 Context 与 Memory 各压一天，这两块是全项目仅有的真难点，其余是脚手架。调整：

| 日期 | 原计划 | 修正后 |
|---|---|---|
| 8/20 | 项目启动 | 技术方案（本文）+ 骨架 + **立 decision_log 条目（解 B2）** |
| 8/21 | Schema | Pydantic 模型 + **Eval 30 条对抗用例** + **B3 人格源比对** |
| 8/22 | 基础 Runtime | Provider + ResourceLoader + 最小 LangGraph（能回话即可）|
| 8/23 | Context Engine | **Context Builder（1/2）**：activation 求值 + 预算装箱 |
| 8/24 | Memory System | **Context Builder（2/2）+ Memory 写入管线** |
| 8/25 | Scene Skill | **Memory 检索 + 混合排序**；Scene Skill 降级为配置工作（半天）|
| 8/26 | Harness 化 | Guard 三道防线 + **迁移判据验证（删 L4 测试）** |
| 8/27 | 测试优化 | 跑 Eval，按报告调 resources（**只调资源不改代码**）|
| 8/28 | Demo | 第一版 + Eval 报告 |
| 8/29–31 | 复盘 | 架构总结 + DSH / Cordis 迁移实验 |

**今天（8/20）的关键动作是 B2**：红线豁免不批，8/21 之后全部空转。

---

## 16. 风险

| 风险 | 影响 | 应对 |
|---|---|---|
| **B2 未获批** | 8/21 起全线阻塞 | 今天就立 decision_log 条目 |
| **人格仍然漂移** | 项目核心价值不成立 | 三道防线（§11）；若仍不达标，加大 style_anchor 权重，并考虑少量微调样本 |
| **B3 人格源冲突未解** | Character Schema 返工 | 8/21 先做 20 段台词比对 |
| **Gemini safety filter 拦截亲密向内容** | 凪随机不说话，体验崩坏 | 8/22 接入首日用 20 条真实语料压测拦截率；空回复走降级模板并落日志（§3.4）|
| **Gemini Flash 人格保真不足** | 滑向热情客服 | 风格锚提到 6–8 段；仍不达标则 `main` 切 Claude（改一行配置）|
| **免费档配额撞顶** | 每天聊不了几轮 | aux 三件事合并成一次调用；统一层配额计数 + 自动降级 |
| **模型成本超预期**（切付费档后） | 无法长期使用 | prompt caching + 分级模型（§3.5）|
| LangGraph 抽象泄漏 | Phase 2 迁移重写 | §2 迁移判据，8/26 实测 |
| 检索召回不准 | 凪"记错事" | 混合排序 + eval 埋点用例 |

---

## 17. 与立项书的差异（需回写立项书）

| 项 | 立项书 | 本文 | 原因 |
|---|---|---|---|
| Timeline Consistency | 「避免未来信息泄露」 | 「不编造剧情外事实」 | D1 下凪全知，原判据不成立 |
| 关系模型 | trust / intimacy / stage | 增加 **friction** | 剧本母版是 V17 摩擦校准版 |
| 记忆模型 | 三类 | 增加 **Canon / Live 分离** | 防对话污染剧情事实 |
| 人格一致性 | 只有验收标准 | 增加 **§11 三道防线** | 原文无实现方案 |
| 8/25 Scene Skill | 整天 | 半天，时间挪给 Context / Memory | 难点分配不合理 |
| 向量库 | 未提 | 明确 MVP 不上 | 量级不够 |
| 模型 | 未指定 | **多 Provider 配置驱动，首选免费 Gemini** | Ant 2026-08-20 指定 |
| 部署 | 未提 | **本地运行，不上 GitHub Pages** | §12.2：静态托管必然泄露 API key |

---

## 18. 待裁决（本文交付时的未决项）

1. **B1** — 以哪个结局作为「现在」的起点？（默认 TRUE END，配置项）
2. **B2** — 是否批准派生资源包并立 decision_log 条目？
3. **B3** — 人格事实源分工：fic-writing 管人格规则 + V17 管台词风格，是否认可？
4. **Gemini 免费档的数据条款是否接受**（§3.4.1 第 2 条）——私人同人创作与对话记忆会提交给第三方
5. 部署形态确认为 **A. 本地运行**（§12.3），仓库设为 private
6. §3.5 的模型单价需按实际价目表核对回填
7. §15 修正排期是否采纳
