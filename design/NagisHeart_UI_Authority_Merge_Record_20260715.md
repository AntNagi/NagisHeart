# Nagi's Heart UI 权威候选合版记录

- 任务编号：`TASK-20260715-001`
- 合版执行：XoXo
- 日期：2026-07-15
- 原则：只做拼接，不做重设计
- 输出文件：
  - `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
  - `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`

## 1. 合版依据

本次严格按以下优先级执行：

1. `00_harness/01_governance/decision_log.md` 中 `DEC-20260715-001`
2. `00_harness/04_execution/design/TASK_XOXO_UI_AUTHORITY_MERGE_20260715.md`
3. 唯一母版：`design/NagisHeart_P0_HiFi_Design_XoXo_v2_0.html`
4. 指定补页来源：`design/NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html`
5. 指定结构来源：`design/NagisHeart_LongNarration_StoryRecap_Redesign_Lulu_v1_0.html`

## 2. 最终纳入页面

| 页面 | 最终来源 | 本次动作 |
|---|---|---|
| 开屏 | `DEC-20260717-001` / `design/authority/icon_start_tt/TT_Icon_Start_Authority_Spec_v1_0.md` | 改为 TT Start v23 权威方向引用；XoXo 候选版不保留自有开屏图作为权威页 |
| 主页 | `NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` | 拼入后按 `DEC-20260717-002` 移除顶部标题，其余结构不重设计 |
| 开场白页 | `NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` | 直接拼入 |
| 名字设置页 | `NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` | 直接拼入，仅保留玩家名设置 |
| 大章开始页 | `NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` | 直接拼入 |
| 小节开始页 | `NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` | 直接拼入 |
| 对白页 | `NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` | 保留母版 |
| 选项页 | `NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` | 保留母版 |
| LINE 页 | `NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` | 保留母版 |
| 长旁白页 | `NagisHeart_LongNarration_StoryRecap_Redesign_Lulu_v1_0.html` | 采用 Lulu 结构，仅做冷色校准 |
| 剧情回顾页 | `NagisHeart_LongNarration_StoryRecap_Redesign_Lulu_v1_0.html` | 采用 Lulu 结构，仅做冷色校准 |
| 存档页 | `NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` | 保留母版 |
| 回忆画廊页 | `NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` | 保留母版 |
| 设置页 | `NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` | 保留母版，仅按 `DEC-20260717-002` 将每行小字 / 数值右侧对齐 |
| 结局页 | `NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` | 保留母版 |
| 跳过确认弹窗 | `NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` | 直接拼入 |

## 3. 明确未纳入页面

以下页面在本任务中明确不纳入权威候选版：

| 页面 | 原文件 | 不纳入原因 |
|---|---|---|
| 大章结束页 | `NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` | 任务书明确不采用 |
| 小节结束页 | `NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` | 任务书明确不采用 |
| Missing Pages 版长旁白 | `NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` | 必须改用 Lulu 结构 |
| Missing Pages 版剧情回顾 | `NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` | 必须改用 Lulu 结构 |

## 4. 保持待确认的缺口

以下内容本次只标记，不拍板：

1. 章节目录
2. 大章结束页
3. 小节结束页

在 `NagisHeart_UI_Authority_XoXo_v1_0.html` 中，这三项未被伪装为已定稿页面。

## 5. 权威候选 HTML 组织方式

为避免再次混入未确认页，本次权威候选版采用单文件浏览板结构：

1. 左侧固定来源说明与页面切换列表
2. 右侧单手机框逐页预览
3. 每页右下角增加“来源标签”，方便开发追溯
4. 待确认项只在侧栏列出，不进入预览主链

## 6. 两轮自检

### 第一轮：来源自检

- 已核对唯一母版为 `NagisHeart_P0_HiFi_Design_XoXo_v2_0.html`
- 已核对 Missing Pages 只拼入：
  - 主页
  - 开场白页
  - 名字设置页
  - 大章开始页
  - 小节开始页
  - 跳过确认弹窗
- 已核对 Lulu 只用于：
  - 长旁白
  - 剧情回顾
- 未把 `CoCo_Design_Handoff_20260713.md` 作为权威来源使用
- 未覆盖任何源文件

### 第二轮：越界自检

- 未新增大章结束页
- 未新增小节结束页
- 未擅自完成章节目录定稿
- 长旁白与剧情回顾仅调整为冷色基调，未改阅读结构
- 保留母版已成立页面，不对既有页面做重设计
- 输出为新增文件，可浏览、可追溯、可交付开发对照

### 浏览器实测补充（2026-07-16）

- 已在本地浏览器实际打开候选 HTML，不只做静态代码检查
- 已验证 16 个页面/组件导航入口均有对应页面结构
- 已抽查开屏、主页、名字设置、对白、长旁白、剧情回顾等关键页切换
- 已确认长旁白与剧情回顾在 385 × 684 手机预览框内无横向或纵向溢出
- 已确认 Missing Pages 原文件引用的历史系统页底图路径已失效；依据同一 Missing Pages 导出预览，改接现有交付包中的同源底图 `handoff/yiyi_final_visual_slices_20260711/start_flow/splash_layers/splash_bg_remeet_clean_1080x1920.png`
- 已修复首次打开时未应用 `start` 页面背景预设的问题
- 已复核候选 HTML 中所有本地 `url(...)` 资源引用均存在

## 7. 当前状态建议

`TASK-20260715-001` 已提交 PM 复核，任务状态更新为 `review`。

当前版本性质为：

- `权威候选版`
- `可供 PM / 开发 / 设计复核`
- `不是最终正式权威版`

## 8. 局部修订记录（2026-07-17）

依据：

1. `DEC-20260717-001`
2. `DEC-20260717-002`
3. `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_XOXO_20260717_UI_AUTHORITY_REVISION.md`
4. `design/authority/icon_start_tt/TT_Icon_Start_Authority_Spec_v1_0.md`

本轮只执行 Ant大小姐 / PM 一一要求的 3 个局部修订：

| 页面 | 修订内容 | 边界 |
|---|---|---|
| 开屏 / Start | 候选 HTML 的 Start 页改为 TT Start v23 分层方案引用：`start_clean_remeet_1080x1920.png`、`start_title_overlay_v23.svg`、`start_button_static_v23.svg`；XoXo 自有开屏图不再作为权威页展示 | 未修改 TT Start 包；未处理 App Icon；未改 Android/Web 代码 |
| 主页 | 删除顶部 `Nagi's Heart` 标题，避免与 TT Start 标题字体不一致 | 其余主页结构与操作区保持原样 |
| 设置页 | 将 `正常`、`3`、`80%`、`Light / Auto`、`管理` 等小字 / 数值拆为右侧值列并右对齐 | 仅调整设置页行内排布，不影响存档页等其他 `.row` 组件 |

