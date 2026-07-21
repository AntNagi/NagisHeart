# TASK TO WEB QA - Web Mobile Full Regression

日期：2026-07-18  
PM：一一  
执行人：Web QA / 独立测试  
任务 ID：`TASK-20260718-011`  
状态：assigned  
优先级：P0

---

## 0. 背景

Ant 大小姐反馈：Web 移动端不只是黑屏问题；如果 Wewe 已经认为 Web P1 做完，那说明移动端整体质量风险很大，必须由独立测试复核。

本任务是独立 QA，不是开发任务。  
测试只读，不得修改代码。

---

## 1. 禁止事项

不得修改：

- `web/`
- `android/`
- `story-data/`
- BG mapping
- `00_harness/08_authority_current/`
- TT Start / App Icon authority
- archive

如发现问题，只写报告，不修。

---

## 2. 必读文件

1. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
2. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
3. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
4. `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_WEWE_20260718_WEB_MOBILE_P0_REWORK.md`
5. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_p1_controlled_continuation_20260718.md`
6. `00_harness/05_reports/validation/PM_REVIEW_WEWE_WEB_P1_CONTROLLED_CONTINUATION_20260718.md`

---

## 3. 测试范围

至少覆盖两个移动视口：

- `393 x 852`
- `430 x 932`

至少测试以下页面/流程：

1. Start / Splash：TT Start v23 三层资源是否可见；
2. Start 点击后是否进入主页/后续流程；
3. Home / system pages：是否出现黑屏、空屏或纯深色无内容；
4. Prologue / Name setup；
5. Game main screen：背景、HUD、dialogue、speaker name；
6. HUD：title chip、icon buttons、action chip、可见性与安全区；
7. NagiDialog：是否贴近 authority，而不是浏览器默认弹窗或厚重旧弹窗；
8. Backlog：分页/左右滑动/无上一页下一页文字按钮要求；
9. Chapter catalog：是否按 system-level dark glass authority；
10. Chapter / Section opening：文字托底、可点击继续；
11. Chapter / Section clear：clear-card 是否贴近 authority；
12. BGM 设置入口与播放行为（如浏览器策略限制，记录实际行为）；
13. Console errors；
14. Network/resource loading。

---

## 4. 证据要求

截图输出目录：

`00_harness/05_reports/validation/web_mobile_qa_20260718/`

至少保存：

- 首屏截图；
- 一个游戏页截图；
- 一个 HUD / dialogue 截图；
- 一个 dialog 截图；
- 一个 backlog 截图；
- 一个 chapter catalog 或 chapter opening/clear 截图；
- 如出现黑屏或异常，必须截图。

---

## 5. 回传要求

完成后写入：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_web_mobile_full_regression_20260718.md`

报告必须包含：

1. 测试环境和视口；
2. 测试步骤；
3. P0/P1/P2 问题表；
4. 每个问题的复现步骤、实际结果、期望结果、证据截图路径；
5. Console / Network 检查；
6. 结论：是否可以进入 Ant 视觉验收；
7. 确认：`Code touched: no`。

---

## 6. 完成定义

QA 报告完整、截图证据完整、问题分级明确，且未修改代码。

