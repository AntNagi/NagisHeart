# NagisHeart 项目文件结构说明

> 更新日期：2026-07-16
> 目的：先把仓库现有文件按职责分清楚，解决“最新 PRD / 交互 / UI 规范 / 资源 / 协同文档找不到”的问题。  
> 当前原则：本文件只建立索引和分类，不移动现有文件，避免与当前未提交代码和资源改动混在一起。

---

## 0. 顶层目录分工

| 路径 | 类型 | 说明 | 当前处理建议 |
|---|---|---|---|
| `README_AI.md` | AI 协作规则 | Codex / Claude / XoXo 等协作者每次开工先读的读写规则。 | 保持短、明确、可执行。 |
| `TASKS.md` | 任务板 | 当前任务、交接状态、下一步建议。 | 只放轻量任务状态，不写成长文档。 |
| `00_harness/` | Workspace 协作层 | governance / planning / handoff / execution / reports / authority 等协作账本统一入口。 | 已纳入 Git；仅在 PM 协调、跨 agent 追踪、权威核对、交班、测试回填任务中读取。 |
| `android/` | 应用代码 | Android 主版本工程，包含 Kotlin 代码、主题、组件、资源配置。 | 保持为工程目录，不放产品/设计过程文档。 |
| `web/` | 应用代码 | Web 版本实现，包含页面入口、样式、JS 源码。 | 保持为工程目录。 |
| `story-data/` | 应用运行数据 | 剧情节点、流程、变量、章节、结局、视觉映射等 JSON 数据。 | 作为双端共享数据源，不混放设计稿。 |
| `assets/` | 应用运行资源 | 背景图、BGM、UI 图标、主视觉、小剧场原始素材等。 | 区分“会进包的运行资源”和“仅参考素材”。 |
| `design/` | 产品/内容/设计/技术文档与设计稿 | PRD、交互、剧本母版、剧情逻辑设计、UI 规范、高保真 HTML、设计审计、技术架构、脚本映射等。 | 需要后续拆为 active/reference/archive。 |
| `handoff/` | 协同交接文档和阶段性交付 | yiyi / XoXo / cc 之间的交接日志、切图包、阶段设计交付。 | 保留作协同记录，不应作为唯一规范入口。 |
| `tools/` | 工程工具 | 校验、剧情转换、自动 playthrough 等脚本。 | 作为开发工具目录。 |
| 根目录 `*.md` | 协同/QA/入口文档 | Android 交接、QA 用例、设计审计等横跨多个目录的文档。 | 后续建议统一归到 `docs/` 或保留少数入口文档。 |

## 1. 当前权威文档

> **2026-07-21 重要变更**：全部权威文档已收拢到根目录 `authority/`，唯一清单见 `authority/MANIFEST.md`。本节及下文各表中所有 `design/` 下的权威文档旧路径均已失效，对应关系：
>
> | 权威 | 新路径 |
> |---|---|
> | PRD | `authority/product/NagisHeart_PRD_v2_0.md` |
> | 交互设计 | `authority/interaction/NagisHeart_Interaction_Design_v1_0.md` |
> | 剧本母版 | `authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md` |
> | 剧情逻辑 coreDesign | `authority/story_logic/NagisHeart_Design_V3_1_Latest_UtopiaAdded.md` |
> | UI 设计稿 | `authority/ui/NagisHeart_UI_Authority_XoXo_v1_0.html` |
> | UI 数值 MinSpec | `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` |
> | BG Mapping v1.2 | `authority/visual_mapping/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md` |
> | Start 页（TT V23）/ Icon（V4 safezone） | `design/authority/icon_start_tt/`（原位保留，受 MANIFEST 约束） |
>
> 非权威的历史/参考/审计文档仍在 `design/`、`handoff/` 原位。`00_harness/08_authority_current/` 快照已退役归档。

### 1.1 产品需求

| 文件 | 状态 | 用途 |
|---|---|---|
| `design/NagisHeart_PRD_v2_0.md` | 当前 PRD 主文档 | 产品定位、核心玩法、页面结构、系统能力、路线/图鉴/存档/设置范围。 |
| `design/PRD_v1.md` | 旧版参考 | 早期 PRD，不作为当前开发依据。 |

### 1.2 交互设计

