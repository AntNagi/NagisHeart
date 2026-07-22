# 任务板

> 用途：当前唯一正式任务源（含优先级，不再有单独 priorities 文件）。
> 原则：只有写进本文件、明确负责人和状态的事项，才算正式可执行任务。新任务追加在最上方。协作规则 v2 见 `00_harness/README.md`。
> 2026-07-21 大扫除：历史任务全量归档至 `task_board_archive_20260715_20260721.md`，本板只保留活跃任务 + 关闭台账。
> QA 口径（2026-07-21 起）：agent QA 停用，**Ant 本人实机/浏览器测试是唯一验收关口**；开发交付物应尽量是截图/对比图而非文字清单。

---

## 当前优先级

1. `TASK-20260723-002` Android 三个 authority 页面实现：大章开始 / 大章结束 / 结局页 - Sai
2. `TASK-20260722-001` Android 剧情路由 + 结局画廊 BG 链路 P0 审计/修复 - PP（先 Phase A 证据表，PM/Ant 确认后 Phase B）
3. ✅ 截图对比验收工具已上线（07-21）：`node tools/ui-snapshot.js all` 一键生成权威 18 页期望图 + Web 18 状态实现图 + 并排报告 `00_harness/05_reports/ui_baseline/compare_report.html`。`TASK-20260721-006` 的验收直接看该报告（TASK-20260721-008 完成后覆盖 18/18）
4. `TASK-20260721-006` Web 90 项对齐验收 - Ant
5. `TASK-20260719-016` locked 标题隐私修复 - PP
6. `TASK-20260719-004` 代码健康专项 - PP 执行 / feibo 把关；`TASK-20260721-003` V3_1 审计 - PM 一一 执行 / feibo 指导
7. 小项：002 回顾末行裁切（PP）、004 补 BG（lulu/TT）、005 开放日复验（Ant）——由 PM 一一 跟催

---

## 活跃任务

### TASK-20260723-002
- 标题：Android 实现三页 UI authority：大章开始 / 大章结束 / 结局页
- 负责人：Sai（Android）
- 状态：review
- 优先级：P0
- 来源：Ant 2026-07-23 浏览器确认；XoXo 已将数值写入 `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` section 23，并同步可视 HTML `authority/ui/NagisHeart_UI_Authority_XoXo_v1_0.html`。
- 目标：只实现三页视觉与动作层级，不改剧情正文、不改 BG mapping、不改 Web、不改 TT Start / App Icon、不删除资源。
- 必读：
  1. `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` section 23。
  2. `authority/ui/NagisHeart_UI_Authority_XoXo_v1_0.html` 中 `chapter-opening` / `chapter-clear` / `ending` 三个 view。
  3. 现有 Android active files：`android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GameScreen.kt`、`ChapterOpeningScreen.kt`、相关 ending / chapter overlay active path。若发现重复实现路径，先标出 active path，不得盲改 stale 组件。
- 实现要求：
  - 大章开始：纯暗底整屏分割页；不使用 story BG；不使用卡片、边框、毛玻璃；底部 `轻触继续`。
  - 大章结束：纯暗底弱化分割页；`Chapter Clear` 下方短线；主动作 `进入下一章` 无背景；底部弱化小字 `返回主页`；不得做成 Button / ChipButton / glass bar。
  - 结局页：使用 `assets/bg/true_end.jpg`；整屏诗性排版，不使用旧 ending-card；不毛玻璃、不边框；`TRUE END` 为 18sp 无衬线金色标识，短线在其下；不显示 `Ending unlocked`；唯一动作 `返回主页` 无背景。
- 禁止样式：
  - 毛玻璃结局卡；
  - 半透明黑块压住角色脸；
  - 主按钮背景 / 填充 / 边框 / glass bar；
  - 大章结束使用 story BG 或 clear-card；
  - 把 `返回主页` 做成大章结束主动作；
  - 可视 UI 出现 PM/dev/internal/candidate 文案。
- 验收证据：完成后把 3 张 Android 截图放入 `00_harness/05_reports/TASK-20260723-002/`：大章开始、大章结束、结局页。每张截图需能看出关键差异；若本机无法截图，必须写明阻塞原因和已完成代码路径。
- 完成定义：Sai 提交 Android 改动 + 三张截图；Ant 实机/截图确认通过后转 done。
- 决策记录：`DEC-20260723-002`
- Sai 执行记录（2026-07-23）：已完成 Android active path 改造，报告见 `00_harness/05_reports/TASK-20260723-002/android_three_authority_pages_report.md`。`GameScreen.kt` 当前 `GamePhase.ChapterTransition / ChapterEnding / Ending` 已切到 authority 三页组件；`ChapterOpeningScreen.kt` 独立路由版本同步改为纯暗底；`NagiTokens.kt` 新增 authority 暗底 token，未在 UI 层新增硬编码色。Ant 纠正后，结局页未固定使用 TRUE 示例图，正常使用当前 `end_*` node 的 `bgAssetPath`，`true_end.jpg` 仅作异常兜底。校验：`node tools/validate.js` 通过；`tools/check-tokens.ps1` 通过。阻塞：本机无 `android/gradlew.bat`、无 `gradle-wrapper.jar`、无系统 Gradle，无法产出 Android 截图；需 Ant / 有构建环境机器补三张实机/模拟器截图后确认。
- 最新更新时间：2026-07-23

