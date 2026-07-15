# PM PRD / Script Audit - 2026-07-11

> Owner: PM Yiyi  
> Status: Draft for Ant confirmation before task assignment  
> Scope: PRD, interaction spec, story-data script structure, and current Android implementation deltas.

## 1. PM Verdict

Current implementation is not yet aligned with the full-product visual novel experience. The issue is not only visual polish. Several core interaction rules were either missing from PRD as hard acceptance criteria, described too softly, or implemented against an older interpretation.

The current build can run a vertical slice, but it still fails the intended product feel in these areas:

- First-time / returning-player flow is ambiguous.
- Continue Story is tied to the wrong save concept.
- Long narration is broken into too many tap-by-tap bottom lines.
- Player-facing dialogue is being wrapped in quotation marks by code.
- Auto-advance transitions can leak as a visible "->" choice.
- HUD currently exposes Menu where the latest PM rule needs direct Story Recap.
- Manual save, default progress, and homepage save list need separate definitions.
- Chapter start and chapter end pages are not mandatory enough in the existing spec.

## 2. Binding Product Rules To Confirm

### 2.1 Entry Flow

First-time entry only:

```text
Splash / opening screen -> Prologue page -> Name setup page -> Chapter 1 page 1 story
```

Returning app entry:

```text
Splash / opening screen -> Home
```

Rules:

- Continue Story is shown only when a default last-exit progress exists.
- If the user has never played, Continue Story is hidden.
- Continue Story loads the default last-exit progress, not a manual save slot.
- New Story resets the default last-exit progress and starts from Chapter 1 page 1.
- New Story should not delete manual save slots unless the user explicitly chooses a destructive reset flow.
- Homepage label "存档" should become "存档进度".

### 2.2 Save Model

There are two separate save concepts:

- Default progress: automatically maintained for Continue Story and updated on exit / important progress boundaries.
- Manual save: user-triggered save from the HUD Save button and visible in the homepage save progress list.

HUD Save must:

- Save the current node / line / variables / player name / Nagi call / route flags.
- Show a clear "存档成功" prompt after saving.
- Make the saved record visible from Home -> 存档进度.

### 2.3 Game HUD

Latest required HUD layout:

```text
Left: Back
Center: Current chapter title
Right: Auto / Stop, Save, Story Recap
```

Rules:

- Auto toggles between Auto Play and Stop.
- Save writes a manual save and prompts success.
- Story Recap opens the current chapter backlog from chapter start to current sentence.
- No additional Menu remains in the story HUD; the far-right action is Story Recap.

### 2.4 Dialogue And Narration Display

Rules:

- Dialogue text must not be automatically wrapped in quotation marks.
- Script text is the final player-facing copy. If punctuation is needed, it belongs in the script itself.
- Short dialogue / short narration can use the bottom dialogue area.
- Long narration, long monologue, exposition, and consecutive narration blocks must use full-page / full-screen display to reduce tap count.
- Consecutive narrator lines should be grouped when they belong to the same beat.
- A player should not need to tap through a long descriptive paragraph one small sentence at a time.

### 2.5 Choices And Auto Advance

Rules:

- "->" must never be rendered as a player-facing option.
- Single auto-advance transitions should be handled by engine logic, not displayed as a choice card.
- Choice labels must be meaningful player decisions or intentionally written response options.
- Template variables such as `{{nagiCall}}` must be resolved before display in dialogue, choices, responses, backlog, and save summaries.

### 2.6 Chapter Start / End Pages

Rules:

- Every chapter must have a chapter start page.
- Every chapter must have a chapter end page.
- Start pages introduce the chapter title / emotional stage / optional subtitle.
- End pages close the chapter and offer a clean continuation or save moment.
- These are required flow pages, not optional visual polish.

## 3. PRD Gap Audit

The existing PRD and interaction design already mention related concepts such as Prologue, name setup, Backlog, save/load, bottom narration, full-screen narration, and chapter transitions.

The gap is that the documents do not yet make the latest behavior binding enough:

- Continue Story is not clearly defined as default last-exit progress.
- First-time entry vs returning entry is not strict enough.
- New Story reset behavior is not separated from manual saves.
- Save button success feedback and homepage save progress list are not explicit enough.
- HUD right-side actions still contain older Menu / Skip / Backlog ambiguity.
- Full-screen narration exists as a component but not as a mandatory script-display rule.
- Chapter start/end pages exist as design ideas but are not required for every chapter.
- Auto-advance data is allowed to leak as visible "->" choices unless explicitly forbidden.

## 4. Script / Data Findings

Story data currently contains many `autoAdvance: true` transitions. These are acceptable as internal routing metadata, but the player-facing label must not render as "->".

Story data also still contains many `{{nagiCall}}` references. This means the name setup and replacement pipeline must support Nagi's call-name field before the current script can be considered display-safe.

