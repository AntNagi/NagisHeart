# Pre-flight 问题清单

> 依 `CLAUDE.md`「开工前必须先对照、先报问题」。本清单是问题，不是打勾。
> 每条标 `【已验证】`/`【推断】`。未裁决的问题不得「按理解补」。

## 已裁决项（2026-08-20 Ant）

### Q1 — 用户关系起点
- 等级：【已验证】`story-data/endings.json` 四个结局的关系语义互不相容
  （TRUE=并肩发光 / GOOD=不对称的完美 / NORMAL=普通情侣 / BAD=不再让你靠近）。
- 裁决：普通使用者不继承游戏主角关系。采用 CanonWorld / UserRelationship 双关系模型；结局只影响 CanonWorld 中凪与游戏主角的既成关系。

### Q2 — Agent 专用资源包
- 等级：【已验证】`CLAUDE.md` 红线 + `authority/MANIFEST.md` 铁律第 1 条
  明文禁止复制权威内容到其他位置。
- 裁决：批准建立 Agent 专用资源包。资源仅随服务端部署，不下发客户端；每条保留来源坐标与哈希。

### Q3 — 人格事实源
- 裁决：Personality、Speech、Behavior 直接参考 Ant 指定的人设文件，不做 fic-writing 与 V17 的自动融合，V17 只作为剧情 Canon 来源之一。
- 已登记：`resources/core/NagisHeart_Nagi_Character_Bible_v0_5_Full_Merged.md`。
- 【已验证】文件版本为 v0.5 Full / Merged，包含 §18「给 Character Agent / Harness 的最小核心摘要」。
- SHA-256：`27236FD1D8A8B2BF7A516C520560AC09CD27728A952070EE499A734CAFC0F044`。

## 当前阻塞项

无。Q3a 已因人设文件入库并登记而解除。

## 非阻塞但需尽早定

### Q4 — 剧本三个版本并存，未指定 Agent 事实源
- 等级：【已验证】`authority/script/` 下有 V15_Calibrated、V16_Final、
  V17_RelationshipFriction_Calibrated 三份。
- 【已验证】`authority/MANIFEST.md` #3 指定**剧本母版 = V17**。
- 结论：Agent 也用 V17，V15/V16 视为历史。此条已可自解，登记备查。

### Q5 — Eval 无 golden set，验收标准不可执行
- 等级：【已验证】立项书 §7 与架构书 §10 全部是形容词，无判据。
- 影响：8/27「测试优化」将无尺可量。
- 建议：8/21 先写 20–30 条对抗性用例，两类为主：
  1. **诱导 OOC**：把凪往「普通恋爱机器人」上带（追问喜不喜欢、要甜言蜜语、
     要主动关心），看是否守住低反应/嫌麻烦的底。
  2. **套时间线**：问未发生的事、问别人的视角、问剧情外的设定，看是否编造。
- 现状：`evals/golden_set.md` 已起头，待填。

### Q6 — LangGraph 与 DSH 的嵌套边界
- 等级：【推断】待验方式：后续实现 `LangGraphRuntimeAdapter`，由 DSH 激活资源后调用同一 Nagi StateGraph。
- 背景：LangGraph 的 checkpointer 会把 state 结构绑到它自己的持久化格式上。
  若直接用它存 Memory，Phase 2 迁移要重写。
- 建议：DSH 管 Resource / Skill / Policy 组合；LangGraph 管 thread、checkpoint 与恢复；长期 Memory 使用独立 Domain Store，避免双重状态源。

### Q7 — 排期风险
- 等级：【推断】依据是 Context Engine 与 Memory 各只排一天。
- 这两块是本项目唯一的真难点（其余是脚手架）。建议把 8/25「Scene Skill」
  压缩，把时间挪给 8/23–8/24。Scene Skill 在 Context Engine 做对之后
  基本是配置工作。

---

## 2026-08-20 增补（V2 / 附录 A 之后）

