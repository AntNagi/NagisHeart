# TASK-20260719-002 — Android 主流程逻辑 P0 + UI 偏差根因审计

To: Android 开发工程师 PP
From: PM 一一
Status: ready
Priority: P0
Scope: Android read-only audit first

## 必读

1. `README_AI.md`
2. `00_harness/08_authority_current/01_product/NagisHeart_PRD_v2_0.md` section 21
3. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md` section 31
4. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
5. `00_harness/05_reports/validation/PM_REVIEW_ANDROID_REAL_DEVICE_FEEDBACK_20260719.md`

## 重要要求

本任务第一阶段只读审计，不直接改代码。  
原因：这次主流程逻辑和 UI authority 同时变化，必须先确认根因，避免再次“看似改了、实机没变”。

## Ant 实机反馈

### P0 主流程逻辑

1. 结局突然出现。
2. 结局点掉后又接上剧情。
3. 后面到“远处的世界第一”相关章节时卡住，点不动，页面无法返回。
4. 已经看到结局，但回忆画廊未显示解锁。

### UI / 行为

1. Dialog 仍像圆角矩形线框，不是 final UI。
2. HUD / 导航栏 title chip、icon button、skip chip 背景仍不符合 UI。
3. 剧情回顾默认最后页，应改为默认第一页。
4. 剧情回顾单页文字显示不全。
5. 长旁白宽度太窄，应与底部单行旁白正文宽度一致。

## 第一阶段审计要求

请输出一张逐项差异 / 根因表，至少包含：

同时必须使用 `00_harness/06_templates/tpl_alignment_code_review_gate.md` 的思路补一份 alignment / code-review gate 草表。第一阶段虽然不改代码，但也要明确：如果进入第二阶段，每个修复项将如何从 authority / PRD / interaction 映射到具体代码和验证点。

### A. 结局误触发与卡死

必须检查：
- `story-data/flow.json`
- `story-data/routers.json`
- `story-data/endings.json`
- Android `StoryEngine.kt`
- Android `GameViewModel.kt`
- `GameScreen.kt` ending/chapter/section overlay 逻辑

必须回答：
1. 正常章节为什么会进入 `ending_resolver`？
2. `ending_resolver` fallback `end_normal` 是否导致“突然 NORMAL END”？
3. 结局展示后是否存在任何 tap / overlay / pending node 让它继续接剧情？
4. “远处的世界第一”卡死时可能卡在哪个 phase / node / pending state？
5. 这是 story-data 路由问题、PRD 规则问题、还是 Android 状态机实现问题？

### B. 画廊不解锁

必须检查：
- `ProgressManager.unlockEnding()`
- `GameViewModel.showEnding()`
- `GalleryScreen.kt`
- ending id：`true/good/normal/bad` vs `end_true/end_good/end_normal/end_bad`

必须回答：
1. 解锁是否写入 SharedPreferences？
2. Gallery 是否因为 `remember { viewModel.getUnlockedEndings() }` 缓存导致不刷新？
3. ending id 是否与 Gallery keys 一致？
4. 如何保证结局达成后立刻回画廊可见？

### C. Backlog

必须确认：
- 默认最后页是否由 `initialPage = totalPages - 1` 造成；
- 固定 `ENTRIES_PER_PAGE = 8` 是否导致文字裁切；
- 应如何按可见高度动态分页或降低每页容量。

### D. UI 为什么一直没改对

必须定位：
1. `NagiDialog.kt` 当前 shape / border / shadow / alpha 与 authority 差异；
2. HUD / `NagiHud.kt` / `NagiIconButton.kt` 是否真正使用最新 glass token；
3. 是否存在重复 HUD / Dialog 实现，导致改了 A 文件、实机跑 B 文件；
4. 实机是否可能跑旧 APK / 旧 build variant；
5. 是否缺资源，还是纯实现偏差。
6. 最近多轮改动是否留下了临时值、重复实现、旧组件、死代码或互相覆盖的状态机分支；列出 cleanup / refactor candidates，但不要自行清理。

## 不允许

- 第一阶段不改代码。
- 不碰 Web。
- 不碰 TT Start / App Icon。
- 不改 story-data，除非第二阶段经 PM 明确批准。
- 不把 UI 设计缺口自行脑补成代码。

## 回报要求

写入：
`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_main_flow_logic_ui_audit_20260719.md`

回报必须包含：
- 每个问题的 owner 判断：PRD / UI / story-data / Android code；
- 证据文件与代码位置；
- 最小修复计划；
- pre-implementation alignment table；
- second-stage code-review checklist；
- 哪些可以立即修，哪些必须等 XoXo/Ant 确认；
- Build / install / stale APK 风险判断；
- Cleanup status。
