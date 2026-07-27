# NagisHeart 任务板入口

> 本文件只做导航。正式任务、优先级、关闭台账全部在 `00_harness/02_planning/task_board.md`。

---

## 去哪找什么

| 你要找什么 | 去哪 |
|---|---|
| 开工怎么做、红线、交付纪律 | 根目录 `CLAUDE.md`（Claude 自动注入）／`AGENTS.md`（Codex 侧） |
| 我这个岗位具体怎么干 | `00_harness/roles/`（DEV / QA / PM / DESIGN） |
| 账本在哪、主循环怎么转 | `00_harness/README.md` |
| **唯一落地依据** | `authority/` + `authority/MANIFEST.md` |
| 我的任务 | `00_harness/02_planning/task_board.md` |
| 仓库文件地图 | `PROJECT_STRUCTURE.md` |

## 三条最容易被违反的规则

- **唯一落地依据是 `authority/`**；任务条目只写范围和边界，条目里出现的任何数值都不作数。看不到明确规定的，**报缺失，不许自行发挥**。
- **验收链路**：worker 回报 → PM 查条数/push → QA 取证（只出事实）→ PM 汇总 → **Ant 抽查是唯一验收**。agent 只能报"已改，待验"。
- **过程不落盘**：不写任务单/回报/评审文件；过程写 commit message，结论写任务板自己条目下。

## 不经确认不要碰

`authority/`（改动必须 decision_log + MANIFEST 哈希同步）· `story-data/*.json` · `assets/bg/`、`assets/main pic/` · `android/app/src/main/res/` · 历史 `handoff/` 与 `99_archive/`
