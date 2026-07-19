# PM Investigation - Android Real Device Ran Stale APK

- Date: 2026-07-19
- Trigger: Ant reported that real-device test still showed almost no visible changes after PP `TASK-20260719-009`.
- Investigator: PM 一一

## Finding

The real device was running an older installed APK than the latest debug APK currently present in the repository build output.

## Evidence

Repository build output:

- `android/app/build/outputs/apk/debug/app-debug.apk`
- LastWriteTime: `2026-07-19 02:36:16`

Connected device package:

- package: `com.antnagi.nagisheart`
- `lastUpdateTime=2026-07-19 02:32:54`
- `versionCode=1`
- `versionName=0.1.0`

Therefore, the device-installed app was older than the latest local debug APK by approximately 3 minutes 22 seconds.

## PM conclusion

Ant's latest real-device result cannot be used as validation for PP `TASK-20260719-009`, because the device was not running the latest APK artifact.

This does not prove PP's implementation is visually/logic correct. It only proves the latest Ant run was a stale-build validation failure.

## Required next step

Before judging PP `TASK-20260719-009`, install the latest APK or rebuild/install from Android Studio, then rerun the real-device checklist:

1. Ending node becomes terminal EndingOverlay and does not continue story.
2. Returning home after ending does not show stale continue-state.
3. Gallery shows the unlocked ending.
4. Dialog/HUD visibly use the latest authority tokens.
5. Backlog default first page; text clipping still needs separate verification.
6. Long narration width is still known-open and should not be counted as fixed.

Cleanup status: none.
