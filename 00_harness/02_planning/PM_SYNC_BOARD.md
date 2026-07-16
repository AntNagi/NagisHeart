## 2026-07-11 14:36+ PM Status Update

| Time | Role | Update | PM Status |
|---|---|---|---|
| 2026-07-11 14:34+ | QA Laud | Status/regression request delivered and confirmed visible in Claude chat. | Waiting for `status_qa_laud_*.md` / `qa_reply_*.md` |
| 2026-07-11 14:35+ | Dev yiyi | Status intake/P0-P1 closure request delivered and confirmed visible in Claude chat. | Waiting for `status_dev_yiyi_*.md`; `dev_reply_20260711_1200.md` says AND-001..005 fixed |
| 2026-07-11 14:36+ | PM | Found yiyi wrote outbox under `D:\Nagi's Heart`; synced dev reply into PM root `D:\Nagi‘s Heart`. | Watch both roots until path confusion is resolved |
| 2026-07-11 15:15+ | Design TT | New brief found: `brief_to_tt_opening_poster_20260711_1509.md`. It defines a separate opening-poster page: 1080x1920 PNG, baked-in `Nagi's Heart` art title, single `START` action, no home/menu entries. | Track as design asset task; not a Laud regression blocker, but affects opening page implementation handoff to yiyi |
| 2026-07-11 15:18+ | PM -> TT | Sent XoXo opening-poster brief to TT Codex thread `019f4f72-2966-7070-b149-c870b31646c7`. | Waiting for TT asset/status reply |
| 2026-07-11 15:30+ | QA Laud | New files synced from `D:\Nagi's Heart`: `status_qa_laud_20260711_1930.md`, `qa_reply_20260711_1930.md`. | AND-002/003/004 PASS; AND-001 waits PM default-name decision; AND-005 layout usable but `nagiCall` missing; P0 remains HUD Back/Menu + `nagiCall` |
| 2026-07-11 15:45+ | Design TT | New TT opening poster status and assets found: `status_design_tt_20260711_1532.md`, `tt_opening_poster/opening_poster_v1_main_pillow_1080x1920.png`, `opening_poster_v2_main_nagi_with_cat_1080x1920.png`. | PM read: v1 better matches XoXo opening-poster brief; v2 reads closer to home/UI because of bottom dark band. Need XoXo/Ant visual confirmation before yiyi integration |
| 2026-07-11 19:00+ | QA Laud | New UI test report synced: `ui_test_report_laud_20260711_2100.md`. | Back/Menu now PASS; new P0 is save persistence/Continue failure; `nagiCall` still P0; Chapter locked titles and Start style remain P1 |
| 2026-07-11 19:00+ | Design TT | New TT status: `status_design_tt_20260711_1658.md`. TT withdraws v1/v2 and says current assets are not final KV quality. | Visual decision reserved for Ant; do not send opening poster to yiyi until Ant/XoXo confirm a final clean KV direction |
| 2026-07-11 22:39+ | PM | Prepared full-scope task briefs for XoXo and yiyi under `PM_AGENT_INBOX`. | XoXo brief focuses on final interaction/visual spec closure; yiyi brief focuses on full-scope flow, save, HUD, recap, narration, chapter start/end implementation |
| 2026-07-12 00:00+ | PM | Ant大小姐 updated product rule: `nagiCall` is paused for this round. | Remove Nagi call-name input from NameSetup; do not continue `nagiCall` replacement implementation this round; treat it as deferred script/product cleanup rather than current dev blocker |

# Nagi's Heart PM Sync Board

> 用途：本文件是本地协作目录里的 PM 总控板。设计、开发、测试不需要进入同一个聊天工具；所有人围绕这个目录和本文件同步事实、结论、责任与验收状态。

## 0. Current Source Of Truth

| 类型 | 当前文件 / 证据 | 状态 |
|---|---|---|
| 最新设计 | `NagisHeart_Design_V3_1_Latest.md` | Design V3.1 |
| 最新剧本 | `Nagis_Heart_SCRIPT_V14.md` / `Nagis_Heart_SCRIPT_V14_DisplayFixed.md` | SCRIPT V14 |
| 测试用例 | `Nagi_Heart_QA_TestCases_v1.0.md` | 需注意中文显示编码 |
| Android 冒烟报告 | `Nagi_Heart_Android_Smoke_QA_2026-07-10.md` | 已发现 P0/P1 问题 |
| 截图证据 | `nagi_screen_*.png`, `retest_*.png` | 可用于复验 |
| UI 树证据 | `window*.xml`, `retest_*.xml` | 可用于定位实现状态 |

## 1. Collaboration Rule

这里不是重新拉新群，而是把本地文件夹当成协作现场：

1. 设计只确认“是否符合设计与叙事体验”。
2. 开发只确认“实现原因、修复方案、影响范围、预计时间”。
3. 测试只确认“覆盖缺口、复测步骤、阻塞上线项”。
4. PM 只做裁决：是否本轮必须修、谁负责、何时验收。

任何结论都必须落到文件、截图、XML、测试步骤或设计/剧本依据，不能只写“感觉不对”。

## 2. Current Blocking Issues

