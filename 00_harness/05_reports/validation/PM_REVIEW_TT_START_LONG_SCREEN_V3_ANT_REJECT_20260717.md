# Ant Feedback - TT Start v23 Long Screen V3 Rejected

- 时间：2026-07-17
- 来源：Ant大小姐视觉反馈
- 关联任务：`TASK-20260717-003`
- 当前候选：`design/authority/icon_start_tt/start_long/v3/`

## 结论

TT Start 长屏 V3 不通过。

V3 仍然没有保留 Nagi 的下巴。并且当前 rework 方向需要暂停：不能继续把长屏适配理解为“必须重新裁切原图”。

## Ant大小姐反馈

核心反馈：

- “TT 的图，没有保留 Nagi 的下巴。”
- “之前的图只是标题的位置不对而已，长屏幕手机是可以适配的。”
- “主页那张背景图都是能够正常适配我的屏幕的。”
- “让 TT 好好想想。”

## PM 判断

当前问题不是继续微调 V3 裁切，而是要重新论证 Start 长屏适配策略。

V1 的问题是上下毛玻璃 / 模糊补边。
V2 的问题是字体/字感变化，并且人物关系变近。
V3 修回了部分字体，但仍未保留 Nagi 下巴，也没有回答为什么必须裁切。

## PM 裁决

- `TASK-20260717-003` 继续回派 TT。
- V1 / V2 / V3 均不得交给 yiyi 作为 final 长屏资源。
- TT 下一步不是直接产出 V4 裁图，而是先输出“长屏适配策略 rethink”：比较保留原已确认 1080x1920 图的适配方式、扩展画布方式、以及其他可行方式。
- 推荐方向必须解释如何同时做到：适配长屏、不黑条、不毛玻璃敷衍、不裁坏 Nagi 下巴、不改已确认字体/START 视觉。

## 新回派任务

详见：

`00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_TT_20260717_START_LONG_SCREEN_ADAPTATION_RETHINK.md`
