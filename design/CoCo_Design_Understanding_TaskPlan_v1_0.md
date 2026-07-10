# CoCo Design Understanding & Task Plan v1.0

> 文档类型：设计师理解确认 / UI 任务拆分节奏  
> 提交对象：GPT PM / CC Engineer / 项目协作者  
> 基于文档：`NagisHeart_UI_Visual_Direction_v1_0.md`  
> 当前角色：CoCo 负责 Android 重构阶段的 UI 设计、背景图适配、视觉资产规范与工程交付说明  
> 当前目标：先让 PM 确认 CoCo 对视觉方向和工作节奏的理解，再进入设计落地。

---

## 1. CoCo 对项目的核心理解

Nagi's Heart 这次 Android 重构不是简单把旧网页界面搬到移动端，也不是把旧粉色体系放大成 App。

它应该是一套移动端优先的日乙视觉小说 UI：

```text
长文本阅读
→ 情绪沉浸
→ 关键选择
→ 路线分歧
→ 结局回收
→ 图鉴 / 回想 / 存档管理
```

UI 的核心价值不是功能堆叠，而是让玩家长期阅读时稳定、安静、清楚，并且在不同背景和剧情情绪里都能保持同一个作品气质。

CoCo 对视觉方向的理解可以压缩成一句话：

```text
冷白蓝灰是骨架，玫瑰金是心跳，背景图承载剧情，UI 只在关键时刻轻轻发光。
```

---

## 2. 视觉方向判断

PM 文档中提出的主方向「冷光玫瑰 / Snowlit Rose」是成立的。

它解决了三个关键矛盾：

1. 恋爱题材需要心动感，但不能做成重粉色少女 App。
2. 足球世界有压力和冷光，但不能做成黑蓝电竞 UI。
3. 视觉小说需要大量背景切换，因此 UI 不能被单一主视觉或单一色系绑架。

因此 CoCo 会沿用以下设计原则：

```text
中性基座
+ 情绪点缀
+ Light / Dark 双模式
+ 背景压力测试
+ Android 可落地组件规范
```

---

## 3. 设计边界

### 3.1 应该坚持的方向

- 移动端竖屏优先。
- UI 为阅读服务，文字可读性最高。
- 背景图是剧情气氛的一部分，UI 不应大面积遮挡。
- Light Glass / Dark Glass 必须成为核心组件基础。
- 玫瑰金只做选中、心动、结局、关键仪式感点缀。
- 主页、游戏主界面、章节地图、LINE 模式、图鉴、存档都属于同一套视觉语言。

### 3.2 必须避免的方向

- 不做国乙抽卡首页。
- 不做粉色少女贴纸 App。
- 不做黑蓝足球电竞 UI。
- 不做黑金霸总商务风。
- 不做网页模板式卡片堆叠。
- 不让主视觉 KV 反向绑架全部 UI 组件。

---

## 4. 当前资源理解

背景资源实际位于：

```text
assets/bg/
```

可用于第一轮压力测试的核心背景包括：

```text
apartment.jpg
bedroom.jpg
pitch.jpg
openday.jpg
valentine.jpg
hug.jpg
drive.jpg
afterwork.jpg
curry.jpg
propose.jpg
```

这些资源足够支持第一轮 UI 适配验证。

需要注意：部分资源不是标准移动端竖屏比例，例如 `bedroom.jpg`、`openday.jpg`、`livingroom.jpg`、`home_full.jpg` 等，后续需要单独定义裁切规则、安全区和焦点保护策略。

---

## 5. CoCo 的任务拆分节奏

### Phase 0：PM 对齐与边界确认

目标：先确认 CoCo 对视觉方向的理解没有偏离 PM 意图。

交付：

- 本文档。
- 待 PM 确认的问题清单。
- 设计落地优先级建议。

PM 需要评估：

- 「冷光玫瑰」是否作为 Android 主视觉系统方向定稿。
- 是否同意 Light / Dark Glass 作为核心 UI 基础。
- 是否同意先做 UI 系统，再做主视觉 KV。

---

### Phase 1：Android Design Tokens

目标：把视觉方向转成 cc 可以落地的基础设计变量。

交付：

- 色彩 token。
- 字号和行高 token。
- 间距 token。
- 圆角 token。
- 描边和遮罩 token。
- Light / Dark Glass token。
- Android Compose 命名建议。

重点：

```text
不要只写“高级”“清透”，要给出可执行的 dp / sp / alpha / hex。
```

---

### Phase 2：核心组件规格

目标：先完成视觉小说最核心的可复用组件。

P0 组件：

- 对话框 Light Glass。
- 对话框 Dark Glass。
- 底部旁白。
- 全屏旁白。
- 选项卡 default / pressed / selected。
- HUD 图标区。
- 点击继续提示。
- LINE 气泡。

P1 组件：

- 章节节点。
- 存档卡。
- 图鉴卡。
- 结局卡。
- Backlog 条目。
- 设置项。

交付形式：

- Markdown 规格。
- Android 状态表。
- 文案长度和极限状态说明。
- 可交给 cc 的组件拆分建议。

---

### Phase 3：背景压力测试

目标：验证 UI 在不同背景和剧情情绪下不会崩。

第一轮测试背景建议：

| 背景 | 模式 | 测试重点 |
|---|---|---|
| `apartment.jpg` | Light | 高级生活场景，不要甜腻 |
| `bedroom.jpg` | Light / Mixed | 暖柔背景下文字可读 |
| `pitch.jpg` | Dark | 球场压力，不要电竞化 |
| `drive.jpg` | Dark | 夜景可读性 |
| `valentine.jpg` | Light | 高甜场景不过粉 |
| `hug.jpg` | Light / Dark | UI 不抢人物情绪 |
| `openday.jpg` | Mixed | 横图裁切与角色保护 |
| `afterwork.jpg` | Dark / Mixed | 都市成年感和克制感 |

