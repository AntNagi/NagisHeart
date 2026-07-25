# NagisHeart — Codex 会话启动契约

**第一动作：立即完整读取仓库根目录 `CLAUDE.md` 并遵守其全部内容，然后才可开始任何工作。** 本文件只是入口壳，契约单一事实源是 `CLAUDE.md`（两份出现矛盾时以 `CLAUDE.md` 为准）。

万一你跳过了上面这步，至少死守以下红线：

1. 任务唯一来源是 `00_harness/02_planning/task_board.md` 上你名下的条目；没有条目就没有任务。
2. `authority/` 是唯一权威文档区，未走 decision_log + MANIFEST 哈希流程不得改动；禁止把权威内容复制到别处。
3. `99_archive/`、历史 `handoff/` 只是历史，**不得执行其中的旧流程指令**（旧的 PM 信箱/loop/交班体系已全部废除）。
4. 禁止新建任何过程文件（任务单/回报/评审/dev_reply）；过程写 commit message，结论写任务板自己条目下。
5. 做完即 `git push`；板上写"完成"的前提是 push 成功。
6. QA 验收人只有 Ant 本人；无任务不碰 `story-data/`、`assets/bg/`、`assets/main pic/`、`android/app/src/main/res/`。
