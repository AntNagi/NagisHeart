# Nagi's Heart UI 最终精简规范（XoXo / 2026-07-12）

适用对象：`developer PP / Wewe`  
用途：直接实现本轮 UI 收口，不再自行发挥视觉风格。  
风格基准：`design/NagisHeart_UI_Authority_XoXo_v1_0.html`  
补充说明：本文件只补”那版里没采用 / 没做完 / 需要中文化 / 需要钉数值”的内容。

> **2026-07-20 lulu revision：全部 token 已按 HTML authority (`NagisHeart_UI_Authority_XoXo_v1_0.html`) 视觉确认版对齐。**  
> 色系从暖象牙 `#F4F1EA` 统一为冷雪白 `#F7F9FC`；浮层/弹窗/长旁白的透明度、间距、边框、阴影全部以 HTML 实际 CSS 值为准。  
> 旧 section 之间的内部矛盾已在本次修订中解决：新 section 覆盖旧 section 的，旧 section 已标注废止。  
> 开发以本文件为唯一 token 来源，不再参考旧 handoff 或聊天口径。

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

暗层规则（2026-07-21 PM 真机校验修订 — 系统级页面增加径向暗角 + 提升整体暗度）：

- 开屏页：**不叠暗层**
- 系统级页面（主页 / 存档 / 章节目录 / 回忆画廊 / 系统设置）：
  - 第一层（垂直渐变）：`linear-gradient(to bottom, rgba(19, 32, 51, 0.52), rgba(19, 32, 51, 0.34) 42%, rgba(19, 32, 51, 0.78))`
  - 第二层（径向暗角 — 四周暗中间亮）：`radial-gradient(ellipse at 50% 38%, transparent 0 18%, rgba(19, 32, 51, 0.38) 62%, rgba(19, 32, 51, 0.72) 100%)`
  - 第三层（白色呼吸高光）：`linear-gradient(to bottom, rgba(255, 255, 255, 0.04), transparent 18%, transparent 70%, rgba(255, 255, 255, 0.02))`
- 开场白 / 名字设置页（splash 类）：
  - 第一层：`linear-gradient(to bottom, rgba(16, 24, 39, 0.04), rgba(16, 24, 39, 0.12) 38%, rgba(16, 24, 39, 0.86) 100%)`
  - 第二层（径向暗角）：`radial-gradient(ellipse at 46% 34%, transparent 0 22%, rgba(16, 24, 39, 0.34) 72%, rgba(16, 24, 39, 0.7) 100%)`
- 剧情内页（story 类）：
  - 第一层：`linear-gradient(to bottom, rgba(19, 32, 51, 0.22), rgba(19, 32, 51, 0.10) 24%, rgba(19, 32, 51, 0.18) 58%, rgba(19, 32, 51, 0.42) 100%)`
  - 第二层（左右暗边）：`linear-gradient(to right, rgba(19, 32, 51, 0.10), transparent 34%, transparent 72%, rgba(19, 32, 51, 0.12))`

浮层统一：

- 浮层底色：`linear-gradient(to bottom, rgba(16, 24, 39, 0.34), rgba(16, 24, 39, 0.52))`
- 浮层描边：`rgba(255, 255, 255, 0.10)`，1dp
- 浮层模糊：`16dp`，`saturate(0.92)`

统一文字色：

- 主文字：`#F7F9FC`
- 次文字：`rgba(232, 238, 246, 0.72)`
- 弱文字：`#C9D1DC`
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
- 叠 splash 暗层（见 §1 暗层规则 — splash 类）：
  - 第一层：`linear-gradient(to bottom, rgba(16, 24, 39, 0.04), rgba(16, 24, 39, 0.12) 38%, rgba(16, 24, 39, 0.86) 100%)`
  - 第二层：`radial-gradient(ellipse at 46% 34%, transparent 0 22%, rgba(16, 24, 39, 0.34) 72%, rgba(16, 24, 39, 0.7) 100%)`

结构：

- 上方小标题
- 中间一句正文
- 下方”轻触继续”

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
- 字号：`28sp`
- 行高：`1.68`
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
- 叠 splash 暗层（见 §1 暗层规则 — splash 类）：
  - 第一层：`linear-gradient(to bottom, rgba(16, 24, 39, 0.04), rgba(16, 24, 39, 0.12) 38%, rgba(16, 24, 39, 0.86) 100%)`
  - 第二层：`radial-gradient(ellipse at 46% 34%, transparent 0 22%, rgba(16, 24, 39, 0.34) 72%, rgba(16, 24, 39, 0.7) 100%)`

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
- 颜色：`#F7F9FC`
- 对齐：居中

副标题：

- 字体：`Noto Sans SC`
- 字号：`15sp`
- 颜色：`rgba(232, 238, 246, 0.72)`
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

- 颜色：`rgba(244, 241, 234, 0.66)`

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
- 叠系统级暗层（见 §1 暗层规则 — 系统级页面）

标题：

- 使用与开屏页相同的 TT 标题切图
- 位置同开屏页标题 tight：
  - `x=57, y=62, width=946, height=338`

底部布局（按 authority `.home-actions` / `.home-main` / `.home-sub` 对齐）：

- 整体 gap：`18dp`
- 左右外边距：`28dp`
- 底部外边距：`32dp`

主操作区（home-main）：

- 结构：两列 grid，左侧操作名，右侧说明文字
- 行间 gap：`18dp`
- 主操作文字（strong）：`17sp`，font-weight `500`，颜色 `#F7F9FC`
- 主操作说明（span）：`13sp`，颜色 `rgba(244, 241, 234, 0.82)`

次操作栏（home-sub）：

- 结构：4 列 grid
- gap：`8dp`
- 上方分割线：`rgba(255, 255, 255, 0.08)`，padding-top `16dp`
- 字号：`12sp`
- 颜色：`rgba(244, 241, 234, 0.90)`
- 对齐：居中

---

## 6. 剧情内页总规范

本轮主题规则：

