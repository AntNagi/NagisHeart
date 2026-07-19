# Phase A Pre-Implementation Alignment — Section Clear Removal P0

- Task ID: `TASK-20260719-013`
- Phase: A (alignment only, no code)
- From: PP (Android)
- To: PM 一一
- Date: 2026-07-19
- Status: `awaiting_pm_approval`

---

## 1. Authority 目标

### §17.6 小章节结束页移出当前范围

> standalone Section Clear / 小章节结束页已从当前产品范围移除。
> - 小节正常结束后直接进入下一小节 opening。
> - 如果当前小节是大章最后一小节，进入 Chapter Clear。
> - 如果当前节点已到 story ending，进入 terminal ending page。

### §17.3 跳过弹窗文案关联

当前跳过弹窗文案写"跳过后将直接进入本节结束页"，指向已移除的 Section Clear 页面。需要同步修改文案。

任务单推荐文案：
- 有标题：`确定跳过「{sectionTitle}」？跳过后将直接进入后续内容。`
- 无标题：`确定跳过当前章节？跳过后将直接进入后续内容。`

---

## 2. 当前 Active Path（完整追踪）

### 2.1 Route 定义

| 位置 | 文件 | 行号 | 内容 |
|---|---|---|---|
| Route 常量 | `NavGraph.kt` | :21 | `const val SECTION_CLEAR = "sectionClear"` |
| Route 注册 | `NavGraph.kt` | :108-129 | `composable(Routes.SECTION_CLEAR) { SectionClearScreen(...) }` |
| 导航触发 | `NavGraph.kt` | :207-210 | `onNavigateToSectionClear = { navController.navigate(Routes.SECTION_CLEAR) { popUpTo(Routes.GAME) { inclusive = true } } }` |

### 2.2 GameScreen 跳过弹窗

| 位置 | 文件 | 行号 | 内容 |
|---|---|---|---|
| 参数声明 | `GameScreen.kt` | :42 | `onNavigateToSectionClear: () -> Unit = {}` |
| 弹窗文案 | `GameScreen.kt` | :277-278 | `"确定跳过「$sectionTitle」？跳过后将直接进入本节结束页。"` / `"确定跳过当前章节？跳过后将直接进入本节结束页。"` |
| 确认回调 | `GameScreen.kt` | :281-283 | `viewModel.skipSection()` → `onNavigateToSectionClear()` |

### 2.3 GameViewModel 函数

| 函数 | 文件 | 行号 | 行为 |
|---|---|---|---|
| `skipSection()` | `GameViewModel.kt` | :322-360 | 标记 section 跳过，resolve 下一个 startNode，存入 `pendingNodeAfterTransition`，设置 phase 为 `ChapterTransition` |
| `advanceAfterSectionClear()` | `GameViewModel.kt` | :798-804 | 从 `pendingNodeAfterTransition` 取出 pending 节点，调用 `enterNode()` 进入 |

### 2.4 SectionClearScreen 组件

| 位置 | 文件 | 行号 | 内容 |
|---|---|---|---|
| 整个文件 | `SectionClearScreen.kt` | :1-138 | 独立全屏页面，显示 "SECTION CLEAR"，两个按钮"返回目录"/"进入下一节" |

### 2.5 正常小节结束路径（非跳过）

| 函数 | 文件 | 行号 | 行为 |
|---|---|---|---|
| `advanceDialogue()` 内部 | `GameViewModel.kt` | :564-576 | 检测到新 section → 设置 `phase = SectionTransition` + `SectionTransitionInfo` → 显示 SectionOpeningOverlay |
| `advanceDialogue()` 内部 | `GameViewModel.kt` | :538-556 | 检测到新 chapter → 设置 `phase = ChapterEnding` → 显示 ChapterEndingOverlay（"CHAPTER CLEAR"） |
| `onTap()` on `SectionTransition` | `GameViewModel.kt` | :458-464 | 从 `pendingNodeAfterTransition` 取出节点 → `enterNode()` |

**关键发现**：正常小节结束流程**不经过 SectionClearScreen**。它直接在 GameScreen 内使用 `SectionOpeningOverlay`（下一节开场）或 `ChapterEndingOverlay`（大章结束）。Section Clear 页面**只在跳过流程中出现**。

---

## 3. 当前错误行为 vs 目标行为

| 场景 | 当前行为 | 目标行为（§17.6） |
|---|---|---|
| **正常小节结束** | → `SectionOpeningOverlay`（下一节开场） | → `SectionOpeningOverlay`（下一节开场）**（已正确，无需改动）** |
| **正常大章最后一节结束** | → `ChapterEndingOverlay`（CHAPTER CLEAR） | → `ChapterEndingOverlay`（CHAPTER CLEAR）**（已正确，无需改动）** |
| **正常到达 ending 节点** | → `EndingOverlay`（终局页） | → `EndingOverlay`（终局页）**（已正确，无需改动）** |
| **跳过小节确认弹窗** | 文案："跳过后将直接进入**本节结束页**" | 文案："跳过后将直接进入**后续内容**" |
| **跳过确认后导航** | `skipSection()` → 导航到 `Routes.SECTION_CLEAR`（独立页面） → 用户点"进入下一节" → `advanceAfterSectionClear()` | `skipSection()` → **直接进入下一内容**（下一节 opening / chapter clear / ending），不显示 Section Clear 页面 |

---

## 4. 最小改动文件清单

