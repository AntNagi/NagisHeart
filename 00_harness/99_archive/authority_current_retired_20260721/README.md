# Nagi's Heart 当前权威候选集

> 建立时间：2026-07-15  
> 维护人：PM 一一  
> 状态：候选快照，等待逐类合并与 Ant大小姐最终确认

## 1. 这个目录的用途

这里集中保存现有文件中每一类最接近权威版本的副本，解决不同电脑、不同 Agent 在多个旧版本之间来回寻找的问题。

本目录当前是只读快照，不是新的编辑源：

- 修改需求先进入 PM；
- PM 在原始源文件中完成更新；
- 核对无误后，再刷新这里的候选副本；
- Worker 不得直接修改本目录中的文件；
- 本目录文件尚未经过 Ant大小姐逐类最终签字，不能把“候选”误称为“最终定稿”。

## 2. 已选文件

| 类别 | 当前候选 | 原始源文件 | 选择理由 |
|---|---|---|---|
| 产品需求 | `01_product/NagisHeart_PRD_v2_0.md` | `design/NagisHeart_PRD_v2_0.md` | 当前项目结构明确指定的 PRD 主文档 |
| 交互设计 | `02_interaction/NagisHeart_Interaction_Design_v1_0.md` | `design/NagisHeart_Interaction_Design_v1_0.md` | 与 PRD v2.0 对应的当前交互主文档 |
| 剧本母版 | `03_script/Nagis_Heart_SCRIPT_V15_Calibrated.md` | `design/Nagis_Heart_SCRIPT_V15_Calibrated.md` | 现有最高版本完整剧本母版 |
| UI 数值主规范 | `04_ui/XoXo_UI_Final_MinSpec_20260712.md` | `handoff/yiyi_final_visual_slices_20260711/XoXo_UI_Final_MinSpec_20260712.md` | 当前最完整的可开发 UI 数值规范 |
| UI 已锁开发规则 | `04_ui/XoXo_Dev_Ready_Spec_20260712.md` | `handoff/yiyi_final_visual_slices_20260711/XoXo_Dev_Ready_Spec_20260712.md` | 记录已明确、不应由开发自行发挥的规则 |
| 剧情内页视觉 | `04_ui/NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` | `design/NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` | 当前剧情内页主视觉参考 |
| 系统页视觉 | `04_ui/NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` | `design/NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` | 当前系统页与缺页设计参考 |
| 长旁白与剧情回顾 | `04_ui/NagisHeart_LongNarration_StoryRecap_Redesign_Lulu_v1_0.html` | `design/NagisHeart_LongNarration_StoryRecap_Redesign_Lulu_v1_0.html` | 仅覆盖长旁白、剧情回顾两个特定页面 |
| 背景与情绪映射 | `05_visual_mapping/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md` | `design/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md` | 文件名虽为 v1.2，正文已累计到 v1.4，是现有最新映射稿 |
| 运行剧情数据 | `06_runtime_story_data/*.json` | `story-data/*.json` | Android 与 Web 当前实际读取的数据集合 |
| 技术架构 | `07_technical/ARCHITECTURE.md` | `design/ARCHITECTURE.md` | 现有较完整的总体架构说明 |
| 项目入口 | `08_project_entry/README_AI.md`、`TASKS.md`、`PROJECT_STRUCTURE.md` | 仓库根目录同名文件 | 当前开工入口、任务板与文件权威索引 |
| 协作制度 | `09_harness_core/*.md` | `00_harness/00_project/*.md` | 当前团队角色边界、工作空间与基础协作规则 |

## 3. 运行剧情数据的有效集合

当前程序实际使用并收入快照的是：

- `nodes.json`
- `flow.json`
- `routers.json`
- `chapters.json`
- `endings.json`
- `variables.json`
- `scene_visuals.json`
- `prologue_short.json`
- `version.json`

`prologue.json` 与 `prologue_full.json` 当前未被 Android/Web 加载，因此没有收入权威候选集。

## 4. 当前优先级

发生冲突时，先按以下顺序判断：

1. Ant大小姐已确认并写入 `00_harness/01_governance/decision_log.md` 的决定；
2. PRD 与交互主文档；
3. 对应页面类型的 UI 主规范和限定范围覆盖稿；
4. 剧本母版与背景映射稿；
5. 当前运行数据；
6. 普通 handoff、阶段汇报、历史设计稿与参考文件。

特殊规则：

- 剧情文案内容以剧本母版为内容源，当前可运行状态以 `story-data` 为事实源；二者冲突必须登记“未同步”，不得静默覆盖。
- `Lulu` 文件只覆盖长旁白与剧情回顾，不扩展到其他页面。
- `XoXo Missing Pages` 负责系统页，`XoXo P0 HiFi v2.0` 负责剧情内页。
- `CoCo_Design_Handoff_20260713.md` 仅保留历史覆盖关系说明，本次不收入主权威候选集。

## 5. 已知未完成事项

- PRD、交互、剧本仍需吸收 Ant大小姐后续实机反馈和已确认决策。
- UI 尚未合成一份单文件权威版，目前仍按页面类型组合读取。
- 剧本母版早于部分 `story-data` 更新，需做逐节点差异核查。
- 当前运行数据仍有 51 处 `{{nagiCall}}` 和 9 处硬编码 `Ant`；这与“不再设置 Nagi 称呼”“一一称呼 Ant 为 Ant大小姐”的已确认规则不一致，必须专项校准。
- 背景映射文件名版本号与正文版本号不一致，后续应统一命名。
- 技术架构文档需要结合当前 Android/Web 实现重新校准后，才能升级为正式权威版。

## 6. 下一步收口顺序

1. 合并产品需求与交互规则，形成确认版 PRD/交互文档；
2. 合并 UI 四个子类型，形成单一 UI 权威规范；
3. 校准剧本母版、背景映射与运行数据；
4. 刷新本目录并由 Ant大小姐逐类确认；
5. 确认后再把本目录状态从“候选快照”改为“当前权威集”。
