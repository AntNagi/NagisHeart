# TASK TO yiyi - App Icon authority fix

> 时间：2026-07-18  
> PM：一一  
> 接收人：yiyi（Android 开发）  
> Task ID：TASK-20260718-002  
> 优先级：P1  
> 状态：ready

## 背景

Ant大小姐已确认 App Icon 使用 TT 候选包 icon 总览图里的“第三版”方向：即 `icon/previews/icon_overview_contact_sheet.png` 顶部第三张 / 右上预览，标注为 `rounded rect mask preview`。

TT 包内对应开发资源的准确名称为：

- `rounded rect v2 decorated`
- master: `design/authority/icon_start_tt/icon/master/app_icon_tt_candidate_1024.png`
- Android legacy mipmap exports: `design/authority/icon_start_tt/icon/android_mipmap/mipmap-*/ic_launcher.png`
- Android adaptive foreground/background exports: `design/authority/icon_start_tt/icon/android_adaptive/*/ic_launcher_foreground.png` and `ic_launcher_background.png`

当前 Android launcher icon 仍是旧/错误资源，需要修正为这张 `rounded rect mask preview` 对应的 TT authority icon。

## 必读

1. `design/authority/icon_start_tt/TT_Icon_Start_Authority_Spec_v1_0.md`
2. `design/authority/icon_start_tt/MANIFEST.md`
3. `design/authority/icon_start_tt/VERSION_INDEX.md`
4. `design/authority/icon_start_tt/icon/previews/icon_overview_contact_sheet.png`
5. `00_harness/01_governance/decision_log.md` 中 `DEC-20260718-003`

## 任务范围

只做 Android App Icon 接入修正：

1. 用 TT 提供的 legacy mipmap exports 替换 Android 当前 `mipmap-*/ic_launcher.png`。
2. 核对当前是否仍有旧 `ic_launcher_round.png` 或 adaptive icon XML 指向旧资源。
3. 如项目已有 adaptive icon 配置，改为引用 TT foreground/background 资源；如没有，按当前 Android 最小可行方式补齐，并记录选择原因。
4. 核对 `AndroidManifest.xml` 的 app icon / round icon 引用是否正确。

## 禁止范围

- 不改 Start 页面。
- 不改 HUD、dialog、chapter UI、story-data、BG mapping、BGM。
- 不删除旧资源；如发现旧 icon 资源应清理，只作为 cleanup candidates 回报 PM。
- 不从 `00_harness/99_archive/` 引用任何资源。

## 完成定义

- Android launcher icon 使用 TT confirmed App Icon。
- 资源路径、manifest 引用、adaptive/round fallback 口径清楚。
- 回传文件清单、验证结果、cleanup status。

## Cleanup status

本任务创建时未清理文件。执行后 yiyi 必须回传 cleanup status / candidates / done。
