# DeDe Web Mobile Full Regression Rerun after Wewe P0 Rework（阶段性）

- Task ID: `TASK-20260718-015`
- QA: DeDe（Codex）
- Date: 2026-07-18
- Repository: `D:\Nagi's Heart\NagisHeart`
- URL: `http://localhost:3000/web/index.html`
- Status: `reject / P0 flow blocker remains`
- Code touched: no
- Cleanup status: none

## 1. 结论

当前 Web 移动端仍**不可进入 Ant 视觉/交互验收**。

Wewe 010 的 CSS 返工确实修复了旧 P0-001：游戏页不再高度塌缩，背景、HUD、长旁白均可见。旧 P0-002 的“Chapter Opening 不可见”也已修复，但 Opening 仍无法通过点击继续，导致 Section Clear / Chapter Clear 全流程不可达。因此当前仍有 P0 流程阻断。

旧 P1 中，Backlog 路由已经修复；跳过本节确认、HUD authority、BGM 设置可操作性仍失败。Wewe 010 只改 CSS，未覆盖这些 JS/交互问题。

## 2. 测试环境与视口说明

- 浏览器: Codex in-app Chromium。
- 请求视口: `393x852`、`430x932`。
- 本轮浏览器 viewport override 未被后端正确应用：运行时 `window.innerWidth x innerHeight = 1280x720`，应用容器按移动端最大宽度渲染为 `430x720`。因此已完成移动窄屏行为复核，但不能将本轮截图虚报为精确的 393x852 / 430x932 高度证据。
- PM/Wewe 已有两张精确 Start 视口证据；本报告只对本轮独立可复核到的行为负责。

## 3. 已执行流程

1. Start v23 可见，点击成功。
2. Home 可见；“新的故事”可进入。
3. Prologue 01/09 至 09/09 全部可见并可推进。
4. Name Setup 可见，“进入故事”可用。
5. Game 背景、HUD、长旁白可见。
6. MENU 可打开；检查回顾、章节、设置。
7. Backlog 路由与内容展示复测。
8. Chapter Catalog 独立入口复测。
9. BGM 设置控件复测。
10. 跳过本节 / NagiDialog / Chapter Opening 继续操作复测。
11. Console error/warn、图片与 CSS 资源挂载状态检查。

## 4. 旧问题复测矩阵

| 旧 ID | 原级别 | 复测状态 | 结论 |
|---|---|---|---|
| WEB-MOBILE-001 | P0 | Fixed | Game/scene background 容器均为 `430x720`，背景与长旁白实际可见，不再整屏深色/顶部重叠 |
| WEB-MOBILE-002 | P0 | Partially fixed / still P0 | Chapter Opening 已可见，但点击卡片和背景均不推进，Section/Chapter Clear 不可达 |
| WEB-MOBILE-003 | P1 | Fixed | “回顾”现打开真正的“剧情回顾”，不再打开章节目录 |
| WEB-MOBILE-004 | P1 | Still failing | “跳过本节”仍不弹 NagiDialog，直接进入 Chapter Opening 状态 |
| WEB-MOBILE-005 | P1 | Still failing | HUD 仍为英文 `AUTO / SKIP / MENU`，固定返回/存档/回顾结构不符合 authority |
| WEB-MOBILE-006 | P1 | Still failing | BGM 行仍为静态 `50%`；无 slider/input/select/可操作按钮 |

## 5. 当前问题表

| ID | 级别 | 问题 | 影响 |
|---|---|---|---|
| RERUN-001 | P0 | Chapter Opening 可见但点击无法继续 | Section Opening/Clear、Chapter Clear 与后续主流程不可达 |
| RERUN-002 | P1 | 跳过本节无确认，直接进入错误的 Chapter Opening 状态 | 误操作风险，落点违反 interaction authority |
| RERUN-003 | P1 | HUD 仍使用 `AUTO / SKIP / MENU` 旧结构 | 与最新 HUD authority 和中文化规则不符 |
| RERUN-004 | P1 | BGM 音量仍是静态文本，无可操作控件 | 音量调节和持久化无法验收 |
| RERUN-005 | P1 | Chapter Opening 显示时剧情 HUD 未隐藏 | 与四类章节全屏状态必须隐藏 HUD 的规则不符 |
| RERUN-006 | P2 / QA infra | 浏览器视口 override 未落到精确 393x852 / 430x932 | 本轮独立精确尺寸证据不完整，修复后需换可控视口环境重跑 |

