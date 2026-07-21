# Dev Reply - Start v23 Integration

> Task ID: TASK-20260717-001
> Developer: yiyi / Claude
> Date: 2026-07-17
> Status: implementation complete, pending build verification

## Summary

Integrated TT Start v23 layered splash screen into the Android app. The implementation uses a 9:16 design box centered in a black container, with three layers (clean background PNG, title SVG overlay, START SVG breathing layer) and a transparent click hit area. START alpha breathes 0.68 → 1.00 → 0.68 at 1.6s cycle using native Compose animation. No five-button menu appears on the Start poster.

SVGs use `feDropShadow`, `feGaussianBlur`, and `linearGradient` filters incompatible with Android VectorDrawable, so coil-svg was added to render SVGs from the assets directory. The background PNG was placed in `drawable-nodpi` for direct `painterResource` loading.

## Files Changed

| File | Change |
|---|---|
| `android/app/build.gradle.kts` | Added `io.coil-kt:coil-svg:2.6.0` dependency |
| `android/app/src/main/AndroidManifest.xml` | Added `android:name=".NagisHeartApp"` to register custom Application |
| `android/app/src/main/java/com/antnagi/nagisheart/NagisHeartApp.kt` | New file: Application class with ImageLoaderFactory configuring SvgDecoder |
| `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/SplashScreen.kt` | Full rewrite: 9:16 design box, 3-layer composition, transparent hit area, alpha breathing |
| `android/app/src/main/java/com/antnagi/nagisheart/ui/component/SystemPageBackground.kt` | Fixed missing background: changed from nonexistent asset path to `R.drawable.splash_bg` |
| `android/app/src/main/res/drawable-nodpi/start_bg_v23.png` | New file: copied from `design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png` |
| `android/app/src/main/assets/start/start_title_overlay_v23.svg` | New file: copied from `design/authority/icon_start_tt/start/layers/` |
| `android/app/src/main/assets/start/start_button_static_v23.svg` | New file: copied from `design/authority/icon_start_tt/start/layers/` |

## Route Behavior Confirmed

- `SplashScreen` (route: `splash`) is the opening poster. It is the first screen on app launch.
- `StartScreen` (route: `start`) is the home menu with Continue / New / Gallery / Settings. It is NOT the Start poster.
- On tap of the START hit area, `onFinished` is called. Navigation logic in `NavGraph.kt` routes to `start` (if previously played) or `prologue` (first time). This logic is unchanged.
- No Start/Home split conflict: `SplashScreen` = poster, `StartScreen` = menu. Both are separate composables on separate routes.

## Self Test

| Case | Result | Evidence |
|---|---|---|
| Fresh launch shows TT v23 poster | Cannot verify | No gradlew wrapper; cannot build from CLI. Requires Android Studio build. |
| START breathes with 1.6s alpha cycle | Implemented | `animateFloat(0.68f → 1.0f)`, `tween(800ms)`, `RepeatMode.Reverse` = 1.6s full cycle |
| No scale/movement on START | Implemented | Only `graphicsLayer { alpha = startAlpha }`, no scaleX/scaleY/translationX/Y |
| Tap area matches spec | Implemented | Offset 30.56%/85.42%, size 38.89%/10.94% of design box, matching 330/1640/420/210 on 1080x1920 |
| Layout is one 9:16 composition | Implemented | `fillMaxHeight().aspectRatio(1080f / 1920f)` centered in black Box |
| No five-button menu on poster | Confirmed | SplashScreen has no Continue/Chapter/Gallery/Settings; those are on StartScreen |
| No App Icon replacement | Confirmed | No mipmap or launcher icon files touched |
| No unrelated UI changes | Confirmed | Only SplashScreen, SystemPageBackground (pre-existing fix), build config, and assets changed |
| Build succeeds | BLOCKED | See Blockers section |

## Blockers / Risks

1. **No Gradle wrapper**: The project does not have `gradlew` / `gradlew.bat`. Cannot run command-line builds. Build verification requires opening the project in Android Studio.

2. **Android SDK `android-34` missing on C drive**: Android Studio's global SDK path points to `C:\Users\admin\AppData\Local\Android\Sdk` which has android-35 and android-36.1 but not android-34. The SDK on `D:\Android\Sdk` has android-34. Fix: either click "Install missing platform(s)" in AS, or change AS SDK Location to `D:\Android\Sdk` in File → Settings → Android SDK.

3. **coil-svg rendering fidelity**: The SVGs use `feDropShadow` and `feGaussianBlur` filters. coil-svg uses Android's built-in SVG support which may not render these filters identically to browser rendering. Visual verification needed after build.

## Need PM / Design Decision

1. **SystemPageBackground fix**: The pre-rollback state had `SystemPageBackground` referencing a nonexistent file `poster_start_nagis_heart_bg_clean.png`. I fixed it to use `R.drawable.splash_bg` (the clean background without text). This is the same fix from the previous session. Please confirm this is the correct background for system pages (main menu, save/load, gallery, settings).

2. **Gradle wrapper**: Should I generate a Gradle wrapper (`gradle wrapper`) so future CLI builds and CI are possible? This would add `gradlew`, `gradlew.bat`, and `gradle/wrapper/` to the repo.
