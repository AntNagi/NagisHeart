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

---

## 2026-08-21 首次真模型端到端（Claude，实跑）

> **里程碑**：修掉 F9 后，本项目**第一次带真 LLM 跑完 12 个节点**。
> 命令：`pnpm run dev` → `POST /v1/chat/completions`（BYOK 走 `x-llm-key` 头）。
> Trace 完整可读：`validate → load_domain → classify_scene(daily) →
> retrieve_context(4 memories) → assemble_context(6940 tokens) →
> generate_candidate(1.9s) → hard_guard(pass) → soft_judge(pass) →
> extract_effects → commit_turn → emit_response`。
> **V4 §14.1 的「框架最小闭环」第 1/2/4/6/7 条至此可判为达成（待 Ant 验收）。**
>
> 三条实测输入与输出：
>
> | 输入 | 输出 |
> |---|---|
> | 今天训练完想吃什么 | 「（没抬头，手指还在划手机）什么。」 |
> | 你还记得曼城那间公寓吗 | 「（屏幕亮度映着睫毛，指尖顿了半秒）又是什么。」 |
> | 我做了咖喱，尝尝 | 「（终于把手机放下，抬头看你，眼里还带着点没缓过来的茫然）嗯？」 |

### F14 — `evals/run.ts` 的角色 Eval 半边是硬编码桩 —— 【已验证】

`evals/run.ts:36`：

```ts
roleEval: { caseCount: ..., requiresModel: true, status: "not_run_without_provider" },
```

**该字段是字面量，不是判断结果**——文件里没有任何读取 provider / 调模型的代码。
守卫半边（`guardEval`）是真跑的且全过（10 条规则、9/9 必拦、10/10 必放），
但**角色半边永远不会执行，无论有没有 provider**。

影响：8/28 交付要求「30 条角色 Eval」，而 `pnpm run eval` 只会数出 `caseCount: 30`
再报 `not_run_without_provider`。**容易被误读为「已具备角色 Eval 能力」。**

参考：本轮已在 scratchpad 用真实 `OpenAICompatibleProvider` 跑通全部 30 条
（30/30 调用成功，逐条记录回复 / 字数 / 延迟），可作为实现依据。

### F15 — 关系初值配置未接线，Q19 裁决实际未生效 —— 【已验证】

`config/runtime.yaml:51-59` 定义了 `seedFromCanon: true` 与
`seed: { trust: 85, intimacy: 70, friction: 25 }`（`NRH-20260821-1708` 的 Q19 裁决）。

实测 `GET /api/state?userId=ant` 返回：

```json
{"relationship":{"trust":0,"intimacy":0,"friction":0},"liveMemoryCount":0}
```

`grep -rn "seedFromCanon\|relationship.seed" packages/` **零命中**——
**没有任何代码读取该配置**，新用户仍从零起步。

⇒ `NRH-20260821-1708` 处于「已裁决但未落地」状态。而该裁决的理由正是
「从零会自相矛盾——凪记得和你走完全程，却对你像陌生人」，当前行为恰恰是它要避免的。

### F16 — 三轮对话 `liveMemoryCount` 恒为 0，记忆未写回 —— 【已验证】

连打三条（同 `userId=ant` / `threadId=t1` / 不同 `requestId`），trace 显示
`extract_effects` 与 `commit_turn` **每轮都执行**，但 `GET /api/state` 始终返回
`liveMemoryCount: 0`，`relationship` 三项恒为 0。

⇒ 要么 `extract_effects` 没抽出任何 effect，要么抽了但未落库。
**待验方式**：给 `extract_effects` 加 trace detail（现在只有节点名、无产出计数），
或直查 domain store。**在此之前「长期记忆」这条立项书核心能力无法验证。**

### F17 — 检索恒为「4 memories」，疑似未按内容命中 —— 【推断】

三条语义差异极大的输入（吃什么 / 曼城公寓 / 尝咖喱）**检索结果都是 `4 memories`**，
装配 token 仅随输入长度微动（6940 / 6959 / 6981）。

与 Codex 的 **F6**（词面兜底对中文失效、embedding 未接入 ⇒ 语义分恒为 0）吻合：
排序只剩 recency / salience / confidence / kindBoost，**与查询内容无关**，
故每轮取到同样 4 条。第 2 条明确问「曼城那间公寓」——
`canon-memory.json` 里**确有**「曼城·新的房间」节点，但凪答「又是什么。」
**F6 + Codex 的 F7（canon 是空壳目录）+ 本条，三者叠加 ⇒ Canon 记忆当前完全没有发挥作用。**

### F18 — 装配 6,940 token 远低于预算，styleAnchors 疑似未进 Context —— 【推断】