| # | 文件 | 改动内容 | 必要性 |
|---|---|---|---|
| 1 | `GameScreen.kt` | (a) 修改跳过弹窗文案：`进入本节结束页` → `进入后续内容`；(b) 确认回调中移除 `onNavigateToSectionClear()`，改为 `skipSection()` 后直接由 ViewModel 驱动后续流程 | **必须** |
| 2 | `GameViewModel.kt` | 修改 `skipSection()`：跳过后不设置 `ChapterTransition` phase 等待 SectionClear 页面消费，而是直接调用 `advanceAfterSectionClear()` 的等效逻辑（检查 pending 节点 → enterNode / 设置 SectionTransition / ChapterEnding / Ending phase） | **必须** |
| 3 | `NavGraph.kt` | 移除 `composable(Routes.SECTION_CLEAR)` 路由注册；移除 `onNavigateToSectionClear` 回调传递；可保留 `Routes.SECTION_CLEAR` 常量（或一并清理） | **必须** |
| 4 | `SectionClearScreen.kt` | **不删除文件**（按任务单要求，除非 PM 明确批准）。移除路由引用后该文件变为 unused 代码。 | 不改动 |

### 不改动的文件

| 文件 | 原因 |
|---|---|
| `SectionClearScreen.kt` | 保留为 unused cleanup candidate，不删除 |
| `DialogueLayer.kt` | 不涉及 |
| `NagiHud.kt` / `NagiIconButton.kt` | 不涉及 |
| `NagiDialog.kt` | NagiDialog 组件本身不改，只改 GameScreen 中调用时传入的 text 参数 |
| `StoryEngine.kt` | 不涉及 |
| `EndingOverlay` / `ChapterEndingOverlay` | 不涉及 |
| Web / story-data / BG mapping / authority_current | 禁止范围 |

---

## 5. skipSection() 改动设计细节

当前 `skipSection()` 的逻辑（:322-360）：
1. 标记 section 跳过
2. 找到下一个 startNode
3. resolve 该节点，存入 `pendingNodeAfterTransition`
4. 设置 `phase = ChapterTransition`（这里不正确——应该根据实际情况设置不同 phase）

**改动方案**：`skipSection()` 执行完步骤 1-3 后，不再设置 `ChapterTransition` phase 等待外部导航，而是直接判断下一步走向：

```
if pendingNodeAfterTransition 是 EndingReached → showEnding()
else if nextSectionIndex < chapter.sections.size → 设置 SectionTransition phase（显示下一节 Opening）
else if 有下一章 → 设置 ChapterEnding phase（显示 CHAPTER CLEAR）
else → 设置 Ending 或回到 Home
```

`onTap()` 已经处理了 `SectionTransition` 和 `ChapterEnding` phase 的后续导航，所以跳过后显示的 opening/clear 页面可以正常被点击推进。

---

## 6. 截图验证计划

| 截图 ID | 目标状态 | 验证内容 | 预期结果 |
|---|---|---|---|
| `A04_skip_dialog_copy_after.png` | 跳过弹窗 | 文案不含"本节结束页" | 显示"跳过后将直接进入后续内容" |
| `A10_after_skip_no_section_clear.png` | 确认跳过后 | 下一个画面 | 显示 SectionOpeningOverlay（下一节开场），而非 SectionClearScreen |
| `A10_normal_section_end_no_section_clear.png` | 正常小节结束 | 自然推进 | 显示 SectionOpeningOverlay，无 Section Clear |
| `A11_chapter_clear_if_reached.png` | 大章最后一节跳过 | 跳过后 | 显示 ChapterEndingOverlay（CHAPTER CLEAR） |

**注**：A10 正常结束和 A11 需要足够的剧情推进，可能需要多次跳过到达特定位置。如无法到达，将记录复现 blocker。

---

## 7. 风险检查

| 风险项 | 分析 | 结论 |
|---|---|---|
| Chapter Clear 是否受影响？ | Chapter Clear 通过 `ChapterEndingOverlay`（inline overlay in GameScreen）触发，走 `GamePhase.ChapterEnding`，不涉及 `sectionClear` route | **无影响** |
| Ending page 是否受影响？ | Ending 通过 `EndingOverlay`（inline overlay in GameScreen）触发，走 `GamePhase.Ending` | **无影响** |
| 存档系统是否受影响？ | `skipSection()` 中的 `markSectionSkipped()` 仍会执行，只是跳过后不再导航到 SectionClear 页面 | **无影响** |
| Backlog 是否受影响？ | Backlog 通过 `Routes.BACKLOG` 独立路由 | **无影响** |
| 正常小节结束是否受影响？ | 正常小节结束**从来不经过 SectionClearScreen**（走 inline overlay），本次修改不触碰正常结束路径 | **无影响** |
| `advanceAfterSectionClear()` 移除后 | 该函数只在 `NavGraph.kt:123` 的 SectionClear route 回调中调用。移除 route 后该函数变为 dead code，可保留或清理 | **低风险** |
| skipSection() resolve 失败 | 如果 `nextStartNode` 为 null（无下一节、无下一章），当前已有兜底：pendingNodeAfterTransition 为 null。需确保改动后这种情况不会导致空白屏幕 | **需处理**：null 时应回到 Home |

---

## 总结

本次改动范围极窄：
- **3 个文件**需要修改（`GameScreen.kt`, `GameViewModel.kt`, `NavGraph.kt`）
- **1 个文件**不改动但变为 unused（`SectionClearScreen.kt`）
- 正常小节结束路径**完全不受影响**（它本来就不走 SectionClear）
- 只有**跳过流程**需要改动：弹窗文案 + 跳过后直接进入后续内容而非 Section Clear 页面

等待 PM 审批后进入 Phase B 实现。
