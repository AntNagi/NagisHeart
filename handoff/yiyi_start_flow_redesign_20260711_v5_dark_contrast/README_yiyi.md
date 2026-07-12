# 开屏与前置流程设计交付 v5

## 本次修正

- 整体提高背景暗度和文字对比度，避免浅灰背景吞掉正文。
- 开场白按实际 Prologue 逐句播放；每张状态只展示一句文本，例如首句 `「好麻烦。」`。
- 名字、章节开篇、章节过渡页的主要操作都使用居中文字型，不使用按钮背景框。
- 保留开屏与首页的层级区分：开屏只有 `START`，首页才有主要操作。

## 剧情文本层规则

- 角色对话：无衬线字体、较高字号、偏暖白；上方显示角色名与金色菱形标记。
- 旁白：衬线斜体、银灰色；明确显示“旁白”标签，不加角色引号。
- 全屏叙述：居中显示“旁白”标签和叙述文字，使用更深的遮罩。
- 角色对话与旁白不能使用同一套字号、字形和颜色。

## 文件

- `start_pages/start_poster_v2_pillow.png`
- `flow_pages/prologue_opening_v2.png`
- `flow_pages/name_input_v2.png`
- `flow_pages/chapter_start_v2.png`
- `flow_pages/section_clear_v2.png`
- `start_flow_v2_contact_sheet.jpg`
