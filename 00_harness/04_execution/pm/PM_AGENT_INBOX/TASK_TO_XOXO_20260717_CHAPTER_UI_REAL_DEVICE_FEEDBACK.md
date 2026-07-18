# Task to XoXo - Chapter UI Real Device Feedback

## Task

`TASK-20260717-011` - 实机反馈：章节开始 / 章节结束 / 顶部标题与下一章视觉权威补齐

## Source

Ant大小姐 2026-07-17 实机反馈：

1. 标题和“下一章”没有按 UI 来做。
2. 章节开始的字体没有背景看不清楚，需要加一个很浅的透明背景托一下。
3. 章节结束页看起来没有按 UI 做。

Reference screenshots from Ant real-device test:

- `C:\Users\admin\Documents\xwechat_files\wxid_rt82bqc8h2wc22_e45b\temp\RWTemp\2026-07\9e20f478899dc29eb19741386f9343c8\1ad027efe0a11740e42bb032d2dd32d9.jpg`
- `C:\Users\admin\Documents\xwechat_files\wxid_rt82bqc8h2wc22_e45b\temp\RWTemp\2026-07\9e20f478899dc29eb19741386f9343c8\5ced00a743a86bb6a6175829741e1e56.jpg`
- `C:\Users\admin\Documents\xwechat_files\wxid_rt82bqc8h2wc22_e45b\temp\RWTemp\2026-07\9e20f478899dc29eb19741386f9343c8\09b01f6ec477727f44c4c7fa29f4def1.jpg`

Current authority context:

- Final UI authority: `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
- Merge record: `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- Current min spec: `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
- Historical missing-pages preview may be used only as reference, not blindly treated as final: `design/NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html`

## Required Work

### A. Chapter opening readability

Ant confirms the current chapter opening text is hard to read over the background.

Required:

1. Add / specify a very light transparent backing behind the chapter opening text group.
2. Keep it subtle: it should support readability, not become a heavy modal card.
3. Specify placement, opacity, blur / glass treatment if any, padding, corner radius, and text color.
4. Ensure the treatment works on dark chapter backgrounds and long phone screens.

### B. Chapter ending / chapter clear page

The current real-device chapter ending page does not match the expected UI direction.

Required:

1. Decide whether to adopt, revise, or replace the previous Missing Pages chapter ending direction.
2. Produce a concrete visual spec for:
   - `CHAPTER CLEAR` / section label;
   - chapter title typography and line breaks;
   - body copy;
   - `返回目录`;
   - `继续下一章` / next-section action.
3. Clarify spacing and safe area for long-phone screens.
4. Make the result directly implementable by yiyi.

### C. Top title / next action style

Real-device screenshots show title chips and next/skip action chips that do not feel aligned with final UI.

Required:

1. Reconfirm the final style for the in-game top chapter title chip.
2. Reconfirm the final style for top/right action chips such as skip / next chapter when present.
3. Specify whether these should use the final glass HUD language, icon treatment, text opacity, and right-side alignment.

## Out of Scope

Do not change:

- Android code.
- story/script content.
- scene BG mapping.
- TT Start / App Icon.
- resource deletion.
- long-screen Start adaptation.

## Deliverables

Return a design reply to PM with:

1. Updated visual decision for chapter opening backing.
2. Updated visual decision for chapter ending / chapter clear.
3. Updated visual decision for title / next action chips.
4. File list changed.
5. A short implementation note for yiyi.
6. Whether any authority HTML / spec file was updated.

## Completion Definition

This task is complete when yiyi can implement the chapter opening / chapter ending / title-next styling without guessing or inventing visual rules.
