# Task to XoXo - Chapter Catalog + Dialog Fallback Authority Hardening

## Task

`TASK-20260717-016` - 补齐章节目录 UI authority，并收紧弹窗 Android fallback 可实现口径

## Background

当前 Claude token 暂不可用，yiyi / Wewe 暂停。Ant 大小姐要求：在她继续真机反馈前，PM / UI 先把自己能做的事情做好；UI 设计不要再随意调来调去，每次调整都必须核对权威版本并保持 `authority_current` 最新。

PM 按 `DEC-20260717-016` 做了 UI 谨慎变更检查，发现当前设计侧仍有两个可先收口的缺口：

1. 章节目录仍明确 pending：
   - `design/NagisHeart_UI_Authority_XoXo_v1_0.html` 仍写：`章节目录：保持待确认，本版不拍板。`
   - `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html` 同步版本也仍 pending。
   - `XoXo_UI_Final_MinSpec_20260712.md` section 14 也明确：章节目录仍 pending，不要顺手补目录。
   - 交互 authority 已在 `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md` section 30.4 锁定目录交互边界；XoXo 本轮补视觉 authority 时必须与该交互口径一致。

2. 弹窗 authority 有设计方向，但 Android fallback 口径仍不够硬：
   - section 11 写了 `rgba(27,36,54,0.32)`、blur 20dp、radius 24 等；
   - 但 yiyi 实机反馈表明 Compose blur 不能直接模糊背景，之前 32% 太淡、80% 又太厚；
   - 需要 UI owner 给一个“无真实 frosted blur 时的可实现 fallback token”，减少开发凭感觉调 alpha。

## Required Work

### A. Chapter Catalog authority

补齐章节目录页作为当前可开发 UI authority。

要求：

1. 必须沿用现有 final UI 语言，不做全新风格。
2. 必须与以下页面协调：
   - Home / 主页；
   - Chapter Opening / Section Opening；
   - Chapter Clear / Section Clear；
   - HUD glass tokens section 14 / 15。
3. 必须定义 Android 可实现要点：
   - 页面结构；
   - 章节 / 小节层级；
   - 当前进度、已解锁、未解锁、已完成状态；
   - 返回 / 继续动作；
   - 长标题、省略、滚动或分页策略；
   - dark 主题下的背景 / glass card / icon / text token。
4. 不要引入复杂新功能；第一版是可开发目录页，不是完整成就系统。
5. 不要改 story/script、BG mapping、Android/Web 代码或资源。

建议输出：

- 在 `design/NagisHeart_UI_Authority_XoXo_v1_0.html` 增加章节目录预览页；
- 在 merge record 记录来源与修订理由；
- 在 `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` 新增 section 16；
- 同步最新 HTML / merge record 到 `00_harness/08_authority_current/04_ui/`。
- 如本轮需要补充目录操作细节，必须同步 `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`，不得只改 UI 不改交互。

### B. Dialog Android fallback hardening

在不重设计弹窗的前提下，补一段可实现 fallback 规则。

要求：

1. 保持 confirmed authority 的轻玻璃方向。
2. 不回到 80% 厚重深色大卡片。
3. 不恢复会模糊弹窗文字 / 按钮自身的错误 `RenderEffect`。
4. 明确 Android 无背景 blur 时的 token，例如：
   - card alpha 推荐范围；
   - scrim alpha 推荐范围；
   - border / shadow / text shadow；
   - 亮背景与暗背景下是否允许微调；
   - 什么情况必须回 UI 复核，而不是开发继续调。
5. 明确禁止：
   - 系统默认 Dialog；
   - 纯黑 / 纯白实底；
   - 大厚卡；
   - 为了可读性牺牲 final glass language。

建议同步到：

- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 11 或新增 section 16 中的 dialog fallback subsection。

## Authority / Process Rules

必须遵守：

- `DEC-20260717-014`：任何可开发设计变化必须同步到 `08_authority_current`。
- `DEC-20260717-016`：UI 谨慎变更；先核对权威，写清楚目标范围、预期效果与禁止范围。
- 交互权威：`00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md` section 30。

## Out of Scope

不要修改：

- Android / Web 代码；
- story-data；
- script；
- BG mapping；
- TT Start；
- App Icon；
- 已通过的 Start / Home / Settings / Story UI；
- HUD / speaker section 15，除非只是引用，不要重新改。

## Deliverable

写 PM outbox：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_chapter_catalog_dialog_fallback_20260717.md`

回传必须包含：

1. 章节目录是否已从 pending 转为 review authority；
2. 弹窗 fallback 是否已补齐；
3. 是否同步 / 补充了交互设计文档；
4. 修改文件清单；
5. authority_current 同步状态；
6. 给 yiyi / Wewe 的实现口径；
7. 自检：未触碰 Android/Web/story/BG/TT/App Icon/资源删除。

## Completion Definition

Ready for PM review when:

1. 章节目录不再只是 pending，而是有可开发 UI authority；
2. 弹窗在无真实 blur 的 Android 场景下有明确 fallback token；
3. 所有设计变化都同步到 `00_harness/08_authority_current/04_ui/`；
4. 开发可以按 authority 实现，不需要自行猜视觉。
