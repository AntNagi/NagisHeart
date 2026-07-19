# PM Review — PP Android Ending Verification Hook + Evidence

- Date: 2026-07-19
- PM: 一一
- Task: `TASK-20260719-015`
- Dev reply: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_ending_verification_hook_and_evidence_20260719.md`
- Evidence folder: `00_harness/05_reports/validation/android_ending_verification_pp_20260719/`
- Verdict: `rework_required`

## 1. PM conclusion

PP's debug hook implementation direction is mostly accepted, but the task cannot pass yet.

Accepted:

1. Debug hook is placed inside DebugOverlay instead of directly hijacking HUD title long-press.
2. Hook is `BuildConfig.DEBUG_MODE` gated.
3. `StoryEngine.resolve()` was not modified.
4. Story-data / endings JSON were not modified.
5. Gallery unlock evidence is valid.
6. Prologue typography evidence exists.

Rejected / requires rework:

1. B02 Home after ending does **not** meet Ant's product decision.
2. B01 terminal ending screenshot is polluted by the debug overlay, so it is not a clean visual acceptance screenshot.

## 2. B02 rejection — Home after ending

PP reports that after returning from ending, Home shows both:

- `继续故事`
- `新的故事`

Screenshot:

- `android_B02_home_after_ending_new_story.png`

This is not acceptable.

Ant's product decision:

> After an ending completes, Home must not show `继续故事`; completed run resets to new-run state, so Home primary CTA becomes `新的故事`.

PP's explanation says this is because debug jump was triggered while an auto-save existed. PM does not accept that as pass, because:

1. The debug hook is explicitly meant to exercise the real `showEnding()` path.
2. `showEnding()` calls `saveManager.deleteAutoSave()`.
3. If Home still receives `hasSave = true`, either state refresh is wrong, save deletion is incomplete, or Home priority logic still allows completed-ending state and continue-save state to coexist visually.
4. The screenshot proves the acceptance condition is not met.

Observed code risk:

- `StartScreen.kt` renders `继续故事` whenever `hasSave` is true.
- It then also renders `新的故事` because `hasSave` or `hasCompletedEnding` is true.
- This allows exactly the forbidden visible combination after an ending.

Required behavior:

- If `hasCompletedEnding == true`, Home must not show `继续故事`.
- Home should show `新的故事` as the main start CTA.
- If old auto-save data exists, it must not override the completed-ending Home state.

## 3. B01 clean screenshot required

Screenshot:

- `android_B01_terminal_ending_page.png`

Issue:

- Debug overlay remains visible and covers the ending page.

PM can use it as proof that the hook triggered the ending, but not as a clean UI acceptance screenshot.

Required:

- Close/hide debug overlay before capturing the terminal ending page.
- Capture clean ending page with:
  - tag/title/description;
  - lightweight status feedback;
  - only one action: `返回主页`;
  - no debug overlay covering UI.

## 4. B03 / B04

Accepted with caveat:

- `android_B03_gallery_ending_unlocked.png` proves TRUE END unlock.
- `android_B04_prologue_typography.png` proves Prologue 28sp path exists.

Caveat:

- B04 is a short first prologue line, not a full multi-paragraph typography comfort proof. This is sufficient for this task but not final visual taste acceptance.

## 5. Required rework

Open a narrow rework under the same task `TASK-20260719-015`.

Allowed files:

- `StartScreen.kt`
- `NavGraph.kt`
- `GameViewModel.kt`
- Debug hook files only if needed for evidence capture.

Required implementation result:

1. Home after ending must not display `继续故事`.
2. Home must display `新的故事`.
3. If auto-save still physically exists for debug reasons, completed-ending state must take visual priority and suppress continue UI.
4. Prefer also proving/ensuring auto-save deletion actually refreshes `hasPlayed()` state after returning to Home.
5. Do not modify story-data, endings JSON, BG mapping, Web, UI authority, or production navigation unrelated to Home state.

Required new screenshots:

- `android_B01_terminal_ending_page_clean.png`
- `android_B02_home_after_ending_new_story_only.png`
- `android_B03_gallery_ending_unlocked_after_rework.png`

Required final rework report:

- `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_ending_verification_hook_rework_20260719.md`

## 6. Status

`TASK-20260719-015` stays `review/rework_required`.

Do not start `TASK-20260719-016` until 015 rework is submitted or PM explicitly reprioritizes.

Cleanup status: none.
