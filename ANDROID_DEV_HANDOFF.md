# NagisHeart Android 开发交接文档

> 给 yiyi · 2026-07-10 · by CC (Claude Code)

---

## 1. 项目概况

NagisHeart 是一个乙女向视觉小说（otome VN），IP 来自蓝色监狱（Blue Lock）的凪诚士郎。架构核心原则是 **"剧本是数据，不是代码"** — 所有剧情内容以 JSON 驱动，引擎只是一个播放器。整个 `story-data/` 目录设计为可热更新。

团队分工：
- **GPT**：PM（产品经理），负责剧情设计、变量语义、结局判定规则
- **CoCo**（Codex）：UI 设计师，已交付完整设计系统 "冷光玫瑰 / Snowlit Rose"
- **CC**（Claude Code）：技术架构 + 数据层，在工作笔记本上完成
- **yiyi**（你）：Android 端开发，在家里电脑上用 Android Studio 编译

---

## 2. 目录结构

```
NagisHeart/
├── story-data/          ← 核心数据层（JSON）
│   ├── nodes.json       ← 83个剧情节点（475KB），包含对白、选项、效果
│   ├── flow.json        ← 节点流转图（default + byRoute 路由覆盖）
│   ├── routers.json     ← 4个路由器（条件判定，含ending_resolver）
│   ├── variables.json   ← 21个数值变量 + 22个flag定义
│   ├── endings.json     ← 4个结局定义 + judgement规则
│   ├── chapters.json    ← 章节目录（65个section）
│   ├── scene_visuals.json ← 场景视觉配置（bg/bgm/uiTheme/mood/visualPriority）
│   ├── prologue_short.json ← 开场白（默认8行）
│   ├── prologue_full.json  ← 完整开场白（Gallery回放用）
│   └── version.json
│
├── android/             ← Kotlin 源码（已写好，需要你搭项目骨架）
│   └── app/src/main/java/com/antnagi/nagisheart/
│       ├── data/
│       │   └── StoryModels.kt    ← 所有数据类（kotlinx.serialization）
│       ├── ui/theme/
│       │   ├── NagiColors.kt     ← 12色基础色板 + Light/Dark语义色
│       │   ├── NagiTypography.kt ← 11种文字样式（对白17sp/27sp行高）
│       │   ├── NagiSpacing.kt    ← 4dp网格系统 + 组件尺寸
│       │   ├── NagiShapes.kt     ← CutCornerGlassShape（轻切角）+ PentagonShape
│       │   ├── NagiMotion.kt     ← 动画时长 + 缓动曲线
│       │   └── NagiTheme.kt      ← Compose主题入口（Light/Dark/Auto）
│       └── ui/icon/
│           ├── NagiIcon.kt       ← 15个图标枚举
│           └── NagiIconButton.kt ← 图标按钮组件（44dp触控/22dp视觉）
│
├── assets/              ← 资源文件
│   ├── bg/              ← 41张背景图（JPG）
│   ├── ui/
│   │   ├── android/drawable/  ← 15个VectorDrawable XML → 复制到 res/drawable/
│   │   └── svg/               ← 15个SVG源文件
│   ├── 小剧场文/         ← 剧情原文参考
│   └── Ant's home/      ← 公寓场景参考图
│
├── design/              ← CoCo设计文档
│   ├── NagisHeart_Android_Design_Handoff_CC_v1_0.md ← 工程交接（必读）
│   ├── NagisHeart_Android_UI_Tokens_v1_0.md         ← Token完整规范（必读）
│   ├── NagisHeart_MainFlow_UI_Design_CC_v1_0.md     ← 12页UI规格
│   ├── NagisHeart_Android_Icon_System_CC_v1_0.md     ← 图标系统规范
│   ├── NagisHeart_CC_Start_Checklist_v1_0.md         ← 启动清单
│   ├── NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_v1_1.md ← 背景映射和优先级
│   └── nagisheart_mainflow_ui_board_v1_0.html        ← 视觉参考板（浏览器打开）
│
└── tools/               ← Node.js 验证工具
    ├── validate.js           ← 15项数据验证
    ├── golden-playthrough.js ← 4路径模拟测试
    ├── convert-v15.js        ← V15剧本→JSON转换器
    └── convert-story.js      ← 旧版转换器
```

---

## 3. 搭建 Android 项目骨架

现在 `android/` 下只有 Kotlin 源文件，没有 Gradle 构建系统。

### 3.1 新建项目

用 Android Studio 新建项目：
- Package: `com.antnagi.nagisheart`
- Min SDK: 26 (Android 8.0)
- 模板: Empty Compose Activity

### 3.2 添加依赖

