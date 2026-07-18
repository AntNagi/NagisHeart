# 最新状态快照

> 用途：给下一位接手者提供“此刻项目真实状态”的最快入口。  
> 原则：保持短、准、可执行。任何换班、换电脑、换 Agent 前后都应优先更新或读取本文件。

---

## 当前项目

- 活跃项目：NagisHeart
- 冻结项目：notebook、notebook-app

## 当前真实状态

- 当前阶段：权威文件逐类合并与复核阶段
- 当前主线任务：yiyi 已完成 TASK-20260718-008（App Icon V4 integration）、004（UI 受控修正）、006（功能 bug），均转 review 等 Ant 实机验证。Wewe TASK-20260718-005 Web P1 已转 review
- 当前主要风险：历史交接错误地把未通过页面写成已定稿；整合任务再次被做成重设计；UI 反复试调消耗 Ant 真机测试成本

## 当前最优先的 3 件事

1. yiyi `TASK-20260718-008`（App Icon V4）、`004`、`006` 均已完成转 review，等 Ant 实机构建验证
2. Wewe 可继续 `TASK-20260718-005` Web P1，但边界极硬：只能动 `web/`，严禁修改 Android 任何代码、资源、manifest 或 Gradle；回报必须声明 `Android touched: no`
3. Android App Icon `TASK-20260718-002` 保持 review，等待构建与 launcher 实机视觉确认；旧 `ic_launcher_round.png` 暂不清理

## 当前阻塞

- 章节目录已由 XoXo `TASK-20260717-016` 从 pending 转为 review authority，仍需实现后 Ant 真机确认
- Dialog Android fallback 已由 `TASK-20260717-016` 补齐 token，仍需实现后 Ant 真机确认
- 章节开始托底、章节结束/Chapter Clear、顶部标题与下一章动作样式已由 yiyi 按 Section 14 实现，等待实机构建验证和 Ant 确认
- Web 版本已有 cc 基础工程，但 Wewe 尚未完成接手审计；第一轮不得直接改 Web 代码
- 009/010 实机复验新增三项 P0：title chip 托底不明显；剧情回顾不要上一页/下一页按钮，应左右滑动；弹窗当前太厚重，不像 confirmed authority
- HUD/speaker UI authority 缺口已由 XoXo `TASK-20260717-014` 补齐并通过 PM review；等待 yiyi `TASK-20260717-015` Android 接入与实机验证

## 当前不要做的事

- 不把 `design/CoCo_Design_Handoff_20260713.md` 当作本次合版的最终判断依据
- 不在合版任务中重设计或顺手补章节目录；章节目录只能通过已登记的 XoXo `TASK-20260717-016` 单独收口
- 不让 Wewe 第一轮直接改 Web/Android/story-data；先读 onboarding 并回报接手理解
- 不让开发按未同步到 `00_harness/08_authority_current/` 的设计或规则变化实现
- 不让开发按截图或聊天印象直接调 UI；UI 修改必须先核对 authority_current，明确目标范围、预期效果和禁止范围
- 不让开发从 `00_harness/99_archive/obsolete_assets/` 直接引用资源；需要恢复必须另开 restore task

## 最近关键改动

