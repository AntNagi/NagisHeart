# NagisHeart 任务板

> 共享给 PM、一一、XoXo、Claude、Codex 和后续协作者的轻量入口任务板。
> 正式任务、决策和交班以 `00_harness/` 为准；本文件只做根目录快速导航和公司电脑状态提示。

---

## 当前规则

- 每个新会话先读 `README_AI.md`，再读本文件，再读 `PROJECT_STRUCTURE.md`，再读 `authority/MANIFEST.md` 并运行 `tools/check-authority.ps1`。
- 权威文档唯一入口是根目录 `authority/`（KV 资产包在 `design/authority/icon_start_tt/`）。旧的 `00_harness/08_authority_current/` 快照已于 2026-07-21 退役，任何指向它的旧路径一律以 `authority/` 为准。
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

正式任务只看 `00_harness/02_planning/task_board.md`（2026-07-21 已大扫除：只保留活跃任务 + 关闭台账；历史任务见 `task_board_archive_20260715_20260721.md`）。

QA 口径（2026-07-21 起）：agent QA 停用，Ant 本人实机/浏览器测试是唯一验收关口。

---

## 当前有效 UI 决策摘要

正式决策见 `00_harness/01_governance/decision_log.md`。

- UI 合版已完成：当前 UI 设计权威是 `authority/ui/NagisHeart_UI_Authority_XoXo_v1_0.html`，数值权威是 `authority/ui/XoXo_UI_Final_MinSpec_20260712.md`。
- Start 页权威是 TT V23（`design/authority/icon_start_tt/start/`）；App Icon 权威是 V4 safe-zone（`design/authority/icon_start_tt/icon/android_launcher_rework_v4_safezone/`）。
- 上述及全部权威清单以 `authority/MANIFEST.md` 为准；历史合版来源文件（P0 HiFi v2_0、Missing Pages、Lulu 长旁白稿）仅作追溯。

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
- `README_AI.md`、`PROJECT_STRUCTURE.md`、`00_harness/README.md`、`authority/MANIFEST.md` 是当前根入口。
- `00_harness/08_authority_current/` 快照机制已于 2026-07-21 退役（副本漂移），权威只读 `authority/`。
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
# Current PM Staffing Override - 2026-07-18

- `yiyi` is inactive / 离职. No new work should be assigned to yiyi.
- `PP` is the current Android developer replacing yiyi.
- `DeDe` is the current Codex-side QA owner. DeDe should test through Harness / Loop, write reports to PM outbox, and not modify code.
- `Wewe` remains Web developer; Web-only scope.
- Formal tasks are tracked in `00_harness/02_planning/task_board.md`.

---
