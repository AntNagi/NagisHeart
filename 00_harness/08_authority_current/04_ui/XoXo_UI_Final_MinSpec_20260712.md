# Nagi's Heart UI 最终精简规范（XoXo / 2026-07-12）

适用对象：`developer yiyi (fork)`  
用途：直接实现本轮 UI 收口，不再自行发挥视觉风格。  
风格基准：`D:\Nagi's Heart\NagisHeart\design\NagisHeart_P0_HiFi_Design_XoXo_v2_0.html`  
补充说明：本文件只补“那版里没采用 / 没做完 / 需要中文化 / 需要钉数值”的内容。

---

## 1. 系统级页面统一规范

适用页面：

- 开屏页
- 开场白页
- 名字设置页
- 主页
- 存档页
- 章节目录页
- 回忆画廊页
- 系统设置页

统一背景图：

- 全部使用同一张背景：`poster_start_nagis_heart_bg_clean.png`
- 路径：`android/app/src/main/assets/bg/poster_start_nagis_heart_bg_clean.png`

暗层规则：

- 开屏页：**不叠暗层**
- 其余系统级页面：统一叠暗层 `rgba(19, 32, 51, 0.32)`

浮层统一：

- 浮层底色：`rgba(27, 36, 54, 0.26)`
- 浮层描边：`rgba(255, 255, 255, 0.10)`
- 浮层模糊：`18dp`
- 如页面底部承载文字/操作，再叠底部渐隐：
  - `rgba(19, 32, 51, 0.00)` -> `rgba(19, 32, 51, 0.80)`

统一文字色：

- 主文字：`#F4F1EA`
- 次文字：`#D6D2CB`
- 弱文字：`#B7B3AD`
- 金色强调：`#D7BE86`

统一字体：

- 标题 / 章节名 / 强情绪文案：`Noto Serif SC` 或 `Source Han Serif SC`
- 系统 UI / 标签 / 数值 / 次级信息：`Noto Sans SC`

统一原则：

- 除开屏页标题切图本身外，所有系统交互文字全部中文
- 不允许额外叠大块黑底 / 白底 / 灰底去遮图
- 如果文字不清晰，优先调字色 / 阴影 / 描边 / 位置，不要加整块遮罩

---

## 2. 开屏页

背景：

- 使用 `poster_start_nagis_heart_bg_clean.png`
- 不叠暗层

标题与 START：

- 直接使用 TT 切好的透明 PNG
- 不再程序拼标题字

使用文件：

- 标题 tight：`opening_poster_v15_title_layer_tight.png`
- START tight：`opening_poster_v15_start_layer_tight.png`

1080 x 1920 位置：

- 标题：`x=57, y=62, width=946, height=338`
- START：`x=364, y=1706, width=353, height=134`

动效：

- 只给 START 层做轻微呼吸/发光
- 推荐：
  - alpha：`0.72 -> 1.00`
  - scale：`0.992 -> 1.012`
  - duration：`1.8s`

---

## 3. 开场白页

背景：

- 使用 `poster_start_nagis_heart_bg_clean.png`
- 叠暗层 `rgba(19, 32, 51, 0.32)`

结构：

- 上方小标题
- 中间一句正文
- 下方“轻触继续”

顶部小标题：

- 示例：`开场白 02 / 08`
- 字体：`Noto Sans SC`
- 字号：`12sp`
- 颜色：`rgba(244, 241, 234, 0.92)`
- 字间距：`0.12em`
- 对齐：水平居中
- 位置：`y=66`
- 左右安全边距：`48`
- 两侧细线颜色：`rgba(215, 190, 134, 0.60)`

中间正文：

- 字体：`Noto Serif SC` 或 `Source Han Serif SC`
- 字号：`31sp`
- 行高：`1.6`
- 颜色：`#F7F3EC`
- 字间距：`0`
- 对齐：居中
- 文字区域：`x=120, width=840`
- 垂直位置：整句在页面视觉中心
- 不加背景框

底部提示：

