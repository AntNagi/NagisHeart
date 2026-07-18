# Ant Feedback - TT Start v23 Long Screen V2 Font Issue

- 时间：2026-07-17
- 来源：Ant大小姐视觉反馈
- 关联任务：`TASK-20260717-003`
- 当前候选：`design/authority/icon_start_tt/start_long/v2/`

## 结论

TT Start 长屏 V2 当前不通过，需要回派 TT 继续修改。

V2 的真全屏构图方向比 V1 正确，但它破坏了已确认 Start v23 的字体 / 标题层 / START 字感，同时构图裁切也没有保住 Nagi 下巴。Ant大小姐反馈：“怎么字体全变了！！打回去打回去！”并补充：即便要切原图，也一定要把 Nagi 的下巴展示出来。

## 不通过原因

- 标题 `Nagi's Heart` 的字体观感与已确认 Start v23 不一致。
- `Blue Lock:`、装饰线、小方块、`START`、`Tap to start` 的字感也出现变化。
- 长屏适配不应改变 Start v23 已确认的文字视觉 identity。
- V2 裁切让人物近景关系变了，Nagi 的下巴没有按已确认构图关系展示出来。

## PM 裁决

- `TASK-20260717-003` 回派 TT 继续 rework。
- V2 不交给 yiyi 接入。
- 后续要求是“真全屏构图 + 保持已确认 v23 字体/字感 + 展示 Nagi 下巴”，不是回退到 V1 毛玻璃。

## 新回派任务

详见：

`00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_TT_20260717_START_LONG_SCREEN_V2_FONT_REWORK.md`
