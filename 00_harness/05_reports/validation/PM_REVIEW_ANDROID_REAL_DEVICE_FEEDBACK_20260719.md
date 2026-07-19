# PM Review — Android real-device feedback split

Date: 2026-07-19
Owner: PM 一一
Source: Ant 大小姐 real-device screenshots and feedback.

## Conclusion

This feedback is not a single UI polish task. It is split into:

1. P0 main-flow logic: ending appears unexpectedly, ending resumes story, later chapter freezes, ending not unlocked in gallery.
2. UI authority gap: ending page was not fully designed; global text readability and Android-realizable dialog/HUD fallback need stronger authority wording and previews.
3. Android implementation mismatch: dialog/HUD/backlog behavior still diverge from current authority and must be audited before more code changes.

## P0 logic issues

### L1 Unexpected ending / resumed story / later freeze

Observed:
- NORMAL END appears unexpectedly.
- After dismissing ending, story appears to continue.
- Later around “远处的世界第一” the game can freeze and cannot return.

PM static findings:
- `story-data/flow.json` routes `dream_final`, `stay_final`, and `bad_far` to `ending_resolver`.
- `story-data/routers.json` uses `ending_resolver` fallback `end_normal`.
- Therefore any incorrect path/route/state reaching `ending_resolver` can produce NORMAL END.
- This must be audited as route/state-machine/data, not UI.

Required owner: PP.

### L2 Ending reached but gallery not unlocked

PM static findings:
- `GameViewModel.showEnding()` does call `progressManager.unlockEnding(ending.endingId)`.
- `GalleryScreen` currently reads unlocked endings with `remember { viewModel.getUnlockedEndings() }`, which can cache stale values.
- Gallery keys are hardcoded as `true/good/normal/bad`; PP must verify ending id and persisted set match.

Required owner: PP.

## UI authority issues

### U1 Dialog and HUD still wrong

Observed:
- Dialog still reads as rounded rectangle line frame.
- Navigation/title/icon backing still does not match final UI feeling.

PM static findings:
- This is not a missing drawable resource issue.
- `NagiDialog.kt` / HUD components use Compose shape, border, alpha, and shadow implementations that can visually diverge from the HTML/CSS authority.
- XoXo must tighten Android-realizable tokens and provide visible target previews; PP must then compare code to those exact tokens.

Required owner: XoXo first, then PP.

### U2 Backlog default and clipping

Observed:
- Backlog defaults to last page.
- Single page text is clipped.

PM static findings:
- `BacklogScreen.kt` sets `initialPage = totalPages - 1`; this directly causes the default-last-page behavior.
- Backlog uses a fixed `ENTRIES_PER_PAGE = 8`; with large text, one page can overflow/crop.

Required owner: PP after authority patch.

### U3 Global readability and long narration width

Observed:
- Many text backings are too weak.
- Long narration width is too narrow compared with bottom narration.

Required owner: XoXo to update UI authority, then PP to implement.

### U4 Ending page design missing

Observed:
- Ending page currently exists but lacks final PRD/UI design.

Required owner: XoXo + PM authority patch. Ant confirmation required before PP implementation.

## Authority updates made by PM

Updated:
- `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
- `design/NagisHeart_Interaction_Design_v1_0.md`
- `00_harness/08_authority_current/01_product/NagisHeart_PRD_v2_0.md`
- `design/NagisHeart_PRD_v2_0.md`

New override rules:
- Backlog defaults to first page.
- Backlog must dynamically paginate by visible capacity, not fixed 8 entries if text clips.
- Normal flow removes standalone Section Clear / small-section ending pages.
- Skip section now lands on next section opening, chapter ending, or ending flow depending on position.
- Ending is terminal and must unlock gallery immediately.
- Ending page UI must be designed and confirmed before implementation.

## Dispatch plan

1. `TASK-20260719-001` — XoXo: UI authority patch for global readability, HUD/dialog exact Android fallback, long narration width, ending page design. No dev implementation. Must return previews for Ant confirmation.
2. `TASK-20260719-002` — PP: P0 Android main-flow logic and implementation root-cause audit. Read-only first. Must identify whether each issue is data, design, or code.

Cleanup status: none.