| 文件 | 状态 | 用途 |
|---|---|---|
| `design/NagisHeart_Interaction_Design_v1_0.md` | 当前交互主文档 | 页面流程、阅读体验、选择、存档、回想、图鉴、设置等 UX 规则。 |

### 1.3 UI / 视觉规范

UI 目前不是单文件正式权威，需要按 harness 决策和页面类型组合读取。

当前正式合版决策见：

- `00_harness/01_governance/decision_log.md`
- `00_harness/04_execution/design/TASK_XOXO_UI_AUTHORITY_MERGE_20260715.md`

当前原则：

1. `design/NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` 是唯一 UI 合版母版。
2. `design/NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` 只作为缺页来源，只拼入已通过页面。
3. `design/NagisHeart_LongNarration_StoryRecap_Redesign_Lulu_v1_0.html` 只覆盖长旁白与剧情回顾，并统一冷色。
4. `CoCo_Design_Handoff_20260713.md` 只作为历史覆盖关系参考，不再作为当前 UI 合版权威。

| 文件 | 状态 | 用途 |
|---|---|---|
| `handoff/yiyi_final_visual_slices_20260711/XoXo_UI_Final_MinSpec_20260712.md` | 当前 UI 数值主规范 | 开屏、系统页、剧情页、HUD、对白、长旁白、剧情回顾等可开发数值。 |
| `handoff/yiyi_final_visual_slices_20260711/XoXo_Dev_Ready_Spec_20260712.md` | 当前可直接开发清单 | 已锁定、不需继续等设计的规则。 |
| `handoff/yiyi_final_visual_slices_20260711/XoXo_Design_Pending_For_Dev_20260712.md` | 待补设计清单 | 不应由开发自行发挥的项目。 |
| `00_harness/01_governance/decision_log.md` | 当前正式 UI 决策 | 记录 UI 合版母版、缺页采用范围、lulu 覆盖范围。 |
| `00_harness/04_execution/design/TASK_XOXO_UI_AUTHORITY_MERGE_20260715.md` | 当前 UI 合版任务单 | XoXo 的严格合版执行规则，只做拼接，不做重设计。 |
| `design/NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` | 当前 UI 合版唯一母版 | 整体 UI 风格、light/dark 体系、HUD、人物对白、选项、LINE、存档、回忆画廊、设置、结局等母版内容。 |
| `design/NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` | 缺页来源 | 只拼入主页、开场白、名字设置、大章开始、小节开始、弹窗；不采用大章/小节结束、长旁白、剧情回顾。 |
| `design/NagisHeart_LongNarration_StoryRecap_Redesign_Lulu_v1_0.html` | 特定页面覆盖方案 | 只覆盖长旁白和剧情回顾，色彩统一到母版冷色体系。 |
| `design/CoCo_Design_Handoff_20260713.md` | 历史设计交接参考 | 只保留历史覆盖关系说明，不再作为当前 UI 合版权威。 |

### 1.4 技术/架构

| 文件 | 状态 | 用途 |
|---|---|---|
| `design/ARCHITECTURE.md` | 架构参考 | 双端数据共享、StoryEngine、JSON schema、状态与热更新思路。 |
| `design/NagisHeart_Web_Architecture_v1_0.md` | Web 架构参考 | Web 版本架构说明。 |
| `design/TECH_TASKS_v1.1.md` | 技术任务参考 | 底层规则技术任务拆解较新版。 |
| `design/TECH_TASKS_v1.md` | 旧版参考 | 早期技术任务拆解。 |

### 1.5 剧本与核心剧情逻辑

这组文件是项目内容和剧情系统的核心，不应被归为普通 UI 设计稿。

| 文件 | 状态 | 用途 |
|---|---|---|
| `design/Nagis_Heart_SCRIPT_V15_Calibrated.md` | 当前剧本母版 | V15 校准后的完整剧情文本源稿，包含章节、节点、选项、路线、结局和校准说明。 |
| `design/NagisHeart_Design_V3_1_Latest_UtopiaAdded.md` | 剧情/产品设定参考 | 较完整的早期设计总稿，含路线、系统和内容设定；当前需作为参考而非唯一源。 |
| `design/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md` | 当前背景映射设计参考 | V15 剧本到背景、UI theme、情绪等视觉映射的较新版。 |
| `design/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_v1_1.md` | 旧版背景映射参考 | CoCo v1.1 背景映射，已被 XoXo v1.2 扩展。 |
| `story-data/nodes.json` | 当前运行剧情数据 | App 实际读取的剧情节点数据，由剧本母版转换/整理而来。 |
| `story-data/flow.json` | 当前运行流程逻辑 | App 实际读取的节点推进链。 |
| `story-data/routers.json` | 当前运行分支逻辑 | App 实际读取的路由/条件分流。 |
| `story-data/endings.json` | 当前运行结局判定 | App 实际读取的结局定义和判定规则。 |
| `story-data/variables.json` | 当前运行变量定义 | App 实际读取的核心变量、默认值、legacy alias。 |
| `story-data/scene_visuals.json` | 当前运行视觉映射 | App 实际读取的背景、BGM、UI theme、视觉元信息。 |

