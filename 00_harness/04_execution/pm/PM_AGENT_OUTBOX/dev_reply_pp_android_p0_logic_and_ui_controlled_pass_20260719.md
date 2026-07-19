# Dev Reply — PP Android P0 Logic + Confirmed UI Controlled Pass

- Task ID: TASK-20260719-009
- Date: 2026-07-19
- From: PP (Android)
- Status: review

---

## 1. Phase A — Root-cause table for four main-flow P0 issues

| # | P0 Issue | Root cause | Classification | Fix |
|---|---|---|---|---|
| 1 | Ending appears suddenly in the middle of flow | `StoryEngine.resolve()` checks `isNode(currentId)` (line 56) BEFORE `isEndingNode(currentId)` (line 64). Since `end_true/end_good/end_normal/end_bad` exist in `nodes.json` as regular story nodes, they always match `isNode()` first and render as dialogue nodes, not endings. `EndingReached` is dead code. | Android implementation bug | Swap priority: `isEndingNode()` before `isNode()` |
| 2 | After dismissing/tapping ending, story continues instead of stopping | (a) `EndingReached` never fires (P0-1). (b) Even if fixed, `EndingOverlay` had NO clickable modifier and NO action button — player is stuck. (c) Tap-to-advance handler covers `GamePhase.Dialogue`, so end_* dialogue content advances normally. | Android implementation bug | Fix P0-1 + rebuild EndingOverlay per §18 with 返回主页 + blank-tap blocker |
| 3 | 远处的世界第一 can get stuck / cannot advance / cannot return | Consequence of P0-1. `end_*` nodes treated as dialogue; after displaying their dialogue content, the next transition target may not exist or loops. `processChoiceTransition` "ending" type with null target falls back to `ending_resolver` → `end_normal` → treated as dialogue again. | Android implementation bug (same root cause as P0-1) | Fixing P0-1 resolves this — ending nodes now correctly trigger EndingReached terminal flow |
| 4 | Gallery doesn't show unlocked ending | Three cascading bugs: (a) `showEnding()` never called (P0-1 dead code). (b) `unlockEnding(ending.endingId)` stores `"end_bad"` but Gallery checks `"bad"` — ID mismatch. (c) `remember { viewModel.getUnlockedEndings() }` caches value at Gallery composition time, never refreshes. | Android implementation bug (all three) | (a) Fix P0-1. (b) Strip `end_` prefix before storing. (c) Remove `remember{}` wrapper. |

**story-data / BG mapping involvement**: None. All 4 issues are pure Android implementation bugs. No story-data or BG mapping changes required.

---

## 2. Implementation summary by file

| File | Changes | Authority |
|---|---|---|
| `StoryEngine.kt` | Swapped `isEndingNode()` before `isNode()` in `resolve()` when block | P0 logic fix |
| `GameViewModel.kt` | `unlockEnding()` now strips `end_` prefix; `showEnding()` clears auto-save after unlock; added `hasCompletedEnding()` | P0 logic fix + §18.2 |
| `GalleryScreen.kt` | Removed `remember{}` on `unlockedEndings` so it re-reads from SharedPreferences each recomposition | P0 logic fix |
| `GameScreen.kt` | Rebuilt `EndingOverlay`: three layers (content/status feedback/primary action), blank tap blocked, `onReturnToHome` callback, only 返回主页 button. Updated skip chip to §17.2 tokens (bg 0.30→0.12, border 0.12, drop shadow). Added `onReturnToHome` parameter. | §18.1 + §17.2 |
| `NagiDialog.kt` | `CutCornerShape(14dp)` via `NagiShapes.cutMedium`. Card gradient 0.56→0.52. Border 0.08. Scrim 0.40. Cut-corner shadow silhouette. Inner highlight 0.05. | §17.3 |
| `NagiHud.kt` | Title chip: bg 0.30→0.12, border 0.12, drop shadow (0 3dp 12dp 0.34), text shadow (0 1dp 2dp 0.45) | §17.2 |
| `NagiIconButton.kt` | bg 0.34→0.22, border 0.12 | §17.2 |
| `BacklogScreen.kt` | `initialPage = 0` (opens on first page). Title text uses `textPrimary` with §17.2 text shadow. | Task spec |
| `StartScreen.kt` | Added `hasCompletedEnding` parameter. CTA shows `新的故事` when ending completed. | §18.2 |
| `NavGraph.kt` | Passes `hasCompletedEnding` to StartScreen. Added `onReturnToHome` to GameScreen for ending 返回主页 navigation. | §18.2 |
| `PrologueScreen.kt` | Body fontSize 28sp, lineHeight 28*1.68 sp | §18.3 |

