# yiyi Task - Android UI Resource Fixes From XoXo Audit

> Sender: PM 一一  
> Receiver: developer yiyi / Claude  
> Date: 2026-07-17  
> Task ID: `TASK-20260717-005`  
> Priority: P0  
> Status: ready  

## 0. PM Decision

XoXo has completed the Android current UI resource audit against the final UI authority.

PM decisions:

1. Prologue / Name should route to the existing `R.drawable.splash_bg`. Do not keep using the missing `file:///android_asset/bg/poster_start_nagis_heart_bg_clean.png`.
2. Android HUD / system icons must be connected only after XoXo confirms / supplies the UI-owned resource package through `TASK-20260717-006`.
3. App Icon replacement is still pending Ant大小姐's separate final confirmation. Do not replace launcher icons in this task.
4. Old splash / keyart / raw source assets should not be deleted in this task. Prevent active use and report any remaining references.
5. TT Start SVG rendering still needs Android visual verification after a build is possible. Do not redesign the SVGs yourself.
6. Resource cleanup order is fixed: first补齐缺失资源, then complete Android adaptation, then pass QA / visual testing, and only then open a separate cleanup task for obsolete unreferenced assets.

PM responsibility correction:

- XoXo is the UI owner. Missing UI resources found in the audit must be confirmed / supplied by XoXo first.
- yiyi is the Android implementation owner. Do not reverse-design or invent missing UI assets in development.
- XoXo resource supply is now complete and PM-reviewed. Proceed using `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_ui_resource_supply_android_20260717.md`, `assets/ui/android/drawable/ANDROID_DRAWABLE_RESOURCE_MANIFEST_20260717.md`, and `00_harness/05_reports/validation/PM_REVIEW_XOXO_UI_RESOURCE_SUPPLY_ANDROID_20260717.md`.

## 1. Required Reading

1. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_android_resource_audit_20260717.md`
2. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_ui_resource_supply_android_20260717.md`
3. `assets/ui/android/drawable/ANDROID_DRAWABLE_RESOURCE_MANIFEST_20260717.md`
4. `00_harness/05_reports/validation/PM_REVIEW_XOXO_UI_RESOURCE_SUPPLY_ANDROID_20260717.md`
5. `00_harness/01_governance/decision_log.md`
6. `00_harness/02_planning/task_board.md`
7. `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
8. `design/authority/icon_start_tt/TT_Icon_Start_Authority_Spec_v1_0.md`

## 2. Required Fixes

### A. Prologue / Name Background

Fix:

- `PrologueScreen.kt`
- `NameSetupScreen.kt`

Current bad path:

- `file:///android_asset/bg/poster_start_nagis_heart_bg_clean.png`

PM-approved route:

- Use existing `R.drawable.splash_bg`.

Reason: XoXo audit confirmed `R.drawable.splash_bg` hash matches the final authority clean remeet background source.

### B. HUD / System Icons

After XoXo confirms / supplies the UI-owned Android icon package, copy or otherwise wire approved Android XML icons from:

- `assets/ui/android/drawable/`

into Android runtime resources:

- `android/app/src/main/res/drawable/`

Required icon names include:

- `ic_back`
- `ic_auto`
- `ic_save`
- `ic_menu`
- `ic_continue`
- `ic_settings`
- `ic_gallery`
- `ic_chapter`
- `ic_skip`
- `ic_backlog`
- `ic_lock`
- `ic_line`
- `ic_pentagon_ring`
- `ic_pentagon_fill`

Make sure direct references such as `R.drawable.ic_continue` can compile.

Do not create replacement icon designs yourself. If any required icon is absent from XoXo's package, report it back to PM / XoXo instead of improvising.

### C. Old Splash / Keyart References

Do not delete old resources in this task.

Check active code references to these old assets and remove/avoid active use if they conflict with final authority:

- `android/app/src/main/res/drawable-nodpi/splash_start.png`
- `android/app/src/main/res/drawable-nodpi/splash_title.png`
- `android/app/src/main/assets/bg/poster_start_nagis_heart_keyart.jpg`

If they are kept only for history / rollback, record that in your reply.

Unreferenced or obsolete assets must remain on disk until the missing resources are filled, Android is adapted, and QA / visual verification has passed. Deletion requires a later PM-approved cleanup task.

### D. App Icon

Do not replace launcher icons yet.

TT App Icon resources are still waiting for Ant大小姐 final confirmation. Keep current launcher resources unchanged unless PM sends a separate App Icon task.

### E. Start SVG Visual Verification

After build is possible, verify whether Coil SVG rendering visually matches TT authority for:

- title overlay mist / filter
- START layer appearance
- gradients / blur / shadow

If Android SVG rendering differs, report it and request a TT raster fallback. Do not edit the TT SVGs yourself.

## 3. Output Required

Write your result to:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_android_resource_fixes_20260717.md`

Use this format:

```md
# Dev Reply - Android UI Resource Fixes

## Summary

## Files Changed

| File | Change |
|---|---|

## Fix Verification

| Case | Result | Evidence |
|---|---|---|

## Remaining References To Deprecated Assets

| Asset | Still Referenced? | Notes |
|---|---|---|

## Build / Visual Verification

## Need PM / Design Decision
```

## 4. Rules

- Do not replace App Icon.
- Do not delete resources in this task.
- Do not delete unreferenced / obsolete resources before resource gaps are filled, Android adaptation is complete, and testing passes.
- Do not change story/script data.
- Do not touch chapter catalog, chapter ending, or section ending.
- Keep this separate from Gradle wrapper work.
