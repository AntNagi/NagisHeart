# Status - TT App Icon Android Launcher Edge Rework v3

Task: TASK-20260718-007  
Status: ready for PM / Ant review after v2 squircle reject  
Updated: 2026-07-18 10:54

## New Package

`design/authority/icon_start_tt/icon/android_launcher_rework_v3/`

## Preview Paths

- Mask comparison: `design/authority/icon_start_tt/icon/android_launcher_rework_v3/previews/launcher_rework_v3_mask_comparison.png`
- Round preview: `design/authority/icon_start_tt/icon/android_launcher_rework_v3/previews/launcher_rework_v3_round_preview.png`
- Squircle preview: `design/authority/icon_start_tt/icon/android_launcher_rework_v3/previews/launcher_rework_v3_squircle_preview.png`
- Legacy round preview: `design/authority/icon_start_tt/icon/android_launcher_rework_v3/previews/launcher_rework_v3_legacy_round_preview.png`

## Concept Preservation

Still uses the confirmed third icon source:

`design/authority/icon_start_tt/icon/master/app_icon_tt_candidate_1024.png`

No old icon rollback, no character replacement, no concept reset.

## How v3 Avoids Card Feeling By Mask

- Round: Nagi portrait fills the circle; the old rounded-rect border/corners are outside the composition; gold accents are circular/freeform.
- Squircle: foreground is full-bleed and opaque, so there is no inner rounded-square alpha/card boundary inside the launcher squircle.
- Legacy: generated from the same full-bleed artwork and flattened; it does not insert the old card on top of a separate launcher background.

## yiyi Integration Notes

Only after PM / Ant visual approval:

1. copy `adaptive/<density>/ic_launcher_foreground.png` into matching `android/app/src/main/res/mipmap-<density>/`;
2. copy `adaptive/<density>/ic_launcher_background.png` into matching `android/app/src/main/res/mipmap-<density>/`;
3. copy `legacy/mipmap-<density>/ic_launcher.png` into matching Android `mipmap-<density>/`;
4. keep adaptive XML references unchanged if already pointing to foreground/background;
5. do not let yiyi crop, redesign, or infer launcher shape manually.

## Cleanup Candidates

Old density-specific `ic_launcher_round.png` should still be deleted after approval, or regenerated from this v3 package if round PNG fallback is required. Keeping stale round PNGs can bypass adaptive assets and reintroduce rejected launcher looks.

## Scope Check

No Android code/resources, Web, story-data, BG mapping, TT Start, or UI authority files were modified.

## Docs

- Manifest: `design/authority/icon_start_tt/icon/android_launcher_rework_v3/MANIFEST_ANDROID_LAUNCHER_REWORK_v3_20260718.md`
- Self check: `design/authority/icon_start_tt/icon/android_launcher_rework_v3/SELF_CHECK_ANDROID_LAUNCHER_REWORK_v3_20260718.md`
