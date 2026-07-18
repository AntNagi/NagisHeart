# Android Launcher Icon Rework Manifest

Task: TASK-20260718-007  
Owner: TT / Graphic Design  
Generated: 2026-07-18 10:18  
Concept source: `design/authority/icon_start_tt/icon/master/app_icon_tt_candidate_1024.png`

## Intent

This package keeps the confirmed third App Icon concept: rounded rect v2 decorated / `app_icon_tt_candidate_1024.png`.

The rework only addresses Android launcher edge behavior:

- light adaptive background fills the entire launcher mask;
- foreground card is enlarged so the icon does not read as a small square inside round masks;
- legacy PNGs are flattened onto the same light safe background;
- old `ic_launcher_round.png` remains a cleanup candidate, not a resource to keep routing to.

## File List

| File | Dimensions | Bytes | SHA256 |
|---|---:|---:|---|
| `design/authority/icon_start_tt/icon/android_launcher_rework/adaptive/hdpi/ic_launcher_background.png` | 162x162 | 827 | `3c1b283b16552c683deab355b6839d28aed9d9a46ff2bb36ab5b141fdd4b5dd2` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/adaptive/hdpi/ic_launcher_foreground.png` | 162x162 | 37364 | `2aaef02fd1974f6968ce28fd5929b5c5ba8646e707757f54893a7c09b8279fd5` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/adaptive/mdpi/ic_launcher_background.png` | 108x108 | 633 | `eed566e90076c24cf13bf9a4667927a4967070b8d88360d6431efe7e503668e1` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/adaptive/mdpi/ic_launcher_foreground.png` | 108x108 | 19701 | `586ce72a8d249309a29915b8a8425511f4703bbcf204b97b895669d6669c7a63` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/adaptive/xhdpi/ic_launcher_background.png` | 216x216 | 1003 | `73425b0ecc7a3467c9bba59bc5aba1f12443e72f21f57c926c855489d806a7db` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/adaptive/xhdpi/ic_launcher_foreground.png` | 216x216 | 58945 | `47b16345fac3d9334bb64b9c19ebafff6f0bc1b5ab835ac7574dccf44f595597` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/adaptive/xxhdpi/ic_launcher_background.png` | 324x324 | 1498 | `187fa99d65b2640a924d3b26946d8abcae905c82ce846e3791375c1732511dfe` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/adaptive/xxhdpi/ic_launcher_foreground.png` | 324x324 | 110888 | `9144212f0af7866cdf37c88387237a1b5dd11f1e3e5088e0174ba85008be2a65` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/adaptive/xxxhdpi/ic_launcher_background.png` | 432x432 | 2111 | `5d45ab5cf44f05a4f8f717701dbd5c08ed0ae3de3690057e2e9bc0f9f52a8d37` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/adaptive/xxxhdpi/ic_launcher_foreground.png` | 432x432 | 175087 | `d9fad1a1b07d7019fc34dbbfb19a280fa68ef5d77c712d95e912b0c5cb1dbfdc` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/legacy/mipmap-hdpi/ic_launcher.png` | 72x72 | 8286 | `39fc9c19646cac7fec806d13be7f63597a7f27b160c7c761bb2f83ecf4c1c66b` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/legacy/mipmap-mdpi/ic_launcher.png` | 48x48 | 4206 | `5a13fa48c4861b932ec0552a9ab8d5f0d27ef6c74821d69951887fe4687094a0` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/legacy/mipmap-xhdpi/ic_launcher.png` | 96x96 | 13379 | `25f46f2fcc81ff9dc44b9aae73cd2c15504ff96ff1aa6935987aea5f58b7bb32` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/legacy/mipmap-xxhdpi/ic_launcher.png` | 144x144 | 25699 | `e5fc3d78878a7c6bc8fdd8e942da39b0ab62de2c76f372d39903cd666525b452` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/legacy/mipmap-xxxhdpi/ic_launcher.png` | 192x192 | 40821 | `c7057e48a07de958cabb868d943cb8b664a7690e5bee81c1d001c0c09a3aa7fa` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/previews/launcher_rework_mask_comparison.png` | 1120x332 | 154787 | `9e2c536ca700b9dd8c866b67c9f028f2d369f072adeaa90dc710b3ab8e69bc86` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/previews/launcher_rework_round_mask_preview.png` | 224x224 | 49744 | `12d88dd161c39f839bbae56ac2e7bee3318f433958bfab0391d22104fa552de5` |
| `design/authority/icon_start_tt/icon/android_launcher_rework/previews/launcher_rework_squircle_mask_preview.png` | 224x224 | 55654 | `e752c645358adc11d7ec4bd5927d0327be43ed6240d832fce2a80626ea33c11b` |

## Recommended yiyi Integration

Do not change Android code in this TT package. After PM / Ant approval, yiyi should copy:

- `adaptive/<density>/ic_launcher_foreground.png` to `android/app/src/main/res/mipmap-<density>/ic_launcher_foreground.png`
- `adaptive/<density>/ic_launcher_background.png` to `android/app/src/main/res/mipmap-<density>/ic_launcher_background.png`
- `legacy/mipmap-<density>/ic_launcher.png` to `android/app/src/main/res/mipmap-<density>/ic_launcher.png`

Keep `mipmap-anydpi-v26/ic_launcher.xml` and `ic_launcher_round.xml` pointing to `@mipmap/ic_launcher_foreground` and `@mipmap/ic_launcher_background`.

Cleanup recommendation after approval:

- remove old density-specific `ic_launcher_round.png`, or regenerate them from this package if a legacy round fallback is required by a target launcher.
- reason: current old round PNG can be selected by some launcher/fallback paths and reintroduce the black-edge problem.
