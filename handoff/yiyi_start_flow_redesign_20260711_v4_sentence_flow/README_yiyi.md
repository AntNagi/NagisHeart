# 开屏与前置流程设计交付 v4

## 本次调整

- 开屏页与首页彻底分开；开屏只有 `START` 和弱化的 `Tap to start`。
- `Nagi's Heart` 艺术字直接烘焙在开屏 PNG 内。
- 开场白改成逐句 VN 状态示意，首句使用剧本真实文案 `「好麻烦。」`，不再把多句文案排成一张海报。
- 名字页、章节开篇页、章节过渡页全部使用居中构图与文字型操作，不使用矩形、胶囊、切角或卡片按钮。
- 所有中文交互文字已改为中文；品牌名和角色名保留原文。

## 文件

- `start_pages/start_poster_v2_pillow.png`：独立开屏海报。
- `flow_pages/prologue_opening_v2.png`：逐句开场白的第 1 句状态示意。
- `flow_pages/name_input_v2.png`：名字设置页。
- `flow_pages/chapter_start_v2.png`：章节开篇海报。
- `flow_pages/section_clear_v2.png`：章节过渡页。
- `start_flow_v2_contact_sheet.jpg`：五页总览。

## 交互实现提示

`prologue_opening_v2.png` 是逐句播放状态的视觉参考，不应作为包含全部 Prologue 文案的整页静态海报。运行时应替换中间句子、序号和说话人，保持背景、文字位置和继续提示一致。
