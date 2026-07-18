# PM Review - TT App Icon Android Launcher Rework

Task: TASK-20260718-007  
Reviewer: PM 一一  
Date: 2026-07-18  
Status: PM static pass / waiting Ant visual confirmation

## Review Scope

TT 回传包：

- `design/authority/icon_start_tt/icon/android_launcher_rework/`
- `design/authority/icon_start_tt/icon/android_launcher_rework/MANIFEST_ANDROID_LAUNCHER_REWORK_20260718.md`
- `design/authority/icon_start_tt/icon/android_launcher_rework/SELF_CHECK_ANDROID_LAUNCHER_REWORK_20260718.md`
- `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_tt_app_icon_android_launcher_edge_rework_20260718.md`

核心预览：

- `design/authority/icon_start_tt/icon/android_launcher_rework/previews/launcher_rework_mask_comparison.png`
- `design/authority/icon_start_tt/icon/android_launcher_rework/previews/launcher_rework_round_mask_preview.png`
- `design/authority/icon_start_tt/icon/android_launcher_rework/previews/launcher_rework_squircle_mask_preview.png`

## PM Findings

1. 设计概念未被推翻：仍保留 Ant大小姐确认的第三版 App Icon，来源为 `design/authority/icon_start_tt/icon/master/app_icon_tt_candidate_1024.png`，即 rounded rect v2 decorated / 右上 rounded rect mask preview 方向。
2. 本包只处理 Android launcher mask 适配问题：adaptive background 改为不透明浅色 mist/cream 安全底，foreground 主体放大，legacy PNG 压平成安全底。
3. 包完整性通过：5 个密度的 adaptive foreground/background、5 个密度 legacy `ic_launcher.png`、round/squircle/comparison 预览、manifest 与 self check 均存在。
4. PM 静态判断：该方向比当前实机黑圈/黑边 fallback 更安全，符合“不换 icon 概念，只修 Android launcher 适配”的裁决。

## Decision

PM static pass, but do not send to yiyi as implementation final until Ant大小姐 visually confirms the new previews.

If Ant confirms:

1. yiyi copies the new adaptive foreground/background into matching Android `mipmap-*` directories.
2. yiyi copies the new legacy `ic_launcher.png` into matching Android `mipmap-*` directories.
3. existing adaptive XML may remain if it already points to `@mipmap/ic_launcher_foreground` and `@mipmap/ic_launcher_background`.
4. old density-specific `ic_launcher_round.png` must be deleted or regenerated from this safe package after integration verification; do not keep stale old round fallback.

## Not Allowed

- Do not change App Icon concept.
- Do not replace the character image.
- Do not modify Start, HUD, Dialog, story-data, BG mapping, Web, or Android business code in this design package.
- Do not allow yiyi to improvise launcher shape/color outside this package.

## Cleanup Status

Cleanup candidate confirmed:

- `android/app/src/main/res/mipmap-*/ic_launcher_round.png`

Action is deferred until Ant confirms this rework package and yiyi integration is ready. Keeping the old round PNG after integration may reintroduce the black-edge/black-block launcher fallback.
