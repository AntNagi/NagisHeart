# TASK-20260726-002 Android story-map route context fix

Date: 2026-07-27  
Executor: Sai handoff / Codex

## Active path

Story-map node entry is:

`ChapterScreen` → `NavGraph` → `GameViewModel`

- Completed / skipped-completed section cards call `startReplay(startNode, chapterId, sectionIndex)`.
- In-progress section cards call `jumpToChapter(startNode)`.
- Flow routing then happens in `StoryEngine.getNextNodeId(currentId, gameState)`, which reads:
  - `mj == "M"` for `flow.byRoute.M`
  - `mj == "J"` for `flow.byRoute.J`
  - `path == "dream" | "stay" | "bad"` for final routes

## Android changes

File changed:

- `android/app/src/main/java/com/antnagi/nagisheart/ui/viewmodel/GameViewModel.kt`

Implementation:

- Added `nodeToSection: Map<String, ChapterSection>` during chapter loading, keyed by `section.startNode` and `altStartNode`.
- Added `applySectionRouteContext(section)`:
  - `scope == "M"` sets `gameState.mj = "M"`.
  - `scope == "J"` sets `gameState.mj = "J"`.
  - `common`, blank, `dream`, `stay`, `bad` do not set `mj`.
- `startReplay(...)` now reads the section by `chapterId + sectionIndex`, snapshots current variables before replay, applies section route context, then navigates.
- `stopReplay()` restores the saved variable snapshot, so replay choices and route-local values are not kept in the mainline in-memory state.
- `jumpToChapter(startNode)` now applies section route context from `nodeToSection[startNode]` before navigation.

No story text, BG mapping, UI style, story-data, or route defaults were changed by this Android patch.

## Six-entry route evidence

Static story-data simulation after the Android context rule:

| Entry | Section scope | Injected local context | Continuation evidence |
|---|---:|---|---|
| `e_agency_launch` | `common` | none | `flow.default.e_agency_launch -> e_scarf`; choices have no explicit transition, so PM's M default兜底 covers this common entry |
| `e_scarf` | `M` | `mj=M` | `flow.byRoute.M.e_scarf -> e_sick_fragile`; both choices also target `e_sick_fragile` |
| `e_sick_fragile` | `M` | `mj=M` | `flow.byRoute.M.e_sick_fragile -> route_love_hidden`; choices also target `route_love_hidden` |
| `e_dressup` | `J` | `mj=J` | `flow.byRoute.J.e_dressup -> e_softrice`; choices also target `e_softrice` |
| `e_softrice` | `J` | `mj=J` | `flow.byRoute.J.e_softrice -> e_drunk`; choices also target `e_drunk` |
| `p8_route` | `common` | none | no default route is injected; the node has 3 visible choices targeting `dream_exist`, `stay_match`, `bad_elegant` |

Non-startNode check:

- `e_drunk_s2` is reached inside the J-scoped `e_drunk` replay path.
- With inherited local `mj=J`, `flow.byRoute.J.e_drunk_s2 -> route_love_hidden`.
- Its own choices also explicitly target `route_love_hidden`.

## Verification commands

- `node tools/validate.js`
  - Passed: 0 errors, 1 existing hardcoded `Ant` warning.
- `powershell -ExecutionPolicy Bypass -File tools/check-tokens.ps1`
  - Passed.
- `git diff --check -- android/app/src/main/java/com/antnagi/nagisheart/ui/viewmodel/GameViewModel.kt`
  - Passed; Git only reported expected CRLF normalization warning.

## Build status

Android compile was not run locally:

- No `android/gradlew` or `android/gradlew.bat` exists in this checkout.
- System `gradle` is not installed: PowerShell reports `gradle` is not recognized.

## Known repo-level blocker outside this patch

`powershell -ExecutionPolicy Bypass -File tools/check-authority.ps1` still fails before this Android work due existing authority hash drift:

- `authority/ui/XoXo_UI_Final_MinSpec_20260712.md`
- `authority/visual_mapping/NagisHeart_SCRIPT_V15_节点匹配表.xlsx`

This patch did not edit authority files.
