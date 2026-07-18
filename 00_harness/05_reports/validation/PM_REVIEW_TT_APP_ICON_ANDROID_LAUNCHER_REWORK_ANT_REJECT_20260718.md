# PM Review - TT App Icon Android Launcher Rework Ant Reject

Task: TASK-20260718-007  
Reviewer: PM 一一  
Date: 2026-07-18  
Status: rejected / rework required

## Ant Feedback

Ant大小姐确认当前 `android_launcher_rework` 预览不能通过。

核心问题不是黑边颜色，而是图标在圆形 launcher mask 下仍然读成“原来的正方形 / 圆角矩形卡片被强行裁进圆里”：

- 外圈不是自然圆形图标；
- 圆形 launcher 内还能看到内层方形/圆角矩形边框；
- 视觉上像把原正方形边强行塞进圆形 mask，而不是为 Android launcher 重新适配过的 icon。

## PM Decision

`design/authority/icon_start_tt/icon/android_launcher_rework/` 不得交给 yiyi 作为 final 接入。

TT 需要重新出一版 round-safe / adaptive-safe icon 包：

1. 保留第三版 icon 的人物与整体气质，不换回旧 icon，不换概念方向。
2. 圆形 launcher mask 下不得出现明显内层正方形/圆角矩形边界。
3. 如果继续保留 decorated / rounded-rect 气质，必须让该形状在圆形 mask 下成为自然装饰，而不是被看成一个方框卡片。
4. 需要同时给出 round、squircle、legacy 三种预览；round 预览必须作为第一验收重点。
5. 新包仍需包含 adaptive foreground/background、legacy PNG、manifest、self check、给 yiyi 的接入口径。
6. yiyi 不得自行修图或猜 shape；必须等 TT 新包经 PM/Ant 视觉确认。

## Cleanup Status

Old `ic_launcher_round.png` 仍是 cleanup candidate，但本轮不执行接入/清理。等 TT 新 rework 包通过并完成 Android 验证后，再删除或重生成旧 round fallback。
