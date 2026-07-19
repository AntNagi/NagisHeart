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

---

## 17. TASK-20260719-001 Android 实机反馈 UI authority candidate：可读性 / HUD / Dialog / 长旁白 / 结局页

来源：PM `TASK_TO_XOXO_20260719_ANDROID_READABILITY_ENDING_UI_AUTHORITY.md`、PM review `PM_REVIEW_ANDROID_REAL_DEVICE_FEEDBACK_20260719.md`、`DEC-20260719-001`、`DEC-20260719-002`。  
状态：review authority candidate。必须先给 PM / Ant 确认；确认前不得称为 final dev authority，也不得由 PP 直接按聊天印象实现。  
范围：只补 UI authority / spec，不改 Android/Web/story-data/script/BG mapping/TT Start/App Icon，不删除资源。

### 17.1 全局压图文字可读性 token

所有压在 story BG / 亮图 / 复杂图上的文字层，默认必须有轻玻璃托底。视觉方向仍是 final glass，不是厚黑底、厚系统按钮或纯白卡片。

| 组件 | Shape | Alpha / background | Border | Shadow / halo | Android no-real-blur fallback | 禁止样式 |
|---|---|---|---|---|---|---|
| Dialogue bottom box | `cut-md` | `linear-gradient rgba(16,24,39,0.54) -> rgba(16,24,39,0.70)` | `rgba(255,255,255,0.08)` 1dp | card shadow `0 18dp 40dp rgba(0,0,0,0.26)`；文本轻 shadow | 无 blur 时保持同 alpha，不降到 0.46 以下；必须保留 border + shadow | 裸文字；厚黑整条；纯系统圆角卡片 |
| Speaker / name | `cut-sm`，只包住姓名文本 | `rgba(16,24,39,0.30) -> rgba(16,24,39,0.10)` | gold `rgba(215,190,134,0.18)` 1dp | text shadow `0 1dp 2dp rgba(0,0,0,0.72)` + gold halo `0 0 10dp rgba(215,190,134,0.20)` | 无 blur 时仍保留半透明底、gold border、shadow/halo | 改成白字；整条 name plate；厚黑姓名底 |
| Chapter opening text group | `cut-md` | `rgba(16,24,39,0.38) -> rgba(16,24,39,0.24) -> transparent` | `rgba(255,255,255,0.10)` 1dp | `0 14dp 36dp rgba(0,0,0,0.30)` | 无 blur 时 alpha 不得低于 0.34；可加强 shadow，不可取消托底 | 标题裸压背景；大弹窗；实心黑/白底 |
| Chapter Clear card | `cut-md` | `rgba(27,36,54,0.34) -> 0.24 -> 0.36` + center highlight `rgba(247,249,252,0.12)` | `rgba(255,255,255,0.10)` 1dp | text shadow `0 2dp 20dp rgba(0,0,0,0.54)` | 无 blur 时 card 主体保持 0.34/0.36，不能回到 0.20/0.24 的弱托底 | 普通弹窗；厚按钮页；Section Clear 复用为当前范围 |
| Backlog / recap panel | system dark glass | page overlay `rgba(19,32,51,0.58)` | 沿用 system panel token | text shadow `0 1dp 8dp rgba(10,15,25,0.18)` | 无 blur 时保持 0.58 overlay，优先分页避免裁切 | 固定 8 条导致裁切；裸白文字压图 |
| Ending page card | `cut-md` | `rgba(16,24,39,0.50) -> rgba(16,24,39,0.76)` + mood accent radial | `rgba(255,255,255,0.10)` 1dp | `0 22dp 54dp rgba(0,0,0,0.34)` | 无 blur 时 card 不低于 0.56 下缘 0.76；action 使用轻 glass cell | 章节结束页替代结局页；厚系统按钮；自动继续故事 |

### 17.2 HUD / nav / action chip developer-readable token

HUD 全家族必须同源：title chip、icon button、skip/action chip 都有轻玻璃 backing。不得出现 title 有底、icon 裸白的断裂状态。

