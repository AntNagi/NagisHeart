# Nagi's Heart 最终视觉切图交付给 yiyi

日期：2026-07-11  
负责人：XoXo  
状态：Ant 已确认按本版继续开发

## 交付结论

本包为当前最终采用版，请优先接入这里的文件，不要再回退到历史 `v1 / v2 / v3 / v4 / v5` 临时目录。

补充说明：

- 开发直接执行清单：`XoXo_Dev_Ready_Spec_20260712.md`
- 仍需 XoXo 补最终设计后再落地的项目：`XoXo_Design_Pending_For_Dev_20260712.md`
- 当前全部已知问题的一次性修正单：`XoXo_Final_Developer_Fixlist_20260712.md`

## App Icon

使用“无黑眼圈”版本。

| 用途 | 文件 |
|---|---|
| 1024 原始图标 | `app_icon/app_icon_1024_no_dark_eye.png` |
| 应用商店 512 图标 | `app_icon/play_store_icon_512.png` |
| Android mipmap | `app_icon/android_mipmap/mipmap-*/ic_launcher.png` |

开发接入要求：

- Android `android:icon="@mipmap/ic_launcher"` 继续使用当前命名即可。
- 不要再使用带黑色眼下阴影的旧版 icon。
- 本次已同步覆盖 Android 工程内 `res/mipmap-*/ic_launcher.png`。

## 前置流程五张图

五张图均为 `1080 x 1920`，9:16 竖屏，可直接作为设计稿/切图参考。

| 页面 | 文件 | 接入说明 |
|---|---|---|
| 开屏页 | `start_flow/01_splash_start_poster_9x16.png` | 独立开屏，只保留 `START` 入口；不是首页 |
| 开场白页 | `start_flow/02_prologue_opening_sentence_9x16.png` | Prologue 逐句展示，一屏只显示一句正文 |
| 输入名字页 | `start_flow/03_name_input_9x16.png` | 仅保留玩家名输入，确认动作用文字型按钮 |
| 章节开篇页 | `start_flow/04_chapter_opening_9x16.png` | 进入每章前停留 1-2 秒或轻触继续 |
| 章节结算页 | `start_flow/05_section_clear_9x16.png` | 每幕/章节完成后的过渡页 |

预览总览：

- `preview/start_flow_contact_sheet.jpg`

## 开屏页分层接入

TT 最新开屏采用：

- `start_flow/01_splash_start_poster_9x16.png`

同时补充了分层素材，供 yiyi 直接布局适配：

| 用途 | 文件 |
|---|---|
| 干净背景 | `start_flow/splash_layers/splash_bg_remeet_clean_1080x1920.png` |
| 标题整块锁定层 | `start_flow/splash_layers/splash_title_overlay_fullcanvas.png` |
| START 整块锁定层 | `start_flow/splash_layers/splash_start_overlay_fullcanvas.png` |
| 标题紧图版 | `start_flow/splash_layers/splash_title_overlay_tight.png` |
| START 紧图版 | `start_flow/splash_layers/splash_start_overlay_tight.png` |
| TT 完整海报参考 | `start_flow/splash_layers/splash_poster_tt_v15_full_1080x1920.png` |

推荐接法：

- 底层使用干净背景。
- 标题使用整块锁定层，不要再拆成多段文本手动排，否则容易变成现在截图里那种断裂版式。
- `START` 使用整块锁定层或紧图版，单独放在最上层。
- 开屏页仍然只有 `START`，首页不要再出现 `START`。
- 开屏页不要额外叠任何黑色、灰色、白色半透明遮罩块，不允许破坏整张海报的完整观感。
- 如果去掉遮罩后可读性不够，应优先通过字体本身处理：颜色微调、描边、柔阴影、轻发光、字距与位置微调解决，而不是在画面中间加一整块半透明底。

推荐轻动效：

- 对 `START` 层做 1.8 秒左右的呼吸动效。
- 建议 `alpha` 在 `0.72 - 1.0` 之间往返。
- 建议 `scale` 在 `0.992 - 1.012` 之间往返。
- 不要让标题一起缩放；只动 `START` 层。

## 页面与交互规则