```kotlin
// build.gradle.kts (app)
plugins {
    id("org.jetbrains.kotlin.plugin.serialization")
}

dependencies {
    // Serialization
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.3")
    
    // Compose BOM
    implementation(platform("androidx.compose:compose-bom:2024.06.00"))
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    debugImplementation("androidx.compose.ui:ui-tooling")
    
    // Navigation
    implementation("androidx.navigation:navigation-compose:2.7.7")
    
    // ViewModel
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.0")
    
    // Coil (背景图加载)
    implementation("io.coil-kt:coil-compose:2.6.0")
}
```

### 3.3 放置文件

| 源 | 目标 |
|---|---|
| `android/` 下所有 `.kt` | 对应包路径（已按包名组织好） |
| `assets/ui/android/drawable/*.xml` | `app/src/main/res/drawable/` |
| `assets/bg/*.jpg` | `app/src/main/assets/bg/` |
| `story-data/*.json` | `app/src/main/assets/story-data/` |

### 3.4 更新 StoryModels.kt

`SceneVisual` 数据类需要加两个新字段：

```kotlin
@Serializable
data class SceneVisual(
    val bg: String? = null,
    val bgm: String? = null,
    val cg: String? = null,
    val uiTheme: String? = null,
    val autoSave: Boolean? = null,
    val focusPoint: FocusPoint? = null,
    val cropRule: String? = null,
    val characterPosition: String? = null,
    val uiSafeZone: UiSafeZone? = null,
    val visualPriority: String? = null,  // A/B/temp/null
    val mood: String? = null             // romance/daily/tension/competition/loneliness/triumph/loss/reflection
)
```

---

## 4. StoryEngine 架构

引擎是一个状态机，核心循环：

```
加载JSON → 初始化GameState → 播放当前节点对白 →
遇到选择 → 玩家选 → 应用effects → 查flow找下一个节点 →
遇到router → 评估conditions → 跳转 → 循环
遇到ending transition → 结束
```

### 4.1 数据流

| 文件 | 用途 |
|---|---|
| `nodes.json` | 当前节点的对白和选项 |
| `flow.json` | `default[currentNodeId]` 得到下一个节点；`byRoute` 按当前 path/mj 覆盖 |
| `routers.json` | `rules` 数组按顺序评估 condition，第一个 true 的跳转 |
| `variables.json` | 初始化 GameState 所有变量的默认值 |
| `scene_visuals.json` | 当前节点的背景/音乐/主题 |
| `endings.json` | 结局展示信息（标题、描述、emoji） |

### 4.2 GameState 核心变量

**数值变量：**

| 变量 | 说明 | 参与结局判定 |
|---|---|---|
| `distance` | 玩家行为造成的心理距离 | ✅ TRUE: <=3 |
| `narrativeDistance` | 剧情必经事件的客观距离 | ❌ 纯记录 |
| `control` | 控制欲 | 间接（影响 badLock） |
| `egoHold` | 自我坚持 | 间接 |
| `loveNotHabit` | 爱而非习惯 | 间接 |
| `nagiCare` | Nagi 关心度 | 间接 |
| `habitDepend` | 习惯依赖 | 间接 |

**Flag 变量：**

| 变量 | 说明 |
|---|---|
| `path` | dream / stay / bad（路线） |
| `mj` | M / J（隐藏分流） |
| `witnessFlag` | 见证者（TRUE 必需） |
| `personalHonor` | 个人荣誉（TRUE 必需） |
| `nagiNameIndependent` | Nagi 独立性（TRUE 必需） |
| `antCompress` | Ant 自我压缩（GOOD vs TRUE 分界） |
| `trueFlag` | TRUE 标记 |
| `badLock` | BAD 锁定 |
| `finalChoice` | 最终选择：witness / ordinary / coronation |

### 4.3 Effect 格式

```json
{ "var": "distance", "op": "add", "val": 1 }
{ "var": "path", "op": "set", "val": "dream" }
{ "var": "badLock", "op": "set", "val": true }
```

op 只有两种：`add`（数值累加）和 `set`（直接赋值）。

### 4.4 Router condition

Router 的 condition 是 JS 表达式字符串，例如：

```json
"badLock === true"
"path === \"dream\" && witnessFlag === true && personalHonor === true && antCompress === true"
"trueFlag >= 1 && distance <= 3 && witnessFlag === true && personalHonor === true && nagiNameIndependent === true && antCompress === false"
```

不需要完整 JS 引擎。建议写一个简单的条件解析器：
- 支持 `===`、`!==`、`>=`、`<=`、`>`、`<`
- 支持 `&&`、`||`
- 支持 `true`、`false`、数字、字符串字面量
- 变量名直接从 GameState 查值

### 4.5 Flow 查找逻辑

```kotlin
fun getNextNode(currentId: String, state: GameState): String? {
    // 1. 先查 byRoute 覆盖
    for ((routeName, overrides) in flow.byRoute) {
        if (overrides.containsKey(currentId)) {
            val match = when (routeName) {
                "M" -> state.mj == "M"
                "J" -> state.mj == "J"
                "dream" -> state.path == "dream"
                "stay" -> state.path == "stay"
                "bad" -> state.path == "bad"
                else -> false
            }
            if (match) return overrides[currentId]
        }
    }
    // 2. fallback 到 default
    return flow.default[currentId]
}
```