其余页面按 Ant大小姐确认结果保持通过状态，不重新设计、不扩大范围。

继续 pending：

1. 章节目录
2. 大章节结束页
3. 小节结束页

本轮修订后，`TASK-20260715-001` 仍应进入 PM / Ant 复核，不由 XoXo 直接宣布最终权威。

---

## 9. 实机反馈 UI authority 补齐记录（2026-07-17 / TASK-20260717-011）

依据：

1. `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_XOXO_20260717_CHAPTER_UI_REAL_DEVICE_FEEDBACK.md`
2. `00_harness/05_reports/validation/PM_REVIEW_REAL_DEVICE_UI_FEEDBACK_20260717.md`
3. Ant大小姐 2026-07-17 实机反馈：章节开始文字无托底不清楚；章节结束页、顶部标题与“下一章/跳过”等动作 chip 没有按 UI authority 做。

本轮只补 UI authority / 设计规范，不修改 Android 代码、story/script、BG mapping、TT Start、App Icon 或资源删除。

| 范围 | 本轮决定 | 给开发的口径 |
|---|---|---|
| 章节开始 / 大章开始 | 保留 final UI 的章节海报语言，但文字组必须增加轻透明托底。托底是雾面支撑，不是重弹窗。 | `chapter-poster` 整组文字加浅玻璃 backing：左右 30，padding 24/22/20，背景约 `rgba(16,24,39,0.30 -> 0.14 -> transparent)`，描边 `rgba(255,255,255,0.08)`，blur 10dp。 |
| 小节开始 | 同大章开始，但位置沿用 section opening，默认 bottom=96。 | 不再允许裸文字直接压复杂背景；长标题可降字号，不取消托底。 |
| 大章结束 / Chapter Clear | 本次采纳并修订历史 Missing Pages 的大章结束方向，提升为当前可实现 UI authority。它是章节过渡页，不是普通弹窗。 | 新增 `screen-chapter-clear` 预览；使用 `clear-card`：left/right 28，bottom 82，轻玻璃背景，`CHAPTER CLEAR` label，章节标题、完成说明、`返回目录` + `进入下一章/第二部`。 |
| 小节结束 / Section Clear | 与 Chapter Clear 共用轻玻璃组件，但语义更轻。 | 新增 `screen-section-clear` 预览；label 为 `SECTION CLEAR`，动作是 `返回目录` + `进入下一节`。 |
| 顶部标题 chip | 回到 final glass HUD 语言。标题 chip 不再做厚重切角按钮。 | 高度 34，max-width 约 210，单行省略；Noto Sans SC Medium 13sp；背景 `rgba(15,24,39,0.22)`，描边 `rgba(255,255,255,0.10)`，blur 12dp。 |
| 下一章 / 跳过动作 chip | 右侧对齐，使用同一套 glass HUD 语言。 | 高度 34，padding 14~16，12~13sp；在 HUD 下方 14~18dp，不与标题 chip 抢同一行。 |

