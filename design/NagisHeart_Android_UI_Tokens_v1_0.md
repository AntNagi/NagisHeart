# Nagi's Heart · Android UI Tokens v1.0

> 文档类型：Android 设计变量 / Design Tokens  
> 提交对象：GPT PM / CC Engineer / CoCo  
> 基于文档：`NagisHeart_UI_Visual_Direction_v1_0.md`、`CoCo_Design_Understanding_TaskPlan_v1_0.md`  
> 视觉方向：冷光玫瑰 / Snowlit Rose  
> 版本目标：首版 Android 竖屏体验，不考虑横屏。

---

## 1. Token 目标

本文件把视觉方向转成 Android 可执行变量，供后续 Compose theme、核心组件、背景压力测试和高保真样张共用。

Token 的目标不是做复杂视觉装饰，而是稳定以下体验：

```text
长文本可读
背景可适配
情绪可点缀
组件可复用
浅深模式一致
```

---

## 2. 设计基准

### 2.1 屏幕基准

| 项目 | 建议 |
|---|---|
| 设计画布 | 360 x 800 dp |
| 最小兼容宽度 | 360 dp |
| 主要背景导出比例 | 9:16 |
| 推荐背景导出尺寸 | 1080 x 1920 px |
| 安全区 | 遵循 Android system bars / display cutout insets |
| 首版方向 | Portrait only |

说明：

- 360 x 800 dp 用于 UI 规格和样张标注。
- 背景图可以按 9:16 单独导出 Android 版本，但必须保留原图母版。
- 横图背景必须记录焦点和裁切策略，不能让 UI 遮住人物脸部或关键剧情信息。

---

## 3. 命名规则

Compose 命名建议使用语义名，而不是直接使用色名。

示例：

```kotlin
NagiTheme.colors.textPrimary
NagiTheme.colors.glassLight
NagiTheme.colors.accentHeart
NagiTheme.spacing.m
NagiTheme.radius.card
NagiTheme.typography.dialogue
```

不要在业务组件中直接散落 `#BFA08A`、`16.dp`、`0.72f` 这类裸值。

---

## 4. Color Tokens

### 4.1 基础色

| Token | HEX | 用途 |
|---|---:|---|
| `snowWhite` | `#F7F9FC` | 浅色基础背景、冷白柔光 |
| `mistBlue` | `#E8EEF6` | 浅蓝灰页面底色 |
| `softGlassWhite` | `#FFFFFF` | Light Glass 基础白 |
| `nagiGrayBlue` | `#AEBAC8` | 描边、弱图标、未选中 |
| `deepBlueNight` | `#101827` | Dark Glass、暗色遮罩 |
| `inkNavy` | `#1B2430` | 浅色模式主文本 |
| `coldGray` | `#6E7A89` | 浅色模式次文本 |
| `silverBlue` | `#C9D1DC` | 深色模式次文本 |
| `mutedRose` | `#C98A96` | 心动反馈、轻情绪点 |
| `roseGold` | `#BFA08A` | 选中、标题线、仪式感 |
| `driedWine` | `#7A3F4A` | Bad 线、危险状态 |
| `paleGold` | `#D8C38A` | TRUE END、完成感 |

### 4.2 语义色：Light

| Token | Value | 用途 |
|---|---|---|
| `backgroundPrimary` | `snowWhite` | 页面基础底色 |
| `backgroundSecondary` | `mistBlue` | 二级页面底色 |
| `textPrimary` | `inkNavy` | 正文、主要标题 |
| `textSecondary` | `coldGray` | 说明、时间、弱信息 |
| `textInverse` | `snowWhite` | 深色遮罩上的文字 |
| `borderSubtle` | `nagiGrayBlue` at 45% | Light Glass 边线 |
| `iconDefault` | `nagiGrayBlue` at 82% | HUD 默认图标 |
| `accentPrimary` | `roseGold` | 当前态、关键细线 |
| `accentHeart` | `mutedRose` | 心动、亲密提示 |
| `danger` | `driedWine` | Bad / 删除 / 危险 |
| `successSpecial` | `paleGold` | TRUE / 解锁完成 |

### 4.3 语义色：Dark

| Token | Value | 用途 |
|---|---|---|
| `backgroundPrimaryDark` | `deepBlueNight` | 暗色页面底色 |
| `textPrimaryDark` | `snowWhite` | 深背景正文 |
| `textSecondaryDark` | `silverBlue` | 深背景说明 |
| `borderSubtleDark` | `nagiGrayBlue` at 28% | Dark Glass 边线 |
| `iconDefaultDark` | `silverBlue` at 78% | 深色 HUD 默认图标 |
| `accentPrimaryDark` | `roseGold` at 88% | 深色当前态 |
| `accentHeartDark` | `mutedRose` at 78% | 深色情绪点 |

