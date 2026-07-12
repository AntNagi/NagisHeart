# XoXo 最终设计交付记录

日期：2026-07-11  
负责人：XoXo  
状态：按 Ant 当前确认版收口，交付 yiyi 开发接入

## 最终采用包

最终切图交付目录：

`handoff/yiyi_final_visual_slices_20260711/`

该目录是当前开发接入的唯一准版本。历史目录仍保留作过程记录，但不再作为 yiyi 接入依据。

## Ant 已确认的内容

- App icon 使用无黑眼圈版本，不再使用眼下黑色阴影版。
- 前置流程五张图按当前新设计版推进。
- 开屏页和首页必须区分：开屏页只保留 `START`，首页才有继续故事、章节目录、回忆画廊、系统设置等入口。
- 系统级交互文本使用中文；开屏艺术字和 `START` 可保留英文作为视觉识别。
- 主要操作采用文字型按钮，不使用矩形、圆角矩形、切角框、胶囊背景框。
- 开场白页按剧情逐句展示，不做多段文案堆叠版。
- 剧情文本展示层必须区分角色对话与旁白。
- `nagiCall` 本轮暂停：不设置，也不纳入本轮主链替换规则。

## 最终切图清单

| 模块 | 文件 | 尺寸 | 说明 |
|---|---|---:|---|
| App icon | `app_icon/app_icon_1024_no_dark_eye.png` | 1024 x 1024 | 无黑眼圈最终版 |
| Play Store icon | `app_icon/play_store_icon_512.png` | 512 x 512 | 商店/预览用 |
| Android icon | `app_icon/android_mipmap/mipmap-*/ic_launcher.png` | 多尺寸 | 直接放入 Android mipmap |
| 开屏页 | `start_flow/01_splash_start_poster_9x16.png` | 1080 x 1920 | 独立开屏，只保留 START |
| 开屏背景层 | `start_flow/splash_layers/splash_bg_remeet_clean_1080x1920.png` | 1080 x 1920 | TT v15 同源干净背景 |
| 开屏标题层 | `start_flow/splash_layers/splash_title_overlay_fullcanvas.png` | 1080 x 1920 | 标题整块锁定层，禁止拆字重排 |
| 开屏 START 层 | `start_flow/splash_layers/splash_start_overlay_fullcanvas.png` | 1080 x 1920 | CTA 整块锁定层，可单独加轻动效 |
| 开场白页 | `start_flow/02_prologue_opening_sentence_9x16.png` | 1080 x 1920 | Prologue 逐句展示 |
| 输入名字页 | `start_flow/03_name_input_9x16.png` | 1080 x 1920 | 仅保留玩家名输入与文字型确认 |
| 章节开篇页 | `start_flow/04_chapter_opening_9x16.png` | 1080 x 1920 | 每章开始过渡 |
| 章节结算页 | `start_flow/05_section_clear_9x16.png` | 1080 x 1920 | 每幕/章节完成过渡 |
| 总览 | `preview/start_flow_contact_sheet.jpg` | 预览图 | 五张图总览 |

## 开发实现规则

### 开屏页

- 开屏页只承载第一视觉冲击和 `START`。
- `Nagi's Heart` 不要再用代码分行重排，必须作为整块锁定标题层接入。
- `START` 是唯一操作入口，可以轻触整个开屏页或轻触 `START` 进入后续流程。
- 推荐接法是 `背景层 + 标题层 + START 层` 三层叠放。
- `START` 层允许单独加轻呼吸 / 轻发光动效；标题层不参与缩放。
- 不允许再叠加黑色、灰色、白色半透明大遮罩块破坏整图。
- 如果字体可读性不够，只能通过字体颜色、描边、柔阴影、轻发光和落位微调解决，不能靠大面积遮罩偷懒。

### 首页

- 首页不是开屏页。
- 首页与开屏页标题必须统一为同一套标题系统，直接沿用开屏标题语言，不重新手排一个新标题。
- 首页可共用系统背景图，但不显示 `START`。
- 首页入口用中文文字型按钮呈现。

### 系统级页面

- 首页、存档进度、章节目录、回忆画廊、系统设置、剧情回顾页，本轮统一共用开屏页同源背景图。
- 这些系统级页面的标题、留白、导航、按钮语言都要统一，不允许某页有背景、某页纯深底、某页又换一套标题。

### 开场白页

- 按剧情逐句播放，一屏只显示一句正文。
- 文字可读性优先通过文字样式与局部轻处理解决，不要再上大块实体遮罩。
- 不能使用大块说明卡片或实体按钮框。

### 输入名字页

- 输入区域居中，视觉上保持轻量。
- 本轮只保留玩家名输入，不再保留 Nagi 称呼第二输入项。
- 确认入口使用文字型按钮，不使用深色实体框。

### 章节开篇与章节结算

- 章节开篇用于进入章节前的短暂停留，风格要沉一点，避免像普通设置页。
- 章节结算页用于完成后的过渡，按钮仍按文字型处理。

### 剧情文本层

- 角色对话：显示角色名，正文使用无衬线字体，字重比旁白更明确。
- 短旁白：不显示角色名，也不显示 `旁白` 标签；正文使用衬线/斜体气质，颜色偏银灰。
- 长旁白：整页毛玻璃阅读层，不显示角色名，也不显示 `旁白` 标签；正文左对齐、分页展示，不滚动。
- 对话与旁白必须一眼能分辨，不能只是同一个框内换一行字。

### 导航与图标

- 剧情页顶部导航不采用厚重切角实体按钮排排站。
- 导航应回到 v2 整体语言：弱容器、轻量图标、清晰标题、低存在感底板。
- 图标使用统一一套轻量线性风格，不混用不同粗细、不同容器形态的按钮。
- 如果当前实现与以上不符，以重做为准，不允许开发自由发挥出新的导航体系。

补充：full scope 最终执行口径见 `D:\Nagi‘s Heart\PM_AGENT_OUTBOX\design_reply_xoxo_fullscope_20260711_2252.md`。

## Android 同步情况

已同步到当前 Android 工程：

- `android/app/src/main/assets/bg/poster_start_nagis_heart_keyart.png`
- `android/app/src/main/res/mipmap-*/ic_launcher.png`

后续 yiyi 接入时，以 `handoff/yiyi_final_visual_slices_20260711/README_yiyi.md` 为准。