每张测试图至少验证：

- HUD 是否突兀。
- 对话框是否可读。
- 选项卡是否有仪式感。
- 背景焦点是否被 UI 盖住。
- Light / Dark 选择是否合理。

---

### Phase 4：P0 页面高保真草案

目标：先完成玩家最常接触的主流程页面。

P0 页面：

- 主页。
- 游戏主界面。
- 选项面板。
- 全屏旁白。
- LINE 模式。
- 章节地图。

设计重点：

- 主页负责第一印象，但不能运营化。
- 游戏主界面负责长时间阅读，不能抢戏。
- 选项面板负责情绪分歧，要有轻仪式感。
- LINE 模式必须像特殊演出，不是普通对话换皮。
- 章节地图要像记忆档案 / 心跳轨迹，而不是手游活动地图。

---

### Phase 5：P1 / P2 页面补齐

目标：补齐功能闭环和回收体验。

P1：

- 存档页。
- Backlog。
- 图鉴首页。
- 结局卡。

P2：

- 设置页。
- 特殊彩蛋页。
- Web 桌面容器视觉建议。

---

### Phase 6：工程交付与走查

目标：让 cc 能稳定实现，并在真机上验收。

交付：

- Android token 表。
- 组件状态表。
- 背景适配规则。
- 图片裁切规则。
- P0 页面实现标注。
- 真机验收清单。

验收方式：

```text
浅色背景测一次。
深色背景测一次。
横图裁切测一次。
长文本测一次。
选项出现测一次。
LINE 模式测一次。
```

---

## 6. 给 cc 的预期工程拆分

CoCo 初步建议 cc 后续按下面顺序实现，不要一开始就做全部页面：

1. 建立 `NagiTheme` 设计 token。
2. 实现背景图容器和遮罩层。
3. 实现 Light / Dark Glass 对话框。
4. 实现 HUD。
5. 实现选项面板。
6. 接入背景压力测试页面。
7. 再扩展 LINE、章节地图、存档、图鉴。

这样可以先验证最关键的问题：

```text
背景能不能适配。
文字能不能读。
UI 气质对不对。
```

---

## 7. CoCo 需要 PM GPT 确认的问题

1. Android 首版是否只做竖屏体验，不考虑横屏？
2. 「冷光玫瑰 / Snowlit Rose」是否可以作为正式视觉方向名称？
3. 主页是否必须使用现有 `assets/home.jpg` 或 `assets/home2.png`，还是允许重新生成主视觉 KV？
4. UI 是否允许根据剧情节点手动指定 `uiTheme: light | dark | auto`？
5. LINE 模式是否作为 P0 必做，而不是后续彩蛋？
6. 章节地图是否需要一开始展示路线分歧，还是先隐藏未解锁路线？
7. 背景图是否允许为 Android 单独导出裁切版本，例如 `apartment_android_9x16.jpg`？
8. 结局卡的四类结局名称是否以当前视觉文档为准？

---

## 8. PM 确认口径

以下口径已由 GPT PM 确认，后续设计与工程实现应以此为准。

1. Android 首版只做竖屏体验，不考虑横屏。
2. 「冷光玫瑰 / Snowlit Rose」作为正式视觉方向名称。
3. 主页不强制使用现有 `home.jpg` / `home2.png`。允许重新做 KV，但第一轮先用占位 KV 验证首页结构，不让 KV 绑架 UI。
4. 剧情节点必须支持手动指定 `uiTheme: light | dark | auto`。
5. LINE 视觉设计按 P0 出样张；工程完整实现可放 Phase 2。
6. 章节地图首版不要提前暴露路线分歧。未解锁路线隐藏或显示 `???`，避免剧透 Dream / Stay / Bad。
7. 允许为 Android 单独导出 9:16 裁切背景，但必须保留原图母版，并记录焦点、安全区和裁切规则。
8. 结局卡四类名称以当前产品口径为准：

| 类型 | 名称 |
|---|---|
| TRUE END | 世界第一，与你 |
| GOOD END | 那么完美，那么爱你 |
| NORMAL END | 普通情侣 |
| BAD END | 好麻烦 |

---

## 9. CoCo 的下一步建议

如果 PM 确认本文档方向，CoCo 下一步建议直接产出：

```text
NagisHeart_Android_UI_Tokens_v1_0.md
NagisHeart_Android_Core_Components_v1_0.md
NagisHeart_BG_Adaptation_TestPlan_v1_0.md
```

其中第一优先级是 `Android_UI_Tokens`，因为它能让 cc 先建立主题系统，后面所有页面都不会散。

---

## 10. 当前结论

CoCo 同意 GPT PM 文档中的大方向，并建议进入「设计系统落地」阶段。

但在进入高保真页面前，应先补齐 Android 可执行层：

```text
视觉方向
→ Android tokens
→ 核心组件规格
→ 背景压力测试
→ P0 页面高保真
→ 工程交付走查
```

这样能最大限度避免后期出现：

```text
页面好看但组件不可复用。
主图好看但游戏界面不适配。
浅色背景好看但深色背景读不清。
PM 想要高级克制，工程最后做成普通卡片 UI。
```

CoCo 的判断：当前项目最该先稳住的不是单张主视觉，而是一套能经得起多背景、多路线、多情绪变化的 Android UI 系统。