| 组件 | Size / safe area | Shape | Alpha / background | Border | Shadow / icon halo | Android component target | 验收截图点 |
|---|---|---|---|---|---|---|---|
| HUD icon button | 36x36dp；icon 18x18dp；top 14dp；left/right 17dp；group gap 8dp | `cut-sm` / Compose `CutCornerShape(8dp)` | radial highlight `rgba(247,249,252,0.08)` + vertical `rgba(15,24,39,0.34) -> rgba(15,24,39,0.22)` | `rgba(255,255,255,0.12)` 1dp | container drop shadow `0 3dp 12dp rgba(0,0,0,0.42)`；icon `rgba(247,249,252,0.94)` + dark shadow `0 1dp 2dp rgba(0,0,0,0.64)` + light halo `0 0 8dp rgba(247,249,252,0.20)` | `NagiIconButton` / `NagiHud` icon slots | 亮背景、复杂背景各截一张：back/auto/save/menu/backlog 不能裸白漂浮 |
| HUD title chip | height 34dp；padding 14~18dp；max-width 210dp；single-line ellipsis | `cut-sm` | `rgba(15,24,39,0.30) -> rgba(15,24,39,0.12)` | `rgba(255,255,255,0.12)` 1dp | `0 3dp 12dp rgba(0,0,0,0.34)`；text shadow `0 1dp 2dp rgba(0,0,0,0.45)` | `NagiHud` title composable | 与 icon 同一视觉家族；长标题省略，不挤压右侧 icon |
| Skip / action chip | height 34dp；right 18dp；top 76dp 或 HUD 下方 14~18dp；padding 14~16dp | `cut-sm` | 与 title chip 同 token：`0.30 -> 0.18/0.12` | `rgba(255,255,255,0.12)` 1dp | drop shadow `0 3dp 12dp rgba(0,0,0,0.42)`；text shadow `0 1dp 2dp rgba(0,0,0,0.45)` | skip section / next chapter / continue action chip | “跳过本节”在亮图上仍清晰，但不能像厚按钮 |

禁止样式列表：

- 裸白图标直接压亮背景。
- title/action 有背景但 icon buttons 没背景。
- Material 默认厚按钮、实心黑按钮、纯白按钮。
- 大圆角矩形硬边框，尤其是看起来像系统弹窗线框。
- 旧 handoff / archive 样式、临时截图样式、未进入 `08_authority_current` 的聊天口径。

### 17.3 Dialog Android no-real-blur fallback hard token

本节覆盖 section 16.5 中“border 0.14 / radius 24”可能造成圆角线框感的旧风险。Dialog final direction 是轻玻璃切角浮层，不是大圆角矩形线框。

| 项 | Preferred with real blur | Android no-real-blur fallback | Hard limit |
|---|---|---|---|
| Shape | `cut-md` | Compose `CutCornerShape(14dp)`；如确实无法切角，必须回 UI/PM 复核后才能使用圆角 | 不得默认 `RoundedCornerShape(24dp)` + 高 alpha border |
| Card background | `rgba(27,36,54,0.32)` + blur 16dp | `linear-gradient rgba(27,36,54,0.56) -> rgba(20,31,49,0.52)` | card 不低于 0.52；不高于 0.64 |
| Scrim | `rgba(9,14,24,0.32)` | `rgba(9,14,24,0.40)` | 允许 0.38~0.42；超出回 PM/UI |
| Border | `rgba(255,255,255,0.10)` | 降为 `rgba(255,255,255,0.08)` 1dp | 不得高于 0.10，避免线框感 |
| Inner highlight | top highlight `rgba(255,255,255,0.05)` | 必须保留，用来替代硬边框的“玻璃边缘” | 不得用纯描边承担全部轮廓 |
| Shadow | `0 18dp 42dp rgba(0,0,0,0.32)` | `0 18dp 42dp rgba(0,0,0,0.36)` | 不得取消 shadow |
| Text | title snow 0.96；body 0.88 | title/body 可加 `0 1dp 2dp rgba(0,0,0,0.35)` | 不得模糊文字本身 |

HTML preview：`design/NagisHeart_UI_Authority_XoXo_v1_0.html` 的 `skip-confirm` 页面是本轮 dialog fallback 可见样例。

Blocked rule：如果 Android 无法做 `CutCornerShape` / 弱 border / inner highlight / shadow 中任一关键层，PP 必须标 blocked 或回 PM/UI 复核，不能自行改成圆角系统 Dialog。

### 17.4 长旁白宽度与底部裁切规则

