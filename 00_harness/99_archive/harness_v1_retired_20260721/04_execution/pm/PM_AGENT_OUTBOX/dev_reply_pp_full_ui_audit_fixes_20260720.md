# PP 开发回传 — 全量 UI 核对修复

> 执行人：PP（Android 开发）  
> 日期：2026-07-20  
> 任务来源：Lulu `pp_task_full_ui_audit_fixes_20260720.md`  
> 权威文件：`design/NagisHeart_UI_Authority_XoXo_v1_0.html` + MinSpec §14/§18/§19/§20/§21

---

## P0 — 结构性缺失

### P0-1 SectionOpeningScreen.kt / P0-2 ChapterEndingScreen.kt

**发现重复路径风险：** 这两个独立 Screen 文件没有被任何地方引用（已 grep 确认），是死代码。运行时实际使用的是 `GameScreen.kt` 中的 `SectionOpeningOverlay`（第664行）和 `ChapterEndingOverlay`（第727行），它们已经实现了 story BG + 玻璃卡片（GlassBacking/ClearCard）。

**结论：** P0-1 和 P0-2 无需改动活跃代码。建议 PM 评估是否删除死代码文件 `SectionOpeningScreen.kt` 和 `ChapterEndingScreen.kt`。

### P0-3 EndingOverlay（GameScreen.kt）✅

已完成完整重写。改动内容：

| 项 | 旧值 | 新值 |
|---|---|---|
| 遮罩 | 平面 0.4 | 四段渐变 0.10→0.28→0.62→0.82 |
| 内容位置 | 居中 | ending-card 底部卡片，left/right=18 bottom=34 |
| 卡片背景 | 无 | linear(0.56→0.80) + 两层 radial gold + inset highlight |
| 卡片描边 | 无 | rgba(255,255,255,0.10) 1dp |
| 卡片裁切 | 无 | cut-md |
| 卡片阴影 | 无 | blur 54dp, y=22, rgba(0,0,0,0.40) |
| ending-label | caption + 按类型变色 | 12sp + letter-spacing 0.14em + 统一 gold #D7BE86 + text-shadow |
| subtitle | 未显示 | 新增 13sp + letter-spacing 0.06em + gold 0.92 |
| title | titlePage | serif 32sp, weight 400, lineHeight 1.16, text-shadow |
| description | narration + silverBlue | 15sp, lineHeight 1.9, rgba(247,249,252,0.88), text-shadow |
| 状态反馈 | cutSmall 背景 | 无边框无底色, 圆形 gold dot + glow |
| 按钮 | cutMedium, height 48, vertical gradient | cut-sm, min-height 38, horizontal gold gradient, gold border |

---

## P1 — 组件级修复

### P1-1 ChoiceLayer.kt ✅

| 项 | 旧值 | 新值 |
|---|---|---|
| 布局对齐 | BiasAlignment(0,-0.14) 居中偏上 | Alignment.BottomCenter 底部 |
| 外边距 | horizontal 34dp | horizontal 18dp, bottom 34dp |
| 选项背景 | horizontalGradient 三色渐变 | 单色 rgba(16,24,39,0.48) |
| Pentagon 标记 | 有 | 移除 |
| 行 padding | start 34 end 14 top/bottom 8 | horizontal 16, vertical 14 |
| 文字颜色 | textPrimary (1.0) | rgba(247,249,252,0.92) |
| 选项间 gap | spacing.m | 10dp |
| 裁切 | cutSmall | cutSmall（不变） |

### P1-2 LineChatLayer.kt ✅

| 项 | 旧值 | 新值 |
|---|---|---|
| 外层容器 | 无 | soft-screen: horizontal 18, top 84, bottom 34, padding 18, gradient 0.34→0.52, cut-md, border |
| 气泡形状 | RoundedCornerShape (16/4) | cut-sm |
| 气泡字号 | dialogue 17sp | 14sp, lineHeight 1.7 |
| NPC 气泡色 | glassBgSoft | rgba(255,255,255,0.08) |
| 玩家气泡色 | roseGold 0.15 | rgba(215,190,134,0.18) |
| 气泡 padding | spacing.m / spacing.s | horizontal 14, vertical 12 |
| 文字颜色 | textPrimary (1.0) | rgba(247,249,252,0.92) |

