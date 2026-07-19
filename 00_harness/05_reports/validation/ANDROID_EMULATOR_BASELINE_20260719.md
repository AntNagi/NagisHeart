# Android Emulator Baseline - 2026-07-19

- PM: 一一
- Purpose: establish a reliable Android runtime evidence baseline before PP/XoXo implementation mapping review.

## Emulator/device

- adb device: `emulator-5554`
- focused app: `com.antnagi.nagisheart/.MainActivity`
- app process: present
- physical size: `1080x2424`
- physical density: `420`

## Build/install freshness

Local APK:

- path: `android/app/build/outputs/apk/debug/app-debug.apk`
- timestamp: `2026-07-19 02:36:16` local filesystem time
- size: `79479094`

Emulator package:

- package: `com.antnagi.nagisheart`
- versionCode: `1`
- versionName: `0.1.0`
- emulator `lastUpdateTime`: `2026-07-18 19:35:23 GMT`
- local equivalent: `2026-07-19 03:35:23 +08:00`

Note: emulator system timezone is GMT:

- `adb shell date`: `Sat Jul 18 19:38:29 GMT 2026`
- local host time: `2026-07-19 03:38:30 +08:00`

## Screenshot evidence

- current screen: `00_harness/05_reports/validation/android_emulator_baseline_20260719/emulator_current_screen.png`

## Conclusion

The emulator is now running `com.antnagi.nagisheart/.MainActivity` from a fresh Android Studio install/run chain at local time approximately `2026-07-19 03:35`.

This is the baseline runtime environment for subsequent Android implementation mapping and screenshot-based review.

Cleanup status: none.