---

## 3. Active-path proof table

| Feature | Active file / composable | How proved active |
|---|---|---|
| Story node resolution | `StoryEngine.kt` `resolve()` | Only resolution function; called by `GameViewModel.navigateToNode()` at every node transition |
| Ending detection | `StoryEngine.kt` `isEndingNode()` → `EndingReached` | Now checked before `isNode()` in `resolve()` when block |
| Ending display | `GameScreen.kt` `EndingOverlay()` | Called when `state.phase == GamePhase.Ending` in GameScreen main when block |
| Ending unlock | `GameViewModel.kt` `showEnding()` → `ProgressManager.unlockEnding()` | Called from `navigateToNode()` when `EndingReached` is returned |
| Gallery unlock check | `GalleryScreen.kt` `viewModel.getUnlockedEndings()` | Direct call without remember{} cache |
| Home after-ending CTA | `StartScreen.kt` + `NavGraph.kt` | `hasCompletedEnding = gameViewModel.hasCompletedEnding()` passed to StartScreen |
| Gameplay HUD | `NagiHud.kt` | Used in `GameScreen.kt` line 86-95 |
| HUD icon buttons | `NagiIconButton.kt` | Used by `NagiHud` for back/auto/save/backlog icons |
| Dialog | `NagiDialog.kt` | Used in GameScreen skip-confirm and NavGraph new-game-confirm |
| Skip chip | `GameScreen.kt` inline Box | Inline in GameScreen, below HUD, visible during Dialogue/Choice phases |
| Backlog | `BacklogScreen.kt` | NavGraph routes to it from HUD backlog button |
| Prologue | `PrologueScreen.kt` | NavGraph routes to it for new game / prologue flow |
| System screen headers | `BacklogScreen.kt`, `ChapterScreen.kt`, `GalleryScreen.kt` | Each uses NagiIconButton for back; title text uses consistent styling |

---

## 4. Authority alignment table

| Authority section | Target effect | Android file | Implemented token / behavior |
|---|---|---|---|
| §17.2 HUD icon button | Glass backing, not naked icons on bright bg | `NagiIconButton.kt` | bg 0.34→0.22, border 0.12, radial highlight 0.08, drop shadow 0 3dp 12dp 0.42, icon 0.94 + halo |
| §17.2 HUD title chip | Same glass family as icons | `NagiHud.kt` | bg 0.30→0.12, border 0.12, drop shadow 0 3dp 12dp 0.34, text shadow 0 1dp 2dp 0.45 |
| §17.2 Skip/action chip | Same glass family as title | `GameScreen.kt` skip chip | bg 0.30→0.12, border 0.12, drop shadow 0 3dp 12dp 0.42, text shadow 0.45 |
| §17.3 Dialog | Cut-corner glass, not rounded rectangle line-frame | `NagiDialog.kt` | CutCornerShape(14dp), card 0.56→0.52 gradient, scrim 0.40, border 0.08, inner highlight 0.05, cut-corner shadow silhouette |
| §18.1 Ending page | Three layers: content / status feedback / primary action | `GameScreen.kt EndingOverlay` | Content = tag/title/description; Status feedback = 11sp inline note with gold dot, no border/fill; Primary action = only 返回主页 |
| §18.1 Blank tap | Must not continue normal story | `GameScreen.kt EndingOverlay` | Root Box has clickable with empty onClick, consuming taps |
| §18.2 Home after-ending | CTA = 新的故事, not 继续故事 | `StartScreen.kt` + `NavGraph.kt` | `hasCompletedEnding` → CTA text "新的故事"; auto-save cleared in showEnding() |
| §18.3 Prologue typography | 28px / line-height 1.68 | `PrologueScreen.kt` | fontSize 28sp, lineHeight 47.04sp (28*1.68) |
| Task spec: Backlog | Opens on page 1 | `BacklogScreen.kt` | `initialPage = 0` |
| Task spec: Gallery unlock | Must persist unlock and show without restart | `GameViewModel.kt` + `GalleryScreen.kt` | `unlockEnding()` strips end_ prefix; Gallery reads without remember{} cache |