### TASK-20260722-002
- 标题：替换 `c2 | 假期的消息` 剧情并同步 runtime story-data
- 负责人：PM 一一
- 状态：done
- 优先级：P0
- 说明：Ant 提供新版 c2 剧情，已替换 `authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md` 对应段落，并按现有 runtime 结构拆入 `story-data/nodes.json`：`c2` 保留开场消息与首个选择，`c2_s2` 承载扩展告白/公寓/一一确认段落与最终两项选择。现有 `flow.default.c2_s2 → e_invite` 未改，因此最终选择回复结束后继续进入“高级公寓的邀请”。
- 决策记录：`DEC-20260722-002`
- 校验：`node tools/validate.js` 通过，0 errors / 1 existing hardcoded-Ant warning。
- 最新更新时间：2026-07-22

### TASK-20260722-003
- 标题：替换 `e_invite | 高级公寓的邀请` 剧情并同步 runtime story-data
- 负责人：PM 一一
- 状态：done
- 优先级：P0
- 说明：Ant 提供新版 e_invite 剧情，已替换 `authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md` 对应段落。runtime 按交互结构拆入 `story-data/nodes.json`：`e_invite` 承载公寓初访至两项玩家选择；新增 `e_invite_s2` 承载两项选择后的共通“临时访客档案/门禁权限”段落，并通过 autoAdvance 跳转 `e_lolly`。两项玩家选择均显式 target `e_invite_s2`，避免选完直接跳过共通剧情。
- 决策记录：`DEC-20260722-003`
- 校验：`node tools/validate.js` 通过，0 errors / 1 existing hardcoded-Ant warning。
- 最新更新时间：2026-07-22

### TASK-20260723-001
- 标题：替换 `e_depart | NEL启程·闭关送别` 剧情并同步 runtime story-data
- 负责人：PM 一一
- 状态：done
- 优先级：P0
- 说明：Ant 提供新版 e_depart 剧情，已替换 `authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md` 对应段落。runtime 按两轮选择结构拆入 `story-data/nodes.json`：`e_depart` 承载 NEL 通知、出发等待与第一轮选择；`e_depart_s2` 承载门禁/存档/一一/拖鞋确认、玄关靠肩与第二轮选择；`e_depart_s3` 承载电梯送别和公寓 aftermath，并 autoAdvance 跳转 `c6a`。第一轮两项选择均 target `e_depart_s2`，第二轮两项选择均 target `e_depart_s3`。
- 决策记录：`DEC-20260723-001`
- 校验：`node tools/validate.js` 通过，0 errors / 1 existing hardcoded-Ant warning。
- 最新更新时间：2026-07-23

