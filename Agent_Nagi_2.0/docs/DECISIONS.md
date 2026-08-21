# Nagi Runtime Harness — 决策记录

> **Claude 与 Codex 的唯一同步点。** 开工先读「在做什么」+ 尾部最新条目，收工写回。
> 凡涉及主仓库 `authority/` 的改动，必须另在 `00_harness/01_governance/decision_log.md`
> 立条目，由 Ant 拍板。标记 `待 Ant` 的条目，在裁决前不得据以落地。

---

## 在做什么（并行防撞用）

> 开工加一行，收工删掉。**这是最轻的锁，不是任务板。**
> 格式：`- [发起方] 在改什么 — 起始时间`

*（当前无人在做）*

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

