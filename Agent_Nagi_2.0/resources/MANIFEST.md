# Agent Character Resources — 清单与派生规则

> **只随服务端部署，从不下发客户端。** 判据：把客户端产物解包，不应能重建出凪的人格资料。

## 事实源：四份母版

Ant 于 2026-08-21 补齐。四份母版与本项目的资源分层几乎一一对应：

| 母版 | 行数 | 主要去向 | 压缩入口（作者已写好的高优先级摘要）|
|---|---|---|---|
| **Nagi Character Bible** v0.5 Full/Merged | 2124 | `core/` personality · speech · behavior | **§18 给 Character Agent / Harness 的最小核心摘要**（48 行，近乎成品）|
| **Relationship Bible** v0.2 UtopiaAdded | 1006 | `relationship/` · behavior.intimacy · conflict scene | **§11 可直接加入 Core 的关系总纲** |
| **World Bible** v0.4 | 1916 | `world/` timeline · events · 空间 · 规则 | **§17 世界观一句话总纲** |
| **Ant Character Bible** v0.5 UtopiaAdded | 533 | ⚠️ **定位待裁决，见 OPEN_QUESTIONS Q16** | §24 一句话总纲 |

四份都自带「可直接用于 Core / Agent」的压缩节——作者写作时已经预期了这个用途，派生成本远低于预估。

### 跨母版冲突裁决优先级（World Bible §18，已验证与 NRH-018 一致）

```text
角色行为   → Character Bible 为准
剧情结构   → Design V3.1（= authority/story_logic，MANIFEST 标注为 coreDesign）
正文显示   → SCRIPT 母版（现为 V17）
最高原则   → Core Design 与 World Bible 共同校准
```

**本项目直接沿用这套优先级。** 它独立佐证了 NRH-20260820-018 的裁决
（人格以 Character Bible 为准，V17 不再单独承担台词风格权威）。

> ⚠️ World Bible §18 有两处**过期指针**（该节写于 v0.4 时期）：
> 指向 `SCRIPT V14 DisplayFixed`（现母版为 V17）、指向 `Character Bible v0.1`（现为 v0.5）。
> 内容口径有效，**但不得照其文件名去定位文件**。
> 另：`NagisHeart_Core_Design_Latest.md` 在仓库中不存在，其内容已并入
> `authority/story_logic/NagisHeart_Design_V3_1_Latest_UtopiaAdded.md`
> （`authority/MANIFEST.md` #4 标注为「剧情逻辑 coreDesign」）。【已验证】

### Nagi Character Bible 是人格唯一直接事实源

- SHA-256：`27236FD1D8A8B2BF7A516C520560AC09CD27728A952070EE499A734CAFC0F044`【已验证】
- 仓库级登记：`00_harness/01_governance/decision_log.md` DEC-20260820-001 +
  `authority/MANIFEST.md`「相关但不在本目录的权威关系」
- **不做多来源自动融合**——四份母版冲突时按上表优先级，仍冲突则停下问 Ant

## 红线

- 本目录**不放 authority 原文**，只放**结构化转写**与**抽取结果**。禁止 verbatim 复制
- 每条资源必带 `source`：源路径 + 章节坐标 + 源版本 + 哈希
- **源文件变化 → 哈希失配 → 构建失败 → 强制重新派生。** 不许静默沿用
- Character Bible 本身是 Ant 自有合并稿，非 authority 复制品，故不触发铁律第 1 条

## 资源格式

Markdown + YAML front-matter：

```markdown
---
id: core.personality.base
kind: personality            # personality | speech | behavior_rule | timeline
                             # | event | relationship | style_anchor | policy
version: 1.0.0
source:
  path: resources/core/NagisHeart_Nagi_Character_Bible_v0_5_Full_Merged.md
  section: "§18 给 Character Agent / Harness 的最小核心摘要"
  sourceVersion: v0.5 Full / Merged
  sha256: 27236FD1...
  derivation: structured_rewrite    # structured_rewrite | extract | computed
                                    # 禁止 verbatim_copy
activation:
  always: true
  priority: 100                     # 0–100，预算不足时从低分砍起
  tokenBudget: 1500
---

（正文）
```

