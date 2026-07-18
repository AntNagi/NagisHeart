# PM Review - yiyi TASK-20260718-004 Diff Table

Task: TASK-20260718-004  
Reviewer: PM 一一  
Date: 2026-07-18  
Status: diff table accepted / implementation allowed after TASK-20260718-006

## Reviewed File

- `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_004_diff_table_20260718.md`

## PM Findings

yiyi 本轮按 ownership gate 要求先做差异表，没有直接修改代码。流程合格。

差异判断基本成立：

1. HUD icon button 的背景 / 尺寸 / 描边基本对齐 authority section 15.1，主要偏差在 Compose 默认 `shadow(3.dp)` 产生实体 elevation 感，不像 authority 的柔和 drop shadow。
2. Title chip / action chip 当前数值已对齐 section 15.1，不应继续改，避免越修越偏。
3. Dialog 当前误用了 section 11 with-blur token。Android 当前没有真实 background blur，因此应使用 section 16.5 no-real-blur fallback：card 0.56、scrim 0.38、border 0.14、shadow 18dp/0.36、text shadow 0.35/1dp/2dp。
4. Speaker gold 色值和轻衬底基本对齐 section 15.2，但缺 gold halo。
5. 修改范围收敛到 `NagiIconButton.kt`、`NagiDialog.kt`、`DialogueLayer.kt`、`BacklogScreen.kt` 是合理的；不得再扩散到 title/action chip、story-data、BG mapping、TT Start、App Icon、BGM、Web、资源清理。

## Priority Decision

执行顺序：

1. 先处理 `TASK-20260718-006` Android 功能 P0：opening 背景错、opening 点不动、BGM 断链。
2. `TASK-20260718-006` 回传后，再执行 `TASK-20260718-004` UI 受控修正。

理由：006 会阻断 Ant大小姐继续真机验 UI；004 是视觉修正，虽然同为 P0，但必须建立在游戏流程可继续、背景与 BGM 正常的前提上。

## Implementation Permission

PM 同意 yiyi 后续按差异表执行 004，但必须遵守：

- 不改 title chip / action chip。
- 不改 story-data / BG mapping / TT Start / App Icon / BGM / Web / 资源清理。
- 不凭感觉新增 UI 参数；只按 section 15 / 16.5 与本 diff table 修。
- 完成后必须回传 5 个截图验证点：亮背景 HUD、暗背景 HUD、跳过本节 Dialog、亮背景 speaker、复杂背景 speaker。
- 回报必须写明 cleanup status。

## Cleanup Status

None for TASK-20260718-004.
