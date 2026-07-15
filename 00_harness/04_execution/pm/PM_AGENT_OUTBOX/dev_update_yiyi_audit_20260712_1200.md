# yiyi 全量自检 & 更新文档

> Developer: yiyi  
> Date: 2026-07-12 12:00  
> Scope: 本轮密集修改的全量审计

---

## 一、本轮已完成改动清单

### 1. P0 解析层修复 (GameViewModel.kt)

| 改动 | 位置 | 验证 |
|------|------|------|
| off-by-one: 长旁白结束后不再多递增 dialogueIndex | `onTap()` line 356-375 | `displayType == "long_narration"` → 直接 `showDialogueLine()` |
| `{{playerName}}` 不会被误判为旁白 | `showDialogueLine()` 长旁白检测逻辑 | `speaker.isBlank()` 判定，`{{playerName}}` 含字符所以不为 blank |

**状态**: 已完成，逻辑正确。

---

### 2. 跳过本节 (Skip Section)

| 改动 | 位置 |
|------|------|
| `skipSection()` 方法 | GameViewModel.kt line 272-305 |
| `getCurrentSectionTitle()` | GameViewModel.kt line 307-310 |
| `markSectionSkipped()` / `getSkippedSections()` | ProgressManager.kt |
| 跳过按钮 + 确认对话框 | GameScreen.kt |
| `onNavigateToSectionClear` 回调 | GameScreen.kt + NavGraph.kt |

**流程**: 点击"跳过本节" → 确认对话框 → `skipSection()` 标记状态 + 设置 pendingNode → 导航到 SectionClearScreen → 显示"本幕完成" → 点击继续 → 进入下一节

**状态**: 已完成。

---

### 3. 存档扩展 (Save Slots)

| 改动 | 位置 |
|------|------|
| 卡槽 6→10 | SaveManager.kt 所有 `(1..10)` |
| 覆盖确认对话框 | SaveLoadScreen.kt |
| 空白位直接保存 | SaveLoadScreen.kt |

**状态**: 已完成。

---

### 4. scene_visuals.json uiTheme 修正

| 节点 | 修正 | 原因 |
|------|------|------|
| wc_offer | Dark→Light | mapping v1.4 标 light/auto |
| w_noodle | Dark→Light | mapping v1.4 标 light |
| e_festival | Dark→Light | mapping v1.4 标 light/auto |
| e_agency_launch | Dark→Light | mapping v1.4 标 light/auto |
| e_sick_fragile | Dark→Light | mapping v1.4 标 light/auto |
| dream_final | Dark→Light | mapping v1.4 标 light/ending |
| p2, p2_s2, p2_s3 | Dark→Light | mapping v1.4 标 light/auto（会议室BG明亮）|
| c1a | Dark→Light | mapping v1.4 标 light/auto |
| transfer_contract | Dark→Light | mapping v1.4 标 light/auto |

**状态**: 已完成。共 11 个节点 theme 修正。

---

### 5. scene_visuals.json bg 修正

| 节点 | 修正 | 原因 |
|------|------|------|
| stay_cozy | bar.png → dining_room.jpg | mapping v1.4 标 `dining.jpg`，实际资产为 `dining_room.jpg` |

**状态**: 已完成。

---

### 6. XoXo 设计规范落地 (NagiColors.kt / SystemPageBackground / LongNarrationLayer)

| 改动 | XoXo spec | 位置 |
|------|-----------|------|
| Dark theme textPrimary | #F4F1EA | NagiColors.kt DarkNagiColors |
| Dark theme textSecondary | #D6D2CB | NagiColors.kt DarkNagiColors |
| Dark theme borderSubtle | #FFFFFF 10% | NagiColors.kt DarkNagiColors |
| Dark theme glassBg | #1B2436 26% | NagiColors.kt DarkNagiColors |
| Dark theme glassBgStrong | #1B2436 32% | NagiColors.kt DarkNagiColors |
| Dark theme glassBgSoft | #1B2436 20% | NagiColors.kt DarkNagiColors |
| SystemPageBackground dim | #132033 32% | SystemPageBackground.kt |
| SystemPageBackground gradient | #132033 0%→80% | SystemPageBackground.kt |
| LongNarrationLayer bg | #101826 42% | LongNarrationLayer.kt |
| LongNarrationLayer text | #F4F1EA 92%, 16sp, 30sp line height | LongNarrationLayer.kt |
| LongNarrationLayer text shadow | #0A0F19 18%, offset(0,1), blur 8 | LongNarrationLayer.kt |
| LongNarrationLayer width | 78% | LongNarrationLayer.kt |

**状态**: 已完成。

---

## 二、自检发现的问题（已修）

| # | 问题 | 修正 |
|---|------|------|
| 1 | `skipSection()` 跳到下一节 startNode，绕过了 SectionClearScreen | 改为设置 pendingNode + ChapterTransition 状态，由 GameScreen 导航到 SECTION_CLEAR |
| 2 | `prologue` 被错误添加到 scene_visuals.json，但 nodes.json 无此节点 | 已删除，prologue 是独立路由非 game node |
| 3 | `ProgressManager.markSectionSkipped()` 方法不存在 | 已新增 |

---

## 三、已知差异 & 需确认事项

### 需 PM 确认

