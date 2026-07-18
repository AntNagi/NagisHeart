# TASK TO WEWE - Web P1 controlled continuation

日期：2026-07-18  
PM：一一  
执行人：Wewe  
任务：`TASK-20260718-005`

---

## 0. 最高优先级边界

Wewe，本任务只允许继续 Web 版开发。

**严禁修改 Android 代码或 Android 资源。**

禁止范围包括但不限于：

- `android/`
- `android/app/src/main/`
- Android Kotlin / Java / Compose 文件
- Android `res/`、`assets/`、manifest、Gradle 配置
- App Icon、TT Start Android 接入、HUD/Dialog Android 实现

如果你发现 Android 侧问题，只能写入回报作为 cross-platform note，不得修。

---

## 1. 当前状态

`TASK-20260718-003` Web MVP overnight implementation pass 已完成 P0，并通过 PM 静态复核，当前为 `review`，等待 Ant大小姐浏览器视觉/交互确认后再转 `done`。

在不触碰 Android 的前提下，允许你继续推进 Web P1。

---

## 2. 必读文件

继续前必须读取：

- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
- `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
- `00_harness/05_reports/validation/PM_REVIEW_WEWE_WEB_MVP_OVERNIGHT_20260718.md`
- `00_harness/02_planning/task_board.md`

---

## 3. P1 允许推进范围

按风险从低到高推进：

1. Save / Load glass dialog 对齐 UI authority。
2. Settings 细节对齐：值列右对齐、dark system glass、BGM 音量入口如 Web 已有音频能力则接；没有则标 pending。
3. Web BGM：只接 Web 播放逻辑与用户音量控制，不改 Android BGM。
4. NagiDialog / native confirm 替换为 Web 版 authority dialog。
5. 打字机跳过：点击 / 空格可补完当前文本，再次点击推进。
6. PWA / favicon / Web icon：仅限 `web/` 范围，若需要复用 TT App Icon，只从 authority 读资源并写到 Web public/assets，不改 Android icon。
7. Chapter Clear actions / 跳过本节 controller 配合：只改 Web controller。

---

## 4. 禁止范围

不得修改：

- Android 任何文件；
- story-data 正文；
- BG mapping 权威；
- `00_harness/08_authority_current/`；
- TT Start authority；
- App Icon authority；
- 归档区 `00_harness/99_archive/`；
- notebook / notebook-app。

不得引用 archive 作为开发资源。

---

## 5. 回传要求

完成后写入：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_p1_controlled_continuation_20260718.md`

回报必须包含：

- 修改文件清单；
- 每个 P1 项目的完成 / pending 状态；
- 验证方式；
- Console 是否有错误；
- 明确声明：`Android touched: no`；
- cleanup status / candidates。

