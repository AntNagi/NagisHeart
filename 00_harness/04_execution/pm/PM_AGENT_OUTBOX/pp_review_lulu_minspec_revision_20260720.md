# PP 核对结果：当前代码 vs Lulu 2026-07-20 MinSpec Revision

> 核对人：PP（Android 开发）  
> 核对日期：2026-07-20  
> 核对依据：`00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`（文件头有 `2026-07-20 lulu revision` 标注）

---

## 1. 全局色系

| 项目 | 新 MinSpec 值 | 当前代码实际值 | 状态 |
|---|---|---|---|
| 主文字 | `#F7F9FC` | theme `snowWhite = #F7F9FC` 已定义，但 NagiDialog TitleColor/ConfirmColor 仍用 `#F4F1EA` | **需改** |
| 次文字 | `rgba(232,238,246,0.72)` | NagiDialog DismissColor 仍是 `#D6D2CB`（旧暖灰） | **需改** |
| 弱文字 | `#C9D1DC` | theme 已有 `silverBlue = #C9D1DC`，同时保留旧 `weakText = #B7B3AD` | 需确认引用点 |
| 长旁白正文色 | `rgba(244,241,234,0.92)` | LongNarrationLayer 用 `Color(0xFFF4F1EA)` = 100% alpha | **需改为 0.92** |
| 金色强调 | `#D7BE86` | speaker chip 用 `#E4CA8F` | 待确认是否对齐（speaker 有单独 spec） |

**理解确认：** 色系从暖象牙 `#F4F1EA` 统一到冷雪白 `#F7F9FC`。散落在 NagiDialog、LongNarrationLayer 里的旧色值都要更新。

---

## 2. 弹窗（Dialog）— NagiDialog.kt

| 项目 | 新 MinSpec 值 | 当前代码实际值 | 状态 |
|---|---|---|---|
| 左右边距 | 28dp（屏幕两侧留白） | `fillMaxWidth(0.80f)` ≈ 两侧约 43dp（1080px 设备） | **需改**：改为 `fillMaxWidth() + padding(horizontal=28.dp)` |
| 内边距-上 | 22dp | 32dp | **需改** |
| 内边距-左右 | 22dp | 40dp | **需改** |
| 内边距-下 | 18dp | 28dp | **需改** |
| 裁切 | `CutCornerShape(14dp)` / cut-md | `NagiShapes.cutMedium` | **OK**（已确认 cutMedium = 14dp） |
| 描边 | `rgba(255,255,255,0.08)` | `0x14FFFFFF` = 8% | **OK** |
| 遮罩 scrim | `rgba(9,14,24,0.40)` | `0x66090E18` = 40% | **OK** |
| 背景渐变顶 | `rgba(27,36,54,0.56)` | `0x8F1B2436` = 56% | **OK** |
| 背景渐变底 | `rgba(20,31,49,0.52)` | `0x85142131` = 52% | **OK** |
| inner highlight | `rgba(247,249,252,0.05)→transparent 36%` | 代码 `0x0DFFFFFF`（5%）→stop 0.18f | **需微调**：stop 从 0.18 改到 0.36 |
| shadow | `0 18dp 42dp rgba(0,0,0,0.36)` | blur=42dp, color=`0x5C000000`=36% | **OK** |
| 按钮间距 | 24dp | `Spacer(26.dp)` | **需改→24** |
| 按钮字号 | 15sp | 16sp | **需改→15** |
| 按钮默认色 | `rgba(244,241,234,0.74)` | `#D6D2CB`（旧暖灰 100%） | **需改** |
| 按钮强调色 | `#F7F9FC` | `#F4F1EA`（旧暖象牙） | **需改** |
| 标题色 | `rgba(247,249,252,0.96)` | `#F4F1EA`（100%，旧色） | **需改** |
| 正文色 | `rgba(244,241,234,0.88)` | `0xD1F4F1EA`（82%） | **需改→88%** |

---

## 3. 对白底部承载层（dialogue-box）— DialogueLayer.kt

| 项目 | 新 MinSpec 值 | 当前代码实际值 | 状态 |
|---|---|---|---|
| 背景顶 | `rgba(16,24,39,0.54)` | `0x8A101827` = 54% | **OK** |
| 背景底 | `rgba(16,24,39,0.70)` | `0xB3101827` = 70% | **OK** |
| 描边 | `rgba(255,255,255,0.08)` | `0x14FFFFFF` = 8% | **OK** |
| 模糊 | 16dp | Compose 不支持 backdrop-blur，用 shadow 替代 | 已知限制 |
| shadow | `0 18dp 40dp rgba(0,0,0,0.26)` | BlurMaskFilter 40dp, color `0x42000000`=26% | **OK** |
| 外边距 | L/R 18, bottom 34 | `horizontal=18.dp, bottom=34.dp` | **OK** |
| 内边距 | 上18 左右20 下22 | `start=20, end=20, top=18, bottom=22` | **OK** |

**结论：对白层已全部对齐新 MinSpec，不需要改动。**

---

## 4. 长旁白 — LongNarrationLayer.kt

| 项目 | 新 MinSpec 值 | 当前代码实际值 | 状态 |
|---|---|---|---|
| 外边距 | 18dp | `horizontal = 18.dp` | **OK** |
| 内边距 | 左右 20dp | `horizontal = 20.dp` | **OK** |
| 背景 | radial-gradient 淡出（非矩形实底） | 已实现 radialGradient + 边缘 fade | **OK** |
| 段间距 | 24dp | `Arrangement.spacedBy(18.dp)` | **需改→24** |
| 正文色 | `rgba(244,241,234,0.92)` | `Color(0xFFF4F1EA)` = 100% alpha | **需改→copy(alpha=0.92f)** |
| 字号 | 16sp | 16sp | **OK** |
| 行高 | 1.88（≈30sp） | 30.sp | **OK** |
| text-shadow | `0 1dp 8dp rgba(10,15,25,0.18)` | offset(0,1), blur=8, color 0.18 alpha | **OK** |