- 开屏页不是首页。开屏页只有 `START`，轻触后进入首页或后续流程。
- 首页才放主要操作入口，例如继续故事、章节目录、回忆画廊、系统设置。
- 首页标题必须与开屏页使用同一套标题视觉，不要再单独用代码重新排一个简化版 `Nagi's / Heart`。
- 首页、存档进度、章节目录、回忆画廊、系统设置等系统级页面，本轮统一先共用开屏页同源背景图，避免一部分有图、一部分纯深底。
- 除开屏页艺术字和 `START` 外，系统级交互文本全部用中文。
- 本系统的主要操作是文字型按钮，不使用矩形、圆角矩形、切角框、胶囊背景框。
- 文字型按钮可以用细线、菱形、小号说明文字做装饰，但不要做成实体按钮框。
- `nagiCall` 本轮暂停：不设置，也不纳入本轮主链替换规则。名字设置页只保留玩家名输入。

## 开发用视觉 Token

以下数值为当前直接给开发的实现值，先不要自行改动：

### 系统级页面背景

- 背景基图：开屏同源图
- 全局压暗层：`#132033`，`32%`
- 底部加深渐变：`#13203300 -> #132033CC`
- 不再额外叠白雾层

目的：

- 保留主图细节
- 比旧版纯深底更亮一点
- 但不回到“背景偏白、浮层偏黑”的脏对比

### 系统级页面浮层

- 浮层底色：`#1B2436`
- 浮层透明度：`26%`
- 浮层描边：`#FFFFFF`，`10%`
- 浮层不要再用接近 `40%+` 的深灰大砖块

### 系统页文字

- 大标题：`#F5F1E8`
- 一级正文 / 一级按钮：`#F4F1EA`
- 二级信息：`#D6D2CB`
- 弱信息 / 空状态：`#B7B3AD`
- 金色装饰点：`#D7BE86`

### 长旁白页

- 正文颜色：`#F4F1EA`
- 正文透明度：`92%`
- 字号：`16sp`
- 行高：`30sp`
- 字重：`Regular`
- 字间距：`0`
- 段间距：`18dp`
- 阅读区宽度：屏宽的 `78%`
- 阅读区垂直位置：页面中部居中，不要顶在上半屏
- 正文阴影：`0 1 8`，颜色 `#0A0F19`，透明度 `18%`

### 长旁白页背景层

- 整页模糊：`18dp`
- 整页压暗层：`#101826`，`42%`
- 不加额外白色阅读卡片
- 不做厚重黑框

补充纠偏：

- `splash_title_overlay_fullcanvas.png` 和 `splash_start_overlay_fullcanvas.png` 只是中间过程分层，不允许把其中的黑色/灰色底块直接作为最终前台层铺到界面上。
- 如果分层接法容易出错，本轮直接以 `start_flow/01_splash_start_poster_9x16.png` 为主视觉参考，标题与 `START` 按整块效果实现，不要把错误遮挡一并带入。
- 剧情页顶部导航也不要做成厚重的实体切角按钮排排站；应回到当前 v2 整体语言，弱化容器感，强调文字与轻量图标。

## 剧情文本层规则

剧情底部文本层需要区分“角色对话”和“旁白”，但按 PM 2026-07-11 full scope 口径，短旁白和长旁白都不显示 `旁白` 标签：

- 角色对话：显示角色名；正文使用无衬线字体、较高字重、偏暖白。
- 短旁白：不显示角色名，也不显示 `旁白` 标签；正文使用衬线或斜体方向，银灰色。
- 长旁白：整页毛玻璃阅读层，不显示角色名，也不显示 `旁白` 标签；正文左对齐、分页展示，不滚动。
- 角色对话和旁白不能看起来完全一样，否则第一体验会摸不清谁在说话。

最终执行口径以 `D:\Nagi‘s Heart\PM_AGENT_OUTBOX\design_reply_xoxo_fullscope_20260711_2252.md` 为准。

## 已同步到 Android 工程

本次已同步：

- `android/app/src/main/assets/bg/poster_start_nagis_heart_keyart.png`
- `android/app/src/main/assets/bg/poster_start_nagis_heart_bg_clean.png`
- `android/app/src/main/assets/bg/poster_start_title_overlay.png`
- `android/app/src/main/assets/bg/poster_start_start_overlay.png`
- `android/app/src/main/res/mipmap-*/ic_launcher.png`

如果 yiyi 从本包手动接入，请以本 README 的文件为准。