- 默认使用 `dark`
- 只有 mapping 明确标注 `light` 时才切 `light`
- 本轮不做 `auto`

### 6.1 dark 方案

- 主文字：`#F7F9FC`
- 次文字：`rgba(232, 238, 246, 0.74)`
- 弱文字：`#C9D1DC`
- 强调金：`#D7BE86`
- HUD 衬底：`linear-gradient(to bottom, rgba(15, 24, 39, 0.34), rgba(15, 24, 39, 0.22))`
- HUD 描边：`rgba(255, 255, 255, 0.12)`
- HUD 模糊：`12dp`
- 弹窗遮罩：`rgba(9, 14, 24, 0.40)`
- 浮层底色：`linear-gradient(to bottom, rgba(16, 24, 39, 0.34), rgba(16, 24, 39, 0.52))`
- 浮层描边：`rgba(255, 255, 255, 0.08)`

### 6.2 light 方案

- 主文字：`#1B2430`
- 次文字：`rgba(27, 36, 48, 0.62)`
- 弱文字：`rgba(27, 36, 48, 0.42)`
- 强调金：`#B89B62`
- HUD 衬底：`rgba(27, 36, 48, 0.12)`
- HUD 描边：`rgba(27, 36, 48, 0.10)`
- 浮层底色：`rgba(247, 249, 252, 0.22)`
- 浮层描边：`rgba(27, 36, 48, 0.08)`

---

## 7. 导航栏统一规范

适用：所有剧情内页

图标按钮：

- 容器尺寸：`36 x 36`
- 图标尺寸：`18 x 18`，居中
- 衬底：`linear-gradient(to bottom, rgba(15, 24, 39, 0.34), rgba(15, 24, 39, 0.22))` + 中心极轻高光 `radial-gradient(rgba(247, 249, 252, 0.08), transparent 66%)`
- 描边：`rgba(255, 255, 255, 0.12)`
- 模糊：`12dp`，`saturate(0.92)`
- 裁切：`cut-sm`
- 图标颜色：`rgba(247, 249, 252, 0.94)`
- 图标 shadow：`drop-shadow(0 1dp 2dp rgba(0,0,0,0.64))` + `drop-shadow(0 0 8dp rgba(247,249,252,0.20))`
- 容器 shadow：`drop-shadow(0 3dp 12dp rgba(0,0,0,0.42))`

标题 chip：

- 高度：`34`
- padding：上 `7`，右 `14`，下 `7`，左 `18`
- 最大宽度：`210dp`，超长单行省略
- 字体：`Noto Sans SC Medium`
- 字号：`13sp`
- letter-spacing：`0.02em`
- 颜色：`rgba(244, 241, 234, 0.88)`
- text-shadow：`0 2dp 14dp rgba(0,0,0,0.48)`
- 衬底（双层叠加）：
  - 第一层：`linear-gradient(to right, rgba(15, 24, 39, 0.30), rgba(15, 24, 39, 0.12) 78%)`（注意方向是 to right，不是 to bottom）
  - 第二层（中心装饰横线）：`linear-gradient(to bottom, transparent 0 46%, var(--hud-soft) 47% 53%, transparent 54%)`
  - `--hud-soft` dark：`rgba(247, 249, 252, 0.12)`；light：`rgba(27, 36, 48, 0.12)`
- 描边：`rgba(255, 255, 255, 0.12)`
- 模糊：`12dp`
- 裁切：`cut-sm`

图标间距：

- 左组：back icon + title chip，gap `8dp`
- 右组：auto / save / backlog or menu icons，gap `8dp`

原则：

- 顶栏整体保持 v2 那套轻玻璃语言
- 不允许再做成厚重切角硬按钮排排站

---

## 8. 底部对白规范（对白 + 短旁白）

### 8.1 对白页

- 显示角色名
- 角色名（speaker chip）：
  - 字体：`Noto Sans SC Medium`
  - 字号：`13sp`
  - font-weight：`600`
  - letter-spacing：`0.04em`
  - 颜色：`#E4CA8F`
  - 轻衬底：`linear-gradient(to right, rgba(16, 24, 39, 0.30), rgba(16, 24, 39, 0.10))`
  - 描边：`rgba(215, 190, 134, 0.18)`，1dp
  - 模糊：`blur(8dp) saturate(0.92)`
  - 裁切：`cut-sm`
  - padding：left/right `9`，上 `3`，下 `4`
  - text-shadow：`0 1dp 2dp rgba(0,0,0,0.72)` + `0 0 10dp rgba(215,190,134,0.20)`

- 正文：
  - 字体：`Noto Sans SC`
  - 字号：`17sp`
  - 行高：`1.9`（约 32sp）
  - 颜色：`rgba(247, 249, 252, 0.94)`
  - 对齐：左对齐

### 8.2 短旁白页

- 不显示角色名
- 不显示”旁白”标签
- 正文：
  - 字体：`Noto Serif SC` 或 `Source Han Serif SC`
  - 字号：`17sp`
  - 行高：`1.9`
  - 颜色：`rgba(247, 249, 252, 0.94)`
  - 对齐：左对齐

底部承载层（dialogue-box）：

- 不做厚重纯色大框
- 使用轻玻璃渐变衬底
- 衬底：`linear-gradient(to bottom, rgba(16, 24, 39, 0.54), rgba(16, 24, 39, 0.70))`
- 描边：`rgba(255, 255, 255, 0.08)`，1dp
- 模糊：`16dp`
- 裁切：`cut-md`
- shadow：`0 18dp 40dp rgba(0,0,0,0.26)`
- 外边距：left/right `18`，bottom `34`
- 内边距：上 `18`，左右 `20`，下 `22`

---

## 9. 长旁白展示规范

方案：

- 不做整页毛玻璃
- 使用“居中阅读框”
- 阅读框必须符合 v2 轻玻璃语言
- 不允许出现厚重白框 / 厚重黑方框 / 明显后台卡片感

1080 x 1920 基准数值：

