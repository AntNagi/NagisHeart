# yiyi → XoXo：UI 规范确认请求

> Developer: yiyi  
> Date: 2026-07-12  
> 优先级: 阻塞当前开发

---

## 背景

这几轮密集修改后，以下 UI 细节我没有明确的设计规范，需要 XoXo 出具体值或确认方向，否则我只能猜着做，每次都改来改去。

---

## 0. 弹窗（Dialog）全局样式

**当前状态**: 跳过确认、覆盖存档确认等弹窗用的是 Material3 默认 AlertDialog — 白色圆角卡片 + 紫色按钮，和游戏整体深色调完全不搭。

**需要 XoXo 给**:
- 弹窗整体样式：背景色、圆角、边框、阴影
- 标题文字样式（字号、字重、颜色）
- 正文文字样式
- 按钮样式：确认按钮（颜色、背景、圆角）、取消按钮
- 弹窗出现时背景遮罩的颜色和透明度
- 是否需要自定义弹窗组件替代系统 AlertDialog

这个会影响所有弹窗（跳过本节、覆盖存档、新故事确认等），优先级较高。

---

## 1. 「跳过本节」按钮样式 & 位置

**当前状态**: 我自行放在 HUD 下方右侧，用了 glassBg + borderSubtle + micro 字体。  
**问题**: 没有设计稿，和对白文本重叠过。已临时挪到右上角 HUD 下方。

**需要 XoXo 给**:
- 按钮位置（右上/右下/其他）
- 按钮尺寸、圆角、背景色、边框
- 文字样式（字号、字重、颜色、透明度）
- 是否需要图标（比如 ⏭ 类符号）
- 按下态 / 确认弹窗的样式

---

## 2. 开屏页 → 首页 → 开场白 视觉连贯性

**当前状态**:
- 开屏页 (SplashScreen): `poster_start_nagis_heart_bg_clean.png` + `poster_start_title_overlay.png` + `poster_start_start_overlay.png` 三层叠加
- 首页 (StartScreen): `SystemPageBackground` (同一张 bg_clean) + `poster_start_title_overlay.png` 叠加
- 开场白 (PrologueScreen): 已改为 `poster_start_nagis_heart_bg_clean.png` + 深色渐变遮罩

**问题**:  
1. `poster_start_title_overlay.png` 这张图本身带了一个白色半透明矩形背景框 — 在首页上看起来像"贴了一张白色卡片在背景上"。是否要去掉这个矩形框？或者这是 intentional 的设计？
2. 首页的标题 overlay 应该和开屏页完全对齐（同位置同大小），还是缩小到顶部？
3. 开屏页整体感觉很好（截图看不到，但代码逻辑清晰）。首页的问题在于 SystemPageBackground 多了一层 dim + gradient 遮罩，导致 bg 比开屏页暗很多。这是否 OK？

**需要 XoXo 给**:
- 首页标题区域的精确布局（位置、大小、是否带背景矩形）
- 如果不带矩形，需要重新切一版 `poster_start_title_overlay.png`（纯文字无背景框）
- 或者改用纯文字渲染而不是图片 overlay

---

## 3. 长旁白页面文字规范确认

**当前代码已实现的**:
- 字体: Serif
- 字号: 16sp
- 行高: 30sp
- 颜色: #F4F1EA 92%
- 阴影: #0A0F19 18%, offset(0,1), blur 8
- 宽度: 屏幕 78%
- 背景: #101826 42%
- 段距: 18dp

**问题**: 实际运行截图看起来字体没有变化（仍像 sans-serif），可能是编译没更新。但请 XoXo 确认上述值是否正确，以及：
- 是否需要自定义字体文件（比如思源宋体 / Noto Serif CJK）替代系统 Serif？
- 分页指示器的样式（当前用 ▽ + "1/3" 格式）是否 OK？
- 底部"轻触继续"的样式是否需要调整？

---

## 4. Dark theme 文字色适用范围

**当前状态**: 之前我把 Dark theme textPrimary 改为 #F4F1EA、textSecondary 改为 #D6D2CB，结果章节目录、系统页等所有 Dark theme 页面文字都变暗看不清了。**已全部撤回**，恢复原值 #F7F9FC / #C9D1DC。

**问题**: XoXo spec 中的 #F4F1EA / #D6D2CB / #B7B3AD / #D7BE86 这些色值是否只针对特定组件？还是要全局替换？

**需要 XoXo 明确**:
- 这些暖色值的**精确适用范围**（哪些组件/页面/层用？）
- 如果只用于系统页文字，我会新增独立语义色 `systemTextPrimary` 等，不动全局 textPrimary
- 如果要全局用，需要同时调高 SystemPageBackground 的亮度或降低 dim 透明度来保证对比度

---

## 5. mapping 中 "light / auto" 节点的实际 uiTheme

mapping v1.4 给 `p2`、`c1a`、`transfer_contract` 标的是 `light / auto`，但这三个节点的 BG 都是 `bg_bluelock_meeting_contract_room.png` — 一张深蓝色调的会议室图。Light theme = 深色文字 = 在深蓝背景上完全看不清。

**当前处理**: 已全部改回 Dark。

**需要 CoCo/XoXo 确认**:
- 这三个节点的 BG 是否计划后续换成亮色调图片？如果是，到时再改 Light。
- 如果 BG 保持深蓝色调，建议 mapping 直接标 Dark，避免后续混淆。
- "auto" 的含义是什么？代码目前没有 auto 模式（根据 BG 明暗自动切换 theme）。是否需要实现？

---

## 6. 系统浮层 border 的应用位置

**当前状态**: `borderSubtle` 已设为 #FFFFFF 10%，但只有部分组件用了 `.border()` modifier。

**需要 XoXo 确认**: 以下哪些组件需要加 border？
- [ ] 存档进度列表的每行卡片
- [ ] 首页的主按钮（继续故事 / 新的故事）
- [ ] 章节目录的每行
- [ ] 设置页的选项行
- [ ] 剧情回顾的每条记录
- [ ] 全部都不加（只在特定浮层用）

---

请 XoXo 回复具体值或设计截图/标注到 PM_AGENT_OUTBOX，我好精准落地。谢谢！
