# Dev Reply: TASK-20260717-013 实机反馈二轮回修

- 任务编号：TASK-20260717-013
- 负责人：yiyi
- 状态：review（等待 PM 静态复核 + 实机构建验证）
- 日期：2026-07-17

---

## A. HUD Title Chip 可见性提升

**问题**：实机上 title chip 背景几乎不可见，文字看起来直接浮在背景图上。

**修复**：
- `NagiHud.kt`：title chip 背景从 `Color(0x380F1827)` (~22% alpha) 提升到 `Color(0x4D0F1827)` (~30% alpha)
- 边框从 `Color(0x1AFFFFFF)` (~10%) 提升到 `Color(0x29FFFFFF)` (~16%)
- 保持 h34、maxWidth 210dp、cutSmall、Sans Medium 13sp 不变
- 仍为轻玻璃 HUD，不是厚按钮

**Action chip 同步**：
- `GameScreen.kt`：skip action chip 同步更新为相同的 `0x4D0F1827` bg + `0x29FFFFFF` border
- Title chip 和 action chip 视觉上属于同一 family

**技术说明**：真背景 blur 仍受 Compose `RenderEffect` 限制（只能模糊自身内容），使用半透明背景+边框+文字阴影替代。30% alpha 是在"可见托底"和"不变厚重"之间的平衡点。如果实机仍不够明显，可以继续微调 alpha 但不应超过 40%。

---

## B. 剧情回顾左右滑动翻页

**问题**：Ant 不想看到"← 上一页"/"下一页 →"文字按钮。

**修复**：
- `BacklogScreen.kt`：从手动 `currentPage` + 文字按钮 改为 `HorizontalPager`（Compose Foundation stable API）
- 左右滑动手势翻页，无需点击任何按钮
- 移除所有 "← 上一页" / "下一页 →" 文字按钮
- 保留轻量页码 indicator（底部居中 `"3 / 4"` 样式，12sp，`0x99F4F1EA`）
- 每页仍为 8 条，默认打开最后一页（最新内容）
- 移除了不再需要的 `LazyColumn`、`clickable`、`MutableInteractionSource` 等 imports

**不变**：
- BacklogItem 样式完全保留（金色 speaker、Serif 文字、阴影）
- 不回到纵向滚屏
- Header bar（返回按钮 + "剧情回顾" 标题）不变

---

## C. 弹窗视觉回调到 Authority 轻玻璃

**问题**：当前弹窗容器 bg alpha 为 80%（`0xCC`），在实机上像厚重深色大卡片，偏离 XoXo authority 的轻玻璃风格。

**修复**：
- `NagiDialog.kt`：容器背景从 `Color(0xCC1B2436)` (80%) 回调到 `Color(0x521B2436)` (32%)
- 精确对齐 authority Section 11：`rgba(27, 36, 54, 0.32)`
- 遮罩保持 `Color(0x52090E18)` 对齐 authority：`rgba(9, 14, 24, 0.32)`
- 边框保持 `Color(0x1FFFFFFF)` 对齐 authority：`rgba(255, 255, 255, 0.12)`
- 阴影保持 `shadow(12.dp)` 提供层次感

**可读性保障**（无 blur 补偿）：
- 标题文字：添加 text shadow (`0xB8000000`, offset 2px, blur 12)
- 正文文字：添加 text shadow (`0xB8000000`, offset 2px, blur 10)
- 按钮文字：添加 text shadow (`0xB8000000`, offset 2px, blur 8)
- 所有文字颜色、字号、布局不变

**不变**：
- 不恢复 `RenderEffect.createBlurEffect`（仍会模糊弹窗自身文字/按钮）
- z-order 正确（`Dialog()` 独立 window）
- 圆角 24dp、L/R 40dp + top 32dp + bottom 28dp padding
- Serif 28sp 标题、16sp/28sp 正文、右对齐按钮 26dp 间距

**技术限制**：Authority 要求 `blur 20dp` frosted glass 效果，但 Compose `RenderEffect.createBlurEffect` 作用于 composable 自身 graphicsLayer（模糊自己的内容），不能实现模糊背景。真正的 frosted glass 需要截取背景 bitmap 并手动 blur，超出当前任务范围。当前使用 32% 半透明 + 12dp shadow + text shadows 作为最接近 authority 的可实现方案。

---

## 修改文件清单

| 文件 | 改动 |
|------|------|
| `NagiHud.kt` | title chip bg 0x38→0x4D, border 0x1A→0x29 |
| `GameScreen.kt` | action chip bg 0x38→0x4D, border 0x1A→0x29 |
| `BacklogScreen.kt` | HorizontalPager 滑动翻页，移除文字按钮 |
| `NagiDialog.kt` | 容器 bg 0xCC→0x52, 全文字加 text shadow |

---

## 未触碰

- TT Start、App Icon、Web、Gradle wrapper
- story/script、BG mapping、资源删除
- 章节目录、nagiCall
- 章节 opening/clear/section clear（009 范围，未改）

---

## 构建/验证状态

- 无 Gradle wrapper，无法 CLI 构建
- 需要 Android Studio 手动构建或 TASK-20260717-004 完成后 CLI 构建
- 实机验证仍需要：title chip 可见度、滑动翻页手感、弹窗在游戏画面上的可读性