- 左右外边距：`18`（与 dialogue-box 外边距一致）
- 内边距：左右 `20`（与 dialogue-box 正文内边距一致）
- 正文宽度公式：`screenWidth - 18*2 - 20*2 = screenWidth - 76dp`
- 背景：`radial-gradient(ellipse at center, rgba(16, 24, 39, 0.44) 0%, rgba(16, 24, 39, 0.32) 58%, rgba(16, 24, 39, 0) 100%)`
- 背景 mask：`radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.94) 56%, rgba(0,0,0,0) 100%)`
- 模糊：`16dp`（narration-backdrop 层）
- 不使用矩形显式描边

高度规范：

- 最小高度：`280`
- 推荐高度：`360 ~ 520`
- 最大高度：`760`

位置规范：

- 默认垂直居中
- 顶部不得高于 `y=320`
- 底部不得低于 `y=1510`
- 底部”轻触继续”预留区至少 `120`

自适应规则：

1. 内容少：高度自适应，但不小于 `280`
2. 内容多：高度增长到最大 `760`
3. 超过 `760`：直接分页 / 分段，不继续拉长
4. 不允许顶到 HUD，不允许压到底部提示

文字：

- 字体：`Noto Serif SC` 或 `Source Han Serif SC`
- 字号：`16sp`
- 行高：`1.88`（约 30sp）
- 颜色：`rgba(244, 241, 234, 0.92)`
- 段间距：`24`
- text-shadow：`0 1dp 8dp rgba(10, 15, 25, 0.18)`
- 对齐：左对齐

---

## 10. 剧情回顾页面规范

背景：

- 使用当前剧情 bg
- 叠暗层：`rgba(19, 32, 51, 0.58)`

正文区：

- 叠暗层：`rgba(19, 32, 51, 0.58)`
- 若背景太花，可加极轻衬底：
  - `rgba(27, 36, 54, 0.18)`

字体：

- 标题：`Noto Serif SC` / `Source Han Serif SC`，`24sp`，`rgba(244, 241, 234, 0.92)`
- 正文：`Noto Serif SC` / `Source Han Serif SC`，`16sp`，`rgba(244, 241, 234, 0.92)`
- 行高：`1.92`
- text-shadow：`0 1dp 8dp rgba(10, 15, 25, 0.18)`
- 次信息：`Noto Sans SC`，`12sp`，`rgba(232, 238, 246, 0.72)`

---

## 11. 弹窗规范

原则：

- 必须符合 v2 轻玻璃风格
- 禁止纯白实底大方框
- 禁止系统原生默认弹窗样式

推荐实现（默认 dark，Android no-real-blur fallback）：

- 弹窗底：`linear-gradient(to bottom, rgba(27, 36, 54, 0.56), rgba(20, 31, 49, 0.52))`
- inner highlight：`linear-gradient(to bottom, rgba(247, 249, 252, 0.05), transparent 36%)`（`::before` 伪元素）
- 描边：`rgba(255, 255, 255, 0.08)`
- 模糊：`blur(0)`（HTML 展示为 no-blur fallback；若平台支持真 blur 可用 `16dp`）
- 裁切：`cut-md`（CutCornerShape 14dp）
- 遮罩（scrim）：`rgba(9, 14, 24, 0.40)`
- shadow：`0 18dp 42dp rgba(0,0,0,0.36)`

1080 x 1920 基准：

- 左右边距：`28`
- 最小高度：`260`
- 上下居中

内边距：

- 上 `22`
- 左右 `22`
- 下 `18`

标题：

- 字体：`Noto Serif SC` / `Source Han Serif SC`
- 字号：`28sp`
- font-weight：`400`
- 颜色：`rgba(247, 249, 252, 0.96)`

正文：

- 字体：`Noto Sans SC`
- 字号：`16sp`
- 行高：`1.9`
- 颜色：`rgba(244, 241, 234, 0.88)`

按钮：

- 文字按钮，不加厚重按钮底
- 默认：`rgba(244, 241, 234, 0.74)`
- 强调：`#F7F9FC`
- 字号：`15sp`
- 底部右对齐
- 按钮间距：`24`

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
- 背景：`radial-gradient(ellipse at 36% 42%, rgba(247,249,252,0.09), transparent 64%)` + `linear-gradient(to right, rgba(16,24,39,0.30), rgba(16,24,39,0.14) 62%, transparent)`。
- 描边：`rgba(255,255,255,0.08)`，1dp。
- 模糊：blur 10dp，saturation 0.92。
- opacity：`0.92`。
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
- 内边距：上 28，左右 24，下 22。
- 背景：`radial-gradient(ellipse at center, rgba(247,249,252,0.12), rgba(247,249,252,0.04) 30%, rgba(16,24,39,0.18) 72%, transparent)` + `linear-gradient(to bottom, rgba(27,36,54,0.34), rgba(27,36,54,0.24) 38%, rgba(27,36,54,0.36))`。
- 描边：`rgba(255,255,255,0.10)`，1dp。
- 模糊：blur 16dp，saturate(0.92)。
- 裁切：final UI cut-md。
- Label：`CHAPTER CLEAR`，Noto Sans SC，11sp，letter-spacing 0.14em，颜色 `#D7BE86`，text-transform uppercase。
- 标题：章节名，例如 `第一部 · 原作前置篇`；Noto Serif SC / Source Han Serif SC，30sp，font-weight 400，line-height 1.25，最多两行。
- Body：13sp，line-height 1.8，颜色 `rgba(247,249,252,0.78)`；文案表达”本章完成，可返回目录或继续下一章”。
- 主容器 text-shadow：`0 2dp 20dp rgba(0,0,0,0.54)`。
- 主容器 color：`rgba(247,249,252,0.94)`。
- Actions：底部左右分布（flex, space-between, gap 18）；左侧 `返回目录` 常规文本，右侧 `进入第二部` / `继续下一章` 强调文本；14sp，右侧颜色 `#F7F9FC` font-weight 500，左侧 `rgba(244,241,234,0.86)`。

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
  - 主体：`linear-gradient(to bottom, rgba(15, 24, 39, 0.34), rgba(15, 24, 39, 0.22))`。
  - 中心极轻高光：`radial-gradient(ellipse at center, rgba(247, 249, 252, 0.08), transparent 66%)`。
