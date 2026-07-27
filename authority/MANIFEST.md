# NagisHeart 权威文档清单（MANIFEST）

> 本目录是全仓库唯一的权威文档存放地。雷打不动。
> 最后修订：2026-07-27（存档进度无手动存档空状态；c3 开放日伪选项）

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
| 1 | 产品 PRD | `product/NagisHeart_PRD_v2_0.md` | `18FB495781E060C9EDBA8FA5DB1DD332` | 2026-07-27（§7 / §20.1 / §20.2：继续故事术语、存档进度无手动存档时进入空状态） |
| 2 | 交互设计 | `interaction/NagisHeart_Interaction_Design_v1_0.md` | `9CD72B1FE138C857898F432D954017DE` | 2026-07-27（§2.3 / §3 / §23.3 / §29.2：继续故事术语、存档进度入口空状态行为） |
| 3 | 剧本母版 | `script/Nagis_Heart_SCRIPT_V15_Calibrated.md` | `10CCFBABDE0C637C0B2A8F762B7B2079` | 2026-07-27（修正 c3 开放日伪选项） |
| 4 | 剧情逻辑 coreDesign | `story_logic/NagisHeart_Design_V3_1_Latest_UtopiaAdded.md` | `EB459592BF396154885D9A2B9CEBCE3C` | V3.1（2026-07-21 Ant 确认为正主） |
| 5 | UI 设计稿 | `ui/NagisHeart_UI_Authority_XoXo_v1_0.html` | `CF4D1CE61974F8054E2843CF6B469B4F` | 2026-07-26（合并：§27 地图总览+八章子页 / 剧情回顾页排版重构） |
| 6 | UI 数值规范 MinSpec | `ui/XoXo_UI_Final_MinSpec_20260712.md` | `4B154338C0EC970428A117DB3145E08C` | 2026-07-27（§27.8–§27.16：剧情地图数值 token 补齐——页面骨架 / 节点 / 路径 / 第八章布局 / 总览页 / 未解锁呈现 / SVG 坐标转写授权 / 标题断行表 / 章节文案表；另 §5 / §22.3 存档进度入口与空状态、§14.1 小节开始页托底与 meta 行） |
| 7 | BG Mapping | `visual_mapping/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md` | `9E5235DF786217B31A5E5D358C2A83B3` | 2026-07-23（同步 c2/c2_s2/e_depart 口头指定 BG） |
| 附 | 节点匹配表 | `visual_mapping/NagisHeart_SCRIPT_V15_节点匹配表.xlsx` | `6BD0ED9239E3092593DEFB1106828B66` | 2026-07-23（Ant 的 Antset 列编辑；内容已由 BG Mapping v1.5 消化，本次仅补账登记哈希，见 DEC-20260727-006） |
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
| 2026-07-27 | UI MinSpec §27.8–§27.16 | 剧情地图数值 token 补齐：页面骨架 / 节点（普通节点无卡片底）/ 正交折线路径 / 第八章三路线布局与权威标签 / 总览页 / 未解锁呈现 / 九份 SVG 坐标转写授权 / 标题断行表 8 条 / 章节短标题与副标题表 8 章。焦点由开发逐图调校，不另出 focus map、不重新切图 | DEC-20260727-006 |
| 2026-07-27 | 节点匹配表 xlsx | 补账：Ant 的 Antset 列编辑自 07-23 未登记，check-authority 长期 FAILED；本次仅同步哈希与提交，不改内容 | DEC-20260727-006 |
| 2026-07-27 | UI MinSpec §14.1 | 合并保留小节开始页最新收口：§14.1 仅适用于 Section Opening，废止托底描边，新增章节名 + 小节序号 meta 行；大章开始/结束继续按 §23 分割页口径 | DEC-20260717-013 |
| 2026-07-27 | Script V15 | 修正 `c3 | 开放日` 伪选项：将宿舍回头、床边脸红、离开前想牵手三处线性演出从选项改回旁白；runtime 仅保留更衣室两项真实选择 | DEC-20260727-004 |
| 2026-07-27 | story-data/flow.json | 剧情地图直达第七部 M 线 startNode 时补 default 兜底：`e_agency_launch → e_scarf`、`e_scarf → e_sick_fragile`、`e_sick_fragile → route_love_hidden`；J 线与第八部路线仍由 Android 地图/replay 注入上下文 | DEC-20260727-005 |
| 2026-07-21 | （目录建立） | 七份权威 + 2 KV 包收拢隔离，快照区 08_authority_current 同日退役 | 本次重组由 Ant 直接批准 |
| 2026-07-21 | MinSpec §21.2 | 第 4 行 BacklogScreen"已通过"记录作废（Ant 07-20 实机仍裁切），重修任务 TASK-20260721-002 | DEC-20260721-001 |
| 2026-07-21 | （哈希口径） | md/html 哈希改为换行无关算法（剥 CR、无 BOM UTF-8 后取 MD5），配合 .gitattributes 换行统一，防跨机器误报；内容零变更 | 本次为记账口径变更 |
| 2026-07-21 | UI HTML | 修复因迁入 authority/ui/ 而断链的相对引用（../assets→../../assets、authority/→../../design/authority/、../handoff→../../handoff）；视觉内容零变更。发现 `assets/bg/worldstage.jpg`（结局页 bg）仓库缺失，并入 TASK-20260721-004 | 迁移善后，非设计变更 |
| 2026-07-22 | BG Mapping | 补最终 `end_*` 结局 node BG：TRUE=`true_end`、GOOD=`king`、NORMAL=`ending_true_nagi_soft_gaze`、BAD=`goal_faraway` | DEC-20260722-001 |
| 2026-07-22 | Script V15 | 替换 `c2 | 假期的消息` 为 Ant 新稿；runtime 拆分同步到 `story-data/nodes.json` 的 `c2/c2_s2` | DEC-20260722-002 |
| 2026-07-22 | Script V15 | 替换 `e_invite | 高级公寓的邀请` 为 Ant 新稿；runtime 新增 `e_invite_s2` 承载选项后的共通门禁段 | DEC-20260722-003 |
| 2026-07-23 | Script V15 | 替换 `e_depart | NEL启程·闭关送别` 为 Ant 新稿；runtime 新增 `e_depart_s2/e_depart_s3` 承载两轮选择后的共通送别段 | DEC-20260723-001 |
| 2026-07-23 | Script V15 | 替换 `e_lemontea | 你的，我的` 为 Ant 新稿；runtime 新增 `e_lemontea_s3` 承载第二轮选择后的共通尾声 | DEC-20260723-002 |
| 2026-07-23 | UI HTML + MinSpec §23 | Ant 确认大章开始纯暗底分割页、大章结束弱化分割页、TRUE END 结局页带 `true_end.jpg` 且无 ending-card / 无毛玻璃 / 无边框；开发任务转 Sai | DEC-20260723-006 |
| 2026-07-23 | UI MinSpec §28 + BG Mapping | 同步 Sai Android direct UI adjustments：长旁白软径向托底、选项右半透明渐变、dialogue 上透下稳、画廊结局卡底部 28% 托底与裁剪、Ending BG 按 `end_*` node；`c2/c2_s2/e_depart` BG 指定同步 | DEC-20260723-003 |
| 2026-07-23 | UI HTML | 可视设计稿同步 DEC-20260723-003：dialogue 上透下稳、choice 右半透明渐变、gallery ending card 底部托底与 tag/title 层级、Ending preview 注释 BG 来源 | DEC-20260723-003 |
| 2026-07-23 | Script V15 | `e_agency_launch | 她站在光里` 开头、`发布会安排在东京` 前补 Ant 指定长旁白；runtime 同步插入 `e_agency_launch_intro001-007` | DEC-20260723-004 |
| 2026-07-23 | UI HTML + MinSpec §25 | 回忆画廊改为四结局错落竖图展墙：两列同规格竖卡、一屏完整、无滚动条、GOOD 标题一行；Android 实现任务转 Sai | DEC-20260723-005 |
| 2026-07-24 | UI MinSpec §26 | 剧情回顾对白 excerpt 与旁白区分：对白改 UI sans、轻托底、左侧金线、speaker 来源标记；Android 实现任务转 Sai | DEC-20260724-001 |
| 2026-07-25 | UI HTML + MinSpec §27 + Interaction §32 | 嵌入剧情地图总览与八章 v7 视觉参考；锁定两层地图、64 小节独立节点、点亮 / 无剧透、滚动与 replay；预览图禁止进入 runtime，正式配图必须读取 `startNode → scene_visuals.bg` 并逐图对准 Nagi 脸部 | DEC-20260725-001 |
| 2026-07-25 | UI HTML + MinSpec §27 + Interaction §32 | 旧章节目录独立页面退役；删除 HTML 入口、页面结构与 preset，原系统入口直接进入八章地图总览 | DEC-20260725-002 |
| 2026-07-26 | UI HTML + MinSpec | 剧情回顾页排版重构：废除金色 speaker chip（连续对白下金色降级为背景纹理且无法分组），改为字形+密度+五级间距+对称内缩零装饰方案；`.recap-inner` 78% 压窄改为左右 38（= screenWidth−76，与 §17.4 同口径）。MinSpec §10 排版作废、新增 §24 | DEC-20260726-001 |
| 2026-07-26 | UI MinSpec 编号 | 合并远端时发现 `## 24.` 被双方占用：远端新增「剧情回顾页排版重构」与本地 07-23「Sai Android direct UI adjustments sync」撞号且子节 24.1~24.6 全重叠。远端 §24 为 PP 活跃任务 `TASK-20260726-001` 必读项，保留原号；本地历史段改号为 §28，`decision_log` DEC-20260723-003 与本表 07-23 行引用同步更新 | DEC-20260726-002 |
| 2026-07-27 | PRD + Interaction + MinSpec | 明确主页「存档进度」是手动存档管理入口：无手动存档时仍可点击并进入存档页空状态；不禁用、不无响应、不依赖自动存档；同步清理前文「继续游戏 / 最近自动存档」旧口径，统一为「继续故事 / 默认退出进度」；设计规范补充主页入口状态与存档空状态交付口径 | DEC-20260727-001 |
