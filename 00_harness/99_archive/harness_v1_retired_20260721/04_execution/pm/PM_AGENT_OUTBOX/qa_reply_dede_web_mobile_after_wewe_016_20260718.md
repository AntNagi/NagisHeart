# DeDe QA — Web Mobile after Wewe 016

- Task ID: `TASK-20260718-017`
- QA: DeDe（Codex）
- Date: 2026-07-18
- Repository: `D:\Nagi's Heart\NagisHeart`
- URL: `http://localhost:3000/web/index.html`
- Result: `functional pass with P1 visual / QA-infrastructure caveats`
- Code touched: no
- Cleanup status: none

## 1. 结论

Wewe 016 声称修复的 5 项 reject，本轮独立复测均已得到实际行为证据：

1. Opening/Clear 可点击推进，Section Clear 与 Chapter Clear 均真实可达；
2. 跳过本节会弹 NagiDialog，取消回到原剧情位置，确认进入当前 Section Clear；
3. HUD 已移除 `AUTO / SKIP / MENU`，改为返回/标题/自动播放/存档/剧情回顾图标结构；
4. BGM slider 可操作，页面值从 50% 实时更新到 80%；
5. Opening/Clear 状态已隐藏剧情 HUD。

本轮未发现 P0 流程阻断。`TASK-20260718-016` 的功能修复可视为通过独立 QA。

但仍有两个验收 caveat：

- 当前 Browser viewport override 未被后端应用，无法独立生成精确 `393x852 / 430x932` 高度证据；实际运行时为 `1280x720`，应用容器 `430x720`。
- Settings overlay 在明亮剧情背景上文字、标题与 slider 对比度明显偏低，列为 P1 视觉可读性风险，应由 PM/Ant 视觉验收重点确认。

建议：功能层可从 reject 转 review；进入 Ant 前需接受“精确视口证据仍缺失”的事实，并重点复核 Settings 可读性。若 PM 要求严格的精确尺寸门禁，则需在可控移动视口环境补测后再交 Ant。

## 2. 环境与视口

- 浏览器：Codex in-app Chromium。
- 请求视口：`393x852`、`430x932`。
- 两次 override 后实际均为：`window.innerWidth=1280`、`window.innerHeight=720`，`#app=430x720`。
- 因此本轮证明的是 430px 宽移动布局与完整交互链路，不虚报精确 393/430 高度通过。
- Wewe/PM 之前已有 Start 的 393x852 与 430x932 证据，但不替代本轮完整流程的精确尺寸证据。

## 3. 必测点结果

| 必测点 | 结果 | 独立证据 |
|---|---|---|
| Chapter Opening 点击推进 | PASS | 第二部 Chapter Opening 点击后进入“开放日” gameplay |
| Section Opening 点击推进 | PASS | “投资的私心” Opening 点击后进入对应 gameplay |
| Section Clear 可达 | PASS | 跳过确认后显示 `SECTION CLEAR / 第一部 / 作战室·初遇` |
| Section Clear -> 下一节 Opening -> gameplay | PASS | 作战室·初遇 -> 投资的私心 Opening -> 投资的私心 gameplay |
| Chapter Clear 可达 | PASS | 连续跳过第一部剩余小节后显示 `CHAPTER CLEAR` |
| Chapter Clear -> 下一章 Opening | PASS | 点击后显示 `第二部 / 关系确立篇` Opening |
| NagiDialog 取消 | PASS | 取消后回到同一剧情、同一长旁白位置 |
| NagiDialog 确认 | PASS | 确认后落到当前 Section Clear，不再错误进入 Chapter Opening |
| HUD authority 结构 | PASS | DOM 为返回、标题、自动播放、存档、剧情回顾、跳过本节；无 AUTO/SKIP/MENU |
| BGM slider 可操作 | PASS | range value 从 UI 5/50% 改到 8/80%，显示实时更新 |
| BGM 持久化 | NOT FULLY VERIFIED | 未直接读取 localStorage；本轮只确认 UI input 事件实时生效 |
| Opening/Clear 隐藏 HUD | PASS | Chapter/Section Opening、Section/Chapter Clear snapshot 均无 HUD buttons |
| Console error/warn | PASS | 两个测试 tab 均为空数组 |
| 关键图片/CSS 加载 | PASS with limitation | 当前背景 `openday.jpg complete=true, 1308x736`；14 个 CSS 已挂载；接口无完整 HTTP status/404 列表 |
| 精确 393x852 / 430x932 | NOT VERIFIED | Browser viewport override 未生效，已如实记录 |

