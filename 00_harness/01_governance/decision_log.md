# 决策记录

> 用途：记录已经拍板、后续所有角色必须遵守的决定。  
> 原则：只追加，不覆盖历史。新记录追加在最上方。

---

### DEC-20260729-006
- 时间：2026-07-29
- 项目：NagisHeart
- 来源：Ant 明确确认当前剧情地图设计“挺好的了”，并要求 Codex 亲自修改 Android 实现。
- 裁决内容：`TASK-20260727-003` 从 paused 恢复为 in_progress。UI MinSpec §27.17 的切角玻璃总览、简单三段折线、章内轻量节点 / 关键图卡与第八章“顶部三叉门牌 + 三路线纵向满宽分区”成为 Android 当前落地依据，覆盖旧 v7 圆形节点、屏内三列和横向拖动画布实现。
- 交互冲突修正：Interaction §32.2 原“第八章三条路线并列”按最新设计解释并改写为逻辑三路线独立、顶部横向三叉、后续纵向满宽分区；禁止横向拖动与缩放。三条路线不得串成一个剧情顺序。
- pre-flight 记录：
  1. `ChapterScreen.kt` 已存在一批未提交的旧方向修改（曲线总览、第一章特例、第八章拖动画布）；本次在同一文件上收敛，保留与新 authority 一致的可复用部分，不覆盖其他 Android 文件。
  2. `tools/check-authority.ps1` 当前仅 `script/Nagis_Heart_SCRIPT_V15_Calibrated.md` 存在既有哈希漂移，与本任务无关；本次不修改剧本母版。
  3. `git pull --ff-only` 因本机 GitHub 凭证不可用失败；在不覆盖当前工作区未提交修改的前提下继续本地实现，最终 push 能否执行需以凭证状态为准。
- 生效范围：UI MinSpec §27.17、Interaction §32.2、Android `ChapterScreen.kt` / 可新增地图布局常量文件、`TASK-20260727-003`。
- 验收状态：只能标记“已改，待 Ant 实机验收”，不得由 agent 自评通过。

---

### DEC-20260729-005
- 时间：2026-07-29
- 项目：NagisHeart
- 来源：Ant 截图指出第八章路线分区标题与首个关键剧情图卡重叠。
- 决策内容：第八章每个路线分区的首节点中心由分区顶部 `124px` 下移至 `200px`；分区高度同步增加 `76px`。路线标题下方至少保留 `48px` 视觉净空，首段折线从标题区下方出发后接入首节点，不得穿过路线编号、标题、图片或节点文案。
- 生效范围：UI HTML“地图 08”、MinSpec §27.17.2、`TASK-20260727-003`。

---

### DEC-20260729-004
- 时间：2026-07-29
- 项目：NagisHeart
- 来源：Ant 在确认剧情地图总览的切角玻璃卡片与三段简单折线后追问“内页呢”，要求八章内页延续同一版式。
- 决策内容：地图 01～07 的每个小节继续独立为一个节点；关键剧情节点使用与总览一致的切角半透玻璃图片窗，普通小节保持“点 + 序号 + 标题”的轻量结构。节点上下错落，任意两个相邻节点之间仅用一条“垂直下降 → 间隙水平折一次 → 垂直接入”的三段简单折线，禁止穿图、穿字、外侧绕行、菱形接口和额外装饰。
- 亮暗规则：进入已玩节点的线路使用低亮金色；进入未玩节点前切换为蓝灰暗线。未玩关键节点不显示图片，标题按原字数显示问号；不额外显示“已解锁 / 未解锁”等状态标签。
- 第八章例外：不再把 DREAM / STAY / BAD 压缩为屏内三列，也不采用横向拖动画布。共同起点下方只做一次三叉线与三个路线门牌，随后三条路线按 DREAM → STAY → BAD 纵向分区；每个分区占满可用宽度，内部节点左右错落，关键图窗保持与其他章节相同尺寸。
- 图片规则：HTML 中图片只作版式预览；Android 实现必须运行时读取 `chapters.json sections[].startNode → scene_visuals.json[startNode].bg`，并逐图把焦点对准 Nagi 脸部，不复制 authority 预览图片到 runtime。
- 生效范围：UI HTML“地图 01～08”、MinSpec §27.17.2、`TASK-20260727-003`。
- 当前状态：总览方向已获 Ant 认可；八章内页进入现场视觉复核，Android 任务继续暂停，待 Ant 确认内页后再写开发实施任务。

---

### DEC-20260729-003
- 时间：2026-07-29
- 项目：NagisHeart
- 来源：Ant大小姐在总览截图上用红线标注连接方式，并要求“直接简单一点，像标记那样简单折线”
- 决策内容：剧情总览连接线取消外侧 gutter、切角菱形接口、短斜线和复杂绕边。每两张相邻章节卡之间只使用一条三段折线：从当前卡片底边垂直下降，在章节间隙中部水平折一次，再垂直接入下一张卡片顶边。折线在左右方向交替，保持卡片错落节奏。
- 视觉 token：已读段 `#D7BE86`、`1.3px`、opacity `0.70`、仅 `3px` 极弱 glow；未读段继续使用 `#9AA8BA`、`1.05px`、opacity `0.26`、无 glow。端点不加菱形、圆点或任何接口装饰。
- 生效范围：UI HTML 地图总览、MinSpec §27.17.1。
- 覆盖旧规则：覆盖 `DEC-20260729-002` 中“外侧 gutter + 小菱形接口”的连接线设计；切角玻璃章节块版式本身不变。

---

### DEC-20260729-002
- 时间：2026-07-29
- 项目：NagisHeart
- 来源：Ant大小姐提供 Android 既有剧情总览截图，并说明“没有按你的设计，但是感觉还可以”，要求按该截图设计完整版式与连接线
- 决策内容：`DEC-20260729-001` 中圆形“记忆岛”视觉尝试不通过，立即停止。剧情地图回归主系统的方形 / 切角 / 半透玻璃语言，但避免等距方块列表：总览采用上下滚动、左右错落的切角玻璃章节块；上部为章节图，下部为玻璃文字区。内页关键剧情节点同样使用切角玻璃图片窗，普通节点保持“点 + 序号 + 标题”轻量结构。
- 连接线口径：线路位于卡片后方，交替沿左右外侧 gutter 走正交折线；从当前卡片下方外侧切角离开，接入下一卡片上方同侧切角；接口为小型空心菱形。已点亮段使用低亮度金色 `#D7BE86`，未点亮段使用蓝灰 `#9AA8BA`；禁止中央时间轴、箭头、曲线、粗霓虹、虚线和圆形节点。
- 当前状态：HTML authority 已生成完整八章版式供 Ant 视觉确认；确认前 Android 旧 v7 像素对齐继续暂停。
- 生效范围：UI HTML 地图总览与章内关键节点、MinSpec §27.17、`TASK-20260727-003`。
- 覆盖旧规则：覆盖 `DEC-20260729-001` 的圆形 / 椭圆“记忆岛、轨道、花瓣边缘”视觉描述；保留其中“v7 整页 PNG 不作为最终成品、64 节点、真实 BG、逐图对准 Nagi 脸、亮暗无剧透、第八章三路线”的逻辑要求。

---

### DEC-20260729-001
- 时间：2026-07-29
- 项目：NagisHeart
- 来源：Ant大小姐查看恢复后的剧情地图 authority 页面后反馈“好丑”，并要求重新设计
- 决策内容：撤销 v7 PNG/SVG 作为剧情地图最终视觉成品的地位；v7 继续保留为历史布局参考和 64 节点完整性记录，但不得再直接嵌进手机框、不得要求 Android 逐像素复刻。权威 HTML 的总览与八章子页改为原生 HTML/CSS 设计预览：总览采用错落的有机“记忆岛”而非方卡列表；章内普通小节采用“光点/种子 + 序号 + 标题”，关键剧情采用不规则记忆画幅；第八章保持共同起点与 DREAM / STAY / BAD 三线并列。旧 v7 数值中关于完整节点、两层导航、正交连接、真实 BG、亮暗与无剧透、人脸焦点、滚动和三路线的逻辑继续有效；关于切角矩形尺寸、逐像素坐标和整页 PNG 构图的视觉要求暂停执行。
- 当前状态：本次原生版属于 Ant 视觉复核中的新方向；在 Ant 明确确认前，Android 不得继续按旧 v7 做像素对齐，也不得把本次 HTML 数值直接视为开发 token。
- 生效范围：`authority/ui/NagisHeart_UI_Authority_XoXo_v1_0.html`、UI MinSpec §27.17、`TASK-20260727-003`。
- 不变项：预览 PNG/SVG 禁止进入 runtime；正式图片继续读取 `chapters.json sections[].startNode → scene_visuals.json[startNode].bg`；有 Nagi 时逐图对准脸，无 Nagi 时保留真实环境/道具 BG。

---

### DEC-20260727-006
- 时间：2026-07-27
- 项目：NagisHeart
- 来源：Ant 实机截图（剧情地图总览 / 第四部 / 第八部）+ lulu 对照 v7 权威参考图逐页复核；PP 提出五个阻塞问题（坐标来源、side 规则、断行信息、PAGE_H 语义、副标题文案源）。
- 背景：`DEC-20260725-001` 确立剧情地图 UI authority（MinSpec §27.1–§27.7），但只给了文字描述与参考图，**未给任何数值 token**。Android 首版实现因此整体走形：普通节点全部卡片化、折线路径完全缺失、第八部把 `common` 做成第四列并把 `chapters.json` 原始 scope 值显示给玩家、路线标签自造（`远处` 实为 B7 小节标题）、总览页退化为竖排列表、已解锁标题被省略号截断。定性为**设计侧 token 缺失为主因之一**，非单方面实现问题。
- 决策内容：MinSpec §27 新增 §27.8–§27.16，数值全部取自 v7 权威同源生成脚本 `design/concepts/story_map_xoxo_v1/generate_story_map_chapter_pages_v7.py` 与 `generate_story_map_two_pages_v4.py`，不做二次设计：
  - §27.8 页面骨架：1080 基准与 `dp = px ÷ 3` 换算、背景三层（与 §1 系统级页面一致）、返回键（固定顶部安全区）、子页页头、页脚翻章条。明确 `PAGE_H` 为该章内容总高，翻章条是**随内容滚动的页脚**而非吸底栏。
  - §27.9 节点 token：文字节点（**无卡片底**，点 + 序号 + 标题）、配图节点、第八章分支节点三套。
  - §27.10 连接路径 token：主/弱两种线，仅用正交折线；明确路径不可省略。
  - §27.11 第八章布局：三列坐标、共同起点居中于三线之上、三条路线权威中文标签、D/S/B 序号前缀；禁止 `common` 做第四列、禁止 scope 原始值上屏、禁止自造路线名。
  - §27.12 总览页 token：单屏不滚动、地标错落分布、未解锁暗板 + 五边形水印；禁止英文 `Chapter N` eyebrow 与节数圆点。
  - §27.13 未解锁呈现数值；已解锁标题必须完整显示，不得省略号截断。
  - §27.14 坐标来源授权：授权从九份 SVG（八章 v7 + 总览 v4）转写坐标、路径顶点、`side`、配图尺寸，转写数字不违反 §27.1（§27.1 禁的是文件本身进 runtime）。
  - §27.15 标题断行表：8 条。经核对不存在可机械推导的规则（`我不是不想这样赢` 无标点、`夏窗·签约桌上的好麻烦` 词中断且保留 `·`），故由表权威指定。
  - §27.16 章节标题与副标题文案表：地图页页头用独立短标题 + 一句副标题，**不取自 `chapters.json` 的 `name` / `title`**。
