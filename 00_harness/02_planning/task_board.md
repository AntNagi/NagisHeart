# 任务板

> 用途：当前唯一正式任务源（含优先级，不再有单独 priorities 文件）。
> 原则：只有写进本文件、明确负责人和状态的事项，才算正式可执行任务。新任务追加在最上方。协作规则 v2 见 `00_harness/README.md`。
> 2026-07-21 大扫除：历史任务全量归档至 `task_board_archive_20260715_20260721.md`，本板只保留活跃任务 + 关闭台账。
> QA 口径（2026-07-21 起）：agent QA 停用，**Ant 本人实机/浏览器测试是唯一验收关口**；开发交付物应尽量是截图/对比图而非文字清单。

---

## 当前优先级

1. ✅ 截图对比验收工具已上线（07-21）：`node tools/ui-snapshot.js all` 一键生成权威 18 页期望图 + Web 18 状态实现图 + 并排报告 `00_harness/05_reports/ui_baseline/compare_report.html`。`TASK-20260721-006` 的验收直接看该报告（TASK-20260721-008 完成后覆盖 18/18）
2. `TASK-20260721-006` Web 90 项对齐验收 - Ant
3. `TASK-20260719-016` locked 标题隐私修复 - PP
4. `TASK-20260719-004` 代码健康专项 - PP 执行 / feibo 把关；`TASK-20260721-003` V3_1 审计 - PM 一一 执行 / feibo 指导
5. 小项：002 回顾末行裁切（PP）、004 补 BG（lulu/TT）、005 开放日复验（Ant）——由 PM 一一 跟催

---

## 活跃任务

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
  - 待做：B（Web tokens.css 归一）。
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
- 负责人：Ant（复验）
- 状态：pending
- 优先级：P2
- 说明：该 bug 全 harness 无记录无修复账，疑似修复随 Android 工作区回滚丢失。story-data 数据层已核验正常（c3 链路/选项目标/校验器全过）。Ant 在当前版本实机走第二部第一节"开放日"：不复现即关闭；复现则拍图，feibo 直接修引擎显示层。
- 最新更新时间：2026-07-21

### TASK-20260721-008
- 标题：ui-snapshot 工具深流程覆盖 v2
- 负责人：Wewe（Web）
- 状态：done
- 优先级：P2
- 说明：现有 `tools/ui-snapshot.js` 已覆盖 9 状态；扩展 web 流程脚本覆盖剩余权威页：真人物对白（点到有 speaker 的节点）、选项层（推进到首个选项节点）、章节/小节开始、章节结束、长旁白、跳过弹窗（点 HUD skipSection chip）、结局页与画廊（可加 debug 入口或存档注入，需在回报中说明方式且不得进生产路径）。只改 `tools/ui-snapshot.js`，不改 `web/src` 生产逻辑。
- 完成定义：`node tools/ui-snapshot.js all` 覆盖 ≥15/18 权威页；报告无损；截图入 `05_reports/ui_baseline/web/`。
- 完成结果：18/18 权威页全覆盖。方式：puppeteer evaluateOnNewDocument 钩子捕获 GameController 实例至 window.__controller__，通过 controller.onTap() / _navigateToNode() / _updateState() 驱动到目标状态截图；画廊按钮 disabled 通过 evaluate 移除 disabled 属性后注入 DOM；结局/章节转场/小节转场通过 _updateState 直接设置。未改 web/src 任何文件。
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
