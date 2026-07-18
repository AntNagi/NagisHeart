# PM Review - Real Device UI Feedback Split

Date: 2026-07-17  
PM: 一一  
Source: Ant大小姐 real-device screenshots and feedback

## PM Classification

### Send to XoXo / UI authority

Assigned as `TASK-20260717-011`.

1. Chapter opening readability:
   - Current opening title text has no backing and is hard to read.
   - UI must specify a subtle transparent backing behind the chapter opening text group.
2. Chapter ending / chapter clear:
   - Current page does not match expected UI direction.
   - Final authority previously left chapter ending / section ending pending, so development must not invent this page.
3. Top title / next action style:
   - Title chip and next/skip-style action chip need final UI confirmation.

Task file:

- `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_XOXO_20260717_CHAPTER_UI_REAL_DEVICE_FEEDBACK.md`

### Send to yiyi / development

Merged into queued `TASK-20260717-009`, because it is already the runtime content / BG / interaction closure task and is queued behind `TASK-20260717-010`.

Independent dev items:

1. Story recap /剧情回顾 should become page-by-page navigation, not vertical scrolling.
2. Chapter/story gameplay pages should default to dark readability treatment.
3. Runtime authority sync remains:
   - `好卖 -> 有用`
   - `wc_offer -> assets/bg/living_room.jpg`
   - hide `→` / blank / autoAdvance choices from player-visible choices
   - audit Backlog order / traversed-node behavior

UI-dependent dev item:

- Chapter opening / ending visual implementation waits for XoXo `TASK-20260717-011`; yiyi should not invent visual rules if the XoXo result is not available.

Task file updated:

- `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_YIYI_20260717_ENGINE_CONTENT_LEGACY_CLOSURE.md`

## PM Notes

- `TASK-20260717-010` remains first in yiyi queue.
- `TASK-20260717-009` remains second, now expanded to include Ant's latest independent dev feedback.
- UI authority gaps are separated to XoXo so Android does not design pending chapter pages ad hoc.
