# PM Review - DeDe TASK-20260718-015 Web Mobile Rerun after Wewe P0 Rework

- Review owner: PM 一一
- Date: 2026-07-18
- QA report: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_dede_web_mobile_rerun_after_wewe_p0_20260718.md`
- Evidence directory: `00_harness/05_reports/validation/web_mobile_qa_dede_rerun_20260718/`
- Related dev task: `TASK-20260718-010`
- Status: `reject / rework required`

## PM conclusion

DeDe's rerun confirms that Wewe's P0 rework only partially fixed the Web mobile blockers.

Accepted as fixed:

1. Old P0-001: Game page height collapse / invisible background is fixed. The game page background and dialogue are now visible.
2. Old P1 Backlog route: Backlog now opens the backlog screen rather than chapter catalog.
3. Start / Home / Prologue / Name Setup remain reachable.

Still failing:

1. P0 remains: Chapter Opening is now visible but cannot be advanced by tapping either the card or background, so Section Clear / Chapter Clear remain unreachable.
2. Skip-section still does not open NagiDialog confirmation before changing flow.
3. HUD still uses old English `AUTO / SKIP / MENU` structure, not current authority.
4. BGM volume remains static `50%` text and is not operable.
5. Opening still incorrectly keeps story HUD visible.

Therefore Web mobile is **not ready for Ant visual / interaction acceptance**.

## Evidence reviewed

- `game_393x852.png`: background visible, but HUD still old English structure.
- `skip_chapter_opening_393x852.png`: Chapter Opening visible but story HUD remains and flow cannot continue.
- `settings_bgm_393x852.png`: BGM shown as static text while overlay layering remains visually poor.

DeDe also correctly disclosed a QA infrastructure limitation: the browser viewport override did not land as exact `393x852 / 430x932`; therefore the current evidence is valid for narrow mobile layout behavior, but the next pass must include exact viewport evidence when possible.

## PM decision

`TASK-20260718-010` remains `reject / rework`.

Open follow-up Wewe task `TASK-20260718-016`: Web Mobile QA Reject Fix Round 2.

Wewe must not treat this as a CSS-only task. The remaining blockers include controller / route / interaction behavior and authority implementation gaps.

## Required fixes for Wewe

1. Opening flow:
   - Chapter Opening / Section Opening must be visible.
   - Tapping the card or intended continue region must advance reliably.
   - Opening screens must hide story HUD.

2. Skip-section:
   - Must show NagiDialog confirmation.
   - Cancel returns to current story position.
   - Confirm lands on the correct current Section Clear flow, not Chapter Opening.

3. HUD:
   - Replace old English `AUTO / SKIP / MENU` final structure with current authority HUD.
   - Do not leave final UI in English control-label mode.

4. BGM settings:
   - BGM row must be operable, not static text.
   - Provide a mobile-usable control and verify value changes.

5. QA evidence after fix:
   - Provide screenshots/evidence for Game, HUD, NagiDialog, Opening tap, Section Clear, Chapter Clear, Backlog, Settings BGM at mobile widths.
   - State `Android touched: no`.

## Cleanup status

No PM cleanup performed. No code touched by DeDe.

