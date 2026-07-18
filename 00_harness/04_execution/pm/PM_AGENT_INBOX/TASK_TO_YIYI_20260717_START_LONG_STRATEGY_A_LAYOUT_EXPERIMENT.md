# Task to yiyi - Start v23 Long Screen Strategy A Layout Experiment

## Task

`TASK-20260717-008` - Start v23 长屏 Strategy A Android layout experiment

## Source

- PM decision: `DEC-20260717-012`
- TT rethink package: `design/authority/icon_start_tt/start_long/rethink/`
- TT core document: `design/authority/icon_start_tt/start_long/rethink/START_LONG_SCREEN_ADAPTATION_RETHINK_v1.md`
- TT preview: `design/authority/icon_start_tt/start_long/rethink/previews/strategy_a_phone_frame_preview.png`
- TT status: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_tt_start_long_screen_rethink_20260717.md`

## Important Context

This task was previously paused because PM briefly treated the rethink preview as visually approved too quickly.

TT has now added clarification after Ant/user onsite guidance:

- `assets/home.jpg` and similar old demo images are not the current Start final background.
- Current Start final still follows the Start v23 / remeet direction.
- Use the existing rethink Strategy A as the implementation experiment direction.

This is still not final authority. It is an Android layout experiment / implementation pass that must return screenshots or recording for PM / Ant review.

## Goal

Implement Strategy A on Android for long-screen Start v23 adaptation.

The goal is to remove top/bottom black bars without using blurred padding, without switching fonts, and without using V2/V3 close-crop final assets.

## Required Direction

Use the already confirmed Start v23 1080 x 1920 source as the basis:

- Background: Start v23 / remeet clean background from `design/authority/icon_start_tt/start/`.
- Long-screen behavior: adapt the Start v23 / remeet background to tall screens.
- UI layers: keep v23 title layer, START, and Tap to start in the original SVG/layer identity.
- Key visual rule: when adapting / scaling on long screens, prioritize preserving the left-side subject relationship. Do not let title / START drift independently away from the composition.

## Must Not Do

Do not:

- Use V1 blurred extension / glass blur / fuzzy padding as final.
- Use V2 or V3 close-cropped long-screen assets as final.
- Redraw title / START / Tap to start with substitute fonts.
- Change App Icon.
- Edit XoXo final UI authority.
- Delete old resources.
- Change story/script/data.
- Mix in Home menu icon or other UI page work.

## Expected Behavior

On long screens around 9:19.5 / 9:20:

1. No top/bottom black bars.
2. No top/bottom glass blur patch.
3. Nagi chin / lower jaw remains visible.
4. Left-side subject relationship remains visually coherent.
5. v23 title and START typography remain unchanged.
6. START breathing remains native alpha animation: 0.68 -> 1.0 -> 0.68, 1.6s cycle.
7. START hit area still enters the existing story route.

## Deliverables

Return a dev reply to PM with:

1. Files changed.
2. Exact layout strategy implemented.
3. Screenshots or recording from a long-screen device/emulator.
4. Whether title / START SVG rendering is still visually consistent.
5. Whether Nagi chin / lower jaw and START relationship are preserved.
6. Any offset / scale parameters that PM / Ant may want to tune.
7. Build / run result, or clear blocker if unable to run.

## Completion Definition

The task is complete when PM has an Android visual result that can be compared against TT Strategy A and Ant大小姐 can decide whether to approve, tune, or reject the strategy.
