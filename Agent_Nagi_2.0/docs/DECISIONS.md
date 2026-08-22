# Nagi Runtime Harness — 决策记录

> **Claude 与 Codex 的唯一同步点。** 开工先读「在做什么」+ 尾部最新条目，收工写回。
> 凡涉及主仓库 `authority/` 的改动，必须另在 `00_harness/01_governance/decision_log.md`
> 立条目，由 Ant 拍板。标记 `待 Ant` 的条目，在裁决前不得据以落地。

---

## 在做什么（并行防撞用）

> 开工加一行，收工删掉。**这是最轻的锁，不是任务板。**
> 格式：`- [发起方] 在改什么 — 起始时间`















---

## 低把握决策登记（待人工测试回溯）

> **用途**（Ant 定，2026-08-22）：开发期有些决定**没有权威依据，是 worker 拍的**。
> 它们不算错，但也没被验证过。全部登记在此，等拼装完成、能人工测试之后，
> **一旦出现症状就先回来查这张表**，确认是不是当初拍错了。
>
> 记录规则：每条必须写清 **① 拍了什么 ② 凭什么拍 ③ 如果错了，人工测试会看到什么症状**。
> 第 ③ 项是这张表的价值所在——没有它，回溯就变成重新猜。
>
> 被证实或证伪后：改「状态」列并写明依据，**不要删行**。删了就断了回溯链。

| # | 拍了什么 | 凭什么 | 错了会表现成 | 状态 |
|---|---|---|---|---|
| U1 | 记忆抽取只抽「使用者明说的」，禁止推断 | Live 记忆一旦写错，凪会当既成事实反复使用；宁可漏记不可错记 | 凪**记不住**本该记住的事。反之若凪言之凿凿说些你没说过的事，说明这条太松 | 待验 |
| U2 | 抽取记忆 `confidence: 0.6` | 来自模型判断而非既成事实，必须低于 canon 的 1.0。**0.6 这个数是我拍的** | live 与 canon 在检索排序里竞争失衡，该想起的想不起 | 待验 |
| U3 | salience 分档 0.9 身份 / 0.7 计划偏好 / 0.5 一次性小事 | 写进抽取提示词由模型自评。**分档无权威依据** | 重要的事被当小事挤出检索，或琐事长期霸占 top-k | 待验 |
| U4 | aux 抽取 `maxTokens: 400`、`temperature: 0.1` | 低温求 JSON 稳定；400 够抽几条。**两个数都是拍的** | 抽取被截断（记忆只写一半），或同句反复抽出不同结果 | 待验 |
| U5 | **main 不关深度思考，aux 关** | aux 实测关掉省 94% token 且结果一致；main 不关是因 NRH-20260821-2037 的 30 条对抗用例在默认设置下标定，关掉等于换基线 | 若凪回复慢/贵成为问题，这条第一个该动；反之若关掉后人格明显变差，说明基线不能动 | 待验 |
| U6 | `ORDER` 里 `event` 排在 `policy` 之后、`memory` 之前 | `runtime.yaml` 的 `context.blocks` 没有 event 这一档，**位置是按语义推的** | 世界事件锚点与 canon 记忆权重失衡，凪对场景/地点反应失准 | 待验 |
| U7 | 无法识别的 kind **回落 policy 而非抛错** | 一份资源写错不该让整个服务起不来；改为留痕 `unrecognizedKind` | 资源 kind 写错却无人察觉（服务照常起），装配顺序悄悄失真 | 待验 |
| U8 | 抽取失败**静默跳过本轮**，只 console.warn | 凪已经回过话了，记忆是附加效果，不该因抽取失败让整轮对话失败 | 记忆偶发丢失且不易察觉——表现为「凪有时记得有时不记得」 | 待验 |
| U9 | 中文词面匹配用**双字 n-gram**，不引分词器 | core 必须零依赖（V4 §12 / 域 B 红线），bigram 是零依赖里最有效的。**没有与分词方案做过对比** | 检索"沾边但不对"——问 A 召回含相同双字却无关的记忆（如「名单」命中「春季名单」也命中「追加名单」）。若频繁误召，说明该上分词或 embedding | 待验 |
| U10 | 保留 `semantic = max(cosine, lexical)` 的取大逻辑不动 | embedding 接入后 cosine 才有值；此前 cosine 恒 0，取大等于只用词面。**没验证过两者同时有值时取大是否合理** | embedding 接入后，词面高分但语义无关的记忆压过语义正确的记忆 | 待验 |
| U12 | beat 之间停顿 `240ms` | 太短仍像刷屏、太长拖慢整轮，取了个中间值。**未做人因验证** | 读起来仍像一次性刷屏（太短），或凪显得反应迟钝（太长）。可用 NAGI_BEAT_GAP_MS 免改代码调 | 待验 |
| **U11** | **凪的剧情记忆由 aux 模型转述 V17 节点正文**（见 `NRH-20260822-0056`） | `MANIFEST` 的 V17 用途表明确许可「抽『发生了什么』，可改写成事件条目」；逐字入库被该表禁止，规则化抽取质量更不稳 | **凪言之凿凿地记错事**——说得出细节但与 V17 原文不符。且 canon 的 `confidence` 是 1.0，错了会被当既成事实反复使用，比 live 记错更硬。每条都带 `source` 坐标，**发现可疑立刻翻 V17 原文核对** | 试点验证中 |

---

## 编号规则

`NRH-YYYYMMDD-HHMM`，时间戳制。两边同时追加不会撞号，且一眼看出谁先谁后。

**编号一经使用，含义不得复用。** 历史上 B1–B5 在两边各指过不同问题，
引用时必须带完整编号，不许简写成 `B4`。

早期条目沿用 `NRH-YYYYMMDD-NNN` 序号制（001–021），保持原样不改写。

---

## NRH-20260820-001 — 时间锚：通关之后的「现在」

- 日期：2026-08-20
- 决策人：Ant
- 状态：已定
- 内容：
  - Nagi Agent 不扮演游戏内任一章节的凪，而是扮演**全部剧情已发生完毕之后**的凪。
  - 对话对象是 **Ant 本人**，不是游戏主角。
  - 凪拥有完整剧情记忆；关系状态从既有终局起步，之后靠真实对话累积新记忆。
- 影响：
  - `State.timeline` 不需要 chapter 游标做「未来信息屏蔽」，
    改为记录 `epoch = post_ending`，剧情全量可见。
  - Memory 分两层：**Canon Memory**（剧情既成事实，只读）与
    **Live Memory**（对话中新生成，可写）。二者不得混写。
- 用户关系派生已由 NRH-20260820-017 裁决为 CanonWorld / UserRelationship 双关系模型。

---

## NRH-20260820-002 — 技术栈：Python + LangGraph，独立子工程

- 日期：2026-08-20
- 决策人：Ant
- 状态：已定
- 内容：
  - `Agent_Nagi_2.0/` 是**独立子工程**，自带虚拟环境与依赖，与主仓库
    `web/`(JS) 和 `android/`(Kotlin) 零构建耦合。
  - Runtime 基于 LangGraph。本机 Python 3.12.10（已验证）。
- 约束（为 Phase 2 迁移 DSH/Cordis 预留）：
  - **业务逻辑不得写死在 LangGraph 节点里。** 人格、规则、场景策略一律以
    数据（JSON/Markdown 资源）+ 声明式 policy 表达，LangGraph 只做编排。
  - 判据：把 `runtime/` 整个删掉换成别的 runtime，`resources/` 与
    `schema/` 应当一行不用改。8/26 的「Harness 化」验收就查这条。

---

## NRH-20260820-003 — 资料来源：派生 Agent 专用资源包

