# PM Dispatch to yiyi - Execute TASK-20260718-006, then TASK-20260718-004

yiyi，PM 一一正式派发当前执行顺序。

## 立即执行：TASK-20260718-006

优先处理 Android 实机功能 P0：

1. opening 背景错：很多章节 / 小节 opening 使用了上一张或默认 Nagi 抱枕背景，而不是即将进入节点 / 当节应有背景。
2. opening 点不动：很多章节开篇页轻触不能继续，卡住流程。
3. BGM 断链：BGM 之前存在，现在实机不播放；PM 静态初判 `scene_visuals.json` 指向 `bgm/bgm.mp3`，但 Android assets 路径下可能缺实际文件或路径映射。

任务单：

`00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_YIYI_20260718_ANDROID_REAL_DEVICE_FUNCTIONAL_BUGS.md`

## 执行限制

006 只修 Android 功能链路，不得混入：

- 004 HUD / Dialog UI 修正
- App Icon
- Web
- story-data 正文
- BG mapping 权威
- TT Start
- 资源清理 / 删除

如果你发现 BG mapping 本身错误，先回报 PM 证据，不要直接改 authority。

## 006 回报要求

完成后回报：

1. 修改文件清单。
2. 根因说明。
3. 验证章节 / 小节 opening 背景是否使用即将进入节点背景。
4. opening 轻触继续是否恢复。
5. BGM 是否在实机可听，使用的实际 Android asset/path 是什么。
6. cleanup status。

## 下一项：TASK-20260718-004

006 回传后，再执行 004 UI 受控修正。

004 差异表 PM 已接受，记录：

`00_harness/05_reports/validation/PM_REVIEW_YIYI_004_DIFF_TABLE_20260718.md`

004 只允许按 diff table 修改：

- `NagiIconButton.kt`
- `NagiDialog.kt`
- `DialogueLayer.kt`
- `BacklogScreen.kt`

004 不得改 title chip / action chip，不得混入 BGM、App Icon、Web、story-data、BG mapping、资源清理。

## 当前暂停项

App Icon launcher rework 暂停，不要接入 TT v1/v2/v3。

原因：v3 虽然解决卡片感，但人物裁切过狠，Ant大小姐未确认。等待后续单独视觉会审。
