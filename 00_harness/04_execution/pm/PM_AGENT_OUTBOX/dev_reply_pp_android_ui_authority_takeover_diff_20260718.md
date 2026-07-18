# Dev Reply - PP Android UI Authority Takeover Diff Report

Date: 2026-07-18
Developer: PP (Android UI)
Task: `TASK-20260718-009` Phase 1 read-only diff
Authority read: all 12 mandatory files per bootstrap order

---

## 0. Files read

1. `README_AI.md`
2. `TASKS.md`
3. `PROJECT_STRUCTURE.md`
4. `00_harness/03_handoffs/latest_status_snapshot.md`
5. `00_harness/02_planning/task_board.md`
6. `00_harness/01_governance/decision_log.md`
7. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` (sections 1-16)
8. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html` (structure reviewed)
9. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`
10. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md` (section 30)
11. `00_harness/05_reports/validation/PM_REVIEW_ANDROID_UI_REAL_DEVICE_REJECT_20260718.md`
12. `00_harness/05_reports/validation/PM_REVIEW_ANDROID_UI_REAL_DEVICE_FAIL_YIYI_004_20260718.md`

Android files audited (full read with all token values extracted):

- `NagiIconButton.kt`
- `NagiHud.kt`
- `NagiDialog.kt`
- `DialogueLayer.kt`
- `BacklogScreen.kt`
- `GameScreen.kt` (includes inline ChapterOpeningOverlay, SectionOpeningOverlay, ChapterEndingOverlay, GlassBacking, ClearCard, KickerLabel)
- `ChapterScreen.kt` (chapter catalog)
- `ChapterOpeningScreen.kt` (standalone)
- `SectionOpeningScreen.kt` (standalone)
- `SectionClearScreen.kt`
- `ChapterEndingScreen.kt` (standalone)
- `NagiColors.kt`, `NagiTypography.kt`, `NagiShapes.kt`, `NagiSpacing.kt`, `NagiMotion.kt`, `NagiTheme.kt`
- `SystemPageBackground.kt`, `LongNarrationLayer.kt`, `ChoiceLayer.kt`

---

## 1. Diff table: each failing UI area

### 1.1 HUD Icon Buttons (NagiIconButton.kt)

| Item | Authority (MinSpec §15.1) | Current Android | Match | Issue |
|---|---|---|---|---|
| Container size | 36×36 | 36.dp | ✓ | |
| Icon size | 18×18 | 18.dp | ✓ | |
| Background gradient | `rgba(15,24,39,0.30)` → `rgba(15,24,39,0.18)` vertical | `Color(0x4D0F1827)` → `Color(0x2E0F1827)` (30%→18%) | ✓ | |
| Center radial highlight | `rgba(247,249,252,0.08)` radial | Missing | ✗ | Not implemented |
| Border | `rgba(255,255,255,0.10)`, 1dp | `Color(0x1AFFFFFF)`, 1.dp (10%) | ✓ | |
| Shape | cut-sm | `NagiShapes.cutSmall` (8dp) | ✓ | |
| Icon color | `rgba(247,249,252,0.94)` | `colors.hudColor.copy(alpha=0.94f)` → snowWhite 82% × 0.94 ≈ 77% | ✗ | hudColor is already 82% alpha; multiplying by 0.94 gives ~77%, authority wants 94% of full white |
| Container shadow | `dropShadow 0 3dp 12dp rgba(0,0,0,0.42)` (CSS-style soft spread) | Compose `shadow(elevation=2.dp, ambientColor=0x6B000000, spotColor=0x6B000000)` | ✗ | **ROOT CAUSE of "heavy button" reject.** Compose elevation shadow creates a hard, thick outline around the cut-corner shape instead of a soft, distant drop shadow. 2dp elevation with 42% ambient/spot looks like a thick dark border. |
| Icon shadow/halo | dark `0 1dp 2dp rgba(0,0,0,0.64)` + light halo `0 0 8dp rgba(247,249,252,0.20)` | Not implemented | ✗ | Compose `Icon()` composable does not support text-style shadows. yiyi noted this limitation. |
| Blur | 12dp | Not implemented (fallback acceptable) | — | Authority allows fallback |

**Root cause summary:** The Compose `shadow(elevation=...)` API produces a hard-edged, close shadow around CutCornerShape that reads as a thick dark border/stroke. Combined with the cut-corner shape, this makes the button look like a heavy octagonal button instead of a floating glass chip. The fix is to replace the elevation shadow with a custom `drawBehind` soft blur shadow or a much softer elevation.

