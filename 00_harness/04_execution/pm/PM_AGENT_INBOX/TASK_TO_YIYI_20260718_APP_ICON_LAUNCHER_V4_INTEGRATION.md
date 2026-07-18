# TASK TO YIYI - App Icon launcher V4 integration

Date: 2026-07-18  
PM: 一一  
Owner: yiyi  
Task: `TASK-20260718-008`  
Priority: P1  
Status: ready

---

## 0. Decision

Ant大小姐 has visually confirmed TT App Icon Android launcher rework V4.

Approved source package:

`design/authority/icon_start_tt/icon/android_launcher_rework_v4/`

PM review:

`00_harness/05_reports/validation/PM_REVIEW_TT_APP_ICON_ANDROID_LAUNCHER_REWORK_V4_20260718.md`

TT status:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_tt_app_icon_android_launcher_rework_v4_20260718.md`

Do not use V1 / V2 / V3 launcher rework packages.

---

## 1. Implementation scope

Only integrate the approved V4 launcher assets into Android.

Copy:

1. `design/authority/icon_start_tt/icon/android_launcher_rework_v4/adaptive/<density>/ic_launcher_foreground.png`
   → `android/app/src/main/res/mipmap-<density>/ic_launcher_foreground.png`

2. `design/authority/icon_start_tt/icon/android_launcher_rework_v4/adaptive/<density>/ic_launcher_background.png`
   → `android/app/src/main/res/mipmap-<density>/ic_launcher_background.png`

3. `design/authority/icon_start_tt/icon/android_launcher_rework_v4/legacy/mipmap-<density>/ic_launcher.png`
   → `android/app/src/main/res/mipmap-<density>/ic_launcher.png`

Densities:

- mdpi
- hdpi
- xhdpi
- xxhdpi
- xxxhdpi

Adaptive XML:

- Keep existing `mipmap-anydpi-v26/ic_launcher.xml` and `ic_launcher_round.xml` if they already point to `@mipmap/ic_launcher_foreground` and `@mipmap/ic_launcher_background`.
- Do not manually crop, redraw, or infer launcher shape.

---

## 2. Cleanup

After V4 assets are copied, handle old round PNG fallback:

- old `android/app/src/main/res/mipmap-*/ic_launcher_round.png` should not remain as an active fallback if it can bypass V4 adaptive assets.
- Preferred: delete old density-specific `ic_launcher_round.png` files if adaptive XML is correctly configured for round icon.
- If a PNG round fallback is still required by the current Android setup, report that to PM before generating new PNGs.

Do not delete any TT design package files.

---

## 3. Forbidden scope

Do not modify:

- Start page;
- HUD / Dialog / speaker UI;
- Web;
- story-data;
- BG mapping;
- BGM;
- TT design packages;
- UI authority;
- unrelated cleanup.

---

## 4. Verification / report

Write reply to:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_app_icon_launcher_v4_integration_20260718.md`

Reply must include:

- copied files;
- whether adaptive XML was unchanged or adjusted;
- exact cleanup action for old `ic_launcher_round.png`;
- `git status --short` scope summary;
- build / launcher visual verification status if available;
- cleanup status.
