# Nagi's Heart · Android Design Handoff for CC v1.0

> 文档类型：Android UI 设计交付 / 工程开工版  
> 提交对象：CC Engineer / GPT PM / CoCo  
> 视觉方向：冷光玫瑰 / Snowlit Rose  
> 当前目标：让 CC 可以先搭 UI 架构、主题、主要页面和图标系统，不继续卡在单个样张细节。

---

## 1. 当前设计结论

经过最小样张验证，Android 首版设计先按以下方向落地：

```text
普通剧情画面：背景图主体 + 底部叙事层
交互调出界面：独立半透明毛玻璃层
选择界面：多条独立选项，不合并成一个框
图标系统：统一五边形 / Blue Lock 几何感
情绪点缀：玫瑰金少量使用
```

不要继续走：

- 大面积硬卡片。
- 满屏白雾板。
- 裸文字直接压在复杂背景上。
- 圆角、方框、五边形混用。
- X / 交叉符号点缀。
- 直接复制 Blue Lock 官方 Logo。

---

## 2. 设计语言

### 2.1 视觉关键词

```text
冷白
蓝灰
清透
克制
低压心动
五边形几何
剧情图像优先
```

### 2.2 形状语言

统一使用三类形状：

| 类型 | 用途 | 说明 |
|---|---|---|
| Soft Glass Field | 对话、调出界面背景 | 无硬边，边缘羽化 |
| Cut Geometry | 选项、标题托底、局部信息条 | 轻切角，不用圆角卡片 |
| Pentagon Mark | 图标、节点、小标记、水印 | Blue Lock 感来源，但不复制官方 Logo |

圆角只保留在极少数系统级辅助控件中，例如检查工具、系统弹窗。游戏内主要 UI 不靠圆角建立风格。

### 2.3 色彩使用

| 语义 | 色彩 |
|---|---|
| 主文字 Light | `#1B2430` |
| 主文字 Dark | `#F7F9FC` |
| 次文字 Light | `#6E7A89` |
| 次文字 Dark | `#C9D1DC` |
| 冷蓝灰 | `#AEBAC8` |
| 深夜蓝 | `#101827` |
| 玫瑰金 | `#BFA08A` |
| 心动玫瑰 | `#C98A96` |
| TRUE 淡金 | `#D8C38A` |

玫瑰金只用于：

- 当前选中。
- 章节节点当前态。
- 对话人名轻点缀。
- 结局卡仪式感。
- 特殊剧情微光。

---

## 3. Android 主题基础

### 3.1 首版画布

| 项目 | 规格 |
|---|---|
| 方向 | 竖屏 only |
| 设计基准 | 360 x 800 dp |
| 背景比例 | 9:16 |
| 推荐导出 | 1080 x 1920 px |
| 最小触控 | 48 dp |

### 3.2 建议 Compose 结构

```kotlin
NagiTheme
  colors
  typography
  spacing
  shapes
  icons

SceneScreen
  SceneBackground
  SceneOverlay
  NagiHud
  contentSlot
```

### 3.3 uiTheme

剧情节点必须支持：

```kotlin
enum class NagiUiTheme {
    Light,
    Dark,
    Auto
}
```

优先级：

```text
剧情节点指定 > 场景类型 > 背景亮度自动判断
```

---

## 4. 页面总览

### 4.1 P0 页面

CC 首先实现这些页面 / 状态：

| 页面 | 工程优先级 | 设计说明 |
|---|---|---|
| Home | P0 | 首页，占位 KV，验证结构 |
| Game Dialogue | P0 | 普通剧情对话 |
| Game Choice | P0 | 三条独立选择项 |
| Fullscreen Narration | P0 | 全屏旁白 |
| LINE Mode | P0 Design / Phase 2 完整实现 | 聊天特殊界面 |
| Chapter Map | P0 | 章节地图，不剧透路线 |

### 4.2 P1 页面

| 页面 | 工程优先级 | 设计说明 |
|---|---|---|
| Save / Load | P1 | 存档读取 |
| Backlog | P1 | 历史文本 |
| Gallery | P1 | 图鉴首页、CG、结局 |
| Ending Card | P1 | 结局达成卡 |

### 4.3 P2 页面

| 页面 | 工程优先级 | 设计说明 |
|---|---|---|
| Settings | P2 | 文本 / 音频 / 显示 / 数据 |
| Special Bonus | P2 | TRUE 彩蛋 |
| Web Container | P2 | 后续 Web 版容器 |

---

## 5. 页面设计规格

## 5.1 Home

### 目标

首页负责第一印象，但首版不追最终 KV。先用占位 KV 或现有背景验证结构。