文件变化：

- `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
  - 章节开始 / 小节开始增加轻透明托底样式。
  - 新增大章结束与小节结束预览入口和页面。
  - 顶部标题 chip、跳过动作 chip 调整为 final glass HUD 语言。
  - pending 列表当时收窄为章节目录；该口径已在本记录第 11 节由 `TASK-20260717-016` 覆盖，章节目录现为 review authority。
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
  - 新增 `TASK-20260717-011` 章节 UI 实机反馈补齐规范。

仍 pending：

1. 章节目录最终视觉。

不在本轮处理：

1. TT Start / App Icon。
2. Android 代码接入。
3. story/script 内容。
4. BG mapping。
5. 旧资源清理。

---

## 10. 实机反馈 UI authority patch 记录（2026-07-17 / TASK-20260717-014）

依据：

1. `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_XOXO_20260717_HUD_DIALOGUE_READABILITY_REAL_DEVICE.md`
2. `00_harness/05_reports/validation/PM_REVIEW_HUD_DIALOGUE_READABILITY_FEEDBACK_20260717.md`
3. `DEC-20260717-014`：被接受为可开发依据的规则必须同步到 `00_harness/08_authority_current/`。

本轮只处理 UI authority / spec，不修改 Android/Web/story-data，不改 BG mapping，不碰 TT Start / App Icon / 章节目录 / 资源删除。

| 范围 | 本轮决定 | 给开发的口径 |
|---|---|---|
| HUD icon buttons | back / auto / save / backlog / menu 等图标按钮不再裸白线压在背景上；统一进入 final glass HUD 家族。 | 36x36 轻玻璃底，18x18 图标，`rgba(15,24,39,0.30 -> 0.18)` 背景，`rgba(255,255,255,0.10)` 描边，blur 12dp；无 blur 时用半透明底 + 描边 + shadow fallback。 |
| HUD title chip | 保持 section 14 的 title chip 规则，但强调与 icon button 同源。 | 高 34，max-width 约 210，单行省略；背景 / 描边 / blur 与 icon button 同一 glass token。 |
| HUD action chip | `跳过本节`、`下一章`、`继续下一节` 等右侧动作保持 final glass HUD，不做厚系统按钮。 | 高 34，padding 14~16，右对齐；背景 / 描边 / blur 与 title chip 一致。 |
| speaker/name 金色 | 保留 Ant 喜欢的金色，但提高亮度并加轻衬底、shadow、halo。 | 文本 `#E4CA8F`；只包住 speaker/name 的小 chip：padding 9/3/4，背景 `rgba(16,24,39,0.30 -> 0.10)`，gold 轻描边，blur 8dp，text shadow + gold halo。 |

文件变化：

- `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
  - `.hud-btn` 增加统一 glass backing、描边、blur、shadow/halo。
  - `.speaker` 与 `.recap-inner .speaker` 增加金色可读性保护。
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
  - 新增 section 15：HUD 统一与 speaker/name 可读性规则。
- 已同步 authority current 副本：
  - `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
  - `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`

仍 pending / 不处理：

1. 章节目录。
2. TT Start / App Icon。
3. Android/Web 代码。
4. story-data / script / BG mapping。
5. 资源删除。

---

## 11. 章节目录与 Dialog Android fallback authority 记录（2026-07-17 / TASK-20260717-016）

依据：

1. `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_XOXO_20260717_CHAPTER_CATALOG_DIALOG_FALLBACK_AUTHORITY.md`
2. `DEC-20260717-014`：可开发设计变化必须同步到 `08_authority_current`
3. `DEC-20260717-016`：UI 谨慎变更检查，先核对权威、写清目标范围与禁止范围