### P1-3 暗层系统 ✅

| 文件 | 旧值 | 新值 |
|---|---|---|
| SystemPageBackground.kt | 平面 0.32 + 底部渐隐 | 第一层 verticalGradient(0.32→0.12@42%→0.66) + 第二层白色呼吸高光(0.04→0→0→0.02) |
| PrologueScreen.kt | 平面 Color(0x52132033) | 第一层 verticalGradient(0.04→0.12@38%→0.86) + 第二层 radialGradient 暗角(center 46%/34%) |
| NameSetupScreen.kt | 同上 | 同上 |

---

## P2 — Token 微调

### P2-1 NameSetupScreen.kt ✅
- SubtitleColor: `#D6D2CB` → `rgba(232,238,246,0.72)` = `Color(0xB8E8EEF6)`
- PlaceholderColor: alpha 0.58 → alpha 0.66 = `Color(0xA8F4F1EA)`

### P2-2 StartScreen.kt ✅
- 主操作字号: 15sp → 17sp, fontWeight Medium
- 主操作说明字号: 11sp → 13sp
- 次操作栏字号: 11sp → 12sp
- 次操作栏颜色: snowWhite*0.84 → rgba(244,241,234,0.90)
- 操作间距: 9dp → 18dp
- 新增分割线: border-top 1dp rgba(255,255,255,0.08), padding-top 16dp

### P2-3 NagiHud.kt ✅
- 标题 chip 渐变: verticalGradient → horizontalGradient (to right, 0.30→0.12@78%)
- text-shadow: offset(0,1) blur 2 alpha 0.45 → offset(0,2) blur 14 alpha 0.48
- 右侧图标 gap: 6dp → 8dp

### P2-4 ChapterScreen.kt ✅
- 当前项背景: 平面 gold 0.18 → horizontalGradient(gold 0.18, white 0.04)
- 底部动作 padding-top: 14dp → 10dp
- 返回主页颜色: 0xB3(0.70) → 0xD1(0.82)
- 继续当前章节颜色: 0xFF(1.0) → 0xF5(0.96)

### P2-5 NagiTypography.kt ✅
- choiceText.lineHeight: 21sp → 27sp (15 × 1.8)

---

## UI 权威执行状态

- 已读取权威：MinSpec §1(暗层)、§14.1(小节开始)、§14.2(大章结束)、§18.1(结局页)、§19(选项层)、§20(LINE层)、§21.2(全量差异表)
- 实现范围：上述 P0-P2 全部 28 项差异中的 26 项
- 未实现 2 项：P0-1/P0-2 为死代码，活跃代码已符合权威
- 与权威一致：所有数值按 MinSpec 精确实现
- 无法精确实现：backdrop-filter blur（Compose 限制），已用 fallback
- 需要真机确认：
  - EndingOverlay 三层结构和 ending-card 视觉效果
  - ChoiceLayer 底部对齐后的交互感受
  - LineChatLayer soft-screen 容器内的聊天体验
  - 暗层多层渐变的视觉效果
  - StartScreen 分割线和新间距

## 权威同步状态

本轮未改变设计——全部按已有权威实现。

## 清理/归档判断

Cleanup candidates:
- `SectionOpeningScreen.kt` — 死代码，无引用。建议 PM 确认后删除或归档。
- `ChapterEndingScreen.kt` — 死代码，无引用。建议 PM 确认后删除或归档。

## 验证状态

代码级核对完成。公司电脑无 Gradle wrapper，无法编译验证。需要在有构建环境的机器上验证编译，以及 Ant 真机验证视觉效果。

---

## 改动文件清单

| 文件 | 优先级 |
|---|---|
| `GameScreen.kt` (EndingOverlay) | P0 |
| `ChoiceLayer.kt` | P1 |
| `LineChatLayer.kt` | P1 |
| `SystemPageBackground.kt` | P1 |
| `PrologueScreen.kt` | P1 |
| `NameSetupScreen.kt` | P1+P2 |
| `StartScreen.kt` | P2 |
| `NagiHud.kt` | P2 |
| `ChapterScreen.kt` | P2 |
| `NagiTypography.kt` | P2 |

— PP
