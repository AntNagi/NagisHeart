# Start v23 Long Screen Adaptation Addendum v1.0

> Task: TASK-20260717-003
> Owner: TT / Graphic Design
> Date: 2026-07-17
> Source authority: `design/authority/icon_start_tt/start/`

## Decision

Use a 1080 x 2400 long-screen authority canvas for modern Android tall phones.

The accepted 1080 x 1920 v23 composition is preserved as a centered design region with a fixed y offset of 240px. The added top and bottom areas are generated from softened edge extensions of the approved clean background/static preview. This removes black bars without recropping the title, Nagi face focus, or START relationship.

## Layout

| Item | x | y | w | h | Notes |
|---|---:|---:|---:|---:|---|
| Long canvas | 0 | 0 | 1080 | 2400 | Android long-screen authority size |
| Preserved v23 region | 0 | 240 | 1080 | 1920 | Original composition, not rescaled |
| Title overlay layer | 0 | 0 | 1080 | 2400 | Full long-canvas SVG; original title content shifted by 240px |
| START layer | 0 | 0 | 1080 | 2400 | Full long-canvas SVG; original START content shifted by 240px |
| START hit area | 330 | 1880 | 420 | 210 | Same tappable area shifted with the preserved v23 region |

Relative START hit area on 1080 x 2400:

| x% | y% | w% | h% |
|---:|---:|---:|---:|
| 0.3056 | 0.7833 | 0.3889 | 0.0875 |

## Android Implementation Notes

Preferred mode for 9:19.5 to 9:20 phones:

- Use the 1080 x 2400 background and full-canvas SVG layers in the same parent box.
- Set the long asset group to fill the available screen by height when the device is close to 9:20.
- Use `ContentScale.FillBounds` inside the already-selected long-screen design box, or equivalent full-box drawing, so background/title/START share one transform.
- Keep START animation native if possible: render `start_button_static_v23_1080x2400.svg` and animate composable alpha 0.68 -> 1.00 -> 0.68 over 1.6s.
- Do not independently crop or offset title, face, or START for status/navigation bars.

Recommended Compose sizing rule:

```kotlin
val longRatio = 1080f / 2400f
Box(Modifier.fillMaxSize().background(Color.Black)) {
    Box(
        modifier = Modifier
            .fillMaxHeight()
            .aspectRatio(longRatio)
            .align(Alignment.Center)
    ) {
        // Draw long background + title SVG + START SVG with Modifier.matchParentSize()
    }
}
```

START hit area as percentages:

```kotlin
left = 0.3056f
top = 0.7833f
width = 0.3889f
height = 0.0875f
```

## Fallback Rule

Keep the existing 1080 x 1920 v23 package as the fallback for 9:16 devices and any surface that already displays the 9:16 box without black bars.

Use this long-screen package when the target container ratio is taller than about 9:17.8, especially 9:19.5 and 9:20 Android phones.

## Files

- `base/start_clean_remeet_1080x2400_long.png`
- `layers/start_title_overlay_v23_1080x2400.svg`
- `layers/start_button_static_v23_1080x2400.svg`
- `layers/start_button_breathing_v23_1080x2400.svg`
- `previews/start_v23_long_static_preview_1080x2400.png`
- `previews/start_v23_long_phone_frame_preview.png`
