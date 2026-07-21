# Android 开发工程师 PP - 入职必读大礼包

Date: 2026-07-18  
PM: 一一  
Developer: Android 开发工程师 PP  
Project: Nagi's Heart  
Repo: `D:\Nagi's Heart\NagisHeart`

---

## 0. Welcome / role boundary

PP，你现在接手的是 **Android UI authority implementation**，不是重新设计 UI，也不是重写剧情/引擎。

当前情况：

- yiyi 已不再负责 Android 视觉/UI 实现；
- Ant大小姐实机确认：导航栏/HUD、弹窗、章节目录/章节相关 UI 仍没有按最新权威稿落地；
- 你的第一步不是直接改代码，而是先做只读差异审计，让 PM 能确认改动范围。

---

## 1. 必读文件顺序

请按顺序读取，不要跳读：

1. `README_AI.md`
2. `TASKS.md`
3. `PROJECT_STRUCTURE.md`
4. `00_harness/03_handoffs/latest_status_snapshot.md`
5. `00_harness/02_planning/task_board.md`
6. `00_harness/01_governance/decision_log.md`
7. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
8. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
9. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`
10. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
11. `00_harness/05_reports/validation/PM_REVIEW_ANDROID_UI_REAL_DEVICE_REJECT_20260718.md`
12. `00_harness/05_reports/validation/PM_REVIEW_ANDROID_UI_REAL_DEVICE_FAIL_YIYI_004_20260718.md`
13. `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_NEW_ANDROID_UI_DEV_20260718_AUTHORITY_IMPLEMENTATION_TAKEOVER.md`

`00_harness/08_authority_current/` 是当前权威来源。  
不要从 archive、旧截图、旧 rejected 包里取设计结论。

---

## 2. 当前正式任务

你的正式任务是：

`TASK-20260718-009` - Android UI authority implementation takeover

任务单：

`00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_NEW_ANDROID_UI_DEV_20260718_AUTHORITY_IMPLEMENTATION_TAKEOVER.md`

第一阶段只读，不改代码。

---

## 3. 第一份回报要求

请先输出只读差异报告：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_ui_authority_takeover_diff_20260718.md`

报告必须包含：

1. 每个失败 UI 区域当前 Android 文件/组件位置；
2. 对应的 authority 文件、section、HTML screen 或设计依据；
3. 当前实现与 authority 的具体差异；
4. 建议最小改动文件清单；
5. 风险点；
6. 验证计划：需要哪些实机截图/页面；
7. 明确不改范围；
8. cleanup status。

重点审计区域：

- 顶部 HUD / navigation bar；
- back / auto / save / backlog/menu icon buttons；
- title chip / action chip / skip-section chip；
- NagiDialog / 跳过本节确认弹窗；
- 章节目录；
- chapter / section opening；
- Chapter Clear / Section Clear；
- speaker/name 金色可读性，如果当前仍不清晰。

---

## 4. 禁止范围

第一阶段绝对不要改代码。

整个任务禁止擅自修改：

- story-data 正文；
- BG mapping 权威；
- TT Start；
- App Icon / launcher V4；
- Web；
- BGM；
- archive；
- unrelated cleanup；
- 任何没有写进 diff 报告并经 PM 批准的文件。

App Icon V4 已经 Ant 视觉通过，但当前不归你第一阶段处理。

---

## 5. 工作方式

请按 WORKER_LOOP 回报：

- 读了哪些文件；
- 当前判断；
- 改动建议；
- 未改范围；
- cleanup status；
- 是否需要 PM/Ant 决策。

所有回报写到：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/`

不要只在 Claude 窗口里口头说结论。

---

## 6. PM 期望

这次我们不需要“凭感觉再调一轮”。

我们需要的是：

- 把 Android 当前 UI 和最新 authority 一项项对齐；
- 先差异表，再实现；
- 每次设计变化都回写 authority，不让实现自己创造权威；
- 所有视觉改动最终以 Ant大小姐实机确认作为 done 标准。
