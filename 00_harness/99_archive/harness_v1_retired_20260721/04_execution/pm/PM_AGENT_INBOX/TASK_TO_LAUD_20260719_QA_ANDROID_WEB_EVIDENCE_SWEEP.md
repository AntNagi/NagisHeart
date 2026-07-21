# TASK_TO_LAUD_20260719_QA_ANDROID_WEB_EVIDENCE_SWEEP

- Task ID: `TASK-20260719-014`
- Project: NagisHeart
- Owner: Laud（Claude / QA）
- Priority: P0
- Status: assigned / Android first
- Type: QA only / no code changes
- PM: 一一
- Date: 2026-07-19

## 0. PM addendum — Android first

2026-07-19 Ant / PM update:

Run **Android scope first only**.

Do not start Web follow-up in this pass. Web is paused until PM explicitly resumes it.

For this execution, output Android-only report first:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_laud_android_evidence_sweep_20260719.md`

Use Android evidence folder:

`00_harness/05_reports/validation/laud_android_evidence_sweep_20260719/`

The Web sections below are retained as backlog context only and must not be executed now.

## 1. Hard rules

This is a QA evidence task, not a development task.

Do not modify code, assets, story-data, BG mapping, authority files, archive, Gradle config, or Web files.

Every UI-related pass/reject must include screenshot evidence. If there is no screenshot, the UI item is `unverified`, not pass.

Every logic-related pass/reject must include:

1. start point;
2. steps;
3. expected result;
4. actual result;
5. whether it is reproducible.

If a flow cannot be reached, write `blocked` with exact blocker. Do not invent a pass.

## 2. Required read list

Read before testing:

1. `README_AI.md`
2. `TASKS.md`
3. `PROJECT_STRUCTURE.md`
4. `00_harness/03_handoffs/latest_status_snapshot.md`
5. `00_harness/02_planning/task_board.md`
6. `00_harness/01_governance/decision_log.md`
7. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
8. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
9. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
10. PP latest Android reports:
    - `00_harness/05_reports/validation/PM_REVIEW_PP_ANDROID_SECTION_CLEAR_REMOVAL_P0_20260719.md`
    - `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_section_clear_removal_p0_20260719.md`
    - `00_harness/05_reports/validation/XOXO_REVIEW_ANDROID_IMPLEMENTATION_MAPPING_20260719.md`
11. Web/DeDe reports are **not required for the Android-first pass**.

## 3. Output

For Android-first pass, write final QA report to:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_laud_android_evidence_sweep_20260719.md`

Put screenshot evidence under:

- Android: `00_harness/05_reports/validation/laud_android_evidence_sweep_20260719/`

Do not create or run Web evidence in this pass.

Report must include:

- environment/device/browser;
- APK/build timestamp if testing Android;
- exact tested commit/workspace state if available;
- screenshot list with what each screenshot proves;
- pass/reject/blocked/unverified table;
- `Code touched: no`;
- `Cleanup status: none`.

## 4. Android QA scope — P0/P1 evidence sweep

Test current Android app on emulator or physical device.

### A. Section Clear removal / skip flow

Acceptance:

- Skip dialog copy says `后续内容`, not `本节结束页`.
- Confirming skip must not show standalone `SECTION CLEAR`.
- Confirming skip should enter next Section Opening / next playable content / Chapter Clear / Ending depending on flow.

Required screenshots:

- `android_A01_skip_dialog_copy.png`
- `android_A02_after_skip_no_section_clear.png`

### B. Ending / Home / Gallery main-flow logic

Acceptance:

- Terminal Ending page appears only at actual ending.
- Ending page has only one action: `返回主页`.
- After ending completion, Home primary CTA is `新的故事`, not `继续故事`.
- Gallery unlock state reflects the ending that was reached.

Required screenshots:

- `android_B01_terminal_ending_page.png`
- `android_B02_home_after_ending_new_story.png`
- `android_B03_gallery_ending_unlocked.png`

If ending cannot be reached, write blocker with exact route/step where blocked.

### C. Backlog

Acceptance:

- Backlog opens at first page, not last page.
- Long text page is not clipped.
- Page navigation works as designed.

Required screenshots:

- `android_C01_backlog_first_page.png`
- `android_C02_backlog_long_text_no_clip.png`

### D. Long narration width

Acceptance:

- Long narration text width aligns with bottom single-line narration width direction.
- Text is readable and not clipped at bottom.

Required screenshot:

- `android_D01_long_narration_width.png`

### E. Chapter Opening / Section Opening / Chapter Clear

Acceptance:

- Chapter Opening follows authority hierarchy, not normal prose over background.
- Section Opening remains acceptable.
- Chapter Clear, if reached, uses authority clear-card direction.
- Standalone Section Clear must not appear.

Required screenshots:

- `android_E01_chapter_opening.png`
- `android_E02_section_opening.png`
- `android_E03_chapter_clear.png` if reachable

### F. Dialog / HUD visual confirmation

Acceptance:

- Dialog is cut-corner glass, not old rounded rectangle outline.
- HUD title/icon/action chips are unified and visible on bright backgrounds.

Required screenshots:

- `android_F01_dialog_visual.png`
- `android_F02_hud_bright_bg.png`
- `android_F03_hud_dark_bg.png`

## 5. Web follow-up scope — paused, do not execute now

This section is backlog context only. Do not test Web until PM explicitly resumes it.

Test Web mobile only. Use 393x852 and 430x932 viewports if possible. If viewport control fails, report actual viewport and do not claim exact viewport pass.

### W1. Settings readability

Acceptance:

- Settings is readable on bright and dark backgrounds.
- It should not look like a thick unrelated Material panel.

Required screenshots:

- `web_W01_settings_bright_bg.png`
- `web_W02_settings_dark_bg.png`

### W2. BGM setting

Acceptance:

- BGM slider is operable.
- Changing value persists after reload.
- If runtime audio element cannot be verified, report as caveat, not pass.

Required evidence:

- screenshot before / after slider change;
- localStorage or visible setting proof after reload;
- audio runtime proof if possible.

### W3. Web regression smoke

Acceptance:

- Start visible, not black screen.
- Game screen visible.
- HUD no longer shows old text labels `AUTO/SKIP/MENU`.
- Opening/Clear click-through works.

Required screenshots:

- `web_W03_start_mobile.png`
- `web_W04_game_mobile.png`
- `web_W05_opening_or_clear_mobile.png`

## 6. Verdict rules

Use these statuses:

- `pass`: screenshot/evidence confirms expected result.
- `reject`: evidence confirms wrong behavior.
- `blocked`: cannot reach/test, with exact blocker.
- `unverified`: no evidence or screenshot.

Do not mark a UI item pass without screenshot.

Do not mark the whole task pass if any P0 Android item is reject or blocked.

## 7. Final summary format

At the top of the report, include:

| Area | Verdict | Reason |
|---|---|---|
| Android P0 flow | pass/reject/blocked/unverified | one-line reason |
| Android UI evidence | pass/reject/blocked/unverified | one-line reason |
| Web follow-up | paused | Android-first pass; not executed |
| Ready for Ant real-device acceptance? | yes/no | one-line reason |