| ID | 来源 | 优先级 | 问题 | 当前证据 | 期望结果 | Owner | 状态 |
|---|---|---:|---|---|---|---|---|
| AND-002 | Android Smoke QA | P0 | Prologue 被跳过，确认姓名后直接进入 `p1` | `Nagi_Heart_Android_Smoke_QA_2026-07-10.md` | 新游戏应先进入 Prologue，再进入 `p1` | 开发 | Open |
| AND-003 | Android Smoke QA | P0 | 台词显示原始 `{{playerName}}` | `nagi_screen_choice_response.png` | 应替换为玩家输入名，如 `Dede` | 开发 | Open |
| AND-004 | Android Script Parsing | P0 | 第一章部分 `{{playerName}}:` 玩家对白被误判为旁白样式 | 用户截图 2026-07-12 | 开发需按 `speaker` 优先级修正识别：有合法 speaker 一律进对白容器；仅无 speaker 才进入旁白判定 | 开发 | Open |
| AND-001 | Android Smoke QA | P1 | 默认名 `Ant` 可见但确认按钮不可用 | `nagi_screen_current.png`, `window.xml` | 默认名可确认，或输入框为空且仅显示 placeholder | 开发 / PM | Open |
| AND-004 | Android Smoke QA | P1 | 玩家界面显示 debug 节点状态 | `nagi_screen_after_name_confirm.png` 等 | release / QA 玩家界面隐藏 debug label，或由 debug 开关控制 | 开发 | Open |
| AND-005 | Android Smoke QA | P2 | 键盘弹出时确认按钮布局拥挤 | `nagi_screen_input_attempt.png` | 确认按钮清晰可见且可点击，适配 IME 与安全区 | 开发 / 设计 | Open |

## 3. Next Meeting Packet

给开发 / Claude：

```md
你是 Nagi's Heart 当前版本开发负责人。请只基于本地文件夹中的 PM_SYNC_BOARD.md、Android 冒烟报告、截图和 XML，输出：
1. 每个 Open 问题的可能实现原因；
2. 修复文件或模块；
3. 修复方案；
4. 影响范围；
5. 预计时间；
6. 修完后需要测试复验的步骤。

不要重新定义 PRD，不要扩大范围，不要改设计结论。
```

给测试 / Claude：

```md
你是 Nagi's Heart 当前版本测试负责人。请只基于 PM_SYNC_BOARD.md、Nagi_Heart_QA_TestCases_v1.0.md、Android 冒烟报告、截图和 XML，输出：
1. P0/P1 问题的最小复测路径；
2. 每个问题的通过标准；
3. 修复后需要回归的相关用例；
4. 当前测试用例中缺失或不够具体的地方；
5. 是否仍阻塞本轮上线。

不要只测主流程，必须覆盖路由、变量替换、UI 可见性和移动端输入布局。
```

给设计 / Codex 或人工设计：

```md
你是 Nagi's Heart 当前版本设计负责人。请基于 PM_SYNC_BOARD.md、Design V3.1、SCRIPT V14、当前截图，输出：
1. 当前实现是否破坏第一体验；
2. 默认名、Prologue、debug label、键盘布局分别是否影响玩家沉浸；
3. 每项问题的设计验收标准；
4. 哪些必须本轮修，哪些可后置。

不要做技术排期，只做体验与设计验收判断。
```

## 4. PM Decision Log

| 日期 | 决策 | 依据 | 后续动作 |
|---|---|---|---|
| 2026-07-11 | 本地文件夹作为协作中枢，不新建独立群 | 设计、开发、测试已在本地目录交付材料 | 用本文件统一事实源与待办 |
| 2026-07-11 | P0 先收敛 Prologue 路由与玩家名替换 | Android 冒烟报告中均为核心首体验阻塞 | 开发先评估并修复，测试随后复验 |

## 5. Review Protocol

每次有人更新文件后，在本文件追加一行：

| 时间 | 角色 | 更新内容 | 文件 | 需要谁处理 |
|---|---|---|---|---|
| 2026-07-16 23:53 | Design XoXo | `TASK-20260715-001` UI authority candidate merge completed and submitted through PM status intake; current status is `review`, not final authority. | `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_20260716_2353.md` | PM 一一 review; then decide whether to send to Ant 大小姐 for final visual confirmation |
| 2026-07-17 | PM 一一 | `TASK-20260715-001` PM review passed; candidate can be sent to Ant大小姐 for final visual confirmation, but remains not final authority. | `00_harness/05_reports/validation/PM_REVIEW_XOXO_UI_AUTHORITY_20260717.md` | Ant大小姐 confirm final UI authority decision and pending-page split |
| 2026-07-17 | PM 一一 | Ant大小姐 confirmed TT Start page direction is OK for dev integration; PM logged `DEC-20260717-001`, prepared yiyi task `TASK-20260717-001`, and sent it to Claude desktop `developer yiyi`. | `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_YIYI_20260717_START_V23_INTEGRATION.md` | yiyi integrate TT Start v23 and report back |
| 2026-07-17 | PM 一一 | Ant大小姐 reviewed XoXo UI authority candidate: Start uses TT v23, Home removes top title, Settings row values move right, all other pages pass. PM logged `DEC-20260717-002` and sent revision task to XoXo. | `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_XOXO_20260717_UI_AUTHORITY_REVISION.md` | XoXo revise candidate and report back |
| 2026-07-17 | Design XoXo | `TASK-20260715-001` local revision completed: Start now references TT v23, Home top title removed, Settings values right-aligned; other pages unchanged and pending pages still pending. | `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_ui_authority_revision_20260717.md` | PM / Ant review revised candidate |
