# TASK TO YIYI - Android real-device functional bugs

日期：2026-07-18  
PM：一一  
执行人：yiyi  
任务：`TASK-20260718-006`

---

## 0. 来源

Ant大小姐实机反馈：

1. 很多章节开篇默认显示同一张 Nagi 抱枕图 / 第一张截图背景，而不是按当前章节 / 小节要求使用当节背景图。
2. 很多章节开篇点不动页面，卡在 opening 页。
3. BGM 好像没有了；之前有，后来不见了。

这是 Android 实机功能 bug，不是 Web 任务，不得交给 Wewe。

---

## 1. PM 初步根因判断

### 1.1 Opening 背景疑似使用旧 `state.bgAssetPath`

当前 Android transition 逻辑里，章节 / 小节 opening 在 `pendingNodeAfterTransition` 真正 `enterNode()` 前显示。

风险点：

- `ChapterOpeningOverlay(...)` / `SectionOpeningOverlay(...)` 使用的是当前 `state.bgAssetPath`。
- 但此时即将进入的新节点还没有 `enterNode()`，所以 `state.bgAssetPath` 仍可能是上一个节点、上一节、第一张图或 fallback 图。
- 结果就是多个章节 opening 复用同一张背景。

需要检查并修正：

- `GameViewModel.kt`
- `GameScreen.kt`
- `ChapterTransitionInfo` / `SectionTransitionInfo` 是否需要携带 target bg asset path。

目标：

- Chapter / Section opening 必须显示即将进入的 pending node 的 `visual.bg`。
- 不得默认沿用上一节点背景。
- 不得改 story-data 正文或 BG mapping 权威，除非 PM/Ant 另行确认 mapping 本身有错。

### 1.2 Opening 点击卡住

当前 transition 依赖外层全屏 tap target 调 `viewModel.onTap()`。实机反馈“很多章节开篇点不动”，说明当前点击层级或 overlay 自身点击区域不可靠。

需要修正：

- Chapter opening / Section opening 页面自身必须显式可点击继续。
- 不要只依赖被其他 overlay 层覆盖前的全屏 tap layer。
- 修正后在多章 / 多节 opening 实机验证：轻触任意安全区域能进入本章 / 本节内容。

### 1.3 BGM 资源路径断链

PM 静态检查发现：

- `story-data/scene_visuals.json` 中 `bgm` 为 `bgm/bgm.mp3`。
- Android `GameViewModel` 会执行 `visual?.bgm?.removePrefix("assets/")`，并传给 `BgmManager.play(...)`。
- Android 运行时需要 `android/app/src/main/assets/bgm/bgm.mp3`。
- 目前仓库根 `assets/bgm.mp3` 存在，但 Android assets 下未发现 `bgm/bgm.mp3`。

需要修正：

- 把 BGM 资源正确同步到 Android 运行时路径；推荐目标：`android/app/src/main/assets/bgm/bgm.mp3`。
- 或明确修正 Android BGM path resolver，但不得改 story-data 权威口径，除非 PM/Ant 另行确认。
- 修正后实机验证 Settings 音量入口与播放链路。

---

## 2. 允许修改范围

允许修改：

- Android opening / transition 相关代码；
- Android BGM 资源同步或 BGM path resolver；
- 必要的 harness 状态记录。

优先关注文件：

- `android/app/src/main/java/com/antnagi/nagisheart/ui/viewmodel/GameViewModel.kt`
- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GameScreen.kt`
- `android/app/src/main/java/com/antnagi/nagisheart/data/BgmManager.kt`
- `android/app/src/main/assets/bgm/bgm.mp3`（如需要新增）

---

## 3. 禁止范围

不得修改：

- Web / `web/`
- story-data 正文
- BG mapping 权威，除非先回报 PM 证明 mapping 本身错误
- UI authority
- TT Start
- App Icon
- Android UI rework gate 中的 HUD / Dialog / speaker 自由调参
- 资源清理 / archive

---

## 4. 验收要求

回传必须包含：

1. 背景 bug：
   - 至少验证第 1 部开篇、第 3 部小节开篇、另一个非抱枕图章节 opening；
   - 每个 opening 显示对应 pending node 的背景。
2. 点击 bug：
   - Chapter opening / Section opening 均可轻触继续；
   - 不再卡住。
3. BGM：
   - Android assets 中存在正确 BGM 资源，或 path resolver 有明确解释；
   - 实机能听到 BGM；
   - Settings BGM 音量仍可控。
4. 明确声明未触碰 Web。

回报写入：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_android_real_device_functional_bugs_20260718.md`

Cleanup status 必须写明。

