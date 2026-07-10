# Nagi's Heart · CC Start Checklist v1.0

> 文档类型：工程开工检查清单  
> 提交对象：CC Engineer  
> 目标：按最小闭环搭起 Android UI，不等待所有高保真细节。

> 2026-07-10 Update: `NagisHeart_P0_HiFi_UI_Board_v1_0.html` 和 `NagisHeart_P0_HiFi_UI_Spec_v1_0.md` 当前是 CoCo 高保真草案，待用户确认后才可作为 CC 正式视觉标准。CC 现阶段只按本文和 handoff 文档搭 UI 骨架，不按高保真草案做最终还原。

---

## 1. 必读文档

请 CC 开工前先读：

```text
NagisHeart_Android_Design_Handoff_CC_v1_0.md
NagisHeart_Android_UI_Tokens_v1_0.md
NagisHeart_Android_Icon_System_CC_v1_0.md
NagisHeart_BG_Adaptation_TestPlan_v1_0.md
```

CoCo 高保真草案（待确认，不作为 CC 最终实现标准）：

```text
NagisHeart_P0_HiFi_UI_Board_v1_0.html
```

高保真说明（待确认）：

```text
NagisHeart_P0_HiFi_UI_Spec_v1_0.md
```

早期 minimal checker 只用于追溯结构验证，不作为最终视觉标准：

```text
coco_minimal_ui_check_v1_0.html
```

---

## 2. 第一阶段实现目标

第一阶段不要做完整游戏，只做 UI 骨架和可切换样例。

必须实现：

- 竖屏 Scene 容器。
- 背景图显示。
- `uiTheme: light | dark | auto`。
- HUD。
- Dialogue。
- Choice。
- LINE Mode。
- Chapter Map。
- 图标系统初版。

---

## 3. 第一阶段 Demo 数据

背景：

```text
assets/bg/apartment.jpg
assets/bg/bedroom.jpg
assets/bg/pitch.jpg
assets/bg/drive.jpg
assets/bg/valentine.jpg
assets/bg/hug.jpg
```

文本：

```text
Nagi Seishiro
“如果你一直在这里的话，我大概也会想赢得更认真一点。”
```

Choice：

```text
靠近：把围巾往他那边推过去一点。
沉默：假装没有听见他的低声抱怨。
认真：问他是不是真的想成为世界第一。
```

LINE：

```text
到家了吗。
到了。你不是说训练后会很困吗？
嗯。
但是想到你可能还醒着。
```

Chapter：

```text
重逢后的第一场雨
他开始认真看向你
???
???
```

---

## 4. 第一阶段验收

截图验收：

- `apartment + Dialogue`
- `apartment + Choice`
- `bedroom + LINE`
- `bedroom + Chapter`
- `pitch + Dialogue`
- `drive + LINE`
- `valentine + Choice`

通过条件：

```text
所有文字可读。
Choice 是三条独立选项。
LINE 和 Chapter 是不同设计。
HUD 图标统一。
无 X 装饰。
无大面积硬卡片。
无重粉色少女 App 感。
无黑蓝电竞菜单感。
```

---

## 5. 暂不做

第一阶段暂不做：

- 最终首页 KV。
- 最终品牌 Logo。
- 完整存档逻辑。
- 图鉴真实解锁逻辑。
- 字体授权内置。
- 全部背景 9:16 精裁切。
- 动效精修。
