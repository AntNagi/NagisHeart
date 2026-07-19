# TASK TO PP - Android P0 Logic + Confirmed UI Controlled Pass

- Task ID: TASK-20260719-009
- Created: 2026-07-19
- From: PM 一一
- To: Android 开发工程师 PP
- Status: ready
- Scope: Android only

## Context

PP，Claude token 已恢复。本任务接续你作为 Android owner 的工作。

这不是“重新设计 UI”，也不是“大范围重构”。本任务目标是把 Ant 大小姐最新实机反馈中最影响上线的 Android 问题收口，同时保持代码可维护，不让多轮修改继续堆脏。

Wewe/Web 不在本任务范围内。

## Must read before touching code

1. `README_AI.md`
2. `TASKS.md`
3. `PROJECT_STRUCTURE.md`
4. `00_harness/03_handoffs/latest_status_snapshot.md`
5. `00_harness/02_planning/task_board.md`
6. `00_harness/01_governance/decision_log.md`
7. `00_harness/04_execution/pm/PM_AGENT_INBOX/CLAUDE_ANDROID_DEV_PP_BOOTSTRAP.md`
8. `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_PP_20260719_ANDROID_MAIN_FLOW_LOGIC_AND_UI_AUDIT.md`
9. `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_PP_20260719_ANDROID_DIALOG_HUD_ROOT_CAUSE_ADDENDUM.md`
10. `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_PP_20260719_ANDROID_DIALOG_HUD_MINIMAL_FIX.md`
11. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
    - Section 17.2: HUD / nav / action chip
    - Section 17.3: Dialog Android no-real-blur fallback
    - Section 18: Ending page confirmed authority
12. `00_harness/05_reports/validation/PM_REVIEW_XOXO_ENDING_PAGE_AUTHORITY_REVISION_ADDENDUM_20260719.md`

## Ant-confirmed UI authority update

Ant has confirmed XoXo `TASK-20260719-008` ending-page revision.

Current ending-page implementation authority is **MinSpec section 18 only**.

Do not implement old section 17.5. It is historical / superseded.

Ending page rules:

1. Ending page has three layers:
   - content
   - static status feedback
   - primary action
2. `已解锁：TRUE END / 回忆画廊新增 1 项` is static status feedback.
   - It is not a button.
   - It must not be implemented as Button / ChipButton / action cell.
   - It must not share the same height, border, fill, padding rhythm, hover/action rhythm as the button.
3. `返回主页` is the only visible action.
4. Do not add visible ending buttons for:
   - `回忆画廊`
   - `重看本结局`
   - `相关章节`
5. After ending completes and user returns Home, Home primary CTA must be `新的故事`, not `继续故事`.
6. Blank tap on ending page must not continue normal story.

## Required execution order

### Phase A — Main-flow P0 logic audit first

Start from `TASK_TO_PP_20260719_ANDROID_MAIN_FLOW_LOGIC_AND_UI_AUDIT.md`.

Investigate these P0 issues:

1. Ending appears suddenly in the middle of flow.
2. After dismissing / tapping ending, story continues instead of stopping at terminal page.
3. Later chapter `远处的世界第一` can get stuck / cannot advance / cannot return.
4. Ending has been seen but Gallery does not show unlocked ending.

You must identify whether each is:

- Android implementation / routing bug,
- story-data / flow mapping issue,
- PRD / interaction ambiguity,
- stale build / wrong APK issue.

If root cause is clearly Android implementation and fix is localized, you may proceed to Phase B implementation in the same task.

If root cause requires changing story-data / BG mapping / product flow design, stop and report before editing those files.

### Phase B — Implement confirmed Android fixes only

Allowed implementation scopes:

1. Main-flow P0 Android fixes from Phase A, only if root cause is Android-side and localized.
2. Dialog / HUD active-path fix from `TASK_TO_PP_20260719_ANDROID_DIALOG_HUD_MINIMAL_FIX.md`.
3. Ending page implementation according to MinSpec section 18, if the code path is already clear and does not require product redesign.
4. Backlog defaults / clipping if directly tied to Android implementation:
   - Backlog must open at page 1 by default.
   - Single-page text must not be cut off.
   - If the current fixed 8-item/page implementation causes clipping on real mobile height, reduce items per page dynamically or adjust paging by measured safe height; do not hide overflow as a "solution".
5. Gallery unlock after ending:
   - Reaching an ending must persist unlock state before showing the ending page.
   - Returning Home and then opening Gallery must show the unlocked ending without app restart.
   - If the failure is caused by ID mismatch (`true` vs `end_true`, etc.) or cached Gallery state, fix Android-side mapping/cache if localized.

Forbidden scopes:

- Do not touch Web.
- Do not touch TT Start.
- Do not touch App Icon.
- Do not redesign UI.
- Do not implement old section 17.5 ending four-action model.
- Do not add section-clear standalone page back.
- Do not delete resources.
- Do not modify story-data / BG mapping unless Phase A proves the bug is data-side and PM approval is explicitly needed; if so, report blocked.

## UI implementation guardrails

### Dialog / HUD

PP must use active-path proof from the root-cause addendum.

Required:

- Dialog must not read as a rounded rectangle line-frame.
- HUD title / icon / skip/action chip must share one glass family.
- Bright backgrounds must not make icon buttons disappear.
- If a component path is inactive or duplicated, report it. Do not guess.

### Text readability

Ant feedback: global text backing is still too weak.

For this task, do not invent a new design. Only apply existing authority tokens:

- Use MinSpec 17.1 / 17.2 / 17.3 / 17.4 / 18 where relevant.
- If a text surface is not covered by current authority or active code path is unclear, report it as needing UI/PM confirmation.

### Prologue

Opening / Prologue body typography follows MinSpec 18.3:

- preview token: 28px / line-height 1.68 equivalent
- Start title and Name Setup typography must not change.

## Required code-review / maintainability check

Because Android has been changed through many rounds, include a short code-health note in your reply:

1. Which files are active runtime paths.
2. Which files are duplicate / stale / unused candidates.
3. Whether your changes reduce or increase duplication.
4. Any remaining high-risk areas before release.

Do not run broad cleanup in this task. Just report cleanup candidates.

## Required verification

Run an Android build if possible.

Your reply must include:

1. Phase A root-cause table for the four main-flow P0 issues.
2. Implementation summary by file.
3. Active-path proof table:
   - feature
   - active file / composable
   - how you proved it is active
4. Authority alignment table:
   - authority section
   - target effect
   - Android file
   - implemented token / behavior
5. Build freshness proof:
   - command / method
   - result
   - timestamp or apk/build artifact note
6. Screenshot / real-device checklist for Ant:
   - Dialog on bright background
   - HUD on bright background
   - Backlog first page and no text clipping
   - Ending page static status feedback + only `返回主页`
   - After-ending Home shows `新的故事`
   - Gallery shows unlocked ending after ending is reached
7. Cleanup status.

## Output

Write report to:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_p0_logic_and_ui_controlled_pass_20260719.md`

Update:

- `00_harness/02_planning/task_board.md`
- `00_harness/03_handoffs/latest_status_snapshot.md`

Status should be `review` when complete, not `done`, until Ant real-device validation passes.
