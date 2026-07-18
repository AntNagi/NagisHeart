# PM Review - TT Start v23 Long Screen V2

- 时间：2026-07-17
- Reviewer：PM 一一
- 对象任务：`TASK-20260717-003`
- TT 回报：`00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_tt_start_long_screen_rework_20260717.md`
- V2 包：`design/authority/icon_start_tt/start_long/v2/`
- 关联裁决：`DEC-20260717-006`

## 结论

PM 复核通过，可提交 Ant大小姐做最终视觉确认。

V2 已解决 V1 的核心问题：不再是 1080x1920 中心图上下加毛玻璃 / 模糊延展，而是从 `remeet.jpg` 重新取景形成连续布满屏幕的 1080x2400 全屏构图。

在 Ant大小姐确认前，V2 仍处于 review，不直接交给 yiyi 作为 final Android 长屏资源接入。

## 已核验内容

1. 交付完整性
   - `base/start_clean_remeet_1080x2400_v2.png`
   - `layers/start_title_overlay_v23_1080x2400_v2.svg`
   - `layers/start_button_static_v23_1080x2400_v2.svg`
   - `layers/start_button_breathing_v23_1080x2400_v2.svg`
   - `previews/start_v23_long_static_preview_1080x2400_v2.png`
   - `previews/start_v23_long_phone_frame_preview_v2.png`
   - `SPEC_ADDENDUM_START_LONG_SCREEN_v2_0.md`
   - `MANIFEST_START_LONG_v2.md`
   - `SELF_CHECK_START_LONG_v2.md`
   - `trace/v2_crop_contact_sheet.jpg`

2. 尺寸与分层
   - V2 背景为 1080 x 2400。
   - V2 静态预览为 1080 x 2400。
   - V2 手机框预览为 900 x 1940。
   - 标题、START static、START breathing 三份 SVG 均为 `width="1080" height="2400" viewBox="0 0 1080 2400"`。
   - 三份 SVG 均保留 `translate(0 240)`，与 TT 提供的长屏布局说明一致。

3. 对 Ant 反馈的响应
   - V2 不再使用 V1 的上下毛玻璃 / 灰色模糊带 / 补丁式边缘。
   - V2 从原始 `android/app/src/main/assets/bg/remeet.jpg` 按高度 cover 到 2400px 后裁切，形成连续背景。
   - 画面视觉上已经是完整长屏取景，而不是把旧 9:16 poster 塞进长屏。

4. Android 可执行性
   - 长屏 9:19.5 / 9:20 使用 `design/authority/icon_start_tt/start_long/v2/`。
   - 1080x1920 v23 继续作为 9:16 fallback。
   - 背景、标题 SVG、START SVG 放入同一 1080:2400 design box，共用 transform。
   - START 继续独立层，由 Android native alpha 动画实现 0.68 → 1.00 → 0.68，1.6s 循环。
   - START hit area 为 px `330,1880,420,210`，比例 `0.3056,0.7833,0.3889,0.0875`。

## 需要 Ant大小姐确认的视觉点

- V2 是真全屏裁切构图，但脸部近景更强，标题覆盖在头发区域上方。
- START 位于下巴 / 颈部附近，仍保持开屏海报入口的视觉语言。
- 如果 Ant大小姐确认该近景构图可接受，V2 可作为 Android 长屏 Start preferred asset group。

## PM 裁决

- `TASK-20260717-003` 从 TT rework 交付角度通过 PM review。
- 当前状态应为 `review`，等待 Ant大小姐确认 V2 视觉是否通过。
- 若 Ant 确认通过，PM 再将 V2 交给 yiyi 接入 Android；明确禁止使用 V1 blurred-extension 包作为 final。
- 若 Ant 认为 V2 近景裁切过强，则回派 TT 继续调整 crop / framing，而不是回到 V1 毛玻璃延展。
