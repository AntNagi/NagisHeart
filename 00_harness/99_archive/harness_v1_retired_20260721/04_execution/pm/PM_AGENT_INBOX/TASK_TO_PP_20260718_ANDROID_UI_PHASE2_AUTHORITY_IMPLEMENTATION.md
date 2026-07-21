# TASK TO PP - Android UI Phase 2 Authority Implementation

日期：2026-07-18  
PM：一一  
执行人：Android 开发工程师 PP  
任务 ID：`TASK-20260718-012`  
状态：assigned  
优先级：P0

---

## 0. PM 批准

PP，`TASK-20260718-009` Phase 1 只读差异审计已通过 PM 复核。

你可以进入 Phase 2 实现，但必须严格按本任务单范围执行。  
不要扩大范围，不要自行清理疑似闲置文件，不要改 story / BG / Web / App Icon / TT Start。

PM 复核文件：

`00_harness/05_reports/validation/PM_REVIEW_PP_ANDROID_UI_TAKEOVER_DIFF_20260718.md`

---

## 1. 必读

执行前必须读取：

1. `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_ui_authority_takeover_diff_20260718.md`
2. `00_harness/05_reports/validation/PM_REVIEW_PP_ANDROID_UI_TAKEOVER_DIFF_20260718.md`
3. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
4. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
5. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`

---

## 2. 必须修改范围

### P0-A：`NagiIconButton.kt`

目标：HUD icon button 轻玻璃化，不再有厚重黑边 / 八边形实体按钮感。

要求：

- 移除或替换当前 Compose elevation shadow；
- 使用更接近 CSS `drop-shadow 0 3dp 12dp rgba(0,0,0,0.42)` 的柔和阴影；
- 补 center radial highlight；
- 修正 icon tint alpha 链：不要把已经 82% alpha 的 `hudColor` 再乘 0.94 导致偏暗；
- 如技术可行，补轻量 icon halo；不可行则在回报中说明，不得做成厚重外发光。

### P0-B：`NagiDialog.kt`

目标：弹窗保持 authority no-blur fallback token，但视觉变轻。

要求：

- card bg / scrim / border / radius / padding / text token 不得乱改；
- 替换 Compose elevation shadow，避免厚重卡片边缘；
- 不得回到 80%+ 深色厚卡；
- 不得使用会模糊弹窗自身文字/按钮的 RenderEffect。

### P0-C：`ChapterScreen.kt`

目标：章节目录重建为 authority catalog-panel list。

要求：

- 移除 timeline / diamond 节点视觉；
- 使用 system-level dark glass catalog panel；
- 列表 item 支持 current / unlocked / completed / locked；
- current item 使用 gold sweep / gold border；
- 保留现有章节/小节数据来源与跳转能力；
- 保留 replay / jump 功能；
- 底部动作：返回主页 / 继续当前章节，按 authority 轻玻璃语言。

### P0-D：`ChapterOpeningScreen.kt`

目标：新游戏开章入口与游戏内 opening authority 一致。

要求：

- 不得使用纯色背景；
- 使用 story/current bg + dark overlay；
- 标题文字组加 light glass backing；
- 保持 chapter name / title / subtitle / 轻触继续；
- 不得使用与 authority 无关的金钻装饰独立风格。

### P1-E：`GameScreen.kt`

目标：仅补齐微光，不重设计。

要求：

- `GlassBacking` 补 center highlight；
- `ClearCard` 补 center micro-light；
- 不改 title chip / action chip；
- 不改剧情流、BG mapping、BGM、资源路径。

---

## 3. 本轮明确不改

禁止修改：

- `story-data/`
- BG mapping
- TT Start
- App Icon V4
- Web
- BGM
- archive
- unrelated cleanup
- `NagiHud.kt`
- `DialogueLayer.kt`
- `BacklogScreen.kt`
- `SectionOpeningScreen.kt`
- `ChapterEndingScreen.kt`
- `SectionClearScreen.kt`（除非先回报 PM 获批）

PM 决策：

- `SectionOpeningScreen.kt` 当前未见 NavGraph 直接调用，Phase 2 不改；
- `ChapterEndingScreen.kt` 当前未见 NavGraph 直接调用，Phase 2 不改；
- `SectionClearScreen.kt` 运行时会调用，但 Phase 1 审计为基本合规，Phase 2 不改。

---

## 4. 回传要求

完成后写入：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_ui_phase2_20260718.md`

回报必须包含：

1. 修改文件清单；
2. 每个修改点对应的 authority section；
3. 是否保留原有功能；
4. `git diff --check` 结果；
5. 构建 / Android Studio 验证状态；
6. 截图验证点说明：
   - 明亮背景 HUD；
   - 深色背景 HUD；
   - skip-section dialog；
   - chapter catalog；
   - chapter opening；
7. 禁止范围未触碰确认；
8. cleanup status。

---

## 5. 完成定义

只有同时满足以下条件，才可转 review：

- 只修改批准范围内文件；
- HUD / dialog 变轻，不再厚重；
- Chapter catalog 变为 authority list panel；
- Chapter opening 不再使用纯色/独立旧风格；
- GameScreen 只补微光；
- 回报完整；
- 未触碰禁止范围。

