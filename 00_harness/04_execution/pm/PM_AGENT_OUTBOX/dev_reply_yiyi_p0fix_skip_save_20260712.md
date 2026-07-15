# Dev Reply — yiyi → PM
**Date**: 2026-07-12  
**Re**: TASK_TO_YIYI_20260712_SUPPLEMENT_SKIP_SAVE.md

---

## P0 解析层修复 (Parsing Layer Fix)

**修复层**: 解析层 (`GameViewModel.kt` → `onTap()`)

**问题**: 长旁白块结束后，`dialogueIndex` 已正确指向下一行，但 `onTap()` 仍调用 `advanceDialogue()` 再次递增，导致跳过第一句人物对白。

**修复方案**: 在 `onTap()` 中检测 `displayType == "long_narration"`，若是则直接调用 `showDialogueLine()` 而不递增 index。

**验证**: `{{playerName}}` 作为 speaker 不是空白（contains `{`, `p` 等字符），永远不会进入旁白检测路径。第一章所有有 speaker 的行（"他是谁？"、"不用。"、"框架没有问题…"等）均走对白容器。

---

## 跳过本节 (Skip Section)

已实现：
- `GameViewModel.skipSection()`: 停止自动/快进，标记当前 section 为 `skipped_completed`，跳转到下一 section 的 startNode
- `ProgressManager.markSectionSkipped()`: 持久化跳过记录
- GameScreen 中添加「跳过本节」按钮（独立于 HUD），点击后弹出二次确认对话框
- 若无下一 section，自动跳到下一大章的第一 section

---

## 存档扩展 (Save Slots)

已实现：
- 存档位从 6 扩展至 10
- 已有存档的位覆盖时弹出确认对话框（"覆盖存档"）
- 空白位直接保存，无需确认

---

## 修改文件清单

| 文件 | 修改内容 |
|------|----------|
| `GameViewModel.kt` | P0 off-by-one fix in `onTap()`; `skipSection()`; `getCurrentSectionTitle()`; section tracking fields |
| `ProgressManager.kt` | `markSectionSkipped()`, `getSkippedSections()` |
| `GameScreen.kt` | Skip section button + confirmation dialog |
| `SaveManager.kt` | 1..6 → 1..10 |
| `SaveLoadScreen.kt` | 10 slots, overwrite confirmation |
