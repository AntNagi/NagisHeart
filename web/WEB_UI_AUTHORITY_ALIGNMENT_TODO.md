# Web UI Authority Alignment TODO

> 基准文档：`design/NagisHeart_UI_Authority_XoXo_v1_0.html` + `XoXo_UI_Final_MinSpec_20260712.md`
> 执行人：cc
> 创建时间：2026-07-21
> 完成时间：2026-07-21

---

## tokens.css 全局 token 修正

- [x] 1. dark theme `--glass-bg` 系列颜色改为 authority 值
- [x] 2. dark theme HUD token 改为 authority 值（`--hud-color` / `--hud-soft`）
- [x] 3. `--lh-choice` 从 21px 改为 1.8（line-height 1.8）
- [x] 4. `--fs-prologue` 从 16px 改为 28px，`--lh-prologue` 改为 1.68
- [x] 5. 新增 authority 专用 token：金色 `--nagi-gold`、浮层底色/描边/模糊、dialog token、dialogue-box token、overlay layer 变量、clip-path helper

## 暗层系统（MinSpec §1）

- [x] 6. 系统级页面暗层：从平面 0.32 改为 3-stop 渐变 + 白色高光层
- [x] 7. splash 类暗层（开场白/名字设置）：改为双层（渐变 + 径向暗角）
- [x] 8. 剧情内页暗层：改为双层（顶底渐变 + 左右暗边）

## 开屏页（SplashScreen / MinSpec §2）

- [x] 9. 确认不叠暗层（当前正确）
- [x] 10. START 呼吸动效参数：alpha 0.72→1.00，scale 0.992→1.012，duration 1.8s

## 开场白页（PrologueScreen / MinSpec §3）

- [x] 11. 背景改为 splash 类双层暗层
- [x] 12. 正文字号从 31px 改为 28px，line-height 从 1.6 改为 1.68
- [x] 13. 增加顶部小标题两侧金色细线（CSS ::before/::after）
- [x] 14. 底部"轻触继续"提示（已存在）
- [x] 15. JS 中 counter 逻辑（已存在）

## 名字设置页（NameSetupScreen / MinSpec §4）

- [x] 16. 背景改为 splash 类双层暗层
- [x] 17. 副标题颜色从 `#D6D2CB` 改为 `rgba(232,238,246,0.72)`
- [x] 18. 占位符颜色从 alpha 0.58 改为 `rgba(244,241,234,0.66)`
- [x] 19. 顶部小标题"开始之前"（已存在）+ 两侧金色细线
- [x] 20. 确认区"进入故事" + "轻触确认"（已存在）
- [x] 21. JS 结构补全（已完整）

## 主页（StartScreen / MinSpec §5）

- [x] 22. 暗层从平面 0.32 改为系统级双层渐变
- [x] 23. 布局重做：两列主操作区（新的故事+说明、继续+说明）
- [x] 24. 次操作栏：4 列 grid（章节目录 / 回忆画廊 / 系统设置 / 关于）
- [x] 25. 主操作字号从 15px 改为 17px，font-weight 500
- [x] 26. 主操作说明 13sp、次操作 12sp
- [x] 27. 主次操作间分割线 `rgba(255,255,255,0.08)` + padding-top 16
- [x] 28. gap 改为 18px

## 对白层（DialogueBox / MinSpec §8）

- [x] 29. 底色从渐变遮罩改为轻玻璃卡片：`rgba(16,24,39,0.54) -> rgba(16,24,39,0.70)`
- [x] 30. 增加 border `rgba(255,255,255,0.08)` 1px
- [x] 31. 增加 backdrop-filter blur 16px
- [x] 32. 裁切改为 cut-md
- [x] 33. shadow `0 18px 40px rgba(0,0,0,0.26)`
- [x] 34. 外边距 left/right 18px，bottom 34px
- [x] 35. 内边距 top 18，left/right 20，bottom 22
- [x] 36. 对白正文颜色改为 `rgba(247,249,252,0.94)`

## 选项层（ChoicePanel / MinSpec §19）

- [x] 37. 布局从居中改为底部对齐 left/right 18 bottom 34
- [x] 38. 去掉 max-width 320px 限制
- [x] 39. 背景改为 `rgba(16,24,39,0.48)` + blur 12px + cut-sm
- [x] 40. gap 从 12px 改为 10px
- [x] 41. 选项文字颜色改为 `rgba(247,249,252,0.92)`
- [x] 42. 去掉居中背景遮罩

## HUD（MinSpec §7 / §15 / §17.2）