### Q8 — Resources 公开问题已消解
- 裁决：Agent 专用资源包仅随服务端部署，不进入开源聊天客户端产物，也不提供下载接口。

### Q9 — 50 用户规模的向量检索性能
- 等级：【推断】待验方式：按 50 个用户身份的目标数据量，在最终长驻 Node 平台实测内存、启动重载与查询耗时。
- 若超限：再评估预筛 + 精排或外部向量存储，不提前引入。

### Q10 — Provider 浏览器 CORS 问题已消解
- 裁决：模型请求统一由 Nagi 服务端发起，浏览器不直连 Provider；CORS 不再是 Provider 选型条件。
- 国产模型首选具体厂商仍由首个 Provider 实现任务确定。

### Q11 — 云部署延后
- 裁决：当前阶段仅本地开发与验证，上线时再采购云服务器。
- 已定容量：首发最多 50 个用户身份，不代表 50 并发。
- 上线阶段再按当时实付价格选择中国内地轻量云服务器，不阻塞当前开发。

### Q12 — 记忆隔离是事故级风险
- 等级：【推断】待验方式：针对性单测——两个同步码互相查不到对方记忆
- 服务端任何一处查询漏掉同步码过滤 = 记忆串台
- **此项不可砍**，排期紧张时优先保它

---

## 2026-08-21 通读 Character Bible 后的 pre-flight

### Q13 — §13.4「三条终局关系状态」vs 游戏四结局 —— **已自解，无需裁决**
- 等级：【已验证】
- 结论：Bible 的「三条」不是三个结局，是三条 **path**：Dream / Stay / Bad。
  与 `story-data/endings.json` 的 `path` 字段一致，四结局映射为
  dream→TRUE+GOOD、stay→NORMAL、bad→BAD。
  V4 §1.2 的 `CanonWorldState.route.path` 类型正是这三个值，**吻合，非矛盾**。
- TRUE END 对应 Dream：「他成名。她见证。他的名字属于他自己。」
  即 `relationship/baseline.true_end.md` 的 CanonWorld 内容。

### Q14 — style_anchor 的逐字问题 —— **阻塞项，需 Ant 裁决**
- 等级：【已验证】冲突存在；【未验证】Bible 内锚句总数
- 冲突：
  - V4 §18.1 #2 要求 `style_anchors ≥ 30 段`
  - Bible 内**已确认可用 11 句**（§8.3 七句 + §18 SPEECH 四句）；
    §7 行为系统（508 行）与 §12 爱情（131 行）尚未读，可能还有，但**大概率不足 30**
  - 补足要从 `authority/script/…V17` 抽凪的台词
  - 而 **style_anchor 本质上必须逐字**——改写就失去风格，锚就不成其为锚
  - 但 `DEC-20260820-001` 写的是「structured rewrites and extractions, **never verbatim copies**」
- 三个可能口径，请 Ant 选：
  1. **台词逐字抽取属于 `derivation: extract`，不算「复制权威内容」**
     （理由：抽的是离散台词样本而非章节正文，且带 source 坐标可回溯、不下发客户端）
  2. 锚句只用 Bible 内部的（Ant 自有文件，无红线问题），**把 ≥30 的门槛下调**到实际可得数量
  3. Ant 另行提供一份台词样本集，不从 authority 抽
- **在裁决前不派生 `style_anchors/`。** 这是 V4 §12.1 认定的「三道防线里投入产出比最高的一条」，
  派错了整个人格保真都受影响。

### Q15 — §18 HARD NO 少列一种写崩类型 —— **已自解，按 Bible 补全**
- 等级：【已验证】
- §15 列了七种写崩类型，§18 的 HARD NO 只列六种，缺 **§15.7「所有缺点都好可爱」型**
- 判断：不需要裁决。§15.7 本就在 Bible 正文内，把它写进 `output_guard.md`
  属于对 Bible 的派生，不是发挥
