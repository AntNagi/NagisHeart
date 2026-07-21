# Dev Reply — Wewe Web 开发接手入职与只读审计

- 任务编号：`TASK-20260717-012`
- 负责人：Wewe（Web 开发 / Claude）
- 日期：2026-07-17
- 类型：只读审计，未修改任何代码/数据/资源

---

## 1. 已读文件清单

### 入口与治理

| 文件 | 状态 |
|---|---|
| `README_AI.md` | ✅ 已读 |
| `TASKS.md` | ✅ 已读 |
| `PROJECT_STRUCTURE.md` | ✅ 已读 |
| `00_harness/03_handoffs/latest_status_snapshot.md` | ✅ 已读 |
| `00_harness/02_planning/task_board.md` | ✅ 已读 |
| `00_harness/01_governance/decision_log.md` | ✅ 已读（DEC-20260715-001 至 DEC-20260717-013 共 13 条决策） |

### 入职培训

| 文件 | 状态 |
|---|---|
| `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_WEWE_20260717_WEB_ONBOARDING_AUDIT.md` | ✅ 已读 |
| `00_harness/04_execution/pm/PM_AGENT_INBOX/CLAUDE_WEB_DEV_WEWE_BOOTSTRAP.md` | ✅ 已读 |

### Web 架构与交接

| 文件 | 状态 |
|---|---|
| `design/NagisHeart_Web_Architecture_v1_0.md` | ✅ 已读（CC 2026-07-13，完整架构设计） |
| `handoff/handoff_to_cc_20260713.md` | ✅ 已读（yiyi→cc 交接，主要关于 Android） |

### Web 已有代码（全量逐文件阅读）

| 目录 | 文件数 | 状态 |
|---|---|---|
| `web/index.html` | 1 | ✅ 已读 |
| `web/src/main.js` | 1 | ✅ 已读 |
| `web/src/controller/GameController.js` | 1 | ✅ 已读（646 行，完整游戏控制器） |
| `web/src/engine/` | 4 | ✅ 全部已读（StoryEngine / GameState / ConditionParser / TemplateResolver） |
| `web/src/data/` | 4 | ✅ 全部已读（DataLoader / SaveManager / ProgressManager / SettingsManager） |
| `web/src/ui/Router.js` | 1 | ✅ 已读 |
| `web/src/ui/screens/` | 6 | ✅ 全部已读 |
| `web/src/ui/components/` | 6 | ✅ 全部已读 |
| `web/src/ui/overlays/` | 5 | ✅ 全部已读 |
| `web/styles/tokens.css` | 1 | ✅ 已读 |
| `web/styles/layout.css` | 1 | ✅ 已读 |

### 权威文件

| 文件 | 状态 |
|---|---|
| `00_harness/08_authority_current/01_product/NagisHeart_PRD_v2_0.md` | ✅ 已读（前 150 行，覆盖产品定位、平台定位、Android/Web 关系） |
| `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md` | ✅ 已读（前 150 行，覆盖设计原则、页面结构、首次/非首次进入流程） |
| `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md` | ✅ 已读（合版记录全文） |
| `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` | ✅ 已读（Section 1-2 系统级页面规范 + Section 14 实机反馈补齐部分） |
| `00_harness/08_authority_current/07_technical/ARCHITECTURE.md` | ✅ 已读（前 100 行，数据共享策略和 Android 模块分层） |

---

## 2. Web 版本定位（我的理解）

1. **Android 是主版本，Web 是次版本**。Web 后续独立实现，但产品规则（剧情、变量、路线、结局、UI 语言）必须与 Android 一致。
2. **Web 不是横屏网页游戏**。保持竖屏 9:16 手机比例，桌面浏览器用居中 phone frame（`max-width: 430px`）承载。
3. **共享同一套 `story-data/*.json`**。Web 通过 `fetch()` 加载，Android 通过 `context.assets` 加载。引擎逻辑对等移植，只改语言语法。
4. **零外部依赖**。原生 JS + CSS，无 React/Vue/Vite 构建链。CC 架构文档提到可选 Vite，但当前代码未引入任何构建工具。
5. **Web 首版不抢 Android 的活**。story-data 同步、实机 UI 反馈、章节目录等由 yiyi 在 Android 侧先稳定，Web 跟进。

---

## 3. 当前 Web 代码已有能力

CC 已搭建了相当完整的基础工程。按层分析：

### 3.1 引擎层（完整度：高）