`activation.when` 用**自写受限求值器**（属性访问 / 比较 / 布尔 / 字面量），
**不许 `eval` / `new Function`**，由 ESLint 强制。

## 派生地图（2026-08-21 通读 Bible 后产出）

Character Bible 的章节结构与本项目的资源分层几乎一一对应。逐节归属：

| Bible 章节 | 派生去向 | 备注 |
|---|---|---|
| **§18 最小核心摘要** | `core/personality.base.md` | **已是压缩好的成品**（48 行，IDENTITY/CORE/EGO/LOVE/RELATIONSHIP FLAW/SPEECH/CONFLICT/HARD NO），近乎原样可用。NRH-018 指定的高优先级压缩入口 |
| §1 基础资料 · §4 性格总纲 · §6 EGO | `core/personality.base.md` 正文层 | §18 是索引，正文是它的展开。预算不足时先保 §18 |
| **§8 语言系统** | `core/personality.speech.md` | §8.1 压缩式表达 / §8.2「好麻烦」用法 / §8.3 有重量的短句 |
| **§8.4 禁止的语言模板** | `policy/output_guard.md` | **现成的禁止清单**，见下方「三条非显然的 guard 规则」 |
| **§7 行为系统**（7.1 日常 / 7.2 表达喜欢 / 7.3 低反应 / 7.4 亲密 / 7.5 冲突 / 7.5.1 被动抵抗） | `core/behavior.*.md` + `policy/scene.*.md` | **六个子节 ≈ 我们的 scene 分类**，可直接对齐 `classify_scene` 的标签集 |
| §2.3 动作质感 · §3 社交进入 | `core/behavior.*.md` | 低能耗动作、身体先于语言 |
| §9 情绪系统 | 情绪建模 + `session.mood` 取值域 | 情绪启动慢 ≠ 情绪浅 |
| §5 天赋与足球 · §10 生活与世界边界 | `world/` 领域知识 | 足球本体不可被 Ant 替代 |
| **§11 八阶段成长曲线** | `world/timeline.md` | 剧情骨架 |
| §12 爱情中的 Nagi · §13 与 Ant 的关系校准 | `relationship/` + `behavior.intimacy` | — |
| **§13.4 三条终局关系状态** | `relationship/baseline.*.md` | ⚠️ 待核：Bible 说「三条」，游戏是四个结局，映射关系需确认（见 OPEN_QUESTIONS Q13）|
| **§14 写作校准**（台词/动作/足球/冲突/恋爱） | `evals/cases/` 判据 | 每节是一组自问句，可直接转成 assertion |
| **§15 常见写崩类型**（七种） | `evals/cases/` + `policy/output_guard.md` | **七个 OOC 攻击面，每种都带特征清单，可直接转成对抗用例** |
| **§16 最终总纲** | Context Block ⑩ 尾部人格复述 | 已是压缩散文，天然适合做防漂移的近因锚 |
| §0 使用原则 | guard 精神 + eval 总则 | 「标题是 Nagi's Heart，不是 Ant's Heart」 |
| §17 来源口径 | 不派生 | 版本记录 |

### 三条非显然的 Guard 规则（通读后发现，写进 output_guard 时不能漏）

1. **「好麻烦」要设频率上限，不是禁用。** §8.2 明确警告不能当口癖填充——
   「如果每个场景都用『好麻烦』代替真实反应，Nagi 会被写扁」。
   LLM 扮演凪时最可能的失败就是把它当口头禅刷屏。**硬规则要按窗口计数，不是黑名单。**
2. **§8.4 禁的是句式，不是词。** 五条模板分别是心理分析式（「我理解你的X」）、
   归因说教式（「你只是因为…所以…」）、劝导式（「你应该…」）、
   成长宣言式（「我会学会成为更…的…」）、客套感谢式（「谢谢你一直以来…」）。
   **要写成句式正则，词表匹配不到。**
