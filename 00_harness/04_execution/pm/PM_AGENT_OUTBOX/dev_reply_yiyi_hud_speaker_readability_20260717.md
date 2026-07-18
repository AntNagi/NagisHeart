# Dev Reply: TASK-20260717-015 HUD 统一与 speaker 金色可读性

- 任务编号：TASK-20260717-015
- 负责人：yiyi
- 状态：review（等待 PM 静态复核 + 实机构建验证）
- 日期：2026-07-17

---

## A. HUD icon / title / action 统一 final glass HUD

### Icon buttons（NagiIconButton.kt）

之前：36x36 容器无背景，图标直接浮在背景图上（裸白线）。

修复：
- 容器：36x36 保持不变
- 图标：18x18 居中保持不变
- 新增 glass backing：
  - `cutSmall` clip
  - 纵向渐变 `Color(0x4D0F1827)` → `Color(0x2E0F1827)`（30%→18% alpha）
  - 边框 `Color(0x1AFFFFFF)` 1dp（10% white）
  - `shadow(3.dp)` 亮底图分离
- 图标颜色不变：`hudColor.copy(alpha = 0.92f)`

### Title chip（NagiHud.kt）

更新为与 icon button 同源渐变：
- 背景从 013 的 flat `Color(0x4D0F1827)` 改为 `verticalGradient(0x38→0x14)`（22%→8%）
- 对齐 Section 15：`rgba(15,24,39,0.22)` → `rgba(15,24,39,0.08)`
- 边框回到 `Color(0x1AFFFFFF)` 对齐 authority `rgba(255,255,255,0.10)`
- h34、maxWidth 210、cutSmall、Sans Medium 13sp 不变

### Action chip（GameScreen.kt）

同步更新为 title chip 同源渐变 + 边框值，与 icon button / title chip 视觉统一。

### 统一效果

所有 HUD 元素（back、auto、save、backlog、title chip、action chip）现在共享：
- `cutSmall` 裁切
- 半透明深色渐变背景
- 1dp `0x1AFFFFFF` 边框
- 统一玻璃质感

没有做成厚按钮、实心黑按钮或 Material 默认按钮。

---

## B. Dialogue speaker / name 金色可读性

### DialogueLayer.kt

之前：speaker 使用 `NagiPalette.roseGold`（`#BFA08A`），speaker chip 包含 pentagon marker + 宽衬底。

修复：
- 金色从 `#BFA08A` 提亮到 `#E4CA8F`（对齐 Section 15）
- 轻衬底只包住 speaker 文本：
  - padding: left/right 9, top 3, bottom 4
  - 背景：水平渐变 `Color(0x4D101827)` → `Color(0x1A101827)`（30%→10%）
  - 金色边框 `Color(0x2ED7BE86)` 1dp（18% gold）
  - `cutSmall` 裁切
- 文字 shadow：`0xB8000000` offset 1dp blur 2（黑色 72%）
- 字体：Sans SemiBold 13sp，letterSpacing 0.04sp
- 移除了 pentagon marker 和旧的 150dp minWidth 宽衬底

### BacklogScreen.kt

- speaker 金色同步更新为 `#E4CA8F`
- letterSpacing 从 0.02 改为 0.04
- text shadow 加深为 `0xB8000000` offset 1dp blur 2（与 dialogue 一致）

### 限制

- 未做成厚 name plate 或整行黑底
- 保留金色方向
- 衬底为轻量级，只包住文字

---

## Compose 技术限制

- **blur**：Section 15 指定 icon button blur 12dp、speaker blur 8dp。Compose `RenderEffect.createBlurEffect` 仍只能模糊自身内容，不能实现 frosted glass 背景模糊。使用半透明渐变 + 边框 + shadow 作为 fallback，已对齐 Section 15.3 给 yiyi 的 Android fallback 说明。
- **radial highlight**：Section 15 icon button 中心 `rgba(247,249,252,0.08)` radial 高光未实现，Compose 原生不支持 radial gradient 作为 background modifier。视觉影响极小（8% 白色）。

---

## 修改文件清单

| 文件 | 改动 |
|------|------|
| `NagiIconButton.kt` | 加 glass backing（渐变+边框+shadow+cutSmall） |
| `NagiHud.kt` | title chip 改为渐变+对齐 Section 15 token |
| `GameScreen.kt` | action chip 同步渐变+对齐 |
| `DialogueLayer.kt` | speaker 金色→#E4CA8F，轻衬底+金色边框+text shadow |
| `BacklogScreen.kt` | speaker 金色→#E4CA8F，text shadow 加深 |

---

## 未触碰

- TT Start、App Icon、Web、Gradle wrapper
- story/script、BG mapping、资源删除
- 章节目录、nagiCall
- 013 已完成的滑动翻页和弹窗回调（未回退）

---

## 013 关系

本任务不回退 013 的任何改动。013 完成了：
- 剧情回顾 HorizontalPager 滑动翻页（保留）
- 弹窗 0x52 轻玻璃回调 + text shadow（保留）

本任务在 013 基础上追加：
- icon button glass backing（新增）
- title/action chip 从 flat color 改为渐变（优化）
- speaker 金色可读性保护（新增）

---

## 构建/验证状态

- 无 Gradle wrapper，无法 CLI 构建
- 需要 Android Studio 手动构建或 TASK-20260717-004 完成后 CLI 构建
- 实机验证仍需要：亮底图下 icon button 可见性、HUD 家族统一感、speaker 金色可读性
