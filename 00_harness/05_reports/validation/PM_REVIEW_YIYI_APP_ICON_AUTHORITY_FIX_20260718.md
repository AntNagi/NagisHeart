# PM Review - yiyi TASK-20260718-002 Android App Icon Authority Fix

日期：2026-07-18  
负责人：PM 一一  
任务：`TASK-20260718-002` Android App Icon 接入 TT confirmed 第三版  
状态结论：`review` 静态复核通过；不转 `done`，等待构建与 Ant大小姐实机 launcher 视觉确认。

---

## 1. PM 复核结论

yiyi 本轮接入方向正确：Android launcher icon 已切换到 Ant大小姐确认的 TT 第三版，即 TT icon 总览图顶部第三张 / 右上 `rounded rect mask preview`，开发口径对应 `rounded rect v2 decorated`。

权威源：

- master：`design/authority/icon_start_tt/icon/master/app_icon_tt_candidate_1024.png`
- legacy density exports：`design/authority/icon_start_tt/icon/android_mipmap/mipmap-*/ic_launcher.png`
- adaptive exports：`design/authority/icon_start_tt/icon/android_adaptive/*/ic_launcher_foreground.png`、`ic_launcher_background.png`

Android 接入目标：

- `android/app/src/main/res/mipmap-*/ic_launcher.png`
- `android/app/src/main/res/mipmap-*/ic_launcher_foreground.png`
- `android/app/src/main/res/mipmap-*/ic_launcher_background.png`
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml`
- `android/app/src/main/AndroidManifest.xml`

---

## 2. 文件与配置核验

### 2.1 Legacy icon

5 个密度 `mipmap-*/ic_launcher.png` 均已替换为 TT authority export。PM 已按 SHA256 / file hash 比对：

| density | result |
| --- | --- |
| mdpi | match |
| hdpi | match |
| xhdpi | match |
| xxhdpi | match |
| xxxhdpi | match |

### 2.2 Adaptive foreground / background

5 个密度的 adaptive foreground / background 均已复制到 Android `res/mipmap-*`，并与 TT authority exports hash 一致：

| density | foreground | background |
| --- | --- | --- |
| mdpi | match | match |
| hdpi | match | match |
| xhdpi | match | match |
| xxhdpi | match | match |
| xxxhdpi | match | match |

### 2.3 XML / manifest

已确认：

- `mipmap-anydpi-v26/ic_launcher.xml` 存在，并引用 `@mipmap/ic_launcher_background` 与 `@mipmap/ic_launcher_foreground`。
- `mipmap-anydpi-v26/ic_launcher_round.xml` 存在，并引用同一组 adaptive foreground / background。
- `AndroidManifest.xml` 已包含 `android:icon="@mipmap/ic_launcher"` 与 `android:roundIcon="@mipmap/ic_launcher_round"`。

---

## 3. Cleanup 判断

Cleanup candidates:

- `android/app/src/main/res/mipmap-*/ic_launcher_round.png` 旧 round PNG，5 个密度均仍存在。

PM 决策：本轮暂不删除。

理由：

1. API 26+ 已通过 adaptive `ic_launcher_round.xml` 接管 round icon。
2. 旧 PNG 当前属于 cleanup candidate，但 launcher icon 仍未完成构建 / 实机验证。
3. 遵守 `DEC-20260718-002` cleanup gate：未通过实机验证前，不做可能影响 fallback 或 launcher 表现的删除。

后续：构建与 Ant launcher 视觉确认通过后，再另行清理旧 `ic_launcher_round.png`。

---

## 4. 范围核验

yiyi 回报未触碰以下范围，PM 本轮按任务边界接受：

- Start / 长屏适配
- HUD / dialog / speaker UI
- story-data
- BG mapping
- BGM
- Web
- Gradle wrapper

---

## 5. PM 决策

- `TASK-20260718-002` 保持 `review`。
- 静态资源接入通过。
- 不转 `done`，等待：
  1. Android 构建通过；
  2. Ant大小姐实机 launcher icon / round icon / adaptive icon 视觉确认；
  3. 验证通过后再处理旧 `ic_launcher_round.png` 清理。

