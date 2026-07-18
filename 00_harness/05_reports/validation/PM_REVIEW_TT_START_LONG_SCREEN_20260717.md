# PM Review - TT Start v23 Long Screen Adaptation

- 时间：2026-07-17
- Reviewer：PM 一一
- 对象任务：`TASK-20260717-003`
- TT 回报：`00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_tt_start_long_screen_20260717.md`
- 候选包：`design/authority/icon_start_tt/start_long/`

## 结论

PM 复核通过，可提交 Ant大小姐进行长屏实机视觉确认。

本轮不直接提升为最终 long-screen authority；最终接入 Android 前仍需 Ant大小姐确认 1080x2400 预览在现代长屏手机上的观感，尤其是上下柔化延展区域是否自然。

## 已核验内容

1. 交付完整性
   - `base/start_clean_remeet_1080x2400_long.png`
   - `layers/start_title_overlay_v23_1080x2400.svg`
   - `layers/start_button_static_v23_1080x2400.svg`
   - `layers/start_button_breathing_v23_1080x2400.svg`
   - `previews/start_v23_long_static_preview_1080x2400.png`
   - `previews/start_v23_long_phone_frame_preview.png`
   - `SPEC_ADDENDUM_START_LONG_SCREEN_v1_0.md`
   - `MANIFEST_START_LONG.md`
   - `SELF_CHECK_START_LONG.md`

2. 尺寸与画布
   - 长屏底图为 1080 x 2400。
   - 长屏静态预览为 1080 x 2400。
   - 手机框预览存在，可用于快速视觉确认。
   - 三个 SVG 分层文件均声明 `width="1080" height="2400" viewBox="0 0 1080 2400"`。

3. 与已确认 Start v23 的关系
   - 原 1080 x 1920 v23 视觉区域保持不缩放、不裁切。
   - 原区域整体放置到 `x=0, y=240`。
   - 标题、Nagi 脸部焦点、START 的相对关系保持已确认版。
   - 新增上下区域是柔化延展，不是黑条，也不是裁切后重排。

4. Android 可执行性
   - TT 明确推荐 1080 x 2400 作为现代 9:19.5 / 9:20 长屏资源组。
   - 1080 x 1920 v23 继续作为 9:16 fallback。
   - Android 实现说明明确：背景、标题 SVG、START SVG 放在同一 1080:2400 design box 内 full-bounds 绘制。
   - START 继续作为独立层，由原生 alpha 动画实现 0.68 → 1.00 → 0.68、1.6s 循环。
   - START hit area 更新为 px `330,1880,420,210`，比例 `0.3056,0.7833,0.3889,0.0875`。

## 非阻塞备注

- `MANIFEST_START_LONG.md` 的表格列出 8 个内容文件，未把 manifest 文件自身列入表格；TT 回报的“包内 9 个文件”与实际目录一致，此项不影响交付。
- 预览中上、下柔化延展区域可见，这是本方案避免黑条的核心处理；需要 Ant大小姐在实机上确认其氛围是否自然。

## PM 裁决

- `TASK-20260717-003` 从 TT 交付角度通过 PM review。
- 当前状态应为 `review`：等待 Ant大小姐确认是否接受 1080x2400 长屏 Start 作为 Android 长屏权威资源。
- 在 Ant 确认前，yiyi 不应擅自把该长屏包替换为 final Android 资源。
- 若 Ant 确认通过，下一步交给 yiyi 接入 `start_long/` 资源组，并保留 1080x1920 作为 9:16 fallback。
- 若 Ant 认为柔化延展不自然，应回派 TT 调整长屏延展策略，而不是让开发裁切 1080x1920。
