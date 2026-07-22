# Android 开放日运行层排查报告

日期：2026-07-23  
执行：Sai  
范围：只排查 Android 运行层与 runtime 数据链路；不重写开放日剧情，不改剧情顺序。

## 结论

静态 runtime 链路与 PM 一一口径一致：

`u20j → c3 → c3_s2 → e_lemontea → e_lemontea_s2 → c2`

当前没有证据表明 `story-data` 的开放日 target 错接，也没有改 `c3` / `c3_s2` / `e_lemontea` / `e_lemontea_s2` 的剧情文案或顺序。

本次仅做了一个最小 Android 运行层修正：

- `GameViewModel.presentChoices()` 不再重复手写 player choice 过滤逻辑，改为统一调用 `StoryEngine.getPlayerVisibleChoices(currentChoices, gameState)`。
- 源码实际 UTF-8 中箭头为 `"→"`；PowerShell 终端显示成 `"鈫?"` 属显示编码问题。不过为减少重复实现风险，ViewModel 已统一走 engine 过滤口径。

## runtime 链路证据表

数据来源：

- `story-data/nodes.json`
- `story-data/flow.json`
- `story-data/scene_visuals.json`

| 节点 | sceneTitle | BG | dialogue 数 | 首句摘录 | 末句摘录 | 选择 / flow |
|---|---|---:|---:|---|---|---|
| `u20j` | U-20日本代表战·被日本看见 | `assets/bg/vs_u20_japan_kick.jpg` | 18 | U-20日本代表战前夜，蓝色监狱的灯亮到很晚。 | 原来是这种感觉。 | flow default → `c3`；另有 autoAdvance `→` |
| `c3` | 开放日 | `assets/bg/openday.jpg` | 8 | U-20日本代表战后，蓝色监狱迎来短暂的开放日。 | {{playerName}}，你来啦。 | 4 个玩家选择，全部 target `c3_s2` |
| `c3_s2` | 开放日 | `assets/bg/openday.jpg` | 8 | 整理完后，Nagi又带你参观了蓝色监狱的其他地方。 | 嗯，走吧。 | 1 个玩家选择 target `e_lemontea`；flow default 也为 `e_lemontea` |
| `e_lemontea` | 你的，我的 | `assets/bg/lemontea.jpg` | 3 | 假期开始后的第一个下午，你们去了那家春日限定的柠檬主题饮品店。 | 好喝。 | 1 个玩家选择 target `e_lemontea_s2` |
| `e_lemontea_s2` | 你的，我的 | `assets/bg/lemontea.jpg` | 3 | 他站起来了。一米九的身高撑开来，把你面前的光遮掉了一半。 | 你脸上的热度蹿上来，快得没有预兆。 | 2 个玩家选择；无显式 target，走 flow default → `c2` |
| `c2` | 假期的消息 | `assets/bg/message_in_holiday.jpg` | 8 | 开放日之后，假期真的开始了。 | 有点麻烦。 | 进入假期消息节点 |

## Android 运行层检查

### 1. clean new story

代码路径：

- `GameViewModel.startNewGame()`：重置 `GameState`、清 backlog、设置当前 chapter，然后 `navigateToNode("p1")`。
- `GameViewModel.resetAndStartNew()`：先 `deleteAutoSave()`，再 `startNewGame("", "Nagi")`。

结论：

- clean new story 不会复用 autosave nodeId。
- PM/Ant 实机验证时必须从 `resetAndStartNew()` / 清空 autosave 后的新故事入口走，不要直接 continue。

### 2. autosave / continue 风险

代码路径：

- `saveAutoProgress()` 保存字段：`nodeId`、`playerName`、`nagiCall`、variables、timestamp、sceneTitle。
- `continueGame()` 从 autosave 的 `nodeId` 恢复，并调用 `navigateToNode(slot.nodeId)`。
- `loadGame(slotId)` 对普通存档同理。

结论：

