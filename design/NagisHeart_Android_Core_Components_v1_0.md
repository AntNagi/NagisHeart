# Nagi's Heart · Android Core Components v1.0

> 文档类型：Android 核心组件视觉规格  
> 提交对象：GPT PM / CC Engineer / CoCo  
> 基于文档：`NagisHeart_Android_UI_Tokens_v1_0.md`  
> 视觉方向：冷光玫瑰 / Snowlit Rose  
> 范围：P0 / P1 UI 组件，不包含最终高保真页面图。

---

## 1. 组件设计原则

所有组件必须服从以下优先级：

```text
文字可读性
> 触控可操作性
> 剧情情绪
> 背景可见度
> 装饰感
```

视觉小说的 UI 不应该像功能后台，也不应该像手游运营页。组件要稳定、安静、可复用，只有在选择、解锁、结局等关键时刻提高仪式感。

---

## 2. P0 组件清单

P0 是首轮视觉样张和工程主题验证必须覆盖的组件。

| 组件 | 优先级 | 说明 |
|---|---|---|
| Game Background Container | P0 | 背景图、遮罩、裁切、安全区 |
| HUD Bar | P0 | 返回、菜单、章节名、Auto、Skip、Backlog |
| Dialogue Box Light | P0 | 浅色场景对话框 |
| Dialogue Box Dark | P0 | 深色场景对话框 |
| Bottom Narration | P0 | 底部旁白 |
| Fullscreen Narration | P0 | 全屏旁白 |
| Choice Panel | P0 | 选项面板 |
| Continue Indicator | P0 | 点击继续提示 |
| LINE Surface | P0 Design | LINE 模式视觉样张 |
| Chapter Map Node | P0 | 章节地图首版节点 |

---

## 3. Game Background Container

### 3.1 层级

```text
Background Image
→ Scene Overlay
→ Character / CG focus protection if needed
→ HUD
→ Dialogue / Narration / Choice
→ Modal / Unlock toast
```

### 3.2 视觉规则

- 背景铺满屏幕，首版使用 center crop。
- 每个背景可配置焦点点位，例如 `focusX: 0.5, focusY: 0.35`。
- 底部文字区域必须有渐变或 Glass 面板保护。
- 横图背景必须有单独 9:16 裁切方案，不直接粗暴 center crop。

### 3.3 工程参数建议

```kotlin
data class SceneVisualConfig(
    val backgroundId: String,
    val uiTheme: NagiUiTheme,
    val overlay: SceneOverlay,
    val focusX: Float = 0.5f,
    val focusY: Float = 0.5f,
    val protectFaceRegion: Boolean = false
)
```

---

## 4. HUD Bar

### 4.1 内容

允许常驻：

- Back / Menu。
- 当前章节名。
- Save。
- Auto。
- Skip。
- Backlog。

禁止常驻：

- 好感条。
- 路线倾向值。
- 商城、任务、活动入口。
- 结局资格或数值提示。

### 4.2 布局

| 项目 | 规格 |
|---|---|
| 顶部安全区 | 跟随 system inset |
| 左侧按钮 | 44 x 44 dp |
| 右侧按钮 | 44 x 44 dp |
| 图标视觉尺寸 | 22 dp |
| 横向边距 | 16 dp |
| 章节名 | 居中或左中，12 sp caption |

### 4.3 状态

| 状态 | 视觉 |
|---|---|
| default | 蓝灰 / 银灰，低透明度 |
| active | 玫瑰金，透明度 90% |
| pressed | 轻微暗化或透明度降低 |
| disabled | 38% 透明度 |

HUD 不做实体导航栏，不做重底色。复杂背景上可加极轻顶部渐变。

---

## 5. Dialogue Box

对话框是最高优先级组件，必须先做 Light / Dark 两套。

### 5.1 结构

```text
Speaker Name
Dialogue Text
Continue Indicator
Optional subtle accent line
```

### 5.2 尺寸

| 项目 | 规格 |
|---|---|
| 横向边距 | 16 dp |
| 底部边距 | 20 dp + navigation inset |
| 最小高度 | 132 dp |
| 常规最大高度 | 236 dp |
| 内边距 | left/right 18 dp, top/bottom 16 dp |
| 圆角 | 8 dp |
| 描边 | 1 dp |

