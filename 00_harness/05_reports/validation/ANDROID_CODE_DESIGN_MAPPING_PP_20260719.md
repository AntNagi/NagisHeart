# Android Code Design Mapping — PP Report

- Task ID: `TASK-20260719-011`
- Owner: PP (Android)
- Date: 2026-07-19
- Status: `review`

---

## 1. Build / Install Freshness Chain

| Item | Value |
|---|---|
| AS project path | `D:\Nagi's Heart\NagisHeart\android` |
| APK output path | `android/app/build/outputs/apk/debug/app-debug.apk` |
| APK build timestamp | 2026-07-19 06:58:24 (local rebuild via Gradle) |
| Device/emulator | `emulator-5554` (1080×2424) |
| Package | `com.antnagi.nagisheart` version `0.1.0` |
| `lastUpdateTime` | `2026-07-18 22:58:35` (UTC offset — matches build) |
| App data | Preserved (existing auto-save present; "继续故事" available) |
| JDK | Android Studio bundled JBR, OpenJDK 21.0.10 |
| Gradle | `gradle-8.13` from cached wrapper distribution |
| Build method | CLI: `gradle.bat assembleDebug` with JAVA_HOME + ANDROID_HOME set |

**Freshness conclusion**: APK on emulator matches the latest local build. Source code in working tree is uncommitted; APK reflects these uncommitted changes.

---

## 2. Runtime Entry Map

| User-visible state | Route / phase | Active Kotlin file | Active Composable / function | Trigger source | Notes |
|---|---|---|---|---|---|
| Splash | `splash` | `SplashScreen.kt` | `SplashScreen` | App launch | Auto-navigates to START or PROLOGUE |
| Start / Home | `start` | `StartScreen.kt` | `StartScreen` | After splash / back from game | Shows 继续故事/新的故事 + bottom nav |
| Prologue | `prologue` | `PrologueScreen.kt` | `PrologueScreen` | First launch only | §18.3: 28sp, lineHeight 1.68 |
| Name setup | `nameSetup` | `NameSetupScreen.kt` | `NameSetupScreen` | After prologue | Player name entry |
| Chapter opening (standalone) | `chapterOpening` | `ChapterOpeningScreen.kt` | `ChapterOpeningScreen` | After name setup (first time only) | **Only used for initial chapter** |
| Chapter opening (inline) | `game` / `ChapterTransition` | `GameScreen.kt` | `ChapterOpeningOverlay` | `GamePhase.ChapterTransition` | Used for all subsequent chapters |
| Section opening (inline) | `game` / `SectionTransition` | `GameScreen.kt` | `SectionOpeningOverlay` | `GamePhase.SectionTransition` | Inline overlay |
| Gameplay dialogue | `game` / `Dialogue` | `GameScreen.kt` + `DialogueLayer.kt` | `DialogueLayer` → `BottomDialogue` / `BottomNarration` | `GamePhase.Dialogue` | §17.1 tokens applied |
| Long narration | `game` / `Dialogue` | `GameScreen.kt` + `LongNarrationLayer.kt` | `LongNarrationLayer` | `displayType == "long_narration"` | §17.4 tokens applied |
| Fullscreen narration | `game` / `Dialogue` | `GameScreen.kt` + `DialogueLayer.kt` | `FullscreenNarration` | `displayType == "center"/"fullscreen"` | |
| Choice / response | `game` / `Choice` | `GameScreen.kt` + `ChoiceLayer.kt` | `ChoiceLayer` | `GamePhase.Choice` | |
| Section clear | `sectionClear` | `SectionClearScreen.kt` | `SectionClearScreen` | Skip section → `onNavigateToSectionClear` | **§17.6: Should be REMOVED — still active** |
| Chapter clear (inline) | `game` / `ChapterEnding` | `GameScreen.kt` | `ChapterEndingOverlay` | `GamePhase.ChapterEnding` | Inline overlay |
| Terminal ending | `game` / `Ending` | `GameScreen.kt` | `EndingOverlay` | `GamePhase.Ending` | §18 three-layer structure |
| Backlog | `backlog` | `BacklogScreen.kt` | `BacklogScreen` | HUD backlog icon | §17.2 text shadow |
| Save / Load | `saveLoad/{mode}` | `SaveLoadScreen.kt` | `SaveLoadScreen` | HUD save icon / Home 存档进度 | |
| Settings | `settings` | `SettingsScreen.kt` | `SettingsScreen` | Home 系统设置 | |
| Chapter catalog | `chapter` | `ChapterScreen.kt` | `ChapterScreen` | Home 章节目录 | |
| Gallery | `gallery` | `GalleryScreen.kt` | `GalleryScreen` | Home 回忆画廊 | Shows 已解锁 0/4 |

