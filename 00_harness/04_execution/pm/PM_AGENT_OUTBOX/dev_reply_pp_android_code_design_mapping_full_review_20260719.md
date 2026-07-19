# Dev Reply — PP Android Code Design Mapping Full Review

- Task ID: `TASK-20260719-011`
- From: PP (Android)
- To: PM 一一
- Date: 2026-07-19
- Status: `review`

---

## 完成情况

报告已写入：`00_harness/05_reports/validation/ANDROID_CODE_DESIGN_MAPPING_PP_20260719.md`

截图证据目录：`00_harness/05_reports/validation/android_code_design_mapping_pp_20260719_screens/`

---

## 关键发现摘要

### 已确认正确实现的 authority 映射

| Authority 条目 | 对应组件 | 状态 |
|---|---|---|
| §17.1 对话框 (dialogue-box) | `DialogueLayer.kt` — cut-md, bg 0.54→0.70, border 0.08, shadow, 金色 speaker 芯片 | ✅ 已实现 |
| §17.2 HUD 标题芯片 | `NagiHud.kt` — cut-sm, bg 0.30→0.12, border 0.12, text shadow 0.45 | ✅ 已实现 |
| §17.2 图标按钮 | `NagiIconButton.kt` — cut-sm, bg 0.34→0.22, border 0.12, drop shadow | ✅ 已实现 |
| §17.2 跳过芯片 | `GameScreen.kt` — cut-sm, bg 0.30→0.12, border 0.12 | ✅ 已实现 |
| §17.3 确认弹窗 | `NagiDialog.kt` — cut-md, bg 0.56→0.52, border 0.08, scrim 0.40 | ✅ 已实现 |
| §17.4 长旁白宽度 | `LongNarrationLayer.kt` — padding 18dp, 内距 20dp, backdrop 0.44 | ✅ 已实现 |
| §18 终局页 | `GameScreen.kt EndingOverlay` — 三层结构（内容/状态/操作），仅"返回主页" | ✅ 已实现 |
| §18.2 终局后主页 | `StartScreen.kt` — hasCompletedEnding → "新的故事" | ✅ 已实现 |
| §18.3 开场白字号 | `PrologueScreen.kt` — 28sp, lineHeight (28×1.68) | ✅ 已实现 |
| StoryEngine ending 优先级 | `StoryEngine.kt:56` — isEndingNode() 在 isNode() 之前 | ✅ P0 修复已就位 |

### P0 未修复项

| 问题 | 状态 | 说明 |
|---|---|---|
| **§17.6 Section Clear 页面仍然存在** | ❌ 未修复 | `SectionClearScreen.kt` 仍然活跃，路由 `sectionClear` 仍注册在 NavGraph 中。模拟器截图 A10 确认该页面仍然渲染。 |

### 截图证据

已捕获 12 张（A01, A01b, A02, A03, A04×2, A05, A08, A09, A10, A14, A15）。

未捕获 5 张（A06 长文本Backlog, A07 长旁白, A11 Chapter Clear, A12 终局页, A13 终局后Home）——需要深度剧情推进才能到达这些状态，建议 Ant 真机验证。

### Ant 9 个问题分类结果

| # | 问题 | 分类 |
|---|---|---|
| 1 | 弹窗还是圆角矩形线框 | 已修复（uncommitted），Ant 需 rebuild |
| 2 | HUD/导航/标题/图标不匹配 | 已修复（uncommitted），Ant 需 rebuild |
| 3 | Backlog 默认页/文字裁切 | 部分修复，需真机验证 |
| 4 | 终局突然出现/继续/卡住 | 已修复（StoryEngine priority fix） |
| 5 | 画廊未显示已解锁结局 | 已修复（移除 remember 包裹） |
| 6 | 全局文字衬底太弱 | 已修复（token 值已按 authority 应用） |
| 7 | Section Clear 页面应移除 | **❌ 未修复** — P0 |
| 8 | 终局页 PRD/UI 确认实现 | 已实现（未能在模拟器中验证视觉） |
| 9 | 长旁白宽度太窄 | 已修复（padding 18dp） |

---

## PP 建议

**继续增量修复**，不需要重构或重写。

最小补丁清单：
1. **P0**：移除 Section Clear 页面（修改 `NavGraph.kt` + `GameScreen.kt`，跳过后直接进入下一节）
2. **P1**：commit 所有修改 → rebuild → install → Ant 真机验证
3. **P1**：Ant 真机验证 A06/A07/A11/A12/A13 状态

---

## XoXo 审查项

请 XoXo 审查以下 UI 映射截图，确认 Compose 无 blur 降级方案是否可接受：
1. §17.1 对话框 — A02/A03
2. §17.3 确认弹窗 — A04
3. §17.2 HUD — A02/A03
4. §17.6 Section Clear 移除确认 — A10
5. §17.4 长旁白宽度 — 需真机截图
6. §18 终局页 — 需真机截图

---

所有修改目前为 uncommitted 状态。等待 PM 审批后执行 Section Clear 移除 + commit + rebuild。
