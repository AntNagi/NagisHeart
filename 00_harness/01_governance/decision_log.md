# 决策记录

> 用途：记录已经拍板、后续所有角色必须遵守的决定。  
> 原则：只追加，不覆盖历史。新记录追加在最上方。

---

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
