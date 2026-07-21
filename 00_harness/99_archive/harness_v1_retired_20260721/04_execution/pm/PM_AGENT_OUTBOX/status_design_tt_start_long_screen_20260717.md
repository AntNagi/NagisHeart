# Status - TT Start Long Screen Adaptation

## Summary

TASK-20260717-003 is complete and ready for PM review. TT produced a 1080 x 2400 long-screen Start v23 adaptation under `design/authority/icon_start_tt/start_long/`.

The accepted 1080 x 1920 v23 composition is preserved as a centered region with a fixed 240px top offset. The new long-screen canvas fills modern 9:19.5 / 9:20 Android phones without black bars while keeping the title, Nagi face focus, and START relationship unchanged.

## Files Added / Updated

| File | Purpose |
|---|---|
| `design/authority/icon_start_tt/start_long/base/start_clean_remeet_1080x2400_long.png` | Long clean background |
| `design/authority/icon_start_tt/start_long/layers/start_title_overlay_v23_1080x2400.svg` | Long title overlay layer |
| `design/authority/icon_start_tt/start_long/layers/start_button_static_v23_1080x2400.svg` | Long START static layer |
| `design/authority/icon_start_tt/start_long/layers/start_button_breathing_v23_1080x2400.svg` | Long START animated SVG fallback |
| `design/authority/icon_start_tt/start_long/previews/start_v23_long_static_preview_1080x2400.png` | Long static preview |
| `design/authority/icon_start_tt/start_long/previews/start_v23_long_phone_frame_preview.png` | Phone-frame preview |
| `design/authority/icon_start_tt/start_long/SPEC_ADDENDUM_START_LONG_SCREEN_v1_0.md` | Layout and Android implementation addendum |
| `design/authority/icon_start_tt/start_long/MANIFEST_START_LONG.md` | Long package manifest |
| `design/authority/icon_start_tt/start_long/SELF_CHECK_START_LONG.md` | TT self-check |

## Layout Decision

Recommended authority size: 1080 x 2400.

The original v23 1080 x 1920 composition remains unchanged and is placed at `x=0, y=240`. The added areas above and below are visual extensions from the approved artwork, not black bars and not a crop of the title/START area.

START hit area:

| Unit | x | y | w | h |
|---|---:|---:|---:|---:|
| px | 330 | 1880 | 420 | 210 |
| ratio | 0.3056 | 0.7833 | 0.3889 | 0.0875 |

## Android Implementation Notes

- For 9:19.5 / 9:20 phones, use the 1080 x 2400 long package as the preferred Start asset group.
- Put background, title SVG, and START SVG in the same 1080:2400 design box and apply one shared transform.
- Inside that design box, use full-bounds drawing (`FillBounds` / match-parent) for all layers.
- Keep START as a separate layer and animate native alpha 0.68 -> 1.00 -> 0.68 over 1.6s when possible.
- Use existing 1080 x 1920 v23 package as fallback for 9:16 devices or any surface where the original 9:16 box already fits without black bars.
- Do not independently crop or move title, face, or START for status/navigation bars.

## Self Check

- Generated files under `start_long/`: 9
- Long background: 1080 x 2400.
- Long static preview: 1080 x 2400.
- Long SVG layers: width/height/viewBox updated to 1080 x 2400.
- Preserved source region: original v23 preview/background pasted at y=240.
- Excluded areas respected: no App Icon, XoXo authority, Android code, story data, or script data edits.

## Need PM / Ant Decision

PM should review whether this 1080 x 2400 centered-region solution is acceptable as the tall-phone Start authority. Ant大小姐 should visually confirm the long-screen preview on a modern tall phone before yiyi promotes it into Android resources.