- 焦点（裁切对齐）口径：v7 生成脚本 20 个配图节点中 19 个为默认 `xMidYMid`，与 §27.6「禁止全局 centerCrop」冲突。Ant 裁决：**焦点由开发逐图调校**，设计侧不另出 focus map，**不重新切图、不新增任何图片资源**，仅调 alignment / offset / contentScale 显示参数，图源仍按 §27.5 从 `scene_visuals` 读取；设计侧在验收环节逐图复核。该项不阻塞开工。
- 明确不做：不改 `story-data`（断行表与文案表属 UI 呈现配置，写在布局常量 / string 资源，不回写 `chapters.json`）；不改 BG mapping；不把 `design/concepts/story_map_xoxo_v1/` 下任何 PNG / SVG 复制进 `res/` `assets/` 或运行时加载。
- 生效范围：`authority/ui/XoXo_UI_Final_MinSpec_20260712.md` §27.8–§27.16、Android 剧情地图实现任务 `pp_task_story_map_align_v7_20260726.md`。
- 补账（同 commit 一并登记，非本次设计改动）：`visual_mapping/NagisHeart_SCRIPT_V15_节点匹配表.xlsx` 自 2026-07-23 01:03 起为未提交的本地改动（Ant 的 Antset 列编辑），MANIFEST 未同步，导致 check-authority 长期 FAILED。该内容已于 BG Mapping v1.5 消化并登记，此次仅补哈希与提交，不改文件内容。
- 验证要求：`powershell -ExecutionPolicy Bypass -File tools/check-authority.ps1` 必须全绿后 PP 方可开工。注意脚本对 `.md` 使用**换行无关哈希**（剥 CR + UTF-8 无 BOM），与 `Get-FileHash` 的原始字节 MD5 不同，MANIFEST 必须登记脚本口径的值。

---

### DEC-20260727-005
- 时间：2026-07-27
- 项目：NagisHeart
- 来源：Ant 实机复现 / PP 根因报告：剧情地图直达 `e_agency_launch | 她站在光里` 后卡死；合并远端后原本地 `DEC-20260726-004` 与远端机制决策撞号，改号为本条。
- 决策内容：剧情地图将 64 个小节 startNode 暴露为可直达入口后，原先只依赖路线变量的 `flow.byRoute` 不足以保证空变量直达可继续。数据侧仅补第七部 M 线 default 兜底：`e_agency_launch → e_scarf`、`e_scarf → e_sick_fragile`、`e_sick_fragile → route_love_hidden`。这是因为 `route_mj_hidden` 的 fallback 本来就是 M，补 default 不新增剧情设定。
- 明确不做：不为 J 线专属节点 `e_dressup` / `e_softrice` 补 M default；不为 `p8_route` 指定 dream/stay/bad 默认路线。J 线和第八部路线入口由 Android 剧情地图 / replay 在跳入时按章节 `scope` 或玩家选择补上下文，避免污染主线存档或替玩家做终局选择。
- 生效范围：`story-data/flow.json`、Android 地图 / replay 上下文实现与 `TASK-20260727-002`。
- 验证要求：`node tools/validate.js` 必须通过；Android 侧需另测 `e_agency_launch`、`e_scarf`、`e_sick_fragile`、`e_dressup`、`e_softrice`、`p8_route` 六个地图入口。

---

### DEC-20260727-004
- 时间：2026-07-27
- 项目：NagisHeart
- 来源：Ant 实机截图反馈：`c3 | 开放日` 显示 4 个选项，其中多项为括号动作/心理描写，并非玩家真实选择；合并远端后原本地 `DEC-20260727-001` 与远端存档进度决策撞号，改号为本条。
- 决策内容：`c3 | 开放日` 中线性演出动作不得作为玩家选项。将“被他歪头看过来击中”“脸一下热起来”“下意识想拉手又收回”三处从选项改回旁白/演出；仅保留更衣室处两项真实玩家选择：“你这么邋遢，会没有女生喜欢的！”与“真拿你没办法……我帮你整理一下”。
- 生效范围：`authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md`、`story-data/nodes.json`、Android assets story-data 同步副本。
- 验证要求：`c3` runtime 只允许 2 个 choices；`c3_s2` 不允许再有伪选项，并通过 `flow.default.c3_s2 -> e_lemontea` 继续。

---

### DEC-20260727-001
- 时间：2026-07-27
- 项目：NagisHeart
- 来源：Ant大小姐现场裁决 / PM 一一补权威
- 决策内容：主页「存档进度」是手动存档管理入口，必须保持可见且可点击。没有任何手动存档时，点击该入口进入存档页空状态，不禁用、不无响应、不依赖自动存档是否存在。「继续故事」仍只读取默认退出进度；默认进度与手动存档继续保持两套语义。
- 生效范围：`authority/product/NagisHeart_PRD_v2_0.md`、`authority/interaction/NagisHeart_Interaction_Design_v1_0.md`、`authority/ui/XoXo_UI_Final_MinSpec_20260712.md`、`TASK-20260726-003`。
- 覆盖旧规则：覆盖任何把主页「存档进度」入口绑定到自动存档存在性、或在无手动存档时禁用该入口的实现口径。
- 执行要求：PM 同步 PRD、Interaction、UI MinSpec 与 MANIFEST；Web worker 回到 pre-flight，按 authority 重新核对后再实现，不得继续按旧代码状态猜测。

---

### DEC-20260725-002
- 时间：2026-07-25
- 项目：NagisHeart
- 来源：Ant大小姐现场指令“章节目录页去掉”
- 决策内容：旧章节目录页正式退役，不再作为独立玩家页面或 UI authority 入口。原“章节目录”入口直接进入八章收起的剧情地图总览；章内节点浏览由剧情地图子页承担。权威 HTML 删除旧章节目录按钮、页面结构和页面 preset，开发不得在剧情地图之外继续保留一层旧目录。
- 生效范围：UI authority HTML、UI MinSpec §27、Interaction §32、`TASK-20260725-001`。
- 不变项：剧情地图总览与八章 v7 参考、真实 BG 数据链路、逐图 Nagi 人脸焦点、已玩过点亮 / 未玩过不亮等 `DEC-20260725-001` 规则全部保持。

---

### DEC-20260725-001
- 时间：2026-07-25
- 项目：NagisHeart
- 来源：Ant大小姐确认剧情地图 v7 排版，并明确要求停止继续调图
- 决策内容：剧情地图总览图与八章子页 v7 仅作为 UI 构图、层级、密度和滚动节奏的视觉参考，嵌入 UI authority HTML 供设计与验收查看；这些预览 PNG 不是游戏资源，开发不得复制进 Android `res/`、`assets/` 或在运行时直接加载。正式实现必须以 `story-data/chapters.json` 的 `sections[].startNode` 读取 `story-data/scene_visuals.json[startNode].bg`，逐章、逐重点节点使用真实章节背景图；每张图独立确定裁切与焦点，画面中存在 Nagi 时必须露出并对准 Nagi 的脸，不得用统一居中裁切。真实 BG 若为环境或道具且没有 Nagi，则保留真实 BG，不得擅自换成章节封面或其他人物图。
- 生效范围：`authority/ui/NagisHeart_UI_Authority_XoXo_v1_0.html`、`authority/ui/XoXo_UI_Final_MinSpec_20260712.md`、`authority/interaction/NagisHeart_Interaction_Design_v1_0.md`、Android 剧情地图实现任务 `TASK-20260725-001`。
- 固定设计口径：外层为八章收起总览；进入章节时拉近放大；每个小节必须是独立节点，不得合并；玩过的内容点亮、没玩过的不亮且不显示状态词；未解锁重点节点不放图，标题按字数显示等量问号；章节子页允许适度纵向滚动，禁止为塞进一屏而压缩，禁止改回方块列表或直线时间轴；第八章保持三路线并列结构。
- 不在本次范围：不修改剧情文本、节点顺序、BG mapping 或 `story-data`；不继续重画、调色、换图或裁切本批预览 PNG。

---

### DEC-20260718-006
- 时间：2026-07-18
- 项目：NagisHeart
- 来源：Ant大小姐实机截图反馈 / PM 一一复核
- 决策内容：当前 Android UI 实机效果不通过，不得转 `done`。`TASK-20260717-013` / `TASK-20260717-015` 中 HUD icon/title/action 虽统一但变成厚重按钮；Dialog 仍不像 final light glass；speaker/name 可读性仍需确认。yiyi 暂停 UI 自由发挥与自由调参；后续 UI 修正必须先读 `00_harness/08_authority_current/04_ui/` 和 PM reject review，并按明确 acceptance checklist 机械实现。若下一轮实机仍明显偏离 authority，则 Android UI 实现职责转给其他开发，yiyi 只保留引擎、数据、构建、资源接入等非视觉任务。
- 生效范围：`TASK-20260717-013`、`TASK-20260717-015`、新增 `TASK-20260718-004`，以及后续所有 Android UI authority 实现任务。
- 覆盖旧规则：覆盖此前 PM 静态复核通过但仍待实机确认的乐观状态；不覆盖 Web、App Icon、TT Start、story-data、BG mapping、BGM。

---

### DEC-20260717-012
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：TT 追加说明 / Ant现场确认回传 / PM 一一修正
- 决策内容：恢复 TT rethink Strategy A 作为 Start v23 长屏 Android layout experiment 的可执行方向。此前 `DEC-20260717-011` 暂停执行，是因为 PM 收口过快且现场一度怀疑底图不对；TT 追加说明确认：`assets/home.jpg` 等旧 demo 图不是本次 Start final 底图，本次 Start final 仍沿用 Start v23 / remeet 底图方向。因此可基于 `design/authority/icon_start_tt/start_long/rethink/` 的 Strategy A 派给 yiyi 做 Android layout experiment，但仍不直接视为 final 资源。
- 生效范围：Android Start 长屏适配、yiyi layout experiment、TT Start 长屏后续视觉 QA
- 覆盖旧规则：覆盖 `DEC-20260717-011` 的暂停执行状态；保留 `DEC-20260717-011` 中“不得由 PM 在未确认时直接下发开发”的流程教训。继续保留 `DEC-20260717-009` 对 V1/V2/V3 不得作为 final 交给 yiyi 的限制。
- 执行要求：恢复 `TASK-20260717-008` 为 ready。yiyi 按 rethink Strategy A 做 Android layout experiment：不使用 V1 毛玻璃/模糊补边；不使用 V2/V3 近景大头 crop final；使用 Start v23 / remeet 背景做长屏适配，v23 标题层、START、Tap to start 保持原 SVG/图层字感；长屏放大/适配时优先保留左侧主体关系，不让标题/START 独立漂移。完成后必须回传 Android 实机/模拟器截图或录屏，由 PM / Ant 再确认是否固化。

---

### DEC-20260717-011
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐纠正 / PM 一一修正
- 决策内容：暂停 `DEC-20260717-010` 的执行。TT rethink Strategy A 当前不得交给 yiyi 开发，也不得视为已通过方向；原因是当前预览底图仍不对，Ant大小姐已在 XoXo 侧要求修正底图，需等待 XoXo 回传后再由 PM / Ant 重新确认。任何 Start 长屏 Android layout experiment 必须先经过 Ant大小姐明确确认预览方向，不得由 PM 直接下发开发。
- 生效范围：TT Start 长屏适配、XoXo 底图修正、yiyi Android Start 长屏任务、PM 后续收口
- 覆盖旧规则：覆盖 `DEC-20260717-010` 中“Strategy A 作为下一步 Android layout experiment 方向通过”的执行口径；`DEC-20260717-010` 保留为历史误判记录，但不得作为开发依据。
- 执行要求：删除 / 暂停已准备给 yiyi 的 Strategy A 开发任务单；`TASK-20260717-008` 不进入执行；等待 XoXo 修正底图并回传后，PM 先提交 Ant大小姐视觉确认，再决定是否重新派发给 yiyi。

---

