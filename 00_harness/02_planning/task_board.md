# 任务板

> **唯一正式任务源**（含优先级）。只有写进本文件、有负责人和状态的事项，才算正式任务。
> 条目写法见 `00_harness/roles/ROLE_PM.md`；协作规则见根目录 `CLAUDE.md`。
> 历史条目全文见 `task_board_archive_20260715_20260721.md`（两批归档）。**本板只留活跃条目 + 关闭台账**，保持精简——每个 worker 开工都要读它。

---

## 当前优先级

1. `TASK-20260727-003` Android 剧情地图对齐 v7 —— PP 开工
2. `TASK-20260727-004` 本地未提交杂项归属审计 —— Sai 只读，不阻塞 PP
3. `TASK-20260726-004` UI 体检脚本 —— 主循环的前置件，没有它 QA 只能人工复现，机器取证缺一块
4. `TASK-20260726-002` Web 系统页暗层（P0，一条修完解决一大片"看不见"）
5. `TASK-20260726-001` Android 剧情回顾排版重构（含分页，已并入 0721-002）
6. `TASK-20260726-003` Web 存档入口不可点
7. `TASK-20260721-008` ui-snapshot 可复现性返工

---

## 活跃任务

### TASK-20260727-003
- 标题：Android 剧情地图对齐 v7（首版实机整体走形修正）
- 负责人：PP（Android）
- 状态：review（2026-07-29 Codex 已完成本地实现与 Debug 构建，待 Ant 实机验收；push 受本机 GitHub 凭证阻塞）
- 优先级：P0
- 现象（Ant 实机 + lulu 对照）：剧情地图已能进入，但总览页、第四部、第八部与 v7 authority 走形严重；普通节点退化为卡片网格，连接路径缺失，第八部路线分列与文案不对，总览页不是单屏错落地图，长标题/页脚/子页页头均未按权威呈现。
- 范围：`android/app/src/main/java/com/antnagi/nagisheart/ui/screen/ChapterScreen.kt` + 可新增一份 Android 布局常量表（如 `StoryMapLayout.kt`）。**不碰 story-data、BG mapping、Web、TT Start、App Icon、资源删除；不把 `design/concepts/story_map_xoxo_v1/` 下 PNG/SVG 复制进 runtime；P2-1 背景暗层归 vignette 任务，不在本条重复。**
- 落地依据：**`authority/ui/XoXo_UI_Final_MinSpec_20260712.md` §27.1–§27.16**；参考图只作人工对照：`design/concepts/story_map_xoxo_v1/NagisHeart_StoryMap_Overview_v4.png` 与 `NagisHeart_StoryMap_Page_01..08_v7.png`，不得 runtime 加载。
- 目标范围：
  1. P0-1 普通小节节点去掉卡片底，只保留点/序号/标题的原生 UI；
  2. P0-2 补完整正交连接路径；
  3. P0-3 第八部 common 不作为第四列，01 是三线共同起点；
  4. P0-4 第八部路线标签用 `DREAM / STAY / BAD` authority 文案，不泄漏 raw scope；
  5. P0-5 总览页改为单屏错落八章地标与叙事关系，不是竖排列表；
  6. P1-1 已解锁长标题不得省略号截断；
  7. P1-2 页脚翻章条按权威重做；
  8. P1-3 子页页头补齐。
