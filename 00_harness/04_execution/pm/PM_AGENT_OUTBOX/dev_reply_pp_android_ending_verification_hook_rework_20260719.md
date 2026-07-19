# Dev Reply — Android Ending Verification Hook Rework

- Task ID: `TASK-20260719-015`
- Phase: B rework
- From: PP (Android)
- To: PM 一一
- Date: 2026-07-19
- Status: `review`
- PM Review ref: `00_harness/05_reports/validation/PM_REVIEW_PP_ANDROID_ENDING_VERIFICATION_HOOK_20260719.md`

---

## 1. Rework Items Addressed

### Issue 1: B02 — Home shows "继续故事" after ending (NOT PASS → FIXED)

**Root cause**: `StartScreen.kt` line 44 showed "继续故事" whenever `hasSave == true`, without checking `hasCompletedEnding`.

**Fix**: Changed condition from `if (hasSave)` to `if (hasSave && !hasCompletedEnding)`.

**File**: `StartScreen.kt:44`

```kotlin
// Before
if (hasSave) {

// After
if (hasSave && !hasCompletedEnding) {
```

**Product rule enforced**: When `hasCompletedEnding == true`, "继续故事" is never shown — regardless of whether auto-save physically exists. Home enters new-run state with "新的故事" as sole primary CTA.

### Issue 2: B01 — Debug overlay covering ending page (NOT PASS → FIXED)

**Root cause**: `debugOverlayVisible` remained true when the phase changed to `GamePhase.Ending`, and the overlay rendered on top of the EndingOverlay.

**Fix**: Added phase check to the overlay render condition.

**File**: `GameScreen.kt:202`

```kotlin
// Before
if (debugOverlayVisible) {

// After
if (debugOverlayVisible && state.phase != GamePhase.Ending) {
```

### Additional: Accessibility improvement for debug button

Added `contentDescription` to the debug jump button in `DebugOverlay.kt` to make it accessible via uiautomator for automated testing.

---

## 2. File Change List (rework delta)

| # | File | Change |
|---|---|---|
| 1 | `StartScreen.kt:44` | `if (hasSave)` → `if (hasSave && !hasCompletedEnding)` |
| 2 | `GameScreen.kt:202` | Added `&& state.phase != GamePhase.Ending` to overlay condition |
| 3 | `DebugOverlay.kt:93` | Added `.semantics { contentDescription = "debug_jump_true_end" }` |

### Not Modified

| Scope | Status |
|---|---|
| story-data | Not touched |
| endings.json | Not touched |
| BG mapping | Not touched |
| Web | Not touched |
| UI authority | Not touched |
| NavGraph.kt | Not touched |
| Production navigation | Not changed |

---

## 3. Rework Screenshot Evidence

Directory: `00_harness/05_reports/validation/android_ending_verification_pp_20260719/`

### android_B01_terminal_ending_page_clean.png ✅

- **No debug overlay** — ending page fully visible and clean
- Three-layer structure confirmed:
  - Content: "TRUE END" (tag) + "世界第一，与你" (title) + full description
  - Status feedback: "已解锁：TRUE END / 回忆画廊新增 1 项"
  - Primary action: "返回主页" (only one action)
- §18.1 compliant

### android_B02_home_after_ending_new_story_only.png ✅

- **Only "新的故事" visible** with "重新开始" subtitle
- **No "继续故事" button** — the rework fix correctly suppresses it when `hasCompletedEnding == true`
- §18.2 compliant: primary CTA is "新的故事" after ending completion
- Bottom row: 存档进度 / 章节目录 / 回忆画廊 / 系统设置

### android_B03_gallery_ending_unlocked_after_rework.png ✅

- Gallery header: "已解锁 1 / 4"
- First card: "世界第一，与你" / "TRUE END" — unlocked
- Remaining 3 cards: "未解锁"
- Real `progressManager.unlockEnding()` path confirmed

---

## 4. Test Path (updated)

1. Launch app → "继续故事" (or enter any gameplay scene)
2. Long-press HUD title chip → debug overlay badge appears
3. Tap badge to expand → scroll to "── test actions ──"
4. Tap "DEBUG: Jump TRUE END" (magenta button)
5. → Ending page renders **clean** (no debug overlay covering it)
6. Tap "返回主页"
7. → Home shows **only "新的故事"** — no "继续故事"
8. Tap "回忆画廊" → "已解锁 1 / 4", TRUE END unlocked

---

## 5. Build Info

| Item | Value |
|---|---|
| APK build | 2026-07-19 rework build |
| Target device | emulator-5554 (1080×2424) |
| Build result | BUILD SUCCESSFUL |

---

## Summary

Both PM rejection items fixed:
1. Home after ending now shows only "新的故事" (no "继续故事") — product decision enforced at UI level regardless of auto-save state
2. Ending page screenshot is clean — debug overlay auto-hides during Ending phase

All 3 rework screenshots captured and saved. Forbidden scope untouched.