- **[yiyi 2026-07-18] TASK-20260718-008 App Icon V4 integration 完成**：从 `android_launcher_rework_v4/` 复制 5 密度 adaptive foreground/background + legacy ic_launcher 到 `mipmap-*/`（15 文件覆盖）。旧 `ic_launcher_round.png` 5 文件已删除（adaptive XML `ic_launcher_round.xml` 已覆盖 round icon 场景）。`mipmap-anydpi-v26/ic_launcher.xml` 和 `ic_launcher_round.xml` 无需修改，仍正确指向 `@mipmap/ic_launcher_foreground` 和 `@mipmap/ic_launcher_background`。回传见 `dev_reply_yiyi_app_icon_launcher_v4_integration_20260718.md`。
- **[yiyi 2026-07-18] TASK-20260718-004 UI 受控修正完成**：严格按 PM 接受的 diff table 修改 4 个文件。NagiIconButton shadow 降重（2dp + 柔和 color）+ icon alpha 0.94；NagiDialog card bg 56%/scrim 38%/border 14%/shadow 18dp/text shadow 35%+inner highlight 全部对齐 section 16.5 no-blur fallback；DialogueLayer + BacklogScreen speaker 加 gold halo（双层 Text 叠加）。Title/action chip 未改。Icon shadow/halo 因 Compose Icon 不支持 CSS drop shadow 未实现（已说明限制）。回传见 `dev_reply_yiyi_004_ui_controlled_correction_20260718.md`。
- **[yiyi 2026-07-18] TASK-20260718-006 功能 bug 修复完成**：三项根因：(1) `enterNode()` 在 chapter/section transition `return` 前未更新 `bgAssetPath`，opening 显示上一节点背景→修复：transition return 前从 `found.visual.bg` 更新 UI state；(2) `ChapterOpeningOverlay`/`SectionOpeningOverlay` 无自身 `clickable`，轻触不可靠→修复：overlay root Box 加 `clickable(onClick = onTap)`；(3) `scene_visuals.json` 引用 `bgm/bgm.mp3` 但 Android assets 无此文件→修复：从 repo `assets/bgm.mp3` 复制到 `android/app/src/main/assets/bgm/bgm.mp3`。修改文件：`GameViewModel.kt`、`GameScreen.kt`、`android assets bgm/bgm.mp3`（新增）。回传见 `dev_reply_yiyi_006_functional_bugs_fix_20260718.md`。
- **[PM 2026-07-18] 完成废弃视觉资源安全清理归档**：新增 `TASK-20260718-001` 与 `DEC-20260718-001`。已将 TT Start 长屏 V1/V2/V3 被打回候选包，以及 Android 活跃路径中的旧 `splash_start.png`、`splash_title.png`、`poster_start_nagis_heart_keyart.jpg` 移入 `00_harness/99_archive/obsolete_assets/20260718_cleanup/`。活跃 Start 长屏目录只保留 `design/authority/icon_start_tt/start_long/rethink/` 和说明 README。清理记录见 `00_harness/05_reports/validation/PM_REVIEW_OBSOLETE_ASSET_CLEANUP_20260718.md`。
- **[PM 2026-07-17] 新增 XoXo TASK-20260717-016，并补交互 authority section 30**：Claude token 暂不可用，yiyi / Wewe 暂停；按 Ant 要求先做 PM/UI 能做到的设计收口。PM 检查确认章节目录仍 pending，弹窗 Android 无真实 blur fallback 口径仍不够硬，且交互文档旧段落仍有“Backlog 可上下滑动查看”的过时口径。已在 `design/NagisHeart_Interaction_Design_v1_0.md` 和 `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md` 增补 section 30，锁定剧情回顾左右滑动分页、跳过本节落当前小章节结束页、章节目录交互边界、autoAdvance 占位过滤、dark 可读性口径。任务单见 `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_XOXO_20260717_CHAPTER_CATALOG_DIALOG_FALLBACK_AUTHORITY.md`。要求 XoXo 补章节目录可开发 authority，并收紧弹窗 fallback token，必须同步 `08_authority_current`。
- **[PM 2026-07-17] XoXo TASK-20260717-016 通过 PM review**：章节目录已从 pending 转为 review authority，新增 `screen-chapter-catalog`；Dialog Android no-real-blur fallback 已固定 token，不再凭感觉试调 alpha。UI authority 见 `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 16；交互 authority 见 `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md` section 30；PM review 见 `00_harness/05_reports/validation/PM_REVIEW_XOXO_CHAPTER_CATALOG_DIALOG_FALLBACK_20260717.md`；治理记录见 `DEC-20260717-017` / `DEC-20260717-018`。
- **[PM 2026-07-17] 已把 UI 谨慎变更写入 PM_LOOP / WORKER_LOOP**：新增 `DEC-20260717-016`。当前测试资源有限，Ant大小姐是真机主验收人；所有 UI 调整必须先核对最新 `08_authority_current/04_ui/`，判断是实现偏差还是权威需要修订。开发 UI 任务必须写明 authority 文件与章节、目标范围、预期效果和禁止范围；开发回传必须写明 UI 权威执行状态、fallback 和仍需真机确认点。
- **[PM 2026-07-17] XoXo TASK-20260717-014 通过 PM review，并新增 yiyi TASK-20260717-015**：高亮背景下 HUD icon/title/action 统一与 speaker/name 金色可读性规则已同步到 `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 15，并登记 `DEC-20260717-015`。PM review 见 `00_harness/05_reports/validation/PM_REVIEW_XOXO_HUD_DIALOGUE_READABILITY_20260717.md`。开发任务见 `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_YIYI_20260717_HUD_SPEAKER_READABILITY_AUTHORITY_IMPLEMENTATION.md`。
- **[PM 2026-07-17] 新增 TASK-20260717-014 HUD / speaker 可读性 UI authority patch**：Ant 实机反馈指出 HUD 标题/跳过有玻璃底和线框但图标按钮没有，亮底图下图标不可见且不统一；speaker/name 金色喜欢但在亮/复杂背景下不清楚。PM 判定先由 XoXo 补权威规则，开发不得自行猜。任务单见 `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_XOXO_20260717_HUD_DIALOGUE_READABILITY_REAL_DEVICE.md`，分类记录见 `00_harness/05_reports/validation/PM_REVIEW_HUD_DIALOGUE_READABILITY_FEEDBACK_20260717.md`。yiyi `TASK-20260717-013` 已更新：非 HUD 部分可继续，HUD/speaker 等 XoXo 014 同步 authority_current 后实现。
- **[PM 2026-07-17] 已把权威同步写入 PM_LOOP / WORKER_LOOP**：新增 `DEC-20260717-014`。任何设计、交互、剧情、BG mapping、资源口径或技术规则变化，只要作为 review / authority / 可开发依据，就必须同步到 `00_harness/08_authority_current/`；未完成同步前不得派开发实现。设计/规则 worker 回传时必须写“权威同步状态”，开发默认读 authority_current。
- **[PM 2026-07-17] 新增 TASK-20260717-013 实机反馈二轮回修**：Ant 实机复验反馈标题背景仍不明显、剧情回顾不需要上一页/下一页按钮而应左右滑动、跳过确认弹窗 UI 不像已确认权威页。PM 已核对 authority，确认弹窗当前确实偏离 XoXo authority，属于 yiyi 实现回修，不是新 UI 设计任务。任务单见 `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_YIYI_20260717_REAL_DEVICE_FEEDBACK_ROUND2.md`，分类记录见 `00_harness/05_reports/validation/PM_REVIEW_REAL_DEVICE_FEEDBACK_ROUND2_20260717.md`。
- **[PM 2026-07-17] TASK-20260717-009 通过 PM 静态复核**：yiyi 全部 7 项子任务实现已核验，PM review 见 `00_harness/05_reports/validation/PM_REVIEW_YIYI_ENGINE_CONTENT_LEGACY_CLOSURE_20260717.md`。已确认：旧 `好卖` 不再存在，`wc_offer` 指向 `living_room.jpg` 且资源存在，`scene_visuals.json` 无 Light，`u20j` 保留现有存在资源 `bg_u20j_worldcup_goal_kick.jpg`，未制造 `vs_u20_goal.jpg` 断链。仍需实机构建/截图验证；`u20j` BG 口径需 PM/Ant 决策；blur 以半透明背景+边框替代需实机确认。
- **[PM 2026-07-17] Web 开发 Wewe 入职包已创建**：确认 Web 版本基础工程位于 `web/`，cc Web 架构文档为 `design/NagisHeart_Web_Architecture_v1_0.md`，交接入口为 `handoff/handoff_to_cc_20260713.md`。新增 `TASK-20260717-012`，任务单见 `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_WEWE_20260717_WEB_ONBOARDING_AUDIT.md`，入职包见 `CLAUDE_WEB_DEV_WEWE_BOOTSTRAP.md`。第一轮只读审计，不改代码。
- **[PM 2026-07-17] XoXo 最新 UI authority 已同步到 authority_current**：最新 `design/NagisHeart_UI_Authority_XoXo_v1_0.html` 与 `design/NagisHeart_UI_Authority_Merge_Record_20260715.md` 已复制到 `00_harness/08_authority_current/04_ui/`，供 Wewe / yiyi 统一读取。记录见 `00_harness/05_reports/validation/PM_REVIEW_WEB_ONBOARDING_AUTHORITY_SYNC_20260717.md`。
- **[PM 2026-07-17] XoXo TASK-20260717-011 已通过 PM review**：章节开始/小节开始轻透明雾面托底、Chapter Clear / Section Clear `clear-card`、顶部标题与跳过/下一章动作 chip 的 final glass HUD 口径已写入 `XoXo_UI_Final_MinSpec_20260712.md` section 14；章节目录仍 pending。PM review 见 `00_harness/05_reports/validation/PM_REVIEW_XOXO_CHAPTER_UI_REAL_DEVICE_FEEDBACK_20260717.md`。yiyi 新版 `TASK-20260717-009` 已更新为可按 011 实现。
- **[yiyi 2026-07-17] TASK-20260717-010 弹窗修复完成**：根因为 `RenderEffect.createBlurEffect` 作用于 `Dialog()` 自身 `graphicsLayer`，导致弹窗内容（文字、按钮）被模糊而非背景，加上容器背景 alpha 仅 32%，弹窗在游戏画面上几乎不可见。修复：移除 `RenderEffect` blur，容器背景 alpha 从 `0x52`（32%）提升到 `0xCC`（80%），增加 `shadow(12.dp)` 提供层次感。z-order 本身无问题（`Dialog()` 创建独立 window 层级高于所有 composable）。其余样式已对齐 final UI authority Section 11 dialog spec。等待实机构建验证。
- **[PM 2026-07-17] Ant 实机反馈拆分**：已新增 XoXo `TASK-20260717-011`，处理章节开始文字浅透明托底、章节结束/Chapter Clear、顶部标题与下一章/跳过动作 chip 的视觉权威补齐；已扩充 yiyi `TASK-20260717-009`，追加剧情回顾/剧情回复改翻页、章节/story gameplay 页面默认 dark；章节开始/结束视觉实现不得由开发自行发明，等待 XoXo 回传后再接入。PM 分类记录见 `00_harness/05_reports/validation/PM_REVIEW_REAL_DEVICE_UI_FEEDBACK_20260717.md`
- **[yiyi 2026-07-17] TASK-20260717-008 Strategy A layout 实现完成**：`SplashScreen.kt` 改为 `ContentScale.Crop` 全屏背景 + 9:16 UI safe layer 居中放置 SVG/hit area；可调 `uiVerticalBias`（0.0~1.0）；9:16 设备向下兼容；无构建/截图（缺 gradlew）；报告见 `dev_reply_yiyi_start_long_strategy_a_layout_20260717.md`
- **[Ant / yiyi 2026-07-17] 实机弹窗问题转报**：Ant大小姐实机发现确认/选择类弹窗层级在其他 UI 后面导致点不到，且样式未更新到 final UI authority。PM 已新增 `TASK-20260717-010`，任务单为 `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_YIYI_20260717_DIALOG_ZORDER_AUTHORITY_FIX.md`；不得混入 Start 长屏、App Icon、story/script、BG mapping、Gradle wrapper 或旧资源删除。
- **[yiyi 2026-07-17] TASK-20260717-005 构建修正补报**：实机构建发现 `assets/ui/android/drawable/ANDROID_DRAWABLE_RESOURCE_MANIFEST_20260717.md` 被当作 drawable 合并，已移到 `assets/ui/android/`；同时 14 个 icon XML 因 `res.srcDirs(\"src/main/res\", \"../../assets/ui/android\")` 与 `res/drawable/` 双份存在导致 duplicate resources，已删除 `res/drawable/` 重复副本，保留 XoXo 资源包作为单一来源。
- **[yiyi 2026-07-17] TASK-20260717-005 P0 修复完成**：已将 14 个 XoXo VectorDrawable XML icons 从 `assets/ui/android/drawable/` 复制到 `android/app/src/main/res/drawable/`（解除 `R.drawable.ic_continue` 编译阻塞）；已修复 `PrologueScreen.kt` 和 `NameSetupScreen.kt` 背景从断链路径改为 `R.drawable.splash_bg`；旧 splash/keyart 资源均无主动代码引用，保留在磁盘上待后续清理任务。未混入 Home 菜单图标、App Icon、资源删除、TT 长屏或 story/script。等待构建验证。
- **[yiyi 2026-07-17] TASK-20260717-007 全系统差异审计完成**：对比 Android 全部已实现 UI 屏幕与 final UI authority，输出差异矩阵。匹配项：Start v23 三层+呼吸、主页无顶部标题、设置页数值右对齐、长旁白冷色体系、SystemPageBackground。报告见 `dev_reply_yiyi_android_ui_authority_diff_audit_20260717.md`。
- **[yiyi 2026-07-17] Start v23 屏幕适配问题**：Ant大小姐实机测试后反馈，TT 提供的底图为 1080x1920（9:16），但现代手机屏幕比例更长（约 9:19.5~9:20），导致开屏页上下出现黑条。当前实现使用 `fillMaxHeight().aspectRatio(9/16)` 居中，黑条是预期行为但视觉不理想。需要 PM 决策：(A) 改为全屏裁切铺满，标题和 START 位置会因裁切略偏移；(B) 让 TT 出更长的底图（如 1080x2400）适配长屏。
- **[PM 2026-07-17] Start 长屏适配裁决**：选择 B。不要让 yiyi 直接裁切 1080x1920 铺满作为最终修复；已登记 `DEC-20260717-004` 并新增 TT 任务 `TASK-20260717-003`，要求输出长屏 Start v23 资源包与 Android 实现说明。
- **[PM 2026-07-17] Gradle wrapper**：批准作为独立 P1 开发基础设施任务 `TASK-20260717-004`，不得混入视觉资源改动。
- **[yiyi 2026-07-17] 非任务操作记录**：本次会话中 yiyi 在 Ant大小姐直接要求下执行了两项非 PM 派发的操作：(1) 关闭 Windows 开机自启应用（飞书、钉钉、Edge）；(2) 排查并修复 OpenAI Codex 桌面端 401 Unauthorized 错误（根因为 Codex 自动更新后 config.toml 中自定义 provider block 破坏了 OAuth 认证链路，解决方法为删除 auth.json 和 config.toml 后重新登录）。这两项不属于 NagisHeart 项目任务，记录在此供 PM 知悉。
- TT 已完成 `TASK-20260715-002` 候选包；PM 核验通过，记录见 `00_harness/05_reports/validation/PM_REVIEW_TT_ICON_START_20260716.md`
- Ant大小姐确认 TT Start 页方案 OK；PM 已登记 `DEC-20260717-001` 并新增 yiyi 开发任务 `TASK-20260717-001`
- Ant大小姐确认 XoXo 候选版局部修订口径：开屏用 TT 方案、主页去顶部标题、设置页小字/数值右置；其他页面通过；PM 已登记 `DEC-20260717-002`
- XoXo 已完成 `TASK_TO_XOXO_20260717_UI_AUTHORITY_REVISION.md` 的 3 项局部修订，回报见 `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_ui_authority_revision_20260717.md`
- PM 已完成 XoXo 修订版核验，记录见 `00_harness/05_reports/validation/PM_REVIEW_XOXO_UI_AUTHORITY_REVISION_20260717.md`
- Ant大小姐已确认 XoXo 修订版 OK；PM 已登记 `DEC-20260717-003`，`TASK-20260715-001` 标记为 `done`
- PM 已新增 UI 资源审计任务 `TASK-20260717-002`，要求 XoXo 核对 Android 当前资源相对 final UI authority 是否缺少、多出或用法不一致
- XoXo 已完成 `TASK-20260717-002` Android UI 资源审计，报告见 `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_android_resource_audit_20260717.md`
- PM 已完成 XoXo Android 资源审计复核，记录见 `00_harness/05_reports/validation/PM_REVIEW_XOXO_ANDROID_RESOURCE_AUDIT_20260717.md`；已新增 yiyi 资源修复任务 `TASK-20260717-005`
- XoXo 已输出 `design/NagisHeart_UI_Authority_XoXo_v1_0.html` 与逐页合版记录，`TASK-20260715-001` 已完成并标记为 `done`
- PM 已完成 XoXo 候选版核验，记录见 `00_harness/05_reports/validation/PM_REVIEW_XOXO_UI_AUTHORITY_20260717.md`
- 已完成本地浏览器抽查，修复首次打开背景预设与 Missing Pages 历史系统底图断链
- 已登记 `DEC-20260715-001` 与 `TASK-20260715-001`
- 已登记 `TASK-20260715-002`，不预设 TT 的最终选版结论
- 已给 yiyi 准备开发 brief：`00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_YIYI_20260717_START_V23_INTEGRATION.md`
- 已给 XoXo 准备修订 brief：`00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_XOXO_20260717_UI_AUTHORITY_REVISION.md`

