# yiyi Full Scope Dev Reply

> Developer: yiyi (Claude Dev)
> Date: 2026-07-11 23:30
> Responding to: TASK_TO_YIYI_20260711_FULL_SCOPE.md
> Codebase audited: NavGraph.kt, GameViewModel.kt, NameSetupScreen.kt, GameScreen.kt, SaveManager.kt, StoryModels.kt, all UI screens/components

## Summary

已完整读取 PRD v2.0、交互设计 v1.0、PM 审计确认文档、两份状态报告（dev 12:30 + QA 19:30），并对 Android 工程全量源码做了模块级核查。以下是按 PM 任务单逐项的理解确认、当前状态判定、实现计划和阻塞项。

## Confirmed Understanding

我确认理解以下全量产品逻辑，且不再沿用旧方案：

1. **首次/后续进入**：首次 = 开屏 → 开场白 → 名字设置 → 第一章第一页。后续 = 开屏 → 主页。判定依据是默认进度（auto-save slot 0）是否存在。
2. **继续故事**：只读默认进度（slot 0），不读手动存档。无默认进度时不显示此按钮。
3. **新的故事**：重置默认进度（删 slot 0），从第一章第一页重新开始。**不删除**手动存档（slot 1-6）。
4. **HUD**：左=返回 | 中=章节标题 | 右=自动播放/停止、存档、剧情回顾。不再有 Menu/菜单概念。最右按钮从"菜单"改为"剧情回顾"。
5. **手动存档**：HUD 存档按钮写入手动档 → 提示"存档成功" → 主页"存档进度"可查看。
6. **默认进度 vs 手动存档**：两者分离。默认进度自动维护（slot 0），手动存档玩家触发（slot 1-6+）。
7. **剧情回顾**：展示当前章节从开头到当前句的全部已播内容（对白+旁白+已选选项后的展示内容），不显示未来内容。
8. **nagiCall**：名字设置页第二个输入框收集。写入存档/默认进度。在正文、speaker、choice、response、backlog 全部替换。一一固定叫"Nagi少爷"和"Ant大小姐"。
9. **对白引号**：代码不自动加引号，script 文本即最终展示。
10. **`->` 自动跳转**：不渲染成玩家可见选项。
11. **长旁白**：整页毛玻璃阅读层，禁止滚动，按实际排版分页，翻页提示+页码，自动播放逐页推进。
12. **章节开始页/结束页**：每章必备，隐藏 HUD。结束页更新默认进度，不是手动存档，不显示"存档成功"。

## Must-Fix Items

