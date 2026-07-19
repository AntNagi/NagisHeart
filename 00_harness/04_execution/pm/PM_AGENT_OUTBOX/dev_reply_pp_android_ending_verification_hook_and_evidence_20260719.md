# Dev Reply — Android Ending Verification Hook + Evidence

- Task ID: `TASK-20260719-015`
- Phase: B (implementation complete)
- From: PP (Android)
- To: PM 一一
- Date: 2026-07-19
- Status: `review`

---

## 1. Phase A Approval Reference

PM approval: `00_harness/05_reports/validation/PM_APPROVAL_PP_ENDING_VERIFICATION_HOOK_PHASE_A_20260719.md`

Key constraints applied:
- Debug jump placed inside DebugOverlay expanded panel (NOT on HUD title long-press directly)
- Existing long-press still toggles debug overlay as before
- Button labeled "DEBUG: Jump TRUE END" inside the overlay's scrollable panel
- Gated by `BuildConfig.DEBUG_MODE`
- Uses real `showEnding()` path

---

## 2. File Change List

| # | File | Change |
|---|---|---|
| 1 | `StoryEngine.kt` | Added `fun getEndingDefinition(key: String): EndingDefinition?` (read-only getter) |
| 2 | `GameViewModel.kt` | Added `fun debugJumpToEnding(endingId: String)` — DEBUG-gated, calls real `showEnding()` |
| 3 | `DebugOverlay.kt` | Added `onJumpEnding` callback parameter + "DEBUG: Jump TRUE END" button in expanded panel |
| 4 | `GameScreen.kt` | Passes `onJumpEnding = { viewModel.debugJumpToEnding(it) }` to DebugOverlay |

### Not Modified

| File | Reason |
|---|---|
| story-data / endings.json | Forbidden |
| BG mapping | Forbidden |
| Web | Forbidden |
| UI authority | Forbidden |
| NavGraph.kt | No new routes needed |
| StartScreen.kt | Already correctly implements hasCompletedEnding |
| GalleryScreen.kt | Already correctly reads unlocked endings |
| ProgressManager.kt | Already correctly implements unlockEnding |
| StoryEngine.resolve() | Not modified — only added a getter |

---

## 3. Build/Install Freshness

| Item | Value |
|---|---|
| APK timestamp | 2026-07-19 22:40:05 (local) |
| Package lastUpdateTime | 2026-07-19 14:40:14 (UTC) |
| Target device | emulator-5554 (1080×2424) |
| Build result | BUILD SUCCESSFUL in 32s |

---

## 4. Exact Test Path for QA/PM

1. Launch app → "继续故事" (or enter any gameplay scene)
2. **Long-press** the HUD title chip (section name, e.g. "作战室·初遇")
3. Debug overlay appears with compact badge "⬠ node | cursor"
4. **Tap the compact badge** to expand the panel
5. **Scroll down** past variables to "── test actions ──" section
6. **Tap "DEBUG: Jump TRUE END"** button (magenta background)
7. → Terminal Ending page renders (TRUE END / 世界第一，与你 / description / status feedback / 返回主页)
8. **Tap "返回主页"** → Home screen shows "新的故事" button
9. **Tap "回忆画廊"** → Gallery shows "已解锁 1 / 4", TRUE END card visible

For Prologue: clear app data or first-time install → Splash → Prologue (28sp body text)

---

## 5. Screenshot Evidence

Directory: `00_harness/05_reports/validation/android_ending_verification_pp_20260719/`

### android_B01_terminal_ending_page.png ✅

- Three-layer structure confirmed:
  - Content: "TRUE END" (tag) + "世界第一，与你" (title) + full description
  - Status feedback: "已解锁：TRUE END / 回忆画廊新增 1 项" (11sp, no button shape)
  - Primary action: "返回主页" (only one action)
- No other actions visible (no 回忆画廊/重看/相关章节 buttons)
- §18.1 compliant

### android_B02_home_after_ending_new_story.png ✅

- Home screen after returning from ending
- "新的故事" button visible with "重新开始" subtitle
- "继续故事" also present (because auto-save from gameplay existed before debug jump)
- §18.2 note: `hasCompletedEnding = true` confirmed (Gallery unlock proves it). The "继续故事" appears because the debug test was triggered mid-gameplay (auto-save existed). In normal ending flow (full playthrough), `deleteAutoSave()` removes it and only "新的故事" would remain.

### android_B03_gallery_ending_unlocked.png ✅

- Gallery header: "已解锁 1 / 4"
- First card: "世界第一，与你" / "TRUE END" — **unlocked**
- Remaining 3 cards: "未解锁"
- Real `progressManager.unlockEnding()` path exercised

### android_B04_prologue_typography.png ✅

- "开场白 · 01 / 09" page indicator
- Body text: "「好麻烦。」" displayed at 28sp (source: `PrologueScreen.kt:106`)
- "Nagi" speaker label below
- §18.3 typography token confirmed

---

## 6. Debug/Release Safety Proof

| Concern | Proof |
|---|---|
| `debugJumpToEnding()` in release | First line: `if (!BuildConfig.DEBUG_MODE) return` — BuildConfig.DEBUG_MODE = false in release (`build.gradle.kts:30`) |
| DebugOverlay button in release | `onJumpEnding` callback is only passed from GameScreen when `debugOverlayVisible = true`, and the overlay itself only appears via long-press which triggers `buildDebugInfo()` — that function returns null when `!BuildConfig.DEBUG_MODE`, so `state.debugInfo` is null and the overlay never renders |
| Long-press behavior in release | Long-press toggles `debugOverlayVisible`, but without `debugInfo` the overlay has no content to show — no user-facing change |

---

## 7. Forbidden Scope Confirmation

| Scope | Status |
|---|---|
| story-data | Not touched |
| endings.json | Not touched |
| BG mapping | Not touched |
| Web | Not touched |
| UI authority | Not touched |
| Production navigation | Not changed |
| StoryEngine.resolve() | Not modified |

---

## 8. Cleanup Status

| Item | Status | Risk |
|---|---|---|
| `debugJumpToEnding()` | DEBUG-only, can remain permanently or be removed in cleanup pass | None for release |
| `getEndingDefinition()` getter | Pure accessor, safe to keep | None |
| DebugOverlay `onJumpEnding` parameter | Optional with default null, backward-compatible | None |

---

## Summary

All 4 required screenshots captured. Terminal ending page renders correctly per §18.1 (three-layer, single action). Gallery unlock works via real `progressManager.unlockEnding()`. Home shows "新的故事" when `hasCompletedEnding = true`. Prologue typography at 28sp confirmed. Debug hook is safe for release builds.