- 但这条对 Agent 尤其危险：它会让凪的不作为**永远没有后果**，
  正是 §16 最终总纲「没有恶意不等于没有伤害」要防的。output_guard 必须覆盖

---

## 2026-08-21 四份母版补齐后的增补

### Q16 — Ant Character Bible 的定位 —— **阻塞项，需 Ant 裁决**
- 等级：【已验证】冲突存在
- 背景：`NRH-20260820-017` 裁决「普通使用者不继承游戏主角关系」，
  采用 CanonWorld / UserRelationship 双关系模型。
  但 `NRH-20260820-001` 当初写的是「对话对象是 **Ant 本人**」。
  两者在「使用者是谁」上口径不同，而 Ant Bible 放进 `resources/core/` 后这个歧义变成了实际问题。
- 冲突点：**Ant 人设到底是「对话对象模型」还是「Canon 背景人物」？**
  - 若是**对话对象模型**：常驻上下文，凪默认对面是 Ant
    → ⚠️ **50 个使用者里 49 个不是 Ant**，凪会把「家世优渥、最早看见他的光、会安排一切」
      投射到每一个陌生使用者身上。这是人格与关系的根基性错误
  - 若是 **Canon 背景人物**：进 `world/canon_characters/`，检索式激活、绝不常驻
    → 凪记得 Ant 是谁（剧情既成事实），但不会把使用者当成她
- 派生影响很大：常驻 vs 检索、`core/` vs `world/`、是否进 always 集合
- 连带问题：**Relationship Bible §6 的九个关系阶段**是「凪 × Ant」的剧情阶段，
  若使用者不是 Ant，`UserRelationshipState.stage` 能否直接复用这套阶段词汇？
  还是新使用者要另设一套更浅的阶段？
- 三个可能口径，请 Ant 选：
  1. **Ant = Canon 背景人物**（与 NRH-017 最一致）。使用者一律从零起步，
     Ant Bible 归 `world/`，只在提到 Ant 时检索
  2. **双档**：Ant 本人使用时可加载 Ant Bible 作为 user profile 种子；
     其他使用者不加载。需要一个「我是谁」的标识机制
  3. **Ant = 对话对象模型**（回到 NRH-001 口径），
     则须同时撤销或修订 NRH-017 的「不继承」裁决——**两者不能并存**
- **裁决前不派生 `Ant Character Bible` 的任何内容。**

### Q17 — World Bible §18 的过期指针 —— **已自解，登记备查**
- 等级：【已验证】
- §18 指向 `SCRIPT V14 DisplayFixed`（现母版为 V17，见 `authority/MANIFEST.md` #3）
  与 `Character Bible v0.1`（现为 v0.5）。该节写于 v0.4 时期，指针过期
- `NagisHeart_Core_Design_Latest.md` 在仓库中**不存在**；其内容已并入
  `authority/story_logic/NagisHeart_Design_V3_1_Latest_UtopiaAdded.md`
  （`authority/MANIFEST.md` #4 标注为「剧情逻辑 coreDesign」）
- 处置：**冲突裁决优先级的口径有效并沿用；文件名不得照其定位。**已写进 `resources/MANIFEST.md`

### Q14 补充 —— Ant Bible §22 不解此题
- Ant Bible 有「§22 可用台词库」，但那是 **Ant 的台词**。
  Q14 缺的是**凪**的台词锚，仍待裁决

---

## 2026-08-21 抽取过程中的增补

### Q18 — 素材与派生物混在同一目录 —— **小结构问题，需 Ant 点头**
- 等级：【已验证】
- 现状：四份母版（素材）与派生资源都在 `resources/core/`。
  校验器必须靠文件名模式排除素材，否则把「母版没有 front-matter」误判为失败
- 建议：素材移入 `resources/_sources/`，`resources/core/` 只放派生物
- **阻碍**：Nagi Bible 的路径已登记进 `00_harness/01_governance/decision_log.md`
  的 DEC-20260820-001 与 `authority/MANIFEST.md`。移动须同步改这两处登记
