# PM Review - PP Android UI Authority Takeover Diff

日期：2026-07-18  
PM：一一  
对象：`TASK-20260718-009` Phase 1 只读差异审计  
回报文件：`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_ui_authority_takeover_diff_20260718.md`

---

## 1. PM 结论

PP 的 Phase 1 差异审计通过。

本次回报符合 PM 要求：

- 已按入职包读取权威文件；
- 未直接改代码；
- 差异按 authority token 逐项对比；
- 能区分“token 数值正确但 Compose 渲染方式错误”和“设计结构本身不符合 authority”；
- 明确列出禁止范围；
- 对不确定路由没有擅自处理，而是交 PM 决策。

批准进入 Phase 2 实现，但必须按本文限定范围执行。

---

## 2. PM 路由决策

经 PM 静态检查 `NavGraph.kt` 与 `GameScreen.kt`：

### 2.1 必须纳入 Phase 2 的运行时路径

1. `NagiIconButton.kt`
   - HUD icon button 实机可见；
   - 当前重阴影是 Ant 反馈“按钮太重”的核心原因；
   - Phase 2 必须修。

2. `NagiDialog.kt`
   - `NavGraph.kt` Start new game confirm 等路径会调用；
   - Game skip-section dialog 也需要统一 authority fallback；
   - Phase 2 必须修 shadow 渲染方式。

3. `ChapterScreen.kt`
   - `NavGraph.kt` `Routes.CHAPTER` 明确调用；
   - 当前 timeline / diamond 布局与 authority catalog-panel 重大不符；
   - Phase 2 必须重建为 authority 章节目录。

4. `ChapterOpeningScreen.kt`
   - `NavGraph.kt` `Routes.CHAPTER_OPENING` 明确调用；
   - 新游戏从 NameSetup 后会进入该独立 screen；
   - Phase 2 必须对齐 authority opening 口径，不得继续与 GameScreen 内联 opening 视觉割裂。

5. `GameScreen.kt`
   - 游戏内 `ChapterOpeningOverlay`、`SectionOpeningOverlay`、`ChapterEndingOverlay` 为运行时 overlay；
   - 当前主体 token 基本正确，但缺 center highlight / micro-light；
   - Phase 2 只做小补齐，不得重设计。

### 2.2 暂不纳入 Phase 2 的文件

1. `SectionOpeningScreen.kt`
   - 当前未在 `NavGraph.kt` 看到直接路由调用；
   - Phase 2 不改；
   - 标记为后续 dead-code / cleanup audit candidate。

2. `ChapterEndingScreen.kt`
   - 当前未在 `NavGraph.kt` 看到直接路由调用；
   - `GameScreen.kt` 内联 `ChapterEndingOverlay` 才是运行时章节结束路径；
   - Phase 2 不改；
   - 标记为后续 dead-code / cleanup audit candidate。

3. `SectionClearScreen.kt`
   - `NavGraph.kt` 运行时会调用；
   - PP 审计结论为基本合规；
   - Phase 2 不改，除非实现过程中发现阻塞级问题，必须先回报 PM。

---

## 3. Phase 2 批准范围

批准 PP 执行 `TASK-20260718-012`：

1. `NagiIconButton.kt`
   - 去掉 Compose elevation shadow 的厚重边缘；
   - 改为更接近 CSS drop-shadow 的柔和阴影实现；
   - 补 center radial highlight；
   - 修正 icon tint alpha 链，避免 82% 再乘 94% 导致偏暗；
   - 如技术可行，补轻量 icon halo；不可行则回报限制，不得硬做厚重效果。

2. `NagiDialog.kt`
   - token 不变；
   - 只替换 shadow 渲染方式，让弹窗轻、柔、浮起；
   - 不得回到 80% 厚重深卡；
   - 不得用 RenderEffect 模糊弹窗自身内容。

3. `ChapterScreen.kt`
   - 从 timeline / diamond 重建为 authority catalog-panel list；
   - 保留现有数据和跳转能力；
   - 列表必须支持 current / unlocked / completed / locked 状态；
   - 底部动作按 authority：返回主页 / 继续当前章节。

4. `ChapterOpeningScreen.kt`
   - 对齐 authority chapter opening：story bg + dark overlay + light glass backing + readable title group；
   - 不得纯色背景；
   - 不得金钻装饰独立风格；
   - 保持点击继续。

5. `GameScreen.kt`
   - 只补 GlassBacking center highlight；
   - 只补 ClearCard center micro-light；
   - 不改 HUD title/action chip；
   - 不改 story flow / bg mapping / BGM。

---

## 4. 禁止范围

Phase 2 禁止修改：

- `story-data/`
- BG mapping authority
- TT Start
- App Icon V4
- Web
- BGM
- archive
- unrelated cleanup
- `SectionOpeningScreen.kt`
- `ChapterEndingScreen.kt`
- `SectionClearScreen.kt`（除非先回报 PM 获批）
- `NagiHud.kt`
- `DialogueLayer.kt`
- `BacklogScreen.kt`

---

## 5. 验收要求

PP 完成后必须回传：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_ui_phase2_20260718.md`

回报必须包含：

1. 修改文件清单；
2. 每个文件对应的 authority section；
3. 是否保留原功能；
4. `git diff --check` 结果；
5. 构建 / Android Studio 验证状态；
6. 至少 5 个实机/模拟器截图验证点说明：
   - 明亮背景 HUD；
   - 深色背景 HUD；
   - skip-section dialog；
   - chapter catalog；
   - chapter opening；
7. 明确声明禁止范围未触碰；
8. cleanup status。

---

## 6. PM 状态

`TASK-20260718-009` Phase 1：review 通过。  
新建 `TASK-20260718-012` Phase 2：assigned to PP。