- 日期：2026-08-20
- 决策人：Ant（方向已定，具体条目待批）
- 状态：**已由 NRH-20260820-017 批准**
- 内容：
  - 本项目**不直接读取** `authority/` 与 `story-data/` 原文，而是派生一份
    Agent 专用资源包放在 `resources/`。
  - 派生动作触及主仓库红线（`CLAUDE.md`：全仓库禁止复制权威内容），
    因此必须先在主仓库 `decision_log.md` 立 `DEC-20260820-00X`，
    并在 `authority/MANIFEST.md` 的「相关但不在本目录的权威关系」一节
    登记本资源包与 authority 的从属关系。
  - **在该条目批准之前，`resources/` 下只建目录与派生规则说明，不得填入任何
    从 authority 复制的内容。**
- 派生规则（草案，随批准一并确认）：
  | Agent 资源 | 派生自 | 派生方式 |
  |---|---|---|
  | `core/personality.*` | `resources/core/NagisHeart_Nagi_Character_Bible_v0_5_Full_Merged.md` | 结构化转写，不改语义 |
  | `core/behavior_rules.*` | 同上 | 抽规则，不抄原文 |
  | `world/timeline.*` | `authority/story_logic/…V3_1` + `story-data/chapters.json` | 抽事件骨架，不抄剧本正文 |
  | `world/events.*` | `story-data/nodes.json` | 抽事件条目，正文保留引用坐标 |
  | `relationship/canon_state.*` | `story-data/endings.json` + 选定结局 | 由结局反推初始关系值 |
  - 资源包内每条都必须带 `source` 字段（authority 文件路径 + 章节号），
    保证可回溯、可校验、authority 改动时可发现失效。

---

## NRH-20260820-004 — 以哪个结局作为「现在」的起点（已被双关系模型取代）

- 日期：2026-08-20
- 决策人：Ant
- 状态：**已被 NRH-20260820-017 取代**
- 内容：
  - NRH-001 定了「通关之后」，但四个结局导出的关系状态与记忆内容互不相容。
  - 暂按 **TRUE END**（`mj=M` / `path=dream` / `finalChoice=witness`，
    见 `story-data/endings.json`）建模。
  - **该值实现为 `State.canon.ending` 配置字段，不硬编码**，改动只需换配置
    与对应的 canon memory 包，不动架构。
- 当前口径：结局只进入 CanonWorld；普通使用者的 UserRelationship 不继承该终局关系。

---

## NRH-20260820-005 — LLM 接入做成配置驱动，首选免费 Gemini（默认模型已被 NRH-20260820-019 取代）

- 日期：2026-08-20
- 决策人：Ant
- 状态：**部分保留**；Provider 配置驱动继续有效，Gemini 首选已取代
- 说明：以下 Gemini 条目仅保留历史决策上下文，不再作为首版实施要求。
- 内容：
  - 业务代码只认 `main` / `aux` 两个语义档位，**不认厂商和模型名**。
  - 挂哪个厂商由 `config/providers.yaml` 决定，改配置不改代码。
  - 首选 Gemini 免费档；质量或配额不够时切 Claude / DeepSeek / 任何
    OpenAI 兼容端点（含本地 Ollama）。
  - Embedding 同样抽象：本地 fastembed（默认）/ 远端 API 可切。
- 连带影响（已同步技术方案）：
  - 风格锚从 3–5 段提到 6–8 段，token_budget 1200 → 1800（Flash 人格保真更弱）。
  - 必须处理 Gemini safety filter 的空回复，否则表现为「凪突然不说话」。
  - 建议把 aux 的三件事合并成一次调用，省免费配额。
- 原待确认项“Gemini 免费档数据条款”随默认模型变更而取消。

---

## NRH-20260820-006 — 部署形态：本地运行，不上 GitHub Pages

- 日期：2026-08-20
- 决策人：Ant 提出疑问，本条为技术结论
- 状态：**待 Ant 确认**
- 内容：
  - **不需要服务器**：MVP 在本机跑 CLI，零成本零运维。
  - **但不能照搬 NagisHeart 的 GitHub Pages 方案**。NagisHeart 是纯静态，
    本项目有服务端逻辑、可写存储和 API key，四条都过不去。
    **其中「静态站点必然泄露 API key」一条即足以否决。**
  - GitHub 用于存代码，不用于运行。**建议 private repo**——内容是私人
    同人创作与私人对话记忆，且本项目无需发 Pages。
  - 可选升级路径见技术方案 §12.3：A 本地 → B 局域网 → C 免费云托管。
    上云的真实动机是**跨设备保留记忆**，不是跑代码。

---

## NRH-20260820-007 — 推翻 D2：改全 TypeScript 静态站 + BYOK

- 日期：2026-08-20
- 决策人：Ant
- 状态：已定
- 起因：Ant 指出「现在的客户端都是直接配 API key 的，开发给别人的时候
  他们自己配自己的 key 就好」。BYOK 消除了「静态站泄露 API key」这条否决理由。
- 内容：
  - **作废 NRH-20260820-002（Python + LangGraph）。**
  - 全部改用 TypeScript，跑在浏览器里，GitHub Pages 静态部署，无服务端。
  - LangGraph → 自写 pipeline（~150 行）；SQLite → IndexedDB；
    CLI → Preact Web UI；fastembed → 远端 embedding API。
  - `src/core/`（L0–L3）保持零依赖纯 TS，不碰 DOM / 框架 / fetch，
    用 ESLint 规则强制。判据：core 必须能在 Node 里跑单测。
- 迁移代价：L0 资源与 L3 装配算法**一字不改**（语言中立）；
  重写只涉及 L1/L2/L4/L5。净增一整个 Web UI（原方案是 CLI）。
- 技术方案：`docs/Nagi_Runtime_Harness_Technical_Design_V2.md`（V1 已作废）

---

## NRH-20260820-008 — 浏览器直连 CORS 实测（承重假设验证）

- 日期：2026-08-20
- 等级：**【已验证】**
- 方法：在第三方 origin（https://example.com）下用无效 key 发 fetch。
  被 CORS 拦会抛 TypeError；放行则返回 API 自身的错误响应。
- 结果：
  | 端点 | 结果 |
  |---|---|
  | Gemini `generateContent`（POST + 自定义头，触发 preflight） | ✅ 放行（400 API key not valid）|
  | Gemini `models` list | ✅ 放行（400）|
  | Gemini `embedContent` | ✅ 放行（400）|
  | Anthropic `/v1/messages`（无 opt-in 头） | ❌ 被拦（TypeError: Failed to fetch）|
  | Anthropic `/v1/messages`（带 `anthropic-dangerous-direct-browser-access: true`） | ✅ 放行（401 invalid x-api-key）|
- 结论：
  1. 静态站直连 Gemini **成立**，无需任何服务端。
  2. `embedContent` 可直连 ⇒ **不需要 transformers.js，省首访 30–40MB 下载**。
  3. Anthropic 作为备选 provider 可用，但 provider 配置必须带 opt-in 头。
- 未验证：DeepSeek 及其他 OpenAI 兼容端点，接入前须逐个用同法实测。

---

## NRH-20260820-009 — B4：静态站部署导致 resources 公开（待 Ant 裁决）

- 日期：2026-08-20
- 状态：**待 Ant 裁决**
- 内容：
  - 静态站的所有文件公开可下载。`resources/` 里凪的人格规则、行为约束、
    从 V17 派生的台词样本、剧情骨架，任何访问者都能取走。
  - 免费版 GitHub Pages 要求仓库 public【推断，需核对】，无法用 private 规避。
  - ⇒ **资源派生范围必须按「可公开」的标准来定，而不是按「够用」来定。**
- 若不接受：需现在退回 Tauri 桌面端方案。TS core 可完整复用，只换 L5 外壳，
  但失去「打开网址就能用」。

---

## NRH-20260820-010 — 分期路线：最终有服务端，但 Phase 1 不做