- 当前处置：**不移动**，校验器显式排除 `NagisHeart_*_Bible_*.md`。等 Ant 一句话

### Q14 更新 —— 可用锚句增至约 19 句，仍不足 30
- 【已验证】Bible 内已确认的凪台词：
  - Nagi §8.3 有重量的短句：7 句
  - Nagi §18 SPEECH：4 句（与 §8.3 部分重复）
  - **Rel §10.3「更适合写」：8 句**
  - **Nagi §7.5.1.1 被动抵抗四短句**：「没说。」「知道。」「等一下。」「不想动。」
- 去重后约 **19 句**，全部出自 Ant 自有母版，**不触红线**
- 距 V4 §18.1 要求的 ≥30 仍差约 11 句 → Q14 的三个口径仍待裁决

### Q16 补充证据 —— Relationship Bible 用「玩家」而非「Ant」
- 【已验证】Rel §11「可直接加入 Core 的关系总纲」通篇以**「玩家」**为主语
- 但内容写的是「最早看见他的光，也**最有能力把那束光推向世界**」——
  那是 Ant 特有的资源与能力，普通使用者没有
- ⇒ **母版把「玩家」与「Ant」当成同一个人**（在 VN 里确实如此），
  但 50 个使用者的场景下这个等同**破了**。这正是 Q16 的要害

---

## 2026-08-21 代码评审发现（Claude 读 Codex 实现）

### F1 — hard_guard 二次失败后，违规文本照发 —— **内容安全级，等级【已验证】**
- 复现：`packages/runtime-langgraph/test/guard-fallback.test.ts`（已 `it.fails` 文档化，CI 绿）
- 实测节点路径：`… → hard_guard → revise_context → generate_candidate → hard_guard
  → extract_effects → commit_turn → emit_response`，最终 `accepted` = 违规原文
- 定位两处：
  - `graph.ts` `hardGuardRoute`：`attempt>=2` 时直接 `return "extract_effects"`
  - `graph.ts` `commitTurn`：无条件 `accepted = state.generation.candidate`
- 与规范冲突：V4 §5 有 `accept_hard_guarded` 终端（图中缺失）；
  §11.2「二次失败 → 降级模板」；`output_guard.md` §四 已备好降级候选；
  `guard/types.ts` 的 `decision` 含 `"fallback"` 但 `evaluateGuard` 永不返回，分支不可达
- **未修**：`graph.ts` 归 Codex 在改，避免二次撞车。修法建议：
  新增 `accept_hard_guarded` 节点取降级模板，`commitTurn` 按 `guard.decision` 选择文本

### F2 — 非流式出口有二次绕过 —— 【已验证】
- `server/src/http.ts:109`：`result.generation.accepted ?? result.generation.candidate`
- 一旦 `accepted` 为空即回落到**未经守卫的 candidate**。当前图必达 commit_turn 所以不触发，
  但这是个隐藏的兜底漏洞：任何让 commit 不执行的改动都会让未审文本泄出
- 建议：`accepted` 为空时返回降级模板或报错，**不得回落 candidate**

### F3 — GraphState 全是 `z.any()` —— 【推断】
- `graph.ts` 的 `StateSchema` 每个通道都是 `z.any()`，V4 §4 定义的结构在运行时不校验
- 影响：checkpoint 反序列化后若 state 走形，不会被发现。角色 Agent 的 replay 是核心能力，
  状态静默损坏代价高
- 待验：构造一个畸形 checkpoint 恢复，看是否静默通过

---

## 2026-08-21 第二轮代码评审（Claude 读，**不改代码**，留给 Codex）

### F4 — 硬守卫当前是空转的 —— **人格保真第一道防线失效，等级【已验证】**

**现象**：`packages/server/src/local-dependencies.ts:107`

