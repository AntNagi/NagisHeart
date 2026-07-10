# Nagi's Heart -- 底层规则技术任务拆解 v1.1

> 基准文档：PRD v2.0 + 交互设计 v1.0
> 范围：数据结构、引擎规则、存档、已读、图鉴、回想 -- 不含 UI 代码
> 优先级：MVP > Phase 2 > Phase 3（与 PRD 18 章对齐）
> 变更记录：v1.0 -> v1.1 根据产品经理 9 条校准反馈修订

### v1.1 修订摘要

| # | 反馈 | 修订 |
|---|------|------|
| 1 | LINE 优先级冲突 | MVP 只实现 vn 模式，`mode` 字段保留但 LINE 引擎/回想全部移 Phase 2 |
| 2 | 变量迁移不要一步清理 | 新增 legacy alias 映射表，旧名可用，验证通过后再清理 |
| 3 | 缺 EndingResolver | 新增 T2.7 EndingResolver 为 MVP 任务 |
| 4 | 缺 StoryDataValidator | 新增 T0.1 StoryDataValidator，排在数据迁移之前 |
| 5 | 已读用 lineIndex 不稳定 | dialogue 每行增加稳定 `id`，readLines 存 lineId |
| 6 | GameState 快照不够完整 | 扩展快照字段：currentMode / messageIndex / pendingChoice / currentBg 等 |
| 7 | 事件回想不应用默认 GameState | 节点完成时记录 replay snapshot |
| 8 | 章节地图不能只靠 FN 前驱 | 节点增加 visibleWhen / unlockCondition / routeScope / spoilerLevel |
| 9 | 图鉴解锁不写死 toast | 底层只发 event，UI 层决定提示方式 |

---

## 0. 前置任务

### T0.1 StoryDataValidator 数据校验器 (MVP，数据迁移之前)

数据迁移前必须先有校验工具，否则错误数据进入引擎后难以排查。

```
StoryDataValidator 校验清单：

结构完整性：
  - [ ] 所有 flow.json default/byRoute target 在 nodes.json 中存在
  - [ ] 所有 routers.json rules[].target 和 fallback 在 nodes.json 中存在
  - [ ] 所有 choices[].transition.target（type=goto）在 nodes.json 中存在
  - [ ] 不可达节点检测：从 p1 出发沿 FN 链 + 路由走不到的节点
  - [ ] 死路检测：无 transition 且无 FN 后继且非结局节点
  - [ ] 环路检测：FN 链中的循环引用

变量一致性：
  - [ ] 所有 effects[].var 在 variables.json 中有定义（或在 legacy alias 中）
  - [ ] 所有 condition 表达式引用的变量在 variables.json 中有定义
  - [ ] 数值变量只被 add/sub 操作，flag 变量只被 set/toggle 操作

内容规范：
  - [ ] 玩家可见文本中不残留硬编码 "Ant"（应为 {{playerName}}）
  - [ ] 旁白/系统/标题文本中不出现 {{nagiCall}}（应写死 Nagi）
  - [ ] 所有 dialogue[].id 在同一节点内唯一
  - [ ] 所有 {{playerName}} / {{nagiCall}} 模板格式正确（无多余空格、大小写错误）

资源引用：
  - [ ] bg 引用的图片文件存在于 assets/
  - [ ] cg 引用的 ID 在 cg.json 中存在（Phase 2）
  - [ ] bgm 引用的音频文件存在于 assets/（Phase 3）

输出：
  - 校验通过：✅ 0 errors, N warnings
  - 校验失败：❌ 逐条列出 error（阻断）和 warning（提示）
```

#### 行动项
- [ ] 实现为 Node.js CLI 工具（工作笔记本可运行，不依赖 Android）
- [ ] 数据迁移脚本运行后自动执行校验
- [ ] CI 可选集成（后续）

---

## 1. 剧情数据结构

### T1.1 节点 Schema 重设计 (MVP)

当前 `nodes.json` 只有 `dialogue` + `choices`，需要扩展。

**v1.1 变更：MVP 只实现 `mode: "vn"`。`mode` 字段保留，LINE 引擎移 Phase 2。每行 dialogue 增加稳定 `id`。新增章节地图可见性控制字段。**

