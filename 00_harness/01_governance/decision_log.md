# 决策记录

> 用途：记录已经拍板、后续所有角色必须遵守的决定。  
> 原则：只追加，不覆盖历史。新记录追加在最上方。

---

### DEC-20260718-006
- 时间：2026-07-18
- 项目：NagisHeart
- 来源：Ant大小姐实机截图反馈 / PM 一一复核
- 决策内容：当前 Android UI 实机效果不通过，不得转 `done`。`TASK-20260717-013` / `TASK-20260717-015` 中 HUD icon/title/action 虽统一但变成厚重按钮；Dialog 仍不像 final light glass；speaker/name 可读性仍需确认。yiyi 暂停 UI 自由发挥与自由调参；后续 UI 修正必须先读 `00_harness/08_authority_current/04_ui/` 和 PM reject review，并按明确 acceptance checklist 机械实现。若下一轮实机仍明显偏离 authority，则 Android UI 实现职责转给其他开发，yiyi 只保留引擎、数据、构建、资源接入等非视觉任务。
- 生效范围：`TASK-20260717-013`、`TASK-20260717-015`、新增 `TASK-20260718-004`，以及后续所有 Android UI authority 实现任务。
- 覆盖旧规则：覆盖此前 PM 静态复核通过但仍待实机确认的乐观状态；不覆盖 Web、App Icon、TT Start、story-data、BG mapping、BGM。

---

### DEC-20260717-012
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：TT 追加说明 / Ant现场确认回传 / PM 一一修正
- 决策内容：恢复 TT rethink Strategy A 作为 Start v23 长屏 Android layout experiment 的可执行方向。此前 `DEC-20260717-011` 暂停执行，是因为 PM 收口过快且现场一度怀疑底图不对；TT 追加说明确认：`assets/home.jpg` 等旧 demo 图不是本次 Start final 底图，本次 Start final 仍沿用 Start v23 / remeet 底图方向。因此可基于 `design/authority/icon_start_tt/start_long/rethink/` 的 Strategy A 派给 yiyi 做 Android layout experiment，但仍不直接视为 final 资源。
- 生效范围：Android Start 长屏适配、yiyi layout experiment、TT Start 长屏后续视觉 QA
- 覆盖旧规则：覆盖 `DEC-20260717-011` 的暂停执行状态；保留 `DEC-20260717-011` 中“不得由 PM 在未确认时直接下发开发”的流程教训。继续保留 `DEC-20260717-009` 对 V1/V2/V3 不得作为 final 交给 yiyi 的限制。
- 执行要求：恢复 `TASK-20260717-008` 为 ready。yiyi 按 rethink Strategy A 做 Android layout experiment：不使用 V1 毛玻璃/模糊补边；不使用 V2/V3 近景大头 crop final；使用 Start v23 / remeet 背景做长屏适配，v23 标题层、START、Tap to start 保持原 SVG/图层字感；长屏放大/适配时优先保留左侧主体关系，不让标题/START 独立漂移。完成后必须回传 Android 实机/模拟器截图或录屏，由 PM / Ant 再确认是否固化。

---

### DEC-20260717-011
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐纠正 / PM 一一修正
- 决策内容：暂停 `DEC-20260717-010` 的执行。TT rethink Strategy A 当前不得交给 yiyi 开发，也不得视为已通过方向；原因是当前预览底图仍不对，Ant大小姐已在 XoXo 侧要求修正底图，需等待 XoXo 回传后再由 PM / Ant 重新确认。任何 Start 长屏 Android layout experiment 必须先经过 Ant大小姐明确确认预览方向，不得由 PM 直接下发开发。
- 生效范围：TT Start 长屏适配、XoXo 底图修正、yiyi Android Start 长屏任务、PM 后续收口
- 覆盖旧规则：覆盖 `DEC-20260717-010` 中“Strategy A 作为下一步 Android layout experiment 方向通过”的执行口径；`DEC-20260717-010` 保留为历史误判记录，但不得作为开发依据。
- 执行要求：删除 / 暂停已准备给 yiyi 的 Strategy A 开发任务单；`TASK-20260717-008` 不进入执行；等待 XoXo 修正底图并回传后，PM 先提交 Ant大小姐视觉确认，再决定是否重新派发给 yiyi。

---

### DEC-20260717-010
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：TT Start 长屏适配策略 rethink / PM 一一复核
- 决策内容：TT `TASK-20260717-003` 的 Strategy A 作为下一步 Android layout experiment 方向通过，但不直接把 rethink 预览图视为 final 长屏资源。Start 长屏适配不继续 V1 毛玻璃补边，也不继续 V2/V3 raw source 近景裁切路线；优先采用“背景 cover-height / 只裁左右 + v23 标题、START、Tap to start 作为 protected SVG safe UI layer”的实现策略。该策略的核心目标是保留已确认 Start v23 字体/字感、Nagi 下巴/下颌线、face/chin/START 关系，并消除长屏黑条。
- 生效范围：Android Start 长屏适配、yiyi 后续 layout experiment、TT 长屏资源后续任务、视觉 QA
- 覆盖旧规则：覆盖 `DEC-20260717-004` 中“优先让 TT 出更长底图资源包”作为唯一方向的理解；保留 `DEC-20260717-009` 对 V1/V2/V3 不得作为 final 交给 yiyi 的限制。
- 执行要求：新增 yiyi 开发实验任务，按 TT rethink 文档实现 Strategy A：背景可按 1080x1920 clean background 等比填满长屏高度并水平居中裁左右；标题/START 使用已确认 v23 SVG 层，不重绘、不换字体；START 点击热区跟随 protected UI layer；输出真机截图/录屏和差异说明后再由 PM / Ant 确认是否固化。不得接入 V1/V2/V3 长屏包，不得修改 App Icon、XoXo final UI authority、story/script 数据或旧资源清理。