| # | 事项 | 当前状态 | 建议 |
|---|------|----------|------|
| 1 | **SectionClearScreen 跳过时文案**：正常完成显示"本幕完成"，跳过时是否改为"本幕已跳过"？ | 当前统一显示"本幕完成" | 建议区分，需 PM 定文案 |
| 2 | **跳过按钮位置**：当前放在右下角 (bottom-end, 80dp padding) | 半透明小按钮 | 需 XoXo 确认是否有指定位置/样式 |
| 3 | **小章节状态系统**：PM 要求 未解锁/进行中/已完成/已跳过完成 四态，当前只有 markSectionSkipped 记录跳过 | 未实现完整四态枚举 | 需要独立做 P1 小章节状态系统 |
| 4 | **chapters.json 小章节数据**：`skipSection()` 依赖 `chapters.json` 中的 sections 字段 | 已有结构：`Chapter { sections: List<ChapterSection> }` | 需确认数据是否完整覆盖所有章节 |

### 需 XoXo 确认

| # | 事项 | 当前状态 | 需要 |
|---|------|----------|------|
| 1 | **系统页 textWeak 色**：spec 标 #B7B3AD，当前用 textSecondary.copy(alpha=0.5f) 近似 | 无独立字段 | 确认是否需要新增 textWeak 语义色 |
| 2 | **金色强调色**：spec 标 #D7BE86，当前 paleGold = #D8C38A | 色差 ΔE 约 2 | 确认是否需要精确匹配 |
| 3 | **系统浮层 border 应用位置**：#FFFFFF 10% 已设为 borderSubtle，但不是所有 system page 组件都用了 border | 只有部分组件有 border modifier | 需 XoXo 指定哪些浮层需要加 border |
| 4 | **跳过按钮视觉规范**：当前用 glassBgStrong + RoundedCorner(16dp) + micro 字体 | 无 XoXo spec | 需要设计稿 |

### 需验证（无法本地编译）

| # | 事项 | 风险 |
|---|------|------|
| 1 | GameScreen.kt 新增 AlertDialog import 是否与 material3 冲突 | 低 — 已用 material3.AlertDialog |
| 2 | `engine.resolve()` 在 skipSection 中调用可能需要 gameState 已初始化 | 中 — skipSection 只在游戏中调用，应已初始化 |
| 3 | NavGraph popUpTo(GAME, inclusive=true) 是否导致返回栈问题 | 低 — SectionClear.onContinue 再 navigate(GAME) |

---

## 四、mapping 文件 vs 实际资产名对照

mapping 中部分 bg 名与实际文件不同，属于 mapping 文档使用了简称：

| mapping 写法 | 实际资产文件名 | 处理 |
|---|---|---|
| `gameroom.png` | `gaming_room.png` | JSON 用实际名，正确 |
| `dining.jpg` | `dining_room.jpg` | JSON 用实际名，正确 |
| `bar.png` | `bar.png` | 一致 |

**建议**：请 CoCo/XoXo 下次更新 mapping 时统一用实际资产文件名，避免歧义。

---

## 五、仍未完成的 PM 全量任务 (from TASK_TO_YIYI_20260711_FULL_SCOPE)

| 优先级 | 任务 | 状态 | 阻塞 |
|--------|------|------|------|
| P0 | HUD Menu→Backlog 重命名 | ⚠️ 未做 | 无 |
| P0 | 新的故事二次确认弹窗 | ⚠️ 未做 | 无 |
| P1 | 小章节状态枚举系统 | ❌ 未做 | 需确认 chapters.json 数据完整性 |
| P2 | 大章结束页 + 小章节开始页 | ❌ 未做 | 依赖 P1 |
| P3 | 剧情回顾按章节隔离 | ❌ 未做 | 依赖 P1 |
| P4 | 三种能力拆开（回顾/目录/回看） | ❌ 未做 | 依赖 P1+P2 |
| P5 | 一一固定称呼确认 | ❌ 未做 | 需确认 script 数据 |

---

## 六、我是否"自己发挥"了？

自检结论：

1. **`prologue` 条目**：我自行添加了 scene_visuals 中的 prologue 条目，但 nodes.json 没有这个节点 — **已删除，属于误加**
2. **stay_cozy bg**：上一 session 的 dev reply 说"断裂引用修复 dining.jpg→bar.png"，但 mapping 明确标 dining.jpg — **本次纠正回 dining_room.jpg，符合 mapping**
3. **Dark theme 文字色改为 XoXo spec**：将 snowWhite/silverBlue 改为 #F4F1EA/#D6D2CB — **这会影响所有 Dark theme 页面**，如果游戏中对白也用 Dark theme，对白文字颜色也会从蓝白变为暖白。需确认这是否是期望行为，还是 XoXo 的色值只针对系统页。

**需 PM/XoXo 确认**：XoXo spec 中的系统页文字色 (#F4F1EA / #D6D2CB) 是否也适用于游戏对白？如果不适用，应该将系统页文字色与游戏对白色分离（新增 systemTextPrimary / systemTextSecondary 语义色）。

---

## 七、总结

- 本轮改动 **11 个文件**，核心修正集中在解析层、跳过流程、视觉同步
- 最高风险项：Dark theme 文字色全局变更（第六节 #3）
- 最大遗漏：PM 全量任务的 P0 还剩 HUD 重命名 + 新故事确认弹窗未做
- 下一步建议：先确认 XoXo 文字色适用范围，再继续 P0 剩余和 P1 状态系统