### DEC-20260717-010
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：TT Start 长屏适配策略 rethink / PM 一一复核
- 决策内容：TT `TASK-20260717-003` 的 Strategy A 作为下一步 Android layout experiment 方向通过，但不直接把 rethink 预览图视为 final 长屏资源。Start 长屏适配不继续 V1 毛玻璃补边，也不继续 V2/V3 raw source 近景裁切路线；优先采用“背景 cover-height / 只裁左右 + v23 标题、START、Tap to start 作为 protected SVG safe UI layer”的实现策略。该策略的核心目标是保留已确认 Start v23 字体/字感、Nagi 下巴/下颌线、face/chin/START 关系，并消除长屏黑条。
- 生效范围：Android Start 长屏适配、yiyi 后续 layout experiment、TT 长屏资源后续任务、视觉 QA
- 覆盖旧规则：覆盖 `DEC-20260717-004` 中“优先让 TT 出更长底图资源包”作为唯一方向的理解；保留 `DEC-20260717-009` 对 V1/V2/V3 不得作为 final 交给 yiyi 的限制。
- 执行要求：新增 yiyi 开发实验任务，按 TT rethink 文档实现 Strategy A：背景可按 1080x1920 clean background 等比填满长屏高度并水平居中裁左右；标题/START 使用已确认 v23 SVG 层，不重绘、不换字体；START 点击热区跟随 protected UI layer；输出真机截图/录屏和差异说明后再由 PM / Ant 确认是否固化。不得接入 V1/V2/V3 长屏包，不得修改 App Icon、XoXo final UI authority、story/script 数据或旧资源清理。

---

### DEC-20260717-009
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐视觉反馈 / PM 一一裁决
- 决策内容：TT Start v23 长屏 V3 不通过。V3 仍未保留 Nagi 下巴；同时暂停“继续裁切原图”的单一路线。长屏适配应重新论证：既然主页背景可以正常适配长屏，Start 也应优先研究保留已确认 1080x1920 画面关系、用设计盒 / safe area / content scale / 标题位置调整等方式适配，而不是默认必须裁成更近的大头图。后续 TT 需输出长屏适配策略 rethink，比较保留原图适配、扩展画布、不破坏人物关系等方案；V1/V2/V3 均不得作为 final 交给 yiyi。
- 生效范围：TT Start 长屏资源、Android Start 长屏接入、yiyi 后续开发任务、视觉 QA
- 覆盖旧规则：覆盖继续沿 V2/V3 裁切路线直接出新图的做法；不覆盖已确认 Start v23 的基础视觉语言。
- 执行要求：TT 先输出适配策略分析和推荐方案，再提交新预览；必须保留 Nagi 下巴、已确认字体/字感、face/chin/START 关系；不得使用 V1 毛玻璃补边。

---

### DEC-20260717-008
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐视觉反馈 / PM 一一裁决
- 决策内容：TT Start v23 长屏 V2 不通过。V2 的真全屏构图方向正确，但字体 / 标题层 / START 字感变了，且构图裁切没有保住 Nagi 下巴，破坏了已确认 Start v23 的视觉语言和人物焦点关系。后续 rework 必须保留 1080x2400 真全屏构图，同时恢复已确认 v23 的标题、START、Blue Lock、小装饰线和 Tap to start 字体/层效果，并确保 Nagi 的下巴展示出来；不得回退到 V1 上下毛玻璃，也不得换成新字体风格。
- 生效范围：TT Start 长屏资源、Android Start 长屏接入、yiyi 后续开发任务、视觉 QA
- 覆盖旧规则：覆盖 `PM_REVIEW_TT_START_LONG_SCREEN_V2_20260717.md` 中“可提交 Ant 确认”的待确认状态；Ant 已确认当前 V2 字体观感不通过。
- 执行要求：TT 输出 V3：真全屏构图 + 保持已确认 Start v23 字体/字感；yiyi 不得接入 V2；旧资源不删除。

---

### DEC-20260717-007
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一职责修正
- 决策内容：Android UI 资源审计中发现的“缺少或未交付给开发的 UI 资源”，先由 XoXo 作为 UI owner 补齐并整理成开发可接入包；yiyi 作为开发 owner 只负责接入、路由修正、构建与验证，不负责反向设计或临时补 UI 资源。旧资源、未引用资源、obsolete 资源暂不删除，必须等资源补齐、Android 适配完成、QA / 视觉测试通过后，再由 PM 另开清理任务处理。
- 生效范围：XoXo Android 资源补齐任务、yiyi Android 资源接入任务、后续 QA 和资源清理
- 覆盖旧规则：修正 `DEC-20260717-005` 中容易被理解为“由 yiyi 直接补齐所有资源”的口径；Prologue / Name 路由仍由 yiyi 修正，但 HUD/system icons 等 UI 资源包先由 XoXo 确认 / 补给。
- 执行要求：新增 XoXo 资源补给任务 `TASK-20260717-006`；`TASK-20260717-005` 调整为等待 XoXo 资源交付后由 yiyi 接入；任何删除旧资源的动作都必须另开任务。

---

### DEC-20260717-006
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐实机视觉反馈 / PM 一一裁决
- 决策内容：TT Start v23 长屏 v1 预览不通过。长屏开屏页要做“图片本身布满屏幕”的完整 1080x2400 适配，不接受在 1080x1920 中心图上下添加毛玻璃、模糊条或补丁式延展作为最终方案。当前 `design/authority/icon_start_tt/start_long/` v1 包保留为历史候选，但不得交给 yiyi 作为 final 长屏资源接入。`TASK-20260717-003` 回派 TT 重做 / 优化长屏全屏构图。
- 生效范围：TT Start 长屏资源、Android Start 长屏接入、yiyi 后续开发任务、视觉 QA
- 覆盖旧规则：覆盖 `PM_REVIEW_TT_START_LONG_SCREEN_20260717.md` 中“可提交 Ant 实机确认”之后的待确认状态；Ant 已确认当前 v1 视觉不通过。也覆盖任何把上下毛玻璃延展视为 final 长屏方案的口径。
- 执行要求：TT 输出新的 1080x2400 全屏构图长屏包；yiyi 暂不接入当前 v1 长屏包；旧资源和未引用资源在缺口补齐、开发适配、测试通过前不得删除。

---

### DEC-20260717-005
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：XoXo Android UI 资源审计 / PM 一一裁决
- 决策内容：Android 资源修复按 XoXo 审计结论分派：Prologue / Name 背景改用现有 `R.drawable.splash_bg`，不再引用缺失的 `file:///android_asset/bg/poster_start_nagis_heart_bg_clean.png`；HUD / system icons 从已准备的 `assets/ui/android/drawable/` 接入 `android/app/src/main/res/drawable/`；App Icon 暂不替换，继续等待 Ant大小姐单独确认；旧 splash / keyart 资源本轮不删除，只禁止继续作为 final UI 主动引用并记录剩余引用；Start SVG 需在 Android 构建后做真机视觉确认，若 Coil SVG filter 有偏差再请求 TT raster fallback。
- 生效范围：Android UI 资源修复、yiyi 后续开发任务、QA 视觉复验、App Icon 接入边界
- 覆盖旧规则：覆盖继续使用缺失 `poster_start_nagis_heart_bg_clean.png` asset path 的实现；不覆盖 TT App Icon 待确认状态
- 执行要求：yiyi 执行资源路由与图标接入；不得在本任务中替换 App Icon、删除旧资源、修改 story/script 或补 pending 页面

### DEC-20260717-004
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：yiyi Start v23 实机适配回报 / PM 一一裁决
- 决策内容：Start v23 在长屏手机上出现上下黑条时，不采用“直接全屏裁切铺满”的方案作为最终修复；优先让 TT 输出长屏适配资源包，以保留已确认的标题、人物脸部焦点与 START 位置关系。当前 1080x1920 方案可作为 9:16 设备或临时 fallback，长屏 final closure 依赖 TT 新资源与实现说明。
- 生效范围：Android Start v23 接入、TT Start 长屏资源任务、后续视觉 QA
- 覆盖旧规则：覆盖 yiyi 回报中的方案 A 作为默认修复的可能性；不覆盖 TT Start v23 已确认方向
- 执行要求：TT 输出长屏 Start v23 适配包；yiyi 在新资源到位前不擅自用裁切导致标题/START 漂移；PM 后续按新资源复核 Android 实现

### DEC-20260717-003
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一确认
- 决策内容：`design/NagisHeart_UI_Authority_XoXo_v1_0.html` 修订版通过最终确认，提升为当前 UI final authority。该 final authority 包含 `DEC-20260715-001` 的严格合版边界、`DEC-20260717-001` 的 TT Start v23 开屏方案，以及 `DEC-20260717-002` 的局部修订：主页去顶部标题、设置页小字 / 数值右侧对齐。章节目录、大章结束页、小节结束页仍不在 final authority 内，继续 pending。
- 生效范围：UI 设计验收、Android/Web UI 接入、后续 QA 视觉核对、资源审计任务
- 覆盖旧规则：覆盖所有把 XoXo 候选版视为待确认草稿的口径；不覆盖 TT App Icon 的待确认状态
- 执行要求：PM 将 `TASK-20260715-001` 标记为完成；UI 侧继续执行 Android 当前资源与 final authority 的缺漏/冗余审计，不得借审计重新设计已确认页面

### DEC-20260717-002
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一确认
- 决策内容：XoXo UI 权威候选版中，开屏 / Start 页采用 TT 的 Start v23 方案，XoXo 候选版不需要保留自己的开屏图作为权威页；主页去掉顶部标题，因为该标题字体与 TT 开屏页标题不一致；设置页各行的小字 / 数值放到右侧；除上述修订点外，其他页面通过。
- 生效范围：`TASK-20260715-001` UI 权威候选版修订、XoXo 合版文件、后续 UI authority 确认
- 覆盖旧规则：覆盖 XoXo 候选版中自带开屏页作为权威页的表述；不覆盖 TT Start v23 接入决策 `DEC-20260717-001`
- 执行要求：XoXo 只做上述局部修订，不重新设计已通过页面；章节目录、大章结束页、小节结束页继续保持 pending

### DEC-20260717-001
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一确认
- 决策内容：TT 的 Start 页 v23 分层方案可进入开发接入。采用 `design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png` 作为干净底图，`start_title_overlay_v23.svg` 作为静态标题层，`start_button_static_v23.svg` 作为 START 层，并由开发用原生 alpha 动效实现 `0.68 -> 1.00 -> 0.68`、`1.6s` 循环呼吸。Start 页是开场海报入口，不承载 Continue / Chapter / Gallery / Settings 菜单。
- 生效范围：TT Start v23 开发接入任务、Android Start 页实现、后续 Start 页 QA 验收
- 覆盖旧规则：覆盖旧 Start 页上五按钮菜单或两套 Start 页并存的实现口径；不覆盖 App Icon 候选结论
- 执行要求：yiyi 只接入 Start v23 分层方案，保留现有叙事路由，不处理 App Icon，不改 XoXo UI authority candidate，不扩展到章节目录、大章结束页或小节结束页

### DEC-20260715-001
- 时间：2026-07-15
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一确认
- 决策内容：UI 权威合版以 `design/NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` 为唯一母版；只从后续文件中拼入已明确通过的页面，不进行重设计。`NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` 仅采用主页、开场白、名字设置、大章开始、小节开始和弹窗；其大章/小节结束页、长旁白、剧情回顾均不采用。长旁白与剧情回顾采用 `NagisHeart_LongNarration_StoryRecap_Redesign_Lulu_v1_0.html` 的结构，但统一为母版的冷色体系。
- 生效范围：UI 权威合版、XoXo 设计任务、后续开发与测试的视觉依据
- 覆盖旧规则：覆盖 `design/CoCo_Design_Handoff_20260713.md` 中把未通过的大章/小节结束页视为可用定稿、或把 Missing Pages 整体视为系统页权威的表述
- 执行要求：XoXo 只做拼接、替换、删减、对齐和结构整理；大章/小节结束页及章节目录最终样式保持待确认，不得在本任务中自行补设计

## 字段说明

- `编号`：唯一编号，建议格式如 `DEC-20260715-001`
- `时间`：决策落账时间
- `项目`：默认填 `NagisHeart`
- `来源`：默认写 `Ant大小姐 / PM 一一确认`
- `决策内容`：最终拍板内容
- `生效范围`：影响哪些模块、文件、角色
- `覆盖旧规则`：如果有，写明被覆盖项；没有写 `无`
- `执行要求`：需要谁执行、执行到什么程度

---

## 记录模板

### DEC-YYYYMMDD-XXX
- 时间：
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一确认
- 决策内容：
- 生效范围：
- 覆盖旧规则：无
- 执行要求：

