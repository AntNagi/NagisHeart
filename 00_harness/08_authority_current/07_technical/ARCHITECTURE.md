# Nagi's Heart — 技术架构设计

> 核心原则：**剧本是数据，不是代码。** 改台词、加节点、调数值、加结局——全部只改 JSON，不碰 Kotlin/JS。
> 
> 双端策略：**Android 主版本，Web 次版本。同一份 JSON 数据，两套引擎各自渲染。**

---

## 0. 整体架构：数据共享，引擎分治

```
nagi-otome/
│
├── story-data/              ← ★ 共享数据层（唯一真相源）
│   ├── nodes.json                所有场景节点
│   ├── chapters.json             章节结构
│   ├── flow.json                 FN 链 + 路线跳转
│   ├── routers.json              路由规则（条件分流）
│   ├── endings.json              结局定义 + 判定规则
│   ├── prologue.json             开场白
│   ├── scenes.json               节点标题 & 背景映射
│   ├── variables.json            变量定义 & 初始值
│   └── schema/                   JSON Schema 定义（可选，校验用）
│
├── assets/                  ← 共享资源
│   ├── bg/                       场景背景
│   ├── home/                     主页 & 公寓图
│   └── audio/                    BGM
│
├── android/                 ← ★ 主版本：Kotlin + Jetpack Compose
│   └── (Android 项目结构)
│
├── web/                     ← 次版本：轻量 JS 引擎
│   ├── index.html
│   ├── engine.js                 数据驱动引擎（读 JSON）
│   └── style.css
│
├── tools/                   ← 构建 & 转换工具
│   └── convert-story.js          story.js → JSON 转换脚本
│
├── docs/                    ← 产品 & 技术文档
└── design/                  ← 设计资料
```

### 关键规则

| 规则 | 说明 |
|------|------|
| **改剧本只改 `story-data/`** | 两端自动生效，不碰任何引擎代码 |
| **`story-data/` 是唯一真相源** | Android 构建时复制到 `assets/`，Web 构建时直接引用 |
| **两端引擎独立实现** | 共享数据 schema，不共享运行时代码 |
| **Android 先行** | 新功能先在 Android 实现和验证，Web 按需跟进 |

### 构建流水线

```
story-data/*.json ──┬──→ Android: Gradle task 复制到 app/src/main/assets/story/
                    │
                    └──→ Web: 直接 fetch 或打包时内联
```

---

## 1. Android 主版本 — 模块分层

```
android/app/
├── data/                    ← 数据层：JSON 加载、存档读写
│   ├── story/
│   │   ├── StoryLoader.kt        加载 & 解析 JSON
│   │   ├── StoryRepository.kt    提供节点/章节/结局的查询接口
│   │   └── model/                数据模型（Kotlin data class）
│   │       ├── StoryNode.kt
│   │       ├── Choice.kt
│   │       ├── DialogueLine.kt
│   │       ├── Chapter.kt
│   │       ├── Ending.kt
│   │       └── RouterRule.kt
│   └── save/
│       ├── SaveManager.kt        存档的 CRUD（Room 或 DataStore）
│       └── GameState.kt          完整游戏状态快照
│
├── engine/                  ← 引擎层：纯 Kotlin 逻辑，不依赖 Android/UI
│   ├── StoryEngine.kt           剧情推进核心（当前节点、对话队列、选项处理）
│   ├── EffectProcessor.kt       通用数值效果执行器
│   ├── ConditionEvaluator.kt    条件表达式求值器
│   ├── RouterResolver.kt        路由节点分流
│   ├── FlowManager.kt           FN 链 + 路线分支跳转
│   └── NameSubstituter.kt       称呼替换
│
├── ui/                      ← UI 层：Jetpack Compose
│   ├── theme/                    色彩、字体、主题
│   ├── screen/
│   │   ├── HomeScreen.kt         主页
│   │   ├── PrologueScreen.kt    开场白
│   │   ├── SetupScreen.kt       名字录入
│   │   ├── ChapterMapScreen.kt  章节目录
│   │   ├── GameScreen.kt        游戏主界面（对话/选项/旁白）
│   │   ├── EndingScreen.kt      结局展示
│   │   ├── GalleryScreen.kt     结局图鉴
│   │   └── SaveScreen.kt        存档管理
│   ├── component/
│   │   ├── DialoguePanel.kt     对话面板（说话者 + 打字效果）
│   │   ├── NarrationOverlay.kt  旁白沉浸层
│   │   ├── ChoiceCard.kt        选项卡片
│   │   ├── BondBar.kt           羁绊进度条
│   │   ├── PetalAnimation.kt   花瓣动画
│   │   └── TypewriterText.kt   逐字打印文本
│   └── viewmodel/
│       ├── GameViewModel.kt     游戏主 ViewModel
│       └── MapViewModel.kt      章节目录 ViewModel
│
└── assets/story/            ← 构建时从 story-data/ 复制过来
```

