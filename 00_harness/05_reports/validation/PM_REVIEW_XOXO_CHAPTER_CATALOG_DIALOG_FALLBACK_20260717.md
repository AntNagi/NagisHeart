# PM Review - XoXo TASK-20260717-016 Chapter Catalog + Dialog Fallback

Date: 2026-07-17  
Reviewer: PM 一一  
Task: TASK-20260717-016  
Status: passed for implementation

## Verdict

XoXo `TASK-20260717-016` passes PM review and is ready to become implementation authority for yiyi / Wewe when Claude token is available again.

The task solved the intended design-side debt:

1. Chapter Catalog is no longer pending.
2. Dialog Android no-real-blur fallback now has a bounded, implementable token range.
3. Authority files were synced to `00_harness/08_authority_current/04_ui/`.
4. PM has also synced the related interaction authority into `00_harness/08_authority_current/02_interaction/`.

## Checked Sources

- `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_chapter_catalog_dialog_fallback_20260717.md`
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 16
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md` section 30
- `00_harness/01_governance/decision_log.md` `DEC-20260717-017` and `DEC-20260717-018`

## Acceptance Notes

### Chapter Catalog

Accepted.

- `screen-chapter-catalog` exists in the authority HTML.
- The old “章节目录 pending / 本版不拍板” wording has been removed from authority HTML.
- MinSpec section 16 defines a system-level dark glass catalog page.
- Scope is intentionally limited to current / unlocked / completed / locked states and bottom actions.
- It does not expand into achievements, CG gallery, rating, or route graph.

### Dialog Android fallback

Accepted.

Section 16.5 now gives a bounded fallback:

- card base `rgba(27,36,54,0.56)`;
- card allowed 0.52 ~ 0.60, with absolute no-go above 0.64;
- scrim `rgba(9,14,24,0.38)`;
- scrim allowed 0.34 ~ 0.42;
- border `rgba(255,255,255,0.14)`;
- shadow `0 18dp 42dp rgba(0,0,0,0.36)`;
- text shadow allowed, but no blur on text/buttons themselves.

This directly resolves the previous 32% too weak / 80% too heavy oscillation.

### Interaction authority

Accepted.

PM has updated both source and authority-current interaction docs:

- `design/NagisHeart_Interaction_Design_v1_0.md`
- `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`

Section 30 now locks:

- story recap as paged left/right swipe, not vertical scroll;
- no visible previous/next text buttons;
- skip-section lands on current section clear;
- chapter catalog interaction state boundaries;
- autoAdvance / arrow / blank options filtered from player-visible choices;
- dark readability strategy and authority-first rule.

## Implementation Notes For yiyi / Wewe

When implementation resumes, read these together:

1. Interaction: `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md` section 30
2. UI: `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 16

Do not implement from screenshots or old handoff files.

## Remaining Validation

- Android / Web implementation still needs build and real-device confirmation.
- Chapter Catalog visual pass still needs Ant real-device check after implementation.
- Dialog fallback still needs real-device confirmation on bright and dark backgrounds.