---

### DEC-20260717-009
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐视觉反馈 / PM 一一裁决
- 决策内容：TT Start v23 长屏 V3 不通过。V3 仍未保留 Nagi 下巴；同时暂停“继续裁切原图”的单一路线。长屏适配应重新论证：既然主页背景可以正常适配长屏，Start 也应优先研究保留已确认 1080x1920 画面关系、用设计盒 / safe area / content scale / 标题位置调整等方式适配，而不是默认必须裁成更近的大头图。后续 TT 需输出长屏适配策略 rethink，比较保留原图适配、扩展画布、不破坏人物关系等方案；V1/V2/V3 均不得作为 final 交给 yiyi。
- 生效范围：TT Start 长屏资源、Android Start 长屏接入、yiyi 后续开发任务、视觉 QA
- 覆盖旧规则：覆盖继续沿 V2/V3 裁切路线直接出新图的做法；不覆盖已确认 Start v23 的基础视觉语言。
- 执行要求：TT 先输出适配策略分析和推荐方案，再提交新预览；必须保留 Nagi 下巴、已确认字体/字感、face/chin/START 关系；不得使用 V1 毛玻璃补边。

---

### DEC-20260717-008
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐视觉反馈 / PM 一一裁决
- 决策内容：TT Start v23 长屏 V2 不通过。V2 的真全屏构图方向正确，但字体 / 标题层 / START 字感变了，且构图裁切没有保住 Nagi 下巴，破坏了已确认 Start v23 的视觉语言和人物焦点关系。后续 rework 必须保留 1080x2400 真全屏构图，同时恢复已确认 v23 的标题、START、Blue Lock、小装饰线和 Tap to start 字体/层效果，并确保 Nagi 的下巴展示出来；不得回退到 V1 上下毛玻璃，也不得换成新字体风格。
- 生效范围：TT Start 长屏资源、Android Start 长屏接入、yiyi 后续开发任务、视觉 QA
- 覆盖旧规则：覆盖 `PM_REVIEW_TT_START_LONG_SCREEN_V2_20260717.md` 中“可提交 Ant 确认”的待确认状态；Ant 已确认当前 V2 字体观感不通过。
- 执行要求：TT 输出 V3：真全屏构图 + 保持已确认 Start v23 字体/字感；yiyi 不得接入 V2；旧资源不删除。

---

### DEC-20260717-007
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一职责修正
- 决策内容：Android UI 资源审计中发现的“缺少或未交付给开发的 UI 资源”，先由 XoXo 作为 UI owner 补齐并整理成开发可接入包；yiyi 作为开发 owner 只负责接入、路由修正、构建与验证，不负责反向设计或临时补 UI 资源。旧资源、未引用资源、obsolete 资源暂不删除，必须等资源补齐、Android 适配完成、QA / 视觉测试通过后，再由 PM 另开清理任务处理。
- 生效范围：XoXo Android 资源补齐任务、yiyi Android 资源接入任务、后续 QA 和资源清理
- 覆盖旧规则：修正 `DEC-20260717-005` 中容易被理解为“由 yiyi 直接补齐所有资源”的口径；Prologue / Name 路由仍由 yiyi 修正，但 HUD/system icons 等 UI 资源包先由 XoXo 确认 / 补给。
- 执行要求：新增 XoXo 资源补给任务 `TASK-20260717-006`；`TASK-20260717-005` 调整为等待 XoXo 资源交付后由 yiyi 接入；任何删除旧资源的动作都必须另开任务。

---

### DEC-20260717-006
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐实机视觉反馈 / PM 一一裁决
- 决策内容：TT Start v23 长屏 v1 预览不通过。长屏开屏页要做“图片本身布满屏幕”的完整 1080x2400 适配，不接受在 1080x1920 中心图上下添加毛玻璃、模糊条或补丁式延展作为最终方案。当前 `design/authority/icon_start_tt/start_long/` v1 包保留为历史候选，但不得交给 yiyi 作为 final 长屏资源接入。`TASK-20260717-003` 回派 TT 重做 / 优化长屏全屏构图。
- 生效范围：TT Start 长屏资源、Android Start 长屏接入、yiyi 后续开发任务、视觉 QA
- 覆盖旧规则：覆盖 `PM_REVIEW_TT_START_LONG_SCREEN_20260717.md` 中“可提交 Ant 实机确认”之后的待确认状态；Ant 已确认当前 v1 视觉不通过。也覆盖任何把上下毛玻璃延展视为 final 长屏方案的口径。
- 执行要求：TT 输出新的 1080x2400 全屏构图长屏包；yiyi 暂不接入当前 v1 长屏包；旧资源和未引用资源在缺口补齐、开发适配、测试通过前不得删除。

---

### DEC-20260717-005
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：XoXo Android UI 资源审计 / PM 一一裁决
- 决策内容：Android 资源修复按 XoXo 审计结论分派：Prologue / Name 背景改用现有 `R.drawable.splash_bg`，不再引用缺失的 `file:///android_asset/bg/poster_start_nagis_heart_bg_clean.png`；HUD / system icons 从已准备的 `assets/ui/android/drawable/` 接入 `android/app/src/main/res/drawable/`；App Icon 暂不替换，继续等待 Ant大小姐单独确认；旧 splash / keyart 资源本轮不删除，只禁止继续作为 final UI 主动引用并记录剩余引用；Start SVG 需在 Android 构建后做真机视觉确认，若 Coil SVG filter 有偏差再请求 TT raster fallback。
- 生效范围：Android UI 资源修复、yiyi 后续开发任务、QA 视觉复验、App Icon 接入边界
- 覆盖旧规则：覆盖继续使用缺失 `poster_start_nagis_heart_bg_clean.png` asset path 的实现；不覆盖 TT App Icon 待确认状态
- 执行要求：yiyi 执行资源路由与图标接入；不得在本任务中替换 App Icon、删除旧资源、修改 story/script 或补 pending 页面

