# Start v23 Long Screen Adaptation Rethink v1

> Task: TASK-20260717-003
> Decision: DEC-20260717-009
> Owner: TT / Graphic Design
> Date: 2026-07-17
> Status: strategy recommendation, not final asset handoff

## 1. Problem Restatement

The next step should not be another V4 crop.

Ant大小姐's latest feedback changes the framing of the problem: the long-screen issue is not proof that the Start artwork must be re-cropped. The original accepted Start v23 already contains the important relationship: Nagi face, chin, lower jaw line, title, and START. The broken implementation path came from treating long-screen adaptation as a new source-image crop.

The better question is: how can Android present the already-confirmed 1080 x 1920 Start v23 design on tall screens without black bars, without glass-blur patching, and without breaking the face/chin/START relationship?

## 2. Why V1 / V2 / V3 Failed

| Version | What was right | Why it failed |
|---|---|---|
| V1 | Preserved original v23 region and layer positions | Top/bottom blurred extension looked like patching, not a complete Start screen |
| V2 | Moved away from glass-blur patching toward a true full-screen image | Preview used substitute local fonts; crop became a closer head shot and weakened the accepted face/chin/START relationship |
| V3 | Restored confirmed v23 SVG text layers | Still followed the same re-crop route; did not answer why Start had to be cropped when other system backgrounds adapt on tall screens |

## 3. Strategy Comparison

### A. Keep the confirmed 1080 x 1920 Start design and scale it as one protected poster

Recommended.

This treats Start v23 as separated background and UI layers, not as raw footage to be re-cropped. On a 1080 x 2400 screen:

- scale the clean 1080 x 1920 background uniformly by 1.25 to 1350 x 2400;
- center-crop only the background's left/right overflow;
- keep title SVG and START SVG in a 1080 x 1920 safe UI layer placed over the background;
- shift the UI layer vertically for long screen safe area instead of cropping it.

Why this answers Ant:

- Nagi chin remains because the background has no vertical crop.
- v23 title/START typography remains because the confirmed SVG path layers remain the source of truth.
- Tall screen fills because the poster height fills the screen.
- It mirrors home/system `ContentScale.Crop` logic for the image layer, while protecting the typography layer from being horizontally clipped.

Tradeoff:

- The background loses 135px on each horizontal side at 1080 x 2400. That is safer than losing chin vertically.
- The title/START layer keeps its original v23 proportions and is not clipped. Ant should confirm the vertical offset.

### B. Create a new 1080 x 2400 expanded illustration/canvas

Possible, but not as the immediate next default.

If a new long asset is required, it should be an expanded canvas that preserves the original face/chin/START relationship. That means extending the image space or rebuilding the composition around the accepted 9:16 poster, not cropping `remeet.jpg` into a closer face shot.

Requirements if chosen:

- keep Nagi chin and lower jaw line;
- keep Start v23 SVG typography;
- use a real expanded composition, not top/bottom glass blur;
- require Ant approval on the new expanded artwork before yiyi implementation.

Tradeoff:

- More design work and higher visual risk.
- Without true outpainting/original extended art, it can easily look like another patch.

### C. Continue crop-based 1080 x 2400 background

Not recommended.

V2/V3 already showed the failure mode: height-covering `remeet.jpg` into 1080 x 2400 makes the image a closer head crop. It may fill the screen, but it breaks the exact character relationship Ant is trying to preserve.

## 4. Recommended Direction

Use Strategy A for the next PM / Ant decision:

**Start v23 background uses cover-height adaptation; v23 title/START remain protected SVG safe layers.**

Recommended preview:

- `previews/strategy_a_design_box_fit_width_preview_1080x2400.png`
- `previews/strategy_a_phone_frame_preview.png`

This is not a final Android resource package. It is a strategy preview that demonstrates the layout logic.

## 5. Android Implementation Notes

Proposed Compose structure:

```kotlin
BoxWithConstraints(Modifier.fillMaxSize().background(Color.Black)) {
    val bgHeight = maxHeight
    val bgWidth = bgHeight * (1080f / 1920f) // 1350px equivalent on 1080x2400
    val bgX = (maxWidth - bgWidth) / 2
    Image(
        painter = painterResource(R.drawable.start_bg_v23),
        contentDescription = null,
        contentScale = ContentScale.FillBounds,
        modifier = Modifier
            .height(bgHeight)
            .width(bgWidth)
            .offset(x = bgX)
    )

    val uiWidth = maxWidth
    val uiHeight = uiWidth * (1920f / 1080f)
    val uiY = (maxHeight - uiHeight) / 2
    Box(
        modifier = Modifier
            .width(uiWidth)
            .height(uiHeight)
            .offset(y = uiY)
    ) {
        SvgImage("start_title_overlay_v23.svg", Modifier.matchParentSize())
        SvgImage("start_button_static_v23.svg", Modifier.matchParentSize().alpha(startAlpha))
        Box(
            Modifier
                .offset(x = uiWidth * 0.3056f, y = uiHeight * 0.8542f)
                .size(width = uiWidth * 0.3889f, height = uiHeight * 0.1094f)
                .clickable { onStart() }
        )
    }
}
```

Key rule:

- background may crop horizontally to fill tall screen;
- title, START, and hit area share one protected UI-layer transform;
- do not redraw or replace the v23 typography.

## 6. Risks And Ant Confirmation Points

Need Ant大小姐 to confirm:

1. Whether background cover-height plus protected UI layer matches her expectation that long screens can adapt without re-cropping Nagi vertically.
2. Whether losing 135px from each horizontal side of the background is acceptable on 1080 x 2400 devices.
3. Whether the title/START safe-layer vertical offset feels correct on her device.
4. Whether yiyi should implement this as layout logic before any new 1080 x 2400 asset is commissioned.

## 7. TT Recommendation

TT recommends pausing V4 asset production and asking PM / Ant to approve Strategy A as the next implementation experiment.

If Ant rejects Strategy A, then Strategy B should be commissioned explicitly as a new expanded artwork task, with the non-negotiable rule that Nagi chin, lower jaw, title, START, and v23 SVG text identity must survive intact.