- 描边：`rgba(255, 255, 255, 0.12)`，1dp。
- 模糊：blur 12dp，saturate(0.92)。
- 裁切：`cut-sm`。
- 图标颜色：`rgba(247, 249, 252, 0.94)`。
- 图标 shadow / halo：
  - dark shadow：`drop-shadow(0 1dp 2dp rgba(0,0,0,0.64))`；
  - soft light halo：`drop-shadow(0 0 8dp rgba(247,249,252,0.20))`。
- 容器外层：`filter: drop-shadow(0 3dp 12dp rgba(0,0,0,0.42))`。

Android 若无法对每个 HUD 元素使用真实 blur：

- 使用半透明深色渐变 + 1dp 描边 + shadow 作为 fallback。
- 不要改成实心黑按钮、纯白按钮或 Material 默认按钮。

#### Title chip

沿用 section 14 的 final glass HUD 规则，但需要和 icon button 同源：

- 高度：34。
- padding：`7 14 7 18`。
- 最大宽度：约 210dp，超长章节名单行省略。
- 背景：`linear-gradient(to right, rgba(15, 24, 39, 0.30), rgba(15, 24, 39, 0.12) 78%)`。
- 描边：`rgba(255, 255, 255, 0.12)`。
- 模糊：blur 12dp；无 blur 时同 icon fallback。
- 字体：Noto Sans SC Medium，13sp，letter-spacing 0.02em。
- 文本颜色：`rgba(244, 241, 234, 0.88)`。

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

- 文本颜色：`#E4CA8F`。
- 字体：Noto Sans SC Medium，13sp，letter-spacing 0.04em，font-weight 600。
- 轻衬底：只包住 speaker/name 文本，不扩大成整行卡片。
  - padding：left/right 9，上 3，下 4。
  - 背景：`linear-gradient(to right, rgba(16, 24, 39, 0.30), rgba(16, 24, 39, 0.10))`。
  - 描边：`rgba(215, 190, 134, 0.18)`，1dp。
  - 模糊：blur 8dp，saturate(0.92)。
  - 裁切：cut-sm。
- 文本 shadow / halo：
  - `0 1dp 2dp rgba(0,0,0,0.72)`；
  - `0 0 10dp rgba(215,190,134,0.20)`。

> 以上 token 与 HTML authority 中 `.speaker` 完全对齐。

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
- 主容器背景：`linear-gradient(to bottom, rgba(16, 24, 39, 0.34), rgba(16, 24, 39, 0.52))`。
- 描边：`rgba(255, 255, 255, 0.10)`，1dp。
- Blur：`16dp`，`saturate(0.92)`；无真实 blur 时用该背景色与描边直接 fallback。
- Shape：`cut-md`。
- Padding：`18`。
- 三段式布局：`grid-template-rows: auto 1fr auto`，gap `14`。
- 布局：标题区 / 列表区 / 底部动作区三段式。

标题区：

- 标题：`章节目录`，沿用 `.page-title`，Noto Serif SC / Source Han Serif SC，28sp，font-weight 400。
- 说明文：Noto Sans SC，12sp，line-height 1.7，颜色 `rgba(244,241,234,0.70)`。

列表区：

- 列表项高度：min 68。
- 列表项 padding：left/right 14，top/bottom 13。
- 列表项结构：编号/锁定标记 + 文案 + 状态。
- 列表项背景：`rgba(255, 255, 255, 0.045)`，描边 `rgba(255, 255, 255, 0.07)`，shape `cut-sm`，gap `12`。
- 当前项：背景 `linear-gradient(to right, rgba(215, 190, 134, 0.18), rgba(255, 255, 255, 0.04))`，描边 `rgba(215, 190, 134, 0.28)`。
- 锁定项：整体 opacity 0.52，不新增复杂锁图系统；可用文字 `锁` 或 existing `ic_lock`。

文案：

- 章节标题：Noto Sans SC Medium，15sp，font-weight 500，颜色 `rgba(247, 249, 252, 0.94)`，单行 ellipsis。
- 小节 / 进度副文：12sp，颜色 `rgba(244, 241, 234, 0.64)`，单行 ellipsis。
- 状态文字：12sp，右对齐，普通 `rgba(244, 241, 234, 0.70)`，当前项用 gold `#D7BE86`。
- 编号标记：34x34dp，`cut-sm`，bg `rgba(15, 24, 39, 0.26)`，border `rgba(255, 255, 255, 0.10)`，当前项 gold border `rgba(215, 190, 134, 0.34)`。

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

- 左侧：`返回主页` 或 `返回`，普通文本，颜色 `rgba(244, 241, 234, 0.82)`。
- 右侧：`继续当前章节`，强调文本，颜色 `#F7F9FC`，font-weight 500。
- 字体：14sp。
- 顶部边线：`rgba(255, 255, 255, 0.08)`，padding-top `10`，gap `16`。
- 布局：flex，space-between。
- 不做厚按钮，不做系统默认按钮。

### 16.5 Dialog Android fallback hardening

本节收紧 section 11 的 Android fallback。设计方向仍是 final light glass dialog；但当 Android / Compose 无法做真实 frosted background blur 时，必须使用固定 fallback token，不允许开发凭感觉继续调 alpha。

#### Preferred token with true background blur

> 本节已被 section 17.3 覆盖。以下 token 已按 HTML authority 对齐更新。

沿用 section 11 更新后的值：

- Dialog card background：`rgba(27,36,54,0.32)` + blur 16dp。
- Border：`rgba(255,255,255,0.08)`，1dp。
- Scrim：`rgba(9,14,24,0.40)`。
- Shape：`cut-md`（CutCornerShape 14dp）。

#### Android no-real-blur fallback token

当无法模糊弹窗背后的游戏画面时，使用以下固定 token：

