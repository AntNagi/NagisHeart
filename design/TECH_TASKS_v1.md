# Nagi's Heart -- 底层规则技术任务拆解 v1.0

> 基准文档：PRD v2.0 + 交互设计 v1.0
> 范围：数据结构、引擎规则、存档、已读、图鉴、回想 -- 不含 UI 代码
> 优先级：MVP > Phase 2 > Phase 3（与 PRD 18 章对齐）

---

## 0. 当前架构与产品需求的差距总结

| 产品需求 | 当前 ARCHITECTURE.md 状态 | 差距 |
|---------|--------------------------|------|
| `{{playerName}}` / `{{nagiCall}}` 仅两个模板 | NameSubstituter 描述模糊，旧代码全局替换 Nagi | 需明确限制替换范围 |
| 第一部链路 p1->p2->c1a->c1b->u20j | flow.json 仍含旧 e_select2 | 需更新 |
| HUD 不显示数值 | 架构含 BondBar.kt 组件 | 需移除，改为 Debug 模式 |
| 旁白支持底部/全屏，可显式指定 | node schema 无 displayMode 字段 | 需扩展 |
| LINE 特殊演出模块 | 无 LINE 模式定义 | 需新增节点类型 + 数据结构 |
| Gallery 拆分为 5 类 | 仅有 GalleryScreen（结局图鉴） | 需拆分 + 各自数据结构 |
| CG 图鉴 | 无 CG 定义和解锁机制 | 需新增 cg.json |
| 事件回想 + LINE 回想 | 无回想机制 | 需已读记录 + 回放引擎 |
| Backlog | 无 | 需会话级对话历史 |
| 已读跳过 / 跳到下一选项 | 无已读追踪系统 | 需全局已读记录 |
| 自动存档触发点 | 仅笼统描述 | 需明确 5 个触发时机 |
| 快速存读档 | 无 | 需专用存档槽 |
| 自动播放 | 无 | 需定时器 + 设置项 |
| 章节地图节点状态 | 无状态定义 | 需 6 种状态判定逻辑 |
| 选项内部标签 vs 玩家可见标签 | 无区分 | 需 tag + displayTag |
| 核心变量 witness / independence | variables.json 缺失 | 需补全 |

---

## 1. 剧情数据结构

### T1.1 节点 Schema 重设计 (MVP)

当前 `nodes.json` 只有 `dialogue` + `choices`，需要扩展为：

```json
{
  "p1": {
    "mode": "vn",
    "dialogue": [
      {
        "speaker": "sys",
        "text": "...",
        "display": "bottom"
      },
      {
        "speaker": "sys",
        "text": "连续长段落旁白...",
        "display": "fullscreen"
      },
      {
        "speaker": "nagi",
        "text": "..."
      }
    ],
    "choices": [ ... ],
    "bg": "bg/teamV.jpg",
    "bgm": "bgm_prologue",
    "cg": null,
    "autoSave": true
  },
  "c1b_line": {
    "mode": "line",
    "messages": [
      {
        "sender": "player",
        "text": "...",
        "delay": 800
      },
      {
        "sender": "nagi",
        "text": "...",
        "typing": 1500,
        "delay": 2000
      },
      {
        "sender": "nagi",
        "text": "...",
        "read": true
      }
    ],
    "choices": [ ... ]
  }
}
```

#### 新增字段说明

| 字段 | 类型 | 说明 | MVP? |
|------|------|------|------|
| `mode` | `"vn" \| "line"` | 节点演出模式，默认 `"vn"` | Yes |
| `dialogue[].display` | `"bottom" \| "fullscreen" \| null` | 旁白显示模式，null=默认对话框 | Yes |
| `bg` | `string \| null` | 背景图路径 | Yes |
| `bgm` | `string \| null` | 背景音乐 ID | Phase 3 |
| `cg` | `string \| null` | 触发 CG 的 ID（解锁用） | Phase 2 |
| `autoSave` | `boolean` | 是否在此节点入口自动存档 | Yes |
| `messages` | `LineMessage[]` | LINE 模式专用消息序列 | Phase 2 |
| `messages[].sender` | `"player" \| "nagi"` | LINE 发送者 | Phase 2 |
| `messages[].typing` | `number \| null` | 输入中动画时长 ms | Phase 2 |
| `messages[].delay` | `number \| null` | 消息出现前延迟 ms | Phase 2 |
| `messages[].read` | `boolean` | 已读标记 | Phase 2 |