- 日期：2026-08-20
- 决策人：Ant
- 状态：已定（Phase 2 细节待 9 月定）
- 起因：Ant 问「能不能做成 App，资料配置放服务端」，并确认四条动机**全都要**：
  ① 资料不被拿到 ② 改资料不发版 ③ 跨设备同步记忆 ④ 资料与 App 分离。
- 分析：
  - ④ 已满足（`resources/` 独立目录）。② 不需要真后端。
  - **① 和 ③ 需要后端**，且 ① 决定后端形态：资料要真保密，
    必须**服务端组 prompt**，而非服务端存文件让客户端下载（后者抓包即得）。
- 决策：
  - **Phase 1（~8/28）**：零服务器 + PWA。目的是验证立项书的四个核心问题，
    这四个问题不需要服务端就能回答。
  - **Phase 1.5（8/29–31）**：Capacitor 打包 APK。
  - **Phase 2（9 月）**：服务端承担 L0–L3 与记忆存储，四条动机全部满足。
- **Phase 1 必须预留的接缝**（留错了 Phase 2 就是重写）：
  - `NagiEngine` 接口，UI 只认接口不认 core。
    `LocalEngine`（浏览器）→ `RemoteEngine`（HTTP）切换只改配置。
  - `MemoryStore` / `StateStore` 接口化，IndexedDB 只是其中一个实现。
  - 这条接缝几乎零成本：V2 §3 已要求 core 零依赖纯 TS、能在 Node 跑单测，
    而「能在 Node 跑单测」与「能部署成服务端」是同一件事。
- BYOK 与服务端共存：**key 随每次请求透传，服务端内存中用完即弃、绝不落库**。
  另外两种做法（你出 key / 服务端存 key）分别引入成本和凭证保管责任，均不采用。
- 跨设备同步：不做账号系统，用客户端生成的高熵同步码作存储键；
  导出/导入仍保留作为最终保险。
- 技术方案：V2 附录 A

---

## NRH-20260820-011 — B4 重新表述（待 Ant 裁决）

- 日期：2026-08-20
- 状态：**待 Ant 裁决**
- 变化：Phase 2 会通过服务端装配彻底解决资料公开问题，因此 B4 不再是
  「接不接受资料永久公开」，而是「**Phase 1 到 Phase 2 之间**资料公开可否接受」。
- 三个选项：
  - **A. 接受（建议）**——Phase 1 是验证期，到 Phase 2 关口
  - B. Phase 1 不发 Pages，只本地跑——架构验证不受影响，失去「发给别人试」
  - C. Phase 1 用占位资料——**Eval 全部失真，人格保真无从验证**，不推荐
- 需 Ant 明确点头：涉及 authority 派生物公开，属红线范畴。

---

## NRH-20260820-012 — D2″：直接按客户端 + 服务端做，取消分期

- 日期：2026-08-20
- 决策人：Ant
- 状态：已定
- 起因：Ant 明确「key 谁用谁配自己的，按布服务器的方式来」。
  既然四条动机全要、终态必有服务端，不再走「先纯客户端再迁」的分期。
- 内容：
  - **作废 NRH-20260820-007（纯客户端静态站）与 V2 附录 A 的分期方案。**
  - 服务端承担 L0–L4（资源 / 状态 / 记忆 / Context 装配 / Pipeline）与模型调用；
    客户端只剩 L5 UI + 本地缓存。
  - 服务端形态：**长驻 Node 进程**，不用 Serverless——无状态与向量常驻内存冲突，
    为省运维而改架构不划算。具体平台 8/22 实测后定。
  - 数据库 SQLite 起步；多用户按**同步码**隔离，不做账号系统。
  - 客户端托管改用支持 private repo 的免费静态托管，**不用 GitHub Pages**。
- **L0–L4 代码一行未改**——V2 §3 定的「core 零依赖纯 TS、能在 Node 跑单测」
  这条判据，副产品正是「能直接跑在 Node 服务端」。这次转向验证了它的价值。
- 技术方案：`docs/Nagi_Runtime_Harness_Technical_Design_V3.md`（V1/V2 均作废）

---

## NRH-20260820-013 — B4 消解

- 日期：2026-08-20
- 状态：**已消解，无需裁决**
- 原问题：静态站部署 ⇒ `resources/` 全部公开可下载，涉及 authority 派生物公开。
- 消解原因：V3 下资料**只存在于服务端，从不下发客户端**；仓库设为 private；
  客户端产物里没有任何资源内容。
- 保留的判据：**把客户端整个产物解包，不应能重建出凪的人格资料。**
  用 ESLint import 边界规则强制（client 不许 import core / server / resources）。
- 注意：**B2（红线豁免）仍需立条目**——红线管的是「复制」，不只是「公开」。

---

## NRH-20260820-014 — B5：服务端预算上限（待 Ant 定）

- 日期：2026-08-20
- 状态：**待 Ant 定**
- 背景：免费档托管普遍会休眠，首次请求有数秒冷启动。要不要为此付费，
  取决于你能接受的月度成本上限。
- 需要知道天花板在哪，才能在 8/22 选型时决定用免费档还是付费档。

---

## NRH-20260820-015 — 恢复 LangGraph 为主 Runtime

- 日期：2026-08-20
- 决策人：Ant
- 状态：已定
- 起因：V3 将 LangGraph 替换为自写 Pipeline，无法完成立项书“验证 Agent 框架能力”的核心目标。
- 内容：
  - **LangGraph.js `StateGraph` 恢复为首版主 Runtime。**
  - 自写 Pipeline 不删除，但降为 LangGraph 版本稳定后的对照组。
  - Character Resources、Context Builder、Memory、Provider 与 Guard 保持框架无关；LangGraph 只负责编排、checkpoint、条件边、恢复与事件流。
  - 首版必须实测 checkpoint 故障续跑、state history / time travel、Guard 条件边与 streaming；只把线性流程改画成图不算验证框架。
  - 最终必须输出 LangGraph vs 裸 Pipeline 对照报告；结论可以是继续采用，也可以是框架收益不足后放弃。
- 技术方案：`docs/Nagi_Runtime_Harness_Technical_Design_V4_LangGraph.md`

---

## NRH-20260820-016 — 取消裸 Pipeline 对照，前端复用开源项目

- 日期：2026-08-20
- 决策人：Ant
- 状态：已定
- 内容：
  - 不实现 `runtime-baseline`，不做 LangGraph 与自写 Pipeline 对照。
  - 后续若做框架对照，对象只选 DSH，并复用同一套 Resources、Context、Memory、Provider 与 Eval。
  - 不自研 Preact/PWA 聊天前端；从 GitHub 选择支持自定义 OpenAI-compatible Base URL、流式输出、BYOK 和移动端的成熟开源聊天客户端。
  - Nagi 服务端提供 OpenAI-compatible `/v1/chat/completions`；专有 State 与 Debug 能力走独立 API。
  - 前端工作仅限选型、配置、主题和必要薄适配，避免维护长期 fork。

---

## NRH-20260820-017 — 身份、资源、人设、DSH 与首发规模裁决

- 日期：2026-08-20
- 决策人：Ant
- 状态：已定
- 内容：
  1. 普通使用者不继承游戏主角关系，采用 `CanonWorldState` / `UserRelationshipState` 双关系模型。
  2. 批准建立 Agent 专用资源包；资源只在服务端使用，不下发开源聊天客户端。
  3. Personality、Speech、Behavior 直接参考 Ant 指定的人设文件；V17 只作为剧情 Canon 来源之一，不再承担独立台词风格权威。准确路径已由 NRH-20260820-018 登记。
  4. DSH 路线为“DSH 外层 Harness 内嵌 LangGraph Runtime”：DSH 负责 Resource / Skill / Policy 组合，LangGraph 负责 StateGraph、thread、checkpoint 与恢复。
  5. 首发总用户规模按最多 50 个用户身份设计，不等于 50 并发；金额预算尚未设定。