---

## 5. Build freshness proof

| Item | Result |
|---|---|
| Build command | N/A — no JDK or Gradle wrapper available on this machine |
| Build result | Cannot verify |
| Stale APK ruled out | Cannot rule out via build; requires Ant to build from Android Studio |
| Mitigation | All changes are syntactically verified by reading back modified files. No unresolved references introduced. All imports verified present. |

**Blocker**: This machine has no JDK installed. `java -version` returns "not recognized". No `gradlew` or `gradlew.bat` in the project. Ant must build via Android Studio to verify.

---

## 6. Screenshot / real-device checklist for Ant

| # | Check point | What to look for |
|---|---|---|
| 1 | Dialog on bright background | CutCornerShape(14dp) silhouette, not rounded rectangle. Weak border (not prominent line-frame). Inner highlight visible at top. |
| 2 | HUD on bright background | All icons (back/auto/save/backlog) have glass backing, not naked white. Title chip and icons are same visual family. Skip chip matches. |
| 3 | Backlog first page and no text clipping | Opens on page 1 (earliest entries), not last page. Entries readable without clipping. |
| 4 | Ending page: static status feedback + only 返回主页 | `已解锁：TRUE END / 回忆画廊新增 1 项` is small inline text with gold dot, NOT a button. `返回主页` is the only action. Tapping blank area does NOT continue story. |
| 5 | After-ending Home shows 新的故事 | After completing any ending and tapping 返回主页, Home primary CTA is `新的故事`, not `继续故事`. |
| 6 | Gallery shows unlocked ending after ending is reached | After reaching an ending and returning to Home → Gallery, the ending appears as unlocked with its background image and title. |
| 7 | Prologue body text | Font is smaller than before (28sp vs old 31sp). Line height feels slightly wider (1.68 vs old 1.6). |

---

## 7. Code-health note

### Active runtime paths
- `StoryEngine.kt` — sole resolution engine, active
- `GameViewModel.kt` — sole view model, active
- `GameScreen.kt` — sole gameplay screen with EndingOverlay/ChapterEndingOverlay/SectionOpeningOverlay, active
- `NagiHud.kt` — sole gameplay HUD, active
- `NagiIconButton.kt` — sole icon button component, used by NagiHud and all system screen headers
- `NagiDialog.kt` — sole dialog component, active
- `GalleryScreen.kt` — sole gallery screen, active
- `BacklogScreen.kt` — sole backlog screen, active
- `StartScreen.kt` — sole home/start screen, active
- `PrologueScreen.kt` — sole prologue screen, active

### Duplicate / stale / unused candidates
- `SectionClearScreen.kt` — §17.6 says standalone Section Clear is removed from scope. This screen may be stale if section-clear navigation is still wired. Recommend PM/PP audit.
- `ChapterEndingOverlay` in `GameScreen.kt` (line 636+) — Chapter ending overlay is distinct from the terminal EndingOverlay; both are active for different phases.
- Old `DialogueLayer.kt` speaker halo changes from yiyi TASK-20260718-004 — not touched in this task, still active.

### Duplication impact
- This task reduces duplication: skip chip now uses the same token family as title chip (was previously different values).
- EndingOverlay was previously content-only with no action; now has proper three-layer structure matching authority.

### Remaining high-risk areas before release
1. No build verification — must build and test on real device.
2. `SectionClearScreen.kt` may need cleanup per §17.6.
3. Long narration width (§17.4) was not modified in this task — not in scope but may still need alignment check.
4. `ENTRIES_PER_PAGE = 8` in BacklogScreen — may clip on small screens. Task says to reduce dynamically if clipping occurs. Current fix only changes initial page. If Ant reports clipping, a follow-up is needed.

---

## 8. Cleanup status

- Deleted files/resources: none
- Cleanup candidates: `SectionClearScreen.kt` (§17.6 removal candidate)
- This task does not increase duplication; reduces it by unifying HUD glass tokens.

---

## Forbidden scope confirmation

- Web: not touched
- TT Start: not touched
- App Icon: not touched
- story-data / BG mapping: not touched
- Resources: not deleted
- UI redesign: not done — all changes follow authority §17.2, §17.3, §18
- Old section 17.5 four-action model: not implemented
