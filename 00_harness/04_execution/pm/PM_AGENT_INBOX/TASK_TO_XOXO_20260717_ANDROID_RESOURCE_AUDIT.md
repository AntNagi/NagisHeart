# XoXo Task - Android Resource Audit Against Final UI Authority

> Sender: PM 一一  
> Receiver: UI designer XoXo  
> Date: 2026-07-17  
> Task ID: `TASK-20260717-002`  
> Priority: P0  
> Status: ready  

## 0. PM Decision

Ant大小姐 has confirmed the revised XoXo UI authority candidate as OK.

The final UI authority is now:

- `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
- with Start / opening page using TT Start v23 per `DEC-20260717-001`
- with local UI revisions per `DEC-20260717-002`
- excluding chapter catalog, chapter ending page, and section ending page, which remain pending

## 1. Task Goal

Please audit the Android project's currently used UI resources against the final UI authority.

The goal is not to redesign anything. The goal is to answer:

1. Which Android resources are required by the current final UI authority and are already present?
2. Which required resources are missing from Android?
3. Which Android resources are extra / obsolete / no longer part of the final UI authority?
4. Which resources are present but named, routed, scaled, or used in a way that may cause the implementation to differ from the final UI authority?

## 2. Required Reading

Read these first:

1. `00_harness/01_governance/decision_log.md`
2. `00_harness/02_planning/task_board.md`
3. `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
4. `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`
5. `00_harness/05_reports/validation/PM_REVIEW_XOXO_UI_AUTHORITY_REVISION_20260717.md`
6. `design/authority/icon_start_tt/TT_Icon_Start_Authority_Spec_v1_0.md`
7. yiyi Start integration reply if present: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_start_v23_integration_20260717.md`

## 3. Android Areas To Inspect

Focus on UI resource usage, not code architecture:

- `android/app/src/main/res/`
- `android/app/src/main/assets/`
- `android/app/src/main/java/com/antnagi/nagisheart/ui/`
- Start / Splash / Home / Settings related screen files
- drawable / drawable-nodpi / mipmap resources used by UI screens
- any resource names referenced by Compose code for final UI pages

## 4. Scope

Please check resource consistency for pages that are now accepted in the final UI authority:

- Start / opening poster, via TT Start v23
- Home
- Prologue / opening text page
- Name setup
- Chapter opening
- Section opening
- Dialogue
- Choice
- LINE
- Long narration
- Story recap
- Save
- Gallery
- Settings
- Ending
- Skip confirmation modal

Do not audit or invent resources for:

- chapter catalog
- chapter ending page
- section ending page

Those remain pending.

## 5. Output Required

Write the audit report to:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_android_resource_audit_20260717.md`

Use this format:

```md
# Status - XoXo Android Resource Audit

## Summary

## Required Resources Present

| UI Area | Authority Source | Android Resource / File | Status | Notes |
|---|---|---|---|---|

## Missing Resources

| UI Area | Required Resource | Evidence | Suggested Owner |
|---|---|---|---|

## Extra / Obsolete Android Resources

| Android Resource / File | Why It Looks Extra | Risk | Suggested Action |
|---|---|---|---|

## Mismatched Usage

| UI Area | Android Current Usage | Final Authority Expected | Risk | Suggested Action |
|---|---|---|---|---|

## Need PM / Dev Decision

## Self Check
```

## 6. Rules

- Do not edit Android code in this task.
- Do not delete resources.
- Do not rename resources.
- Do not change TT Start package.
- Do not change final UI authority files unless PM explicitly asks.
- If a resource mismatch requires development work, list it as a finding and suggested owner.