#### 行动项
- [ ] 定义节点 JSON Schema（story-data/schema/node.schema.json）
- [ ] 所有旁白 dialogue 补上 `display` 字段（至少区分 bottom/fullscreen）
- [ ] LINE 节点用 `mode: "line"` + `messages[]` 代替 `dialogue[]`
- [ ] 节点增加 `bg` / `cg` / `autoSave` 字段

---

### T1.2 选项 Schema 重设计 (MVP)

当前选项缺少玩家可见标签与内部标签的区分。

```json
{
  "label": "想赢和怕麻烦可以同时存在",
  "displayTag": "理解",
  "internalTag": "understanding",
  "playerLine": "想赢和怕麻烦可以同时存在。这不矛盾。",
  "responses": [
    { "speaker": "nagi", "text": "..." }
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

#### 新增字段

| 字段 | 说明 | MVP? |
|------|------|------|
| `displayTag` | 玩家可见标签（心动/靠近/理解/撒娇/认真/沉默/推他一把/留在这里/让他自己决定） | Yes |
| `internalTag` | 后台标签（affection/understanding/witness/push/comfort/control/avoid/possess/release） | Yes |
| `condition` | 显示条件表达式，null=始终显示，否则 ConditionEvaluator 判定 | Yes |
| `confirmRequired` | 是否弹出不可逆确认对话框 | Yes |

#### 行动项
- [ ] 定义选项 JSON Schema
- [ ] 旧 `tag` 字段拆分为 `displayTag` + `internalTag`
- [ ] 支持条件选项（隐藏不满足条件的选项）
- [ ] 支持不可逆确认标记

---

### T1.3 变量定义补全 (MVP)

PRD 10.2 定义 7 个核心维度。当前 `variables.json` 缺少 `witness` 和 `independence`。

```json
{
  "numeric": {
    "bond": { "label": "关系亲密度", "initial": 0 },
    "understanding": { "label": "理解度", "initial": 0 },
    "distance": { "label": "距离", "initial": 0 },
    "ego": { "label": "自主意志", "initial": 0 },
    "control": { "label": "管控倾向", "initial": 0 },
    "witness": { "label": "见证", "initial": 0 },
    "independence": { "label": "独立性", "initial": 0 }
  },
  "flags": {
    "path": { "type": "string", "initial": null },
    "route": { "type": "string", "initial": null },
    "mj": { "type": "string", "initial": null },
    "nagiResonate": { "type": "boolean", "initial": false },
    "antCompress": { "type": "boolean", "initial": false },
    "witnessFlag": { "type": "boolean", "initial": false },
    "personalHonor": { "type": "boolean", "initial": false },
    "nagiNameIndependent": { "type": "boolean", "initial": false }
  }
}
```

#### 行动项
- [ ] 补全 witness / independence 到 numeric
- [ ] 确认旧变量映射：I -> understanding, D -> distance
- [ ] 清理旧变量名 (I/D/habitWarm/habitDepend 等)，统一为语义化名称
- [ ] effects 中的 var 名全部使用新名称

---

### T1.4 FN 链更新 (MVP)

第一部最新链路：`p1 -> p2 -> c1a -> c1b -> u20j`

当前 flow.json 的 default 链含旧节点 `e_select2`，需删除。

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

---

### T1.5 CG 定义新增 (Phase 2)

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
  },
  {
    "id": "cg_c1a_meeting",
    "title": "会议室初见",
    "chapter": "part1",
    "image": "cg/c1a_meeting.jpg",
    "unlockNode": "c1a",
    "unlockCondition": null
  },
  {
    "id": "cg_true_ending",
    "title": "世界第一，与你",
    "chapter": "ending",
    "image": "cg/true_ending.jpg",
    "unlockNode": "dream_final_true",
    "unlockCondition": null
  }
]
```