## 最近验证结论

- XoXo 修订版符合 `DEC-20260717-002`：Start 引用 TT v23 三层资源，主页顶部标题已移除，设置页数值已右对齐；3 个 pending 页面仍未进入预览主链
- XoXo Android 资源审计结论与 PM 裁决已修正职责：Start v23 三层资源已接入且 hash 一致；`scene_visuals.json` 82 个背景引用均存在；Prologue / Name 改用 `R.drawable.splash_bg` 由 yiyi 路由修正；HUD/system icons 等缺少 / 未交付给开发的 UI 资源先由 XoXo 补齐或确认资源包，再给 yiyi 接入；App Icon 暂不替换；旧 splash/keyart 本轮不删除但不得作为 final UI 主动引用
- XoXo UI 资源补给通过 PM review：`assets/ui/android/drawable/` 已确认作为 Android HUD/system icon 权威资源包，14 个指定 VectorDrawable XML 全部存在且有 SHA256 manifest；Prologue / Name 背景使用现有 `R.drawable.splash_bg`，不新增旧 asset path；`TASK-20260717-005` 已改回 ready 交 yiyi 接入
- Ant大小姐要求改变顺序：资源补齐后先让 yiyi 带着 final UI authority 做 Android 全系统只读差异审计，先回差异矩阵，再决定调整；已新增 `TASK-20260717-007`，并暂缓 `TASK-20260717-005` 直接修复
- yiyi 全系统差异审计已回报并通过 PM review：P0 为 14 个 icons 未接入导致 `R.drawable.ic_continue` 编译阻塞，以及 Prologue/Name 仍引用不存在背景路径；PM 裁决立即执行 `TASK-20260717-005` 最小 P0 修复。Home 菜单图标是 P1 后续候选，不混入当前修复
- yiyi 已完成 `TASK-20260717-005` 最小 P0 修复，PM 静态复核通过：14 个 icons 已接入且与 XoXo 权威资源 SHA256 一致；Prologue/Name 改用 `R.drawable.splash_bg`；旧 splash/keyart 无主动代码引用；等待 `TASK-20260717-004` CLI 构建验证后转 done
- TT Start v23 长屏 v1 技术交付完整但 Ant 实机视觉不通过：问题是上下毛玻璃 / 模糊延展像补丁，不是图片布满屏幕的适配；已登记 `DEC-20260717-006` 并回派 TT 重做，yiyi 暂不接入 v1
- TT Start v23 长屏 V2 通过 PM review：从 `remeet.jpg` 重新取景为连续 1080x2400 全屏构图，不再有 V1 上下毛玻璃 / 模糊延展；背景 / 静态预览 / SVG 画布尺寸正确，START hit area 为 `330,1880,420,210`；等待 Ant大小姐确认近景裁切、标题位置和 START 位置是否通过
- Ant大小姐确认 TT Start v23 长屏 V2 不通过：问题不是全屏构图方向，而是字体 / 标题层 / START 字感变了，且裁切必须展示 Nagi 下巴；已登记 `DEC-20260717-008` 并回派 TT 输出 V3，要求“真全屏构图 + 保持已确认 v23 字体/字感 + 展示 Nagi 下巴”
- Ant大小姐确认 TT Start v23 长屏 V3 仍不通过：V3 没有保留 Nagi 下巴；并且当前方向不应继续默认靠裁切解决。已登记 `DEC-20260717-009`，要求 TT 重新论证适配策略：参考主页背景可正常适配长屏的事实，优先研究保留原已确认画面关系的 design box / safe area / content scale / 标题位置调整方案
- Ant大小姐纠正 PM 后，TT 又追加说明确认：旧 `assets/home.jpg` 只是 demo 试用图，不是本次 Start final 底图；Start final 仍沿用 Start v23 / remeet 方向。已登记 `DEC-20260717-012`，恢复 `TASK-20260717-008` 为 ready，并重建 yiyi inbox 任务单；该任务只是 Android layout experiment，完成后仍需 PM / Ant 看实机图确认
- XoXo 已完成 `TASK-20260717-006` UI 资源补给：`assets/ui/android/drawable/` 确认为 Android HUD/system icon 权威交付包，新增 `ANDROID_DRAWABLE_RESOURCE_MANIFEST_20260717.md`；Prologue / Name 直接用现有 `R.drawable.splash_bg`，不新增旧 asset path；App Icon 仍排除