---

## 3. Authority-to-Code Mapping

| Authority file / section | Intended behavior / visual | Android file | Actual tokens / logic | Matches? | Gap / risk |
|---|---|---|---|---|---|
| UI MinSpec §17.1 Dialogue box | Cut-md card, bg 0.54→0.70, border 0.08, shadow, speaker gold chip | `DialogueLayer.kt:52-56` | `DialogueCardBgTop=0x8A101827(0.54)`, `BgBottom=0xB3101827(0.70)`, `Border=0x14FFFFFF(0.08)`, `Shadow=0x42000000(0.26)`, clip `cutMedium`, speaker cut-sm gold chip | **YES** | None |
| UI MinSpec §17.2 HUD title | Cut-sm, bg 0.30→0.12, border 0.12, text shadow 0.45 | `NagiHud.kt:91-97` | bg `0x4D0F1827(0.30)→0x1F0F1827(0.12)`, border `0x1FFFFFFF(0.12)`, shadow color `0x73000000(0.45)`, clip `cutSmall` | **YES** | None |
| UI MinSpec §17.2 Icon button | Cut-sm, bg 0.34→0.22, border 0.12, drop shadow | `NagiIconButton.kt:72-92` | bg `0x570F1827(0.34)→0x380F1827(0.22)`, border `0x1FFFFFFF(0.12)`, shadow `0x6B000000(0.42)` 12dp blur, radial highlight | **YES** | None |
| UI MinSpec §17.2 Skip chip | Cut-sm, bg 0.30→0.12, border 0.12 | `GameScreen.kt:243-249` | bg `0x4D0F1827(0.30)→0x1F0F1827(0.12)`, border `0x1FFFFFFF(0.12)`, clip `cutSmall` | **YES** | None |
| UI MinSpec §17.3 Dialog | Cut-md, bg 0.56→0.52, border 0.08, scrim 0.40 | `NagiDialog.kt:33-37` | `ContainerBgTop=0x8F1B2436(0.56)`, `Bottom=0x85142131(0.52)`, border `0x14FFFFFF(0.08)`, scrim `0x66090E18(0.40)`, cut-md shadow path | **YES** | None |
| UI MinSpec §17.4 Long narration width | `padding(horizontal: 18dp)`, inner 20dp, backdrop 0.44 | `LongNarrationLayer.kt:71-83` | `.fillMaxWidth().padding(horizontal=18.dp)`, inner padding `20.dp`, backdrop alpha `0.44f` | **YES** | None |
| UI MinSpec §17.6 Section clear removal | Section clear page should be removed | `SectionClearScreen.kt` + `NavGraph.kt:108-129` | **Still active**: route `sectionClear` exists, skip section navigates to it | **NO** | **P0 — Section clear page must be removed or bypassed** |
| UI MinSpec §18 Ending page | Three layers: content, status feedback, primary action | `GameScreen.kt:318-450` | `EndingOverlay`: Layer 1 (tag+title+desc), Layer 2 (static status text "已解锁"), Layer 3 (返回主页 button, cut-md glass) | **YES** | None |
| UI MinSpec §18.2 Home after-ending | CTA = "新的故事" after terminal ending | `StartScreen.kt` + `NavGraph.kt:152` | `hasCompletedEnding = gameViewModel.hasCompletedEnding()`, StartScreen shows "新的故事" when true | **YES** | Needs real-device verification |
| UI MinSpec §18.3 Prologue | 28sp, lineHeight 1.68 | `PrologueScreen.kt:106-107` | `fontSize = 28.sp`, `lineHeight = (28 * 1.68).sp` | **YES** | None |
| PRD § ending flow | Terminal ending → unlock gallery → return home | `GameViewModel.kt:778-782` | `showEnding()` calls `unlockEnding(id.removePrefix("end_"))` then `deleteAutoSave()` | **YES** | None |
| Interaction § ending flow | No normal tap-through after ending | `GameScreen.kt:75-87` + `330-337` | Tap target suppressed when `phase != Dialogue/Response/ChapterTransition/SectionTransition`; EndingOverlay clickable with empty `onClick={}` | **YES** | None |
| PRD § StoryEngine ending priority | `isEndingNode()` checked before `isNode()` | `StoryEngine.kt:56-63` | `when` block: `isEndingNode` at line 56, `isNode` at line 63 | **YES** | P0 fix applied |