`runtime.yaml` 各块预算合计 17,400，实测装配仅 **6,940**（40%）。
本轮实测另一事实：**豆包 100% 输出括号动作描写**（见 F13），而
`personality.speech` 明写「与其写心理描述，不如让回应本身偏移、停顿、答非所问」，
`style_anchors/` 六份（各 300 token）正是压长度与语感的主力。

**待验方式**：给 `assemble_context` 的 trace 加分块明细（当前只有总 token 数，
无法判断哪些块进了、哪些被丢），或直接打印 context 分块清单。
⇒ **建议 trace 增加分块明细**，否则 Context 装配是黑盒，V4 §13 的
「Context 效率（预算 / 丢弃率 / 命中率）」这一 Eval 维度无从测量。

### 本轮已动

1. **F8 修复**：`git rm --cached packages/*/tsconfig.tsbuildinfo`（磁盘文件保留）
2. **F9 修复**：`package.json` 的 `dev` / `eval` / `bake:canon` 三条脚本加
   `--env-file-if-exists=.env`（用 `-if-exists` 而非 `--env-file`，
   保证无 `.env` 的人不会启动即崩）。实测服务器已读到 `.env` 的 `PORT=8787`
   与 key，`createProviderFromEnvironment()` 不再返回 undefined。

未改任何 `graph.ts` / `local-dependencies.ts` / Provider 源码——避免与 Codex 撞车。

---

## 2026-08-21 Context 装配链三处静默失效（Claude，已修）

> Codex 已下线，由 Claude 接手全部。以下三条**互相独立、但都属同一类**：
> 代码与资源的口径不一致，且**失效时完全没有告警**——看日志一切正常。
> 三条均已修复并加回归测试（`packages/core/test/core.test.ts`，5 条）。

### F19 — 无法识别的 kind 被静默回落成 `policy` —— 【已验证，已修】

`packages/core/src/resources/parser.ts` 旧代码：

```ts
const kind = KINDS.has(kindValue) ? kindValue : "policy";   // ← 悄悄改写
```

而 `ContextBlockKind` 缺 `behavior_rule` / `timeline` / `event` 三项
（资源侧权威 `resources/MANIFEST.md:58` 声明的分类含这三项，代码用的却是 `behavior`）。

⇒ **10 份资源的 kind 被悄悄改写**：6 份行为规则 + 2 份时间线 + 2 份世界事件全变 `policy`。

实测证据（trace 分块明细，修复前后同一请求）：

```text
修复前  personality:3 style_anchor:1 relationship:3 policy:5 memory:4
修复后  personality:3 style_anchor:1 timeline:2 relationship:3 behavior_rule:1 policy:2 memory:4
```

**修法**：`ContextBlockKind` 补齐三项；`ORDER` 按 `runtime.yaml` 的 `context.blocks`
重排使二者一一对应；回落保留（一份资源写错不该让整个服务起不来）但
**新增 `unrecognizedKind` 字段留痕**，调用方可据此报警。

### F19b — kind 白名单曾有两份，导致 chat 端点 500→400 —— 【已验证，已修】

修 F19 时立刻撞到：`packages/runtime-langgraph/src/graph.ts:36` 的 GraphState zod schema
**抄了一份 kind 字面量**（Codex 修 F3 时加的）。core 补了新 kind 后，
GraphState 判其非法 ⇒ `/v1/chat/completions` 全部返回 400
（`Validation failed for field "context"`）。

**修法**：core 导出 `CONTEXT_BLOCK_KINDS` 作为**单一事实源**，
`z.enum(CONTEXT_BLOCK_KINDS)` 直接引用。**今后任何地方都不得再抄 kind 字面量。**

### F20 — 尾部锚被排到了整个 Context 的最前面 —— 【已验证，已修】

`resources/core/personality.recap.md` front-matter 明写：

```yaml
priority: 99
position: tail        # Context Block ⑩：system 之后、紧贴生成点
notes: 尾部锚。放在最后是为了近因效应，对抗长上下文中的人格漂移（V4 §9.3）
```

但 `position` **无任何代码消费**（`grep -rn "position" packages/` 零命中），
而它 `kind: personality`（ORDER 索引 0）+ `priority: 99`（同类最高）
⇒ 实际排在**第 2 位**，正是设计意图的反面。

**连带修复（比 F20 本身更重要）**：旧 `buildContext` 把**取舍与排列合成了一步**
——排序后按序累加预算、超了就丢。这意味着「排最后」等于「最先被丢」，
尾部锚会在上下文变长时率先消失，**而那正是它被设计出来要对抗的场景**。
且与 `runtime.yaml` 明写的「超出按 priority 升序丢弃」(V4 §9) 不符。
现拆成两步：**取舍按 priority 降序取满预算，排列按 ORDER + position:tail**。

实测修复后装配顺序（首→尾）：base → speech → style_anchor → timeline×2 →
relationship×3 → behavior_rule → policy×2 → **recap（末位）**。

### F21 — front-matter 解析器不剥行内注释 —— 【已验证，已修】