```json
{
  "p1": {
    "mode": "vn",
    "dialogue": [
      {
        "id": "p1_d001",
        "speaker": "sys",
        "text": "绘心甚八的作战室。巨大屏幕上，正直播蓝色监狱的选拔——V队对Z队。",
        "display": "bottom"
      },
      {
        "id": "p1_d002",
        "speaker": "sys",
        "text": "连续长段落旁白...",
        "display": "fullscreen"
      },
      {
        "id": "p1_d003",
        "speaker": "nagi",
        "text": "..."
      }
    ],
    "choices": [ ... ],
    "bg": "bg/teamV.jpg",
    "bgm": null,
    "cg": null,
    "autoSave": true,
    "mapMeta": {
      "visibleWhen": null,
      "unlockCondition": null,
      "routeScope": null,
      "spoilerLevel": 0
    }
  }
}
```

#### 字段说明

| 字段 | 类型 | 说明 | MVP? |
|------|------|------|------|
| `mode` | `"vn" \| "line"` | 节点演出模式，默认 `"vn"`。MVP 只实现 vn | Yes (字段保留) |
| `dialogue[].id` | `string` | 行级稳定 ID，格式 `{nodeId}_d{序号}`，用于已读追踪和存档游标 | Yes |
| `dialogue[].display` | `"bottom" \| "fullscreen" \| null` | 旁白显示模式，null=默认对话框 | Yes |
| `bg` | `string \| null` | 背景图路径 | Yes |
| `bgm` | `string \| null` | 背景音乐 ID | Phase 3 |
| `cg` | `string \| null` | 触发 CG 的 ID（解锁用） | Phase 2 |
| `autoSave` | `boolean` | 是否在此节点入口自动存档，默认 true | Yes |
| `mapMeta.visibleWhen` | `string \| null` | 章节地图可见条件表达式，null=可见 | Yes |
| `mapMeta.unlockCondition` | `string \| null` | 解锁条件（区别于可见性），null=前驱完成即解锁 | Yes |
| `mapMeta.routeScope` | `string \| null` | 所属路线（dream/stay/bad），null=公共节点 | Yes |
| `mapMeta.spoilerLevel` | `int` | 剧透等级 0-3，地图展示时根据玩家进度过滤 | Yes |

#### 行动项
- [ ] 定义节点 JSON Schema（story-data/schema/node.schema.json）
- [ ] 每行 dialogue 分配稳定 `id`（格式 `{nodeId}_d{三位序号}`）
- [ ] 所有旁白 dialogue 补上 `display` 字段
- [ ] 节点增加 `bg` / `cg` / `autoSave` / `mapMeta` 字段
- [ ] MVP 引擎遇到 `mode: "line"` 时 fallback 为 vn 模式播放（降级，不报错）

---

### T1.2 选项 Schema 重设计 (MVP)

```json
{
  "id": "p1_c001",
  "label": "想赢和怕麻烦可以同时存在",
  "displayTag": "理解",
  "internalTag": "understanding",
  "playerLine": "想赢和怕麻烦可以同时存在。这不矛盾。",
  "responses": [
    { "id": "p1_c001_r001", "speaker": "nagi", "text": "..." }
  ],
  "effects": [
    { "var": "understanding", "op": "add", "val": 2 },
    { "var": "witness", "op": "add", "val": 1 }
  ],
  "transition": { "type": "section_end" },
  "condition": null,
  "confirmRequired": false
}
```

**v1.1 变更：选项和 response 行也加稳定 `id`，用于已读追踪和 Backlog。**

#### 字段说明

| 字段 | 说明 | MVP? |
|------|------|------|
| `id` | 选项稳定 ID，格式 `{nodeId}_c{序号}` | Yes |
| `displayTag` | 玩家可见标签 | Yes |
| `internalTag` | 后台标签 | Yes |
| `responses[].id` | response 行稳定 ID | Yes |
| `condition` | 显示条件，null=始终显示 | Yes |
| `confirmRequired` | 不可逆确认对话框 | Yes |

#### 行动项
- [ ] 定义选项 JSON Schema
- [ ] 旧 `tag` 字段拆分为 `displayTag` + `internalTag`
- [ ] 支持条件选项（隐藏不满足条件的选项）
- [ ] 选项和 response 行分配稳定 `id`

---

### T1.3 变量定义 + Legacy Alias (MVP)

**v1.1 变更：不在第一轮直接清理旧变量名。建立 canonical -> legacy 映射表，旧名可用，验证全量路线和结局通过后再清理。**

