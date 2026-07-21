# NagisHeart 任务板入口

> 2026-07-21 清零重启。本文件只做根目录快速导航；正式任务、优先级、关闭台账全部在 `00_harness/02_planning/task_board.md`。

---

## 当前规则（v2，全文见 `00_harness/README.md`）

- 每个新会话：`git pull` → 读 `README_AI.md` → 读 task_board 里自己的条目 → 跑 `tools/check-authority.ps1`。
- 权威文档唯一入口：`authority/`（清单与铁律见 `authority/MANIFEST.md`）。
- QA 口径：agent QA 停用，Ant 本人实机/浏览器测试是唯一验收关口；UI 改动必须交截图证据。
- 过程沟通不落盘：不再写任务单/回报/评审过程文件，commit message 就是过程记录。
- 历史包袱一律不追究：`99_archive/`、历史 `handoff/`、旧 design 过程稿只读，不作为任何依据。

## 不经确认不要碰

- `authority/`（改动必须 decision_log + MANIFEST 哈希同步）
- `story-data/*.json`
- `assets/bg/`、`assets/main pic/`
- `android/app/src/main/res/`
- 历史 `handoff/` 与 `99_archive/`
