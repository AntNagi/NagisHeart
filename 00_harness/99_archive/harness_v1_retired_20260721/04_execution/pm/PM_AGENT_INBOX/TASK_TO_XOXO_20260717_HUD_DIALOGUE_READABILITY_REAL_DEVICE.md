# Task to XoXo - Real Device HUD / Dialogue Readability Authority Patch

## Task

`TASK-20260717-014` - 实机反馈：高亮背景下 HUD 统一与 speaker 金色可读性补齐

## Source

Ant大小姐 2026-07-17 实机反馈，截图：

- `C:\Users\admin\Documents\xwechat_files\wxid_rt82bqc8h2wc22_e45b\temp\RWTemp\2026-07\9e20f478899dc29eb19741386f9343c8\5b7104cd17fefd814de4193258a34204.jpg`
- `C:\Users\admin\Documents\xwechat_files\wxid_rt82bqc8h2wc22_e45b\temp\RWTemp\2026-07\9e20f478899dc29eb19741386f9343c8\6388f591e304e0d481f73738bc863fdd.jpg`

User feedback:

1. 导航栏标题和“跳过本节”有背景和线框，但按钮图标没有，整体很不协调。
2. 在高亮背景图上，图标按钮几乎看不清，需要 UI 侧解决统一性与可见性。
3. 第二张图里底部 speaker / 人名在背景里不清楚；Ant 仍喜欢金色，希望看是否能调亮、加衬底或用其他轻量方式增强可读性。

## PM Classification

This is a UI authority issue first, not an Android-only patch.

`TASK-20260717-013` already asks yiyi to improve title chip visibility, but the new feedback expands the scope:

- HUD title chip, action chip, and icon buttons need a unified system.
- Dialogue speaker label / name plate needs a readability rule for bright backgrounds.

XoXo should define the authority patch first. yiyi should not invent the visual rule.

## Required Work

### A. HUD unified readability system

Please define a consistent rule for the whole top HUD on bright / high-contrast BG:

1. Back icon, auto icon, save icon, backlog/menu icon should not be naked white line icons over bright BG.
2. Title chip and action chip should remain in final glass HUD language.
3. Icon buttons, title chip, and action chip should feel like one family:
   - either all have light glass backing,
   - or icons receive a minimal shared backing / halo / shadow rule that visually matches title/action chips.
4. Must not become thick system buttons.
5. Specify:
   - size;
   - opacity;
   - border;
   - blur / fallback if Android cannot true blur;
   - icon color;
   - shadow/halo;
   - spacing/alignment.

### B. Speaker / name gold readability

Please define a rule for the dialogue speaker name / name plate over bright or busy BG:

1. Preserve the gold feeling if possible.
2. Improve legibility on bright / complex images.
3. Decide whether to:
   - brighten the gold;
   - add subtle backing;
   - add text shadow / stroke / halo;
   - adjust speaker chip opacity;
   - combine these.
4. Keep it consistent with final dialogue visual language and avoid heavy card treatment.

### C. Authority sync requirement

Because of `DEC-20260717-014`, if you accept this as a design rule, you must update authority:

- `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`

If HTML preview changes are needed, also sync the latest HTML / merge record into:

- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`

## Out of Scope

Do not:

- modify Android code;
- modify Web code;
- modify story/script/BG mapping;
- touch TT Start / App Icon;
- change chapter catalog;
- delete resources.

## Deliverable

Write status to:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_hud_dialogue_readability_20260717.md`

Include:

1. final HUD icon/title/action chip rule;
2. final speaker / name gold readability rule;
3. updated authority files;
4. implementation notes for yiyi;
5. explicit authority sync status.

## Completion Definition

Task is complete when yiyi can implement HUD icon/title/action chip readability and speaker/name readability without guessing, and the rule is present in `08_authority_current`.
