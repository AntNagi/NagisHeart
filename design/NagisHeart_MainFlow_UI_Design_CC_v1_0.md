# Nagi's Heart · Main Flow UI Design for CC v1.0

> 文档类型：主链路 UI 设计交付  
> 提交对象：CC Engineer / GPT PM / CoCo  
> 配套高保真视觉板：`NagisHeart_P0_HiFi_UI_Board_v1_0.html`  
> 早期主链路草稿：`nagisheart_mainflow_ui_board_v1_0.html`  
> 配套切图：`assets/ui/`

> 2026-07-10 Update: CC 开工以 P0 HiFi UI Board 和 `NagisHeart_P0_HiFi_UI_Spec_v1_0.md` 为主。本文保留主链路结构说明，但视觉优先级低于高保真画板。

---

## 1. 本次交付范围

本轮不是继续微调单个检查样张，而是给 CC 建 Android 主链路页面的首版设计。

包含：

1. App icon / App mark。
2. Splash / 启动页。
3. Start 首页。
4. 开场白页。
5. 玩家名字设置页。
6. 游戏对话页。
7. Choice 选项页。
8. LINE 模式页。
9. Chapter 章节地图。
10. Save / Load。
11. Gallery。
12. Settings。

---

## 2. 资源

### 2.1 App Icon

```text
assets/ui/svg/app_icon_nagisheart.svg
assets/ui/android/drawable/ic_app_mark.xml
```

说明：

- 使用原创五边形 / 心跳弧线符号。
- 不直接复制 Blue Lock 官方 Logo。
- Android 首版可以先用 `ic_app_mark.xml` 做 foreground mark。

### 2.2 图标资源

```text
assets/ui/svg/
assets/ui/android/drawable/
```

图标包括：

```text
back, menu, auto, skip, backlog, save, chapter, gallery,
settings, line, lock, continue, pentagon_ring, pentagon_fill
```

---

## 3. 页面规则

### 3.1 普通剧情页

```text
背景图是主体。
HUD 轻。
对话区在底部，用叙事雾层托字。
不做硬卡片。
```

### 3.2 调出界面

LINE、Chapter、Save、Gallery、Settings 都是调出界面，可以有独立背景层。

```text
半透明毛玻璃
边缘可以柔化
信息密度比剧情页高
但不要做系统后台感
```

### 3.3 Choice

```text
必须是多条独立选项。
不能合成一个整体框。
每条有独立点击区域。
可使用轻毛玻璃托底。
```

---

## 4. 页面规格

## 4.1 Splash

用途：启动过渡，显示 App mark。

结构：

```text
Deep Blue Night background
→ App pentagon mark
→ Nagi's Heart
→ loading 微光线
```

工程：

- 1.2s - 1.8s 自动进入 Start。
- 没有交互。

---

## 4.2 Start

用途：首页。

内容：

- Continue
- Start
- Chapter
- Gallery
- Settings

规则：

- 首版用占位 KV 或 `assets/home.jpg` / `assets/home2.png` 均可。
- 不做任务、商城、活动入口。
- 菜单为竖向文字项，轻切角托底。

---

## 4.3 Opening

用途：开场白 / 序章文本。

结构：

```text
背景图
→ 全屏柔雾
→ 中部文本
→ Skip / Continue
```

规则：

- 可以分屏播放多段。
- 文本不宜超过 6 行。
- Skip 低存在感。

---

## 4.4 Name Setup

用途：玩家名和 Nagi 称呼设置。

结构：

```text
标题
说明
输入框
预览句
确认按钮
```

规则：

- 输入框可以使用轻切角毛玻璃。
- 确认前显示预览句。
- 错误提示不使用红色大警告。

---

## 4.5 Game Dialogue

按 `NagisHeart_Android_Design_Handoff_CC_v1_0.md` 的 Dialogue 实现。

关键：

- 底部叙事雾层。
- 说话人名托底。
- 正文 17sp。
- HUD 不抢画面。

---

## 4.6 Choice

关键：

- 三条独立项。
- 每条 46-56dp。
- 左侧五边形标记。
- 当前 / hover / pressed 可轻微增强。

---

## 4.7 LINE

关键：

- LINE 是单独特殊界面。
- 需要半透明毛玻璃背景。
- 左右气泡不同。
- 可显示时间、read、typing。

---

## 4.8 Chapter

关键：

- 记忆档案式时间轴。
- 不剧透路线。
- 未解锁显示 `???`。
- 节点使用五边形 / 菱形语言。

---

## 4.9 Save / Load

关键：

- 存档列表。
- 背景缩略图。
- 章节、节点、时间。
- 操作按钮图标化。

---

## 4.10 Gallery

关键：

- 相册 / 记忆档案感。
- locked 用雾化 + 五边形锁。
- 不做抽卡卡牌感。

---

## 4.11 Settings

关键：

- 分组清楚。
- Text / Audio / Display / Skip / Data。
- 使用切角毛玻璃列表项。
- 不做系统后台。

---

## 5. CC 第一轮可以直接做的组件

```kotlin
NagiAppIcon
NagiSplashScreen
NagiStartScreen
NagiOpeningScreen
NagiNameSetupScreen
NagiGameScreen
NagiChoiceLayer
NagiLineScreen
NagiChapterMapScreen
NagiSaveLoadScreen
NagiGalleryScreen
NagiSettingsScreen
NagiHud
NagiIconButton
```

---

## 6. 验收截图

CC 做完第一轮后，至少交付这些截图：

```text
Splash
Start
Opening
Name Setup
Dialogue apartment
Choice valentine
LINE bedroom
Chapter bedroom
Save / Load
Gallery
Settings
```