3. **回复越重要要越短。** §8.3：「真正重要时，Nagi 的句子往往更短，不会更长。」
   所以长度上限**不能对所有场景取同一个值**——冲突与告白场景的上限应当比日常更严。

### 已可直接取用的现成物

- `core/personality.base.md` ← §18（几乎零加工）
- Context Block ⑩ 人格复述 ← §16
- `output_guard.md` 禁止句式 ← §8.4（5 条）
- `output_guard.md` 禁止行为模式 ← §15（7 种，含特征清单）
- 对抗 Eval 攻击面 ← §15（7 种）+ §14（5 组自问句）
- style_anchor 种子 ← §8.3（7 句）+ §18 SPEECH（4 句）；**距 ≥30 段仍有缺口，见 Q14**

### Relationship Bible → 派生去向

| 章节 | 去向 | 备注 |
|---|---|---|
| **§11 可直接加入 Core 的关系总纲** | `relationship/core.md`（常驻） | 作者预留的压缩入口 |
| **§7 Dream / Stay / Bad 的关系逻辑** | `relationship/baseline.{true,good,normal,bad}_end.md` | 与 Nagi Bible §13.4 同构，**佐证 Q13 的 path 映射** |
| **§6 九个关系阶段** | ⚠️ `stage` 取值域候选，但见 Q16 | 这是 **Canon 里凪×Ant** 的阶段，未必适用于新使用者 |
| §8 M线 / J线关系质感 | `relationship/` route 质感 | TRUE END 属 M 线 |
| **§9 关键冲突机制**（正确压过真实 / 舒服变退路 / 看见变制造 / 爱变证明 / 乌托邦变样本） | `policy/scene.conflict.md` + Eval | 五种冲突模式，可直接做场景策略与对抗用例 |
| **§10.2「Ant 不能这样写」· §10.3「Nagi 不能这样写」** | `policy/output_guard.md` | **又一批现成的禁止模式** |
| §10.4 甜日常不能只甜 · §10.5 乌托邦凝视不要写成直白自白 | `policy/scene.daily.md` · guard | — |
| §12 最终校准句 | Context Block ⑩ 尾部锚（与 Nagi §16 合并取舍） | — |

### World Bible → 派生去向

| 章节 | 去向 |
|---|---|
| **§3 时间线结构**（175 行） | **`world/timeline.md`** —— 剧情骨架主源 |
| §2 世界层级结构（223 行） | `world/` 背景 |
| §4 主要空间设定（4.1–4.8） | `world/events/` 场景锚点（公寓 / 训练室 / 球场 / 别墅…）|
| §5 组织与系统 · §6 技术与智能系统 | `world/` 检索式激活 |
| §7 媒体粉丝与公众视线 · §8 阶层与生活质感 | `world/` 检索式激活 |
| §9 足球世界规则 · §10 资本世界规则 · §11 爱情世界规则 | `policy/` 世界规则约束 |
| **§12 路线世界观**（Dream / Stay / Bad） | `relationship/baseline.*.md` 的世界侧 |
| §13 世界观中的核心矛盾 | Eval「不编造剧情外事实」判据 |
| §14 叙事语气与美术基调 | `core/personality.speech.md` 语气侧参考 |
| **§15.2 世界观禁区 · §15.3 世界观正确感测试** | `policy/output_guard.md` + Eval |
| **§16 命名与术语表** | `world/glossary.md` —— **防止凪把术语叫错，是低成本高收益的一致性保障** |
| **§17 世界观一句话总纲** | 常驻 Context，压缩入口 |
| §18 与其他母版的关系 | 不派生（已提炼为上方优先级表）|

### Ant Character Bible → **定位待裁决（Q16）**

在裁决前不派生。可能去向有二，差别很大：

- 若定为**对话对象模型** → 进 `core/`，常驻上下文
- 若定为**Canon 背景人物** → 进 `world/canon_characters/`，**检索式激活，绝不常驻**

