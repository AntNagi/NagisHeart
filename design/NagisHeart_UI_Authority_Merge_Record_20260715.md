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