```json
{
  "numeric": {
    "bond": { "label": "关系亲密度", "initial": 0, "legacy": ["b"] },
    "understanding": { "label": "理解度", "initial": 0, "legacy": ["I", "i", "u"] },
    "distance": { "label": "距离", "initial": 0, "legacy": ["D", "d"] },
    "ego": { "label": "自主意志", "initial": 0, "legacy": [] },
    "control": { "label": "管控倾向", "initial": 0, "legacy": [] },
    "witness": { "label": "见证", "initial": 0, "legacy": [] },
    "independence": { "label": "独立性", "initial": 0, "legacy": [] }
  },
  "flags": {
    "path": { "type": "string", "initial": null, "legacy": [] },
    "route": { "type": "string", "initial": null, "legacy": [] },
    "mj": { "type": "string", "initial": null, "legacy": [] },
    "nagiResonate": { "type": "boolean", "initial": false, "legacy": [] },
    "antCompress": { "type": "boolean", "initial": false, "legacy": [] },
    "witnessFlag": { "type": "boolean", "initial": false, "legacy": [] },
    "personalHonor": { "type": "boolean", "initial": false, "legacy": [] },
    "nagiNameIndependent": { "type": "boolean", "initial": false, "legacy": [] }
  }
}
```

#### Legacy Alias 解析规则

```
当 EffectProcessor / ConditionEvaluator 遇到变量名时：
  1. 先查 canonical name（bond, understanding, distance...）
  2. 未命中 -> 查 legacy alias 映射表
  3. 命中 legacy -> 内部转为 canonical name 使用
  4. 都未命中 -> StoryDataValidator 报 warning
```

#### 行动项
- [ ] 补全 witness / independence 到 numeric
- [ ] 建立 legacy alias 映射：b->bond, I/i/u->understanding, D/d->distance
- [ ] GameState 内部只存 canonical name
- [ ] EffectProcessor / ConditionEvaluator 接受 legacy name，自动转换
- [ ] StoryDataValidator 对使用 legacy name 的地方报 warning（不阻断）
- [ ] 全量路线验证通过后，Phase 2 清理 legacy alias

---

### T1.4 FN 链更新 (MVP)

第一部最新链路：`p1 -> p2 -> c1a -> c1b -> u20j`

```json
{
  "default": {
    "p1": "p2",
    "p2": "c1a",
    "c1a": "c1b",
    "c1b": "u20j"
  }
}
```

#### 行动项
- [ ] 从 flow.json default 链中移除 `e_select2`
- [ ] 确认完整 8 部 + 结局的 FN 链
- [ ] 确认 byRoute 分支链路无悬挂节点
- [ ] StoryDataValidator 校验链路完整性

---

### T1.5 CG 定义新增 (Phase 2)

（与 v1.0 相同，无变更）

新增 `story-data/cg.json`：

```json
[
  {
    "id": "cg_p1_first_sight",
    "title": "作战室 · 初遇",
    "chapter": "part1",
    "image": "cg/p1_first_sight.jpg",
    "unlockNode": "p1",
    "unlockCondition": null
  }
]
```

#### 行动项
- [ ] 设计 CG JSON Schema
- [ ] 按 PRD 13.2 列出所有篇章的 CG 定义
- [ ] 节点 schema 中的 `cg` 字段指向 cg.json 的 id

---

### T1.6 LINE 节点数据结构 (Phase 2)

（与 v1.0 相同，无变更。LINE 引擎和 LINE 回想均为 Phase 2。）

```json
{
  "c1b_line": {
    "mode": "line",
    "chatWith": "nagi",
    "timeLabel": "23:47",
    "messages": [
      { "id": "c1b_line_m001", "sender": "nagi", "text": "……你还没睡？", "typing": 2000 },
      { "id": "c1b_line_m002", "sender": "player", "text": "在看你的比赛回放" }
    ],
    "choices": [ ... ]
  }
}
```

**v1.1 变更：LINE messages 也加稳定 `id`。**

#### 行动项
- [ ] 定义 LINE 消息 JSON Schema
- [ ] LINE messages 分配稳定 `id`（格式 `{nodeId}_m{序号}`）
- [ ] LINE 选项用 `type: "line_reply"` 区分
- [ ] 设计 LINE <-> VN 模式切换的 transition

---

## 2. 节点推进与引擎规则

### T2.1 StoryEngine 核心推进逻辑 (MVP)

**v1.1 变更：MVP 只实现 vn 模式推进。遇到 `mode: "line"` 节点降级为 vn 播放。**