- 当前阻塞：
- 已解除：lulu 已提交 `ab38dcf` 补齐 MinSpec §27.8–§27.16、decision_log、MANIFEST 哈希与 xlsx 补账；PM 已核查 `tools/check-authority.ps1` PASSED 并 push。
- pre-flight 要求：PP 开工前必须 `git pull`，重读本条与 MinSpec §27；把此前 5 个 pre-flight 问题与 lulu 答复写入回报；确认 scope 后再实现。
- 完成定义：先做 pre-flight；实现后提交实现说明、文件清单、自检结果、build 结果、风险/未覆盖点。Android 后期不设 QA、不要求截图：PM 初查后转 Ant 实机验收。
- 最新更新时间：2026-07-27
- 2026-07-29 设计变更：Ant 查看恢复后的 v7 页面后明确反馈视觉不通过并要求重设计。旧 v7 PNG/SVG 像素对齐立即暂停，不得继续实施 P0-5 或转写 SVG 坐标。新方向见 HTML authority 的“地图总览 / 地图 01～08”原生页面与 MinSpec §27.17；当前仍是视觉复核稿，在 Ant 明确确认前 PP 不开工、不把 HTML CSS 数值转成 Android token。逻辑要求（64 独立节点、真实 BG、逐图对准 Nagi 脸、亮暗无剧透、第八章三路线）继续保留。决策记录：`DEC-20260729-001`。
- 2026-07-29 二次修正：圆形“记忆岛”方案作废。按 Ant 提供的 Android 截图，改为上下滚动、左右错落的切角半透玻璃章节块；HTML 已补完整八章及外侧 gutter 正交连接线，章内关键节点同步切角玻璃化。连接线使用小菱形接口，已读金色、未读蓝灰；禁止中央时间轴、曲线、箭头与霓虹。仍待 Ant 视觉确认，不恢复开发。决策记录：`DEC-20260729-002`。
- 2026-07-29 连接线再修正：外侧 gutter、菱形接口和斜线全部作废。按 Ant 红线标记改为卡片底边垂直下降 → 间隙中部水平折一次 → 垂直接入下一卡片顶边的三段简单折线，左右交替。决策记录：`DEC-20260729-003`。
- 2026-07-29 内页统一：Ant 已认可总览当前方向并要求继续完成内页。地图 01～07 改为上下错落的独立小节节点；关键剧情为切角玻璃图片窗，普通小节仍为轻量点/序号/标题；相邻节点使用同款三段简单折线，进入未读节点前转蓝灰暗线。地图 08 不再把三路线压缩成屏内三列，也不使用横向拖动：顶部共同起点只做一次三叉，DREAM / STAY / BAD 随后纵向分区、各自占满宽度，关键图保持正常尺寸。仍待 Ant 现场视觉确认，PP 暂不开工。决策记录：`DEC-20260729-004`。
- 2026-07-29 地图 08 重叠修正：路线分区首节点整体下移 `76px`，标题下方保留至少 `48px` 净空，分区高度同步增加；修复 ROUTE 标题压住首张关键图的问题。决策记录：`DEC-20260729-005`。
- 2026-07-29 恢复执行 / pre-flight：Ant 已确认当前设计并要求 Codex 直接修改 Android。旧实现中曲线总览、第一章 v7 特例、第八章屏内三列与横向拖动画布均与最新 §27.17 冲突；Interaction §32.2 已按顶部三叉 + 三路线纵向满宽分区同步。authority check 仅有与本任务无关的 Script V15 既有哈希漂移；`git pull --ff-only` 因本机 GitHub 凭证不可用失败。本次只改 `ChapterScreen.kt` / 可新增布局常量，不碰其余未提交 Android 文件。决策记录：`DEC-20260729-006`。
- 2026-07-29 Codex Android 交付对账（依据 UI MinSpec §27、Interaction §32，均为“已改，待 Ant 实机验收”）：
  1. 已改：普通小节使用原生点 / 序号 / 完整标题，无矩形卡片底；关键剧情才使用 `224 × 158dp` 切角玻璃图窗，未读图窗为暗占位。
  2. 已改：01～07 相邻节点全部使用垂直下降 → 水平折一次 → 垂直接入的三段简单折线；进入未读节点前切换蓝灰暗线。
  3. 已改：第八章 `01 · 共同线` 固定在三路线之上，不再作为第四列。
  4. 已改：第八章只显示 `DREAM · 世界第一` / `STAY · 陪我` / `BAD · 抓住我`，节点使用 D/S/B 前缀，不显示 raw scope。
  5. 已改：总览按 §27.17 覆盖旧 P0-5，采用可纵向滚动、左右错落的八张切角半透玻璃章节卡；卡间为简单三段折线，未读章节无图。
  6. 已改：已读标题不使用省略号；8 条权威断行表落在 `StoryMapLayout.kt`，未读标题按去除标点后的可见字数显示问号。
  7. 已改：章末恢复切角玻璃翻章条，显示短章节名与 `NN / 08`，左右箭头切换相邻章节。
  8. 已改：八章子页统一使用 `CHAPTER NN`、短标题与权威副标题，返回按钮继续使用主系统固定 `NagiIconButton`。
