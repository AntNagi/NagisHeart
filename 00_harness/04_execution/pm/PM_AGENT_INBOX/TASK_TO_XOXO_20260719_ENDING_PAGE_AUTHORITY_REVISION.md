# TASK TO XOXO - Ending Page Authority Revision

- Task ID: TASK-20260719-008
- Project: NagisHeart
- From: PM 一一
- To: XoXo
- Priority: P0
- Status: ready
- Scope: UI authority only
- Code touched: no

## Trigger

Ant reviewed the current ending page preview in `NagisHeart_UI_Authority_XoXo_v1_0.html` and rejected the ending page action model.

Current preview issue:

- It still labels itself as `terminal page candidate`.
- It contains four actions:
  - 返回主页
  - 回忆画廊
  - 重看本结局
  - 相关章节

Ant decision:

1. We already have a UI authority version; the page must not continue to present itself as a candidate in the user-facing design.
2. PRD did not define these extra ending actions, so they must not be invented in UI.
3. Ending page only needs one action: `返回主页`.
4. After an ending is completed, Home must not show `继续故事`; story progress is reset into a new run state, so the Home action should become `新的故事`.

Additional Ant feedback:

5. Prologue / 开场白 text is too large on preview / device; reduce by one size step.
   - This is a typography authority adjustment, not a layout redesign.
   - Keep the same page structure, background, progress label, and visual mood.
   - Do not change Name Setup or Start page typography in this task.
6. Design preview pages must not show PM/developer notes as visible product copy.
   - Example rejected visible copy on chapter catalog: `查看已解锁章节与当前进度。第一版只保留返回与继续，不扩展成就系统。`
   - This kind of note may be useful in spec / merge record, but must not appear inside the product mock screen.
   - Developer may accidentally implement visible mock text as product UI, so remove all non-user-facing explanatory notes from visible screens.

## Required changes

Update:

- `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- `00_harness/02_planning/task_board.md`
- `00_harness/03_handoffs/latest_status_snapshot.md`

Also update the prologue typography rule / preview wherever the current authority defines it.

Also perform an authority hygiene pass on the visible HTML mock screens:

- remove PM/developer/internal explanatory notes from visible product areas;
- keep only real user-facing copy;
- move necessary explanatory guidance into MinSpec / merge record text, not inside the phone screen mock.

## Ending page requirements

1. Remove user-facing `candidate` wording from the preview.
   - Internal docs may still note PM/Ant review status if needed.
   - The visual page itself must not say `terminal page candidate`.

2. Keep only one visible ending action:
   - `返回主页`

3. Remove these visible actions from ending page:
   - `回忆画廊`
   - `重看本结局`
   - `相关章节`

4. Ending page may still show:
   - ending type tag: TRUE / GOOD / NORMAL / BAD
   - ending title
   - short ending description
   - unlock feedback text, if product wording remains light and non-interactive

5. Add Home after-ending state rule to authority:
   - after ending complete, Home primary CTA must be `新的故事`;
   - Home must not show `继续故事` for the completed run;
   - gallery unlock is a background state effect, not an ending page button.

6. Unlock feedback must not look like an action button.
   - Ant rejected the current preview because `已解锁：TRUE END / 回忆画廊新增 1 项` and `返回主页` use nearly the same glass bar treatment.
   - Unlock feedback is explanatory status copy, not a tappable action.
   - It must be visually lighter and clearly non-interactive: e.g. small text row, subtle badge, inline status line, or low-emphasis note.
   - It must not share the same height, border, filled rectangle, hover/action styling, or button rhythm as `返回主页`.
   - `返回主页` remains the only visible action and should be visually identifiable as the only button.

## Prologue typography requirement

1. Reduce the main prologue body font by one size step.
2. Keep line-height comfortable; avoid creating cramped text.
3. Do not change Start title typography.
4. Do not change Name Setup typography unless XoXo finds it explicitly shares the same token and must be split to avoid accidental change.
5. Document the final token in MinSpec so PP / Wewe do not guess the font size.

## Visible copy hygiene requirement

1. Audit all visible mock screens in the authority HTML.
2. Remove copy that is meant for PM/dev explanation rather than the player.
3. Especially check:
   - chapter catalog;
   - ending page;
   - source tags / candidate labels;
   - implementation notes;
   - "第一版..." / "不扩展..." / "candidate..." / "source..." style text.
4. If the note is needed for developers, move it to:
   - `XoXo_UI_Final_MinSpec_20260712.md`; or
   - `NagisHeart_UI_Authority_Merge_Record_20260715.md`.
5. Product mock screens must contain only text that should actually appear in the app.

## Ending hierarchy requirement

1. Ending card must clearly distinguish:
   - content: tag / title / subtitle / description;
   - status: unlock feedback;
   - action: `返回主页`.
2. Status copy must not use action-cell styling.
3. Action styling must be reserved for `返回主页` only.
4. If a user can mistake unlock feedback for a tappable button, the design fails.

## Forbidden

- Do not add new ending buttons not defined in PRD.
- Do not design replay / branch-map / related chapter / achievement / CG navigation in this task.
- Do not modify Android/Web/story-data/BG mapping.
- Do not rename or delete assets.

## Return format

Write PM outbox status:

- `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_ending_page_authority_revision_20260719.md`

Include:

1. What changed.
2. Which authority files were synchronized.
3. Whether user-facing `candidate` wording was removed.
4. Confirmation that only `返回主页` remains as visible action.
5. Confirmation that Home after-ending primary CTA is `新的故事`, not `继续故事`.
6. Confirmation that prologue body font was reduced by one step and the final token is documented.
7. Confirmation that visible PM/dev/internal notes were removed from product mock screens.
8. Confirmation that unlock feedback is visually non-interactive and no longer styled like the `返回主页` button.
9. Cleanup status.