| 模块 | 状态 | 说明 |
|---|---|---|
| `StoryEngine` | ✅ 完整 | resolve 节点/router 解析/环路检测/flow 查找/byRoute 匹配/选项条件过滤/结局判定 |
| `ConditionParser` | ✅ 完整 | 递归下降解析器，支持 `===`/`!==`/`>=`/`<=`/`>`/`<`/`&&`/`||`/`!`/括号/字符串/布尔/数字/标识符 |
| `GameState` | ✅ 完整 | 变量管理、effect 应用（add/set）、snapshot/restore/toSerializable |
| `TemplateResolver` | ✅ 完整 | `{{playerName}}` / `{{nagiCall}}` 替换 |

### 3.2 数据层（完整度：高）

| 模块 | 状态 | 说明 |
|---|---|---|
| `DataLoader` | ✅ 基础完整 | 并行 `fetch` 8 个 JSON 文件。无版本校验、无缓存协调、无增量更新 |
| `SaveManager` | ✅ 完整 | IndexedDB 10+1 槽，CRUD 完整 |
| `ProgressManager` | ✅ 完整 | localStorage 存储已访问节点/已解锁结局/章节状态 |
| `SettingsManager` | ✅ 完整 | 文字速度/自动速度/显示主题 |

### 3.3 控制层（完整度：高）

| 能力 | 状态 |
|---|---|
| 新游戏/继续/读档/存档 | ✅ |
| 对白推进/选项处理/response 队列 | ✅ |
| 长旁白检测与分页 | ✅ |
| 章节边界检测/章节转场/小节转场 | ✅ |
| 结局触发与展示 | ✅ |
| 自动播放/跳过模式 | ✅ |
| 跳过小节 | ✅ |
| 回看（replay from section） | ✅ |
| Backlog 收集 | ✅ |
| 自动存档 | ✅ |
| autoAdvance 单选项自动推进 | ✅ |

### 3.4 UI 层（完整度：中）

| 屏幕/组件 | 存在 | 功能状态 |
|---|---|---|
| SplashScreen | ✅ | 极简，仅显示标题+START 文字，点击跳转 |
| StartScreen | ✅ | New Story / Continue / Gallery 三按钮，Gallery 禁用未实现 |
| PrologueScreen | ✅ | 顺序显示开场白文本，逐行 fade-in |
| NameSetupScreen | ✅ | 输入名字，默认 Ant，最多 12 字 |
| GameScreen | ✅ | **核心游戏画面**，编排所有子组件和 overlay。244 行，结构清晰 |
| EndingScreen | ✅ | 展示结局卡片或 replay 完成信息 |
| SceneBackground | ✅ | 交叉淡入淡出切换背景图 |
| DialogueBox | ✅ | 底部对话框，打字机效果 |
| NarrationOverlay | ✅ | 全屏旁白+长旁白翻页 |
| ChoicePanel | ✅ | 选项按钮列表 |
| HUD | ✅ | 顶部栏（章节标题+AUTO/SKIP/MENU） |
| TransitionCard | ✅ | 章节开始/结束/小节转场卡 |
| GameMenuOverlay | ✅ | 暂停菜单（存档/读档/回看/章节/设置/标题） |
| SaveLoadOverlay | ✅ | 10 槽存读档 |
| BacklogOverlay | ✅ | 对话历史 |
| ChapterSelectOverlay | ✅ | 章节时间线选择 |
| SettingsOverlay | ✅ | 文字速度/自动速度/显示主题 |

### 3.5 样式层（完整度：中）

| 文件 | 状态 |
|---|---|
| `tokens.css` | ✅ 完整的 Design Token 系统：色板、字体、间距、切角、动画、Dark/Light 双主题 |
| `layout.css` | ✅ 竖屏容器 + 切角 clip-path + glass-card 基础 |
| `reset.css` / `dialogue.css` / `choice.css` / `hud.css` / `transitions.css` / `overlays.css` / `screens/*.css` | ✅ 存在，未深入审计样式细节 |

---

## 4. 当前 Web 代码相对权威缺口

### 4.1 UI 视觉缺口（相对 XoXo UI Authority + Section 14）

| 缺口 | 优先级 | 说明 |
|---|---|---|
| **Start 页 TT v23 分层开屏** | P0 | 当前 SplashScreen 只是文字 "Nagi's Heart" + "START"，未接入 TT v23 三层方案（底图+标题 SVG+START 呼吸动画）。Android 侧已实现 |
| **主页（Home）** | P0 | 当前 StartScreen 是三个按钮，未实现 XoXo 权威版的主页样式（背景+毛玻璃+菜单布局）|
| **章节开始/小节开始托底** | P1 | `TransitionCard` 已有结构，但缺 Section 14 要求的轻透明雾面托底 |
| **Chapter Clear / Section Clear** | P1 | Section 14 已有 `clear-card` 规范，Web 端 TransitionCard 尚未区分此类型 |
| **HUD title chip / action chip** | P1 | 需按 final glass HUD 样式实现，当前 HUD 较简单 |
| **对白框 text-shadow** | P1 | 权威要求对白/旁白文字有 `textShadowColor` 投影，CSS 层未设置 |
| **切角形状严格对齐** | P2 | `cut-small`/`cut-medium` clip-path 存在，但各组件是否全部用了切角需逐一核对 |
| **系统页面统一背景+暗层** | P1 | MinSpec Section 1 要求所有系统页用同一背景+暗层，当前各屏幕未统一 |
| **NagiDialog（玻璃弹窗）** | P1 | Android 已有 NagiDialog 组件，Web 端 SaveLoadOverlay 用的是原生 `confirm()`，未实现毛玻璃弹窗 |
| **Gallery 页** | P2 | StartScreen 上 Gallery 按钮已禁用，无任何实现 |
| **LINE 聊天模式** | P2 | 架构文档提到了 `LineChatView`，但 Web 代码中未实现 |

