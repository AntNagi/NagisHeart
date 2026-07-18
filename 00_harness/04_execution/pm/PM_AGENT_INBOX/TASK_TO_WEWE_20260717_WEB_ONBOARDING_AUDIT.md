# Task to Wewe - Web Onboarding / Read-only Audit

## Task

`TASK-20260717-012` - Web 开发接手入职与只读审计

## Owner

Wewe（Web 开发 / Claude）

## Source

Ant大小姐说明：除 Android 主版本外，项目还需要开发 Web 版本。公司电脑开发工程师 cc 之前已经做了一些基础开发，现在由 Wewe 接手 Web 方向。PM 一一需要先给 Wewe 做入职培训，让 Wewe 了解项目情况、已有开发内容、设计方案和必要权威文件。

## Required Reading

First read:

1. `00_harness/04_execution/pm/PM_AGENT_INBOX/CLAUDE_WEB_DEV_WEWE_BOOTSTRAP.md`
2. `README_AI.md`
3. `TASKS.md`
4. `PROJECT_STRUCTURE.md`
5. `00_harness/03_handoffs/latest_status_snapshot.md`
6. `00_harness/02_planning/task_board.md`
7. `00_harness/01_governance/decision_log.md`

Then read Web-specific files:

1. `design/NagisHeart_Web_Architecture_v1_0.md`
2. `handoff/handoff_to_cc_20260713.md`
3. `web/index.html`
4. `web/src/main.js`
5. `web/src/controller/GameController.js`
6. `web/src/engine/`
7. `web/src/data/`
8. `web/src/ui/`
9. `web/styles/`

Then read current authority:

1. `00_harness/08_authority_current/01_product/NagisHeart_PRD_v2_0.md`
2. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
3. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
4. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`
5. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
6. `00_harness/08_authority_current/04_ui/NagisHeart_LongNarration_StoryRecap_Redesign_Lulu_v1_0.html`
7. `00_harness/08_authority_current/07_technical/ARCHITECTURE.md`

## Scope

Read-only audit only.

Do not:

- modify Web code;
- modify Android code;
- modify story-data;
- delete resources;
- implement UI;
- create a build system;
- update package/dependency files;
- announce final decisions.

## Deliverable

Write a dev reply to:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_onboarding_audit_20260717.md`

Report:

1. files read;
2. Web version positioning as you understand it;
3. current Web code capabilities;
4. current Web code gaps vs authority;
5. recommended Web development order P0 / P1 / P2;
6. risks and dependencies;
7. questions for PM / Ant.

## Completion Definition

Task is complete when PM can decide the first actual Web implementation task without asking Wewe to rediscover the project from scratch.
