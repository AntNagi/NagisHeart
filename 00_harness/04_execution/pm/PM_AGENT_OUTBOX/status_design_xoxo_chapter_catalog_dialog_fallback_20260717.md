# XoXo Status - TASK-20260717-016 Chapter Catalog + Dialog Fallback Authority

Date: 2026-07-17  
Owner: XoXo / UI Design  
Status: review

## Summary

XoXo 已按 PM brief 完成 `TASK-20260717-016`。本轮只补 UI authority / spec：

1. 章节目录从 pending 转为当前可开发 review authority。
2. Dialog 在 Android 无真实 frosted background blur 时的 fallback token 已收紧。

未修改 Android/Web 代码、story-data、script、BG mapping、TT Start、App Icon 或资源删除；未重设计已通过页面；未重改 HUD/speaker section 15。

## 1. Chapter Catalog Authority Status

Status: 从 pending 转为 review authority。

Final direction:

- 章节目录是系统级页面，沿用 Home / Save / Settings 的 dark glass 语言。
- 第一版只做可开发目录页，不扩展成成就系统。
- 页面结构：标题说明 / 章节列表 / 底部返回与继续动作。
- 支持层级：大章 + 小节副文。
- 支持状态：`current` / `unlocked` / `completed` / `locked`。
- 长标题：单行 ellipsis，不撑高列表项。
- 条目多时：Android 可用 lazy list 垂直滚动，不做分页。
- 底部动作：左 `返回主页`，右 `继续当前章节`，保持轻文本动作，不做厚按钮。

Primary visual tokens:

- `catalog-panel`: left/right 18, top 84, bottom 34.
- Background: `rgba(16,24,39,0.34)` -> `rgba(16,24,39,0.52)`.
- Border: `rgba(255,255,255,0.10)`, 1dp.
- Blur: 16dp, saturation 0.92; no-blur fallback uses the same background + border.
- Shape: final cut-md.
- List row: min-height 68, padding 13/14, background `rgba(255,255,255,0.045)`, border `rgba(255,255,255,0.07)`, cut-sm.
- Current row: gold sweep `rgba(215,190,134,0.18)`, border `rgba(215,190,134,0.28)`.
- Locked row: opacity 0.52.

## 2. Dialog Android Fallback Status

Status: fallback 已补齐。

Preferred token with true background blur remains section 11:

- card `rgba(27,36,54,0.32)`
- background blur 20dp
- border `rgba(255,255,255,0.12)`
- scrim `rgba(9,14,24,0.32)`

Android no-real-blur fallback token:

- card `rgba(27,36,54,0.56)`
- allowed card range: 0.52 ~ 0.60; never below 0.52 or above 0.64
- scrim `rgba(9,14,24,0.38)`
- allowed scrim range: 0.34 ~ 0.42
- border `rgba(255,255,255,0.14)`, 1dp
- shadow `0 18dp 42dp rgba(0,0,0,0.36)`
- optional top inner highlight `rgba(255,255,255,0.06)`
- text shadow `0 1dp 2dp rgba(0,0,0,0.35)`, but do not blur text/buttons themselves

Hard bans:

- no system default Dialog
- no pure black / pure white solid backing
- no heavy 80%+ dark card
- no `RenderEffect` that blurs dialog text/buttons themselves
- no sacrificing final glass language for readability

Return to UI/PM review if:

1. card 0.60 + scrim 0.42 is still unreadable;
2. implementation cannot preserve border / shadow / translucent layering;
3. text length forces layout/position/typography changes;
4. any alpha must exceed the allowed ranges.

## 3. Modified Files

Primary:

1. `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
2. `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`
3. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`

Authority current synced:

1. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
2. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`

Governance / loop:

1. `00_harness/01_governance/decision_log.md`
2. `00_harness/02_planning/task_board.md`
3. `00_harness/02_planning/PM_SYNC_BOARD.md`
4. `00_harness/03_handoffs/latest_status_snapshot.md`

## 4. Authority Current Sync Status

Complete.

- `XoXo_UI_Final_MinSpec_20260712.md` has section 16 for this task.
- Latest authority HTML has been copied into `00_harness/08_authority_current/04_ui/`.
- Latest merge record has been copied into `00_harness/08_authority_current/04_ui/`.
- `DEC-20260717-017` records the accepted chapter catalog + dialog fallback authority.

## 5. Implementation Notes For yiyi / Wewe

1. Implement Chapter Catalog as a system-level dark glass screen using section 16.2 ~ 16.4.
2. Data needs only: chapter title, section subtitle/progress, current/unlocked/completed/locked state.
3. Do not add achievement, rating, CG, complex graph, or new gameplay features.
4. Dialog fallback must use section 16.5 tokens; do not continue trial-and-error alpha tuning.
5. If no true background blur exists, do not use RenderEffect on the dialog layer itself.
6. Any required change beyond section 16 token ranges must return to UI/PM review.

## 6. Self Check

- [x] Did not modify Android code.
- [x] Did not modify Web code.
- [x] Did not modify story-data/script.
- [x] Did not modify BG mapping.
- [x] Did not touch TT Start.
- [x] Did not touch App Icon.
- [x] Did not delete resources.
- [x] Did not redesign approved pages.
- [x] Did not rewrite HUD/speaker section 15.
- [x] Synced accepted rule into `08_authority_current`.
