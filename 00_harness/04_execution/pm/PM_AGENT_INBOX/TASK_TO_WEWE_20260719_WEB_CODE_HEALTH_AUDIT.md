# TASK-20260719-005 — Web release-readiness code health audit

To: Wewe
From: PM 一一
Status: queued
Priority: P1
Scope: Web audit-only first

## Why

Web MVP and P1 fixes have moved quickly. Before considering Web ready, PM needs a code-health review to prevent old MVP paths, duplicate UI, or mobile hacks from accumulating into release risk.

## Execution order

Run after the current Web P1 Settings readability / BGM verification task, unless PM explicitly reprioritizes.

## Must read

1. `00_harness/05_reports/validation/PM_RELEASE_READINESS_CODE_REVIEW_PLAN_20260719.md`
2. `00_harness/06_templates/tpl_alignment_code_review_gate.md`
3. `00_harness/08_authority_current/01_product/NagisHeart_PRD_v2_0.md`
4. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
5. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`

## Audit scope

- Web runtime architecture map from start to gameplay to ending/gallery.
- Duplicate or obsolete MVP code still active.
- Mobile viewport / layout fallback risks.
- Save/progress/gallery unlock/BGM implementation risks.
- Native browser behavior risks around audio, localStorage, PWA manifest, favicon/icon paths.
- CSS component token drift from authority.
- Android touched: no.

## Output

Write:
`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_code_health_audit_20260719.md`

Must include:

- architecture map;
- duplicate/stale code table;
- P0/P1/P2 risk table;
- recommended scoped remediation tasks;
- cleanup candidates only;
- no code changed confirmation;
- Android touched: no;
- cleanup status.

## Forbidden

- Do not change code in this audit.
- Do not touch Android.
- Do not modify story-data or authority.
- Do not delete or archive files.