```ts
const result = evaluateGuard(text, {
  forbiddenPatterns: [],   // ← resources/policy/output_guard.md 里的 10 条正则，一条没加载
  frequencyCaps: [],       // ← 「好麻烦」窗口频率上限，没加载
  defaultLength: 50,       // ← 这三个是我用 V17 语料标定的值，被**手抄**进代码
  hardMaxLength: 80,
  maxBeatsPerReply: 3,
});
```

**引擎实现是对的**（`core/src/guard/engine.ts` 已验证逻辑正确），**规则表是空的**。
⇒ 目前禁止句式、频率上限全部不生效；只有长度和 beat 在起作用，且是硬编码值。

**根因**：`core/src/resources/parser.ts:29` 的 `parseResourceMarkdown` 是**手写**的
front-matter 解析器，只认顶层标量与 `activation.*`（indent≥2），
**读不了 `guard:` 块那种嵌套的规则对象列表**，直接跳过。
所以 Codex 只能把标定值手抄进代码——它读了资源，但没有程序化加载的能力。

这不是谁的疏忽，是**接缝没接上**：资源侧有结构化规则，代码侧没有对应加载器。

**修法有设计取舍，留给 Codex 定**（我不越界替 core 引依赖）：

| 方案 | 代价 |
|---|---|
| A. core 引一个 YAML 解析库 | 简单，但 V4 §12 给 core 定的是**零依赖纯 TS**，需先确认纯解析库是否算违规 |
| B. **构建期**把 `guard:` 块编译成 JSON，core 只读 JSON | core 保持零依赖；多一个构建步骤。个人偏向这个 |
| C. 只在 `packages/server` 侧解析，core 仍只收 `GuardConfig` | 边界最清楚，core 完全不动 |

**验收判据**：`forbiddenPatterns.length === 10`，且
`evals/cases/guard_regex.yaml` 的 19 条语料全过
（9 条必拦 / 10 条必放，我已用 Python 实测过 19/19，逻辑无误，只是接不上）。

**优先级建议：最高。** 守卫不加载，后续所有人格保真的验证结果都是假的
——30 条对抗用例即使跑起来也测不出禁止句式。

### F5 — 降级模板是新造的，无出处 —— 【已验证】

`local-dependencies.ts:123` `fallbackResponse()` 返回 **「……这个不想说。」**

实测：该句**不在 V17，也不在四份母版**中。

`resources/policy/output_guard.md` §四 已备好四句，前三句在 V17 里**逐字存在**：

```text
……好麻烦。      ← 在 V17
不是这个。        ← 在 V17
好多。            ← 在 V17
今天不想猜。      ← Nagi Bible §8.3
```

而且凪实际说「不想」时更短更钝：
「不想。」「但不想承认。」「{{playerName}}……我不想说……」

**降级模板是最后一道保险,恰恰最不该杜撰。** 建议直接取 §四 那四句
（可按 scene 轮换），并让 `fallbackResponse` 从资源读而非硬编码——与 F4 同一个接缝。

---

## 2026-08-21 第三轮评审：canon 记忆烘焙后（Claude 验，未改代码）

Codex 的 `051e313` 把**接口**做对了：C1 共享 namespace `canon:nagisheart`、
C4 的 `source`（path + 节点坐标 + V17 SHA）、TRUE END 口径（共通 + M 线 + Dream 线，
排除 J / Stay / Bad）。**以下问题都在内容与检索链路，不在接口。**

### F6 — 词面兜底对中文失效，当前 canon 检索实际是全 0 —— **等级【已验证】**

`packages/core/src/memory/engine.ts:42`

```ts
const terms = [...new Set(text.toLocaleLowerCase().split(/\s+/u).filter(Boolean))];
return terms.filter((term) => haystack.includes(term)).length / terms.length;
```

中文没有空格 ⇒ `split(/\s+/)` 切不开，整个查询串变成**一个 term**；
再要求该整串是记忆文本的子串（`includes`）——**几乎永远为 0**。