本轮只处理两个设计侧缺口：

1. 章节目录从 pending 转为可开发 review authority。
2. Dialog 在 Android 无真实 frosted background blur 时的 fallback token 收紧。

不处理：Android/Web 代码、story-data、script、BG mapping、TT Start、App Icon、资源删除、已通过页面重设计、HUD/speaker section 15 重改。

| 范围 | 本轮决定 | 给开发的口径 |
|---|---|---|
| 章节目录 | 采用系统级 dark glass 页面，沿用 Home / Save / Settings 语言，不做新风格。 | 新增 `screen-chapter-catalog`。主容器 `catalog-panel`：left/right 18，top 84，bottom 34；三段式：标题说明 / 章节列表 / 返回与继续动作。 |
| 章节 / 小节层级 | 第一版只表达大章、小节、当前进度与解锁状态。 | 列表项结构：编号/锁定标记 + 章节标题/小节副文 + 状态。支持 current、unlocked、completed、locked。 |
| 长标题策略 | 不撑高列表项。 | 章节标题和副文均单行 ellipsis；条目多时 Android 用 lazy list 垂直滚动，不做分页。 |
| 目录动作 | 保持轻文本动作。 | 底部左 `返回主页`，右 `继续当前章节`；不做厚按钮，不做系统默认按钮。 |
| Dialog fallback | 保持 final light glass dialog，但无真实背景 blur 时使用固定 fallback token。 | card `rgba(27,36,54,0.56)`，允许 0.52~0.60；scrim `rgba(9,14,24,0.38)`，允许 0.34~0.42；border `rgba(255,255,255,0.14)`；shadow `0 18dp 42dp rgba(0,0,0,0.36)`。 |

文件变化：

- `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
  - 新增章节目录入口、预览页与 CSS。
  - 移除“章节目录 pending”的侧栏表述。
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
  - 新增 section 16：章节目录 authority + Dialog Android fallback hardening。
- 已同步 authority current 副本：
  - `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
  - `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`

当前状态：

- 章节目录：从 pending 转为 review authority。
- Dialog fallback：已补齐，可交 yiyi / Wewe 按 section 16.5 实现。

---

## 12. Android 实机反馈 UI authority 补齐记录（2026-07-19 / TASK-20260719-001）

依据：

1. `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_XOXO_20260719_ANDROID_READABILITY_ENDING_UI_AUTHORITY.md`
2. `00_harness/05_reports/validation/PM_REVIEW_ANDROID_REAL_DEVICE_FEEDBACK_20260719.md`
3. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md` section 31
4. `00_harness/08_authority_current/01_product/NagisHeart_PRD_v2_0.md` section 21

本轮按 PM 要求只补 UI authority / 设计规范，并提交给 PM / Ant 确认；不直接给开发 final，不修改 Android/Web/story-data/script/BG mapping/TT Start/App Icon，不做资源删除。

| 范围 | 本轮决定 | 给 PP / Wewe 的候选口径 |
|---|---|---|
| 全局压图文字可读性 | gameplay、long narration、backlog、chapter opening、chapter clear、dialog、HUD、ending page 均必须有轻玻璃托底；保留 final glass language，但比当前实机更稳。 | 文本压图不得裸压亮图；优先使用半透明深色渐变、弱描边、shadow、icon halo；无真实 blur 时使用固定 no-real-blur fallback，不凭感觉临时调。 |
| HUD / nav / skip 统一 | title chip、icon button、action/skip chip 必须同族；避免 title 有底但 icon 裸白、厚系统按钮或明显圆角矩形硬框。 | icon button 36x36，18x18 icon，深色轻玻璃底 `rgba(15,24,39,0.34 -> 0.22)`，描边 `rgba(255,255,255,0.12)`，shadow + icon halo；title/action chip 同 token。 |
| Dialog Android fallback | 修正 7/17 fallback 里容易被做成“圆角矩形线框”的风险；dialog 不再以大圆角硬边框作为 final。 | 优先 cut-corner / `cut-md`；无真实 blur 时 card `rgba(27,36,54,0.56)`、scrim `rgba(9,14,24,0.40)`、border 降为 `rgba(255,255,255,0.08)`、inner highlight `0.05~0.06`、shadow `0 18dp 42dp rgba(0,0,0,0.36)`。若只能做圆角硬框，必须回 UI/PM 复核。 |
| 长旁白宽度 | 长旁白正文宽度必须与底部单行旁白正文宽度同基准。 | 外边距 18、内边距 20；文本宽度 = 屏宽 - 76dp，不再使用更窄 max-width；底部预留 120dp 以上，避免被 tap note / 手势区裁切。 |
| 结局页 | 本行记录的是 2026-07-19 早期历史候选，已被第 13 节覆盖；不得作为开发实现依据。 | 当前实现口径见第 13 / 13.1 节：结局页只保留一个可见 action `返回主页`；unlock feedback 是静态状态提示；不展示回忆画廊 / 重看本结局 / 相关章节按钮。 |
| 小节结束页 | 根据 PRD section 21 与 Interaction section 31，小章节结束页已移出当前产品范围。 | HTML authority 已移除 `section-clear` 可视入口与页面；历史第 9 节的 Section Clear 口径被本节覆盖，不再作为当前实现目标。 |

文件变化：

- `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
  - 强化 HUD icon/title/skip、dialogue box、chapter clear、long narration、recap、dialog fallback、ending card 的可读性托底。
  - 移除 `section-clear` 切换入口、可视页面与 preset。
  - 结局页曾改为 2026-07-19 早期终局页候选；该候选已被第 13 节覆盖。
  - 跳过确认页作为 Dialog Android no-real-blur fallback 可见样例，并修正跳过后流向文案。
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
  - 新增 section 17：Android 实机反馈 UI authority candidate。
