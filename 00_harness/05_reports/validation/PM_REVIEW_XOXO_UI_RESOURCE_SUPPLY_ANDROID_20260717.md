# PM Review - XoXo UI Resource Supply For Android

- 时间：2026-07-17
- Reviewer：PM 一一
- 对象任务：`TASK-20260717-006`
- XoXo 回报：`00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_ui_resource_supply_android_20260717.md`
- 资源清单：`assets/ui/android/drawable/ANDROID_DRAWABLE_RESOURCE_MANIFEST_20260717.md`
- 关联裁决：`DEC-20260717-007`

## 结论

PM 复核通过。

XoXo 已完成 UI owner 职责：确认 `assets/ui/android/drawable/` 是当前交给 Android 的 HUD / system icon 权威资源包，并明确 Prologue / Name 背景不需要新增旧 asset path，开发应直接路由到现有 `R.drawable.splash_bg`。

`TASK-20260717-006` 可标记为 done。`TASK-20260717-005` 可从 blocked 改回 ready，交由 yiyi 接入。

## 已核验内容

1. 14 个指定 icon 均存在：`ic_back`、`ic_auto`、`ic_save`、`ic_menu`、`ic_continue`、`ic_settings`、`ic_gallery`、`ic_chapter`、`ic_skip`、`ic_backlog`、`ic_lock`、`ic_line`、`ic_pentagon_ring`、`ic_pentagon_fill`。
2. 14 个资源均为 Android VectorDrawable XML。
3. XoXo 已在 `ANDROID_DRAWABLE_RESOURCE_MANIFEST_20260717.md` 记录 14 个 XML 的 SHA256。
4. 14 个 icon 当前尚未存在于 `android/app/src/main/res/drawable/`，因此 yiyi 需要 copy / wire 到 Android runtime resource 目录。
5. `android/app/src/main/res/drawable-nodpi/splash_bg.png` 存在；旧路径 `android/app/src/main/assets/bg/poster_start_nagis_heart_bg_clean.png` 不存在且不需要新增。
6. App Icon 明确排除；旧 splash / keyart / round icon / raw-contact-sheet 类资源只标记，不删除。

## 给 yiyi 的接入结论

yiyi 可以继续执行 `TASK-20260717-005`：

1. 从 `assets/ui/android/drawable/` copy 14 个 XML 到 `android/app/src/main/res/drawable/`。
2. 保持文件名不变。
3. 确认 `NagiIcon.kt`、`NagiIconButton.kt`、`NagiHud.kt`、`DialogueLayer.kt` 等引用可解析。
4. Prologue / Name 背景改用 `R.drawable.splash_bg`。
5. 不新增旧 asset path。
6. 不替换 App Icon。
7. 不删除旧 splash / keyart / unused resources；清理需另开任务并等待 QA / 视觉验证通过。

## PM 裁决

- `TASK-20260717-006`：done。
- `TASK-20260717-005`：ready，交 yiyi 接入。
