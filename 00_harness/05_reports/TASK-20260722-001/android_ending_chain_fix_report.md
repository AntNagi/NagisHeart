# TASK-20260722-001 Android 结局链路修复报告

日期：2026-07-22  
执行：Sai / Android

## 1. 本次修改范围

- 修 `end_true / end_good / end_normal / end_bad` 的播放模型：`end_*` 先作为普通剧情 node 播放，播完后才进入 `EndingOverlay`。
- 修最终结局 BG source of truth：四个 `end_*` node 使用 Ant 2026-07-22 指定 BG。
- 修 Gallery BG 来源：画廊不再优先使用旧 `ending_bg_*` 进度缓存，而是按 ending definition 的 `endingNode` 查当前运行数据里的权威 BG。
- 未改第六部主链；未改 Web；未改 UI 风格；未删除资源；未写新剧情。

## 2. 修改文件

- `android/app/src/main/java/com/antnagi/nagisheart/engine/StoryEngine.kt`
  - `resolve()` 改为优先按 `isNode(currentId)` 返回 `Found`，因此 router 解析到 `end_*` 后不会直接 `EndingReached` 跳过正文。
  - 新增 `getEndingForNode(nodeId)`，供 ViewModel 在 node 完播后判断是否该进入终局页。

- `android/app/src/main/java/com/antnagi/nagisheart/ui/viewmodel/GameViewModel.kt`
  - 在普通 node 无下一跳时调用 `finishEndingNodeIfNeeded(currentNodeId)`。
  - `end_*` node 自身的自动 `type=ending` choice 不再回跳 `ending_resolver`，而是在正文播完后直接进入 `EndingOverlay`。
  - `showEnding()` 解锁时使用 `engine.getNodeBg(ending.definition.endingNode)`，不再传 `_uiState.value.bgAssetPath`。
  - `getEndingBgPath()` 改为返回 endingNode 对应 BG，旧 `ending_bg_*` 错误缓存被显示层忽略。

- `story-data/scene_visuals.json`
- `android/app/src/main/assets/story-data/scene_visuals.json`
  - 同步修四个最终结局 node BG。

## 3. end_* 播放保证

修复前：

```text
ending_resolver → end_* → StoryEngine.resolve() 命中 isEndingNode → EndingOverlay
```

问题：`nodes.json` 里的 `end_*` 独立结局剧情被跳过。

修复后：

```text
ending_resolver → end_* → StoryEngine.resolve() 命中 isNode → enterNode()
end_* dialogue / choices 播放完成
无下一跳，或 end_* 自身 auto ending choice → finishEndingNodeIfNeeded(end_*) → EndingOverlay
```

## 4. 最终 BG 对齐结果

| ending node | root story-data | Android assets runtime |
|---|---|---|
| `end_true` | `assets/bg/true_end.jpg` | `assets/bg/true_end.jpg` |
| `end_good` | `assets/bg/king.jpg` | `assets/bg/king.jpg` |
| `end_normal` | `assets/bg/ending_true_nagi_soft_gaze.jpg` | `assets/bg/ending_true_nagi_soft_gaze.jpg` |
| `end_bad` | `assets/bg/goal_faraway.jpg` | `assets/bg/goal_faraway.jpg` |

资源存在性已确认：四张图均存在于 `android/app/src/main/assets/bg/`。

## 5. 旧 ending_bg_* 缓存处理

旧版本 `showEnding()` 会把“进入结局前当前背景”写入 `ending_bg_*`，Gallery 又优先读取该缓存，因此会污染结局卡 BG。

本次处理方式：显示层忽略旧缓存。

- `GameViewModel.getEndingBgPath(endingId)` 现在直接返回 `getEndingFallbackBg(endingId)`。
- `getEndingFallbackBg()` 通过 `endings.json` 的 `endingNode` 反查 `scene_visuals`。
- 因此历史设备里已经写坏的 `ending_bg_good / ending_bg_normal / ending_bg_bad` 不再影响 Gallery 显示。
- `showEnding()` 仍会写入新权威 BG，兼容以后如果有别处读取 progress 的场景。

## 6. 校验

- `node tools/validate.js`：PASSED，0 errors，1 warning（hardcoded Ant 既有警告，非本次引入）。
- 两份 `scene_visuals.json` 的四个 `end_*` BG 已脚本读取比对一致。
- `tools/check-authority.ps1`：当前失败在 `authority/visual_mapping/NagisHeart_SCRIPT_V15_节点匹配表.xlsx` 哈希漂移；本次未修改 authority。该漂移与任务板 Phase 0 已记录的 xlsx 问题一致，需要 PM/Ant 另行处理或补账。

## 7. 截图状态

任务要求的截图清单：

- 四张 `end_*` 独立结局剧情正文正在播放截图；
- 四张对应 EndingOverlay 截图；
- 一张 Gallery 四个结局卡 BG 截图。

当前本机无法产出 Android 截图，原因：

- `android/gradlew.bat` 不存在；
- `android/gradle/wrapper/gradle-wrapper.jar` 不存在；
- 系统 `gradle` 不存在；
- 本任务禁止混入 Gradle wrapper 基建工作。

因此本报告先提交代码/数据链路证据；实机截图需要在 Android Studio 或补齐 wrapper 后生成并放入本目录，截图补齐前不应转 done。
