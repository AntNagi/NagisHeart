# Status - XoXo Android Resource Audit

## Summary

`TASK-20260717-002` 已完成 UI 侧只读资源审计。本轮没有修改 Android 代码、没有删除或重命名资源、没有改 TT Start 包，也没有补做章节目录 / 大章结束页 / 小节结束页。

结论：

- Start v23 三层资源已进入 Android，并且与 TT authority 源文件 hash 一致。
- `scene_visuals.json` 当前 82 个背景引用均能在 `android/app/src/main/assets/` 找到。
- Home / Save / Gallery / Settings 共用的 clean remeet 系统页背景已存在为 `R.drawable.splash_bg`，且与 final authority 引用的 `splash_bg_remeet_clean_1080x1920.png` hash 一致。
- 主要缺口 / 风险集中在：Prologue / Name 仍路由到不存在的旧 asset path；Android drawable 图标未接入；App Icon 仍未接 TT authority；旧 splash/keyart 资源仍留在 Android；SVG filter 渲染仍需真机确认。

## Required Resources Present

| UI Area | Authority Source | Android Resource / File | Status | Notes |
|---|---|---|---|---|
| Start / opening poster background | `design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png` | `android/app/src/main/res/drawable-nodpi/start_bg_v23.png` | Present | SHA256 与 authority 源文件一致；`SplashScreen.kt` 以 `R.drawable.start_bg_v23` 使用 |
| Start title overlay | `design/authority/icon_start_tt/start/layers/start_title_overlay_v23.svg` | `android/app/src/main/assets/start/start_title_overlay_v23.svg` | Present | SHA256 与 authority 源文件一致；`SplashScreen.kt` 通过 Coil SVG asset 加载 |
| Start START layer | `design/authority/icon_start_tt/start/layers/start_button_static_v23.svg` | `android/app/src/main/assets/start/start_button_static_v23.svg` | Present | SHA256 与 authority 源文件一致；Android 用 native alpha 做 0.68 -> 1.00 -> 0.68 呼吸 |
| Home / system pages clean Nagi background | final authority HTML uses `handoff/yiyi_final_visual_slices_20260711/start_flow/splash_layers/splash_bg_remeet_clean_1080x1920.png` | `android/app/src/main/res/drawable-nodpi/splash_bg.png` | Present | SHA256 与 final authority 引用源一致；`SystemPageBackground.kt` 使用它覆盖 Home / Save / Gallery / Settings 等系统页 |
| Dialogue / Choice / Long narration / Story recap core BG | final authority uses `assets/bg/bg_bluelock_meeting_contract_room.png` for these examples | `android/app/src/main/assets/bg/bg_bluelock_meeting_contract_room.png` | Present | 当前 story visual mapping 中相关 bg asset 存在 |
| LINE page example BG | final authority uses `assets/bg/bedroom.jpg` | `android/app/src/main/assets/bg/bedroom.jpg` | Present | Android story/background asset exists |
| Gallery example CGs | final authority examples use `assets/bg/hug.jpg`, `assets/bg/scarf.jpg` | `android/app/src/main/assets/bg/hug.jpg`, `android/app/src/main/assets/bg/scarf.jpg` | Present | Android gallery currently uses story/gallery mappings; these assets exist |
| Ending example BG | final authority uses `assets/bg/worldstage.jpg` | `android/app/src/main/assets/bg/worldstage.jpg` | Present | Asset exists |
| Story visual backgrounds | runtime `scene_visuals.json` | `android/app/src/main/assets/bg/*` | Present | Read-only check found 82 present bg refs, 0 missing |
| Settings value-right structure | final authority revision `DEC-20260717-002` | `SettingsScreen.kt` | Present / likely aligned | Android `SettingsRow` uses `Arrangement.SpaceBetween`, placing value text on the right side |

## Missing Resources