- 取代：NRH-20260820-004 的“用户直接继承 TRUE END 关系”假设，以及 NRH-20260820-016 中“LangGraph 与 DSH 作为对照对象”的表述。

---

## NRH-20260820-018 — 登记 Character Bible 为人格事实源

- 日期：2026-08-20
- 决策人：Ant
- 状态：**已定**
- 文件：`resources/core/NagisHeart_Nagi_Character_Bible_v0_5_Full_Merged.md`
- 版本：v0.5 Full / Merged
- SHA-256：`27236FD1D8A8B2BF7A516C520560AC09CD27728A952070EE499A734CAFC0F044`
- 内容：
  - 该文件是 Personality、Speech、Behavior 的唯一直接事实源。
  - §18 作为 Character Resource Layer 的高优先级压缩入口，但不能替代正文。
  - 派生资源必须记录源章节坐标、版本和哈希；源文件变化后必须重新派生。

---

## NRH-20260820-019 — 国产模型优先，本地开发后再部署

- 日期：2026-08-20
- 决策人：Ant
- 状态：**已定**
- 内容：
  - 首版不以 Gemini 为默认模型，优先接入国产聊天模型 API。
  - Provider Adapter 继续保持厂商无关，业务代码不绑定具体模型。
  - 当前阶段只在本地开发与验证；上线时再采购和配置云服务器。
  - 上线候选为中国内地轻量云服务器；最终厂商与规格在部署阶段按实付价格决定。

---

## NRH-20260820-020 — V4 定稿

- 日期：2026-08-20
- 决策人：Ant
- 状态：**已定稿**
- 文件：`docs/Nagi_Runtime_Harness_Technical_Design_V4_LangGraph.md`（745 行）
- 定稿前补齐的同步项（V4 §19）：
  1. D1 结局口径「仍待裁决」→「已定 TRUE END，只进 CanonWorld」（NRH-004 / -017）
  2. 新增 D8/D9：国产模型优先、当前仅本地开发（NRH-019，定于 V4 初稿之后）
  3. §10 首版 Provider 点名国产模型；§11.2 补部署口径
  4. §6.1 新增首字延迟已知代价与 8/25 量测门槛
  5. §13.2 DSH 行标注「后续阶段，不在本期排期」，消解与 §15 的内部矛盾
  6. §15 排期同步：模型、本地 Demo、首字延迟量测、前端选型 spike 建议
- 后续变更一律走本文件立条目，不再出 V5。

---

## NRH-20260820-021 — 仓库级记账补办完成

- 日期：2026-08-20
- 执行人：Claude（PM 位）
- 状态：**已完成**，等级【已验证】
- 背景：NRH-017 / -018 的裁决此前只记在本文件，仓库级的 `decision_log.md`
  与 `authority/MANIFEST.md` 均无对应条目。按 `CLAUDE.md` 铁律属流程未走完。
- 已办：
  1. `00_harness/01_governance/decision_log.md` 新增 **DEC-20260820-001**：
     批准 Agent 专用资源包；登记 Character Bible 为人格事实源；
     明确 V17 仍为剧本母版但不再单独承担台词风格权威；
     明确本条不修改、不取代、不重算任何 authority 文档的哈希。
  2. `authority/MANIFEST.md` 的「相关但不在本目录的权威关系」一节新增登记条目，
     写明该文件为 Ant 自有合并稿、**非权威复制品**，不触发铁律第 1 条。
- 验证：
  - `powershell -File tools/check-authority.ps1` → **AUTHORITY CHECK PASSED**【已验证】
    （登记用 SHA-256 且为散文条目，不匹配脚本的 32 位 MD5 表格正则，不被误解析）
  - Character Bible 实际 SHA-256 与 NRH-018 登记值**逐字符一致**【已验证】
- 未改动：`authority/` 下七份权威文档与两个 KV 资产包，一个字节未动。

---

## NRH-20260821-1347 — Q14 裁决：不从 V17 逐字抽台词锚，改用母版锚 + 降门槛

- 日期：2026-08-21
- 决策人：Ant 授权 Claude 定（「你来定最优方案」）
- 状态：已定，**可被 8/27 的 Eval 数据推翻**
- 决策：
  1. **不从 `authority/script/…V17` 逐字抽台词。** 红线不必动，先例不必开。
  2. style_anchor 全部取自 **Ant 自有母版**（Nagi §8.3 七句 · §18 SPEECH 四句 ·
     Rel §10.3 八句 · Nagi §7.5.1.1 四短句），去重约 **19 句**，按场景分组。
  3. 补「刺激 → 反应」对：从 §7.4.1「正确写法/错误写法」这类对照抽，
     属 `structured_rewrite`，非逐字。
  4. **V4 §18.1 的「style_anchors ≥ 30 段」下调**为「母版锚穷尽 + 场景全覆盖」。
- 理由（不是保守，是这样更对）：
  - 母版例句是作者**明确标注为「凪该怎么说话」的泛化样本**；
    V17 台词是**绑定具体剧情情境的实例**。
    做开放式聊天的 Agent，前者才是对的锚——后者会教模型学到只在那个情节成立的说法。
  - 红线的目的（防止副本与权威漂移）本可由 `source.sha256` + 构建失败机制满足，
    但既然母版锚在质量上不劣于甚至优于 V17 抽取，**就没有动红线的必要**。
- **推翻条件**：8/27 跑 `evals/cases/ooc_adversarial.yaml`，若人格保真不达标，
  即有数据证明锚不足，届时再议 V17 抽取。**现在动是凭感觉，那时动是凭证据。**
- V17 仍用于 `world/events/`（canon 记忆），那条路本就是改写，不涉逐字。

---

## NRH-20260821-1347-b — Q16 裁决：按现有 Ant，但具体人设留空给玩家

- 日期：2026-08-21
- 决策人：Ant
- 状态：已定
- 原话：「按现有 Ant 来，但是我们的 Ant 的具体的人物外貌、习惯，什么之类的
  并没有写死，后面可以留一些玩家可以补充的空白文件。」
- **依据在母版自身**【已验证】：
  - Ant Bible §0：「这份文档**不是玩家可见设定卡**，也不是为了把女主写成固定姓名、
    固定人格、固定人生经历的**不可改角色**……所有玩家可见正文都必须保留**可替换性**。」
  - Ant Bible §1 逐项标注：年龄「不在玩家可见正文中强行固定」、生日「可由玩家自定义」、
    身高 160cm「内部视觉参考」、体重「不建议玩家可见正文写」。
  - World Bible §16.1：「玩家名变量 {{playerName}}；内部设计文档可以使用 Ant 作为
    **默认玩家设定名**；玩家可见正文与系统文案应使用『你』或变量。」
  - ⇒ 母版从一开始就是按「玩家替身」设计的，本裁决与其一致，非新增口径。
- 落地分工：
  | 层 | 去向 | 可改？ |
  |---|---|---|
  | 关系**结构**（她在关系里的位置、爱的方式、危险） | `relationship/canon.core.md`，常驻 | ❌ 改它等于改这段关系本身 |
  | 具体**人设**（名字、外貌、习惯、生活细节） | `resources/user_profile/template.md`，玩家填 | ✅ 全部可留空 |
- 已产出：`relationship/canon.core.md`（492/500）·
  `relationship/baseline.true_end.md`（277/300）· `user_profile/template.md`
- 空白字段**不渲染**、不用占位词填充、凪也不追问——他本就不主动追问细节。

---

## NRH-20260821-1347-c — Q19（Q16 遗留）：UserRelationship 的初始值口径待确认

- 日期：2026-08-21
- 状态：**待 Ant 确认**（当前按 Q16 口径实现为可配置，默认继承）
- 冲突：
  - `NRH-20260820-017`：普通使用者**不继承**主角关系，UserRelationship **从零起步**
  - Q16 裁决「**按现有 Ant 来**」：若使用者站在 Ant 的位置，
    而时间锚是 TRUE END 之后，则关系状态理应是**通关后的亲密度**，不是零