- 文案：`轻触继续`
- 字体：`Noto Sans SC`
- 字号：`14sp`
- 颜色：`rgba(244, 241, 234, 0.84)`
- 底部位置：距底 `58`

---

## 4. 名字设置页

背景：

- 使用 `poster_start_nagis_heart_bg_clean.png`
- 叠暗层 `rgba(19, 32, 51, 0.32)`

结构：

- 上方小标题
- 中间标题 + 副标题
- 一个输入项（只保留玩家名）
- 下方文字型确认

顶部小标题：

- 文案：`开始之前`
- 规则同开场白页顶部

主标题：

- 文案：`写下你的名字`
- 字体：`Noto Serif SC` 或 `Source Han Serif SC`
- 字号：`34sp`
- 颜色：`#F4F1EA`
- 对齐：居中

副标题：

- 字体：`Noto Sans SC`
- 字号：`15sp`
- 颜色：`#D6D2CB`
- 对齐：居中
- 与主标题间距：`12`

输入项：

- 仅保留：`你的名字`
- 样式：**纯文字 + 下划线输入**
- 不用玻璃输入框，不用白色实框

标签：

- 字体：`Noto Sans SC`
- 字号：`13sp`
- 颜色：`rgba(244, 241, 234, 0.82)`

输入线：

- 颜色：`rgba(215, 190, 134, 0.74)`
- 输入区宽度：`972`
- 左右边距：`54`
- 单行高度：`46`

占位文字：

- 颜色：`rgba(244, 241, 234, 0.58)`

确认文字：

- 主文案：`进入故事`
- 字体：`Noto Serif SC` / `Source Han Serif SC`
- 字号：`19sp`
- 颜色：`#F7F3EC`

- 次文案：`轻触确认`
- 字体：`Noto Sans SC`
- 字号：`14sp`
- 颜色：`rgba(244, 241, 234, 0.82)`

---

## 5. 主页

背景：

- 使用 `poster_start_nagis_heart_bg_clean.png`
- 叠暗层 `rgba(19, 32, 51, 0.32)`

标题：

- 使用与开屏页相同的 TT 标题切图
- 位置同开屏页标题 tight：
  - `x=57, y=62, width=946, height=338`

底部布局：

- 保持当前已实现的操作布局
- 不重排

底部操作文字：

- 主操作：`#F4F1EA`
- 次操作：`rgba(244, 241, 234, 0.82)`
- 底部分割线：`rgba(255, 255, 255, 0.08)`

---

## 6. 剧情内页总规范

本轮主题规则：

- 默认使用 `dark`
- 只有 mapping 明确标注 `light` 时才切 `light`
- 本轮不做 `auto`

### 6.1 dark 方案

- 主文字：`#F4F1EA`
- 次文字：`#D6D2CB`
- 弱文字：`#B7B3AD`
- 强调金：`#D7BE86`
- HUD 衬底：`rgba(15, 24, 39, 0.18)`
- HUD 描边：`rgba(255, 255, 255, 0.10)`
- HUD 模糊：`12dp`
- 弹窗遮罩：`rgba(9, 14, 24, 0.32)`
- 浮层底色：`rgba(27, 36, 54, 0.26)`
- 浮层描边：`rgba(255, 255, 255, 0.10)`

### 6.2 light 方案

- 主文字：`#162131`
- 次文字：`rgba(22, 33, 49, 0.84)`
- 弱文字：`rgba(22, 33, 49, 0.56)`
- 强调金：`#B89B62`
- HUD 衬底：`rgba(244, 241, 234, 0.62)`
- HUD 描边：`rgba(22, 33, 49, 0.10)`
- 浮层底色：`rgba(244, 241, 234, 0.22)`
- 浮层描边：`rgba(22, 33, 49, 0.08)`

---

## 7. 导航栏统一规范

适用：所有剧情内页

图标按钮：

- 容器尺寸：`34 x 34`
- 衬底：`rgba(15, 24, 39, 0.18)`（dark）
- 描边：`rgba(255, 255, 255, 0.10)`
- 模糊：`12dp`

标题 chip：