## 下一位接手者先读

1. `..\00_project\PM_PROJECT_CONTEXT_BRIEF.md`
2. `..\02_planning\current_priorities.md`
3. `..\02_planning\task_board.md`
4. 本文件

## XoXo update - TASK-20260717-011 (2026-07-17)

- XoXo 已完成 Ant 实机反馈对应的 UI authority 补齐，状态转 `review`。
- `design/NagisHeart_UI_Authority_XoXo_v1_0.html` 已新增 Chapter Clear / Section Clear 预览入口与页面；章节开始 / 小节开始加轻透明雾面托底；顶部标题 chip 与跳过/下一章动作 chip 对齐 final glass HUD。
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` 已新增 `TASK-20260717-011` 实现规格。
- `design/NagisHeart_UI_Authority_Merge_Record_20260715.md` 已记录本轮采纳/修订边界。
- 章节目录仍 pending；TT Start、App Icon、Android code、story/script、BG mapping、资源删除均未触碰。
- PM outbox：`00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_chapter_ui_real_device_feedback_20260717.md`。

## XoXo update - TASK-20260717-014 (2026-07-17)

- XoXo 已完成高亮背景下 HUD / speaker 可读性 UI authority patch，状态转 `review`。
- HUD icon buttons 不再裸白线：back / auto / save / backlog/menu 与 title chip、action chip 统一为 final glass HUD 轻玻璃系统。
- speaker/name 金色保留并提亮为 `#E4CA8F`，增加只包住文字的轻衬底、gold 轻描边、shadow 与 halo；不得变成厚 name plate 或整条黑底。
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` 已新增 section 15。
- authority_current 已同步：
  - `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
  - `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- 新增 `DEC-20260717-015`；PM outbox：`00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_hud_dialogue_readability_20260717.md`。
- 未触碰 Android/Web/story-data/BG mapping/TT Start/App Icon/章节目录/资源删除。

## XoXo update - TASK-20260717-016 (2026-07-17)

- XoXo 已完成章节目录 UI authority 补齐 + Dialog Android fallback 收紧，状态转 `review`。
- 章节目录已从 pending 转为 review authority；新增 `screen-chapter-catalog`，采用系统级 dark glass 目录页，不扩展成成就/CG/评分系统。
- Dialog Android no-real-blur fallback 已补齐：card `rgba(27,36,54,0.56)`（允许 0.52~0.60）、scrim `rgba(9,14,24,0.38)`（允许 0.34~0.42）、border `rgba(255,255,255,0.14)`、shadow `0 18dp 42dp rgba(0,0,0,0.36)`；超出范围必须回 UI/PM。
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` 已新增 section 16。
- authority_current 已同步：
  - `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
  - `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- 新增 `DEC-20260717-017`；PM outbox：`00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_chapter_catalog_dialog_fallback_20260717.md`。
