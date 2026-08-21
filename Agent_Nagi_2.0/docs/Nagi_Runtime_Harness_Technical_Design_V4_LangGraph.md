# Nagi Runtime Harness — 技术方案 V4（LangGraph 主 Runtime）

- 文档性质：技术设计（TDD）
- 日期：2026-08-20
- 状态：**已定稿（2026-08-20，Ant）**。后续变更走 DECISIONS.md 立条目
- 本文取代 V1、V2、V3，作为当前技术落地依据
- 定稿补记：同步 NRH-20260820-019（国产模型优先、当前仅本地开发），并修正 D1 结局口径
- 核心变更：恢复 LangGraph 为主 Runtime；前端复用 GitHub 开源聊天客户端；后续由 DSH 承载 Harness、LangGraph 作为内部 Runtime

---

## 0. 立项目标校正

本项目不只是“做出一个能聊天的 Nagi”，而是用长期人格、持续关系与长期记忆这一高难场景，验证 Agent 框架是否真正提供工程价值。

必须回答五个问题：

1. LangGraph 的 StateGraph 是否比手写流程更清楚地表达角色运行状态与分支？
2. Checkpoint 是否能支持会话恢复、故障续跑、状态回放与人格漂移定位？
3. Store / Memory 接缝是否适合 Canon 与 Live 长期记忆？
4. Streaming、重试、条件边与可观测性是否能降低自研成本？
5. LangGraph 能否作为有状态 Runtime 嵌入 DSH，由 DSH 负责更外层的 Resource / Skill / Policy 组合？

因此：

- **LangGraph 是主实验对象，不是可有可无的依赖。**
- 后续接入 DSH 时不替换 LangGraph，而是把 LangGraph 作为 DSH 内部 Runtime。
- Nagi 的人格、剧情、关系规则不得写死在 Graph 节点中。
- 最终报告必须同时评价“角色效果”和“框架能力”，不能只报 Demo 能运行。
- 不自研聊天前端；从 GitHub 选择成熟开源客户端，通过兼容 API 接入。

---

## 1. 已定决策

| # | 决策 | 工程含义 |
|---|---|---|
| D1 | 时间锚为通关后的“现在” | Canon 只读，Live 可写。**结局已定为 TRUE END**（NRH-20260820-004），且只进入 CanonWorld，不下发给使用者关系 |
| D2 | TypeScript 服务端 + 开源聊天客户端 | L0–L4 在服务端；前端从 GitHub 选型并配置接入 |
| D3 | **LangGraph.js `StateGraph` 为主 Runtime** | 使用图状态、条件边、checkpoint、streaming |
| D4 | 后续把 LangGraph 接入 DSH | DSH 管 Harness 与资源组合，LangGraph 管有状态执行、checkpoint 与恢复 |
| D5 | BYOK | key 随请求透传，用完即弃，不落库、不记录 |
| D6 | 不自研聊天 UI | 优先选择支持自定义 API Base URL、流式输出和移动端的开源客户端 |
| D7 | Provider 配置驱动 | 业务只认 `main` / `aux` / `embedding` 能力 |
| D8 | **国产模型优先，不以 Gemini 为默认** | NRH-20260820-019。首版接入一个国产聊天模型 API；Adapter 保持厂商无关 |
| D9 | **当前阶段仅本地开发与验证** | NRH-20260820-019。上线时再采购中国内地轻量云服务器，规格按实付价格定 |

### 1.1 Ant 已裁决

| # | 裁决 | 工程结论 |
|---|---|---|
| B1 | 普通使用者不继承游戏主角关系 | 采用 CanonWorld + UserRelationship 双关系模型 |
| B2 | 批准 Agent 专用资源包 | 资源从原始资料派生，服务端专用，不下发前端 |
| B3 | 人格直接参考人设文件 | Personality、Speech、Behavior 均以 `resources/core/NagisHeart_Nagi_Character_Bible_v0_5_Full_Merged.md` 为源；V17 不再承担台词风格权威 |
| B4 | 后续按“LangGraph 塞进 DSH”实施 | DSH 是外层 Harness，LangGraph 不是被替换的对照对象 |
| B5 | 首发规模 50 人足够 | 按最多 50 个用户身份设计配额、存储与隔离；金额预算待部署阶段按实付价格定（D9）|