### TASK-20260722-001
- 标题：Android 剧情路由 + 结局画廊 BG 链路 P0 审计/修复
- 负责人：PP（Android / story-data runtime）
- 状态：ready
- 优先级：P0
- 背景：Ant 反馈两类主流程问题：① 第六部"开放日/采访后剧情乱"，实测疑似"采访之后直接进读书之秋"，需全面检查路由设计；② 回忆画廊除 TRUE END 外其他结局 BG 不对，疑似未按结局 node 指定 BG。
- Phase 0（先补权威，不让开发猜）：已完成。Ant 指定并已写入 `authority/visual_mapping/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md`：`end_true → assets/bg/true_end.jpg`；`end_good → assets/bg/king.jpg`；`end_normal → assets/bg/ending_true_nagi_soft_gaze.jpg`；`end_bad → assets/bg/goal_faraway.jpg`。已记录 `DEC-20260722-001` 并更新 `authority/MANIFEST.md` 哈希。校验：BG Mapping 本身 OK；全量 check 暂因节点匹配表 xlsx 被外部程序占用未跑完。
- PM 初查证据：
  - `story-data/flow.json` 当前明确写有 `"club_media": "e_autumn"`，即"它翻译得很对，但不像我 / 采访媒体室"后接"读书之秋"。
  - PM 对照结论（2026-07-22）：`club_media → e_autumn → e_halloween → e_drive → route_mj_hidden` 与 `authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md` 5634 行主链、`authority/story_logic/NagisHeart_Design_V3_1_Latest_UtopiaAdded.md` 363-367 / 1458-1464 行一致。**这条跳转本身不改**；若 Ant 仍觉得观感乱，另开剧情内容/章节呈现复验，不由 PP 擅改 flow。
  - 权威剧本 `authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md` 明确存在独立结局剧情：`dream_final` 后分 TRUE/GOOD，`stay_final` 后 NORMAL，`bad_far` 后 BAD；不是只有 EndingOverlay 卡片。
  - 运行 `story-data/nodes.json` 也存在 `end_true` / `end_good` / `end_normal` / `end_bad` 四个剧情 node，且有 dialogue 正文。
  - Android `StoryEngine.resolve()` 当前在 `isNode(currentId)` 前先判断 `isEndingNode(currentId)`；因此目标进入 `end_*` 时会直接返回 `EndingReached`，跳过 `nodes.json` 里的四段独立结局剧情。这是 P0 主流程嫌疑点，必须纳入 Phase A/Phase B。
  - `story-data/endings.json` 四个结局均有 `endingNode`：`end_true` / `end_good` / `end_normal` / `end_bad`，但 `authority/visual_mapping/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md` 未列这四个 node；权威 BG mapping 使用的是前置结局卡节点 `dream_final` / `stay_final` / `bad_far`。
  - 权威 BG mapping 当前写法：`dream_final` → `assets/bg/true_end.jpg`，GOOD 仅说明可保留 `ending_candidate_crystal_king.jpg` 作为候选/彩蛋；`stay_final` → `assets/bg/bg_stay_final_tv_glow_living_room.png`；`bad_far` → `assets/bg/goal_faraway.jpg`。
  - 运行 `story-data/scene_visuals.json` 当前写法：`end_true` → `true_end.jpg`，`end_good` → `ending_candidate_crystal_king.jpg`，`end_normal` → `bg_stay_final_tv_glow_living_room.png`，`end_bad` → `bg_bad_far_award_broadcast.png`。其中 BAD 与权威 `bad_far → goal_faraway.jpg` 明显不一致；GOOD 也需确认“候选/彩蛋”是否已被 Ant 定为正式结局图。
  - Android `GalleryScreen.kt` 读取 `progressManager.getEndingBgPath(key) ?: viewModel.getEndingFallbackBg(key)`；`GameViewModel.showEnding()` 当前以 `_uiState.value.bgAssetPath` 调 `progressManager.unlockEnding(...)`，存在把"进入结局前当前背景"存进画廊的风险。
- Phase A（只读，Phase 0 确认后再交 PP；先交 PM/Ant）：输出一张证据表到本条目下（不要新建 dev_reply 文件）：
  1. 剧情路由全链路表：`chapters.json` section → `flow.json` next → `routers.json` 分支 → 实际下一节点，重点覆盖 `club_media → e_autumn`、第六部全段、part8 三结局路径、所有 `ending_resolver` 前置节点。
  2. 独立结局剧情链路表：`dream_final/stay_final/bad_far` → `ending_resolver` → `end_*` → 应播放的 `nodes.json` dialogue → 何时显示 EndingOverlay。必须说明当前 Android 是否跳过 `end_*` 正文。
  3. 对比 `authority/story_logic/` 与运行 `story-data/`：标出"设计如此"、"数据疑似错接"、"需 Ant 拍板"三类，不得擅自改剧情顺序。
  4. 结局画廊 BG 链路表：endingId → endingNode → authority BG mapping 对应节点/图片 → scene_visuals.bg → showEnding 解锁时存储值 → GalleryScreen 实际显示值。必须覆盖 TRUE/GOOD/NORMAL/BAD 四个结局。
  5. 明确判断：运行数据是否需要补齐/改写为 `end_*` 与权威 BG mapping 的一一对应；画廊 BG 是否应以 endingNode 对应的权威 BG 为 source of truth；旧 progress 中 `ending_bg_*` 是否应清理/迁移/忽略。
- Phase B（需 PM/Ant 批准后才可改）：
  - 若路由是数据错误，只改 `story-data` 与 Android assets 同步副本；若是设计缺口，先回 PM/Ant，不写新剧情。
  - 若引擎跳过独立结局剧情，必须修为先播放 `end_*` node dialogue，结束后再显示 EndingOverlay；不得删除 `end_*` node，也不得把结局剧情塞进 EndingOverlay。
  - 若画廊 BG 链路错误，最小修复原则：解锁时存 endingNode BG，或 Gallery 直接以 endingNode BG 为准；不得继续使用进入结局前的任意当前背景作为权威图。
  - 修改后必须在模拟器用 DEBUG 结局入口产出四张画廊卡片截图 + 四张结局详情截图，证据放 `00_harness/05_reports/TASK-20260722-001/`。