- 未触碰 Android/Web/story-data/script/BG mapping/TT Start/App Icon/资源删除；未重改 HUD/speaker section 15。

## Harness loop update - cleanup gate (2026-07-18)

- 清理 / 归档判断已正式写入 harness loop，不再只靠 PM 记忆执行。
- `PM_LOOP.md`：每轮 PM 收口必须判断是否存在被打回、废弃、过期、重复、易误用文件；需要保留追溯但不得作为开发依据的内容移入 `00_harness/99_archive/`。
- `WORKER_LOOP.md`：每个执行任务回传必须包含 cleanup status / candidates / done；执行者默认不得未经 PM 授权删除或扩大清理范围。
- `LOOP_OVERVIEW.md`：所有循环结束前都必须做清理判断；无清理也要写 `Cleanup status: none`。
- 新增 `DEC-20260718-002`。archive 只用于追溯，不作为开发引用来源。

## PM update - Icon and BGM decisions (2026-07-18)

- Ant大小姐确认并二次确认 App Icon 使用“第三版”，即 TT icon 总览图顶部第三张 / 右上 `rounded rect mask preview`；准确开发口径为 `rounded rect v2 decorated` / `design/authority/icon_start_tt/icon/master/app_icon_tt_candidate_1024.png`，Android exports 位于 `design/authority/icon_start_tt/icon/android_mipmap/` 与 `design/authority/icon_start_tt/icon/android_adaptive/`。
- 已新增 `DEC-20260718-003` 与 yiyi `TASK-20260718-002`：修正 Android 当前 launcher icon 用错的问题。不得混入 Start、HUD、dialog、story-data、BG mapping、BGM 或资源删除。
- Ant大小姐确认 BGM 早已配上；PM 静态核验 `assets/bgm.mp3`、`BgmManager.kt`、`UserSettings.bgmVolume`、`SettingsScreen` 音量入口、`GameViewModel` 播放逻辑均存在。已新增 `DEC-20260718-004`，`TASK-20260716-001` 转 done，不再作为当前待决项。
- `current_priorities.md` 已更新：当前优先级转为 yiyi HUD/speaker 接入、App Icon 修正、Gradle wrapper、Start 长屏回图、Wewe Web 入职。

## PM update - Wewe Web overnight task (2026-07-18)