人格事实源已登记为 `resources/core/NagisHeart_Nagi_Character_Bible_v0_5_Full_Merged.md`。资源派生必须保留章节坐标、源版本与 SHA-256，不得自行拿 V17 或旧 fic-writing 规则替代、补写或自动融合。

### 1.2 身份模型必须先拆开

已裁决：禁止把 TRUE END 的恋爱关系直接赋给每位使用者。

```ts
interface CanonWorldState {
  epoch: "post_ending";
  ending: "true" | "good" | "normal" | "bad";
  protagonistRelationship: CanonRelationship;
}

interface UserRelationshipState {
  userId: string;
  stage: string;
  trust: number;
  intimacy: number;
  friction: number;
  lastInteractionAt: string;
}
```

Canon 表示凪经历过什么；UserRelationship 表示凪与当前使用者现在如何。两者不得混成同一个关系对象。

---

## 2. 技术事实与采用范围

LangGraph.js 当前官方能力包括：

- `StateGraph`：State、Nodes、Edges、Conditional Edges；
- Checkpointer：按 `thread_id` 保存每个 super-step 的 checkpoint；
- State history / time travel：查看、回放、分叉历史状态；
- Store：保存跨 thread 的长期数据；
- Streaming：`updates`、`values`、`messages`、`custom`、`debug` 等模式；
- Interrupt：持久化暂停与恢复；
- SQLite / Postgres 等独立 checkpointer 实现。

官方依据：

- Graph API：https://docs.langchain.com/oss/javascript/langgraph/graph-api
- Persistence：https://docs.langchain.com/oss/javascript/langgraph/persistence
- Streaming：https://docs.langchain.com/oss/javascript/langgraph/streaming
- Interrupts：https://docs.langchain.com/oss/javascript/langgraph/interrupts

首版主动使用：StateGraph、conditional edges、checkpoint、state history、custom streaming。

首版保留但不强行制造场景：interrupt、subgraph、并行 fan-out。没有真实需求时不为了展示框架而增加复杂度。

---

## 3. 总体架构

```text
┌──────────────────────────────────────────┐
│ GitHub 开源聊天客户端                      │
│ Chat / Settings / BYOK                     │
│ 通过 OpenAI-compatible API 接入            │
└──────────────────┬───────────────────────┘
                   │ HTTPS + fetch stream
┌──────────────────▼───────────────────────┐
│ API Server：Node.js                       │
│ 鉴权 / 限流 / CORS / SSE framing          │
├──────────────────────────────────────────┤
│ L4 LangGraph Runtime                      │
│ StateGraph / conditional edge / checkpoint│
├──────────────────────────────────────────┤
│ L3 Context Builder                        │
│ activation / retrieval / budget / render  │
├──────────────────────────────────────────┤
│ L2 Memory                                 │
│ Canon / Live / vector metadata            │
├──────────────────────────────────────────┤
│ L1 Domain State                           │
│ CanonWorld / UserRelationship / Session   │
├──────────────────────────────────────────┤
│ L0 Character Resources                    │
│ personality / timeline / anchors / policy │
└──────────────────┬───────────────────────┘
                   │ BYOK
┌──────────────────▼───────────────────────┐
│ LLM / Embedding Providers                 │
└──────────────────────────────────────────┘
```

分层原则：

- LangGraph 只负责编排、运行状态、重试、checkpoint 与事件流。
- Context、Memory、Resource、Guard 是独立领域服务。
- Graph 节点只调用 Ports，不包含人格规则和关系阈值。
- 接入 DSH 时，`core/`、`resources/`、`evals/` 必须保持不变；DSH 通过适配层调用已编译的 LangGraph Runtime。

---

## 4. LangGraph 状态设计

Graph State 是“一次运行的工作台”，不是数据库，也不是把整个 Nagi 世界复制进去。