### DEC-20260717-004
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：yiyi Start v23 实机适配回报 / PM 一一裁决
- 决策内容：Start v23 在长屏手机上出现上下黑条时，不采用“直接全屏裁切铺满”的方案作为最终修复；优先让 TT 输出长屏适配资源包，以保留已确认的标题、人物脸部焦点与 START 位置关系。当前 1080x1920 方案可作为 9:16 设备或临时 fallback，长屏 final closure 依赖 TT 新资源与实现说明。
- 生效范围：Android Start v23 接入、TT Start 长屏资源任务、后续视觉 QA
- 覆盖旧规则：覆盖 yiyi 回报中的方案 A 作为默认修复的可能性；不覆盖 TT Start v23 已确认方向
- 执行要求：TT 输出长屏 Start v23 适配包；yiyi 在新资源到位前不擅自用裁切导致标题/START 漂移；PM 后续按新资源复核 Android 实现

### DEC-20260717-003
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一确认
- 决策内容：`design/NagisHeart_UI_Authority_XoXo_v1_0.html` 修订版通过最终确认，提升为当前 UI final authority。该 final authority 包含 `DEC-20260715-001` 的严格合版边界、`DEC-20260717-001` 的 TT Start v23 开屏方案，以及 `DEC-20260717-002` 的局部修订：主页去顶部标题、设置页小字 / 数值右侧对齐。章节目录、大章结束页、小节结束页仍不在 final authority 内，继续 pending。
- 生效范围：UI 设计验收、Android/Web UI 接入、后续 QA 视觉核对、资源审计任务
- 覆盖旧规则：覆盖所有把 XoXo 候选版视为待确认草稿的口径；不覆盖 TT App Icon 的待确认状态
- 执行要求：PM 将 `TASK-20260715-001` 标记为完成；UI 侧继续执行 Android 当前资源与 final authority 的缺漏/冗余审计，不得借审计重新设计已确认页面

### DEC-20260717-002
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一确认
- 决策内容：XoXo UI 权威候选版中，开屏 / Start 页采用 TT 的 Start v23 方案，XoXo 候选版不需要保留自己的开屏图作为权威页；主页去掉顶部标题，因为该标题字体与 TT 开屏页标题不一致；设置页各行的小字 / 数值放到右侧；除上述修订点外，其他页面通过。
- 生效范围：`TASK-20260715-001` UI 权威候选版修订、XoXo 合版文件、后续 UI authority 确认
- 覆盖旧规则：覆盖 XoXo 候选版中自带开屏页作为权威页的表述；不覆盖 TT Start v23 接入决策 `DEC-20260717-001`
- 执行要求：XoXo 只做上述局部修订，不重新设计已通过页面；章节目录、大章结束页、小节结束页继续保持 pending

### DEC-20260717-001
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一确认
- 决策内容：TT 的 Start 页 v23 分层方案可进入开发接入。采用 `design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png` 作为干净底图，`start_title_overlay_v23.svg` 作为静态标题层，`start_button_static_v23.svg` 作为 START 层，并由开发用原生 alpha 动效实现 `0.68 -> 1.00 -> 0.68`、`1.6s` 循环呼吸。Start 页是开场海报入口，不承载 Continue / Chapter / Gallery / Settings 菜单。
- 生效范围：TT Start v23 开发接入任务、Android Start 页实现、后续 Start 页 QA 验收
- 覆盖旧规则：覆盖旧 Start 页上五按钮菜单或两套 Start 页并存的实现口径；不覆盖 App Icon 候选结论
- 执行要求：yiyi 只接入 Start v23 分层方案，保留现有叙事路由，不处理 App Icon，不改 XoXo UI authority candidate，不扩展到章节目录、大章结束页或小节结束页

### DEC-20260715-001
- 时间：2026-07-15
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一确认
- 决策内容：UI 权威合版以 `design/NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` 为唯一母版；只从后续文件中拼入已明确通过的页面，不进行重设计。`NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` 仅采用主页、开场白、名字设置、大章开始、小节开始和弹窗；其大章/小节结束页、长旁白、剧情回顾均不采用。长旁白与剧情回顾采用 `NagisHeart_LongNarration_StoryRecap_Redesign_Lulu_v1_0.html` 的结构，但统一为母版的冷色体系。
- 生效范围：UI 权威合版、XoXo 设计任务、后续开发与测试的视觉依据
- 覆盖旧规则：覆盖 `design/CoCo_Design_Handoff_20260713.md` 中把未通过的大章/小节结束页视为可用定稿、或把 Missing Pages 整体视为系统页权威的表述
- 执行要求：XoXo 只做拼接、替换、删减、对齐和结构整理；大章/小节结束页及章节目录最终样式保持待确认，不得在本任务中自行补设计

## 字段说明

- `编号`：唯一编号，建议格式如 `DEC-20260715-001`
- `时间`：决策落账时间
- `项目`：默认填 `NagisHeart`
- `来源`：默认写 `Ant大小姐 / PM 一一确认`
- `决策内容`：最终拍板内容
- `生效范围`：影响哪些模块、文件、角色
- `覆盖旧规则`：如果有，写明被覆盖项；没有写 `无`
- `执行要求`：需要谁执行、执行到什么程度

---

## 记录模板

### DEC-YYYYMMDD-XXX
- 时间：
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一确认
- 决策内容：
- 生效范围：
- 覆盖旧规则：无
- 执行要求：