- [x] 43. title chip 渐变方向从 `to bottom` 改为 `to right`
- [x] 44. title chip text-shadow 改为 `0 2px 14px rgba(0,0,0,0.48)`
- [x] 45. title chip 增加中心装饰横线
- [x] 46. icon button 增加中心高光 radial-gradient
- [x] 47. icon button border 改为 0.12

## NagiDialog（MinSpec §11 / §16.5 / §17.3）

- [x] 48. 形状从 border-radius 24px 改为 cut-md clip-path
- [x] 49. padding 从 32/40/28 改为 22/22/18
- [x] 50. title 字号从 22px 改为 28px，颜色改为 `rgba(247,249,252,0.96)`
- [x] 51. body 字号从 15px 改为 16px，line-height 1.9，颜色 `rgba(244,241,234,0.88)`
- [x] 52. button gap 从 26px 改为 24px
- [x] 53. border 从 0.12 改为 0.08
- [x] 54. dismiss 颜色改为 `rgba(244,241,234,0.74)`，confirm 颜色 `#F7F9FC`，字号 15px
- [x] 55. 增加 inner highlight `::before`
- [x] 56. scrim 改为 `rgba(9,14,24,0.40)`

## 长旁白（MinSpec §9 / §17.4）

- [x] 57. 背景从实底改为 radial-gradient 椭圆雾化
- [x] 58. 增加 mask radial-gradient
- [x] 59. 外边距改为 left/right 18px
- [x] 60. 内边距改为 left/right 20px
- [x] 61. 去掉显式 border
- [x] 62. blur 改为 16px（narration-backdrop 层）

## 存档页（SaveLoad / MinSpec §1 系统页 + authority HTML）

- [x] 63. 改为系统级背景图 + 双层暗层 + 玻璃面板
- [x] 64. 标题"存档进度"，结构保持

## 系统设置页（Settings / MinSpec §1 + authority HTML）

- [x] 65. 改为系统级背景图 + 双层暗层 + 玻璃面板
- [x] 66. 各行小字/数值右置（已存在）

## 回忆画廊（Gallery / authority HTML）

- [x] 67. 新增 GalleryOverlay 页面，系统级背景 + 玻璃面板
- [x] 68. grid 布局骨架（CG 项 + END 项，已解锁/未解锁状态）

## 章节目录（ChapterSelect / MinSpec §16）

- [x] 69. 当前项背景从平面 gold 改为 `linear-gradient(to right, rgba(215,190,134,0.18), rgba(255,255,255,0.04))`
- [x] 70. 底部动作 padding-top 从 14px 改为 10px
- [x] 71. 左侧动作颜色改为 `rgba(244,241,234,0.82)`

## 章节/小节开始页（TransitionCard / MinSpec §14.1）

- [x] 72. 玻璃托底容器（已存在 chapter-card-backing）
- [x] 73. 托底背景：radial-gradient at 36% 42% + linear-gradient
- [x] 74. 托底 border `rgba(255,255,255,0.08)` + blur 10px + opacity 0.92 + cut-md

## 大章结束页（Chapter Clear / MinSpec §14.2）

- [x] 75. clear-card 组件（已存在）
- [x] 76. clear-card 背景改为 authority 双层 radial+linear
- [x] 77. actions：左"返回目录" + 右"进入下一章"（已存在）

## 结局页（Ending / MinSpec §18.1）

- [x] 78. 新增 ending-card 玻璃卡片
- [x] 79. 三层结构：content（tag+title+description）/ status feedback / primary action
- [x] 80. status feedback：11px inline note，非按钮
- [x] 81. primary action：仅"返回主页"
- [x] 82. mood token：TRUE/GOOD/NORMAL/BAD 不同 accent

## LINE 聊天层（MinSpec §20）

- [x] 83. 增加 soft-screen 玻璃容器 CSS
- [x] 84. 气泡形状 cut-sm（CSS ready）
- [x] 85. 气泡字号 14px（CSS ready）
- [x] 86. NPC 气泡色 `rgba(255,255,255,0.08)`
- [x] 87. 玩家气泡色 `rgba(215,190,134,0.18)`

## 剧情回顾页（Backlog/Recap / MinSpec §10）

- [x] 88. 背景叠暗层改为 `rgba(19,32,51,0.58)`
- [x] 89. 正文 text-shadow + 颜色对齐 authority

## 小节结束页

- [x] 90. 确认已移除（MinSpec §17.6：standalone Section Clear 已从产品范围移除）

---

✅ 全部 90 项已完成。
