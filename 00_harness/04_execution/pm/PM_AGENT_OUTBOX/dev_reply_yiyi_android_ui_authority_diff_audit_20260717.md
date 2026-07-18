# Dev Reply - Android UI vs Final UI Authority Diff Audit

> Task ID: TASK-20260717-007
> Developer: yiyi / Claude
> Date: 2026-07-17
> Status: audit complete (read-only, no code changes)

## Summary

Audited all implemented Android UI screens against the final UI authority (`DEC-20260717-003`). Found 2 P0 issues (Prologue/Name broken background path, HUD icons not wired), 3 P1 visible mismatches, and 2 pending design dependencies. No code was modified.

## Files / Screens Inspected

| File | Screen |
|---|---|
| `SplashScreen.kt` | Start / Opening Poster |
| `StartScreen.kt` | Home / Main Menu |
| `PrologueScreen.kt` | Prologue / Opening Text |
| `NameSetupScreen.kt` | Name Setup |
| `GameScreen.kt` | Chapter Opening, Section Opening, Chapter Ending, Dialogue, Ending |
| `NagiHud.kt` | HUD top bar |
| `NagiIcon.kt` | Icon enum definitions |
| `NagiIconButton.kt` | Icon button rendering |
| `DialogueLayer.kt` | Dialogue / Narration / BreathingIndicator |
| `LongNarrationLayer.kt` | Long Narration |
| `ChoiceLayer.kt` | Choice overlay |
| `LineChatLayer.kt` | LINE chat page |
| `SystemPageBackground.kt` | Shared system page background |
| `SettingsScreen.kt` | Settings |
| `SaveLoadScreen.kt` | Save / Load |
| `GalleryScreen.kt` | Gallery |
| `res/drawable/` | Android drawable resources |
| `res/drawable-nodpi/` | No-DPI drawable resources |
| `assets/start/` | Start SVG layers |

## Difference Matrix

| Area | Authority Expected | Android Current | Difference Type | Severity | Evidence | Suggested Owner |
|---|---|---|---|---|---|---|
| Prologue background | `R.drawable.splash_bg` (clean remeet) | `file:///android_asset/bg/poster_start_nagis_heart_bg_clean.png` (nonexistent) | Broken asset path | P0 | `PrologueScreen.kt:57` | yiyi (TASK-20260717-005) |
| Name Setup background | `R.drawable.splash_bg` (clean remeet) | `file:///android_asset/bg/poster_start_nagis_heart_bg_clean.png` (nonexistent) | Broken asset path | P0 | `NameSetupScreen.kt:50` | yiyi (TASK-20260717-005) |
| HUD icons (all 14) | XoXo-supplied VectorDrawable XMLs in `res/drawable/` | `res/drawable/` is empty; 0 of 14 icons present | Resource gap — icons render as invisible | P0 | `NagiIconButton.kt:34` returns resId=0; `DialogueLayer.kt:200` uses `R.drawable.ic_continue` (compile-time ref, will fail build) | yiyi (TASK-20260717-005) |
| Start poster — 9:16 fit | TT v23 3-layer composition | Implemented correctly: 3 layers + transparent hit area + alpha breathing | Match | — | `SplashScreen.kt` | — |
| Start poster — long screen | Full-screen 1080x2400 V3 (pending TT) | 9:16 design box, black bars on tall screens | Pending design dependency | Pending | Awaiting TT V3 per `DEC-20260717-008` | TT (TASK-20260717-003) |
| Home top title | Removed per `DEC-20260717-002` | No top title present | Match | — | `StartScreen.kt` has no title composable | — |
| Home menu icons | Authority shows icon+text buttons | Text-only buttons (继续故事, 存档进度, etc.) | Missing icons on menu | P1 | `StartScreen.kt:44-64` uses Text only, no Icon composable | yiyi (after icons wired) |
| Settings value alignment | Right-aligned values per `DEC-20260717-002` | `SpaceBetween` arrangement in Row | Match | — | `SettingsScreen.kt:158-168` | — |
| Settings back icon | Authority shows ic_back | NagiIconButton(NagiIcon.Back) present but icon invisible (res missing) | Resource gap (same as HUD) | P0 | `SettingsScreen.kt:51` | yiyi (TASK-20260717-005) |
| Save/Load layout | Authority shows slot rows with clean remeet bg | SystemPageBackground + slot rows | Structural match | — | `SaveLoadScreen.kt` | — |
| Gallery layout | Authority shows 2-column grid with ending cards | 2-column LazyVerticalGrid with MemoryCard | Structural match | — | `GalleryScreen.kt` | — |
| Dialogue speaker tag | Pentagon marker + speaker name + glass gradient | Implemented with pentagon marker + glass gradient | Match | — | `DialogueLayer.kt:69-99` | — |
| Dialogue continue indicator | Breathing ic_continue arrow | `R.drawable.ic_continue` — compile-time reference to missing resource | Compile blocker | P0 | `DialogueLayer.kt:200` | yiyi (TASK-20260717-005) |
| Long Narration | Lulu structure, cold color, serif font, radial backdrop | Cold color `0xFF101827`, serif font, radial gradient backdrop | Match | — | `LongNarrationLayer.kt` | — |
| Long Narration page indicator | Page count at bottom | `%02d / %02d` format at bottom center | Match | — | `LongNarrationLayer.kt:161` | — |
| Chapter Opening | Bottom-aligned poster with kicker + chapter name + title | Implemented with PosterPageBackground + KickerLabel | Structural match | P1 | Typography/spacing may differ from authority — needs visual verification | QA after build |
| Section Opening | Bottom-aligned poster with kicker + section title | Implemented similarly to Chapter Opening | Structural match | P1 | Same visual verification needed | QA after build |
| SystemPageBackground | Clean remeet background with dim + gradient | Uses `R.drawable.splash_bg` + dim overlay + vertical gradient | Match | — | `SystemPageBackground.kt` | — |
| App Icon | Pending Ant confirmation | No mipmap resources found in project | Pending | Pending | No launcher icons in `res/mipmap*/` | TT / PM |

