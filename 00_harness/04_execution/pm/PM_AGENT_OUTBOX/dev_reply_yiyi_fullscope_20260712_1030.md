# yiyi 全量对齐回信

> Developer: yiyi (Claude Dev)  
> Date: 2026-07-12 10:30  
> 对齐文档: PM 12-point 执行摘要 + TASK_TO_YIYI_20260711_FULL_SCOPE  
> 已审计: NavGraph.kt, GameViewModel.kt, GameScreen.kt, NagiHud.kt, 全部 Screen/Component, scene_visuals.json

---

## 一、逐项状态核查

### ✅ 已完成（无需再动）

| # | 要求 | 当前实现 | 验证位置 |
|---|------|----------|----------|
| 1 | 首次进入流程 Splash→Prologue→NameSetup→Game | NavGraph.kt:51-101 完整实现 | hasPlayed()判定正确 |
| 2 | 后续进入 Splash→Start | NavGraph.kt:54-56 | ✅ |
| 2 | 开屏页只有 START，无遮罩 | SplashScreen.kt 3-layer compositing | 无 background modifier |
| 3 | 首页无 START，标题=开屏页同一套 | StartScreen.kt 用 poster_start_title_overlay.png | 本轮刚改 |
| 3 | 首页中文文字型按钮 | PrimaryStartButton + MinorAction | 无实体框 |
| 4 | 系统级页面背景统一 | 6个页面全部用 SystemPageBackground | Start/SaveLoad/Chapter/Gallery/Settings/Backlog |
| 4 | SystemPageBackground = 开屏页同源 bg | poster_start_nagis_heart_bg_clean.png + 轻量渐变 | 本轮刚改 |
| 10 | 名字设置只保留玩家名 | NameSetupScreen 单输入框 | nagiCall 已暂停 |
| 10 | {{nagiCall}} 不裸露 | GameViewModel 替换 {{nagiCall}} → "Nagi"（默认值） | 461, 484-485, 534, 553-554 行 |
| 11 | 人物对白 vs 短旁白 区分 | DialogueLayer 有 bottom(对白) vs center/fullscreen(旁白) 样式 | ✅ |
| 11 | 长旁白整页分页不滚动 | LongNarrationLayer.kt 全屏毛玻璃+分页 | 本轮刚完成 |
| — | HUD 轻量化 | NagiIconButton/NagiHud 移除切角背景 | 本轮刚改 |
| — | scene_visuals v1.4 mapping 全量 | 13 节点 BG 替换 + uiTheme/mood 修正 + 断裂引用修复 | ✅ |

### ⚠️ 部分完成（需微调）

| # | 要求 | 当前状态 | 差距 | 工作量 |
|---|------|----------|------|--------|
| 5 | HUD: 左=返回 中=标题 右=自动/存档/剧情回顾 | 右侧三键: Auto + Save + **Menu**(路由到Backlog) | Menu 图标/语义要改成 Backlog(☰→☰ 实际一样) | 0.5h |
| 5 | HUD 不保留额外 Menu | `onMenu` 参数名仍叫 Menu，路由已指向 Backlog | 重命名参数和 icon 语义 | 0.5h |
| 8 | 双层章节：大章有开始页 | ChapterOpeningScreen 存在 | 缺大章**结束页** | 2h |
| 8 | 双层章节：小章节有开始页和结束页 | SectionClearScreen(结束页)存在 | 缺小章节**开始页** | 2h |
| 13 | 剧情回顾=当前小章节已读 | BacklogScreen 存在，记录对白+旁白 | 未按章节隔离，缺已选选项记录 | 1.5h |

### ❌ 未完成（需新增）

| # | 要求 | 工作量 | 依赖 |
|---|------|--------|------|
| 6 | 跳过本节 — 非 HUD 五键，确认后落到小章节结束页，标记已跳过完成 | 3h | 小章节状态系统、小章节结束页 |
| 7 | 三种能力拆开：剧情回顾 / 章节目录 / 章节回看 | 4h | 小章节状态系统 |
| 9 | 小章节状态：未解锁/进行中/已完成/已跳过完成 | 3h | ProgressManager 改造 |
| — | 新的故事二次确认弹窗 | 0.5h | 无 |
| — | HUD 存档成功 Toast | 0.5h | 无 |
| — | 一一固定称呼（"Ant大小姐" / "Nagi少爷"）写入 story-data | 1h | script 数据确认 |

---

## 二、规则确认

我确认以下理解：

1. **进入流程**：首次 = 开屏→开场白→名字设置→第一小章节第一页。后续 = 开屏→主页。
2. **开屏页**：只有 START，不加任何半透明遮罩块。可读性靠字体处理。
3. **首页**：无 START。标题 = 开屏同一套图层。主入口中文文字型按钮。
4. **系统页**：首页/存档/章节目录/画廊/设置/剧情回顾 共用开屏同源背景。
5. **HUD**：左返回 | 中标题 | 右自动+存档+剧情回顾。无 Menu。
6. **跳过本节**：不在 HUD 内。需确认弹窗。跳过后进入小章节结束页。标记"已跳过完成"。被跳过的文本不计入剧情回顾。
7. **三种能力拆开**：
   - 剧情回顾 = HUD 最右按钮，只看当前小章节从开头到当前句的已读内容
   - 章节目录 = 系统页，当前大章下全部小章节列表+状态
   - 章节回看 = 从章节目录进入，对已完成/已跳过的小章节完整重放（不覆盖默认进度）
