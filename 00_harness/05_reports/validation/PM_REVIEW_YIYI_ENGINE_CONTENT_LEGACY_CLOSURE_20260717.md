# PM Review - yiyi TASK-20260717-009 Engine / Content / Chapter UI Closure

Date: 2026-07-17  
PM: 一一  
Reviewed dev reply: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_engine_content_legacy_closure_20260717.md`

## Verdict

PM static review passed. `TASK-20260717-009` remains `review` pending build / real-device visual verification.

The implementation matches the PM task scope and does not appear to mix in TT Start, App Icon, Gradle wrapper, resource deletion, chapter catalog, or `nagiCall`.

## Checked

### A. Player-visible choice filtering

Pass.

Observed:

- `StoryEngine.kt` adds `getPlayerVisibleChoices(...)`.
- `GameViewModel.kt` keeps `currentChoices = engine.getVisibleChoices(...)` for routing.
- player-facing presentation filters `autoAdvance`, `→`, and blank labels before display.

PM note:

- This preserves auto routing while preventing placeholder choices from appearing to players.

### B. Story recap / Backlog pagination

Pass.

Observed:

- `BacklogScreen.kt` defines `ENTRIES_PER_PAGE = 8`.
- The screen computes pages and shows previous / next navigation.
- This removes reliance on vertical scrolling for the recap view.

### C. Runtime story text sync

Pass.

Observed:

- `story-data/nodes.json` no longer contains the old `好卖` line.
- Runtime now contains `会长想让我去，是因为我有用吧。`

### D. Runtime BG mapping sync

Pass with one pending PM decision.

Observed:

- `wc_offer` now uses `assets/bg/living_room.jpg`.
- Android asset `living_room.jpg` exists.
- No `back.jpg` reference remains in `scene_visuals.json`.
- `u20j` remains on existing `assets/bg/bg_u20j_worldcup_goal_kick.jpg`.
- Android asset `bg_u20j_worldcup_goal_kick.jpg` exists.
- `vs_u20_goal.jpg` does not exist, so yiyi correctly did not create a broken reference.

PM decision still needed:

- For `u20j`, decide whether to keep current `bg_u20j_worldcup_goal_kick.jpg` for now, ask UI/design to supply `vs_u20_goal.jpg`, or select another existing asset.

### E. Theme readability

Pass.

Observed:

- `scene_visuals.json` has no `"Light"` entries.
- Chapter/story gameplay scenes now use `"Dark"` or existing non-story ending theme values.

### F. Chapter UI Section 14 implementation

Pass for static implementation.

Observed:

- `GameScreen.kt` adds `GlassBacking` and applies it to chapter / section opening overlays.
- `GameScreen.kt` adds `ClearCard` and applies it to Chapter Clear.
- `SectionClearScreen.kt` was rewritten around clear-card styling.
- `NagiHud.kt` title chip uses final glass HUD direction.
- Game action chip styling was updated in `GameScreen.kt`.

### G. Backlog audit

Accepted pending runtime verification.

yiyi reports Backlog only records actually traversed dialogue / response lines and clears on section change. Static code read is consistent with this report.

## Accepted implementation limitation

As in `TASK-20260717-010`, the spec's blur language cannot be implemented as true background blur with a simple Compose `RenderEffect` on the component itself. yiyi used translucent gradients, borders, cut shapes, and shadows instead.

PM accepts this for the current review state, subject to Ant大小姐 real-device visual confirmation.

If true frosted-glass blur is required later, it should be opened as a separate technical spike / implementation task.

## Modified Files Reported

1. `story-data/nodes.json`
2. `story-data/scene_visuals.json`
3. `android/app/src/main/java/com/antnagi/nagisheart/engine/StoryEngine.kt`
4. `android/app/src/main/java/com/antnagi/nagisheart/ui/viewmodel/GameViewModel.kt`
5. `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/BacklogScreen.kt`
6. `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GameScreen.kt`
7. `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/SectionClearScreen.kt`
8. `android/app/src/main/java/com/antnagi/nagisheart/ui/component/NagiHud.kt`

## Remaining Verification Before Done

1. Build/run verification via Android Studio or Gradle wrapper.
2. Real-device visual check for:
   - Backlog pagination;
   - Dark readability across chapter scenes;
   - chapter / section opening backing;
   - Chapter Clear / Section Clear;
   - title/action chip styling.
3. PM / Ant decision on `u20j` BG target asset.

## PM Decision

Do not expand `TASK-20260717-009` further. Treat additional polish after real-device testing as new follow-up tasks.
