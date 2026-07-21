# PM 审核：PP 第二批全量 UI 修复 — 平台限制与已知差异

> 审核人：Ant（PM）  
> 审核日期：2026-07-21  
> 审核对象：commit `a8f629b` feat(android): full UI audit fixes  
> 对照文件：`pp_task_full_ui_audit_fixes_20260720.md`

---

## 审核结论：通过

28 项差异中完成 26 项，2 项死代码跳过（合理）。所有色值 alpha 转换经脚本逐一验证，全部正确。结构性改动（EndingOverlay 重写、ChoiceLayer/LineChatLayer 重做、暗层系统）和 P2 token 微调均按任务单精确实现。

---

## 已知平台限制（不需要修复）

### 1. backdrop-filter blur 不可用

**涉及组件：** ChoiceLayer（任务要求 blur 12dp）、LineChatLayer soft-screen 容器（blur 16dp）、ending-card（blur 20dp）  
**原因：** Jetpack Compose 原生不支持对底层内容做 backdrop-filter blur。  
**当前方案：** 用半透明渐变背景 + BlurMaskFilter shadow 做视觉替代。MinSpec 本身标注了 `blur(0)` no-blur fallback。  
**视觉影响：** 微小。半透明背景已足够区分层级，blur 主要是锦上添花。

### 2. CSS 多层 text-shadow 不可用

**涉及组件：** EndingOverlay 的 ending-label、title、ending-subtitle  
**原因：** Compose `Shadow` 只支持单层，CSS 可以叠多层 text-shadow。  
**当前方案：** 保留视觉权重更高的那一层（暗色投影保证可读性），省略装饰性的金色光晕层。  
**具体差异：**

| 元素 | MinSpec 要求 | 已实现 | 未实现 |
|---|---|---|---|
| ending-label | `0 0 18dp gold/0.40` + `0 1dp 3dp black/0.60` | `0 1dp 3dp black/0.60` | 金色光晕 |
| title | `0 2dp 16dp black/0.50` + `0 0 40dp gold/0.12` | `0 2dp 16dp black/0.50` | 金色远光晕 |
| ending-subtitle | `0 0 12dp gold/0.24` | `0 0 12dp gold/0.24` | 无缺失 |

**视觉影响：** 极小。金色光晕在小屏幕上几乎不可感知，暗色投影才是保证可读性的关键。

### 3. ChapterScreen 非当前项冗余渐变

**位置：** `ChapterScreen.kt` 非当前项背景  
**现状：** 用 `Brush.horizontalGradient(listOf(same, same))` 包装了一个纯色值。  
**原因：** 为了与当前项的 `horizontalGradient` 代码结构统一，Compose 要求 `background()` 参数类型一致（`Brush` vs `Color` 不能混用于同一 `if/else`）。  
**影响：** 零。视觉完全一致，性能开销可忽略。

---

## 死代码确认

PP 发现 `SectionOpeningScreen.kt` 和 `ChapterEndingScreen.kt` 无任何引用（已 grep 确认），运行时实际使用的是 `GameScreen.kt` 中的 `SectionOpeningOverlay` 和 `ChapterEndingOverlay`。

**PM 决定：** 暂不删除，后续统一清理时处理。

---

## 待真机验证项

以下改动需要在真机上确认视觉效果：

- [ ] EndingOverlay 三层结构和 ending-card 整体观感
- [ ] ChoiceLayer 底部对齐后的交互体验
- [ ] LineChatLayer soft-screen 容器内的聊天体验
- [ ] PrologueScreen / NameSetupScreen 多层渐变暗层效果
- [ ] StartScreen 分割线和新间距
- [ ] SystemPageBackground 白色呼吸高光效果
