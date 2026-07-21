# TASK_TO_PP_20260719_ANDROID_CHAPTER_LOCKED_TITLE_PRIVACY_FIX

- Task ID: `TASK-20260719-016`
- Project: NagisHeart
- Owner: Android 开发工程师 PP
- Priority: P1
- Status: ready_after_015_phase_a_or_pm_instruction
- Type: Android UI/interaction bug fix
- PM: 一一
- Date: 2026-07-19

## 0. Why this task exists

Laud QA found a confirmed issue:

- `android_chapter_dir.png` shows locked future chapter/section entries revealing real story titles.
- PM review: `00_harness/05_reports/validation/PM_REVIEW_LAUD_ANDROID_EVIDENCE_SWEEP_20260719.md`

This is a spoiler/privacy issue. Locked content should not reveal future story titles.

## 1. Required behavior

Locked chapter directory entries must not show real future titles.

Use neutral visible copy:

- Main title: `未解锁章节`
- Subtitle: `继续故事后开放`
- Status: keep existing locked status label if present, e.g. `未解锁` / `Locked`

Unlocked/current/completed entries should keep their real titles.

## 2. Mandatory read list

1. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` §16 Chapter Catalog.
2. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md` Chapter Catalog / progression sections if present.
3. `00_harness/05_reports/validation/PM_REVIEW_LAUD_ANDROID_EVIDENCE_SWEEP_20260719.md`.
4. Current Android chapter/catalog implementation files.

## 3. Implementation scope

Allowed:

- Android chapter directory/catalog screen code.
- Progress status display logic only if needed to determine locked/unlocked/current/completed.

Forbidden:

- Web.
- story-data.
- BG mapping.
- UI authority.
- Ending flow.
- Gallery.
- Start/Home.
- Save/load.
- Any broad navigation rewrite.

## 4. Required evidence

After implementation, provide screenshots:

- `android_G01_chapter_catalog_locked_no_spoiler.png`
- `android_G02_chapter_catalog_unlocked_titles_visible.png`

Evidence folder:

`00_harness/05_reports/validation/android_chapter_locked_title_pp_20260719/`

## 5. Required final report

Write:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_chapter_locked_title_privacy_fix_20260719.md`

Include:

1. File changes.
2. Before/after behavior.
3. Screenshot evidence.
4. Build/install freshness.
5. Code touched scope.
6. Cleanup status.

## 6. Scheduling note

Do not let this P1 distract from `TASK-20260719-015` P0 ending verification unless PM explicitly says to run this first.

