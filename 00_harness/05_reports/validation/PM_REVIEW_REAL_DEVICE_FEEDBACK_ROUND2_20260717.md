# PM Review - Real Device Feedback Round 2 Classification

Date: 2026-07-17  
PM: 一一  
Source: Ant大小姐 screenshots after yiyi `TASK-20260717-009` / `TASK-20260717-010`

## Verdict

This feedback should go to yiyi as implementation follow-up.

It does not require a new XoXo authority task because the relevant authority already exists:

- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`

## Classification

### 1. Title chip backing not visible

Owner: yiyi / Android implementation.

Authority already says title chip should use final glass HUD language. Real-device screenshot shows the title still reads as nearly naked text over the BG.

### 2. Story recap pagination interaction

Owner: yiyi / Android implementation.

The page should not expose large previous / next text buttons by default. Ant wants left/right swipe to change pages.

### 3. Dialog UI mismatch

Owner: yiyi / Android implementation, with PM authority check.

PM checked the confirmed authority page. Ant's memory is correct: the screenshot is not matching the authority style. Current implementation became too opaque / heavy due the `TASK-20260717-010` readability workaround.

The fix should move visual style back toward the authority glass dialog while preserving the functional fix:

- do not restore broken self-blur;
- preserve z-order and clickability;
- tune opacity / scrim / border / shadow toward the confirmed UI.

## Task Created

- `TASK-20260717-013`
- Task file: `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_YIYI_20260717_REAL_DEVICE_FEEDBACK_ROUND2.md`

