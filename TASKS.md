# NagisHeart 任务板

> 共享给 PM、一一、XoXo、Claude、Codex 和后续协作者的轻量入口任务板。
> 正式任务、决策和交班以 `00_harness/` 为准；本文件只做根目录快速导航和公司电脑状态提示。

---

## 当前规则

- 每个新会话先读 `README_AI.md`，再读本文件，再读 `PROJECT_STRUCTURE.md`。
- 如果任务涉及 PM 同步、收件箱/发件箱、状态日志、handoff、权威文件或跨 agent 协作，再读 `00_harness/README.md` 和相关 harness 文件。
- 正式任务只以 `00_harness/02_planning/task_board.md` 为准。
- 正式决策只以 `00_harness/01_governance/decision_log.md` 为准。
- 不要默认全仓库扫描；除非任务明确要求审计、找文件或核对全量引用。
- 不要随意移动、删除大素材、历史 handoff 文件夹、`story-data` 或 App 资源。
- 公司电脑当前工作区有大量历史脏改动；不要大范围 stage，不要顺手恢复或删除。

---

## 当前总状态

- `00_harness/` 已经进入仓库，是三端共享协作入口。
- CoCo 已在 harness 名册中停用，不再作为当前有效设计角色承接任务。
- UI 权威合版任务已经正式交给 XoXo，任务单是 `00_harness/04_execution/design/TASK_XOXO_UI_AUTHORITY_MERGE_20260715.md`。
- App Icon 与 Start 页权威候选包任务已经正式交给 TT，任务单是 `00_harness/04_execution/design/TASK_TT_ICON_START_AUTHORITY_20260715.md`。
- 根目录 `docs/` 目前是公司侧历史中间稿/临时文档，未纳入当前正式任务源；不要把它们当最终权威。
- 家里电脑昨晚未 push 的 bug 反馈仍需后续从 harness 或 home sync 中确认。

---

## 正式任务入口

| 任务 | 负责人 | 状态 | 正式文件 |
|---|---|---|---|
| UI 权威候选版严格合版 | XoXo | ready | `00_harness/04_execution/design/TASK_XOXO_UI_AUTHORITY_MERGE_20260715.md` |
| App Icon 与 Start 页权威候选包整理 | TT | ready | `00_harness/04_execution/design/TASK_TT_ICON_START_AUTHORITY_20260715.md` |

查看完整任务板：

```text
00_harness/02_planning/task_board.md
```

---

## 当前有效 UI 决策摘要

正式决策见 `00_harness/01_governance/decision_log.md`。

- UI 权威合版以 `design/NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` 为唯一母版。
- 只从 `design/NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` 拼入已通过页面：主页、开场白、名字设置、大章开始、小节开始、弹窗。
- 不采用 Missing Pages 的大章结束页、小节结束页、长旁白页、剧情回顾页。
- 长旁白与剧情回顾采用 `design/NagisHeart_LongNarration_StoryRecap_Redesign_Lulu_v1_0.html` 的结构，但统一为母版冷色体系。
- XoXo 只做拼接、替换、删减、对齐和结构整理；不得重设计。

---

## 不经确认不要碰

- `story-data/*.json`
- `design/Nagis_Heart_SCRIPT_V15_Calibrated.md`
- `assets/bg/`
- `assets/main pic/`
- `android/app/src/main/res/`
- 历史 `handoff/` 文件夹
- 根目录散落大图
- 当前工作区里已有的大量资源删除和代码脏改动

---

## 公司电脑当前注意事项

- `TASKS.md` 冲突已按 harness-first 规则整理为本文件。
- `README_AI.md`、`PROJECT_STRUCTURE.md`、`00_harness/README.md` 是当前根入口。
- `00_harness/08_authority_current/` 是权威候选快照，只读，不直接编辑。
- 如需兼容旧绝对路径，再运行：

```powershell
powershell -ExecutionPolicy Bypass -File tools/setup-workspace-compat.ps1
```

未确认需要前，不要运行兼容脚本。

---

## 三端同步规则

- 协作记录写入 `00_harness/`。
- 业务权威内容仍保留在仓库对应业务目录。
- 办公室、家里、第三端必须使用同一套文件夹结构、同一套 harness 合约、同一套协作入口。
- 新增任务先入 PM 一一，再写入 harness task board，之后才执行。