- 2026-07-29 额外已改：第八章移除运行时横向拖动 / 缩放入口，改为顶部一次三叉门牌，下面 DREAM → STAY → BAD 三个满宽纵向分区；每个分区标题后保留净空，关键图与其他章节同尺寸。
- 2026-07-29 构建证据：【已验证】Gradle 8.13 + Android Studio JBR 执行 `:app:compileDebugKotlin` 成功，随后 `:app:assembleDebug` 成功；APK 为 `android/app/build/outputs/apk/debug/app-debug.apk`。当前无可用 ADB 设备，实机视觉由 Ant 验收。
- 最新更新时间：2026-07-29

### TASK-20260727-004
- 标题：本地未提交杂项归属审计
- 负责人：Sai（Android / 仓库整理，只读审计）
- 状态：ready
- 优先级：P1
- 现象：当前工作区仍有未提交杂项，包括 Android icon / manifest / mipmap 资源、删除旧 bg、`design/concepts/`、`output/`、render scripts 等；来源与归属不清，继续堆开发会增加 pull/push 冲突和误提交风险。
- 范围：只读检查 `git status` 当前列出的未提交/未跟踪项；可使用 `rg`、`git diff --stat`、`git diff --name-status`、资源引用搜索。**不修改、不删除、不移动、不提交、不 push；不碰 PP 正在做的 `ChapterScreen.kt` / `StoryMapLayout.kt`；不进入剧情地图 v7 实现。**
- 落地依据：`CLAUDE.md` / `AGENTS.md` 的交付落账与 scope-only 规则；`00_harness/roles/ROLE_DEV.md` 的 pre-flight / 禁止越权规则；`authority/MANIFEST.md` 的 authority 文件补账规则。
- 完成定义：输出一份归属审计表到 PM_AGENT_OUTBOX，格式为 `路径 | 类型 | 疑似来源任务/owner | 当前是否被引用 | 建议：提交/回滚/归档/删除/继续保留 | 需要谁确认`；仅给建议，不执行处理。
- 最新更新时间：2026-07-27

