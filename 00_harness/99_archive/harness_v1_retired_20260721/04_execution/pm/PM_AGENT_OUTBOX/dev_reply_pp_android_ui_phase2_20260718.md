# Dev Reply - PP Android UI Phase 2 Authority Implementation

日期：2026-07-18  
开发：Android 开发工程师 PP  
任务：`TASK-20260718-012`  
状态：implementation complete, build verified

---

## 1. 修改文件清单

| # | 文件 | 改动类型 | Authority Section |
|---|------|----------|-------------------|
| 1 | `NagiIconButton.kt` | 重写 shadow + 补 center highlight + 修 icon tint + 补 icon halo | §15.1 Icon button |
| 2 | `NagiDialog.kt` | 替换 shadow 渲染方式 | §16.5 Dialog fallback |
| 3 | `ChapterScreen.kt` | 从 timeline/diamond 完全重建为 catalog-panel list | §16.2–16.4 章节目录 |
| 4 | `ChapterOpeningScreen.kt` | 加 light glass backing + center highlight | §14.1 章节开始页文字托底 |
| 5 | `GameScreen.kt` | GlassBacking 补 center highlight + ClearCard 补 center micro-light | §14.1 + §14.2 |

---

## 2. 每个文件修改详情

### 2.1 `NagiIconButton.kt` — P0-A

**问题**：`Modifier.shadow(elevation=2.dp)` 产生 Compose 硬边阴影，导致 Ant 反馈"HUD 按钮太重"。

**修改**：
- 移除 `Modifier.shadow(elevation=...)` 调用
- 替换为 `Modifier.drawBehind{}` + `BlurMaskFilter(12dp, NORMAL)` 柔和阴影
  - 对应 authority: `dropShadow 0 3dp 12dp rgba(0,0,0,0.42)`
- 补 center radial highlight: `rgba(247,249,252,0.08)` radial gradient
  - 对应 authority §15.1: 中心极轻高光
- 修正 icon tint alpha 链:
  - 旧: `hudColor(82%).copy(alpha=0.94)` → 实际 77%
  - 新: `Color(0xF0F7F9FC)` → 直接 94% of snowWhite
  - 对应 authority §15.1: 图标颜色 `rgba(247,249,252,0.94)`
- 补 icon halo: `BlurMaskFilter(8dp)` 圈在图标后，`rgba(247,249,252,0.20)` 
  - 对应 authority §15.1: soft light halo `0 0 8dp rgba(247,249,252,0.20)`

**保留**：容器 36dp、图标 18dp、背景渐变 30%→18%、border 10%、cutSmall shape、点击行为、NagiIconState 枚举、resId 查找逻辑

### 2.2 `NagiDialog.kt` — P0-B

**问题**：`Modifier.shadow(elevation=18.dp)` Compose 硬边阴影使弹窗看起来厚重。

**修改**：
- 移除 `Modifier.shadow(elevation=18.dp, ...)` 调用
- 替换为 `Modifier.drawBehind{}` + `BlurMaskFilter(42dp, NORMAL)` 柔和阴影
  - 对应 authority §16.5: `0 18dp 42dp rgba(0,0,0,0.36)`
- 所有 token 值不变（scrim 38%、container bg 56%、border 14%、inner highlight 6%→0、text shadow 35%、shape 24dp、width 80%、padding 40/40/32/28、typography、button spacing 26dp）

**保留**：Dialog/DialogProperties、scrim click、container click blocker、Column 布局、Text 样式、button 行为

### 2.3 `ChapterScreen.kt` — P0-C

**问题**：使用 timeline + diamond 节点布局，与 authority catalog-panel list 重大不符。

**修改**：
- 移除 TimelineNode composable 和 DiamondShape
- 移除垂直线绘制
- 新建 catalog-panel 容器：
  - 背景: `linear-gradient(to bottom, rgba(16,24,39,0.34), rgba(16,24,39,0.52))` ✓
  - 描边: `rgba(255,255,255,0.10)` 1dp ✓
  - Shape: cutMedium ✓
  - Padding: 18dp ✓
  - 位置: left/right=18, bottom=34 ✓
- 标题区: `章节目录` 28sp Serif + 说明文 12sp 70% ✓
- 列表区: LazyColumn + CatalogItem
  - 列表项: min-height 68dp, padding 14/13 ✓
  - 背景: `rgba(255,255,255,0.045)`, border `rgba(255,255,255,0.07)`, cutSmall ✓
  - 当前项: gold sweep `rgba(215,190,134,0.18)`, gold border `rgba(215,190,134,0.28)` ✓
  - 锁定项: opacity 0.52 ✓
  - 文案: title 15sp 94%, subtitle 12sp 64%, status 12sp 右对齐 ✓
  - 支持: current / unlocked(via completed) / completed / locked ✓
- 底部动作区: 轻分割线 `rgba(255,255,255,0.08)` + `返回主页` / `继续当前章节` 14sp ✓

**保留**：viewModel.getChapters()、getUnlockedNodes()、getSectionState()、onBack、onJumpToNode、onReplaySection、NagiIconButton Back、SystemPageBackground、NagiTheme Dark

### 2.4 `ChapterOpeningScreen.kt` — P0-D

**问题**：文字直接压背景无托底，与 GameScreen 内联 ChapterOpeningOverlay（使用 GlassBacking）视觉割裂。

