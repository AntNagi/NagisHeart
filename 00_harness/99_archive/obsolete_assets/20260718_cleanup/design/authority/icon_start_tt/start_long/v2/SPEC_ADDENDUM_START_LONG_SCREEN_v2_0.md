# Start v23 Long Screen Adaptation Addendum v2.0

> Task: TASK-20260717-003
> Decision: DEC-20260717-006
> Owner: TT / Graphic Design
> Date: 2026-07-17

## V2 Decision

Use a true 1080 x 2400 full-screen Start composition. V2 does not place the old 1080 x 1920 poster into a taller canvas and does not use top/bottom glass blur, grey blur bands, or patch-style extensions.

The background is re-framed from the original `android/app/src/main/assets/bg/remeet.jpg` source by height-cover scaling to 2400px and a focused horizontal crop. This makes the whole canvas one continuous image while preserving the Start v23 poster mood.

Preview note: the PNG previews are TT raster reference previews for PM / Ant review of the full-screen composition. Android implementation should use the provided SVG layers in this same folder as the source of truth for title and START rendering.

## Source And Processing

| Item | Value |
|---|---|
| Source image | `android/app/src/main/assets/bg/remeet.jpg` |
| Source size | 699 x 1049 |
| Resized source for v2 crop | 1599 x 2400 |
| Crop rectangle on resized source | x=260, y=0, w=1080, h=2400 |
| Color processing | same v23 tuning: saturation 0.76, contrast 1.04, brightness 0.99 |

## Layout

| Item | x | y | w | h | Notes |
|---|---:|---:|---:|---:|---|
| Background | 0 | 0 | 1080 | 2400 | One full-screen re-framed image, no blur bands |
| Title overlay | 0 | 0 | 1080 | 2400 | Full-canvas SVG, original v23 paths shifted by 240px |
| START static layer | 0 | 0 | 1080 | 2400 | Full-canvas SVG, original START shifted by 240px |
| START breathing fallback | 0 | 0 | 1080 | 2400 | Full-canvas animated SVG fallback |
| START hit area | 330 | 1880 | 420 | 210 | Native transparent tap target |

Relative START hit area:

| x% | y% | w% | h% |
|---:|---:|---:|---:|
| 0.3056 | 0.7833 | 0.3889 | 0.0875 |

## Android Implementation Notes

- Preferred long-screen asset group: use V2 under `design/authority/icon_start_tt/start_long/v2/`.
- For 9:19.5 / 9:20 screens, draw the 1080 x 2400 background, title SVG, and START SVG in one shared 1080:2400 design box.
- Use full-bounds drawing inside that design box for all layers, so the background, title, and START share one transform.
- Keep START as a separate layer. Preferred animation remains native alpha: 0.68 -> 1.00 -> 0.68, duration 1.6s, loop while Start is visible.
- Keep the existing 1080 x 1920 v23 package as the 9:16 fallback.
- Do not use the V1 blurred-extension package as final Android input.

## Files

- `base/start_clean_remeet_1080x2400_v2.png`
- `layers/start_title_overlay_v23_1080x2400_v2.svg`
- `layers/start_button_static_v23_1080x2400_v2.svg`
- `layers/start_button_breathing_v23_1080x2400_v2.svg`
- `previews/start_v23_long_static_preview_1080x2400_v2.png`
- `previews/start_v23_long_phone_frame_preview_v2.png`