```ts
interface NagiGraphState {
  request: {
    requestId: string;
    userId: string;
    threadId: string;
    message: string;
    vendor: string;
  };

  domain: {
    canon: CanonWorldState;
    relationship: UserRelationshipState;
    session: SessionState;
  };

  analysis: {
    scene: string;
    query: string;
    retrievedIds: string[];
  };

  context: {
    blocks: ContextBlock[];
    estimatedTokens: number;
    dropped: DroppedBlock[];
  };

  generation: {
    attempt: number;
    candidate: string;
    accepted: string | null;
    providerUsage?: ProviderUsage;
  };

  guard: {
    hardViolations: GuardViolation[];
    oocScore?: number;
    decision: "pending" | "pass" | "retry" | "fallback";
  };

  effects: {
    memoryDrafts: MemoryDraft[];
    relationshipDelta?: RelationshipDelta;
    committed: boolean;
  };

  trace: TraceEvent[];
}
```

禁止放入 Graph State：API key、完整 Resource 正文、全量向量、数据库连接、不可序列化客户端对象。

API key 通过运行时依赖注入，只活在本次请求作用域，不进入 checkpoint。

---

## 5. 主图

```text
START
  ↓
validate_request
  ↓
load_domain_state
  ↓
classify_scene
  ↓
retrieve_context
  ↓
assemble_context
  ↓
generate_candidate
  ↓
hard_guard
  ├── pass ─────────────→ soft_judge
  └── fail + attempt<2 ─→ revise_context ─→ generate_candidate
                               ↑                 │
                               └─────────────────┘

soft_judge
  ├── pass ─────────────→ extract_effects
  ├── retry allowed ────→ revise_context
  └── quota/unavailable → accept_hard_guarded

extract_effects
  ↓
commit_turn
  ↓
emit_response
  ↓
END
```

### 5.1 节点职责

| Node | 职责 | 不得做 |
|---|---|---|
| `validate_request` | 校验消息、vendor、requestId、配额 | 不读人格资源 |
| `load_domain_state` | 读取 Canon、用户关系和 Session | 不拼 prompt |
| `classify_scene` | 轻量场景识别 | 不更新关系 |
| `retrieve_context` | 检索 style anchor、Canon、Live | 不决定输出 |
| `assemble_context` | activation + 预算装箱 + 渲染 | 不调用模型 |
| `generate_candidate` | 调 main provider，生成完整候选 | 不直接发给用户 |
| `hard_guard` | 硬规则检查 | 不改领域状态 |
| `soft_judge` | aux OOC 评分 | 不成为唯一人格裁判 |
| `revise_context` | 根据违规原因追加纠偏块 | 不修改 Canon |
| `extract_effects` | 抽取记忆与关系变化草案 | 不落库 |
| `commit_turn` | 原子提交 turn、memory、relationship | 不再调用模型 |
| `emit_response` | 只发布已接受文本和最终状态 | 不暴露资源正文 |

### 5.2 条件边

条件边只读取明确字段：`guard.decision`、`generation.attempt`、provider error type。

禁止在 edge router 内写“trust > 80 就主动表白”之类角色逻辑；这种规则属于 Resource / Policy。

---

## 6. Streaming 与 Guard 的一致性

原 V3 的“上游 token 直接流给客户端，再做 Guard”不可实现可靠拦截：用户已经看到的 OOC 内容无法撤回。

V4 采用两段流：

1. Graph 执行期间通过 LangGraph `custom` / `updates` 流发送安全状态：加载状态、检索记忆、生成中、检查中。
2. `generate_candidate` 在服务端缓冲完整候选。
3. Guard 通过后，`emit_response` 才把已接受文本发给客户端。
4. 对 OpenAI-compatible 客户端，将已接受文本切成标准流式 chunk 输出；这不是上游原始 token 直通。

```text
event: progress  data: { node: "retrieve_context" }
event: progress  data: { node: "generate_candidate" }
event: progress  data: { node: "hard_guard" }
event: response  data: { text: "……好麻烦。" }
event: state     data: { relationship, scene, mood }
event: done      data: { requestId, checkpointId }
```

