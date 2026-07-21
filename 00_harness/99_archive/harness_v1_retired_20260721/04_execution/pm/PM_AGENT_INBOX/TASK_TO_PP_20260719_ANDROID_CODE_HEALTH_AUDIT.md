# TASK-20260719-004 — Android release-readiness code health audit

To: Android 开发工程师 PP
From: PM 一一
Status: queued
Priority: P0
Scope: Android audit-only first

## Why

Ant 大小姐明确要求：项目已经改过很多版，需要维护好已经完成的成品，不能越改越乱。本任务不是单次 diff review，而是 Android 上线前代码设计健康审计。

## Execution order

Do not start broad code-health audit until `TASK-20260719-002` main-flow logic / UI root-cause audit has been returned, unless PM explicitly reprioritizes.

## Must read

1. `00_harness/05_reports/validation/PM_RELEASE_READINESS_CODE_REVIEW_PLAN_20260719.md`
2. `00_harness/06_templates/tpl_alignment_code_review_gate.md`
3. `00_harness/08_authority_current/01_product/NagisHeart_PRD_v2_0.md`
4. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
5. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`

## Audit scope

### A. Runtime architecture map

Map the active runtime path:

- start/prologue/name/game/home/settings/save/gallery/chapter catalog;
- story node → flow/router → GameViewModel phase → Composable screen/overlay;
- save/progress/gallery unlock path;
- asset path loading for bg/bgm/icons.

### B. Duplicate / stale active code

Identify whether multiple files implement the same visible page/component, especially:

- `ChapterOpeningScreen.kt` vs `GameScreen.kt` inline `ChapterOpeningOverlay`;
- `SectionOpeningScreen.kt` vs inline `SectionOpeningOverlay`;
- `ChapterEndingScreen.kt` vs inline `ChapterEndingOverlay`;
- `SectionClearScreen.kt` vs current product decision to remove normal Section Clear;
- `EndingOverlay` vs any standalone ending screen or authority page;
- `NagiDialog`, HUD, icon button duplicates or wrappers.

For each duplicate, state whether it is active, unused, dead, or unknown.

### C. Main-flow and persistence risk

Audit:

- `GameViewModel` state-machine transitions;
- `StoryEngine` resolve loop and `ending_resolver`;
- chapter/section transition boundaries;
- skip-section behavior after 2026-07-19 authority override;
- backlog collection and pagination;
- `ProgressManager`, `SaveManager`, gallery unlock and refresh behavior;
- BGM manager and asset paths.

### D. UI implementation risk

Audit code-level maintainability, not visual redesign:

- hardcoded visual tokens that should be centralized;
- temporary values from old yiyi/PP fixes;
- wrong use of Compose elevation/shadow/border/shape if likely to keep causing drift;
- active code not matching `08_authority_current`.

### E. Build and QA traceability

Report:

- how to prove real-device APK is built from current source;
- build variant risks;
- whether version/build timestamp should be surfaced for QA;
- minimal QA evidence needed after fixes.

## Output

Write:
`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_code_health_audit_20260719.md`

Must include:

- architecture map;
- duplicate/stale code table;
- P0/P1/P2 risk table;
- recommended scoped remediation tasks;
- cleanup candidates only;
- no code changed confirmation;
- cleanup status.

## Forbidden

- Do not refactor in this audit.
- Do not delete files.
- Do not touch Web.
- Do not modify story-data or authority.
- Do not implement UI fixes before XoXo/Ant confirmation.