---

### 1.2 Title Chip (NagiHud.kt)

| Item | Authority (MinSpec §14.4/15.1) | Current Android | Match |
|---|---|---|---|
| Height | 34 | 34.dp | ✓ |
| Max width | ~210dp | 210.dp | ✓ |
| Background | `rgba(15,24,39,0.22)` → `rgba(15,24,39,0.08)` | `Color(0x380F1827)` → `Color(0x140F1827)` (22%→8%) | ✓ |
| Border | `rgba(255,255,255,0.10)`, 1dp | `Color(0x1AFFFFFF)`, 1.dp | ✓ |
| Padding | 14-18 | 16.dp | ✓ |
| Font | Noto Sans SC Medium, 13sp, 0.02em | Default Medium, 13.sp, 0.02.sp | ✓ |
| Color | `rgba(244,241,234,0.88)` | `Color(0xE0F4F1EA)` (87.5%) | ✓ |

**Result: Title chip matches authority. No changes needed.**

---

### 1.3 Action Chip / Skip-Section Chip (GameScreen.kt)

| Item | Authority (MinSpec §14.4/15.1) | Current Android | Match |
|---|---|---|---|
| Height | 34 | 34.dp | ✓ |
| Padding | 14-16 | 15.dp | ✓ |
| Font | Noto Sans SC Medium, 12-13sp | Default Medium, 12.sp, 0.02.sp | ✓ |
| Background/border | same as title chip | same gradient/border | ✓ |
| Color | `rgba(244,241,234,0.90)` | `Color(0xE6F4F1EA)` (90%) | ✓ |
| Position | right-aligned, HUD下方14-18dp | top=62.dp from status bar, end=12.dp | ✓ |

**Result: Action chip matches authority. No changes needed.**

---

### 1.4 NagiDialog (NagiDialog.kt)

| Item | Authority (MinSpec §16.5 no-blur fallback) | Current Android | Match | Issue |
|---|---|---|---|---|
| Card bg | `rgba(27,36,54,0.56)` | `Color(0x8F1B2436)` (56%) | ✓ | |
| Scrim | `rgba(9,14,24,0.38)` | `Color(0x61090E18)` (38%) | ✓ | |
| Border | `rgba(255,255,255,0.14)`, 1dp | `Color(0x24FFFFFF)` (14%), 1.dp | ✓ | |
| Inner highlight | top `rgba(255,255,255,0.06)` gradient | `0x0FFFFFFF` (6%) → transparent | ✓ | |
| Shadow | `0 18dp 42dp rgba(0,0,0,0.36)` (CSS soft spread) | Compose `shadow(elevation=18.dp, ambientColor=0x5C000000, spotColor=0x5C000000)` | ✗ | **Same problem as icon button.** Compose elevation shadow with 18dp and RoundedCornerShape(24dp) produces a visually heavy, concentrated shadow very different from CSS `box-shadow 0 18px 42px`. The shadow spreads close to the card edge and darkens the entire surround, making the dialog look like a thick dark panel instead of a floating glass card. |
| Text shadow | `0 1dp 2dp rgba(0,0,0,0.35)` | `Color(0x59000000)` (35%), offset(0,1), blur 2f | ✓ | |
| Radius | 24dp | RoundedCornerShape(24.dp) | ✓ | |
| Width | 80% | fillMaxWidth(0.80f) | ✓ | |
| Padding | L/R 40, T 32, B 28 | 40/40/32/28 | ✓ | |
| Title | Serif, 28sp, `#F4F1EA` | Serif, 28sp, `#F4F1EA` | ✓ | |
| Body | 16sp, lineHeight 28sp, 82% alpha | 16sp, 28sp, `0xD1F4F1EA` (82%) | ✓ | |
| Dismiss | `#D6D2CB` | `#D6D2CB` | ✓ | |
| Confirm | `#F4F1EA` | `#F4F1EA` | ✓ | |
| Button spacing | 26dp | 26.dp | ✓ | |

**Root cause summary:** All token values match the authority. The visual heaviness reported by Ant comes from two factors:

1. **Compose elevation shadow rendering** is fundamentally different from CSS `box-shadow`. CSS `0 18px 42px rgba(0,0,0,0.36)` creates a soft, diffuse glow far from the element edge. Compose `elevation=18.dp` creates a concentrated shadow following the shape outline, which looks like a thick dark border around the card.
2. **No background blur** means the card reads as a flat colored overlay rather than frosted glass. This is a known platform limitation, but the current shadow rendering makes it worse by adding visual weight instead of depth.

**Proposed fix:** Replace `Modifier.shadow(elevation=18.dp, ...)` with a custom `Modifier.drawBehind { }` that paints a soft, diffuse shadow (large blur radius, large Y offset, low alpha) to mimic CSS box-shadow behavior. This will make the dialog float without looking heavy.

---

### 1.5 Chapter Catalog (ChapterScreen.kt) — MAJOR DEVIATION

| Item | Authority (MinSpec §16.2) | Current Android | Match |
|---|---|---|---|
| Layout | `catalog-panel` three-section (title / list / bottom actions) | Timeline + diamond nodes | ✗ |
| Container | gradient `rgba(16,24,39,0.34)` → `rgba(16,24,39,0.52)`, border, blur, cut-md | None — uses full-screen with no panel container | ✗ |
| Title | `章节目录`, Noto Serif SC, **28sp** | `章节目录`, Serif, 27sp | ≈ |
| List items | min-height 68, bg `rgba(255,255,255,0.045)`, border `rgba(255,255,255,0.07)`, cut-sm | Diamond shapes, timeline line, no list item cards | ✗ |
| Current item | gold sweep `rgba(215,190,134,0.18)`, gold border | Diamond color change only | ✗ |
| Status text | 12sp, right-aligned | State label in `micro` style | ≈ |
| Bottom actions | `返回主页` + `继续当前章节`, 14sp, separator line | Not visible | ✗ |
| Description text | 12sp, lineHeight 1.7, `rgba(244,241,234,0.70)` | Not present | ✗ |

**Result: The chapter catalog is an entirely different design.** The current implementation uses a custom timeline with diamond nodes, which is not the authority's `catalog-panel` list design. This screen needs a near-complete rebuild to match section 16.2.

---

### 1.6 Chapter / Section Opening

#### Inline overlays (in GameScreen.kt) — mostly compliant

| Item | Authority (MinSpec §14.1) | Current (inline) | Match | Issue |
|---|---|---|---|---|
| GlassBacking | horizontal gradient 30%→14%→transparent | `Color(0x4D101827)` → `Color(0x24101827)` → transparent | ✓ | |
| Border | `rgba(255,255,255,0.08)`, 1dp | `Color(0x14FFFFFF)` (8%), 1.dp | ✓ | |
| Shape | cut-md | cutMedium (14dp) | ✓ | |
| Padding | L/R 24, T 22, B 20 | 24/24/22/20 | ✓ | |
| Margins | L/R 30 | 30.dp | ✓ | |
| Title | Serif, 29sp, lineHeight 1.24 | Serif, 29sp, 29×1.24 | ✓ | |
| Chapter bottom | 72dp | 72.dp | ✓ | |
| Section bottom | 96dp | 96.dp | ✓ | |
| Center highlight | `rgba(247,249,252,0.09)` | Missing | ✗ | Minor |

#### Standalone SectionOpeningScreen.kt — MAJOR DEVIATION

| Item | Authority | Current Standalone | Match |
|---|---|---|---|
| Background | Story BG with dark overlay | Solid `deepBlueNight` gradient (92%→100%) | ✗ |
| GlassBacking | Required | None — uses plain text on dark bg | ✗ |
| Title color | `rgba(247,249,252,0.94)` | `snowWhite.copy(alpha=0.88f)` | ≈ |
| Layout | Same as chapter opening but lighter | Centered with gold decorative lines, silverBlue text | ✗ |

#### Standalone ChapterOpeningScreen.kt — close but divergent

- Uses PosterPageBackground (story BG + gradient) ✓
- Uses KickerLabel ✓
- Has GlassBacking concept (hint box backing) but different from inline version
- No standard GlassBacking on main text group ✗

**Key question for PM:** Which code path is actually used at runtime? If the app routes through `GameScreen.kt` inline overlays, those are mostly compliant. If it routes through standalone screens, those need significant rework. Need to verify routing in `GameViewModel.kt`.

---

### 1.7 Chapter Clear / Section Clear

#### Inline ClearCard (in GameScreen.kt) — mostly compliant

