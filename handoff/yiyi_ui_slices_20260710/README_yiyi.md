# Nagi's Heart UI 切图交接给 yiyi

交接人：XoXo  
日期：2026-07-10  
来源设计稿：`design/NagisHeart_P0_HiFi_Design_XoXo_v2_0.html`  
切图目录：`handoff/yiyi_ui_slices_20260710/`

---

## 1. 本包内容

### UI 状态切图

目录：`ui_screens/`

所有 PNG 均按 Android 竖屏视觉导出，尺寸为 `860 x 1532`，相当于 2x 参考图。导出时已隐藏网页里的设计确认面板，只保留手机 UI 本体。

| 文件 | 用途 |
|------|------|
| `01_start_dark_current.png` | 当前 v2 Start 状态参考 |
| `02_opening_dark_chapter_poster.png` | 当前 v2 Opening / 章节开屏状态参考 |
| `03_dialogue_light_glass.png` | Light 背景下的普通 Dialogue 毛玻璃对话框 |
| `04_choice_light_valentine.png` | Light 背景下的 Choice 三选项样式 |
| `05_line_dark_bedroom.png` | Dark 背景下的 LINE 聊天样式 |
| `06_chapter_dark_timeline.png` | Dark 背景下的章节 / Memory Track 样式 |
| `07_save_light_slots.png` | Save 列表样式 |
| `08_gallery_light_grid.png` | Gallery 网格样式 |
| `09_settings_light_rows.png` | Settings 行列表样式 |
| `10_ending_dark_current.png` | 当前 v2 Ending 状态参考 |

总览图：`ui_screens_contact_sheet.jpg`

### 已确认关键素材

目录：`selected_assets/`

| 文件 | 用途 |
|------|------|
| `poster_start_nagis_heart_keyart.jpg` | Start / 开屏海报候选；后续 Start 重做时优先使用 |
| `ending_true_nagi_soft_gaze.jpg` | TRUE END「世界第一，与你」已确认素材 |
| `ending_candidate_crystal_king.jpg` | GOOD / 彩蛋结局候选素材 |
| `bg_p1_nagi_cutin_first_seen.jpg` | p1 初见 Nagi cut-in 临代 |
| `bg_c1a_bluelock_bench_meeting_temp.jpg` | c1a 蓝锁内部 / 初见会议临代 |

---

## 2. 开发实现边界

### 需要 yiyi 先实现的部分

1. 普通剧情页的背景图铺满。
2. 顶部 HUD：返回、章节标题、自动、存档、菜单。
3. Dialogue 毛玻璃对话框。
4. Choice 选项列表。
5. LINE 聊天页。
6. Chapter / Save / Gallery / Settings / Ending 的基础布局。
7. Light / Dark 两类背景下的文本可读性。

### 暂不建议 yiyi 定死的部分

Start 和 Opening 当前 PNG 是 v2 现状参考，不是最终定稿。

原因：

- Owner 已明确要求 Start 是整页开屏海报。
- `Nagi's Heart` 应作为艺术字融入海报，而不是普通 UI 标题。
- 开屏海报素材已放入 `selected_assets/poster_start_nagis_heart_keyart.jpg`，但最终 Start / Opening 版式还需要 XoXo 继续重做。

所以开发时可以先搭 Start / Opening 的页面容器和资源位，不要把当前 `01_start_dark_current.png` 和 `02_opening_dark_chapter_poster.png` 当作最终设计锁死。

---

## 3. Android 实现建议

### 背景层

- 背景图全屏 `centerCrop`。
- 根据页面配置使用 light / dark 遮罩。
- 对话和列表页面底部必须加可读性渐变，避免浅图上文字发灰。

### 顶部 HUD

- 高度不要过大，保持轻量。
- 图标按钮不要做成大块矩形按钮。
- HUD 在 Start / Opening 可隐藏或弱化，普通剧情页显示。

### 毛玻璃 / 半透明层

Android 端如果实时 blur 成本高，可以先用：

- 半透明底色。
- 白色或深色 1px 边线。
- 背后加轻微遮罩。
- 后续再升级 RenderEffect blur。

### 字体和文字

- 中文正文优先保证可读性。
- 英文标题用于装饰时可以更轻、更细。
- 不要把网页里的设计确认面板、按钮组、`Check` 控件做进 App。

---

## 4. 和 mapping 的关系

当前素材命名已同步到：

`design/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md`

其中：

- `dream_final` 已改为 `已配`，使用 `assets/bg/ending_true_nagi_soft_gaze.jpg`。
- `poster_start_nagis_heart_keyart.jpg` 是 Start 开屏海报候选。
- p1 / c1a 仍是临代，不是最终精确场景。

---

## 5. 给 yiyi 的一句话结论

请先按 `ui_screens/` 还原 P0 基础 UI 结构和毛玻璃内页风格；Start / Opening 先做可替换资源位，不要锁死当前截图；TRUE Ending 可以直接接入 `ending_true_nagi_soft_gaze.jpg`。
