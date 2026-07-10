# Nagi's Heart · CoCo to XoXo Design Handoff v1.0

> From: CoCo  
> To: XoXo  
> Date: 2026-07-10  
> Project: Android portrait remake of Nagi's Heart  
> Current role handoff: XoXo will continue design work on the home computer.

---

## 0. 最重要的交接口径

XoXo，先看这里。

当前项目不是“设计已定稿，交给工程照做”的状态。现在是：

```text
BG Mapping v1.1: 已通过审核，可以作为背景匹配口径继续推进。
P0 HiFi UI Board: CoCo 高保真草案，尚未用户确认。
P0 HiFi UI Spec: CoCo 高保真草案说明，尚未用户确认。
CC: 只能先按 handoff 搭 UI 骨架，不能按高保真草案做最终视觉还原。
```

请不要把 `NagisHeart_P0_HiFi_UI_Board_v1_0.html` 当成已过审设计交给 cc。它只是下一轮给用户看的讨论稿。

---

## 1. 当前确认过的设计方向

正式视觉方向名称：

```text
冷光玫瑰 / Snowlit Rose
```

基本原则：

1. Android 首版只做竖屏体验，不考虑横屏。
2. 图片和文字是主体，UI 不做重卡片感。
3. 普通剧情界面：背景融入叙事，文字层轻托底。
4. 被交互调出的界面：LINE、Chapter、Save、Gallery、Settings 可以使用完整半透明毛玻璃背景。
5. LINE 和 Chapter 必须是两套不同设计：
   - LINE 是聊天界面，有气泡、时间、已读。
   - Chapter 是记忆轨迹 / 节点地图，不是聊天。
6. Choice 必须是三条独立选项，不能合成一个大框。
7. 不用无意义 X 装饰；点缀统一用原创五边形 / 五边形环。
8. 可以吸收 Blue Lock 的五边形、训练设施、冷光运动感，但不要直接复制官方 Logo。
9. 形状语言统一为轻切角 + 五边形，避免又圆又方。
10. `uiTheme: light | dark | auto` 是必须支持的设计前提。

---

## 2. 用户已经明确不喜欢的方向

这些不要再走回头路：

1. 不喜欢明显边框、卡片套卡片、按钮框线太重。
2. 不喜欢文字 / 图标过弱、看不清。
3. 不喜欢为了“设计感”加无意义的 X、线、假装聪明的装饰。
4. 不喜欢 LINE 和 Chapter 用同一套设计。
5. 不喜欢 Choice 变成一个大框。
6. 不喜欢背景图边缘被强行模糊成雾化边框。
7. 不喜欢纯白大雾板太浅导致字看不清。
8. 不喜欢页面元素有的圆、有的方，整体不统一。

一句话：克制，但不能寡淡；透明，但必须可读；有乙女质感，但不能粉色手游模板。

---

## 3. 当前主要文件

### 3.1 已通过 / 可继续使用

```text
design/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_v1_1.md
design/bg_contact_sheet_v1.jpg
```

说明：

- BG Mapping v1.1 已按审核意见整理。
- 它包含：已配 / 临时代用 / 空缺 / 系统、A/B/临代等级、mood 字段建议。
- 暂不要直接填满 `story-data/scene_visuals.json`。

### 3.2 草案 / 待用户确认

```text
design/NagisHeart_P0_HiFi_UI_Board_v1_0.html
design/NagisHeart_P0_HiFi_UI_Spec_v1_0.md
design/nagisheart_mainflow_ui_board_v1_0.html
design/NagisHeart_MainFlow_UI_Design_CC_v1_0.md
```

说明：

- P0 HiFi Board 是 CoCo 初稿，不是定稿。
- XoXo 接手后第一件事不是继续扩页面，而是帮用户审这套 UI 是否方向对。

### 3.3 工程 handoff / 骨架参考

```text
design/NagisHeart_Android_Design_Handoff_CC_v1_0.md
design/NagisHeart_Android_UI_Tokens_v1_0.md
design/NagisHeart_Android_Core_Components_v1_0.md
design/NagisHeart_Android_Icon_System_CC_v1_0.md
design/NagisHeart_CC_Start_Checklist_v1_0.md
```