### 4.4 Glass Tokens

| Token | Value | 用途 |
|---|---|---|
| `glassLightBg` | `#FFFFFF` at 78% | 默认 Light Glass |
| `glassLightBgStrong` | `#FFFFFF` at 86% | 复杂亮背景上的 Light Glass |
| `glassLightBgSoft` | `#FFFFFF` at 72% | 简单生活背景上的 Light Glass |
| `glassDarkBg` | `#101827` at 74% | 默认 Dark Glass |
| `glassDarkBgStrong` | `#101827` at 82% | 高对比暗背景上的 Dark Glass |
| `glassDarkBgSoft` | `#101827` at 68% | 简单暗背景上的 Dark Glass |
| `glassBlur` | 12 dp | 背景模糊建议值 |
| `glassBlurStrong` | 18 dp | 复杂背景模糊建议值 |

说明：

- Android 如果性能或实现限制不适合实时 blur，可以先用半透明遮罩 + 渐变替代。
- 文字清晰度优先于玻璃拟态效果。

### 4.5 Overlay Tokens

| Token | Value | 用途 |
|---|---|---|
| `overlayBottomLight` | `#F7F9FC` 0% -> 82% | 明亮复杂背景底部渐变 |
| `overlayBottomDark` | `#101827` 0% -> 86% | 暗色背景底部渐变 |
| `overlayFullDim` | `#101827` at 28% | 球场、高对比背景全屏暗化 |
| `overlayFullSoftLight` | `#F7F9FC` at 18% | TRUE / 柔光场景 |
| `overlayBad` | `#101827` at 42% + `#7A3F4A` at 10% | Bad 线压抑感 |

---

## 5. Typography Tokens

### 5.1 字体建议

| 层级 | 建议 |
|---|---|
| 中文正文 | Noto Sans CJK SC / Source Han Sans SC / Android system sans |
| 中文标题 | Noto Serif CJK SC / Source Han Serif SC，可无则用系统 sans |
| 英文标题 | Cormorant Garamond / Playfair Display，可无则用 serif fallback |
| 数字与系统小字 | Android system sans |

首版工程可以先使用系统字体，后续再评估是否内置标题字体。不要为了装饰性牺牲中文可读性。

### 5.2 字号与行高

| Token | Size | Line Height | 用途 |
|---|---:|---:|---|
| `titleHero` | 34 sp | 40 sp | 主页标题 / 结局大标题 |
| `titlePage` | 24 sp | 30 sp | 页面标题 |
| `titleSection` | 18 sp | 24 sp | 章节标题 / 分区标题 |
| `speakerName` | 13 sp | 18 sp | 说话人名 |
| `dialogue` | 17 sp | 27 sp | 对话正文 |
| `narration` | 17 sp | 28 sp | 旁白正文 |
| `choiceText` | 16 sp | 23 sp | 选项文字 |
| `lineMessage` | 15 sp | 22 sp | LINE 气泡 |
| `buttonText` | 15 sp | 20 sp | 主按钮 / 菜单项 |
| `caption` | 12 sp | 16 sp | 时间、状态、说明 |
| `micro` | 11 sp | 14 sp | 已读、系统弱提示 |

### 5.3 文本规则

| 项目 | 规则 |
|---|---|
| 对话每行长度 | 360 dp 画布下建议 14-18 个中文字符 |
| 对话行数 | 常态 1-3 行，极限 4 行 |
| 旁白行数 | 底部旁白 1-3 行，全屏旁白可 4-8 行 |
| 字重 | 正文 Regular，标题 Medium 或 Serif Regular |
| 字距 | 中文默认 0，英文标题可轻微放宽 |
| 文本缩放 | 必须支持系统字体缩放，组件高度随内容增长 |

---

## 6. Spacing Tokens

采用 4 dp 基础网格。

| Token | Value | 用途 |
|---|---:|---|
| `xxs` | 4 dp | 极小分隔 |
| `xs` | 8 dp | 图标内距、标签间距 |
| `s` | 12 dp | 小组件内距 |
| `m` | 16 dp | 常规页面边距 |
| `l` | 20 dp | 对话框内部垂直间距 |
| `xl` | 24 dp | 页面横向安全边距 |
| `xxl` | 32 dp | 页面区块间距 |
| `hero` | 48 dp | 主页标题和按钮组间距 |

---

## 7. Radius Tokens

| Token | Value | 用途 |
|---|---:|---|
| `none` | 0 dp | 全屏背景、遮罩 |
| `tiny` | 4 dp | 细标签、进度线端点 |
| `small` | 6 dp | 图标按钮按压背景 |
| `card` | 8 dp | 图鉴卡、存档卡、设置项 |
| `panel` | 8 dp | 对话框、选项卡、底部面板 |
| `bubble` | 14 dp | LINE 气泡 |
| `pill` | 999 dp | 极少量胶囊状态标签 |

