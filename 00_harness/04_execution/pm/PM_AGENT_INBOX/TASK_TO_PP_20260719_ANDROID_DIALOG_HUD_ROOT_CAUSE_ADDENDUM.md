# TASK ADDENDUM TO PP - Android Dialog / HUD Root Cause Findings

- Date: 2026-07-19
- From: PM 一一
- To: Android 开发工程师 PP
- Applies to: `TASK-20260719-002` and later implementation planning
- Status: mandatory pre-read

## Mandatory report to read

Before any further Android UI implementation or audit conclusion, read:

- `00_harness/05_reports/validation/PM_INVESTIGATION_ANDROID_DIALOG_HUD_ROOT_CAUSE_20260719.md`
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 17.2 / 17.3 / 17.6

## PM finding

The repeated Android Dialog/HUD mismatch is not currently explained by missing resources.

PM static inspection found:

1. `NagiDialog.kt` still uses old section 16.5-style implementation:
   - `RoundedCornerShape(24.dp)`;
   - 14% border;
   - rounded-rect shadow.
   This conflicts with section 17.3, which requires cut-corner glass and explicitly prohibits a rounded rectangle line-frame look.

2. `NagiHud.kt` title chip uses weak old values and lacks the full section 17.2 shared glass treatment.

3. `GameScreen.kt` skip/action chip is inline and does not share a single HUD glass component/token.

4. `BacklogScreen.kt` and multiple system screens do not use `NagiHud` for their headers, so navigation can remain inconsistent even if gameplay HUD is changed.

## Required in your next PP audit reply

You must include:

1. Active-path proof:
   - Which component renders the real-device dialog?
   - Which component renders gameplay HUD?
   - Which component renders Backlog / Chapter Catalog / Settings / Save / Gallery headers?

2. Token comparison:
   - current code value;
   - authority section 17 required value;
   - mismatch / match.

3. Build freshness check:
   - rule out stale APK;
   - rule out wrong build variant;
   - rule out device installing old package.

4. Minimal implementation plan:
   - no broad refactor without PM approval;
   - but do identify whether a shared `GlassHud` / `GlassChip` helper is required to stop drift.

## Do not do

- Do not claim the issue is fixed by modifying only `NagiIconButton.kt`.
- Do not keep `NagiDialog.kt` on `RoundedCornerShape(24.dp)` unless you report blocked and get UI/PM approval.
- Do not use screenshots, old handoff files, or archive assets as authority.
- Do not touch Web, TT Start, App Icon, story-data, BG mapping, or archive in this addendum.

## Cleanup status

None. This addendum is audit guidance only.

