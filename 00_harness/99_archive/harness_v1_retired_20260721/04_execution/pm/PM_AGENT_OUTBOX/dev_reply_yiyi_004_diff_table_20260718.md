# TASK-20260718-004 差异表：当前 Android 实现 vs Authority Target

- 任务编号：TASK-20260718-004
- 负责人：yiyi
- 状态：差异表回传，等待 PM/Ant 确认后才动代码
- 日期：2026-07-18

---

## 一、HUD Icon Button（NagiIconButton.kt）

| 属性 | 当前实现 | Authority Target (Section 15.1) | 偏差 | 计划修正 |
|------|---------|-------------------------------|------|---------|
| 容器尺寸 | 36x36 dp | 36x36 | 无偏差 | 不改 |
| 图标尺寸 | 18x18 dp | 18x18 | 无偏差 | 不改 |
| 背景渐变起 | `0x4D0F1827` (alpha 30%) | `rgba(15,24,39,0.30)` = 30% | **数值匹配但视觉太重** | 维持 30%，问题在 shadow 过重 |
| 背景渐变止 | `0x2E0F1827` (alpha 18%) | `rgba(15,24,39,0.18)` = 18% | 无偏差 | 不改 |
| 描边 | `0x1AFFFFFF` (10%) 1dp | `rgba(255,255,255,0.10)` 1dp | 无偏差 | 不改 |
| Shadow | `shadow(3.dp)` Compose 默认 | authority: `dropShadow 0 3dp 12dp rgba(0,0,0,0.42)` 用于亮底分离 | **当前 shadow 3dp 扩散不够柔、elevation 感过重** | 改为 `shadow(elevation=2.dp, ambientColor=0x6B000000, spotColor=0x6B000000)` 降重 |
| Clip shape | cutSmall | cut-sm | 无偏差 | 不改 |
| 图标颜色 | `hudColor.copy(alpha=0.92f)` | `rgba(247,249,252,0.94)` | 略偏差（0.92 vs 0.94） | 改为 0.94 |
| 图标 shadow/halo | 无 | dark: `0 1dp 2dp rgba(0,0,0,0.64)`; halo: `0 0 8dp rgba(247,249,252,0.20)` | **缺失** | 需要给 Icon 加 text shadow（Compose Icon 无直接 shadow modifier，需 drawBehind 或 graphicsLayer） |
| 中心 radial 高光 | 无 | `rgba(247,249,252,0.08)` radial | 缺失（PM 前次已知 Compose 不支持 radial gradient background） | 不实现，影响极小（8% 白色），PM 前次已记录 |

**根因分析**：icon button 数值本身大致匹配 authority，但 `shadow(3.dp)` 使用 Compose 默认 elevation shadow（黑色 spot + ambient），在亮背景下产生厚重实体感。Authority 要求的是柔和的 `dropShadow` 分离，不是 elevation 立体感。这是"太厚太重像深色按钮"的主要原因。

---

## 二、HUD Title Chip（NagiHud.kt）

| 属性 | 当前实现 | Authority Target (Section 15.1) | 偏差 | 计划修正 |
|------|---------|-------------------------------|------|---------|
| 高度 | 34dp | 34 | 无偏差 | 不改 |
| 最大宽度 | 210dp | ~210dp | 无偏差 | 不改 |
| 背景渐变起 | `0x380F1827` (22%) | `rgba(15,24,39,0.22)` = 22% | 无偏差 | 不改 |
| 背景渐变止 | `0x140F1827` (8%) | `rgba(15,24,39,0.08)` = 8% | 无偏差 | 不改 |
| 描边 | `0x1AFFFFFF` (10%) 1dp | `rgba(255,255,255,0.10)` 1dp | 无偏差 | 不改 |
| padding | horizontal 16dp | 14~18dp | 在范围内 | 不改 |
| 字体 | FontFamily.Default Medium 13sp | Noto Sans SC Medium 13sp | Default 在 Android 映射到 Roboto/Noto Sans | 不改 |
| 文本颜色 | `0xE0F4F1EA` (88%) | `rgba(244,241,234,0.88)` = 88% | 无偏差 | 不改 |
| Shadow | 无 container shadow | authority 无要求 container shadow（仅 icon button 有 dropShadow） | 无偏差 | 不改 |