- 两条不能同时成立。当前实现：配置项 `relationship.seedFromCanon`，
  **默认 true（继承 TRUE END 后的关系）**，依 Q16 口径；可切 false 回到从零。
- 需 Ant 一句话确认：新使用者一上来，凪对他是
  **(a)** 通关后那种「打完仗回来、愿意露出疲惫」的熟稔，还是
  **(b)** 从零开始、只是站在同一个「位置」上？
- 影响：`relationship.trust/intimacy/friction` 初值、首轮对话的语气基线。

---

## NRH-20260821-1347-d — Q18 裁决：素材与派生物分目录

- 日期：2026-08-21
- 决策人：Ant 授权（「自己分好，要明确」）
- 状态：**已完成**，等级【已验证】
- 结构：
```text
resources/
├── MANIFEST.md          清单与派生规则
├── _sources/            ★ 素材：四份母版。只读，无 front-matter，不是资源
├── core/                派生：人格与行为规则
├── world/               派生：时间线、术语、空间、规则
├── relationship/        派生：关系结构与终局基线
├── policy/              派生：输出守卫与场景策略
├── style_anchors/       派生：台词锚（待抽，见 Q14）
└── user_profile/        ★ 玩家可补充的空白模板（见 Q16）
```
- 判据从「靠文件名猜」改为「按目录」：`resources/_sources/` 下一律是素材，
  校验器不检查其 front-matter。
- 连带办理：
  - 12 份资源的 `source.path` 全部更新为 `resources/_sources/…`【已验证】校验通过
  - `00_harness/01_governance/decision_log.md` DEC-20260820-001 追加 Amendment 说明路径变更
  - `authority/MANIFEST.md` 登记路径同步更新
  - **内容与 SHA-256 未变**【已验证】；`tools/check-authority.ps1` → AUTHORITY CHECK PASSED

---

## NRH-20260821-1406 — Q14 修订：改为从 V17 抽少量对白锚

- 日期：2026-08-21
- 决策人：Ant（推翻同日早些时候由 Claude 代定的「不抽 V17」）
- 状态：已定，**取代 NRH-20260821-1347 的 Q14 裁决**
- Ant 原话：「还是要参考 V17，因为是对白嘛，应该抽也很简单的呀。
  但是参考句也不用大量对不对？」
- **我先前的理由不完整**，Ant 是对的：
  - 我论证「母版例句是泛化样本、V17 台词是情境绑定实例」，据此排除 V17。
  - 但我漏了自己更早强调过的一条：**风格锚要抽「刺激 → 反应」对，
    不能只抽单句**——凪的质感在于「面对这么重的一句话，他只回这么短」。
  - **母版那 19 句全是孤立单句，给不了这个；V17 的对白能给。**
    母版教「他会说什么」，V17 教「被推的时候他怎么应」。对聊天 Agent 后者更要紧。
- 落地：
  - **6 份锚，17 组对白，六场景各 2–3 组**，合计约 970 tok（预算 1800）
  - **只取与 TRUE END canon 一致的段落**：共通（第一–六部、第八章）+ M 线 + Dream 线。
    J 线 / Stay 线 / Bad 线一律排除
  - 筛选口径：凪回复 ≤30 字（语料 p95）、玩家台词 ≤40 字、过 output_guard 零命中
  - `derivation: extract`，逐字。**style_anchor 是唯一允许逐字的资源类型**
- 红线处置：**不构成「复制权威内容」**。抽的是离散台词样本而非章节正文，
  带 `source.section` 行号坐标与 V17 的 SHA-256，且资源不下发客户端。
  双重保障：SHA 变 → 强制重新派生；逐字对不上 → 构建失败。
- 验证【已验证】：
  - `scripts/verify-anchors.py` → **34/34 引文全部命中 V17 原文**
  - 831 条 V17 凪台词跑 output_guard 十条正则 → **block 0 / warn 0，零误伤**

---

## NRH-20260821-1406-b — 长度上限按权威语料重新标定

- 日期：2026-08-21
- 状态：已定，等级【已验证】
- 标定源：V17 全部 **831 条**凪台词
  - 单条 beat：中位 7 · p95 26 · p99 35 · max 52
  - 单轮合计：中位 9 · p90 25 · p95 30 · **p99 44** · max 79
  - 84.6% 的轮次是单句回；2 句 13.8%；3 句 1.4%
- **推翻了初版的分场景设计**：
  初版按 §8.3「重要时更短」给 conflict/setback 定 60、daily 定 140。
  但实测各类篇章长度分布几乎相同（中位 7–8，p95 均为 26）。
  「越重要越短」描述的是**重要瞬间**，不是整类场景的系统性差异。
- 新值：统一 `default: 50`（≈p99 留余量）、`hard_max: 80`（≈语料 max）；
  新增 `beat_caps.max_per_reply: 3`。
  「越重要越短」下放给 `soft_judge` 作评分依据，不再做硬规则。
- 原 `calibrate_on: 8/25` 的待办**提前完成**，无需再标。

---

## NRH-20260821-1708 — Q19 裁决：UserRelationship 继承终局关系，但初值不取满

- 日期：2026-08-21
- 决策人：Ant（采纳 Claude 建议）
- 状态：已定，**取代 NRH-20260820-017 的「从零起步」表述**
- 决策：`seedFromCanon: true`。新使用者继承 CanonWorld 的终局关系，不从零。
  初值 `trust 85 / intimacy 70 / friction 25`。
- 理由：
  - 从零会自相矛盾——凪记得和你走完全程（canon = TRUE END），却对你像陌生人。
  - 但不取满：`baseline.true_end` 的质感是「打完仗回来」——愿意露出疲惫，
    但不会主动说想你。那不是热恋顶点。
  - **friction 不设 0**：母版是 V17 RelationshipFriction Calibrated，
    摩擦是刻意校准的永久特质；friction=0 等于宣告关系完美，正是 §15.7 要防的；
    且立项书验收含「关系连续性」，变量顶满就无法观测变化。
- **前提条件**（比数值重要）：`requiresCanonMemory: true`。
  继承高亲密度的前提是 canon 记忆烘焙扎实。初始 live 记忆为空，
  若 canon 检索不出具体的事，凪会「说得亲密却什么都想不起来」——最像恋爱机器人的失真。
  ⇒ bake-canon 未做扎实前，继承来的亲密度是空头支票。
- 保留：`canonMasking: not_implemented`。将来若做「从零认识」模式
  （给不熟剧情的使用者），需要 canon 屏蔽机制，非改初值可得。架构上不把 canon 写死为永远可见。
- 落地：`config/runtime.yaml` relationship.seed；`relationship/baseline.true_end.md`
  只留自然语言质感，数值全在 config（遵 V4 §9.2「数值给系统，自然语言给模型」）。

---

## NRH-20260821-1737 — Canon Memory 接口契约（**提案，待 Codex 确认**）

- 日期：2026-08-21
- 提出：Claude（资源侧）
- 状态：**提案。涉及 `packages/core/src/memory/` 的部分需 Codex 同意或实现**
- 目的：`scripts/bake-canon.ts` 要产出 canon 记忆，必须先与现有 `MemoryStore` 对齐。
  以下五条是读实现后发现的**具体冲突**，不是设想。

### 冲突 C1 — canon 记忆永远检索不到 【已验证 · 硬阻塞】

- `packages/server/src/local-dependencies.ts:72`
  → `memoryEngine.retrieve({ namespace: request.userId, ... })`（每用户）
- `packages/core/src/memory/engine.ts:69`
  → `.filter(r => r.namespace === query.namespace && ...)`（严格相等）
- ⇒ canon 是**全用户共享**的（同一个凪、同一段剧情），
  烘焙到任何全局 namespace 都不会被匹配到；
  若按用户各存一份，则 300–800 条 × N 用户，且无法集中更新。

