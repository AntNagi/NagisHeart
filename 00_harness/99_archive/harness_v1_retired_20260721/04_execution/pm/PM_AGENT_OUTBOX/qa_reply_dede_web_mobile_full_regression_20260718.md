# DeDe Web 移动端全流程回归报告（阶段性）

- Task ID: `TASK-20260718-013`
- 执行人: DeDe（Codex / QA）
- 日期: 2026-07-18
- 状态: `blocked / P0 found`
- 真实仓库: `D:\Nagi's Heart\NagisHeart`
- 测试地址: `http://localhost:3000/web/index.html`
- 测试方式: Codex in-app Chromium，移动视口覆盖 `393 x 852`、`430 x 932`
- Code touched: no

## 1. 阶段结论

当前 Web 移动端**不可进入 Ant 视觉/交互验收**。

`393 x 852` 下 Start、Home、Prologue、Name Setup 可以进入，但进入游戏后出现严重移动端渲染问题：背景资源已加载，实际画面却几乎整屏深色；HUD、正文和动作入口挤压在顶部；章节开始卡虽已挂载到 DOM，但完全不可见，并且“轻触继续”流程无法完成。该问题阻断 Game / Dialogue / Opening / Clear 全流程，因此定为 P0。

同时发现“回顾”入口打开章节目录、跳过本节未弹确认等交互问题。`430 x 932` 首屏已完成 DOM 验证，但浏览器截图连续超时，本轮未把该视口错误地标为完整通过。

## 2. 已执行流程

### 393 x 852

1. 打开 `/web/index.html`，验证 Start 首屏。
2. 点击 Start，进入 Home。
3. 点击“新的故事”。
4. 连续推进开场白 `01 / 09` 至 `09 / 09`。
5. 进入 Name Setup，确认默认玩家名与进入故事入口。
6. 进入 Game，检查背景、HUD、长旁白、动作 chip。
7. 打开 MENU，检查存档、读档、回顾、章节、设置、标题、返回入口。
8. 打开设置，检查 BGM 音量入口。
9. 点击“回顾”，检查 Backlog 行为。
10. 点击“跳过本节”，检查 NagiDialog / 确认行为及结束页落点。
11. 检查 Console warning/error 与已挂载图片资源状态。

### 430 x 932

1. 设置 `430 x 932` 视口并打开 `/web/index.html`。
2. DOM 已进入 Start 页面。
3. 截图连续两次超时，未继续把该视口记为完整回归通过；需在 P0 修复后重跑并补齐独立证据。

## 3. 问题汇总

| ID | 级别 | 问题 | 影响 |
|---|---|---|---|
| WEB-MOBILE-001 | P0 | 游戏页移动端视觉几乎整屏深色，背景不可见，正文/HUD 顶部重叠 | 核心游戏不可读，不可验收 |
| WEB-MOBILE-002 | P0 | Chapter Opening DOM 已挂载但画面完全不可见，继续交互超时 | 全流程在 Opening 阶段阻断，Clear 无法到达 |
| WEB-MOBILE-003 | P1 | “回顾”入口打开的是章节目录，不是本小章节已读内容分页 Backlog | Backlog 功能错误 |
| WEB-MOBILE-004 | P1 | “跳过本节”未出现确认弹窗，直接切换到 Chapter Opening 状态 | 不符合强制交互规则，可能误操作/错落点 |
| WEB-MOBILE-005 | P1 | HUD 使用 `AUTO / SKIP / MENU`，未按 authority 提供返回 / 章节标题 / 自动播放 / 存档 / 剧情回顾固定组合 | HUD 信息架构与中文化不符合权威 |
| WEB-MOBILE-006 | P1 | 设置页仅显示 BGM 50% 文本，DOM 中无可操作 input/select/button 控件 | BGM 音量无法调整，播放行为无法完整验证 |
| WEB-MOBILE-007 | P2 | 430x932 浏览器证据截图连续超时 | 该视口证据暂不完整，需重跑 |

## 4. 问题明细

### WEB-MOBILE-001 — P0 — 游戏页核心内容不可读

复现步骤：

1. `393 x 852` 打开 Start。
2. Start -> 新的故事 -> 完成 9 段开场白 -> Name Setup -> 进入故事。
3. 观察游戏主界面。

实际结果：

- 页面主体几乎整屏为深蓝黑色。
- HUD 与长旁白正文挤压/重叠在页面顶部。
- 背景人物/场景不可见，正文阅读区域没有正常落在移动端安全区。
- DOM 中的 `bluelock_monitor_room.jpg` 显示 `complete=true`、natural size `607 x 1080`，说明不是资源缺失，而是显示/布局链路失败。

期望结果：

- 当前剧情背景正常铺满并可见。
- HUD、正文/对白框、speaker 与动作 chip 位于各自安全区，互不重叠且可读。

证据：

- `00_harness/05_reports/validation/web_mobile_qa_dede_20260718/game_hud_dialogue_393x852.png`
- `00_harness/05_reports/validation/web_mobile_qa_dede_20260718/menu_393x852.png`

### WEB-MOBILE-002 — P0 — Chapter Opening 不可见且无法继续

复现步骤：

1. 在游戏页点击“跳过本节”。
2. DOM 出现 `CHAPTER / 第一部 / 作战室·初遇 / 轻触继续`。
3. 观察画面并尝试点击章节卡/页面推进区域。

实际结果：