8. **双层章节**：大章（篇/部）+ 小章节（幕/节）各有开始页+结束页。
9. **小章节状态**：未解锁 / 进行中 / 已完成 / 已跳过完成。
10. **名字设置**：只保留 playerName。nagiCall 不做设置、不做替换变更、不裸露。
11. **文本展示**：对白/短旁白/长旁白明确区分。长旁白整页分页不滚动。
12. **一一固定称呼**：一一叫玩家"Ant大小姐"，叫 Nagi"Nagi少爷"。这些写在 script 里即可，不需要代码模板替换。

---

## 三、实现顺序

```
P0 — 快速修正（1h）
├── HUD 最右按钮: Menu → Backlog 重命名（NagiHud.kt, GameScreen.kt, NavGraph.kt）
├── 新的故事二次确认弹窗（NavGraph.kt StartScreen composable）
└── HUD 存档成功 Toast（GameScreen.kt + GameViewModel.kt）

P1 — 小章节状态系统（3h）
├── ProgressManager 改造：每个小章节维护状态枚举
├── 章节切换时更新状态：进行中 → 已完成
├── ChapterScreen 显示状态
└── Backlog 按章节隔离 + 记录已选选项

P2 — 双层章节开始/结束页（4h）
├── 大章结束页（新增 ChapterEndScreen）
├── 小章节开始页（新增 SectionOpeningScreen 或复用 ChapterOpening 样式）
├── GameViewModel 检测章节/小章节边界，触发对应页面
└── 跳过本节 → 落到小章节结束页

P3 — 跳过本节（2h）
├── 剧情页底部"跳过本节"入口（非 HUD）
├── SkipConfirmDialog
├── 跳过逻辑：标记已跳过完成，进入小章节结束页
└── 被跳过文本不写入 backlog

P4 — 三种能力拆开（3h）
├── 剧情回顾（当前 BacklogScreen 改为只显示当前小章节已读）
├── 章节目录（ChapterScreen 改为当前大章 → 小章节列表+状态）
└── 章节回看（新增 ReplayScreen，从章节目录进入，不覆盖默认进度）

P5 — 一一固定称呼（0.5h）
└── 确认 story-data 中一一的台词是否已包含"Ant大小姐"/"Nagi少爷"，不足则补
```

预计总工作量：**~13.5h**

---

## 四、涉及文件/模块

| 模块 | 文件 | 改动类型 |
|------|------|----------|
| 导航 | NavGraph.kt | 新路由(SectionOpening, ChapterEnd)、确认弹窗 |
| HUD | NagiHud.kt, NagiIcon.kt, NagiIconButton.kt | Menu→Backlog 重命名 |
| 游戏逻辑 | GameViewModel.kt | 小章节边界检测、状态更新、跳过逻辑、backlog 隔离 |
| 游戏画面 | GameScreen.kt | 跳过入口、Toast、路由新 phase |
| 页面 | ChapterEndScreen.kt(新), SectionOpeningScreen.kt(新) | 新增 |
| 章节 | ChapterScreen.kt | 改为双层列表+状态+回看入口 |
| 回看 | ReplayScreen.kt(新) | 新增 |
| 回顾 | BacklogScreen.kt | 章节隔离 |
| 存档 | ProgressManager.kt, StoryModels.kt | 小章节状态枚举 |
| 数据 | story-data/chapters.json | 可能需要补充小章节结构 |

---

## 五、依赖关系

```
小章节状态系统 ← 跳过本节、章节目录状态显示、章节回看的前提
双层开始/结束页 ← 跳过本节落点
剧情回顾隔离 ← 小章节边界检测
章节回看 ← 小章节状态（只有已完成/已跳过完成才能回看）
```

---

## 六、风险和阻塞

| 风险 | 影响 | 缓解 |
|------|------|------|
| story-data/chapters.json 不含小章节结构 | 双层章节无法执行 | 需 PM 确认 chapters.json 的小章节数据格式 |
| 无 gradlew，不能本地编译 | 代码只能审查不能验证 | 需要 Ant 在 Android Studio 验证 |
| "一一"角色台词是否写在 script 里 | 如果 script 用 {{playerName}} 代替"Ant大小姐"，需要额外处理 | 扫 nodes.json 确认 |
| 旧存档兼容 | 新增小章节状态字段后旧存档可能丢状态 | Kotlin 默认值可兼容 |
| chapters.json 当前只有大章结构 | 小章节列表数据从哪来？ | 可从 nodes.json 的 section 划分推导，或 PM 提供 |

---

## 七、本轮已交付（本次 session）

以下是本次 session 已完成并同步到工程的改动，供 PM/QA 核查：

1. scene_visuals.json v1.4 mapping 全量（13 节点 BG + 3 节点 uiTheme + mood 修正）
2. SystemPageBackground 换为开屏同源背景（6 个系统页自动继承）
3. StartScreen 标题换为开屏页 title overlay 图片
4. HUD 轻量化（移除切角背景块）
5. LongNarrationLayer 集成到 GameScreen（长旁白分页完成）
6. 断裂引用修复：stay_cozy(dining.jpg→bar.png)、w_game(gameroom.png→gaming_room.png)

---

## 八、请 PM 确认

1. **chapters.json 小章节数据**：当前 chapters.json 只有大章（part）结构。双层章节需要知道每个大章下的小章节列表。是由 PM 提供数据，还是我从 nodes.json 推导？
2. **一一称呼**：story-data 里一一的台词是否已经写成"Ant大小姐"/"Nagi少爷"？还是用了 {{playerName}} / {{nagiCall}} 模板？
3. **跳过本节的入口位置**：剧情页的哪里放？建议底部文本区旁的小文字按钮，或左滑手势？
4. **优先级确认**：P0（快速修正）我可以立即做。P1-P4 依赖数据结构，是否要我先做数据层再做 UI？
