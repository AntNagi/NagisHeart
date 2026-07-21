# TASK TO PP - Android Dialog / HUD Minimal Authority Fix

- Task ID: TASK-20260719-007
- Project: NagisHeart
- From: PM 一一
- To: Android 开发工程师 PP
- Priority: P0
- Status: ready
- Scope: Android only
- Code change allowed: yes, but only for the two approved UI root-cause areas below

## Background

Ant reviewed PM's root-cause investigation and agreed to first validate whether fixing these two concrete areas makes sense:

1. Dialog still looks like rounded rectangle line-frame.
2. Navigation/HUD still does not match the latest UI authority.

Do not mix in ending logic, gallery unlock, backlog pagination, long narration width, section clear removal, BGM, Web, App Icon, TT Start, or story-data in this task.

## Mandatory pre-read

Read before editing:

1. `00_harness/05_reports/validation/PM_INVESTIGATION_ANDROID_DIALOG_HUD_ROOT_CAUSE_20260719.md`
2. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
   - section 17.2
   - section 17.3
   - section 17.6
3. `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_PP_20260719_ANDROID_DIALOG_HUD_ROOT_CAUSE_ADDENDUM.md`

## Approved fix area A - Dialog

Target active component:

- `android/app/src/main/java/com/antnagi/nagisheart/ui/component/NagiDialog.kt`

Required outcome:

- Dialog no longer reads as a large rounded rectangle line-frame.
- Use current authority section 17.3, not old section 16.5.

Required implementation direction:

- Replace `RoundedCornerShape(24.dp)` with section 17.3 cut-corner shape.
- Use weak border token from section 17.3, not the old 14% line-frame border.
- Use card gradient + inner highlight + soft shadow.
- Shadow silhouette must visually support cut-corner glass, not rounded rectangle.
- Do not use Material default AlertDialog.
- Do not use RenderEffect on the dialog card itself.

## Approved fix area B - Navigation / HUD

Target active components:

- `android/app/src/main/java/com/antnagi/nagisheart/ui/component/NagiHud.kt`
- `android/app/src/main/java/com/antnagi/nagisheart/ui/icon/NagiIconButton.kt`
- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GameScreen.kt` for the inline `跳过本节` action chip
- Audit and minimally align system-screen headers that currently do not use the same nav family:
  - `BacklogScreen.kt`
  - `ChapterScreen.kt`
  - `SettingsScreen.kt`
  - `SaveLoadScreen.kt`
  - `GalleryScreen.kt`

Required outcome:

- Back icon, title chip, auto/save/backlog icons, and skip/action chip read as one final glass HUD family.
- Bright-background screenshots must not show naked icons or weak invisible title/action chips.
- Backlog / Chapter / Settings / Save / Gallery headers must not keep an unrelated custom header style.

Required implementation direction:

- Use current authority section 17.2 token values.
- Prefer extracting a small shared helper/component if needed to stop token drift between title chip and skip/action chip.
- Keep layout geometry stable unless authority explicitly requires otherwise.
- Do not redesign the UI.
- Do not use thick system buttons or pure black/white solid plates.

## Required verification in PP reply

Your reply must include:

1. Active-path table:
   - screen;
   - component file;
   - authority section;
   - changed or unchanged;
   - reason.

2. Token table:
   - old value;
   - section 17 target value;
   - final code value.

3. Build freshness proof:
   - build command/result;
   - APK install path or variant;
   - how stale APK / wrong build was ruled out.

4. Screenshot checklist, if possible:
   - bright-background gameplay HUD;
   - dark-background gameplay HUD;
   - skip-section dialog;
   - Backlog header;
   - Chapter Catalog header.

5. Cleanup status:
   - deleted files/resources: normally none;
   - cleanup candidates if any.

## Forbidden in this task

- Do not touch Web.
- Do not touch story-data / BG mapping / ending logic / gallery unlock.
- Do not touch TT Start or App Icon.
- Do not modify PRD/UI authority unless explicitly blocked and PM asks XoXo for a design decision.
- Do not claim done without active-path proof.

## Done definition

This task reaches review only when Dialog and Navigation/HUD are implemented against authority section 17 active paths and PP provides build freshness proof plus the required tables.

