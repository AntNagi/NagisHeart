# Dev Reply - Start v23 Long Screen Strategy A Layout Experiment

> Task ID: TASK-20260717-008
> Developer: yiyi / Claude
> Date: 2026-07-17
> Status: implementation complete, pending build/screenshot verification

## Summary

Implemented TT Strategy A on Android: cover-height background scaling with a protected 9:16 UI safe layer for SVG overlays. No blur, no V2/V3 re-crop, no font substitution.

## Files Changed

| File | Change |
|---|---|
| `android/.../ui/screen/SplashScreen.kt` | Rewrote layout from fixed 9:16 design box to Strategy A: full-screen `ContentScale.Crop` background + vertically-centered 9:16 UI safe layer |

## Layout Strategy

### Before (9:16 design box)

```
┌──────── screen (9:20) ────────┐
│        black bar (top)        │
│  ┌──── 9:16 design box ────┐  │
│  │  bg + title + START     │  │
│  └─────────────────────────┘  │
│        black bar (bottom)     │
└───────────────────────────────┘
```

### After (Strategy A)

```
┌──────── screen (9:20) ────────┐
│  bg (Crop, fills full screen) │
│  ┌── 9:16 UI safe layer ──┐  │
│  │  title SVG              │  │
│  │  START SVG + hit area   │  │
│  └─────────────────────────┘  │
│  bg continues (no black bar)  │
└───────────────────────────────┘
```

### Technical Details

1. **Background**: `Image(ContentScale.Crop, Modifier.fillMaxSize())` on `R.drawable.start_bg_v23` (1080x1920).
   - On 9:16 screen: exact fit, no crop, identical to before.
   - On 9:20 screen (1080x2400): scale factor = 2400/1920 = 1.25, scaled to 1350x2400, center-crop removes 135px from each horizontal side.
   - No black bars. No blur. No patching.

2. **UI safe layer**: `Box(fillMaxWidth, height = screenW * 1920/1080)` centered vertically via `uiVerticalBias`.
   - Contains title SVG, START SVG, and hit area — all relative to this protected box.
   - On 9:16 screen: UI layer = full screen, zero offset.
   - On 9:20 screen: UI layer = 1080x1920 centered in 1080x2400, offset = 240dp from top.

3. **SVGs**: unchanged `start_title_overlay_v23.svg` and `start_button_static_v23.svg` via Coil AsyncImage with `FillBounds` inside the UI safe layer. No font substitution, no redraw.

4. **Breathing**: unchanged alpha 0.68→1.0, 800ms tween, RepeatMode.Reverse (1.6s full cycle).

5. **Hit area**: unchanged relative coordinates (30.56%, 85.42%, 38.89%, 10.94%) within the UI safe layer.

## Tunable Parameters

| Parameter | Current | Range | Effect |
|---|---|---|---|
| `uiVerticalBias` | `0.5f` (centered) | `0.0f` (top) to `1.0f` (bottom) | Shifts the 9:16 UI safe layer vertically within the tall screen. Ant/PM can tune where the title and START sit relative to the background |

## Behavior Verification Checklist

| Requirement | Expected | Code Evidence |
|---|---|---|
| No top/bottom black bars | Pass | `ContentScale.Crop` + `fillMaxSize()` fills entire screen |
| No glass blur patch | Pass | No blur code exists; pure scale + center-crop |
| Nagi chin visible | Expected pass | Vertical crop = 0 (background scales to fill height). Only horizontal crop occurs. Chin is in the lower portion of 1080x1920 image — remains fully visible |
| Left-side subject coherent | Expected pass | `Alignment.Center` horizontal crop removes equal left/right edges. Left-side Nagi face relationship shifts slightly right but stays coherent |
| v23 title typography unchanged | Pass | Same SVG files, same `FillBounds` rendering, same Coil pipeline |
| START breathing unchanged | Pass | Same `infiniteRepeatable` animation spec |
| START hit area functional | Pass | Same relative coordinates in same UI safe layer |
| Title/START don't drift independently | Pass | Both are children of the same 9:16 UI safe layer box — they move together |

## 9:16 Backward Compatibility

On a standard 9:16 device:
- `ContentScale.Crop` on a 9:16 image in a 9:16 screen = identical to `FillBounds` (no crop needed)
- UI safe layer height = screen height, offset = 0
- Visually identical to the previous implementation

## Screenshots / Recording

**BLOCKED**: No `gradlew` wrapper (TASK-20260717-004 pending). Cannot build APK or run on emulator via CLI. Android Studio manual build is possible but not available in this environment.

## Build / Run Result

**BLOCKED**: Same as above. Code inspection confirms structural correctness:
- `ContentScale.Crop` is the standard Compose API for cover-fit scaling
- `BoxWithConstraints` provides accurate screen dimensions
- UI safe layer arithmetic is verified for both 9:16 and 9:20 cases
- No new imports or dependencies introduced

## What Was NOT Changed

- No V1 blur/glass extension
- No V2/V3 close-crop assets
- No font substitution
- No App Icon change
- No XoXo final UI authority edit
- No story/script/data change
- No old resource deletion
- No Home menu icon work
- No Gradle wrapper (separate task)

## Recommended Next Steps

1. Execute TASK-20260717-004 (Gradle wrapper) to unlock CLI build
2. Build and run on a 9:20 emulator (e.g. Pixel 7 Pro, 1080x2400)
3. Capture screenshots for PM / Ant review
4. If Ant wants to tune vertical position: adjust `uiVerticalBias` (0.0=top, 0.5=center, 1.0=bottom)
5. If Ant approves Strategy A: mark TASK-20260717-001 long-screen blocker as resolved

## Self Check

| Check | Result |
|---|---|
| Only SplashScreen.kt modified | Yes |
| No V1/V2/V3 assets used | Yes |
| No blur/glass/patch code | Yes |
| v23 SVGs unchanged | Yes |
| Breathing animation unchanged | Yes |
| Hit area unchanged | Yes |
| uiVerticalBias tunable documented | Yes |
| 9:16 backward compatible | Yes (verified by arithmetic) |
| No scope creep | Yes |
