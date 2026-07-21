# TASK_TO_XOXO_20260719_ANDROID_IMPLEMENTATION_MAPPING_UI_REVIEW

- Task ID: `TASK-20260719-012`
- Owner: XoXo (UI)
- Priority: P0
- Type: UI authority review of Android implementation mapping
- Status: waiting_pp_report

## Dependency

Wait for PP to complete:

`00_harness/05_reports/validation/ANDROID_CODE_DESIGN_MAPPING_PP_20260719.md`

Do not start before PP's mapping exists.

## Purpose

Ant reports Android UI still does not match authority after multiple implementation passes. PM suspects the team has an implementation-authority alignment failure: developers may be changing stale paths, wrong active components, or using token values that do not visually reproduce the confirmed UI.

XoXo must review PP's mapping from a UI authority perspective.

## Required read

1. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
2. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
3. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`
4. `00_harness/08_authority_current/05_implementation/Android_Code_Design_Mapping_REQUIRED_20260719.md`
5. `00_harness/05_reports/validation/ANDROID_CODE_DESIGN_MAPPING_PP_20260719.md` once PP writes it.

## Review scope

Review UI mapping only:

- HUD/nav/action chip.
- Dialog.
- Dialogue/speaker/readability tokens.
- Long narration width/readability.
- Backlog visual and paging readability.
- Chapter catalog.
- Opening / clear pages.
- Terminal ending page.
- Home after-ending state copy if visually represented.

## Required output

Write:

`00_harness/05_reports/validation/XOXO_REVIEW_ANDROID_IMPLEMENTATION_MAPPING_20260719.md`

## Required answers

1. Does PP identify the correct active Android component for each UI authority section?
2. Are the mapped Compose tokens sufficient to reproduce the confirmed UI authority under Android no-real-blur limitations?
3. Which mismatches are implementation bugs vs design ambiguity?
4. Are any required UI resources missing?
5. Which Android UI areas should be patched incrementally?
6. Which areas are too structurally wrong and should be refactored/rebuilt?

## Forbidden

- Do not modify Android code.
- Do not modify story-data / BG mapping.
- Do not delete resources.
- Do not change already-confirmed UI authority unless PM asks.

## Done definition

XoXo review is complete only when PM can hand PP a concrete, bounded implementation correction list with no ambiguity about active components and UI tokens.

## Addendum - screenshot evidence review

XoXo must not review PP's mapping as text only.

Wait for:

- `00_harness/05_reports/validation/ANDROID_CODE_DESIGN_MAPPING_PP_20260719.md`
- `00_harness/05_reports/validation/android_code_design_mapping_pp_20260719_screens/`

XoXo must compare PP's runtime screenshots against the authority HTML / MinSpec and explicitly answer:

1. Do the screenshots match the claimed active Android components?
2. Do the screenshots visually match UI authority closely enough under Android no-real-blur limitations?
3. Which screenshots prove implementation divergence?
4. Which mismatches are code bugs vs UI authority gaps?

No screenshot review = not complete.