- Ant大小姐更正：Web 版已经有 MVP，不希望 Wewe 只做只读审计；目标是明早醒来看到 Web 开发完成/推进的消息。
- PM 已新增 `TASK-20260718-003`，任务单为 `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_WEWE_20260718_WEB_MVP_OVERNIGHT_IMPLEMENTATION.md`。
- 任务口径：基于已有 `web/` MVP 继续开发，优先完成本地启动/路径、TT Start v23、HUD/speaker/dialogue、backlog 左右滑动分页、chapter opening/clear/catalog 与当前 authority 的 P0 对齐。
- 禁止范围：不改 Android、不改 story-data 正文、不改 BG mapping 权威、不改 authority_current、不引用 archive。
- `TASK-20260717-012` 旧的 Web 只读审计已标记为被新任务吸收，不再单独浪费 token。
- 当前 Codex 可见线程中没有 Wewe/Claude 线程；任务已正式写入 harness inbox，等 Wewe token 恢复即可按文件执行。

## yiyi update - TASK-20260718-002 App Icon 接入 (2026-07-18)

- yiyi 已完成 Android App Icon 接入 TT confirmed 第三版，状态转 `review`。
- 5 个密度 `mipmap-*/ic_launcher.png` 已替换为 TT authority exports（`rounded rect v2 decorated`）。
- TT adaptive foreground/background PNG 已复制到 5 个密度 mipmap 目录。
- 新建 `mipmap-anydpi-v26/ic_launcher.xml` 和 `ic_launcher_round.xml`，API 26+ 设备使用 adaptive icon。
- `AndroidManifest.xml` 已新增 `android:roundIcon="@mipmap/ic_launcher_round"`。
- Cleanup candidates: 旧 `ic_launcher_round.png`（5 个密度）可清理，当前未删除，回报 PM 确认。
- 未触碰 Start、HUD、dialog、story-data、BG mapping、BGM、Web、Gradle wrapper。
- 等待构建/实机 launcher 视觉验证。
- Dev reply: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_app_icon_authority_fix_20260718.md`。
- PM 静态复核通过，记录见 `00_harness/05_reports/validation/PM_REVIEW_YIYI_APP_ICON_AUTHORITY_FIX_20260718.md`：legacy `ic_launcher.png`、adaptive foreground/background 5 个密度均与 TT authority exports hash 一致；adaptive XML 与 manifest 配置正确。旧 `ic_launcher_round.png` 暂不删除，等构建/实机 launcher 视觉确认后再清理。

## PM update - yiyi 013 / 015 review intake (2026-07-18)

- yiyi 回报 `TASK-20260717-013` 实机反馈二轮已完成并转 `review`：title/action chip 可见性、剧情回顾 HorizontalPager 左右滑动分页、弹窗从 80% 回调到轻玻璃并加 text shadow。PM 静态复核通过，记录见 `00_harness/05_reports/validation/PM_REVIEW_YIYI_REAL_DEVICE_FEEDBACK_ROUND2_20260718.md`；仍需构建与 Ant 实机确认。
- yiyi 回报 `TASK-20260717-015` HUD 统一 + speaker 金色可读性已完成并转 `review`：icon button 增加 glass backing，title/action chip 同源渐变，speaker 金色提亮到 `#E4CA8F` 并加轻衬底/边框/shadow。PM 静态复核通过，记录见 `00_harness/05_reports/validation/PM_REVIEW_YIYI_HUD_SPEAKER_READABILITY_20260718.md`；仍需构建与 Ant 实机确认。
- PM 判断：015 的 section 15 渐变 glass HUD 覆盖 013 的 flat alpha chip 方案，是更新权威下的优化，不视为回退。
- Cleanup status: none for both 013 and 015.

## PM update - Wewe TASK-20260718-003 review intake (2026-07-18)

- Wewe 回报 Web MVP overnight implementation pass 已完成，回报文件：`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_mvp_overnight_20260718.md`。
- P0-A/B/C/D/E 均有实质实现：本地启动与数据加载、TT Start v23 三层海报、HUD/speaker/dialogue glass UI、Backlog 分页/选项过滤/dark、chapter opening/clear/catalog。
- PM 静态复核通过，记录见 `00_harness/05_reports/validation/PM_REVIEW_WEWE_WEB_MVP_OVERNIGHT_20260718.md`；`TASK-20260718-003` 转 `review`，不转 `done`，等待 Ant 浏览器视觉/交互确认。
- PM 本地验证：`node --check` 通过；`node web/serve.js` 后 `/web/`、`story-data/nodes.json`、TT Start 背景和 SVG 关键资源均返回 200。
- 已知 remaining/P1：Save/Load glass dialog、Settings 细节、Web BGM、PWA、favicon/icon、NagiDialog/native confirm 替换、打字机跳过、Chapter Clear actions / 跳过本节 controller 配合。
- Cleanup candidates：`web/styles/screens/ending.css`、`NagisHeart/.claude/launch.json`；PM 暂不清理。

## PM update - Android UI real-device reject / ownership gate (2026-07-18)

- Ant大小姐新增实机截图反馈：当前 Android HUD / Dialog UI 仍明显不符合最新权威稿，并提出是否应更换开发。
- PM 判定：`TASK-20260717-013` 与 `TASK-20260717-015` 当前实机效果不通过；不能转 `done`。记录见 `00_harness/05_reports/validation/PM_REVIEW_ANDROID_UI_REAL_DEVICE_REJECT_20260718.md`。
- 新增 `DEC-20260718-006` 与 `TASK-20260718-004`：yiyi 暂停 UI 自由发挥；后续 Android UI 修正必须按最新 `08_authority_current/04_ui/` 和明确 acceptance checklist 机械实现。若下一轮仍明显偏离 authority，则 Android UI 实现职责转给其他开发，yiyi 只保留非视觉任务。
- PM 已通过 Claude / yiyi 窗口发送最后一次受控修正机会指令，并要求 yiyi 先回传差异表，不得直接改代码。任务单落在 `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_YIYI_20260718_ANDROID_UI_AUTHORITY_REWORK_GATE.md`。
- Cleanup status: none。

## PM update - Wewe Web P1 continuation boundary (2026-07-18)