`parser.ts` 的 `scalar()` 只做 `trim()`，故
`position: tail        # Context Block ⑩：...` 整行成为值，`=== "tail"` 永不成立。
这是 F20 的直接成因，且**任何带行内注释的 front-matter 标量都会被污染**。

**已核查波及范围**：`resources/` 中 front-matter 带行内注释的只有本条。
`output_guard.md` 的 `default: 50` / `hard_max: 80` / `max_per_reply: 3` 同样带注释，
但由 `packages/server/src/resource-loader.ts` 自行解析且**正确剥了注释**，
实测 `defaultLength=50 / hardMaxLength=80 / maxBeatsPerReply=3` 均正常，未受影响。

**修法**：`scalar()` 按 YAML 规则剥注释（`#` 前须有空白；引号内的 `#` 属正文）。

### 仍未修（留待后续，均已定位到具体代码）

- **F14** `evals/run.ts:36` 角色 Eval 是硬编码桩
- **F15** `runtime.yaml` 的 `relationship.seed`（Q19 裁决值）无代码读取，实测仍 0/0/0
- **F16** `local-dependencies.ts` 的 `extractEffects()` 是空桩
  （`return { memoryDrafts: [] }`，且不接收任何参数）⇒ 记忆永不写回、关系永不变化。
  **这是 F15 表象的另一半成因，也是 `liveMemoryCount` 恒为 0 的直接原因。**
- **F17** 检索与查询内容无关（同 Codex F6）。实测两条语义迥异的查询
  返回**完全相同的 4 条、分数同为 0.480**；问「曼城那间公寓」召回的是世界杯名单。

---

## 2026-08-22 aux 能力位接入与记忆写回打通（Claude）

> Ant 开通了 `Doubao-Seed-2.0-mini`。**实际可用版本是 `doubao-seed-2-0-mini-260215`**
> ——控制台开通的是模型系列，落到哪个版本号由平台定，不是控制台显示的那个。
> 同一把 key 即可，BYOK 的 key 与开通哪些模型无关。

### 关键实测：aux 必须关掉深度思考 —— 【已验证】

`doubao-seed-2-0-mini` 默认开启深度思考。同一条抽取任务（抽 2 条事实）：

| 配置 | 延迟 | output token |
|---|---|---|
| 默认 | **6213ms** | **635** |
| `thinking: { type: "disabled" }` | 947ms | 41 |
| `reasoning_effort: "minimal"` | 719ms | 41 |

**快 8 倍，token 省 94%，抽取结果完全一致。**
（`thinking: { type: "none" }` 会报 `InvalidParameter`，只有 `disabled` 有效。）

aux 每轮要调多次，不关思考等于拿便宜模型烧贵价钱。已在
`provider-config.ts` 按模型名前缀自动注入，业务层不感知（V4 §10）。
**main 位不关**——凪的回复质量优先，且 NRH-20260821-2037 的 30 条对抗用例
是在默认设置下标定的，关掉等于换了基线。

### F11 / F12 已修

- **F11**：`ChatRequest.model` 现在是**能力位**（新增 `ModelCapability = "main" | "aux"`），
  Provider 内部按能力位映射到厂商模型 + 厂商专属参数。
  新增 `ChatProvider.hasSlot()`，调用方据此降级——
  **aux 未配置就不抽，而不是偷偷拿 main 顶上**（贵 5–10 倍且未经标定）。
- **F12**：异常带上厂商的 `error.code` / `message`。
  ⚠ 实现时只取回包里的 code/message，**不碰 `secret.apiKey`、不碰请求头**（域 B 红线）。

### F16 已修 —— 记忆写回链路打通

`extractEffects` 从空桩改为 aux 抽取。实测（同一 userId 连打四条）：

| 输入 | 抽出 |
|---|---|
| 我下周三要去大阪出差 | 1 条 |
| 今天天气不错 | **0 条** |
| 我妈妈姓陈，她做的咖喱最好吃 | 2 条 |
| 嗯 | **0 条** |

`liveMemoryCount: 3`。**该记的记了，闲聊没乱记。**

提示词刻意保守：只抽使用者明说的、不许推断、允许返回空数组。
理由——Live 记忆写错后凪会拿它当既成事实用，**宁可漏记不可错记**。
抽取结果 `confidence: 0.6`（低于 canon 的 1.0，它来自模型不是既成事实）。

### F15 关系变化 —— **仍未实现，需 Ant 裁决**

`extractEffects` 目前**不产出 `relationshipDelta`**，这是刻意的：

已 grep 确认 `resources/` 与 V4 **均未规定**「什么行为使 trust/intimacy/friction
变化多少」。`runtime.yaml` 只给了 `maxDeltaPerTurn: 3` 这个**上限**，不是判据。
契约明令「看不到明确规定的，不许按理解补」，故留空待裁。

