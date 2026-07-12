# XoXo 设计交付：App Icon / Start / Route v1.0

日期：2026-07-11  
负责人：XoXo  
状态：已出设计稿与预览导出

> 2026-07-11 晚更新：Ant 已确认按最终切图包继续开发。最终准版本见 `handoff/yiyi_final_visual_slices_20260711/`，旧候选图仅保留作过程记录。

---

## 1. Mapping 更新

文件：

`design/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md`

已完成：

- `w_game｜游戏冷战·ADC走脸事件` 改为 `已配`
- 使用资源：`assets/bg/gameroom.png`
- 当前 BG mapping 已无 `空缺` 状态

---

## 2. App Icon 设计

来源图：

`assets/bg/icon.jpg`

导出目录：

`design/exports/app_icon_start_v1_0/`

候选：

| 文件 | 说明 |
|---|---|
| `app_icon_v1_soft_gaze.png` | 推荐默认版，柔光凝视，识别稳 |
| `app_icon_v2_eye_focus.png` | 眼神特写版，商店小尺寸识别更强 |
| `app_icon_v3_pale_romance.png` | 轻恋爱感版，适合测试渠道 |
| `app_icon_contact_sheet.jpg` | 三版总览 |

建议：

首版优先用 `app_icon_v1_soft_gaze.png`。它保留 Nagi 近景识别，也不会在小尺寸里塞太多文字。

---

## 3. Start / 开屏页设计

设计稿：

`design/NagisHeart_AppIcon_Start_Design_XoXo_v1_0.html`

导出目录：

`design/exports/app_icon_start_v1_0/`

候选：

| 文件 | 说明 |
|---|---|
| `start_page_v1.png` | 主视觉海报版，推荐作为最终方向优先检查 |
| `start_page_v2.png` | 近景柔光版，偏恋爱游戏气质 |
| `start_page_v3.png` | 章节开屏版，适合每章 Opening |
| `start_page_v4.png` | 传统菜单版，适合开发首版兜底 |
| `start_design_board_preview.png` | App icon + Start 四版总览 |

建议：

- Start 首页优先看 `start_page_v1.png`。
- Opening / 章节开屏优先看 `start_page_v3.png`。
- 开发首版如果需要稳妥落地，可以先用 `start_page_v4.png` 的结构。

---

## 4. Route / 路线页面设计

设计稿：

`design/NagisHeart_Route_Page_Design_XoXo_v1_0.html`

导出目录：

`design/exports/route_page_v1_0/`

候选：

| 文件 | 说明 |
|---|---|
| `route_page_v1.png` | 进行中路线页，不提前剧透 Dream / Stay / Bad |
| `route_page_v2.png` | 通关后路线回收页，显示 Dream / Stay / Bad 进度 |
| `route_page_board_preview.png` | 两版总览 |

设计口径：

- 未到终局前，不显示 Dream / Stay / Bad 名称。
- 未解锁节点显示 `???` 或隐藏。
- 通关后进入 Route Archive，再显示路线名和回收进度。

---

## 5. 给 yiyi 的开发建议

1. App icon 先接 `app_icon_v1_soft_gaze.png` 做默认候选。
2. Start 首页不要继续实现旧 v2 截图，改看 `start_page_v1.png` / `start_page_v4.png`。
3. Opening 章节页看 `start_page_v3.png`。
4. Route 页面按“进行中不剧透 / 通关后回收”的双状态实现。
5. `gameroom.png` 已写入 mapping，可直接用于 `w_game`。

---

## 6. 最终采用版更新

最终交付目录：

`handoff/yiyi_final_visual_slices_20260711/`

最终采用内容：

| 模块 | 最终文件 | 说明 |
|---|---|---|
| App icon | `app_icon/app_icon_1024_no_dark_eye.png` | 使用无黑眼圈版 |
| Android icon | `app_icon/android_mipmap/mipmap-*/ic_launcher.png` | 可直接覆盖 Android `mipmap-*` |
| 开屏页 | `start_flow/01_splash_start_poster_9x16.png` | 开屏页只有 `START` |
| 开场白页 | `start_flow/02_prologue_opening_sentence_9x16.png` | Prologue 逐句展示 |
| 输入名字页 | `start_flow/03_name_input_9x16.png` | 居中输入，文字型确认 |
| 章节开篇页 | `start_flow/04_chapter_opening_9x16.png` | 进入章节前过渡 |
| 章节结算页 | `start_flow/05_section_clear_9x16.png` | 章节完成过渡 |

最终规则：

1. 开屏页不是首页。开屏页只保留 `START`，首页才显示主要功能入口。
2. 除开屏艺术字和 `START` 外，系统交互文本统一中文。
3. 主要操作使用文字型按钮，不使用矩形、圆角矩形、切角框或胶囊背景框。
4. 剧情文本层要区分角色对话和旁白：对话显示角色名，旁白显示 `旁白` 标签，并用不同字体气质和颜色处理。
5. 当前 Android 工程已同步最终开屏图和无黑眼圈 icon。
