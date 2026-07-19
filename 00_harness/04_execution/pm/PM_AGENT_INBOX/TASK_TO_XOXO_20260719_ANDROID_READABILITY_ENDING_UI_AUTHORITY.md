# TASK-20260719-001 — Android 实机反馈 UI authority 补齐

To: XoXo
From: PM 一一
Status: ready
Priority: P0
Scope: UI design / authority only

## 必读

1. `README_AI.md`
2. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
3. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
4. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md` section 31
5. `00_harness/08_authority_current/01_product/NagisHeart_PRD_v2_0.md` section 21
6. `00_harness/05_reports/validation/PM_REVIEW_ANDROID_REAL_DEVICE_FEEDBACK_20260719.md`

## 背景

Ant 大小姐 2026-07-19 实机反馈显示：

1. Dialog 仍读成圆角矩形线框，不像 final UI。
2. HUD / 导航栏 title chip、icon button、skip chip 背景仍不协调，明亮背景下图标可见性不稳。
3. 所有压图文字整体托底偏弱。
4. 长旁白宽度太窄，应与底部单行旁白正文宽度一致。
5. 小章节结束页从当前产品范围移除。
6. 结局页 PRD/UI 均缺最终设计，必须补齐并给 Ant 确认。

## 任务目标

请补齐当前 UI authority，而不是直接改代码。

这次 UI authority 必须服务开发落地，不只是视觉说明。每个被改动组件都要写清：

- authority section；
- Android / Web 可执行 token；
- no-real-blur fallback；
- 禁止出现的错误样式；
- PP 需要对照的验收截图点。

### A. 全局可读性 token

- 统一检查 gameplay、long narration、backlog、chapter opening、chapter ending、dialog、HUD、ending page。
- 增强压图文字托底：保留轻玻璃语言，但整体可读性要比当前实机更强。
- 明确 Android no-real-blur fallback token。

### B. HUD / 导航栏 Android 可执行目标

- 给出 title chip、icon button、action / skip chip 的最终同族规则。
- 必须避免：
  - 裸白图标压亮背景；
  - title 有背景但 icon 没背景；
  - 厚系统按钮；
  - 明显圆角矩形硬框；
  - 和 HTML authority 不一致的临时样式。
- 请写清楚 shape、alpha、border、shadow、icon halo、尺寸和安全区。

### C. Dialog 最终形态

- 重新明确 Dialog 在 Android Compose 无真实 blur 时的最终 fallback。
- 当前实机被 Ant 判定为“圆角矩形线框”，请避免继续把大圆角矩形边框当 final。
- 如果需要切角、弱边界、内高光、边框淡化，请用明确 token 写入。
- 给出至少一个 preview / HTML 页面中的可见样例。

### D. 长旁白

- 长旁白文字区域宽度必须与底部单行旁白正文宽度同基准。
- 给出具体 margin / max-width / text container 规则。
- 不允许底部裁切。

### E. 结局页 UI 补全

- 新增 final-candidate ending page design。
- 结局页必须是终局页，不是章节结束页。
- 需要包含：
  - ending tag / title / subtitle / description；
  - 解锁反馈；
  - 返回主页；
  - 进入回忆画廊；
  - 重看本结局 / 相关章节入口。
- 设计需要适配 TRUE / GOOD / NORMAL / BAD 的气质差异，但第一版可以共用结构。
- 该页面必须提交给 PM / Ant 确认，确认前不得标 final。

## 禁止范围

- 不改 Android / Web 代码。
- 不改 story-data、BG mapping、TT Start、App Icon。
- 不新增开发临时资源路径。
- 不从 archive 引用旧 UI。

## 输出要求

1. 更新 `design/NagisHeart_UI_Authority_XoXo_v1_0.html`。
2. 更新 `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`。
3. 更新 `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`。
4. 同步最新 HTML / merge record 到 `00_harness/08_authority_current/04_ui/`。
5. 在 `00_harness/01_governance/decision_log.md` 追加 decision。
6. 写 PM outbox status。

回报必须写清：
- Authority sync status；
- Ant 需要确认的设计点；
- 给 PP 的开发口径；
- PP implementation alignment checklist；
- Cleanup status。