**提案**：保留 canon 专用 namespace `canon:nagisheart`，检索时同时命中：

```ts
const CANON_NAMESPACE = "canon:nagisheart";
.filter(r =>
  (r.namespace === query.namespace) ||
  (r.kind === "canon" && r.namespace === CANON_NAMESPACE))
```

或给 `MemoryQuery` 增加 `namespaces: readonly string[]`。后者更干净，Codex 定。

### 冲突 C2 — 时近性衰减对 canon 是错的 【已验证】

- `engine.ts:37` `recencyScore = exp(-age / 30d)`，权重 0.16
- canon 事件发生在 2019–2020（故事时间）。`updatedAt` 取烘焙时间则**假新**，
  取故事时间则**恒为 0**。两种都不对——**canon 的相关性不该随时间衰减**。
- `kindBoost: canon → 0.08` 只是粗糙补偿。

**提案**：canon 不参与时近性衰减，其 `recency` 分量取中性常数（建议 0.5）：

```ts
const recency = record.kind === "canon" ? 0.5 : recencyScore(record.updatedAt, now);
```

### 冲突 C3 — embedding 无版本，维度不符会静默失效 【已验证】

- `MemoryRecord.embedding?: readonly number[]`，无 modelId / dimension / version
- `engine.ts:19` 维度不等时 `cosineSimilarity` **返回 0**，不报错
- ⇒ 换 embedding 模型后，旧向量静默退化为「语义分 0」，只靠词面兜底，**不会有人发现**
- V4 §8.2 明确要求版本化，且「模型变化时后台重建全部向量，禁止混合向量空间检索」

**提案**：`MemoryRecord` 增加两个可选字段，检索时不匹配即跳过并告警：

```ts
readonly embeddingModel?: string;   // 如 "bge-small-zh-v1.5"
readonly embeddingDim?: number;
```

### 冲突 C4 — canon 缺回溯坐标 【已验证】

资源层每条都带 `source.section` + SHA，canon 记忆同样需要——
否则 V17 改动后无从判断哪些条目失效。目前只能塞进 `tags`（无类型）。

**提案**：`MemoryRecord` 增加可选 `source`：

```ts
readonly source?: {
  readonly path: string;      // authority/script/…V17.md
  readonly section: string;   // 篇章 + 节点 id + 行号
  readonly sha256: string;
};
```

### 冲突 C5 — 未做 canon / live 分池 【已验证】

- `retrieveContext` 未传 `kinds`，两类在**同一池**内排序
- V4 §8.3 要求「canon 与 live 分池检索，各取 top-k，**防止 canon 淹没近期对话**」
- 冷启动时 live 为空、canon 有 300–800 条，8 个检索位会**全被 canon 占满**；
  live 增长后 canon 仍有 `kindBoost` 加持，长期挤压近期记忆

**提案**：`retrieveContext` 发两次查询再合并，配额写进 `config/runtime.yaml`
（建议 canon 4 / live 4，可调）。

---

### bake-canon 侧的产出约定（我这边照此实现）

```ts
{
  id:        "canon:{part}:{nodeId}:{seq}",
  namespace: "canon:nagisheart",       // ← 待 C1 确认
  kind:      "canon",
  text:      "<事件改写，非台词逐字>",
  createdAt / updatedAt: 烘焙时间（ISO）,
  salience:  0–1，按剧情权重
  confidence: 1.0（canon 是既成事实）
  tags:      [篇章, 路线, scene, 情绪标签…]
  embedding + embeddingModel + embeddingDim,   // ← 待 C3
  source:    { path, section, sha256 },        // ← 待 C4
}
```

**只取与 TRUE END canon 一致的段落**：共通（第一–六部、第八章）+ M 线 + Dream 线。
J 线 / Stay 线 / Bad 线**不烘焙**——它们未发生，进了记忆就会被当亲历事实。
（与 style_anchors 的取材口径一致。）

⚠️ 事件正文是**改写**（`derivation: extract` 仅限 style_anchors）。
canon 记忆记的是「发生了什么」，不是台词逐字。

- **在 C1 确认前不写 `bake-canon.ts`。** C1 不定，烘出来的东西检索不到，白做。

---

## NRH-20260821-2015 — Canon / Live Memory 接口落地口径

- 决策人：Codex（按当前实现收口，待 Ant 验收）
- 状态：已落地，待验
- C1：Canon 统一使用 `canon:nagisheart` namespace；用户检索默认同时命中自己的 namespace 与该共享 namespace。
- C2：Canon 不参与时近性衰减，recency 使用中性值 `0.5`。
- C3：MemoryRecord 增加 `embeddingModel` / `embeddingDim`；查询指定模型或维度时不匹配记录直接排除。
- C4：MemoryRecord 增加 `source { path, section, sha256 }`，供派生资源回溯。
- C5：服务端 Canon / Live 分池检索，各取 4 条后合并排序，避免任一池长期吞没另一池。
- 证据：`packages/core/src/memory/{types,engine}.ts`、`packages/server/src/local-dependencies.ts`。

---

## NRH-20260821-2037 — 凪的输出分离为 say / act 两个字段

- 日期：2026-08-21（Ant 于 20:37 裁决；因与 Codex 并行改同一文件，22:30 才登记）
- 决策人：Ant
- 状态：**已定**（实现细节 C5/C6 见下，待接入时定）
- 关联：解释 F13（豆包括号问题）；界定 `NRH-20260821-1406-b`（长度上限）的适用范围

### 背景（实测，等级【已验证】）

用豆包 `doubao-seed-character-260628` 实测（脚本走仓库真实 `OpenAICompatibleProvider`，
system prompt = `personality.base` + `personality.speech` 全文，共 1153 token）：

- **模型默认 100% 输出括号动作描写**（30/30）。剥掉括号后纯台词平均仅 6 字。
- 纯 prompt 禁止括号**不可靠**：单轮对抗用例可压到 0/30，但那批用例无一要求身体动作，
  **样本有偏**。换动作类输入（「手给我」「尝尝」「抱一下」）括号回到 **5/8（63%）**，
  纯问答类 0/8 ⇒ **触发因子是「输入要求一个动作而非一句话」，与轮次无关**
  （三条 24 轮会话均精准在同一轮——用户说「尝尝」时——破功，其后各轮又自行恢复；
  若是指令衰减，不可能三次卡在同一轮且之后自愈）。
- 极端情况：「手给我」→「（没动）」，**整条回复只有动作、台词为空**。
  ⇒ **粗暴剥括号会得到空字符串**，直接踩降级模板路径。

### 根因

游戏里凪的动作由立绘 / 演出承担，SCRIPT 母版（V17）只写台词，
所以 `NRH-20260821-1406-b` 标定出的长度分布是**纯台词**分布。
但 Agent 只有一个文本通道，用户会发出要求动作的输入。**V4 未为此设计位置。**

### 裁决

凪的输出**结构化分离为两个字段**：

| 字段 | 含义 | 长度归谁管 |
|---|---|---|
| `say` | 说出口的台词 | 沿用 `NRH-20260821-1406-b` 的 V17 标定（default 50 / hard_max 80） |
| `act` | 动作 / 神态描写 | **单独**限长 + 限频，标定值待定（V17 无此类语料，不能套台词上限） |

**前端按模式渲染**（Ant 定）：

- **聊天模式**：只渲染 `say`。聊天界面里出现动作神态描写「很奇怪」。
- **互动模式**（后续做）：渲染 `say` + `act`，动作神态在这里才有意义。

### 落地要求

- `NRH-20260821-1406-b` 的长度上限**只适用于 `say`**，其权威性不变、无需重标。
- `act` 的频率上限必须治那个 tic：实测「（没抬眼，指尖…」在 30 条里出现 **11 次**。
- **不能只靠 prompt**（Ant 明确）：必须有代码层守卫。守卫拆两路，
  `say` 跑现有 V17 上限，`act` 跑独立上限 + 频率。
