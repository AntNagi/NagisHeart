# PM Review - XoXo Ending Page Authority Revision

- Date: 2026-07-19
- Reviewer: PM 一一
- Source worker: XoXo
- Reviewed task: `TASK-20260719-008`
- XoXo status file: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_ending_page_authority_revision_20260719.md`
- Review status: passed for visible authority cleanup / pending Ant visual confirmation

## PM conclusion

XoXo addressed the three requested areas:

1. Ending page visible action model revised.
2. Prologue typography reduced by one step.
3. Visible phone mock copy hygiene improved.

This review does not authorize Android implementation of broader ending logic yet. It confirms that the UI authority preview is now cleaner and that section 18 is the current authority for ending page behavior.

## Verification

PM checked the authority HTML and MinSpec:

- `candidate` and `terminal page candidate` no longer appear in visible ending page text.
- Ending page now contains one visible action: `返回主页`.
- Removed ending page visible actions:
  - `回忆画廊`
  - `重看本结局`
  - `相关章节`
- Chapter catalog visible PM/dev explanatory line was removed from phone mock.
- Prologue typography token is documented in MinSpec section 18.3:
  - previous preview token: 31px / line-height 1.6
  - revised token: 28px / line-height 1.68
- Section 18.2 defines Home after-ending primary CTA as `新的故事`, and forbids `继续故事` for the completed-run home state.

## PM caveat

MinSpec section 17.5 still exists as historical context and contains the older four-action candidate model. To prevent accidental implementation from old search results, PM added a note at section 17.5:

- section 17.5 is superseded by section 18.1;
- do not implement the four-action model;
- current implementation authority is section 18.

Developers must use section 18 for ending page / after-ending Home state.

## Remaining Ant confirmation

Ant still needs to visually confirm:

1. Whether the ending page layout with only `返回主页` is visually acceptable.
2. Whether the prologue body at 28px / 1.68 line-height feels right.
3. Whether chapter catalog now contains only player-facing copy.

## Cleanup status

Cleanup status: none.

No resource deletion. No Android/Web/story-data/BG mapping changes.