## Resource Gaps / Wiring Gaps

| Resource | Authority Source | Android Current | Status | Notes |
|---|---|---|---|---|
| `ic_back.xml` | `assets/ui/android/drawable/ic_back.xml` | Not in `res/drawable/` | Missing | Used by NagiHud, Settings, Save, Gallery headers |
| `ic_auto.xml` | `assets/ui/android/drawable/ic_auto.xml` | Not in `res/drawable/` | Missing | Used by NagiHud auto-play toggle |
| `ic_save.xml` | `assets/ui/android/drawable/ic_save.xml` | Not in `res/drawable/` | Missing | Used by NagiHud save button |
| `ic_menu.xml` | `assets/ui/android/drawable/ic_menu.xml` | Not in `res/drawable/` | Missing | Defined in NagiIcon enum, not yet used in visible UI |
| `ic_continue.xml` | `assets/ui/android/drawable/ic_continue.xml` | Not in `res/drawable/` | **Compile blocker** | `DialogueLayer.kt:200` uses `R.drawable.ic_continue` — hard R reference fails without the resource |
| `ic_settings.xml` | `assets/ui/android/drawable/ic_settings.xml` | Not in `res/drawable/` | Missing | Defined in NagiIcon enum |
| `ic_gallery.xml` | `assets/ui/android/drawable/ic_gallery.xml` | Not in `res/drawable/` | Missing | Defined in NagiIcon enum |
| `ic_chapter.xml` | `assets/ui/android/drawable/ic_chapter.xml` | Not in `res/drawable/` | Missing | Defined in NagiIcon enum |
| `ic_skip.xml` | `assets/ui/android/drawable/ic_skip.xml` | Not in `res/drawable/` | Missing | Defined in NagiIcon enum |
| `ic_backlog.xml` | `assets/ui/android/drawable/ic_backlog.xml` | Not in `res/drawable/` | Missing | Used by NagiHud backlog button |
| `ic_lock.xml` | `assets/ui/android/drawable/ic_lock.xml` | Not in `res/drawable/` | Missing | Used for locked gallery items |
| `ic_line.xml` | `assets/ui/android/drawable/ic_line.xml` | Not in `res/drawable/` | Missing | Used for LINE chat page icon |
| `ic_pentagon_ring.xml` | `assets/ui/android/drawable/ic_pentagon_ring.xml` | Not in `res/drawable/` | Missing | Pentagon outline decoration |
| `ic_pentagon_fill.xml` | `assets/ui/android/drawable/ic_pentagon_fill.xml` | Not in `res/drawable/` | Missing | Pentagon filled decoration |
| `splash_bg.png` | `handoff/.../splash_bg_remeet_clean_1080x1920.png` | `res/drawable-nodpi/splash_bg.png` (SHA match) | Present | Correct |
| `start_bg_v23.png` | `design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png` | `res/drawable-nodpi/start_bg_v23.png` | Present | Correct |
| `start_title_overlay_v23.svg` | `design/authority/icon_start_tt/start/layers/` | `assets/start/start_title_overlay_v23.svg` | Present | Coil-svg rendering fidelity needs visual verification |
| `start_button_static_v23.svg` | `design/authority/icon_start_tt/start/layers/` | `assets/start/start_button_static_v23.svg` | Present | Coil-svg rendering fidelity needs visual verification |

