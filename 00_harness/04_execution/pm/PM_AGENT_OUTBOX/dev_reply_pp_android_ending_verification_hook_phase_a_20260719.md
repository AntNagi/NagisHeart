# Phase A Pre-Implementation Alignment — Android Ending Verification Hook

- Task ID: `TASK-20260719-015`
- Phase: A (alignment only, no code)
- From: PP (Android)
- To: PM 一一
- Date: 2026-07-19
- Status: `awaiting_pm_approval`

---

## 1. Authority

### §18.1 Ending page action model

- Terminal ending page 只保留 1 个可见动作：`返回主页`
- 三层结构：Content（tag/title/description） → Status feedback（轻量解锁文案 11sp） → Primary action（返回主页）
- Gallery unlock 是后台状态结果，非结局页按钮

### §18.2 Home after-ending state

- 当 ending 已完成并返回 Home，primary CTA 必须显示 `新的故事`
- 禁止显示 `继续故事`

### §18.3 Prologue typography

- Prologue 正文：28px (= 28sp Android), lineHeight 1.68

---

## 2. Current Ending Path（完整追踪）

### 2.1 触发条件

| 步骤 | 位置 | 行为 |
|---|---|---|
| StoryEngine resolve | `StoryEngine.kt:56` | `isEndingNode(currentId)` → 检查 `id.startsWith("end_")` 且 key 存在于 `endings.definitions` |
| NodeResolution.EndingReached | `StoryEngine.kt:12-14` | 返回 `endingId` + `definition` |
| showEnding() | `GameViewModel.kt:770-781` | (1) `progressManager.unlockEnding(endingId)`; (2) `saveManager.deleteAutoSave()`; (3) set `phase = GamePhase.Ending` + `ending = definition` |
| UI 渲染 | `GameScreen.kt:134-148` | `GamePhase.Ending` → `EndingOverlay(ending, bgAssetPath, onReturnToHome)` |
| 返回主页 | `NavGraph.kt:187-190` | `onReturnToHome` → `navController.navigate(Routes.START) { popUpTo(Routes.START) { inclusive = true } }` |
| Home CTA | `StartScreen.kt:55` | `hasCompletedEnding` → "新的故事" (来自 `GameViewModel.hasCompletedEnding()` = `progressManager.getUnlockedEndings().isNotEmpty()`) |

### 2.2 Gallery 解锁

| 步骤 | 位置 | 行为 |
|---|---|---|
| 解锁写入 | `ProgressManager.kt:20-24` | `unlockEnding(endingId)` → SharedPreferences 写入 set |
| Gallery 读取 | `GalleryScreen.kt:49` | `viewModel.getUnlockedEndings()` → 对比 definitions map |
| 显示 | `GalleryScreen.kt:52-63` | 4 个 ending key（true/good/normal/bad），`unlocked = key in unlockedEndings` |

### 2.3 Prologue

| 位置 | 行为 |
|---|---|
| `PrologueScreen.kt:106` | `fontSize = 28.sp` |
| 可到达条件 | 新玩家首次进入 或 "新的故事" → reset → Prologue |

---

## 3. Current Blocker — 为什么 QA 无法到达结局

story-data 中的结局判定路径极长：

- `end_true` 需要：`path === 'dream'` + `antCompress === false` + `witnessFlag === true` + `personalHonor === true` + `nagiNameIndependent === true` + `control <= 2` + `distance <= 3`
- 即使 `end_normal`（兜底）需要整个故事走完到达结局判定节点
- 当前 Chapter 1 有 6+ sections，每个 section 有大量 dialogue/choice 节点
- 手动播完全部内容需要大量时间，且必须做出特定选择才能到达结局判定

**不能通过 skip 到达结局**：skip 只跳到下一 section 的 startNode，不跳到结局判定节点。

---

## 4. Proposed Test Hook

### 方案：DEBUG-only `jumpToEnding(endingId)` 函数

在 `GameViewModel` 中添加一个 DEBUG-gated 函数，直接模拟到达指定结局：

```kotlin
fun debugJumpToEnding(endingId: String) {
    if (!BuildConfig.DEBUG_MODE) return
    val key = endingId.removePrefix("end_")
    val definition = engine.getEndingDefinition(key) ?: return
    showEnding(NodeResolution.EndingReached(endingId, definition))
}
```

### 触发方式：利用现有 HUD title 的 long-press

