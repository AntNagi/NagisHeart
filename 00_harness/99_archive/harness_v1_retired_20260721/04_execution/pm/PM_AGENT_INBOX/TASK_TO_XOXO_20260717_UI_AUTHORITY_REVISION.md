# XoXo Task - UI Authority Candidate Revision

> Sender: PM 一一  
> Receiver: UI designer XoXo  
> Date: 2026-07-17  
> Task ID: `TASK-20260715-001` revision pass  
> Status: revision requested  

## 0. Ant大小姐 Visual Feedback

Ant大小姐 has reviewed `design/NagisHeart_UI_Authority_XoXo_v1_0.html`.

Overall result: most pages pass, with three required revisions.

## 1. Required Revisions

### A. Start / Opening Page

Use TT's Start page direction.

XoXo's UI authority candidate does not need to keep its own opening image / Start visual as an authority page.

Do not fight the TT Start page. Treat TT Start v23 as the Start authority direction for development integration.

Reference:

- `DEC-20260717-001`
- `design/authority/icon_start_tt/TT_Icon_Start_Authority_Spec_v1_0.md`
- `design/authority/icon_start_tt/start/previews/start_v23_phone_frame_preview.png`

### B. Home Page

Remove the top title on the Home page.

Reason from Ant大小姐: the Home title font does not match the TT Start page title font. The Home page should not repeat a mismatched top title.

Keep the rest of the Home page structure unless the title removal creates a spacing issue that needs a minimal alignment adjustment.

### C. Settings Page

Move the small secondary text / value text to the right side of each row.

Ant大小姐 remembers the earlier design placing this text on the right, and this alignment is preferred.

Example values:

- `正常`
- `3`
- `80%`
- `Light / Auto`
- `管理`

Reference screenshot supplied by Ant大小姐:

- `C:/Users/admin/AppData/Local/Temp/codex-clipboard-42b46cbf-a560-44af-8fdb-d7a59b25bc70.png`

## 2. Pages Approved

All other pages in the candidate are approved.

Do not redesign approved pages. Do not reopen broad visual exploration.

## 3. Scope Rules

Do not modify:

- TT Start package
- App Icon assets
- story data
- script text
- Android / Web app code
- chapter catalog
- chapter ending page
- section ending page

Keep chapter catalog, chapter ending page, and section ending page as pending items.

## 4. Required Output

Please update the UI authority candidate and the merge record.

Expected files:

1. `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
2. `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`

After finishing, write status to:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_ui_authority_revision_20260717.md`

Use this format:

```md
# Status - XoXo UI Authority Revision

## Summary

## Changes Made

| File | Change |
|---|---|

## Self Check

| Check | Result | Evidence |
|---|---|---|

## Need PM / Ant Decision

## Remaining Risks
```