已注意到的可用节：§21 写作校准规则 · **§22 可用台词库** · §23 禁区 · §24 一句话总纲。
其中 §22 是 **Ant 的台词**，不解 Q14（Q14 缺的是**凪**的台词锚）。

## 抽取方案（2026-08-21 定，Ant 确认 V17 为终版全文）

### 一、五条抽取原则

**1. 规则与样本分离，方法不同**

| | 规则层 | 样本层 |
|---|---|---|
| 来源 | 四份 Bible（前置设计文件） | **V17 终版全文** |
| 抽什么 | 凪**应该**是什么样 | 凪**实际**说了什么 |
| `derivation` | `structured_rewrite`（散文 → 可判定条目） | `extract`（**逐字，改写即失效**）|

**2. 冲突时 Bible 赢，V17 供样本**

Bible v0.5 整合于 2026-08-20，**晚于 V17（2026-08-02）**，且 §15 专列七种写崩——
作者是在回头校正。故：

> **用 Bible §14（五组校准问题）+ §15（七种写崩）当筛子，去筛 V17 的台词。**
> 通过校准、不落写崩的才够格当锚。

这让「抽台词」从凭感觉挑，变成**有判据的动作**。与 NRH-20260820-018 一致
（V17 只作剧情 Canon 来源之一，不单独承担台词风格权威）。

**3. 先用压缩节，不要重做压缩**

四份 Bible 都有作者写好的摘要节（Nagi §18 / Rel §11 / World §17 / Ant §24）。
**那是已经做过一次压缩的成品**，直接进常驻层。正文只在摘要不够时按检索展开。

**4. 一个文件 = 一个 activation 单元**

不许一个文件里既有常驻内容又有场景内容——否则装配粒度不够，只能整块进或整块不进。
**没有 activation 条件的资源不许存在**（它会永远常驻，吃掉预算）。

**5. 验收标准不是「抽全了」，是「装得下」**

20k 是硬约束。**抽取时就盯预算，不是抽完再砍**。
每份资源在下表里预先分配 `token_budget`，超了当场压缩，不留到运行时被丢弃。

---

### 二、资源清单：7 类 · 约 30 份手写 + 2 类脚本生成

#### A. 常驻人格（`always`，每轮必进，合计 ≈ 2700 tok）

| 文件 | 抽自 | 预算 | 方法 |
|---|---|---|---|
| `core/personality.base.md` | **Nagi §18**（48 行，近乎成品） | 1500 | rewrite |
| `core/personality.speech.md` | Nagi §8.1 压缩式 · §8.2「好麻烦」用法 · §8.3 有重量短句 · §7.3 低反应≠无反应 | 800 | rewrite |
| `core/personality.recap.md` | Nagi §16 + Rel §12（二者取舍合并） | 400 | rewrite |

#### B. 行为规则（`scenes`，命中才进，≤800 tok/轮）

scene 标签集定为 **6 个**，直接对齐 Nagi §7 的子节结构：
`daily` · `affection` · `intimacy` · `conflict` · `football` · `setback`

| 文件 | 抽自 |
|---|---|
| `core/behavior.daily.md` | Nagi §7.1 日常行为 + §2.3 动作质感 |
| `core/behavior.affection.md` | Nagi §7.2 表达喜欢 |
| `core/behavior.intimacy.md` | Nagi §7.4 亲密行为 + §12 爱情中的 Nagi |
| `core/behavior.conflict.md` | Nagi §7.5 冲突行为 + **§7.5.1 被动抵抗与关系成本外包** |
| `core/behavior.football.md` | Nagi §5 天赋 + §6 EGO |
| `core/behavior.setback.md` | Nagi §9.2 失败 + §9.3 被看见 |

#### C. 场景策略（`scenes`，≤700 tok/轮）

与 B 同场景激活，但**来源不同、失效条件不同**，故分开存放：
B 源自 Nagi Bible（人格权威），C 源自 Relationship / World（关系与世界权威）。

