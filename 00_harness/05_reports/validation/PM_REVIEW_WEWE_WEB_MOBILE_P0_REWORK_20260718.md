# PM Review - Wewe TASK-20260718-010 Web Mobile P0 Rework

- Review owner: PM 一一
- Date: 2026-07-18
- Source dev reply: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_mobile_p0_rework_20260718.md`
- Prior QA blocker: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_dede_web_mobile_full_regression_20260718.md`
- Evidence directory: `00_harness/05_reports/validation/web_mobile_p0_rework_20260718/`
- Status: `review / requires independent QA rerun`

## PM conclusion

Wewe's root-cause explanation for the mobile black screen is technically plausible and matches the prior observed symptoms: DOM mounted, resources loaded, console clean, but the visible mobile surface collapsed to a dark body background because the viewport-height chain failed.

The submitted Start v23 evidence is visually acceptable for the two requested mobile widths:

- `web_mobile_start_393x852.png`
- `web_mobile_start_430x932.png`

However, this PM review does **not** mark Web mobile as accepted or ready for Ant final visual/interaction acceptance.

Reason: the evidence package only contains Start screenshots. DeDe's prior blockers covered more than Start:

1. Game page mobile layout/background/HUD overlap.
2. Chapter Opening visible/tappable flow.
3. Backlog route correctness.
4. Skip-section confirmation dialog.
5. HUD authority information structure.
6. BGM setting operability.

Wewe's report says these paths were locally checked, but the required independent evidence has not yet been produced. The correct next step is a DeDe rerun, not PM final acceptance.

## Scope check

Reported changed files:

- `web/styles/layout.css`
- `web/styles/screens/splash.css`
- `web/styles/screens/game.css`

Current visible uncommitted diff at PM intake only shows `web/styles/screens/game.css`. This is not treated as a failure by itself because the other CSS changes may already be in the shared working state, but DeDe must verify behavior from the running Web app rather than trusting the file list.

Reported scope boundary:

- Android touched: no
- No authority_current changes
- No story-data / BG mapping / TT authority / archive changes

PM accepts the intended scope. Independent QA must still confirm actual behavior.

## Acceptance gate for rerun

DeDe must rerun Web mobile QA at minimum on:

- 393x852
- 430x932

Required flows:

1. Start v23 visible and tappable.
2. Home / Prologue / Name Setup visible.
3. Game page background fills viewport; HUD and dialogue do not overlap.
4. HUD matches current authority structure and language.
5. Backlog opens actual backlog, not chapter catalog; paging uses swipe semantics.
6. Skip section opens NagiDialog confirmation before changing flow.
7. Chapter Opening / Section Opening visible and tappable.
8. Section Clear / Chapter Clear reachable and visually usable.
9. Settings BGM has an operable volume control and does not merely show text.
10. Console has no blocking errors; key assets have no 404/failed requests.

## PM action

Open follow-up QA task `TASK-20260718-015` for DeDe: Web Mobile Full Regression Rerun after Wewe P0 Rework.

Wewe `TASK-20260718-010` remains in review until DeDe confirms the above flows. If DeDe still finds P0/P1 blockers, the result goes back to Wewe as another reject-fix task.

## Cleanup status

No cleanup performed by PM in this review.