---

### DEC-20260717-013
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐实机视觉反馈 / PM 一一派发 `TASK-20260717-011` / XoXo UI authority 补齐
- 决策内容：章节开始 / 小节开始页必须在文字组后增加很浅的透明雾面托底，解决实机背景上可读性不足；大章结束 `CHAPTER CLEAR` 与小节结束 `SECTION CLEAR` 采纳并修订历史 Missing Pages 的轻玻璃过渡页方向，提升为当前可实现 UI authority；顶部标题 chip 与跳过 / 下一章 / 继续下一节 action chip 必须使用 final glass HUD 语言，不得由 Android 临时发明厚重按钮或系统默认样式。章节目录仍 pending。
- 生效范围：`design/NagisHeart_UI_Authority_XoXo_v1_0.html`、`design/NagisHeart_UI_Authority_Merge_Record_20260715.md`、`00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`、yiyi 后续 Android UI 接入任务。
- 覆盖旧规则：覆盖 `DEC-20260717-003` 中“大章结束页 / 小节结束页仍 pending”的部分；不覆盖章节目录 pending、TT Start、App Icon、story/script、BG mapping、资源删除边界。
- 执行要求：yiyi 后续实现章节开始/结束与标题/action chip 时必须按 XoXo 更新后的 authority/spec；不得自行补章节目录，不得改 story/script 或 BG mapping。

### DEC-20260717-014
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一确认
- 决策内容：任何设计、交互、剧情、BG mapping、资源口径或技术规则变化，只要被 PM 接受为 review / authority / 可开发依据，就必须同步到 `00_harness/08_authority_current/` 对应权威目录；未完成权威同步前，不得派开发按该变化实现。
- 生效范围：`00_harness/07_scheduler/PM_LOOP.md`、`00_harness/07_scheduler/WORKER_LOOP.md`、所有设计/开发/PM 任务分派与回传。
- 覆盖旧规则：补强现有 loop 规则；不改变 Ant 最终确认权。
- 执行要求：PM_LOOP 分派开发任务前必须检查 `08_authority_current` 是否已更新；WORKER_LOOP 回传设计或规则变化时必须写明权威同步状态；开发者默认读取 `08_authority_current`，不得按历史 handoff、旧草稿、聊天截图或未同步状态报告实现。

---

### DEC-20260717-015
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐实机反馈 / PM 一一派发 `TASK-20260717-014` / XoXo UI authority patch
- 决策内容：高亮/复杂背景下，顶部 HUD 必须作为统一 final glass HUD 系统实现：back、auto、save、backlog/menu 等 icon button 不得裸白线直接压背景，必须与 title chip、action chip 共用轻玻璃 backing、描边、shadow/halo 与 blur/fallback 规则；底部 dialogue speaker/name 保留金色方向，但提亮为 `#E4CA8F` 并增加仅包住文字的小型轻衬底、gold 轻描边、text shadow 与 halo，以保证亮/复杂背景上的可读性。
- 生效范围：`design/NagisHeart_UI_Authority_XoXo_v1_0.html`、`design/NagisHeart_UI_Authority_Merge_Record_20260715.md`、`00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 15、`00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`、`00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`、yiyi 后续 HUD/dialogue readability 实现。
- 覆盖旧规则：覆盖此前可能允许 HUD icon button 裸线显示的口径；不覆盖章节目录 pending、TT Start、App Icon、story/script、BG mapping、Android/Web 代码和资源删除边界。
- 执行要求：yiyi 后续实现 HUD icon/title/action chip 与 speaker/name 可读性时必须以 `08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 15 为准；不得自行改成厚系统按钮、整条黑底 name plate 或 Material 默认按钮。

---

### DEC-20260717-016
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一确认
- 决策内容：在测试资源有限、Ant大小姐本人承担真机主验收的阶段，UI 设计和 UI 开发必须采用“谨慎变更”流程。任何 UI 调整都必须先核对最新 `08_authority_current/04_ui/`，判断是实现偏差还是权威需要修订；若权威需要变化，先由 UI owner 更新 authority 并通过 PM review，再派开发。开发接到 UI 修改任务时，必须先确认权威文件、具体改动目标范围、预期视觉效果和禁止范围，不能按截图、聊天印象或旧 handoff 自行重设计。
- 生效范围：`00_harness/07_scheduler/PM_LOOP.md`、`00_harness/07_scheduler/WORKER_LOOP.md`、后续所有 UI 设计任务、Android/Web UI 实现任务、PM review 与 worker 回传。
- 覆盖旧规则：补强 `DEC-20260717-014` 权威同步硬规则；不改变 Ant 最终确认权，也不阻止 PM 在实机反馈后拆分 UI owner / developer 任务。
- 执行要求：PM 分派 UI 开发任务前必须写明 authority_current 文件与章节、目标范围、预期效果和禁止范围；开发者回传必须写明已读取的 authority_current、实现范围、未触碰范围、fallback 和仍需真机确认点。缺少这些条件时，开发者应先回报阻塞，不得先动手试调。

---