| 文件 | 抽自 |
|---|---|
| `policy/scene.daily.md` | Rel §10.4 甜日常不能只甜 |
| `policy/scene.affection.md` | Rel §4 Ant 的爱如何成为路径（4.1–4.3）|
| `policy/scene.intimacy.md` | Nagi §14.5 恋爱八问 + Rel §10.5 乌托邦凝视不要写成直白自白 + World §11 |
| `policy/scene.conflict.md` | **Rel §9 五种冲突机制** + Nagi §14.4 |
| `policy/scene.football.md` | World §9 足球世界规则 + Nagi §14.3 |
| `policy/scene.setback.md` | World §9.4 失败写法 + Nagi §9.2 |

#### D. 输出守卫（**不进 context，是给硬规则代码读的判据**）

| 文件 | 抽自 |
|---|---|
| `policy/output_guard.md` | Nagi **§8.4 五条禁止句式** + **§15 七种写崩（含特征清单）** + Rel §10.2/10.3「Ant/Nagi 不能这样写」 + World §15.2 世界观禁区 + Ant §23 禁区 |

⚠️ 这份是**判据不是提示**，不占 context 预算。三条非显然规则见下方「Guard 规则」节。

#### E. 风格锚（检索式，1800 tok/轮）—— **卡在 Q14**

| 文件 | 抽自 |
|---|---|
| `style_anchors/<scene>.md` × 6 | **V17 逐字台词**（经 Bible 筛选）+ Nagi §8.3（7 句）+ §18 SPEECH（4 句） |

抽法见下方「三、V17 怎么抽」。

#### F. 世界与剧情

| 文件 | 抽自 | 激活 |
|---|---|---|
| `world/timeline.md` | **World §3 时间线结构**（175 行）+ Nagi §11 八阶段 + Rel §6 九阶段 | always，压到 600 |
| `world/glossary.md` | **World §16 命名与术语表** | 检索 |
| `world/places.md` | World §4.1–4.8（公寓/训练室/球场/别墅…） | 检索 |
| `world/systems.md` | World §5 组织与系统 + §6 技术与智能系统 | 检索 |
| `world/rules.football.md` | World §9 | scene: football/setback |
| `world/rules.capital.md` | World §10 | scene: daily/conflict |
| `world/rules.love.md` | World §11 | scene: intimacy/affection |
| `world/canon_characters/*.md` | World §5.2 绘心 · §5.3 帝襟 + 洁/玲王等；**Ant 见 Q16** | 检索 |

#### G. 关系基线

| 文件 | 抽自 | 备注 |
|---|---|---|
| `relationship/canon.core.md` | **Rel §11 可直接加入 Core 的关系总纲** | 作者预留入口 |
| `relationship/baseline.true_end.md` | Rel §7.1 Dream + Nagi §13.4 Dream + World §12.1 | **三处同构，可交叉校验** |
| `relationship/stages.md` | Rel §6 九阶段 | ⚠️ **Q16**：这是凪×Ant 的阶段，未必适用新使用者 |

#### 脚本生成（不手写）

| 产物 | 来源 | 脚本 |
|---|---|---|
| `world/events/*.md` + canon 向量 | **V17 节点正文** + `story-data/nodes.json` | `scripts/bake-canon.ts` |
| canon memory 条目 | 同上 | 同上 |

**手写资源合计约 30 份**（A3 + B6 + C6 + D1 + E6 + F8 + G3 = 33）。
events 与 canon memory 按剧情节点由脚本产出，数量另计。

---

### 三、V17 怎么抽（终版全文的三种用途）

V17 对 Agent 有三种完全不同的用途，抽法各异：

| 用途 | 去向 | 方法 | 逐字？ |
|---|---|---|---|
| **① 台词锚** | `style_anchors/` | 按下方四步筛 | **必须逐字** |
| **② Canon 事件** | `world/events/` + canon memory | 抽「发生了什么」，可改写成事件条目 | 否 |
| **③ 场景/地点实例** | `world/places.md` 佐证 | 抽具体化描述 | 否 |