```
advance() 流程（MVP）：
  1. mode == "vn"（或 LINE 降级）
     a. dialogueQueue 有下一句 -> 播下一句
        - speaker == "sys" && display == "fullscreen" -> 全屏旁白
        - speaker == "sys" && display == "bottom" -> 底部旁白
        - speaker == "sys" && display == null -> 默认底部旁白
        - 其他 speaker -> 对话框
     b. dialogueQueue 完 + 有 choices -> 展示选项
     c. 无 choices -> transition 处理
  2. mode == "line" -> [Phase 2] LINE 引擎接管
```

#### 行动项
- [ ] MVP 实现 vn 模式推进
- [ ] 旁白 display 字段控制渲染方式（不自动猜测）
- [ ] LINE 节点 MVP 降级：将 messages 转为 dialogue 格式播放
- [ ] Phase 2 接入 LINE 引擎时替换降级逻辑

---

### T2.2 NameSubstituter 严格限制 (MVP)

（与 v1.0 相同，无变更）

只替换 `{{playerName}}` 和 `{{nagiCall}}`，禁止全局替换 Nagi。

#### 行动项
- [ ] NameSubstituter 实现仅两个 replace
- [ ] 剧本数据中，玩家直接叫 Nagi 的地方用 `{{nagiCall}}`
- [ ] 旁白/系统/标题中一律写死 `Nagi`
- [ ] 一一称呼用 `{{playerName}}小姐` 和 `Nagi少爷`（数据层硬编码）

---

### T2.3 EffectProcessor 通用效果执行 (MVP)

**v1.1 变更：接受 legacy alias 变量名。效果执行不产生任何 UI 行为——不发 toast，不显示数值，仅修改 GameState。**

```kotlin
class EffectProcessor(
    private val state: GameState,
    private val aliasResolver: VariableAliasResolver
) {
    fun apply(effects: List<Effect>) {
        effects.forEach { e ->
            val canonicalVar = aliasResolver.resolve(e.variable)
            when (e.op) {
                "add" -> state.addNumeric(canonicalVar, e.value as Int)
                "sub" -> state.addNumeric(canonicalVar, -(e.value as Int))
                "set" -> state.setVariable(canonicalVar, e.value)
                "toggle" -> state.setVariable(canonicalVar, !state.getBool(canonicalVar))
            }
        }
    }
}
```

#### 行动项
- [ ] 支持 add / sub / set / toggle
- [ ] 通过 VariableAliasResolver 支持 legacy name
- [ ] 效果执行后零 UI 反馈（PRD 9.4）

---

### T2.4 ConditionEvaluator 表达式求值 (MVP)

**v1.1 变更：同样通过 VariableAliasResolver 支持 legacy name。**

#### 行动项
- [ ] 实现表达式 tokenizer + recursive descent parser
- [ ] 变量名先过 alias resolver 再查 GameState
- [ ] 单元测试覆盖：数值比较、字符串比较、布尔逻辑、嵌套括号、null 变量
- [ ] 未定义变量返回默认值（数值=0, 布尔=false, 字符串=null）

---

### T2.5 RouterResolver 数据驱动路由 (MVP)

（与 v1.0 相同，无变更）

#### 行动项
- [ ] 旧 resolveRouter() 的 6 个 if-else 全部迁移到 routers.json
- [ ] sideEffects 通过 EffectProcessor 统一执行

---

### T2.6 FlowManager FN 链推进 (MVP)

（与 v1.0 相同，无变更）

#### 行动项
- [ ] byRoute 优先于 default 的查找顺序
- [ ] 路由节点识别
- [ ] 链路完整性交由 StoryDataValidator 校验（T0.1）

---

### T2.7 EndingResolver 结局判定 (MVP) [v1.1 新增]

结局图鉴只是解锁结果的展示。真正关键是从 GameState 判定玩家达成哪个结局。

```
EndingResolver.evaluate(state) 流程：
  1. 读取 endings.json 的 judgement 规则列表
  2. 从上到下逐条评估 condition
  3. 第一个命中的 tier 就是最终结局
  4. 返回 EndingResult { tier, endingNode, endingData }
  5. FlowManager 跳转到对应 ending node
  6. 播放结局剧情
  7. 触发 GalleryEventBus.emit("ending_unlocked", tier)
```

```json
{
  "judgement": [
    {
      "tier": "bad",
      "condition": "path == 'cling' || distance >= 6",
      "node": "ending_bad"
    },
    {
      "tier": "true",
      "condition": "nagiResonate && !antCompress && distance <= 3 && path == 'dream' && witnessFlag && nagiNameIndependent",
      "node": "ending_true"
    },
    {
      "tier": "good",
      "condition": "!antCompress && path == 'dream'",
      "node": "ending_good"
    },
    {
      "tier": "normal",
      "condition": "true",
      "node": "ending_normal"
    }
  ]
}
```

