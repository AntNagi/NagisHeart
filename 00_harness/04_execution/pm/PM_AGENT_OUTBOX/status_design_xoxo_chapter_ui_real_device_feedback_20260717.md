# XoXo Status - TASK-20260717-011 Chapter UI Real Device Feedback

Date: 2026-07-17  
Owner: XoXo / UI Design  
Status: review

## Summary

XoXo 已按 PM brief 完成 `TASK-20260717-011` 的 UI authority / spec 补齐。本轮只处理设计权威与实现说明；未修改 Android 代码、story/script、BG mapping、TT Start、App Icon，也未删除任何资源。

## Updated Files

1. `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
2. `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`
3. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
4. `00_harness/02_planning/task_board.md`
5. `00_harness/02_planning/PM_SYNC_BOARD.md`
6. `00_harness/03_handoffs/latest_status_snapshot.md`
7. `00_harness/01_governance/decision_log.md`

## Final Visual Decisions

### 1. Chapter opening readability

Decision: 大章开始 / 小节开始继续沿用 final UI 的 story dark + 章节海报方向，但文字组必须增加很浅的透明雾面托底。

Implementation note:

- 托底覆盖整组文字：kicker、章节副标题、章节标题、轻触继续文案。
- 1080x1920 基准：left/right 30，padding 24/22/20；大章 bottom=72，小节 bottom=96。
- 背景为轻玻璃渐变：约 `rgba(16,24,39,0.30)` 到 `rgba(16,24,39,0.14)` 再到 transparent。
- 描边 `rgba(255,255,255,0.08)`，blur 10dp，cut-md。
- 视觉必须像“托底雾面条”，不能做成重弹窗或厚卡片。

### 2. Chapter Clear / Section Clear

Decision: 本次采纳并修订历史 Missing Pages 的章节结束方向，提升为当前可实现 UI authority。章节结束页不再 pending；章节目录仍 pending。

Implementation note:

- 新增/确认 `CHAPTER CLEAR` 与 `SECTION CLEAR` 两类页面。
- 使用同一个轻玻璃 `clear-card` 组件。
- 1080x1920 基准：left/right 28，bottom 82，padding 24/28/22。
- Label：`CHAPTER CLEAR` / `SECTION CLEAR`，11sp，letter-spacing 0.14em，gold。
- 标题：30sp serif，最多两行。
- Body：13sp，line-height 1.8。
- Actions：左 `返回目录`，右 `进入下一章/进入下一节`，底部左右分布。

### 3. Top title chip / next-skip action chip

Decision: 顶部标题 chip 与跳过/下一章/继续下一节 action chip 全部回到 final glass HUD 语言。

Implementation note:

- 标题 chip：height 34，padding 14~18，max-width 约 210，单行省略。
- 字体：Noto Sans SC Medium，13sp。
- 背景：`rgba(15,24,39,0.22)` 轻玻璃；border `rgba(255,255,255,0.10)`；blur 12dp。
- Action chip：右侧对齐，height 34，padding 14~16，12~13sp；放在 HUD 下方，不与标题 chip 抢同一行。

## Still Pending

- 章节目录最终视觉仍 pending，未在本任务中补做。

## Handoff To yiyi

yiyi 可按本次更新后的 authority/spec 实现：

1. 章节开始 / 小节开始不再裸文字压背景，必须加轻透明托底。
2. Chapter Clear / Section Clear 使用 `clear-card` 轻玻璃组件。
3. 顶部 title chip 与 action chip 使用 final glass HUD 样式。
4. 不要自行补章节目录，不要改 story/script 或 BG mapping。

## Self Check

- [x] 未修改 Android 代码。
- [x] 未修改 story/script。
- [x] 未修改 BG mapping。
- [x] 未触碰 TT Start / App Icon。
- [x] 未删除资源。
- [x] 已更新 authority HTML。
- [x] 已更新 merge record。
- [x] 已更新 min spec。