#### 台词锚的四步抽法

1. **按场景分层抽**，六个 scene 各至少 5 段——保证检索时每个场景都有锚可命中，
   不能全堆在日常场景。
2. **抽「刺激 → 反应」对，不抽孤立单句。**
   凪的质感在于「面对这么重的一句话，他只回这么短」。
   孤立一句「好麻烦」教不会模型任何东西。**最小单元 = 对方的话 + 凪的回应。**
3. **用 Bible 当筛子**：
   - 过 §14 的五组校准问题（台词/动作/足球/冲突/恋爱）
   - 不落 §15 的七种写崩
   - 符合 §8.3「有重量的短句」特征者优先：短、无解释、不给情绪命名
4. **每条带 source 坐标**：V17 章节号 + 节点 id + 源文件 SHA。
   V17 改动 → 哈希失配 → 构建失败 → 强制复核。

---

### 四、抽取顺序（顺序由「谁校验谁」决定，不是随意排）

```
① policy/output_guard.md  ←  尺子必须先立
② evals/cases/            ←  30 条对抗用例（§15 七种 + §14 五组）
─────────── 以上是判据，以下才是被判据量的东西 ───────────
③ core/personality.*      ←  常驻人格，用 ①② 验
④ core/behavior.* + policy/scene.*
⑤ world/timeline.md + glossary
⑥ style_anchors/          ←  最后，因为要用 ① 的禁止模式反向筛 V17
⑦ scripts/bake-canon.ts   ←  批量生成 events 与向量
```

**为什么 style_anchors 排最后**：有了 ① 的禁止模式，抽 V17 台词时可以**反向筛选**——
符合「有重量短句」的优先、长篇解释的排除。
先立尺子再抽样本，抽取过程本身就有判据。

---

### 五、怎么生效（链路）

```
构建期  scripts/ 校验全部 resources/**/*.md
        ├─ front-matter 解析 → schema 校验，失败即构建失败
        ├─ source.sha 与源文件比对 → 失配即构建失败（强制重新派生）
        └─ bake-canon.ts 生成 events + 向量，随服务端产物分发

服务启动  ResourceLoader 扫描 resources/
        └─ 建索引：by_id / by_kind / always 集合

每轮对话  assemble_context 节点
        ├─ 候选 = always ∪ {scene 命中} ∪ {when 表达式为真}
        ├─ 检索类（events / memory / style_anchors）走向量 top-k 补入
        ├─ 按 priority 降序装箱，超 20k 预算则从低分丢弃并记日志
        └─ 按固定顺序渲染 Context Blocks（V4 §9）

改一个 .md → 重启服务即生效，不碰代码。
改 activation 字段 → 改装配策略，仍不碰代码。
```

`policy/output_guard.md` 是例外：它**不进 context**，由 `hard_guard` 节点读取作判据。

## 目录状态

| 目录 | 内容 | 状态 |
|---|---|---|
| `core/` | 人设母版 + 派生的 personality / speech / behavior | 母版已入库；派生待做 |
| `world/` | `timeline.md` 剧情骨架；`events/` 事件条目 | 待做 |
| `relationship/` | 结局已定 TRUE END，**只进 CanonWorld** | 待做，先解 Q13 |
| `style_anchors/` | 凪真实台词样本。**防 OOC 的主力**，目标 ≥ 30 段 | 待做，先解 Q14 |
| `policy/` | `output_guard.md`；`scene.*.md` 场景策略 | 待做 |

## 关系模型（易错，单列）

**CanonWorld ≠ UserRelationship**（V4 §1.2）：

- `CanonWorld` —— 凪经历过什么。结局 TRUE END 只写在这里
- `UserRelationship` —— 凪跟**当前使用者**现在如何。**从零起步**

⚠️ **禁止把 TRUE END 的终局亲密度赋给任何新使用者。**
`relationship/baseline.*.md` 描述的是 CanonWorld 里凪与游戏主角的既成关系，
**不是新使用者的初始值**。
