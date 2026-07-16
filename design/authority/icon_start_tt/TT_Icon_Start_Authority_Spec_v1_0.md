# TT Icon + Start Authority Candidate Spec v1.0

> Task: TASK-20260715-002  
> Owner: TT / graphic design  
> Date: 2026-07-16  
> Status: authority candidate, pending Ant大小姐 visual confirmation

## 1. Final Candidate Decision

TT candidate selection:

- App Icon: `nagi_icon_rounded_rect_avatar_v2_decorated_1080`
- Start page: `v23`, built from the clean `remeet` background, static title overlay, and independent breathing START layer
- Start background source: `android/app/src/main/assets/bg/remeet.jpg`
- Start final clean background: `start/base/start_clean_remeet_1080x1920.png`
- Recommended implementation: layered, not baked full poster

This package is an authority candidate package. It must not be treated as final authority until Ant大小姐 confirms the visual.

## 2. Why This Version

### App Icon

The selected icon keeps Nagi's actual square avatar as the subject, instead of replacing it with an abstract original mark. The rounded-rectangle inner crop reads more formal under Android's launcher mask, while the restrained warm-gold pentagon decoration keeps a Blue Lock related visual cue without turning the icon into a copied official logo.

Rejected icon versions:

- `nagi_heart_original_pentagon_avatar_v1_1080`: too abstract and lost Nagi's face.
- `nagi_icon_decorated_avatar_v1/v2/v3`: kept the avatar but the decoration treatment was either too weak or not launcher-formal enough.
- `nagi_icon_rounded_rect_avatar_v1_1080`: got the rounded rectangle direction right, but lost too much decoration.
- `nagi_icon_social_avatar_formal_v1_1080`: more formal, but weaker as a social/avatar identity than v2 decorated.

### Start Page

The selected Start page keeps the accepted full-screen Nagi close-up direction and solves the later implementation problems:

- v15: good visual direction, but PNG/SVG layers depended on font and tight crop behavior; Android font fallback broke the title.
- v16: converted text to SVG paths, fixing font fallback.
- v17: tried safe-area offsets, but moved the composition away from the accepted position.
- v18: added dark outline, improving readability but making the lettering ugly.
- v19: restored horizontal center and removed the dark outline, but the text lost background support.
- v20: added soft mist backing for title and START.
- v21: strengthened `Tap to start`.
- v22: separated `Blue Lock:` and `Nagi's Heart` spacing.
- v23: split the static title layer and the START layer so START can animate without double-rendering.

## 3. Visual Concept

The Start page is not a home menu. It is a quiet opening poster:

- Background carries Nagi's face and emotional hook.
- `Blue Lock:` is a small franchise/context prefix.
- `Nagi's Heart` is the main brand title.
- START is the only operation, kept typographic and soft.
- No Continue / Chapter / Gallery / Settings on Start.
- No rectangular START button background.

Color and mood:

- white / silver lettering
- cool grey mist support
- restrained warm gold lines
- no pink theme
- no heavy black outline

Brand relationship:

- Icon and Start both use Nagi's face as the primary recognition anchor.
- Both keep a white / cool-grey base with restrained warm-gold linear decoration.
- The icon is the compact identity; the Start page expands the same identity into a quiet full-screen poster.

Platform scope:

- Intended for the Android vertical app and the matching 9:16 Web entry experience.
- The 1080x1920 Start composition is not a landscape banner, home menu, or social-media poster.
- The supplied icon master is not a rectangular key visual and should not be stretched into a Start background.

## 4. Start Page Implementation

Base canvas:

- Width: 1080 px
- Height: 1920 px
- Aspect ratio: 9:16
- Coordinate origin: top-left

Background source and processing:

- Original source: `android/app/src/main/assets/bg/remeet.jpg`
- Original source size: 699x1049 px
- Final output: 1080x1920 px
- Crop method: center-focused `cover` resize, then fixed 9:16 crop
- Processing: saturation 0.76, contrast 1.04, brightness 0.99; no title or UI is baked into the clean background

Layer order:

1. Clean background image
2. Static title overlay
3. START breathing layer
4. Transparent click hit area

Files:

- Background: `start/base/start_clean_remeet_1080x1920.png`
- Title layer: `start/layers/start_title_overlay_v23.svg`
- START static fallback: `start/layers/start_button_static_v23.svg`
- START animated SVG: `start/layers/start_button_breathing_v23.svg`
- Device preview: `start/previews/start_v23_phone_frame_preview.png` (preview only)

Use full-canvas SVG layers. Do not tight-crop the title or START in implementation.

### Start Layer Position Table

| Layer | File | x | y | w | h | Anchor | Notes |
|---|---:|---:|---:|---:|---:|---|---|
| Background | `start/base/start_clean_remeet_1080x1920.png` | 0 | 0 | 1080 | 1920 | top-left | cover/crop already baked for 1080x1920 |
| Title overlay | `start/layers/start_title_overlay_v23.svg` | 0 | 0 | 1080 | 1920 | top-left | includes title mist backing and title paths |
| START layer | `start/layers/start_button_breathing_v23.svg` | 0 | 0 | 1080 | 1920 | top-left | full-canvas animated layer |
| Click hit area | transparent native view/button | 330 | 1640 | 420 | 210 | top-left | handles tap, visually invisible |

Relative values:

| Layer / Area | x% | y% | w% | h% |
|---|---:|---:|---:|---:|
| Background | 0.0000 | 0.0000 | 1.0000 | 1.0000 |
| Title overlay | 0.0000 | 0.0000 | 1.0000 | 1.0000 |
| START layer | 0.0000 | 0.0000 | 1.0000 | 1.0000 |
| Click hit area | 0.3056 | 0.8542 | 0.3889 | 0.1094 |

