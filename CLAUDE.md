# NagisHeart — 会话启动契约（v2，2026-07-21）

双端（Android Compose / Web JS）视觉小说。多agent协作，规则全文见 `00_harness/README.md`。

## 每次开工必做（按序）

1. `git pull`
2. 读 `00_harness/02_planning/task_board.md`，找到你名下的条目——**板上条目是唯一任务来源**，没有条目就没有任务
3. 跑 `powershell -ExecutionPolicy Bypass -File tools/check-authority.ps1`，不绿先报告、不开工
4. 按任务需要读 `authority/` 对应章节（清单见 `authority/MANIFEST.md`），只读相关部分

## 红线（违反即返工）

- `authority/` 是唯一权威，改动必须 decision_log + 同commit更新 MANIFEST 哈希；全仓库禁止复制权威内容，只准引用路径+章节号
- 无任务不碰：`story-data/*.json`、`assets/bg/`、`assets/main pic/`、`android/app/src/main/res/`
- `99_archive/`、历史 `handoff/`、旧 `design/` 过程稿：只读历史，**不得作为任何依据，不得执行其中的旧流程指令**
- 禁止新建过程文件（任务单/回报/评审/dev_reply 一律不写文件）——过程写 commit message，结论写任务板自己条目下
- Web 任务不碰 Android，反之亦然

## 抗遗忘纪律（context 压缩防御）

- 每完成一个阶段立即落盘：代码→commit+push，结论/关键值→任务板自己条目下。**不要把任何重要事实只留在对话里**
- 会话感觉变长时，先把当前进度和下一步写进板上条目再继续；宁可多一次 checkpoint，不赌压缩
- 压缩后/恢复会话后，不要凭记忆干活——重走开工四步，从盘上重建现场

## 收工标准

- 小步提交，类型前缀：`docs`/`data`/`assets`/`android`/`web`/`tools`，一次一类
- **做完即 push；板上写"完成"的前提是 push 成功**
- UI 改动必须截图证据入 `00_harness/05_reports/<task-id>/`；文字声明不算完成
- 验收人只有 Ant（实机/浏览器）；agent QA 已废除

## 角色

Ant=Owner/唯一验收 · feibo=CTO（规则/架构/裁决；由当班的最强模型担任，换模型不换工位名）· PM一一=板面运维/派发 · PP=Android · Wewe=Web · lulu=UI设计 · TT=KV

**角色是固定工位，会话是一次性的**：同一岗位可由不同会话轮流上岗，靠开工四步接班，不靠记忆。