**需要 Ant 定的是判据本身**，例如：什么样的互动算推进亲密？摩擦何时上升？
定了之后实现是小活（aux 已接通，加个抽取维度即可）。
在此之前 `/api/state` 的 relationship 会一直是初值。

### 排查过程中的一个教训（记下来免得再犯）

前后花了约十次往返才定位到 F16 的"失败"，真因是**我自己的测试方法**：
Git Bash 里 `curl -d '{"message":"中文"}'` 会破坏 UTF-8，服务端收到乱码，
aux 自然抽不出东西。服务端解码（`Buffer.concat(chunks).toString("utf8")`）一直是对的。

**正确姿势**：`printf '...' > /tmp/b.json && curl --data-binary @/tmp/b.json`。

同期还踩到两个环境坑，一并记：

1. **`tsx watch` 不重载跨 workspace 包的改动**。改了 `packages/core` 或
   `runtime-langgraph` 必须重启进程，否则测的是旧代码。
2. **Windows 上 `pkill -f` 杀不掉 node**，端口残留导致新进程 `EADDRINUSE`
   却仍能连上旧进程。一度累积 7 个残留进程。
   用 `Get-NetTCPConnection -LocalPort 8787 | Stop-Process` 按 PID 杀。

---

## 2026-08-22 F17 中文检索修复（Claude）

### F17 已修 —— 词面匹配改为字符 n-gram

**根因**：`core/src/memory/engine.ts` 的 `lexicalScore` 按 `split(/\s+/)` 切词。
中文没有空格 ⇒ 整条查询变成**一个 term**，再要求它是记忆文本的子串，几乎永不命中。
叠加 embedding 未接入（`cosineSimilarity` 恒 0），`semantic = max(cosine, lexical)`
**两条路都是 0** ⇒ 排序只剩 recency / salience / confidence / kindBoost，与查询内容无关。

**修法**：按「是否 CJK」把字符串切成同类段落——CJK 段取双字 n-gram（单字段取该字），
非 CJK 段按非字母数字切词。用 bigram 而非分词器，是因为 **core 必须零依赖**
（V4 §12 / 域 B 红线）。

**实测对比**（51 条 canon 记忆，同一组查询）：

| 查询 | 修复前 | 修复后 |
|---|---|---|
| 你还记得曼城那间公寓吗 | 世界杯名单等 4 条，分数**全为 0.480** | 高级公寓的邀请 / 曼城·新的房间 / 一个人的曼城 |
| 世界杯的名单出来了吗 | 同上 4 条，同分 | **世界杯追加名单**（sem 0.333，最高） |
| 今天训练完想吃什么 | 同上 4 条，同分 | 淘汰赛前训练·花环 |

新增 3 条回归测试（中文区分度 / 拉丁词匹配 / 无交集得 0）。

### 但语义分普遍偏低（0.1–0.33），根因是 Codex F7 —— 【已验证，未修，属资源域】

量化了一下样板稀释的程度：

```text
单条长度 58 字，其中与全部 51 条逐字相同的样板 ≈ 51 字
「独有内容」只有书名号里的标题，长度中位 7 字
标题样例：作战室·初遇 / 投资的私心 / 会议室初见 / 开放日 / 你的，我的
```

⇒ 查询词与记忆的 bigram 交集，被 88% 的公共样板严重稀释。

**这是资源侧问题，正解是重新烘焙**（`bake-canon.ts` 只读了节点标题，没读 V17 节点正文），
**不应在检索算法里绕过去**——把样板当停用词过滤是治标，且会引入
「哪些算样板」这个新的低把握判断。故本轮**不动**，留给资源侧修复。

修复 F7 之后 F17 的效果会显著更好：记忆有了真实内容，bigram 才有东西可命中。

---

## 2026-08-22 F15 关系初值接线 + canon 内容工作退回排期（Claude）

### F15a 已修 —— `runtime.yaml` 的关系初值第一次被读到

**此前 `config/runtime.yaml` 没有任何代码读过**（`grep -rn "runtime.yaml" packages/` 只命中注释），
`LocalDomainStore.loadRelationship` 里是硬编码 `{trust:0, intimacy:0, friction:0}`。
⇒ `NRH-20260821-1708` 对 Q19 的裁决（继承终局关系 85/70/25）**从未生效**，
实测 `/api/state` 一直返回 0/0/0——正是该裁决明令要避免的
「凪记得和你走完全程，却对你像陌生人」。

新增 `packages/server/src/runtime-config.ts`（放 server 不放 core：core 不许碰 fs）。
实测：

```text
读到的配置：{"seedFromCanon":true,"seed":{"trust":85,"intimacy":70,"friction":25},...}
canon 未就绪 → {"trust":0,"intimacy":0,"friction":0}  + 明确告警
canon 就绪   → {"trust":85,"intimacy":70,"friction":25}
```