- Ant大小姐确认 Wewe 可以继续，但要求明确：Web 开发不能动 Android 代码。
- PM 已新增 `TASK-20260718-005` 与任务单 `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_WEWE_20260718_WEB_P1_CONTROLLED_CONTINUATION.md`。
- Wewe 只允许推进 `web/` P1：Save/Load、Settings、Web BGM、NagiDialog/native confirm、打字机跳过、PWA/Web icon、Chapter Clear actions 等。严禁修改 `android/`、story-data 正文、BG mapping 权威、authority_current、archive。
- 回报必须写明 `Android touched: no`。

## PM update - Android real-device functional bugs (2026-07-18)

- Ant大小姐新增 Android 实机功能 bug：很多章节 opening 使用同一张 Nagi 抱枕背景而非当节背景；很多章节开篇点不动卡住；BGM 之前有现在不见了。
- PM 静态初判：opening 在 pending node `enterNode()` 前显示，却使用旧 `state.bgAssetPath`；opening overlay 自身没有显式 continue 点击入口，依赖外层 tap layer，实机可能被层级影响；`scene_visuals.json` 指向 `bgm/bgm.mp3`，但 Android assets 下缺 `bgm/bgm.mp3`，根目录 `assets/bgm.mp3` 未进入 Android 运行路径。
- 新增 `TASK-20260718-006`，任务单：`00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_YIYI_20260718_ANDROID_REAL_DEVICE_FUNCTIONAL_BUGS.md`。
- 这是 Android 功能 bug，不交给 Wewe；不得改 Web、story-data 正文、BG mapping 权威、UI authority、TT Start、App Icon 或资源清理。

## PM update - App Icon launcher black edge (2026-07-18)

- Ant大小姐实机截图显示 Android launcher 中 `Nagi's Heart` 图标出现明显黑边 / 黑块。PM 判断不应先推翻已确认第三版 icon 概念，而是当前 Android adaptive launcher export 不适合圆形 mask：深色 background 外露、foreground 安全区过小，且旧 `ic_launcher_round.png` 仍在目录中可能增加 fallback 风险。
- 新增 `TASK-20260718-007`，交 TT 重出 Android launcher 专用 rework 包：保留第三版 / `rounded rect v2 decorated` 概念，重新输出 adaptive foreground/background、必要 legacy、圆形与 squircle 预览、manifest/self check。
- yiyi 暂不自行改 icon 形状；等 TT 包经 PM/Ant 视觉确认后再接入。旧 `ic_launcher_round.png` 仍作为 cleanup candidate，待新包验证后处理。

## PM update - TT TASK-20260718-007 launcher rework intake (2026-07-18)

- TT 已完成 `TASK-20260718-007` Android launcher 黑边适配重出包，路径：`design/authority/icon_start_tt/icon/android_launcher_rework/`。
- PM 静态复核通过，记录见 `00_harness/05_reports/validation/PM_REVIEW_TT_APP_ICON_ANDROID_LAUNCHER_REWORK_20260718.md`；任务状态转 `review`，等待 Ant大小姐看预览确认。
- 本包保留 Ant 已确认第三版 icon 概念，只修 launcher mask 适配：浅色不透明 adaptive background、放大 foreground、legacy flatten，避免圆形/圆角 launcher 露黑边。
- yiyi 暂不接入；只有 Ant 确认后才可按 manifest copy 到 Android。
- Cleanup candidate: 旧 `android/app/src/main/res/mipmap-*/ic_launcher_round.png`。新包接入验证后必须删除或重生成，避免旧 round fallback 把黑边带回来。

## PM update - TT TASK-20260718-007 Ant reject (2026-07-18)

- Ant大小姐复核 TT `android_launcher_rework` 预览后判定不通过：问题不是黑边颜色，而是圆形 launcher 内仍然能看到原正方形 / 圆角矩形卡片边界，像把方形图强行裁进圆形 mask。
- PM 已登记 reject，记录见 `00_harness/05_reports/validation/PM_REVIEW_TT_APP_ICON_ANDROID_LAUNCHER_REWORK_ANT_REJECT_20260718.md`。
- `TASK-20260718-007` 状态改为 `rework`；该包不得交 yiyi 接入。
- TT 新要求：保留第三版 icon 人物与气质，但必须做 round-safe / adaptive-safe 重出包；round 预览必须不出现明显内层方框边界，同时给 round / squircle / legacy 预览与接入口径。

## PM update - yiyi TASK-20260718-004 diff table accepted (2026-07-18)

- yiyi 已确认收到 `TASK-20260718-004` UI ownership gate，并按要求先回传差异表，未直接动代码。报告：`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_004_diff_table_20260718.md`。
- PM 复核通过，记录见 `00_harness/05_reports/validation/PM_REVIEW_YIYI_004_DIFF_TABLE_20260718.md`。
- 核心判断：HUD icon button 主要问题是 Compose 默认 elevation shadow 太实体；Dialog 用错 token，Android 无真实 background blur 时应走 section 16.5 no-real-blur fallback；speaker 缺 gold halo。Title chip / action chip 数值已对齐，不改。
- 优先级裁决：先执行 `TASK-20260718-006` opening 背景错 / opening 点不动 / BGM 断链功能 P0，再执行 004 UI 受控修正。
- 004 后续只允许修改 `NagiIconButton.kt`、`NagiDialog.kt`、`DialogueLayer.kt`、`BacklogScreen.kt`；不得改 story-data、BG mapping、TT Start、App Icon、BGM、Web、资源清理。

## PM update - TT TASK-20260718-007 v2 Ant reject (2026-07-18)

- TT 回传 `android_launcher_rework_v2/` 后，Ant大小姐复核指出 squircle 预览仍像原 rounded-rect / 方形卡片样子。
- PM 判断：v2 round-first 相比 v1 有改善，但 Android launcher 不只有 round；squircle / legacy 也必须不读成“原卡片被塞进 mask”。因此 v2 不得交 yiyi。
- 已登记 reject：`00_harness/05_reports/validation/PM_REVIEW_TT_APP_ICON_ANDROID_LAUNCHER_REWORK_V2_ANT_REJECT_20260718.md`。
- 已追加通知 TT：下一版命名 `android_launcher_rework_v3/`，必须分别说明 round / squircle / legacy 如何避免卡片感。

## PM update - Wewe TASK-20260718-005 Web P1 review intake (2026-07-18)