### 层级

```text
Background / KV
→ Soft top/bottom overlay
→ Title
→ Primary actions
→ Secondary actions
```

### 内容

- `Start`
- `Continue`
- `Chapter`
- `Gallery`
- `Settings`

### 视觉

- 标题使用 serif 或高级感标题字。
- 菜单不要做运营按钮。
- 可使用五边形小标记，但不能满屏装饰。
- 按钮用文字 + 轻切角托底，不用大圆角按钮。

---

## 5.2 Game Dialogue

### 目标

普通剧情阅读状态。背景图是主体，文字稳定可读。

### 层级

```text
Background image
→ Scene overlay
→ HUD
→ Bottom narrative glass field
→ Speaker name
→ Dialogue text
→ Continue indicator
```

### 规格

| 元素 | 建议 |
|---|---|
| 对话区位置 | 底部 |
| 对话区高度 | 内容自适应，常态 140-190 dp |
| 对话区背景 | 底部渐变 / 羽化毛玻璃 |
| 说话人 | 13 sp，玫瑰金或冷蓝灰 |
| 正文 | 17 sp / 27-29 sp |
| 点击提示 | 弱化，不做强按钮 |

### 规则

- 不使用硬边框对话框。
- 不裸文字压复杂背景。
- 每个背景必须保证文字对比度。

---

## 5.3 Game Choice

### 目标

选择是剧情分歧，不是系统列表。必须有仪式感，但不能占太多画面。

### 层级

```text
Background image
→ Scene dim / focus protection
→ Choice item 1
→ Choice item 2
→ Choice item 3
```

### 规格

| 元素 | 建议 |
|---|---|
| 位置 | 屏幕中下部 |
| 左右边距 | 34 dp 左右 |
| 单项高度 | 46-56 dp |
| 间距 | 8-12 dp |
| 背景 | 每条独立羽化毛玻璃 |
| 标记 | 左侧小五边形 |
| 当前 / pressed | 轻微位移 + 玫瑰金增强 |

### 规则

- 三个选项必须是三条独立点击项。
- 不合并成一个大框。
- 不做圆角按钮。
- 不显示变量数值，例如 `好感+5`。

---

## 5.4 Fullscreen Narration

### 目标

用于连续叙事、情绪铺陈、转场。

### 规格

| 元素 | 建议 |
|---|---|
| 背景 | 当前背景弱化 |
| 文本区 | 中部偏上 |
| 文字 | 17 sp / 28 sp |
| 对齐 | 短句可居中，长段左对齐 |
| 遮罩 | 全屏轻毛玻璃 / 雾化 |

### 规则

- 不像系统弹窗。
- 不像网页文章。
- 一屏不要放过长段落。

---

## 5.5 LINE Mode

### 目标

LINE 是特殊演出，不是普通对话框换皮。

### 设计方向

```text
朴素毛玻璃聊天层
+ 左右消息气泡
+ 已读 / 时间节奏
+ 输入中状态
```

### 层级

```text
Background image
→ Fullscreen or large-area translucent frosted glass
→ Time marker
→ Nagi bubble
→ Player bubble
→ Read state
→ Typing indicator
```

### 规格

| 元素 | 建议 |
|---|---|
| 背景层 | 透明毛玻璃，边缘羽化 |
| Nagi 气泡 | 冷蓝灰 / 深蓝灰 |
| 玩家气泡 | 冷白 / 低饱和玫瑰白 |
| 气泡形状 | 轻切角，避免大圆泡 |
| 字号 | 15 sp / 22 sp |
| 最大宽 | 70% 屏宽 |

### 规则

- LINE 和 Chapter 必须是两种设计。
- LINE 可以有背景层。
- 不要强仿真绿色聊天软件。
- 不堆表情包。

---

## 5.6 Chapter Map

### 目标

章节地图是记忆档案 / 心跳轨迹，不是手游活动地图。

### 设计方向

```text
记忆档案式半透明时间轴
+ 当前节点
+ 已读节点
+ 未解锁 ???
+ 隐藏未解锁路线
```

### 规格

| 元素 | 建议 |
|---|---|
| 背景层 | 半透明毛玻璃，可比 LINE 更冷、更档案感 |
| 标题 | `Memory Track` / 章节名 |
| 时间轴 | 纵向 |
| 节点 | 五边形 / 菱形节点 |
| 当前节点 | 玫瑰金轻亮 |
| 未解锁 | `???` + 低透明 |

### 规则

- 首版不提前暴露 Dream / Stay / Bad 路线。
- 不做 RPG 地图。
- 不做活动关卡页。
- Chapter 和 LINE 不共用视觉结构。