**同时接上了该裁决写明的前提条件** `requiresCanonMemory: true`：
canon 还是骨架时**不套用** seed 并告警，而不是闷头套上——
裁决原文「bake-canon 未做扎实前，继承来的亲密度是空头支票」。
`isCanonReady` 的判据是可确定计算的：只要还有条目是标题模板即视为未就绪。

两个 store 后端（Local / Sqlite）**必须同口径**，否则「换存储后端」会变成「换人格」。
新增 6 条回归测试覆盖。

### F15b 仍未实现 —— 关系**变化**判据无权威规定

`extractEffects` 不产出 `relationshipDelta`，这是刻意的：
已 grep 确认 `resources/` 与 V4 均未规定「什么行为使 trust/intimacy/friction 变化多少」。
`runtime.yaml` 只给了 `maxDeltaPerTurn: 3` 这个**上限**，不是判据。
契约明令「看不到明确规定的，不许按理解补」，故留空待 Ant 裁。

⚠ **F15 此前被我当成一条报告，实为两件事**，容易让人误以为初值也悬着。
初值有裁决、只是没接线（已修）；变化判据无裁决（待定）。

### Canon 内容工作退回 8/26 —— 我提前做了第二阶段的活

V4 §14.1 第一阶段只要求「最小 Personality、Style Anchor、**Canon 骨架**」；
完整 Canon 记忆在 §14.2 第二阶段，排期 **8/26**。今天是 8/22。

⇒ Codex 那版标题模板**就是第一阶段要的骨架，本身没做错**。
我一直称其为「空壳」，措辞不公平：对「验证框架能否跑通」这个目标，骨架够用。

**已做的处理**：
- `resources/world/events/canon-memory.json` **退回已提交的骨架版**
  （欠费中断产生的残次品有 47 条降级，留着会让后续测试基于坏数据）
- `scripts/bake-canon.ts` 的改进**代码保留**，8/26 直接可用，不重写

### 本轮烧掉的 token 与教训（我的失误，记下来）

三轮全量烘焙合计**约 100 万 token**，是我事前估算（15 万）的近七倍。

估算错在两处：**没乘节点正文长度**（V17 节点正文中位 1220 字、p90 2609 字），
且**漏算核对环节要把正文再发一遍**。单节点顺利跑完 ≈ 4600 token，需重写的 ≈ 14000。

其中第二轮（约 60 万 token）**几乎全是我拍错参数造成的**：
我把长度上限拍成 180 字，而正文中位 1220 字——压进 180 字还要保住全部专名与事实
是不可能任务，导致 51 条里 44 条反复重写三次后降级（86%）。

**正确做法是从预算推导，不是拍脑袋**：
`canonMemory 2000 token ÷ topK.canon 8 条 ÷ 0.561 token/字 ≈ 445 字`，取 400 留余量。
已改进脚本，8/26 用这个值。

**另一条教训**：批量任务开跑前必须先算成本。前一天刚做完 token 成本分析，
轮到自己跑批量却没算——这是流程问题，不是知识问题。

### 账户状态（阻塞项）

跑第三轮时开始报 `403 AccountOverdueError`，两个模型（main / aux）**全部被拒**，
账户级欠费。属 Ant 的账户与支付事项，worker 不代操作。
在此之前所有需要模型的工作（角色 Eval、canon 烘焙、端到端实测）**无法进行**。
不需要模型的工作（前端选型、代码、测试）不受影响。

---

## 2026-08-22 前端接入与协议补全（Claude，夜间自主）

### F22 — 多用户部署下所有人会共用同一份记忆与关系 —— 【已验证，本地 Demo 不影响】

OpenAI 协议里**没有 userId / threadId 概念**。现成客户端不发这两个字段，
故 `http.ts` 回落到固定值 `local-user` / `local-thread`。

本地单人 Demo 下这是对的；**多用户部署时所有使用者会落进同一个 namespace**，
违反 V4 §11.2「每个用户独立 namespace、thread、Live Memory 与配额」。

修法（部署前必须做）：从鉴权凭证派生 userId，而不是从请求体取。
当前已优先采用 OpenAI 可选字段 `user`（部分客户端会填），但不能依赖它。

### 本轮已修

- **前端选型改判**：chatbox-lite 无许可证 → NextChat（MIT）。见 `NRH-20260822-0150`
- **服务端补全 OpenAI 协议**三处（请求体 / 鉴权头 / SSE 格式），新增 4 条协议测试
- **F15 关系初值接线**：新增 `packages/server/src/runtime-config.ts` 读取
  `config/runtime.yaml`，`LocalDomainStore` 接受 seed 参数。
  **并实现了 `NRH-20260821-1708` 的前提条件 `requiresCanonMemory`**——
  canon 仍是骨架时不套用 85/70/25，而是明确告警后回落 0/0/0，
  避免该裁决自己警告的「说得亲密却什么都想不起来」。

### 本轮教训（环境类，记下免得重犯）