- PM 明确修改逻辑（2026-07-22，给 PP 执行，不再开放式猜测）：
  1. **保留第六部主链**：不得改 `flow.json` 的 `club_media → e_autumn`、`e_autumn → e_halloween`、`e_halloween → e_drive`、`e_drive → route_mj_hidden`。
  2. **修结局播放模型**：`end_true/end_good/end_normal/end_bad` 是正常剧情 node，不是直接终止页。`StoryEngine.resolve()` 不得在命中 `end_*` 时立即返回 `EndingReached` 并跳过 node dialogue。推荐实现：优先按 `isNode(currentId)` 返回 `Found`；在 `end_*` node 自身播放完毕后，再触发 EndingOverlay。
  3. **EndingOverlay 触发点**：当当前 nodeId 是 `end_*` 且该 node dialogue/choices 已播放结束、没有下一跳时，调用 `showEnding()`。不要在 `ending_resolver` 刚解析到 `end_*` 时调用 `showEnding()`。
  4. **结局解锁与画廊 BG**：`showEnding()` 解锁时使用 final ending id 和 `authority/visual_mapping` 中 `end_*` 对应 BG：TRUE=`true_end.jpg`、GOOD=`king.jpg`、NORMAL=`ending_true_nagi_soft_gaze.jpg`、BAD=`goal_faraway.jpg`。不得传 `_uiState.value.bgAssetPath` 这种“上一画面当前背景”。
  5. **运行数据同步**：同步修 `story-data/scene_visuals.json` 及 Android assets 内运行副本，让 `end_*` 四个 node 的 BG 与 Phase 0 权威一致。若 Android assets 由构建脚本复制，报告实际同步机制；不得只改根 `story-data` 导致 APK 仍旧。
  6. **旧进度兼容**：画廊读取时不得被旧 `ending_bg_*` 错误缓存覆盖。方案可选：忽略旧缓存、迁移为新权威 BG、或在 `getEndingBgPath()` 里按 endingId 返回权威 BG；必须在报告中说明。
  7. **证据截图**：每个结局都要有两段证据：A）`end_*` 独立剧情正文正在播放的截图；B）该 node 播完后的 EndingOverlay 截图；另加 Gallery 四卡 BG 截图。缺任何一类不能转 review。
- 禁止范围：不改 UI 风格、不改 TT/Icon/Start、不改 Web、不删除资源、不做大规模重构；`authority/` 若需改，必须先 PM/Ant 确认并同步 MANIFEST。
- 完成定义：Phase A 表格经 PM/Ant 确认；Phase B 后四结局画廊 BG 与 endingNode BG 一致，路由表无未解释跳转，Ant 实机/截图验收通过。
- 最新更新时间：2026-07-22
- Sai 执行记录（2026-07-22）：已完成 Android 代码/运行数据修复，报告见 `00_harness/05_reports/TASK-20260722-001/android_ending_chain_fix_report.md`。关键改动：`StoryEngine.resolve()` 先返回 `end_*` node；`GameViewModel` 在 `end_*` 播放完且无下一跳、或 `end_*` 自身 auto ending choice 后触发 EndingOverlay；`showEnding()` / Gallery 以 endingNode BG 为准并忽略旧 `ending_bg_*` 缓存；根 `story-data/scene_visuals.json` 与 Android assets 副本已同步四个最终 BG。`node tools/validate.js` 通过。阻塞：本机无 `gradlew.bat` / `gradle-wrapper.jar` / 系统 Gradle，未能产出 Android 截图；截图补齐前不要转 done。

### TASK-20260721-006
- 标题：Web 90 项 authority 对齐浏览器验收
- 负责人：Ant（验收）
- 状态：ready
- 优先级：P1
- 说明：07-21 已提交的 90 项 Web UI 对齐（commit `e728137`，明细见 `web/SYNC_LOG_20260721_WEB_UI_AUTHORITY.md`）需 Ant 桌面 + 移动视口过一遍。通过则 Web 线收口；不符项拍图回报，feibo/Wewe 修。
- 最新更新时间：2026-07-21

### TASK-20260719-016
- 标题：Android 章节目录 locked 标题隐私修复
- 负责人：PP（Android）
- 状态：review
- 优先级：P1
- 说明：locked 条目须显示中性文案（如"？？？"或"未解锁章节"），不暴露未来真实标题；unlocked/current/completed 不变。**feibo 07-21 代码核验：仍未修**——`ChapterScreen.kt:205` locked 行仍渲染 `item.sectionTitle` 真实标题（仅压 alpha 0.52）。本条目即完整任务说明，无需读旧任务单。
- 完成定义：locked 显示中性文案；unlocked/current/completed 仍显示真实标题；截图两种状态给 Ant。
- 完成：`2238b5a` locked 行标题→"？？？"、副标题→"未解锁章节"；alpha 0.52 + 状态文字"未解锁"不变。待 Ant 实机截图验收。
- feibo review（2026-07-21）：静态通过。两行条件渲染，范围干净。注：locked 条目章节名一并遮蔽属从严处理，可接受；若 Ant 希望当前大章内 locked 小节保留大章名，实机反馈后一行改回。
- 最新更新时间：2026-07-21