#### 行动项
- [ ] 设计 CG JSON Schema
- [ ] 按 PRD 13.2 列出所有篇章的 CG 定义（可后续逐步填充图片）
- [ ] 节点 schema 中的 `cg` 字段指向 cg.json 的 id
- [ ] 引擎在节点播放时检查 cg 字段，触发解锁

---

### T1.6 LINE 节点数据结构 (Phase 2)

LINE 不是对话框换皮。需要专用数据结构：

```json
{
  "c1b_line": {
    "mode": "line",
    "chatWith": "nagi",
    "timeLabel": "23:47",
    "messages": [
      { "sender": "nagi", "text": "……你还没睡？", "typing": 2000 },
      { "sender": "player", "text": "在看你的比赛回放" },
      { "sender": "nagi", "text": "（已读）", "read": true, "delay": 3000 },
      { "sender": "nagi", "text": "……你是第一个这样说的人", "typing": 1500 }
    ],
    "choices": [
      {
        "type": "line_reply",
        "label": "你今天那一球，根本不像「好麻烦」的人踢的",
        "displayTag": "理解",
        "internalTag": "understanding",
        "effects": [{ "var": "understanding", "op": "add", "val": 2 }],
        "responses": [
          { "sender": "nagi", "text": "……", "typing": 3000 },
          { "sender": "nagi", "text": "嗯", "delay": 1000 }
        ]
      }
    ]
  }
}
```

#### 新增字段

| 字段 | 说明 |
|------|------|
| `chatWith` | 聊天对象标识 |
| `timeLabel` | 聊天时间显示 |
| `messages[].typing` | Nagi 输入中动画时长 |
| `messages[].delay` | 消息出现前的沉默间隔 |
| `messages[].read` | 已读标记显示 |
| `choices[].type` | `"line_reply"` 表示底部快捷回复 |

#### 行动项
- [ ] 定义 LINE 消息 JSON Schema
- [ ] LINE 选项用 `type: "line_reply"` 区分，底部快捷回复样式
- [ ] 设计 LINE -> VN 模式切换的 transition

---

## 2. 节点推进与引擎规则

### T2.1 StoryEngine 核心推进逻辑 (MVP)

```
advance() 流程：
  1. mode == "vn" ?
     a. dialogueQueue 有下一句 -> 播下一句
        - speaker == "sys" && display == "fullscreen" -> 全屏旁白
        - speaker == "sys" && display == "bottom" -> 底部旁白
        - speaker == "sys" && display == null -> 默认底部旁白
        - 其他 speaker -> 对话框
     b. dialogueQueue 完 + 有 choices -> 展示选项
     c. 无 choices -> transition 处理
  2. mode == "line" ?
     a. messageQueue 有下一条 -> 按 delay/typing 节奏播放
     b. messageQueue 完 + 有 choices -> 底部快捷回复
     c. 无 choices -> transition 处理
```

#### 行动项
- [ ] StoryEngine 支持 vn/line 双模式分发
- [ ] 旁白 display 字段控制渲染方式（不再自动猜测）
- [ ] 当 display 未指定时，连续 3+ sys 行可自动建议 fullscreen，但以数据为准

---

### T2.2 NameSubstituter 严格限制 (MVP)

**规则（PRD 5.1 / 5.2 / 用户明确指令）：**

只替换两个模板变量：
- `{{playerName}}` -> 玩家设定的名字
- `{{nagiCall}}` -> 玩家设定的 Nagi 称呼

**禁止：**
- 全局替换 `Nagi` 为任何值
- 替换旁白/系统/标题/章节名/结局名中的 `Nagi`
- 替换其他角色对 Nagi 的称呼