### 4.2 功能缺口

| 缺口 | 优先级 | 说明 |
|---|---|---|
| **称呼设置（nagiCall）** | P1 | NameSetupScreen 只采集 playerName，未询问对 Nagi 的称呼。Android 侧有此步骤 |
| **打字机跳过** | P1 | DialogueBox 的打字机动画无法被点击打断（立即显示全部文字），VN 标准交互缺失 |
| **Error phase 无 UI** | P2 | GameScreen 在 Error phase 只 `console.error`，玩家看不到任何提示 |
| **Service Worker / PWA** | P2 | 架构文档完整设计了 SW 缓存策略，但当前代码无 `sw.js`，`manifest.json` 未找到 |
| **BGM / 音频** | P2 | 架构文档有 `AudioManager` 设计，代码未实现 |
| **热更新** | P3 | DataLoader 是基础 fetch，无版本校验/增量更新 |
| **ChapterSelectOverlay 死代码** | P2 | `_isSectionCurrent` 有一段不可达代码（lines 83-85） |
| **autoAdvance/→/空白选项过滤** | P1 | Android 侧 TASK-20260717-009 已实现将 autoAdvance/→/空白选项从玩家视图过滤，Web 端 `_presentChoices` 尚未做对应过滤 |
| **剧情回顾翻页（非滚屏）** | P1 | Android 侧 TASK-20260717-009 已将 BacklogScreen 改为翻页（8条/页），Web 端 BacklogOverlay 仍是全量滚屏 |

### 4.3 数据层缺口

| 缺口 | 优先级 | 说明 |
|---|---|---|
| **资源路径** | P0 | SceneBackground 硬编码路径 `../assets/`。Web 版最终部署时资源路径需要可配置 |
| **story-data 同步** | 注意 | 当前 Web 直接 fetch `../story-data/`，与 Android 共用。yiyi 正在做 TASK-20260717-009 同步文案/BG 改动，Web 端自动受益，无需 Web 侧额外操作 |

---

## 5. 建议 Web 开发顺序

### P0 — 能跑通 Golden Playthrough

| 序号 | 任务 | 说明 | 依赖 |
|---|---|---|---|
| P0-1 | 打字机跳过（tap-to-complete） | VN 基本交互：点击时如文字正在播放则立即显示全部 | 无 |
| P0-2 | autoAdvance/空白选项过滤 | 对齐 Android TASK-20260717-009 的行为 | 等 yiyi 侧 story-data 稳定 |
| P0-3 | 称呼设置（nagiCall 输入） | NameSetupScreen 增加 nagiCall 选择/输入 | 无 |
| P0-4 | 资源路径可配置 | SceneBackground 和 DataLoader 的 baseUrl 统一管理 | 无 |

### P1 — UI 对齐 XoXo Authority

| 序号 | 任务 | 说明 | 依赖 |
|---|---|---|---|
| P1-1 | 系统页面统一背景+暗层 | 所有系统页使用同一张背景 + `rgba(19,32,51,0.32)` 暗层 | 需确认 Web 端使用哪张背景图 |
| P1-2 | Start 页接入 TT v23 | 底图 + 标题层 + START 呼吸动画 | 等 Android 侧 Start 长屏适配收口（TASK-20260717-008） |
| P1-3 | 主页（Home）样式重做 | 按权威主页设计实现 | P1-1 |
| P1-4 | 对白框 text-shadow | 加 `text-shadow: 0 1px 3px var(--text-shadow-color)` | 无 |
| P1-5 | 章节 opening/clear 托底 + clear-card | Section 14 规范 | 无 |
| P1-6 | HUD glass chip 样式 | title chip + action chip 对齐 final glass HUD | 无 |
| P1-7 | NagiDialog 毛玻璃弹窗 | 替换原生 `confirm()`，对齐 Android NagiDialog | 无 |
| P1-8 | 剧情回顾改翻页 | BacklogOverlay 从滚屏改为翻页（8条/页） | 无 |
| P1-9 | 章节/story gameplay 默认 dark | 对齐 TASK-20260717-009 | 无 |