- autosave 不保存 `dialogueIndex`、`phase`、`pendingNextId`、`responseQueue`、`responseIndex`、`pendingNodeAfterTransition`。
- 恢复时会从保存 node 的开头进入，不能恢复到旧 response 中间态。
- 如果旧存档 nodeId 落在已被改写/拆分过的节点，实机观感可能像“剧情跳了/错位”。这类问题应归为旧存档状态污染，不能用来判定 clean story 的 `story-data` 错。

### 3. choice response 后状态

代码路径：

- 选择时：`onChoiceSelected()` 设置 `pendingNextId = engine.processChoiceTransition(choice)`。
- 有 responses：进入 `responseQueue`，`responseIndex = 0`，逐句播放。
- responses 播完：`advanceAfterChoice()` 使用 `pendingNextId ?: engine.getNextNodeId(currentNodeId, gameState)`，随后立即 `pendingNextId = null`。
- 进入新 node：`enterNode()` 统一重置：
  - `responseQueue = emptyList()`
  - `responseIndex = 0`
  - `pendingNextId = null`

结论：

- 静态代码看，response 播放完后不会沿用上一个 node 的 `nextId`。
- `e_lemontea_s2` 两个选择没有显式 target，因此会按 flow default 进入 `c2`，符合 PM 口径。

### 4. section transition / pendingNodeAfterTransition

代码路径：

- 大章切换时：`pendingNodeAfterTransition = found`，显示 ChapterEnding。
- 小节切换时：`pendingNodeAfterTransition = found`，显示 SectionTransition。
- 用户点击转场页：
  - `GamePhase.ChapterEnding` 中取出 pending 后立即置空；
  - `GamePhase.ChapterTransition / SectionTransition` 中取出 pending 后立即置空；
  - 然后 `enterNode(pending)`。

结论：

- 静态代码看，`pendingNodeAfterTransition` 在点击进入后会清空，不应残留到开放日后续节点。
- 如果实机复现，应优先看 debug overlay 的 `currentNodeId` 是否在转场点击后仍停留旧 pending。

### 5. 选择过滤箭头风险

代码路径：

- `StoryEngine.getPlayerVisibleChoices()` 负责过滤：
  - `!choice.autoAdvance`
  - `choice.label != "→"`
  - `choice.label.isNotBlank()`
- `GameViewModel.presentChoices()` 已改为调用 engine 的统一过滤方法。

结论：

- autoAdvance 箭头不会作为玩家选项显示。
- ViewModel 不再保留一份重复的箭头过滤字面量。

## 本次修改文件

- `android/app/src/main/java/com/antnagi/nagisheart/ui/viewmodel/GameViewModel.kt`
  - `presentChoices()` 改为 `engine.getPlayerVisibleChoices(currentChoices, gameState)`。

未修改：

- `story-data/nodes.json`
- `story-data/flow.json`
- `story-data/scene_visuals.json`
- authority 剧本文档

## 校验

- `node tools/validate.js`：通过，0 errors / 1 existing warning。

## 截图阻塞

本机仍无法产出 Android 实机/模拟器截图：

- `android/gradlew.bat` 不存在；
- `android/gradle/wrapper/gradle-wrapper.jar` 不存在；
- 系统未找到可用 Gradle。

因此本报告只能提供静态 runtime 数据表与代码路径证据，不能替代 Ant 实机验收截图。

## Ant 实机补截图要求

请从清空 autosave / 新故事开始，逐步截图以下节点，截图需打开 debug overlay 或能显示同等信息：

1. `u20j`
2. `c3`
3. `c3_s2`
4. `e_lemontea`
5. `e_lemontea_s2`
6. `c2`

每张截图需要包含：

- `currentNodeId`
- `sceneTitle`
- `bgAssetPath`
- 当前可见文本首句/末句或当前可见文本

判定：

- 若 clean new story 按上表进入：开放日 story-data 可关闭，问题归为旧存档/实机状态污染。
- 若 clean new story 不按上表进入：修 Android 运行层，仍不改 story 文案。
- 只有截图证明 `story-data` target 错，才允许改 `story-data`。