### TASK-20260721-002
- 标题：剧情回顾最后一行裁切重修
- 负责人：PP（Android）
- 状态：review
- 优先级：P2
- 说明：Ant 07-20 实机复验最后一行仍显示不全；MinSpec §21.2 第 4 行原"已通过"记录已作废（07-21 修正）。根因方向：`BacklogScreen.kt` 固定 `ENTRIES_PER_PAGE = 8`，与 §17.4"固定 8 条导致裁切"禁止项冲突；改为按可用高度动态分页或保证末行完整。
- 完成定义：小屏/大屏实机截图证明末行完整。
- 完成：`625b3ea` 保留 ENTRIES_PER_PAGE=8 分页不变，给页内 Column 加 verticalScroll，内容超出时可滚动查看末行。待 Ant 实机验收。
- feibo review（2026-07-21）：**方向保留意见**。页内 verticalScroll 与 Ant 07-17 交互权威"剧情回顾不要滚屏、改为翻页"冲突——等于用被否掉的交互掩盖被禁止的裁切。裁决交 Ant 今晚实机：(a) 正常浏览经常触发滚动 → 打回，改按可用高度动态分页（页容量=实际放得下的条数，无页内滚动）；(b) 8 条几乎总放得下、滚动仅极端长文本兜底 → 可接受，但须在交互权威补一行 fallback 口径并走 MANIFEST 流程。
- 最新更新时间：2026-07-21

### TASK-20260719-004
- 标题：Android/Web release-readiness 代码健康专项（token 归一 + 死代码 + 结构）
- 负责人：PP（执行）/ feibo（把关）
- 状态：in_progress
- 优先级：P1
- 说明：原 0719 只读审计任务，按 feibo 07-21 诊断重定scope：① token 归一——Android UI 层约 200 处硬编码 `Color(0x…)`（GameScreen 57 处）、Web 123 处硬编码 rgba 收进 token 层，加静态检查防回潮；② 死代码清除——`SectionClearScreen.kt`、`Routes.SECTION_CLEAR`、`advanceAfterSectionClear()`（0719-011/013 确认的 cleanup candidates）；③ GameScreen(34KB)/GameViewModel(30KB) 职责拆分评估。
- 进度：
  - ② 死代码清除已完成（`ea9bac9`）——SectionClearScreen.kt 删除、Routes.SECTION_CLEAR 移除、advanceAfterSectionClear() 移除。feibo review：147 行清零、全仓库无残留引用，通过。
  - ① Android token归一完成（`c3e71b7`→`3266fba`→`61f2677`，4 批提交）：NagiTokens.kt 新增 26 个语义 token。ui/（theme/ 除外）约 180 处 Color(0x…) → token 引用。残留仅 DebugOverlay（debug-only）+ 5 处 unique 单用基色。值变更差异：零。
  - C. `tools/check-tokens.ps1` 防回潮脚本已完成：Android grep `Color(0x` + Web grep `rgba(` 非 token 文件即 fail；`// token-exempt` 标记豁免。当前 pass。
  - ③ GameScreen/GameViewModel 拆分评估（PP，不动手拆）：
    - **GameViewModel.kt（725 行）现职责**：(1) 数据加载 loadData；(2) 存档管理 save/load/autoSave 7 个方法；(3) 设置管理 get/updateSettings；(4) 引擎驱动 navigateToNode/enterNode/onTap/onChoiceSelected（核心 250 行）；(5) 对话序列 showDialogueLine/advanceDialogue/presentChoices/showResponseLine 等（150 行）；(6) Auto/Skip 模式控制 toggle/timer/loop（90 行）；(7) 回放模式 startReplay/stopReplay；(8) 进度查询 getUnlockedNodes/getSectionState/getChapters 等代理方法（~10 个一行方法）；(9) BGM 代理 pause/resumeBgm。
    - **GameScreen.kt（864 行）现职责**：(1) 主 Composable 含 phase 分发逻辑（~100 行）；(2) 7 个 private Composable 子组件：EndingOverlay(232 行)、ChapterOpeningOverlay/SectionOpeningOverlay(各 60 行)、ChapterEndingOverlay(70 行)、ReplayCompleteOverlay(30 行)、PosterPageBackground(15 行)、GlassBacking/ClearCard/KickerLabel(共 90 行，布局模板)。
    - **建议拆分边界**：(A) GameScreen → 主屏 + 5 个独立文件（EndingOverlay、ChapterOpeningOverlay、SectionOpeningOverlay、ChapterEndingOverlay、ReplayCompleteOverlay），每个自成 @Composable；GlassBacking/ClearCard/KickerLabel/PosterPageBackground 提为 component/。(B) GameViewModel → 引擎核心不拆；存档/设置/进度查询 delegate 到独立 Manager（现已有 SaveManager/ProgressManager，ViewModel 只做代理——考虑直接让 Screen 层持有 Manager 或注入 UseCase，减少 ViewModel 透传）。Auto/Skip 逻辑可提为 AutoPlayController 内部类。
    - **风险**：(1) GameScreen 拆分低风险，纯 UI 提取，无共享状态；(2) ViewModel 拆分中风险——enterNode 和对话序列紧耦合 _uiState，拆出去需要回调或 SharedFlow，复杂度可能增加而非降低；(3) 当前 864+725=1589 行对一个 VN 游戏主画面来说可接受，拆分收益主要在可维护性而非功能需求。
    - **结论**：建议先做 (A) GameScreen UI 提取（低风险、高可读性收益），(B) ViewModel 暂不拆（紧耦合的引擎/对话状态机拆出去未必更好）。feibo 裁决。
  - feibo 裁决（2026-07-21）：③ 评估质量合格。**采纳 B——ViewModel 不拆**（1589 行对 VN 主画面可接受，紧耦合状态机强拆反增复杂度）；**批准 A 为后续 P2**（EndingOverlay 等 7 个 private Composable 提取成独立文件），但**暂缓执行**：等今晚 Ant 实机确认 token 归一零视觉变更后再排期，避免多层改动叠加难以定位回归。004 执行项全部收口，转 review。
  - feibo 流程提醒（2026-07-21）：①B Web css 与 008 工具改动曾停留工作区未提交（板已记完成、git 无账），由 feibo 代为分类收口提交。**v2 规则重申：做完即提交推送，板上写完成的前提是 push 成功。**下轮 PP/Wewe 会话需遵守。
  - ① B. Web tokens.css 归一完成：tokens.css 新增 65 个语义 token（snow/parchment/deep/hud-blue/gold/black/white/ink/gray-blue + misc），8 个 CSS 文件（choice/prologue/start/name-setup/dialogue/hud/overlays/transitions）全量 103 处 rgba() → var() 引用。零值变更。lint 通过。