| UI Area | Required Resource | Evidence | Suggested Owner |
|---|---|---|---|
| Prologue / opening text page | Either route to existing `R.drawable.splash_bg`, or provide `android/app/src/main/assets/bg/poster_start_nagis_heart_bg_clean.png` matching final authority clean remeet background | `PrologueScreen.kt` references `file:///android_asset/bg/poster_start_nagis_heart_bg_clean.png`; `Test-Path android/app/src/main/assets/bg/poster_start_nagis_heart_bg_clean.png` is false. Equivalent correct image exists as `res/drawable-nodpi/splash_bg.png` | Dev yiyi |
| Name setup page | Same as above: correct clean remeet background route/resource | `NameSetupScreen.kt` references the same missing `bg/poster_start_nagis_heart_bg_clean.png`; final authority uses the clean remeet background for Name | Dev yiyi |
| HUD / system icons drawable resources | `ic_back`, `ic_auto`, `ic_save`, `ic_menu`, `ic_continue`, plus other `NagiIcon` drawables such as `ic_settings`, `ic_gallery`, `ic_chapter`, `ic_skip`, `ic_backlog`, `ic_lock`, `ic_line`, `ic_pentagon_*` | `NagiIcon.kt` enumerates these names and `NagiIconButton.kt` resolves them from Android `drawable`; `android/app/src/main/res/` currently has no `drawable/` icons. `DialogueLayer.kt` directly references `R.drawable.ic_continue`, which will require `ic_continue` to exist at compile time | Dev yiyi, with XoXo/PM confirming icon source if needed |
| TT App Icon legacy mipmaps | `design/authority/icon_start_tt/icon/android_mipmap/mipmap-*/ic_launcher.png` | Android has `mipmap-*/ic_launcher.png`, but hashes differ from TT authority mipmap exports; current launcher resources are not the TT candidate | Dev yiyi after PM confirms App Icon final decision |
| TT App Icon adaptive layers | `design/authority/icon_start_tt/icon/android_adaptive/*/ic_launcher_foreground.png` and `ic_launcher_background.png` plus adaptive icon XML | Android has no adaptive icon foreground/background resources or adaptive XML; manifest currently only points to `@mipmap/ic_launcher` | Dev yiyi after PM confirms App Icon final decision |

## Extra / Obsolete Android Resources

| Android Resource / File | Why It Looks Extra | Risk | Suggested Action |
|---|---|---|---|
| `android/app/src/main/res/drawable-nodpi/splash_start.png` | Looks like older baked Start / START asset; final authority Start now uses TT v23 layered poster, not old XoXo splash assets | Developer may accidentally route old Start visual back in, causing conflict with `DEC-20260717-001` / `DEC-20260717-003` | Keep only if needed for rollback, otherwise mark deprecated in resource manifest |
| `android/app/src/main/res/drawable-nodpi/splash_title.png` | Same old splash/title lineage; final Start title comes from `assets/start/start_title_overlay_v23.svg` | Duplicate title source can create font/title mismatch | Mark deprecated; do not use in final Start |
| `android/app/src/main/assets/bg/poster_start_nagis_heart_keyart.jpg` | Old Start keyart remains in Android assets; XoXo final authority explicitly does not keep competing Start image | Risk of reintroducing non-TT Start visual | Mark obsolete for Start; only keep as historical asset if PM wants |
| Existing `android/app/src/main/res/mipmap-*/ic_launcher_round.png` | TT authority package supplies legacy `ic_launcher.png` and adaptive foreground/background, but no final round PNG route is documented | Round icon may show a non-authority launcher identity on devices that use round icon resources | Decide whether to remove, replace, or generate from TT authority package |
| Large raw/background contact sheets and WeChat source images under `android/app/src/main/assets/bg/` | Many are process/source assets rather than accepted final UI authority surfaces | APK bloat and accidental selection risk | Do not delete in this task; PM/Dev can later separate runtime assets from source/archive assets |
| `ChapterEndingScreen.kt` / `SectionClearScreen.kt` related UI resources/usages | Chapter ending and section ending remain pending and excluded from final UI authority | If shipped as final-looking pages, they may imply unapproved design | Keep out of final authority review; gate separately when PM prioritizes pending pages |

## Mismatched Usage