### Animation

Animate the START layer only:

- Property: opacity / alpha
- Values: 0.68 -> 1.00 -> 0.68
- Duration: 1.6s
- Easing: ease-in-out
- Loop: infinite while Start page is visible
- No scale, no x/y movement, no blink, no hard flash
- Stop when leaving Start page

### Safe Area

Do not separately offset title or START for status/navigation bars. The visual layer is a full poster in a 9:16 canvas. Device safe-area handling should be done by the outer screen container, not by moving the SVG internals. If the screen ratio differs from 9:16, keep the background and full-canvas overlays in the same transform.

Recommended display mode:

- Use a single 9:16 design box.
- Fit height if possible.
- If using cover, apply the same cover transform to background and overlay.
- Do not scale background and overlay independently.

## 5. Android Compose Recommendation

```kotlin
Box(modifier = Modifier.fillMaxSize().background(Color.Black)) {
    Box(
        modifier = Modifier
            .fillMaxHeight()
            .aspectRatio(1080f / 1920f)
            .align(Alignment.Center)
    ) {
        Image(
            painter = painterResource(R.drawable.start_clean_remeet_1080x1920),
            contentDescription = null,
            contentScale = ContentScale.FillBounds,
            modifier = Modifier.matchParentSize()
        )
        SvgImage(
            assetName = "start_title_overlay_v23.svg",
            modifier = Modifier.matchParentSize()
        )
        val alpha by rememberInfiniteTransition(label = "start").animateFloat(
            initialValue = 0.68f,
            targetValue = 1.0f,
            animationSpec = infiniteRepeatable(
                animation = tween(800, easing = FastOutSlowInEasing),
                repeatMode = RepeatMode.Reverse
            ),
            label = "startAlpha"
        )
        SvgImage(
            assetName = "start_button_static_v23.svg",
            modifier = Modifier.matchParentSize().alpha(alpha)
        )
        Box(
            modifier = Modifier
                .offset(x = 330.dpScaled, y = 1640.dpScaled)
                .size(width = 420.dpScaled, height = 210.dpScaled)
                .clickable { onStart() }
        )
    }
}
```

If Android cannot render animated SVG, use the static START SVG and animate the native composable alpha. That is the preferred approach.

## 6. Web / CSS Recommendation

```html
<div class="start-poster">
  <img class="layer" src="start_clean_remeet_1080x1920.png" />
  <img class="layer" src="start_title_overlay_v23.svg" />
  <img class="layer start-breathing" src="start_button_static_v23.svg" />
  <button class="start-hit" aria-label="Start"></button>
</div>
```

```css
.start-poster {
  position: relative;
  width: min(100vw, calc(100vh * 1080 / 1920));
  aspect-ratio: 1080 / 1920;
  overflow: hidden;
}
.layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.start-breathing {
  animation: startBreath 1.6s ease-in-out infinite;
}
.start-hit {
  position: absolute;
  left: 30.56%;
  top: 85.42%;
  width: 38.89%;
  height: 10.94%;
  opacity: 0;
}
@keyframes startBreath {
  0%, 100% { opacity: 0.68; }
  50% { opacity: 1; }
}
```

## 7. App Icon Implementation

Master and store files:

- 1024 master: `icon/master/app_icon_tt_candidate_1024.png`
- Play Store: `icon/store/play_store_icon_tt_candidate_512.png`

Android legacy mipmap exports:

| Density | Size | File |
|---|---:|---|
| mdpi | 48x48 | `icon/android_mipmap/mipmap-mdpi/ic_launcher.png` |
| hdpi | 72x72 | `icon/android_mipmap/mipmap-hdpi/ic_launcher.png` |
| xhdpi | 96x96 | `icon/android_mipmap/mipmap-xhdpi/ic_launcher.png` |
| xxhdpi | 144x144 | `icon/android_mipmap/mipmap-xxhdpi/ic_launcher.png` |
| xxxhdpi | 192x192 | `icon/android_mipmap/mipmap-xxxhdpi/ic_launcher.png` |

Adaptive icon candidate:

- Foreground/background PNGs are provided under `icon/android_adaptive/{density}/`.
- Recommended background color: `#121923`.
- Foreground safe composition: icon content centered at 72% of adaptive canvas.
- Keep the face, gold frame, and pentagon details inside the central 72% safe composition; platform circle, squircle, and rounded-rectangle masks may crop only the transparent outer margin.
- Do not add extra platform shadow; the icon already has internal framing.
- Platform mask/rounding is allowed; extra manual rounding, glow, bevel, color tint, or non-uniform scaling is prohibited.

Android resource naming suggestion:

- `mipmap-*/ic_launcher.png` for legacy fallback
- `mipmap-*/ic_launcher_foreground.png`
- `mipmap-*/ic_launcher_background.png`
- manifest icon: `@mipmap/ic_launcher`

Web/PWA:

- Use `icon/master/app_icon_tt_candidate_1024.png` as source.
- Export 192, 512, and maskable variants from the 1024 master if PWA support is needed.

## 8. Pending Ant大小姐 Confirmation

Need Ant大小姐 visual confirmation on:

1. Whether the v23 title height/spacing is accepted as the authority candidate.
2. Whether START breathing intensity 0.68-1.00 feels gentle enough.
3. Whether the icon's pentagon decoration is enough but not too official-logo-like.
4. Whether this package can be promoted from authority candidate to final authority.