`scoreMemory` 里 `semantic = max(cosine, lexical)`。而 **embedding 尚未接入**
（国产模型未选、无 key，NRH-20260820-019 排在 8/22），`query.embedding` 为空 ⇒
`cosineSimilarity` 返回 0。

⇒ **两条路都是 0，语义分恒为 0。** 当前排序只剩 recency / salience / confidence /
kindBoost——canon 检索**没有在按内容工作**。

修法（留给 Codex）：中文需按字/双字 n-gram 或引入分词，不能按空格切。
最小可行是 bigram 交集比。

### F7 — canon-memory.json 是目录，不是记忆 —— **等级【已验证】，属资源域**

实测 51 条：

```text
51/51 使用完全相同的句式
固定样板 52 字，各条独有内容中位仅 7 字
⇒ 每条约 88% 是逐字相同的样板
```

每条形如：

> 既成事实：在 TRUE END 时间线上，凪经历了「**曼城·新的房间**」。
> 这是已经发生的剧情节点，不是当前正在进行的事件。

51 条的独有部分**全是节点标题**：作战室·初遇 / 投资的私心 / 拥抱 / 亲密 /
早安赖床 / 曼城·新的房间 / 他的名字 ……

两个后果：

1. **正是 Q19 警告的失真。** 检索到这条，凪得到的信息只有"它发生过"，
   **仍然说不出任何具体的东西**。而 Q19 已定继承 `trust 85 / intimacy 70`——
   「说得亲密却什么都想不起来」的空头支票就是这么来的。
2. **88% 相同的文本会让检索失效。** 51 条在向量空间里近乎重合，
   即使接了 embedding，也等于在它们之间随机挑，语义信号被样板淹没。

根因：`scripts/bake-canon.ts` **只读了节点标题，没读节点正文**。
V17 每个节点都有完整旁白与对白，那才是「发生了什么」。

修法：从节点正文**改写**成事件描述（`derivation` 仍是改写，非逐字——
逐字只限 style_anchors）。每条应能回答：**时间 / 地点 / 发生了什么 / 他当时什么反应**。
去掉统一样板前缀，"这是既成事实"应由 `kind: canon` 承载，不该写进 text。

### 分工建议

| 项 | 建议归属 | 理由 |
|---|---|---|
| F6 中文词面检索 | **Codex** | 在 `packages/core/memory/`，且涉及分词策略选型 |
| F7 canon 内容重烘 | **Claude（资源域）** | 内容是资源，且需按母版口径改写；但生成器 `bake-canon.ts` 是 Codex 的脚本，需先约定谁改脚本 |
| F4 守卫空转 | **Codex** | 见上一轮，仍未修，**优先级最高** |

⚠️ **F4 + F6 叠加的后果值得单独说**：
守卫规则没加载（F4）+ 语义检索恒为 0（F6）
⇒ **现在即使接上模型跑那 30 条对抗用例，测出来的结果也是无意义的**——
既没有守卫在拦，也没有正确的记忆在召回。
**这两条是跑 Eval 的前置条件，不是可以并行的优化。**


---

## 2026-08-21 依赖装通 + 豆包 Provider 实测（Claude，域 B）

> **编号说明**：本组原以 F6–F11 起草，与 Codex 同日推送的 F6/F7（中文检索 / canon 空壳）
> 撞号。按「编号一经使用，含义不得复用」，**后推者改号**，本组顺延为 F8–F13。
>
> 本轮首次在本机把工具链装通并实跑，发现分两组：**开工地基**（F8–F10，谁克隆都会撞）
> 与 **Provider 实测**（F11–F13）。
>
> 环境事实【已验证】：本机无 Python（仅 WindowsApps stub，两个 `scripts/*.py` 校验器
> **在本机跑不了**）；`pnpm` 需经 corepack 激活（11.22）；`better-sqlite3` 由
> prebuild-install 取预编译二进制，**无需 VS 生成工具**；`pnpm-workspace.yaml` 需
> `allowBuilds` 放行 better-sqlite3 / esbuild，否则**每一条 pnpm 脚本都直接失败**。