权威关系：

1. 剧情文本源头看 `design/Nagis_Heart_SCRIPT_V15_Calibrated.md`。
2. 背景/情绪/视觉映射设计看 `design/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md`。
3. App 当前实际运行状态以 `story-data/*.json` 为准。
4. 如果剧本母版和 `story-data` 不一致，需要记录“源稿未同步”或“运行数据临时修正”，不能静默覆盖。

---

## 2. 设计资源

设计资源包括设计规范文档、HTML 设计板、导出图、校验截图、切图交付包。它们不一定都会进入 App 包。

### 2.1 设计规范与评审文档

| 路径/文件 | 类型 | 说明 |
|---|---|---|
| `design/NagisHeart_UI_Visual_Direction_v1_0.md` | 视觉方向 | 早期视觉方向判断。 |
| `design/NagisHeart_P0_HiFi_UI_Spec_v1_0.md` | UI 规格 | P0 高保真 UI 规格。 |
| `design/XoXo_P0_HiFi_UI_Review_v1_1.md` | UI 评审 | XoXo 对 P0 UI 的评审。 |
| `design/CoCo_Design_Understanding_TaskPlan_v1_0.md` | 设计任务理解 | CoCo 对项目和设计边界的理解。 |
| `design/CoCo_PM_Review_Package_v1_0.md` | PM 评审包 | 给 PM 检查的设计包。 |
| `design/CoCo_Minimal_Check_Delivery_v1_0.md` | 最小检查交付 | CoCo 最小检查交付说明。 |
| `design/CoCo_to_XoXo_Design_Handoff_v1_0.md` | 设计交接 | CoCo 到 XoXo 的交接。 |
| `design/CoCo_Design_Handoff_20260713.md` | 历史设计交接 | lulu 到 CoCo 的历史设计交接，仅作追溯，不作为当前合版权威。 |
| `design/CoCo_UI_Resource_Audit*.md` | 资源审计 | UI/资源接入问题和修复顺序。 |
| `QA_Design_Compliance_Audit_Laud_v1.md` | QA/设计一致性审计 | 根目录设计合规审计。 |

### 2.2 内容与剧情设计文档

| 路径/文件 | 类型 | 说明 |
|---|---|---|
| `design/Nagis_Heart_SCRIPT_V15_Calibrated.md` | 剧本母版 | 完整剧情文本源稿；后续改剧情、补节点、校准选项，应优先从这里建立差异记录。 |
| `design/NagisHeart_Design_V3_1_Latest_UtopiaAdded.md` | 剧情设计总稿 | 早期/中期剧情、路线、系统设定整合稿。 |
| `design/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md` | 剧情视觉映射 | 剧本节点到 BG、mood、uiTheme、visualPriority 等字段的设计依据。 |
| `design/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_v1_1.md` | 剧情视觉映射旧版 | v1.2 的上一版，可用于追溯变更。 |
| `story-data/STORY_QA_REPORT.md` | 剧情数据 QA | 运行数据路径、结局、变量问题的 QA 记录。 |

### 2.3 HTML 设计板与预览

| 路径/文件 | 类型 | 说明 |
|---|---|---|
| `design/NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` | 高保真 UI board | 剧情内页 light/dark 基准。 |
| `design/NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` | 缺页预览 | 系统级页面基准。 |
| `design/NagisHeart_AppIcon_Start_Design_XoXo_v1_0.html` | App icon / start | App icon 和开屏设计。 |
| `design/NagisHeart_Route_Page_Design_XoXo_v1_0.html` | 路线页设计 | Route / 章节相关页面设计。 |
| `design/NagisHeart_System_Pages_Design_XoXo_v1_0.html` | 系统页设计 | 系统页设计板。 |
| `design/NagisHeart_Visual_Calibration_Board_XoXo_v1_0.html` | 视觉校准板 | 视觉校准参考。 |
| `design/coco_minimal_ui_check_v1_0.html` | CoCo 检查板 | 最小 UI 检查预览。 |
| `design/nagisheart_mainflow_ui_board_v1_0.html` | 主流程 UI board | 主流程页面设计。 |