| Item | Authority (MinSpec §14.2/14.3) | Current | Match |
|---|---|---|---|
| Card gradient | `rgba(27,36,54, 0.20→0.14→0.24)` | `Color(0x33/0x24/0x3D 1B2436)` (20%/14%/24%) | ✓ |
| Border | `rgba(255,255,255,0.08)`, 1dp | `Color(0x14FFFFFF)` (8%), 1.dp | ✓ |
| Shape | cut-md | cutMedium | ✓ |
| Padding | L/R 24, T 28, B 22 | 24/24/28/22 | ✓ |
| Margins | L/R 28, B 82 | start/end 28, bottom 82 | ✓ |
| Label | "CHAPTER CLEAR", 11sp, 0.14em | 11sp, 0.14×11sp | ✓ |
| Title | 30sp, lineHeight 1.25, max 2 lines | 30sp, 30×1.25, maxLines=2 | ✓ |
| Body | 13sp, lineHeight 1.8, 78% alpha | 13sp, 13×1.8, `Color(0xC7F7F9FC)` (78%) | ✓ |
| Actions | 14sp, left dismiss, right confirm | 14sp, dismiss/confirm colors match | ✓ |
| Center micro-light | `rgba(247,249,252,0.10)` | Missing | ✗ |

#### Standalone ChapterEndingScreen.kt — MAJOR DEVIATION

- Uses solid deepBlueNight background with gold diamond ornament, not story BG + ClearCard
- Completely different visual language from authority

#### SectionClearScreen.kt — compliant

- Uses PosterPageBackground + same ClearCard pattern ✓
- Title: 28sp (authority allows降至28sp) ✓

**Key question for PM:** Same routing question — which screen is actually used? If ChapterEndingOverlay (inline in GameScreen) is used, the Clear pages are mostly compliant. If ChapterEndingScreen.kt standalone is used, it's a major deviation.

---

### 1.8 Speaker/Name Gold Readability

| Item | Authority (MinSpec §15.2) | Current (DialogueLayer.kt) | Match |
|---|---|---|---|
| Color | `#E4CA8F` | `Color(0xFFE4CA8F)` | ✓ |
| Font | Noto Sans SC Medium, 13sp, 0.04em, weight 600 | Default, SemiBold, 13sp, 0.04sp | ✓ |
| Backing padding | L/R 9, T 3, B 4 | 9/9/3/4 | ✓ |
| Backing bg | `linear-gradient(to right, rgba(16,24,39,0.30), rgba(16,24,39,0.10))` | horizontal gradient `Color(0x4D101827)` → `Color(0x1A101827)` (30%→10%) | ✓ |
| Backing border | `rgba(215,190,134,0.18)`, 1dp | `Color(0x2ED7BE86)` (18%), 1.dp | ✓ |
| Backing shape | cut-sm | cutSmall | ✓ |
| Text shadow (drop) | `0 1dp 2dp rgba(0,0,0,0.72)` | `Color(0xB8000000)` (72%), offset(0,1), blur 2f | ✓ |
| Text halo | `0 0 10dp rgba(215,190,134,0.20)` | `Color(0x33D7BE86)` (20%), offset(0,0), blur 10f | ✓ |

**BacklogScreen.kt speaker:** Same dual-layer rendering, same token values ✓

**Result: Speaker gold readability matches authority. No changes needed.**

---

## 2. Proposed minimal code files to change

| Priority | File | Scope | Estimated effort |
|---|---|---|---|
| P0 | `NagiIconButton.kt` | Replace Compose elevation shadow with custom soft drawBehind shadow; add center radial highlight; fix icon tint alpha chain | Small (1 file, ~15 lines) |
| P0 | `NagiDialog.kt` | Replace Compose elevation shadow with custom soft drawBehind shadow matching CSS `0 18dp 42dp rgba(0,0,0,0.36)` | Small (1 file, ~10 lines) |
| P0 | `ChapterScreen.kt` | Rebuild chapter catalog from timeline/diamond to `catalog-panel` list per §16.2 | Large (1 file, near full rewrite of UI layout) |
| P1 | `GameScreen.kt` → GlassBacking | Add center radial highlight `rgba(247,249,252,0.09)` | Tiny (3 lines) |
| P1 | `GameScreen.kt` → ClearCard | Add center micro-light `rgba(247,249,252,0.10)` | Tiny (3 lines) |
| P2 | `SectionOpeningScreen.kt` / `ChapterOpeningScreen.kt` / `ChapterEndingScreen.kt` (standalone) | If these are used at runtime, need rework to match inline overlay style. If not used, mark as dead code. | Depends on routing investigation |

