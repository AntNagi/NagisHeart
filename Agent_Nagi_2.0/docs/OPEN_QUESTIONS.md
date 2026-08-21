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

