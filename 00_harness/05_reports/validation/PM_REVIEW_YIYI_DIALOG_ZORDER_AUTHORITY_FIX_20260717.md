# PM Review - yiyi TASK-20260717-010 Dialog Z-order / Authority Fix

Date: 2026-07-17  
PM: 一一  
Reviewed dev reply: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_dialog_zorder_authority_fix_20260717.md`

## Verdict

PM static review passed. `TASK-20260717-010` remains `review` pending Android Studio / real-device build verification.

The implementation is acceptable as a bounded fix: it corrects the perceived “dialog behind UI / unclickable” problem without changing unrelated screens or tasks.

## Checked

### 1. Root cause

Pass.

yiyi identified the likely root cause correctly:

- `Dialog()` itself creates a separate window and should be above normal composables.
- The previous `RenderEffect.createBlurEffect(...)` was applied to the dialog card's own `graphicsLayer`, so it blurred dialog text/buttons rather than the background.
- Combined with a 32% transparent container, the dialog became visually buried / unreadable.

### 2. Code changes

Pass.

Reviewed file:

- `android/app/src/main/java/com/antnagi/nagisheart/ui/component/NagiDialog.kt`

Observed:

- No remaining `RenderEffect` / `createBlurEffect` usage.
- No remaining dialog-card `graphicsLayer` blur path.
- `ContainerBg = Color(0xCC1B2436)`.
- `.shadow(12.dp, DialogShape)` added before clip/background/border.
- `DialogProperties(usePlatformDefaultWidth = false)` remains.
- Scrim still intercepts background clicks, and card itself consumes clicks.

### 3. Scope control

Pass.

The only implementation file changed for this task is:

- `NagiDialog.kt`

No Start long-screen, story/script, BG mapping, App Icon, resource deletion, or Gradle wrapper work was mixed into this task.

## Accepted implementation deviation

The current min spec originally used a lighter container alpha together with a glass/blur effect. Since Android Compose `Dialog()` cannot blur the underlying game content through a simple `RenderEffect` on the dialog card, yiyi raised container opacity to 80% to preserve readability.

PM accepts this as a pragmatic implementation deviation for the current build, subject to real-device visual confirmation by Ant大小姐.

If Ant later wants true frosted-glass blur behind the dialog, that should be a separate technical/design task because it likely requires a different blur/capture approach.

## Remaining Verification

Still required before `done`:

1. Build/run verification via Android Studio or Gradle wrapper.
2. Real-device screenshot or short recording showing:
   - dialog is readable;
   - dialog appears above gameplay UI;
   - buttons are clickable;
   - background click/dismiss behavior is acceptable.

## PM Decision

Do not change more in `NagiDialog.kt` until real-device verification returns, unless a build error blocks the current implementation.
