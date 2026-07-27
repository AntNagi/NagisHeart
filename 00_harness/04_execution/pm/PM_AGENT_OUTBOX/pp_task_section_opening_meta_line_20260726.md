# PP 任务：小节开始页加小节序号 + 去掉托底描边

**来源**：Ant 实机反馈 —— ①小节开始页只显示"第几部"，看不出当前是第几节；②文字托底不该有描边线  
**权威文件**：`authority/ui/XoXo_UI_Final_MinSpec_20260712.md` §14.1（描边改为无）、§14.1.1（新增）  
**优先级**：P2  
**日期**：2026-07-26

---

## 改动 A：金色副标题行加小节序号

小节开始页（Section Opening）的金色副标题行：

| | 内容 |
|---|---|
| 旧 | `第一部` |
| 新 | `第一部 · 第 2 节` |

样式完全不变（`FontFamily.Serif`，14sp，`NagiTokens.gold`），只改文本内容。

规则见 MinSpec §14.1.1，要点：

- 分隔符 ` · `，前后各一个空格
- 序号从 **1** 开始展示（内部 index 是 0 基，展示时 +1）
- **不显示总数**，不要写 `/ 共 N 节`
- 单行不换行
- **大章开始页（Chapter Opening）不加这行**，保持原样

## 改动 B：托底去掉描边线

`GlassBacking`（`GameScreen.kt` 约第 1029 行）当前有 1dp 描边：

```kotlin
.border(
    width = 1.dp,
    color = NagiTokens.borderGlass,
    shape = NagiShapes.cutMedium
)
```

**整段删掉。** 其余（cut-md 裁切、横向渐变、中心高光 drawBehind、padding）全部保留不动。

MinSpec §14.1 已同步改为"描边：无"。托底靠渐变自身跟背景拉开层次，加了线会读成卡片/弹窗。

**影响范围确认**：`GlassBacking` 现在只有两个调用方 —— `SectionOpeningOverlay`（活跃）和 `ChapterOpeningOverlay`（已无调用方，死代码）。大章开始 / 大章结束走的是 `AuthorityChapterOpeningOverlay` / `AuthorityChapterEndingOverlay`（§23 整屏诗性分割页，本来就没有玻璃托底和描边）。所以这次删描边**只影响小节开始页**。

---

## 涉及文件

### 1. `ui/viewmodel/GameViewModel.kt`

`SectionTransitionInfo` 目前只有两个字段：

```kotlin
data class SectionTransitionInfo(
    val chapterName: String,
    val sectionTitle: String
)
```

加两个字段：

```kotlin
data class SectionTransitionInfo(
    val chapterName: String,
    val sectionTitle: String,
    val sectionIndex: Int       // 0 基，沿用 currentSectionIndex
)
```

构造 `SectionTransitionInfo` 的地方补上这个值。数据现成的：`currentSectionIndex`（GameViewModel.kt 第 100 行附近的私有字段）。

### 2. `ui/screen/GameScreen.kt`

`SectionOpeningOverlay`（约第 1165 行）签名加参数，并改金色那行的文本：

```kotlin
Text(
    text = "$chapterName · 第 ${sectionIndex + 1} 节",
    fontFamily = FontFamily.Serif,
    fontSize = 14.sp,
    color = goldColor
)
```

调用处（约第 174 行）把新字段传进去。

同一文件的 `GlassBacking`（约第 1029 行）删掉 `.border(...)` 那一段（见改动 B）。

---

## 不要做

- 不改样式 token（字号、颜色、字体、间距全部沿用）
- **不动 `AuthorityChapterOpeningOverlay` / `AuthorityChapterEndingOverlay`** —— 大章开始 / 大章结束 / 结局页归 §23 管，本任务不涉及
- 不改 `SectionOpeningScreen.kt`（死代码，活跃的是 `GameScreen.kt` 里的 `SectionOpeningOverlay`）
- 不改 `ClearCard`（小节结束页），它的描边保留
- 不改 story-data
- 顺带说明：`ChapterOpeningOverlay` / `ChapterEndingOverlay`（GameScreen.kt 1103 / 1227）已无调用方，本次不要顺手删，留给专门的清理任务

---

## 验证

- 进入任意小节，确认金色行显示为 `第X部 · 第 N 节`
- 确认序号从 1 开始，不是 0
- 确认没有出现"共 N 节"字样
- 确认换到下一节时序号递增
- 确认托底四周没有描边线，但仍能跟背景拉开层次（渐变和中心高光还在）
- 确认大章开始 / 大章结束 / 结局页（§23 整屏分割页）完全没变化
- 确认小节结束页（`ClearCard`）的描边没被误删
