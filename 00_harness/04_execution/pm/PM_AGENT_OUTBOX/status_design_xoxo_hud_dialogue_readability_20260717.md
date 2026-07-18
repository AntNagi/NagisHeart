# XoXo Status - TASK-20260717-014 HUD / Dialogue Readability Authority Patch

Date: 2026-07-17  
Owner: XoXo / UI Design  
Status: review

## Summary

XoXo 已按 PM brief 完成 `TASK-20260717-014` 的 UI authority patch。本轮只修改 UI authority / spec；未修改 Android/Web 代码、story-data、BG mapping、TT Start、App Icon、章节目录，也未删除资源。

## Final HUD Rule

高亮 / 复杂背景下，顶部 HUD 必须作为统一 final glass HUD 系统实现：

- title chip、action chip、back/auto/save/backlog/menu icon buttons 必须同属一个轻玻璃视觉家族。
- icon buttons 不得再裸白线压在亮背景上。
- 不得改成厚系统按钮、纯黑实心按钮、纯白按钮或 Material 默认按钮。

### Icon button

- Size: 36 x 36.
- Icon: 18 x 18, centered.
- Background: light glass, `rgba(15,24,39,0.30)` -> `rgba(15,24,39,0.18)`.
- Highlight: subtle radial `rgba(247,249,252,0.08)`.
- Border: `rgba(255,255,255,0.10)`, 1dp.
- Blur: 12dp, saturation 0.92.
- Shape: final UI cut-sm.
- Icon color: `rgba(247,249,252,0.94)`.
- Shadow / halo: dark icon shadow + soft light halo.
- Android fallback if blur is unavailable: translucent dark backing + 1dp border + shadow.

### Title / action chip

- Keep section 14 final glass HUD direction.
- Title chip: height 34, padding 14~18, max-width about 210dp, one-line ellipsis.
- Action chip: height 34, padding 14~16, right-aligned, placed below HUD when needed.
- Background / border / blur / fallback should share the same glass HUD token as icon buttons.

## Final Speaker / Name Gold Readability Rule

Ant 仍喜欢金色，因此 speaker/name 保留金色，但必须增加轻量可读性保护：

- Gold adjusted to `#E4CA8F`.
- Font: Noto Sans SC Medium, 13sp, weight 600, letter-spacing 0.04em.
- Add a small backing only around the speaker/name text:
  - padding: left/right 9, top 3, bottom 4;
  - background: `rgba(16,24,39,0.30)` -> `rgba(16,24,39,0.10)`;
  - border: `rgba(215,190,134,0.18)`, 1dp;
  - blur: 8dp, saturation 0.92;
  - shape: cut-sm.
- Add text shadow and gold halo.
- Do not make it a heavy name plate or full-width black strip.

## Updated Authority Files

Primary files:

1. `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
2. `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`
3. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`

Authority current synced files:

1. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
2. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`

Governance / loop files:

1. `00_harness/01_governance/decision_log.md`
2. `00_harness/02_planning/task_board.md`
3. `00_harness/02_planning/PM_SYNC_BOARD.md`
4. `00_harness/03_handoffs/latest_status_snapshot.md`

## Authority Sync Status

Complete.

- `XoXo_UI_Final_MinSpec_20260712.md` has section 15 for this task.
- Latest authority HTML has been copied into `00_harness/08_authority_current/04_ui/`.
- Latest merge record has been copied into `00_harness/08_authority_current/04_ui/`.
- `DEC-20260717-015` records the accepted HUD / speaker readability rule.

## Implementation Notes For yiyi

1. Create or update shared HUD tokens so icon button, title chip, and action chip use the same glass backing / border / shadow / blur fallback.
2. Back, auto, save, backlog/menu icon buttons should default to glass-backed buttons on story pages.
3. Speaker/name should preserve gold but use the small backing + halo rule. Do not switch to white system label or thick name plate.
4. Use `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 15 as the implementation authority.

## Self Check

- [x] Did not modify Android code.
- [x] Did not modify Web code.
- [x] Did not modify story-data/script.
- [x] Did not modify BG mapping.
- [x] Did not touch TT Start / App Icon.
- [x] Did not touch chapter catalog.
- [x] Did not delete resources.
- [x] Synced accepted rule into `08_authority_current`.