- Dialog card background：`linear-gradient(to bottom, rgba(27,36,54,0.56), rgba(20,31,49,0.52))`。
- 允许微调范围：card 0.52 ~ 0.60。不得低于 0.52，不得高于 0.64。
- Scrim：`rgba(9,14,24,0.40)`。
- 允许微调范围：0.38 ~ 0.42。
- Border：`rgba(255,255,255,0.08)`，1dp。
- Inner highlight：`linear-gradient(to bottom, rgba(247,249,252,0.05), transparent 36%)`，via `::before` 伪元素，必须保留。
- Shadow：`0 18dp 42dp rgba(0,0,0,0.36)`。
- Text shadow：标题和正文可使用 `0 1dp 2dp rgba(0,0,0,0.35)`，但不得模糊文字本身。
- Shape：`cut-md`（CutCornerShape 14dp）。
- Padding：上 22 / 左右 22 / 下 18（已更新，不再使用旧规范 40/32/28）。
- Typography / actions 沿用 section 11 更新后的值。

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
| Dialogue bottom box | `cut-md` | `linear-gradient(to bottom, rgba(16,24,39,0.54), rgba(16,24,39,0.70))` | `rgba(255,255,255,0.08)` 1dp | card shadow `0 18dp 40dp rgba(0,0,0,0.26)`；文本轻 shadow；blur 16dp | 无 blur 时保持同 alpha，不降到 0.46 以下；必须保留 border + shadow | 裸文字；厚黑整条；纯系统圆角卡片 |
| Speaker / name | `cut-sm`，只包住姓名文本 | `rgba(16,24,39,0.30) -> rgba(16,24,39,0.10)` | gold `rgba(215,190,134,0.18)` 1dp | text shadow `0 1dp 2dp rgba(0,0,0,0.72)` + gold halo `0 0 10dp rgba(215,190,134,0.20)` | 无 blur 时仍保留半透明底、gold border、shadow/halo | 改成白字；整条 name plate；厚黑姓名底 |
| Chapter opening text group | `cut-md` | `radial-gradient(ellipse at 36% 42%, rgba(247,249,252,0.09), transparent 64%)` + `linear-gradient(to right, rgba(16,24,39,0.30), rgba(16,24,39,0.14) 62%, transparent)`；整体 opacity 0.92 | `rgba(255,255,255,0.08)` 1dp | blur 10dp saturate(0.92)；text-shadow `0 2dp 22dp rgba(0,0,0,0.72)` | 无 blur 时 alpha 不得低于 0.30；可加强 text-shadow，不可取消托底 | 标题裸压背景；大弹窗；实心黑/白底 |
| Chapter Clear card | `cut-md` | `radial-gradient(ellipse at center, rgba(247,249,252,0.12), rgba(247,249,252,0.04) 30%, rgba(16,24,39,0.18) 72%, transparent)` + `linear-gradient(to bottom, rgba(27,36,54,0.34), rgba(27,36,54,0.24) 38%, rgba(27,36,54,0.36))` | `rgba(255,255,255,0.10)` 1dp | blur 16dp saturate(0.92)；text-shadow `0 2dp 20dp rgba(0,0,0,0.54)` | 无 blur 时 card 主体保持 0.34/0.36，不能回到 0.20/0.24 的弱托底 | 普通弹窗；厚按钮页；Section Clear 复用为当前范围 |
| Backlog / recap panel | system dark glass | page overlay `rgba(19,32,51,0.58)` | 沿用 system panel token | text shadow `0 1dp 8dp rgba(10,15,25,0.18)` | 无 blur 时保持 0.58 overlay，优先分页避免裁切 | 固定 8 条导致裁切；裸白文字压图 |
| Ending page card | `cut-md` | `radial-gradient(ellipse at 70% 0%, rgba(215,190,134,0.16), transparent 38%)` + `linear-gradient(to bottom, rgba(16,24,39,0.50), rgba(16,24,39,0.76))`；blur 18dp | `rgba(255,255,255,0.10)` 1dp | `0 22dp 54dp rgba(0,0,0,0.34)` | 无 blur 时 card 不低于 0.56 下缘 0.76；action 使用轻 glass cell `cut-sm` | 章节结束页替代结局页；厚系统按钮；自动继续故事 |

### 17.2 HUD / nav / action chip developer-readable token

HUD 全家族必须同源：title chip、icon button、skip/action chip 都有轻玻璃 backing。不得出现 title 有底、icon 裸白的断裂状态。

