# PM Release-readiness Code Review Plan

Date: 2026-07-19
Owner: PM 一一
Project: NagisHeart

## Why this gate exists

Ant 大小姐明确指出：项目已经改过很多版，现在需要维护已经做好的成品，不能越改越乱。这里的 review 不是单次 diff review，而是上线前代码设计健康审计。

## Scope

### Android

Primary owner: PP

Audit:

- screen/component ownership and duplicate active paths;
- `GameViewModel` state machine;
- `StoryEngine` routing and `ending_resolver`;
- section/chapter/ending transition logic;
- backlog pagination and data collection;
- progress / save / gallery unlock persistence;
- BGM and runtime asset paths;
- UI components that have repeatedly drifted: `NagiDialog`, `NagiHud`, `NagiIconButton`, long narration, chapter/catalog/ending screens;
- stale APK / build variant / install freshness risks.

### Web

Primary owner: Wewe

Audit:

- parity with authority and Android behavior where shared product rules apply;
- duplicate UI paths and old MVP code left active;
- route / progress / save / gallery / BGM implementation risks;
- mobile viewport handling;
- PWA/icon/resource paths;
- Android touched: no.

### Shared data and authority

PM owns cross-check:

- PRD vs Interaction vs UI authority;
- story-data flow/router/endings/chapter mapping;
- runtime story-data authority vs active `story-data/`;
- archive leakage and obsolete active files.

## Method

This is audit-only first.

Each owner must return:

1. architecture map of active runtime paths;
2. duplicate / obsolete / conflicting code list;
3. risk table with severity P0/P1/P2;
4. recommended minimal remediation tasks;
5. cleanup candidates, not cleanup actions;
6. verification plan.

## Release gate criteria

Before release-ready:

- No P0 logic risk remains open.
- No known active duplicate screen/component can make real-device output use stale UI.
- Backlog, endings, gallery, save/progress, skip/chapter transitions have documented expected behavior and matching implementation.
- Authority files in `08_authority_current` are the only implementation source of truth.
- QA can identify the exact build under test.
- Cleanup candidates are either archived by scoped PM task or explicitly deferred with reason.

## Current known risks

1. Android has both independent screen files and `GameScreen` inline overlays for chapter/opening/ending related UI.
2. Backlog currently has evidence of fixed page capacity and default-last-page behavior.
3. Ending resolver fallback can produce normal ending if state/route enters resolver unexpectedly.
4. Gallery unlock path may be non-reactive or key-mismatched.
5. Dialog/HUD have repeated implementation drift despite multiple passes.
6. Web recently passed DeDe functional P0 retest but still has visual P1 risks and needs code-health audit before release confidence.

Cleanup status: none.