---

### DEC-20260717-013
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐实机视觉反馈 / PM 一一派发 `TASK-20260717-011` / XoXo UI authority 补齐
- 决策内容：章节开始 / 小节开始页必须在文字组后增加很浅的透明雾面托底，解决实机背景上可读性不足；大章结束 `CHAPTER CLEAR` 与小节结束 `SECTION CLEAR` 采纳并修订历史 Missing Pages 的轻玻璃过渡页方向，提升为当前可实现 UI authority；顶部标题 chip 与跳过 / 下一章 / 继续下一节 action chip 必须使用 final glass HUD 语言，不得由 Android 临时发明厚重按钮或系统默认样式。章节目录仍 pending。
- 生效范围：`design/NagisHeart_UI_Authority_XoXo_v1_0.html`、`design/NagisHeart_UI_Authority_Merge_Record_20260715.md`、`00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`、yiyi 后续 Android UI 接入任务。
- 覆盖旧规则：覆盖 `DEC-20260717-003` 中“大章结束页 / 小节结束页仍 pending”的部分；不覆盖章节目录 pending、TT Start、App Icon、story/script、BG mapping、资源删除边界。
- 执行要求：yiyi 后续实现章节开始/结束与标题/action chip 时必须按 XoXo 更新后的 authority/spec；不得自行补章节目录，不得改 story/script 或 BG mapping。

### DEC-20260717-014
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一确认
- 决策内容：任何设计、交互、剧情、BG mapping、资源口径或技术规则变化，只要被 PM 接受为 review / authority / 可开发依据，就必须同步到 `00_harness/08_authority_current/` 对应权威目录；未完成权威同步前，不得派开发按该变化实现。
- 生效范围：`00_harness/07_scheduler/PM_LOOP.md`、`00_harness/07_scheduler/WORKER_LOOP.md`、所有设计/开发/PM 任务分派与回传。
- 覆盖旧规则：补强现有 loop 规则；不改变 Ant 最终确认权。
- 执行要求：PM_LOOP 分派开发任务前必须检查 `08_authority_current` 是否已更新；WORKER_LOOP 回传设计或规则变化时必须写明权威同步状态；开发者默认读取 `08_authority_current`，不得按历史 handoff、旧草稿、聊天截图或未同步状态报告实现。

---

### DEC-20260717-015
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐实机反馈 / PM 一一派发 `TASK-20260717-014` / XoXo UI authority patch
- 决策内容：高亮/复杂背景下，顶部 HUD 必须作为统一 final glass HUD 系统实现：back、auto、save、backlog/menu 等 icon button 不得裸白线直接压背景，必须与 title chip、action chip 共用轻玻璃 backing、描边、shadow/halo 与 blur/fallback 规则；底部 dialogue speaker/name 保留金色方向，但提亮为 `#E4CA8F` 并增加仅包住文字的小型轻衬底、gold 轻描边、text shadow 与 halo，以保证亮/复杂背景上的可读性。
- 生效范围：`design/NagisHeart_UI_Authority_XoXo_v1_0.html`、`design/NagisHeart_UI_Authority_Merge_Record_20260715.md`、`00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 15、`00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`、`00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`、yiyi 后续 HUD/dialogue readability 实现。
- 覆盖旧规则：覆盖此前可能允许 HUD icon button 裸线显示的口径；不覆盖章节目录 pending、TT Start、App Icon、story/script、BG mapping、Android/Web 代码和资源删除边界。
- 执行要求：yiyi 后续实现 HUD icon/title/action chip 与 speaker/name 可读性时必须以 `08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 15 为准；不得自行改成厚系统按钮、整条黑底 name plate 或 Material 默认按钮。

---

### DEC-20260717-016
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一确认
- 决策内容：在测试资源有限、Ant大小姐本人承担真机主验收的阶段，UI 设计和 UI 开发必须采用“谨慎变更”流程。任何 UI 调整都必须先核对最新 `08_authority_current/04_ui/`，判断是实现偏差还是权威需要修订；若权威需要变化，先由 UI owner 更新 authority 并通过 PM review，再派开发。开发接到 UI 修改任务时，必须先确认权威文件、具体改动目标范围、预期视觉效果和禁止范围，不能按截图、聊天印象或旧 handoff 自行重设计。
- 生效范围：`00_harness/07_scheduler/PM_LOOP.md`、`00_harness/07_scheduler/WORKER_LOOP.md`、后续所有 UI 设计任务、Android/Web UI 实现任务、PM review 与 worker 回传。
- 覆盖旧规则：补强 `DEC-20260717-014` 权威同步硬规则；不改变 Ant 最终确认权，也不阻止 PM 在实机反馈后拆分 UI owner / developer 任务。
- 执行要求：PM 分派 UI 开发任务前必须写明 authority_current 文件与章节、目标范围、预期效果和禁止范围；开发者回传必须写明已读取的 authority_current、实现范围、未触碰范围、fallback 和仍需真机确认点。缺少这些条件时，开发者应先回报阻塞，不得先动手试调。

---

### DEC-20260717-017
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：PM 一一派发 `TASK-20260717-016` / XoXo UI authority patch
- 决策内容：章节目录从 pending 转为当前 review authority，采用系统级 dark glass 目录页：主容器 `catalog-panel`，三段式标题说明 / 章节列表 / 返回与继续动作；第一版只表达章节、小节、当前进度、解锁、完成、锁定状态，不扩展成成就、CG、评分或复杂图谱系统。Dialog 在 Android 无真实 frosted background blur 时使用固定 fallback token：card `rgba(27,36,54,0.56)`（允许 0.52~0.60）、scrim `rgba(9,14,24,0.38)`（允许 0.34~0.42）、border `rgba(255,255,255,0.14)`、shadow `0 18dp 42dp rgba(0,0,0,0.36)`；禁止继续凭感觉调 alpha，禁止 80% 以上厚重深色大卡、系统默认 Dialog、纯黑/纯白实底、会模糊弹窗自身内容的 RenderEffect。
- 生效范围：`design/NagisHeart_UI_Authority_XoXo_v1_0.html`、`design/NagisHeart_UI_Authority_Merge_Record_20260715.md`、`00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 16、`00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`、`00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`、后续 yiyi / Wewe 章节目录和 Dialog fallback 实现。
- 覆盖旧规则：覆盖此前“章节目录 pending”的口径；收紧 section 11 中 Android 无真 blur fallback 不够明确的部分。不覆盖 Start/Home/Settings/Story 已通过页面、HUD/speaker section 15、TT Start、App Icon、story/script、BG mapping、Android/Web 代码或资源删除边界。
- 执行要求：后续开发以 `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 16 为准；超出 fallback alpha 范围或需要改变 Dialog 布局/字号/位置时必须回 UI/PM 复核。

---

### DEC-20260717-018
- 时间：2026-07-17
- 项目：NagisHeart
- 来源：Ant大小姐实机反馈 / PM 一一同步交互 authority
- 决策内容：交互设计文档新增 2026-07-17 实机反馈补丁：剧情回顾必须作为分页回看，不再纵向滚屏；移动端默认左右滑动换页，不显示“上一页 / 下一页”文字按钮，只允许轻量页码 indicator；“跳过本节”确认后进入当前小章节结束页；章节目录交互边界为当前大章下小章节列表，状态为未解锁 / 进行中 / 已完成 / 已跳过完成；autoAdvance、`->`、空白选项等只作为引擎路由，不得作为玩家可见选项；章节 / story gameplay 页面默认使用 dark 可读性策略。
- 生效范围：`design/NagisHeart_Interaction_Design_v1_0.md` section 30、`00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md` section 30、后续 yiyi / Wewe 对剧情回顾、跳过本节、章节目录、选项过滤、主题可读性的实现。
- 覆盖旧规则：覆盖交互文档旧 section 14 中“Backlog 可上下滑动查看”的口径；补强 section 29 中剧情回顾、章节目录与章节流程页规则；不覆盖 UI 视觉 token，视觉 token 仍以 `04_ui` authority 为准。
- 执行要求：开发 UI / 交互任务必须同时读取 interaction section 30 与对应 UI MinSpec；若两者冲突，先回 PM 复核，不得按截图或旧 handoff 自行实现。

---

### DEC-20260718-001
- 时间：2026-07-18
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一清理
- 决策内容：为避免新旧视觉资源混淆，将已明确废弃或无主动引用的资源从活跃路径移入 `00_harness/99_archive/obsolete_assets/20260718_cleanup/`，不做不可逆删除。清理范围包括 TT Start 长屏 V1 / V2 / V3 被打回候选包，以及 Android 活跃路径中的旧 `splash_start.png`、`splash_title.png`、`poster_start_nagis_heart_keyart.jpg`。当前 Start 长屏有效参考保留为 `design/authority/icon_start_tt/start_long/rethink/`；当前 Start 实现权威仍为 TT Start v23 layered resources。
- 生效范围：`design/authority/icon_start_tt/start_long/`、`android/app/src/main/res/drawable-nodpi/`、`android/app/src/main/assets/bg/`、`00_harness/99_archive/obsolete_assets/20260718_cleanup/`、后续所有开发和设计任务。
- 覆盖旧规则：覆盖此前“旧 Android Start 资源 keep for now”的临时口径；不覆盖当前 TT Start v23、Start Strategy A / rethink、UI authority、story/script、BG mapping 或 Web/Android 正在实现的有效文件。
- 执行要求：开发者不得从 archive 中直接引用资源；若需要恢复，必须由 PM 开 restore task 并记录为什么当前 authority 需要改变。

---

### DEC-20260718-002
- 时间：2026-07-18
- 项目：NagisHeart
- 来源：Ant大小姐 / PM 一一确认
- 决策内容：清理 / 归档判断正式纳入 harness loop。每次 PM_LOOP 收口、每个 WORKER_LOOP 任务回传、以及每个基础循环结束前，都必须判断是否存在被打回、废弃、过期、重复、易误用的文件或资源；无清理也要明确写 `Cleanup status: none`。需要保留追溯但不得作为开发依据的内容，应移入 `00_harness/99_archive/` 并写明原因、日期、替代活跃路径和禁止引用规则。
- 生效范围：`00_harness/07_scheduler/PM_LOOP.md`、`00_harness/07_scheduler/WORKER_LOOP.md`、`00_harness/07_scheduler/LOOP_OVERVIEW.md`、后续所有 PM 分派、worker 回传、PM review、状态快照和交班。
- 覆盖旧规则：补强 `DEC-20260718-001`，从一次性清理扩展为每轮必检流程；不改变“不可未经确认永久删除资源”的原则。
- 执行要求：PM 每轮必须做清理 / 归档判断，并在需要时更新 PM review、decision log、task_board、latest_status_snapshot；执行者每次回传必须写 cleanup status / candidates / done。开发者不得引用 archive；未经 PM 授权不得自行删除或扩大清理范围。

---

### DEC-20260718-003
- 时间：2026-07-18
- 项目：NagisHeart
- 来源：Ant大小姐确认 / PM 一一核对 TT icon package
- 决策内容：App Icon 使用 Ant大小姐确认的“第三版”，即 TT icon 总览图 `design/authority/icon_start_tt/icon/previews/icon_overview_contact_sheet.png` 顶部第三张 / 右上 `rounded rect mask preview`。TT authority package 中对应开发资源准确名称为 `rounded rect v2 decorated`，主文件为 `design/authority/icon_start_tt/icon/master/app_icon_tt_candidate_1024.png`，Android legacy mipmap exports 位于 `design/authority/icon_start_tt/icon/android_mipmap/mipmap-*/ic_launcher.png`，adaptive foreground/background exports 位于 `design/authority/icon_start_tt/icon/android_adaptive/*/`。当前 Android launcher icon 用错，必须按此 authority 修正。
- 生效范围：`design/authority/icon_start_tt/`、`android/app/src/main/res/mipmap-*/`、`android/app/src/main/res/mipmap-anydpi-v26/`、`android/app/src/main/AndroidManifest.xml`、后续 Android/Web icon 接入任务。
- 覆盖旧规则：覆盖此前 `TASK-20260715-002` 中 “App Icon 等待 Ant大小姐最终确认” 的状态；不覆盖 Start 长屏 Strategy A、HUD/dialog/chapter UI、story/script、BG mapping、BGM。
- 执行要求：yiyi 按 `TASK-20260718-002` 修正 Android launcher icon；开发不得自行选择其他 icon 版本，不得从 archive 引用资源；旧 launcher icon 如需清理，先作为 cleanup candidates 回报 PM。
- 二次确认：Ant大小姐 2026-07-18 再次确认“就是这个”，指向 TT icon 总览图顶部第三张 / 右上 `rounded rect mask preview`。

