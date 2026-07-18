# PM Review - TT App Icon Android Launcher Rework v2 Ant Reject

Task: TASK-20260718-007  
Reviewer: PM 一一  
Date: 2026-07-18  
Status: v2 rejected / v3 required

## Reviewed Package

- `design/authority/icon_start_tt/icon/android_launcher_rework_v2/`
- `design/authority/icon_start_tt/icon/android_launcher_rework_v2/previews/launcher_rework_v2_round_first_preview.png`
- `design/authority/icon_start_tt/icon/android_launcher_rework_v2/previews/launcher_rework_v2_squircle_preview.png`
- `design/authority/icon_start_tt/icon/android_launcher_rework_v2/previews/launcher_rework_v2_mask_comparison.png`

## Ant Feedback

Ant大小姐复核 v2 后指出：`launcher_rework_v2_squircle_preview.png` 仍然像原来的 rounded-rect / 方形卡片样子。

PM 判断：

- v2 的 round-first 预览相比 v1 有改善；
- 但 Android launcher 不只有圆形 mask；
- squircle / 圆角方形 mask 下仍明显读成“原卡片被放进 launcher mask”；
- 因此 v2 不能作为完整 Android launcher final 包交给 yiyi。

## PM Decision

继续 rework，要求 TT 输出 `android_launcher_rework_v3/`。

v3 要求：

1. round、squircle、legacy 三种预览都不能读成“原正方形 / 圆角矩形卡片被强行塞进去”。
2. 不能只是 crop 掉边框后又在 squircle 里露出卡片轮廓。
3. 保留第三版人物与浅色 / 金色气质，但 launcher 形状必须从 adaptive icon 的不同 mask 出发重新构图。
4. 可考虑把装饰完全从矩形边框逻辑改成更内聚的圆 / 流线 / 角落小装饰，或让背景 / 人物铺满安全区后只留下非矩形装饰符号。
5. 新包需包含 round / squircle / legacy 预览、mask comparison、adaptive foreground/background、legacy PNG、manifest、self check。
6. 回报里必须单独说明 v3 在 round、squircle、legacy 三种 mask 下如何避免“卡片感”。

## Not Allowed

- 不交 yiyi 接入 v2。
- 不修改 Android / Web / story-data / BG mapping / TT Start / UI authority。
- 不让 yiyi 自行裁图或猜 shape。

## Cleanup Status

No cleanup executed.

旧 `ic_launcher_round.png` 仍保持 cleanup candidate，待最终 icon 包通过并接入验证后处理。
