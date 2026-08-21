# Nagi Runtime Harness — 决策记录

> **Claude 与 Codex 的唯一同步点。** 开工先读「在做什么」+ 尾部最新条目，收工写回。
> 凡涉及主仓库 `authority/` 的改动，必须另在 `00_harness/01_governance/decision_log.md`
> 立条目，由 Ant 拍板。标记 `待 Ant` 的条目，在裁决前不得据以落地。

---

## 在做什么（并行防撞用）

> 开工加一行，收工删掉。**这是最轻的锁，不是任务板。**
> 格式：`- [发起方] 在改什么 — 起始时间`

- [Claude] 抽 policy/scene.* 与 world/{places,systems,rules.*} —— **只碰 resources/**，不动 packages/ — 2026-08-21 17:27








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