---

### DEC-20260718-004
- 时间：2026-07-18
- 项目：NagisHeart
- 来源：Ant大小姐确认 / PM 一一静态核验
- 决策内容：BGM 不再作为“是否接入首版”的待决任务。项目已存在 `assets/bgm.mp3`，Android 已有 `BgmManager`、设置页音量项、用户设置持久化与 `GameViewModel` 读取 scene visual `bgm` 并播放的逻辑；后续只需随构建/实机做常规验证。
- 生效范围：`TASK-20260716-001`、Android BGM 播放逻辑、后续 current priorities。
- 覆盖旧规则：覆盖 `TASK-20260716-001` 的 ready 待决状态；不表示后续不能调整 BGM 内容或音量体验，只表示“是否接入”已不是开放问题。
- 执行要求：PM 将 `TASK-20260716-001` 标记为 done；后续若出现 BGM 体验问题，另开具体修复任务。

---

### DEC-20260718-005
- 时间：2026-07-18
- 项目：NagisHeart
- 来源：Ant大小姐确认 / PM 一一调整 Wewe 任务口径
- 决策内容：Web 版本已经存在 MVP，因此 Wewe 不再只做“入职只读审计”。Web 任务升级为基于已有 `web/` MVP 的 overnight implementation pass，目标是在 Ant大小姐明早醒来前尽量交付可打开、可验证、按当前 authority 明显前进的 Web 版本开发回报。
- 生效范围：`TASK-20260717-012`、`TASK-20260718-003`、`web/`、`design/NagisHeart_Web_Architecture_v1_0.md`、`00_harness/08_authority_current/`、Wewe 后续 Web 开发任务。
- 覆盖旧规则：覆盖 `TASK-20260717-012` “第一轮只读、不改代码”的旧口径；不覆盖 Android yiyi 任务、不允许 Wewe 修改 Android/story-data 正文/BG mapping 权威/authority_current。
- 执行要求：Wewe 醒来后直接执行 `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_WEWE_20260718_WEB_MVP_OVERNIGHT_IMPLEMENTATION.md`；必须先读 authority_current，再按 P0-A 到 P0-E 顺序实现；完成后写 `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_mvp_overnight_20260718.md`，包含运行方式、验证结果、剩余差异和 cleanup status。
# DEC-20260718-018 - Android owner transfer and QA roster update

- 日期：2026-07-18
- 决策人：PM 一一 / Ant大小姐
- 决策内容：`yiyi` 标记为离职 / inactive，不再接收新任务；`PP` 正式接替 yiyi 成为当前 Android 开发工程师；`DeDe` 作为 Codex 侧正式 QA 恢复使用，必须在真正仓库 `D:\Nagi's Heart\NagisHeart` 工作并遵守 Harness / Loop。
- 生效范围：agent roster、任务分派、Android 开发任务、QA 任务、PM inbox/outbox、task board。
- 执行要求：后续 Android 实现任务默认派给 PP；yiyi 仅保留历史报告引用，不再作为 active owner；DeDe 只读测试并输出 QA 报告，不直接改代码。
- 相关文件：`00_harness/00_project/agent_registry.md`、`README_AI.md`、`TASKS.md`、`00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_DEDE_20260718_CODEX_QA_REBOOT_AND_WEB_MOBILE_REGRESSION.md`

---
---

## DEC-20260719-001 — Android real-device feedback authority override

- Date: 2026-07-19
- Decider: Ant 大小姐 / PM 一一
- Status: accepted

### Decision

The 2026-07-19 Android real-device feedback supersedes earlier rules that caused implementation drift:

1. Backlog / 剧情回顾 opens on the first page, not the latest / last page.
2. Backlog pagination must fit visible content; fixed 8 entries per page is not allowed when text clips.
3. Normal flow removes standalone Section Clear / 小章节结束页. Section body should go directly to the next section opening, while chapter ending remains.
4. Skip-section confirmation no longer lands on current Section Clear; it lands on next section opening, chapter ending, or ending flow depending on position.
5. Ending page is a terminal flow and must unlock gallery immediately. It must not resume normal story after display.
6. Ending page UI is missing from current final authority and must be designed by XoXo, then confirmed by Ant before development implementation.
7. Dialog/HUD/readability fixes must be based on latest `08_authority_current` plus explicit Android no-real-blur fallback. Developers must provide authority-to-code comparison before claiming fixed.

### Files

- `00_harness/08_authority_current/01_product/NagisHeart_PRD_v2_0.md`
- `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
- `design/NagisHeart_PRD_v2_0.md`
- `design/NagisHeart_Interaction_Design_v1_0.md`
- `00_harness/05_reports/validation/PM_REVIEW_ANDROID_REAL_DEVICE_FEEDBACK_20260719.md`

### Cleanup status

None. This decision changes authority rules and task scope only.

---

## DEC-20260719-002 — Mandatory alignment and code-review gate

- Date: 2026-07-19
- Decider: Ant 大小姐 / PM 一一
- Status: accepted

### Decision

Repeated Android UI failures are treated as an information-alignment and code-review process failure, not merely as individual developer mistakes.

For UI / interaction / story-flow / routing / progress / gallery implementation tasks:

1. Developers must produce a pre-implementation alignment table before coding.
2. Developers must produce a post-implementation code-review table before PM sends the task to QA / Ant verification.
3. PM must block implementation when authority is missing, stale, contradictory, or not synchronized to `08_authority_current`.
4. If real-device output still shows old behavior after a reported fix, PM must explicitly check for stale APK, wrong build variant, duplicate component path, inactive code path, missing authority detail, or implementation mismatch.
5. XoXo/UI authority updates must include developer-readable token / fallback / acceptance checklist, not only visual direction.

### Files

- `00_harness/07_scheduler/PM_LOOP.md`
- `00_harness/07_scheduler/WORKER_LOOP.md`
- `00_harness/07_scheduler/LOOP_OVERVIEW.md`
- `00_harness/06_templates/tpl_alignment_code_review_gate.md`
- `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_PP_20260719_ANDROID_MAIN_FLOW_LOGIC_AND_UI_AUDIT.md`
- `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_XOXO_20260719_ANDROID_READABILITY_ENDING_UI_AUTHORITY.md`

### Cleanup status

None. This is a process gate update.

---

## DEC-20260719-003 — XoXo Android readability / ending UI authority candidate tokenization

- Date: 2026-07-19
- Decider: XoXo acting under PM 一一 task `TASK-20260719-001`
- Status: review authority candidate / pending PM + Ant confirmation

### Decision

XoXo updated the current UI authority candidate so the 2026-07-19 Android real-device feedback is no longer expressed only as visual direction. The affected UI components now carry developer-readable tokens and an implementation alignment checklist:

1. Global text-over-image readability backing uses stronger light-glass tokens instead of naked text or thick black/white cards.
2. HUD title chip, icon buttons, and skip/action chip must share one final glass HUD family with explicit shape / alpha / border / shadow / icon halo values.
3. Dialog Android no-real-blur fallback is cut-corner, weak-border, inner-highlight glass; rounded rectangle hard-line-frame styling is prohibited.
4. Long narration text width matches the bottom single-line narration body width: outer 18dp, inner 20dp, text width = screen width - 76dp.
5. Ending page is added as a terminal final-candidate page with ending tag, title, subtitle, description, unlock feedback, return home, gallery, replay ending, and related chapter actions.
6. Standalone Section Clear / 小章节结束页 is removed from the current product UI scope; historical Section Clear UI authority is superseded by PRD section 21 and Interaction section 31.

### Files

- `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`

### Gate

PP must use the alignment / code-review gate before any implementation. If active Android component paths are ambiguous, stale build risk is present, or the authority tokens cannot be implemented without inventing UI, PP must report blocked instead of guessing.

### Cleanup status

None. This decision changes UI authority candidate and developer alignment requirements only; no resource deletion is authorized.

---

## DEC-20260719-003 — Release-readiness code health review gate

- Date: 2026-07-19
- Decider: Ant 大小姐 / PM 一一
- Status: accepted

### Decision

The project has gone through many implementation and design revisions. Before treating Android or Web as release-ready, PM must run a release-readiness code health review gate.

This review is broader than a per-task diff check. It must evaluate:

1. overall code design and maintainability;
2. duplicate or parallel implementations of the same screen/component;
3. obsolete active code paths left behind by old versions;
4. conflicting rules between PRD, interaction authority, UI authority, story-data, and runtime code;
5. state-machine / routing / progress / save / gallery unlock risks;
6. resource path conflicts, stale assets, and archive leakage;
7. build/install freshness and QA traceability.

No worker may use this review as permission for broad refactoring. The first pass is audit-only. Any cleanup or refactor must become a scoped follow-up task with PM approval.

### Files

- `00_harness/05_reports/validation/PM_RELEASE_READINESS_CODE_REVIEW_PLAN_20260719.md`
- `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_PP_20260719_ANDROID_CODE_HEALTH_AUDIT.md`
- `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_WEWE_20260719_WEB_CODE_HEALTH_AUDIT.md`

### Cleanup status

None. This creates a release gate and audit tasks only.

---

## DEC-20260719-004 — Android Dialog / HUD root cause handling

- Date: 2026-07-19
- Decider: PM 一一, responding to Ant real-device feedback
- Status: accepted

### Decision

The repeated Android Dialog / HUD mismatch must be treated as an active-path and authority-alignment failure, not as another blind visual-tuning task.

PM static investigation found:

1. `NagiDialog.kt` still uses old section 16.5-style `RoundedCornerShape(24.dp)` / 14% border / rounded shadow, while current UI authority section 17.3 requires cut-corner weak-border glass and explicitly prohibits the rounded rectangle line-frame look.
2. `NagiHud.kt` title chip and `GameScreen.kt` skip/action chip still use weaker old glass tokens and are not centralized.
3. System-screen headers such as Backlog / Chapter / Settings / Save / Gallery do not all share one navigation/header component, so a fix to `NagiHud` alone cannot guarantee global navigation consistency.
4. Future Android UI implementation must include active component proof, authority token comparison, and stale APK / wrong build variant checks before being marked review.

### Files

- `00_harness/05_reports/validation/PM_INVESTIGATION_ANDROID_DIALOG_HUD_ROOT_CAUSE_20260719.md`
- `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_PP_20260719_ANDROID_DIALOG_HUD_ROOT_CAUSE_ADDENDUM.md`

### Cleanup status

None. Investigation and process decision only; no code or resource deletion authorized.
# DEC-20260719-006 - Implementation tasks require hard alignment gate before coding

- Date: 2026-07-19
- Owner: PM 一一
- Trigger: Ant reported repeated Android implementation failures where workers claimed fixes but real-device behavior remained old or incomplete. PP also acknowledged it skipped referenced MinSpec sections and started coding before completing full section comparison.
- Decision:
  - Any Android/Web implementation task touching UI, interaction, story flow, routing, persistence, gallery unlocks, or other visible behavior must use the alignment/code-review gate.
  - High-risk, multi-section, or previously failed tasks must complete a pre-implementation alignment table and wait for PM approval before coding.
  - PM must expand vague scope such as `where relevant` into explicit section-by-section checklist, or require the worker to do so before coding.
  - Missing a referenced authority section is a failed task, even if some code changes are correct.
  - Post-implementation review must include active runtime path proof, duplicate/stale path check, build/install freshness proof, forbidden-scope confirmation, and cleanup status.
- Numbering note: this section is 24, not 23. MinSpec had no section 23 (highest was 22), yet TASK-20260723-002 tells Sai to implement 大章开始 / 大章结束 / 结局页 per "section 23" - that spec was never written into the authority MinSpec, and its direction (flat dark, no glass card) contradicts the still-standing MinSpec 14.2 clear-card and 18.1 ending-card. Section 23 is left reserved for that missing spec so the board pointer does not land on recap typography. Gap flagged to Ant; not fixed here.
- Files updated:
  - `00_harness/06_templates/tpl_alignment_code_review_gate.md`
  - `00_harness/07_scheduler/WORKER_LOOP.md`
  - `00_harness/07_scheduler/PM_LOOP.md`
- Impact: Applies immediately to PP / Wewe / any future implementation worker.

# DEC-20260721-001 - Task board sweep, QA model change, and MinSpec 21.2 record correction

- Date: 2026-07-21
- Owner: feibo (CTO) / approved by Ant
- Trigger: Ant directive "任务要关掉，文件信息要对齐" after weekend off-harness work made most board entries stale.
- Decision:
  - Agent QA is discontinued. Ant's own real-device / browser testing is the only acceptance gate. Dev deliverables should be screenshots/comparison images, not text claims.
  - Task board swept: 34 historical tasks closed (closed-done / closed-superseded / closed-cancelled) and archived to 02_planning/task_board_archive_20260715_20260721.md with a one-line reason ledger on the active board.
  - MinSpec section 21.2 row 4 (BacklogScreen "已通过") is a falsified record: Ant 07-20 real-device retest still shows last-line clipping. Row corrected in authority/ui/XoXo_UI_Final_MinSpec_20260712.md; rework tracked as TASK-20260721-002. MANIFEST hash updated in the same commit per authority iron rule 2.
  - Confirmed still-open items re-verified in code before keeping: TASK-20260719-016 locked-title privacy NOT fixed (ChapterScreen.kt renders real title when locked); icon V4 safezone IS integrated (res hash matches package); gradlew does not exist (0717-004 cancelled).
- Files updated: 02_planning/task_board.md, 02_planning/task_board_archive_20260715_20260721.md, 02_planning/current_priorities.md, authority/ui/XoXo_UI_Final_MinSpec_20260712.md, authority/MANIFEST.md, TASKS.md
- Cleanup status: none (archive only, no deletion).

# DEC-20260721-002 - Harness rules v2 reset (lightweight)

- Date: 2026-07-21
- Owner: feibo (CTO) / directed by Ant
- Trigger: Ant directive: clean slate — drop all historical baggage, work only from current authority versions and current state; old harness/loop rules must be cleared and replaced with lightweight rules before any dev work.
- Decision:
  - Harness v1 retired entirely: role handbooks (00_project), shift handoffs (03_handoffs), PM inbox/outbox mailbox (04_execution), templates (06_templates), loop/scheduler (07_scheduler), governance inbox, PM sync/status files, separate current_priorities file. All archived to 99_archive/harness_v1_retired_20260721/ read-only.
  - New single rulebook: 00_harness/README.md (roles, four ledgers, task lifecycle, session startup, commit rules, red lines). Priorities folded into task_board.
  - Four ledgers only: authority/ (MANIFEST), task_board.md, decision_log.md, 05_reports/<task-id>/ evidence. Process chatter lives in commit messages, never in new files.
  - No new dev_reply / status / PM_REVIEW / TASK_TO_* files may be created.
  - History is not to be relitigated: archives and old handoff/design process files are read-only and carry no authority.
- Files updated: 00_harness/README.md (rewritten), README_AI.md, TASKS.md (rewritten slim), 02_planning/task_board.md, PROJECT_STRUCTURE.md
- Cleanup status: archive-only moves, no deletion.

# DEC-20260721-003 - PM role reinstated within rules v2

- Date: 2026-07-21
- Owner: Ant (directive) / feibo (implementation)
- Decision:
  - PM 一一 is reinstated as an in-rules executor: task board operations (open/update/close ledger), dispatching to workers, evidence collection, routine review, priorities sync.
  - feibo (CTO) narrows to top-level only: rules, architecture, major reviews, infrastructure tooling. No day-to-day board ops.
  - PM is fully bound by rules v2: works only inside the four ledgers; may not create process files (no task sheets, dev replies, review files); v1 PM workflows in 99_archive stay retired.
  - Board reassignments: TASK-20260721-003 (V3_1 audit) -> PM 一一 exec / feibo guide; TASK-20260719-004 (code health) -> PP exec / feibo gate.
- Files updated: 00_harness/README.md, README_AI.md, 02_planning/task_board.md

# DEC-20260722-001 - Final ending node BG mapping

- Date: 2026-07-22
- Owner: Ant / PM 一一
- Trigger: Ant found that Gallery ending backgrounds except TRUE END were wrong, and that the authority BG mapping did not explicitly list the final `end_*` nodes.
- Decision:
  - Add explicit final ending node BG mappings to `authority/visual_mapping/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md`.
  - `end_true` uses `assets/bg/true_end.jpg`.
  - `end_good` uses `assets/bg/king.jpg`.
  - `end_normal` uses `assets/bg/ending_true_nagi_soft_gaze.jpg`.
  - `end_bad` uses `assets/bg/goal_faraway.jpg`.
  - Runtime and Android Gallery must use final ending node BG as source of truth. They must not substitute the scene background that happened to be active before the ending node.
- Files updated:
  - `authority/visual_mapping/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md`
  - `authority/MANIFEST.md`
- Cleanup status: none.

# DEC-20260722-002 - Replace c2 holiday message script and runtime story split

- Date: 2026-07-22
- Owner: Ant / PM 一一
- Trigger: Ant supplied a rewritten `c2 | 假期的消息` scene and requested it replace the prior c2 story, then be split into runtime story-data so it takes effect in app builds.
- Decision:
  - Replace the `### --- c2 | 假期的消息 ---` section in `authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md` with Ant's new version.
  - Keep existing runtime split shape: `c2` contains the opening holiday-message setup and first choice; `c2_s2` contains the expanded confession / apartment / 一一 negotiation sequence and the two final choices.
  - Preserve existing route semantics: first c2 choice targets `c2_s2`; after final c2_s2 choice responses, existing `flow.default.c2_s2 → e_invite` continues the story.
  - Do not change BG mapping, chapter starts, variables, or surrounding nodes in this update.