普通开源聊天客户端只接收最终回复。Node、耗时、token、丢弃块 ID 进入服务端 Debug API 与日志；永不下发资源正文和完整 system prompt。

### 6.1 已知代价：首字延迟（8/25 量测后再决定是否优化）

两段流的代价是**使用者在候选生成完并通过 Guard 之前看不到任何字**。
`progress` 事件对普通开源客户端不可见，实际体感是：发出消息 → 空白若干秒 → 整段出现。

**本期不改设计**，理由是该延迟取决于所选模型生成约 300 token 的实际速度，
现在只能靠猜；量测成本极低，猜错代价不对称。

**8/25 做 Guard 时必须实测首字延迟并记录**，据数据决定：

| 实测 | 处置 |
|---|---|
| ≲ 3s | 不动，本条关闭 |
| ≳ 6s | 评估混合流：`hard_guard` 是正则/统计，可增量检查、边流边掐；`soft_judge` 需完整文本，退到尾部 |

⚠️ **混合流不是纯 UI 优化**：一旦开始边流边发，
`hard_guard` 不过 → `revise_context` → 重新生成 这条边即失效（字已发出，无法撤回），
软判将只能用于记录与下一轮纠偏。**改动落在 L4 图拓扑与 Guard 实现上**，
因此若要改，须在 L4 定型前决定，不可无限期推迟。

---

## 7. Persistence：框架能力验证重点

### 7.1 Checkpointer 管什么

LangGraph Checkpointer 保存：

- 每个 super-step 的 Graph State；
- 当前准备执行的节点；
- pending writes；
- checkpoint history；
- 失败后的恢复位置。

首版本地 / 小规模部署使用 `@langchain/langgraph-checkpoint-sqlite`。
若进入公开多实例部署，迁移 Postgres checkpointer；不得用共享文件卷 SQLite 横向扩容。

### 7.2 Domain Store 管什么

长期领域数据独立建模：

- Canon memories；
- Live memories；
- turns；
- UserRelationship；
- embedding vectors 与版本；
- export / import 数据。

首版允许与 checkpointer 共用同一个 SQLite 文件，但表与访问接口必须分离。

### 7.3 为什么不把所有数据都塞进 checkpoint

- checkpoint 是运行快照，不是长期记忆检索库；
- 全量记忆进入 State 会导致每步序列化体积持续膨胀；
- 领域数据需要独立导出、删除、配额与索引；
- 框架迁移时，领域数据不能被 checkpoint 格式绑死。

### 7.4 Thread 与用户身份

```text
userId       = HMAC(syncCredential)
thread_id    = userId + ":" + conversationId
namespace    = ["nagi", userId, "memory"]
```

同步码是 bearer credential，不直接作为数据库主键保存。日志只记录不可逆短哈希。

同一 `thread_id` 同时只允许一个写运行；请求必须带 `requestId`，`commit_turn` 做幂等与事务提交。

---

## 8. Memory 与 Embedding

### 8.1 分层

| 类型 | 说明 | 可写 |
|---|---|---|
| Canon | 选定时间线中真实发生的剧情事实 | 否 |
| Episodic | 用户与凪的一次具体经历 | 是 |
| Semantic | 从多次经历提炼出的稳定用户事实 | 是 |
| Emotional | 记忆的情绪标签，不单独复制正文 | 是 |

CanonWorld 与 UserRelationship 分离后，凪不会把与原主角的终局亲密度错误继承给新用户。

### 8.2 Embedding 必须独立版本化

```ts
interface VectorRecord {
  itemId: string;
  modelId: string;
  dimension: number;
  version: number;
  vector: Float32Array;
}
```

- Canon 与查询向量必须来自同一 embedding 模型与版本。
- 更换聊天 LLM 不得自动更换 embedding 模型。
- embedding provider 与 `main` / `aux` 分开配置。
- 模型变化时后台重建全部向量，禁止混合向量空间检索。

### 8.3 检索

查询 = 用户输入 + scene tag。

Canon 与 Live 分池，各取 top-k，再按相似度、时近性、情绪强度混排。权重属于可测配置，不在 Graph 节点硬编码。

---