- feibo 方向（2026-07-21，① token 归一执行口径）：
  - A. Android：盘点 `ui/`（theme/ 除外）全部硬编码 `Color(0x…)`，在 `ui/theme/` 按 authority 语义命名新增 token（命名对齐 MinSpec §17 token 表，如 GlassBg、GoldSpeaker、ScrimHeavy），替换引用。**铁律：替换过程数值零变更**；发现代码值与 authority 值不一致的，不得顺手"修正"，记入差异清单贴在本条目下交 feibo 裁决。按文件小步提交。
  - B. Web：同理，散落 rgba 收进 `tokens.css` 变量，规则同上。
  - C. 防回潮：新增 `tools/check-tokens.ps1`（grep `ui/` 非 theme 的 `Color(0x` 与 css 非 tokens 的 `rgba(`，非零即 fail），并写进协作规则会话启动可选项。
  - ③ GameScreen/GameViewModel 拆分：PP 只出评估（现职责清单、建议拆分边界、风险，几行写在本条目下），**不动手拆**，feibo 看完评估再裁决。
- 最新更新时间：2026-07-21

### TASK-20260721-003
- 标题：V3_1 ↔ story-data 全量差异审计
- 负责人：PM 一一（执行）/ feibo（指导）
- 状态：queued
- 优先级：P1
- 说明：剧情逻辑 coreDesign（V3.1）与运行数据逐项比对，输出差异裁决表交 Ant。已实锤一处：GOOD END 标题 V3_1"那么完美，那么爱你" vs 运行数据"那么完美，那么爱他"。
- 最新更新时间：2026-07-21

### TASK-20260721-004
- 标题：补齐 2 张缺失 BG
- 负责人：lulu / TT（视觉）
- 状态：pending
- 优先级：P2
- 说明：`assets/bg/goal.jpg`（c6a 节点）、`assets/bg/bg_scarf_flower_delivery.jpg`（e_scarf 节点）引用缺失（validate.js WARN）；另 UI 权威板结局页引用的 `assets/bg/worldstage.jpg` 也缺失（07-21 截图基线发现）。补图或改映射。
- 最新更新时间：2026-07-21

