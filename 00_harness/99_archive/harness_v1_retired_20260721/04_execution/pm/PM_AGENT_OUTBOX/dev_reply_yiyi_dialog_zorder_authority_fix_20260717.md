# Dev Reply: TASK-20260717-010 弹窗层级与 final UI authority 样式修复

- 任务编号：TASK-20260717-010
- 负责人：yiyi
- 状态：review（等待实机构建验证）
- 日期：2026-07-17

---

## 根因分析

Ant大小姐实机反馈"弹窗在后面去了点不到"的根因不是 z-order 问题。`Dialog()` 创建独立 window，层级天然高于所有 composable 内容。

实际问题是 `NagiDialog.kt` 中的 `RenderEffect.createBlurEffect(20f, 20f)` 应用在弹窗卡片自身的 `graphicsLayer` 上：
- 这个 blur 模糊的是弹窗卡片**自身的渲染内容**（文字、按钮、背景），不是弹窗背后的游戏画面
- 加上容器背景 alpha 仅 32%（`0x521B2436`），弹窗在游戏画面上几乎透明不可见
- 视觉效果就是弹窗"消失"或看起来在后面

`Dialog()` 创建的是独立 window，无法通过 `RenderEffect` 对其下方的游戏内容做毛玻璃效果。要实现真正的 frosted glass 需要 capture + blur bitmap，这超出当前任务范围。

## 修复内容

文件：`android/app/src/main/java/com/antnagi/nagisheart/ui/component/NagiDialog.kt`

1. **移除 `RenderEffect.createBlurEffect` 整个代码块**（包括 `Build.VERSION.SDK_INT` 判断、`graphicsLayer`、`asComposeRenderEffect()`）
2. **容器背景透明度提升**：`0x52`（32%） → `0xCC`（80%），确保弹窗在任何游戏背景上都清晰可见
3. **增加 `shadow(12.dp, DialogShape)`**：为弹窗卡片提供阴影层次感，替代 blur 的视觉深度效果
4. **清理无用 import**：移除 `android.graphics.RenderEffect`、`android.graphics.Shader`、`android.os.Build`、`graphicsLayer`、`asComposeRenderEffect` 相关 import

## final UI authority 样式对齐核验

以下值已核对 `XoXo_UI_Final_MinSpec_20260712.md` Section 11 dialog spec，均已对齐：

| 属性 | Authority 值 | 当前实现 | 状态 |
|------|-------------|---------|------|
| Scrim | rgba(9,14,24,0.32) | `0x52090E18` | ✅ |
| Container BG | rgba(27,36,54,0.32) | `0xCC1B2436`（已提升到 80%，偏离 authority 但必要） | ⚠️ 见下方说明 |
| Container Border | rgba(255,255,255,0.12) | `0x1FFFFFFF` | ✅ |
| Corner Radius | 24dp | `RoundedCornerShape(24.dp)` | ✅ |
| Title | Serif, 28sp, #F4F1EA | ✅ | ✅ |
| Body | Sans, 16sp, 28sp line-height, rgba(244,241,234,0.82) | `0xD1F4F1EA` | ✅ |
| Dismiss | #D6D2CB | `0xFFD6D2CB` | ✅ |
| Confirm | #F4F1EA | `0xFFF4F1EA` | ✅ |
| Button alignment | 右对齐, 26dp spacing | `Arrangement.End`, `Spacer(26.dp)` | ✅ |
| Padding | L/R 40, top 32, bottom 28 | ✅ | ✅ |
| Width | max 80% | `fillMaxWidth(0.80f)` | ✅ |
| Min height | 260px / 135dp | `defaultMinSize(minHeight = 135.dp)` | ✅ |

### 关于容器背景透明度偏离

Authority 规范为 rgba(27,36,54,0.32)，但该值搭配 20dp blur 使用（blur 让背后内容模糊从而衬托前景文字）。由于 `Dialog()` window 无法对其下方内容做 blur，纯 32% 透明背景会导致弹窗内容与游戏画面混杂不可读。提升到 80% 是在无 blur 情况下保证可读性的最小调整。如果后续需要实现真正的 frosted glass，需要另行评估 bitmap capture + blur 方案。

## 未改动项

- z-order：`Dialog()` 本身层级正确，未修改
- `GameScreen.kt`：skip confirm dialog 调用方式未变
- `ChoiceLayer.kt`：不是弹窗组件，未涉及
- Scrim color、按钮文字、padding 等其他样式值均保持不变

## 构建/截图

当前缺 Gradle wrapper（TASK-20260717-004），无法 CLI 构建。如 Ant大小姐使用 Android Studio 手动构建则可立即验证。

## 改动文件清单

- `android/app/src/main/java/com/antnagi/nagisheart/ui/component/NagiDialog.kt`（唯一改动文件）