### DEC-20260717-017
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：PM 一一派发 `TASK-20260717-016` / XoXo UI authority patch
- 决策内容：章节目录从 pending 转为当前 review authority，采用系统级 dark glass 目录页：主容器 `catalog-panel`，三段式标题说明 / 章节列表 / 返回与继续动作；第一版只表达章节、小节、当前进度、解锁、完成、锁定状态，不扩展成成就、CG、评分或复杂图谱系统。Dialog 在 Android 无真实 frosted background blur 时使用固定 fallback token：card `rgba(27,36,54,0.56)`（允许 0.52~0.60）、scrim `rgba(9,14,24,0.38)`（允许 0.34~0.42）、border `rgba(255,255,255,0.14)`、shadow `0 18dp 42dp rgba(0,0,0,0.36)`；禁止继续凭感觉调 alpha，禁止 80% 以上厚重深色大卡、系统默认 Dialog、纯黑/纯白实底、会模糊弹窗自身内容的 RenderEffect。
- 生效范围：`design/NagisHeart_UI_Authority_XoXo_v1_0.html`、`design/NagisHeart_UI_Authority_Merge_Record_20260715.md`、`00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 16、`00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`、`00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`、后续 yiyi / Wewe 章节目录和 Dialog fallback 实现。
- 覆盖旧规则：覆盖此前“章节目录 pending”的口径；收紧 section 11 中 Android 无真 blur fallback 不够明确的部分。不覆盖 Start/Home/Settings/Story 已通过页面、HUD/speaker section 15、TT Start、App Icon、story/script、BG mapping、Android/Web 代码或资源删除边界。
- 执行要求：后续开发以 `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 16 为准；超出 fallback alpha 范围或需要改变 Dialog 布局/字号/位置时必须回 UI/PM 复核。

---

### DEC-20260717-018
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐实机反馈 / PM 一一同步交互 authority
- 决策内容：交互设计文档新增 2026-07-17 实机反馈补丁：剧情回顾必须作为分页回看，不再纵向滚屏；移动端默认左右滑动换页，不显示“上一页 / 下一页”文字按钮，只允许轻量页码 indicator；“跳过本节”确认后进入当前小章节结束页；章节目录交互边界为当前大章下小章节列表，状态为未解锁 / 进行中 / 已完成 / 已跳过完成；autoAdvance、`->`、空白选项等只作为引擎路由，不得作为玩家可见选项；章节 / story gameplay 页面默认使用 dark 可读性策略。
- 生效范围：`design/NagisHeart_Interaction_Design_v1_0.md` section 30、`00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md` section 30、后续 yiyi / Wewe 对剧情回顾、跳过本节、章节目录、选项过滤、主题可读性的实现。
- 覆盖旧规则：覆盖交互文档旧 section 14 中“Backlog 可上下滑动查看”的口径；补强 section 29 中剧情回顾、章节目录与章节流程页规则；不覆盖 UI 视觉 token，视觉 token 仍以 `04_ui` authority 为准。
- 执行要求：开发 UI / 交互任务必须同时读取 interaction section 30 与对应 UI MinSpec；若两者冲突，先回 PM 复核，不得按截图或旧 handoff 自行实现。

---

### DEC-20260718-001
- 时间：2026-07-18
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一清理
- 决策内容：为避免新旧视觉资源混淆，将已明确废弃或无主动引用的资源从活跃路径移入 `00_harness/99_archive/obsolete_assets/20260718_cleanup/`，不做不可逆删除。清理范围包括 TT Start 长屏 V1 / V2 / V3 被打回候选包，以及 Android 活跃路径中的旧 `splash_start.png`、`splash_title.png`、`poster_start_nagis_heart_keyart.jpg`。当前 Start 长屏有效参考保留为 `design/authority/icon_start_tt/start_long/rethink/`；当前 Start 实现权威仍为 TT Start v23 layered resources。
- 生效范围：`design/authority/icon_start_tt/start_long/`、`android/app/src/main/res/drawable-nodpi/`、`android/app/src/main/assets/bg/`、`00_harness/99_archive/obsolete_assets/20260718_cleanup/`、后续所有开发和设计任务。
- 覆盖旧规则：覆盖此前“旧 Android Start 资源 keep for now”的临时口径；不覆盖当前 TT Start v23、Start Strategy A / rethink、UI authority、story/script、BG mapping 或 Web/Android 正在实现的有效文件。
- 执行要求：开发者不得从 archive 中直接引用资源；若需要恢复，必须由 PM 开 restore task 并记录为什么当前 authority 需要改变。

---

### DEC-20260718-002
- 时间：2026-07-18
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一确认
- 决策内容：清理 / 归档判断正式纳入 harness loop。每次 PM_LOOP 收口、每个 WORKER_LOOP 任务回传、以及每个基础循环结束前，都必须判断是否存在被打回、废弃、过期、重复、易误用的文件或资源；无清理也要明确写 `Cleanup status: none`。需要保留追溯但不得作为开发依据的内容，应移入 `00_harness/99_archive/` 并写明原因、日期、替代活跃路径和禁止引用规则。
- 生效范围：`00_harness/07_scheduler/PM_LOOP.md`、`00_harness/07_scheduler/WORKER_LOOP.md`、`00_harness/07_scheduler/LOOP_OVERVIEW.md`、后续所有 PM 分派、worker 回传、PM review、状态快照和交班。
- 覆盖旧规则：补强 `DEC-20260718-001`，从一次性清理扩展为每轮必检流程；不改变“不可未经确认永久删除资源”的原则。
- 执行要求：PM 每轮必须做清理 / 归档判断，并在需要时更新 PM review、decision log、task_board、latest_status_snapshot；执行者每次回传必须写 cleanup status / candidates / done。开发者不得引用 archive；未经 PM 授权不得自行删除或扩大清理范围。

---