| 组件 | Size / safe area | Shape | Alpha / background | Border | Shadow / icon halo | Android component target | 验收截图点 |
|---|---|---|---|---|---|---|---|
| HUD icon button | 36x36dp；icon 18x18dp；top 14dp；left/right 17dp；group gap 8dp | `cut-sm` / Compose `CutCornerShape(8dp)` | `radial-gradient(ellipse at center, rgba(247,249,252,0.08), transparent 66%)` + `linear-gradient(to bottom, rgba(15,24,39,0.34), rgba(15,24,39,0.22))` | `rgba(255,255,255,0.12)` 1dp | container `drop-shadow(0 3dp 12dp rgba(0,0,0,0.42))`；icon `rgba(247,249,252,0.94)` + `drop-shadow(0 1dp 2dp rgba(0,0,0,0.64))` + `drop-shadow(0 0 8dp rgba(247,249,252,0.20))`；blur `12dp saturate(0.92)` | `NagiIconButton` / `NagiHud` icon slots | 亮背景、复杂背景各截一张：back/auto/save/menu/backlog 不能裸白漂浮 |
| HUD title chip | height 34dp；padding `7 14 7 18`dp；max-width 210dp；single-line ellipsis | `cut-sm` | 双层叠加：①`linear-gradient(to right, rgba(15,24,39,0.30), rgba(15,24,39,0.12) 78%)` ②中心装饰横线 `linear-gradient(to bottom, transparent 0 46%, rgba(247,249,252,0.12) 47% 53%, transparent 54%)`；blur 12dp | `rgba(255,255,255,0.12)` 1dp | 全局 HUD text-shadow `0 2dp 14dp rgba(0,0,0,0.48)`；font 13sp Noto Sans SC Medium；color `rgba(244,241,234,0.88)` | `NagiHud` title composable | 与 icon 同一视觉家族；长标题省略，不挤压右侧 icon；中心横线不可省略 |
| Skip / action chip | height 34dp；right 18dp；top 76dp 或 HUD 下方 14~18dp；padding `0 14`dp | `cut-sm` | `linear-gradient(to bottom, rgba(15,24,39,0.30), rgba(15,24,39,0.18))`；blur 12dp | `rgba(255,255,255,0.12)` 1dp | `drop-shadow(0 3dp 12dp rgba(0,0,0,0.42))`；font 12sp；color `rgba(244,241,234,0.90)` | skip section / next chapter / continue action chip | “跳过本节”在亮图上仍清晰，但不能像厚按钮 |

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
| Shape | `cut-md`（clip-path） | Compose `CutCornerShape(14dp)`；如确实无法切角，必须回 UI/PM 复核后才能使用圆角 | 不得默认 `RoundedCornerShape(24dp)` + 高 alpha border |
| Card background | `rgba(27,36,54,0.32)` + blur 16dp | `linear-gradient(to bottom, rgba(27,36,54,0.56), rgba(20,31,49,0.52))` + `blur(0) saturate(0.92)` | card 不低于 0.52；不高于 0.64 |
| Scrim | `rgba(9,14,24,0.32)` | `rgba(9,14,24,0.40)` | 允许 0.38~0.42；超出回 PM/UI |
| Border | `rgba(255,255,255,0.10)` | `rgba(255,255,255,0.08)` 1dp | 不得高于 0.10，避免线框感 |
| Inner highlight | `linear-gradient(to bottom, rgba(247,249,252,0.05), transparent 36%)` via `::before` | 必须保留，用来替代硬边框的”玻璃边缘” | 不得用纯描边承担全部轮廓 |
| Shadow | `0 18dp 42dp rgba(0,0,0,0.32)` | `0 18dp 42dp rgba(0,0,0,0.36)` | 不得取消 shadow |
| Padding | top 22 / left-right 22 / bottom 18 | 同 preferred | 不得使用旧规范 40/32/28 |
| Text | title `rgba(247,249,252,0.96)` 28sp；body `rgba(244,241,234,0.88)` 16sp line-height 1.9 | title/body 可加 `0 1dp 2dp rgba(0,0,0,0.35)` | 不得模糊文字本身 |
| Buttons | default `rgba(244,241,234,0.74)` 15sp；emphasis `#F7F9FC` font-weight 500；gap 24；右对齐 | 同 preferred | 不得使用旧规范 gap 26 或旧颜色 |

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
| 背景 | `radial-gradient(ellipse at center, rgba(16,24,39,0.44) 0%, rgba(16,24,39,0.32) 58%, rgba(16,24,39,0) 100%)`；mask `radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.94) 56%, rgba(0,0,0,0) 100%)`；blur 16dp；无 blur 时保持相同 alpha |
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

Status feedback token（与 HTML `.ending-unlock` 对齐）：

- font-size: `11px`；
- letter-spacing: `0.02em`；
- color: `rgba(244, 241, 234, 0.70)`；
- display: `inline-flex`，align-items center，gap `7`；
- gold status dot: `5dp` 圆形，bg `rgba(215, 190, 134, 0.72)`，box-shadow `0 0 8dp rgba(215,190,134,0.18)`；
- width = `fit-content`，not full-width；
- no border；no rectangular fill；no `cut-sm` action shape；
- margin-top `14dp`，then primary action margin-top `22dp`。

Primary action token（与 HTML `.ending-action.primary` 对齐）：

- min-height: `38dp`；
- color: `#F7F9FC`；
- background: `linear-gradient(to right, rgba(215,190,134,0.20), rgba(255,255,255,0.07))`；
- border: `1dp solid rgba(215,190,134,0.26)`；
- clip-path: `cut-sm`；
- font-size: `13sp`；
- display: grid, place-items center。

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

Blocked rule：如果 PP 发现 Home 普通继续态与 ending-complete 后新运行态在当前代码里无法区分，必须 blocked 回 PM / product；不得用”继续故事”临时代替 after-ending Home。

---

## 19. 选项层规范（ChoiceLayer）

来源：2026-07-20 lulu 全量核对补齐。按 HTML authority `.choice-list` / `.choice-row` / `.choice-copy` 对齐。

### 19.1 选项列表容器

- 位置：底部对齐，left/right `18dp`，bottom `34dp`
- 列表 gap：`10dp`
- z-index：同 dialogue-box（z=4）

### 19.2 选项行（choice-row）

- padding：上下 `14dp`，左右 `16dp`
- 背景：`rgba(16, 24, 39, 0.48)`
- 模糊：blur `12dp`
- 裁切：`cut-sm`
- 内部 gap：`6dp`

### 19.3 当前选中项（choice-row.current）

- 背景：`rgba(191, 160, 138, 0.18)`

### 19.4 选项标签（choice-tag）

- 颜色：`#D7BE86`（gold）
- 字号：`12sp`
- letter-spacing：`0.06em`

### 19.5 选项文字（choice-copy）

- 颜色：`rgba(247, 249, 252, 0.92)`
- 字号：`15sp`
- 行高：`1.8`（= 27sp）

### 19.6 禁止样式

- 不做横向渐变背景（应为单色半透明）
- 不做五角标记装饰
- 不使用居中偏上布局（应为底部对齐，与 dialogue-box 位置一致）

---

## 20. LINE 聊天层规范（LineChatLayer）

来源：2026-07-20 lulu 全量核对补齐。按 HTML authority `.soft-screen` / `.bubble` 对齐。

### 20.1 聊天容器（soft-screen）