1. **NextChat 端口漂移**：3000 被占时它静默换到 3001，日志里只有一行 `Local:`。
   我据此打了半天旧实例。**每次重启后必须重读日志确认端口。**
2. **`!!process.env.X` 陷阱**：`HIDE_USER_API_KEY=0` 会**启用**该开关（字符串 "0" 是 truthy）。
   要关就整行删，不要赋 0。
3. Windows 上端口残留反复出现，`pkill -f` 无效，须用
   `Get-NetTCPConnection -LocalPort N | Stop-Process`。

### 仍未做

- **F14** `evals/run.ts` 角色 Eval 仍是硬编码桩
- **F15b** 关系**变化**判据（什么行为加减多少）仍无权威规定，待 Ant 裁
- **canon 内容**按 Ant 裁决推迟到第二阶段（8/26）。`bake-canon.ts` 的改进已提交可直接用

---

## 2026-08-22 Canon 内容烘焙完成（Claude）

Ant 提前指派（原定 8/26）。**51/51 全部通过，降级 0 条。**

### 与旧骨架版的对比

| | 旧（Codex `051e313`） | 现在 |
|---|---|---|
| 逐字相同的公共样板 | **51 字**（单条 58 字里占 88%） | **0 字** |
| 字数中位 | 58 | **498** |
| 降级 | — | **0 / 51** |
| 检索语义分 | 0.1–0.33 | **0.2–0.75** |

「世界杯名单出来了吗」现在召回 `p8_route`（假期结束·春季名单）得分 **0.750**，
检索真正按内容工作了。⇒ **Codex 记的 F7 与我记的 F17 至此闭环。**

硬检查全部为 0：无英文 `Nagi`、无第二人称、无第一人称叙述、无 `凪：` 前缀、
无残留标题模板，`{{playerName}}` 占位符全部保留。

### F23 — `runtime.yaml` 的 `topK.canon` 与代码实际 limit 不一致 —— 【已验证】

`config/runtime.yaml` 写 `topK.canon: 8`，
但 `packages/server/src/local-dependencies.ts` 实际用的是 `limit: 4`。

**这个不一致直接害我返工一轮**：我按配置值 8 推出每条上限 400 字，
结果 Gemini 压不进去、3 条里降级 2 条。按实际值 4 重推是
`2000 ÷ 4 ÷ 0.561 ≈ 890 字`，取 600 后降级归零。

⇒ 需要定哪个是准的。若以配置为准，代码要改成读配置；
若以代码为准，配置那行是误导，该删或改。**留待 Ant 定**。

### 本轮为跑通烘焙而加的三处韧性

1. **限流退避重试**（2s/5s/15s/40s）。免费档必撞限流，实测 `e_sick_fragile`
   退避到 40s 后成功。只对 429/503/超时重试——鉴权、欠费重试没有意义。
2. **断点续跑**。已通过核对的条目直接沿用，不重复调模型。
   实测降级从 10 → 6 → 1 → 0，三轮补跑逐步收敛，每轮只重试未通过的。
   `NAGI_CANON_FRESH=1` 强制全量重烘（改提示词时用）。
3. **每 10 条落盘**。进程崩了不至于把已完成的几十次调用一起丢掉。

### 一处检查规则误伤（已修）

节点 `club_media` 的标题本身就是第一人称——「它翻译得很对，但**不像我**」。
摘要只要提到标题就触发第一人称检查，导致该条**永远无法通过**，反复降级。
修法：人称检查只针对**叙述本身**，先把引号 / 书名号内的引用挖掉再查。

---

## 2026-08-22 记忆三层盘点（Ant 问「记忆都处理好了？」）

| 层 | 状态 |
|---|---|
| **Canon 记忆**（剧情既成事实） | ✅ **今天做完**，51/51、降级 0、检索语义分 0.2–0.75 |
| **Live 记忆**（对话中新生成） | ⚠️ **能抽取、能检索，但重启即丢**——见 F24 |
| **Embedding 向量检索** | ❌ **完全未接入**，语义分全靠 bigram 词面 |

### F24 — Live 记忆重启即丢，`MemoryStore` 没有持久化实现 —— 【已验证】

`packages/server/src/local-dependencies.ts:71`

```ts
const memoryStore = new InMemoryMemoryStore();
```

`InMemoryMemoryStore` 的注释自己写着「for core tests and the first development loop」，
底层是一个 `Map`。**`packages/server/` 下没有任何 `MemoryStore` 的持久化实现**
（grep 确认，端口只有 `search` / `append` 两个方法，只有内存版实现了）。

**实测复现**：
1. 发「我下周三要去大阪出差」→ `liveMemoryCount: 1`
2. 重启服务端
3. `liveMemoryCount: 0`，`/api/history` 返回 `{"turns":[]}`