- 高度：`34`
- 左右 padding：`14`
- 最小宽度：`120`
- 字体：`Noto Sans SC Medium`
- 字号：`14sp`
- 颜色：`#F4F1EA`
- 衬底与图标按钮一致

原则：

- 顶栏整体保持 v2 那套轻玻璃语言
- 不允许再做成厚重切角硬按钮排排站

---

## 8. 底部对白规范（对白 + 短旁白）

### 8.1 对白页

- 显示角色名
- 角色名：
  - 字体：`Noto Sans SC Medium`
  - 字号：`13sp`
  - 颜色：`#D7BE86`

- 正文：
  - 字体：`Noto Sans SC`
  - 字号：`17sp`
  - 行高：`30sp`
  - 颜色：`#F4F1EA`
  - 对齐：左对齐

### 8.2 短旁白页

- 不显示角色名
- 不显示“旁白”标签
- 正文：
  - 字体：`Noto Serif SC` 或 `Source Han Serif SC`
  - 字号：`17sp`
  - 行高：`30sp`
  - 颜色：`#F4F1EA`
  - 对齐：左对齐

底部承载层：

- 不做厚重纯色大框
- 使用底部渐隐 + 轻玻璃衬底
- 衬底：`rgba(27, 36, 54, 0.18)`

---

## 9. 长旁白展示规范

方案：

- 不做整页毛玻璃
- 使用“居中阅读框”
- 阅读框必须符合 v2 轻玻璃语言
- 不允许出现厚重白框 / 厚重黑方框 / 明显后台卡片感

1080 x 1920 基准数值：

- `x = 54`
- `width = 972`
- 左右边距固定：`54`
- 内边距：左右 `56`，上下 `46`
- 背景：`rgba(27, 36, 54, 0.26)`
- 描边：`rgba(255, 255, 255, 0.10)`
- 模糊：`18dp`

高度规范：

- 最小高度：`280`
- 推荐高度：`360 ~ 520`
- 最大高度：`760`

位置规范：

- 默认垂直居中
- 顶部不得高于 `y=320`
- 底部不得低于 `y=1510`
- 底部“轻触继续”预留区至少 `120`

自适应规则：

1. 内容少：高度自适应，但不小于 `280`
2. 内容多：高度增长到最大 `760`
3. 超过 `760`：直接分页 / 分段，不继续拉长
4. 不允许顶到 HUD，不允许压到底部提示

文字：

- 字体：`Noto Serif SC` 或 `Source Han Serif SC`
- 字号：`16sp`
- 行高：`30sp`
- 颜色：`#F4F1EA`
- 段间距：`18`
- 对齐：左对齐

---

## 10. 剧情回顾页面规范

背景：

- 使用当前剧情 bg
- 叠暗层：`rgba(19, 32, 51, 0.46)`

正文区：

- 优先整页排版
- 若背景太花，可加极轻衬底：
  - `rgba(27, 36, 54, 0.18)`

字体：

- 标题：`Noto Serif SC` / `Source Han Serif SC`，`24sp`，`#F4F1EA`
- 正文：`Noto Serif SC` / `Source Han Serif SC`，`15sp`，`#F4F1EA`
- 行高：`28sp`
- 次信息：`Noto Sans SC`，`12sp`，`#D6D2CB`

---

## 11. 弹窗规范

原则：

- 必须符合 v2 轻玻璃风格
- 禁止纯白实底大方框
- 禁止系统原生默认弹窗样式

推荐实现（默认 dark）：

- 弹窗底：`rgba(27, 36, 54, 0.32)`
- 描边：`rgba(255, 255, 255, 0.12)`
- 模糊：`20dp`
- 圆角：`24`
- 遮罩：`rgba(9, 14, 24, 0.32)`

1080 x 1920 基准：

- 宽度：`864`
- 最小高度：`260`
- 最大宽度不超过画面宽度 `80%`
- 左右边距至少 `108`
- 上下居中

内边距：

- 左右 `40`
- 上 `32`
- 下 `28`

标题：