```kotlin
class NameSubstituter(
    private val playerName: String,
    private val nagiCall: String
) {
    fun apply(text: String): String {
        return text
            .replace("{{playerName}}", playerName)
            .replace("{{nagiCall}}", nagiCall)
    }
}
```

#### 行动项
- [ ] NameSubstituter 实现仅两个 replace
- [ ] 剧本数据中，玩家直接叫 Nagi 的地方用 `{{nagiCall}}`
- [ ] 旁白/系统/标题中一律写死 `Nagi`，不用模板
- [ ] 一一称呼用 `{{playerName}}小姐` 和 `Nagi少爷`（写在剧本数据里，不是代码里）

---

### T2.3 EffectProcessor 通用效果执行 (MVP)

已有设计基本完善。补充：

```kotlin
class EffectProcessor(private val state: GameState) {
    fun apply(effects: List<Effect>) {
        effects.forEach { e ->
            when (e.op) {
                "add" -> state.addNumeric(e.variable, e.value as Int)
                "sub" -> state.addNumeric(e.variable, -(e.value as Int))
                "set" -> state.setVariable(e.variable, e.value)
                "toggle" -> state.setVariable(e.variable, !state.getBool(e.variable))
            }
        }
    }
}
```

#### 行动项
- [ ] 支持 add / sub / set / toggle 四种操作
- [ ] 类型安全：数值操作只接受 Int，set 接受 Any
- [ ] 效果执行后不做任何 UI 反馈（PRD 9.4：正式界面不显示数值变化）

---

### T2.4 ConditionEvaluator 表达式求值 (MVP)

支持语法：`==`, `!=`, `>=`, `<=`, `>`, `<`, `&&`, `||`, `!`, 括号, 字符串/数字/布尔字面量。

```
输入: "path == 'dream' && !antCompress && witness >= 3"
输出: true / false

输入: "control >= 2 || distance >= 3"
输出: true / false
```

#### 行动项
- [ ] 实现表达式 tokenizer + recursive descent parser
- [ ] 变量名从 GameState 动态查询
- [ ] 单元测试覆盖：数值比较、字符串比较、布尔逻辑、嵌套括号、null 变量
- [ ] 错误处理：未定义变量返回默认值（数值=0, 布尔=false, 字符串=null）

---

### T2.5 RouterResolver 数据驱动路由 (MVP)

已有设计完善。确认：

```
resolveRouter(nodeId) 流程：
  1. 在 routers.json 中查找 nodeId
  2. 逐条评估 rules[].condition
  3. 第一个 condition 为 true 的规则生效
  4. 执行该规则的 sideEffects
  5. 返回 target 节点
  6. 无匹配则返回 fallback
```

#### 行动项
- [ ] 把旧 resolveRouter() 的 6 个 if-else 路由全部迁移到 routers.json
- [ ] 确认 fallback 逻辑
- [ ] sideEffects 通过 EffectProcessor 统一执行

---

### T2.6 FlowManager FN 链推进 (MVP)

```
nextNode(currentNode) 流程：
  1. 当前节点有 transition.type == "goto" ? -> 返回 target
  2. 检查 byRoute[currentRoute][currentNode] 是否有路线覆盖
  3. 否则取 default[currentNode]
  4. 目标节点是路由节点？-> 交给 RouterResolver
  5. 目标节点是 null？-> 检查是否需要结局判定
```

#### 行动项
- [ ] 实现 byRoute 优先于 default 的查找顺序
- [ ] 路由节点识别（在 routers.json 中有定义的节点 ID）
- [ ] 链路完整性校验工具（检测悬挂节点、环路、死路）

---

## 3. 存档结构

### T3.1 GameState 完整快照 (MVP)

```json
{
  "version": 1,
  "timestamp": "2026-07-10T22:30:00Z",
  "playerName": "Ant",
  "nagiCall": "凪",
  "currentNode": "c1b",
  "currentLineIndex": 5,
  "currentChapter": "part1",
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
    "antCompress": false
  },
  "maxStage": 1
}
```