## 2. Web 次版本 — 轻量引擎

```
web/
├── index.html               ← 单页应用
├── engine.js                ← 数据驱动引擎
│   ├── StoryEngine class        对话队列、选项处理
│   ├── EffectProcessor          通用效果执行
│   ├── ConditionEvaluator       条件求值（和 Android 版逻辑一致）
│   ├── RouterResolver           路由分流
│   ├── FlowManager              FN 链跳转
│   └── NameSubstituter          称呼替换
├── renderer.js              ← DOM 渲染（对话面板、选项卡片、旁白等）
├── state.js                 ← GameState + localStorage 存档
└── style.css                ← 样式（沿用现有视觉风格）
```

### Web 版和 Android 版的关系

| 方面 | Android（主） | Web（次） |
|------|--------------|-----------|
| **数据源** | 同一份 `story-data/*.json` | 同一份 `story-data/*.json` |
| **引擎逻辑** | Kotlin 实现 | JS 实现（逻辑对齐） |
| **UI 框架** | Jetpack Compose | 原生 DOM + CSS |
| **存档** | Room / DataStore | localStorage |
| **热更新** | 服务器拉 JSON | 同（fetch 新 JSON） |
| **功能优先级** | 新功能首发 | 按需跟进 |
| **用途** | 主要分发渠道 | iOS 用户 / 分享链接 / 试玩 |

---

## 2. JSON Schema 设计

### 2.1 场景节点 — `nodes.json`

```json
{
  "p1": {
    "dialogue": [
      { "speaker": "sys", "text": "绘心甚八的作战室。巨大屏幕上，正直播蓝色监狱的选拔——V队对Z队。" },
      { "speaker": "sys", "text": "作为受邀的风险投资人，你本只是来看「项目」。" },
      { "speaker": "nagi", "text": "（重新打量你）……投资人，比我想的年轻很多" }
    ],
    "choices": [
      {
        "label": "（屏住呼吸）这个人，眼睛里有星星",
        "tag": "心动",
        "playerLine": "……这个人，眼睛里有星星",
        "responses": [
          { "speaker": "nagi", "text": "『——好奇心，原来是这种感觉』" },
          { "speaker": "sys", "text": "你却没有再看其他人，只是在凪诚士郎的名字旁边，轻轻做了一个标记。" }
        ],
        "effects": [
          { "var": "bond", "op": "add", "val": 2 },
          { "var": "I", "op": "add", "val": 2 }
        ],
        "transition": { "type": "section_end" }
      },
      {
        "label": "（职业直觉）他的成长曲线，价值连城",
        "tag": "理性",
        "playerLine": "他的成长曲线……价值连城",
        "responses": [
          { "speaker": "nagi", "text": "『足球，好像……没那么无聊了』" }
        ],
        "effects": [
          { "var": "bond", "op": "add", "val": 1 },
          { "var": "I", "op": "add", "val": 2 }
        ],
        "transition": { "type": "section_end" }
      }
    ]
  }
}
```

**改台词 = 改 `"text"` 字段。加节点 = 加一个 key。不碰任何代码。**

### 2.2 选项效果 — `effects` 通用格式

```json
// 数值操作
{ "var": "I", "op": "add", "val": 3 }
{ "var": "D", "op": "add", "val": 1 }
{ "var": "ego", "op": "add", "val": 1 }

// 旗标设置
{ "var": "path", "op": "set", "val": "dream" }
{ "var": "nagiResonate", "op": "set", "val": true }
{ "var": "mj", "op": "set", "val": "M" }

// 路线设置（语法糖，等价于 set path + set route）
{ "var": "route", "op": "set", "val": "dream" }
```

引擎里一个 `EffectProcessor` 统一处理，用 Map 存所有变量：

```kotlin
class EffectProcessor(private val state: GameState) {
    fun apply(effects: List<Effect>) {
        effects.forEach { e ->
            when (e.op) {
                "add" -> state.addNumeric(e.variable, e.value as Int)
                "set" -> state.setVariable(e.variable, e.value)
            }
        }
    }
}
```

**以后加新数值？在 `variables.json` 加一行定义，选项里的 effects 直接引用，引擎代码零改动。**

### 2.3 流转控制 — `transition`

```json
// 跳到指定节点
{ "type": "goto", "target": "c2b" }

// 本节结束（走 FN 链到下一节）
{ "type": "section_end" }

// 进入结局判定
{ "type": "ending" }

// 指定结局
{ "type": "ending", "tier": "bad" }

// 彩蛋
{ "type": "egg" }
```

