# TASK TO TT - App Icon Android launcher rework V4

Date: 2026-07-18  
PM: 一一  
Owner: TT  
Task: `TASK-20260718-007`
Status: rework

---

## 0. Why this is reopened

Codex token has reset, so PM is reopening the App Icon launcher work with TT.

Current Ant / PM decisions:

1. The confirmed concept is still the third App Icon direction.
2. Do not switch character, do not return to the old icon, do not restart concept exploration.
3. v1 is rejected: it treated the issue like a black-edge/background problem but still looked like a card in a launcher mask.
4. v2 is rejected: round improved, but squircle still looked like the original rounded-rect card forced into a launcher shape.
5. v3 is paused/rejected for current use: it reduced card feel, but the face is cropped too aggressively and the character is not complete enough.

The next version must solve all three at once:

- no black edge;
- no inner square/rounded-rect card boundary under round/squircle masks;
- Nagi face and character relationship must feel complete, not brutally cropped.

---

## 1. Required direction

Produce `android_launcher_rework_v4/`.

Use the confirmed third-version source only as visual DNA:

- `design/authority/icon_start_tt/icon/master/app_icon_tt_candidate_1024.png`
- third version / rounded rect v2 decorated mood

But V4 must be launcher-native artwork, not “put the old square icon into a mask.”

Acceptable direction:

- full-bleed portrait composition;
- soft continuous background that fills the launcher shape;
- no visible inner card frame, no rectangular/squircle plate inside the launcher mask;
- preserve Nagi’s recognizable face, eye, hair, chin/jaw relationship better than v3;
- light/gold decorated mood may remain, but decoration cannot draw a hidden square/card boundary.

---

## 2. Preview requirements before yiyi integration

V4 must include previews that PM/Ant can judge before any Android integration:

1. round launcher preview;
2. squircle launcher preview;
3. legacy square/rounded preview;
4. side-by-side comparison against v1/v2/v3 or at least notes explaining what changed;
5. a small launcher-scale contact sheet so we can see whether it still reads clearly at phone launcher size.

Important: PM will not hand this to yiyi until Ant visually confirms the previews.

---

## 3. Output path

Use:

`design/authority/icon_start_tt/icon/android_launcher_rework_v4/`

Expected content:

- `adaptive/<density>/ic_launcher_foreground.png`
- `adaptive/<density>/ic_launcher_background.png`
- `legacy/mipmap-<density>/ic_launcher.png`
- `previews/...`
- `MANIFEST_ANDROID_LAUNCHER_REWORK_v4_20260718.md`
- `SELF_CHECK_ANDROID_LAUNCHER_REWORK_v4_20260718.md`

Densities:

- mdpi
- hdpi
- xhdpi
- xxhdpi
- xxxhdpi

---

## 4. Hard prohibitions

Do not modify:

- Android code/resources;
- Web;
- story-data;
- BG mapping;
- UI authority;
- TT Start resources;
- archived/rejected launcher packages.

Do not ask yiyi to integrate anything yet.

Do not reuse v1/v2/v3 as final.

---

## 5. Return report

Write PM status to:

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_tt_app_icon_android_launcher_rework_v4_20260718.md`

Report must include:

- V4 package path;
- preview paths;
- exact concept/source continuity statement;
- how V4 avoids black edge;
- how V4 avoids inner card boundary under round/squircle/legacy;
- how V4 preserves more complete Nagi face/character relationship than v3;
- yiyi integration instructions, explicitly marked “only after PM/Ant approval”;
- cleanup candidates, especially old `ic_launcher_round.png`, but do not delete anything.