- 已同步 authority current 副本：
  - `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
  - `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`

Ant / PM 需确认：

1. 结局页 TRUE/GOOD/NORMAL/BAD 共用结构与终局动作是否 OK。
2. Dialog cut-corner + 弱边界 fallback 是否摆脱“圆角矩形线框感”。
3. 长旁白宽度对齐底部旁白正文后，实机阅读是否舒服。

PP implementation alignment checklist：

| Authority section | 目标效果 | Android 组件 | 关键 token | 实机验收截图点 |
|---|---|---|---|---|
| MinSpec 17.1 / 17.2 | HUD 全套同族轻玻璃，亮图可读 | `NagiHud.kt`、`NagiIconButton.kt` | icon 36dp，cut-sm，bg `0.34 -> 0.22`，border `0.12`，shadow，icon halo | 亮背景下 back/auto/save/menu/backlog 不裸白；title 与 icon 不割裂 |
| MinSpec 17.3 | Dialog 不再是圆角矩形线框 | `NagiDialog.kt` | `CutCornerShape(14dp)`，card `0.56 -> 0.52`，scrim `0.40`，border `0.08`，inner highlight，shadow | 跳过确认弹窗截图；边框不能成为主视觉 |
| MinSpec 17.1 | 底部对白与 speaker/name 可读 | `DialogueLayer.kt` | dialogue bg `0.54 -> 0.70`，speaker gold chip `#E4CA8F` + gold halo | 亮背景对白截图，金色姓名清晰但不变厚牌 |
| MinSpec 17.4 | 长旁白与底部旁白正文同宽，不裁切 | long narration text layer | outer 18dp，inner 20dp，正文宽 = screen - 76dp，bottom reserve 120dp | 5~7 行长旁白截图，左右宽度与底部旁白正文对齐 |
| MinSpec 17.5 | 历史候选已废止；不得实现四动作模型 | ending screen / terminal route view | 以 MinSpec section 18 为准 | 验收看 section 18.1 / 18.5：status feedback 非按钮，`返回主页` 是唯一 action |
| MinSpec 17.6 | 小章节结束页从当前范围移除 | route / screen registry | 移除 standalone `section-clear` 运行入口；保留 Chapter Clear | 小节结束进入下一小节 opening；最后小节进入 Chapter Clear 或 Ending |

禁止样式：

1. 圆角矩形硬线框 dialog。
2. 厚系统按钮 / Material 默认按钮替代 final glass。
3. 裸白 HUD icon 压亮背景。
4. title/action chip 有底但 icon button 无底。
5. 旧 handoff / archive / 截图印象样式。
6. 未同步到 `08_authority_current` 的聊天口径。

Blocked 判断：

- 本轮 UI authority 已补足可实现 token，XoXo 当前不标 blocked。
- 若 PP 无法实现 cut-corner、inner highlight、shadow、icon halo，或无法确认 active component path / stale APK / duplicate UI path，必须在开发前 alignment table 标 blocked，不得自行猜。

Cleanup status：

- 旧 UI / 未引用资源本轮只标记口径，不删除。
- Android/Web 接入、构建、实机验证仍需另由 PP / Wewe 执行。