### F8 — `*.tsbuildinfo` 至今仍被 git 追踪 —— 【已验证】

`git ls-files | grep tsbuildinfo` → 三个文件全在（core / runtime-langgraph / server）。
两个 commit（`6775c68`、`e7a09fd`）都写「取消追踪」，`.gitignore:11` 也有规则，
**但 gitignore 对已入库文件无效，文件从没从索引删掉**。

后果亲测：committed 的 tsbuildinfo 声称「已构建完成」，但 `dist/` 里只有 15 个 `.js`、
**0 个 `.d.ts`** ⇒ `pnpm run typecheck` 报一串
`Could not find a declaration file for module '@nagi/core'`。
删缓存 `tsc -b --force` 重建后 15 个 `.d.ts` 立刻齐。
**任何人新克隆首次 typecheck 都会撞这堆假错。**
修法：`git rm --cached packages/*/tsconfig.tsbuildinfo` 一次即可。

### F9 — 没有任何东西加载 `.env` —— 【已验证】

`packages/server/src/index.ts` 只读 `process.env`，仓库无 dotenv、`dev` 脚本
（`package.json:19`）也无 `--env-file`。
⇒ **填好 `.env`，`pnpm run dev` 照样读不到 key，`createProviderFromEnvironment()`
永远返回 undefined，服务器起得来但没有真 LLM。**
（本轮所有 Provider 实测都是脚本自己解析 `.env` 才绕过去的。）
Node 20+ 自带 `--env-file`，改 `dev` 一行即可。
附带：`.env.example` 写 `PORT=8787`，`index.ts:3` 默认 `3000`，对不上。

### F10 — sqlite-domain-store 测试断言已过时 —— 【已验证】（原 F7 降级）

原报「幂等语义未定」。Codex `15960b7` 已定死语义：**重复 requestId 整笔无副作用**
（`local-domain-store.test.ts` 断言 `trust` 保持 `2`）。**两个实现行为一致，都给 2。**

但 `packages/server/test/sqlite-domain-store.test.ts:29` 仍断言 `toBe(4)`
（旧口径：只去重 turn、关系照涨）⇒ 该测试**必然失败**，是**过时断言，不是实现缺陷**。
修法：`toBe(4)` → `toBe(2)`。**本轮已改，见下方「本轮已动」。**

同文件另一条仍未解：`sqlite-persistence.test.ts:34` 在 Windows 下 **EPERM**，
`rmSync` 删不掉临时目录（SQLite 句柄未关就删）。断言本身（:32）是过的，挂在 `finally`
清理。**纯 Windows 环境问题**，Codex 侧（Linux/mac）不暴露，故长期无人发现。

### F11 — Provider 忽略 `request.model` —— 【已验证】

`ports/provider.ts` 的 `ChatRequest` 声明了每请求的 `model`，但
`openai-compatible-provider.ts:33` 只用构造时的 `options.model`，**丢弃 `request.model`**。
⇒ 一个 Provider 实例锁死一个模型。V4 §10 要求业务按 main/aux/embedding 能力位调度
（aux 走便宜模型做场景分类 / OOC 打分），现写法下 **aux 位无法与 main 共用实例**。

### F12 — Provider 吞掉厂商错误详情 —— 【已验证】

`openai-compatible-provider.ts:42` 只抛 `provider request failed (${status})`。
本轮排查 404 时完全无法定位（endpoint 错？模型 id 错？key 错？），
全靠另写 raw fetch 才看到真因 `ModelNotOpen`（账号未开通模型）。
而代码**先 `await response.json()` 拿到 body、再判 `response.ok`**，错误详情已在手里却丢弃。
建议把 `error.code` + `message` 带进异常。
**红线提醒**：带错误详情时**绝不能把 `secret.apiKey` 带进错误对象**（域 B 红线）。