### 2.4 导出图和校验截图

| 路径/文件 | 类型 | 说明 |
|---|---|---|
| `design/exports/` | 设计导出 | App icon、route page、missing pages、visual calibration 等导出图。 |
| `design/nagi_verify_*.png` | 验证截图 | Splash/Home/Settings 等实现或设计验证截图。 |
| `design/bg_contact_sheet_v1.jpg` | 背景 contact sheet | 背景候选总览。 |
| `design/_xoxo_source_contact.jpg` | 源素材 contact sheet | XoXo 视觉源素材总览。 |

### 2.5 交付切图包

| 路径 | 类型 | 说明 |
|---|---|---|
| `handoff/yiyi_final_visual_slices_20260711/` | 最终视觉切图交付 | 当前最重要的切图/规范交付目录。 |
| `handoff/yiyi_final_visual_slices_20260711.zip` | 压缩包 | 同名交付目录的 zip 包。 |
| `handoff/yiyi_ui_slices_20260710/` | 早期 UI slices | 早期页面切图。 |
| `handoff/yiyi_icon_start_cut_20260711/` | icon/start 切图 | App icon 与 start 页面阶段交付。 |
| `handoff/yiyi_start_flow_redesign_20260711*` | start flow 多轮方案 | 开屏与前置流程多轮设计，已有后续覆盖关系。 |
| `handoff/yiyi_system_pages_design_v1_0/` | 系统页设计交付 | 系统页阶段交付。 |

---

## 3. 应用代码和运行资源

### 3.1 Android 应用代码

| 路径 | 类型 | 说明 |
|---|---|---|
| `android/app/src/main/java/com/antnagi/nagisheart/` | Android Kotlin 源码 | App 主代码。 |
| `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/` | 页面代码 | Splash、Start、Prologue、Game、Settings、SaveLoad、Chapter 等页面。 |
| `android/app/src/main/java/com/antnagi/nagisheart/ui/component/` | UI 组件 | HUD、Dialogue、Choice、LongNarration、NagiDialog 等组件。 |
| `android/app/src/main/java/com/antnagi/nagisheart/ui/theme/` | UI token | 颜色、字体、间距、动效、形状。 |
| `android/app/src/main/java/com/antnagi/nagisheart/data/` | 数据层 | 存档、进度、设置、剧情仓库、BGM 管理。 |
| `android/app/src/main/java/com/antnagi/nagisheart/engine/` | 引擎层 | StoryEngine、条件解析等。 |
| `android/app/src/main/res/` | Android 原生资源 | 图标、splash drawable、values 等。 |
| `android/app/build.gradle.kts` | 构建配置 | Android app 构建与资源同步配置。 |

### 3.2 Web 应用代码

| 路径 | 类型 | 说明 |
|---|---|---|
| `web/index.html` | Web 入口 | Web 版页面入口。 |
| `web/src/main.js` | Web 启动逻辑 | Web 版初始化。 |
| `web/src/controller/` | 控制层 | GameController。 |
| `web/src/engine/` | Web 引擎 | StoryEngine、GameState、ConditionParser 等。 |
| `web/src/data/` | Web 数据层 | DataLoader、SaveManager、ProgressManager、SettingsManager。 |
| `web/src/ui/` | Web UI | Router、screens、components、overlays。 |
| `web/styles/` | Web 样式 | reset、layout、tokens、HUD、dialogue、choice、screen styles。 |

### 3.3 共享剧情数据

这部分是 App 实际运行时读取的数据。它们不是“设计稿”，而是由剧本和核心逻辑设计落地后的运行数据。

