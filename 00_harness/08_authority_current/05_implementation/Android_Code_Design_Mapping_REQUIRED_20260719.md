# Android Code Design Mapping - REQUIRED

- Owner to complete: PP (Android)
- Reviewer: PM 一一 first, then XoXo for UI-authority review
- Status: `required_template`
- Created: 2026-07-19

## Purpose

Android 当前实现已经多轮返工，PM / Ant 不能再接受“我按 authority 改了”这种口头结论。

PP 必须产出一份完整代码设计映射，证明 Android 实现如何对应 PRD / Interaction / UI authority / story-data / assets。没有这份映射，后续 UI 和主流程修改不得继续进入 blind implementation。

## Required output file

PP must write:

`00_harness/05_reports/validation/ANDROID_CODE_DESIGN_MAPPING_PP_20260719.md`

If PP finds active code path mismatch, stale APK/build issue, duplicate implementation, or resource path mismatch, PP must mark it as blocker and stop before implementation.

## Required sections

### 1. Build / install freshness chain

PP must document:

- Android Studio project path used for build.
- APK output path and timestamp.
- Connected device package `lastUpdateTime`.
- Whether app data was cleared or preserved.
- How PP proves Ant is testing the same code branch / same APK.

This is mandatory because PM found a stale APK mismatch:

- Device package `lastUpdateTime=2026-07-19 02:32:54`
- Local debug APK `android/app/build/outputs/apk/debug/app-debug.apk` timestamp `2026-07-19 02:36:16`

### 2. Runtime entry map

Map every user-visible major screen/state:

| User-visible state | Route / phase | Active Kotlin file | Active Composable / function | Trigger source | Notes |
|---|---|---|---|---|---|
| Start / Home |  |  |  |  |  |
| Prologue |  |  |  |  |  |
| Name setup |  |  |  |  |  |
| Gameplay dialogue |  |  |  |  |  |
| Choice / response |  |  |  |  |  |
| Long narration |  |  |  |  |  |
| Backlog |  |  |  |  |  |
| Save / Load |  |  |  |  |  |
| Settings |  |  |  |  |  |
| Chapter catalog |  |  |  |  |  |
| Chapter opening |  |  |  |  |  |
| Section opening |  |  |  |  |  |
| Section clear |  |  |  |  |  |
| Chapter clear |  |  |  |  |  |
| Terminal ending page |  |  |  |  |  |
| Gallery |  |  |  |  |  |

### 3. Authority-to-code mapping

For each current authority section, map implementation:

| Authority file / section | Intended behavior / visual | Android file | Actual tokens / logic | Matches? | Gap / risk |
|---|---|---|---|---|---|
| PRD § ending flow | Terminal ending, unlock gallery, return home |  |  |  |  |
| Interaction § ending flow | No normal tap-through after ending |  |  |  |  |
| UI MinSpec §17.2 HUD | Final glass HUD |  |  |  |  |
| UI MinSpec §17.3 Dialog | Cut-corner glass fallback |  |  |  |  |
| UI MinSpec §17.4 readability / long narration | Wider long narration |  |  |  |  |
| UI MinSpec §18 ending page | Content/status/one primary action |  |  |  |  |
| UI MinSpec §18.2 Home after-ending | Home CTA = new story after terminal ending |  |  |  |  |
| UI MinSpec §18.3 Prologue | 28sp / 1.68 line-height |  |  |  |  |

### 4. Story-data / engine flow mapping

PP must document:

- How `flow.json`, `routers.json`, `nodes.json`, `endings.json`, `scene_visuals.json` are loaded.
- How `ending_resolver` reaches `end_true/end_good/end_normal/end_bad`.
- Why ending nodes also existing in `nodes.json` does or does not break runtime.
- How terminal endings stop normal dialogue progression.
- How gallery unlock IDs are stored and read.

### 5. Asset loading map

For backgrounds, BGM, Start resources, and UI icons:

| Asset type | Source authority / data | Android asset/res location | Runtime loading code | Fallback | Gap |
|---|---|---|---|---|---|
| Scene BG |  |  |  |  |  |
| Opening / clear BG |  |  |  |  |  |
| Long narration BG |  |  |  |  |  |
| BGM |  |  |  |  |  |
| Start v23 |  |  |  |  |  |
| HUD icons |  |  |  |  |  |
| App icon |  |  |  |  |  |