#### 行动项
- [ ] EndingResolver: evaluate(state) -> EndingResult
- [ ] 从上到下匹配，第一个命中即为结局
- [ ] 每条规则指向对应 ending node（结局剧情节点）
- [ ] 结局判定后发 `ending_unlocked` 事件（不直接操作 UI/toast）
- [ ] 单元测试覆盖全部 4 个结局条件组合

---

## 3. 存档结构

### T3.1 GameState 完整快照 (MVP)

**v1.1 变更：大幅扩展快照字段。只存 currentNode + currentLineIndex 不够，选项回应中途或 LINE 播放中途存档会丢失上下文。**

```json
{
  "version": 1,
  "timestamp": "2026-07-10T22:30:00Z",

  "playerName": "Ant",
  "nagiCall": "凪",

  "position": {
    "currentNode": "c1b",
    "currentLineId": "c1b_d005",
    "currentLineIndex": 5,
    "currentMode": "vn",
    "currentChapter": "part1"
  },

  "playbackState": {
    "pendingChoiceId": null,
    "choiceResponseQueue": [],
    "pendingTransition": null,
    "messageIndex": null
  },

  "presentation": {
    "currentBg": "bg/apartment.jpg",
    "currentBgm": null,
    "uiTheme": "default"
  },

  "numerics": {
    "bond": 4,
    "understanding": 3,
    "distance": 0,
    "ego": 0,
    "control": 0,
    "witness": 1,
    "independence": 0
  },

  "flags": {
    "path": null,
    "route": null,
    "mj": null,
    "nagiResonate": false,
    "antCompress": false,
    "witnessFlag": false,
    "personalHonor": false,
    "nagiNameIndependent": false
  },

  "maxStage": 1
}
```

#### 新增字段说明

| 字段 | 说明 | 解决的问题 |
|------|------|-----------|
| `position.currentLineId` | 当前行的稳定 ID | 剧本修改后 lineIndex 偏移 |
| `position.currentLineIndex` | 行序号（fallback） | lineId 不存在时回退 |
| `position.currentMode` | vn / line | LINE 模式中途存档 |
| `playbackState.pendingChoiceId` | 当前等待选择的选项 ID | 选项面板打开时存档 |
| `playbackState.choiceResponseQueue` | 选择后待播放的 response 列表 | 选项回应播放中途存档 |
| `playbackState.pendingTransition` | 待执行的跳转 | 节点结束但未执行跳转时存档 |
| `playbackState.messageIndex` | LINE 模式当前消息序号 | LINE 播放中途存档 |
| `presentation.currentBg` | 当前背景图 | 恢复视觉状态 |
| `presentation.currentBgm` | 当前 BGM | 恢复音频状态 |
| `presentation.uiTheme` | UI 主题 | 特殊演出可能切换主题 |

#### 行动项
- [ ] 定义完整 GameState 序列化 schema
- [ ] 存档恢复时：先恢复 position -> playbackState -> presentation -> 引擎状态
- [ ] 存档版本号机制：version 字段，旧存档迁移策略
- [ ] currentLineId 优先，currentLineIndex 作为 fallback

---

### T3.2 存档系统结构 (MVP)

（与 v1.0 核心相同）

#### 自动存档触发点（PRD 11.1）

1. 节点开始（`autoSave: true` 的节点）
2. 节点结束
3. 做出选择后
4. 进入结局页
5. 解锁图鉴内容后

#### 行动项
- [ ] 自动存档槽 x1 + 快速存档槽 x1 + 手动存档槽 x30
- [ ] SaveManager: save / load / delete / list / lock
- [ ] meta 信息不暴露数值
- [ ] 自动存档 5 个触发点的引擎钩子

---

### T3.3 全局持久数据（跨存档）(MVP)

（与 v1.0 相同）

#### 行动项
- [ ] 全局数据与存档数据分离存储
- [ ] 从分歧点重开时：保留全局数据，重置存档状态
- [ ] 清除数据操作需二次确认

---

## 4. 已读记录系统

### T4.1 已读追踪数据结构 (MVP)

**v1.1 变更：已读记录使用稳定 lineId 而非 lineIndex。剧本后续修改插入新行时，已有已读记录不会错位。**