---

## 13. 结局页 authority 返修 + 开场白字号 + 可视文案 hygiene（2026-07-19 / TASK-20260719-008）

依据：

1. `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_XOXO_20260719_ENDING_PAGE_AUTHORITY_REVISION.md`
2. Ant 2026-07-19 对结局页动作模型、开场白字号、手机 mock 可视文案的返修意见。

本轮仍为 UI authority only：不改 Android/Web/story-data/script/BG mapping/TT Start/App Icon，不删除资源。

| 范围 | 本轮决定 | 给 PP / Wewe 的口径 |
|---|---|---|
| 结局页 candidate 字样 | 手机 mock / app UI 中不得出现 `candidate`、`terminal page candidate`、`待 PM 确认` 等内部状态。 | 设计状态可写在 spec / record，不得渲染在手机画面。 |
| 结局页动作 | 覆盖第 12 节的四动作候选模型；结局页只保留 1 个可见动作：`返回主页`。 | 移除 `回忆画廊`、`重看本结局`、`相关章节` 作为结局页可见按钮。 |
| 画廊解锁 | 画廊解锁是后台状态结果，不是结局页按钮。 | 可保留轻量 unlock feedback 文案，但不可做成可点击入口。 |
| Home after-ending | Ending 完成后返回 Home，主 CTA 是 `新的故事`，不是 `继续故事`。 | PP 需区分普通可继续存档态与 ending-complete 后 new-run state。 |
| 开场白字号 | Prologue / 开场白正文小一档。 | `.opening-center` 从 31px 调整为 28px，line-height 从 1.6 调整为 1.68；Start title 与 Name Setup 不变。 |
| 可视文案 hygiene | 手机 mock 只保留玩家真实可见文案。 | source tag、PM/dev/internal notes、`第一版...`、`不扩展...`、fallback/candidate/source 说明均移出可视屏幕。 |

文件变化：

- `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
  - 结局页 subtitle 改为 `Ending unlocked`，移除 user-facing `terminal page candidate`。
  - 结局页 action grid 改为单动作，只保留 `返回主页`。
  - Home 可视主 CTA 改为 `新的故事` / `开始新的运行`，不再以 `继续故事` 作为 after-ending 主 CTA。
  - Prologue `.opening-center` 字号从 31px 降至 28px，line-height 调整为 1.68。
  - 章节目录说明改为玩家文案 `选择你想回到的章节。`
  - 移除手机 mock 中的 source-tag 可见追溯文案。
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
  - 新增 section 18，覆盖结局页动作模型、Home after-ending、Prologue typography、visible copy hygiene。
- 已同步 authority current 副本：
  - `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
  - `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`

确认项：

1. user-facing candidate 字样已从手机 mock 移除。
2. 结局页只剩 `返回主页` 一个可见动作。
3. Home after-ending 主 CTA 是 `新的故事`，不是 `继续故事`。
4. 开场白正文字号已小一档，并写入 MinSpec token。
5. visible mock 屏幕已移除 PM/dev/internal notes。

Cleanup status：

- Cleanup status: none。
- 本轮不删除资源、不清理旧文件；仅收紧 authority 与可视 mock 文案。

### 13.1 二次返修：结局页 status feedback 与 primary action 层级（2026-07-19）

Ant 二次反馈指出：`已解锁：TRUE END / 回忆画廊新增 1 项` 是状态反馈，不是按钮；`返回主页` 才是唯一操作。但上一版两者视觉节奏过近，容易被误读为两个同类按钮。

本次修正：

| 范围 | 修正结果 |
|---|---|
| 结局页结构 | 明确为三层：content / status feedback / primary action。 |
| Status feedback | `已解锁...` 改为 11px 低强调 inline status note；无边框、无矩形填充、无 cut/action shape、非 full-width。 |
| Primary action | `返回主页` 保持唯一可点击 action cell。 |
| 禁止实现 | status feedback 不得实现为 Button、ChipButton、action cell，不得与 `返回主页` 共用同样高度、边框、填充矩形、hover/action rhythm。 |
| MinSpec | section 18.1 / 18.5 已补三层结构与 PP 验收点。 |

确认保留前序要求：

- 无 user-facing candidate 字样。
- 无 PM/dev/internal note 可视文案。
- 无 `回忆画廊`、`重看本结局`、`相关章节` 按钮。
- Home after-ending CTA 仍是 `新的故事`。
- 开场白字号小一档不回退。