- DOM 中存在 `.chapter-card` 与完整文字。
- 实际截图只剩深色画面与顶部 HUD，章节卡完全不可见。
- 点击 `.chapter-card` 后状态不变；点击游戏推进区域超时，无法继续。

期望结果：

- Chapter Opening 使用可见的轻透明文字托底，隐藏剧情 HUD，并可通过“轻触继续”稳定进入正文/下一阶段。

证据：

- `00_harness/05_reports/validation/web_mobile_qa_dede_20260718/skip_no_confirm_chapter_opening_393x852.png`

### WEB-MOBILE-003 — P1 — 回顾错误打开章节目录

复现步骤：

1. 游戏页打开 MENU。
2. 点击“回顾”。

实际结果：

- 打开标题为“章节目录”的 overlay，内容为“选择已解锁的章节重新阅读”。
- 没有显示当前小章节从开头到当前句的已读内容，也没有 Backlog 分页/左右滑动语义。
- overlay 在移动画面上也几乎不可见，只能从 DOM 读到内容。

期望结果：

- 打开当前小章节已读剧情回顾，默认最近页；移动端左右滑动分页，不显示“上一页/下一页”文字按钮。

证据：

- `00_harness/05_reports/validation/web_mobile_qa_dede_20260718/backlog_opens_chapter_catalog_393x852.png`

### WEB-MOBILE-004 — P1 — 跳过本节缺少确认

复现步骤：

1. 游戏页点击“跳过本节”。

实际结果：

- 未显示 NagiDialog 或任何确认/取消选择。
- 直接进入带 `CHAPTER / 第一部 / 作战室·初遇` 的状态，且该状态自身不可见、不可继续。

期望结果：

- 必须弹确认，说明确认后进入当前小章节结束页；取消返回原剧情位置；确认落到 Section Clear，而非 Chapter Opening/下一正文。

证据：

- `00_harness/05_reports/validation/web_mobile_qa_dede_20260718/skip_no_confirm_chapter_opening_393x852.png`

### WEB-MOBILE-005 — P1 — HUD 信息架构与 authority 不一致

实际结果：顶部显示英文 `AUTO / SKIP / MENU`，存档、回顾等入口被收进 MENU，未见固定的返回图标。

期望结果：左侧返回，中间章节标题，右侧自动播放/停止、存档、剧情回顾；“跳过本节”为剧情层次级操作；系统交互文字中文化。

证据：

- `00_harness/05_reports/validation/web_mobile_qa_dede_20260718/game_hud_dialogue_393x852.png`

### WEB-MOBILE-006 — P1 — BGM 设置不可操作

实际结果：设置页展示“BGM 音量 50%”，但页面 DOM 中可交互元素只有返回按钮；没有 slider/input/select 或可点击音量控件，无法调整音量。受 P0 流程阻断，本轮也无法完整确认章节切换后的连续播放行为。

期望结果：BGM 音量入口可操作，调整后实际音量变化并持久化；播放受浏览器自动播放策略影响时应有明确的用户手势恢复路径。

证据：

- `00_harness/05_reports/validation/web_mobile_qa_dede_20260718/settings_bgm_393x852.png`

## 5. Console / Network / Resource

- Console `error/warn`: 本轮读取结果为空数组。
- 已挂载游戏背景图片：`http://localhost:3000/assets/bg/bluelock_monitor_room.jpg`，`complete=true`，natural size `607 x 1080`。
- 页面 14 个 CSS 样式表均已挂载，包括 layout/dialogue/hud/transitions/splash/start/prologue/name/game/overlays。
- Start 393x852 可见，说明首屏不再是此前的纯黑屏；核心风险已转移到游戏/overlay/transition 的移动端布局与层级。
- 本浏览器接口未提供完整 Network 面板状态码清单；P0 修复后应补一次 404/failed resource 专项复核。

## 6. 已有证据清单

- `start_393x852.png`
- `home_393x852.png`
- `prologue_393x852.png`
- `name_setup_393x852.png`
- `game_hud_dialogue_393x852.png`
- `menu_393x852.png`
- `settings_bgm_393x852.png`
- `backlog_opens_chapter_catalog_393x852.png`
- `skip_no_confirm_chapter_opening_393x852.png`

证据目录：

`00_harness/05_reports/validation/web_mobile_qa_dede_20260718/`

## 7. 阻塞与剩余范围

阻塞原因：Chapter Opening 完全不可见且推进交互超时，无法到达 Section Clear / Chapter Clear / 后续对话与完整 BGM 生命周期。

待 P0 修复后必须重跑：

- 393x852、430x932 两视口完整流程；
- 普通人物 Dialogue + speaker name；
- NagiDialog 确认/取消；
- 正确 Backlog 分页与左右滑动；
- Chapter Catalog 独立入口；
- Chapter Opening / Section Opening；
- Section Clear / Chapter Clear 两类结束页与动作；
- BGM 播放、音量调整、页面切换连续性；
- 全流程 Console 与 Network 404/failed 请求复核。

## 8. WORKER_LOOP 回报

- Files changed: 仅新增本 QA 报告与截图证据；业务代码未修改。
- Verification result: P0 failed / flow blocked。
- Authority sync status: 本轮未修改产品、UI、交互或 authority；无需同步。
- Cleanup status: none。
- PM action requested: 退回 Wewe 修复 Web 移动端 Game / overlay / transition 显示层级与交互阻断；修复后重新派发 DeDe 全量回归。