#### 行动项
- [ ] 定义 GameState 序列化/反序列化 schema
- [ ] 存档版本号机制：旧存档迁移策略
- [ ] `currentLineIndex` 精确到对话行（支持从对话中途恢复）

---

### T3.2 存档系统结构 (MVP)

```json
{
  "auto": {
    "slot": "auto",
    "state": { ... },
    "meta": {
      "chapter": "第一部",
      "section": "不麻烦的人",
      "timestamp": "2026-07-10T22:30:00Z",
      "description": "他第一次觉得你不无聊"
    }
  },
  "quick": {
    "slot": "quick",
    "state": { ... },
    "meta": { ... }
  },
  "manual": [
    {
      "slot": 1,
      "state": { ... },
      "meta": { ... },
      "locked": false
    }
  ]
}
```

#### 自动存档触发点（PRD 11.1）

1. 节点开始（`autoSave: true` 的节点）
2. 节点结束
3. 做出选择后
4. 进入结局页
5. 解锁图鉴内容后

#### 行动项
- [ ] 自动存档槽 x1 + 快速存档槽 x1 + 手动存档槽 x30
- [ ] SaveManager: save / load / delete / list / lock
- [ ] meta 信息不暴露数值，只显示章节名 + 节点名 + 时间 + 描述性文案
- [ ] 存档 meta 的 description 由节点数据中预定义（非自动生成）
- [ ] 自动存档 5 个触发点的引擎钩子

---

### T3.3 全局持久数据（跨存档）(MVP)

有些数据不跟随存档，而是全局持久：

```json
{
  "readHistory": { ... },
  "galleryUnlocks": { ... },
  "endingUnlocks": { ... },
  "cgUnlocks": { ... },
  "settings": { ... },
  "statistics": {
    "totalPlayTime": 0,
    "firstPlayDate": null
  }
}
```

#### 行动项
- [ ] 全局数据与存档数据分离存储
- [ ] 从分歧点重开时：保留全局数据，重置存档状态
- [ ] 清除数据操作需二次确认（交互设计 20.5）

---

## 4. 已读记录系统

### T4.1 已读追踪数据结构 (MVP)

```json
{
  "readNodes": ["p1", "p2", "c1a", "c1b"],
  "readLines": {
    "p1": [0, 1, 2, 3, 4, 5],
    "p2": [0, 1, 2, 3]
  },
  "readChoices": {
    "p1": [0],
    "p2": [0, 1]
  }
}
```

#### 追踪粒度

| 粒度 | 用途 | MVP? |
|------|------|------|
| 节点级 `readNodes` | 章节地图节点状态、事件回想可用性 | Yes |
| 行级 `readLines` | 已读跳过 | Yes |
| 选项级 `readChoices` | 二周目显示已选标记 | Phase 2 |

#### 行动项
- [ ] 每播放一行 dialogue，记录该行为已读
- [ ] 每完成一个节点，记录该节点为已读
- [ ] 已读数据存全局持久数据，不跟随存档（重开不丢失）
- [ ] ReadTracker 类：markLineRead / markNodeRead / isLineRead / isNodeRead

---

### T4.2 已读跳过引擎 (MVP)

```
skip() 流程：
  1. 检查当前行是否已读
  2. 已读 -> 立即显示完整文本 -> 短暂延迟 -> 下一行
  3. 未读 -> 停止跳过，恢复正常播放
  4. 遇到 choices -> 停止跳过
  5. 遇到 cg 字段非空 -> 停止跳过（Phase 2）
  6. 遇到结局节点 -> 停止跳过
```

#### 行动项
- [ ] SkipController: start / stop / isSkipping
- [ ] 跳过速度可配置（设置项）
- [ ] 跳过状态在 HUD 显示 "SKIP" 标记

---

### T4.3 跳到下一选项 (Phase 2)