长旁白正文宽度与底部单行旁白正文宽度同基准。

| 项 | Token |
|---|---|
| 外边距 | left/right 18dp，与 `.dialogue-box` 外边距一致 |
| 内边距 | left/right 20dp，与 `.dialogue-box` 正文内边距一致 |
| 正文宽度公式 | `screenWidth - 18*2 - 20*2 = screenWidth - 76dp` |
| max-width | 不再设置比底部旁白更窄的 max-width；文本容器不得用 78% / 80% 压窄 |
| 垂直安全 | 底部至少预留 120dp，避免 tap note、导航手势区或长屏缩放裁切 |
| 背景 | radial backing `rgba(16,24,39,0.44) -> 0.32 -> transparent`；无 blur 时保持相同 alpha |
| 验收截图点 | 选一段 5~7 行长旁白，在亮背景和暗背景各截图；正文左右宽度应与底部单行旁白正文对齐，底部不裁切 |

### 17.5 结局页历史候选（已废止，禁止实现）

> PM note 2026-07-19: this historical candidate model is superseded by section 18.1. Do not implement this section as product UI. Current implementation authority is section 18: content / status feedback / primary action, only one visible action `返回主页`, and no user-facing candidate wording.

结局页是 terminal ending page，不是 Chapter Clear，也不是普通剧情节点。到达 ending 后不得空白点击继续普通 story；必须写入 unlock 后停在终局页。

历史候选结构（仅保留为变更追溯，禁止开发实现）：

1. `ending tag`：TRUE / GOOD / NORMAL / BAD。
2. `title`：结局名。
3. `subtitle`：ending unlocked / route mood。
4. `description`：2~3 行结局说明。
5. `unlock feedback`：例如“已解锁：TRUE END / 回忆画廊新增 1 项”。
6. 主动作：返回主页。

废止项：

- 不再展示额外结局按钮。
- 不再把回忆画廊、重看本结局、相关章节作为结局页可见 action。
- unlock feedback 只允许作为低强调静态状态说明，不得做成 Button / ChipButton / action cell。

Mood token：

| Ending type | Accent | Mood note |
|---|---|---|
| TRUE | gold `#D7BE86` + snow highlight | 最亮、最温柔，但仍保留深色 glass terminal card |
| GOOD | warm gold / soft amber | 比 TRUE 稍低调，动作结构相同 |
| NORMAL | mist silver `rgba(220,226,234,0.78)` | 冷静、中性，减少 gold 强调 |
| BAD | cold blue `rgba(151,178,215,0.72)` + lower saturation | 不做恐怖红黑，不跳出 final UI |

确认状态：本小节已废止，不得作为 PP / Wewe 实现依据。后续开发只看 section 18。

### 17.6 小章节结束页移出当前范围

根据 PRD section 21 与 Interaction section 31：

- standalone Section Clear / 小章节结束页已从当前产品范围移除。
- 小节正常结束后直接进入下一小节 opening。
- 如果当前小节是大章最后一小节，进入 Chapter Clear。
- 如果当前节点已到 story ending，进入 terminal ending page。
- 历史 section 14.3 与 merge record 第 9 节中“Section Clear 可实现”的口径，被本 section 覆盖。

HTML authority 已移除 `section-clear` 入口、页面和 preset。

### 17.7 PP implementation alignment checklist

| Authority section | 目标效果 | Android 组件 / 路径 | 关键 token | 实机验收截图点 |
|---|---|---|---|---|
| 17.1 / 17.2 HUD | 顶部 HUD 全部轻玻璃同族，亮图可读 | `NagiHud.kt`、`NagiIconButton.kt` | icon 36dp / cut-sm / bg 0.34→0.22 / border 0.12 / shadow / icon halo | 亮背景：back、auto、save、menu/backlog 全可见；title 和 icon 不割裂 |
| 17.3 Dialog | 不再像圆角矩形线框；无 blur 也有玻璃层次 | `NagiDialog.kt` | CutCornerShape 14dp / card 0.56→0.52 / scrim 0.40 / border 0.08 / inner highlight / shadow | `skip-confirm` 或跳过确认实机截图；边框不能成为主要视觉 |
| 17.1 Dialogue | 底部对白压图可读但不厚重 | `DialogueLayer.kt` | box bg 0.54→0.70 / border 0.08 / card shadow；speaker gold chip | 亮背景对白截图；speaker 金色清晰但不是白字 |
| 17.4 Long narration | 长旁白宽度与底部旁白正文同基准、不裁切 | long narration screen / text layer | outer 18dp / inner 20dp / width = screen - 76dp / bottom reserve 120dp | 5~7 行长旁白截图；左右宽度与底部旁白正文对齐 |
| 17.5 Ending page | 历史候选已废止；只用于追溯，不作为实现依据 | Ending screen / terminal route view | see section 18 | 开发验收必须看 section 18.1 / 18.5：status feedback 非按钮，`返回主页` 是唯一 action |
| 17.6 Flow removal | 不再显示 standalone Section Clear | route / screen registry | 移除 section-clear 运行入口；保留 Chapter Clear | 小节结束后进入下一小节 opening；最后小节进入 Chapter Clear / Ending |