- 字体：`Noto Serif SC` / `Source Han Serif SC`
- 字号：`28sp`
- 颜色：`#F4F1EA`

正文：

- 字体：`Noto Sans SC`
- 字号：`16sp`
- 行高：`28sp`
- 颜色：`rgba(244, 241, 234, 0.82)`

按钮：

- 文字按钮，不加厚重按钮底
- 默认：`#D6D2CB`
- 强调：`#F4F1EA` 或 `#D7BE86`
- 底部右对齐
- 按钮间距：`26`

---

## 12. 两层章节页面补全规范

本轮必须区分两层：

- 大章（篇 / 部）
- 小章节（幕 / 节 / section）

都需要各自开始页和结束页。

### 12.1 大章开始页

- 用 v2 的“章节海报页”语言
- 结构：
  - 上方小标签（如：第一部 / 原作前置篇）
  - 中间大标题
  - 下方一到两句导语
  - 底部“轻触继续”
- 字体以 `Noto Serif SC / Source Han Serif SC` 为主

### 12.2 小章节开始页

- 比大章更轻
- 结构：
  - 小章节编号
  - 小章节标题
  - 可带一行短句
  - 底部“轻触继续”

### 12.3 大章结束页

- 用“章节结算 / 过渡页”语言
- 信息至少包含：
  - 大章标题
  - 已完成提示
  - 下一步入口文字

### 12.4 小章节结束页

- 用轻量结算页
- 信息至少包含：
  - 当前小章节标题
  - 状态：已完成 / 已跳过完成
  - 返回目录 / 进入下一节入口

---

## 13. 本轮固定规则

- 开屏页只保留标题层 + START 层
- 主页标题必须与开屏页使用同一标题切图
- 系统级页面全部共用 `poster_start_nagis_heart_bg_clean.png`
- 开场白页 / 名字设置页背景必须与开屏页一致
- 剧情内页默认 dark
- `nagiCall` 本轮不做，不设置，不替换
- 名字设置页只保留玩家名输入

---

## 14. TASK-20260717-011 实机反馈补齐：章节开始 / Chapter Clear / 顶部动作 chip

来源：Ant大小姐 2026-07-17 实机反馈；PM 任务 `TASK_TO_XOXO_20260717_CHAPTER_UI_REAL_DEVICE_FEEDBACK.md`。
适用范围：UI authority / 设计规范。不得在本规则下修改 Android 代码、story/script、BG mapping、TT Start、App Icon 或删除资源。

### 14.1 章节开始页文字托底

大章开始与小节开始继续使用 final UI 的 story dark 方向和章节海报语言，但标题组必须增加“很浅的透明托底”，解决实机背景上文字不清楚的问题。

1080 x 1920 基准：

- 容器：承载 kicker、章节副标题、章节标题、轻触继续文案的整组文字，不单独只托标题。
- 位置：沿用现有章节开始布局；大章默认 bottom=72，小节默认 bottom=96。
- 左右边距：30。
- 内边距：左右 24，上 22，下 20。
- 背景：`linear-gradient(to right, rgba(16,24,39,0.30), rgba(16,24,39,0.14) 62%, transparent)` + 中心极轻高光 `rgba(247,249,252,0.09)`。
- 描边：`rgba(255,255,255,0.08)`，1dp。
- 模糊：blur 10dp，saturation 0.92。
- 裁切：沿用 final UI cut-md 切角。
- 透明感：整体视觉应像“雾面托底条”，不是弹窗、不是厚卡片；不得使用纯黑/纯白大底。
- 文本：主标题 `Noto Serif SC / Source Han Serif SC`，29sp，line-height 1.24，颜色 `rgba(247,249,252,0.94)`；kicker 与 small 使用 gold `#D7BE86`；提示文案 16sp，颜色 `rgba(247,249,252,0.82)`。

长屏规则：

- 托底随文字组保持在安全区内，底部不得压到系统手势区。
- 若标题超过两行，优先缩小到 27sp 或增加容器高度，不取消托底。

### 14.2 大章结束 / Chapter Clear

