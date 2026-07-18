# yiyi Task - Android UI vs Final UI Authority Diff Audit

> Sender: PM 一一  
> Receiver: developer yiyi / Claude  
> Date: 2026-07-17  
> Task ID: `TASK-20260717-007`  
> Priority: P0  
> Status: ready  

## 0. PM Decision

XoXo has completed the UI-owned Android resource supply package. Before Android starts adjusting implementation, yiyi must first perform a system-wide diff audit between current Android UI and the current final UI authority.

This is a read-only audit task.

Do not implement fixes in this task. Do not copy resources, do not modify Android code, do not delete old resources, and do not replace App Icon. First report the differences back to PM / Ant大小姐; PM will decide what to adjust afterward.

## 1. Required Reading

Read these files before auditing:

1. `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
2. `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`
3. `00_harness/01_governance/decision_log.md`
4. `00_harness/02_planning/task_board.md`
5. `00_harness/05_reports/validation/PM_REVIEW_XOXO_UI_AUTHORITY_REVISION_20260717.md`
6. `00_harness/05_reports/validation/PM_REVIEW_XOXO_ANDROID_RESOURCE_AUDIT_20260717.md`
7. `00_harness/05_reports/validation/PM_REVIEW_XOXO_UI_RESOURCE_SUPPLY_ANDROID_20260717.md`
8. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_ui_resource_supply_android_20260717.md`
9. `assets/ui/android/drawable/ANDROID_DRAWABLE_RESOURCE_MANIFEST_20260717.md`
10. `design/authority/icon_start_tt/TT_Icon_Start_Authority_Spec_v1_0.md`

Important boundary:

- TT Start long-screen V3 is still pending. Do not use V1 or V2 long-screen packages as final.
- Current accepted Start base remains the previously confirmed Start v23 1080x1920 package for existing implementation review.
- App Icon is still pending Ant大小姐 final confirmation and must stay out of this audit’s adjustment recommendations except as a known pending item.

## 2. Audit Scope

Compare current Android implementation against the final UI authority for all implemented UI surfaces that exist in Android.

At minimum inspect:

### Start / Opening Poster

- Current Android Start poster implementation.
- TT Start v23 layered resources currently used.
- START alpha breathing behavior.
- Transparent hit area and navigation behavior.
- Note: long-screen V3 is pending; do not mark missing V3 as an Android bug yet. Record it as pending design dependency.

### Home / Main Menu

- Whether Home matches final authority after the top title removal.
- Whether old five-button Start menu still appears in the wrong place.
- Menu layout, background, typography, icon use.

### Prologue / Opening Text

- Background route.
- Text layout / visual hierarchy.
- Whether it still references missing `android_asset/bg/poster_start_nagis_heart_bg_clean.png`.

### Name Setup

- Background route.
- Input layout.
- Button and keyboard-safe behavior if inspectable.

### Dialogue / HUD

- HUD icons / system icons expected by final authority.
- Current Android references in `NagiIcon.kt`, `NagiIconButton.kt`, `NagiHud.kt`, `DialogueLayer.kt`.
- Which of the 14 XoXo-supplied icons are not yet wired.

### Save / Gallery / Settings / System Pages

- Shared clean remeet background usage.
- Settings value-right layout.
- Buttons, cards, spacing, typography, icons.

### Long Narration / Story Recap

- Structure and cold color system compared with final authority.
- Any obvious Android mismatch.

### Pending / Excluded Pages

Chapter catalog, chapter ending, and section ending are still pending. Do not claim them as final authority mismatches unless Android is presenting them as final-looking passed pages. Record as “pending authority dependency” if needed.

## 3. Output Required

Write your result to:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_android_ui_authority_diff_audit_20260717.md`

Use this format:

```md
# Dev Reply - Android UI vs Final UI Authority Diff Audit

## Summary

## Files / Screens Inspected

## Difference Matrix

| Area | Authority Expected | Android Current | Difference Type | Severity | Evidence | Suggested Owner |
|---|---|---|---|---|---|---|

## Resource Gaps / Wiring Gaps

| Resource | Authority Source | Android Current | Status | Notes |
|---|---|---|---|---|

## Pending Authority Dependencies

## Items Not To Change Yet

## Recommended PM Decisions

## Self Check
```

Severity guidance:

- P0: breaks first-run experience, blocks compile/runtime, or contradicts confirmed final authority.
- P1: visible mismatch that should be fixed before visual closure.
- P2: polish, cleanup, or later QA concern.
- Pending: depends on not-yet-final authority, such as TT long-screen V3 or App Icon confirmation.

## 4. Rules

- Read-only audit only.
- Do not edit Android code.
- Do not copy resources into Android yet.
- Do not delete old / unreferenced resources.
- Do not replace App Icon.
- Do not integrate TT long-screen V1 or V2.
- Do not redesign UI.
- Do not fix while auditing. Report first; PM / Ant大小姐 will decide adjustments after reviewing the diff.