### DEC-20260718-003
- 时间：2026-07-18
- 项目：NagisHeart
- 来源：Ant大小姐确认 / PM 一一核对 TT icon package
- 决策内容：App Icon 使用 Ant大小姐确认的“第三版”，即 TT icon 总览图 `design/authority/icon_start_tt/icon/previews/icon_overview_contact_sheet.png` 顶部第三张 / 右上 `rounded rect mask preview`。TT authority package 中对应开发资源准确名称为 `rounded rect v2 decorated`，主文件为 `design/authority/icon_start_tt/icon/master/app_icon_tt_candidate_1024.png`，Android legacy mipmap exports 位于 `design/authority/icon_start_tt/icon/android_mipmap/mipmap-*/ic_launcher.png`，adaptive foreground/background exports 位于 `design/authority/icon_start_tt/icon/android_adaptive/*/`。当前 Android launcher icon 用错，必须按此 authority 修正。
- 生效范围：`design/authority/icon_start_tt/`、`android/app/src/main/res/mipmap-*/`、`android/app/src/main/res/mipmap-anydpi-v26/`、`android/app/src/main/AndroidManifest.xml`、后续 Android/Web icon 接入任务。
- 覆盖旧规则：覆盖此前 `TASK-20260715-002` 中 “App Icon 等待 Ant大小姐最终确认” 的状态；不覆盖 Start 长屏 Strategy A、HUD/dialog/chapter UI、story/script、BG mapping、BGM。
- 执行要求：yiyi 按 `TASK-20260718-002` 修正 Android launcher icon；开发不得自行选择其他 icon 版本，不得从 archive 引用资源；旧 launcher icon 如需清理，先作为 cleanup candidates 回报 PM。
- 二次确认：Ant大小姐 2026-07-18 再次确认“就是这个”，指向 TT icon 总览图顶部第三张 / 右上 `rounded rect mask preview`。

---

### DEC-20260718-004
- 时间：2026-07-18
- 项目：NagisHeart
- 来源：Ant大小姐确认 / PM 一一静态核验
- 决策内容：BGM 不再作为“是否接入首版”的待决任务。项目已存在 `assets/bgm.mp3`，Android 已有 `BgmManager`、设置页音量项、用户设置持久化与 `GameViewModel` 读取 scene visual `bgm` 并播放的逻辑；后续只需随构建/实机做常规验证。
- 生效范围：`TASK-20260716-001`、Android BGM 播放逻辑、后续 current priorities。
- 覆盖旧规则：覆盖 `TASK-20260716-001` 的 ready 待决状态；不表示后续不能调整 BGM 内容或音量体验，只表示“是否接入”已不是开放问题。
- 执行要求：PM 将 `TASK-20260716-001` 标记为 done；后续若出现 BGM 体验问题，另开具体修复任务。

---

### DEC-20260718-005
- 时间：2026-07-18
- 项目：NagisHeart
- 来源：Ant大小姐确认 / PM 一一调整 Wewe 任务口径
- 决策内容：Web 版本已经存在 MVP，因此 Wewe 不再只做“入职只读审计”。Web 任务升级为基于已有 `web/` MVP 的 overnight implementation pass，目标是在 Ant大小姐明早醒来前尽量交付可打开、可验证、按当前 authority 明显前进的 Web 版本开发回报。
- 生效范围：`TASK-20260717-012`、`TASK-20260718-003`、`web/`、`design/NagisHeart_Web_Architecture_v1_0.md`、`00_harness/08_authority_current/`、Wewe 后续 Web 开发任务。
- 覆盖旧规则：覆盖 `TASK-20260717-012` “第一轮只读、不改代码”的旧口径；不覆盖 Android yiyi 任务、不允许 Wewe 修改 Android/story-data 正文/BG mapping 权威/authority_current。
- 执行要求：Wewe 醒来后直接执行 `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_WEWE_20260718_WEB_MVP_OVERNIGHT_IMPLEMENTATION.md`；必须先读 authority_current，再按 P0-A 到 P0-E 顺序实现；完成后写 `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_mvp_overnight_20260718.md`，包含运行方式、验证结果、剩余差异和 cleanup status。
# DEC-20260718-018 - Android owner transfer and QA roster update

- 日期：2026-07-18
- 决策人：PM 一一 / Ant大小姐
- 决策内容：`yiyi` 标记为离职 / inactive，不再接收新任务；`PP` 正式接替 yiyi 成为当前 Android 开发工程师；`DeDe` 作为 Codex 侧正式 QA 恢复使用，必须在真正仓库 `D:\Nagi's Heart\NagisHeart` 工作并遵守 Harness / Loop。
- 生效范围：agent roster、任务分派、Android 开发任务、QA 任务、PM inbox/outbox、task board。
- 执行要求：后续 Android 实现任务默认派给 PP；yiyi 仅保留历史报告引用，不再作为 active owner；DeDe 只读测试并输出 QA 报告，不直接改代码。
- 相关文件：`00_harness/00_project/agent_registry.md`、`README_AI.md`、`TASKS.md`、`00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_DEDE_20260718_CODEX_QA_REBOOT_AND_WEB_MOBILE_REGRESSION.md`

---
---

## DEC-20260719-001 — Android real-device feedback authority override

- Date: 2026-07-19
- Decider: Ant 大小姐 / PM 一一
- Status: accepted

### Decision

The 2026-07-19 Android real-device feedback supersedes earlier rules that caused implementation drift:

1. Backlog / 剧情回顾 opens on the first page, not the latest / last page.
2. Backlog pagination must fit visible content; fixed 8 entries per page is not allowed when text clips.
3. Normal flow removes standalone Section Clear / 小章节结束页. Section body should go directly to the next section opening, while chapter ending remains.
4. Skip-section confirmation no longer lands on current Section Clear; it lands on next section opening, chapter ending, or ending flow depending on position.
5. Ending page is a terminal flow and must unlock gallery immediately. It must not resume normal story after display.
6. Ending page UI is missing from current final authority and must be designed by XoXo, then confirmed by Ant before development implementation.
7. Dialog/HUD/readability fixes must be based on latest `08_authority_current` plus explicit Android no-real-blur fallback. Developers must provide authority-to-code comparison before claiming fixed.

