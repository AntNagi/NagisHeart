# TASK TO DEDE - Web Mobile P1 Settings / BGM Short Regression

任务编号：`TASK-20260719-010`  
项目：NagisHeart  
负责人：DeDe（Codex / QA）  
状态：ready  
优先级：P1  
创建时间：2026-07-19  

## 背景

Wewe 已回报 `TASK-20260718-018 Web Mobile P1 Settings readability and BGM verification follow-up` 完成。

PM 静态复核记录：

`00_harness/05_reports/validation/PM_REVIEW_WEWE_WEB_MOBILE_P1_SETTINGS_BGM_VERIFY_20260719.md`

PM 结论：静态通过但有证据 caveat。Web 版不由 Ant 直接验收，必须转 DeDe 独立 QA。

## 必读

1. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_mobile_p1_settings_bgm_verify_20260718.md`
2. `00_harness/05_reports/validation/PM_REVIEW_WEWE_WEB_MOBILE_P1_SETTINGS_BGM_VERIFY_20260719.md`
3. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_dede_web_mobile_after_wewe_016_20260718.md`
4. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
5. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`

## Scope

这是短回归，不是全量 Web 回归。

只测 Wewe 018 对 DeDe 017 caveat 的修复：

1. Settings 在明亮背景上的可读性。
2. BGM slider 持久化。
3. BGM slider 是否真实影响 AudioManager / audio volume；若当前运行路径无 audio 元素，要如实记录为 caveat，不得虚报通过。
4. 393x852 / 430x932 精确移动视口是否真实生效。

## 禁止范围

- 不改代码。
- 不改 Web 文件。
- 不改 Android。
- 不改 story-data / BG mapping / authority_current / TT authority / archive。
- 不把 Wewe 自检当作 QA 结论。

## 测试要求

### A. Settings 可读性

在至少一个明亮背景剧情页打开 Settings。

验证：

- Settings panel / overlay 有 dark glass 背景；
- 标题、行标题、右侧值、BGM slider、slider 数值均清楚；
- 不像厚重 Material 面板；
- 与 final dark glass UI language 一致。

输出截图证据。

### B. BGM 持久化

步骤：

1. 打开 Settings。
2. 将 BGM slider 改为一个非默认值，例如 80% 或 30%。
3. 记录 localStorage `nagi_settings`。
4. reload。
5. 再打开 Settings，确认 slider 和 localStorage 一致。

输出：

- 操作步骤；
- 变更前后值；
- reload 后值；
- 截图或日志。

### C. Audio runtime caveat

检查当前 Web 运行路径是否存在实际 `<audio>` 元素，以及 slider 改值是否影响 `audio.volume`。

如果没有 `<audio>`：

- 记录当前 scene / visual 是否没有 BGM；
- 标记为 caveat，而不是 pass；
- 说明需要一个带 BGM visual 的场景或测试入口才能完成真实 audio volume 验证。

如果有 `<audio>`：

- 记录 volume 变化前后值。

### D. 精确移动视口

测试至少两个视口：

- 393x852
- 430x932

必须记录：

- `window.innerWidth`
- `window.innerHeight`
- `#app` width / height
- 是否和目标一致

如果工具无法精确设置，必须如实说明实际尺寸；不得虚报。

## 输出

报告写入：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_dede_web_mobile_p1_settings_bgm_rerun_20260719.md`

证据目录：

`00_harness/05_reports/validation/web_mobile_qa_dede_p1_settings_bgm_20260719/`

必须包含：

- P0/P1/P2 结论；
- 逐项 pass / reject / caveat；
- 截图或日志证据；
- Console error/warn；
- Resource 404；
- Code touched: no；
- Cleanup status: none。

## 判定

- Settings 可读性若仍不清楚：reject，回 Wewe。
- BGM 持久化若失败：reject，回 Wewe。
- 精确视口若无法验证：caveat，不自动 reject，但必须记录。
- Audio actual volume 若因无 BGM scene 无法验证：caveat，不自动 reject，但必须记录。
