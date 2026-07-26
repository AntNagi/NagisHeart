# TT Icon + Start Version Index

## Start Page Versions

| Version | Historical file / location | Main change | Decision |
|---|---|---|---|
| v15 | `trace/opening_poster_v15_main_remeet_1080x1920.png` | Accepted full-screen remeet direction, title and START baked as raster/layers | important ancestor, not final |
| v16 | `trace/opening_poster_v16_overlay_text_outlined.svg` | Converted SVG text to paths to avoid Android font fallback | retained technique |
| v17 | historical safe-area SVGs | Tried safe-area y offsets | rejected, moved accepted composition too much |
| v18 | `trace/opening_poster_v18_overlay_text_outlined_readable.svg` | Added dark outline for readability | rejected, outline too ugly |
| v19 | historical centered soft SVG | Removed outline, restored center | rejected, text support too weak |
| v20 | `trace/opening_poster_v20_overlay_centered_mist.svg` | Added soft mist support | retained |
| v21 | `trace/opening_poster_v21_overlay_centered_mist_tap.svg` | Strengthened Tap to start | retained |
| v22 | `trace/opening_poster_v22_overlay_centered_mist_tap_titlegap.svg` | Fixed Blue Lock / title overlap | static fallback |
| v23 | `start/layers/start_title_overlay_v23.svg` + `start/layers/start_button_breathing_v23.svg` | Split title and START so START can animate independently | final candidate |
| v23 + C vignette | native overlay between title and START | Keep original v23 crop/layers; add static C dark vignette so existing mist/cloud is less visible while START remains topmost | current implementation decision |
| v23 + C vignette + gold preservation | v23 SVG gold ornaments / optional native duplicate lines | Preserve title gold lines + center square and START-side gold lines above darkening/low-alpha effects | required correction |

## Icon Versions

| Version | Historical source | Main change | Decision |
|---|---|---|---|
| original pentagon v1 | historical PM outbox | Abstract pentagon identity | rejected, lost Nagi face |
| decorated avatar v1-v3 | historical PM outbox | Nagi avatar with decoration | reference only |
| rounded rect v1 | `assets/main pic/nagi_icon_rounded_rect_avatar_v1_1080.png` | Formal launcher crop | reference only |
| rounded rect v2 decorated | `assets/main pic/nagi_icon_rounded_rect_avatar_v2_decorated_1080.png` | Formal crop plus restrained decoration | final candidate |