说明：整体避免过度圆润。圆角服务柔和感，不做儿童 App 气质。

---

## 8. Stroke & Shadow Tokens

### 8.1 描边

| Token | Value | 用途 |
|---|---|---|
| `strokeHairline` | 0.5 dp | 装饰线、极弱分割 |
| `strokeDefault` | 1 dp | 卡片 / Glass 描边 |
| `strokeSelected` | 1.5 dp | 选中态玫瑰金描边 |
| `strokeFocus` | 2 dp | 可访问性焦点态 |

### 8.2 阴影

| Token | Value | 用途 |
|---|---|---|
| `shadowNone` | none | 大部分 HUD |
| `shadowSoft` | y 4, blur 16, alpha 10% | 轻浮层 |
| `shadowPanel` | y 8, blur 28, alpha 16% | 对话框 / 选项面板 |
| `shadowEndCard` | y 12, blur 36, alpha 20% | 结局卡 |

说明：阴影要轻，不能做廉价卡片浮起感。深背景上优先用描边和透明度，不靠重阴影。

---

## 9. Component Size Tokens

| Token | Value | 用途 |
|---|---:|---|
| `touchMin` | 48 dp | Android 最小触控区域 |
| `hudIcon` | 22 dp | HUD 图标视觉尺寸 |
| `hudButton` | 44 dp | HUD 按钮触控尺寸 |
| `dialogueMinHeight` | 132 dp | 对话框最小高度 |
| `dialogueMaxHeight` | 236 dp | 对话框常规最大高度 |
| `choiceMinHeight` | 56 dp | 单个选项最小高度 |
| `choiceGap` | 10 dp | 选项间距 |
| `lineBubbleMaxWidth` | 252 dp | 360 dp 画布下 LINE 气泡最大宽 |
| `thumbnailSmall` | 72 x 104 dp | 存档缩略图 |
| `galleryCard` | 150 x 212 dp | 图鉴卡建议比例 |

---

## 10. Motion Tokens

| Token | Duration | Easing | 用途 |
|---|---:|---|---|
| `motionFast` | 120 ms | standard | 按压反馈 |
| `motionNormal` | 180 ms | standard | 对话框淡入 |
| `motionChoiceIn` | 220 ms | decelerate | 选项淡入 + 上浮 |
| `motionScene` | 360 ms | easeInOut | 背景切换 |
| `motionChapter` | 520 ms | easeInOut | 章节标题仪式感 |
| `motionEnding` | 700 ms | easeInOut | 结局卡出现 |

限制：

- 不做常驻粒子。
- 不做强闪光。
- 不做过度弹跳。
- 转场不能影响阅读节奏。

---

## 11. State Tokens

| State | 视觉规则 |
|---|---|
| `default` | 蓝灰 / 冷白基座，低存在感 |
| `pressed` | 透明度降低 6-10%，或整体位移 1 dp |
| `selected` | 玫瑰金细线 + 轻微亮起 |
| `disabled` | 透明度 38%，不可只靠颜色表达 |
| `locked` | 雾化遮罩 + `???` + 细线锁 |
| `unread` | 默认文本强度 |
| `read` | 文本与节点降低 18-28% 强度 |
| `danger` | 枯玫瑰红，不用高饱和红 |
| `trueEnd` | 冷白 + 淡金，不浮夸 |

---

## 12. uiTheme Tokens

剧情节点必须允许指定：

```kotlin
enum class NagiUiTheme {
    Light,
    Dark,
    Auto
}
```

### 12.1 默认映射

| 场景 | 默认 |
|---|---|
| apartment | Light |
| bedroom | Light / Auto |
| lemontea | Light |
| lolly | Light |
| valentine | Light |
| hug | Auto |
| pitch | Dark |
| drive | Dark |
| afterwork | Dark / Auto |
| openday | Auto |
| curry | Light |
| propose | Light + trueEnd |
| Bad 线 | Dark + bad |

### 12.2 Auto 判断建议

Auto 不应完全依赖图片平均亮度。建议结合：

```text
剧情节点配置
+ 背景亮度
+ 场景类别
+ 是否有人物脸部在 UI 区域附近
```

若自动判断和剧情气质冲突，以剧情节点配置优先。

---

## 13. PM Review Checklist

请 PM 重点确认：

- Token 是否足够支持「冷光玫瑰」。
- 对话正文字号 17 sp 是否符合阅读预期。
- 圆角整体是否足够克制。
- 玫瑰金使用范围是否合适。
- `uiTheme` 的 Light / Dark / Auto 规则是否符合剧情配置方式。
- 是否允许工程首版用半透明遮罩替代实时 blur。