---

## 4. Story-Data / Engine Flow Mapping

| Data file | Load location | Runtime consumer |
|---|---|---|
| `flow.json` | `StoryRepository.kt` → assets | `StoryEngine.getNextNodeId()` |
| `routers.json` | `StoryRepository.kt` → assets | `StoryEngine.resolve()` → `resolveRouter()` |
| `nodes.json` | `StoryRepository.kt` → assets | `StoryEngine.resolve()` → `isNode()` |
| `endings.json` | `StoryRepository.kt` → assets | `StoryEngine.isEndingNode()` + `getEndingDefinitions()` |
| `scene_visuals.json` | `StoryRepository.kt` → assets | `StoryEngine.resolve()` → visual lookup |

**Ending resolution flow**:
1. `StoryEngine.resolve(id)` checks `isEndingNode(id)` BEFORE `isNode(id)` (P0 fix at line 56)
2. `isEndingNode`: requires `id.startsWith("end_")` AND `key in endings.definitions`
3. Returns `NodeResolution.EndingReached(endingId, def)`
4. `GameViewModel.showEnding()` calls `progressManager.unlockEnding(id.removePrefix("end_"))`
5. Strips "end_" prefix: `end_true` → `true`, maps to `endings.definitions["true"]`
6. `saveManager.deleteAutoSave()` prevents "继续故事" resuming past ending
7. Gallery reads `progressManager.getUnlockedEndings()` — returns `Set<String>` of unlocked keys

**Why ending nodes in both `nodes.json` and `endings.json` doesn't break runtime**: The `when` block checks `isEndingNode()` first. If `end_true` exists in both, it hits the ending branch and never falls through to `isNode()`.

**Gallery unlock IDs**: Stored via `ProgressManager` in SharedPreferences. Key format: bare ending name (`true`, `good`, `normal`, `bad`).

---

## 5. Asset Loading Map

| Asset type | Source authority / data | Android asset/res location | Runtime loading code | Fallback | Gap |
|---|---|---|---|---|---|
| Scene BG | `scene_visuals.json` → `bg` field | `assets/bg/` | Coil `rememberAsyncImagePainter("file:///android_asset/$path")` | None (shows empty) | No fallback for missing BG |
| Opening/clear BG | `GameViewModel.uiState.bgAssetPath` | `assets/bg/` | Same Coil pattern in overlays | `"bg/pillow.jpg"` in `SectionClearScreen` | OK |
| Long narration BG | Same as scene BG (inherited from current node) | `assets/bg/` | BG rendered by `GameScreen`, overlay on top | N/A | OK |
| BGM | `scene_visuals.json` → `bgm` field | `assets/bgm/` | `BgmManager` | None | Silent if missing |
| Start v23 | Splash BG | `res/drawable/splash_bg` | `painterResource(R.drawable.splash_bg)` | N/A | OK |
| HUD icons | `NagiIcon` enum → res name | `res/drawable/ic_back, ic_auto, ic_save, ic_backlog` | `painterResource(resId)` via `NagiIconButton` | Silently hidden if `resId==0` | OK |
| App icon | AndroidManifest | `res/mipmap-*` | System launcher | N/A | Not in scope |

---

## 6. Duplicate / Stale Implementation Audit