### 5.3 Light Glass

| 项目 | 规格 |
|---|---|
| 背景 | `glassLightBg` |
| 复杂亮背景 | `glassLightBgStrong` |
| 描边 | `borderSubtle` |
| 正文 | `textPrimary`, 17 sp / 27 sp |
| 说话人 | `accentPrimary`, 13 sp / 18 sp |
| 点击提示 | `nagiGrayBlue`, 11 sp 或细线图标 |

### 5.4 Dark Glass

| 项目 | 规格 |
|---|---|
| 背景 | `glassDarkBg` |
| 高对比背景 | `glassDarkBgStrong` |
| 描边 | `borderSubtleDark` |
| 正文 | `textPrimaryDark`, 17 sp / 27 sp |
| 说话人 | `accentPrimaryDark`, 13 sp / 18 sp |
| 点击提示 | `silverBlue`, 11 sp 或细线图标 |

### 5.5 长文本规则

- 常规对话控制在 1-3 行。
- 4 行以上需要允许面板增高，不能让文字被裁。
- 逐字播放时文本区域高度预留，避免重排跳动。
- 如果系统字体放大导致溢出，优先增高面板，不压缩字号。

---

## 6. Bottom Narration

底部旁白用于短动作、心理、过渡。

| 项目 | 规格 |
|---|---|
| 容器 | 与 Dialogue Box 同体系 |
| 说话人名 | 不显示 |
| 正文 | `narration`, 17 sp / 28 sp |
| 文字颜色 | 比普通对话略柔，透明度 92% |
| 装饰 | 可使用极弱细线，不使用标题化装饰 |

示例用途：

```text
他没有马上回答。
窗外的光落下来，像一场安静的雪。
```

---

## 7. Fullscreen Narration

全屏旁白用于连续叙事、情绪铺陈、场景转换。

### 7.1 层级

```text
Background
→ Fullscreen overlay
→ Center text area
→ Continue indicator
```

### 7.2 规格

| 项目 | 规格 |
|---|---|
| 遮罩 | Light: 冷白 68-78%；Dark: 深夜蓝 62-76% |
| 文本区宽度 | 屏宽 - 48 dp |
| 文本区位置 | 垂直居中略偏上 |
| 正文 | 17 sp / 28 sp |
| 对齐 | 左对齐优先，短句可居中 |
| 最大行数 | 8 行左右，超长应拆段 |

全屏旁白不能像系统弹窗，也不能像网页文章。它应该像被剧情短暂压低声音的画面。

---

## 8. Choice Panel

选项是情绪分歧点，应有轻仪式感。

### 8.1 布局

| 项目 | 规格 |
|---|---|
| 出现位置 | 屏幕中下部，避开人物脸部 |
| 横向边距 | 24 dp |
| 单项最小高度 | 56 dp |
| 选项间距 | 10 dp |
| 单屏建议数量 | 2-4 个 |
| 面板外遮罩 | 轻暗化 18-28%，按背景决定 |

### 8.2 选项卡状态

| 状态 | 视觉 |
|---|---|
| default | 半透明 Glass + 蓝灰细线 |
| pressed | 下压 1 dp，背景暗化 6% |
| selected | 玫瑰金 1.5 dp 描边 + 轻微亮起 |
| disabled | 38% 透明度，不可点击 |

### 8.3 文字与标签

| 元素 | 规格 |
|---|---|
| 选项正文 | 16 sp / 23 sp |
| 选项标签 | 11 sp / 14 sp |
| 标签位置 | 正文上方或右上角，不能抢正文 |
| 标签颜色 | `accentHeart` 或 `textSecondary` |

允许标签示例：

```text
心动
理解
认真
靠近
沉默
```

不允许标签变成数值提示，例如 `好感 +5`、`Bad +1`。

---

## 9. Continue Indicator

### 9.1 视觉

- 极弱，不干扰阅读。
- 可以是小三角、短细线、微小光点。
- 默认蓝灰，当前强情绪或结局段落可用玫瑰金。

### 9.2 动效

| 项目 | 规格 |
|---|---|
| 呼吸周期 | 900-1200 ms |
| 位移 | 0-2 dp |
| 透明度 | 45-85% |

不要做强跳动，不要像按钮 CTA。

