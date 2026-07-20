# PP任务：全量 UI 核对修复

**来源**：lulu 2026-07-20 全量核对 Android 实现 vs HTML authority  
**权威文件**：`design/NagisHeart_UI_Authority_XoXo_v1_0.html`  
**规范文件**：`handoff/yiyi_final_visual_slices_20260711/XoXo_UI_Final_MinSpec_20260712.md` §19 / §20 / §21  
**优先级**：P0 → P1 → P2 分批交付

---

## 总览

lulu 对全部页面与 authority HTML 逐项核对后，发现 28 项差异。其中 6 项 MAJOR（结构性缺失，需重写），6 项中等（组件级问题），16 项 token 微调。

完整清单见 MinSpec §21.2，下面按优先级拆解改动要求。

---

## P0 — 结构性缺失（3 页需重写）

### P0-1 小节开始页 `SectionOpeningScreen.kt`

**现状**：纯深色背景 + 居中文字，无 BG 图，无玻璃托底。  
**目标**：与 `ChapterOpeningScreen.kt` 共用 story BG + 章节海报玻璃托底语言。

改动要求：
1. 背景使用当前章节 story BG 图，叠 story 暗层（MinSpec §1 story 类）
2. 文字组使用 `chapter-poster.section` 玻璃托底（与 ChapterOpeningScreen 共用组件），位置 `bottom=96`
3. 具体 token 见 MinSpec §14.1

### P0-2 大章结束页 `ChapterEndingScreen.kt`

**现状**：纯深色背景 + 居中 "前往下一章 + 轻触继续" 文字。  
**目标**：story BG + `clear-card` 玻璃卡片 + 双按钮。

改动要求：
1. 背景使用当前章节 story BG 图，叠 story 暗层
2. 主容器使用 `clear-card`：left/right=28, bottom=82
3. 背景：radial + linear 双层渐变（见 MinSpec §14.2）
4. 描边 `rgba(255,255,255,0.10)` 1dp，blur 16dp saturate(0.92)，cut-md
5. 内容：CHAPTER CLEAR 标签 + 章节名标题 + 说明文 + 底部动作（左"返回目录" + 右"进入下一章"）
6. 全部 token 见 MinSpec §14.2

### P0-3 结局页 `GameScreen.kt` EndingOverlay（约317行起）

**现状**：40% 平面深色遮罩 + 居中文字 + 底部单按钮，无 ending-card。  
**目标**：ending 专用渐变遮罩 + `ending-card` 玻璃卡片 + 三层结构。

改动要求：

#### 全屏渐变遮罩（替换现有平面 0.4 遮罩）
```
linear-gradient(to bottom,
  rgba(9, 14, 24, 0.10) 0%,
  rgba(9, 14, 24, 0.28) 35%,
  rgba(9, 14, 24, 0.62) 65%,
  rgba(9, 14, 24, 0.82) 100%)
```

#### ending-card 容器
- 位置：left/right `18dp`，bottom `34dp`
- padding：上 `26`，左右 `24`，下 `22`
- 背景：
  - `radial-gradient(ellipse at 70% 0%, rgba(215,190,134,0.18), transparent 42%)`
  - `radial-gradient(ellipse at 30% 100%, rgba(215,190,134,0.06), transparent 50%)`
  - `linear-gradient(to bottom, rgba(16,24,39,0.56), rgba(16,24,39,0.80))`
- 描边：`rgba(255,255,255,0.10)` 1dp
- 模糊：blur `20dp` saturate(0.92)
- 裁切：`cut-md`
- shadow：`0 22dp 54dp rgba(0,0,0,0.40)` + `inset 0 1dp 0 rgba(255,255,255,0.06)`

#### 三层内容结构

**Layer 1 — Content（static text）：**
- ending-label：gold `#D7BE86`，12sp，letter-spacing 0.14em，uppercase
  - text-shadow：`0 0 18dp rgba(215,190,134,0.40)` + `0 1dp 3dp rgba(0,0,0,0.60)`
- ending-subtitle：`rgba(215,190,134,0.92)`，13sp，letter-spacing 0.06em
  - text-shadow：`0 0 12dp rgba(215,190,134,0.24)`