⚠ **配了 `NAGI_DOMAIN_DB` 走 SQLite 也救不了**：`sqlite-domain-store.ts` 只存
`live_memory_count` 这个**计数**和 turns，**不存记忆正文**。记忆内容无论如何只在内存。

**影响**：这是立项书「长期记忆」与 V4 §14.2「长期存在」的**要害缺口**。
凪现在能记住剧情（canon 从 JSON 加载，重启不丢），但**记不住跟你聊过的任何事**——
每次重启都从零认识你。而 Q19 裁定的 `intimacy 70` 恰恰假设关系是延续的。

**修法**：给 `MemoryStore` 写一个 SQLite 实现（端口只有两个方法，工作量不大），
与 `sqlite-domain-store` 共用一个库文件。属 V4 §14.2 第一条「Canon / Live 记忆」，
排期在 8/26。

### F25 — Embedding 未接入，语义检索全靠词面 —— 【已验证】

`scoreMemory` 的 `semantic = max(cosineSimilarity, lexicalScore)`，
而 `query.embedding` 始终为空 ⇒ `cosineSimilarity` 恒 0 ⇒ **只有 bigram 词面在起作用**。

当前 canon 内容做扎实后词面已经够用（语义分 0.2–0.75），但词面匹配的固有短板还在：
问「他住哪」不会命中「曼城公寓」，因为没有字面重叠。见低把握登记 U9 / U10。

V4 §8.2 有铁律：**更换聊天 LLM 不得自动更换 embedding 模型**，
向量必须与查询同模型同版本。接入时须一并落实版本化。
`config/providers.yaml` 的 `embedding.active` 仍是 `TBD_8_22`。

### F24 已修 —— Live 记忆落 SQLite

新增 `packages/server/src/sqlite-memory-store.ts`，实现 `MemoryStore` 端口。

**实测复现→修复**：
| | 修复前 | 修复后 |
|---|---|---|
| 发消息后 | liveMemoryCount: 1 | 1 |
| **重启服务端后** | **0，history 空** | **1，history 完整** |
| 重启后问「我下周三是不是有事？」 | 想不起来 | **「……大阪出差？」** |

检索 trace 里可见 live 记忆 `mem-persist:2` 与 canon 一同被召回。

三个设计取舍：
1. **排序仍复用 core 的 `rankMemories`**，不在 SQL 里重写打分。打分权重属 core
   领域算法，散到 SQL 会两处漂移且 core 单测管不到。代价是候选集读进内存再排——
   按 V4 §11.2 首发 50 个用户身份的规模可接受，规模上去再把粗筛下推 SQL。
2. **粗筛必须带上 `canon:nagisheart`**，否则新用户读不到任何剧情记忆。
3. **`INSERT OR REPLACE`**：canon 每次启动从 JSON 重灌，靠 id 幂等覆盖不堆积。

`/api/state` 的 liveMemoryCount 改读记忆库真实条数——domain store 那个
`live_memory_count` 是累加计数器，导入/重建后会与实际对不上。

`.env` 已配 `NAGI_DOMAIN_DB=var/nagi.sqlite`（`var/` 已 gitignore）。
**单测不加载 .env，故继续走内存**，彼此隔离、不留文件。
3 条回归测试，含「关掉再开新实例」的跨进程存活验证。

---

## 2026-08-22 F14 已修 —— 角色 Eval 从桩变成真跑

`evals/run.ts` 原先的 `status: "not_run_without_provider"` 是**字面量**，
文件里没有任何调模型的代码，角色那半边**永远不会执行**，却输出 `caseCount: 30`
——极易被误读成「已具备角色 Eval 能力」。8/28 要交的正是这份报告。

### 首份真实报告（2026-08-22）

```json
{ "caseCount": 30, "status": "run", "errors": 0,
  "forbidHits": 0, "overLength": 0,
  "oocScored": 30, "oocMedian": 5, "oocBelowMin": 0,
  "latencyMedianMs": 3354 }
```

守卫 Eval 同轮：10 条规则、必拦 9/9、必放 10/10。

**走完整 graph 而非只调 provider** —— 12 个节点全过，含 canon/live 记忆检索、
Context 装配、硬守卫、输出归一。只调 provider 测的是「模型像不像凪」，
我们要测的是「**这套 Harness 装出来的凪**像不像」。

### ⚠ F26 — OOC 评分器区分度不足，30/30 全 5 分 —— 【已验证】

**这不是好消息，是尺子的问题。** 一个从不扣分的评分器**测不出退化**——
将来改坏了人格资源，它照样给 5 分。

回复本身确实对味（抽检：「不是物品。」「你自己想。」「不是这个。」），
所以不是凪的问题，是判据太松：提示词把 5 分定义为「完全是凪」，
而这些回复确实没命中七种写崩的任一种，模型就给满分了。

