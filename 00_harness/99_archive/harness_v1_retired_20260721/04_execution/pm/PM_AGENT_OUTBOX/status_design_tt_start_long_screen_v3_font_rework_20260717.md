# Status - TT Start Long Screen V3 Font Rework

## Summary

TASK-20260717-003 V3 is complete and ready for PM / Ant review. TT produced V3 under `design/authority/icon_start_tt/start_long/v3/`.

V3 keeps the approved long-screen direction from V2: true 1080 x 2400 full-screen background composition, no V1 glass blur / blurred extension / patch border.

V3 fixes the rejected V2 issue: title, `Blue Lock:`, ornament lines, small square, `START`, and `Tap to start` now come from the confirmed Start v23 SVG path layers. The PNG previews are browser-rendered from those SVG layers, not redrawn with substitute local fonts.

V3 also addresses Ant大小姐's added framing requirement: Nagi's chin and lower jaw contour remain visible, preserving the approved face / chin / START relationship.

## Files Added / Updated

| File | Purpose |
|---|---|
| `design/authority/icon_start_tt/start_long/v3/base/start_clean_remeet_1080x2400_v3.png` | V3 full-screen clean background |
| `design/authority/icon_start_tt/start_long/v3/layers/start_title_overlay_v23_1080x2400_v3.svg` | V3 title overlay using confirmed v23 paths |
| `design/authority/icon_start_tt/start_long/v3/layers/start_button_static_v23_1080x2400_v3.svg` | V3 START static layer using confirmed v23 paths |
| `design/authority/icon_start_tt/start_long/v3/layers/start_button_breathing_v23_1080x2400_v3.svg` | V3 START breathing fallback using confirmed v23 paths |
| `design/authority/icon_start_tt/start_long/v3/previews/start_v23_long_static_preview_1080x2400_v3.png` | V3 browser-rendered static preview |
| `design/authority/icon_start_tt/start_long/v3/previews/start_v23_long_phone_frame_preview_v3.png` | V3 phone-frame preview |
| `design/authority/icon_start_tt/start_long/v3/SPEC_ADDENDUM_START_LONG_SCREEN_v3_0.md` | V3 spec and Android notes |
| `design/authority/icon_start_tt/start_long/v3/MANIFEST_START_LONG_v3.md` | V3 manifest |
| `design/authority/icon_start_tt/start_long/v3/SELF_CHECK_START_LONG_v3.md` | V3 self-check |

## Layout Decision

Recommended authority size remains 1080 x 2400.

V3 background uses `remeet.jpg` resized to 1599 x 2400 and cropped to `x=260, y=0, w=1080, h=2400`. This crop keeps Nagi's chin visible while preserving a strong face focus. Text and ornament layers are the confirmed v23 SVG path layers shifted by 240px into the tall canvas.

START hit area:

| Unit | x | y | w | h |
|---|---:|---:|---:|---:|
| px | 330 | 1880 | 420 | 210 |
| ratio | 0.3056 | 0.7833 | 0.3889 | 0.0875 |

## Android Implementation Notes

- Use V3 as the preferred 9:19.5 / 9:20 long-screen asset group.
- Draw background, title SVG, and START SVG in the same 1080:2400 design box with one shared transform.
- Use full-bounds drawing inside the box for all three layers.
- Keep START separate and animate native alpha 0.68 -> 1.00 -> 0.68 over 1.6s.
- Keep existing 1080 x 1920 Start v23 as 9:16 fallback.
- Do not hand off V1 or V2 as final Android long-screen resource.

## Self Check

- V3 files under `start_long/v3/`: 10
- V3 background and static preview: 1080 x 2400.
- V3 static preview rendered via Edge from SVG layers.
- V3 SVG layers: 1080 x 2400 canvas and `translate(0 240)` offset verified.
- V3 framing: chin / lower jaw contour visible above START area.
- Visual preview and phone-frame preview inspected by TT.
- Excluded areas respected: no App Icon, no XoXo final UI authority, no Android code, no story/script edits, no old-resource deletion.

## Need PM / Ant Decision

Please send V3 preview to Ant大小姐 for visual confirmation. If accepted, yiyi should use `start_long/v3/`.