- title（h2）：serif，32sp，weight 400，line-height 1.16
  - text-shadow：`0 2dp 16dp rgba(0,0,0,0.50)` + `0 0 40dp rgba(215,190,134,0.12)`
- description（p）：`rgba(247,249,252,0.88)`，15sp，line-height 1.9
  - text-shadow：`0 1dp 6dp rgba(0,0,0,0.40)`

**Layer 2 — Status feedback（静态提示，不是按钮）：**
- "已解锁：TRUE END / 回忆画廊新增 1 项"
- 11sp，`rgba(244,241,234,0.70)`，letter-spacing 0.02em
- inline-flex，左侧 gold dot：5dp 圆形，bg `rgba(215,190,134,0.72)`，shadow `0 0 8dp rgba(215,190,134,0.18)`
- width = fit-content，不占满整行
- 无边框、无矩形底色、无 cut-sm
- margin-top `14dp`

**Layer 3 — Primary action（唯一按钮）：**
- 只有 `返回主页`
- min-height `38dp`
- color `#F7F9FC`
- bg `linear-gradient(to right, rgba(215,190,134,0.20), rgba(255,255,255,0.07))`
- border `1dp solid rgba(215,190,134,0.26)`
- cut-sm
- 13sp，grid place-items center
- margin-top `22dp`

参考：MinSpec §18.1 + authority `.ending-card` / `.ending-label` / `.ending-unlock` / `.ending-action.primary`

---

## P1 — 组件级修复

### P1-1 选项层 `ChoiceLayer.kt`

**现状**：居中偏上布局 + 横向渐变背景 + 五角标记装饰。  
**目标**：底部对齐 + 单色半透明背景。

改动要求：
1. 位置改为底部对齐：left/right `18dp`，bottom `34dp`
2. 去掉 `BiasAlignment(0f, -0.14f)` 居中
3. 选项行背景改为 `rgba(16,24,39,0.48)`（单色，不是横向渐变）
4. 行 padding 改为 `14dp / 16dp`
5. 去掉 Pentagon 五角标记
6. 文字颜色改为 `rgba(247,249,252,0.92)`（0.92 alpha，不是 1.0）
7. choiceText 行高改为 `1.8`（= 27sp），当前是 21sp
8. 选项间 gap 改为 `10dp`
9. blur `12dp`，cut-sm
10. 全部 token 见 MinSpec §19

### P1-2 LINE 聊天层 `LineChatLayer.kt`

**现状**：裸 LazyColumn + RoundedCornerShape 气泡 + 17sp 字号 + 错误颜色。  
**目标**：有 soft-screen 玻璃容器 + cut-sm 气泡 + 14sp 字号。

改动要求：
1. 外层增加 `soft-screen` 容器：left/right `18dp`，top `84dp`，bottom `34dp`，padding `18dp`，bg gradient `0.34→0.52`，blur `16dp`，cut-md
2. 气泡形状从 `RoundedCornerShape` 改为 `cut-sm`（CutCornerShape）
3. 气泡字号从 `17sp`（dialogue）改为 `14sp`，line-height `1.7`
4. NPC 气泡背景从 `glassBgSoft` 改为 `rgba(255,255,255,0.08)` 即 `Color(0x14FFFFFF)`
5. 玩家气泡背景从 `roseGold*0.15` 改为 `rgba(215,190,134,0.18)` 即 `Color(0x2ED7BE86)`
6. 气泡 padding 改为 `12dp / 14dp`
7. 文字颜色改为 `rgba(247,249,252,0.92)`
8. 全部 token 见 MinSpec §20

### P1-3 暗层系统（3 个文件）

**现状**：`SystemPageBackground.kt` / `PrologueScreen.kt` / `NameSetupScreen.kt` 使用平面单色遮罩。  
**目标**：按 authority 使用多层渐变。

#### SystemPageBackground.kt