---

## 5. HUD 导航栏 — NagiIconButton.kt / NagiHud.kt

| 项目 | 新 MinSpec 值 | 当前代码实际值 | 状态 |
|---|---|---|---|
| 图标容器尺寸 | 36x36 | `.size(36.dp)` | **OK** |
| 图标尺寸 | 18x18 | `.size(18.dp)` | **OK** |
| 衬底渐变 | `rgba(15,24,39,0.34→0.22)` | `0x570F1827`(34%) → `0x380F1827`(22%) | **OK** |
| radial highlight | `rgba(247,249,252,0.08)` | `0x14F7F9FC` = 8% | **OK** |
| 描边 | `rgba(255,255,255,0.12)` | `0x1FFFFFFF` = 12% | **OK** |
| 图标色 | `rgba(247,249,252,0.94)` | `Color(0xF0F7F9FC)` = 94% | **OK** |
| icon shadow | `drop-shadow(0 1dp 2dp rgba(0,0,0,0.64))` + `0 0 8dp rgba(247,249,252,0.20)` | 已实现 halo + dark shadow | **OK** |
| 容器 shadow | `drop-shadow(0 3dp 12dp rgba(0,0,0,0.42))` | BlurMaskFilter 12dp, `0x6B000000`=42% | **OK** |
| 标题 chip 文字色 | `rgba(244,241,234,0.88)` | `Color(0xE0F4F1EA)` = 88% | **OK** |
| 标题 chip 衬底 | `linear-gradient(to right, rgba(15,24,39,0.30), rgba(15,24,39,0.12) 78%)` | `0x4D0F1827`(30%) → `0x1F0F1827`(12%) | **OK** |
| 标题 chip 描边 | `rgba(255,255,255,0.12)` | `0x1FFFFFFF` | **OK** |

**结论：HUD 全部对齐，不需要改动。**

---

## 6. 系统浮层/面板

| 页面 | 新 MinSpec §1 值 | 当前代码实际值 | 状态 |
|---|---|---|---|
| ChapterScreen 目录面板 | `linear-gradient(to bottom, rgba(16,24,39,0.34), rgba(16,24,39,0.52))` | `Color(0x57101827)` 34% → `Color(0x85101827)` 52% | **OK** |
| SettingsScreen 行项 | §1 写的是整页浮层规则 | 用 `glassBgStrong`(0x9EF7F9FC=62%) / `glassBgSoft`(0x61F7F9FC=38%) 横向渐变 | **存疑** |
| SaveLoadScreen 行项 | 同上 | 同上，横向渐变亮白底 | **存疑** |

**疑问：** Settings/SaveLoad 行项卡片目前用亮白横向渐变做区分，不是 §1 的深蓝整页浮层渐变。我理解 §1 是"整页浮层底色"规则，行项卡片可能属于更上层级元素。**请 Lulu 确认这两个页面的行项卡片是维持当前亮白渐变，还是改为深蓝渐变？**

---

## 7. 剧情回顾暗层 — BacklogScreen.kt

| 项目 | 新 MinSpec 值 | 当前代码实际值 | 状态 |
|---|---|---|---|
| 暗层 alpha | 0.58 | `Color(0xFF132033).copy(alpha = 0.52f)` | **需改→0.58** |

---

## Compose 平台限制说明

1. **backdrop-filter blur**：Compose 原生不支持对"底层内容"做模糊。当前方案是用半透明渐变背景 + BlurMaskFilter shadow 做视觉替代。MinSpec 也标注了 `blur(0)` no-blur fallback，我按 fallback 实现。
2. **CutCornerShape**：已实现 `cut-sm`(8dp) / `cut-md`(14dp)，与 MinSpec 一致。
3. **radial-gradient mask**：长旁白的 mask 用 Compose `Brush.radialGradient` 模拟，边缘过渡略有差异但方向正确。

---

## 汇总：需要改动的文件和项目

| 文件 | 改动内容 |
|---|---|
| `NagiDialog.kt` | 内边距 40/32/28→22/22/18；左右边距方式改为 padding(28dp)；inner highlight stop 0.18→0.36；按钮间距 26→24；按钮字号 16→15；标题色/正文色/按钮色全部更新 |
| `LongNarrationLayer.kt` | 段间距 18→24；正文色加 alpha 0.92 |
| `BacklogScreen.kt` | 暗层 alpha 0.52→0.58 |
| `NagiColors.kt` / theme | 清理残留 `weakText = #B7B3AD`，确认全局引用 |

**不需要改的：** DialogueLayer、NagiHud、NagiIconButton、ChapterScreen 面板底色。

---

## 我的疑问（需 Lulu 回复）

1. **Settings/SaveLoad 行项卡片底色**：维持当前亮白横向渐变，还是改为 §1 深蓝渐变？
2. **Speaker chip 金色**：当前用 `#E4CA8F`，§8.1 写的是 `#E4CA8F`，§1 全局金色强调是 `#D7BE86`——speaker chip 保持 `#E4CA8F` 对吗？
3. **长旁白全屏暗层**：当前用 `alpha=0.42f`，MinSpec §9 没有明确写全屏暗层 alpha。是否保持 0.42？

---

确认以上理解无误后，我即开始改动。等你回复。

— PP
