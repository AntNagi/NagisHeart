# TASK TO WEWE - Web Mobile P0 Rework

日期：2026-07-18  
PM：一一  
执行人：Wewe（Web 开发 / Claude）  
任务 ID：`TASK-20260718-010`  
状态：assigned  
优先级：P0

---

## 0. 结论先行

Wewe，`TASK-20260718-005` 不能转 done。Ant 大小姐在移动端预览时反馈仍是“黑黢黢的屏幕”。PM 已用手机视口本地复核，确认当前 Web 移动端首屏显示不通过。

本任务不是入职培训，不是全量重做，也不是继续追加 P1。  
本任务只处理 Web 移动端 P0 返工：先让移动端首屏和关键入口能按 authority 正常显示。

---

## 1. 最高优先级边界

只允许修改 Web 相关文件：

- `web/`

禁止修改：

- `android/`
- Android Kotlin / Java / Compose / res / assets / Manifest / Gradle
- `story-data/` 正文
- BG mapping 权威文件
- `00_harness/08_authority_current/`
- TT Start / App Icon authority
- archive 目录

如发现 Android 或 authority 问题，只能写入回报，不得修改。

---

## 2. 必读文件

执行前必须读取：

1. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
2. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
3. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
4. `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_WEWE_20260718_WEB_P1_CONTROLLED_CONTINUATION.md`
5. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_p1_controlled_continuation_20260718.md`
6. `00_harness/05_reports/validation/PM_REVIEW_WEWE_WEB_P1_CONTROLLED_CONTINUATION_20260718.md`

---

## 3. PM 复核发现

PM 本地复核：

- 使用本地服务打开 `http://localhost:3000/web/index.html`
- 手机视口：`393 x 852`
- 结果：首屏实际截图为整屏深蓝/黑色
- Console：无明显 error
- DOM：已经挂载 `.splash-screen`、`.start-poster`、三层 Start v23 图片与 `start-hit`
- 图片资源：Start v23 三层图片均加载成功且为 200 OK
- 结论：不是资源不存在；是 Web 首屏实际显示/样式/渲染链路没有通过移动端验收

所以禁止只用“console 无错误 / 资源 200 OK”作为完成证明。

---

## 4. 本轮必须完成

### P0-A：修复移动端首屏黑屏

目标：

- 手机视口下打开 `/web/index.html`，必须能看到 TT Start v23 开屏视觉，而不是纯深色背景。
- Start v23 必须保持三层结构：background / title SVG / START SVG breathing。
- 不得换成 Android 资源，不得换底图，不得使用 archive。

必须验证：

- `393 x 852`
- `430 x 932`

### P0-B：补移动端首屏截图证据

完成后必须输出截图到：

`00_harness/05_reports/validation/web_mobile_p0_rework_20260718/`

至少包含：

- `web_mobile_start_393x852.png`
- `web_mobile_start_430x932.png`

如能继续到主页/游戏页，可追加，但本任务最低验收先看 Start 首屏。

### P0-C：检查移动端关键样式是否存在断点

至少检查并修正以下移动端基础口径：

- Start / Splash 是否铺满手机屏幕；
- HUD / action chip / icon backing 是否不会超出安全区；
- system pages 是否不是纯黑空屏；
- game screen 背景是否能正常显示；
- overlays 是否在手机宽度下可读、可点。

不要大改视觉风格。按 authority 修显示链路和移动端布局基础问题。

---

## 5. 禁止事项

- 不得修改 Android。
- 不得重写项目架构。
- 不得把 Start 图换成临时纯色、demo 图或 archive 资源。
- 不得用“深色主题本来就是黑”解释首屏黑屏；Start v23 是有明确人物图和字层的。
- 不得只回报 console 无错误。
- 不得自行改 authority 文档。

---

## 6. 回传要求

完成后写入：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_mobile_p0_rework_20260718.md`

回报必须包含：

1. 根因说明：为什么移动端首屏之前是黑/深色空屏；
2. 修改文件清单；
3. 两个移动端视口截图路径；
4. Console 检查结果；
5. 资源加载检查结果；
6. Android touched: no；
7. cleanup status。

---

## 7. 完成定义

只有同时满足以下条件，才允许转 review：

- `393 x 852` 和 `430 x 932` 下 Start v23 可见；
- 有截图文件；
- 回报文件完整；
- 未修改 Android；
- 未修改 authority_current；
- 未引入 archive 资源。