### TASK-20260721-005
- 标题：开放日"剧情和选项乱掉"实机复验
- 负责人：Sai（Android 运行层排查）+ Ant（实机复验）
- 状态：review
- 优先级：P1
- 说明：2026-07-22 PM 复查 story 源头：权威剧本 `u20j → c3 → e_lemontea → c2 → e_invite → e_lolly` 与 `story-data` 当前链路 `u20j → c3 → c3_s2 → e_lemontea → e_lemontea_s2 → c2` 语义一致；`chapters.json` 第二部第一节 startNode=`c3`，第二节 startNode=`e_lemontea`；`scene_visuals.json` 中 `c3 → openday.jpg`、`e_lemontea → lemontea.jpg`。暂未发现 story-data 路由把开放日接错到读书之秋。若实机仍复现“开放日剧情/选项乱”，优先查 Android 运行层：存档恢复位置、choice responses → pendingNextId、section transition、autoAdvance/箭头过滤、backlog/responseQueue 状态污染。注意：`GameViewModel.presentChoices()` 中箭头过滤字面量疑似乱码 `鈫?`，虽有 `autoAdvance` 保护，但必须列入实现风险检查。
- 验收证据：Sai 必须从 clean new story 或明确清空 autosave 的状态，截图证明 `u20j → c3 → c3_s2 → e_lemontea → e_lemontea_s2 → c2` 每个节点的 sceneTitle / 当前 nodeId / 背景 / 首末两句文本；不能只口头说校验器通过。
- Sai 执行记录（2026-07-23）：已按 PM 一一口径完成 Android 运行层静态排查，报告见 `00_harness/05_reports/TASK-20260721-005/android_open_day_runtime_audit.md`。runtime 数据表确认 `u20j → c3 → c3_s2 → e_lemontea → e_lemontea_s2 → c2`，`c3/c3_s2` BG 均为 `openday.jpg`，`c3` 四个选择均 target `c3_s2`，`c3_s2` 后进 `e_lemontea`，`e_lemontea_s2` 后按 flow 进 `c2`；未改开放日剧情/顺序/story-data。最小代码修正：`GameViewModel.presentChoices()` 改为统一调用 `StoryEngine.getPlayerVisibleChoices()`，避免 ViewModel 重复维护箭头/autoAdvance 过滤。`node tools/validate.js` 通过。阻塞：本机无 Android Gradle/Wrapper，无法产出实机截图；需 Ant 从清空 autosave / clean new story 补拍六节点截图后最终判定。
- 最新更新时间：2026-07-23

### TASK-20260721-008
- 标题：ui-snapshot 工具深流程覆盖 v2
- 负责人：Wewe（Web）
- 状态：done
- 优先级：P2
- 说明：现有 `tools/ui-snapshot.js` 已覆盖 9 状态；扩展 web 流程脚本覆盖剩余权威页：真人物对白（点到有 speaker 的节点）、选项层（推进到首个选项节点）、章节/小节开始、章节结束、长旁白、跳过弹窗（点 HUD skipSection chip）、结局页与画廊（可加 debug 入口或存档注入，需在回报中说明方式且不得进生产路径）。只改 `tools/ui-snapshot.js`，不改 `web/src` 生产逻辑。
- 完成定义：`node tools/ui-snapshot.js all` 覆盖 ≥15/18 权威页；报告无损；截图入 `05_reports/ui_baseline/web/`。
- 完成结果：18/18 权威页全覆盖。方式：puppeteer evaluateOnNewDocument 钩子捕获 GameController 实例至 window.__controller__，通过 controller.onTap() / _navigateToNode() / _updateState() 驱动到目标状态截图；画廊按钮 disabled 通过 evaluate 移除 disabled 属性后注入 DOM；结局/章节转场/小节转场通过 _updateState 直接设置。未改 web/src 任何文件。
- feibo review（2026-07-21）：工具交付合格（+255 行，注入法不碰生产代码，方向正确），但**覆盖账面修正：实际 17/18**——缺 `line`（Web LINE 层未实现，合理缺口，待 LINE 接入后补）；多出 `section-clear` 一张（权威无此页，§17.6 已移除独立小节结束页）——**Web 存在已被产品移除的 Section Clear 状态，疑似残留**，列入 `TASK-20260721-006` Ant 验收关注项，确认后 Wewe 下轮移除该状态及其入口。任务转 review。
- 最新更新时间：2026-07-21

### TASK-20260721-007
- 标题：MinSpec 效果的 Compose 翻译规范
- 负责人：lulu（UI）/ feibo（把关）
- 状态：pending
- 优先级：P2
- 说明：MinSpec 中 CSS 专属效果（backdrop blur、clip-path 切角、mask 渐隐、radial 高光等）在 Compose 无直接等价物，历史上开发各自"近似"导致反复打回。lulu 逐项定死 Android 替代方案（写进 MinSpec §17 fallback 列或新增小节），此后开发无裁量权。
- 完成定义：每个不可直译效果都有唯一指定的 Compose 实现口径；按权威修改流程更新 MANIFEST 哈希。
- 最新更新时间：2026-07-21

### TASK-20260721-001
- 标题：权威文档收拢隔离（authority/ 建立）+ 周末场外协作补账
- 负责人：feibo（CTO）
- 状态：done
- 优先级：P0
- 说明：详见本任务归档版及 `authority/MANIFEST.md`。七份权威 + 2 KV 包收拢，快照区退役，check-authority.ps1 上线。
- 最新更新时间：2026-07-21

