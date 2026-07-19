# PM Investigation - Android Dialog / HUD Repeated UI Mismatch Root Cause

- Date: 2026-07-19
- Owner: PM 一一
- Trigger: Ant real-device feedback: dialog and navigation/HUD repeatedly still do not match current UI authority after multiple implementation passes.
- Scope: Android active code path only. No code changed in this investigation.

## Executive conclusion

The repeated mismatch is not primarily a missing-resource problem.

The root cause is a combination of:

1. Android code is still implementing older UI authority tokens for dialog and HUD, while `authority_current` has already moved on to section 17.
2. Dialog and navigation are not fully centralized into one reusable glass-token component, so some places were changed while others kept old inline styling.
3. Previous worker reports did not prove active-path alignment: they reported files changed, but did not prove the real-device screen was using the updated component, nor that the values matched the latest `08_authority_current` section.
4. If Ant's latest installed build was made after PP's report, there is also a possible stale APK / wrong build / wrong active path risk. This must be checked before any more blind visual tweaking.

## Current authority source

Current authority file:

- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`

Relevant current sections:

- Section 17.2: HUD / nav / action chip developer-readable token
- Section 17.3: Dialog Android no-real-blur fallback hard token
- Section 17.6: PP implementation checklist

The latest authority explicitly says:

- HUD icon/title/action must be one final glass family.
- Dialog must be a cut-corner light glass floating layer, not a rounded rectangle line frame.
- Android implementation must use section 17 tokens and report blocked if it cannot implement the shape/highlight/shadow without guessing.

## Evidence 1 - Dialog active code still uses old rounded-rectangle styling

File:

- `android/app/src/main/java/com/antnagi/nagisheart/ui/component/NagiDialog.kt`

Observed implementation:

- Imports and uses `RoundedCornerShape`.
- Defines `DialogShape = RoundedCornerShape(24.dp)`.
- Uses `ContainerBorder = Color(0x24FFFFFF)` = 14%.
- Comments still reference authority section 16.5.
- Shadow is drawn using `drawRoundRect(..., 24.dp, 24.dp, ...)`.

Conflict:

- Current authority section 17.3 overrides the old section 16.5 risk:
  - required shape: `cut-md` / `CutCornerShape(14dp)`;
  - border should be weak, about 8%;
  - card should have light-glass gradient + inner highlight;
  - `RoundedCornerShape(24dp)` + high-alpha border is explicitly prohibited because it creates the exact "圆角矩形线框感" Ant rejected.

Conclusion:

The current Android dialog code is not aligned with the latest authority. It is implementing the older fallback shape/token. This explains why the real-device dialog still looks like a rounded rectangle line frame.

## Evidence 2 - Gameplay HUD title chip uses weaker old tokens

File:

- `android/app/src/main/java/com/antnagi/nagisheart/ui/component/NagiHud.kt`

Observed implementation:

- Title chip uses `NagiShapes.cutSmall`, which is correct in principle.
- But its background is `0x380F1827 -> 0x140F1827`, roughly 22% -> 8%.
- Border is `0x1AFFFFFF`, roughly 10%.
- No shared title-chip drop shadow / center highlight helper is used.

Conflict:

- Current authority section 17.2 requires title chip:
  - background about 30% -> 12%;
  - border 12%;
  - drop shadow;
  - text shadow;
  - same visual family as icon buttons and action chip.

Conclusion:

The title chip is still too transparent/weak and not fully using section 17.2. This explains Ant's "标题背景还是没改 / 亮图上看不清" feedback.

## Evidence 3 - Skip/action chip is inline and not sharing the HUD token

File:

- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GameScreen.kt`

Observed implementation:

- `跳过本节` action chip is hand-built inline in `GameScreen.kt`.
- It uses weak old values similar to the title chip:
  - background roughly 22% -> 8%;
  - border about 10%;
  - no shared shadow/highlight helper.

