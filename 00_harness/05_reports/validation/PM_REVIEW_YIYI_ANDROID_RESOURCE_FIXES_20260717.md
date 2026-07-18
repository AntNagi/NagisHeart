# PM Review - yiyi Android UI Resource Fixes

## Review Target

- Task: `TASK-20260717-005`
- Owner: yiyi
- Dev reply: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_android_resource_fixes_20260717.md`
- Review date: 2026-07-17

## PM Conclusion

Implementation passes static PM review.

Task remains in `review` until CLI / Android build verification is available through `TASK-20260717-004`.

## Verified

1. All 14 XoXo-supplied VectorDrawable XML icons are present in `android/app/src/main/res/drawable/`.
2. Each copied icon's SHA256 matches the corresponding source file in `assets/ui/android/drawable/`.
3. `PrologueScreen.kt` and `NameSetupScreen.kt` now use `R.drawable.splash_bg`.
4. No `poster_start_nagis_heart_bg_clean` reference remains under Android code/resources.
5. Old `splash_start.png`, `splash_title.png`, and `poster_start_nagis_heart_keyart.jpg` have no active code references in the checked Android source scope.
6. `git diff --check` reports only LF/CRLF warnings for the relevant modified Kotlin files, with no actionable whitespace errors.

## Scope Check

yiyi did not mix in:

- Home menu icon behavior changes.
- App Icon replacement.
- Old resource deletion.
- TT Start long-screen assets.
- Story/script/data edits.

## Remaining Verification

Build verification surfaced two resource packaging issues during Ant大小姐实机 build attempt, and yiyi has applied scoped fixes:

1. `assets/ui/android/drawable/ANDROID_DRAWABLE_RESOURCE_MANIFEST_20260717.md` was included by `res.srcDirs` as a drawable resource. It has been moved to `assets/ui/android/`.
2. The 14 icon XML files existed both in `android/app/src/main/res/drawable/` and in `assets/ui/android/drawable/`, while `build.gradle.kts` includes `../../assets/ui/android` as a resource directory. The duplicate copies under `res/drawable/` were removed, leaving the XoXo resource package as the single resource source.

PM static check after the report:

- Manifest is no longer inside `assets/ui/android/drawable/`.
- `res/drawable/` no longer contains duplicate `ic_*.xml` copies.
- `android/app/build.gradle.kts` still includes `../../assets/ui/android` in `res.srcDirs`, so the icons should remain available as Android resources.

`TASK-20260717-005` remains in `review` until a successful build result is reported.
