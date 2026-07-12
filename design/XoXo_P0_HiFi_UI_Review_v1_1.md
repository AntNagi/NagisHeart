# Nagi's Heart · XoXo P0 HiFi UI Review v1.1

> Owner: XoXo Design  
> Date: 2026-07-10  
> Based on: `CoCo_to_XoXo_Design_Handoff_v1_0.md`  
> Board: `NagisHeart_P0_HiFi_UI_Board_v1_1.html`  
> Status: Review Draft. Still needs user confirmation before CC treats it as final visual standard.

---

## 1. Handoff Conclusion

CoCo's key warning is valid:

```text
BG Mapping v1.1 is approved.
P0 HiFi UI Board v1.0 is not approved.
CC may use handoff files to build skeleton, but should not treat HiFi v1.0 as final visual restoration target.
```

XoXo therefore created `NagisHeart_P0_HiFi_UI_Board_v1_1.html` as a review iteration, without overwriting CoCo's v1.0 file.

---

## 2. Main Problems Found in v1.0

1. Splash still had `Loading memory...`, but the spec says Splash should only show `Nagi's Heart`.
2. Dialogue HUD used placeholder letters / symbols (`A`, `S`, `≡`, `‹`) instead of real icon language.
3. The glass layer used radial fading, which risked recreating the user's disliked "foggy edge" problem.
4. Choice rows were independent, but the hierarchy felt slightly thin and the touch height was low for Android review.
5. LINE and Chapter were different, but Chapter still needed a stronger memory-track / node-map identity.
6. Gallery exposed `TRUE END`, which conflicts with the requirement not to leak locked endings.

---

## 3. What v1.1 Changes

1. Retitled the board and intro to `v1.1`, explicitly marking it as a review draft.
2. Removed the Splash subtitle so Splash only carries the mark and title.
3. Replaced HUD placeholders with existing SVG icon assets:
   - `ic_back.svg`
   - `ic_auto.svg`
   - `ic_save.svg`
   - `ic_menu.svg`
4. Strengthened Light / Dark glass opacity and added subtle cut-corner borders.
5. Removed radial mask fading from `.soft-field` to avoid misty / blurry edge artifacts.
6. Raised Choice rows to a more Android-safe touch size and added restrained semantic tags: `靠近`, `沉默`, `理解`.
7. Changed LINE bubbles from cut-corner blocks to quiet chat bubbles with directional corner logic.
8. Added a vertical memory track line and locked-node opacity to Chapter Map.
9. Changed Gallery locked cards to avoid leaking ending names.

---

## 4. Current Design Judgment

The direction is closer to Snowlit Rose now:

```text
克制，但不寡淡。
透明，但更可读。
有乙女心跳，但没有粉色手游模板感。
五边形与轻切角更统一。
LINE 和 Chapter 的差异更明确。
```

However, this still should not be handed to CC as a final visual standard before user review.

---

## 5. Next Recommended Steps

1. Ask user to review `NagisHeart_P0_HiFi_UI_Board_v1_1.html`.
2. If v1.1 direction is approved, create matching `NagisHeart_P0_HiFi_UI_Spec_v1_1.md`.
3. Then design four Ending Card directions:
   - TRUE END: 世界第一，与你
   - GOOD END: 那么完美，那么爱你
   - NORMAL END: 普通情侣
   - BAD END: 好麻烦
4. Only after that should CC receive the HiFi board as a visual restoration target.

---

## 6. QA Notes

Static checks passed:

```text
No `Loading memory...` remains.
No old `TRUE END` gallery leak remains.
No `BAD END｜远处的世界第一` UI copy remains.
HUD placeholder letters were removed from Dialogue.
Required HUD SVG icon files exist.
```

Visual screenshot QA was attempted through bundled Playwright, but the local bundled Node package is missing `playwright-core`, so no screenshot artifact was produced in this pass.