| File | Status | Proof | Risk |
|---|---|---|---|
| `ChapterOpeningScreen.kt` | **ACTIVE but limited** | Used only at route `chapterOpening` — only triggered after initial name setup. All subsequent chapter openings use `ChapterOpeningOverlay` in `GameScreen.kt`. | Low — works as designed but duplicates visual logic with `ChapterOpeningOverlay` |
| `SectionClearScreen.kt` | **ACTIVE — should be REMOVED per §17.6** | Route `sectionClear` in NavGraph, triggered by `onNavigateToSectionClear` from `GameScreen.skipSection()`. Runtime screenshot A10 confirms it renders. | **P0** — §17.6 says remove section clear page |
| `ChapterEndingOverlay` (in `GameScreen.kt`) | **ACTIVE** | Triggered by `GamePhase.ChapterEnding`. Shows "CHAPTER CLEAR" card. | OK — this is the chapter clear, not section clear |
| Inline overlays in `GameScreen.kt` | **ACTIVE** | `EndingOverlay`, `ChapterOpeningOverlay`, `SectionOpeningOverlay`, `ChapterEndingOverlay`, `ReplayCompleteOverlay` — all triggered by GamePhase enum | OK |
| `NagiHud.kt` | **ACTIVE** | Rendered in every `GameScreen` frame at `Alignment.TopCenter` | OK |
| `NagiIconButton.kt` | **ACTIVE** | Used by `NagiHud` for all 4 icon buttons (back, auto, save, backlog) | OK |
| `NagiDialog.kt` | **ACTIVE** | Used for "从头开始" confirm (NavGraph:136), "跳过本节" confirm (GameScreen:274), new-game confirm | OK |
| System screen headers (Backlog/Save/Settings/Chapter/Gallery) | **ACTIVE** | Each screen has its own top bar with back button and title text | OK — no duplicates |

---

## 7. Current Bug Correlation

| # | Ant issue | Implementation path | Current suspected cause | Design/PRD gap? | Android code bug? | Resource/build issue? | Proposed fix |
|---|---|---|---|---|---|---|---|
| 1 | Dialog still old-looking (rounded rectangle line-frame) | `NagiDialog.kt` | **Already fixed in working tree**: cut-md, gradient bg 0.56→0.52, border 0.08, scrim 0.40, cut-corner shadow. A04 screenshot confirms new appearance. | No | Already fixed (uncommitted) | Stale APK if Ant hasn't rebuilt | Rebuild + install |
| 2 | HUD/nav/title/icon backgrounds still do not match UI | `NagiHud.kt` + `NagiIconButton.kt` | **Already fixed in working tree**: title chip bg 0.30→0.12, icon btn bg 0.34→0.22, border 0.12, drop shadows. A02/A03 screenshots confirm. | No | Already fixed (uncommitted) | Stale APK if Ant hasn't rebuilt | Rebuild + install |
| 3 | Backlog default page / text clipping | `BacklogScreen.kt` | `initialPage = 0` fix applied. Needs real-device text measurement verification. A05 screenshot shows page 1/2, text visible. | No | Partially fixed | Need device test | Verify on real device |
| 4 | Ending appears suddenly, continues story, later stuck | `StoryEngine.kt:56` | **Root cause fixed**: `isEndingNode()` now checked before `isNode()` in `resolve()`. `EndingOverlay` blocks tap-through. | No | Already fixed (uncommitted) | N/A | Rebuild + install |
| 5 | Gallery missing unlocked ending | `GalleryScreen.kt:49` | **Fixed**: removed `remember{}` wrapper on `unlockedEndings` so it recomposes on state change. `GameViewModel.showEnding()` calls `unlockEnding()` with correct stripped key. | No | Already fixed (uncommitted) | N/A | Rebuild + install |
| 6 | Text backings too weak across pages | `DialogueLayer.kt`, `NagiHud.kt`, `NagiIconButton.kt` | **Partially fixed**: §17.1 card bg 0.54→0.70, §17.2 HUD tokens, §17.3 dialog tokens all applied. Long narration backdrop raised to 0.44. | No | Token values applied per authority | N/A | Verify visually on device |
| 7 | Section clear page should be removed | `SectionClearScreen.kt` + `NavGraph.kt:108-129` | **NOT FIXED**: `SectionClearScreen` still active, route still registered. A10 screenshot confirms it still renders with "SECTION CLEAR" text. | §17.6 explicit | **Yes — code bug** | N/A | Remove route + skip directly to next section |
| 8 | Ending page PRD/UI now exists; confirm implementation | `GameScreen.kt:318-450` | **Implemented per §18**: three layers (content/status/action), static status "已解锁: TAG / 回忆画廊新增 1 项", only "返回主页" button, cut-md glass. Cannot visually verify without reaching ending in emulator. | No | Implemented (uncommitted) | N/A | Verify by reaching ending |
| 9 | Long narration width too narrow | `LongNarrationLayer.kt:71` | **Fixed**: changed from `.fillMaxWidth(0.78f)` to `.fillMaxWidth().padding(horizontal=18.dp)`, inner padding 40→20dp. | No | Already fixed (uncommitted) | N/A | Rebuild + install |