### 2.4 FN 流转链 — `flow.json`

```json
{
  "default": {
    "p1": "p2",
    "p2": "c1a",
    "c1a": "e_select2",
    "e_select2": "c1b"
  },
  "byRoute": {
    "dream": { "p5_intro": "e_villa" },
    "stay": { "p5_intro": "stay_intro" }
  }
}
```

### 2.5 路由规则 — `routers.json`

把硬编码 if-else 变成数据：

```json
{
  "m_igate": {
    "rules": [
      {
        "condition": "control >= 2 || D >= 3",
        "sideEffects": [{ "var": "mDeep", "op": "set", "val": false }],
        "target": "m_shallow"
      },
      {
        "condition": "ego >= 1 || I >= 2",
        "sideEffects": [{ "var": "mDeep", "op": "set", "val": true }],
        "target": "e_intimate_cohabit"
      }
    ],
    "fallback": "m_shallow"
  },
  "route_agency_post": {
    "rules": [
      { "condition": "mj == 'M'", "target": "e_scarf" },
      { "condition": "mj == 'J'", "target": "e_dressup" }
    ],
    "fallback": "e_dressup"
  },
  "route_dream_final": {
    "rules": [
      {
        "condition": "path == 'dream' && !antCompress && witnessFlag && personalHonor && nagiNameIndependent && control <= 3 && D <= 3",
        "target": "dream_final_true"
      }
    ],
    "fallback": "dream_final_good"
  }
}
```

条件求值器支持的语法：`==`, `!=`, `>=`, `<=`, `>`, `<`, `&&`, `||`, `!`, 括号，字符串/数字/布尔字面量。不需要完整脚本语言，一个简单的表达式解析器就够。

### 2.6 章节结构 — `chapters.json`

```json
[
  {
    "id": "part1",
    "name": "第一部",
    "title": "原作前置篇",
    "background": "bg/teamV.jpg",
    "sections": [
      { "name": "第一幕", "title": "作战室·初遇", "startNode": "p1" },
      { "name": "第二幕", "title": "投资的私心", "startNode": "p2" },
      { "name": "第三幕", "title": "训练室初见", "startNode": "c1a", "background": "bg/pitch.jpg" }
    ]
  }
]
```

### 2.7 结局 — `endings.json`

```json
{
  "true": {
    "tag": "TRUE END",
    "emoji": "💛",
    "title": "世界第一，与你",
    "description": "那个对全世界都说「好麻烦」的天才，把唯一的认真、整座奖杯和一整个未来都踢成了——献给你的，那一记传球。",
    "subtitle": "💛 你读懂了他的全部，他也读懂了你的",
    "eggScene": "c8c"
  }
}
```

### 2.8 变量定义 — `variables.json`

```json
{
  "numeric": {
    "I": { "label": "理解度", "initial": 0 },
    "D": { "label": "心墙", "initial": 0 },
    "bond": { "label": "羁绊", "initial": 0 },
    "ego": { "label": "自主意志", "initial": 0 },
    "control": { "label": "管控倾向", "initial": 0 },
    "habitWarm": { "label": "舒适依赖", "initial": 0 },
    "habitDepend": { "label": "习惯依存", "initial": 0 }
  },
  "flags": {
    "mj": { "label": "M/J路线", "type": "string", "initial": null },
    "path": { "label": "主路线", "type": "string", "initial": null },
    "route": { "label": "当前路线", "type": "string", "initial": null },
    "nagiResonate": { "label": "共鸣觉醒", "type": "boolean", "initial": false },
    "antCompress": { "label": "Ant压迫", "type": "boolean", "initial": false },
    "witnessFlag": { "label": "见证关键", "type": "boolean", "initial": false },
    "personalHonor": { "label": "尊重荣誉", "type": "boolean", "initial": false }
  }
}
```

**加新数值？在这里加一行，选项 effects 里引用，引擎自动识别。不改代码。**

### 2.9 结局判定 — `endings.json` 扩展

把 `finish()` 函数的 if-else 也数据化：

```json
{
  "judgement": [
    {
      "tier": "bad",
      "condition": "path == 'cling' || D >= 6"
    },
    {
      "tier": "true",
      "condition": "nagiResonate && !antCompress && D <= 3 && path == 'dream' && finalFlag == 'support'"
    },
    {
      "tier": "good",
      "condition": "!antCompress && path == 'dream'"
    },
    {
      "tier": "normal",
      "condition": "true"
    }
  ]
}
```

从上到下匹配，第一个命中的就是结局。

---

## 3. 引擎核心流程

