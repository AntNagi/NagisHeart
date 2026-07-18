# PM Review - XoXo TASK-20260717-014 HUD / Dialogue Readability Authority Patch

Date: 2026-07-17  
Reviewer: PM 一一  
Task: TASK-20260717-014  
Status: passed for implementation

## Conclusion

XoXo 的 `TASK-20260717-014` 回传可以进入开发实现。

本轮 Ant 实机反馈的核心问题是：高亮 / 复杂背景下，顶部 HUD 出现“标题和跳过有 glass backing，但图标按钮裸白线”的不统一状态；底部 speaker/name 的金色方向喜欢，但在复杂背景上可读性不足。

XoXo 已补齐为明确的 UI authority patch，并已同步到 `00_harness/08_authority_current/04_ui/`。

## Verified Authority Sources

- `00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_hud_dialogue_readability_20260717.md`
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 15
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- `00_harness/01_governance/decision_log.md` `DEC-20260717-015`

## PM Acceptance

Accepted for yiyi implementation:

1. HUD icon buttons must no longer be naked white line icons over story backgrounds.
2. Back / auto / save / backlog/menu icons, title chip, and action chip must share one final glass HUD family.
3. Icon button implementation target:
   - 36 x 36 container;
   - 18 x 18 centered icon;
   - light glass backing;
   - 1dp subtle border;
   - blur where possible;
   - fallback as translucent backing + border + shadow.
4. Speaker/name keeps the gold feeling Ant likes, but uses:
   - adjusted gold `#E4CA8F`;
   - small backing only around speaker/name text;
   - gold light border, text shadow, and halo.
5. Do not change this into thick system buttons, solid black/white controls, Material default buttons, full-width black name strips, or heavy name plates.

## Development Follow-up

Create yiyi implementation task:

- `TASK-20260717-015` - Android 接入 XoXo 014 HUD / speaker readability authority patch

This task should not reopen XoXo design unless real-device validation shows the section 15 authority itself is insufficient.

## Out of Scope

- TT Start / App Icon
- Web implementation
- story/script or BG mapping changes
- resource deletion
- chapter catalog
- Gradle wrapper