```json
{
  "readNodes": ["p1", "p2", "c1a", "c1b"],
  "readLines": {
    "p1": ["p1_d001", "p1_d002", "p1_d003", "p1_d004"],
    "p2": ["p2_d001", "p2_d002", "p2_d003"]
  },
  "readChoices": {
    "p1": ["p1_c001"],
    "p2": ["p2_c001", "p2_c002"]
  }
}
```

#### 追踪粒度

| 粒度 | 用途 | MVP? |
|------|------|------|
| 节点级 `readNodes` | 章节地图、事件回想 | Yes |
| 行级 `readLines`（by lineId） | 已读跳过 | Yes |
| 选项级 `readChoices`（by choiceId） | 二周目已选标记 | Phase 2 |

#### 行动项
- [ ] 每播放一行，按 `lineId` 记录已读
- [ ] `lineId` 不存在时（旧数据兼容），回退用 `{nodeId}_{lineIndex}` 生成临时 ID
- [ ] ReadTracker: markLineRead(lineId) / isLineRead(lineId) / markNodeRead(nodeId) / isNodeRead(nodeId)
- [ ] 已读数据存全局持久数据

---

### T4.2 已读跳过引擎 (MVP)

```
skip() 流程：
  1. 取当前行 lineId
  2. isLineRead(lineId) ?
     a. 已读 -> 立即显示完整文本 -> 短暂延迟 -> 下一行
     b. 未读 -> 停止跳过
  3. 遇到 choices -> 停止
  4. 遇到结局节点 -> 停止
  5. 遇到 cg 非空 -> 停止（Phase 2）
```

#### 行动项
- [ ] SkipController: start / stop / isSkipping
- [ ] 跳过速度可配置
- [ ] HUD 显示 "SKIP" 标记

---

### T4.3 跳到下一选项 (Phase 2)

（与 v1.0 相同）

---

## 5. Backlog 系统

### T5.1 会话级对话历史 (MVP)

（与 v1.0 相同）

#### 行动项
- [ ] BacklogManager: append / getHistory / clear
- [ ] 每播放一行自动 append（含 lineId）
- [ ] 玩家选择记录为 CHOICE 类型
- [ ] Backlog 是会话级数据，不持久化

---

## 6. 图鉴与事件系统

### T6.0 GalleryEventBus 事件总线 (MVP) [v1.1 新增]

**v1.1 变更：底层不写死 toast 或任何 UI 行为。所有解锁操作通过事件总线通知，UI 层订阅后自行决定展示方式。**

```kotlin
object GalleryEventBus {
    private val listeners = mutableMapOf<String, MutableList<(Any) -> Unit>>()

    fun emit(event: String, data: Any) { ... }
    fun on(event: String, listener: (Any) -> Unit) { ... }
    fun off(event: String, listener: (Any) -> Unit) { ... }
}
```

#### 事件类型

| 事件 | 数据 | 触发时机 |
|------|------|----------|
| `ending_unlocked` | `EndingTier` | EndingResolver 判定通过 |
| `cg_unlocked` | `CgId` | 节点含 cg 字段被播放 |
| `node_completed` | `NodeId` | 节点播放结束 |
| `line_event_completed` | `LineEventId` | LINE 节点播放结束 |
| `egg_unlocked` | `EggId` | 彩蛋条件满足 |
| `chapter_unlocked` | `ChapterId` | 新章节首个节点可达 |

#### 行动项
- [ ] 实现轻量事件总线
- [ ] 引擎层只 emit 事件
- [ ] UI 层订阅事件后决定 toast / 动画 / 提示方式
- [ ] 事件总线不持久化，仅运行时通知

---

### T6.1 结局图鉴 (MVP)

（与 v1.0 相同，解锁触发改为通过 GalleryEventBus）

#### 行动项
- [ ] EndingGalleryManager 订阅 `ending_unlocked` 事件
- [ ] 解锁状态存全局持久数据
- [ ] 未解锁结局显示 `???`

---

### T6.2 CG 图鉴 (Phase 2)

**v1.1 变更：解锁不直接 toast，通过 GalleryEventBus 发 `cg_unlocked` 事件。**

#### 行动项
- [ ] CGGalleryManager 订阅 `cg_unlocked` 事件
- [ ] 引擎在 enterNode() 检查 cg 字段，非空则 emit 事件
- [ ] CG 按篇章分组

---

### T6.3 事件回想 (Phase 2)

**v1.1 变更：不用默认 GameState 回放。节点完成时记录 replay snapshot，回放时使用该快照恢复。**