- Wewe 已回报 `TASK-20260718-005` Web P1 controlled continuation 完成，报告：`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_p1_controlled_continuation_20260718.md`。
- 完成项：NagiDialog 替代 native confirm、Save/Load 覆盖提示、Settings BGM 音量右对齐、Web BGM、打字机跳过、PWA/favicon/icon、Chapter Clear actions + 跳过本节。
- PM 静态复核通过，记录见 `00_harness/05_reports/validation/PM_REVIEW_WEWE_WEB_P1_CONTROLLED_CONTINUATION_20260718.md`；状态转 `review`，等待 Ant 浏览器视觉/交互确认。
- JS 语法检查通过；native `confirm()` 已替换；`assets/bgm.mp3` 与 TT authority icon 文件存在；本地 repo server 下路径可用。
- Scope：Wewe 回报 `Android touched: no`，PM 未发现本轮 Web P1 有 Android 范围扩张。当前 `git status` 中 Android 改动来自共享工作区其他 Android/yiyi 任务，不能归因给 Wewe 本轮。
- Caveat：PWA 生产部署后续可能需要把 icon 从 `design/authority/...` 复制到发布路径；Service Worker 仍 P2；Section Clear independent phase 仍等待 Web controller 支持。

## PM update - App Icon pause after v3 review (2026-07-18)

- Ant大小姐复核 TT App Icon launcher v3 后决定暂停 icon 事项：v3 虽然去掉了 v1/v2 的“卡片套卡片”问题，但人脸裁切过狠，人物显示不完整。
- `TASK-20260718-007` 不交 yiyi 接入；不再消耗 TT / yiyi token 继续 icon。
- 当前 yiyi 优先处理 `TASK-20260718-006` Android 功能 P0：opening 背景错、opening 点不动、BGM 断链；006 后再处理已通过 PM diff-table 的 `TASK-20260718-004` UI 受控修正。

## PM dispatch - yiyi execute 006 then 004 (2026-07-18)

- Codex token 紧张，但 Claude/yiyi 仍可继续工作。
- PM 已新增派发文件：`00_harness/04_execution/pm/PM_AGENT_INBOX/PM_DISPATCH_TO_YIYI_20260718_EXECUTE_006_THEN_004.md`。
- yiyi 当前顺序：先执行 `TASK-20260718-006` Android 功能 P0（opening 背景错 / opening 点不动 / BGM 断链），006 回传后再执行 `TASK-20260718-004` UI 受控修正。
- App Icon launcher rework 暂停，不得接入 TT v1/v2/v3，不得混入 006 或 004。
- PM 已补充 loop 双通道规则：即时派发必须同时写 PM inbox 文件并发 worker 窗口/线程消息。
- 已向 Claude/yiyi 窗口直接发送该派发消息，当前等待 yiyi 执行 006。

## PM update - yiyi TASK-20260718-006 review intake (2026-07-18)

- yiyi 已回报 `TASK-20260718-006` 完成并转 review，报告：`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_006_functional_bugs_fix_20260718.md`。
- PM 静态复核通过，记录见 `00_harness/05_reports/validation/PM_REVIEW_YIYI_006_FUNCTIONAL_BUGS_FIX_20260718.md`。
- 修复点：transition return 前更新 pending node `bgAssetPath`；ChapterOpeningOverlay / SectionOpeningOverlay 增加 root clickable；新增 `android/app/src/main/assets/bgm/bgm.mp3`，hash 与 root `assets/bgm.mp3` 一致。
- 状态：review，等待 Ant 实机构建验证；不得标 done。
- yiyi 可继续执行 `TASK-20260718-004` UI 受控修正；004 仍只允许改 `NagiIconButton.kt`、`NagiDialog.kt`、`DialogueLayer.kt`、`BacklogScreen.kt`，不得混入 BGM/App Icon/Web/story-data/BG mapping/资源清理。
- 已向 Claude/yiyi 窗口直接发送继续执行 004 的消息；双通道完成，等待 yiyi 回传 004。
## PM decision - Android UI implementation ownership transfer (2026-07-18)

- Ant大小姐 real-device verification after yiyi `TASK-20260718-004` still shows the prior UI feedback unresolved: navigation/HUD, dialog, and chapter catalog/chapter-related UI do not match current UI authority.
- PM decision: yiyi no longer owns Android visual/UI implementation tasks. yiyi may still handle non-visual Android tasks only if PM explicitly assigns them.
- App Icon launcher V4 is visually approved by Ant but is not sent to yiyi now, because yiyi Android visual ownership is frozen.
- New Android UI developer takeover task opened: `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_NEW_ANDROID_UI_DEV_20260718_AUTHORITY_IMPLEMENTATION_TAKEOVER.md`.
- Failure review: `00_harness/05_reports/validation/PM_REVIEW_ANDROID_UI_REAL_DEVICE_FAIL_YIYI_004_20260718.md`.
- New dev first step is read-only authority diff; no code changes until PM approves the exact implementation scope.

## PM dispatch confirmation - yiyi 004 resend (2026-07-18)

- Ant reported the previous Claude/yiyi dispatch was not received. PM 一一 resent the full `TASK-20260718-004` controlled UI correction instruction directly in the Claude/yiyi window and visually confirmed delivery: the message appeared in the chat, the input box cleared, and yiyi started processing `TASK-20260718-004 UI受控修正`.
- Current yiyi queue: `TASK-20260718-004` only. `TASK-20260718-006` remains in `review` awaiting Ant real-device verification.
- 004 allowed files only: `NagiIconButton.kt`, `NagiDialog.kt`, `DialogueLayer.kt`, `BacklogScreen.kt`.
- 004 forbidden scope: title/action chip, BGM, App Icon, Web, story-data, BG mapping, TT Start, resource cleanup.
- Cleanup status: none.
# Latest Staffing / Ownership Override - 2026-07-18

- `yiyi` is inactive / 离职. No new tasks should be assigned to yiyi.
- `PP` is the current Android developer replacing yiyi.
- `DeDe` is the current Codex-side QA owner and must work in the real repository `D:\Nagi's Heart\NagisHeart`.
- `Wewe` remains Web developer; Web-only scope.
- New DeDe QA task: `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_DEDE_20260718_CODEX_QA_REBOOT_AND_WEB_MOBILE_REGRESSION.md`.

---
