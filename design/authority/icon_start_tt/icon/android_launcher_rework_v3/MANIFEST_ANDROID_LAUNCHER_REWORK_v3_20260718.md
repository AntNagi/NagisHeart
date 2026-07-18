# Android Launcher Icon Rework v3 Manifest

Task: TASK-20260718-007  
Owner: TT / Graphic Design  
Generated: 2026-07-18 10:54  
Status: rework after Ant v2 squircle reject; ready for PM / Ant visual review

## Concept Source

`design/authority/icon_start_tt/icon/master/app_icon_tt_candidate_1024.png`

v3 preserves the confirmed third App Icon portrait and pale/gold mood, but rebuilds launcher composition from adaptive masks rather than preserving the old rounded-rect card.

## What Changed From v2

v2 round improved, but squircle still read as the old card. v3 removes card logic across all masks:

- full-bleed Nagi portrait fills the launcher artboard;
- foreground has no inner rounded-square alpha/card boundary;
- gold decoration is freeform circular/flowing ornament, not a rectangle;
- round, squircle, and legacy are all generated from the same full-bleed launcher artwork.

## File List

| File | Dimensions | Bytes | SHA256 |
|---|---:|---:|---|
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/adaptive/hdpi/ic_launcher_background.png` | 162x162 | 725 | `e0016220ff09ba4ca1ef4779a9b85d6e07a7cae8ac4a6ab07d17c277a5e00142` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/adaptive/hdpi/ic_launcher_foreground.png` | 162x162 | 38935 | `ba64b2bf4ecad9566aa2a35e1fa4996a2d1ecbcda33f97862bf0a3b129b3ac9a` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/adaptive/mdpi/ic_launcher_background.png` | 108x108 | 546 | `4116aadb5f5bb04053cf0b14965a83d4dec795b059f5cf971486e24079c953cb` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/adaptive/mdpi/ic_launcher_foreground.png` | 108x108 | 20121 | `cb189f4f296aefff2e72883078cf5df1ec1eaaf67de24ded04bcb70c0c0154f1` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/adaptive/xhdpi/ic_launcher_background.png` | 216x216 | 860 | `e43976230f5b168fadcf97e1d2614e48253b267530061e0c001fc3b61f3cbf5c` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/adaptive/xhdpi/ic_launcher_foreground.png` | 216x216 | 61429 | `d6be7bb0aec8fce1bc6c0c904e06561da1e912ccb7c27ca09ea9b26f8a61ae7e` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/adaptive/xxhdpi/ic_launcher_background.png` | 324x324 | 1323 | `9491f98cb15d6f49236bf3e79aa3e91a4a689d2caa6c433cfb1aaf83780d1856` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/adaptive/xxhdpi/ic_launcher_foreground.png` | 324x324 | 119856 | `1d2d9da3c670afa37711f24a059b13bde82df5204002f708b77145fc05686c65` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/adaptive/xxxhdpi/ic_launcher_background.png` | 432x432 | 1894 | `5a200e2a4444d2adad83081c97df3778b3c5b9296f52ad3e5c3c8b0e9b35e544` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/adaptive/xxxhdpi/ic_launcher_foreground.png` | 432x432 | 195558 | `236198d3e849163f7ad745a7be4058b61ed59207789d1a64c1ee97bba88f25fc` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/legacy/mipmap-hdpi/ic_launcher.png` | 72x72 | 10218 | `c82b5ebc73df91897c019d310655d451f6094e2fc7715b5a89ed684fc5ef0029` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/legacy/mipmap-mdpi/ic_launcher.png` | 48x48 | 5070 | `47c50325c5982b0b0198bb3dc9b931313f4b0e17c61c9ec01f7f0153bd4edd4a` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/legacy/mipmap-xhdpi/ic_launcher.png` | 96x96 | 16631 | `1a4590245d7d5e591f7fd3ce2cfe0a5d8a416c52b75a29322a11a7a0c6f5da05` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/legacy/mipmap-xxhdpi/ic_launcher.png` | 144x144 | 32199 | `e4e9198772bd184e60ad44e66f536900b4049544ea1fd26ec776f029d6401611` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/legacy/mipmap-xxxhdpi/ic_launcher.png` | 192x192 | 51001 | `0da9ebfd4b9ff4d6f7c1a18c69bcb949dc36c6de61e4bf523e0ca50e9cb8271c` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/previews/launcher_rework_v3_legacy_round_preview.png` | 224x224 | 53236 | `796603daad6f89138d5fd2d15ad7cd837ff09f86986df4e32f4a83dce43ffba7` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/previews/launcher_rework_v3_mask_comparison.png` | 1410x342 | 184977 | `c0e328ff922af454650a8c4330e890448e1d5c0c1a3b14bc2ae01ce67153f6a3` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/previews/launcher_rework_v3_round_preview.png` | 224x224 | 53236 | `796603daad6f89138d5fd2d15ad7cd837ff09f86986df4e32f4a83dce43ffba7` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v3/previews/launcher_rework_v3_squircle_preview.png` | 224x224 | 62177 | `5b27cc1f3a18a60a1bc4a3d4f9c27d78d47cfeab8208ce9c28d6b09d7c665c45` |

## Recommended yiyi Integration After PM / Ant Approval

Copy:

- `adaptive/<density>/ic_launcher_foreground.png` → `android/app/src/main/res/mipmap-<density>/ic_launcher_foreground.png`
- `adaptive/<density>/ic_launcher_background.png` → `android/app/src/main/res/mipmap-<density>/ic_launcher_background.png`
- `legacy/mipmap-<density>/ic_launcher.png` → `android/app/src/main/res/mipmap-<density>/ic_launcher.png`

Keep adaptive XML routes unchanged if they already point to `@mipmap/ic_launcher_foreground` and `@mipmap/ic_launcher_background`.

Cleanup candidate after approval:

- delete old density-specific `ic_launcher_round.png`, or regenerate round PNG fallback from this v3 package if legacy round fallback is required.
- Do not let yiyi manually crop or guess shape.
