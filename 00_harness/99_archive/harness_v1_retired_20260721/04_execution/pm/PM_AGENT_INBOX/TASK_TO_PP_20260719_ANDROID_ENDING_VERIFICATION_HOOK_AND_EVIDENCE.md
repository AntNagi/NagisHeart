# TASK_TO_PP_20260719_ANDROID_ENDING_VERIFICATION_HOOK_AND_EVIDENCE

- Task ID: `TASK-20260719-015`
- Project: NagisHeart
- Owner: Android 开发工程师 PP
- Priority: P0
- Status: assigned
- Type: Android debug/testability + evidence, minimal implementation
- PM: 一一
- Date: 2026-07-19

## 0. Why this task exists

Laud completed Android QA evidence sweep:

- `00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_laud_android_evidence_sweep_20260719.md`
- PM review: `00_harness/05_reports/validation/PM_REVIEW_LAUD_ANDROID_EVIDENCE_SWEEP_20260719.md`

Most Android UI areas now have screenshot-backed direction-level pass, but the most important main-flow checks are still blocked:

1. Terminal Ending page.
2. Home after ending should show `新的故事`, not `继续故事`.
3. Gallery should unlock the reached ending.

Reason: QA cannot reasonably play through the full game manually in one pass.

This task exists to provide a safe debug/test route or dev-only test hook so QA can verify the ending flow without changing story content.

## 1. Mandatory read list

Read first:

1. `00_harness/07_scheduler/WORKER_LOOP.md`
2. `00_harness/06_templates/tpl_alignment_code_review_gate.md`
3. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
   - Must read §18.
4. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
5. `00_harness/05_reports/validation/PM_REVIEW_LAUD_ANDROID_EVIDENCE_SWEEP_20260719.md`
6. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_laud_android_evidence_sweep_20260719.md`
7. Relevant Android files:
   - `StoryEngine.kt`
   - `GameViewModel.kt`
   - `GameScreen.kt`
   - `GalleryScreen.kt`
   - `StartScreen.kt`
   - `NavGraph.kt`
   - progress/save manager files as needed

## 2. Phase A — required alignment before coding

Before editing code, send PM a short alignment report and wait for PM approval.

The report must include:

| Item | Required content |
|---|---|
| Authority | MinSpec §18 and relevant interaction rules |
| Current ending path | Exact functions/data path that trigger `EndingOverlay`, home CTA reset, and gallery unlock |
| Current blocker | Why QA cannot reach ending now |
| Proposed test hook | Exact UI/debug mechanism or route; must be DEBUG-only or otherwise safe |
| Files to edit | Exact minimal files |
| Files not to edit | Must include story-data/BG mapping/Web/UI authority |
| Evidence plan | Screenshots for B01/B02/B03 and Prologue typography |
| Removal/cleanup plan | Whether the hook remains debug-only or how it is disabled for release |

Hard rule:

- Do not code before PM approves Phase A.
- Do not modify story-data to force an ending.
- Do not add player-facing cheat/debug UI in release mode.

## 3. Phase B target after PM approval

Implement the smallest safe path that lets QA verify:

1. Terminal ending page renders.
2. Ending page has only one action: `返回主页`.
3. After returning home from an ending, Home CTA shows `新的故事`.
4. Gallery unlocks the ending reached.
5. Prologue typography §18.3 can be captured.

Acceptable approaches:

- DEBUG-only hidden action.
- DEBUG-only route.
- Existing debug overlay extension gated by `BuildConfig.DEBUG_MODE`.

Not acceptable:

- Changing story-data.
- Changing ending definitions.
- Changing production behavior for release.
- Adding visible debug controls to normal player UI.
- Hardcoding pass state without exercising the real unlock/save/home path.

## 4. Required screenshots after implementation

Save screenshots to:

`00_harness/05_reports/validation/android_ending_verification_pp_20260719/`

Required:

- `android_B01_terminal_ending_page.png`
- `android_B02_home_after_ending_new_story.png`
- `android_B03_gallery_ending_unlocked.png`
- `android_B04_prologue_typography.png`

## 5. Required final report

Write:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_ending_verification_hook_and_evidence_20260719.md`

Include:

1. Phase A approval reference.
2. File change list.
3. Build/install freshness.
4. Exact test path for QA/PM.
5. Screenshot list and what each proves.
6. Debug/release safety proof.
7. Confirmation of forbidden scope untouched.
8. Cleanup status.

## 6. Completion definition

This task is not done until B01/B02/B03 screenshots exist or a precise technical blocker is reported.

