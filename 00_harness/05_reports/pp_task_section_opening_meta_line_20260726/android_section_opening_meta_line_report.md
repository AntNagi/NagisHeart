# Android section opening meta line

Source task: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/pp_task_section_opening_meta_line_20260726.md`

Date: 2026-07-26  
Executor: Sai handoff / Codex

## Changes

- `android/app/src/main/java/com/antnagi/nagisheart/ui/viewmodel/GameViewModel.kt`
  - Added `sectionIndex: Int` to `SectionTransitionInfo`.
  - Populated it from `newSectionIndex` when entering `GamePhase.SectionTransition`.
  - The value remains 0-based internally.

- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GameScreen.kt`
  - Passed `sectionIndex` into the active `SectionOpeningOverlay`.
  - Changed the gold meta line from `chapterName` to:
    - `$chapterName · 第 ${sectionIndex + 1} 节`
  - Kept the existing font, size and color: serif, `14.sp`, `NagiTokens.gold`.
  - Added `maxLines = 1`.
  - Removed the 1dp `.border(...)` from `GlassBacking` only.
  - Kept `ClearCard` border untouched.

## Scope notes

- Did not change `AuthorityChapterOpeningOverlay` / `AuthorityChapterEndingOverlay`.
- Did not change stale `SectionOpeningScreen.kt`.
- Did not change story-data, assets, BG mapping, or UI tokens.
- Chapter opening remains unchanged; only section opening receives the section ordinal.

## Verification

- `node tools/validate.js` — passed: 0 errors, 1 existing hardcoded `Ant` warning.
- `powershell -ExecutionPolicy Bypass -File tools/check-tokens.ps1` — passed.
- `git diff --check -- android/app/src/main/java/com/antnagi/nagisheart/ui/viewmodel/GameViewModel.kt android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GameScreen.kt` — no whitespace errors; Git reports expected CRLF normalization warning.
- Symbol check:
  - `SectionTransitionInfo` has one constructor site and now carries `sectionIndex`.
  - `GlassBacking` no longer has a `.border(...)`.
  - Other `.border(...)` occurrences remain outside this task scope, including `ClearCard`.

## Known local blockers

- Android compile was not run locally because this checkout has no `android/gradlew`, and system `gradle` is not installed.
- `tools/check-authority.ps1` currently fails before this task because `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` and `authority/visual_mapping/NagisHeart_SCRIPT_V15_节点匹配表.xlsx` hashes drift from `authority/MANIFEST.md`. This Android task did not edit authority files.
