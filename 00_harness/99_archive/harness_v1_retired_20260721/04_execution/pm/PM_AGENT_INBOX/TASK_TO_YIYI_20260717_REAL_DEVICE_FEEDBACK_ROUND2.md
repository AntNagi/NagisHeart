# Task to yiyi - Real Device Feedback Round 2

## Task

`TASK-20260717-013` - 实机反馈二轮：HUD title chip / 剧情回顾滑动翻页 / 弹窗 authority 视觉回修

## Source

Ant大小姐 2026-07-17 实机复验反馈，截图：

- `C:\Users\admin\Documents\xwechat_files\wxid_rt82bqc8h2wc22_e45b\temp\RWTemp\2026-07\9e20f478899dc29eb19741386f9343c8\878dd5cc7810944bc7226b98bddffca0.jpg`
- `C:\Users\admin\Documents\xwechat_files\wxid_rt82bqc8h2wc22_e45b\temp\RWTemp\2026-07\9e20f478899dc29eb19741386f9343c8\73d05662255c1fc474435fccda9c709b.jpg`
- `C:\Users\admin\Documents\xwechat_files\wxid_rt82bqc8h2wc22_e45b\temp\RWTemp\2026-07\9e20f478899dc29eb19741386f9343c8\fa343e50d2e1de244c504c548e0aebc7.jpg`

User feedback:

1. 标题的背景好像还是没改。
2. 剧情回顾的翻页不需要“上一页 / 下一页”按钮，支持左右滑动前后换页。
3. 弹窗 UI 不对；Ant 记得确认的权威页面不是现在这样。

PM checked authority:

- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`

PM conclusion:

- This is implementation follow-up, not a new XoXo design task.
- Dialog screenshot is too opaque / too heavy compared with confirmed authority. The 80% card opacity from `TASK-20260717-010` was accepted only as a temporary readability workaround; real device review shows it now needs visual correction toward authority.

## Required Work

### A. HUD title chip visibility

Current real-device issue:

- The top title text still appears nearly naked on the BG.
- The title chip backing is not visibly supporting readability.
- Follow-up user feedback expanded this into a UI authority issue: icon buttons, title chip, and action chip need a unified rule on bright backgrounds.

PM update:

- XoXo has been assigned `TASK-20260717-014` to define the full HUD icon/title/action chip readability rule and speaker/name readability rule.
- Until XoXo returns and authority_current is synced, do not invent a new HUD icon/title/action visual system.
- You may continue non-HUD parts of this task, especially story recap swipe and dialog visual correction.

Required:

1. After XoXo `TASK-20260717-014` returns, implement the title/icon/action HUD rule from authority_current.
2. Keep final glass HUD language:
   - height 34;
   - max width around 210dp;
   - cutSmall;
   - light glass background;
   - subtle border;
   - no thick solid button.
3. If true blur is not available, compensate with slightly stronger translucent backing / border / shadow, but do not make it a heavy button.
4. Check the skip/action chip and icon buttons in the same screen so HUD elements feel like one family.

Relevant file likely:

- `android/app/src/main/java/com/antnagi/nagisheart/ui/component/NagiHud.kt`
- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GameScreen.kt`

### A2. Speaker / name readability dependency

New real-device issue:

- Dialogue speaker / name gold is liked by Ant, but becomes hard to read over bright / complex BG.

PM update:

- This is also assigned to XoXo `TASK-20260717-014`.
- Do not change speaker/name color/backing until XoXo returns a synced authority rule.

### B. Story recap page interaction

Current real-device issue:

- Backlog / 剧情回顾 now has page buttons, but Ant does not want visible “上一页 / 下一页” buttons.

Required:

1. Remove visible previous / next text buttons from the story recap page.
2. Support horizontal swipe:
   - swipe left -> next page;
   - swipe right -> previous page.
3. Keep a subtle page indicator such as `3 / 4` if useful.
4. Do not return to vertical scrolling.
5. If accessibility fallback is needed, report it, but do not show large text buttons in the default UI.

Relevant file likely:

- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/BacklogScreen.kt`

### C. Dialog visual correction toward authority

Current real-device issue:

- The skip-confirm dialog screenshot is not visually matching the confirmed authority page.
- It is too opaque / heavy and reads like a large solid modal.

Authority reference:

- `NagisHeart_UI_Authority_XoXo_v1_0.html` skip-confirm page:
  - `.dialog` left/right 30px, top around 236px, padding 40/32/28;
  - light glass / translucent style;
  - not a thick 80% opaque card.
- `XoXo_UI_Final_MinSpec_20260712.md` Section 11:
  - dialog bottom/background: `rgba(27,36,54,0.32)`;
  - border `rgba(255,255,255,0.12)`;
  - blur 20dp;
  - radius 24;
  - scrim `rgba(9,14,24,0.32)`.

Required:

1. Do not reintroduce the old broken `RenderEffect` that blurs the dialog's own text/buttons.
2. Rework the Compose fallback so the dialog visually moves closer to authority:
   - lighter translucent card than current 80%;
   - enough scrim / contrast / text shadow / border to keep readability;
   - no huge solid dark slab.
3. Keep clickability and z-order fix from `TASK-20260717-010`.
4. Return screenshot / explanation. If exact frosted-glass is technically blocked, provide the best fallback and clearly state the limitation.

Relevant file likely:

- `android/app/src/main/java/com/antnagi/nagisheart/ui/component/NagiDialog.kt`

## Out of Scope

Do not include:

- TT Start / App Icon.
- Web work.
- Gradle wrapper.
- story/script rewrites.
- BG mapping changes.
- resource deletion.
- chapter catalog.
- `nagiCall`.

## Deliverable

Write dev reply:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_real_device_feedback_round2_20260717.md`

Include:

1. files changed;
2. implementation details for A/B/C;
3. what could not be made exact because of Compose limitations;
4. build / screenshot status;
5. whether real-device verification is still needed.

## Completion Definition

Task is ready for PM review when:

- title chip backing is visibly present without becoming a heavy button;
- story recap changes pages by horizontal swipe and does not show previous/next text buttons by default;
- dialog no longer looks like the current heavy opaque modal and is closer to confirmed authority while preserving readability/clickability.
