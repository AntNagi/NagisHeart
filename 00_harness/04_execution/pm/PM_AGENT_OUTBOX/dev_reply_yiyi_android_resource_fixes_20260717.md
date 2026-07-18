# Dev Reply - Android UI Resource Fixes

> Task ID: TASK-20260717-005
> Developer: yiyi / Claude
> Date: 2026-07-17
> Status: implementation complete, pending build verification

## Summary

Executed P0 minimum scope per PM裁决:
1. Copied 14 XoXo-supplied VectorDrawable XML icons into `android/app/src/main/res/drawable/`.
2. Fixed Prologue and Name Setup background from broken `file:///android_asset/bg/poster_start_nagis_heart_bg_clean.png` to `R.drawable.splash_bg`.
3. Documented old splash/keyart active reference status (see below).

Not included: Home menu icons (P1), App Icon, resource deletion, TT long-screen, story/script, chapter catalog/endings.

## Files Changed

| File | Change |
|---|---|
| `android/app/src/main/res/drawable/ic_back.xml` | New: copied from `assets/ui/android/drawable/` |
| `android/app/src/main/res/drawable/ic_auto.xml` | New: copied from `assets/ui/android/drawable/` |
| `android/app/src/main/res/drawable/ic_save.xml` | New: copied from `assets/ui/android/drawable/` |
| `android/app/src/main/res/drawable/ic_menu.xml` | New: copied from `assets/ui/android/drawable/` |
| `android/app/src/main/res/drawable/ic_continue.xml` | New: copied from `assets/ui/android/drawable/` |
| `android/app/src/main/res/drawable/ic_settings.xml` | New: copied from `assets/ui/android/drawable/` |
| `android/app/src/main/res/drawable/ic_gallery.xml` | New: copied from `assets/ui/android/drawable/` |
| `android/app/src/main/res/drawable/ic_chapter.xml` | New: copied from `assets/ui/android/drawable/` |
| `android/app/src/main/res/drawable/ic_skip.xml` | New: copied from `assets/ui/android/drawable/` |
| `android/app/src/main/res/drawable/ic_backlog.xml` | New: copied from `assets/ui/android/drawable/` |
| `android/app/src/main/res/drawable/ic_lock.xml` | New: copied from `assets/ui/android/drawable/` |
| `android/app/src/main/res/drawable/ic_line.xml` | New: copied from `assets/ui/android/drawable/` |
| `android/app/src/main/res/drawable/ic_pentagon_ring.xml` | New: copied from `assets/ui/android/drawable/` |
| `android/app/src/main/res/drawable/ic_pentagon_fill.xml` | New: copied from `assets/ui/android/drawable/` |
| `android/.../ui/screen/PrologueScreen.kt` | Changed background from `rememberAsyncImagePainter("file:///android_asset/bg/poster_start_nagis_heart_bg_clean.png")` to `painterResource(R.drawable.splash_bg)`; replaced coil import with `painterResource` + `R` imports |
| `android/.../ui/screen/NameSetupScreen.kt` | Same background fix as PrologueScreen; replaced coil import with `painterResource` + `R` imports |

## Fix Verification

| Case | Result | Evidence |
|---|---|---|
| 14 icons in res/drawable | Pass | `ls` confirms all 14 ic_*.xml present |
| ic_app_mark excluded | Pass | Not copied; App Icon pending Ant confirmation |
| Prologue bg fixed | Pass | `PrologueScreen.kt:57` now uses `painterResource(R.drawable.splash_bg)` |
| Name Setup bg fixed | Pass | `NameSetupScreen.kt:50` now uses `painterResource(R.drawable.splash_bg)` |
| No broken path remains | Pass | `grep poster_start_nagis_heart_bg_clean` across `android/` returns 0 matches |
| No stale coil import | Pass | `grep "import coil"` in both files returns 0 matches |
| R.drawable.ic_continue resolvable | Expected pass | `ic_continue.xml` now exists in `res/drawable/`; `DialogueLayer.kt:200` should compile |
| NagiIconButton dynamic lookup | Expected pass | `getIdentifier(icon.resName, "drawable", ...)` should find all 14 icons at runtime |
| Build succeeds | BLOCKED | No gradlew wrapper; requires AS build or TASK-20260717-004 |

## Remaining References To Deprecated Assets

| Asset | Still Referenced In Code? | Still On Disk? | Notes |
|---|---|---|---|
| `poster_start_nagis_heart_bg_clean.png` | **No** (fixed this task) | No (file never existed) | Broken path eliminated |
| `poster_start_nagis_heart_keyart.jpg` | No (0 code references) | Yes (`assets/bg/`) | Unreferenced; keep per PM rules |
| `splash_start.png` | No (0 code references) | Yes (`res/drawable-nodpi/`) | Old Start lineage; unreferenced; keep per PM rules |
| `splash_title.png` | No (0 code references) | Yes (`res/drawable-nodpi/`) | Old title lineage; unreferenced; keep per PM rules |

## Build / Visual Verification

Cannot verify build without `gradlew` (TASK-20260717-004) or Android Studio manual build. All changes are structurally correct based on code inspection:
- 14 XML files are standard Android VectorDrawable format (verified by XoXo manifest SHA256)
- `R.drawable.splash_bg` already confirmed working in `SystemPageBackground.kt`
- `painterResource()` is the standard Compose API for drawable resources

## Need PM / Design Decision

None for this task scope. Outstanding decisions from the audit (Home menu icons P1, App Icon, long-screen V3) are tracked separately.