## 9. Context Builder

Context Builder 是独立纯 TypeScript 包，输入为领域状态、检索结果与资源元数据，输出为有序 Context Blocks。

人格资源来源已定：

- `personality`、`speech`、`behavior_rule` 直接派生自 `resources/core/NagisHeart_Nagi_Character_Bible_v0_5_Full_Merged.md`；
- V17 只作为剧情 Canon 来源之一，不再单独充当“台词风格权威”；
- 不把多个互相冲突的人格来源做自动融合；
- 派生资源保留源文件坐标与哈希，源文件变化时强制重新派生。

```ts
interface ContextBuilder {
  build(input: ContextBuildInput): Promise<ContextBuildResult>;
}
```

装配顺序：

1. 人格核心；
2. 说话方式；
3. 风格锚；
4. Canon 剧情骨架；
5. 当前用户关系自然语言描述；
6. 场景策略与行为规则；
7. Canon / Live 记忆；
8. 对话窗口；
9. 尾部人格复述。

规则：

- 总预算是硬约束；
- 超预算按优先级丢弃并记录；
- 数值状态先渲染为可表演的自然语言；
- prompt、资源和装配逻辑不下发客户端；
- Graph 只接收装配结果，不理解资源内部语义。

---

## 10. Provider Ports

```ts
interface ChatProvider {
  complete(req: ChatRequest, secret: RequestSecret): Promise<ChatResult>;
}

interface EmbeddingProvider {
  readonly modelId: string;
  readonly dimension: number;
  embed(texts: string[], secret?: RequestSecret): Promise<Float32Array[]>;
}
```

首版只实现**一个国产聊天模型 Provider**（D8 / NRH-20260820-019），不以 Gemini 为默认。
其他厂商保留配置位，不在跑通前并行开发。具体厂商与模型 id 在 8/22 接入时按当日可用性与价格确定，本文不写死。

BYOK 纪律：

- key 不进入 Graph State、checkpoint、trace、错误对象和日志；
- 反向代理禁止记录 `X-LLM-Key`；
- CORS 只允许正式客户端 origin；
- vendor 必须来自服务端白名单，用户不能提交任意 endpoint；
- JS 无法保证物理擦除内存，文档不得声称“请求后安全清零”，只能保证不持久化、不主动缓存。

---