- 位置：left/right `18dp`，top `84dp`，bottom `34dp`
- padding：`18dp`
- 背景：`linear-gradient(to bottom, rgba(16, 24, 39, 0.34), rgba(16, 24, 39, 0.52))`
- 模糊：blur `16dp`
- 裁切：`cut-md`
- 聊天容器必须有明确的玻璃面板，不能裸 LazyColumn 直接压背景

### 20.2 气泡（bubble）

- 最大宽度：`86%`
- padding：上下 `12dp`，左右 `14dp`
- 背景：`rgba(255, 255, 255, 0.08)`
- 裁切：`cut-sm`（不是 RoundedCornerShape）
- 字号：`14sp`
- 行高：`1.7`（= 23.8sp）
- 文字颜色：`rgba(247, 249, 252, 0.92)`

### 20.3 玩家气泡（bubble.me）

- 背景：`rgba(215, 190, 134, 0.18)`
- 右对齐

### 20.4 时间戳 / 已读

- 颜色：`rgba(247, 249, 252, 0.56)`
- 字号：`12sp`
- 对齐：居中

### 20.5 禁止样式

- 不使用 RoundedCornerShape（必须 cut-sm）
- 不使用 17sp dialogue 字号（LINE 气泡是 14sp）
- 不使用 roseGold 0.15 作为玩家气泡色（应为 gold 0.18）
- 不使用 glassBgSoft 作为 NPC 气泡色（应为 white 0.08）

---

## 22. 存档页 / 系统设置页行项规范

来源：2026-07-21 PM 真机校验 — 行背景 4% 白色几乎不可见，文字直接压在海报上无法辨认。

适用页面：SaveLoadScreen、SettingsScreen。

### 22.1 行项背景

旧值（废止）：`rgba(255, 255, 255, 0.04)` — 太淡，真机上完全看不出。

新值：
- 背景：`linear-gradient(to bottom, rgba(16, 24, 39, 0.38), rgba(16, 24, 39, 0.52))`
- 描边：`rgba(255, 255, 255, 0.08)`，1dp
- 裁切：`cut-sm`

与浮层统一 token 对齐（§1 浮层统一底色 0.34→0.52），行项略微偏暗以保证单行文字在背景图上的可读性。

### 22.2 其他行项 token 不变

- 行高度：min 56dp
- padding：start 18, end 4, top 10, bottom 10
- 文字色：textPrimary / textSecondary（沿用 NagiTheme）

---

## 21. 2026-07-20 全量核对结果与待修复清单

来源：lulu 2026-07-20 全量核对 Android 实现 vs HTML authority `NagisHeart_UI_Authority_XoXo_v1_0.html`。
用途：PP 按本表逐项修复，每项修完在备注栏标 ✅。

### 21.1 已通过项（无需改动）

| # | 页面/组件 | Android 文件 | 核对结果 |
|---|---|---|---|
| 1 | NagiDialog | `NagiDialog.kt` | ✅ 今日 PP 已改，已通过 |
| 2 | NagiHud 中心横线 | `NagiHud.kt` | ✅ 今日 PP 已改，已通过 |
| 3 | LongNarrationLayer | `LongNarrationLayer.kt` | ✅ 今日 PP 已改，已通过 |
| 4 | BacklogScreen | `BacklogScreen.kt` | ✅ 今日 PP 已改，已通过 |
| 5 | SaveLoadScreen row bg | `SaveLoadScreen.kt` | ✅ 今日 PP 已改，已通过 |
| 6 | SettingsScreen row bg | `SettingsScreen.kt` | ✅ 今日 PP 已改，已通过 |
| 7 | NagiColors weakText | `NagiColors.kt` | ✅ 今日 PP 已改，已通过 |
| 8 | DialogueLayer | `DialogueLayer.kt` | ✅ 所有 token 与 authority 对齐 |
| 9 | NagiIconButton | `NagiIconButton.kt` | ✅ 尺寸/渐变/描边/shadow/halo 全部正确 |
| 10 | ChapterOpeningScreen | `ChapterOpeningScreen.kt` | ✅ 基本对齐，玻璃托底正确 |

### 21.2 需修复项

