# Task to yiyi - Gradle Wrapper and Build Verification

## Task

`TASK-20260717-004` - 补充 Gradle Wrapper 与 CLI 构建验证能力

## PM Decision

Approved to execute now.

This must be a separate infrastructure / verification task. Do not mix in UI visual changes, Start long-screen work, App Icon, resource cleanup, story/script changes, or unrelated refactors.

## Goal

Add Gradle wrapper support so the Android project can be built and checked from CLI, then use it to verify the current P0 resource fixes.

## Required Work

1. Generate or restore project-compatible Gradle wrapper files:
   - `gradlew`
   - `gradlew.bat`
   - `gradle/wrapper/gradle-wrapper.jar`
   - `gradle/wrapper/gradle-wrapper.properties`
2. Confirm wrapper version matches the project Gradle / AGP setup.
3. Run the smallest appropriate CLI build/check available in this environment.
4. Specifically verify whether `TASK-20260717-005` now compiles:
   - `R.drawable.ic_continue` resolves.
   - 14 HUD/system icons in `res/drawable` are valid resources.
   - `PrologueScreen.kt` and `NameSetupScreen.kt` resolve `R.drawable.splash_bg`.

## Out of Scope

Do not include:

- TT long-screen Strategy A / V1 / V2 / V3 work.
- XoXo final UI authority edits.
- Home menu icon design/layout changes.
- App Icon replacement.
- Old resource deletion.
- Story/script/data fixes.
- BGM task changes.

## Deliverables

Return a dev reply to PM with:

1. Files added/changed.
2. Gradle wrapper version and why it matches the project.
3. CLI command(s) run.
4. Build/check result.
5. Whether `TASK-20260717-005` can be marked `done`.
6. If blocked, exact blocker and next recommended action.

## Completion Definition

The task is complete when the repo has usable Gradle wrapper files and PM has either:

- a successful CLI build/check result, or
- a precise environment blocker that explains why build verification cannot run here.