| ID | Task | Current Status | Files / Modules | Fix Plan | Dependency | Estimate |
|---|---|---|---|---|---|---|
| A-1 | 首次进入流程 | ✅ 已实现 | NavGraph.kt:33-47 | Splash 判定 `hasPlayed()` → 首次走 Prologue → NameSetup → Game；后续走 Start。**已正确**。 | 无 | 0h |
| A-2 | 继续故事显隐 | ✅ 已实现 | StartScreen.kt:54-56, NavGraph.kt:77 | `hasSave` 控制显隐，`continueGame()` 读 auto-save slot 0。**已正确**。 | 无 | 0h |
| A-3 | 新的故事不删手动存档 | ✅ 已实现 | GameViewModel.kt:201-203 | `resetAndStartNew()` 只删 auto-save（slot 0），不碰手动档。**已正确**。 | 无 | 0h |
| A-4 | 新的故事缺二次确认弹窗 | ❌ 缺失 | NavGraph.kt:83-87 | 直接调用 `resetAndStartNew()`，无确认弹窗。需加 AlertDialog：「是否从头开始？当前自动进度将被覆盖，但手动存档不会删除。」 | 无 | 0.5h |
| B-1 | HUD 存档提示"存档成功" | ❌ 缺失 | GameScreen.kt, GameViewModel.kt | `saveGame()` 无成功回调/toast。需加：①ViewModel 返回保存结果 ②GameScreen 显示 Snackbar/Toast「存档成功」 | 无 | 0.5h |
| B-2 | 手动存档数量扩充 | ⚠️ 当前仅 6 槽 | SaveLoadScreen.kt:57 | PRD 建议不少于 30 条。当前 `for (i in 1..6)`。需扩充存档槽数量 + 改为 LazyColumn | 无 | 1h |
| C-1 | HUD 最右按钮改为"剧情回顾" | ⚠️ 部分完成 | NagiHud.kt:87, NavGraph.kt:126-127 | 当前 `onMenu` 已路由到 Backlog。但 icon/语义仍叫 Menu，需确认 icon 是否换。**逻辑已正确，icon 待 XoXo 确认** | XoXo icon | 0.5h |
| C-2 | HUD 返回按钮 | ✅ 已实现 | NagiHud.kt:48, NavGraph.kt:119-124 | `onBack` 已实现，保存自动进度后返回 Start。 | 无 | 0h |
| C-3 | HUD 存档按钮行为 | ✅ 路由正确 | NavGraph.kt:113-115 | 导航到 `saveLoad("save")` 页面。缺 B-1 的成功提示。 | B-1 | 0h |
| D-1 | 剧情回顾内容完整性 | ⚠️ 部分完成 | BacklogScreen.kt, GameViewModel.kt | 当前 Backlog 记录对白和旁白，**缺已选选项记录**。需在 `handleChoice()` 中把选择结果写入 backlog。 | 无 | 1h |
| D-2 | 剧情回顾范围=当前章节 | ⚠️ 未按章节隔离 | GameViewModel.kt:84 | `backlog` 是全局列表，未按章节分隔。需要在章节切换时清空或分段。 | 无 | 1h |
| E-1 | 代码不自动加引号 | ✅ 无此问题 | 全局搜索无引号添加代码 | 不存在自动加引号逻辑。 | 无 | 0h |
| E-2 | `->` 不渲染为选项 | ✅ 已实现 | GameViewModel.kt:410-414, 466-470 | `autoAdvance` 单选项已被引擎静默处理，不进入 `presentChoices()`。 | 无 | 0h |
| E-3 | `{{playerName}}` 替换 | ✅ 已实现 | GameViewModel.kt:439-440, 488, 507-508 | 对话、speaker、choice、response 四处全部替换。 | 无 | 0h |
| E-4 | `{{nagiCall}}` 替换 | ⚠️ 代码已实现，但输入/存储缺失 | GameViewModel.kt:76, 439-440, 488, 507-508 | 替换链已加入。**但**：①NameSetupScreen 无第二输入框 ②SaveSlot 无 `nagiCall` 字段 ③`continueGame()`/`loadGame()` 不恢复 nagiCall | 无 | 1.5h |
| E-5 | 一一固定称呼 | ❌ 未实现 | story data / GameViewModel | 一一对 Nagi 叫"Nagi少爷"、对玩家叫"Ant大小姐"。需要确认：这些称呼是写在 script 里还是需要代码特殊处理。如果 script 已正确使用这些称呼，无需代码改动。 | script 数据确认 | 0-1h |
| F-1 | 长旁白合并与分页 | ❌ 未实现 | DialogueLayer.kt, GameViewModel.kt | 当前三种 display：bottom/center/fullscreen，但无合并、无分页、无翻页提示。需要全新的长旁白系统。 | 数据结构变更 | 4-6h |
| F-2 | 短旁白/长旁白/对白字体区分 | ⚠️ 部分实现 | NagiTypography.kt, DialogueLayer.kt | dialogue(18→17sp) 和 narration(16sp italic) 已区分。fullscreen narration 存在但没有分页。 | 无 | 1h |
| G-1 | 章节开始页 | ⚠️ 部分实现 | GameViewModel.kt:369-376, ChapterTransitionOverlay | `ChapterTransition` phase 已存在，但只是过渡动画，不是独立全屏状态。缺 HUD 隐藏、触控提示。 | 数据结构 | 2h |
| G-2 | 章节结束页 | ❌ 未实现 | 需新增 ChapterEndOverlay | 完全没有结束页概念。需要：①识别章节最后一个节点 ②渲染结束页 ③主操作按钮 ④更新默认进度（不是手动存档） | 数据结构 | 3h |

## Data Structure Changes Needed

### 1. SaveSlot 增加 nagiCall 字段

```kotlin
// StoryModels.kt
data class SaveSlot(
    val id: Int,
    val nodeId: String,
    val playerName: String,
    val nagiCall: String = "凪",          // 新增
    val dialogueIndex: Int = 0,           // 新增：句子序号，PRD 要求精确恢复
    val variables: Map<String, JsonElement>,
    val timestamp: Long,
    val sceneTitle: String = ""
)
```

### 2. DialogueLine 增加叙事块和显示语义

```kotlin
data class DialogueLine(
    val id: String,
    val speaker: String = "",
    val text: String,
    val display: String = "bottom",       // 现有
    val blockId: String? = null,          // 新增：连续叙事块 ID
    val forceDisplay: String? = null,     // 新增：编辑强制指定 short/long
    val paragraphBreak: Boolean = false   // 新增：段落边界
)
```

### 3. Chapter 增加开始页/结束页结构

```kotlin
data class Chapter(
    val id: String,
    val name: String,
    val title: String,
    val timeRange: String? = null,
    val sections: List<ChapterSection>,
    val startPageData: ChapterPageData? = null,   // 新增
    val endPageData: ChapterPageData? = null       // 新增
)

data class ChapterPageData(
    val subtitle: String? = null,
    val quote: String? = null,
    val timeLocation: String? = null
)
```

### 4. BacklogEntry 增加类型

```kotlin
data class BacklogEntry(
    val speaker: String,
    val text: String,
    val type: String = "dialogue"   // "dialogue" | "narration" | "choice" | "system"
)
```

## Routing / Save Logic Changes Needed

### 1. NameSetupScreen → 两步输入

当前：单输入框收集 playerName，回调 `onConfirm(name: String)`
需改：两步收集 playerName + nagiCall，回调 `onConfirm(name: String, nagiCall: String)`

NavGraph.kt 对应修改：