Conflict:

- Current authority section 17.2 requires skip/action chip to use the same token family as the title chip, including stronger glass backing and shadow.

Conclusion:

Even if `NagiIconButton` is improved, the skip chip can still remain visually wrong because it is not a shared component. This is component drift.

## Evidence 4 - Icon button is closer, but still not fully current section 17

File:

- `android/app/src/main/java/com/antnagi/nagisheart/ui/icon/NagiIconButton.kt`

Observed implementation:

- Size 36dp and icon 18dp are correct.
- Uses `NagiShapes.cutSmall`, radial highlight, and icon halo.
- Background is 30% -> 18%, border 10%.
- The soft shadow is drawn as a rounded rectangle behind a cut-corner clipped shape.

Conflict / risk:

- Current section 17.2 asks for approximately 34% -> 22%, border 12%.
- Shadow should visually match the cut-corner shape; drawing a rounded-rect shadow can make the button read like a rounded/soft box in screenshots.

Conclusion:

Icon buttons are not the biggest offender, but they are still not fully aligned. The more serious issue is that title/action chips are weaker and not centralized with icon buttons.

## Evidence 5 - Not all navigation headers use `NagiHud`

Files observed:

- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/BacklogScreen.kt`
- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/ChapterScreen.kt`
- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/SettingsScreen.kt`
- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/SaveLoadScreen.kt`
- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GalleryScreen.kt`

Observed implementation:

- Gameplay screen uses `NagiHud`.
- Backlog screen builds its own header: `NagiIconButton` + centered plain `Text("剧情回顾")` + spacer, not a shared title chip.
- Other system screens similarly have their own header layouts.

Conclusion:

The project does not currently have one authoritative navigation/header component used everywhere. This makes repeated "HUD/nav fixed" reports unreliable: a worker can fix `NagiHud`, while Backlog / Chapter / Settings / Save / Gallery still render custom old headers.

## Why this kept failing across workers

PM conclusion:

1. Authority moved faster than implementation. yiyi/PP implemented against section 15/16.5, while XoXo later tightened section 17 after Ant feedback.
2. Task completion language was too file-based, not active-screen-based. Workers reported "modified NagiDialog / NagiIconButton," but not "this screenshot uses this component and these tokens."
3. Component architecture is fragmented. HUD/nav/action/dialog glass is not represented by one shared token/component layer. Inline copies survived.
4. No forced old-build check existed before. If the real device still shows old output, the loop must check APK freshness/build variant before assuming the code is wrong.

## Required correction direction

Do not do another blind alpha tweak.

PP must first align active paths, then implement:

1. `NagiDialog.kt`
   - replace `RoundedCornerShape(24.dp)` with section 17.3 cut-corner shape;
   - lower border to section 17.3 weak-border token;
   - use gradient card + inner highlight + soft shadow matching cut-corner silhouette;
   - prove skip-confirm real-device dialog no longer reads as rounded rectangle line frame.

2. HUD / nav glass token
   - extract or centralize a shared glass token/helper for icon button, title chip, action/skip chip, and system-screen headers;
   - update `NagiHud.kt`, `NagiIconButton.kt`, and `GameScreen.kt` skip chip together;
   - audit Backlog / Chapter / Settings / Save / Gallery headers so they do not keep old custom nav.

3. Verification gate
   - before claiming done, PP must attach a table with screenshot, screen name, active component file, authority section, key token values, and stale APK / wrong build variant check.

## PM status

This investigation is complete enough to explain the repeated mismatch.

Current root cause classification:

- Missing UI resources: no evidence
- Missing authority: previously yes; now mostly fixed by XoXo section 17
- Developer implementing stale authority: yes
- Duplicate / fragmented active components: yes
- Possible stale APK / build variant: must be checked
- Need broad code-health review: yes, already queued as release-readiness audit

## Cleanup status

None. Investigation only; no code or resources were deleted.