| # | 页面/组件 | Android 文件 | 严重度 | 问题摘要 | 正确 authority 值 | PP 备注 |
|---|---|---|---|---|---|---|
| 1 | 系统页面暗层 | `SystemPageBackground.kt` | ❌ | 使用平面 32% 遮罩 + 底部渐隐，缺少中间”呼吸”段和白色高光层 | 见 §1 暗层规则 — 系统级页面（3-stop 渐变 0.32→0.12@42%→0.66 + 白色高光层） | ✅ 已改为双层渐变 |
| 2 | 开场白暗层 | `PrologueScreen.kt` | ❌ | 使用平面 `Color(0x52132033)`，应为 splash 类多层渐变 + 径向暗角 | 见 §1 暗层规则 — splash 类 | ✅ 已改为 verticalGradient + radialGradient 暗角 |
| 3 | 名字设置暗层 | `NameSetupScreen.kt` | ❌ | 同上，使用平面遮罩 | 见 §1 暗层规则 — splash 类 | ✅ 同上 |
| 4 | 名字设置副标题色 | `NameSetupScreen.kt` | ⚠️ | `SubtitleColor = #D6D2CB` | 应为 `rgba(232, 238, 246, 0.72)` 即 `Color(0xB8E8EEF6)` | ✅ |
| 5 | 名字设置占位符色 | `NameSetupScreen.kt` | ⚠️ | `PlaceholderColor` alpha ≈ 0.58 | 应为 `rgba(244, 241, 234, 0.66)` 即 `Color(0xA8F4F1EA)` | ✅ |
| 6 | 主页主操作字号 | `StartScreen.kt` | ❌ | `buttonText` = 15sp | 应为 `17sp`，font-weight `500`，见 §5 | ✅ 17sp + FontWeight.Medium |
| 7 | 主页副文字字号 | `StartScreen.kt` | ⚠️ | `micro` = 11sp | 主操作说明应为 `13sp`，次操作栏应为 `12sp`，见 §5 | ✅ |
| 8 | 主页操作间距 | `StartScreen.kt` | ⚠️ | gap = 9dp | 应为 `18dp`，见 §5 | ✅ |
| 9 | 主页次操作栏颜色 | `StartScreen.kt` | ⚠️ | snowWhite * 0.84 | 应为 `rgba(244, 241, 234, 0.90)`，见 §5 | ✅ Color(0xE6F4F1EA) |
| 10 | 主页缺少分割线 | `StartScreen.kt` | ⚠️ | 主操作与次操作之间无分割线 | 应有 `border-top: 1dp solid rgba(255,255,255,0.08)`，padding-top `16dp` | ✅ drawBehind 分割线 |
| 11 | HUD 标题 chip 渐变方向 | `NagiHud.kt` | ⚠️ | 使用 `verticalGradient`（to bottom） | 应为 `to right`：`rgba(15,24,39,0.30) → rgba(15,24,39,0.12) 78%`，见 §7 | ✅ horizontalGradient |
| 12 | HUD 标题 chip text-shadow | `NagiHud.kt` | ⚠️ | offset(0,1) blur 2 alpha 0.45 | 应为 `0 2dp 14dp rgba(0,0,0,0.48)`，见 §7 | ✅ |
| 13 | HUD 图标组 gap | `NagiHud.kt` | ⚠️ | gap = 6dp | 应为 `8dp`，见 §7 | ✅ |
| 14 | 选项层布局 | `ChoiceLayer.kt` | ❌ MAJOR | 居中偏上布局 + 横向渐变 + 五角标记 | 应为底部对齐 left/right 18 bottom 34，单色半透明背景 rgba(16,24,39,0.48)，见 §19 | ✅ 完整重写 |
| 15 | 选项文字 alpha | `ChoiceLayer.kt` | ⚠️ | textPrimary = 1.0 alpha | 应为 `rgba(247,249,252,0.92)` 即 0.92 alpha，见 §19.5 | ✅ |
| 16 | 选项行高 | `ChoiceLayer.kt` | ⚠️ | choiceText line-height = 21sp | 应为 `1.8` = 27sp，见 §19.5 | ✅ NagiTypography 已改 |
| 17 | LINE 容器缺失 | `LineChatLayer.kt` | ❌ MAJOR | 无玻璃面板容器，LazyColumn 裸压背景 | 应有 soft-screen 容器，见 §20.1 | ✅ 完整重写 |
| 18 | LINE 气泡形状 | `LineChatLayer.kt` | ❌ | 使用 RoundedCornerShape | 应为 `cut-sm`，见 §20.2 | ✅ |
| 19 | LINE 气泡字号 | `LineChatLayer.kt` | ❌ | 使用 dialogue 17sp | 应为 `14sp`，见 §20.2 | ✅ |
| 20 | LINE 气泡颜色 | `LineChatLayer.kt` | ❌ | NPC: glassBgSoft rgba(27,36,54,0.20)；玩家: roseGold 0.15 | NPC 应为 `rgba(255,255,255,0.08)`；玩家应为 `rgba(215,190,134,0.18)`，见 §20.2/20.3 | ✅ |
| 21 | LINE 文字 alpha | `LineChatLayer.kt` | ⚠️ | textPrimary = 1.0 alpha | 应为 `rgba(247,249,252,0.92)` 即 0.92 alpha，见 §20.2 | ✅ |
| 22 | 小节开始页 | `SectionOpeningScreen.kt` | ❌ MAJOR | 纯深色背景，无 BG 图，无玻璃托底 | 应与 ChapterOpeningScreen 共用 story BG + 章节海报语言，位置 bottom=96，见 §14.1 | ⚠️ 死代码，活跃 SectionOpeningOverlay 已对齐 |
| 23 | 大章结束页 | `ChapterEndingScreen.kt` | ❌ MAJOR | 纯深色背景居中文字，无 clear-card | 应使用 story BG + clear-card 玻璃卡片，见 §14.2 | ⚠️ 死代码，活跃 ChapterEndingOverlay 已对齐 |
| 24 | 结局页 | `GameScreen.kt` EndingOverlay | ❌ MAJOR | 40% 平面遮罩 + 居中文字，无 ending-card | 应使用 ending 渐变遮罩 + ending-card 玻璃卡片，见 §18.1 | ✅ 完整重写 ending-card |
| 25 | 章节目录当前项背景 | `ChapterScreen.kt` | ⚠️ | 使用平面 gold 0.18 | 应为 `linear-gradient(to right, rgba(215,190,134,0.18), rgba(255,255,255,0.04))`，见 §16.2 | ✅ horizontalGradient |
| 26 | 章节目录底部动作 padding | `ChapterScreen.kt` | ⚠️ | padding-top = 14dp | 应为 `10dp`，见 §16.4 | ✅ |
| 27 | 章节目录左侧动作颜色 | `ChapterScreen.kt` | ⚠️ | 0xB3F4F1EA = 0.70 | 应为 `rgba(244,241,234,0.82)` 即 `Color(0xD1F4F1EA)`，见 §16.4 | ✅ |
| 28 | 章节目录右侧动作颜色 | `ChapterScreen.kt` | ⚠️ | 0xFFF7F9FC = 1.0 | 应为 `rgba(247,249,252,0.96)` 即 `Color(0xF5F7F9FC)`，见 §16.4 | ✅ |

### 21.3 PP 工作优先级建议

1. **P0 — 结构性缺失**（#22 #23 #24）：SectionOpening / ChapterEnding / Ending 三页完全没按 authority 做，需要重写
2. **P1 — 组件级重做**（#14 #17 #18 #19 #20）：ChoiceLayer 布局错误 + LineChatLayer 缺容器/错形状/错字号
3. **P1 — 暗层系统**（#1 #2 #3）：SystemPageBackground / PrologueScreen / NameSetupScreen 暗层从平面改为多层渐变
4. **P2 — Token 微调**（#4~13 #15 #16 #21 #25~28）：颜色/字号/间距/渐变方向等数值修正
