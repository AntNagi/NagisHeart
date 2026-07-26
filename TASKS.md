# NagisHeart 任务板入口

> 2026-07-21 清零重启。本文件只做根目录快速导航；正式任务、优先级、关闭台账全部在 `00_harness/02_planning/task_board.md`。

---

## 当前规则（v2，全文见 `00_harness/README.md`）

- 每个新会话：`git pull` → 读 `README_AI.md` → 读 task_board 里自己的条目 → 跑 `tools/check-authority.ps1`。
- 权威文档唯一入口：`authority/`（清单与铁律见 `authority/MANIFEST.md`）。
- QA 口径：agent QA 停用，Ant 本人实机/浏览器测试是唯一验收关口；UI 改动必须交截图证据。
- 过程沟通不落盘：不再写任务单/回报/评审过程文件，commit message 就是过程记录。
- 历史包袱一律不追究：`99_archive/`、历史 `handoff/`、旧 design 过程稿只读，不作为任何依据。

## 当前新增任务

- `TASK-20260724-001`：Sai 实现 Android 剧情回顾对白块视觉区分。以 `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` section 26 为准；旁白继续 serif，角色对白 excerpt 改为 UI sans + 轻托底 + 左侧金线 + speaker 来源标记；不改剧情正文、回顾分页逻辑、章节地图、回忆画廊、BG mapping、Web、TT Start、App Icon 或资源删除。
- `TASK-20260723-004`：Sai 实现 Android 回忆画廊四结局错落竖图展墙。以 `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` section 25 与 `authority/ui/NagisHeart_UI_Authority_XoXo_v1_0.html` 的 `screen-gallery` 为准；四张结局竖图一屏完整展示、两列错落、无滚动条、GOOD 标题一行；不改剧情、BG mapping、Web、TT Start、App Icon 或资源删除。
- `TASK-20260723-002`：Sai 实现 Android 三个 UI authority 页面：大章开始 / 大章结束 / 结局页。以 `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` section 23 与 `authority/ui/NagisHeart_UI_Authority_XoXo_v1_0.html` 为准；不改剧情、BG mapping、Web、TT Start、App Icon 或资源删除。

## 不经确认不要碰

- `authority/`（改动必须 decision_log + MANIFEST 哈希同步）
- `story-data/*.json`
- `assets/bg/`、`assets/main pic/`
- `android/app/src/main/res/`
- 历史 `handoff/` 与 `99_archive/`