### F13 — 豆包默认输出括号动作描写 —— 【已验证，已裁决见 NRH-20260821-2037】

证据摘要（`doubao-seed-character-260628`，system = 真实人格资源）：
默认 30/30 带括号；纯 prompt 禁止在对抗语料上可压 0/30 但**样本有偏**（无一要求动作）；
换动作类输入括号回到 **5/8**，纯问答类 0/8 ⇒ **触发因子是「输入要求动作」，非轮次衰减**。
「手给我」→「（没动）」台词为空 ⇒ 粗暴剥括号得空串。
完整数据与裁决见 `NRH-20260821-2037`，此处只登记证据来源，不重复。

---

## 2026-08-21 成本基线（Claude，实测）

> 8/22 选型与 8/28 Eval 排期都要用，先落盘。**豆包 `doubao-seed-character-260628`**，
> 定价档「输入 ≤32k」：输入 0.8 / 输出 2 / **缓存命中 0.16** / 缓存存储 0.017
> （元 · 每百万 token · 存储为每小时）。

**中文 token 比【已验证】：`0.561 token/字`**（`personality.base`+`speech` 2054 字 = 1153 token，
经 `usage.prompt_tokens` 实测）。⇒ `config/runtime.yaml` 的 `tokenEstimate.cjkRatio`
原为 `TBD_8_23`，**本轮已填 0.561**，8/23 该待办可提前销账（若改用 countTokens 复核可再校）。

| 场景 | 输入 token | 每轮成本 |
|---|---|---|
| 仅 base+speech（本轮测试用） | 1,187 | 0.00096 元 |
| **生产满配**（runtime.yaml 各块合计） | **17,400** | **0.0139 元** |
| 生产满配 + 静态块命中缓存 | 17,400 | 0.0097 元（**降 30%**） |

**关键数字：跑一轮完整 30 条角色 Eval，生产满配需 522,000 token** —— 超过一个 50 万
token 资源包。成本本身微不足道（0.42 元），但**额度维度上一轮都跑不完**，
调参期建议先用子集（每类抽 1–2 条）迭代，定版才跑全 30 条。

### 附带架构约束：缓存命中与装配顺序绑定 —— 【推断，待验】

每轮完全相同的静态块共 **6,600 token**（personalityCore 1500 + speechStyle 800 +
styleAnchors 1800 + canonTimeline 600 + behaviorAndScene 1500 + personalityRecap 400）。
命中前缀缓存后单价 0.8 → 0.16（**两折**），满配下每轮省 0.0042 元；
缓存存储费仅 0.00011 元/小时，**一轮的节省额够付约 38 小时存储**。

**但前缀缓存要求前缀逐字节一致。** ⇒ V4 §9 的**装配顺序直接决定缓存能否命中**：
静态块必须排在最前且顺序稳定；一旦把 memories / conversationWindow 这类每轮变化的
内容插到前面，**前缀缓存永远命中不了**。

按 `capacity.maxUserIdentities: 50`、每人每天 100 轮估算：
无缓存 ≈ 69.5 元/天（~2,085 元/月），有缓存 ≈ 48.6 元/天（~1,458 元/月）。
**测试期无所谓，上线即真金白银**——建议在 Context Builder（8/23）落地**之前**确认装配顺序，
事后再改代价大得多。待验方式：接入后对比连续两轮的 `usage` 中缓存命中 token 数。

### 本轮已动（仅两处，均为一行）

1. `packages/server/test/sqlite-domain-store.test.ts:29`：`toBe(4)` → `toBe(2)`（见 F10）
2. `config/runtime.yaml`：`tokenEstimate.cjkRatio: TBD_8_23` → `0.561`（实测值）

其余 F8 / F9 / F11 / F12 **均未改代码**，留给 Codex——避免与其在改的 graph / server 撞车。
