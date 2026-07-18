# PM Review - yiyi Android UI vs Final UI Authority Diff Audit

- 时间：2026-07-17
- Reviewer：PM 一一
- 对象任务：`TASK-20260717-007`
- yiyi 回报：`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_android_ui_authority_diff_audit_20260717.md`

## 结论

PM 复核通过。

yiyi 已完成只读全系统差异审计，且没有修改代码或资源。审计结果足够明确，可以进入下一步最小 P0 修复。

## PM 裁决

### 1. 立即执行 `TASK-20260717-005`

优先级：P0。

执行范围限定为：

1. 将 XoXo 已确认的 14 个 VectorDrawable XML 从 `assets/ui/android/drawable/` 接入到 `android/app/src/main/res/drawable/`。
2. 修复 `PrologueScreen.kt` 和 `NameSetupScreen.kt` 的断链背景路径，改用现有 `R.drawable.splash_bg`。
3. 报告旧 `splash_start.png`、`splash_title.png`、`poster_start_nagis_heart_keyart.jpg` 等资源是否仍有主动引用。

不得做：

- 不替换 App Icon。
- 不删除旧资源。
- 不接入 TT Start 长屏 V1 / V2 / V3。
- 不改 story/script 数据。
- 不处理 chapter catalog / chapter ending / section ending。
- 不把 Home 菜单图标 P1 混进本轮 P0 修复。

### 2. Home 菜单图标作为 P1 后续任务候选

yiyi 审计指出：Home / main menu 当前为文字按钮，final authority 显示 icon + text。此项是可见差异，但不阻塞当前编译恢复。

PM 暂不混入 `TASK-20260717-005`，后续可单独开 P1 UI polish / menu icon wiring 任务。

### 3. `TASK-20260717-004` Gradle wrapper 可并行推进

Gradle wrapper 是 P1 基础设施任务，但它能帮助验证 P0 资源修复。允许与 `TASK-20260717-005` 并行，但不得混入同一提交或同一回报。

### 4. Pending 项保持 pending

- TT Start 长屏：等待 `TASK-20260717-003` 新适配策略，不接 V1/V2/V3。
- App Icon：等待 Ant大小姐最终确认。
- Chapter catalog / chapter ending / section ending：仍不纳入 final UI authority 修复。

## 任务状态裁决

- `TASK-20260717-007`：done。
- `TASK-20260717-005`：ready，立即执行 P0 最小修复。
- `TASK-20260717-004`：ready，可并行。