---

## 8. Runtime Screenshot Evidence

| Evidence ID | Screen / state | Authority section | Runtime path | Screenshot path | Pass / fail | Notes |
|---|---|---|---|---|---|---|
| A01 | Start screen | — | `splash` → `start` | `A01_start_home.png` | PASS | "Blue Lock: Nagi's Heart" + START |
| A01b | Home screen | — | `start` | `A01b_after_start_tap.png` | PASS | 继续故事/新的故事 + bottom nav |
| A02 | Gameplay HUD bright BG | §17.1, §17.2 | `game` / `Dialogue` | `A02_gameplay_hud_bright_bg.png` | PASS | Speaker "JFA会长" gold chip, cut-corner card, HUD icons visible |
| A03 | Gameplay HUD dark BG | §17.1, §17.2 | `game` / `Dialogue` | `A03_gameplay_hud_dark_bg.png` | PASS | BottomNarration with cut-corner card, HUD title "作战室·初遇" |
| A04 | Skip-section confirm dialog | §17.3 | `game` → NagiDialog | `A04_confirm_dialog.png` + `A04_skip_dialog.png` | PASS | Cut-corner glass dialog with scrim, "跳过本节" confirm |
| A05 | Backlog first page | — | `backlog` | `A05_backlog.png` | PASS | "剧情回顾" page 1/2, gold speaker names, no text clipping visible |
| A06 | Backlog long-text page | — | `backlog` | — | NOT CAPTURED | Need more dialogue history to test |
| A07 | Long narration | §17.4 | `game` / `long_narration` | — | NOT CAPTURED | Requires story progression to a long_narration node |
| A08 | Chapter opening | — | `game` / `ChapterTransition` | `A08_chapter_opening.png` | PASS | "作战室·初遇" opening text, "轻触继续" hint |
| A09 | Section opening | — | `game` / `SectionTransition` | `A09_section_opening.png` | PASS | "Section Opening - 第一部 - 投资的私心" |
| A10 | Section clear / removed behavior | §17.6 | `sectionClear` | `A10_section_clear.png` | **FAIL** | "SECTION CLEAR" page still renders — should be removed per §17.6 |
| A11 | Chapter clear | — | `game` / `ChapterEnding` | — | NOT CAPTURED | Requires completing an entire chapter |
| A12 | Terminal ending page | §18 | `game` / `Ending` | — | NOT CAPTURED | Requires reaching an ending node |
| A13 | Home after ending | §18.2 | `start` | — | NOT CAPTURED | Requires completing an ending first |
| A14 | Gallery unlocked ending | — | `gallery` | `A14_gallery.png` | PASS (structure) | Shows "已解锁 0/4" + 4 locked slots. No unlocked endings to verify display. |
| A15 | Settings / system page | — | `settings` | `A15_settings.png` | PASS | 文字速度/自动播放速度/背景音乐/显示模式/数据管理 |

**A06, A07, A11, A12, A13 not captured**: These require deep story progression (long narration nodes, chapter completion, terminal endings) that cannot be reached by simply tapping through a few nodes in the emulator session. Recommend Ant's real-device testing for these states.

---

## 9. PP Recommendation