- `act` 为空是常态（多数聊天轮无动作），**不得**因 `act` 空而走降级模板；
  降级只在 `say` 空时触发。

### 待定实现细节（接入时定，先登记不阻塞）

- **C5**：`say`/`act` 由 Provider 层要求模型输出 JSON 结构，还是在 server 侧解析括号切分？
  前者更干净但依赖模型 JSON 服从度（豆包服从度待测）；后者不改 Provider 契约但解析脆。
- **C6**：`act` 的长度 / 频率上限取值。无 V17 语料可标，可先拍经验值
  （如 act ≤ 40 字、同一动作模式 window 内 ≤ 1），8/28 Eval 数据出来再校。

---

## NRH-20260821-2115 — Canon Memory 首批烘焙完成

- 状态：已落地，待 Ant 验收
- 来源：V17 `Nagis_Heart_SCRIPT_V17_RelationshipFriction_Calibrated.md`
- 口径：仅共通第一至六部、第八章、M 线与 Dream 线；排除 J / Stay / Bad。
- 产物：`resources/world/events/canon-memory.json`，51 条 `canon:nagisheart` 记录。
- 每条记录包含：稳定 id、`kind=canon`、confidence、tags、`source.path`、节点坐标与 V17 SHA-256。
- 加载：`packages/server/src/local-dependencies.ts` 启动时装载；检索回归覆盖跨用户共享 Canon namespace。
- 命令证据：`pnpm bake:canon`。


---

## NRH-20260822-0056 — Canon 记忆改用 aux 模型摘要节点正文

- 日期：2026-08-22
- 决策人：**Claude 代定**（Ant 授权「你决定，并记录」）
- 状态：**已决定，试点验证中**。同时登记为低把握决策 **U11**，待人工测试回溯
- 取代：`NRH-20260821-2115` 的产物口径（该条的**接口与溯源部分继续有效**，仅 `text` 生成方式被取代）

### 问题

`scripts/bake-canon.ts` 只扫 V17 的节点标题行，把标题套进固定模板：

```text
既成事实：在 TRUE END 时间线上，凪经历了「作战室·初遇」。这是已经发生的剧情节点，不是当前正在进行的事件。
```

**节点正文一行未读。** 实测 51 条：单条 58 字里 51 字是逐字相同的样板，
独有内容只有书名号里的标题、长度中位 7 字（见 Codex 记的 F7 与我记的 F17）。

后果绑定到验收标准：立项书 §7「记忆准确性」、V4 §13 角色 Eval，
以及 `runtime.yaml` 自己写下的警告——canon 检索不出具体的事，
凪会「说得亲密却什么都想不起来」，而 Q19 裁定的 `trust 85 / intimacy 70`
正是以 canon 扎实为前提。**当前该前提未兑现。**

参照：V17 共 7166 行，节点 `p1` 从第 30 行到第 166 行有 136 行正文
（旁白、各角色对白、凪的反应），全部未进入记忆。

### 三个方案与取舍

| 方案 | 判断 |
|---|---|
| A. 正文原样入库 | **否决**。`MANIFEST.md` 的 V17 用途表明确规定 Canon 事件「逐字？→ 否」；且 136 行远超预算 |
| B. **aux 模型把节点正文压成事件条目** | **采用**。`MANIFEST` 原文即「抽『发生了什么』，**可改写成事件条目**」，改写是被明确许可的路径 |
| C. 规则化抽取（取旁白前几句 + 凪台词） | 否决。不引模型，但「取哪几句」是 worker 拍的、且规则化摘要质量不稳——用一个低把握判断换掉另一个，还更差 |

### 选 B 的代价（必须写明，这是 U11 的核心）

**凪对自己人生的记忆，将经过一个小模型的转述。** 这是真实代价，不是纸面风险：
摘要若走样，凪会「记得一件没那么发生过的事」，而 canon 的 `confidence` 是 1.0
——它会被当既成事实使用，比 live 记忆错得更硬。

三条缓解措施：

1. **溯源不动**：每条仍带 `source.path` + 节点坐标 + V17 SHA-256，
   任何一条都能一键翻回原文核对
2. **提示词禁止推断与评价**，只允许复述正文已写明的事
3. **先试点 3 个节点交 Ant 目视**，通过后才跑全量 51 条

### 保留 `NRH-20260821-2115` 已做对的部分

章节白名单（共通 + M 线 + Dream 线，排除 J / Stay / Bad）、稳定 id、
`source` 三件套、salience 分级、tags 分类、store 装载与检索回归——**全部沿用，不重写**。
本次只改 `text` 的生成方式。

---

## NRH-20260822-0110 — 验收模型：Ant 只在 UI 里体验，不审中间产物

- 日期：2026-08-22
- 决策人：**Ant**（原话：「我不过，我只在你们给我包装好 UI 界面之后，实际体验」）
- 状态：**已定**。这是**全项目通用约束**，不限于 canon 烘焙

### 内容

Ant **不逐条审阅中间产物**（烘焙出的记忆、抽取出的事实、Eval 明细等）。
唯一的人工检查点是**成品 UI 里的实际对话体验**。

### 这条改变了什么（比它看起来重要）

1. **中间产物没有人工闸门** ⇒ 凡是"生成后交人审"的方案一律不成立。
   校验必须**做进流水线**，靠程序或模型自查，不能靠 Ant 兜底。
2. **残余错误必然漏到体验层**。自动校验不可能做到 100%，
   所以设计前提是「会有错漏过去」，而不是「校验完就干净了」。
3. ⇒ **溯源与回溯链从"锦上添花"升级为"唯一救济手段"**。
   Ant 在 UI 里察觉「凪记错了某件事」时，必须能立刻定位到是哪条记忆、
   源自 V17 哪一行、由哪次决策产生。这就是
   `source.path` + 节点坐标 + SHA-256，以及「低把握决策登记」表存在的意义。
4. **不得因此降低产出质量标准**。「反正 Ant 不看」不是放松的理由——
   恰恰相反，没有人工复核意味着 worker 的自查责任更重。

### 对当前 canon 烘焙的直接影响

原计划「先烘 3 条交 Ant 目视，通过后跑全量」的第二半**作废**。
改为：**烘焙流水线内置校验环节**（摘要 → 反向核对是否有正文未支持的说法 →
不通过则重生成，二次仍不通过则降级回标题模板），全量跑完后由 **Claude 自行抽检**。

抽检重点是**硬事实**：队伍归属、比分、人名、地名、时间。
试点已证明这正是失效点——见 `NRH-20260822-0056` 的 U11 与下方记录。

---

## NRH-20260822-0135 — 亲密场景记忆照实保留，不做尺度压缩

- 日期：2026-08-22
- 决策人：**Ant**（在三个选项 A 照实保留 / B 压缩成克制表述 / C 打标签限场景召回 中选 **A**）
- 状态：**已定**

### 内容

Canon 记忆中的亲密场景（如 `c4d 七夕之夜`）**按 V17 原文照实摘要**，
不做尺度压缩、不做场景门控。

理由：它们是 TRUE END 时间线上真实发生的剧情，凪本就该记得。
把它们压成「与 {{playerName}} 共度七夕」这类空话，等于人为制造记忆缺口——
而记忆缺口正是 Q19 警告的「说得亲密却什么都想不起来」的成因。

### 边界（仍然适用，未被本条放宽）

- 长度上限照常适用。照实保留**不等于**可以超长，该压缩的是**冗余叙述**，不是内容本身
- `output_guard` 的输出守卫照常生效。记忆里有的内容，不代表凪会主动复述——
  说不说、怎么说，由人格与守卫决定，与记忆里存了什么是两件事