```kotlin
composable(Routes.NAME_SETUP) {
    NameSetupScreen(
        onConfirm = { name, nagiCall ->
            gameViewModel.startNewGame(name, nagiCall)  // 签名变更
            gameViewModel.saveAutoProgress()
            navController.navigate(Routes.GAME) { ... }
        }
    )
}
```

### 2. GameViewModel.startNewGame() 签名变更

```kotlin
fun startNewGame(name: String, nagiCall: String = "凪") {
    playerName = name
    this.nagiCall = nagiCall
    // ...
}
```

### 3. 存档保存/读取加入 nagiCall

`saveGame()`、`saveAutoProgress()` 写入 nagiCall。
`loadGame()`、`continueGame()` 恢复 nagiCall。

### 4. 剧情回顾按章节隔离

在 `navigateToNode()` 检测到章节切换时：

```kotlin
if (newChapterId != currentChapterId) {
    backlog.clear()  // 或 backlogByChapter[currentChapterId] = backlog.toList()
    currentChapterId = newChapterId
}
```

### 5. 章节结束页路由

在节点推进逻辑中检测章节边界：

```kotlin
if (isLastNodeInChapter(currentNodeId, currentChapterId)) {
    // 进入 ChapterEnd phase
    saveAutoProgress()  // 更新默认进度
    // 不弹"存档成功"
}
```

## What I Can Implement Before Final Visual Spec

以下不依赖 XoXo 最终视觉稿，可以立即开始：

1. **NameSetupScreen 增加 nagiCall 输入框** — 交互逻辑、数据流、存储全部可以先做
2. **SaveSlot 增加 nagiCall 字段 + 全链路读写** — 纯数据层改动
3. **SaveSlot 增加 dialogueIndex 字段 + 精确恢复** — 纯数据层改动
4. **HUD 存档成功 Toast/Snackbar** — 使用 Compose 原生 Snackbar
5. **剧情回顾增加已选选项记录** — `handleChoice()` 写入 backlog
6. **剧情回顾按章节隔离** — backlog 清空/分段逻辑
7. **新的故事二次确认弹窗** — AlertDialog
8. **长旁白数据结构变更** — DialogueLine 增加 blockId、forceDisplay、paragraphBreak
9. **长旁白合并判定逻辑** — 连续无 speaker 旁白的合并规则
10. **长旁白分页计算引擎** — 按实际文字高度分页（TextMeasurer）
11. **长旁白分页渲染** — 整页毛玻璃 + 翻页指示 + 页码
12. **章节开始页完整化** — 改为独立全屏、隐藏 HUD、显示触控提示
13. **章节结束页** — 新增 phase、overlay、主操作按钮
14. **存档槽扩充** — 改为 LazyColumn + 30 槽

## What Must Wait For XoXo Final Spec

1. **HUD "剧情回顾"按钮 icon** — 当前用 Menu icon，需要 XoXo 提供正式 icon
2. **长旁白整页毛玻璃的视觉参数** — 模糊半径、遮罩透明度、字体大小。PM 给了初始建议值（20dp blur + 48% 遮罩），可以先用。
3. **章节开始页/结束页的视觉设计** — 布局、字体、装饰元素
4. **翻页提示的视觉设计** — 图标样式、位置
5. **存档成功提示的视觉样式** — Toast vs Snackbar vs 自定义动画

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| **SaveSlot 增字段后旧存档不兼容** | 读取旧存档时 nagiCall/dialogueIndex 缺失导致 crash | Kotlin serialization 默认值可兼容，但需测试 |
| **长旁白分页依赖运行时排版** | TextMeasurer 在不同设备/字体缩放下结果不同 | 必须用 Compose TextMeasurer API，不能预计算 |
| **story data 缺少 blockId/forceDisplay** | 长旁白合并判定无法精确执行 | 先实现运行时自动判定（连续无 speaker 旁白计数），后续 script 补充结构化字段 |
| **gradlew 不在仓库** | 无法在此环境编译验证 | 所有修改只能代码审查。需要 Ant 老板恢复 gradlew 或提供编译环境 |
| **源码未 commit** | APK 不可复现，QA 无法对齐版本 | 建议下一轮交付前先 commit 全部 Android 源码 |

## Implementation Order (aligned with PM priority)

```
P1. nagiCall 全链路：NameSetup 第二输入 → SaveSlot 字段 → VM 存/读 → 全部替换位置
P2. HUD 存档成功提示（Toast/Snackbar）
P3. HUD 最右按钮语义 = 剧情回顾（icon 暂用 Menu，等 XoXo）
P4. 剧情回顾内容完善：加已选选项 + 按章节隔离
P5. 新的故事二次确认弹窗
P6. 长旁白系统：数据结构 → 合并判定 → 分页引擎 → 整页毛玻璃渲染 → 翻页指示
P7. 章节开始页完整化 + 章节结束页新增
P8. 存档槽扩充至 30
```

预计总工作量：**12-16h**。其中 P1-P5 可在 4h 内完成，P6 是最大块（4-6h），P7 次之（3-5h）。
