# TASK-20260724-001 Android 剧情回顾对白块视觉区分报告

日期：2026-07-24  
执行：Sai

## 改动范围

只改 Android 剧情回顾 / Backlog recap 条目渲染：

- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/BacklogScreen.kt`

未改：

- 剧情正文
- 回顾分页逻辑
- 章节地图
- 回忆画廊
- BG mapping
- Web
- TT / Start / App Icon
- 资源文件

## 实现内容

按 `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` §26：

- `speaker` 为空：走旁白样式；
  - serif；
  - `16sp`；
  - line-height `1.92`，即 `30.72sp`；
  - text color `parchment alpha 0.92`。
- `speaker` 非空：走对白 excerpt block；
  - block 背景：左到右 deepBlue 渐变 `0.40 → 0.18@62% → 0.04`；
  - block padding：top `13dp` / right `15dp` / bottom `15dp` / left `17dp`；
  - block margin-top：`24dp`；
  - 左侧金线：`1dp`，top/bottom inset `12dp`，中心 alpha `0.72`；
  - 左侧金线弱 glow：`8dp`，alpha `0.18`；
  - speaker：UI sans / `12sp` / SemiBold / letter-spacing `0.08em` / `speakerGold #E4CA8F`；
  - dialogue text：UI sans / `15sp` / line-height `1.82`，即 `27.3sp` / letter-spacing `0.01em` / snow alpha `0.94`。

实现策略：

- 在 `BacklogItem()` 中按 `entry.speaker.isNotBlank()` 区分旁白与对白 excerpt；
- 新增 `RecapNarrationItem()` 保持旁白样式；
- 新增 `RecapDialogueItem()` 实现对白块；
- 没有修改 `BacklogEntry` 数据模型，也没有改 story 正文。

## 校验

- `node tools/validate.js`：PASSED，0 errors / 1 existing warning
- `tools/check-tokens.ps1`：PASSED

## 截图阻塞

本机仍无法产出 Android 实机 / 模拟器截图：

- `android/gradlew.bat` 不存在；
- `android/gradle/wrapper/gradle-wrapper.jar` 不存在；
- 系统未找到可用 Gradle。

因此本报告未附截图。验收时需要 Ant / 有构建环境机器补一张剧情回顾截图，截图需同时包含旁白段和 `JFA会长` 对白段。
