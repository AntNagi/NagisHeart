# Task to yiyi - Dialog Z-order and Final UI Authority Style Fix

## Task

`TASK-20260717-010` - 实机弹窗层级与 final UI authority 样式修复

## Source

Ant大小姐实机测试反馈，由 yiyi 转报：

1. 游戏中某个确认 / 选择类弹窗跑到了其他 UI 元素后面，导致用户点不到。
2. 该弹窗视觉仍是旧版本，没有更新到当前 final UI authority 样式。

## References

Use these as authority / implementation references:

- Final UI authority: `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
- Merge record: `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- Dialog min spec: `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
- Current Android dialog component: `android/app/src/main/java/com/antnagi/nagisheart/ui/component/NagiDialog.kt`
- Current skip confirm usage: `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GameScreen.kt`
- Other dialog usages: `NavGraph.kt`, `SaveLoadScreen.kt`

## Required Work

### A. Locate affected dialog

Determine which Android dialog/component matches the screenshot issue:

- skip section confirmation;
- new game confirmation;
- save overwrite confirmation;
- any other confirmation-style popup.

If the screenshot issue is not `NagiDialog`, report the exact component before changing broadly.

### B. Fix z-order / interaction layering

Ensure confirmation dialogs:

1. Render above all game UI, HUD, skip chip, choice layer, debug overlay, toast, etc.
2. Use a scrim that visually and interactively blocks underlying UI.
3. Keep confirm / cancel buttons clickable.
4. Do not allow underlying UI to intercept the dialog tap.

Use Compose-native layering / Dialog behavior first. Avoid fragile one-off coordinate hacks.

### C. Align style to current final UI authority

Update Android dialog styling to match the current final authority direction:

- glass dialog / dark translucent container;
- soft border and shadow / depth consistent with authority;
- correct title/body/action typography scale;
- confirm and cancel actions as text actions aligned to the right;
- no system-default white dialog styling.

Do not redesign from scratch. Implement the existing authority.

## Out of Scope

Do not include:

- Start long-screen work.
- App Icon.
- Story/script/BG mapping.
- Gradle wrapper.
- Resource deletion.
- Home menu icon work.
- Chapter catalog/end page design.

## Deliverables

Return a dev reply to PM with:

1. Which dialog/component was affected.
2. Root cause of z-order / click issue.
3. Files changed.
4. How style now maps to final UI authority.
5. Screenshot or, if screenshot is blocked, clear explanation and static evidence.
6. Build/run result or blocker.

## Completion Definition

The task is complete when confirmation dialogs are above all other UI, clickable, visually aligned to final authority, and the fix is documented for PM review.