## Remaining References To Deprecated Assets

| Asset | Still Referenced In Code? | Still On Disk? | Notes |
|---|---|---|---|
| `poster_start_nagis_heart_bg_clean.png` | **Yes** — `PrologueScreen.kt:57`, `NameSetupScreen.kt:50` | **No** (file doesn't exist) | Broken reference, causes blank/missing background. Fix in TASK-20260717-005 |
| `poster_start_nagis_heart_keyart.jpg` | No (grep found 0 code references) | Yes (`assets/bg/`) | Unreferenced; keep for now per PM rules |
| `splash_start.png` | No (grep found 0 code references) | Yes (`res/drawable-nodpi/`) | Old Start splash lineage; unreferenced; keep for now |
| `splash_title.png` | No (grep found 0 code references) | Yes (`res/drawable-nodpi/`) | Old title lineage; unreferenced; keep for now |

## Pending Authority Dependencies

1. **TT Start long-screen V3**: `TASK-20260717-003` / `DEC-20260717-008`. TT must produce 1080x2400 full-screen composition preserving v23 fonts and Nagi's chin. Current Android uses 9:16 fallback. Do not integrate V1 or V2.

2. **App Icon**: `TASK-20260715-002`. Ant大小姐 has not yet confirmed final App Icon. No mipmap resources exist in the project. `NagiIcon.AppMark` is defined in the enum but not actively used as a launcher icon.

3. **Chapter catalog, chapter ending, section ending pages**: Still pending design authority. Android has implementations (`ChapterScreen.kt`, `ChapterEndingScreen.kt`, `SectionOpeningScreen.kt`, `SectionClearScreen.kt`) but these are NOT final-authority-confirmed. Do not mark as authority mismatches.

## Items Not To Change Yet

- App Icon / launcher mipmaps
- TT Start long-screen resources (wait for V3)
- Old splash / keyart / unused resources on disk (no deletion before QA)
- Chapter catalog / ending page designs
- Story data or script text

## Recommended PM Decisions

1. **Prioritize `ic_continue.xml` wiring**: `DialogueLayer.kt:200` uses a compile-time `R.drawable.ic_continue` reference. If this resource is missing at build time, the project will not compile. This is the single highest priority resource gap. PM should confirm: proceed with TASK-20260717-005 icon wiring immediately, or does PM want to review the audit first?

2. **Home menu icons**: Authority shows icon+text buttons on the home/main menu, but current Android uses text-only. After HUD icons are wired, should home menu buttons also show icons? This would require additional development beyond the current TASK-20260717-005 scope.

3. **Build verification order**: Recommend executing TASK-20260717-004 (Gradle wrapper) before or in parallel with TASK-20260717-005 (resource fixes), so that the resource fixes can be build-verified via CLI.

## Self Check

| Check | Result |
|---|---|
| All implemented Android screens inspected | Yes — 14 screen/component files read |
| Compared against final UI authority decisions | Yes — DEC-20260715-001 through DEC-20260717-008 |
| Resource gaps identified with specific file references | Yes — 14 icons, 2 broken bg paths |
| Pending authority dependencies separated from bugs | Yes — V3 long-screen, App Icon, catalog/ending pages |
| No code modified | Confirmed — read-only audit |
| No resources copied or deleted | Confirmed |
| No App Icon touched | Confirmed |
| Deprecated asset references documented | Yes — 4 assets checked, 1 still actively referenced |
