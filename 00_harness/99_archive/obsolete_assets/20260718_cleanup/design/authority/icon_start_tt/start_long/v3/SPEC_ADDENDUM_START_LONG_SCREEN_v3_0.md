# Start v23 Long Screen Adaptation Addendum v3.0

> Task: TASK-20260717-003
> Decision: DEC-20260717-008
> Owner: TT / Graphic Design
> Date: 2026-07-17

## V3 Decision

V3 keeps V2's correct true full-screen 1080 x 2400 composition direction and fixes the rejected V2 font issue.

The background remains a continuous full-screen re-frame from `remeet.jpg`; V3 does not use V1 top/bottom glass blur, grey blur bands, or patch extensions.

The title, `Blue Lock:`, gold ornament lines, small square, `START`, and `Tap to start` are restored from the confirmed Start v23 SVG path layers. The V3 PNG preview is browser-rendered from the V3 background plus these SVG layers, so it matches the SVG source of truth instead of using substitute local fonts.

The crop keeps Nagi's chin and lower jaw contour visible, preserving the approved face / chin / START relationship more closely than V2.

## Source And Processing

| Item | Value |
|---|---|
| Background source | `android/app/src/main/assets/bg/remeet.jpg` |
| Source size | 699 x 1049 |
| Resized source for crop | 1599 x 2400 |
| Crop rectangle on resized source | x=260, y=0, w=1080, h=2400 |
| Color processing | same v23 tuning: saturation 0.76, contrast 1.04, brightness 0.99 |
| Text / ornament source | Confirmed Start v23 SVG path layers under `design/authority/icon_start_tt/start/layers/` |
| Framing check | Nagi chin and lower jaw contour remain visible above the START area |

## Layout

| Item | x | y | w | h | Notes |
|---|---:|---:|---:|---:|---|
| Background | 0 | 0 | 1080 | 2400 | True full-screen crop; no blur bands |
| Title overlay | 0 | 0 | 1080 | 2400 | Confirmed v23 SVG paths shifted by 240px |
| START static layer | 0 | 0 | 1080 | 2400 | Confirmed v23 SVG paths shifted by 240px |
| START breathing fallback | 0 | 0 | 1080 | 2400 | Confirmed v23 breathing SVG shifted by 240px |
| START hit area | 330 | 1880 | 420 | 210 | Native transparent tap target |

Relative START hit area:

| x% | y% | w% | h% |
|---:|---:|---:|---:|
| 0.3056 | 0.7833 | 0.3889 | 0.0875 |

## Android Implementation Notes

- Preferred long-screen asset group: use V3 under `design/authority/icon_start_tt/start_long/v3/`.
- For 9:19.5 / 9:20 screens, draw the V3 1080 x 2400 background, title SVG, and START SVG in one shared 1080:2400 design box.
- Use full-bounds drawing inside that design box for all layers, so background/title/START share one transform.
- Keep START as a separate layer and animate native alpha 0.68 -> 1.00 -> 0.68 over 1.6s.
- Keep the existing 1080 x 1920 v23 package as the 9:16 fallback.
- Do not use V1 blurred-extension or V2 substitute-font preview as final Android input.
