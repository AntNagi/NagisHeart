# PM Review - XoXo Android Readability / Ending UI Authority Candidate

- Date: 2026-07-19
- Reviewer: PM 一一
- Source worker: XoXo
- Reviewed task: `TASK-20260719-001`
- XoXo status file: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_android_readability_ending_ui_authority_20260719.md`
- Review status: partially accepted for development use, partially pending Ant confirmation

## PM conclusion

XoXo's authority candidate has been synchronized to `08_authority_current` and is materially usable. It is not just visual direction; it now includes developer-readable tokens, Android no-real-blur fallback values, forbidden styles, and PP implementation alignment checklist.

However, PM will not send the whole section 17 package to development as one large implementation task. To prevent scope drift, PM splits the result:

1. **Approved for immediate Android minimal fix**
   - Section 17.2 HUD / nav / action chip token.
   - Section 17.3 Dialog Android fallback token.
   - These two directly address Ant's repeated complaint and match PM root-cause investigation.

2. **Held for Ant confirmation before full implementation**
   - Section 17.1 global text-over-image backing.
   - Section 17.4 long narration width.
   - Section 17.5 terminal ending page.
   - Section 17.6 removal of standalone Section Clear from current product flow.

This split is intentional. It lets PP first prove the root-cause theory on Dialog and HUD/Nav without mixing in ending logic, gallery unlock, long narration, or section-flow changes.

## Files checked

- `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_android_readability_ending_ui_authority_20260719.md`
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`

## Verified authority sync

PM verified that:

- MinSpec section 17 exists in `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`.
- Section 17.2 contains explicit HUD/nav/action chip tokens:
  - icon button 36dp / icon 18dp / cut-sm;
  - background 0.34 -> 0.22;
  - border 0.12;
  - shadow and icon halo;
  - title and action chip must be the same glass family.
- Section 17.3 explicitly overrides the old section 16.5 dialog risk:
  - not rounded rectangle line-frame;
  - cut-md / `CutCornerShape(14dp)`;
  - card 0.56 -> 0.52;
  - border 0.08;
  - inner highlight;
  - soft shadow.
- Merge record section 12 records the same 2026-07-19 authority update.

## PM accepted items for immediate PP task

These are now accepted as implementation authority for `TASK-20260719-007`:

### A. HUD / nav / action chip

Accepted authority:

- `XoXo_UI_Final_MinSpec_20260712.md` section 17.2
- `NagisHeart_UI_Authority_Merge_Record_20260715.md` section 12

Implementation scope:

- `NagiHud.kt`
- `NagiIconButton.kt`
- `GameScreen.kt` skip/action chip
- Header consistency audit for Backlog / Chapter / Settings / Save / Gallery

PM note:

PP must prove active-path alignment, because current Android code does not use one shared nav/header implementation everywhere.

### B. Dialog

Accepted authority:

- `XoXo_UI_Final_MinSpec_20260712.md` section 17.3
- `NagisHeart_UI_Authority_Merge_Record_20260715.md` section 12

Implementation scope:

- `NagiDialog.kt`

PM note:

Current Android code still uses old rounded 24dp / 14% border style, so this is a concrete implementation mismatch, not an ambiguous design issue.

## Items pending Ant confirmation

These remain review authority candidate, not yet final dev authority:

1. Terminal ending page structure and actions.
2. TRUE / GOOD / NORMAL / BAD ending visual mood.
3. Global text-over-image backing strength across all screens.
4. Long narration width alignment.
5. Removing standalone Section Clear from runtime flow.

Reason:

These changes affect broader product flow, ending presentation, and reading rhythm. They should be shown to Ant as design/flow decisions before implementation.

## Risk notes

1. Existing section 14 and section 16 still mention Section Clear as a usable UI concept, but section 17.6 supersedes it for current product scope. Developers must be directed to section 17 to avoid reading old section 14/16 in isolation.
2. Current Android code uses active paths that do not all map cleanly to one authority component. PP must report duplicate / stale path risk if found.
3. If Ant's real-device build still shows old UI after implementation, the first checks must be stale APK, wrong build variant, wrong package installed, or inactive component path.

## PM decision

- `TASK-20260719-001` remains `review`, not `done`, because Ant has not confirmed the broader ending / long narration / section-flow design.
- Sections 17.2 and 17.3 are accepted for the narrow Android minimal fix task `TASK-20260719-007`.
- PP must not implement the rest of section 17 in `TASK-20260719-007`.

## Cleanup status

Cleanup status: none.

No files or resources should be deleted based on this review. This is authority review and task scoping only.