- Files updated:
  - `authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md`
  - `story-data/nodes.json`
  - `authority/MANIFEST.md`
- Validation: `node tools/validate.js` passed with 0 errors / 1 existing hardcoded-Ant warning.
- Cleanup status: none.

# DEC-20260722-003 - Replace e_invite apartment invitation script and runtime split

- Date: 2026-07-22
- Owner: Ant / PM 一一
- Trigger: Ant supplied a rewritten `e_invite | 高级公寓的邀请` scene and requested it replace the prior version.
- Decision:
  - Replace the `### --- e_invite | 高级公寓的邀请 ---` section in `authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md` with Ant's new version.
  - Runtime split: keep `e_invite` as the main apartment visit node through the two player choices; add `e_invite_s2` for the common post-choice visitor-access / temporary-door-permission sequence, then auto-advance to `e_lolly`.
  - Both `e_invite` player choices target `e_invite_s2`; `e_invite_s2` auto-advance targets `e_lolly`.
  - Do not change BG mapping, chapter starts, variables, or unrelated nodes in this update.
- Files updated:
  - `authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md`
  - `story-data/nodes.json`
  - `authority/MANIFEST.md`
- Validation: `node tools/validate.js` passed with 0 errors / 1 existing hardcoded-Ant warning.
- Cleanup status: none.

# DEC-20260723-001 - Replace e_depart NEL departure script and runtime split

- Date: 2026-07-23
- Owner: Ant / PM 一一
- Trigger: Ant supplied a rewritten `e_depart | NEL启程·闭关送别` scene and requested it replace the prior version.
- Decision:
  - Replace the `### --- e_depart | NEL启程·闭关送别 ---` section in `authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md` with Ant's new version.
  - Runtime split: `e_depart` contains the NEL notice / departure waiting sequence and first two choices; `e_depart_s2` contains the common apartment-preservation section,玄关靠肩 section, and second two choices; `e_depart_s3` contains the elevator farewell / apartment aftermath section and auto-advances to `c6a`.
  - Both first-round choices target `e_depart_s2`; both second-round choices target `e_depart_s3`; `e_depart_s3` auto-advance targets `c6a`.
  - Do not change BG mapping, chapter starts, variables, or unrelated nodes in this update.
- Files updated:
  - `authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md`
  - `story-data/nodes.json`
  - `authority/MANIFEST.md`
- Validation: `node tools/validate.js` passed with 0 errors / 1 existing hardcoded-Ant warning.
- Cleanup status: none.

# DEC-20260723-002 - Replace e_lemontea lemon tea date script and runtime split

- Date: 2026-07-23
- Owner: Ant / PM 一一
- Trigger: Ant supplied a rewritten `e_lemontea | 你的，我的` scene and requested it replace the prior version.
- Decision:
  - Replace the `### --- e_lemontea | 你的，我的 ---` section in `authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md` with Ant's new version.
  - Runtime split: `e_lemontea` contains the date setup, first drink-stealing conflict, and first choice; `e_lemontea_s2` contains the height/near-distance teasing sequence and second two choices; `e_lemontea_s3` contains the shared-straw / boundary-blurring aftermath and auto-advances to `c2`.
  - First choice targets `e_lemontea_s2`; both second-round choices target `e_lemontea_s3`; `e_lemontea_s3` auto-advance targets `c2`.
  - Do not change BG mapping, chapter starts, variables, or unrelated nodes in this update.
- Files updated:
  - `authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md`
  - `story-data/nodes.json`
  - `authority/MANIFEST.md`
- Validation: `node tools/validate.js` passed with 0 errors / 1 existing hardcoded-Ant warning.
- Cleanup status: none.

# DEC-20260723-006 - Chapter opening / chapter clear / ending UI authority patch

- Date: 2026-07-23
- Owner: Ant / XoXo
- Trigger: Ant reviewed the local authority HTML in browser and confirmed the final direction for three UI pages: 大章开始, 大章结束, and 结局页.
- Decision:
  - 大章开始 uses a pure dark full-screen poetic divider page, no story BG, no card, no border, no frosted glass.
  - 大章结束 uses the same full-screen divider language but weaker: no BG image, no clear-card, `Chapter Clear` with a short underline, primary action `进入下一章` as no-background text, and weak secondary `返回主页`.
  - 结局页 uses the 大章开始-style full-screen poetic layout with `assets/bg/true_end.jpg`; no ending-card, no frosted glass, no border; `TRUE END` is 18sp UI sans with underline; `Ending unlocked` is removed; only visible action remains `返回主页` as no-background text.
  - These rules are written into `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` section 23 and override old section 14.1 / 14.2 / 18.1 / 18.5 only for these three pages.
  - Android implementation task is assigned to Sai as `TASK-20260723-002`.