## 4. 关键复测步骤

### 4.1 主流程与 HUD

1. Start -> Home -> 新的故事。
2. 推进 Prologue 01/09 至 09/09。
3. Name Setup -> 进入故事。
4. 检查 Game HUD。

实际：HUD accessible names 为“返回 / 自动播放 / 存档 / 剧情回顾 / 跳过本节”，无旧英文结构。

证据：`game_hud.png`。

### 4.2 Skip NagiDialog 取消/确认

1. 点击“跳过本节”。
2. 弹窗显示“跳过本节？”和“确认后将直接进入「作战室·初遇」结束页。”。
3. 点击取消，确认回到原长旁白 `01 / 03`。
4. 再次打开弹窗并确认。

实际：取消保持原剧情位置；确认进入 `SECTION CLEAR / 作战室·初遇`。

证据：`skip_dialog.png`、`section_clear.png`。

### 4.3 Section/Clear 连续推进

1. 在 Section Clear 点击卡片主区域。
2. 进入 `SECTION / 第一部 / 投资的私心` Opening。
3. 点击 Opening 卡片。

实际：进入“投资的私心” gameplay，HUD 恢复显示；Opening 与 Clear 期间 HUD 隐藏。

证据：`section_clear.png`、`section_opening.png`。

### 4.4 Chapter Clear

1. 对第一部剩余小节逐节执行：跳过 -> 确认 -> Section Clear -> 下一节 Opening -> gameplay。
2. 完成 `投资的私心`、`会议室初见`、`不麻烦的人`、`U-20日本代表战·被日本看见`。

实际：最终显示 `CHAPTER CLEAR / 第一部 / 原作前置篇：他还没看见你，你已经看见了他`；点击后进入第二部 Chapter Opening。

证据：`chapter_clear.png`。

### 4.5 BGM slider

1. Gameplay 点击返回，打开游戏菜单。
2. 进入设置。
3. 定位唯一 range slider，从 5 调到 8。

实际：页面从 50% 实时更新为 80%，slider DOM property 显示 8。

期望：滑块可移动并实时更新；持久化和实际音频音量随后由完整音频链路验证。

证据：`bgm_slider_80.png`。

## 5. 问题表

| ID | 级别 | 问题 | 实际 / 影响 | 期望 |
|---|---|---|---|---|
| AFTER016-001 | P1 | Settings overlay 在明亮背景上可读性偏低 | 标题、数值、slider track 与背景混在一起，移动端阅读困难 | 使用 authority 的 dark glass / fallback token，保证文字与控件对比度 |
| AFTER016-002 | P2 / QA infra | 精确移动视口无法落地 | override 请求 393x852 与 430x932，实际仍为 1280x720、app 430x720 | 在可控浏览器/真机补精确尺寸全流程证据 |
| AFTER016-003 | P2 / verification gap | BGM 持久化及实际音频音量未完整验证 | UI 值已实时变化；页面当前无 `<audio>` 元素可直接检查 | reload 后确认设置保留，并验证 AudioManager 实际消费该值 |

## 6. Console / Resource

- 主流程 tab Console error/warn：`[]`。
- 430 请求视口 tab Console error/warn：`[]`。
- 当前背景：`assets/bg/openday.jpg`，`complete=true`，natural size `1308x736`。
- 入口脚本：`web/src/main.js` 已挂载。
- 14 个 CSS 样式表已挂载。
- 当前 DOM 无 `<audio>` 元素，无法用媒体元素状态证明 BGM 正在播放。
- Browser 接口没有提供完整 request/status 列表，因此未虚报“所有请求均 200”；可确认已观察的关键图片加载完成，无 console 404/error。

## 7. 证据目录

`00_harness/05_reports/validation/web_mobile_qa_dede_after_wewe_016_20260718/`

- `game_hud.png`
- `skip_dialog.png`
- `section_clear.png`
- `section_opening.png`
- `chapter_clear.png`
- `bgm_slider_80.png`
- `start_430_requested.png`（请求 430x932，但实际后端尺寸见环境说明）

## 8. WORKER_LOOP 回报

- Files changed: 仅新增本 QA 报告和截图证据。
- Verification result: 016 五项 reject 功能修复通过；无 P0；发现 Settings 可读性 P1 与视口/音频验证 caveat。
- Authority sync status: 未修改 authority，无需同步。
- Code touched: no。
- Cleanup status: none。

