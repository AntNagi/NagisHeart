# Task to yiyi - Engine / Content Legacy Closure

## Task

`TASK-20260717-009` - 剧情文案 / 章节 BG / 交互规则遗留项闭环

## Source

Ant大小姐 asked whether the old non-UI issues from previous test bug images were already handled:

- story writing issues;
- chapter / scene BG changes;
- interaction rules such as hidden auto-advance choices and Backlog behavior.

PM reviewed the old task and current repository. The old batch was attempted, but it is not fully closed.

PM has already merged the source-authority design files before sending this runtime/dev task:

- Script source: `好卖 -> 有用`
- BG mapping source: `wc_offer -> assets/bg/living_room.jpg`

Reference:

- Old task: `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_YIYI_20260713_ENGINE_CONTENT_BATCH1.md`
- Old reply: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_engine_content_batch1_20260713.md`
- PM review: `00_harness/05_reports/validation/PM_REVIEW_ENGINE_CONTENT_BATCH1_STATUS_20260717.md`

## Required Work

### A. Choice / autoAdvance visibility

Current concern:

- `nodes.json` contains `label: "→"` and `autoAdvance: true` markers.
- This is acceptable as story control data only if it never renders as visible player choice.
- Current `StoryEngine.getVisibleChoices()` appears to filter only conditions, not `autoAdvance`, blank labels, or `→`.

Required:

1. Ensure autoAdvance choices, blank labels, and `→` placeholder choices do not display to players.
2. Preserve auto-advance routing behavior.
3. Report exact files changed and any edge cases.

### B. Backlog / story recap

Current concern:

- Old reports said Backlog order/repetition needed retest.
- Earlier full-scope report noted selected choices and chapter scoping may be incomplete.
- Ant大小姐 2026-07-17 实机反馈：剧情回顾 / 剧情回复页现在像长滚屏，要求改为翻页，不要滚屏。

Required:

1. Audit current Backlog behavior.
2. Confirm whether it records only actually traversed lines.
3. Confirm whether selected choice text / responses are handled as intended.
4. Confirm whether chapter/section boundaries clear or segment Backlog correctly.
5. Change story recap /剧情回顾 reading interaction to page-by-page navigation rather than vertical scrolling.
6. Preserve the authority content scope: story recap should show the actually reached current-section content and should not expose future/skipped branches.
7. Fix only if the issue is clear and bounded; otherwise report precise remaining risk.

### C. Scene BG mapping

Current repository:

- `wc_offer` still uses `assets/bg/back.jpg`.
- `living_room.jpg` exists.
- `u20j` still uses `assets/bg/bg_u20j_worldcup_goal_kick.jpg`.
- Old report said `u20j -> vs_u20_goal.jpg`, but `vs_u20_goal.jpg` does not exist in current assets.

Required:

1. Sync runtime `wc_offer -> assets/bg/living_room.jpg` from the updated BG mapping authority.
2. Do not change `u20j` to a missing file.
3. Report whether `u20j` needs a missing asset added, a different existing BG chosen, or PM/Ant decision.
4. Do not create new BG art.

### D. Story wording

Current runtime repository still contains:

- `会长想让我去，是因为我好卖吧。`

Required:

1. Sync runtime wording from the updated script authority:
   - `会长想让我去，是因为我有用吧。`
2. Do not invent additional rewrite beyond that line.

### E. Deferred `nagiCall`

Current repository still contains `{{nagiCall}}` placeholders.

PM rule:

- `nagiCall` remains deferred for this round unless Ant大小姐 reopens it.

Required:

- Do not treat `nagiCall` as a P0 blocker in this task.
- Only mention if it affects the specific tested behavior.

### F. Chapter story readability / theme

Ant大小姐 2026-07-17 实机反馈：很多章节页面使用 light 时看不清，要求“全部章节用 dark”。

Required:

1. Change chapter/story gameplay pages to use the dark readability treatment by default.
2. Apply this to chapter content scenes, dialogue pages, narration pages, and story recap if it belongs to the chapter reading flow.
3. Do not blindly change non-chapter system pages such as Start, Home, Settings, Gallery, Save/Load unless they are already meant to use the dark system background.
4. Report the exact mechanism used:
   - bulk `scene_visuals.json` theme update, or
   - runtime theme resolver default, or
   - another bounded approach.
5. Do not change BG art in order to solve readability unless separately authorized.

### G. Chapter opening / ending UI dependency

Ant大小姐 also reported:

- chapter opening text needs a light transparent backing;
- chapter ending / chapter clear page is not following UI;
- title / next-chapter styling is not following UI.

PM assigned these visual-authority decisions to XoXo as `TASK-20260717-011`. XoXo has now returned the UI authority supplement, and PM review passed:

- XoXo outbox: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_chapter_ui_real_device_feedback_20260717.md`
- PM review: `00_harness/05_reports/validation/PM_REVIEW_XOXO_CHAPTER_UI_REAL_DEVICE_FEEDBACK_20260717.md`
- Implementation spec: `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section `14`

Required:

1. Implement chapter / section opening with the light transparent frosted backing from section `14.1`.
2. Implement Chapter Clear / Section Clear using the `clear-card` treatment from sections `14.2` and `14.3`.
3. Implement title chip and skip / next / continue action chip using final glass HUD styling from section `14.4`.
4. Do not implement chapter catalog; it remains pending.
5. Return screenshots / real-device verification if available; otherwise report build / screenshot blocker.

## Out of Scope

Do not include:

- New UI authority changes invented by development.
- TT Start long-screen work.
- App Icon.
- Gradle wrapper / AS emulator setup.
- Resource deletion.
- BGM task.
- Broad script rewrite.

## Deliverables

Return a dev reply with:

1. Items fixed.
2. Items verified but unchanged.
3. Items blocked by missing asset or missing PM/Ant wording.
4. Files changed.
5. Minimal test / static verification performed.
6. Recommended next PM decisions.

## Completion Definition

The task is complete when:

- visible choice pollution is fixed or proven impossible in current flow;
- `wc_offer` runtime BG is corrected from the updated mapping authority;
- `u20j` BG does not get changed to a missing asset and has a clear PM decision point;
- `好卖` runtime text is synced to the updated script authority wording;
- Backlog/recap behavior has a concrete pass/fail report;
- story recap /剧情回顾 no longer relies on vertical scrolling and has page-by-page navigation;
- chapter/story gameplay pages use dark readability treatment by default;
- chapter opening / ending visual implementation follows XoXo `TASK-20260717-011` / PM review, with chapter catalog still untouched.
