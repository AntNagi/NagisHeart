# TASK-20260718-008 回传：App Icon launcher V4 integration

- 任务编号：TASK-20260718-008
- 负责人：yiyi
- 状态：review（等待实机构建验证）
- 日期：2026-07-18

---

## 复制文件清单

### Adaptive foreground（5 密度）

| 源路径 | 目标路径 |
|-------|---------|
| `android_launcher_rework_v4/adaptive/mdpi/ic_launcher_foreground.png` | `mipmap-mdpi/ic_launcher_foreground.png` |
| `android_launcher_rework_v4/adaptive/hdpi/ic_launcher_foreground.png` | `mipmap-hdpi/ic_launcher_foreground.png` |
| `android_launcher_rework_v4/adaptive/xhdpi/ic_launcher_foreground.png` | `mipmap-xhdpi/ic_launcher_foreground.png` |
| `android_launcher_rework_v4/adaptive/xxhdpi/ic_launcher_foreground.png` | `mipmap-xxhdpi/ic_launcher_foreground.png` |
| `android_launcher_rework_v4/adaptive/xxxhdpi/ic_launcher_foreground.png` | `mipmap-xxxhdpi/ic_launcher_foreground.png` |

### Adaptive background（5 密度）

| 源路径 | 目标路径 |
|-------|---------|
| `android_launcher_rework_v4/adaptive/mdpi/ic_launcher_background.png` | `mipmap-mdpi/ic_launcher_background.png` |
| `android_launcher_rework_v4/adaptive/hdpi/ic_launcher_background.png` | `mipmap-hdpi/ic_launcher_background.png` |
| `android_launcher_rework_v4/adaptive/xhdpi/ic_launcher_background.png` | `mipmap-xhdpi/ic_launcher_background.png` |
| `android_launcher_rework_v4/adaptive/xxhdpi/ic_launcher_background.png` | `mipmap-xxhdpi/ic_launcher_background.png` |
| `android_launcher_rework_v4/adaptive/xxxhdpi/ic_launcher_background.png` | `mipmap-xxxhdpi/ic_launcher_background.png` |

### Legacy ic_launcher（5 密度）

| 源路径 | 目标路径 |
|-------|---------|
| `android_launcher_rework_v4/legacy/mipmap-mdpi/ic_launcher.png` | `mipmap-mdpi/ic_launcher.png` |
| `android_launcher_rework_v4/legacy/mipmap-hdpi/ic_launcher.png` | `mipmap-hdpi/ic_launcher.png` |
| `android_launcher_rework_v4/legacy/mipmap-xhdpi/ic_launcher.png` | `mipmap-xhdpi/ic_launcher.png` |
| `android_launcher_rework_v4/legacy/mipmap-xxhdpi/ic_launcher.png` | `mipmap-xxhdpi/ic_launcher.png` |
| `android_launcher_rework_v4/legacy/mipmap-xxxhdpi/ic_launcher.png` | `mipmap-xxxhdpi/ic_launcher.png` |

共 15 个文件覆盖写入。

---

## Adaptive XML 状态

| 文件 | 状态 | 内容 |
|------|------|------|
| `mipmap-anydpi-v26/ic_launcher.xml` | 未修改 | `<foreground android:drawable="@mipmap/ic_launcher_foreground"/>` + `<background android:drawable="@mipmap/ic_launcher_background"/>` |
| `mipmap-anydpi-v26/ic_launcher_round.xml` | 未修改 | 同上，Android 26+ round icon 使用 adaptive foreground/background |

两个 XML 均已正确指向 `@mipmap/ic_launcher_foreground` 和 `@mipmap/ic_launcher_background`，无需修改。

---

## 旧 ic_launcher_round.png 清理

| 文件 | 动作 | 原因 |
|------|------|------|
| `mipmap-mdpi/ic_launcher_round.png` | 已删除 | `ic_launcher_round.xml`（anydpi-v26）已覆盖 API 26+ round icon；pre-26 设备不使用 round icon |
| `mipmap-hdpi/ic_launcher_round.png` | 已删除 | 同上 |
| `mipmap-xhdpi/ic_launcher_round.png` | 已删除 | 同上 |
| `mipmap-xxhdpi/ic_launcher_round.png` | 已删除 | 同上 |
| `mipmap-xxxhdpi/ic_launcher_round.png` | 已删除 | 同上 |

说明：`mipmap-anydpi-v26/ic_launcher_round.xml` 在 API 26+ 设备上优先于密度特定 PNG，因此 round launcher icon 使用 V4 adaptive foreground/background 合成。API 25 及以下设备不支持 round icon（`android:roundIcon` 被忽略），fallback 到 `ic_launcher.png`（已替换为 V4 legacy）。旧 round PNG 是之前版本的残留，删除安全。

---

## git status scope

```
modified:   android/app/src/main/res/mipmap-mdpi/ic_launcher.png
modified:   android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png
modified:   android/app/src/main/res/mipmap-mdpi/ic_launcher_background.png
modified:   android/app/src/main/res/mipmap-hdpi/ic_launcher.png
modified:   android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png
modified:   android/app/src/main/res/mipmap-hdpi/ic_launcher_background.png
modified:   android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
modified:   android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png
modified:   android/app/src/main/res/mipmap-xhdpi/ic_launcher_background.png
modified:   android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
modified:   android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png
modified:   android/app/src/main/res/mipmap-xxhdpi/ic_launcher_background.png
modified:   android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
modified:   android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png
modified:   android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_background.png
deleted:    android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
deleted:    android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
deleted:    android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
deleted:    android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
deleted:    android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png
```

共 20 项变更（15 modified + 5 deleted），全部在 `android/app/src/main/res/mipmap-*/` 范围内。

---

## 构建 / launcher 视觉验证

无法提供实机截图（无 gradlew 构建环境）。需要 Ant 实机构建后确认：

1. Launcher 圆形 mask 下 icon 无黑边、无内层方形边界
2. Launcher squircle mask 下 icon 自然
3. Legacy launcher（pre-API 26）显示正确

---

## Cleanup status

已删除 5 个旧 `ic_launcher_round.png`（见上）。无其他清理。TT 设计包文件未删除。

---

## 未改动范围

- Start 页面
- HUD / Dialog / speaker UI
- Web
- story-data
- BG mapping
- BGM
- TT 设计包
- UI authority
- unrelated cleanup
- AndroidManifest.xml（`roundIcon` 已在 TASK-002 中配置，无需再改）
- Adaptive XML（已正确配置）

---

## Android touched

- `mipmap-*/ic_launcher.png`：是（V4 legacy 覆盖）
- `mipmap-*/ic_launcher_foreground.png`：是（V4 adaptive 覆盖）
- `mipmap-*/ic_launcher_background.png`：是（V4 adaptive 覆盖）
- `mipmap-*/ic_launcher_round.png`：已删除
- `mipmap-anydpi-v26/ic_launcher.xml`：否（无需修改）
- `mipmap-anydpi-v26/ic_launcher_round.xml`：否（无需修改）

## Web touched

No.