如果上述任一组件无法定位 active Android path，或存在多个重复实现路径，PP 必须在 pre-implementation alignment 表中标出 duplicate / stale path risk，不得假设自己改到的文件就是运行文件。

### 17.8 Blocker judgment

本 UI authority 对本轮范围已补齐到可审核 token 粒度；当前 XoXo 不标 blocked。  
但若出现以下情况，后续开发必须 blocked 回 PM/UI：

1. Android 无法实现 cut-corner / inner highlight / shadow / icon halo 的关键层。
2. PP 找不到 active component path，或发现重复 UI 组件路径。
3. 实机仍显示旧样式，无法确认是 stale APK、wrong variant、还是 active path 不一致。
4. Ending page 的 TRUE/GOOD/NORMAL/BAD 文案、终局动作或 unlock 反馈需要 Ant 进一步产品确认。

### 17.9 给 PP / Wewe 的实现口径

1. 不要按旧 handoff、archive、聊天截图或历史 7/17 section-clear 口径实现；必须读 `08_authority_current/04_ui/` section 17。
2. UI 任务开始前必须按 `tpl_alignment_code_review_gate.md` 写 pre-implementation alignment table。
3. 实现后必须写 code-review table，逐项映射 authority section → Android 文件 → token → 验收截图。
4. 本 section 是 review authority candidate；Ant 确认前，结局页不得宣布 final。
5. Web 若同步 visual rule，也以本 section token 为准，但不得因此改 story-data 或 Android code。

---

## 18. TASK-20260719-008 Ending page authority revision + Prologue typography + visible copy hygiene

来源：PM `TASK_TO_XOXO_20260719_ENDING_PAGE_AUTHORITY_REVISION.md`；Ant 2026-07-19 返修意见。  
状态：UI authority revision / review。仍为 UI authority only；不改 Android/Web/story-data/script/BG mapping/TT Start/App Icon，不删除资源。  
本节覆盖 section 17.5 中结局页四动作候选模型；同时补充 Prologue 字号 token 和手机 mock 文案 hygiene 规则。

### 18.1 Ending page action model revision

结局页是 terminal ending page，但不再展示多入口动作。PRD 未定义的入口不得由 UI 自行发明。

| 项 | Revised authority |
|---|---|
| User-facing candidate wording | 禁止。手机 mock / app UI 中不得出现 `candidate`、`terminal page candidate`、`待 PM 确认` 等内部状态字样。 |
| Visible action count | 只保留 1 个可见动作。 |
| Only visible action | `返回主页`。 |
| Removed visible actions | `回忆画廊`、`重看本结局`、`相关章节`。 |
| Gallery unlock | 后台状态结果，可显示轻量解锁反馈文案；不是结局页按钮。 |
| Blank tap | 不推进普通 story。 |

Ending page visual hierarchy is fixed to three layers:

| Layer | Role | Allowed implementation | Forbidden implementation |
|---|---|---|---|
| Content | ending tag / title / description | static text inside ending card | clickable route / hidden navigation |
| Status feedback | unlock result, e.g. `已解锁：TRUE END / 回忆画廊新增 1 项` | static text line, low-emphasis inline note, or small non-interactive badge; 10~11sp; no action rhythm | `Button`、`ChipButton`、action cell、same-height glass bar、same padding/border/hover rhythm as primary action |
| Primary action | only `返回主页` | one full-width / clear primary action cell | any additional ending action |

