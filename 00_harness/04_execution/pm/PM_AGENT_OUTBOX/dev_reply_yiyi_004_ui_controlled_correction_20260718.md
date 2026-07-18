# TASK-20260718-004 回传：Android UI authority 受控修正

- 任务编号：TASK-20260718-004
- 负责人：yiyi
- 状态：review（等待实机构建验证）
- 日期：2026-07-18

---

## 修改文件清单

| 文件 | 改动内容 |
|------|---------|
| `NagiIconButton.kt` | shadow `3.dp` → `2.dp` + 柔和 ambientColor/spotColor `0x6B000000`；icon alpha `0.92f` → `0.94f` |
| `NagiDialog.kt` | card bg `0x52` (32%) → `0x8F` (56%)；scrim `0x52` → `0x61` (38%)；border `0x1F` → `0x24` (14%)；shadow `12.dp` → `18.dp` + ambientColor/spotColor `0x5C000000`；text shadow 全部从 `0xB8` (72%) offset 2/blur 12 → `0x59` (35%) offset 1/blur 2；新增顶部 inner highlight `rgba(255,255,255,0.06)` verticalGradient |
| `DialogueLayer.kt` | speaker name 新增 gold halo：双层 Text 叠加，底层 `Shadow(0x33D7BE86, offset 0/0, blur 10)`，顶层保持原 dark shadow |
| `BacklogScreen.kt` | speaker name 同步新增 gold halo，与 DialogueLayer 一致 |

---

## Authority 对齐说明

### NagiIconButton（Section 15.1）

| 属性 | 修正前 | 修正后 | Authority |
|------|--------|--------|-----------|
| Shadow | `shadow(3.dp)` Compose 默认 | `shadow(2.dp, ambientColor=0x6B, spotColor=0x6B)` | soft dropShadow 分离 |
| Icon alpha | 0.92 | 0.94 | 0.94 |
| 容器/渐变/描边/尺寸 | 不改 | 不改 | 已对齐 |

Icon shadow/halo（authority: `0 1dp 2dp rgba(0,0,0,0.64)` + `0 0 8dp rgba(247,249,252,0.20)`）：Compose `Icon` 不支持 CSS-style drop shadow，需 `drawWithContent` + `RenderEffect.createBlurEffect`（API 31+）。当前未实现此项。如 PM/Ant 判定必要，需单独技术方案。

### NagiDialog（Section 16.5 no-blur fallback）

| 属性 | 修正前 | 修正后 | Authority |
|------|--------|--------|-----------|
| Card bg | `0x52` (32%) | `0x8F` (56%) | 56% (允许 0.52-0.60) |
| Scrim | `0x52` (32%) | `0x61` (38%) | 38% (允许 0.34-0.42) |
| Border | `0x1F` (~12%) | `0x24` (14%) | 14% |
| Shadow | `12.dp` 默认 | `18.dp` + `0x5C000000` | 18dp / 0.36 |
| Text shadow | `0xB8` (72%) / 2dp / 12 | `0x59` (35%) / 1dp / 2 | 35% / 1dp / 2dp |
| Inner highlight | 无 | 顶部 `0x0FFFFFFF` → 透明 | 顶部 `rgba(255,255,255,0.06)` |

### Speaker Gold Halo（Section 15.2）

| 属性 | 修正前 | 修正后 | Authority |
|------|--------|--------|-----------|
| Gold halo | 缺失 | 双层 Text：底层 `Shadow(0x33D7BE86, 0/0, blur 10)` | `0 0 10dp rgba(215,190,134,0.20)` |
| Dark shadow | `0xB8000000` 1dp/2 | 不改（顶层保持） | `0xB8000000` 1dp/2 |

---

## 5 个截图验证点

修正完成，以下验证点需实机构建后确认：

1. **亮背景 HUD**：使用亮底背景图（如 living_room）的剧情页，确认 icon button / title chip / action chip 可见但轻薄，shadow 不再过重
2. **暗背景 HUD**：使用暗底背景图的剧情页，确认 HUD 不过度突兀
3. **跳过本节 Dialog**：点击跳过后的确认弹窗，确认 card 轻玻璃质感（56% 半透明）+ 可读文字 + 柔和 shadow
4. **Speaker name 亮背景**：亮底图上 speaker 金色 + 轻衬底 + gold halo 可读性
5. **Speaker name 复杂背景**：复杂底图上 speaker 金色 + gold halo 可读性

无法提供实机截图（无 gradlew 构建环境），以上均为代码级修正。

---

## 未改动范围

- NagiHud.kt title chip：数值已对齐 authority，不改
- GameScreen.kt action chip：数值已对齐 authority，不改
- story-data / nodes.json / scene_visuals.json
- BG mapping
- TT Start 页面
- App Icon
- BGM
- Web
- 资源清理 / 删除
- 章节开始 / Chapter Clear / Section Clear

---

## Cleanup status

None。本轮不删除资源。

---

## 已知限制

1. **Icon shadow/halo**：Compose `Icon` composable 不支持 CSS drop shadow。实现需要 `Modifier.drawWithContent` + `RenderEffect.createBlurEffect`（仅 API 31+），当前未实现。影响：icon 在极亮背景下的分离感略弱于 authority 设计稿。如果 Ant 判定必要，需单独开任务用 canvas draw 方式实现。
2. **Radial highlight**：NagiIconButton 中心 radial 高光 `rgba(247,249,252,0.08)` 未实现（PM 前次已记录 Compose 不支持 radial gradient background，影响极小）。

---

## Android touched

- `NagiIconButton.kt`：是（shadow 降重 + icon alpha）
- `NagiDialog.kt`：是（card/scrim/border/shadow/text shadow/inner highlight）
- `DialogueLayer.kt`：是（speaker gold halo）
- `BacklogScreen.kt`：是（speaker gold halo）

## Web touched

No.
