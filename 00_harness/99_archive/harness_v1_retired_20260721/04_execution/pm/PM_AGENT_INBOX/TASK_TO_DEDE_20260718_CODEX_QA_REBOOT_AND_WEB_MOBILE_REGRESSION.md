# TASK TO DEDE - Codex QA Reboot + Web Mobile Regression

日期：2026-07-18  
PM：一一  
执行人：DeDe（Codex / QA）  
任务 ID：`TASK-20260718-013`  
状态：assigned  
优先级：P0

---

## 0. 入职 / 迁移说明

DeDe，你之前的旧任务在错误文件夹里，已经废弃。现在所有工作必须使用真正仓库：

`D:\Nagi's Heart\NagisHeart`

不要在外层 `D:\Nagi's Heart` 或旧 worktree 里读写项目文件。

---

## 1. Harness / Loop 规则

你是 Codex 侧正式 QA，不是临时测试。

必须遵守：

1. 先读入口文件；
2. 只做测试和报告，不改代码；
3. 所有结论必须落到 PM outbox；
4. 问题按 P0 / P1 / P2 分级；
5. 每个问题要有复现步骤、实际结果、期望结果、证据；
6. 不凭感觉验收，不替开发解释；
7. 不直接接 Ant 大小姐口头需求为开发任务，所有任务由 PM 一一派发；
8. 测试完成后按 WORKER_LOOP 回报 PM。

---

## 2. 必读文件

按顺序读取：

1. `README_AI.md`
2. `TASKS.md`
3. `PROJECT_STRUCTURE.md`
4. `00_harness/00_project/agent_registry.md`
5. `00_harness/02_planning/task_board.md`
6. `00_harness/01_governance/decision_log.md`
7. `00_harness/03_handoffs/latest_status_snapshot.md`
8. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
9. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
10. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
11. `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_WEWE_20260718_WEB_MOBILE_P0_REWORK.md`
12. `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_WEB_QA_20260718_WEB_MOBILE_FULL_REGRESSION.md`

---

## 3. 当前团队口径

- `yiyi`：已离职 / inactive，不再接新任务。
- `PP`：当前 Android 开发工程师，接替 yiyi。
- `Wewe`：当前 Web 开发工程师，只负责 Web，不得动 Android。
- `DeDe`：当前 Codex 侧 QA，负责独立测试与证据报告。

---

## 4. 本轮 QA 任务

对当前 Web 移动端做全流程独立回归测试。

重点不是只测黑屏，而是判断 Web 移动端是否可以进入 Ant 大小姐视觉/交互验收。

至少覆盖两个移动视口：

- `393 x 852`
- `430 x 932`

至少测试：

1. Start / Splash：TT Start v23 三层资源是否可见；
2. Start 点击后流程是否可走；
3. Home / system pages 是否黑屏、空屏、不可读；
4. Prologue / Name setup；
5. Game main screen：背景、HUD、dialogue、speaker name；
6. HUD：title chip、icon buttons、action chip、可见性、安全区；
7. NagiDialog；
8. Backlog：分页 / 左右滑动 / 不应有“上一页下一页”文字按钮；
9. Chapter catalog；
10. Chapter / Section opening；
11. Chapter / Section clear；
12. BGM 设置入口与播放行为；
13. Console errors；
14. Network/resource loading。

---

## 5. 禁止范围

不得修改：

- `web/`
- `android/`
- `story-data/`
- BG mapping
- `00_harness/08_authority_current/`
- TT Start / App Icon authority
- archive

QA 只读。发现问题只写报告。

---

## 6. 证据输出

截图 / 证据目录：

`00_harness/05_reports/validation/web_mobile_qa_dede_20260718/`

至少保存：

- 首屏截图；
- 一个游戏页截图；
- 一个 HUD / dialogue 截图；
- 一个 dialog 截图；
- 一个 backlog 截图；
- 一个 chapter catalog 或 opening / clear 截图；
- 如出现黑屏或异常，必须截图。

---

## 7. 回传文件

完成后写入：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_dede_web_mobile_full_regression_20260718.md`

报告必须包含：

1. 测试环境和视口；
2. 测试步骤；
3. P0 / P1 / P2 问题表；
4. 每个问题的复现步骤、实际结果、期望结果、证据截图路径；
5. Console / Network 检查；
6. 结论：是否可以进入 Ant 视觉验收；
7. 确认：`Code touched: no`。

---

## 8. 完成定义

QA 报告完整、截图证据完整、问题分级明确，且未修改代码。