本次任务将历史 Missing Pages 的“大章结束”方向提升为当前可实现 UI authority，但做如下收口：它是章节过渡页，不是普通弹窗，不是系统按钮页。

1080 x 1920 基准：

- 页面背景：使用当前章节 story BG；默认 dark readability overlay。
- 主容器：`clear-card`，left/right=28，bottom=82。
- 内边距：左右 24，上 28，下 22。
- 背景：轻玻璃渐变，主体 `rgba(27,36,54,0.20 -> 0.14 -> 0.24)`，可叠加中心微光 `rgba(247,249,252,0.10)`。
- 描边：`rgba(255,255,255,0.08)`，1dp。
- 模糊：blur 16dp，saturation 0.92。
- 裁切：final UI cut-md。
- Label：`CHAPTER CLEAR`，Noto Sans SC，11sp，letter-spacing 0.14em，颜色 `#D7BE86`。
- 标题：章节名，例如 `第一部 · 原作前置篇`；Noto Serif SC / Source Han Serif SC，30sp，line-height 1.25，最多两行。
- Body：13sp，line-height 1.8，颜色 `rgba(247,249,252,0.78)`；文案表达“本章完成，可返回目录或继续下一章”。
- Actions：底部左右分布；左侧 `返回目录` 常规文本，右侧 `进入第二部` / `继续下一章` 强调文本；14sp，右侧颜色 `#F7F9FC`，左侧 `rgba(244,241,234,0.86)`。

长屏规则：

- 卡片可保持 bottom=82，并应避开底部手势区；如果设备极长，允许将卡片整体下移不超过 24dp，但不能贴边。
- 内容多于两行动作说明时，不扩大成全屏卡；应缩短文案或分页。

### 14.3 小节结束 / Section Clear

小节结束与大章结束共用 `clear-card` 组件，但语义更轻。

- Label：`SECTION CLEAR`。
- 标题：当前小节名，例如 `作战室·初遇`，30sp，可降至 28sp。
- Body：表达“本节完成，可返回目录或继续下一节”。
- Actions：`返回目录` + `进入下一节`。
- 若是“跳过完成”状态，可将 body 改为“本节已跳过完成”，但组件样式不变。

### 14.4 顶部标题 chip 与下一章 / 跳过动作 chip

剧情内页顶部标题、右上动作 chip 必须回到 final glass HUD 语言，不允许使用厚重切角按钮或系统默认按钮。

标题 chip：

- 高度：34。
- 左右 padding：14~18。
- 最大宽度：约 210dp；超长章节名单行省略，不换行压住右侧 HUD。
- 字体：Noto Sans SC Medium，13sp，letter-spacing 0.02em。
- 颜色：`rgba(244,241,234,0.88)`。
- 背景：`rgba(15,24,39,0.22)` 起的轻玻璃渐隐，叠加 final HUD 细线语言。
- 描边：`rgba(255,255,255,0.10)`，1dp。
- 模糊：blur 12dp。
- 对齐：左侧与 back icon 成组，垂直居中。

动作 chip（跳过 / 下一章 / 继续下一节）：

- 右侧对齐；默认 top=76 或位于顶部 HUD 下方 14~18dp，不与标题 chip 抢同一行。
- 高度：34。
- 左右 padding：14~16。
- 字体：Noto Sans SC Medium，12~13sp。
- 背景、描边、模糊与标题 chip 一致。
- 文本颜色：`rgba(244,241,234,0.90)`；强调态最多提高到 `#F7F9FC`，不要加厚实按钮底。

给 yiyi 的实现说明：

1. 可把章节开始托底、Chapter Clear、Section Clear、HUD title chip、action chip 抽成可复用 Compose 组件。
2. chapter opening / section opening 不要再裸文字压背景；必须有轻透明托底。
3. Chapter Clear / Section Clear 目前已不再 pending；章节目录已由 section 16 补齐为 review authority，后续按 section 16 实现。
4. 本规则只补 UI authority，不要求改 story/script 文案来源；实际章节名与下一章名由现有数据提供。

---

## 15. TASK-20260717-014 实机反馈补齐：高亮背景下 HUD 统一与 speaker 金色可读性