```
用户点击屏幕
    │
    ▼
StoryEngine.advance()
    │
    ├── 对话队列未完？→ 播放下一句 → UI 更新
    │
    ├── 对话队列完 + 有 choices？→ 展示选项 → 等用户选择
    │
    └── 用户选择了选项：
          │
          ├── EffectProcessor.apply(choice.effects)  ← 通用数值处理
          │
          ├── 播放 playerLine + responses 队列
          │
          └── 处理 transition：
                ├── goto → FlowManager.goTo(target)
                ├── section_end → FlowManager.nextByFN(currentNode)
                ├── ending → EndingJudge.evaluate(state) → 结局画面
                └── egg → 彩蛋流程
```

---

## 4. GameState — 统一状态容器

不再硬编码 `let I=0, D=0, ego=0 ...`，改成 Map：

```kotlin
class GameState {
    // 所有数值变量
    private val numerics = mutableMapOf<String, Int>()
    // 所有旗标变量
    private val flags = mutableMapOf<String, Any?>()
    // 游戏位置
    var currentNode: String? = null
    var maxStage: Int = 0

    fun getNumeric(key: String): Int = numerics[key] ?: 0
    fun addNumeric(key: String, delta: Int) { numerics[key] = getNumeric(key) + delta }
    fun setVariable(key: String, value: Any?) { flags[key] = value }
    fun getFlag(key: String): Any? = flags[key]
    fun getBool(key: String): Boolean = flags[key] as? Boolean ?: false

    // 序列化（存档用）
    fun toJson(): JsonObject { ... }
    // 反序列化（读档用）
    fun fromJson(json: JsonObject) { ... }
    // 重置（新游戏）
    fun reset(definitions: VariableDefinitions) { ... }
}
```

**好处：存档就是把这个 Map 序列化成 JSON，读档就是反序列化回来。加新变量不需要改存档代码。**

---

## 5. 热更新方案（双端统一）

```
你改了剧本 JSON
    │
    ├──→ 推到 GitHub / CDN
    │
    ├──→ Android 用户：app 启动时后台拉新版 JSON → 下次打开自动生效
    │     优先级：缓存版 > 打包版
    │     回退：缓存损坏 → 删除缓存 → 用打包版
    │
    └──→ Web 用户：刷新页面即生效（fetch 最新 JSON）
```

**两端用户都不需要等你发版。**

版本号机制：`story-data/` 下放一个 `version.json`：
```json
{ "version": 42, "minEngineVersion": 1 }
```
- `version`：每次改内容 +1，客户端比对决定是否更新
- `minEngineVersion`：如果 schema 有破坏性变更，标记需要的最低引擎版本，低于此版本的客户端不拉取（避免崩溃）

---

## 6. 改动成本对比

| 操作 | 旧方案（硬编码） | 新方案（数据驱动） |
|------|------------------|-------------------|
| 改一句台词 | 改 story.js 代码 → 重新部署 | 改 nodes.json → 两端自动生效 |
| 加一个新节点 | 改 story.js + FN + SCENE + NODEBG + stageIndex | nodes.json 加节点 + flow.json 加链接 |
| 加一个新数值 | 改 let 声明 + saveState + loadSt + clearState + choose（6处） | variables.json 加一行 |
| 加一个新结局 | 改 ENDINGS + finish() + ENDING_ORDER + 渲染逻辑 | endings.json 加一条 |
| 加一个路由分支 | 改 resolveRouter() 硬编码 if-else | routers.json 加一条规则 |
| 调整结局条件 | 改 finish() 函数 | endings.json 改条件表达式 |
| 支持新平台 | 从零重写 | 新写一套渲染层，引擎逻辑对齐，数据直接复用 |

**每一项都从"改代码 × N 个平台"变成了"改一份 JSON，全平台生效"。**

---

## 7. 开发顺序

```
Phase 1 — 数据迁移（当前阶段）
├── 写 convert-story.js，自动把 story.js → JSON
├── 校验 JSON 完整性（节点数、FN 链、路由覆盖）
└── 产出 story-data/ 目录

Phase 2 — Android 项目搭建
├── 初始化 Kotlin + Compose 项目
├── 实现引擎层（StoryEngine / EffectProcessor / ConditionEvaluator）
├── 实现 UI 层（先跑通主线：对话 → 选项 → 跳转 → 结局）
└── 接入存档系统

Phase 3 — Android 完善
├── 全部 UI 画面（主页/目录/设定/图鉴/存档）
├── 动画（花瓣/打字/背景切换）
├── 热更新
└── 测试 & 发布

Phase 4 — Web 次版本
├── 用 JS 重写轻量引擎（读同一份 JSON）
├── 复用现有 CSS 视觉风格
└── 部署到 GitHub Pages
```

---

*下一步：确认架构方案后，开始 Phase 1 — 写转换脚本把现有 story.js 自动迁移到 story-data/ JSON 格式。*