---

## 10. LINE Surface

LINE 模式按 P0 出视觉样张，工程完整实现可放 Phase 2。

### 10.1 结构

```text
Phone-like surface
→ Date / time separator
→ Nagi message bubbles
→ Player message bubbles
→ Read / unread rhythm
→ Typing indicator
→ Optional choice chips
```

### 10.2 页面规格

| 项目 | 规格 |
|---|---|
| 背景 | 当前剧情背景轻模糊或冷白蓝灰底 |
| 手机界面浮层 | 居中，宽度屏宽 - 28 dp |
| 浮层圆角 | 8 dp |
| 浮层描边 | 蓝灰 28-40% |
| 内容边距 | 14 dp |
| 气泡最大宽 | 252 dp |

### 10.3 气泡

| 对象 | 背景 | 文字 | 对齐 |
|---|---|---|---|
| Nagi | 冷灰蓝 / 深灰蓝 | 深蓝或冷白 | 左 |
| 玩家 | 低饱和玫瑰白 / 冷白 | Ink Navy | 右 |
| 系统时间 | 透明蓝灰 | caption | 居中 |
| 输入中 | 低透明气泡 + 三点 | 无正文 | 左 |

### 10.4 禁区

- 不用明亮绿色。
- 不做社交软件强仿真。
- 不堆表情包。
- 不做可爱贴纸风。

LINE 的气质是：

```text
低压、安静、短句、精神补位。
```

---

## 11. Chapter Map Node

章节地图首版不提前暴露路线分歧。未解锁路线隐藏或显示 `???`，避免剧透 Dream / Stay / Bad。

### 11.1 结构

```text
Chapter card
→ Vertical timeline
→ Node
→ Current node halo
→ Locked / hidden future nodes
```

### 11.2 节点状态

| 状态 | 视觉 |
|---|---|
| unread | 蓝灰空心点 |
| read | 蓝灰点亮，低亮 |
| current | 玫瑰金细线光晕 |
| choice | 小型玫瑰金标记，但不暴露路线结果 |
| locked | `???` + 雾化 |
| hidden route | 不展示，或只显示模糊占位 |

章节地图应该像记忆档案 / 心跳轨迹，不像 RPG 地图或活动关卡。

---

## 12. P1 Components

### 12.1 Save Card

| 元素 | 规格 |
|---|---|
| 缩略图 | 72 x 104 dp，带遮罩 |
| 标题 | 章节名，15 sp |
| 副标题 | 节点名 / 保存时间，12 sp |
| 操作 | 读取 / 覆盖 / 删除，图标优先 |
| 状态 | 自动存档、手动存档、空槽 |

不要做手游仓库感。删除态使用枯玫瑰红，不使用刺眼红。

### 12.2 Gallery Card

| 状态 | 视觉 |
|---|---|
| unlocked | 图片轻微亮起，显示标题 / 解锁时间 |
| locked | 雾面遮罩 + `???` + 细线锁 |
| selected | 玫瑰金细线 |

图鉴像相册和记忆档案，不像卡牌收藏。

### 12.3 Ending Card

| 结局 | 色调 |
|---|---|
| TRUE END：世界第一，与你 | 冷白 + 淡金 |
| GOOD END：那么完美，那么爱你 | 白玫瑰 + 浅粉金 |
| NORMAL END：普通情侣 | 暖灰 + 柔白 |
| BAD END：好麻烦 | 深蓝黑 + 枯玫瑰红 |

结局卡必须比普通弹窗更有仪式感，但不能做抽卡爆光。

### 12.4 Backlog Item

| 元素 | 规格 |
|---|---|
| 说话人 | 13 sp，玫瑰金或蓝灰 |
| 正文 | 15-16 sp |
| 时间 / 节点 | 11-12 sp |
| 选项记录 | 细线标签，不显示数值变化 |

---

## 13. PM Review Checklist

请 PM 重点确认：

- P0 组件是否覆盖首轮样张需要。
- LINE 是否按这个复杂度出样张即可。
- 章节地图隐藏路线的表现是否足够防剧透。
- 对话框尺寸是否符合长文本阅读预期。
- 选项标签是否允许出现，还是首版完全不出现。
- 结局卡四类视觉基调是否符合产品口径。