来源：Ant大小姐 2026-07-17 实机反馈；PM 任务 `TASK_TO_XOXO_20260717_HUD_DIALOGUE_READABILITY_REAL_DEVICE.md`。
适用范围：UI authority / 设计规范。不得在本规则下修改 Android/Web 代码、story-data、BG mapping、TT Start、App Icon、章节目录或删除资源。

### 15.1 HUD icon / title / action 统一规则

高亮或复杂背景下，顶部 HUD 不允许出现“title/action 有背景，但 back/auto/save/backlog/menu 图标裸白线”的不统一状态。所有 HUD 元素必须进入同一套 final glass HUD 家族。

#### Icon button

1080 x 1920 基准与 Compose dp 基准：

- 容器：36 x 36。
- 图标：18 x 18，居中。
- 背景：轻玻璃底，不是厚按钮。
  - 主体：`rgba(15,24,39,0.30)` 到 `rgba(15,24,39,0.18)` 的纵向轻渐变。
  - 中心极轻高光：`rgba(247,249,252,0.08)` radial。
- 描边：`rgba(255,255,255,0.10)`，1dp。
- 模糊：blur 12dp，saturation 0.92。
- 裁切：沿用 final UI cut-sm。
- 图标颜色：`rgba(247,249,252,0.94)`。
- 图标 shadow / halo：
  - dark shadow：`0 1dp 2dp rgba(0,0,0,0.64)`；
  - soft light halo：`0 0 8dp rgba(247,249,252,0.20)`。
- 容器外层可加 `dropShadow 0 3dp 12dp rgba(0,0,0,0.42)`，用于亮底图分离。

Android 若无法对每个 HUD 元素使用真实 blur：

- 使用半透明深色渐变 + 1dp 描边 + shadow 作为 fallback。
- 不要改成实心黑按钮、纯白按钮或 Material 默认按钮。

#### Title chip

沿用 section 14 的 final glass HUD 规则，但需要和 icon button 同源：

- 高度：34。
- 左右 padding：14~18。
- 最大宽度：约 210dp，超长章节名单行省略。
- 背景：`rgba(15,24,39,0.22)` 到 `rgba(15,24,39,0.08)`，描边 `rgba(255,255,255,0.10)`。
- 模糊：blur 12dp；无 blur 时同 icon fallback。
- 字体：Noto Sans SC Medium，13sp。
- 文本颜色：`rgba(244,241,234,0.88)`。

#### Action chip

适用于 `跳过本节`、`下一章`、`继续下一节` 等右侧动作：

- 高度：34。
- 左右 padding：14~16。
- 字体：Noto Sans SC Medium，12~13sp。
- 背景 / 描边 / blur / fallback 与 title chip 一致。
- 文本颜色：`rgba(244,241,234,0.90)`；强调态最多到 `#F7F9FC`。
- 右侧对齐，默认位于 HUD 下方 14~18dp；不得与 title chip 或右侧 icon group 互相挤压。

#### Spacing / alignment

- 顶部 HUD 外边距沿用现有 final authority：left/right 17，top 14，HUD 高 44。
- 左组：back icon + title chip，gap 8。
- 右组：auto / save / backlog or menu icons，gap 8。
- 所有 HUD 元素视觉中心对齐。

### 15.2 Dialogue speaker / name gold readability

Ant 仍喜欢 speaker/name 的金色，因此保留金色方向；但亮底图或复杂背景下必须增加轻量可读性保护。

Speaker chip 规则：

- 文本颜色：从原 `#D7BE86` 提亮到 `#E4CA8F`。
- 字体：Noto Sans SC Medium，13sp，letter-spacing 0.04em，font-weight 600。
- 轻衬底：只包住 speaker/name 文本，不扩大成整行卡片。
  - padding：left/right 9，上 3，下 4。
  - 背景：`linear-gradient(to right, rgba(16,24,39,0.30), rgba(16,24,39,0.10))`。
  - 描边：`rgba(215,190,134,0.18)`，1dp。
  - 模糊：blur 8dp，saturation 0.92。
  - 裁切：cut-sm。
