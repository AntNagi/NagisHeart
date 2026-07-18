# PM Review - Real Device HUD / Dialogue Readability Feedback Classification

Date: 2026-07-17  
PM: 一一  
Source: Ant大小姐 real-device screenshots

## Verdict

Route to XoXo first as UI authority patch.

This feedback expands beyond the existing yiyi `TASK-20260717-013` implementation fix. The issue is not only that the title chip is weak; the whole HUD system is inconsistent:

- title chip and skip/action chip have backing and border;
- icon buttons do not;
- bright backgrounds make icon buttons hard to see;
- dialogue speaker / name gold loses readability on bright/complex BG.

## Action

Created:

- `TASK-20260717-014`
- `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_XOXO_20260717_HUD_DIALOGUE_READABILITY_REAL_DEVICE.md`

## PM Rule

Because of `DEC-20260717-014`, XoXo must sync accepted design changes to `00_harness/08_authority_current/` before yiyi implements them.

## yiyi Dependency

yiyi may continue non-HUD parts of `TASK-20260717-013` such as story recap swipe and dialog visual correction.

For title/action/icon HUD and speaker/name readability, yiyi should wait for XoXo `TASK-20260717-014` authority output.