- Files updated:
  - `authority/ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
  - `authority/ui/XoXo_UI_Final_MinSpec_20260712.md`
  - `authority/MANIFEST.md`
  - `00_harness/02_planning/task_board.md`
  - `TASKS.md`
- Cleanup status: none. No Android/Web/story-data/BG mapping/resource deletion authorized by this decision.

# DEC-20260723-003 - Sai Android direct UI adjustments synced back to XoXo authority

- Date: 2026-07-23
- Owner: Ant / Sai / XoXo
- Trigger: Sai reported Android UI adjustments that Ant requested directly during implementation in `00_harness/05_reports/TASK-20260723-002/android_direct_ui_adjustments_for_xoxo.md`; XoXo needed to sync the accepted implementation tokens back into authority so design and Android do not diverge.
- Decision:
  - Add `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` section 28 as the latest override for LongNarrationLayer, ChoiceLayer, DialogueLayer, Gallery ending card, and Ending page BG source rules.
  - Long narration uses soft radial backing and light full-screen dim, not a solid black cloud.
  - Choice rows use a horizontal fade-to-transparent background from the second half, with weak border and brighter text.
  - Dialogue box uses a top-to-bottom strengthening gradient: transparent at top, stable at bottom.
  - Gallery ending cards use bottom-only 28% gradient backing, ending tag above title, and ending-specific crop bias values.
  - Ending page layout remains section 23, but background source is the current `end_*` node BG; `true_end.jpg` is TRUE END preview/fallback, not a fixed BG for every ending page.
  - Sync Ant 2026-07-23 BG choices into visual mapping: `c2` / `c2_s2` use `assets/bg/message_in_holiday.jpg`; `e_depart` uses `assets/bg/nel_start.png`.
- Files updated:
  - `authority/ui/XoXo_UI_Final_MinSpec_20260712.md`
  - `authority/visual_mapping/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md`
  - `authority/MANIFEST.md`
- Cleanup status: none. This decision documents existing accepted implementation/design alignment; it does not authorize resource deletion or new Android/Web/story edits.

# DEC-20260723-004 - Add agency setup long narration before e_agency_launch press conference

- Date: 2026-07-23
- Owner: Ant / PM 一一
- Trigger: Ant requested one long-narration addition at the start of `e_agency_launch | 她站在光里`, specifically before `发布会安排在东京`.
- Decision:
  - Insert Ant's supplied long narration about Nagi entering the European league, the rapid growth of interviews/brand/portrait/commercial/media work, and Ant deciding to establish an independent agency for Nagi.
  - Place the new text before the existing first line `发布会安排在东京`.
  - Do not change route, BG mapping, choices, variables, or adjacent story nodes.
  - Runtime story-data inserts the same content as `e_agency_launch_intro001` through `e_agency_launch_intro007` before existing `e_agency_launch_d001`.
- Files updated:
  - `authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md`
  - `story-data/nodes.json`
  - `authority/MANIFEST.md`
- Validation: `node tools/validate.js` passed with 0 errors / 1 existing hardcoded-Ant warning.
- Cleanup status: none.

# DEC-20260723-005 - Gallery four-ending staggered vertical wall authority

- Date: 2026-07-23
- Owner: Ant / XoXo / Sai
- Trigger: Ant reviewed the current Gallery page and rejected the ordinary half-screen thumbnail-list feeling; all ending images are vertical and fixed by ending chapter, so the Gallery should read as a four-ending memory wall.
- Decision:
  - Redesign Gallery as a four-ending staggered vertical-image wall, not a generic CG grid.
  - Gallery displays only TRUE / GOOD / NORMAL / BAD endings in this scope; do not mix ordinary CG or achievement modules into this screen.
  - Use two equal columns, four same-spec vertical cards, light stagger, no scrollbar, and no TRUE featured/main card.
  - Cards use ending node BGs: TRUE=`assets/bg/true_end.jpg`, GOOD=`assets/bg/king.jpg`, NORMAL=`assets/bg/ending_true_nagi_soft_gaze.jpg`, BAD=`assets/bg/goal_faraway.jpg`.
  - GOOD title `那么完美，那么爱他` must remain one line with a smaller title token.
  - Android implementation is assigned to Sai as `TASK-20260723-004`.
- Files updated:
  - `authority/ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
  - `authority/ui/XoXo_UI_Final_MinSpec_20260712.md`
  - `authority/MANIFEST.md`
  - `00_harness/02_planning/task_board.md`
  - `TASKS.md`
- Cleanup status: none. This does not authorize Android/Web/story-data/BG mapping changes except the Android Gallery UI implementation task, and does not authorize resource deletion.

# DEC-20260724-001 - Story recap dialogue excerpt visual distinction

- Date: 2026-07-24
- Owner: Ant / XoXo / Sai
- Trigger: Ant reviewed the story recap page and pointed out that dialogue excerpts should visually differ from narration, matching the VN rule that dialogue and narration use different typography.
- Decision:
  - Add `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` section 26 for story recap dialogue excerpt tokens.
  - Narration in story recap remains title serif, 16sp, line-height 1.92.
  - Dialogue excerpt uses UI sans, 15sp, line-height 1.82, with a light deep-blue horizontal backing, subtle gold radial accent, and a thin left gold line.
  - Speaker label is a source marker only: UI sans 12sp SemiBold, gold, no chip/background/border/click affordance.
  - Android implementation is assigned to Sai as `TASK-20260724-001`.
- Files updated:
  - `authority/ui/XoXo_UI_Final_MinSpec_20260712.md`
  - `authority/MANIFEST.md`
  - `00_harness/02_planning/task_board.md`
  - `TASKS.md`
- Cleanup status: none. This does not authorize story text changes, recap pagination changes, chapter map changes, Gallery changes, Android/Web/BG mapping changes beyond the scoped Android recap dialogue visual implementation, or resource deletion.

# DEC-20260726-001 - Story recap page typography rebuild (drop gold speaker chip)

- Date: 2026-07-26
- Owner: Ant (decision) / lulu (UI design)
- Trigger: Ant real-device review — the dialogue/narration distinction added earlier (gold speaker chip) "looks bad when consecutive dialogue appears"; follow-up: side margins too wide, font too large, spacing too loose, causing heavy line wrapping.
- Decision:
  - The gold speaker chip is removed from the recap page. It was designed for the bottom dialogue box as a once-per-screen accent; in a scrolling log where dialogue is 60-70% of content it degrades gold into background texture, repeats redundantly for consecutive same-speaker lines, and its 24px lead vs 22px paragraph gap is nearly equidistant so it cannot group. Body text was serif 16sp for both modes, so the entire distinction rested on the label.
  - New mechanism: font family + density + five-tier spacing + symmetric inset. Zero decoration (no fill, no border, no blur, no halo).
  - Narration serif 15sp / 1.88 full-bleed; dialogue sans 15sp / 1.68 inset 15 on BOTH sides (one character width) as a quotation block; speaker name plain #D7BE86 12sp/500, collapsed on consecutive same-speaker lines.
  - Five-tier spacing 4 < 8 < 12 < 16 < 28. Rationale recorded in MinSpec 24.5: spacing compensates line-height, so tight text needs a larger gap to separate turns and airy text needs a smaller one. Narration paragraph gap corrected from 22 to 12.
  - Container width fix: `.recap-inner` 78% is abolished for left/right 38 (screenWidth - 76). The 78% squeeze made recap narrower (335) than the dialogue box body (354) - the same defect section 17.4 already banned for long narration but which was never applied to recap.
  - Ant chose symmetric both-side inset over left-only; accepted the resulting dialogue measure of ~21.6 chars/line on the grounds that dialogue lines are short utterances while narration prose was the actual wrapping pain point.
  - MinSpec section 10 typography is superseded; only its background/overlay rules survive. Developers read section 24 only.
  - Pagination: MinSpec 24.7 defers to interaction authority 29.8 / 30.2 / 31.1 (dynamic pagination, no vertical scroll, per-page count not fixed at 8). The in-page verticalScroll workaround shipped under TASK-20260721-002 is explicitly cancelled by this section - feibo had already flagged it as using a rejected interaction to mask a banned clipping. Because this rebuild changes per-item height (15sp, split line-heights 1.88/1.68, five-tier gaps) and makes an item's height depend on its predecessor, pagination must bin-pack by measured laid-out height, not by item count times an estimated row height.
- Files updated: authority/ui/NagisHeart_UI_Authority_XoXo_v1_0.html (.recap-* CSS + screen-story-recap markup), authority/ui/XoXo_UI_Final_MinSpec_20260712.md (section 10 superseded, section 24 added), authority/MANIFEST.md (hashes + revision log), 00_harness/02_planning/task_board.md (PP task)
- Not changed: design/NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html retains its own recap draft. That draft was explicitly marked 不采用 in the authority merge record and is retired history; syncing it would duplicate authority content and violate iron rule 1.
- Cleanup status: none. Temporary render copy authority/ui/_tmp_recap_render.html was created for headless screenshot verification and deleted in the same step.
# DEC-20260726-002 - Start v23 static vignette overlay + START gold rule reinforcement

- Date: 2026-07-26
- Owner: Ant / XoXo / TT / Claude(Android)
- Trigger: Ant asked for the Start v23 vignette overlay (XoXo C-spec) after Sai could not make it adapt across screen sizes. During verification the V23 START gold rules measured 1.29:1 contrast against the vignette-darkened backdrop and read as missing; TT ruled on new gold rule parameters.
- Decision:
  - Add a static vignette overlay to Start v23 in `SplashScreen.kt`. C-spec values implemented as given: colour `#08080C`, radial centre 50%/39%, inner 31%, outer 72%, max alpha 0.56, sides 0.30, top 0.12, bottom 0.71.
  - Screen-size handling: the vignette is drawn at `fillMaxSize` so devices taller than 9:16 get no un-dimmed bands, while the radial centre is anchored to the 9:16 UI safe layer and the radius is derived from the real pixel distance to the farthest corner. The single safe layer was split into two identically-positioned boxes so the vignette can sit between the title and START layers.
  - Layer order is bg -> vignette -> title -> START. The verbal brief placed the vignette above the title; Ant directed that the title render above the vignette so the wordmark keeps full brightness. This is **not** a deviation: TT's `TT_Icon_Start_Authority_Spec_v1_0.md` gold ornament preservation rule explicitly sanctions it — "if the vignette layer dims the title ornament too much, either place the full title layer above the vignette or redraw/duplicate only the gold ornament lines above the vignette". The first option was taken.
  - Title layer lifted by 7% of safe-layer height (`titleLift = 0.07f`), independent of START, which keeps its v23 position and breathing animation.
  - TT ruling on the START gold rules: `#a0784c` -> `#b18a58`, `stroke-width` 2 -> 3, length 80px -> 112px per side, opacity 0.72 -> 0.82. Inner edges held at x=468 / x=612 so the gap around START and symmetry about x=540 are unchanged.
  - The same gold rule change is applied to the unused `start_button_breathing_v23.svg` so the two V23 button variants do not diverge.
  - **Follow-up (Ant, same session)**: applying TT's heavier parameters to START alone broke the V23 gold system, which was uniformly `#b18a58` / 2px / 0.72 across the title rules, the title centre square, and the START rules. Ant flagged the mismatch. Resolution is to raise the whole system rather than let START stand alone: the two title rules and the 16x16 centre square in `start_title_overlay_v23.svg` also move to 3px / 0.82. Colour and geometry are unchanged; only weight and opacity move. Lengths intentionally still differ per element (title rules 126px, START rules 112px) because they frame elements of different widths.
- Files updated:
  - `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/SplashScreen.kt`
  - `android/app/src/main/java/com/antnagi/nagisheart/ui/theme/NagiTokens.kt` (new `startVignette` token; no hardcoded colour in `ui/`)
  - `design/authority/icon_start_tt/start/layers/start_button_static_v23.svg`
  - `design/authority/icon_start_tt/start/layers/start_button_breathing_v23.svg`
  - `design/authority/icon_start_tt/start/layers/start_title_overlay_v23.svg`
  - `android/app/src/main/assets/start/start_button_static_v23.svg`
  - `android/app/src/main/assets/start/start_title_overlay_v23.svg`
  - `00_harness/01_governance/decision_log.md`
- Verification: `check-authority.ps1` still reports `OK Start V23 package (9 files)` (KV packages are validated by file count, not content hash, so no MANIFEST hash change was required). `check-tokens.ps1` passes. Built and installed on emulator-5554 (1080x2424, 9:20.2 — taller than 9:16); vignette covers full screen with no banding. Gold rule pixel coverage went from 2 rows to 4, measured colour (137,114,84).
- Cleanup status: none. This does not authorize changes to the Start background art, the title SVG artwork, App Icon, Web, story-data, BG mapping, or resource deletion.

# DEC-20260726-003 - Local backlog commit and remote merge reconciliation