- 文本 shadow / halo：
  - `0 1dp 2dp rgba(0,0,0,0.72)`；
  - `0 0 10dp rgba(215,190,134,0.20)`。

限制：

- 不要把 speaker/name 做成厚 name plate。
- 不要改成白字或普通系统标签。
- 不要为了 speaker 可读性加整条黑底；只允许轻衬底、shadow、halo、轻描边。
- 该规则同时适用于 dialogue box speaker 与 recap/long narration 中出现的 speaker label。

### 15.3 给 yiyi 的实现说明

1. HUD icon button、title chip、action chip 应抽成同一套 `GlassHud` 样式 token：background / border / blur fallback / shadow / cut shape 一致。
2. back、auto、save、backlog/menu 等图标按钮不再裸线显示；在所有剧情页默认带轻玻璃 backing。
3. speaker/name 保留金色，但统一加轻衬底与 text halo；若背景特别亮，不要再临时改成白底或粗黑牌。
4. 本规则已同步到 `00_harness/08_authority_current/04_ui/`；开发以本 section 15 为准。

---

## 16. TASK-20260717-016 章节目录 authority + Dialog Android fallback

来源：PM `TASK_TO_XOXO_20260717_CHAPTER_CATALOG_DIALOG_FALLBACK_AUTHORITY.md` 与 `DEC-20260717-016` UI 谨慎变更检查。
适用范围：UI authority / 设计规范。不得在本规则下修改 Android/Web 代码、story-data、script、BG mapping、TT Start、App Icon 或删除资源；不得重设计已通过页面；不得重改 section 15 HUD / speaker 规则。

### 16.1 章节目录状态

章节目录从本节开始不再是 pending，而是当前可开发的 review authority。
旧 section 14 中“章节目录仍 pending，不要顺手补目录”的限制，被本 section 16 覆盖；其余 section 14/15 规则不受影响。

### 16.2 章节目录页面结构

章节目录是系统级页面，沿用 Home / Save / Settings 的 dark system glass 语言，不引入全新风格，不扩展成成就系统。

1080 x 1920 基准：

- 背景：沿用系统级背景 `splash_bg` / final system background，默认 dark overlay。
- 主容器：`catalog-panel`，left/right=18，top=84，bottom=34。
- 主容器背景：`linear-gradient(to bottom, rgba(16,24,39,0.34), rgba(16,24,39,0.52))`。
- 描边：`rgba(255,255,255,0.10)`，1dp。
- Blur：16dp，saturation 0.92；无真实 blur 时用该背景色与描边直接 fallback。
- Shape：final cut-md。
- Padding：18。
- 布局：标题区 / 列表区 / 底部动作区三段式。

标题区：

- 标题：`章节目录`，沿用 `.page-title`，Noto Serif SC / Source Han Serif SC，28sp，font-weight 400。
- 说明文：Noto Sans SC，12sp，line-height 1.7，颜色 `rgba(244,241,234,0.70)`。

列表区：

- 列表项高度：min 68。
- 列表项 padding：left/right 14，top/bottom 13。
- 列表项结构：编号/锁定标记 + 文案 + 状态。
- 列表项背景：`rgba(255,255,255,0.045)`，描边 `rgba(255,255,255,0.07)`，shape cut-sm。
- 当前项：背景可加 gold 轻扫光 `rgba(215,190,134,0.18)`，描边 `rgba(215,190,134,0.28)`。
- 锁定项：整体 opacity 0.52，不新增复杂锁图系统；可用文字 `锁` 或 existing `ic_lock`。

文案：

- 章节标题：Noto Sans SC Medium，15sp，颜色 `rgba(247,249,252,0.94)`，单行 ellipsis。
- 小节 / 进度副文：12sp，颜色 `rgba(244,241,234,0.64)`，单行 ellipsis。
- 状态文字：12sp，右对齐，普通 `rgba(244,241,234,0.70)`，当前项可用 gold `#D7BE86`。

支持状态：

