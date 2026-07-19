# TASK_TO_PP_20260719_ANDROID_CODE_DESIGN_MAPPING_FULL_REVIEW

- Task ID: `TASK-20260719-011`
- Owner: PP (Android)
- Priority: P0
- Type: audit / architecture mapping / no implementation unless explicitly approved
- Status: ready

## Background

Ant reran real-device testing after PP `TASK-20260719-009` and still saw almost no visible / logical change. PM found one build-freshness issue earlier, but even after rerun Ant reports no meaningful improvement. The Android project has now accumulated many rounds of patches. PM no longer accepts blind patching.

We need a complete code design mapping: authority files → Android components → runtime state/route → assets → real-device proof.

## Mandatory read first

1. `README_AI.md`
2. `TASKS.md`
3. `PROJECT_STRUCTURE.md`
4. `00_harness/03_handoffs/latest_status_snapshot.md`
5. `00_harness/02_planning/task_board.md`
6. `00_harness/01_governance/decision_log.md`
7. `00_harness/08_authority_current/01_product/NagisHeart_PRD_v2_0.md`
8. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
9. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
10. `00_harness/08_authority_current/05_implementation/Android_Code_Design_Mapping_REQUIRED_20260719.md`
11. `00_harness/05_reports/validation/PM_INVESTIGATION_ANDROID_STALE_APK_REAL_DEVICE_20260719.md`
12. `00_harness/05_reports/validation/PM_REVIEW_PP_ANDROID_P0_LOGIC_AND_UI_CONTROLLED_PASS_20260719.md`

## Scope

Audit Android only:

- `android/app/src/main/java/com/antnagi/nagisheart/**`
- `android/app/src/main/assets/**`
- `android/app/src/main/res/**`
- Android Gradle / manifest files only if needed for build/install mapping.

Do not touch Web, story-data, design authority, TT assets, or unrelated cleanup.

## Required output

Write:

`00_harness/05_reports/validation/ANDROID_CODE_DESIGN_MAPPING_PP_20260719.md`

Use the structure required by:

`00_harness/08_authority_current/05_implementation/Android_Code_Design_Mapping_REQUIRED_20260719.md`

## Required investigation questions

### A. Build/install freshness

Prove whether Ant is running current code:

- APK build output path and timestamp.
- Connected device package `lastUpdateTime`.
- Whether Android Studio is opened from `D:\Nagi's Heart\NagisHeart\android` or another directory.
- Whether install uses `com.antnagi.nagisheart`.
- Whether app data should be cleared for testing ending/gallery.

### B. Runtime architecture

Map:

- Navigation route → screen composable.
- GamePhase → overlay/layer composable.
- StoryEngine → GameViewModel → GameScreen data flow.
- scene_visuals BG path → android asset path → Coil loading model.
- BGM path → asset path → runtime player.
- Progress / save / gallery unlock persistence.

### C. UI authority implementation

For each UI authority section, prove active implementation and exact tokens:

- HUD/nav/action chip.
- Dialog.
- Dialogue card / speaker.
- Long narration.
- Backlog.
- Chapter catalog.
- Opening / clear pages.
- Terminal ending page.
- Home after ending.

### D. Duplicate/stale paths

Find all duplicate or stale UI paths. At minimum inspect:

- `ChapterOpeningScreen.kt`
- `SectionClearScreen.kt`
- `ChapterEndingScreen.kt`
- inline overlays in `GameScreen.kt`
- `NagiHud.kt`
- `NagiIconButton.kt`
- `NagiDialog.kt`
- system screen headers in Backlog / Save / Settings / Chapter / Gallery

For each, state active / inactive / uncertain, and how you proved it.

### E. Ant bug correlation

Map these Ant issues one by one:

1. Dialog still looks like rounded rectangle line-frame.
2. HUD/nav/title/icon backgrounds still do not match UI.
3. Backlog default page / text clipping.
4. Ending appears suddenly, continues story, later stuck.
5. Gallery missing unlocked ending.
6. Text backings too weak across pages.
7. Section clear page should be removed.
8. Ending page PRD/UI now exists; confirm implementation.
9. Long narration width too narrow.

Classify each as:

- stale APK / build-install issue
- wrong runtime path
- Android implementation bug
- missing resource
- design / PRD ambiguity
- already fixed but unverified

## Output requirements

Your report must include:

- Evidence tables, not narrative only.
- File/line references.
- A clear recommendation: continue patching, refactor specific modules, or rewrite UI shell.
- A minimal next patch list if you recommend patching.
- A list of items for XoXo to review.

## Forbidden

- Do not change code in this task.
- Do not delete resources.
- Do not modify story-data / BG mapping.
- Do not modify Web.
- Do not claim “fixed” without build/install/runtime proof.

## Done definition

Task is complete only when:

- Required report exists.
- Every authority-to-code mapping section is filled.
- Every Ant issue is classified.
- Duplicate/stale paths are listed with proof.
- Build/install freshness chain is documented.
- PM can hand the report to XoXo for UI review.

## Addendum - AS emulator / screenshot gate

PP previously completed `TASK-20260718-009` Phase 1 read-only diff. That report is not enough for this task. It was static text analysis and did not include Android Studio emulator / runtime screenshots, build-install freshness proof, or visual evidence PM/XoXo can inspect.

For `TASK-20260719-011`, PP must create runtime screenshot evidence under:

`00_harness/05_reports/validation/android_code_design_mapping_pp_20260719_screens/`

Mandatory:

1. Identify Android Studio project root used for Run / Build.
2. Record build output APK timestamp.
3. Record emulator or device package `lastUpdateTime`.
4. Capture runtime screenshots for every required evidence point listed in `Android_Code_Design_Mapping_REQUIRED_20260719.md`.
5. Reference each screenshot path in `ANDROID_CODE_DESIGN_MAPPING_PP_20260719.md`.

If AS emulator cannot be started, PP must report the exact blocker and use connected physical-device screenshots as fallback. If neither emulator nor physical screenshot evidence is possible, this task is blocked and must not be reported as review.

No screenshot evidence = no PM acceptance.
