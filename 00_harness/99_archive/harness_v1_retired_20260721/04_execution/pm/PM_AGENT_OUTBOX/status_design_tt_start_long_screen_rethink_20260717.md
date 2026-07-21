# Status - TT Start Long Screen Adaptation Rethink

## Summary

TASK-20260717-003 rethink is complete and ready for PM / Ant review.

TT paused direct V4 source-image crop production as requested. The new recommendation is Strategy A: use cover-height adaptation for the clean background, while keeping the confirmed Start v23 title and START SVGs as protected safe-area layers. This is a layout strategy, not a new `remeet.jpg` crop.

## Files Added / Updated

| File | Purpose |
|---|---|
| `design/authority/icon_start_tt/start_long/rethink/START_LONG_SCREEN_ADAPTATION_RETHINK_v1.md` | Strategy analysis and recommendation |
| `design/authority/icon_start_tt/start_long/rethink/previews/strategy_a_design_box_fit_width_preview_1080x2400.png` | Recommended Strategy A preview |
| `design/authority/icon_start_tt/start_long/rethink/previews/strategy_a_phone_frame_preview.png` | Phone-frame preview |
| `design/authority/icon_start_tt/start_long/rethink/MANIFEST_RETHINK_v1.md` | Rethink manifest |
| `design/authority/icon_start_tt/start_long/rethink/SELF_CHECK_RETHINK_v1.md` | TT self-check |

## Recommendation

Do not continue the V2/V3 crop route.

Recommended next PM / Ant decision: approve Strategy A for an implementation experiment.

- Keep original 1080 x 1920 Start v23 background and SVG layers as source of truth.
- On 1080 x 2400 screens, scale the clean background by 1.25 to 1350 x 2400 and crop only horizontal overflow.
- Keep title and START in a protected 1080 x 1920 safe UI layer, shifted vertically for long-screen safe area.
- Keep original START hit area ratios inside the protected UI layer.

## Why This Addresses Ant Feedback

- Nagi chin is preserved because the background has no vertical crop.
- The title / START / Tap to start font identity remains the confirmed v23 SVG path layer.
- The strategy explains why long-screen adaptation does not need to mean re-cropping the raw source image.
- It references the same logic as home/system background adaptation for the image layer, while protecting typography as UI.

## Self Check

- No V4 crop was produced.
- V1/V2/V3 are not recommended as final.
- Preview uses the original v23 poster region and SVG layers.
- No Android code, App Icon, XoXo final UI authority, old resources, or story/script data were modified.

## Need PM / Ant Decision

Please ask Ant大小姐 to confirm whether Strategy A is the right next direction. If accepted, yiyi should implement this as layout logic first. If rejected, TT recommends opening a separate expanded-artwork task under Strategy B rather than continuing blind cropping.
