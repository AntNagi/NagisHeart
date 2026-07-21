# TASK_TO_PP_20260719_ANDROID_SECTION_CLEAR_REMOVAL_P0

- Task ID: `TASK-20260719-013`
- Project: NagisHeart
- Owner: Android 开发工程师 PP
- Priority: P0
- Status: assigned
- Type: Android implementation, but **Phase A alignment gate is mandatory before coding**
- PM: 一一
- Date: 2026-07-19

## 0. Why this task exists

XoXo reviewed PP's Android implementation mapping and returned:

- `00_harness/05_reports/validation/XOXO_REVIEW_ANDROID_IMPLEMENTATION_MAPPING_20260719.md`
- Verdict: `ui_mapping_review_with_blockers`

PM accepted that review:

- `00_harness/05_reports/validation/PM_REVIEW_XOXO_ANDROID_IMPLEMENTATION_MAPPING_20260719.md`

The current P0 blocker is narrow and concrete:

> Standalone `SECTION CLEAR` / 小章节结束页 still exists in Android runtime, directly violating MinSpec §17.6.

This must be fixed before Android UI/flow can be considered authority-compliant.

## 1. Mandatory read list

Read these files before doing anything:

1. `00_harness/07_scheduler/WORKER_LOOP.md`
2. `00_harness/06_templates/tpl_alignment_code_review_gate.md`
3. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
   - Must read §17.6.
   - Also read §17.3 because skip dialog copy is part of this fix.
4. `00_harness/05_reports/validation/XOXO_REVIEW_ANDROID_IMPLEMENTATION_MAPPING_20260719.md`
5. `00_harness/05_reports/validation/PM_REVIEW_XOXO_ANDROID_IMPLEMENTATION_MAPPING_20260719.md`
6. `00_harness/05_reports/validation/ANDROID_CODE_DESIGN_MAPPING_PP_20260719.md`
7. Current Android files related to section flow:
   - `android/app/src/main/java/com/antnagi/nagisheart/ui/navigation/NavGraph.kt`
   - `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GameScreen.kt`
   - `android/app/src/main/java/com/antnagi/nagisheart/ui/viewmodel/GameViewModel.kt`
   - `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/SectionClearScreen.kt`

## 2. Phase A — required pre-implementation alignment, no code

Before editing any code, send PM a short alignment report and wait for explicit PM approval.

The report must include:

| Item | Required content |
|---|---|
| Authority section | MinSpec §17.6, plus relevant §17.3 copy/dialog note |
| Current active path | Exact files/functions/routes currently producing Section Clear |
| Current wrong behavior | What happens on normal section end, skip-section confirm, last section of chapter, and ending node |
| Target behavior | What each of those flows should do after removal |
| Minimal file plan | Exact files to edit, exact files not to edit |
| Screenshot plan | Exact screenshots to produce after implementation |
| Risk check | Whether removing route affects Chapter Clear / Ending / save / backlog |

Hard rule:

- Do not start coding in Phase A.
- Do not say “where relevant.”
- Do not omit any active route/callback/function.
- If you cannot prove the active path, return `blocked` instead of guessing.

## 3. Phase B — implementation scope after PM approval

After PM approves Phase A, implement only this narrow fix:

### Required behavior

1. Standalone Section Clear page must not appear in current product flow.
2. Normal section end should go directly to next section opening / next playable content.
3. Last section of a chapter should go to Chapter Clear.
4. Ending node should go to terminal Ending page.
5. Skip-section confirm should not say `进入本节结束页`.
6. Skip-section confirm should not navigate to standalone Section Clear.

Recommended neutral skip copy:

- With title: `确定跳过「{sectionTitle}」？跳过后将直接进入后续内容。`
- Without title: `确定跳过当前章节？跳过后将直接进入后续内容。`

If a better product copy is needed, stop and ask PM before coding it.

### Allowed files

Allowed only if required:

- `android/app/src/main/java/com/antnagi/nagisheart/ui/navigation/NavGraph.kt`
- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GameScreen.kt`
- `android/app/src/main/java/com/antnagi/nagisheart/ui/viewmodel/GameViewModel.kt`
- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/SectionClearScreen.kt`

Do not delete `SectionClearScreen.kt` unless PM explicitly approves deletion. It may be left as an unused cleanup candidate if all active runtime references are removed.

### Forbidden scope

Do not modify:

- Web
- story-data
- BG mapping
- TT Start
- App Icon V4
- BGM
- Gallery unlock logic, unless Phase A proves it is directly impacted by this P0 route removal
- Ending page design
- HUD/Dialog tokens unrelated to skip copy
- archive / obsolete resources
- authority_current files

## 4. Required verification after implementation

After implementation, output a report:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_section_clear_removal_p0_20260719.md`

The report must include:

1. File change list.
2. Build result or exact blocker.
3. Install/build freshness proof:
   - APK timestamp;
   - installed package `lastUpdateTime`;
   - target device/emulator name.
4. Static active-path proof:
   - search result for `sectionClear`;
   - search result for `SectionClearScreen`;
   - search result for `advanceAfterSectionClear`;
   - search result for `进入本节结束页`.
5. Runtime screenshot evidence in:
   - `00_harness/05_reports/validation/android_section_clear_removal_pp_20260719/`

Required screenshots:

- `A04_skip_dialog_copy_after.png` — skip dialog no longer says section ending page.
- `A10_after_skip_no_section_clear.png` — after confirming skip, screen is next section opening / next content / chapter clear / ending, but not Section Clear.
- `A10_normal_section_end_no_section_clear.png` — natural section end no longer shows Section Clear.
- `A11_chapter_clear_if_reached.png` — if last section reaches Chapter Clear, capture it.

If a target screenshot cannot be reached, document exact reproduction blocker. Do not invent visual pass.

## 5. Completion definition

This task is complete only when:

1. PM-approved Phase A alignment exists.
2. Code changes stay within approved scope.
3. Standalone Section Clear is no longer reachable in current runtime flow.
4. Skip copy is corrected.
5. Build/install freshness is proven.
6. Screenshot evidence exists.
7. Cleanup status is reported.

Until all seven conditions are met, status must not be `done`.