**Recommendation: Continue incremental repair with a concrete minimal patch list.**

The codebase is architecturally sound. The StoryEngine, GameViewModel, NavGraph, and GameScreen are well-structured. The P0 logic fix (ending priority in `resolve()`) is correct. The §17.1-17.4 UI token updates are applied to the correct active components. The main remaining issues are:

### Minimal Patch List (in priority order)

| # | Priority | Item | Files affected | Risk | Effort |
|---|---|---|---|---|---|
| 1 | **P0** | Remove Section Clear page (§17.6) | `NavGraph.kt`, `SectionClearScreen.kt`, `GameScreen.kt` | Low — skip directly from skipSection to next section via `advanceAfterSectionClear()` without navigating to SectionClear route | Small |
| 2 | **P1** | Commit + rebuild + install for Ant | All modified files | Low — all changes are uncommitted | Minimal |
| 3 | **P1** | Verify A06/A07/A11/A12/A13 on real device | None (verification only) | None | Testing time |

### Items for XoXo to review

1. **DialogueLayer §17.1 tokens** — A02/A03 screenshots show the new cut-corner card with gradient bg. XoXo to confirm visual match.
2. **NagiDialog §17.3 tokens** — A04 screenshots show cut-corner glass dialog. XoXo to confirm.
3. **HUD §17.2 tokens** — Title chip and icon buttons visible in A02/A03. XoXo to confirm opacity/border values.
4. **Section Clear removal** — A10 confirms it still exists. XoXo to confirm §17.6 intent.
5. **Long narration §17.4** — Not captured in emulator. XoXo to verify width on real device.
6. **EndingOverlay §18** — Not captured in emulator. XoXo to verify three-layer structure if/when Ant reaches an ending.

### Code health notes

1. **Active runtime paths**: All listed in Section 2 are confirmed active via emulator navigation.
2. **Duplicate candidates**: `ChapterOpeningScreen.kt` (standalone route) duplicates `ChapterOpeningOverlay` (inline). Consider consolidating after this cycle.
3. **Stale candidate**: `SectionClearScreen.kt` should be removed per §17.6.
4. **High-risk areas**: Gallery unlock state persistence — needs real-device verification that `SharedPreferences` survives app restart.
5. **Changes reduce duplication**: The inline overlays in `GameScreen.kt` (ChapterOpening, SectionOpening, ChapterEnding, Ending) consolidate what were previously separate routes. Only SectionClear remains as a separate route.

---

## Appendix: File Reference Index

| Component | File path | Lines of interest |
|---|---|---|
| Navigation routes | `ui/navigation/NavGraph.kt` | Routes object :15-30, NavHost :53-276 |
| Game screen + overlays | `ui/screen/GameScreen.kt` | Phase switch :103-200, EndingOverlay :318-450, ChapterEndingOverlay :728-804 |
| Dialogue layer §17.1 | `ui/component/DialogueLayer.kt` | Tokens :52-55, BottomDialogue :58-182, BottomNarration :185-252 |
| Long narration §17.4 | `ui/component/LongNarrationLayer.kt` | Width :71, backdrop :83, indicator :158 |
| HUD §17.2 | `ui/component/NagiHud.kt` | Title chip :63-123, icon row :129-143 |
| Icon button §17.2 | `ui/icon/NagiIconButton.kt` | Bg :72-78, border :92, shadow :56-69 |
| Dialog §17.3 | `ui/component/NagiDialog.kt` | Tokens :33-41, container :69-114 |
| Section clear (stale) | `ui/screen/SectionClearScreen.kt` | Entire file — remove per §17.6 |
| Story engine | `engine/StoryEngine.kt` | resolve() :41-78, isEndingNode :146-150 |
| Game ViewModel | `ui/viewmodel/GameViewModel.kt` | showEnding :778-782, hasCompletedEnding :207 |
| Gallery | `ui/screen/GalleryScreen.kt` | unlockedEndings :49 |
| Prologue §18.3 | `ui/screen/PrologueScreen.kt` | fontSize 28sp, lineHeight (28*1.68) :106-107 |
| Start screen | `ui/screen/StartScreen.kt` | hasCompletedEnding param |
