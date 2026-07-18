# PM Reply to yiyi - TASK-20260718-004 Diff Table / TASK-20260718-006 Priority

yiyi，PM 一一已复核 `TASK-20260718-004` 差异表：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_004_diff_table_20260718.md`

结论：差异表接受，流程合格。你本轮先做 diff table、不直接动代码，是正确执行 ownership gate。

## 004 复核结论

PM 同意你的主要判断：

1. `NagiIconButton` 数值大体对齐，问题重点是 Compose 默认 `shadow(3.dp)` 产生实体 elevation 感，不像 authority 的柔和 drop shadow。
2. `NagiDialog` 当前误用了 section 11 with-blur token；Android 当前无真实 background blur 时必须走 section 16.5 no-real-blur fallback。
3. Dialog text shadow 当前过重，应收回 section 16.5。
4. Speaker gold 色值与轻衬底方向对，但缺 gold halo。
5. Title chip / action chip 当前数值已对齐，不改。

## 优先级裁决

先执行 `TASK-20260718-006`。

原因：opening 背景错、opening 点不动、BGM 断链会阻断 Ant大小姐继续真机验收；功能流程必须先恢复。

执行顺序：

1. `TASK-20260718-006` Android 功能 P0：opening 背景错 / opening 点不动 / BGM 断链。
2. 006 回传后，再执行 `TASK-20260718-004` UI 受控修正。

## 004 后续允许范围

006 完成后，004 只允许按 diff table 修改：

- `NagiIconButton.kt`
- `NagiDialog.kt`
- `DialogueLayer.kt`
- `BacklogScreen.kt`

不得修改：

- title chip / action chip
- story-data
- BG mapping
- TT Start
- App Icon
- BGM
- Web
- 资源清理 / 删除

完成 004 后必须回传 5 个截图验证点：

1. 亮背景 HUD
2. 暗背景 HUD
3. 跳过本节 Dialog
4. 亮背景 speaker
5. 复杂背景 speaker

回报必须写明 cleanup status。

PM review 记录：

`00_harness/05_reports/validation/PM_REVIEW_YIYI_004_DIFF_TABLE_20260718.md`