### P2 — 完整体验

| 序号 | 任务 | 说明 | 依赖 |
|---|---|---|---|
| P2-1 | LINE 聊天模式 | 架构已设计 `LineChatView`，需实现 | story-data 中 LINE 节点格式稳定 |
| P2-2 | Gallery / 结局图鉴 | 启用 Gallery 功能 | PRD 图鉴规则确认 |
| P2-3 | BGM / 音效 | `AudioManager` 实现 | BGM 资源确认（TASK-20260716-001） |
| P2-4 | PWA + Service Worker | `manifest.json` + `sw.js` + 离线缓存 | 部署方案确认 |
| P2-5 | 热更新 | DataLoader 版本校验 + 增量更新 | 部署方案确认 |
| P2-6 | Error phase UI | 给玩家一个友好的错误提示 | 无 |

---

## 6. 风险与依赖

| 风险/依赖 | 影响 | 建议 |
|---|---|---|
| **Android 侧 story-data 正在改动** | Web 和 Android 共用 story-data。yiyi TASK-20260717-009 修改了 nodes/scene_visuals 的文案和 BG，Web 自动受益但需验证 Web 引擎兼容 | Web P0 阶段先只读，等 yiyi 侧稳定后再做 Web 功能验证 |
| **章节目录仍 pending** | PRD 和交互设计中有章节目录页，但视觉样式未定稿（DEC-20260717-013 明确仍 pending） | Web 不自行补做章节目录，等 XoXo 出权威后实现 |
| **Start 长屏适配方案未最终固化** | TT Start v23 的长屏适配（TASK-20260717-008）仍在实验阶段 | Web P1-2 等 Android 侧固化后再接入 |
| **Web 部署方案未确认** | 架构文档提了 Vercel / Cloudflare Pages / GitHub Pages，但实际部署方案未决策 | 需 PM / Ant 决策。影响 PWA、资源路径、热更新全链路 |
| **构建工具引入时机** | 当前零构建，可以直接开开发服务器跑。但生产部署时可能需要 Vite 做 bundle + hash。任务单明确第一轮不引入构建系统 | P0/P1 保持零构建；P2 PWA 阶段再决定是否引入 Vite |
| **notebook 目录与 NagisHeart/web 的关系** | `D:\Nagi's Heart\notebook\` 是一个独立的创作笔记本工具，与 NagisHeart Web 版无关。确认 Wewe 的工作范围是 `NagisHeart/web/`，不是 notebook | 已明确 |

---

## 7. 需要 PM / Ant 决策的问题

| 编号 | 问题 | 影响 | 建议 |
|---|---|---|---|
| Q1 | **Web 部署方案**：静态托管在哪里？GitHub Pages / Vercel / Cloudflare Pages？ | 影响资源路径、PWA scope、CORS、热更新 | P2 前决策即可 |
| Q2 | **Web 版 Start 页**：是直接接入 TT v23 三层方案，还是 Web 版可以有不同的开屏方案？ | UI 一致性 vs Web 特殊需求 | 建议与 Android 保持一致 |
| Q3 | **Web 资源路径**：Web 是直接引用 `../assets/bg/`（开发时）和 CDN（生产时），还是在 `web/` 下维护资源副本？ | 构建与部署复杂度 | 建议开发时 `../assets/`，部署时可配置 |
| Q4 | **Web 是否需要独立的 nagiCall 选项？** PRD 中 nagiCall 设置在名字设置页，Android 已实现。Web 的 NameSetupScreen 当前跳过了这一步 | 体验一致性 | 建议 P0 阶段补上 |
| Q5 | **Web P0 的验收标准**：是否以"能跑通 Golden Playthrough 4 条路径"为标准？ | 开发目标 | 与 CC 架构文档 Section 11 P0 定义一致 |

---

## 8. 总结

CC 打了一个**质量很高的基础**：引擎层和控制层完整度高，UI 层骨架齐全，Design Token 系统与 XoXo 权威对齐度好。Web 版本当前最大的工作在于：

1. **P0 功能补齐**（打字机跳过、选项过滤、称呼设置）—— 确保 Golden Playthrough 可走通
2. **P1 UI 对齐**（系统页背景、Start v23、主页、弹窗、章节 UI）—— 视觉达到 authority 标准
3. **P2 体验完善**（LINE、Gallery、BGM、PWA）—— 功能完整可发布

建议下一步：PM 批准后，Wewe 从 P0-1（打字机跳过）开始，逐项推进。

---

Wewe · 2026-07-17
