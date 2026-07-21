# TASK TO WEWE - Web Mobile QA Reject Fix Round 2

- Task ID: `TASK-20260718-016`
- Project: NagisHeart
- Sender: PM 一一
- Owner: Wewe（Web developer / Claude）
- Date: 2026-07-18
- Priority: P0
- Status: ready / waiting dispatch
- Scope: Web only

## Why this task exists

DeDe reran Web mobile QA after your `TASK-20260718-010` P0 rework.

Result: reject. Web mobile still cannot enter Ant visual / interaction acceptance.

Read these before changing code:

1. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_dede_web_mobile_rerun_after_wewe_p0_20260718.md`
2. `00_harness/05_reports/validation/PM_REVIEW_DEDE_WEB_MOBILE_RERUN_AFTER_WEWE_P0_20260718.md`
3. `00_harness/05_reports/validation/PM_REVIEW_WEWE_WEB_MOBILE_P0_REWORK_20260718.md`
4. Latest UI authority:
   - `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
   - `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
5. Latest interaction authority:
   - `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`

## Current QA result

Fixed:

- Game page height collapse / invisible background.
- Backlog route no longer opens chapter catalog.

Still failing:

1. P0: Chapter Opening is visible but cannot continue when tapped. Section/Chapter Clear remain unreachable.
2. P1: Skip-section still does not show NagiDialog confirmation.
3. P1: HUD still uses old English `AUTO / SKIP / MENU`.
4. P1: BGM setting remains static `50%` text, not an operable control.
5. P1: Opening screens incorrectly keep story HUD visible.

## Required implementation

### 1. Opening flow

- Chapter Opening and Section Opening must be visible.
- Tap/continue must work on mobile.
- Hide story HUD while Opening / Clear full-screen states are active.
- Do not let the flow get stuck before Section Clear / Chapter Clear.

### 2. Skip-section flow

- Clicking skip-section must open NagiDialog confirmation.
- Cancel returns to the exact current story position.
- Confirm lands on the correct current Section Clear / end-of-section state.
- Do not jump directly to Chapter Opening.

### 3. HUD authority

- Replace old final `AUTO / SKIP / MENU` control structure.
- Use current authority HUD structure and Chinese/localized control language where text is required.
- Do not treat this as a temporary debug HUD.

### 4. BGM settings

- BGM volume must be an actual operable mobile control.
- The displayed value must update when changed.
- If browser autoplay policy limits playback, document the user gesture recovery path.

## Verification required before reporting

Run at mobile widths:

- 393x852
- 430x932

If your tooling cannot force exact viewport dimensions, say so clearly and still provide the closest reliable mobile evidence. Do not claim exact viewport pass without exact evidence.

Required evidence after fix:

- Start
- Game with authority HUD
- NagiDialog skip confirmation
- Chapter Opening after tap-ready state
- Section Clear reachable
- Chapter Clear reachable if flow allows
- Backlog
- Chapter Catalog
- Settings BGM operable state

## Output

Write report:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_mobile_qa_reject_fix_round2_20260718.md`

Include:

- Files changed.
- Which DeDe issues are fixed.
- Screenshots/evidence paths.
- Console / resource summary.
- `Android touched: no`.
- Cleanup status.

## Strict boundaries

You may modify only Web implementation files under `web/` unless a PM message explicitly expands the scope.

Forbidden:

- Android changes.
- story-data text changes.
- BG mapping authority changes.
- `00_harness/08_authority_current/` changes.
- TT Start / App Icon authority changes.
- archive restore or cleanup.
- Any Android resource, manifest, or Gradle file.

