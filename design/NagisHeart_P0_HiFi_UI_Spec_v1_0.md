# Nagi's Heart · P0 HiFi UI Spec v1.0

> Owner: CoCo Design  
> For: CC Engineer / GPT PM  
> Visual direction: Snowlit Rose / 冷光玫瑰  
> Reference board: `NagisHeart_P0_HiFi_UI_Board_v1_0.html`

---

## 0. 这份交付的定位

这份是 P0 高保证 UI 目标，不是前面 `coco_minimal_ui_check_v1_0.html` 的微调版。

前面的 minimal checker 只用于验证：竖屏、安全区、背景可读性、`uiTheme`、Dialogue / Choice / LINE / Chapter 的基本结构。

从现在开始，CC 开工请优先参考：

```text
design/NagisHeart_P0_HiFi_UI_Board_v1_0.html
design/NagisHeart_P0_HiFi_UI_Spec_v1_0.md
assets/ui/svg/
assets/ui/android/drawable/
```

---

## 1. 核心视觉原则

1. 图片和文字是主体，不做重卡片 UI。
2. 普通剧情界面必须让背景图参与叙事，UI 只托住文字。
3. 被交互调出的界面可以加完整毛玻璃背景，比如 LINE、Chapter、Save、Gallery、Settings。
4. LINE 和 Chapter 必须是两种设计语言：
   - LINE 是私密聊天界面，有气泡、时间、已读状态。
   - Chapter 是记忆轨迹 / 节点地图，不做聊天气泡。
5. Choice 必须是三条独立选项，不合并成一个大框。
6. 不使用无意义 X 装饰；点缀统一为原创五边形 / 五边形环。
7. 不直接复制 Blue Lock 官方 Logo，只吸收“五边形、训练设施、冷光运动感”的几何气质。
8. 形状统一为轻切角和五边形，圆角只在毛玻璃柔化中出现，避免又圆又方。

---

## 2. P0 页面清单

### 2.1 App Icon / Mark

文件：

```text
assets/ui/svg/app_icon_nagisheart.svg
assets/ui/android/drawable/ic_app_mark.xml
```

方向：原创五边形外框 + 心跳线 + 冷光玫瑰色。Android 首版可先用 vector foreground，后续再补 adaptive icon 背景层。

### 2.2 Splash

用途：启动过渡。

实现重点：
- 居中显示 App mark。
- 背景使用冷暗渐变，避免纯黑。
- 标题只显示 `Nagi's Heart`，不要加说明文案。

### 2.3 Start

用途：首页主入口。

实现重点：
- 背景先用占位 KV，不强制绑定最终首页图。
- 菜单为纵向文字按钮，每一条独立，有轻切角和半透明托底。
- `Continue` 是主按钮，其他入口降级。

### 2.4 Opening

用途：开场白 / 旁白。

实现重点：
- 文本用半透明毛玻璃大区域承载。
- 背景仍然可见，不做纯白整板。
- 适合长文本，不需要头像。

### 2.5 Name Setup

用途：玩家名设置。

实现重点：
- 输入区域是轻托底，不做系统表单感。
- `Confirm` 沿用 Start 菜单按钮语言。

### 2.6 Dialogue

用途：普通剧情对话。

实现重点：
- HUD 顶部轻量化，不做明显框线。
- 底部对话区使用半透明毛玻璃叙事层。
- 说话人、台词、进度点要可读。
- 支持 `uiTheme: light | dark | auto`。

### 2.7 Choice

用途：剧情选择。

实现重点：
- 三条独立选项，每条都是单独点击区域。
- 每条左侧用五边形小标记，不用 X。
- 当前 / hover / pressed 可用金色微光和透明度变化。
- 占屏不要过大，优先集中在屏幕中下部。

### 2.8 LINE Mode

用途：聊天特殊界面。

实现重点：
- 这是被交互调出的界面，允许完整毛玻璃背景。
- 需要有聊天气泡、时间、read 状态。
- 和 Chapter 不共用布局。
- P0 先出样张，完整消息系统可 Phase 2。

### 2.9 Chapter Map

用途：章节 / 记忆轨迹。

实现重点：
- 是节点地图，不是聊天，不是系统列表。
- 未解锁路线显示 `???` 或隐藏，不提前剧透 Dream / Stay / Bad。
- 当前节点突出，已读节点降级，锁定节点低透明。

### 2.10 Save / Load

用途：存档和读档。

实现重点：
- 调出界面，允许毛玻璃背景。
- 存档条目为横向行，包含缩略图、章节、短文本、时间。
- P0 可以先做静态列表。

### 2.11 Gallery

用途：CG 和结局回看。

实现重点：
- P1 页面，但要给 CC 预留结构。
- 未解锁显示 `???`，不要直接泄露结局图。
- 结局名称按 PM 当前口径：
  - TRUE END：世界第一，与你
  - GOOD END：那么完美，那么爱你
  - NORMAL END：普通情侣
  - BAD END：好麻烦

### 2.12 Settings

用途：设置。

实现重点：
- P2 页面，但首版路由可以先占位。
- 先包含 Text Speed、Auto、Sound 三类。

---

## 3. CC 第一轮实现顺序

1. 竖屏 Scene 容器与背景铺图。
2. `uiTheme: light | dark | auto`。
3. App icon / HUD icon vector 接入。
4. Start / Splash / Opening / Name Setup。
5. Dialogue / Choice。
6. LINE 样张。
7. Chapter Map。
8. Save / Gallery / Settings 占位页。

---

## 4. 验收口径

CC 第一轮截图至少覆盖：

```text
Splash
Start
Opening
Name Setup
Dialogue light
Dialogue dark
Choice
LINE Mode
Chapter Map
Save / Load
Gallery
Settings
```

通过条件：

```text
文字可读
背景仍有主体性
普通剧情不是大卡片
交互调出界面有稳定毛玻璃承载
Choice 是三条独立选项
LINE 和 Chapter 是两种设计
无 X 装饰
五边形符号统一
不直接复制官方 Blue Lock 标识
```

---

## 5. 后续还要继续精修

这份已经足够 CC 开工，但还不是最终美术定稿。后续 CoCo 继续补：

```text
最终首页 KV
Android adaptive icon 完整尺寸
更多按钮状态
LINE 更多消息状态
Chapter 节点展开态
Save / Load 空状态和确认弹窗
Gallery 结局卡视觉
9:16 背景裁切记录
动效节奏
```
