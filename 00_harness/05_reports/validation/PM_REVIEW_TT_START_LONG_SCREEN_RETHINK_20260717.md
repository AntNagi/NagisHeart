# PM Review - TT Start Long Screen Adaptation Rethink

## Review Target

- Task: `TASK-20260717-003`
- Owner: TT
- Status file: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_tt_start_long_screen_rethink_20260717.md`
- Rethink package: `design/authority/icon_start_tt/start_long/rethink/`
- Core document: `design/authority/icon_start_tt/start_long/rethink/START_LONG_SCREEN_ADAPTATION_RETHINK_v1.md`
- Preview: `design/authority/icon_start_tt/start_long/rethink/previews/strategy_a_phone_frame_preview.png`

## PM Conclusion

Restored as executable Android layout experiment direction after TT追加说明.

Initial PM review was too fast and was paused by `DEC-20260717-011`. TT later clarified after Ant/user onsite guidance that the suspected `assets/home.jpg` style image was only an old demo image, not the current Start final background. Current Start final still follows the Start v23 / remeet direction.

See `DEC-20260717-012`.

## Verification

TT addressed the core rejection reasons from V1 / V2 / V3:

1. No V1-style glass blur / blurred extension is used as the recommended final direction.
2. V2 / V3 raw-source close crop route is explicitly rejected.
3. The confirmed v23 title / START / Tap to start SVG identity is protected and should not be redrawn.
4. The Strategy A preview preserves Nagi chin / lower jaw relationship better than V2 / V3.
5. The adaptation logic is compatible with Ant大小姐's point that long-screen adaptation should not automatically mean re-cropping the Start artwork vertically.

## PM Decision

Register `DEC-20260717-012`:

- Restore Strategy A as an Android layout experiment direction.
- Do not treat the rethink preview as final authority.
- yiyi may implement a controlled layout experiment and return screenshots / recording for PM / Ant review.
- V1 blurred extension and V2/V3 close crop assets remain rejected as final.

## Follow-up Task

`TASK-20260717-008` is restored to `ready`.

The yiyi inbox brief has been recreated:

- `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_YIYI_20260717_START_LONG_STRATEGY_A_LAYOUT_EXPERIMENT.md`

## Remaining Confirmation

PM / Ant still need to confirm the actual Android result before making Strategy A final.

No Start long-screen result should be marked final until screenshots or recording from yiyi are reviewed.