```
节点完成时：
  1. 记录 replaySnapshot = {
       nodeId,
       gameStateAtEntry,    // 进入该节点时的 GameState 快照
       choicesMade,         // 玩家在该节点做的选择 [choiceId]
       dialoguePlayed       // 实际播放的 dialogue [lineId]（含分支文本）
     }
  2. 存入全局持久数据的 replaySnapshots[nodeId]

replayEvent(nodeId) 流程：
  1. 读取 replaySnapshots[nodeId]
  2. 用 gameStateAtEntry 恢复临时 GameState
  3. 按 dialoguePlayed 序列重播（确保条件选项和分支文本与玩家当时看到的一致）
  4. 回放结束后：
     a. 返回回想页 -> 丢弃临时状态
     b. "从此处重新开始" -> 弹确认 -> 用 gameStateAtEntry 创建新进度
```

#### 行动项
- [ ] 节点完成时捕获 replay snapshot（进入时的 GameState + 实际播放序列）
- [ ] ReplayManager: startReplay / endReplay / isReplaying
- [ ] 回放模式下：effects 不生效、不触发自动存档、不触发图鉴解锁
- [ ] "从此处重新开始"用 snapshot 中的 gameStateAtEntry 创建新进度

---

### T6.4 LINE 回想 (Phase 2)

（与 v1.0 相同）

---

### T6.5 特殊彩蛋 (Phase 2)

（与 v1.0 相同，解锁通过 GalleryEventBus）

---

## 7. 自动播放系统

### T7.1 Auto-play 引擎 (MVP)

（与 v1.0 相同）

#### 行动项
- [ ] AutoPlayController: start / stop / toggle
- [ ] 根据文本长度计算延迟
- [ ] 遇到 choices 自动停止
- [ ] 打开菜单/Backlog 时暂停

---

## 8. 章节地图引擎

### T8.1 节点状态判定 (MVP)

**v1.1 变更：不能只靠 FN 前驱已读判断。分支节点需要 visibleWhen / unlockCondition / routeScope / spoilerLevel 来避免过早暴露隐藏路线。**

#### 节点状态判定逻辑（更新版）

```kotlin
fun getNodeState(nodeId: String, playerState: GameState, globalData: GlobalData): NodeState {
    val node = storyData.getNode(nodeId)
    val mapMeta = node.mapMeta

    // 1. 可见性：visibleWhen 不满足 -> HIDDEN（地图上不出现）
    if (mapMeta.visibleWhen != null &&
        !conditionEval.evaluate(mapMeta.visibleWhen, globalData)) {
        return HIDDEN
    }

    // 2. 剧透过滤：spoilerLevel > 玩家当前最高完成阶段 -> HIDDEN
    if (mapMeta.spoilerLevel > globalData.maxCompletedStage) {
        return HIDDEN
    }

    // 3. 路线范围：routeScope 不匹配玩家已触达路线 -> HIDDEN
    if (mapMeta.routeScope != null &&
        mapMeta.routeScope !in globalData.reachedRoutes) {
        return HIDDEN
    }

    // 4. 当前节点
    if (playerState.currentNode == nodeId) return CURRENT

    // 5. 已达成结局
    if (nodeId in endingNodes && globalData.isEndingUnlocked(nodeId)) return ENDING_REACHED

    // 6. 已读
    if (globalData.readHistory.isNodeRead(nodeId)) {
        if (nodeId in routerNodes) return BRANCH_POINT
        return READ
    }

    // 7. 解锁判定
    val unlocked = if (mapMeta.unlockCondition != null) {
        conditionEval.evaluate(mapMeta.unlockCondition, globalData)
    } else {
        isPredecessorRead(nodeId)  // 默认：前驱已读即解锁
    }

    if (unlocked) return UNLOCKED_UNREAD

    // 8. 未解锁
    return LOCKED
}
```

#### 节点状态枚举（更新版）

| 状态 | 说明 | 地图展示 |
|------|------|----------|
| HIDDEN | 不满足可见条件 / 剧透 / 路线不匹配 | 地图上不出现 |
| LOCKED | 可见但未解锁 | 显示 `???` |
| UNLOCKED_UNREAD | 已解锁未读 | 标题 + NEW 标记 |
| READ | 已读 | 标题 + 已读标记 |
| CURRENT | 当前节点 | 高亮 |
| BRANCH_POINT | 已读 + 是路由分歧点 | 特殊图标 |
| ENDING_REACHED | 结局已达成 | 结局标记 |

