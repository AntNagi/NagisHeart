# Status - TT Start Long Screen Rework

## Summary

TASK-20260717-003 rework is complete and ready for PM / Ant review. TT produced V2 under `design/authority/icon_start_tt/start_long/v2/`.

V2 directly addresses Ant大小姐's feedback: it is a true 1080 x 2400 full-screen composition from the original `remeet.jpg` source, not a 1080 x 1920 center poster with blurred top/bottom extensions.

Preview note: the PNG previews are TT raster reference previews for visual review. For Android implementation, use the V2 background plus the V2 SVG title / START layers in the same folder as the rendering source of truth.

## Files Added / Updated

| File | Purpose |
|---|---|
| `design/authority/icon_start_tt/start_long/v2/base/start_clean_remeet_1080x2400_v2.png` | V2 full-screen clean background |
| `design/authority/icon_start_tt/start_long/v2/layers/start_title_overlay_v23_1080x2400_v2.svg` | V2 title overlay |
| `design/authority/icon_start_tt/start_long/v2/layers/start_button_static_v23_1080x2400_v2.svg` | V2 START static layer |
| `design/authority/icon_start_tt/start_long/v2/layers/start_button_breathing_v23_1080x2400_v2.svg` | V2 START breathing fallback |
| `design/authority/icon_start_tt/start_long/v2/previews/start_v23_long_static_preview_1080x2400_v2.png` | V2 static visual preview |
| `design/authority/icon_start_tt/start_long/v2/previews/start_v23_long_phone_frame_preview_v2.png` | V2 phone-frame preview |
| `design/authority/icon_start_tt/start_long/v2/SPEC_ADDENDUM_START_LONG_SCREEN_v2_0.md` | V2 spec and Android notes |
| `design/authority/icon_start_tt/start_long/v2/MANIFEST_START_LONG_v2.md` | V2 manifest |
| `design/authority/icon_start_tt/start_long/v2/SELF_CHECK_START_LONG_v2.md` | V2 self-check |

## Layout Decision

Recommended authority size remains 1080 x 2400.

V2 uses `remeet.jpg` resized to 1599 x 2400 and cropped to `x=260, y=0, w=1080, h=2400`. The background is continuous image content across the full screen. No glass blur / blurred band / patch extension is used.

Title and START preserve Start v23's layer language and are shifted by 240px into the tall canvas.

START hit area:

| Unit | x | y | w | h |
|---|---:|---:|---:|---:|
| px | 330 | 1880 | 420 | 210 |
| ratio | 0.3056 | 0.7833 | 0.3889 | 0.0875 |

## Android Implementation Notes

- Use V2 as the preferred 9:19.5 / 9:20 long-screen asset group.
- Draw background, title SVG, and START SVG in the same 1080:2400 design box with one shared transform.
- Use full-bounds drawing inside the box for all three layers.
- Keep START separate and animate native alpha 0.68 -> 1.00 -> 0.68 over 1.6s.
- Keep existing 1080 x 1920 Start v23 as 9:16 fallback.
- Do not hand off V1 blurred-extension package as final Android resource.

## Self Check

- V2 files under `start_long/v2/`: 10
- V2 background and static preview: 1080 x 2400.
- V2 SVG layers: 1080 x 2400 canvas and `translate(0 240)` offset verified.
- Visual preview and phone-frame preview inspected by TT.
- Excluded areas respected: no App Icon, no XoXo final UI authority, no Android code, no story/script edits, no old-resource deletion.

## Need PM / Ant Decision

Please send V2 preview to Ant大小姐 for visual confirmation. If accepted, yiyi should use `start_long/v2/` rather than the previous V1 package.
