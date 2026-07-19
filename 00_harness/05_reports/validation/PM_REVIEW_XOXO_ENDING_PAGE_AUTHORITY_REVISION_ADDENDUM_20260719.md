# PM Review — XoXo TASK-20260719-008 二次返修：结局页 status feedback 层级

Date: 2026-07-19  
Reviewer: PM 一一  
Status: **PM static pass / pending Ant visual confirmation**

## Scope

本次只复核 UI authority：

- 结局页 `已解锁：TRUE END / 回忆画廊新增 1 项` 是否从 action-like bar 降为非交互 status feedback。
- `返回主页` 是否仍是唯一可见 primary action。
- MinSpec / merge record / authority_current 是否同步，且不再让旧四动作候选模型误导开发。

未复核 Android / Web 实现；未修改 story-data / BG mapping / resources。

## Findings

### 1. Visible ending mock

File:

- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`

Result:

- `.ending-unlock` is now an inline, fit-content status note.
- `.ending-unlock` uses 11px muted text and a small gold dot.
- `.ending-unlock` has no border, no rectangle fill, no cut/action shape, and no action rhythm.
- `.ending-actions` contains a single `.ending-action.primary`: `返回主页`.

This addresses Ant's hierarchy concern: the unlock feedback no longer reads as the same kind of control as the only button.

### 2. MinSpec sync

File:

- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`

Result:

- Section 18 now defines the ending page hierarchy as:
  - content
  - status feedback
  - primary action
- Status feedback is explicitly forbidden from being implemented as Button / ChipButton / action cell.
- Section 17.5 has been marked as historical / superseded and must not be implemented.

### 3. Merge record cleanup

Files:

- `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`

Result:

- The older section 12 row that described a four-action ending candidate is now marked as historical and superseded by section 13 / 13.1.
- Developer-facing implementation guidance now points to section 18 for the ending page.

## PM decision

Pass for PM static review.

This can be shown to Ant for final visual confirmation. Do **not** send ending page implementation to PP / Wewe until Ant confirms the visual direction.

## Developer guardrail

When this later goes to PP / Wewe:

- Implement only section 18 for ending page.
- `已解锁...` is a static status note, not a button.
- `返回主页` is the only visible ending action.
- Do not reintroduce `回忆画廊` / `重看本结局` / `相关章节` as ending-page buttons.
- Do not use old section 17.5 as implementation authority.

Cleanup status: none.
