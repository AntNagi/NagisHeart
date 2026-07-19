# PM Approval — PP TASK-20260719-013 Phase A

- Date: 2026-07-19
- PM: 一一
- Task: `TASK-20260719-013 Android Section Clear Removal P0`
- Reviewed report: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_section_clear_removal_p0_phase_a_20260719.md`
- Verdict: `approved_with_constraints`

## 1. Approval

Phase A is approved.

PP correctly identified:

1. The active `sectionClear` route path.
2. The skip dialog copy problem.
3. The fact that normal section ending does not currently require `SectionClearScreen`.
4. The minimal file set: `GameScreen.kt`, `GameViewModel.kt`, `NavGraph.kt`.
5. `SectionClearScreen.kt` should not be deleted in this task; it becomes a cleanup candidate only after runtime references are removed.

## 2. PM constraint before Phase B coding

PP's Phase A section 5 proposes adding fresh chapter/section/ending branching logic inside `skipSection()`.

That part is **not approved** as written.

Reason:

- Android has already accumulated duplicated flow logic.
- This P0 fix must not create another parallel story-routing implementation.
- The existing primary route should remain `StoryEngine.resolve()` → `enterNode()` / `showEnding()`.

Approved implementation direction:

1. `GameScreen.kt`
   - update skip dialog copy;
   - remove `onNavigateToSectionClear()` from confirm path;
   - after confirm, call `viewModel.skipSection()` only.

2. `GameViewModel.kt`
   - `skipSection()` may still mark section skipped and calculate `nextStartNode`;
   - after `engine.resolve(nextStartNode, gameState)`, dispatch through existing main-flow handlers:
     - `NodeResolution.Found` → `enterNode(resolution)`;
     - `NodeResolution.EndingReached` → `showEnding(resolution)`;
     - `NodeResolution.NotFound` → set `GamePhase.Error` with useful message.
   - do **not** duplicate section/chapter/ending branching rules manually.
   - remove or leave unused `advanceAfterSectionClear()` only if all active callers are removed; if left unused, report it as cleanup candidate.

3. `NavGraph.kt`
   - remove active `Routes.SECTION_CLEAR` composable;
   - remove `onNavigateToSectionClear` callback wiring into `GameScreen`;
   - if `Routes.SECTION_CLEAR` constant remains unused, either remove it or report why it remains.

4. `SectionClearScreen.kt`
   - do not delete in this task unless PM separately approves cleanup.
   - it must not be reachable from active runtime navigation.

## 3. Required proof after Phase B

PP's final report must include:

1. Build/install freshness.
2. Static search results for:
   - `sectionClear`
   - `SectionClearScreen`
   - `advanceAfterSectionClear`
   - `进入本节结束页`
3. Runtime screenshots:
   - skip dialog copy after change;
   - after confirming skip, no Section Clear appears;
   - natural section end no Section Clear;
   - Chapter Clear if reached.
4. Explicit confirmation that no Web/story-data/BG mapping/authority/App Icon/BGM files were touched.

## 4. Completion status

Phase A: approved.

Phase B: may begin under the constraints above.

Cleanup status: none.