当前 HUD title chip（section 标题）已有 `long-clickable="true"`（uiautomator 确认），但未绑定 long-press action。

方案：在 DEBUG 模式下，long-press HUD title → 调用 `viewModel.debugJumpToEnding("end_true")`

这意味着：
1. 进入任何 gameplay 场景
2. Long-press 标题芯片
3. 直接触发 TRUE END 的完整结局流程（unlock + delete auto save + show EndingOverlay）
4. 点击"返回主页" → Home 显示"新的故事"
5. 进入"回忆画廊" → 看到 TRUE END 已解锁

### Safety

- `BuildConfig.DEBUG_MODE = false` in release builds → 函数直接 return
- Long-press 在 release 无任何效果
- 不修改 story-data
- 不修改 endings.json
- 不修改 production 行为
- 使用真实 `showEnding()` 路径，exercises real unlock/save/home logic

### Prologue 验证

Prologue 不需要 debug hook — QA 可通过：
1. 进入"新的故事" → Prologue 即为首屏
2. 或在 ending 后回到 Home → "新的故事" → Prologue

---

## 5. Files to Edit

| # | File | Change |
|---|---|---|
| 1 | `GameViewModel.kt` | 添加 `debugJumpToEnding(endingId)` 函数 (DEBUG-gated) |
| 2 | `GameScreen.kt` | HUD title chip 添加 DEBUG-only long-press handler |
| 3 | `StoryEngine.kt` | 添加 public `getEndingDefinition(key)` accessor（目前 endings 是 private） |

可能还需：
| 4 | `StoryEngine.kt` | 仅暴露一个 getter，无逻辑变更 |

### Files NOT to Edit

| File | Reason |
|---|---|
| story-data / endings.json | 禁止 |
| BG mapping | 禁止 |
| Web | 禁止 |
| UI authority | 禁止 |
| NavGraph.kt | 不需要新路由 |
| StartScreen.kt | 已正确实现 hasCompletedEnding |
| GalleryScreen.kt | 已正确实现 unlock 检测 |
| ProgressManager.kt | 已正确实现 unlockEnding |

---

## 6. Evidence Plan

| Screenshot | 到达路径 | 验证内容 |
|---|---|---|
| `android_B01_terminal_ending_page.png` | 进入 gameplay → long-press title → EndingOverlay 出现 | 三层结构：tag/title/description + status feedback + 仅"返回主页" |
| `android_B02_home_after_ending_new_story.png` | B01 → 点击"返回主页" → Home | CTA 显示"新的故事"，非"继续故事" |
| `android_B03_gallery_ending_unlocked.png` | B02 → 进入"回忆画廊" | TRUE END 条目显示为已解锁 |
| `android_B04_prologue_typography.png` | Home → "新的故事" → Prologue 首屏 | 正文 28sp 可见 |

---

## 7. Removal/Cleanup Plan

| Item | Status |
|---|---|
| `debugJumpToEnding()` | DEBUG-gated by `BuildConfig.DEBUG_MODE`；release APK 中函数体为空 return。可在后续 cleanup 中移除，但不影响 release 安全性。 |
| Long-press handler | 同样 DEBUG-gated；release 无效果 |
| `getEndingDefinition()` accessor | 纯 getter，无安全/功能影响，可保留 |

---

## 8. Risk Check

| 风险 | 分析 | 结论 |
|---|---|---|
| Release build 是否暴露 debug UI？ | `BuildConfig.DEBUG_MODE = false` in release → 函数直接 return，long-press 无效 | **无风险** |
| 是否修改 story-data？ | 不修改任何 JSON | **无风险** |
| 是否影响正常 gameplay？ | debug hook 仅在 long-press 时触发，不影响 tap/advance/choice 流程 | **无风险** |
| Gallery unlock 是否走真实路径？ | 使用 `showEnding()` → `progressManager.unlockEnding()` → 真实 SharedPreferences 写入 | **真实路径** |
| Home after ending 是否走真实路径？ | `showEnding()` → `deleteAutoSave()` → navigate to Start → `hasCompletedEnding()` check | **真实路径** |

---

## Summary

最小改动：3 个文件，1 个 DEBUG-gated 函数 + 1 个 long-press trigger + 1 个 getter。不改 story-data，不改 production 行为，exercises real ending path。等待 PM 审批后进入 Phase B。