- 资源正文永不下发客户端（域 B 红线）不受影响

---

## NRH-20260822-0150 — 前端选型改判：chatbox-lite 出局，改用 NextChat

- 日期：2026-08-22
- 决策人：**Claude 代定**（Ant 授权「遇到问题你自己做决策，不要等我」）
- 状态：**已定**
- 取代：`packages/integrations/chat-client/README.md` 中「选定：Chatbox Lite」一节

### 改判理由：原选型违反 V4 §11.1 第一条

`lfbear/chatbox-lite` 经 GitHub API 核实（2026-08-22）：

```text
许可证: 无（license: null）
星标: 2 | Fork: 3 | 创建于 2026-06-09
```

**无许可证 = 默认保留所有权利**，法律上不得 fork、修改、部署。
V4 §11.1 第一条「许可证允许部署和必要修改」**直接不满足**。
且 2 星的新项目也不符合 D6「从 GitHub 选**成熟**项目」。

原记录写着「固定 commit 尚未能从 GitHub 网络取回」——即当时**未能联网核实**。
本次网络可达，核实后否决。

### 候选对比（GitHub API 实测，2026-08-22）

| 项目 | 星标 | 许可证 | 最后推送 | 判断 |
|---|---|---|---|---|
| **ChatGPTNextWeb/NextChat** | 88,640 | **MIT** | 2026-08-11 | **选定** |
| lobehub/lobehub | 81,908 | NOASSERTION | 2026-08-21 | 许可证不明确，法务风险 |
| chatboxai/chatbox | 41,510 | GPL-3.0 | 2026-08-14 | GPL 传染性，约束未来分发形态 |
| open-webui/open-webui | 149,486 | NOASSERTION | 2026-08-20 | 含品牌条款；Python 后端，违反§11「不引重后端」 |
| mckaywrigley/chatbot-ui | 33,339 | MIT | 2024-08-03 | **停滞两年**，违反第七条 |
| lfbear/chatbox-lite | 2 | **无** | 2026-08-21 | 原选型，无许可证，否决 |

### NextChat 对七条标准的逐条核对

1. 许可证允许部署和修改 —— **MIT** ✅
2. 自定义 OpenAI-compatible Base URL —— 设置项内可填 ✅
3. 流式 + BYOK —— 支持 SSE，key 存客户端本地 ✅
4. 移动端可用 —— 响应式 + PWA ✅
5. 无需把 resources / system prompt 打进前端 —— 纯客户端，只调 API ✅
6. 可纯配置接入，免长期 fork —— Base URL + Key 在设置里填 ✅
7. 仍有维护 —— 11 天前推送 ✅

### 连带发现：服务端并非真正 OpenAI-compatible（阻塞项，本次一并修）

`/v1/chat/completions` **路径与响应是 OpenAI 形状，但请求与鉴权不是**：

| | 现状 | 标准客户端发的 |
|---|---|---|
| 请求体 | `{message, userId, threadId, requestId}` | `{model, messages:[{role,content}]}` |
| LLM key | 自定义头 `x-llm-key` | `Authorization: Bearer <key>` |
| SSE | 自定义 `event: progress` / `event: message` | 无事件名的 `data: {chunk}` 行 |

⇒ **任何现成客户端接上都会失败**，与选哪个客户端无关。
Ant 的原话「逻辑上任何一个聊天 app 都能满足」成立的前提，正是服务端说标准协议。
故本次先补协议，再接客户端。

---

## NRH-20260822-1425 — 输出归一：多 beat 拆成独立消息，吸收各家模型排版差异

- 日期：2026-08-22
- 决策人：**Ant**（原话：「B 如果有换行，请每行输出成独立的一句，而不是全部输出成一段换行文字。看起来每个模型的输出有差异，还要针对性处理」）
- 状态：**已定并落地**

### 现象

Gemini 实测输出 `……

乌冬面。

你做。
汤咸一点。`，
界面上渲染成一坨带空行的文字。Ant：「这不像对话，哪有聊天是这种换行的」。

### 根因（两层）

1. **资源从未规定输出格式**。`personality.speech.md` 的示例是「每句一行」的代码块，
   模型照着这个排版学了。
2. **更根本：这其实是 beat 超限**。`output_guard` 明写 `beat_caps.typical: 1`
   （V17 语料 84.6% 单句回，3 句连发仅 1.4%），而该回复是 **4 个 beat**，
   超过 `max_per_reply: 3`。守卫检测到了，但只记 `severity: warn`，
   而 `decision` 只看 `block` ⇒ **警告被记录却无任何后果，回复照发**。

### 裁决与落地

新增 `packages/core/src/output/beats.ts` 作为**输出归一层**，
各家模型的排版差异在此吸收（V4 §10「各家差异由 Adapter 内部吸收」的延伸）：

| 模型 | 原始输出 | 归一后 |
|---|---|---|
| Gemini flash-lite | `……

乌冬面。

你做。` | say: [`……`, `乌冬面。`, `你做。`] |
| 豆包 character | `（没抬眼，指尖转着球）什么。` | say: [`什么。`], act: [`没抬眼，指尖转着球`] |

- 切分规则：**有换行按换行切**（模型主动换行即表达了分句意图，尊重它，不二次拆分）；
  无换行才按句末标点切，标点保留。
- `say` / `act` 分离即 `NRH-20260821-2037` 的代码落点。聊天模式只渲染 `say`。
- 超 beat 上限**截断而非合并**——合并只会得到一句更长的话，与 §8.1 的意图相反。
- 流式：**每个 beat 单独发一个 chunk**，间隔 `BEAT_GAP_MS`（默认 240ms，见 U12），
  读起来像人陆续发消息。非流式走同一套归一，用换行连接，并在 `nagi.say` 暴露数组。

### 仍未做

守卫的 beat 超限**仍是 warn**，未提为 block。提为 block 会触发重生成，
但重生成同样可能超限，需要先定"重试几次后接受"的口径——留待与
`F15b`（关系变化判据）一并裁。当前由归一层截断兜住，现象不外泄。

---

## NRH-20260822-023 — 检索打分权重：配置改写成代码口径（Ant 裁决）

**背景**：`config/runtime.yaml` 的 `retrieval.weights` 与代码
`scoreMemory` 的打分口径**维度不一致**，不是数值差异：

| 打分依据 | 配置写的 | 代码实际 |
|---|---|---|
| 语义相似 | cosine 0.60 | semantic 0.52 |
| 新近度 | recency 0.25 | recency 0.16 |
| **情绪强度** | emotionIntensity 0.15 | **无此维度，记忆结构里也没有该字段** |
| 显著度 | — | salience 0.16 |
| 置信度 | — | confidence 0.16 |
| canon 加成 | — | kindBoost 0.08 |

配置存在而代码不读，比没有配置更糟——它让人以为改配置有用。见 OPEN_QUESTIONS F23。

**两个方案**：
- **A** 配置改写成代码的 5 维，把现有权重固化为可调项。行为不变，纯接线。
- **B** 给记忆加 `emotionIntensity` 字段（抽取时由 aux 打分），打分器改成配置的 3 维。
  效果是凪偏向记住情绪浓的事；要改抽取 prompt、库结构、打分器，且既有记忆需重评。

**裁决（Ant，2026-08-22）：A。**

理由（Claude 提，Ant 采纳）：二者并非二选一。A 是「把账对平」，
B 是「给凪加一个新脾气」——后者是**人设决定**而非配置同步问题。
混在一起会让「要不要对账」这个技术问题，被迫顺带决定
「凪该不该偏爱记住动情的时刻」。

**B 未否决，改列为独立需求**，待豆包可用、Ant 实际体验一轮后再定——
那时才说得准凪记东西的毛病在哪。

**落地要求**：改完后凪的行为**必须一字不变**。判据是同一组查询在改前改后
返回相同顺序与相同分数——A 是对账，不是调参。
