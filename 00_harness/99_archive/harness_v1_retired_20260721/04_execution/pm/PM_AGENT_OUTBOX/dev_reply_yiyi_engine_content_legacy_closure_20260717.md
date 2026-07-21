# Dev Reply: TASK-20260717-009 剧情文案/BG/交互规则/章节UI闭环

- 任务编号：TASK-20260717-009
- 负责人：yiyi
- 状态：review（等待 PM 静态复核 + 实机构建验证）
- 日期：2026-07-17

---

## 子任务完成情况

### A. 过滤 autoAdvance/→/空白选项（已完成）

- `StoryEngine.kt`：新增 `getPlayerVisibleChoices()` 方法，在 `getVisibleChoices()` 基础上额外过滤 `autoAdvance == true`、`label == "→"`、`label.isBlank()`
- `GameViewModel.kt`：`presentChoices()` 在显示给玩家前过滤上述三类占位选项
- **关键设计**：`currentChoices`（line 579）仍使用 `getVisibleChoices()`（仅 condition 过滤），确保 `enterNode()`（line 607）和 `onDialogueComplete()`（line 695）中的自动路由逻辑不受影响
- 涉及文件：`StoryEngine.kt`、`GameViewModel.kt`

### B. 剧情回顾改翻页（已完成）

- `BacklogScreen.kt`：从 `LazyColumn` 滚动改为翻页导航
- 每页 8 条（`ENTRIES_PER_PAGE = 8`），默认打开最后一页
- "← 上一页" / "下一页 →" 文字按钮 + 页码显示（"1 / N"）
- 保留原有 BacklogItem 样式（金色 speaker、Serif 文字、阴影）
- 涉及文件：`BacklogScreen.kt`

### C. wc_offer BG 同步（已完成）

- `scene_visuals.json`：`wc_offer` 场景的 `bg` 从 `assets/bg/back.jpg` 改为 `assets/bg/living_room.jpg`
- 两个文件均已验证存在于 `android/app/src/main/assets/` 目录

### D. 文案同步 好卖→有用（已完成）

- `nodes.json` line 5399：`"会长想让我去，是因为我好卖吧。"` → `"会长想让我去，是因为我有用吧。"`

### E. nagiCall（deferred）

- 按 PM 口径保持 deferred，未作改动

### F. 全场景 uiTheme→Dark（已完成）

- `scene_visuals.json`：全部 35 个 `"uiTheme": "Light"` 改为 `"uiTheme": "Dark"`
- 章节/story gameplay 页面现在统一使用 Dark 可读性方案

### G. 章节 UI 按 XoXo Section 14 实现（已完成）

#### G1. 章节/小节 Opening 轻透明雾面托底（Section 14.1）
- `GameScreen.kt`：新增 `GlassBacking` composable
- 水平渐变：`0x4D101827` → `0x24101827` → `Transparent`
- `cutMedium` 形状 + `1dp Color(0x14FFFFFF)` 边框
- 应用于 `ChapterOpeningOverlay` 和 `SectionOpeningOverlay`

#### G2. Chapter Clear 使用 ClearCard（Section 14.2）
- `GameScreen.kt`：新增 `ClearCard` composable
- 垂直渐变：`0x331B2436` → `0x241B2436` → `0x3D1B2436`
- `cutMedium` 形状 + `1dp Color(0x14FFFFFF)` 边框
- "CHAPTER CLEAR" 标签 11sp，letterSpacing 0.14em，金色
- 标题 Serif 30sp，正文 13sp lineHeight 1.8

#### G3. Section Clear 使用 ClearCard（Section 14.3）
- `SectionClearScreen.kt`：整体重写，使用与 ClearCard 相同的玻璃渐变
- "SECTION CLEAR" 标签 11sp，letterSpacing 0.14em，金色
- 标题 Serif 28sp，正文 13sp lineHeight 1.8
- "返回目录" / "进入下一节" 左右布局

#### G4. HUD Title Chip（Section 14.4）
- `NagiHud.kt`：title chip 改为 h34、maxWidth 210dp
- bg `Color(0x380F1827)` + border `Color(0x1AFFFFFF)` 1dp + `cutSmall`
- Sans Medium 13sp，letterSpacing 0.02sp，color `0xE0F4F1EA`

#### G5. Action Chip（Section 14.4）
- `GameScreen.kt`：Skip 按钮改为 action chip 样式
- h34、`cutSmall`、bg `Color(0x380F1827)` + border `Color(0x1AFFFFFF)` 1dp
- Sans Medium 12sp

---

## Backlog 审计结论

- `showDialogueLine()` 和 `showResponseLine()` 中记录，仅包含实际走过的对话和回应
- Section 切换时 `backlog.clear()`，无乱序/重复问题
- 结论：Backlog 记录逻辑正确，无需改动

---

## 阻塞/需 PM 决策

1. **u20j BG**：`scene_visuals.json` 中 `u20j` 场景当前使用 `bg_u20j_worldcup_goal_kick.jpg`（存在）。任务单提到目标 `vs_u20_goal.jpg`，但该文件**不存在**于 `android/app/src/main/assets/bg/`。已保留当前图，不制造新断链。需 PM 确认：是补资源、改用其他现有资源名，还是保留当前图。

2. **Blur 效果**：Section 14 规格中的 `blur 10dp / 12dp / 16dp` 使用 `RenderEffect.createBlurEffect` 在标准 Compose 中只能模糊 composable 自身内容，无法实现模糊背景（frosted glass）。与 TASK-20260717-010 NagiDialog 相同限制。已使用半透明背景渐变 + 1dp 边框 + `cutMedium/cutSmall` 形状作为视觉替代，效果接近但无真实模糊。

---

## 修改文件清单

| 文件 | 改动 |
|------|------|
| `story-data/nodes.json` | 好卖→有用 |
| `story-data/scene_visuals.json` | wc_offer BG + 35x uiTheme→Dark |
| `android/.../engine/StoryEngine.kt` | 新增 `getPlayerVisibleChoices()` |
| `android/.../ui/viewmodel/GameViewModel.kt` | `presentChoices()` 过滤 autoAdvance/→/空白 |
| `android/.../ui/screen/BacklogScreen.kt` | 翻页重写 |
| `android/.../ui/screen/GameScreen.kt` | GlassBacking + ClearCard + action chip |
| `android/.../ui/screen/SectionClearScreen.kt` | clear-card 重写 |
| `android/.../ui/component/NagiHud.kt` | title chip 更新 |

---

## 未触碰

- TT Start、App Icon、Gradle wrapper、资源删除
- story/script 权威源（仅按 PM 口径同步了 nodes.json 一处文案和 scene_visuals.json BG/theme）
- nagiCall（deferred）
- 章节目录（pending，不补做）