---

## 关闭台账（2026-07-21 大扫除）

> 全文见 `task_board_archive_20260715_20260721.md`。closed-done=目标已达成；closed-superseded=被后续工作取代；closed-cancelled=模式变更不再执行。

| 任务 | 处置 | 一句话理由 |
|---|---|---|
| 0715-001 UI合版 | closed-done | 合版产物已成为 UI 权威（authority/ui/） |
| 0715-002 TT icon/start包 | closed-done | 包已交付；Start V23 + Icon V4 safezone 已定权威 |
| 0716-001 BGM候选判断 | closed-done | BGM 已确认接入 |
| 0717-001 Start v23接入 | closed-done | `d7c48b2` 已接入并实机使用 |
| 0717-002/003/006/007/011/014/016 | closed-done | 设计/审计交付完成（原状态即 done 或 review 通过后被采用） |
| 0717-004 Gradle wrapper | closed-cancelled | gradlew 至今不存在；构建走 Ant 的 Android Studio，需 CI 时另开任务 |
| 0717-005 资源缺口修复 | closed-superseded | 被 PP 07-20 系列提交覆盖 |
| 0717-008 长屏 Strategy A | closed-done | 已实现并随 V23 实机使用 |
| 0717-009 剧情/BG/交互遗留闭环 | closed-done | 箭头过滤/翻页/文案/BG 修复 07-21 逐项验活于当前代码 |
| 0717-010 弹窗层级 | closed-superseded | NagiDialog 后续按 §17.3 重做 |
| 0717-012 Wewe入职审计 | closed-done | 已并入后续 Web 实现 |
| 0717-013/015 HUD/回顾/弹窗回修 | closed-superseded | yiyi 离职；被 PP 周末 §21.2 全量 audit 覆盖 |
| 0718-001 废弃资源清理 | closed-done | 已归档收口 |
| 0718-002/007/008 App Icon 系列 | closed-done | V4 safezone 已定权威并接入（res 与包 hash 一致，07-21 验证） |
| 0718-003/005 Web MVP/P1 | closed-superseded | 被 07-21 90 项对齐覆盖；验收转 `TASK-20260721-006` |
| 0718-004 UI ownership gate | closed-done | Android UI 职责已转 PP，gate 目的达成 |
| 0718-006 实机功能三 bug | closed-done | BGM/opening bg/opening 点击修复 07-21 验活 |
| 0718-010/011/013/014/015/016/017/018 Web QA 循环 | closed-cancelled | agent QA 停用；Web 验收转 Ant 本人（017 报告已交付存档） |
| 0718-012 PP Phase 2 | closed-superseded | 被周末 §21.2 全量 audit 覆盖 |
| 0719-001 可读性 authority 补齐 | closed-done | 已并入 MinSpec/HTML，随 authority/ 收拢 |
| 0719-002 主流程根因审计 | closed-superseded | 被 0719-011 映射审计替代 |
| 0719-003 对齐门禁 | closed-done | 已写入 loop/模板 |
| 0719-006 Dialog/HUD 根因调查 | closed-done | 报告交付 |
| 0719-007 Dialog/HUD 最小修复 | closed-superseded | 被周末 §21.2 audit 覆盖 |
| 0719-008 结局页 authority | closed-done | Ant 已确认 §18 |
| 0719-009 P0 logic+UI pass | closed-superseded | 被周末场外重做取代；evidence 流程由 Ant 实机测试取代 |
| 0719-010 DeDe 短回归 | closed-cancelled | agent QA 停用 |
| 0719-011 全量映射审计 | closed-done | 报告已交付采纳；SectionClear 残留转 0719-004 |
| 0719-012 XoXo 映射审阅 | closed-done | 审阅完成，产出 0719-013 |
| 0719-013 Section Clear 移除 | closed-done | `6a0fa6c` 落地；死代码清理转 0719-004 |
| 0719-014 Laud QA 扫描 | closed-done | 报告交付存档；后续 agent QA 停用 |
| 0719-015 结局验证 hook | closed-done | 证据齐；`6a3b51f` 已移除 debug hooks |

---

## 任务状态

- `pending`：已记录，但暂未进入可执行状态
- `ready`：已澄清，可以开始执行
- `in_progress`：已有明确负责人正在做
- `blocked`：被阻塞，需要额外输入或条件
- `review`：执行已完成，等待复核（最终验收=Ant 实机/浏览器）
- `done`：已确认完成
- `queued`：排队中，按优先级依次执行

## 任务模板

### TASK-YYYYMMDD-XXX
- 标题：
- 负责人：
- 状态：pending
- 优先级：P1
- 说明：
- 完成定义：
- 最新更新时间：