#### 行动项
- [ ] ChapterMapEngine: getNodeState / getVisibleNodes / getChapterProgress
- [ ] 可见性三重过滤：visibleWhen + spoilerLevel + routeScope
- [ ] 默认解锁 = 前驱已读；可由 unlockCondition 覆盖
- [ ] globalData.reachedRoutes：记录玩家曾到达过的路线（用于控制路线节点可见性）
- [ ] globalData.maxCompletedStage：记录玩家最高完成阶段（用于 spoilerLevel 过滤）

---

## 9. 设置数据结构

### T9.1 Settings Schema (MVP)

（与 v1.0 相同）

---

## 10. 开发优先级汇总（v1.1 更新）

### MVP（必须完成才能跑通第一部）

| 编号 | 任务 | 依赖 | v1.1 变更 |
|------|------|------|-----------|
| **T0.1** | **StoryDataValidator** | - | **新增** |
| T1.1 | 节点 Schema（vn only + lineId + mapMeta） | - | 更新 |
| T1.2 | 选项 Schema | - | 更新（加 id） |
| T1.3 | 变量定义 + Legacy Alias | - | 更新 |
| T1.4 | FN 链更新 | - | - |
| T2.1 | StoryEngine（vn only，LINE 降级） | T1.1 | 更新 |
| T2.2 | NameSubstituter | - | - |
| T2.3 | EffectProcessor（含 alias 支持） | T1.3 | 更新 |
| T2.4 | ConditionEvaluator（含 alias 支持） | T1.3 | 更新 |
| T2.5 | RouterResolver | T2.4 | - |
| T2.6 | FlowManager | T1.4, T2.5 | - |
| **T2.7** | **EndingResolver** | T2.4, T6.0 | **新增** |
| T3.1 | GameState 完整快照 | T1.3 | 更新（大幅扩展） |
| T3.2 | 存档系统 | T3.1 | - |
| T3.3 | 全局持久数据 | - | - |
| T4.1 | 已读追踪（by lineId） | T3.3 | 更新 |
| T4.2 | 已读跳过 | T4.1 | - |
| T5.1 | Backlog | - | - |
| **T6.0** | **GalleryEventBus** | - | **新增** |
| T6.1 | 结局图鉴 | T3.3, T6.0 | 更新 |
| T7.1 | 自动播放 | T2.1 | - |
| T8.1 | 章节地图状态判定 | T4.1 | 更新（大幅扩展） |
| T9.1 | 设置数据结构 | - | - |

**MVP 合计：23 项任务**

### Phase 2（日乙完整体验）

| 编号 | 任务 | 依赖 | 备注 |
|------|------|------|------|
| T1.5 | CG 定义 | - | - |
| T1.6 | LINE 数据结构 + 引擎 | T1.1 | v1.1: 从 MVP 完整移出 |
| T4.3 | 跳到下一选项 | T4.1, T2.6 | - |
| T6.2 | CG 图鉴 | T1.5, T6.0 | - |
| T6.3 | 事件回想（含 replay snapshot） | T4.1, T6.0 | v1.1: 改用 snapshot |
| T6.4 | LINE 回想 | T1.6, T6.3 | - |
| T6.5 | 特殊彩蛋 | T6.1, T6.0 | - |
| - | Legacy alias 清理 | 全量验证通过 | v1.1 新增 |

### Phase 3（完善增强）

- BGM/音效系统集成
- 章节演出转场
- CG 解锁动画
- 结局达成动画
- 网页版适配
- Debug 面板完整实现

---

## 11. 数据迁移策略

### 执行顺序（v1.1 更新）

```
0. 先实现 StoryDataValidator（T0.1）
1. variables.json — 含 legacy alias
2. flow.json — 删 e_select2，更新第一部链路
3. chapters.json
4. endings.json — 含 judgement 规则
5. routers.json
6. nodes.json — 每行分配稳定 id，标注 display，增加 mapMeta
7. prologue.json
8. 运行 StoryDataValidator -> 修复所有 error
9. cg.json（Phase 2，可先建空结构）
```

### 迁移注意

- 每行 dialogue 分配稳定 `id`（格式 `{nodeId}_d{三位序号}`）
- 旧变量名通过 legacy alias 保留，不急于清理
- 旁白行标注 `display` 模式
- 旧 `sub()` 替换逻辑不迁移，改用模板
- 迁移后立即运行 validator 校验

---

*v1.1 修订完成。9 条产品经理反馈全部落实。确认后可开始 T0.1 StoryDataValidator + Phase 1 数据迁移。*
