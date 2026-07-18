# PM Review - TT App Icon Android Launcher Rework V4

Task: `TASK-20260718-007`  
Reviewer: PM 一一  
Date: 2026-07-18  
Status: PM static pass / waiting Ant visual confirmation

## Reviewed Inputs

- `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_TT_20260718_APP_ICON_LAUNCHER_REWORK_V4.md`
- `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_tt_app_icon_android_launcher_rework_v4_20260718.md`
- `design/authority/icon_start_tt/icon/android_launcher_rework_v4/`
- `design/authority/icon_start_tt/icon/android_launcher_rework_v4/MANIFEST_ANDROID_LAUNCHER_REWORK_v4_20260718.md`
- `design/authority/icon_start_tt/icon/android_launcher_rework_v4/SELF_CHECK_ANDROID_LAUNCHER_REWORK_v4_20260718.md`

## Preview Files

- Mask comparison: `design/authority/icon_start_tt/icon/android_launcher_rework_v4/previews/launcher_rework_v4_mask_comparison.png`
- Round preview: `design/authority/icon_start_tt/icon/android_launcher_rework_v4/previews/launcher_rework_v4_round_preview.png`
- Squircle preview: `design/authority/icon_start_tt/icon/android_launcher_rework_v4/previews/launcher_rework_v4_squircle_preview.png`
- Legacy preview: `design/authority/icon_start_tt/icon/android_launcher_rework_v4/previews/launcher_rework_v4_legacy_preview.png`
- Small launcher contact sheet: `design/authority/icon_start_tt/icon/android_launcher_rework_v4/previews/launcher_rework_v4_small_size_contact_sheet.png`

## PM Static Findings

1. Package completeness: pass.
   - adaptive foreground/background provided for mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi.
   - legacy `ic_launcher.png` provided for mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi.
   - round / squircle / legacy previews and small-size contact sheet are present.

2. Technical asset safety: pass.
   - All adaptive, legacy, and preview PNGs are RGB / no alpha.
   - No transparent corners were found, reducing black-edge / launcher fallback risk.
   - Dimensions match expected Android launcher density scale.

3. Rejected issue closure:
   - v1 black-edge/card fallback issue: improved. V4 is fully opaque and full-bleed.
   - v2 squircle card feeling: improved. The squircle preview does not read as an old rounded-rect card inside another mask.
   - v3 aggressive face crop: improved. V4 keeps more of Nagi's face, hair, chin/jaw, and neck relationship.

4. Visual caveat:
   - Round preview still places the left cheek/chin close to the launcher edge. PM considers it acceptable for Ant visual review, but not automatically final.

## Decision

V4 passes PM static review and is ready for Ant visual confirmation.

Do not send to yiyi yet. Only after Ant approval should yiyi integrate V4 assets.

## yiyi Integration Scope If Approved

Only after PM / Ant visual approval:

- copy `adaptive/<density>/ic_launcher_foreground.png` to matching Android `mipmap-<density>/ic_launcher_foreground.png`;
- copy `adaptive/<density>/ic_launcher_background.png` to matching Android `mipmap-<density>/ic_launcher_background.png`;
- copy `legacy/mipmap-<density>/ic_launcher.png` to matching Android `mipmap-<density>/ic_launcher.png`;
- keep existing adaptive XML if it already references foreground/background;
- do not allow yiyi to crop, redraw, or infer launcher shape manually.

## Cleanup Status

No cleanup executed.

Cleanup candidate after approval:

- old density-specific `android/app/src/main/res/mipmap-*/ic_launcher_round.png` should be deleted or regenerated from V4 if round PNG fallback is required.