**Files explicitly NOT changed:**

- `NagiHud.kt` — title chip matches authority ✓
- `DialogueLayer.kt` — speaker gold matches authority ✓
- `BacklogScreen.kt` — speaker gold matches authority ✓
- `NagiColors.kt` / theme tokens — existing palette supports needed values
- All other screens (Settings, SaveLoad, Home, Prologue, NameSetup, etc.)

---

## 3. Risk list

1. **Compose shadow API limitation:** Compose does not have a direct equivalent of CSS `box-shadow` with separate X/Y offset and blur spread. Custom `drawBehind` shadow requires manual blur paint via `Paint().apply { maskFilter = BlurMaskFilter(...) }` or similar. If Compose canvas API cannot produce soft shadows without RenderEffect, we may need to use a layered semi-transparent gradient as a shadow substitute. Risk: medium. Mitigation: prototype and screenshot before full implementation.

2. **Chapter catalog rebuild scope:** Rebuilding ChapterScreen.kt from timeline to catalog-panel is the largest single change. Risk: data binding for chapter/section states may need adjustment. Mitigation: only change UI layout, reuse existing ViewModel data.

3. **Routing uncertainty for opening/clear screens:** There appear to be both inline overlays (in GameScreen) and standalone screens for chapter opening, section opening, and chapter ending. If routing uses standalone screens in some cases, they need rework. Risk: implementing only inline fixes might leave standalone paths broken. Mitigation: audit GameViewModel routing before Phase 2 starts.

4. **No real blur:** Authority acknowledges this. All current fallbacks are acceptable per §16.5. No additional risk.

---

## 4. Verification plan

After Phase 2 implementation, the following real-device screenshots are needed for Ant大小姐 confirmation:

| Screenshot | What to verify |
|---|---|
| HUD on bright BG | Icon buttons float with soft shadow, not thick octagonal borders |
| HUD on dark BG | Same buttons visible but very light, glass-like |
| Skip-section dialog on game BG | Dialog floats with soft distant shadow, reads as glass card not heavy panel |
| Skip-section dialog on bright BG | Same dialog, visible but light |
| Chapter catalog | catalog-panel with list items, gold current item, bottom actions |
| Chapter opening | GlassBacking with subtle center highlight |
| Section opening | Same glass backing, correct bottom margin |
| Chapter Clear | ClearCard with "CHAPTER CLEAR" label, correct actions |
| Section Clear | Same pattern with "SECTION CLEAR" |
| Speaker name on bright BG | Gold text with backing visible and readable |
| Speaker name on dark BG | Gold text with backing subtle but present |

---

## 5. What will NOT be changed (forbidden scope)

- story-data text
- BG mapping authority
- TT Start resources
- App Icon / launcher V4
- Web (`web/`)
- BGM
- archive files
- unrelated cleanup
- Any file not listed in section 2

---

## 6. Cleanup status

Cleanup status: none. No files to clean up in Phase 1.

No cleanup candidates identified from this audit. Standalone screen files (`ChapterOpeningScreen.kt`, `SectionOpeningScreen.kt`, `ChapterEndingScreen.kt`) may become cleanup candidates after routing investigation, but not until PM decides.

---

## 7. Summary and recommendation

The core problem across HUD icon buttons and NagiDialog is the same: **Compose elevation shadow API produces visually heavy shadows** that don't match CSS `box-shadow` behavior. Token values (colors, alphas, gradients, borders, padding) are largely correct — the issue is shadow rendering, not token values.

The chapter catalog is a separate problem: the current timeline/diamond design does not match the authority's catalog-panel list design and needs a layout rebuild.

Title chip, action chip, and speaker gold readability are already compliant with authority. No changes needed for these.

**Recommended Phase 2 execution order:**

1. Fix NagiIconButton shadow (quick, high visual impact)
2. Fix NagiDialog shadow (quick, high visual impact)
3. Rebuild ChapterScreen.kt catalog (larger, but scoped to one file)
4. Add center highlights to GlassBacking and ClearCard (tiny)
5. Investigate and resolve standalone screen routing (depends on findings)

Awaiting PM approval before any code changes.
