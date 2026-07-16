# SELF CHECK

## Pass 1 - Version and file completeness

- Covered latest v23 Start work, not only v15.
- Included v15/v16/v18/v20/v21/v22 trace files for version relationship.
- Selected v23 as Start authority candidate because it supports independent START animation.
- Selected rounded-rect decorated icon v2 as icon authority candidate.
- Included spec, manifest, version index, background, SVG layers, icon exports, previews.

## Pass 2 - Developer executability

- Start layer x/y/w/h and relative values are specified.
- Click hit area is specified separately from visual START layer.
- START animation values and duration are specified.
- Android Compose and Web/CSS implementation guidance are included.
- Android icon density exports and adaptive icon foreground/background files are included.
- Preview files are marked preview-only and not used as clean source.

## Measured Verification - 2026-07-16

- Package contains 42 files, total 11,828,540 bytes.
- Clean Start background and static preview are both 1080x1920.
- v23 title, static START, and breathing START SVGs all use `viewBox="0 0 1080 1920"` with 1080x1920 canvas dimensions.
- Breathing preview is 1080x1920, 10 frames, 160 ms per frame, totaling the specified 1.6 s loop.
- Icon master is 1024x1024 RGBA; store export is 512x512 RGBA.
- Device preview, icon contact sheet, and combined overview were visually inspected.
- Combined overview text/icon collision found during QA was corrected and rechecked.
