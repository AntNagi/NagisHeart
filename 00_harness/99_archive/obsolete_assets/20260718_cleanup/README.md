# Obsolete assets archive - 2026-07-18 cleanup

本目录保存从活跃工程路径移出的废弃候选资源。它们保留用于历史追溯，不再作为开发或设计权威引用。

## Archived groups

### 1. Rejected TT Start long-screen candidates

Original active path:

`design/authority/icon_start_tt/start_long/`

Archived:

- V1 direct long-screen package:
  - `base/`
  - `layers/`
  - `previews/`
  - `MANIFEST_START_LONG.md`
  - `SELF_CHECK_START_LONG.md`
  - `SPEC_ADDENDUM_START_LONG_SCREEN_v1_0.md`
- V2 package:
  - `v2/`
- V3 package:
  - `v3/`

Reason:

- V1 used blurred / frosted top-bottom extension and was rejected.
- V2 / V3 used a crop route that changed the visual relationship and was rejected.
- Active long-screen direction remains `design/authority/icon_start_tt/start_long/rethink/`.

### 2. Old Android Start / splash lineage resources

Original active paths:

- `android/app/src/main/res/drawable-nodpi/splash_start.png`
- `android/app/src/main/res/drawable-nodpi/splash_title.png`
- `android/app/src/main/assets/bg/poster_start_nagis_heart_keyart.jpg`

Reason:

- Final Start authority uses TT Start v23 layered resources.
- Android audit and yiyi resource-fix report both found no active code references to these three files.
- Keeping them in active Android resource paths risks accidental reintroduction of non-authority Start visuals.

## Do not use

Do not reference files in this archive from Android, Web, UI authority, or story-data.

If any archived asset appears necessary again, PM must open a new restore task and record why the current authority is being changed.