### 4.6 节点播放逻辑

```
1. 取当前节点 node = nodes[currentId]
2. 如果 node 为 null，检查 routers[currentId]（路由器节点）
3. 播放 node.dialogue 数组，逐条显示
4. 如果有 choices：
   a. choices.length == 1 且 autoAdvance == true → 自动应用 effects，跟随 transition
   b. 否则 → 显示选项给玩家
5. 玩家选择后，应用 choice.effects
6. 如果 choice.transition.type == "goto" → 跳转到 target
7. 如果 choice.transition.type == "ending" → 进入结局
8. 如果没有 transition → 用 flow 查下一个节点
9. 播放 choice.responses（选择后的回应对白）
```

### 4.7 autoAdvance 说明

有些节点只有一个 choice 且 `autoAdvance: true`，代表这是剧情必经的效果应用（不需要玩家选择）。直接应用 effects 并继续。

---

## 5. 结局判定

`ending_resolver` 路由器按优先级：

1. **BAD END** — `badLock === true` → end_bad
2. **TRUE END** — `trueFlag >= 1 && distance <= 3 && witnessFlag && personalHonor && nagiNameIndependent && !antCompress` → end_true
3. **GOOD END** — `path === "dream" && witnessFlag && personalHonor && antCompress` → end_good
4. **NORMAL END** — fallback → end_normal

---

## 6. uiTheme 机制

每个节点在 `scene_visuals.json` 有 `uiTheme` 字段：

| 值 | 行为 |
|---|---|
| `Light` | 用 LightNagiColors |
| `Dark` | 用 DarkNagiColors |
| `Auto` | 根据背景图亮度自动判断（brightness > 0.5 → Light） |
| `ending` | 结局专用，可特殊处理 |

优先级：节点配置 > 场景类型 > 背景亮度。

---

## 7. 设计约束（CoCo 明确要求）

- **竖屏固定**，不支持横屏
- **不用圆角卡片**，用 CutCornerGlassShape（轻切角 + 毛玻璃）
- **LINE ≠ Chapter**，LINE Mode 是剧情模式不是章节概念
- **选项是独立项**，不是传统列表
- **五角形是 Blue Lock 几何标识**，用于图标和标记
- **不要 X（叉）装饰**
- **不抄 Blue Lock logo**，只用几何元素致敬
- **所有人物说的话都必须作为对白显示**（有 speaker 字段），不能识别为旁白

---

## 8. UI 页面优先级

| 优先级 | 页面 | 说明 |
|--------|------|------|
| P0 | VN Scene | 全屏背景 + 底部毛玻璃对话框 + speaker + dialogue |
| P0 | Choice Panel | 独立毛玻璃卡片选项 |
| P0 | HUD | 顶部：Auto / Skip / Backlog / Save / Menu |
| P1 | Title Screen | 启动画面 |
| P1 | Save/Load | 存档管理 |
| P1 | Backlog | 对白回看 |
| P1 | LINE Mode | 聊天界面（node.mode == "line"） |
| P1 | Ending Card | 结局展示 |
| P1 | Prologue | 开场白序列 |
| P2 | Settings | 设置 |
| P2 | Gallery | 画廊 |
| P2 | Chapter Select | 章节选择 |

---

## 9. 验证

数据层已完全验证：

```bash
node tools/validate.js          # 15项全绿，0 errors, 0 warnings
node tools/golden-playthrough.js # 4条结局路径全通过
```

四路径终态：

| 路径 | 结局 | distance | narrativeDistance | 关键变量 |
|------|------|----------|-------------------|----------|
| TRUE | end_true | -1 | 9 | witnessFlag, personalHonor, nagiNameIndependent, trueFlag=1 |
| GOOD | end_good | -1 | 9 | antCompress=true, witnessFlag, personalHonor |
| NORMAL | end_normal | -1 | 9 | path=stay, finalChoice=ordinary |
| BAD | end_bad | 3 | 9 | badLock=true, control=12, nagiRebel=true |

Android 端跑起来后，对照 `tools/golden-playthrough.js` 的选择序列走一遍，确认 4 个结局都能到达。

---

## 10. 必读文档

1. `design/NagisHeart_Android_Design_Handoff_CC_v1_0.md` — 工程交接
2. `design/NagisHeart_Android_UI_Tokens_v1_0.md` — Token 完整规范
3. `design/NagisHeart_MainFlow_UI_Design_CC_v1_0.md` — 12 页 UI 规格
4. `design/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_v1_1.md` — 背景映射和优先级
5. `story-data/STORY_QA_REPORT.md` — 数据层验证报告

---

有问题直接问 Ant，或者在仓库开 issue。