```
jumpToNextChoice() 流程：
  1. 从当前位置向前搜索
  2. 跳过所有已读行
  3. 遇到 choices -> 停止，展示选项
  4. 遇到未读行 -> 停止，提示"遇到未读内容"
  5. 当前章节无后续选项 -> 提示"后续没有可跳转的选项"
```

#### 行动项
- [ ] 预扫描当前节点 + FN 链后续节点的 choices 位置
- [ ] 跳转过程中快速标记所有跳过行为已读

---

## 5. Backlog 系统

### T5.1 会话级对话历史 (MVP)

```kotlin
data class BacklogEntry(
    val type: BacklogType,  // DIALOGUE, NARRATION, CHOICE, SYSTEM, LINE_MESSAGE
    val speaker: String?,
    val text: String,
    val nodeId: String,
    val timestamp: Long
)

enum class BacklogType {
    DIALOGUE, NARRATION, CHOICE, SYSTEM, LINE_MESSAGE
}
```

#### 行动项
- [ ] BacklogManager: append / getHistory / clear
- [ ] 每播放一行自动 append
- [ ] 玩家选择记录为 CHOICE 类型，显示"你选择了：xxx"
- [ ] LINE 消息记录为 LINE_MESSAGE 类型
- [ ] Backlog 容量：当前章节所有已播放文本（不截断）
- [ ] 切换章节时清空（或保留当前章节）
- [ ] Backlog 是会话级数据，不持久化到存档

---

## 6. 图鉴解锁系统

### T6.1 结局图鉴 (MVP)

```json
{
  "endings": {
    "true": { "unlocked": false, "unlockedAt": null },
    "good": { "unlocked": false, "unlockedAt": null },
    "normal": { "unlocked": false, "unlockedAt": null },
    "bad": { "unlocked": false, "unlockedAt": null }
  }
}
```

#### 解锁时机
- 结局判定通过后立即解锁对应结局
- 解锁状态存全局持久数据

#### 行动项
- [ ] EndingGalleryManager: unlock / isUnlocked / getAll
- [ ] 结局页展示后自动触发 unlock
- [ ] 未解锁结局显示 `???`

---

### T6.2 CG 图鉴 (Phase 2)

```json
{
  "cg": {
    "cg_p1_first_sight": { "unlocked": false, "unlockedAt": null },
    "cg_c1a_meeting": { "unlocked": false, "unlockedAt": null }
  }
}
```

#### 解锁时机
- 节点播放时检查 `cg` 字段
- 非空则触发 CG 解锁
- 解锁时 toast 提示"已解锁 CG：xxx"

#### 行动项
- [ ] CGGalleryManager: unlock / isUnlocked / getByChapter / getAll
- [ ] 引擎在 enterNode() 时检查 cg 字段
- [ ] CG 按篇章分组（cg.json 的 chapter 字段）

---

### T6.3 事件回想 (Phase 2)

事件回想 = 已读节点的只读重播。

```
replayEvent(nodeId) 流程：
  1. 保存当前 GameState 快照
  2. 创建临时 GameState（从该节点的存档状态恢复，或用默认值）
  3. 正常播放该节点
  4. 播放结束后选择：
     a. 返回回想页 -> 恢复原 GameState
     b. "从此处重新开始" -> 弹确认 -> 创建新进度
```

#### 行动项
- [ ] ReplayManager: startReplay / endReplay / isReplaying
- [ ] 回放模式下：不写入已读记录（已经是已读的）、不触发自动存档、不触发图鉴解锁
- [ ] 回放模式下选项仍可选择（查看不同回应），但 effects 不生效
- [ ] "从此处重新开始"需要重置 numerics/flags 到该节点的初始状态

---

### T6.4 LINE 回想 (Phase 2)

LINE 回想从事件回想中独立出来。

```json
{
  "lineEvents": [
    {
      "id": "line_c1b_night",
      "title": "初期夜聊",
      "chapter": "part1",
      "nodeId": "c1b_line",
      "unlocked": false
    }
  ]
}
```

#### 行动项
- [ ] 单独分类存储，不混入事件回想
- [ ] LINE 回想使用 LINE 模式界面重播（不用纯文本列表）
- [ ] 已完成的 LINE 节点自动解锁对应回想