| 路径/文件 | 类型 | 说明 |
|---|---|---|
| `story-data/nodes.json` | 剧情节点 | 主剧情节点和对白/选项内容；对应剧本母版中的节点。 |
| `story-data/flow.json` | 流程链 | FN 节点推进关系；决定常规阅读顺序。 |
| `story-data/routers.json` | 路由 | 条件分支规则；决定路线分流。 |
| `story-data/chapters.json` | 章节 | 大章/小章节结构；决定章节目录和回看边界。 |
| `story-data/endings.json` | 结局 | 结局定义和判定规则。 |
| `story-data/variables.json` | 变量 | 数值和状态变量定义，含 legacy alias。 |
| `story-data/scene_visuals.json` | 视觉映射 | 节点对应背景、BGM、UI theme、mood、visualPriority 等。 |
| `story-data/prologue*.json` | 开场白 | 开场白相关数据。 |
| `story-data/version.json` | 数据版本 | story-data 版本信息。 |
| `story-data/STORY_QA_REPORT.md` | 数据 QA | 剧情数据 QA 报告。 |

### 3.4 运行资源

| 路径 | 类型 | 说明 |
|---|---|---|
| `assets/bg/` | 背景资源 | 剧情、系统页、结局等背景图。部分文件当前需要补齐/归类。 |
| `assets/bgm/` | BGM 资源 | Android/Web 运行时使用的 BGM 源目录。 |
| `assets/ui/svg/` | UI 图标源 | SVG 图标源文件。 |
| `assets/ui/android/drawable/` | Android 图标资源 | Android drawable XML 图标。 |
| `assets/main pic/` | 主视觉资源 | 开屏、icon、主视觉相关素材。 |
| `assets/Ant's home/` | 场景原始素材 | Ant 家相关场景资源。 |
| `assets/小剧场文/` | 文本素材 | 小剧场原始文本素材。 |
| 根目录 `nagi_icon_source.png` / `poster.jpg` / `nagi_wallpaper_1280x720.png` / `call_*.png` | 待归类资源 | 目前在根目录，后续需判断是否进包、仅设计参考，或不提交。 |

### 3.5 工程工具

| 文件 | 类型 | 说明 |
|---|---|---|
| `tools/validate.js` | 校验工具 | 校验 flow、router、choice、变量、资源引用、结局等。 |
| `tools/golden-playthrough.js` | 流程测试 | 黄金路径 playthrough。 |
| `tools/convert-story.js` | 数据转换 | 剧情转换脚本。 |
| `tools/convert-v15.js` | 数据转换 | V15 剧本转换脚本。 |

---

## 4. 协同文档

协同文档记录“谁做了什么、交给谁、还有什么没做”。它们可以解释状态，但不应替代 PRD / 交互 / UI 规范。

### 4.1 当前接力与开发协同

| 文件 | 状态 | 用途 |
|---|---|---|
| `handoff/handoff_to_cc_20260713.md` | 当前开发接力主文档 | yiyi 到 cc 的最新交接，包含已完成、未完成、代码位置、编译测试注意。 |
| `ANDROID_DEV_HANDOFF.md` | Android 开发交接 | Android 开发侧交接说明。 |
| `handoff/proposal-auto-workflow.md` | 协作流程方案 | GitHub 驱动的半自动接力/状态管理方案。 |

### 4.2 QA / 验收协同

| 文件 | 状态 | 用途 |
|---|---|---|
| `Nagi_Heart_QA_TestCases_v1.0.md` | QA 用例 | 功能与体验测试用例。 |
| `QA_Design_Compliance_Audit_Laud_v1.md` | 设计合规审计 | UI/设计一致性检查。 |
| `design/CoCo_UI_Resource_Audit_NagisHeart_v1_0.md` | 最新资源审计 | 公司电脑当前资源 wiring 和剩余问题记录。 |
| `design/CoCo_UI_Resource_Audit_v1_0.md` | 资源审计 | 更完整的 UI / Resource Audit。 |

### 4.3 设计交接协同

| 文件/目录 | 状态 | 用途 |
|---|---|---|
| `design/CoCo_Design_Handoff_20260713.md` | 历史设计交接 | lulu 到 CoCo 的历史设计状态和覆盖关系，仅作追溯。 |
| `design/NagisHeart_XoXo_Final_Design_Handoff_20260711.md` | XoXo 设计交接 | XoXo 最终设计交接记录。 |
| `handoff/yiyi_final_visual_slices_20260711/README_yiyi.md` | 切图交付说明 | 最终视觉切图交付给 yiyi 的说明。 |
| `handoff/*/README_yiyi.md` | 阶段交付说明 | yiyi 多轮设计/切图接收说明，多数为历史阶段记录。 |