现有平面 `rgba(19,32,51,0.32)` + 底部渐隐替换为：
- 第一层：`Brush.verticalGradient(0.32 → 0.12@42% → 0.66)` 基色 `rgba(19,32,51)`
- 第二层（白色呼吸高光）：`Brush.verticalGradient` 基色 `rgba(255,255,255)`，stops: `0.04@0%`, `0.0@18%`, `0.0@70%`, `0.02@100%`
- 去掉现有的底部额外渐隐（已包含在第一层 0.66 终止值中）

#### PrologueScreen.kt / NameSetupScreen.kt

现有平面 `Color(0x52132033)` 替换为：
- 第一层：`Brush.verticalGradient` 基色 `rgba(16,24,39)`，stops: `0.04@0%`, `0.12@38%`, `0.86@100%`
- 第二层（径向暗角）：`Brush.radialGradient` 中心 `46%, 34%`，stops: `transparent@22%`, `rgba(16,24,39,0.34)@72%`, `rgba(16,24,39,0.7)@100%`

token 见 MinSpec §1 暗层规则。

---

## P2 — Token 微调

以下全部是数值修正，改动量小，可在 P0/P1 完成后批量处理。

### P2-1 NameSetupScreen.kt

| 属性 | 当前值 | 正确值 |
|---|---|---|
| SubtitleColor | `#D6D2CB` (1.0 alpha) | `rgba(232,238,246,0.72)` → `Color(0xB8E8EEF6)` |
| PlaceholderColor | alpha ≈ 0.58 | `rgba(244,241,234,0.66)` → `Color(0xA8F4F1EA)` |

### P2-2 StartScreen.kt

| 属性 | 当前值 | 正确值 |
|---|---|---|
| 主操作字号 | `buttonText` 15sp | `17sp`，font-weight 500 |
| 主操作说明字号 | `micro` 11sp | `13sp` |
| 次操作栏字号 | `micro` 11sp | `12sp` |
| 次操作栏颜色 | snowWhite * 0.84 | `rgba(244,241,234,0.90)` |
| 操作间距 | gap 9dp | gap `18dp` |
| 分割线 | 无 | 主操作与次操作之间加 `border-top: 1dp solid rgba(255,255,255,0.08)`，padding-top `16dp` |

### P2-3 NagiHud.kt

| 属性 | 当前值 | 正确值 |
|---|---|---|
| 标题 chip 渐变方向 | `verticalGradient`（to bottom） | 改为 `horizontalGradient`（to right）：`rgba(15,24,39,0.30) → rgba(15,24,39,0.12)@78%` |
| 标题 chip text-shadow | offset(0,1) blur 2 alpha 0.45 | offset(0,2) blur `14` alpha `0.48` |
| 右侧图标组 gap | 6dp | `8dp` |

### P2-4 ChapterScreen.kt

| 属性 | 当前值 | 正确值 |
|---|---|---|
| 当前项背景 | 平面 gold 0.18 | `horizontalGradient(rgba(215,190,134,0.18), rgba(255,255,255,0.04))` |
| 底部动作 padding-top | 14dp | `10dp` |
| 左侧动作颜色 | 0xB3F4F1EA (0.70) | `rgba(244,241,234,0.82)` → `Color(0xD1F4F1EA)` |
| 右侧动作颜色 | 0xFFF7F9FC (1.0) | `rgba(247,249,252,0.96)` → `Color(0xF5F7F9FC)` |

### P2-5 NagiTypography.kt

| 属性 | 当前值 | 正确值 |
|---|---|---|
| choiceText.lineHeight | 21sp | `27sp`（= 15 × 1.8） |

---

## 不要做

- 不改 story-data/*.json
- 不改 design/NagisHeart_UI_Authority_XoXo_v1_0.html
- 不改 BG mapping 文件
- 不改 TT Start 相关文件
- 不改 App Icon
- 不改今日已通过的 7 个文件（NagiDialog / NagiHud 中心线 / LongNarrationLayer / BacklogScreen / SaveLoadScreen / SettingsScreen / NagiColors weakText）
- 不删除任何资源文件

## 交付方式

- 按 P0 → P1 → P2 分批提交
- 每批完成后在 MinSpec §21.2 对应行的"PP 备注"栏标 ✅
- 每批提交前对照 authority HTML 截图验收