---

### T6.5 特殊彩蛋 (Phase 2)

```json
{
  "eggs": {
    "proposal": {
      "title": "他的求婚",
      "hint": "某个结局之后，Nagi 还有话想对你说。",
      "unlockCondition": "ending_true_unlocked",
      "nodeId": "c8c",
      "unlocked": false
    }
  }
}
```

#### 行动项
- [ ] 彩蛋解锁条件由数据定义，引擎检查
- [ ] TRUE END 后自动检查并解锁求婚彩蛋
- [ ] 彩蛋入口：结局图鉴 + 特殊彩蛋页

---

## 7. 自动播放系统

### T7.1 Auto-play 引擎 (MVP)

```kotlin
class AutoPlayController(
    private val engine: StoryEngine,
    private val settings: AutoPlaySettings
) {
    var isPlaying: Boolean = false

    fun start() {
        isPlaying = true
        scheduleNext()
    }

    fun stop() { isPlaying = false }

    private fun scheduleNext() {
        if (!isPlaying) return
        val delay = calculateDelay(currentLine)
        postDelayed(delay) {
            if (isPlaying && !engine.hasChoices()) {
                engine.advance()
                scheduleNext()
            } else {
                stop()  // 遇到选项暂停
            }
        }
    }

    private fun calculateDelay(line: DialogueLine): Long {
        val charCount = line.text.length
        val baseDelay = settings.baseInterval  // 默认 2000ms
        val perCharDelay = settings.perCharDelay  // 默认 50ms
        return baseDelay + charCount * perCharDelay
    }
}
```

#### 设置项（PRD 12.4 / 交互 16.2）
- 自动播放开关
- 文字速度
- 句间停顿
- 旁白额外停顿
- 遇到选项暂停（固定规则，不可关闭）

#### 行动项
- [ ] AutoPlayController: start / stop / toggle
- [ ] 根据文本长度计算自动推进延迟
- [ ] 遇到 choices 自动停止
- [ ] 打开菜单/Backlog 时暂停
- [ ] HUD 显示 "AUTO" 状态

---

## 8. 章节地图引擎

### T8.1 节点状态判定 (MVP)

交互设计 12.3 定义 6 种节点状态：

| 状态 | 判定逻辑 |
|------|----------|
| 未解锁 | 节点未出现在 readNodes 且 FN 链前驱未完成 |
| 已解锁未读 | FN 链前驱已完成，但本节点未在 readNodes |
| 已读 | 节点在 readNodes 中 |
| 当前 | currentNode == 此节点 |
| 关键分歧点 | 节点在 routers.json 中有定义 |
| 已达成结局 | 结局节点 + 对应结局已解锁 |

```kotlin
fun getNodeState(nodeId: String): NodeState {
    if (gameState.currentNode == nodeId) return CURRENT
    if (nodeId in endingNodes && isEndingUnlocked(nodeId)) return ENDING_REACHED
    if (nodeId in readHistory.readNodes) {
        if (nodeId in routerNodes) return BRANCH_POINT
        return READ
    }
    if (isPredecessorRead(nodeId)) return UNLOCKED_UNREAD
    return LOCKED
}
```

#### 行动项
- [ ] ChapterMapEngine: getNodeState / getChapterProgress
- [ ] 前驱判定逻辑（FN 链反向查找）
- [ ] 分歧点标记（来自 routers.json 的 key）
- [ ] 章节完成度计算（已读节点数 / 总节点数）

---

## 9. 设置数据结构

### T9.1 Settings Schema (MVP)

