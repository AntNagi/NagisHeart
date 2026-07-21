# PP 任务：系统页面暗层 + 行项浮层可读性修复

**来源**：PM 真机截图校验 — 系统页面背景太亮 + 存档/设置行背景几乎透明，文字无法辨认  
**权威文件**：`00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` §1 暗层规则 + §22 行项规范（已更新）  
**优先级**：P1  
**日期**：2026-07-21

---

## 问题

真机上系统级页面（存档 / 章节目录 / 系统设置 / 回忆画廊 / 主页）：

1. **没有径向暗角** — 背景图平铺无纵深，四周和中间亮度一样
2. **整体暗度不够** — 中段只有 12% alpha，Nagi 海报图案太清晰，抢字，文字难以辨认
3. **存档/设置行背景太淡** — 当前只有 `Color.White.copy(alpha = 0.04f)`，真机上几乎不可见，文字直接压在海报上

## 修改内容

`SystemPageBackground.kt` 原来是两层（垂直渐变 + 白色呼吸），改为三层：

### 第一层（垂直渐变）— 提升 alpha

旧值：
```
0f to rgba(19,32,51, 0.32)
0.42f to rgba(19,32,51, 0.12)
1f to rgba(19,32,51, 0.66)
```

新值：
```
0f to rgba(19,32,51, 0.52)    → Color(0x85132033)
0.42f to rgba(19,32,51, 0.34) → Color(0x57132033)
1f to rgba(19,32,51, 0.78)    → Color(0xC7132033)
```

### 第二层（径向暗角）— 新增

```
radial-gradient(ellipse at 50% 38%, transparent 0 18%, rgba(19,32,51,0.38) 62%, rgba(19,32,51,0.72) 100%)
```

Compose 写法：
```kotlin
Box(
    modifier = Modifier
        .fillMaxSize()
        .background(
            Brush.radialGradient(
                colorStops = arrayOf(
                    0f to Color.Transparent,
                    0.18f to Color.Transparent,
                    0.62f to Color(0x61132033),   // 38%
                    1f to Color(0xB8132033)        // 72%
                ),
                center = Offset(0.5f * screenWidth, 0.38f * screenHeight),
                radius = maxOf(screenWidth, screenHeight) * 0.72f
            )
        )
)
```

注意：`radialGradient` 需要像素单位的 center 和 radius。用 `BoxWithConstraints` 或 `onSizeChanged` 拿到容器尺寸后计算。

### 第三层（白色呼吸高光）— 不变

```
0f to Color.White.copy(alpha = 0.04f)
0.18f to Color.Transparent
0.70f to Color.Transparent
1f to Color.White.copy(alpha = 0.02f)
```

---

## Part B：存档/设置行项背景（SaveLoadScreen + SettingsScreen）

见 MinSpec §22。

### 旧值（废止）

```kotlin
.background(Color.White.copy(alpha = 0.04f))
```

### 新值

```kotlin
.background(
    Brush.verticalGradient(
        listOf(
            Color(0x61101827),  // rgba(16, 24, 39, 0.38)
            Color(0x85101827)   // rgba(16, 24, 39, 0.52)
        )
    )
)
.border(1.dp, Color(0x14FFFFFF), NagiShapes.cutSmall)  // rgba(255,255,255,0.08)
```

需要改两个文件：
- `SaveLoadScreen.kt` — `SaveRow` composable 里的 `.background(Color.White.copy(alpha = 0.04f))`
- `SettingsScreen.kt` — `SettingsRow` composable 里的 `.background(Color.White.copy(alpha = 0.04f))`

---

## 执行步骤

**Part A — SystemPageBackground：**

1. 打开 `ui/component/SystemPageBackground.kt`
2. 修改第一层垂直渐变的三个 alpha 值（0.32→0.52, 0.12→0.34, 0.66→0.78）
3. 在第一层和白色呼吸之间插入第二层径向暗角
4. 需要获取容器尺寸来计算 radialGradient 的 center/radius

**Part B — 行项浮层：**

5. `SaveLoadScreen.kt` SaveRow：将 `Color.White.copy(alpha = 0.04f)` 改为上述垂直渐变 + 加描边
6. `SettingsScreen.kt` SettingsRow：同上
7. 编译验证

## 不要做

- 不改 splash 类暗层（开场白/名字设置）
- 不改 story 类暗层（剧情内页）
- 不改开屏页
- 不改 ChapterScreen 列表项（那个有独立的 §16 规范）

## 验证

- 真机查看存档页、系统设置
- 确认每个行项有明显的半透明暗色底，文字清晰可读
- 确认四周比中间暗（暗角效果）
- 确认背景图仍然可见（不是纯黑），只是被压暗了