---

## 5. 当前已知混乱点

1. `design/` 同时承载了 PRD、交互、剧本母版、剧情逻辑、UI、技术架构、审计、设计板、脚本映射，后续需要拆层。
2. `handoff/` 里有多轮设计交付，文件名看起来都很像“最终版”，但已有后续覆盖关系。
3. UI 规范需要按页面类型读取，不是单个 HTML 或单个 Markdown 说了算。
4. 根目录存在若干资源图和 QA/交接文档，后续需要归入更清晰的位置。
5. 当前 git 工作区不是干净状态，存在删除资源和未归类资源；整理目录前应先确认哪些是 cc 正在处理的改动。

---

## 6. 建议的下一步整理顺序

### Step 1：先建立文档入口

保留本文件作为根目录入口，并在后续补一个更短的 `README.md` 或 `DOCS_INDEX.md`，让所有人知道：

- 产品看 PRD；
- 交互看 Interaction；
- 剧本源稿看 SCRIPT V15；
- 剧情逻辑落地看 story-data；
- 背景/情绪映射看 BG Mapping；
- UI 看 MinSpec + CoCo Design Handoff；
- 开发接力看 handoff_to_cc；
- 资源问题看 CoCo UI Resource Audit。

### Step 2：再拆 active/reference/archive

建议后续新增：

```text
docs/
  product/
  content/
  design/
  engineering/
  qa/
  collaboration/
  archive/
```

但这一步要等当前 git 工作区稳定后再做，避免移动文件时把资源删除/新增混在一个提交里。

### Step 3：清理根目录资源

根目录图片目前应先归类为：

- 进包运行资源；
- 设计参考资源；
- 临时/私有资源，不提交。

确认后再移动到 `assets/` 或 `design/exports/`。

### Step 4：建立“文档权威规则”

建议团队约定：

1. PRD 只放产品范围和系统要求，不写具体 UI 数值。
2. 交互文档只放流程、状态、操作、反馈，不写代码实现。
3. 剧本母版只放剧情文本、节点内容、选项和叙事校准，不直接承担运行数据格式职责。
4. 剧情逻辑设计说明变量、路由、结局、章节和映射规则；运行状态以 `story-data` 为准。
5. UI Spec 只放视觉规则、组件规格、设计 token、页面布局。
6. Handoff 只记录交接状态，不承担长期规范职责。
7. 审计文档只记录问题和修复顺序，不覆盖 PRD/交互/UI/剧本母版的源定义。

---

## 7. 工作区读取与写入规则

本节是给所有协作者和 agent 的工作规则。目标是避免每次都全量扫描仓库，也避免在没有上下文的情况下随便写文件。

### 7.1 默认读取顺序

任何新任务开始时，不要默认全量读取仓库。按任务类型先读最小必要文件：

| 任务类型 | 第一层必读 | 第二层按需读取 |
|---|---|---|
| 判断项目结构 / 找文档 | `PROJECT_STRUCTURE.md` | 具体目录下的 README / handoff |
| 产品范围 / 功能边界 | `design/NagisHeart_PRD_v2_0.md` | `design/NagisHeart_Interaction_Design_v1_0.md` |
| 交互流程 / 状态规则 | `design/NagisHeart_Interaction_Design_v1_0.md` | PRD 第 20 节、相关 UI spec |
| 剧本文本 / 人设表达 | `design/Nagis_Heart_SCRIPT_V15_Calibrated.md` | `story-data/nodes.json` 中对应节点 |
| 剧情逻辑 / 路由 / 结局 | `story-data/*.json` 中对应文件 | `design/ARCHITECTURE.md`、`design/TECH_TASKS_v1.1.md` |
| 背景 / mood / uiTheme | `story-data/scene_visuals.json` | `design/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md` |
| UI 视觉 / 页面样式 | `00_harness/01_governance/decision_log.md`、`00_harness/04_execution/design/TASK_XOXO_UI_AUTHORITY_MERGE_20260715.md` | `design/NagisHeart_P0_HiFi_Design_XoXo_v2_0.html`、`design/NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html`、`design/NagisHeart_LongNarration_StoryRecap_Redesign_Lulu_v1_0.html`、MinSpec |
| Android 实现 | 相关 `android/app/src/main/...` 文件 | `handoff/handoff_to_cc_20260713.md` |
| Web 实现 | 相关 `web/src/` 或 `web/styles/` 文件 | `design/NagisHeart_Web_Architecture_v1_0.md` |
| QA / bug 反馈 | 对应 QA 或 audit 文档 | 相关代码 / 数据 / UI spec |