**判断**：title chip 数值对齐 authority。title chip 本身不是"太厚"的主因——它比 icon button 更轻（22%→8%）。视觉整体偏重是 icon button shadow 拉重了全家族。

---

## 三、HUD Action Chip（GameScreen.kt 跳过本节）

| 属性 | 当前实现 | Authority Target (Section 15.1) | 偏差 | 计划修正 |
|------|---------|-------------------------------|------|---------|
| 高度 | 34dp | 34 | 无偏差 | 不改 |
| 背景渐变 | `0x38→0x14` (22%→8%) | 与 title chip 一致 | 无偏差 | 不改 |
| 描边 | `0x1AFFFFFF` 1dp | 一致 | 无偏差 | 不改 |
| padding | horizontal 15dp | 14~16dp | 在范围内 | 不改 |
| 字体 | Default Medium 12sp | Noto Sans SC Medium 12~13sp | 在范围内 | 不改 |
| 文本颜色 | `0xE6F4F1EA` (90%) | `rgba(244,241,234,0.90)` | 无偏差 | 不改 |

**判断**：action chip 数值对齐。

---

## 四、Dialog（NagiDialog.kt）

| 属性 | 当前实现 | Authority Target (Section 16.5 no-blur fallback) | 偏差 | 计划修正 |
|------|---------|-------------------------------|------|---------|
| Card bg | `0x521B2436` (32%) | `rgba(27,36,54,0.56)` = **56%** (允许 0.52~0.60) | **当前 32%，低于最小允许值 52%** | 改为 `0x8F1B2436` (56%) |
| Scrim | `0x52090E18` (32%) | `rgba(9,14,24,0.38)` = **38%** (允许 0.34~0.42) | **当前 32%，低于最小允许值 34%** | 改为 `0x61090E18` (38%) |
| Border | `0x1FFFFFFF` (~12%) 1dp | `rgba(255,255,255,0.14)` = 14% 1dp | 略偏（12% vs 14%） | 改为 `0x24FFFFFF` (14%) |
| Shadow | `shadow(12.dp)` Compose 默认 | `0 18dp 42dp rgba(0,0,0,0.36)` | **shadow elevation/color 偏差** | 改为 `shadow(18.dp, ambientColor=Color(0x5C000000), spotColor=Color(0x5C000000))` |
| Inner highlight | 无 | 顶部 `rgba(255,255,255,0.06)` 轻微纵向高光 | 缺失 | 新增顶部轻高光渐变 |
| Text shadow | `0xB8000000` (72%) offset 2dp blur 12 | `0 1dp 2dp rgba(0,0,0,0.35)` | **过重**：72% vs 35%, blur 12 vs 2 | 改为 `0x59000000` (35%) offset 1dp blur 2dp |
| Radius | 24dp | 24dp | 无偏差 | 不改 |
| Padding | L/R 40, top 32, bottom 28 | 沿用 section 11 | 无偏差 | 不改 |
| Typography | 沿用 section 11 | 沿用 section 11 | 无偏差 | 不改 |

**根因分析**：Dialog 当前 card bg 32% 是上一轮对齐 section 11 "preferred with blur" 的数值（设计方给的 0.32 是搭配 20dp blur 的），但 Android 无法做背景 blur，所以必须用 section 16.5 的 **no-blur fallback token 0.56**。这是最关键的偏差。同时 text shadow 过重（72% alpha、12dp blur）导致文字周围出现明显黑晕，加重了"厚重面板"感觉。

---

## 五、Speaker Name（DialogueLayer.kt）

