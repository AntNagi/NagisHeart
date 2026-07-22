# TASK-20260723-002 Android 三个 authority 页面实现报告

日期：2026-07-23  
执行：Sai

## 本次改动

- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GameScreen.kt`
  - active path 已切到新的 authority 组件：
    - `GamePhase.ChapterTransition` → `AuthorityChapterOpeningOverlay`
    - `GamePhase.ChapterEnding` → `AuthorityChapterEndingOverlay`
    - `GamePhase.Ending` → `AuthorityEndingOverlay`
  - 大章开始：纯暗底整屏分割页，不再使用 story BG / 卡片 / 边框 / 毛玻璃；底部只有 `轻触继续`。
  - 大章结束：纯暗底弱分割页，`Chapter Clear` 下方短线；主动作 `进入下一章` 为无背景文字；底部弱化 `返回主页`，不再是 Button / Chip / glass bar。
  - 结局页：保留整屏诗性排版，不使用旧 ending-card / 毛玻璃 / 边框；`ending.tag` 金色 18sp 标识并带短线；唯一动作 `返回主页` 为无背景文字。
  - 结局页 BG 没有固定成 `true_end.jpg`：正常流程使用当前 `end_*` node 的 `bgAssetPath`。`true_end.jpg` 仅作为异常兜底，避免 GOOD / NORMAL / BAD 被 TRUE 示例图污染。

- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/ChapterOpeningScreen.kt`
  - 独立路由版本同步改为 authority 大章开始页。
  - 不再使用传入 story BG / pillow fallback / 旧玻璃卡。

- `android/app/src/main/java/com/antnagi/nagisheart/ui/theme/NagiTokens.kt`
  - 新增 authority 三页专用暗底 token，避免 UI 层新增硬编码 `Color(0x...)`。

## active path 说明

`GameScreen.kt` 内旧的 `EndingOverlay` / `ChapterOpeningOverlay` / `ChapterEndingOverlay` 仍留在文件中，但当前游戏流程已经不再调用它们。  
本次为了避免在含历史乱码字符串的大文件中做高风险大段删除，采取“新增 authority 组件 + 切 active call”的低风险方式。

## 关于结局 BG

Ant 纠正后，结局页没有固定使用 `assets/bg/true_end.jpg`。  
当前链路为：`end_*` 正文 node 播放完 → `GameViewModel.showEnding()` → `GameScreen.AuthorityEndingOverlay(bgAssetPath = state.bgAssetPath)`。

前置任务 `TASK-20260722-001` 已让 `showEnding()` / Gallery 以 endingNode BG 为准；因此 overlay 正常拿到的是当前最终结局 node 的权威 BG：

- TRUE → `assets/bg/true_end.jpg`
- GOOD → `assets/bg/king.jpg`
- NORMAL → `assets/bg/ending_true_nagi_soft_gaze.jpg`
- BAD → `assets/bg/goal_faraway.jpg`

## 校验

- `node tools/validate.js`：通过，0 errors / 1 existing warning（硬编码 Ant 文案，非本任务新增）。
- `powershell -ExecutionPolicy Bypass -File tools/check-tokens.ps1`：通过。

## 截图阻塞

本机无法产出 Android 实机/模拟器截图，原因：

- `android/gradlew.bat` 不存在。
- `android/gradle/wrapper/gradle-wrapper.jar` 不存在。
- 系统未找到可用 `gradle` 命令。

因此本报告未包含三张 Android 截图。需要 Ant 或有完整 Android 构建环境的机器在 Android Studio 中实机/模拟器截图确认：

1. 大章开始页；
2. 大章结束页；
3. 结局页。
