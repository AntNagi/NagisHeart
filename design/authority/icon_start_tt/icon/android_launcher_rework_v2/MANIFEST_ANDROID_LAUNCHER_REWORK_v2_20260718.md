# Android Launcher Icon Rework v2 Manifest

Task: TASK-20260718-007  
Owner: TT / Graphic Design  
Generated: 2026-07-18 10:38  
Status: rework after Ant reject; ready for PM / Ant visual review

## Concept Source

`design/authority/icon_start_tt/icon/master/app_icon_tt_candidate_1024.png`

v2 keeps the confirmed third icon concept and Nagi portrait. It does not switch to an old icon or change character direction.

## What Changed From Rejected v1

Rejected v1 still showed the old rounded-rectangle card inside the circle. v2 removes that visible inner card boundary by cropping inside the original card and rebuilding the launcher composition as round-first:

- no visible rounded-square/card outline in the round mask;
- Nagi portrait fills the circle naturally;
- gold decoration becomes circular accent lines / small ornaments, not a rectangular border;
- squircle and legacy remain compatible secondary outputs.

## File List

| File | Dimensions | Bytes | SHA256 |
|---|---:|---:|---|
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/adaptive/hdpi/ic_launcher_background.png` | 162x162 | 680 | `a0e1ae5e8faf8697798160386f528991c4007b4499a4a6beab7a4d5d02d1060b` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/adaptive/hdpi/ic_launcher_foreground.png` | 162x162 | 43552 | `5ffc016f9455bfa29f940d2a8c77398109806ef0e8e9c7e23a2881f65d95991e` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/adaptive/mdpi/ic_launcher_background.png` | 108x108 | 507 | `39c16241d07a78bf925f44dffa3facbccb570aab0dca29ee6b5a1ede4fe1d4ef` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/adaptive/mdpi/ic_launcher_foreground.png` | 108x108 | 22709 | `f9b20049ba85c7141ec163f4724301e3d20de6a4802e7bb42be91f5a1e037e35` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/adaptive/xhdpi/ic_launcher_background.png` | 216x216 | 821 | `19320e6b93ec1aef9e576a0c6ba35bd428e49e507a5661f08b4864cbeb7b6633` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/adaptive/xhdpi/ic_launcher_foreground.png` | 216x216 | 67901 | `0dcfd5a5f61c81770d1c6740466278cffd75220c677f2595fb6e037e8df814fa` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/adaptive/xxhdpi/ic_launcher_background.png` | 324x324 | 1268 | `3e8e01e716f1d8681bffcdcb41de02e163199370973e978a373e29bb78db9761` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/adaptive/xxhdpi/ic_launcher_foreground.png` | 324x324 | 128760 | `9b56e4cde2a11c28bcc478185aeef9f1e98b2aab6f0ea9fa2db00b0bdd89a846` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/adaptive/xxxhdpi/ic_launcher_background.png` | 432x432 | 1789 | `6d3cfa44abbaa3b324581cb652ee4760a44396ae66986b5a21ea75fa9d323204` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/adaptive/xxxhdpi/ic_launcher_foreground.png` | 432x432 | 208790 | `8fc206705b8c2b019d6ed32f94c12c16e3651b3920088a6c6a11a881553a3e6c` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/legacy/mipmap-hdpi/ic_launcher.png` | 72x72 | 10381 | `0415afa1da9e8c3b3c547ec826ce997db0060acf81aca6ee570dc090b01baf5b` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/legacy/mipmap-mdpi/ic_launcher.png` | 48x48 | 5101 | `9b4a684c5bf5f45397984a8ebe8adb66619b6033f0241ba586d650129d170779` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/legacy/mipmap-xhdpi/ic_launcher.png` | 96x96 | 16845 | `ae6c9e56849fe2d3998b7cb428a58f17a8d9e6ed651076dc785b01caf4c5a48c` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/legacy/mipmap-xxhdpi/ic_launcher.png` | 144x144 | 32847 | `78c97e8d97bb79353d5015134f52d591b013a54d279a7deb7514e2e25294251c` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/legacy/mipmap-xxxhdpi/ic_launcher.png` | 192x192 | 51018 | `955b04f5abe0ffd719f087c0613ebec9e0746f327ef224b1a4ac67edb3bbabff` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/previews/launcher_rework_v2_legacy_round_preview.png` | 224x224 | 54418 | `c785b3e98ab536906bc7b11b02fcc6076dfcda905bc1656a6b5d56c050cbe22e` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/previews/launcher_rework_v2_mask_comparison.png` | 1410x342 | 171470 | `636723044b46873c38711ccd5f264b856667e81ed8ba3485e59ed17631a47ba5` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/previews/launcher_rework_v2_round_first_preview.png` | 224x224 | 54418 | `c785b3e98ab536906bc7b11b02fcc6076dfcda905bc1656a6b5d56c050cbe22e` |
| `design/authority/icon_start_tt/icon/android_launcher_rework_v2/previews/launcher_rework_v2_squircle_preview.png` | 224x224 | 62725 | `30cd59f4a6271b3f9c6e2f0082bfbf4f03c0ac14e0826799a213a53795ad6e49` |

## Recommended yiyi Integration After PM / Ant Approval

Copy:

- `adaptive/<density>/ic_launcher_foreground.png` → `android/app/src/main/res/mipmap-<density>/ic_launcher_foreground.png`
- `adaptive/<density>/ic_launcher_background.png` → `android/app/src/main/res/mipmap-<density>/ic_launcher_background.png`
- `legacy/mipmap-<density>/ic_launcher.png` → `android/app/src/main/res/mipmap-<density>/ic_launcher.png`

Keep adaptive XML routes unchanged if they already point to `@mipmap/ic_launcher_foreground` and `@mipmap/ic_launcher_background`.

Cleanup candidate after approval:

- delete old density-specific `ic_launcher_round.png`, or regenerate round PNG fallback from this v2 package if legacy round fallback is required.
- Do not let yiyi manually crop or guess shape.