### Files

- `00_harness/08_authority_current/01_product/NagisHeart_PRD_v2_0.md`
- `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
- `design/NagisHeart_PRD_v2_0.md`
- `design/NagisHeart_Interaction_Design_v1_0.md`
- `00_harness/05_reports/validation/PM_REVIEW_ANDROID_REAL_DEVICE_FEEDBACK_20260719.md`

### Cleanup status

None. This decision changes authority rules and task scope only.

---

## DEC-20260719-002 — Mandatory alignment and code-review gate

- Date: 2026-07-19
- Decider: Ant 大小姐 / PM 一一
- Status: accepted

### Decision

Repeated Android UI failures are treated as an information-alignment and code-review process failure, not merely as individual developer mistakes.

For UI / interaction / story-flow / routing / progress / gallery implementation tasks:

1. Developers must produce a pre-implementation alignment table before coding.
2. Developers must produce a post-implementation code-review table before PM sends the task to QA / Ant verification.
3. PM must block implementation when authority is missing, stale, contradictory, or not synchronized to `08_authority_current`.
4. If real-device output still shows old behavior after a reported fix, PM must explicitly check for stale APK, wrong build variant, duplicate component path, inactive code path, missing authority detail, or implementation mismatch.
5. XoXo/UI authority updates must include developer-readable token / fallback / acceptance checklist, not only visual direction.

### Files

- `00_harness/07_scheduler/PM_LOOP.md`
- `00_harness/07_scheduler/WORKER_LOOP.md`
- `00_harness/07_scheduler/LOOP_OVERVIEW.md`
- `00_harness/06_templates/tpl_alignment_code_review_gate.md`
- `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_PP_20260719_ANDROID_MAIN_FLOW_LOGIC_AND_UI_AUDIT.md`
- `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_XOXO_20260719_ANDROID_READABILITY_ENDING_UI_AUTHORITY.md`

### Cleanup status

None. This is a process gate update.

---

## DEC-20260719-003 — XoXo Android readability / ending UI authority candidate tokenization

- Date: 2026-07-19
- Decider: XoXo acting under PM 一一 task `TASK-20260719-001`
- Status: review authority candidate / pending PM + Ant confirmation

### Decision

XoXo updated the current UI authority candidate so the 2026-07-19 Android real-device feedback is no longer expressed only as visual direction. The affected UI components now carry developer-readable tokens and an implementation alignment checklist:

1. Global text-over-image readability backing uses stronger light-glass tokens instead of naked text or thick black/white cards.
2. HUD title chip, icon buttons, and skip/action chip must share one final glass HUD family with explicit shape / alpha / border / shadow / icon halo values.
3. Dialog Android no-real-blur fallback is cut-corner, weak-border, inner-highlight glass; rounded rectangle hard-line-frame styling is prohibited.
4. Long narration text width matches the bottom single-line narration body width: outer 18dp, inner 20dp, text width = screen width - 76dp.
5. Ending page is added as a terminal final-candidate page with ending tag, title, subtitle, description, unlock feedback, return home, gallery, replay ending, and related chapter actions.
6. Standalone Section Clear / 小章节结束页 is removed from the current product UI scope; historical Section Clear UI authority is superseded by PRD section 21 and Interaction section 31.

### Files

- `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`

### Gate

PP must use the alignment / code-review gate before any implementation. If active Android component paths are ambiguous, stale build risk is present, or the authority tokens cannot be implemented without inventing UI, PP must report blocked instead of guessing.

### Cleanup status

None. This decision changes UI authority candidate and developer alignment requirements only; no resource deletion is authorized.

---

## DEC-20260719-003 — Release-readiness code health review gate

- Date: 2026-07-19
- Decider: Ant 大小姐 / PM 一一
- Status: accepted

### Decision

The project has gone through many implementation and design revisions. Before treating Android or Web as release-ready, PM must run a release-readiness code health review gate.

This review is broader than a per-task diff check. It must evaluate:

1. overall code design and maintainability;
2. duplicate or parallel implementations of the same screen/component;
3. obsolete active code paths left behind by old versions;
4. conflicting rules between PRD, interaction authority, UI authority, story-data, and runtime code;
5. state-machine / routing / progress / save / gallery unlock risks;
6. resource path conflicts, stale assets, and archive leakage;
7. build/install freshness and QA traceability.

No worker may use this review as permission for broad refactoring. The first pass is audit-only. Any cleanup or refactor must become a scoped follow-up task with PM approval.

### Files

- `00_harness/05_reports/validation/PM_RELEASE_READINESS_CODE_REVIEW_PLAN_20260719.md`
- `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_PP_20260719_ANDROID_CODE_HEALTH_AUDIT.md`
- `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_WEWE_20260719_WEB_CODE_HEALTH_AUDIT.md`

### Cleanup status

None. This creates a release gate and audit tasks only.

---

## DEC-20260719-004 — Android Dialog / HUD root cause handling

- Date: 2026-07-19
- Decider: PM 一一, responding to Ant real-device feedback
- Status: accepted

### Decision

The repeated Android Dialog / HUD mismatch must be treated as an active-path and authority-alignment failure, not as another blind visual-tuning task.

PM static investigation found:

1. `NagiDialog.kt` still uses old section 16.5-style `RoundedCornerShape(24.dp)` / 14% border / rounded shadow, while current UI authority section 17.3 requires cut-corner weak-border glass and explicitly prohibits the rounded rectangle line-frame look.
2. `NagiHud.kt` title chip and `GameScreen.kt` skip/action chip still use weaker old glass tokens and are not centralized.
3. System-screen headers such as Backlog / Chapter / Settings / Save / Gallery do not all share one navigation/header component, so a fix to `NagiHud` alone cannot guarantee global navigation consistency.
4. Future Android UI implementation must include active component proof, authority token comparison, and stale APK / wrong build variant checks before being marked review.

### Files

- `00_harness/05_reports/validation/PM_INVESTIGATION_ANDROID_DIALOG_HUD_ROOT_CAUSE_20260719.md`
- `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_PP_20260719_ANDROID_DIALOG_HUD_ROOT_CAUSE_ADDENDUM.md`

### Cleanup status

None. Investigation and process decision only; no code or resource deletion authorized.
# DEC-20260719-006 - Implementation tasks require hard alignment gate before coding

- Date: 2026-07-19
- Owner: PM 一一
- Trigger: Ant reported repeated Android implementation failures where workers claimed fixes but real-device behavior remained old or incomplete. PP also acknowledged it skipped referenced MinSpec sections and started coding before completing full section comparison.
- Decision:
  - Any Android/Web implementation task touching UI, interaction, story flow, routing, persistence, gallery unlocks, or other visible behavior must use the alignment/code-review gate.
  - High-risk, multi-section, or previously failed tasks must complete a pre-implementation alignment table and wait for PM approval before coding.
  - PM must expand vague scope such as `where relevant` into explicit section-by-section checklist, or require the worker to do so before coding.
  - Missing a referenced authority section is a failed task, even if some code changes are correct.
  - Post-implementation review must include active runtime path proof, duplicate/stale path check, build/install freshness proof, forbidden-scope confirmation, and cleanup status.
- Files updated:
  - `00_harness/06_templates/tpl_alignment_code_review_gate.md`
  - `00_harness/07_scheduler/WORKER_LOOP.md`
  - `00_harness/07_scheduler/PM_LOOP.md`
- Impact: Applies immediately to PP / Wewe / any future implementation worker.

# DEC-20260721-001 - Task board sweep, QA model change, and MinSpec 21.2 record correction

- Date: 2026-07-21
- Owner: feibo (CTO) / approved by Ant
- Trigger: Ant directive "任务要关掉，文件信息要对齐" after weekend off-harness work made most board entries stale.
- Decision:
  - Agent QA is discontinued. Ant's own real-device / browser testing is the only acceptance gate. Dev deliverables should be screenshots/comparison images, not text claims.
  - Task board swept: 34 historical tasks closed (closed-done / closed-superseded / closed-cancelled) and archived to 02_planning/task_board_archive_20260715_20260721.md with a one-line reason ledger on the active board.
  - MinSpec section 21.2 row 4 (BacklogScreen "已通过") is a falsified record: Ant 07-20 real-device retest still shows last-line clipping. Row corrected in authority/ui/XoXo_UI_Final_MinSpec_20260712.md; rework tracked as TASK-20260721-002. MANIFEST hash updated in the same commit per authority iron rule 2.
  - Confirmed still-open items re-verified in code before keeping: TASK-20260719-016 locked-title privacy NOT fixed (ChapterScreen.kt renders real title when locked); icon V4 safezone IS integrated (res hash matches package); gradlew does not exist (0717-004 cancelled).
- Files updated: 02_planning/task_board.md, 02_planning/task_board_archive_20260715_20260721.md, 02_planning/current_priorities.md, authority/ui/XoXo_UI_Final_MinSpec_20260712.md, authority/MANIFEST.md, TASKS.md
- Cleanup status: none (archive only, no deletion).

# DEC-20260721-002 - Harness rules v2 reset (lightweight)

- Date: 2026-07-21
- Owner: feibo (CTO) / directed by Ant
- Trigger: Ant directive: clean slate — drop all historical baggage, work only from current authority versions and current state; old harness/loop rules must be cleared and replaced with lightweight rules before any dev work.
- Decision:
  - Harness v1 retired entirely: role handbooks (00_project), shift handoffs (03_handoffs), PM inbox/outbox mailbox (04_execution), templates (06_templates), loop/scheduler (07_scheduler), governance inbox, PM sync/status files, separate current_priorities file. All archived to 99_archive/harness_v1_retired_20260721/ read-only.
  - New single rulebook: 00_harness/README.md (roles, four ledgers, task lifecycle, session startup, commit rules, red lines). Priorities folded into task_board.
  - Four ledgers only: authority/ (MANIFEST), task_board.md, decision_log.md, 05_reports/<task-id>/ evidence. Process chatter lives in commit messages, never in new files.
  - No new dev_reply / status / PM_REVIEW / TASK_TO_* files may be created.
  - History is not to be relitigated: archives and old handoff/design process files are read-only and carry no authority.
- Files updated: 00_harness/README.md (rewritten), README_AI.md, TASKS.md (rewritten slim), 02_planning/task_board.md, PROJECT_STRUCTURE.md
- Cleanup status: archive-only moves, no deletion.

# DEC-20260721-003 - PM role reinstated within rules v2

- Date: 2026-07-21
- Owner: Ant (directive) / feibo (implementation)
- Decision:
  - PM 一一 is reinstated as an in-rules executor: task board operations (open/update/close ledger), dispatching to workers, evidence collection, routine review, priorities sync.
  - feibo (CTO) narrows to top-level only: rules, architecture, major reviews, infrastructure tooling. No day-to-day board ops.
  - PM is fully bound by rules v2: works only inside the four ledgers; may not create process files (no task sheets, dev replies, review files); v1 PM workflows in 99_archive stay retired.
  - Board reassignments: TASK-20260721-003 (V3_1 audit) -> PM 一一 exec / feibo guide; TASK-20260719-004 (code health) -> PP exec / feibo gate.
- Files updated: 00_harness/README.md, README_AI.md, 02_planning/task_board.md