### TASK-20260726-004
- 标题：UI 体检脚本（机械对账，取代截图对比）
- 负责人：feibo（设计断言清单）/ Wewe（实现）
- 状态：rework
- 优先级：P1
- 现象：现有验收全靠人眼，机械可判的项（数值、元素存在性、可点性）反复漏到 Ant 手上才被发现。
- 范围：`tools/`（新增脚本）；**不碰 web/src、android/、authority/**
- 落地依据：断言项来自 `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` 与 `authority/interaction/NagisHeart_Interaction_Design_v1_0.md`；**脚本内不得硬编码期望值，必须从权威取或由 feibo 提供的清单驱动**
- 完成定义：脚本可跑、输出逐条通过/不通过清单；交付规则改为"体检不过不得报完成"
- PM 试用未通过：【已验证】执行 `node tools/ui-check.js` 时先报 `tools/ui-checks.json` authorityHashes 落后于 `authority/MANIFEST.md`，随后超过 3 分钟未退出；PM 终止卡住的 `node tools\ui-check.js` 进程。脚本未产出逐条通过/不通过清单，不能作为 Web 三查依据。
- feibo 认领（2026-07-27）：**工具是我交的，缺陷归我**。哈希落后已在 `e6a3255` 修过，PM 试用时应已同步——需确认其工作区是否为最新；卡死是真缺陷，脚本没有任何超时兜底：`startServer` 端口被占时可能与既有 server 混淆、`puppeteer.launch` 与 `page.evaluate` 均无 timeout、驱动失败时最长可累积数十秒等待。
- rework 要求（新增）：① **全局超时**（如 120s）到点必须打印已得结果并非零退出，**绝不允许挂死**；② 端口被占用时明确报错退出，不静默复用；③ `puppeteer.launch` / 每次 `evaluate` 加超时；④ 启动即打印"正在启动浏览器…"等进度，避免看起来像卡住；⑤ 清单哈希落后时**默认继续跑并在结尾复述警告**（过期清单仍有参考价值），不因此阻断
- **本工具不可用期间，业务任务不得因此判失败或滞留**——见 `DEC-20260727-002`
- 最新更新时间：2026-07-27

### TASK-20260726-002
- 标题：Web 系统级页面暗层不足导致元素不可见
- 负责人：Wewe（Web）
- 状态：review
- 优先级：P0
- 现象（Ant 反馈）：系统级页面几乎没有压暗，白色返回按钮与次要文字糊在亮色背景上看不见；主页"继续/读取存档进度"不可读。
- 范围：`web/styles/` 暗层相关实现，覆盖全部系统级页面；一并核对 splash 类与 story 类是否同样滞后。**不碰 Android、story-data、资源文件。**
- 落地依据：**`authority/ui/XoXo_UI_Final_MinSpec_20260712.md` §1（暗层系统）**。数值一律以该节原文为准。
- 【线索，不得据此直接改，必须回权威取值】feibo【已验证】：`web/styles/tokens.css` 中系统级暗层 token 停留在 §1 修订前的旧口径且缺少其中一层；成因是 90 项对齐（`e728137`）做在 §1 修订之前。
- 完成定义：§1 全部要求落地 + 浏览器复现证明"返回按钮在亮背景上清晰可见"；先做 pre-flight
- 已改，待验：【已验证】`web/styles/tokens.css`、`web/styles/screens/start.css`、`web/styles/screens/prologue.css` 已按 `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` §1 落地系统级三层暗层；复现：旧版 `http://localhost:3001/web/` computed background 为旧两层且无径向暗角，改后 `http://localhost:3000/web/` 左下角水印 `#f4822e5 · 07-27 15:43 +未提交`，主页与存档页返回层 computed background 均为白色高光 + 径向暗角 + 垂直暗层三层，存档页返回按钮在该暗层上可见。
- PM 初查：条数 2/2 ✅ | push ✅ → 转 QA 取证
- feibo 更正（2026-07-27）：原"体检 ❌ → 暂不转 Ant"作废。**工具坏不等于业务任务失败**（规则原写错，已改，见 `DEC-20260727-002`）。体检脚本问题归 `TASK-20260726-004`，本条按新链路继续：QA 取证（脚本不可用则人工复现）→ PM 汇总 → Ant 抽查。
- 最新更新时间：2026-07-27

### TASK-20260726-001
- 标题：Android 剧情回顾页排版重构 + 分页装箱
- 负责人：PP（Android）
- 状态：preflight
- 优先级：P1
- 现象（Ant 2026-07-26 反馈）：连续对话时对白的加强设计效果很差；两侧边距太宽、字体太大、间距太宽导致换行严重。另：末行仍被裁切（原 `TASK-20260721-002` 并入本条，同源）。
- 范围：`android/app/src/main/java/com/antnagi/nagisheart/ui/screen/BacklogScreen.kt`。**不碰剧情正文、章节地图、回忆画廊、BG mapping、Web、TT Start、App Icon，不做资源删除。**
- 落地依据（**只读这三处，不许照聊天印象或旧实现**）：
  1. `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` §24（全部 token 与间距规则；§24.1 写明了为什么这样改，不要改回去）
  2. `authority/ui/NagisHeart_UI_Authority_XoXo_v1_0.html` 的「剧情回顾」view（`.recap-*` 规则与示例，示例刻意用了真实对白密度）
  3. `authority/interaction/NagisHeart_Interaction_Design_v1_0.md` §29.8 / §30.2 / §31.1（分页，禁止纵向滚屏）
- 决策记录：`DEC-20260726-001`
- 【线索】`625b3ea` 曾给页内加 `verticalScroll` 绕过裁切，与交互权威冲突，本次需按权威处理。
- 完成定义：Ant 实机验收；截图覆盖「连续同一说话人」「快速换人」「旁白↔对白切换」三种情况并证明末行不裁切，放 `00_harness/05_reports/TASK-20260726-001/`；先做 pre-flight
- 验收链路：Android 后期**不设 QA**——PM 初查（条数/push）后直接转 Ant 实机验收，不转 QA、不等体检脚本
- 最新更新时间：2026-07-26

### TASK-20260726-003
- 标题：Web 主页「存档进度」入口点击无反应
- 负责人：Wewe（Web）
- 状态：review
- 优先级：P1
- 现象（Ant 反馈，feibo【已验证】可复现）：全新进入、无任何存档时，主页点"存档进度"毫无反应。
- 范围：`web/src/` 主页入口与存档页可达性。**不碰 Android、story-data、资源文件。**
- 落地依据：**`authority/interaction/NagisHeart_Interaction_Design_v1_0.md` §13（存档页交互）、§23（空状态设计）**。无存档时入口应为何种状态，以该两节原文为准；若未覆盖该场景，pre-flight 报缺失等裁决，**不许自行决定**。
- 完成定义：按权威落地 + 自行复现证明现象消失；先做 pre-flight
- pre-flight 问题清单：
  - 【已验证｜缺失】`authority/interaction/NagisHeart_Interaction_Design_v1_0.md` §13 仅规定存档类型、列表信息和页内操作，§23.3 仅规定存档页空状态文案；两节均未规定“无任何存档时主页「存档进度」入口应禁用，还是应保持可点击并进入空状态页”。当前 `web/src/ui/screens/StartScreen.js` 在无自动存档时禁用该入口，但 authority 不足以裁定目标行为。请 PM/Ant 明确入口状态后再实现。
- PM 裁决已入权威：`DEC-20260727-001`；见 `authority/product/NagisHeart_PRD_v2_0.md` §20.1 / §20.2、`authority/interaction/NagisHeart_Interaction_Design_v1_0.md` §23.3 / §29.2、`authority/ui/XoXo_UI_Final_MinSpec_20260712.md` §5 / §22.3。worker 需重跑 pre-flight。
- 已改，待验：【已验证】`web/src/ui/screens/StartScreen.js` 移除主页“存档进度”入口对 auto-save 的禁用与无响应分支，`web/src/ui/overlays/SaveLoadOverlay.js` 在无手动存档时进入存档页空状态且不渲染空白槽；依据 `authority/product/NagisHeart_PRD_v2_0.md` §20.1 / §20.2、`authority/interaction/NagisHeart_Interaction_Design_v1_0.md` §23.3 / §29.2、`authority/ui/XoXo_UI_Final_MinSpec_20260712.md` §5 / §22.3；复现：旧版 `http://localhost:3001/web/` 无存档时按钮 `disabled=true`、点击后 `overlay=false`，改后 `http://localhost:3000/web/` 左下角水印 `#f4822e5 · 07-27 15:43 +未提交`，按钮 `disabled=false`、点击后 `overlay=true`、显示“还没有手动存档。你可以在剧情中随时保存。”且 `.save-slot-row` 数量为 0。
- PM 初查：条数 2/2 ✅ | push ✅ → 转 QA 取证
- feibo 更正（2026-07-27）：原"体检 ❌ → 暂不转 Ant"作废。**工具坏不等于业务任务失败**（规则原写错，已改，见 `DEC-20260727-002`）。体检脚本问题归 `TASK-20260726-004`，本条按新链路继续：QA 取证（脚本不可用则人工复现）→ PM 汇总 → Ant 抽查。
- 最新更新时间：2026-07-27

### TASK-20260721-008
- 标题：ui-snapshot 工具覆盖不可复现
- 负责人：Wewe（Web）
- 状态：rework
- 优先级：P2
- 现象（feibo【已验证】）：Wewe 报 18/18 覆盖，实际 17/18，复跑只得 11/18——controller 注入钩子依赖时序，一次跑通不等于可复现。
- 范围：`tools/ui-snapshot.js`。**不改 `web/src` 生产逻辑。**
- 【线索】工作区曾有一份改到一半的修复（重构 hook 注入 + 选择器改 `.authority-ending-screen`），跑出来同为 11/18，已 `git stash` 保存（`stash@{0}`），可先 `git stash list` 决定捡起或丢弃。
- 完成定义：连跑 3 次结果一致才算过；`__controller__` 改为显式等待就绪而非靠时序巧合；一并确认 web 的 `section-clear` 状态是否为已移除页面的残留（§17.6 已移除独立小节结束页）
- 最新更新时间：2026-07-26

---

## 关闭台账

> 全文见 `task_board_archive_20260715_20260721.md`。

**2026-07-21 第一批**：34 条（0715~0719 全部历史任务）关闭并归档，逐条理由见归档文件。

**2026-07-26 第二批**：

| 任务 | 一句话 |
|---|---|
| 0725-001 | Android 两层剧情地图（八章总览 + 64 节点）—— Ant 验收通过 |
| 0724-001 | Android 剧情回顾对白块视觉区分 —— 后续由 0726-001 重构取代 |
| 0723-004 | Android 回忆画廊四结局展墙 —— Ant 验收通过 |
| 0723-002 | Android 三页 UI authority（大章开始/结束/结局页）—— Ant 验收通过 |
| 0722-001 | Android 剧情路由 + 结局画廊 BG 链路 P0 —— 完成 |
| 0722-002 / 0722-003 / 0723-001 / 0723-002(旧号) / 0723-003 | 五段剧本替换与长旁白补写，runtime 已同步 —— 完成 |
| 0721-006 | Web 90 项 authority 对齐验收 —— 已由后续 Web 任务接管 |
| 0721-001 | authority/ 建立 + 周末补账 —— 完成 |
| 0721-002 | 回顾末行裁切 —— 并入 0726-001 |
| 0721-003 | V3_1 ↔ story-data 差异审计 —— 关闭（如需重开另立新号） |
| 0721-004 | 补缺失 BG —— 完成（validate 仅剩 1 warning） |
| 0721-005 | 开放日实机复验 —— 未复现，关闭 |
| 0721-007 | MinSpec 效果 Compose 翻译规范 —— 关闭（如需重开另立新号） |
| 0719-004 | 代码健康专项（token 归一 + 死代码）—— 完成 |
| 0719-016 | Android locked 标题隐私 —— 完成 |
| 20260727-001 | 开放日 `c3` 伪选项修复 —— Ant 实机确认生效；Script 与 runtime 已同步 |
| 20260727-002 | Android 剧情地图直达路线节点卡死修复（M/J/path 上下文）—— Ant 实机确认通过；原本地旧号 `TASK-20260726-002` 与远端 Web 暗层任务撞号，改号登记 |

---

## 编号规则

- 格式 `TASK-YYYYMMDD-NNN`，**派工前必须先查本板与归档，禁止复用编号**
- 历史遗留：`TASK-20260723-002` 曾被两个任务共用（剧情替换 / Android 三页 UI），引用旧号时必须同时写标题
- `TASK-20260723-003` 仅指 `e_agency_launch` 补长旁白的完成记录

## 状态说明

`ready` 可执行 · `preflight` 已派发，worker 正在对照权威、尚未动手 · `blocked` pre-flight 报了权威问题，等 lulu/TT 补或 feibo 裁决 · `in_progress` 裁决通过，正在改 · `review` 已回报，Web 等 PM 初查 / QA 取证 / PM 汇总 / Ant 抽查，Android 等 PM 初查 / Ant 实机验收 · `done` Ant 验收通过 · `rework` 被打回

## 任务模板（严格照写，规则见 `00_harness/roles/ROLE_PM.md`）

```markdown
### TASK-YYYYMMDD-NNN
- 标题：<一句话，一个现象>
- 负责人：
- 状态：ready
- 优先级：P0/P1/P2
- 现象：<客观描述，照抄 Ant/QA 原话，不加工>
- 范围：<允许碰的文件/目录>；**不碰 <禁区>**
- 落地依据：**<authority 文件 + 章节号>**
- 完成定义：按依据落地 + 自行复现证明现象消失；先做 pre-flight
- 最新更新时间：
```

**禁止写进条目**：任何数值（颜色/字号/间距/透明度）、具体实现逻辑、派工方对设计的理解。
定位线索可写，但必须标 `【线索，不得据此直接改，必须回权威取值】`。
