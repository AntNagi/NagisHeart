# CoCo PM Review Package v1.0

> 文档类型：给 GPT PM 的设计拆分评审入口  
> 提交方：CoCo  
> 目标：请 PM 评估 Android UI 设计落地拆分是否符合产品方向，确认后进入样张与工程标注阶段。

---

## 1. 本次提交内容

本次 CoCo 已将「冷光玫瑰 / Snowlit Rose」拆成三份可评审的设计落地文档：

| 文档 | 作用 | PM 主要看什么 |
|---|---|---|
| `NagisHeart_Android_UI_Tokens_v1_0.md` | Android 设计变量 | 色彩、字号、圆角、间距、遮罩、`uiTheme` 是否符合产品气质 |
| `NagisHeart_Android_Core_Components_v1_0.md` | 核心组件规格 | P0 组件是否完整，对话框、选项、LINE、章节地图是否符合体验 |
| `NagisHeart_BG_Adaptation_TestPlan_v1_0.md` | 背景压力测试计划 | 第一轮背景选择、裁切规则、验收标准是否合理 |

上一份对齐文档已更新 PM 定版口径：

```text
CoCo_Design_Understanding_TaskPlan_v1_0.md
```

---

## 2. 已吸收的 PM 口径

本次拆分已按以下口径执行：

1. Android 首版只做竖屏。
2. 正式视觉方向为「冷光玫瑰 / Snowlit Rose」。
3. 首页第一轮用占位 KV 验证结构，不让 KV 绑架 UI。
4. 剧情节点必须支持 `uiTheme: light | dark | auto`。
5. LINE 视觉按 P0 出样张，工程完整实现可放 Phase 2。
6. 章节地图首版不提前暴露 Dream / Stay / Bad 等路线。
7. 允许导出 Android 9:16 裁切背景，但必须保留母版并记录裁切规则。
8. 结局名称使用：
   - TRUE END：世界第一，与你
   - GOOD END：那么完美，那么爱你
   - NORMAL END：普通情侣
   - BAD END：好麻烦

---

## 3. 请 PM 重点评估

### 3.1 UI Tokens

- 对话正文字号 `17sp / 27sp` 是否符合阅读预期。
- `Light Glass` / `Dark Glass` 透明度是否符合「清透但可读」。
- 圆角整体控制在克制范围，是否符合 Nagi 气质。
- 玫瑰金是否只作为心动与仪式感点缀。
- 是否接受工程首版用半透明遮罩替代实时 blur。

### 3.2 Core Components

- P0 是否必须包含当前清单里的全部组件。
- LINE 是否按当前复杂度先出视觉样张即可。
- 章节地图隐藏路线的方式是否足够防剧透。
- 选项标签是否允许首版出现。
- 结局卡四类视觉基调是否符合产品口径。

### 3.3 BG Adaptation

- 第一轮 8 张背景是否覆盖主要情绪。
- `bedroom.jpg`、`openday.jpg` 等非竖屏图是否允许单独裁切。
- 是否需要把 `propose.jpg` 提前加入第一轮，专门测试 TRUE END。
- 验收标准中「文字可读必须为 2」是否过严。

---

## 4. CoCo 建议 PM 给出的结论格式

PM 可以按下面格式回复，方便 CoCo 进入下一阶段：

```text
1. UI Tokens：通过 / 修改后通过 / 退回
2. Core Components：通过 / 修改后通过 / 退回
3. BG Adaptation：通过 / 修改后通过 / 退回
4. 必须调整项：
5. 可后置项：
6. 下一步是否允许 CoCo 开始 P0 样张：
```

---

## 5. CoCo 下一步

若 PM 通过，本设计侧下一步进入：

```text
P0 静态样张说明
→ 首页占位 KV 结构
→ 游戏主界面 Light / Dark 样张
→ 选项面板样张
→ LINE 模式样张
→ 章节地图样张
→ 背景压力测试矩阵
```

此阶段仍以评估 UI 系统为主，不急着追求最终主视觉精修。
