# TASK TO NEW ANDROID UI DEV - Android UI authority implementation takeover

Date: 2026-07-18  
PM: 一一  
Owner: New Android UI developer  
Task: `TASK-20260718-009`  
Priority: P0  
Status: ready after developer assignment

---

## 0. Why this task exists

Android real-device verification shows that the core UI issues remain unresolved after yiyi's controlled correction pass.

Failed areas reported by Ant大小姐:

- navigation bar / HUD still not matching UI authority;
- dialog UI still not matching UI authority;
- chapter catalog / chapter-related UI still not matching UI authority.

PM decision:

- yiyi no longer owns Android visual/UI implementation tasks;
- this task transfers Android UI implementation ownership to a new developer;
- yiyi may only handle non-visual Android tasks if PM separately assigns them.

PM failure review:

`00_harness/05_reports/validation/PM_REVIEW_ANDROID_UI_REAL_DEVICE_FAIL_YIYI_004_20260718.md`

---

## 1. Mandatory read order

Read these before touching code:

1. `README_AI.md`
2. `TASKS.md`
3. `PROJECT_STRUCTURE.md`
4. `00_harness/03_handoffs/latest_status_snapshot.md`
5. `00_harness/02_planning/task_board.md`
6. `00_harness/01_governance/decision_log.md`
7. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
8. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
9. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`
10. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
11. `00_harness/05_reports/validation/PM_REVIEW_ANDROID_UI_REAL_DEVICE_REJECT_20260718.md`
12. `00_harness/05_reports/validation/PM_REVIEW_ANDROID_UI_REAL_DEVICE_FAIL_YIYI_004_20260718.md`

Do not use archived or rejected design packages as implementation authority.

---

## 2. Phase 1 - read-only diff first

Before changing code, produce a read-only diff report:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_new_android_ui_authority_takeover_diff_20260718.md`

The report must include:

1. current Android file/component for each failing UI area;
2. exact authority section / screenshot / HTML screen that should be matched;
3. concrete difference list;
4. proposed minimal code files to change;
5. risk list;
6. screenshots or local preview plan for verification;
7. what will not be changed.

Failing UI areas to audit:

- top HUD / navigation bar;
- icon buttons;
- title chip and action chip;
- skip-section action chip;
- NagiDialog / confirmation dialogs;
- chapter catalog;
- chapter / section opening backing;
- Chapter Clear / Section Clear pages;
- speaker/name gold readability if current implementation still fails on device.

---

## 3. Phase 2 - implementation only after PM approval

Do not implement until PM approves the diff report.

When approved, implementation must:

- follow `00_harness/08_authority_current/04_ui/` as source of truth;
- be mechanical and scoped;
- not invent new design tokens;
- not tune alpha/shadow/shape by feel;
- not rewrite gameplay engine or story data to solve visual problems.

---

## 4. Forbidden scope

Do not modify:

- story-data text;
- BG mapping authority;
- TT Start resources;
- App Icon resources or launcher integration;
- Web;
- BGM;
- archive files;
- unrelated cleanup;
- yiyi's non-visual fixes unless directly required for UI rendering and explicitly listed in the diff.

App Icon V4 is approved by Ant visually but is paused from yiyi handoff and is not part of this UI takeover task.

---

## 5. Completion criteria

Phase 1 completion:

- read-only diff report exists;
- PM can decide exact implementation scope.

Phase 2 completion:

- Android real-device screenshots match UI authority for the listed areas;
- PM / Ant visually confirms;
- task_board and latest_status_snapshot updated;
- cleanup status reported.

---

## 6. Reporting

All reports go to:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/`

Use clear filenames starting with:

- `dev_reply_new_android_ui_authority_takeover_diff_...`
- `dev_reply_new_android_ui_authority_takeover_implementation_...`
