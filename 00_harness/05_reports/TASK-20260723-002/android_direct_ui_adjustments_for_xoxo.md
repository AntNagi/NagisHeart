# Android 口头拍板 UI 调整同步给 XoXo

日期：2026-07-23  
整理：Sai  
用途：同步今天 Ant 直接口头确认、Android 先行落地的 UI/表现调整，供 XoXo 后续补进 authority 数值文件。  
说明：本文不是 authority 正文；正式收口仍以 XoXo 更新后的 authority 文档为准。

## 1. 长旁白层：去掉“一团乌云”实心黑块

Android 文件：`android/app/src/main/java/com/antnagi/nagisheart/ui/component/LongNarrationLayer.kt`

调整目标：

- 不再使用明显的黑色大块压在画面中间。
- 保留可读性，但托底要更软、更像空气感暗化。

当前 Android 数值：

- 整屏轻遮罩：vertical gradient
  - `0%`：`deepBlue` alpha `0.06`
  - `44%`：`deepBlue` alpha `0.12`
  - `100%`：`deepBlue` alpha `0.24`
- 文本背后柔和径向托底：
  - 区域 padding：左右 `18dp`，上 `148dp`，下 `152dp`
  - radial gradient：
    - `0%`：`deepBlue` alpha `0.44`
    - `58%`：`deepBlue` alpha `0.32`
    - `100%`：transparent
  - center：容器中心
  - radius：`max(width * 0.64, height * 0.62)`
- 正文区域：
  - 外层 padding：左右 `18dp`，上 `88dp`，下 `126dp`
  - 文本最大框：`heightIn(min = 280dp, max = 760dp)`
  - 文本左右 padding：`20dp`
  - 段落间距：`24dp`
  - 字体：Serif
  - 字号：`16sp`
  - 行高：`30sp`
  - 文字颜色：`parchment` alpha `0.92`
  - shadow：`deepBlue` alpha `0.18`，offset `(0, 1)`，blur `8`
- 底部提示：
  - page indicator / 轻触继续位置：bottom `120dp`
  - indicator color：`parchment` alpha `0.78`
  - 最后一页“轻触继续”：indicator alpha 再降到 `0.44`

## 2. 选项卡：文字调亮，后半段渐变透明，加弱边框

Android 文件：`android/app/src/main/java/com/antnagi/nagisheart/ui/component/ChoiceLayer.kt`

调整目标：

- 选项文字更亮。
- 框不要整条硬块，后半段从 `1/2` 开始渐变透明。
- 仍保留微弱边框，否则和整体 HUD / VN 风格断开。

当前 Android 数值：

- 选项列表：
  - 整体居中：`contentAlignment = Center`
  - 容器左右 padding：`18dp`
  - 选项间距：`10dp`
- 单个选项卡：
  - shape：`cutSmall`
  - 背景：horizontal gradient
    - `0%`：`deepBlue` alpha `0.48`
    - `50%`：`deepBlue` alpha `0.44`
    - `100%`：`deepBlue` alpha `0`
  - 边框：`1dp borderGlass`
  - 内边距：左右 `16dp`，上下 `14dp`
  - 内容对齐：`CenterStart`
- 左侧点：
  - 尺寸：`9dp`
  - shape：`pentagon`
  - 颜色：`roseGold` alpha `0.76`
- 文字：
  - typography：`choiceText`
  - 颜色：`snow` alpha `0.98`

## 3. 普通 dialogue / narration 框：从上往下渐变透明

Android 文件：`android/app/src/main/java/com/antnagi/nagisheart/ui/component/DialogueLayer.kt`

调整目标：

- dialogue 框也要有渐变透明感。
- 方向为从上往下：上方更透，底部更稳。

当前 Android 数值：

- 对话框底色：vertical gradient
  - `0%`：`deepBlue` alpha `0.18`
  - `46%`：`deepBlue` alpha `0.52`
  - `100%`：`deepBlue` alpha `0.70`
- 边框：
  - `1dp borderGlass`
- shape：
  - `cutMedium`
- shadow：
  - 颜色：black alpha `0.26`
  - blur：`40dp`
  - shadow path 顶部偏移：`18dp`
  - shadow path 底部额外：`8dp`
- 对话框位置：
  - 左右外边距：`18dp`
  - bottom：`34dp`
- 对话框内边距：
  - start/end：`20dp`
  - top：`18dp`
  - bottom：`22dp`
- speaker chip：
  - shape：`cutSmall`
  - 背景 horizontal gradient：
    - `deepBlue` alpha `0.30`
    - `deepBlue` alpha `0.10`
  - border：`1dp goldPlayer`
  - padding：start/end `9dp`，top `3dp`，bottom `4dp`
  - 字号：`13sp`
  - 字重：SemiBold
  - 颜色：`speakerGold`