### 7.2 允许全量扫描的情况

只有以下情况才允许全量扫描或大范围搜索：

1. 第一次接手一个陌生任务，需要建立文件地图。
2. 明确要做 repo 级审计、资源盘点、死链检查或文档整理。
3. 找不到目标文件，且已先查过 `PROJECT_STRUCTURE.md`。
4. 需要确认某个字段、变量、资源名在全仓库的所有引用。
5. 做提交前确认本次改动没有误伤其他文件。

全量扫描后必须在结果里收敛到具体文件，不要把扫描结果本身当作工作入口。

### 7.3 写入前检查

写任何文件前，必须先确认：

1. 当前 git 工作区是否已有别人未提交的改动。
2. 本次任务应该修改哪些文件，是否只改这些文件。
3. 是否存在同名旧版、最终版、handoff 版之间的覆盖关系。
4. 是否会改变运行资源、剧情数据或权威文档。
5. 是否需要先记录决策，再落到代码或数据。

如果工作区不干净，只允许修改本任务明确相关的文件；不要顺手格式化、移动、删除无关文件。

### 7.4 禁止随便写入的区域

以下区域不能在没有明确任务和确认的情况下改动：

| 路径 | 原因 |
|---|---|
| `story-data/*.json` | 直接影响运行剧情、路线、结局、资源映射。 |
| `design/Nagis_Heart_SCRIPT_V15_Calibrated.md` | 剧本母版，改动必须可追溯。 |
| `assets/bg/`、`assets/main pic/`、`handoff/*/` | 大量图片资源，容易误删或误移动。 |
| `android/app/src/main/res/` | Android 打包资源，误删会影响构建。 |
| `handoff/` 历史目录 | 作为过程证据保留，不要为了“干净”直接删。 |
| 根目录图片资源 | 先归类，再移动；不要直接删除。 |

### 7.5 文档写入规则

新增或修改文档时遵守：

1. 不再新增含糊的“final / latest / new / v2 copy”文件名。
2. 临时交接写进 `handoff/`，长期规则写进对应 CURRENT 文档或入口索引。
3. 任何覆盖旧规则的新规则，必须写清楚“覆盖哪个文件 / 哪一节 / 哪个旧口径”。
4. 任何测试反馈，必须包含：测试日期、测试环境、问题现象、期望行为、优先级、对应修复 owner。
5. 任何资源审计，必须区分：已修、待修、需确认、仅观察。

### 7.6 提交规则

每次提交只做一种事：

| 提交类型 | 允许包含 |
|---|---|
| docs | 文档入口、规范、交接、审计、QA。 |
| data | `story-data` 剧情/流程/映射数据。 |
| assets | 图片、音频、图标等资源。 |
| android | Android 代码和 Android res。 |
| web | Web 代码和 Web 样式。 |
| tools | 校验、转换、构建辅助脚本。 |

不要把“资源删除 + UI 代码 + PRD 修改 + QA 反馈”放在一个提交里。尤其当前工作区资源状态混乱时，必须小提交、小范围。

---

## 8. 后续文件夹整理目标

当前阶段先不移动文件。等工作区稳定后，再按以下目标整理：

```text
docs/
  product/
    PRD_CURRENT.md
    INTERACTION_CURRENT.md
  content/
    SCRIPT_CURRENT.md
    STORY_LOGIC_CURRENT.md
    BG_MAPPING_CURRENT.md
  design/
    UI_SPEC_CURRENT.md
  engineering/
    TECH_ARCHITECTURE_CURRENT.md
  qa/
    QA_CURRENT.md
    BUG_FEEDBACK_CURRENT.md
  collaboration/
    PROJECT_STATUS_CURRENT.md
  archive/
    ...
```

整理原则：

1. `CURRENT` 文档是长期权威入口。
2. 原始历史文件先保留，不急着删。
3. 每个旧文件只能有三种状态：`active source`、`reference only`、`archive`。
4. 任何移动必须单独提交，并附带映射表：旧路径 -> 新路径。
5. 大资源移动前先确认运行引用，尤其是 `scene_visuals.json`、Android Gradle 同步、Web 静态路径。
