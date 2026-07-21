# TASK TO WEWE - Web Mobile QA Reject Fix

日期：2026-07-18  
PM：一一  
执行人：Wewe（Web 开发 / Claude）  
任务 ID：`TASK-20260718-014`  
状态：ready / waiting Claude quota  
优先级：P0

---

## 0. 结论

DeDe 已完成 Web 移动端阶段性独立 QA。当前 Web 移动端不可进入 Ant 大小姐视觉 / 交互验收。

本任务是对 `TASK-20260718-010` 的升级返工，不是新功能追加。

必读：

1. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_dede_web_mobile_full_regression_20260718.md`
2. `00_harness/05_reports/validation/PM_REVIEW_DEDE_WEB_MOBILE_QA_STAGE1_20260718.md`
3. `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_WEWE_20260718_WEB_MOBILE_P0_REWORK.md`
4. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
5. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`

---

## 1. 禁止范围

只允许修改：

- `web/`

禁止修改：

- `android/`
- `story-data/`
- BG mapping authority
- `00_harness/08_authority_current/`
- TT Start / App Icon authority
- archive
- unrelated cleanup

---

## 2. 必须先修 P0

### P0-A：Game page mobile layout

修复：

- 游戏页移动端背景几乎不可见；
- HUD / 正文 / action chip 顶部重叠；
- narration / dialogue 没有正常落在移动端安全区；
- 页面看起来像整屏深色空白。

完成要求：

- `393x852` 和 `430x932` 游戏页背景可见；
- HUD 与正文不重叠；
- dialogue / narration 可读；
- 截图证明。

### P0-B：Chapter / Section transition visible + tappable

修复：

- Chapter Opening DOM 已挂载但视觉完全不可见；
- 轻触继续无法推进；
- transition 页不应显示被 HUD 遮挡的空黑状态。

完成要求：

- Chapter Opening 可见；
- Section Opening 可见；
- 轻触继续可推进；
- 进入后续 Section Clear / Chapter Clear 路径可测试。

---

## 3. 必须修 P1

### P1-A：Backlog route

当前“回顾”打开章节目录。  
必须改为打开 Backlog。

章节目录必须有独立入口，不得与 Backlog 混用。

### P1-B：Skip section confirmation

当前“跳过本节”未弹确认，直接进入错误/不可见状态。

必须：

- 先弹 NagiDialog；
- 取消回到原剧情；
- 确认进入正确 Section Clear；
- 不得直接跳到不可见 Chapter Opening。

### P1-C：HUD authority structure

当前 HUD 仍是英文 `AUTO / SKIP / MENU`。  
必须改为 authority 信息架构与中文口径：

- 返回；
- 章节标题；
- 自动播放；
- 存档；
- 剧情回顾；
- “跳过本节”为剧情层级 action chip。

### P1-D：Settings BGM control

当前 BGM 只显示 `50%` 文本，无可操作控件。

必须让 BGM 音量可操作，并能反映设置变化。

---

## 4. 回传要求

完成后写入：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_mobile_qa_reject_fix_20260718.md`

回报必须包含：

1. 修改文件清单；
2. 对应修复的 P0/P1 issue ID；
3. 393x852 / 430x932 截图路径；
4. Console 检查；
5. resource loading 检查；
6. `Android touched: no`；
7. cleanup status；
8. 是否可以重新交 DeDe 回归。

---

## 5. 完成定义

只有满足以下条件，才可转 review：

- WEB-MOBILE-001 / 002 两个 P0 均修复；
- WEB-MOBILE-003 / 004 / 005 / 006 四个 P1 至少完成可验收实现；
- 提交移动端截图；
- 未修改禁止范围；
- 回报完整。