---

## 5.7 Save / Load

### 目标

快速读取、覆盖、删除存档，视觉克制清楚。

### 内容

- 章节名。
- 节点名。
- 保存时间。
- 背景缩略图。
- 阅读进度。
- 读取 / 覆盖 / 删除。

### 视觉

- 列表或双列卡片均可。
- 卡片可用轻切角，不用大圆角。
- 缩略图加遮罩，避免太花。
- 删除态使用枯玫瑰红，不用高饱和红。

---

## 5.8 Backlog

### 目标

回看历史文本，不打断体验。

### 内容

- 说话人。
- 对话正文。
- 选项记录。
- 节点 / 时间。

### 视觉

- 类似档案列表。
- 文本可读优先。
- 选项记录用弱标签，不显示变量变化。

---

## 5.9 Gallery

### 目标

图鉴像相册 / 记忆档案，不像抽卡收藏。

### 分类

- CG。
- 结局。
- 事件回想。
- LINE 回想。
- 特殊彩蛋。

### 状态

| 状态 | 视觉 |
|---|---|
| unlocked | 图片轻亮，显示标题 / 解锁时间 |
| locked | 雾化 + `???` + 五边形锁标 |
| selected | 玫瑰金弱高亮 |

---

## 5.10 Ending Card

### 目标

结局达成必须有仪式感。

### 结局口径

| 类型 | 名称 | 色调 |
|---|---|---|
| TRUE END | 世界第一，与你 | 冷白 + 淡金 |
| GOOD END | 那么完美，那么爱你 | 白玫瑰 + 浅粉金 |
| NORMAL END | 普通情侣 | 暖灰 + 柔白 |
| BAD END | 好麻烦 | 深蓝黑 + 枯玫瑰红 |

### 规则

- 不是普通弹窗。
- 不做抽卡爆光。
- 可使用五边形几何和淡金微光。

---

## 5.11 Settings

### 目标

功能清楚，不像后台。

### 分类

- Text。
- Audio。
- Display。
- Skip。
- Data。

### 视觉

- 冷白 / 蓝灰基础。
- 分组明确。
- 开关、滑条、列表项统一使用轻切角。
- 不使用大量玫瑰金。

---

## 6. 图标系统

详见：

```text
NagisHeart_Android_Icon_System_CC_v1_0.md
```

工程上建议先做一套 `NagiIcon`：

```kotlin
enum class NagiIcon {
    Back,
    Menu,
    Auto,
    Skip,
    Backlog,
    Save,
    Chapter,
    Gallery,
    Settings,
    Line,
    Lock,
    CurrentNode,
    ChoiceMark,
    Read,
    Close,
    Delete,
    Load
}
```

图标统一原则：

- 24 dp 视觉尺寸。
- 48 dp 触控区域。
- 1.5 dp 线宽。
- 细线图标。
- 五边形 / 锁格感作为背景托底或小标。
- 不使用 X 作为装饰。

---

## 7. CC 开工顺序

建议 CC 按这个顺序实现：

1. `NagiTheme`：颜色、字号、间距、形状。
2. `SceneBackground`：背景图、遮罩、uiTheme。
3. `NagiIcon`：图标系统。
4. `NagiHud`：顶部 HUD。
5. `DialogueLayer`：普通对话。
6. `ChoiceLayer`：三条独立选择项。
7. `LineModeScreen`：LINE 特殊界面。
8. `ChapterMapScreen`：章节地图。
9. `SaveLoadScreen`。
10. `GalleryScreen`。
11. `EndingCard`。
12. `SettingsScreen`。

---

## 8. 需要先实现的验收样例

CC 第一轮实现后，用以下背景截图验收：

| 背景 | 状态 |
|---|---|
| `apartment.jpg` | Dialogue / Choice |
| `bedroom.jpg` | Dialogue / LINE / Chapter |
| `pitch.jpg` | Dialogue / Choice |
| `drive.jpg` | Dialogue / LINE |
| `valentine.jpg` | Choice |
| `hug.jpg` | Dialogue |

最低验收标准：

```text
文字能读。
背景不被完全盖掉。
Choice 是多条独立项。
LINE 和 Chapter 是两种设计。
图标形状统一。
不出现 X 装饰。
整体不像网页模板或普通卡片 UI。
```

---

## 9. 当前 HTML 样张的定位

当前文件：

```text
design/coco_minimal_ui_check_v1_0.html
```

只作为视觉方向快速验证，不是最终工程代码。

CC 不需要照搬 HTML 结构，但可以参考：

- 层级。
- 色彩。
- 毛玻璃强度。
- 五边形标记。
- 页面状态切换。