## 6. 问题明细

### RERUN-001 — P0 — Chapter Opening 无法继续

复现：

1. Start -> 新的故事 -> Prologue 9 页 -> Name Setup -> Game。
2. 点击“跳过本节”。
3. 出现 `CHAPTER / 第一部 / 作战室·初遇 / 轻触继续`。
4. 分别点击 Chapter 卡片文字区域和页面背景区域。

实际：Opening 保持原状态，两次点击后 DOM 均无变化，无法进入下一流程。

期望：点击“轻触继续”后进入正确的下一状态；跳过本节确认后应先落到当前 Section Clear，而不是 Chapter Opening。

证据：`skip_chapter_opening_393x852.png`。

### RERUN-002 — P1 — 跳过本节仍无 NagiDialog

复现：游戏页点击“跳过本节”。

实际：无确认/取消弹窗，直接切换到 Chapter Opening。

期望：显示 NagiDialog；取消返回原剧情位置；确认进入当前小节结束页。

证据：`skip_chapter_opening_393x852.png`。

### RERUN-003 — P1 — HUD authority 未修复

实际：HUD 顶部仍显示英文 `AUTO / SKIP / MENU`，存档/回顾被收进 MENU。

期望：左侧返回，中间标题，右侧自动播放/停止、存档、剧情回顾；跳过本节为次级操作；正式系统交互文字中文化。

证据：`game_393x852.png`。

### RERUN-004 — P1 — BGM 设置仍不可操作

实际：设置页显示 `BGM 音量 50%`，页面交互元素只有 HUD 按钮、跳过本节与返回按钮；未发现 input/select/slider 或音量增减控件。页面也未挂载 `<audio>` 元素供本轮行为核验。

期望：BGM 音量可调整、实际生效并持久化；浏览器 autoplay 限制应有用户手势恢复路径。

证据：`settings_bgm_393x852.png`。

### RERUN-005 — P1 — Opening 未隐藏 HUD

实际：Chapter Opening 卡片上方仍显示章节标题及 `AUTO / SKIP / MENU` HUD。

期望：Chapter/Section Opening 与 Clear 均为独立全屏状态并隐藏剧情 HUD。

证据：`skip_chapter_opening_393x852.png`。

## 7. 已通过项

- Start v23 可见、可点击。
- Home、Prologue、Name Setup 可见、可推进。
- Game 高度塌缩已修复；背景与长旁白实际可见。
- Backlog 路由已修复，显示“剧情回顾”及当前已读内容。
- Backlog 当前样本仅 3 条，未出现上一页/下一页文字按钮；因未超过一页，本轮无法验证 8 条分页与左右滑动换页。
- Chapter Catalog 已有独立“章节”入口，打开章节目录而非 Backlog。
- Chapter Opening 视觉已恢复，可见轻透明托底与“轻触继续”。

## 8. Console / Resource

- 页面 Console `error/warn`: 空数组，无业务阻断错误。
- 游戏背景 `bluelock_monitor_room.jpg`: `complete=true`，natural size `607x1080`。
- 14 个 CSS 样式表已挂载。
- 页面当前无 `<audio>` 元素，BGM 播放链路未能形成可验收证据。
- 浏览器当前接口未提供完整 Network 请求列表；已挂载关键背景无加载失败。后续需在可检查 status 的环境补 404/failed 请求清单。

## 9. 证据目录

`00_harness/05_reports/validation/web_mobile_qa_dede_rerun_20260718/`

已有：

- `start_393x852.png`（文件名按请求视口保留；实际后端渲染尺寸见本报告环境说明）
- `game_393x852.png`
- `backlog_route_393x852.png`
- `chapter_catalog_393x852.png`
- `settings_bgm_393x852.png`
- `skip_chapter_opening_393x852.png`

## 10. 阻塞与 PM 建议

- 阻塞：Chapter Opening 无法继续，Section Clear / Chapter Clear 不可达。
- 未到达：Section Opening、Section Clear、Chapter Clear、结束页 actions、完整后续 Dialogue/speaker、完整 BGM 生命周期。
- 建议：`TASK-20260718-010` 继续保持 reject/rework；退回 Wewe 修复跳过确认、Opening 点击推进、正确 Clear 落点、HUD authority 与 BGM 控件，然后重新派发 DeDe。
- Code touched: no。
- Cleanup status: none。

