# TASK TO DEDE - Web Mobile rerun after Wewe 016

任务编号：`TASK-20260718-017`  
负责人：DeDe（Codex / QA）  
PM：一一  
日期：2026-07-18  
优先级：P0  
类型：QA / 只读复测  

---

## 0. 任务目标

Wewe 回报 `TASK-20260718-016 Web Mobile QA Reject Fix Round 2` 已修复 DeDe 015 的 5 项 reject 问题。

请你在真正仓库：

`D:\Nagi's Heart\NagisHeart`

对当前 Web mobile 版本做独立复测。

本任务只测试，不改代码。

---

## 1. 必读文件

1. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_mobile_qa_reject_fix_round2_20260718.md`
2. `00_harness/05_reports/validation/PM_REVIEW_WEWE_WEB_MOBILE_QA_REJECT_FIX_ROUND2_20260718.md`
3. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_dede_web_mobile_rerun_after_wewe_p0_20260718.md`
4. `00_harness/05_reports/validation/PM_REVIEW_DEDE_WEB_MOBILE_RERUN_AFTER_WEWE_P0_20260718.md`
5. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
6. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`

---

## 2. 背景

DeDe 015 上轮结论为 reject：

- Game 背景高度塌缩已修。
- Backlog 路由已修。
- 但 Opening 点击仍无法继续，Section/Chapter Clear 不可达。
- skip-section 无 NagiDialog。
- HUD 仍是 `AUTO / SKIP / MENU`。
- BGM `50%` 静态不可操作。
- Opening 错误保留剧情 HUD。

Wewe 016 声称上述问题已修复。

PM 静态检查：

- 关键 JS 文件 `node --check` 通过。
- Wewe 证据目录 `00_harness/05_reports/validation/web_mobile_qa_reject_fix_round2_20260718/` 当前为空。
- Wewe 回报“6 文件”与表格列出的 7 个 Web 文件不一致。

因此必须由 DeDe 独立复测，不接受开发自检直接转 Ant 验收。

---

## 3. 必测点

### P0

1. Chapter Opening / Section Opening 点击卡片或合理主区域后必须能继续。
2. Section Clear / Chapter Clear 必须真实可达。
3. 从 Section Clear 继续到下一节 Opening，再进入 gameplay，流程不能卡住。

### P1

4. 跳过本节必须弹 NagiDialog。
   - 取消：回到原剧情位置。
   - 确认：进入当前 Section Clear，不得直接跳 Chapter Opening。
5. HUD 不得再出现 `AUTO / SKIP / MENU`。
   - 应符合 authority：返回 icon / title chip / 自动播放·存档·回顾 icon buttons / action chip。
6. BGM 音量必须是可操作 slider，而不是静态 `50%`。
   - 至少验证拖动后值变化。
   - 如能验证 localStorage 持久化，请记录。
7. Opening / Clear 全屏状态必须隐藏剧情 HUD。

### 基础检查

8. 393x852 与 430x932 两个移动视口；如果工具无法精确设置，必须如实说明实际视口。
9. Console error / warning。
10. 资源加载 404 / 失败。

---

## 4. 输出要求

报告写入：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_dede_web_mobile_after_wewe_016_20260718.md`

证据目录：

`00_harness/05_reports/validation/web_mobile_qa_dede_after_wewe_016_20260718/`

报告必须包含：

- P0/P1/P2 结论；
- 每个必测点的 pass / fail；
- 截图或等价证据路径；
- 复现步骤；
- 实际结果 / 期望结果；
- Console / resource 检查；
- `Code touched: no`；
- `Cleanup status: none` 或 candidates。

---

## 5. 禁止范围

- 不修改 `web/`；
- 不修改 `android/`；
- 不修改 story-data；
- 不修改 BG mapping；
- 不修改 authority_current；
- 不修改 TT authority；
- 不删除 / 移动 / 归档文件。

如果发现问题，只写 QA 报告，不修复。