```json
{
  "text": {
    "fontSize": "standard",
    "textSpeed": "standard",
    "autoPlaySpeed": "standard",
    "dialogueOpacity": 0.8,
    "typewriterEnabled": true,
    "tapIndicatorEnabled": true
  },
  "audio": {
    "bgmVolume": 0.7,
    "sfxVolume": 0.7,
    "muted": false,
    "autoBgm": true
  },
  "display": {
    "bgBrightness": 1.0,
    "dialogueStyle": "default",
    "textShadow": false,
    "animationEnabled": true,
    "particleEnabled": true
  },
  "skip": {
    "readOnlySkip": true,
    "stopAtUnread": true,
    "stopAtChoice": true
  },
  "debug": {
    "enabled": false,
    "showVariables": false,
    "showNodeId": false,
    "showRoute": false,
    "allowSkipAll": false
  }
}
```

#### 行动项
- [ ] 定义 Settings JSON Schema
- [ ] Settings 存全局持久数据
- [ ] debug 部分仅在开发模式可见
- [ ] debug.showVariables: 显示所有数值（PRD 10.1 调试模式）

---

## 10. 开发优先级汇总

### MVP（必须完成才能跑通第一部）

| 编号 | 任务 | 依赖 |
|------|------|------|
| T1.1 | 节点 Schema（vn mode + display 字段） | - |
| T1.2 | 选项 Schema（displayTag / internalTag / condition） | - |
| T1.3 | 变量定义补全（witness / independence） | - |
| T1.4 | FN 链更新（删 e_select2） | - |
| T2.1 | StoryEngine 双模式推进 | T1.1 |
| T2.2 | NameSubstituter（仅 playerName / nagiCall） | - |
| T2.3 | EffectProcessor | T1.3 |
| T2.4 | ConditionEvaluator | - |
| T2.5 | RouterResolver | T2.4 |
| T2.6 | FlowManager | T1.4, T2.5 |
| T3.1 | GameState 快照 | T1.3 |
| T3.2 | 存档系统（auto + quick + manual x30） | T3.1 |
| T3.3 | 全局持久数据 | - |
| T4.1 | 已读追踪 | T3.3 |
| T4.2 | 已读跳过 | T4.1 |
| T5.1 | Backlog | - |
| T6.1 | 结局图鉴 | T3.3 |
| T7.1 | 自动播放 | T2.1 |
| T8.1 | 章节地图状态判定 | T4.1 |
| T9.1 | 设置数据结构 | - |

### Phase 2（日乙完整体验）

| 编号 | 任务 | 依赖 |
|------|------|------|
| T1.5 | CG 定义 | - |
| T1.6 | LINE 节点数据结构 | T1.1 |
| T4.3 | 跳到下一选项 | T4.1, T2.6 |
| T6.2 | CG 图鉴 | T1.5, T3.3 |
| T6.3 | 事件回想 | T4.1 |
| T6.4 | LINE 回想 | T1.6, T6.3 |
| T6.5 | 特殊彩蛋 | T6.1 |

### Phase 3（完善增强）

- BGM/音效系统集成
- 章节演出转场
- CG 解锁动画
- 结局达成动画
- 网页版适配
- Debug 面板完整实现

---

## 11. 数据迁移策略

现有 story.js (~2950 行) 需要迁移到 story-data/ JSON。

### 迁移顺序

1. `variables.json` — 从 story.js 的变量声明提取
2. `flow.json` — 从 FN + FN_PATH 提取，更新第一部链路
3. `chapters.json` — 从 CHAPTERS 提取
4. `endings.json` — 从 ENDINGS + finish() 提取
5. `routers.json` — 从 resolveRouter() 提取
6. `nodes.json` — 从 STORY 对象提取，最大工作量
7. `prologue.json` — 从 PROLOGUE_LINES 提取
8. `cg.json` — 新建，按 PRD 13.2 规划

### 迁移注意

- 旧变量名 I/D 需映射为 understanding/distance
- 旧 tag 需拆分为 displayTag + internalTag
- 旁白行需标注 display 模式
- 旧 `sub()` 替换逻辑不迁移，改用 `{{playerName}}` / `{{nagiCall}}` 模板

---

*以上任务拆解覆盖 PRD v2.0 和交互设计 v1.0 的所有底层规则需求。确认后可开始 Phase 1 数据迁移。*