- dialogue text：
  - 字号：`17sp`
  - 行高：`17 * 1.9`
  - 颜色：`textSnow94`
  - shadow：`textShadowColor`，offset `(0, 2)`，blur `14`

## 4. 回忆画廊结局卡：底部加约 1/4 透明托底

Android 文件：`android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GalleryScreen.kt`

调整目标：

- 解决结局卡文字压在图片上不清楚。
- 托底只在底部，不要整张图变灰。

当前 Android 数值：

- 卡片：
  - shape：`cutSmall`
  - 背景：`colors.glassBgSoft`
  - 高度：`heightIn(min = 128dp)`
- 图片：
  - `ContentScale.Crop`
  - `modifier = matchParentSize()`
- 底部托底：
  - 对齐：`BottomCenter`
  - 宽度：`fillMaxWidth()`
  - 高度：`fillMaxHeight(0.28f)`
  - 背景：vertical gradient
    - `0%`：transparent
    - `100%`：`deepBlue` alpha `0.62`
- 文本容器：
  - padding：`12dp`
  - 行间距：`4dp`
- 解锁卡文字：
  - 第一行：`ending tag`
    - typography：`micro`
    - color：`gold`
  - 第二行：`ending title`
    - typography：`speakerName`
    - color：`snowWhite`

## 5. 回忆画廊结局卡裁剪规则

Android 文件：`android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GalleryScreen.kt`

调整目标：

- normal end 图优先露出 Nagi 的眼睛。
- true end 图稍微往上，避免新增底部托底挡脸。

当前 Android 数值：

- `normal`：`BiasAlignment(0f, -0.58f)`
- `true`：`BiasAlignment(0f, -0.16f)`
- 其他结局：`BiasAlignment(0f, 0.35f)`

备注：

- Compose `BiasAlignment` 的 Y 轴为 `-1` 到 `1`。
- 这里 `normal = -0.58f` 是为了让裁剪窗口取到更偏上的图像内容，从卡片可视区里露出眼睛/脸部重点。

## 6. 画廊结局卡标题层级

Android 文件：`android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GalleryScreen.kt`

调整目标：

- 避免 GOOD END / NORMAL END 被挤在右侧或压住标题。
- end 类型标题放在文本标题上面，用剧情结尾页同系金色。

当前 Android 结构：

1. 第一行：`ending tag`
   - 例如 `TRUE END` / `GOOD END` / `NORMAL END`
   - typography：`micro`
   - color：`gold`
2. 第二行：`ending title`
   - 例如 `普通情侣`
   - typography：`speakerName`
   - color：`snowWhite`

## 7. 结局页 BG 规则纠偏

Android 文件：`android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GameScreen.kt`

Ant 纠正：

- authority 结局页里写 `assets/bg/true_end.jpg` 是设计示例图，不代表四个结局页全部固定使用 TRUE END 图。

当前 Android 规则：

- 结局页使用整屏诗性 layout。
- 背景使用当前 `end_*` node 的 `bgAssetPath`。
- `true_end.jpg` 仅作为异常兜底，避免空背景。

结局 BG 目标映射：

- TRUE：`assets/bg/true_end.jpg`
- GOOD：`assets/bg/king.jpg`
- NORMAL：`assets/bg/ending_true_nagi_soft_gaze.jpg`
- BAD：`assets/bg/goal_faraway.jpg`

## 8. 口头指定 BG 替换项

Android 与根 runtime 均已同步：

- 根：`story-data/scene_visuals.json`
- Android assets：`android/app/src/main/assets/story-data/scene_visuals.json`

当前替换：

- `e_depart | NEL启程`
  - BG：`assets/bg/nel_start.png`
- `c2 | 假期的消息`
  - BG：`assets/bg/message_in_holiday.jpg`
- `c2_s2`
  - BG：`assets/bg/message_in_holiday.jpg`

## 9. 建议 XoXo 收口方式

建议把以上内容拆入 authority：

1. 长旁白层：补充“软径向托底，不使用实心乌云块”的 Android 数值。
2. 选项层：补充从 `50%` 开始向右透明的选项卡 gradient 与弱边框规则。
3. dialogue 层：补充从上到下增强的不透明度 gradient。
4. Gallery ending card：补充底部 `28%` 高度渐变托底、tag/title 层级、结局卡裁剪规则。
5. Ending page：明确 `true_end.jpg` 是示例图，不是所有 ending page 固定 BG；最终按 `end_*` node 权威 BG。
6. BG mapping：同步 `e_depart` / `c2` / `c2_s2` 的口头指定背景。
