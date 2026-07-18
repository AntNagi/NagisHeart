# PM Review - Obsolete Asset Cleanup

Date: 2026-07-18  
Reviewer: PM 一一  
Status: completed

## Trigger

Ant大小姐要求清理已经不需要的文件和资源，避免新旧版本混淆。

## Cleanup principle

本轮不做不可逆删除。所有确定废弃但仍可能需要历史追溯的文件均移动到：

`00_harness/99_archive/obsolete_assets/20260718_cleanup/`

活跃工程目录只保留当前 authority / review authority 所需文件。

## Moved out of active paths

### Rejected TT Start long-screen candidate packages

Moved from active path:

`design/authority/icon_start_tt/start_long/`

Moved groups:

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

Kept active:

- `design/authority/icon_start_tt/start_long/rethink/`
- `design/authority/icon_start_tt/start_long/README.md`

Reason:

- V1 blurred-extension direction was rejected.
- V2 / V3 crop direction was rejected.
- Active direction is Strategy A / rethink.

### Old Android Start / splash lineage resources

Moved from active Android paths:

- `android/app/src/main/res/drawable-nodpi/splash_start.png`
- `android/app/src/main/res/drawable-nodpi/splash_title.png`
- `android/app/src/main/assets/bg/poster_start_nagis_heart_keyart.jpg`

Reason:

- XoXo Android resource audit and yiyi resource-fix report found no active code references.
- Final Start authority uses TT Start v23 layered resources.
- Keeping old Start visuals in active Android paths risks accidental reintroduction.

## Verification

- Confirmed original active paths no longer exist.
- Confirmed active Android source/resource/assets paths have no references to:
  - `splash_start`
  - `splash_title`
  - `poster_start_nagis_heart_keyart`
- Confirmed archive contains the moved files.

## Not cleaned in this pass

The following were intentionally not moved:

- Harness inbox/outbox and PM review files: they are project history and task trace.
- `assets/bg/poster_start_nagis_heart_keyart.jpg` if present outside Android: older mapping/reference docs may still mention it as historical source, and it is not in active Android runtime path.
- `design/authority/icon_start_tt/start_long/rethink/`: this remains active strategy/reference.
- Old reference design docs listed by `PROJECT_STRUCTURE.md`: they remain reference/archive material unless a separate documentation cleanup task is opened.

## Follow-up rule

Archived files must not be used for development. If a worker believes an archived asset is needed, they must ask PM to open a restore task instead of referencing it directly.

