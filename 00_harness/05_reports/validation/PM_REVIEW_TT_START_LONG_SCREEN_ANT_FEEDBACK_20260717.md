# Ant Feedback - TT Start v23 Long Screen Preview

- 时间：2026-07-17
- 来源：Ant大小姐实机视觉反馈
- 关联任务：`TASK-20260717-003`
- 当前候选包：`design/authority/icon_start_tt/start_long/`
- 预览：`design/authority/icon_start_tt/start_long/previews/start_v23_long_phone_frame_preview.png`

## 结论

当前 TT Start v23 长屏 v1 预览不通过，不能交给 yiyi 作为 final 长屏资源接入。

PM 之前的结论仅为“技术交付完整，可提交 Ant 实机确认”；Ant 实机确认后，视觉结论为不通过。

## 不通过原因

Ant大小姐要求的是图片布满屏幕的长屏适配，而不是在 1080x1920 图上下添加毛玻璃 / 模糊延展。

当前预览的问题：

- 顶部存在明显灰色模糊带。
- 底部存在明显模糊延展区域。
- 整体观感像 9:16 图片被放进长屏后上下补背景，而不是一张完整的长屏开屏图。

## PM 裁决

- `TASK-20260717-003` 回退给 TT 继续重做 / 优化。
- 当前 `start_long/` v1 包保留为历史候选，不删除。
- yiyi 暂不接入该 v1 长屏包作为 final Android 资源。
- TT 必须输出真正 1080x2400 全屏构图版本，避免毛玻璃补丁感。

## 新回派任务

详见：

`00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_TT_20260717_START_LONG_SCREEN_REWORK.md`