| 属性 | 当前实现 | Authority Target (Section 15.2) | 偏差 | 计划修正 |
|------|---------|-------------------------------|------|---------|
| 金色 | `#E4CA8F` | `#E4CA8F` | 无偏差 | 不改 |
| 字体 | Default SemiBold 13sp, letterSpacing 0.04sp | Noto Sans SC Medium 13sp, 0.04em, weight 600 | SemiBold ≈ 600 | 不改 |
| 衬底 padding | 9/9/3/4 | 9/9/3/4 | 无偏差 | 不改 |
| 衬底背景 | horizontal gradient `0x4D101827→0x1A101827` (30%→10%) | `rgba(16,24,39,0.30)→rgba(16,24,39,0.10)` | 无偏差 | 不改 |
| 衬底描边 | `0x2ED7BE86` (18%) 1dp | `rgba(215,190,134,0.18)` 1dp | 无偏差 | 不改 |
| Text shadow | `0xB8000000` (72%) offset 1dp blur 2 | `0 1dp 2dp rgba(0,0,0,0.72)` | 无偏差 | 不改 |
| Text halo | 无 | `0 0 10dp rgba(215,190,134,0.20)` | **缺失** | 新增金色 halo（Compose 需第二层 shadow 或 drawBehind） |

**判断**：speaker 数值大致对齐，但缺少金色 halo。Compose `TextStyle.shadow` 只支持单个 shadow；需要用 `drawBehind` 或叠加第二个 Text 实现 halo 效果。

---

## 六、BacklogScreen Speaker（BacklogScreen.kt）

与 DialogueLayer speaker 同步。当前 `#E4CA8F`、shadow `0xB8000000` offset 1dp blur 2——与 authority 数值匹配。同样缺 gold halo。

计划修正：同步增加 halo 效果。

---

## 七、修改文件清单

| 文件 | 改动内容 |
|------|---------|
| `NagiIconButton.kt` | shadow 降重（elevation 2dp + 柔和 shadow color）；icon alpha 0.92→0.94；研究 icon shadow/halo 实现方式 |
| `NagiDialog.kt` | card bg 32%→56%；scrim 32%→38%；border 12%→14%；shadow 改为 18dp + 0.36 alpha；text shadow 72%→35% + blur 12→2；新增顶部 inner highlight |
| `DialogueLayer.kt` | 新增 gold halo（`rgba(215,190,134,0.20)` blur 10dp） |
| `BacklogScreen.kt` | speaker 同步增加 gold halo |

---

## 八、明确不改的范围

- NagiHud.kt title chip：数值已对齐 authority，不改
- GameScreen.kt action chip：数值已对齐 authority，不改
- story-data / nodes.json / scene_visuals.json
- BG mapping
- TT Start 页面
- App Icon
- BGM
- Web
- 资源清理 / 删除
- 章节开始 / Chapter Clear / Section Clear（不在本任务范围）

---

## 九、实机截图验证点

修正完成后必须回传以下截图：

1. **亮背景 HUD**：使用亮底背景图（如 living_room）的剧情页，确认 icon button / title chip / action chip 可见但轻薄
2. **暗背景 HUD**：使用暗底背景图的剧情页，确认 HUD 不过度突兀
3. **跳过本节 Dialog**：点击跳过后的确认弹窗，确认 card 轻玻璃质感 + 可读
4. **Speaker name 亮背景**：亮底图上 speaker 金色 + 轻衬底可读性
5. **Speaker name 复杂背景**：复杂底图上 speaker 金色可读性

---

## 十、关键修正总结

当前实现"太厚太重"的两个根因：

1. **NagiIconButton shadow 过重**：`shadow(3.dp)` 默认 Compose elevation shadow 产生深色实体立体感，应该换成柔和的 drop shadow
2. **NagiDialog card bg 用错 token**：用了 section 11 "with blur" 的 32%，但 Android 无 blur 时应该用 section 16.5 "no-blur fallback" 的 56%；同时 text shadow 72% + blur 12 过重

Title chip 和 action chip 数值本身已对齐 authority，不需要改。

---

## Cleanup status

None。本轮不删除资源。
