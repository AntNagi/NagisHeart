# TT Task - Start v23 Long Screen Adaptation

> Sender: PM 一一  
> Receiver: TT / Graphic Design  
> Date: 2026-07-17  
> Task ID: `TASK-20260717-003`  
> Priority: P0  
> Status: ready  

## 0. PM Decision

yiyi has implemented TT Start v23 as a centered 9:16 design box. Ant大小姐's real-device test found black bars on modern longer phones, because the source Start design is 1080x1920 while current phones are closer to 9:19.5 or 9:20.

PM decision: choose option B. Do not ask yiyi to crop the existing 1080x1920 poster full-screen, because that would shift the approved title and START position. TT should provide a long-screen adaptation package that preserves the approved visual relationship.

## 1. Goal

Produce a long-screen Start v23 adaptation for Android tall phones.

Recommended target:

- 1080 x 2400
- or another TT-recommended tall-phone authority size if better justified

The output should keep the accepted Start v23 look while avoiding black bars on long screens.

## 2. Required Source

Use the current TT Start v23 authority package as the source:

- `design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png`
- `design/authority/icon_start_tt/start/layers/start_title_overlay_v23.svg`
- `design/authority/icon_start_tt/start/layers/start_button_static_v23.svg`
- `design/authority/icon_start_tt/TT_Icon_Start_Authority_Spec_v1_0.md`

## 3. Requirements

1. Preserve the approved title / Nagi face / START visual relationship.
2. Do not simply scale or crop in a way that moves the title and START away from the approved composition.
3. Provide a clear Android implementation note:
   - preferred display mode for 9:20 screens
   - whether the long-screen asset should be `fitWidth`, `fillBounds`, or another rule
   - updated START hit area coordinates / percentages for the tall canvas
4. Keep START as a separate layer if animation should remain native.
5. Make it clear whether 1080x1920 remains fallback for 9:16 devices.

## 4. Expected Output

Please add a long-screen folder under the TT authority package, for example:

`design/authority/icon_start_tt/start_long/`

Expected files:

1. Long clean background PNG
2. Long title overlay SVG or PNG
3. Long START static SVG or PNG
4. Static preview PNG
5. Phone-frame preview PNG if possible
6. Spec addendum documenting layout and hit area

## 5. Do Not Modify

- App Icon candidate
- XoXo UI final authority HTML
- Android code
- story data / script data

## 6. Report Back

Write status to:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_tt_start_long_screen_20260717.md`

Use this format:

```md
# Status - TT Start Long Screen Adaptation

## Summary

## Files Added / Updated

| File | Purpose |
|---|---|

## Layout Decision

## Android Implementation Notes

## Self Check

## Need PM / Ant Decision
```