Status feedback token：

- font-size: 11px preview token；
- color: `rgba(244,241,234,0.70)`；
- optional small gold status dot: 5dp, `rgba(215,190,134,0.72)`；
- no border；
- no rectangular fill；
- no `cut-sm` action shape；
- width = content / fit-content, not full-width；
- margin-top 14dp, then primary action margin-top 22dp so the action rhythm is visually separated.

结局页仍可显示：

1. ending type tag：TRUE / GOOD / NORMAL / BAD；
2. ending title；
3. short ending description；
4. 轻量 unlock feedback，例如“已解锁：TRUE END / 回忆画廊新增 1 项”；
5. 单一 action：`返回主页`。

### 18.2 Home after-ending state

当一个 ending 已完成并返回 Home 时，Home 必须进入 new-run state：

| 项 | Token / rule |
|---|---|
| Home primary CTA after ending | `新的故事` |
| Forbidden after-ending primary CTA | `继续故事` |
| Supporting copy | 可使用 `开始新的运行` / `重新开始` 这一类玩家可见文案 |
| Gallery unlock | 后台已解锁；不要求从结局页直接进入 Gallery |
| Implementation note | PP 必须区分普通存档继续态与 ending-complete 后的新运行态；不要把 completed ending 的 Home 继续显示为 `继续故事`。 |

### 18.3 Prologue / 开场白 typography token

Ant 反馈开场白正文偏大，本节只调 Prologue main body typography，不改 Start title，不改 Name Setup。

| Component | Previous preview token | Revised token | Scope |
|---|---|---|---|
| Prologue main body `.opening-center` | 31px, line-height 1.6 | 28px, line-height 1.68 | 仅 Prologue / 开场白正文 |

规则：

- 保持原布局、背景、进度 label、tap note、视觉 mood。
- Start 标题字号不变。
- Name Setup 字号不变；当前 HTML 中 Name Setup 未共用 `.opening-center`，因此本轮无需拆 token。
- Android / Web 实现不得猜字号；Prologue 正文字号按 28px preview 等比换算为当前平台 token。

### 18.4 Visible mock copy hygiene

手机 mock 屏幕只能出现真实玩家会看到的产品文案。PM / dev / source / candidate / fallback / implementation notes 必须移到 MinSpec 或 merge record，不能放进 phone mock 可视区域。

必须移除或不得出现：

1. `candidate` / `terminal page candidate` / `待 PM 确认` 等内部状态；
2. `Source:` / `来源：...` / source tag；
3. `第一版...`、`不扩展...`、`developer...`、`fallback preview...` 等实现说明；
4. PM / dev / implementation / handoff 口径；
5. 任何可能被 PP / Wewe 照抄进 app 的非玩家说明。

HTML 追溯信息可以保留在注释、merge record、MinSpec；但不得作为 phone mock 可见文案出现。

### 18.5 Updated PP alignment points

| Authority section | 目标效果 | Android 组件 / 路径 | 关键 token | 实机验收截图点 |
|---|---|---|---|---|
| 18.1 | 结局页三层清晰：content / status feedback / primary action | ending screen / terminal route view | status feedback = static 11sp inline note, no border/fill/button rhythm；primary action = only `返回主页` | 一眼能看出 `已解锁...` 只是提示，`返回主页` 才是唯一按钮；截图中没有 `回忆画廊` / `重看本结局` / `相关章节` / `candidate` |
| 18.2 | Ending 后 Home 进入新运行态 | Home screen / state mapping | primary CTA = `新的故事`；forbidden = `继续故事` | 完成结局后返回 Home 截图，主 CTA 是 `新的故事` |
| 18.3 | 开场白正文小一档 | Prologue screen text | 28px preview token / line-height 1.68；Name Setup unaffected | 开场白截图字体小于旧版；Name Setup / Start 字体未变化 |
| 18.4 | 手机 mock 没有 PM/dev/internal notes | all visible screens | no source tag / no candidate / no internal explanatory copy | 随机抽查章节目录、结局页、Start、Dialog；只有玩家可见文案 |

Blocked rule：如果 PP 发现 Home 普通继续态与 ending-complete 后新运行态在当前代码里无法区分，必须 blocked 回 PM / product；不得用“继续故事”临时代替 after-ending Home。