### 6. Duplicate / stale implementation audit

PP must list duplicate or potentially unused files and prove whether each is active:

- `ChapterOpeningScreen.kt`
- `SectionClearScreen.kt`
- `ChapterEndingScreen.kt`
- inline overlays in `GameScreen.kt`
- any old dialog / HUD / button code paths
- any old assets that can still be selected at runtime

### 7. Current bug correlation

For each Ant real-device issue, PP must classify:

| Ant issue | Implementation path | Current suspected cause | Design/PRD gap? | Android code bug? | Resource/build issue? | Proposed fix |
|---|---|---|---|---|---|---|
| Dialog still old-looking |  |  |  |  |  |  |
| HUD/nav still old-looking |  |  |  |  |  |  |
| Backlog default/clip |  |  |  |  |  |  |
| Ending continues / card stuck |  |  |  |  |  |  |
| Gallery not unlocked |  |  |  |  |  |  |
| Text backing too weak |  |  |  |  |  |  |
| Remove section clear |  |  |  |  |  |  |
| Ending page missing PRD/UI |  |  |  |  |  |  |
| Long narration too narrow |  |  |  |  |  |  |

### 8. PP recommendation

PP must decide one of:

1. Continue incremental repair with a concrete minimal patch list.
2. Refactor specific modules before further visual work.
3. Rewrite Android UI shell / navigation / rendering layer while preserving story-data engine.

The recommendation must include estimated risk and files affected.

## XoXo review gate

After PM accepts PP's mapping as complete, XoXo must review only the UI mapping sections:

- HUD / nav / action chip
- Dialog
- Dialogue / long narration readability
- Opening / clear / ending page
- Chapter catalog / gallery / system pages

XoXo must answer:

1. Does PP identify the correct active component for each UI authority section?
2. Are the Android tokens close enough for Compose no-blur fallback?
3. Which mismatches are code bugs vs design ambiguity?
4. Which UI areas must be reworked before further implementation?

## Rule

No further Android UI implementation should proceed until this mapping is produced and reviewed, except emergency build/install freshness checks.

## Addendum - runtime screenshot evidence is mandatory

PP must also create screenshot evidence:

`00_harness/05_reports/validation/android_code_design_mapping_pp_20260719_screens/`

PP's earlier `TASK-20260718-009` Phase 1 read-only diff was static text analysis. It did not include Android Studio emulator screenshots, runtime screenshots, build/install freshness proof, or visual evidence that PM/XoXo could inspect. That level of audit is no longer sufficient.

For this mapping task, a text-only report is not acceptable.

Required runtime evidence:

| Evidence ID | Screen / state | Authority section | Runtime path | Screenshot path | Pass / fail | Notes |
|---|---|---|---|---|---|---|
| A01 | Start / Home |  |  |  |  |  |
| A02 | Gameplay HUD bright BG |  |  |  |  |  |
| A03 | Gameplay HUD dark BG |  |  |  |  |  |
| A04 | Skip-section dialog |  |  |  |  |  |
| A05 | Backlog first page |  |  |  |  |  |
| A06 | Backlog long-text page |  |  |  |  |  |
| A07 | Long narration |  |  |  |  |  |
| A08 | Chapter opening |  |  |  |  |  |
| A09 | Section opening |  |  |  |  |  |
| A10 | Section clear / removed behavior |  |  |  |  |  |
| A11 | Chapter clear |  |  |  |  |  |
| A12 | Terminal ending page |  |  |  |  |  |
| A13 | Home after ending |  |  |  |  |  |
| A14 | Gallery unlocked ending |  |  |  |  |  |
| A15 | Settings / system page |  |  |  |  |  |

Screenshot rules:

- Prefer Android Studio emulator screenshots.
- If emulator cannot be started, document the exact blocker and use connected physical-device screenshots.
- Screenshots must come from the running Android app, not design HTML or static mockups.
- Each screenshot must be linked from `ANDROID_CODE_DESIGN_MAPPING_PP_20260719.md`.
- No screenshot evidence means PM cannot accept the mapping as complete.
