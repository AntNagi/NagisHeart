# PM Review - yiyi Start Long Strategy A Layout

## Review Target

- Task: `TASK-20260717-008`
- Owner: yiyi
- Dev reply: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_start_long_strategy_a_layout_20260717.md`
- Changed file: `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/SplashScreen.kt`
- Review date: 2026-07-17

## PM Conclusion

Static implementation review passes.

Do not mark final / done yet. Visual confirmation is still blocked by missing build/run screenshot or recording.

## Verified

1. Scope is limited to `SplashScreen.kt`.
2. Strategy A is implemented as full-screen `ContentScale.Crop` background.
3. Title SVG, START SVG, and hit area are placed inside a protected 9:16 UI safe layer.
4. `uiVerticalBias` is available as a tuning parameter, currently `0.5f`.
5. Existing START alpha breathing behavior is unchanged.
6. Existing hit-area relative coordinates are preserved inside the UI safe layer.
7. No V1 blurred extension assets were used.
8. No V2/V3 close-crop long-screen assets were used.
9. No App Icon, XoXo final UI authority, story/script/data, old resource cleanup, or Home menu work was mixed in.

## Remaining Blocker

No build / screenshot verification yet.

Reason: Gradle wrapper is still missing, and no Android Studio / emulator screenshot was returned with this task.

## PM Status

- `TASK-20260717-008`: keep in `review`.
- `TASK-20260717-001`: Start long-screen blocker is not resolved until PM / Ant review an actual Android screenshot or recording.
- `TASK-20260717-004`: still the path to CLI build verification if Ant wants to unblock screenshots/builds now.

## Notes For Visual Review

When screenshots are available, PM / Ant should specifically inspect:

1. Whether the left-side subject relationship still feels right after horizontal crop.
2. Whether Nagi chin / lower jaw remains visible.
3. Whether title and START vertical position should keep `uiVerticalBias = 0.5f` or tune up/down.
4. Whether title / START SVG rendering matches TT v23.