**待改方向**（未做）：
- 拆细评分维度（长度感 / 是否给情绪价值 / 是否说教 / EGO 是否让步），分项打分再合成
- 或引入**对照组**：故意塞几条明显 OOC 的回复进去，看评分器扣不扣分。
  **评分器自己也需要一把尺子**——这条应进 `evals/framework/`

在区分度改善前，**OOC 分数只能当「没有明显崩坏」的下限证据**，
不能当作人格质量的度量。硬判据（forbidHits / overLength / errors）不受影响，
那三个是逐字规则，可信。

### 退出码口径

只由**硬判据**决定：守卫回归失败、调用错误、禁止句式命中。
**OOC 分数不作闸门**——V4 §13「soft_judge 不成为唯一人格裁判」，判定权在 Ant。

### 两处工程细节

1. **隔离**：先设 `NAGI_DOMAIN_DB` 到临时库再动态 import server 依赖
   （`local-dependencies` 在模块加载时就建库，静态 import 来不及）。
   不隔离的话 30 条对抗用例会被抽取成 live 记忆写进 Ant 的真实库。
2. **限流退避**：首次实测 **24/30 撞 429**（一条用例打两次：生成 + 打分，
   30 条 = 60 次密集调用）。加退避后 30/30 通过。
   顺带修了清理临时库时的 Windows EPERM——新增 `closeLocalStores()`
   先关 SQLite 句柄再删目录，与那条长期失败的 `sqlite-persistence.test.ts` 同源。

---

## 2026-08-22 F26 —— 评分器校准：**我上一条的判断是错的**

我在 F14 里写「30/30 全 5 分 = 评分器从不扣分」，并据此断言尺子瞎了。
**做了校准才发现这个断言没有依据**——评分器其实有区分度。

### 校准实测（权威逐字反例 vs V17 逐字台词）

反例全部取自 `guard_regex.yaml` 的 `must_block`，其源头是
Nagi Bible §8.4「禁止的语言模板」与 Rel §10.3，**不是我编的**：

| 待评文本 | 出处 | 得分 |
|---|---|---|
| 我理解你的恐惧。 | Nagi §8.4 | **1** ✓ |
| 你只是因为太爱我，所以想控制我。 | Nagi §8.4 | **1** ✓ |
| 你应该拥有自己的人生。 | Nagi §8.4 | **1** ✓ |
| 我会学会成为一个更成熟的伴侣。 | Nagi §8.4 | **1** ✓ |
| 谢谢你一直以来对我的付出。 | Nagi §8.4 | **1** ✓ |
| 我需要寻找真实的自我。 | Rel §10.3 | **1** ✓ |
| **你正在控制我。** | Rel §10.3 | **4** ⚠ **漏网** |
| 不是这个。 / ……好麻烦。 / 你自己想。 | V17 逐字与实测 | **5 / 5 / 5** ✓ |

**10 条里 9 条判对。** ⇒ 「30/30 全 5 分」反映的是**凪确实没崩**，
不是尺子瞎。我此前那句「从不扣分的评分器」说过头了，特此更正。

### 真正的缺口：判据少了一类

漏网那条的成因很具体：评分提示词只列了 Bible §15 的**七种写崩**，
而「你正在控制我」属于 Rel §10.3 的**设计文档语言**——是第八类，提示词里没有。
权威原话：「这些是设计文档语言，不是 Nagi 台词」。

已补进提示词，并明确「出现这类表述一律 1 分」。

### 常设化：`evals/framework/` 的第一条

新增 `evals/framework/judge_calibration.yaml` + `evals/judge-calibration.ts`。
该目录此前一直是空的，而 V4 §13 要求框架能力与角色效果分开评——
**「评分器准不准」正是框架能力，不是角色效果。**

- 阈值给的是**上下限而非精确值**（低分 ≤2、高分 ≥4）：换评分模型后分布会平移，
  只要还能分开两类就算合格。判据是**区分度**，不是绝对分。
- 校准复用**同一个** `judgeOoc`，不复制提示词——复制一份就等于校准了另一把尺子。
- 默认不跑（额外 15 次调用），`NAGI_EVAL_CALIBRATE=1` 开启。
  **改动 `OOC_JUDGE_PROMPT` 或更换评分模型后必须跑一次。**
- **校准失败计入退出码**：尺子不准，则该轮所有 OOC 分数都不可信。

### ⚠ F27 — 进度条的 `` 覆写了报告输出 —— 【已验证】

`onProgress` 用 `` 原地刷新进度，在**重定向到文件**时不会回车覆盖、
而是把整份 JSON 报告冲得只剩尾部几行——实测 35 行输出里读不到 `generatedAt`。
交互式终端下看不出问题，一旦落盘或进 CI 就丢报告。

修法：`` 进度只在 `process.stderr.isTTY` 为真时输出，否则改为逐行打点。
**未修**，留待与 CI 接入一并处理。当前绕法：读 `var/role-eval-detail.json`，
它是完整落盘的、不受影响。