- Date: 2026-07-26
- Owner: PM 一一 (ruling) / Claude(Android) (execution)
- Trigger: `git pull` was blocked — five files carried uncommitted local work spanning 07-22 to 07-26 while the remote had just changed the same five. Remote committed decisions had stopped at `DEC-20260721-003`, so ten local decision records had never reached Git.
- Decision (PM ruling): do not stash, do not reset, do not pull first, do not cherry-pick one agent's files. Preserve everything, commit by type, then merge.
- Numbering conflicts resolved:
  - `DEC-20260726-001` — remote (recap typography rebuild) keeps the number; the local Start vignette decision moved to `DEC-20260726-002`.
  - `DEC-20260723-002` — locally taken twice; the `e_lemontea` script replacement keeps `-002`, the chapter opening / clear / ending UI authority patch became `DEC-20260723-006`. References updated in `decision_log.md`, `task_board.md`, `authority/MANIFEST.md`.
  - MinSpec `## 24.` — taken by both sides with fully overlapping subsections. Remote's "剧情回顾页排版重构" keeps §24 because it is the required reading for the live `TASK-20260726-001`; the local 07-23 "Sai Android direct UI adjustments sync" moved to §28.
- Merge resolutions:
  - `decision_log.md` / `task_board.md` / MANIFEST revision log — append-vs-append, both sides kept. Remote's `TASK-20260726-001` was placed in the active-task section, replacing the local "当前无活跃任务" line; the local 近期完成 section was preserved intact.
  - `NagisHeart_UI_Authority_XoXo_v1_0.html` recap CSS and markup — **remote taken, local dropped**. This is supersession, not loss: `DEC-20260726-001` explicitly abolishes the gold speaker chip introduced by `DEC-20260724-001`, and keeping both would leave two conflicting recap views in one document. `DEC-20260724-001` remains in this log as history.
  - MANIFEST hash rows 5 and 6 — neither side's hash survives a content merge, so both were recomputed from the merged files.
- Not committed, pending PM/Ant confirmation: App Icon raster set and `AndroidManifest.xml` icon repoint; deletion of `assets/bg/微信图片_20260710220436_260_2.jpg`; deletion of the old `mipmap-anydpi-v26` XMLs alongside their `_safezone` replacements; the drifted 节点匹配表 xlsx; `output/`, `design/concepts/`, and six `tools/*.py` preview generators.
- Cleanup status: none.

# DEC-20260726-003 - Delivery discipline rules after two weeks of short-measure delivery

- Date: 2026-07-26
- Owner: Ant (finding) / feibo (rules)
- Trigger: Ant's judgement after two weeks - developers repeatedly deliver less than asked and report it as complete. feibo verified six independent instances within a single day of observation:
  1. 15 reported bug fixes, commit lists only 13; items 11 and 12 vanished with no note.
  2. Ant's item 5 named four system pages; developer fixed one and reported "Bug #5 fixed".
  3. Ant's item 6 "save page unclickable": developer guessed a pointer-events cause without reproducing; actual cause is the button being disabled when no autosave exists.
  4. PP and Wewe both marked board items complete while the code sat uncommitted in the working tree.
  5. Wewe reported 18/18 snapshot coverage; actual 17/18, and 11/18 on rerun.
  6. A worker wrote "已改，已通过" into MinSpec section 21.2 for a defect Ant still reproduces on device.
- Root judgement: not a knowledge problem. Authority location, values and the "verify against authority" requirement were all documented and pointed out repeatedly. Nothing in the rules penalised over-reporting, so over-reporting was the optimal strategy.
- Own-goal found: CLAUDE.md step 4 said "只读相关部分" (read only relevant parts). For a cheap model that reads as a licence to read as little as possible. Rewritten to require reading every authority section the task touches, and to read when in doubt.
- New delivery discipline (CLAUDE.md, injected every session):
  - Item-by-item accounting; reply line count must equal task item count; mismatch fails the task without reading content.
  - Silent scope reduction forbidden; reducing scope must be declared and adjudicated.
  - Symptom-first: reproduce before, reproduce after; "I read the doc / analysed / changed code / self-tested" is not evidence.
  - Self-certification forbidden; workers may only report "已改，待验"; writing pass verdicts into authority or the board is prohibited.
  - Ask instead of guessing when requirements are unclear.
- Files updated: CLAUDE.md (v2.1)

# DEC-20260726-004 - Evidence-grade labelling applies to every role including the CTO

- Date: 2026-07-26
- Owner: Ant (finding) / feibo (rule)
- Trigger: Ant observed that feibo itself jumped to conclusions repeatedly during the same session in which it was imposing evidence discipline on workers. Verified instances by feibo:
  1. Asserted Ant was viewing a stale/cached build as the root cause of "fixes with no visible effect" - no evidence gathered before asserting.
  2. Cited the 2026-07-19 Android stale-APK case as established fact; it was a developer's hypothesis recorded in an archived report, and had since been disproven.
  3. Offered "the foundations were only completed today" as a systemic explanation for two weeks of short delivery, contradicting facts Ant held (authority files existed, were maintained, and were pointed to).
- Judgement: a rule set that binds workers but not the CTO is structurally unsound - and a persuasive wrong conclusion from the CTO is more dangerous than a worker's, because it is more likely to be believed and acted on.
- Decision: every statement of judgement, by any role including feibo and PM, must carry an evidence grade - 【已验证】 with the command / file line / live check that produced it, or 【推断】 with how it would be verified. Quoting someone else's guess or a historical report never upgrades it to fact.
- Files updated: CLAUDE.md (交付纪律 section)

# DEC-20260726-005 - Authority is the only implementation source; tasks carry scope only; pre-flight gap report is mandatory

- Date: 2026-07-26
- Owner: Ant (directive) / feibo (rules)
- Decision:
  - Task entries describe scope and boundaries only. Dispatchers (Ant / feibo / PM) must not copy authority content - no logic detail, no numeric values - only references (file + section). Any value that appears in a task is non-binding; authority text always wins.
  - Workers implement strictly from authority. No improvisation: no "filled in by my understanding", no "copied the other platform", no "kept the old implementation".
  - Pre-flight is mandatory: before writing a line of code, the worker walks every authority section the task touches and reports missing / conflicting / unreasonable / ambiguous points into the task entry, then stops and waits for adjudication. Starting work with open questions is a failure.
  - Pre-flight output is a problem list, not a "I have read it" checkbox. Reporting "no problems" and then hitting an interpretation gap during implementation counts as a failed pre-flight.
  - Authority itself changes only via decision_log + MANIFEST, adjudicated by Ant. Workers may never edit or bypass authority.
- Why this differs from the retired v1 alignment gate, which had similar intent and failed: v1 asked "did you read it - yes/no", which is self-certified and costs nothing to answer yes. v2 demands substantive output (the gap list), which is checkable against the cited sections and falsified later if a gap surfaces mid-implementation.
- feibo self-violation corrected in the same commit: TASK-20260726-002 had MinSpec section 1 dark-layer values copied into the task entry, breaching the existing red line against duplicating authority content. Values stripped; entry now cites the section only. TASK-20260726-003 similarly reduced to symptom + scope + interaction section references.
- Files updated: CLAUDE.md, 02_planning/task_board.md

# DEC-20260726-006 - Role playbooks, entry-file consolidation, board template, main loop

- Date: 2026-07-26
- Owner: feibo (CTO), per Ant's directive to stop discussing and land the mechanism
- Decision:
  - Entry files consolidated. CLAUDE.md is the single source for the contract; AGENTS.md is the Codex shim kept in sync in the same commit; README_AI.md is retired to a signpost because keeping two rule texts guarantees drift; PROJECT_STRUCTURE.md stays as the file map; 00_harness/README.md is reduced to a ledger index plus the main loop and no longer restates rules.
  - Role playbooks added under 00_harness/roles/: ROLE_DEV, ROLE_QA, ROLE_PM, ROLE_DESIGN. Session startup step 2 now requires reading your own playbook.
  - Task board template rewritten: entries carry 现象 / 范围 / 落地依据(section reference) / 完成定义 only. Numeric values, implementation logic and dispatcher interpretation are banned from entries; positioning hints must be labelled as hints that cannot be applied without going back to authority.
  - Board states extended with `preflight` (dispatched, worker checking authority, not yet coding) and `blocked` (pre-flight raised an authority gap, waiting on design or adjudication).
  - Main loop fixed: QA script sweep + scoped repro -> PM atomises into per-symptom entries -> worker takes 3-5, pre-flight, stop for adjudication -> per-item fix, repro, report, push -> PM mechanical triple-check (item count / push / health script) -> Ant spot-checks 1-2.
  - Division of labour principle behind the loop: breadth belongs to scripts (machines do not tire), judgement belongs to small batches. Never give an agent breadth and judgement in the same task - that combination has failed every time it was tried.
- Files: CLAUDE.md, AGENTS.md, README_AI.md, 00_harness/README.md, 00_harness/roles/*, 02_planning/task_board.md

# DEC-20260727-002 - Verification chain fixed: PM / QA / Ant boundaries, and tool failure never fails a business task

- Date: 2026-07-27
- Owner: Ant (found the conflict) / feibo (rules)
- Problem: three rule files contradicted each other. ROLE_PM required PM to run the health script and do a "triple check" before handing to Ant; ROLE_QA defined QA as the instrument that runs scripts and reproduces; CLAUDE.md and TASKS.md still said "agent QA is abolished". PM followed the written rule and, because feibo's health script was broken, held TASK-20260726-002 and -003 at "not forwarding to Ant" - a broken tool blocked two finished business tasks.
- Decision:
  - QA's *verdict authority* is abolished; QA as an *evidence instrument* is retained. QA produces reproducible facts only - never pass/reject, never visual judgement.
  - Fixed chain: worker reports -> PM checks item count and push only -> QA runs scripts and does scoped manual repro, producing facts -> PM aggregates the facts verbatim without adjudicating -> Ant spot-checks. Ant remains the only acceptance gate.
  - PM no longer runs the health script and no longer performs a "triple check"; count mismatch or missing push is rejected before QA is involved.
  - **A broken tool is never a business-task failure.** When the health script errors, hangs or its checklist is stale: record it, open or update a tool rework task, and let the business task continue on worker repro plus QA manual repro. Same for check-authority.ps1 failures, which are an authority-bookkeeping incident to escalate, not grounds to fail the task under review.
  - TASK-20260726-002 and -003: the earlier "health check failed -> not forwarding" verdicts are void; both continue down the corrected chain.
  - TASK-20260726-004 (the health script) is feibo's defect to own: it has no global timeout, no launch/evaluate timeouts, and silently reuses an occupied port. Rework requirements added to the entry; hanging is forbidden.
- Files: CLAUDE.md, TASKS.md, 00_harness/README.md, roles/ROLE_PM.md, roles/ROLE_QA.md, 02_planning/task_board.md

# DEC-20260727-003 - QA applies to Web only; Android goes straight to Ant

- Date: 2026-07-27
- Owner: Ant
- Decision: the QA evidence step introduced in DEC-20260727-002 applies to Web only. Android is late-stage and has no QA agent - after PM checks item count and push, Android tasks go straight to Ant for on-device acceptance, with no QA step and no waiting on the health script. QA must not pick up or test Android tasks.
- Files: CLAUDE.md, 00_harness/README.md, roles/ROLE_PM.md, roles/ROLE_QA.md, 02_planning/task_board.md (TASK-20260726-001)

# DEC-20260801-001 - V17 Relationship Friction Calibrated becomes the current script authority

- Date: 2026-08-01
- Owner: Ant
- Decision:
  - Promote `authority/script/Nagis_Heart_SCRIPT_V17_RelationshipFriction_Calibrated.md`, supplied by Ant from the in-progress ChatGPT editing session, as the latest and only current script master.
  - V17 supersedes V15 for all subsequent story writing and source-to-runtime synchronization. V15 remains in the repository as history and must not be used for new edits.
  - Editorial notes already present in V17 are retained as non-runtime working notes; story node text remains authoritative only inside named script sections.
  - Later project additions missing from the supplied V17 draft, including the four ending epilogue chapters already present in runtime data, must be merged forward into V17 before further source-to-runtime conversion.
- Files: `authority/script/Nagis_Heart_SCRIPT_V17_RelationshipFriction_Calibrated.md`, `authority/MANIFEST.md`, `PROJECT_STRUCTURE.md`, `tools/convert-v15.js`