| UI Area | Android Current Usage | Final Authority Expected | Risk | Suggested Action |
|---|---|---|---|---|
| Prologue / opening text page | `PrologueScreen.kt` loads `file:///android_asset/bg/poster_start_nagis_heart_bg_clean.png`, which is missing | Use clean remeet background matching final authority (`splash_bg_remeet_clean_1080x1920.png`; Android equivalent currently exists as `R.drawable.splash_bg`) | Prologue may render without intended background, or with Coil placeholder/blank | Dev route Prologue to existing `R.drawable.splash_bg` or add correctly named asset |
| Name setup | `NameSetupScreen.kt` loads the same missing `bg/poster_start_nagis_heart_bg_clean.png` | Same clean remeet system background as final authority Name page | Name setup may render blank/mismatched background | Dev route Name setup to `R.drawable.splash_bg` or add correctly named asset |
| Start SVG rendering | `SplashScreen.kt` uses Coil SVG decoder for full-canvas SVG layers | TT spec expects SVG filters/mist/title paths to visually match `start_title_overlay_v23.svg` and `start_button_static_v23.svg` | yiyi already flagged possible Android SVG filter differences (`feDropShadow`, `feGaussianBlur`, gradients). Visual may differ from authority despite correct files | QA/Dev verify on Android Studio build/device; if filters differ, export raster fallback layers from TT authority |
| Start route naming | Android separates `SplashScreen` route as poster and `StartScreen` route as home menu | Final authority calls the TT poster “Start / opening”; home is a separate accepted page | Terminology can confuse QA and future implementers; not necessarily a runtime bug | PM/Dev document `SplashScreen = TT Start poster`, `StartScreen = Home menu` in handoff |
| Home / Save / Gallery / Settings background scaling | `SystemPageBackground.kt` uses `ContentScale.Crop` on `R.drawable.splash_bg` | Final authority preview uses centered 9:16 clean remeet composition | On unusual device ratios, crop may shift Nagi close-up compared with authority preview | QA visual check on target Android viewport; if drift appears, use a fixed 9:16 design box or documented crop transform |
| Settings value alignment | `SettingsScreen.kt` uses `Arrangement.SpaceBetween`, but no fixed/min value column width | Final authority uses right-side value column, visually stable for `正常`, `3`, `80%`, `Light / Auto`, `管理` | Long localized values may shift alignment row-to-row | Low risk; Dev can add fixed/min value width if QA sees jitter |
| App launcher icon | Manifest uses `@mipmap/ic_launcher`; current mipmap hashes do not match TT authority icon exports | TT candidate icon package under `design/authority/icon_start_tt/icon/` should become launcher identity when PM/Ant confirm | Launcher identity remains non-authority / stale | After App Icon final confirmation, replace Android mipmaps and add adaptive icon layers/XML |
| HUD / continue icons | UI code expects drawable icon resources by name, but none are currently in `res/drawable` | Final authority HUD uses icon assets from `assets/ui/svg` / Android XML equivalents in `assets/ui/android/drawable` | Icons may be invisible via `getIdentifier == 0`; direct `R.drawable.ic_continue` may fail compile if not generated | Dev copy approved XML icons from `assets/ui/android/drawable/` into `android/app/src/main/res/drawable/` |
| Chapter / section ending | Android has `ChapterEndingScreen.kt` and `SectionClearScreen.kt` flows | Final UI authority keeps chapter ending and section ending pending | Existing Android pages may look “available” despite pending design status | PM/Dev keep them out of final UI compliance claims until separate design task passes |

## Need PM / Dev Decision

1. Dev should decide whether Prologue / Name should route to existing `R.drawable.splash_bg` or receive a copied asset under `android/app/src/main/assets/bg/poster_start_nagis_heart_bg_clean.png`. UI recommendation: route to existing `splash_bg` because its hash matches final authority clean remeet background.
2. PM / Dev should confirm whether to immediately copy `assets/ui/android/drawable/*.xml` into `android/app/src/main/res/drawable/` for HUD/system icons.
3. PM should decide whether App Icon is now also final enough for Android replacement, or whether launcher icon remains pending behind separate Ant confirmation.
4. QA / Dev should visually verify TT Start SVG rendering on Android after build. If Coil SVG filters drift from authority, request raster fallback layers from TT.
5. PM should keep chapter catalog, chapter ending, and section ending outside this audit’s closure criteria.

## Self Check

| Check | Result | Evidence |
|---|---|---|
| Required brief read | Done | Read `TASK_TO_XOXO_20260717_ANDROID_RESOURCE_AUDIT.md`, decision/task records, PM review, yiyi reply, final UI authority HTML/record, and TT Start spec |
| Android code untouched | Pass | This report is the only new output from this task |
| TT Start package untouched | Pass | Only compared hashes / paths |
| Android Start v23 files checked | Pass | Background/title/START layer hashes match TT authority source files |
| Android scene bg references checked | Pass | `scene_visuals.json`: 82 present bg refs, 0 missing |
| Pending pages excluded | Pass | Chapter catalog, chapter ending, and section ending are listed only as pending/gating risk, not audited as required final resources |
