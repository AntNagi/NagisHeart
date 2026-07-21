# Wewe Web Developer Bootstrap - NagisHeart

> 接收人：Wewe（Web 开发 / Claude）  
> PM：一一  
> 日期：2026-07-17  
> 目标：先了解项目、Web 代码基础、设计权威和当前团队 loop。第一轮只读，不改代码。

---

## 0. 你的角色

你接手的是 `NagisHeart` 的 Web 版本开发。

项目当前策略：

- Android 是主版本，yiyi 继续负责 Android 端优化。
- Web 是后续独立版本，但产品规则、剧情数据、UI 语言必须与主版本一致。
- Web 不应重新设计成横向宽屏网页游戏；优先保持手机竖屏比例，在桌面浏览器中用手机壳 / phone frame / centered stage 承载。
- 你第一轮任务不是立刻开发，而是读项目、读 Web 代码、读权威文件，然后回 PM 一份“Web 接手理解报告”。

---

## 1. 工作目录

真实仓库目录：

`D:\Nagi's Heart\NagisHeart`

先读入口：

1. `README_AI.md`
2. `TASKS.md`
3. `PROJECT_STRUCTURE.md`
4. `00_harness/03_handoffs/latest_status_snapshot.md`
5. `00_harness/02_planning/task_board.md`
6. `00_harness/01_governance/decision_log.md`

这些文件用于恢复项目上下文，不要只看 Web 目录就开始动手。

---

## 2. 必读权威文件

### 产品 / 交互

1. `00_harness/08_authority_current/01_product/NagisHeart_PRD_v2_0.md`
2. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
3. `00_harness/08_authority_current/07_technical/ARCHITECTURE.md`

重点理解：

- Android 主版本，Web 次版本；
- 同一套 story-data；
- 移动端主体验，Web 保持同体验；
- Web 不改成横屏页游；
- 剧情回顾、分页、章节目录、存档、回看、跳过等规则。

### UI / 视觉

权威 UI 快照在：

`00_harness/08_authority_current/04_ui/`

当前最重要的文件：

1. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
2. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`
3. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
4. `00_harness/08_authority_current/04_ui/NagisHeart_LongNarration_StoryRecap_Redesign_Lulu_v1_0.html`

特别注意：

- `XoXo_UI_Final_MinSpec_20260712.md` section 14 是 2026-07-17 新增的实机反馈补齐：
  - chapter / section opening 文字组必须加轻透明雾面托底；
  - Chapter Clear / Section Clear 使用 `clear-card`；
  - title chip / action chip 使用 final glass HUD；
  - 章节目录仍 pending，不要自行补。
- `decision_log.md` 里的 `DEC-20260717-013` 已确认上述 UI 口径。

### 剧情 / 数据 / BG mapping

1. `00_harness/08_authority_current/03_script/Nagis_Heart_SCRIPT_V15_Calibrated.md`
2. `00_harness/08_authority_current/05_visual_mapping/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md`
3. `story-data/`
4. `00_harness/08_authority_current/06_runtime_story_data/`

注意：

- PM 已把设计权威源同步为 `好卖 -> 有用`。
- PM 已把 `wc_offer` BG mapping 从 `back.jpg` 改为 `living_room.jpg`。
- yiyi 当前有 Android/runtime 同步任务，Web 侧第一轮不要抢改 story-data。

---

## 3. CC 已做过的 Web 设计 / 交接

最关键：

1. `design/NagisHeart_Web_Architecture_v1_0.md`
   - 署名：`2026-07-13 · CC (Claude Code)`
   - Web 端技术架构设计。
   - 移动端优先、同 story-data、零依赖原生 JS + CSS、后续可 Service Worker。

2. `handoff/handoff_to_cc_20260713.md`
   - yiyi → cc 交接。
   - 虽然里面大量内容是 Android 交接，但能帮助理解当时 cc 接手背景、组件命名、未完成项。

3. `design/CoCo_to_XoXo_Design_Handoff_v1_0.md`
   - 历史设计交接参考。
   - 注意：CoCo / HiFi 旧稿不是当前最终权威，只能作为历史参考。

---

## 4. Web 已有代码结构

Web 代码目录：

`web/`

入口：

- `index.html` 根入口会跳转到 `web/`
- `web/index.html` 是 Web 应用页面入口
- `web/src/main.js` 初始化应用

当前是原生 JS + CSS 基础工程，未看到 `package.json` / React / Vue / Vite 依赖。不要默认按前端框架项目处理。

### 控制层

- `web/src/controller/GameController.js`

负责游戏推进、点击、选择、存档、菜单等控制流。

### 引擎层

- `web/src/engine/StoryEngine.js`
- `web/src/engine/GameState.js`
- `web/src/engine/ConditionParser.js`
- `web/src/engine/TemplateResolver.js`

负责 story-data 播放、条件判断、变量状态、模板替换。

### 数据层

- `web/src/data/DataLoader.js`
- `web/src/data/SaveManager.js`
- `web/src/data/ProgressManager.js`
- `web/src/data/SettingsManager.js`

负责加载 JSON、存档、进度、设置。

### UI 层

- `web/src/ui/Router.js`
- `web/src/ui/screens/`
  - `StartScreen.js`
  - `SplashScreen.js`
  - `PrologueScreen.js`
  - `NameSetupScreen.js`
  - `GameScreen.js`
  - `EndingScreen.js`
- `web/src/ui/components/`
  - `SceneBackground.js`
  - `HUD.js`
  - `DialogueBox.js`
  - `ChoicePanel.js`
  - `NarrationOverlay.js`
  - `TransitionCard.js`
- `web/src/ui/overlays/`
  - `BacklogOverlay.js`
  - `ChapterSelectOverlay.js`
  - `GameMenuOverlay.js`
  - `SaveLoadOverlay.js`
  - `SettingsOverlay.js`

### CSS

- `web/styles/tokens.css`
- `web/styles/layout.css`
- `web/styles/hud.css`
- `web/styles/dialogue.css`
- `web/styles/choice.css`
- `web/styles/overlays.css`
- `web/styles/transitions.css`
- `web/styles/screens/*.css`

---

## 5. 当前 Android 侧同步背景

你需要知道 Android 侧正在发生什么，但不要抢 Android 任务：

- yiyi 正在处理 Android P0 / UI 实机反馈。
- `TASK-20260717-010` 弹窗修复已进入 review，等待实机构建验证。
- `TASK-20260717-009` 将处理：
  - story-data runtime 同步；
  - 剧情回顾翻页，不要滚屏；
  - chapter/story gameplay 页面默认 dark；
  - 按 XoXo 011 实现章节开始/结束/顶部 chip。

Web 第一轮应以只读审计为主，等 Android 侧规则稳定后再决定 Web 同步顺序。

---

## 6. 当前不要做

第一轮不要：

- 不改 Web 代码。
- 不改 story-data。
- 不改 Android。
- 不删资源。
- 不把历史 CoCo / HiFi / Missing Pages 文件当最终权威。
- 不自行补章节目录。
- 不自行宣布任何 final。
- 不把 Web 改成横屏网页游戏。

---

## 7. 第一轮回报格式

读完后，请按 WORKER_LOOP 回 PM 一一：

1. 已读文件清单。
2. 你理解的 Web 版本定位。
3. 当前 Web 代码已经具备哪些能力。
4. 当前 Web 代码相对权威文件明显缺哪些能力。
5. 你建议的 Web 接手顺序，按 P0 / P1 / P2 排列。
6. 你认为需要 PM / Ant 决策的问题。
7. 不要改代码；如果发现高风险问题，只报告。

PM outbox 建议路径：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_onboarding_audit_20260717.md`