## 11. API 与开源前端接入

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/v1/chat/completions` | OpenAI-compatible 主入口；启动 LangGraph run，Guard 后返回标准流式回复 |
| GET | `/api/state` | 返回用户关系、scene、mood、记忆统计 |
| GET | `/api/history` | 分页返回已提交 turns |
| GET | `/api/runs/:requestId` | 查看 run 状态与 checkpoint 摘要 |
| POST | `/api/save/export` | 导出用户领域数据，不含向量与 checkpoint |
| POST | `/api/save/import` | 校验后恢复，必须限制大小并原子执行 |
| GET | `/api/health` | 服务健康检查 |

采用 OpenAI-compatible 接口是为了让现成聊天客户端只需配置 Base URL 即可使用，不为 Nagi 重写聊天窗口。Nagi 专有状态和 Debug 信息走独立 API，不污染标准聊天协议。

### 11.1 GitHub 前端选型标准

只选满足以下条件的现成项目：

- 许可证允许部署和必要修改；
- 支持自定义 OpenAI-compatible Base URL；
- 支持流式回复与 BYOK；
- 移动端可用；
- 无需把 Nagi Resources、system prompt 或服务端代码打进前端；
- 最好可以纯配置接入，避免维护长期 fork；
- 项目仍有维护活动，依赖与安全更新没有明显停滞。

首版只负责选型、配置、主题与必要的薄适配，不开发消息列表、输入框、Markdown 渲染、PWA 壳等通用聊天功能。

### 11.2 首发容量

- 首发总用户规模按 **50 个用户身份**设计，不把它解释为 50 并发请求；
- 同步凭证创建达到上限后停止自动创建，由 Ant 手动释放或扩容；
- 每个用户独立 namespace、thread、Live Memory 与配额；
- 并发上限在部署平台确定后压测，不在文档中凭空填写；
- 金额预算未定，选型先满足 50 用户的数据隔离与可靠持久化，再比较档位；
- **当前阶段仅本地开发验证（D9）**，云服务器在上线阶段采购，候选为中国内地轻量云服务器。

---

## 12. 目录

```text
Agent_Nagi_2.0/
├── docs/
├── resources/                         # 服务端专用
├── config/
│   ├── providers.yaml
│   └── runtime.yaml
├── packages/
│   ├── core/                          # 领域类型与纯逻辑
│   │   ├── domain/
│   │   ├── resources/
│   │   ├── context/
│   │   ├── memory/
│   │   ├── guard/
│   │   └── ports/
│   ├── runtime-langgraph/             # 主实验
│   │   ├── state.ts
│   │   ├── graph.ts
│   │   ├── nodes/
│   │   ├── edges/
│   │   ├── persistence/
│   │   └── streaming/
│   ├── server/
│   │   ├── api/
│   │   ├── middleware/
│   │   ├── providers/
│   │   └── db/
│   └── integrations/
│       └── chat-client/               # 开源前端配置、薄适配与版本记录
├── scripts/
│   └── bake-canon.ts
├── evals/
│   ├── cases/
│   ├── framework/
│   └── run.ts
└── tests/
```

ESLint 强制：

- `core` 不得 import LangGraph、HTTP、数据库驱动或 UI；
- `runtime-langgraph` 可以 import `core`，反向禁止；
- 开源聊天客户端不得打包或下载 `core`、runtime、server、resources；
- 节点不得直接读取资源文件或执行 SQL，只能调用 Ports。

---

## 13. Eval：角色效果与框架能力分开

### 13.1 角色 Eval

| 维度 | 判据 |
|---|---|
| 人格一致性 | OOC 评分、禁用模式、Ant 人工盲评 |
| Canon 一致性 | 不把其他结局当成亲历事实，不编造剧情外具体事实 |
| 记忆准确性 | 埋点记忆能召回，错误记忆不写入 |
| 关系连续性 | 单轮变化受限，重放后结果可解释 |
| Context 效率 | 预算、丢弃率、命中率、估算偏差 |
| 用户隔离 | 两个 userId 互不可见 |

### 13.2 LangGraph 框架 Eval

| 能力 | 实验 |
|---|---|
| 状态表达 | Graph State 是否减少隐式共享变量与分支混乱 |
| Checkpoint | 在指定节点故障，能否从最后成功 super-step 续跑 |
| Time travel | 能否还原某轮完整状态并重放另一分支 |
| Streaming | 能否稳定输出 node progress、debug 与最终回复 |
| 条件边 | Guard retry / fallback 是否比手写 if/while 更易读、可测 |
| 可观测性 | 是否能定位“哪个节点、哪个 Context block 导致 OOC” |
| 持久化成本 | Checkpointer 与 Domain Store 是否重复、膨胀或难迁移 |
| Harness 接入（**后续阶段，不在本期排期**，见 §15） | DSH 能否在不改 LangGraph 内部状态图的前提下装配 Resource / Skill / Policy |

### 13.3 DSH 集成实验（后续阶段）

最初计划不是用 DSH 替换 LangGraph，而是把 LangGraph 放进 DSH：

```text
DSH Harness
  ├── Character Resources
  ├── Skills / Policies
  ├── Provider 配置
  └── LangGraph Runtime Adapter
        └── Nagi StateGraph
