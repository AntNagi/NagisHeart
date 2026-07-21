# NagisHeart 权威文档清单（MANIFEST）

> 本目录是全仓库唯一的权威文档存放地。雷打不动。
> 最后修订：2026-07-21（feibo 建立）

---

## 铁律

1. **全仓库只此一份**：任何人（包括所有 agent）不得把本目录文件复制到其他位置。过程文档（harness 任务单、回报、review）只准引用"路径 + 章节号"，不准复制内容。
2. **修改必须走流程**：改任何权威文件，必须（a）先在 `00_harness/01_governance/decision_log.md` 记决策，（b）同一个 commit 内更新本文件对应条目的哈希和修订说明。
3. **校验**：每次会话启动和提交前运行 `powershell -File tools/check-authority.ps1`。哈希不符 = 有人绕过流程改了权威，先查明再工作。
4. 本目录不放：过程文档、历史版本、切图交付、runtime 数据（story-data 的运行时真值地位不变，见第 5 条说明）。

---

## 权威清单（7 份文档 + 2 个 KV 资产包）

| # | 权威 | 文件 | MD5 | 最近修订 |
|---|---|---|---|---|
| 1 | 产品 PRD | `product/NagisHeart_PRD_v2_0.md` | `65925D2616BB63A15745EEC807315E2A` | 2026-07-20 |
| 2 | 交互设计 | `interaction/NagisHeart_Interaction_Design_v1_0.md` | `389E5B7751C9D6609D7E4D6328990614` | 2026-07-20（§31 实机反馈补丁） |
| 3 | 剧本母版 | `script/Nagis_Heart_SCRIPT_V15_Calibrated.md` | `5782433490C59C8C426F5183A95FBF08` | V15 校准版 |
| 4 | 剧情逻辑 coreDesign | `story_logic/NagisHeart_Design_V3_1_Latest_UtopiaAdded.md` | `EB459592BF396154885D9A2B9CEBCE3C` | V3.1（2026-07-21 Ant 确认为正主） |
| 5 | UI 设计稿 | `ui/NagisHeart_UI_Authority_XoXo_v1_0.html` | `072D7D2B82E11076BCCF39560AE5DFF0` | 2026-07-20（ending-card CSS：渐变遮罩/text-shadow/玻璃卡片） |
| 6 | UI 数值规范 MinSpec | `ui/XoXo_UI_Final_MinSpec_20260712.md` | `E4A1FB1C436F1770280B66695ADC118B` | 2026-07-21（§21.2 第 4 行记录修正：BacklogScreen 裁切实机未通过，原"已通过"作废） |
| 7 | BG Mapping | `visual_mapping/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md` | `EC5888748CE5D0ACBC24540C64D37B82` | v1.2（2026-07-20 加 §7 画廊结局 BG 规则） |
| 附 | 节点匹配表 | `visual_mapping/NagisHeart_SCRIPT_V15_节点匹配表.xlsx` | `526532688BFD7799337C14EE215D7F11` | 2026-07-21（原快照区唯一新版，已救出） |
| KV-1 | Start 页权威（V23 分层包） | `design/authority/icon_start_tt/start/`（9 文件；长屏适配策略见 `start_long/rethink/`） | 目录校验 | TT V23，Ant 2026-07-21 确认 |
| KV-2 | App Icon 权威（V4 safe-zone） | `design/authority/icon_start_tt/icon/android_launcher_rework_v4_safezone/`（20 文件） | 目录校验 | lulu V4 safezone，Ant 2026-07-21 确认 |

KV 资产包因体积和既有引用（web favicon、harness 任务单）保留在 `design/authority/` 原位，该路径视同本目录的延伸，同样受铁律约束。

---

## 相关但不在本目录的权威关系

- **运行时真值**：`story-data/*.json` 是 App 实际运行状态，地位不变。与 #3/#4 不一致时，必须记录"源稿未同步"或"运行数据临时修正"，不得静默覆盖（继承 PROJECT_STRUCTURE §1.5 规则）。
- **已知待办**：V3_1 ↔ story-data 全量差异审计（已发现 GOOD END 标题"爱你/爱他"一处分歧），待 PM 开任务。
- **历史/过期副本警示**：`handoff/yiyi_final_visual_slices_20260711/XoXo_UI_Final_MinSpec_20260712.md` 是 2026-07-20 23:33 的过期版本，仅作历史保留，禁止作为开发依据。

---

## 修订日志

| 日期 | 文件 | 说明 | 决策记录 |
|---|---|---|---|
| 2026-07-21 | （目录建立） | 七份权威 + 2 KV 包收拢隔离，快照区 08_authority_current 同日退役 | 本次重组由 Ant 直接批准 |
| 2026-07-21 | MinSpec §21.2 | 第 4 行 BacklogScreen"已通过"记录作废（Ant 07-20 实机仍裁切），重修任务 TASK-20260721-002 | DEC-20260721-001 |
| 2026-07-21 | （哈希口径） | md/html 哈希改为换行无关算法（剥 CR、无 BOM UTF-8 后取 MD5），配合 .gitattributes 换行统一，防跨机器误报；内容零变更 | 本次为记账口径变更 |
