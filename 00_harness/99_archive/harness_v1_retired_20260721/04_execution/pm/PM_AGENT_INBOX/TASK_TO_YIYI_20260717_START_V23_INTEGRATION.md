# yiyi Task - Integrate TT Start v23

> Sender: PM 一一  
> Receiver: developer yiyi / Claude  
> Date: 2026-07-17  
> Task ID: `TASK-20260717-001`  
> Priority: P0  
> Status: ready  

## 0. PM Decision

Ant大小姐 has confirmed that TT's Start page direction is OK for development integration.

This is a partial visual decision for Start page implementation only. It does not approve the App Icon yet, and it does not promote the whole TT package to final authority.

## 1. Required Reading

Read these files before editing:

1. `README_AI.md`
2. `TASKS.md`
3. `PROJECT_STRUCTURE.md`
4. `00_harness/02_planning/task_board.md`
5. `00_harness/01_governance/decision_log.md`
6. `00_harness/05_reports/validation/PM_REVIEW_TT_ICON_START_20260716.md`
7. `design/authority/icon_start_tt/TT_Icon_Start_Authority_Spec_v1_0.md`
8. `design/authority/icon_start_tt/MANIFEST.md`
9. `design/authority/icon_start_tt/SELF_CHECK.md`

## 2. Scope

Implement TT Start `v23` in the Android app.

Use the layered implementation:

- Background: `design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png`
- Title overlay: `design/authority/icon_start_tt/start/layers/start_title_overlay_v23.svg`
- START static layer: `design/authority/icon_start_tt/start/layers/start_button_static_v23.svg`
- Optional reference only: `design/authority/icon_start_tt/start/layers/start_button_breathing_v23.svg`

Use full-canvas 1080 x 1920 layers. Do not tight-crop the SVGs.

## 3. Implementation Rules

1. Start page is an opening poster, not a home menu.
2. Do not show Continue / Chapter / Gallery / Settings on the Start poster.
3. Do not add a rectangular START button background.
4. Animate only the START layer alpha:
   - alpha: `0.68 -> 1.00 -> 0.68`
   - duration: `1.6s`
   - easing: ease-in-out
   - repeat while Start page is visible
5. Use a transparent click hit area:
   - base canvas: 1080 x 1920
   - x: 330
   - y: 1640
   - width: 420
   - height: 210
   - relative: left 30.56%, top 85.42%, width 38.89%, height 10.94%
6. Keep background, title overlay, START layer, and hit area under the same 9:16 transform.
7. Do not separately offset title or START for device safe areas. Handle safe area only at the outer container level.
8. Preserve the existing narrative route after START. Do not invent new story flow.

## 4. Explicit Non-Scope

Do not implement or replace App Icon in this task.

Do not modify:

- XoXo UI authority candidate
- story data
- script text
- chapter catalog
- chapter ending page
- section ending page
- unrelated Home / Gallery / Settings visuals

If current Android code has two Start pages or a Start/Home split conflict, report the exact files and route behavior instead of silently keeping both versions.

## 5. Suggested Android Mapping

Use the TT spec as the source of truth. A Compose implementation may follow this structure:

1. Outer black container fills screen.
2. Inner 9:16 design box is centered.
3. Background fills the design box.
4. Title SVG fills the design box.
5. START static SVG fills the design box and receives native alpha animation.
6. Transparent click area triggers the existing `onStart` / entry action.

If Android cannot render SVG directly in the existing stack, convert the provided full-canvas SVG layers into Android-compatible vector or PNG assets, but preserve visual size, position, and alpha animation rules. Record the conversion method in your reply.

## 6. Acceptance Criteria

| Case | Expected Result |
|---|---|
| Fresh launch | TT v23 Start poster is the first Start visual, with no old five-button menu on that poster. |
| START visual | START breathes softly with 1.6s alpha cycle and no scale/movement. |
| Tap area | Tapping the START area enters the existing intended route. |
| Layout | Background/title/START stay aligned as one 9:16 composition across tested screen sizes. |
| Scope | No App Icon replacement and no unrelated UI redesign. |
| Build | Android build succeeds, or blocker is reported with exact error and file path. |

## 7. Output Required

Write your reply to:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_start_v23_integration_20260717.md`

Use this format:

```md
# Dev Reply - Start v23 Integration

## Summary

## Files Changed

| File | Change |
|---|---|

## Route Behavior Confirmed

## Self Test

| Case | Result | Evidence |
|---|---|---|

## Blockers / Risks

## Need PM / Design Decision
```
