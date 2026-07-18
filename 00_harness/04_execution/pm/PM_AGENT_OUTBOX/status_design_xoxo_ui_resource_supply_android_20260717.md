# Status - XoXo UI Resource Supply For Android

## Summary

`TASK-20260717-006` 已完成。XoXo 复核并确认 Android 需要的 HUD / system icon 资源已经存在于 UI 权威资源目录：

`assets/ui/android/drawable/`

本轮没有修改 Android 代码，没有删除旧资源，没有替换 App Icon，没有修改 TT Start 长屏资源，也没有补做章节目录 / 大章结束页 / 小节结束页。

交付结论：

- 14 个 brief 指定图标全部存在，均为 Android VectorDrawable XML。
- 已新增开发交付清单：`assets/ui/android/drawable/ANDROID_DRAWABLE_RESOURCE_MANIFEST_20260717.md`
- yiyi 可以从 `assets/ui/android/drawable/` copy 指定 XML 到 `android/app/src/main/res/drawable/` 接入。
- Prologue / Name 背景直接使用现有 `R.drawable.splash_bg`，不需要新增旧路径 `android/app/src/main/assets/bg/poster_start_nagis_heart_bg_clean.png`。

## Resource Package / Files Provided

| Resource | File | Status | Notes |
|---|---|---|---|
| `ic_back` | `assets/ui/android/drawable/ic_back.xml` | Ready | Android VectorDrawable, 24dp |
| `ic_auto` | `assets/ui/android/drawable/ic_auto.xml` | Ready | Android VectorDrawable, 24dp |
| `ic_save` | `assets/ui/android/drawable/ic_save.xml` | Ready | Android VectorDrawable, 24dp |
| `ic_menu` | `assets/ui/android/drawable/ic_menu.xml` | Ready | Android VectorDrawable, 24dp |
| `ic_continue` | `assets/ui/android/drawable/ic_continue.xml` | Ready | Android VectorDrawable, 24dp |
| `ic_settings` | `assets/ui/android/drawable/ic_settings.xml` | Ready | Android VectorDrawable, 24dp |
| `ic_gallery` | `assets/ui/android/drawable/ic_gallery.xml` | Ready | Android VectorDrawable, 24dp |
| `ic_chapter` | `assets/ui/android/drawable/ic_chapter.xml` | Ready | Android VectorDrawable, 24dp |
| `ic_skip` | `assets/ui/android/drawable/ic_skip.xml` | Ready | Android VectorDrawable, 24dp |
| `ic_backlog` | `assets/ui/android/drawable/ic_backlog.xml` | Ready | Android VectorDrawable, 24dp |
| `ic_lock` | `assets/ui/android/drawable/ic_lock.xml` | Ready | Android VectorDrawable, 24dp |
| `ic_line` | `assets/ui/android/drawable/ic_line.xml` | Ready | Android VectorDrawable, 24dp |
| `ic_pentagon_ring` | `assets/ui/android/drawable/ic_pentagon_ring.xml` | Ready | Android VectorDrawable, 24dp |
| `ic_pentagon_fill` | `assets/ui/android/drawable/ic_pentagon_fill.xml` | Ready | Android VectorDrawable, 24dp |
| Icon handoff manifest | `assets/ui/android/drawable/ANDROID_DRAWABLE_RESOURCE_MANIFEST_20260717.md` | Ready | Includes SHA256 list and yiyi integration note |

Hash details are recorded in:

`assets/ui/android/drawable/ANDROID_DRAWABLE_RESOURCE_MANIFEST_20260717.md`

## Prologue / Name Background Decision

UI decision: Prologue / Name should use existing `R.drawable.splash_bg`.

Reason:

- `android/app/src/main/res/drawable-nodpi/splash_bg.png`
- `handoff/yiyi_final_visual_slices_20260711/start_flow/splash_layers/splash_bg_remeet_clean_1080x1920.png`

Both files have the same SHA256:

`710162CEDD549802FF0A6240876B890536EE955FC175FAF4F00D5CA803BA42BB`

Therefore:

- Do not add `android/app/src/main/assets/bg/poster_start_nagis_heart_bg_clean.png`.
- yiyi should route Prologue / Name background usage to the existing `R.drawable.splash_bg`.
- The old missing asset path should be treated as stale routing, not as a UI resource XoXo still needs to supply.

## App Icon Boundary

App Icon remains outside this task.

- Do not replace launcher mipmaps in `TASK-20260717-006`.
- Do not wire `ic_app_mark.xml` as launcher identity.
- Keep App Icon waiting for Ant大小姐 separate final confirmation / PM task.

## Deprecated / Extra Resources To Keep For Now

Do not delete these in this task:

| Resource / Area | Current Note | Action |
|---|---|---|
| `android/app/src/main/res/drawable-nodpi/splash_start.png` | Old splash/start lineage | Keep for now; mark as not final Start authority |
| `android/app/src/main/res/drawable-nodpi/splash_title.png` | Old title/splash lineage | Keep for now; mark as not final Start authority |
| `android/app/src/main/assets/bg/poster_start_nagis_heart_keyart.jpg` | Old keyart / non-TT Start visual risk | Keep for now; do not route to final Start |
| Existing launcher mipmaps / round icons | App Icon still pending | Keep until App Icon task |
| raw/contact-sheet/background source images | Process/source assets | Keep until PM opens cleanup task |

Cleanup should only happen after:

1. Missing resources are supplied / confirmed.
2. yiyi Android adaptation is complete.
3. QA / visual test passes.
4. PM opens a separate resource cleanup task.

## Handoff To yiyi

yiyi may proceed with Android resource wiring using this package:

`assets/ui/android/drawable/`

Recommended yiyi actions:

1. Copy the 14 listed XML files into `android/app/src/main/res/drawable/`.
2. Keep resource names unchanged.
3. Ensure `NagiIcon.kt`, `NagiIconButton.kt`, `NagiHud.kt`, and `DialogueLayer.kt` resolve the same names.
4. Route Prologue / Name background to `R.drawable.splash_bg`.
5. Do not add the old missing asset path.
6. Do not replace App Icon in this task.
7. Do not delete old splash/keyart resources in this task.

## Self Check

| Check | Result | Evidence |
|---|---|---|
| 14 required icons exist | Pass | `ic_back`, `ic_auto`, `ic_save`, `ic_menu`, `ic_continue`, `ic_settings`, `ic_gallery`, `ic_chapter`, `ic_skip`, `ic_backlog`, `ic_lock`, `ic_line`, `ic_pentagon_ring`, `ic_pentagon_fill` all exist under `assets/ui/android/drawable/` |
| Icons are Android XML vectors | Pass | All required files contain `<vector ... android:width=\"24dp\" android:height=\"24dp\" ...>` |
| Hash / file list recorded | Pass | See `ANDROID_DRAWABLE_RESOURCE_MANIFEST_20260717.md` |
| Prologue / Name bg decision made | Pass | Use existing `R.drawable.splash_bg`; no new legacy asset path needed |
| App Icon excluded | Pass | Report explicitly excludes launcher replacement / `ic_app_mark.xml` |
| Old resources preserved | Pass | No deletion or rename performed |
| Android code untouched | Pass | No files under `android/` were edited by this task |