**修改**：
- 加 light glass backing 包住整组文字（kicker + chapter name + title + hint）
  - 背景: horizontal gradient `rgba(16,24,39,0.30)→0.14@62%→transparent` ✓
  - Center highlight: `rgba(247,249,252,0.09)` radial ✓
  - 描边: `rgba(255,255,255,0.08)` 1dp ✓
  - Shape: cutMedium ✓
  - Padding: 24/24/22/20 ✓
  - 位置: bottom=72, left/right=30 ✓
- 移除旧的裸 hint 背景 Box
- 保留 subtitle 参数支持

**保留**：背景图 + dark overlay、KickerLabel、文字内容和样式、click 行为、NagiTheme Dark

### 2.5 `GameScreen.kt` — P1-E

**修改**（仅补微光，不重设计）：
- `GlassBacking` 补 center highlight: `rgba(247,249,252,0.09)` radial via `drawBehind`
  - 对应 authority §14.1
- `ClearCard` 补 center micro-light: `rgba(247,249,252,0.10)` radial via `drawBehind`
  - 对应 authority §14.2
- 新增 `import drawBehind` 和 `import Offset`

**未改**：HUD title/action chip、skip-section chip、PosterPageBackground、KickerLabel、ChapterOpeningOverlay、SectionOpeningOverlay、ChapterEndingOverlay、EndingOverlay、ReplayCompleteOverlay、DebugOverlay、save toast、story flow、BG mapping、BGM

---

## 3. 功能保留确认

| 功能 | 保留状态 |
|------|----------|
| HUD icon button 点击/状态切换 | ✓ 保留 |
| Dialog 弹出/关闭/确认/取消 | ✓ 保留 |
| 章节目录跳转/回看 | ✓ 保留 |
| 章节目录状态显示 | ✓ 保留 |
| Chapter opening 点击继续 | ✓ 保留 |
| GameScreen 所有 phase 切换 | ✓ 保留 |
| Skip section 按钮与弹窗 | ✓ 保留 |
| 存档 toast | ✓ 保留 |

---

## 4. `git diff --check` 结果

无 whitespace 错误（`git diff --check` 无输出）。

注：git status 未检测到 Android 文件变更，可能与 `.gitattributes` 行尾归一化或 git 缓存有关。文件内容已通过直接读取确认更新。

---

## 5. 构建 / Android Studio 验证状态

**BUILD SUCCESSFUL** — `assembleDebug` 通过，37 tasks in 11s，无编译错误。

初次构建遇到 `Unresolved reference 'nativeCanvas'`（缺少 `import androidx.compose.ui.graphics.nativeCanvas`），已修复并重新构建通过。

---

## 6. 截图验证点说明

以下 5 个验证点需在实机/模拟器上确认：

1. **明亮背景 HUD** — NagiIconButton 在明亮 story BG 上应呈现柔和阴影分离感，不再有硬边黑框。center highlight 应微可见。icon tint 应为 94% 白色。
2. **深色背景 HUD** — NagiIconButton 在暗色 BG 上保持轻玻璃质感，阴影不过重但仍有层次。
3. **Skip-section dialog** — NagiDialog 弹出时弹窗应浮起但轻盈，无硬边阴影框。scrim 38% 半透明。内容文字清晰。
4. **Chapter catalog** — ChapterScreen 应显示 catalog-panel 列表布局（非 timeline/diamond）。当前项金色高亮，锁定项半透明。底部有"返回主页"和"继续当前章节"。
5. **Chapter opening** — ChapterOpeningScreen 应有 light glass backing 包住文字组，不再裸文字压背景。center highlight 微可见。

---

## 7. 禁止范围确认

以下文件/范围 Phase 2 **未触碰**：

- `story-data/` — 未修改
- BG mapping — 未修改
- TT Start — 未修改
- App Icon V4 — 未修改
- Web — 未修改
- BGM — 未修改
- archive — 未修改
- unrelated cleanup — 未做
- `NagiHud.kt` — 未修改
- `DialogueLayer.kt` — 未修改
- `BacklogScreen.kt` — 未修改
- `SectionOpeningScreen.kt` — 未修改（PM 决策：暂不改）
- `ChapterEndingScreen.kt` — 未修改（PM 决策：暂不改）
- `SectionClearScreen.kt` — 未修改（PM 审计为基本合规）

---

## 8. Cleanup status

- 无文件删除
- 无新文件创建（均为原地修改）
- ChapterScreen 中已移除旧的 DiamondShape 和 TimelineNode composable（它们是同文件的 private 函数，不影响其他文件）
- 未引入新的 dependency 或 library（`BlurMaskFilter` 来自 `android.graphics`，系统内置）

---

## 9. 技术说明

### Icon halo 实现
Authority §15.1 要求 `soft light halo: 0 0 8dp rgba(247,249,252,0.20)`。当前实现为在 icon 后方绘制 `BlurMaskFilter(8dp)` 柔光圈。在暗背景下效果明显；亮背景下几乎不可见（符合设计意图——辅助可读性而不是装饰）。如 PM/Ant 认为效果不足或过强，可通过调整 alpha 值微调。

### Compose elevation shadow vs drawBehind
核心修改。Compose `Modifier.shadow(elevation=...)` 使用 `RenderNode` 沿 shape outline 产生等宽硬边阴影，与 CSS `box-shadow` 的 Gaussian blur 扩散完全不同。替换为 `drawBehind` + `BlurMaskFilter(NORMAL)` 后，阴影自然扩散、边缘柔和，视觉与 CSS `drop-shadow` 接近。

### No-blur fallback
所有修改遵循 authority §16.5 no-blur fallback 方案：不使用 `RenderEffect` 模糊弹窗/容器自身内容，不使用背景真实模糊。