- `current` / `进行中`
- `unlocked` / `已解锁`
- `completed` / `已完成`
- `locked` / `未解锁`

第一版不做：

- 成就系统；
- CG 收集展示；
- 多筛选器；
- 章节评分；
- 复杂进度图谱。

### 16.3 章节 / 小节层级与长标题策略

- 目录第一层显示大章 / 部。
- 第二行显示当前小节、完成进度或简短说明。
- 长章节标题单行省略，不撑高列表项。
- Android 第一版允许垂直滚动；若条目很多，优先 lazy list，不做分页。
- 顶部与底部安全区必须保留，不让列表压住底部动作。

### 16.4 返回 / 继续动作

底部动作区固定在主容器底部：

- 左侧：`返回主页` 或 `返回`，普通文本。
- 右侧：`继续当前章节`，强调文本。
- 字体：14sp。
- 顶部边线：`rgba(255,255,255,0.08)`，与 Home / Settings 轻分割线一致。
- 不做厚按钮，不做系统默认按钮。

### 16.5 Dialog Android fallback hardening

本节收紧 section 11 的 Android fallback。设计方向仍是 final light glass dialog；但当 Android / Compose 无法做真实 frosted background blur 时，必须使用固定 fallback token，不允许开发凭感觉继续调 alpha。

#### Preferred token with true background blur

沿用 section 11：

- Dialog card background：`rgba(27,36,54,0.32)`。
- Background blur：20dp。
- Border：`rgba(255,255,255,0.12)`，1dp。
- Scrim：`rgba(9,14,24,0.32)`。
- Radius：24dp。

#### Android no-real-blur fallback token

当无法模糊弹窗背后的游戏画面时，使用以下固定 token：

- Dialog card background：`rgba(27,36,54,0.56)`。
- 允许微调范围：0.52 ~ 0.60。不得低于 0.52，不得高于 0.64。
- Scrim：`rgba(9,14,24,0.38)`。
- 允许微调范围：0.34 ~ 0.42。
- Border：`rgba(255,255,255,0.14)`，1dp。
- Inner highlight：顶部可加 `rgba(255,255,255,0.06)` 的轻微纵向高光。
- Shadow：`0 18dp 42dp rgba(0,0,0,0.36)`。
- Text shadow：标题和正文可使用 `0 1dp 2dp rgba(0,0,0,0.35)`，但不得模糊文字本身。
- Radius：24dp。
- Padding / typography / actions 继续沿用 section 11，不重排。

亮背景 / 暗背景微调：

- 亮背景：优先把 scrim 提到 0.40，card 保持 0.56；只有仍不可读时才把 card 提到 0.60。
- 暗背景：card 可降到 0.52，scrim 可降到 0.34。
- 微调只能在上述范围内；超出范围必须回 UI/PM 复核。

明确禁止：

- 禁止系统默认 Dialog。
- 禁止纯黑 / 纯白实底。
- 禁止 80% 以上厚重深色大卡片。
- 禁止用会模糊弹窗文字和按钮自身的 `RenderEffect`。
- 禁止为了可读性牺牲 final glass language。

必须回 UI/PM 复核的情况：

1. 在 card 0.60 + scrim 0.42 下仍不可读。
2. Android 实现只能做纯色实底，无法保留描边 / shadow / 透明层次。
3. 文案长度导致弹窗超过 80% 画面宽或压到底部安全区。
4. 需要改变按钮布局、标题字号或弹窗位置。

### 16.6 给 yiyi / Wewe 的实现口径

1. 章节目录可实现为系统级 Compose screen，使用 `catalog-panel` + lazy list + bottom actions。
2. 目录数据只需要章节/小节标题、解锁状态、完成状态、当前进度；不要新增成就/评分/CG 系统。
3. Dialog fallback 直接使用 section 16.5 token；不要再凭感觉调 alpha/shadow。
4. 若无真 background blur，不要使用会模糊 Dialog 自身内容的 RenderEffect。
5. 本 section 已同步到 `00_harness/08_authority_current/04_ui/`，后续实现以这里为准。