Read-only scan of the current `story-data/nodes.json`:

- 1,668 dialogue lines total.
- 762 narrator-only lines.
- 306 preliminary consecutive narrator runs when character dialogue is treated as the boundary.
- Only 11 lines are explicitly marked `fullscreen`.
- About 130 runs are long-narration review candidates under the editor pre-check of three or more paragraphs or about 90 accumulated Chinese characters.
- The largest run is 16 paragraphs / about 770 characters and requires multi-page reading.

The 130 candidates are an editorial review queue, not an automatic final classification. Scene/time changes, narrative beats, explicit overrides, and measured layout remain authoritative.

The current `DialogueLine` model (`id`, `speaker`, `text`, `display`) cannot fully represent the locked behavior. The script contract needs fields or equivalent structured metadata for display mode, narration block identity, force-merge / force-break, paragraph boundaries, optional editorial page breaks, and chapter start/end page data.

The script/data pass should mark:

- Long narration blocks as full-screen / full-page.
- Consecutive narrator lines as grouped beats where appropriate.
- Auto-advance-only transitions as hidden transitions, not choices.
- Chapter start and chapter end pages as explicit nodes.

## 5. Implementation Deltas Observed

Current Android files show these mismatches:

- `DialogueLayer.kt` currently wraps spoken dialogue in quotation marks through code.
- `ChoiceLayer.kt` renders choice labels directly, so a "->" label can appear to the player.
- `NagiHud.kt` currently uses Auto + Save + Menu, while the latest rule needs Auto / Stop + Save + Story Recap.
- `GameViewModel.kt` has auto-save / manual save functions, but QA still reported persistence / Continue Story issues, so the behavior needs implementation verification.
- `NavGraph.kt` has Continue routing, but product rules now require Continue to depend on default last-exit progress only.

## 6. Proposed Acceptance Checklist

Before yiyi/Laud task assignment, confirm these acceptance criteria:

- Fresh install: Splash -> Prologue -> Name setup -> Chapter 1 page 1.
- Returning launch after any progress: Splash -> Home.
- Fresh install Home has no Continue Story button.
- Continue Story appears only after default progress exists.
- Continue Story restores the exact previous node / line / variables.
- New Story resets default progress and starts Chapter 1 page 1.
- HUD shows Back / chapter title / Auto-Stop / Save / Story Recap.
- Save prompts "存档成功" and creates a homepage save progress record.
- Story Recap shows current chapter content up to current sentence.
- No spoken dialogue is auto-wrapped in quotation marks.
- Long narration appears as full-page/full-screen grouped reading, not many bottom taps.
- No visible "->" option appears.
- `{{playerName}}` and `{{nagiCall}}` never appear raw.
- Every chapter has start and end pages.

## 7. Confirmed Narration And Chapter Display Rules

Ant confirmed all five product decisions on 2026-07-11.

- A consecutive narration block is a run of narrator-only nodes in the same scene, time, and narrative beat. Dialogue, choices, scene/time changes, chapter boundaries, or explicit pause markers end the block.
- One or two paragraphs that fit within four rendered lines of the bottom narration panel use short narration.
- Three or more consecutive paragraphs, any block that exceeds four rendered bottom-panel lines, or any script-forced exposition/emotional block uses long narration.
- About 90 Chinese full-width characters is an editor warning threshold only. Actual rendered line fit is authoritative.
- Long narration uses a full-page frosted reading layer and never scrolls.
- Runtime pagination uses measured text height. The editorial target is about 180-240 Chinese full-width characters per page, but this is not a hard runtime limit.
- Pagination preserves complete paragraphs first, then splits an oversized paragraph at sentence-ending punctuation. It avoids orphan headings and one-line trailing fragments.
- Each page appears as one reading unit. The player taps once per page, not once per paragraph.
- Non-final pages show a page-turn cue plus current/total page count. The final page shows a continue-story cue.
- Character dialogue, short narration, and long narration require distinct containers and typography semantics.
- Every chapter requires an independent full-screen start page and end page. The HUD is hidden on both.
- Chapter start requires chapter order, title, and a tap-to-start prompt.
- Chapter end requires completion state, chapter order/title, completion copy, and a context-valid primary action. Chapter directory and unlock summaries are conditional.

Exact font families, sizes, blur strength, colors, and final composition remain subject to Ant visual confirmation.

## 8. PM Recommendation

Do not assign scattered visual tweaks yet. First confirm the rules above, then split work into:

- PRD / interaction lock.
- Script-data cleanup.
- yiyi implementation fixes.
- Laud regression checklist.

After Ant confirms the added visual baseline, PM Yiyi will produce the task briefs for yiyi, XoXo, script cleanup, and Laud.
