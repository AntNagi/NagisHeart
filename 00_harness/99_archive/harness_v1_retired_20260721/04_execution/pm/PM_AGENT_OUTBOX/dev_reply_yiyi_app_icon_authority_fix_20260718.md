# Dev Reply: TASK-20260718-002 Android App Icon 接入 TT confirmed 第三版

- 任务编号：TASK-20260718-002
- 负责人：yiyi
- 状态：review（等待 PM 静态复核 + 实机构建验证）
- 日期：2026-07-18

---

## 执行内容

### 1. Legacy mipmap 替换

5 个密度的 `ic_launcher.png` 已从 TT authority exports 复制覆盖：

| 密度 | 尺寸 | 源文件 | 目标文件 |
|------|------|--------|----------|
| mdpi | 48x48 | `design/authority/icon_start_tt/icon/android_mipmap/mipmap-mdpi/ic_launcher.png` | `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` |
| hdpi | 72x72 | `design/authority/icon_start_tt/icon/android_mipmap/mipmap-hdpi/ic_launcher.png` | `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` |
| xhdpi | 96x96 | `design/authority/icon_start_tt/icon/android_mipmap/mipmap-xhdpi/ic_launcher.png` | `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` |
| xxhdpi | 144x144 | `design/authority/icon_start_tt/icon/android_mipmap/mipmap-xxhdpi/ic_launcher.png` | `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` |
| xxxhdpi | 192x192 | `design/authority/icon_start_tt/icon/android_mipmap/mipmap-xxxhdpi/ic_launcher.png` | `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` |

### 2. Adaptive icon foreground/background

TT adaptive exports 已复制到每个密度 mipmap 目录：

| 密度 | 尺寸 | 文件 |
|------|------|------|
| mdpi | 108x108 | `ic_launcher_foreground.png`, `ic_launcher_background.png` |
| hdpi | 162x162 | `ic_launcher_foreground.png`, `ic_launcher_background.png` |
| xhdpi | 216x216 | `ic_launcher_foreground.png`, `ic_launcher_background.png` |
| xxhdpi | 324x324 | `ic_launcher_foreground.png`, `ic_launcher_background.png` |
| xxxhdpi | 432x432 | `ic_launcher_foreground.png`, `ic_launcher_background.png` |

### 3. Adaptive icon XML

新建 `android/app/src/main/res/mipmap-anydpi-v26/`，包含：

- `ic_launcher.xml`：引用 `@mipmap/ic_launcher_background` + `@mipmap/ic_launcher_foreground`
- `ic_launcher_round.xml`：同上引用，Android 自动应用 circle mask

API 26+ 设备使用 adaptive icon XML；API 25 及以下设备 fallback 到 `mipmap-*/ic_launcher.png` legacy PNG。

### 4. AndroidManifest.xml

新增 `android:roundIcon="@mipmap/ic_launcher_round"`：

```xml
<application
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    ...>
```

之前只有 `android:icon`，没有 `android:roundIcon`。

---

## 修改文件清单

| 文件 | 改动 |
|------|------|
| `mipmap-mdpi/ic_launcher.png` | 替换为 TT authority export |
| `mipmap-hdpi/ic_launcher.png` | 替换为 TT authority export |
| `mipmap-xhdpi/ic_launcher.png` | 替换为 TT authority export |
| `mipmap-xxhdpi/ic_launcher.png` | 替换为 TT authority export |
| `mipmap-xxxhdpi/ic_launcher.png` | 替换为 TT authority export |
| `mipmap-*/ic_launcher_foreground.png` | 新增，5 个密度 |
| `mipmap-*/ic_launcher_background.png` | 新增，5 个密度 |
| `mipmap-anydpi-v26/ic_launcher.xml` | 新建 adaptive icon XML |
| `mipmap-anydpi-v26/ic_launcher_round.xml` | 新建 adaptive round icon XML |
| `AndroidManifest.xml` | 新增 `android:roundIcon` |

---

## 未触碰

- Start 页面、HUD、dialog、chapter UI、story-data、BG mapping、BGM
- 旧资源未删除（按任务要求）
- Web、Gradle wrapper

---

## Cleanup candidates

以下旧资源可在 PM 授权后清理：

- `mipmap-mdpi/ic_launcher_round.png`（旧 round icon，已被 adaptive XML 替代）
- `mipmap-hdpi/ic_launcher_round.png`
- `mipmap-xhdpi/ic_launcher_round.png`
- `mipmap-xxhdpi/ic_launcher_round.png`
- `mipmap-xxxhdpi/ic_launcher_round.png`

这些旧 `ic_launcher_round.png` 现在不会被使用：API 26+ 设备读 `mipmap-anydpi-v26/ic_launcher_round.xml`（adaptive），API 25 及以下设备不支持 `roundIcon` attribute。但保险起见未删除，回报 PM 确认。

---

## 构建/验证状态

- 无 Gradle wrapper，无法 CLI 构建
- 需要 Android Studio 手动构建或 TASK-20260717-004 完成后 CLI 构建
- 实机验证重点：launcher icon 是否显示为 TT confirmed 第三版（rounded rect decorated Nagi avatar）
