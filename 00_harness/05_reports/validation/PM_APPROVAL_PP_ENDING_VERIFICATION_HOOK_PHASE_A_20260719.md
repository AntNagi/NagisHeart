# PM Approval — PP TASK-20260719-015 Phase A

- Date: 2026-07-19
- PM: 一一
- Task: `TASK-20260719-015 Android Ending Verification Hook + Evidence`
- Reviewed report: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_ending_verification_hook_phase_a_20260719.md`
- Verdict: `approved_with_constraints`

## 1. Approval

Phase A is approved.

The proposed direction is acceptable because it:

1. Does not modify story-data.
2. Does not modify ending definitions.
3. Uses the real `showEnding()` path, so ending unlock / auto-save deletion / EndingOverlay / Home / Gallery are exercised.
4. Is gated by `BuildConfig.DEBUG_MODE`.
5. Exists to unblock QA evidence, not to add a player-facing feature.

## 2. Required PM constraints for Phase B

### 2.1 Do not hijack HUD title long-press directly

Current Android code already uses HUD title long-press to toggle the debug overlay:

- `GameScreen.kt`
- `onTitleLongPress = { debugOverlayVisible = !debugOverlayVisible }`

Do not replace that behavior with a direct ending jump.

Approved behavior:

1. Long-press HUD title opens the existing debug overlay.
2. The debug overlay may include a DEBUG-only explicit test action, e.g. `DEBUG: Jump TRUE END`.
3. Tapping that explicit test action calls `viewModel.debugJumpToEnding("end_true")`.

Reason:

- Direct hidden long-press-to-ending is too easy to mis-trigger and too hard for QA to document.
- A visible DEBUG overlay action creates a clear test path and keeps the hook auditable.

### 2.2 Release safety

All entry points must be release-safe:

- `debugJumpToEnding()` must immediately return when `!BuildConfig.DEBUG_MODE`.
- Debug overlay test action must not be visible or active in release mode.
- No normal player UI should expose ending jump.

### 2.3 Story path integrity

Allowed:

- `GameViewModel.kt`: add `debugJumpToEnding(endingId)`.
- `GameScreen.kt`: add DEBUG-only action inside existing debug overlay path.
- `StoryEngine.kt`: add a read-only `getEndingDefinition(key)` accessor if necessary.

Forbidden:

- changing `StoryEngine.resolve()` behavior;
- changing story-data / endings JSON;
- changing production navigation;
- hardcoding gallery unlock directly;
- marking ending unlocked without passing through `showEnding()`.

## 3. Required Phase B evidence

PP final report must include:

1. File change list.
2. Build/install freshness.
3. Debug/release safety explanation.
4. Exact QA steps.
5. Screenshots:
   - `android_B01_terminal_ending_page.png`
   - `android_B02_home_after_ending_new_story.png`
   - `android_B03_gallery_ending_unlocked.png`
   - `android_B04_prologue_typography.png`
6. Confirmation that forbidden files were not touched.
7. Cleanup status.

## 4. Completion status

Phase A: approved with constraints.

Phase B may begin under the constraints above.

Cleanup status: none.
