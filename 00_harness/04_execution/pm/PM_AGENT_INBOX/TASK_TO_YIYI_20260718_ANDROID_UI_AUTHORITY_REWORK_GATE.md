# TASK TO YIYI - Android UI authority rework / ownership gate

日期：2026-07-18  
PM：一一  
执行人：yiyi  
任务：`TASK-20260718-004`

---

## 0. PM 结论

yiyi，Android UI 这轮给你最后一次受控修正机会，但流程要变。

Ant大小姐实机确认：当前 HUD / Dialog 仍然不符合最新 UI authority。不是单点小问题，而是视觉意图偏了：

1. HUD icon/title/action 虽然统一了，但现在太厚、太重，像深色按钮，不是 final glass HUD 轻玻璃。
2. Dialog 可读了，但仍不像 final light glass dialog，不能只满足 alpha 数字，要贴近设计气质。
3. speaker 金色方向保留，但亮背景下可读性还要确认。

这次不是普通返工，是 UI ownership gate。若下一轮实机仍明显偏离 authority，Android UI 实现职责会转给其他开发；你保留引擎、数据、构建、资源接入等非视觉任务。

---

## 1. 必读文件

你先不要直接继续改代码。请先读取并对齐以下文件：

- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 15 / 16.5
- `00_harness/05_reports/validation/PM_REVIEW_ANDROID_UI_REAL_DEVICE_REJECT_20260718.md`
- `00_harness/02_planning/task_board.md` 中 `TASK-20260718-004`

---

## 2. 下一步要求

### A. 先回传差异表，不要先写代码

差异表必须包含：

- 当前 Android 实现
- authority target
- 计划改哪些文件
- 明确不改哪些范围
- 风险点 / 需要 PM 或 Ant 确认的点

### B. 等 PM / Ant 确认可改后，再做机械修正

不要凭感觉调：

- alpha
- shadow
- shape
- padding
- chip 厚度
- dialog 暗度

### C. 回传必须包含实机截图验证点

至少需要：

- 亮背景 HUD
- 暗背景 HUD
- 跳过本节 Dialog
- speaker name 在亮背景下的可读性
- speaker name 在复杂背景下的可读性

### D. 禁止范围

不得修改：

- story-data
- BG mapping
- TT Start
- App Icon
- BGM
- Web
- 资源清理

---

## 3. 回传格式

先回传差异表，写入：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_android_ui_authority_rework_diff_20260718.md`

状态仍保持 `review / rework`，不得自行转 `done`。

