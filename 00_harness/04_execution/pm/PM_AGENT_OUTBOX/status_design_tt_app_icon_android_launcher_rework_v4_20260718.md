# Status - TT App Icon Android Launcher Rework V4

Task: TASK-20260718-007  
Status: ready for PM / Ant visual review  
Updated: 2026-07-18 12:30

## V4 Package Path

`design/authority/icon_start_tt/icon/android_launcher_rework_v4/`

## Preview Paths

- Mask comparison: `design/authority/icon_start_tt/icon/android_launcher_rework_v4/previews/launcher_rework_v4_mask_comparison.png`
- Round preview: `design/authority/icon_start_tt/icon/android_launcher_rework_v4/previews/launcher_rework_v4_round_preview.png`
- Squircle preview: `design/authority/icon_start_tt/icon/android_launcher_rework_v4/previews/launcher_rework_v4_squircle_preview.png`
- Legacy preview: `design/authority/icon_start_tt/icon/android_launcher_rework_v4/previews/launcher_rework_v4_legacy_preview.png`
- Small launcher contact sheet: `design/authority/icon_start_tt/icon/android_launcher_rework_v4/previews/launcher_rework_v4_small_size_contact_sheet.png`

## Concept / Source Continuity

V4 keeps the confirmed third App Icon visual DNA:

`design/authority/icon_start_tt/icon/master/app_icon_tt_candidate_1024.png`

No old icon rollback, no character replacement, no concept exploration restart.

## How V4 Avoids Black Edge

- adaptive foreground/background and legacy outputs are fully opaque;
- soft light background fills the entire launcher artboard;
- old transparent/black fallback behavior is not used.

## How V4 Avoids Inner Card Boundary

- Round: old rounded-rect border/corners are cropped outside the visible artwork; only the launcher round mask defines the edge.
- Squircle: full-bleed artwork fills the mask; no inner rounded-square/card plate is visible inside the squircle.
- Legacy: legacy PNG is generated from the same full-bleed artwork, not by placing the old card onto another background.

## How V4 Improves Over V3

V3 reduced card feeling but cropped Nagi too aggressively. V4 uses a less aggressive portrait scale and a wider/safer crop so Nagi's face, visible eye, hair mass, chin, and jaw/neck relationship read more complete while still keeping card edges out of the mask.

## yiyi Integration Instructions

Only after PM / Ant approval:

1. copy `adaptive/<density>/ic_launcher_foreground.png` into matching `android/app/src/main/res/mipmap-<density>/`;
2. copy `adaptive/<density>/ic_launcher_background.png` into matching `android/app/src/main/res/mipmap-<density>/`;
3. copy `legacy/mipmap-<density>/ic_launcher.png` into matching Android `mipmap-<density>/`;
4. keep adaptive XML references unchanged if already pointing to foreground/background;
5. do not let yiyi crop, redraw, or infer launcher shape manually.

## Cleanup Candidates

Old density-specific `ic_launcher_round.png` remains a cleanup candidate after approval. Recommendation: delete old round PNGs, or regenerate round fallback from V4 if required. No deletion was performed by TT.

## Scope Check

No Android code/resources, Web, story-data, BG mapping, UI authority, TT Start, or archived/rejected launcher package files were modified.

## Docs

- Manifest: `design/authority/icon_start_tt/icon/android_launcher_rework_v4/MANIFEST_ANDROID_LAUNCHER_REWORK_v4_20260718.md`
- Self check: `design/authority/icon_start_tt/icon/android_launcher_rework_v4/SELF_CHECK_ANDROID_LAUNCHER_REWORK_v4_20260718.md`