```

职责边界：

- DSH：Resource、Skill、Policy、Provider 的发现、选择与组合；
- LangGraph：单次及跨轮运行状态、条件边、checkpoint、恢复与 time travel；
- Core：Context、Memory、Guard 与领域模型，保持框架无关；
- Adapter：把 DSH 激活的资源集合转换成 LangGraph 本轮输入。

集成验收重点是避免“双重 Runtime”：DSH 不得复制 LangGraph 的 thread state，LangGraph 也不得自行实现 DSH 的资源发现机制。DSH 尚不可用或 API 不稳定时，记录阻塞并保留 LangGraph 独立运行版本。

---

## 14. MVP

### 14.1 第一阶段：框架最小闭环

1. StateGraph 与完整主图可运行；
2. 一个聊天 Provider；
3. 最小 Personality、Style Anchor、Canon 骨架；
4. Context Builder 能装箱并输出 Debug Trace；
5. SQLite checkpointer 能恢复 thread；
6. Guard retry 条件边可触发；
7. 选定的开源聊天客户端能通过 OpenAI-compatible API 收到最终回复；
8. 10 条最小 Eval 可重复跑。

完成判据不是“文件齐”，而是：人为让 `generate_candidate` 后的节点失败，重新调用后从 checkpoint 恢复，并能通过 Debug API 解释整轮路径。

### 14.2 第二阶段：长期存在

1. Canon / Live 记忆；
2. embedding 版本化与检索；
3. UserRelationship 更新；
4. 30 条角色 Eval；
5. 导出 / 导入；
6. 同步凭证与用户隔离。

### 14.3 后续阶段：把 LangGraph 接入 DSH

1. 确认 DSH 的 Resource、Skill、Policy 与 Runtime Adapter 接口；
2. 实现 `LangGraphRuntimeAdapter`；
3. 由 DSH 选择本轮资源，再把激活结果交给 Nagi StateGraph；
4. 保留 LangGraph checkpoint 与 thread 作为唯一运行状态；
5. 跑同一套角色 Eval，确认套入 DSH 后人格与记忆行为不退化。

### 14.4 明确后置

- 自研聊天前端与 App 壳；
- 多 Provider 全实现；
- 主动发起对话；
- 多 Agent；
- 工具调用生态；
- 为展示框架而加入 HITL；
- 对开源聊天客户端做大规模二次开发。

---

## 15. 排期

| 日期 | 内容 |
|---|---|
| 8/20 | V4 评审；裁决 B1/B2/B3 |
| 8/21 | Monorepo、core ports、Graph State、10 条最小 Eval |
| 8/22 | StateGraph 主图、**国产模型 Provider**、最小对话闭环；**开源聊天客户端选型 spike（建议前移，见下）** |
| 8/23 | Context Builder、资源加载、Debug Trace |
| 8/24 | Checkpointer、thread 恢复、故障续跑实验 |
| 8/25 | Guard 条件边、重试、两段流；**实测首字延迟并记录（§6.1）** |
| 8/26 | Canon / Live Memory、embedding 版本化 |
| 8/27 | 用户关系、隔离、导出 / 导入；开源聊天客户端配置接入与主题 |
| 8/28 | OpenAI-compatible 接入、30 条角色 Eval、**本地 Demo**（云部署按 D9 延后） |
| 8/29 | Checkpoint 故障恢复、time travel 与并发回归 |
| 8/30 | 人格与记忆调优、安全检查、部署稳定性 |
| 8/31 | LangGraph 能力评价与架构复盘 |

排期原则：框架实验和人格效果优先。若延误，依次砍主题定制、状态展示、导入功能；不得砍 checkpoint 实验、Debug Trace、角色 Eval。DSH 不进入本期排期。

**关于前端选型时点**：Ant 定按实际完成情况推进，故不硬改排期。
但需知悉风险——§11.1 的七条筛选标准（许可证 / 自定义 Base URL / 流式 / BYOK / 移动端 / 免长期 fork / 仍在维护）
未必存在全满足的项目，**选型本身可能失败**；且它决定鉴权与 BYOK 的传递方式，牵动 API 契约。
**建议 8/22 先花半天做 spike 确认「确实存在这样一个客户端」**，不必完成配置，只需确认可行性。
若 8/27 才发现选不到，8/28 的接入与 Demo 会连带失守。

---

## 16. 风险

| 风险 | 影响 | 应对 |
|---|---|---|
| Graph 只是把线性流程画成图 | 无法证明框架价值 | 必做 checkpoint 故障恢复、Guard 条件边、time travel 实验 |
| 把领域数据塞进 checkpoint | 状态膨胀、迁移困难 | Graph State 只存工作集与 ID，长期数据进 Domain Store |
| Checkpointer 与业务数据库双写 | 状态不一致 | `commit_turn` 幂等事务；checkpoint 只表示流程状态 |
| 原始 token 先于 Guard 下发 | OOC 无法撤回 | 两段流，候选先缓冲后发布 |
| 用户与游戏主角身份混淆 | 人格与关系根基错误 | 已裁决采用 CanonWorld / UserRelationship 双关系模型，并加隔离测试 |
| embedding 随 Provider 切换 | 向量空间混乱 | embedding 独立配置并版本化 |
| 同 thread 并发 | 丢更新、重复记忆 | per-thread 单写、requestId 幂等、事务提交 |
| 为赶 Demo 跳过 Eval | 最终只得到聊天壳 | Eval 先于 UI 打磨，10 条起步、30 条交付 |
| 为展示框架滥用复杂功能 | 架构臃肿 | 只采用有真实问题对应的 LangGraph 能力 |

---

## 17. 最终交付

1. LangGraph 驱动的 Nagi Runtime Demo；
2. 已配置并接入的 GitHub 开源聊天客户端；
3. Character Resources 与 Context Builder；
4. Checkpoint 恢复 / time travel 证据；
5. 角色 Eval 报告；
6. LangGraph 能力评价与是否继续采用的明确结论。

项目成功不等于预设 LangGraph 一定合适。如果实测表明它只增加胶水，没有带来恢复、调试、分支或持久化收益，报告必须如实记录；但 DSH 路线仍按“外层 Harness + 内层 LangGraph Runtime”设计，不把二者写成互相替换。

---

## 18. Ant 裁决结果

1. 普通使用者不继承游戏主角关系，采用 CanonWorld / UserRelationship 双关系模型。
2. 批准建立 Agent 专用资源包。
3. 人格、说话方式与行为规则直接参考 `resources/core/NagisHeart_Nagi_Character_Bible_v0_5_Full_Merged.md`；不再把 V17 单列为台词风格权威。
4. 后续路线是 DSH 外层 Harness 内嵌 LangGraph Runtime，不做二选一替换。
5. 首发按最多 50 个用户身份设计；金额预算仍待后续部署选型时确定。
6. **结局定为 TRUE END**，且只进入 CanonWorld；普通使用者的 UserRelationship 从零起步（NRH-20260820-004 / -017）。
7. **国产模型优先**，不以 Gemini 为默认；**当前阶段仅本地开发验证**，上线时再采购中国内地轻量云服务器（NRH-20260820-019）。

---

## 19. 定稿说明（2026-08-20）

本文经 Ant 确认定稿。定稿前补齐的同步项：

| # | 补齐内容 | 依据 |
|---|---|---|
| 1 | D1 结局口径由「仍待裁决」改为「已定 TRUE END，只进 CanonWorld」 | NRH-20260820-004 / -017 |
| 2 | 新增 D8/D9：国产模型优先、当前仅本地开发 | NRH-20260820-019（定于 V4 初稿之后）|
| 3 | §10 首版 Provider 点名国产模型；§11.2 补部署口径 | 同上 |
| 4 | §6.1 新增首字延迟已知代价与 8/25 量测门槛 | 本次评审新增 |
| 5 | §13.2 DSH 行标注「后续阶段，不在本期排期」 | 消解 §13.2 与 §15 的内部矛盾 |
| 6 | §15 排期同步：模型、本地 Demo、首字延迟量测、前端选型 spike 建议 | 综合以上 |

**仍需补办的仓库级记账（不改本文，属流程执行）**：

- `00_harness/01_governance/decision_log.md` 补 2026-08-20 条目（目前为零条目）
- `authority/MANIFEST.md` 的「相关但不在本目录的权威关系」一节登记
  `resources/core/NagisHeart_Nagi_Character_Bible_v0_5_Full_Merged.md`
  （2124 行，现为 Agent 人格唯一事实源，SHA-256 见 NRH-20260820-018）

该文件为 Ant 自有的 v0.4 + v0.5 合并稿，**非 authority 复制品**，
不违反「禁止复制权威内容」红线；待补的是「新权威未登记」。
