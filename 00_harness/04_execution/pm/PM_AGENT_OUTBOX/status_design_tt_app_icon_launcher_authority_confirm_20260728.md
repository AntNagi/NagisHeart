# TT Status - App Icon / Android Launcher Authority Confirmation

Task: App Icon / launcher resource ownership confirmation  
Owner: TT / Graphic Design  
Date: 2026-07-28  
Status: review  
Scope: design / authority judgment only; no Android code or runtime resource changes performed.

## 1. Current Final App Icon Authority

Final App Icon authority should be:

`design/authority/icon_start_tt/icon/android_launcher_rework_v4_safezone/`

Reason:

- Root authority manifest records KV-2 as `App Icon 权威（V4 safe-zone）`.
- `00_harness/08_authority_current/README.md` also states the current KV asset package is Start V23 + Icon V4 safezone, while warning that the old `08_authority_current` snapshot itself is retired.
- Earlier `android_launcher_rework_v4/` remains an important TT manifest-backed candidate, but it is superseded by the later safezone authority registration.
- Current Android runtime icon hashes do not match v4_safezone / v4 / old android_mipmap, so the current runtime state is mixed and should not be submitted as-is.

Authority reference:

- `authority/MANIFEST.md` KV-2:
  - `design/authority/icon_start_tt/icon/android_launcher_rework_v4_safezone/`
  - noted as `lulu V4 safezone, Ant 2026-07-21 确认`

## 2. Which Icon Assets Should Enter Android Runtime

Android runtime should receive one clean, standard-named set from the final authority package, not multiple competing names.

Use from:

`design/authority/icon_start_tt/icon/android_launcher_rework_v4_safezone/`

Required runtime mapping:

| Authority asset | Android target | Decision |
|---|---|---|
| `adaptive/<density>/ic_launcher_foreground.png` | `android/app/src/main/res/mipmap-<density>/ic_launcher_foreground.png` | yes, official adaptive foreground |
| `adaptive/<density>/ic_launcher_background.png` | `android/app/src/main/res/mipmap-<density>/ic_launcher_background.png` | yes, official adaptive background |
| `legacy/mipmap-<density>/ic_launcher.png` | `android/app/src/main/res/mipmap-<density>/ic_launcher.png` | yes, legacy / fallback icon |
| `previews/*.png` | no runtime target | design review only |
| `master_foreground_1080.png` | no runtime target | design/source reference only |

Do not place `safezone` in runtime resource names. The runtime should use the canonical Android names `ic_launcher`, `ic_launcher_foreground`, and `ic_launcher_background`.

## 3. Adaptive XML Route

Keep / restore adaptive XML routing.

The deleted files should not be treated as approved removal:

- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml`

Recommended target:

- `AndroidManifest.xml` may continue to use:
  - `android:icon="@mipmap/ic_launcher"`
  - `android:roundIcon="@mipmap/ic_launcher_round"`
- `mipmap-anydpi-v26/ic_launcher.xml` should route to:
  - `@mipmap/ic_launcher_background`
  - `@mipmap/ic_launcher_foreground`
- `mipmap-anydpi-v26/ic_launcher_round.xml` should route to the same approved foreground/background unless PP has a platform-specific reason to provide a separate approved round fallback.

Rationale:

- Adaptive XML is the correct Android launcher path for API 26+.
- Removing the XML route increases fallback ambiguity and can expose stale density PNGs.
- The authority package provides foreground/background specifically for adaptive use.

## 4. Untracked `safezone*`, `round*`, and Legacy/Fallback Runtime Files

Decision:

| Runtime file group | TT authority judgment |
|---|---|
| `ic_launcher_safezone.png` | not a runtime resource; archive/delete candidate from Android `res`; already represented by authority package |
| `ic_launcher_safezone_round.png` | not a runtime resource; archive/delete candidate from Android `res`; do not submit |
| untracked `ic_launcher_round.png` | not currently part of v4_safezone authority package; do not submit unless PM/PP requests a formal pre-26 round fallback generated from authority and documented |
| modified `ic_launcher.png` | should be replaced by v4_safezone `legacy/mipmap-<density>/ic_launcher.png`, or reverted until icon task is applied cleanly |
| modified `ic_launcher_background.png` | should be replaced by v4_safezone `adaptive/<density>/ic_launcher_background.png`, together with matching foreground and restored XML |
| `ic_launcher_foreground.png` | should be checked/copied as part of the same v4_safezone adaptive set, even if not currently listed as modified |

The current untracked `safezone*` resources should not remain loose in `android/app/src/main/res/mipmap-*`. If PM wants to preserve them as evidence, place them in a design/report/archive path, not Android runtime.

## 5. Clear Integration Brief for PP / Sai

TT authority answer for PP/Sai:

1. Freeze current mixed Android icon state; do not submit it in a feature/UI/story commit.
2. Treat `design/authority/icon_start_tt/icon/android_launcher_rework_v4_safezone/` as the final App Icon authority.
3. Restore/keep adaptive XML routing in `mipmap-anydpi-v26`.
4. Copy only the approved v4_safezone adaptive foreground/background and legacy `ic_launcher.png` into standard Android resource names.
5. Do not submit `ic_launcher_safezone.png` or `ic_launcher_safezone_round.png` under Android runtime names.
6. Do not submit untracked `ic_launcher_round.png` unless a separate formal round PNG fallback is requested, generated from v4_safezone, previewed, and documented.
7. After integration, run hash verification against v4_safezone package and produce a before/after launcher preview for PM/Ant.

## TT Review State

TT status: review.

Authority decision is clear enough for PP/Sai to prepare a clean integration plan, but runtime changes should wait for PM approval because the current workspace contains mixed modified/deleted/untracked icon files.
