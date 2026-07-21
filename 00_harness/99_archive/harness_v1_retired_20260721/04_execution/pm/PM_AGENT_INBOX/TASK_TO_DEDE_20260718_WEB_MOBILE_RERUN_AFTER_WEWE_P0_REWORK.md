# TASK TO DEDE - Web Mobile Full Regression Rerun after Wewe P0 Rework

- Task ID: `TASK-20260718-015`
- Project: NagisHeart
- Sender: PM 一一
- Owner: DeDe（Codex / QA）
- Date: 2026-07-18
- Repository: `D:\Nagi's Heart\NagisHeart`
- Mode: QA only / read-only
- Priority: P0

## Why this task exists

Wewe has reported `TASK-20260718-010 Web Mobile P0 Rework` complete.

PM review accepts that the Start mobile black-screen root cause is plausible and that the provided Start screenshots are visible:

- `00_harness/05_reports/validation/web_mobile_p0_rework_20260718/web_mobile_start_393x852.png`
- `00_harness/05_reports/validation/web_mobile_p0_rework_20260718/web_mobile_start_430x932.png`

But Wewe only submitted Start screenshots. Your prior QA blockers covered more than Start, so Web mobile cannot be accepted until you rerun the full mobile regression.

## Required reading

Read these first:

1. `00_harness/05_reports/validation/PM_REVIEW_WEWE_WEB_MOBILE_P0_REWORK_20260718.md`
2. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_mobile_p0_rework_20260718.md`
3. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_dede_web_mobile_full_regression_20260718.md`
4. Latest authority UI:
   - `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
   - `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
5. Latest interaction authority:
   - `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`

## Test scope

Run Web mobile QA on:

- `393x852`
- `430x932`

Required flows:

1. Start v23 visible and tappable.
2. Home visible and usable.
3. Prologue visible and can proceed.
4. Name Setup visible and can proceed.
5. Game page:
   - current background fills viewport;
   - HUD is within safe area;
   - HUD and dialogue do not overlap;
   - dialogue is readable.
6. HUD authority:
   - no final English `AUTO / SKIP / MENU` structure if authority requires icon/title/action layout;
   - back/title/auto/save/backlog/menu/skip behavior must match current authority.
7. NagiDialog:
   - skip-section must show confirmation before changing flow;
   - cancel returns to original story position;
   - confirm lands on the correct section/chapter clear flow.
8. Backlog:
   - backlog entry opens backlog, not chapter catalog;
   - 8 items/page;
   - mobile paging should be swipe semantics, not visible previous/next text buttons.
9. Chapter Catalog:
   - independent catalog entry opens catalog-panel style screen.
10. Chapter Opening / Section Opening:
   - visible;
   - text backing visible enough;
   - tap/continue works.
11. Section Clear / Chapter Clear:
   - reachable;
   - clear-card visible;
   - actions usable.
12. Settings / BGM:
   - BGM row is not just static text;
   - volume control is operable;
   - no blocking autoplay/console issue left unexplained.
13. Console / network:
   - no blocking console errors;
   - no key resource 404/failed requests.

## Evidence requirements

Write report to:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_dede_web_mobile_rerun_after_wewe_p0_20260718.md`

Save screenshots/evidence to:

`00_harness/05_reports/validation/web_mobile_qa_dede_rerun_20260718/`

Include at minimum:

- P0/P1/P2 issue table.
- Actual vs expected.
- Repro steps.
- Screenshot filenames.
- Console/resource summary.
- Whether each prior blocker is fixed, still failing, or not reached.
- `Code touched: no`.
- Cleanup status.

## Strict boundaries

Do not modify code or assets.

Forbidden:

- `web/` code changes
- `android/` changes
- story-data changes
- BG mapping changes
- authority_current changes
- TT Start / App Icon changes
- archive restore or cleanup

If P0 blocks the flow again, stop after collecting enough evidence and submit a staged report using the 10-minute rule.