说明：

- cc 当前只能按这些搭 Android UI 骨架。
- `NagisHeart_CC_Start_Checklist_v1_0.md` 已改过口径：高保真是草案，不能当最终视觉标准。

### 3.4 资源目录

```text
assets/bg/
assets/ui/svg/
assets/ui/android/drawable/
story-data/scene_visuals.json
```

说明：

- `assets/bg/` 里已有 40+ 张背景 / 角色图。
- `assets/ui/svg/` 和 `assets/ui/android/drawable/` 有一批初版图标。
- `scene_visuals.json` 当前已有基础字段，但还没落入 CoCo v1.1 的 mood / visualPriority。

---

## 4. BG Mapping 当前结论

BG Mapping v1.1 已通过审核，核心结论如下。

### 4.1 A 级：必须补图

这些最优先：

```text
p1 作战室·初遇
c1a 会议室初见
transfer_contract 夏窗·签约桌上的好麻烦
e_agency_launch 她站在光里
TRUE / GOOD / NORMAL / BAD Ending Card
```

注意：Ending Card 必须独立设计，不能套普通剧情 BG。

### 4.2 B 级：后补

```text
p2 投资的私心
c1b 不麻烦的人 / LINE 专用背景
w_game 游戏冷战
club_media 媒体室
bad_plan 深夜数据会议室
bad_afterglow 舆论放大
bad_last 雨后训练基地外
p8_route 机场 / 夜景 / 离别氛围
```

### 4.3 比赛节点

首版可以复用：

```text
assets/bg/goal.jpg
```

但后续至少拆三套：

```text
U-20
世界杯
最终决赛
```

否则所有比赛都会像同一场。

### 4.4 mood 字段

建议后续给 `scene_visuals.json` 增加：

```json
{
  "visualPriority": "A | B | temp | none | system",
  "mood": "romance | daily | tension | competition | loneliness | triumph | loss | reflection"
}
```

`mood` 只给 UI 动效、BGM、转场和遮罩使用，不参与剧情逻辑。

---

## 5. 结局卡口径

产品口径以这里为准：

```text
TRUE END：世界第一，与你
GOOD END：那么完美，那么爱你
NORMAL END：普通情侣
BAD END：好麻烦
```

注意：SCRIPT V15 里 `bad_far` 还写着 `BAD END｜远处的世界第一`，这是旧口径。UI 和结局卡必须按产品口径显示 `好麻烦`。

---

## 6. XoXo 回家后建议先做什么

建议顺序：

1. 先打开 `NagisHeart_P0_HiFi_UI_Board_v1_0.html`，从用户视角审一遍。
2. 判断高保真 UI 是否还存在这些问题：
   - 是否仍然太框？
   - 是否文字 / 图标不够托起来？
   - LINE 和 Chapter 是否足够不同？
   - Choice 是否太占屏或不够精致？
   - 五边形元素是否自然，而不是硬贴？
3. 如果方向不稳，先改 P0 HiFi Board，不要急着给 cc。
4. 如果方向稳，再整理一版 `NagisHeart_P0_HiFi_UI_Board_v1_1.html`。
5. 然后出 Ending Card 四类视觉方向。
6. 最后再考虑把 BG Mapping v1.1 落到 `scene_visuals.json`。

---

## 7. 不要做的事

1. 不要直接把 HiFi v1.0 当最终稿交给 cc。
2. 不要直接填满 `scene_visuals.json`。
3. 不要用普通 BG 做 Ending Card。
4. 不要为了填空硬配背景。
5. 不要直接复制 Blue Lock 官方 Logo。
6. 不要继续微调旧的 `coco_minimal_ui_check_v1_0.html` 当主线，它只是早期验证样张。

---

## 8. 给 XoXo 的工作备忘

如果只能做一件事：先把 P0 HiFi UI 草案审完，确认它是不是“用户真的愿意往下打磨的方向”。

如果能做两件事：第二件做四类 Ending Card 的视觉提案。

如果能做三件事：第三件才是 A 级补图的构图草案。

当前状态不是卡在工程，而是卡在“高保真方向要不要确认”。设计别急着交付，先让用户看舒服。
