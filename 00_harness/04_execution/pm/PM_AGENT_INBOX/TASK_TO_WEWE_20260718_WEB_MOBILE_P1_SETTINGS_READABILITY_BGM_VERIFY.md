# TASK TO WEWE - Web Mobile P1 Settings readability and BGM verification

任务编号：`TASK-20260718-018`  
负责人：Wewe（Web / Claude）  
PM：一一  
日期：2026-07-18  
优先级：P1  

---

## 0. 任务目标

DeDe 已完成 `TASK-20260718-017` 独立复测，确认 `TASK-20260718-016` 的 5 项功能 reject 均已通过，无 P0。

但 DeDe 发现 3 个后续 caveat：

1. Settings overlay 在明亮剧情背景上对比度明显不足，移动端可读性不稳定。
2. BGM slider 已能从 50% 改到 80%，但 reload 持久化未完整验证。
3. 实际 audio 音量链路未完整验证；如当前架构没有可验证 audio 元素，需要说明原因并补最小验证。

请做一轮 Web-only P1 修复 / 验证补齐。

---

## 1. 必读

1. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/qa_reply_dede_web_mobile_after_wewe_016_20260718.md`
2. `00_harness/05_reports/validation/PM_REVIEW_DEDE_WEB_MOBILE_AFTER_WEWE_016_20260718.md`
3. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_mobile_qa_reject_fix_round2_20260718.md`
4. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
5. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`

---

## 2. 允许范围

只允许修改：

- `web/`

禁止修改：

- `android/`
- story-data 正文
- BG mapping authority
- `00_harness/08_authority_current/`
- TT authority
- archive
- Android / Gradle / Manifest / app icon

必须在回报中写明：

- `Android touched: no`

---

## 3. 具体要求

### 3.1 Settings 可读性

修复 Settings overlay 在明亮背景上的可读性。

要求：

- 使用当前 authority 的 dark glass / fallback 语言；
- 不做厚重 Material 默认面板；
- 文字、数值、slider track / thumb 在高亮背景下必须清楚；
- 保持设置页值列右对齐原则；
- BGM 行仍为可操作 slider。

### 3.2 BGM 持久化验证

至少验证：

- slider 从 50% 改为 80%；
- reload 或重新打开页面后仍保持 80%，或明确说明当前设置持久化机制的实际 key / 数据结构；
- 写入 / 读取 localStorage 的证据。

### 3.3 实际 audio 音量链路

验证 slider 是否实际被 AudioManager / audio 播放链路消费。

如果当前 Web 架构因为 autoplay 或 audio 元素懒创建导致无法直接观察 `<audio>`：

- 请说明当前链路；
- 给出最小可验证证据；
- 不要虚报“BGM 已完整播放验证”。

### 3.4 视口证据

如可补精确 `393x852` / `430x932` 移动视口截图，请补。

如果工具限制仍无法精确设置，请如实说明实际视口，不要虚报。

---

## 4. 输出

回报文件：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_mobile_p1_settings_bgm_verify_20260718.md`

证据目录：

`00_harness/05_reports/validation/web_mobile_p1_settings_bgm_verify_20260718/`

回报必须包含：

- 修改文件；
- Settings 可读性前后说明；
- BGM 持久化验证；
- audio 音量链路验证或限制说明；
- 截图 / DOM / computed style / localStorage 证据路径；
- console/resource 检查；
- `Android touched: no`；
- cleanup status。

---

## 5. 完成后

按 WORKER_LOOP 回报 PM 一一。

本任务完成后，PM 再决定是否让 DeDe 做短回归，或直接提交 Ant 大小姐 Web 浏览器验收。
