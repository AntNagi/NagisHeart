# Task to yiyi - Android HUD / Speaker Readability Authority Implementation

## Task

`TASK-20260717-015` - 接入 XoXo 014 高亮背景 HUD 统一与 speaker 金色可读性规则

## Background

Ant 大小姐实机反馈：

1. 高亮 / 复杂背景下，标题 chip 和“跳过本节”action chip 有 glass backing 和线框，但 back / auto / save / backlog/menu 等 icon buttons 是裸白线，整体不协调，并且图标在亮底图上看不清。
2. Dialogue speaker/name 的金色方向喜欢，但在第二张实机图里被背景吞掉，需要保留金色同时提高可读性。

PM 已派 XoXo 做 UI authority patch。XoXo `TASK-20260717-014` 已回传并同步 authority_current。PM review 通过，可进入 Android 实现。

## Authority

必须以以下文件为准：

1. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 15
2. `00_harness/01_governance/decision_log.md` `DEC-20260717-015`
3. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_hud_dialogue_readability_20260717.md`
4. `00_harness/05_reports/validation/PM_REVIEW_XOXO_HUD_DIALOGUE_READABILITY_20260717.md`

## Required Work

### A. HUD icon / title / action unification

Implement one shared final glass HUD visual family for:

- back icon
- auto icon
- save icon
- backlog/menu icon
- title chip
- action chip such as “跳过本节”

Rules:

1. Icon buttons must no longer be naked white line icons directly over BG.
2. Icon button target:
   - container 36 x 36;
   - icon 18 x 18 centered;
   - light glass backing;
   - 1dp subtle border;
   - shadow / halo for bright backgrounds;
   - blur where available.
3. If true blur is technically unavailable, use the section 15 Android fallback:
   - translucent dark backing;
   - 1dp border;
   - shadow.
4. Title chip and action chip should share the same backing / border / fallback tokens as icon buttons.
5. Do not make HUD controls thick, solid black/white, Material default, or system-button-looking.

Likely files:

- `android/app/src/main/java/com/antnagi/nagisheart/ui/component/NagiHud.kt`
- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GameScreen.kt`

### B. Dialogue speaker / name gold readability

Implement XoXo section 15 speaker/name rule:

1. Preserve the gold direction Ant likes.
2. Use gold `#E4CA8F`.
3. Add a small backing only around speaker/name text.
4. Add light gold border / text shadow / halo as feasible in Compose.
5. Do not turn it into:
   - thick name plate;
   - full-width black strip;
   - white system label;
   - heavy card.

This rule applies to dialogue speaker/name and recap / long narration speaker labels where the same speaker label style appears.

Likely files:

- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GameScreen.kt`
- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/BacklogScreen.kt`
- related shared dialogue / text components if present

## Relationship to TASK-20260717-013

`TASK-20260717-013` has already completed a first Android pass:

- title/action chip visibility increased;
- story recap changed to horizontal swipe;
- dialog moved back toward authority light glass.

Do not regress those changes.

This task is the follow-up that applies the newer XoXo 014 / section 15 authority, especially:

- icon buttons must join the glass HUD family;
- speaker/name gold must get the small readability backing.

## Out of Scope

Do not modify:

- TT Start / App Icon
- Web
- story/script
- BG mapping
- resource deletion
- chapter catalog
- Gradle wrapper
- `nagiCall`

## Deliverable

Write dev reply:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_hud_speaker_readability_20260717.md`

Include:

1. files changed;
2. how HUD icon/title/action token unification was implemented;
3. how speaker/name gold readability was implemented;
4. any Compose limitation / fallback;
5. build or Android Studio verification status;
6. whether Ant real-device verification is still needed.

## Completion Definition

Ready for PM review when:

1. Bright BG screenshots no longer show naked unreadable icon buttons while title/action chips have backing.
2. HUD title/action/icon controls look like one coordinated final glass family.
3. Speaker/name keeps gold but is readable over bright / complex backgrounds.
4. No unrelated code/story/resource changes are mixed in.

