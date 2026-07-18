# TASK-20260718-006 回传：Android 实机功能 bug 修复

- 任务编号：TASK-20260718-006
- 负责人：yiyi
- 状态：review（等待实机构建验证）
- 日期：2026-07-18

---

## 修改文件清单

| 文件 | 改动内容 |
|------|---------|
| `GameViewModel.kt` | 三处 transition return 前新增 `bgAssetPath` 更新：chapter transition、section transition、skipSection |
| `GameScreen.kt` | `ChapterOpeningOverlay` 和 `SectionOpeningOverlay` 新增 `onTap` 参数 + root Box 加 `clickable` modifier |
| `android/app/src/main/assets/bgm/bgm.mp3` | **新增**：从 repo `assets/bgm.mp3` 复制到 Android assets 路径 |

---

## 根因说明

### Bug 1：opening 背景错（显示上一节点的 Nagi 抱枕背景）

**根因**：`enterNode()` 在检测到 chapter/section transition 时，设置 `pendingNodeAfterTransition = found` 后立即 `return`，此时 `_uiState` 中的 `bgAssetPath` 仍是上一个节点的背景。`ChapterOpeningOverlay` / `SectionOpeningOverlay` 读取的 `state.bgAssetPath` 是旧值。

**修复**：在三个 return 路径（chapter transition、section transition、skipSection）中，从 `found.visual?.bg` 提取待进入节点的背景，在 `_uiState.update` 时一并更新 `bgAssetPath`。

### Bug 2：opening 轻触不能继续（卡住）

**根因**：`ChapterOpeningOverlay` / `SectionOpeningOverlay` 的 root `Box` 没有 `clickable` modifier。虽然 GameScreen 在 `when` 块之前渲染了一个 fullscreen tap target，但 overlay 在 Compose z-order 上覆盖了 tap target，导致触摸事件不能可靠传递到下层。

**修复**：给两个 overlay composable 新增 `onTap: () -> Unit` 参数，root Box 加 `clickable(indication = null, onClick = onTap)` 直接响应轻触。调用处传入 `viewModel.onTap()`。

### Bug 3：BGM 断链（实机不播放）

**根因**：`scene_visuals.json` 中所有场景的 BGM 引用为 `"bgm/bgm.mp3"`（无 `assets/` 前缀）。`enterNode()` 中 `removePrefix("assets/")` 不改变此路径，`BgmManager.play("bgm/bgm.mp3")` 调用 `context.assets.openFd("bgm/bgm.mp3")`，期望文件位于 `android/app/src/main/assets/bgm/bgm.mp3`。但该目录及文件不存在，BGM 文件仅在 repo root `assets/bgm.mp3`。

**修复**：将 `assets/bgm.mp3` 复制到 `android/app/src/main/assets/bgm/bgm.mp3`（4.7MB）。Android `context.assets.openFd("bgm/bgm.mp3")` 现在可以找到文件。

---

## 验证点

1. **Opening 背景**：每个 chapter / section transition 的 opening 页面现在会显示即将进入节点的 `visual.bg` 背景，而非上一节点的背景。
2. **Opening 轻触继续**：chapter opening 和 section opening 页面现在有自己的全屏 clickable area，轻触即可继续进入节点内容。
3. **BGM**：Android asset 路径 `bgm/bgm.mp3` 现在有实际文件（4.7MB），`BgmManager` 可以打开并播放。

以上均为代码级修复，需实机构建验证。

---

## 未改动范围

- Web：未触碰
- story-data 正文 / nodes.json / scene_visuals.json：未触碰
- BG mapping 权威：未触碰
- HUD / Dialog UI（004 范围）：未触碰
- App Icon：未触碰
- TT Start：未触碰
- 资源清理 / 删除：无

---

## Cleanup status

None。本轮仅新增 `bgm/bgm.mp3` 到 Android assets，未删除任何资源。

---

## Android touched

- `GameViewModel.kt`：是（transition bgAssetPath 更新）
- `GameScreen.kt`：是（opening overlay clickable）
- `android/app/src/main/assets/bgm/bgm.mp3`：新增

## Web touched

No.
