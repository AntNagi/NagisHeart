# TASK TO Wewe - Web MVP overnight implementation pass

> 时间：2026-07-18  
> PM：一一  
> 接收人：Wewe（Web 开发 / Claude）  
> Task ID：TASK-20260718-003  
> 优先级：P0  
> 状态：ready  
> 目标：基于已有 Web MVP，尽量在 Ant大小姐明早醒来前交付一版可打开、可验证、按当前权威明显前进的 Web 版本。

---

## 0. 重要更正

这不是从零开始，也不是只读入职审计。

当前仓库已经有 Web MVP：

- `web/index.html`
- `web/src/main.js`
- `web/src/controller/GameController.js`
- `web/src/engine/`
- `web/src/data/`
- `web/src/ui/`
- `web/styles/`

你本轮要在已有 MVP 上继续开发。

---

## 1. 必读顺序

先读项目入口：

1. `README_AI.md`
2. `PROJECT_STRUCTURE.md`
3. `00_harness/03_handoffs/latest_status_snapshot.md`
4. `00_harness/02_planning/task_board.md`
5. `00_harness/01_governance/decision_log.md`

再读 Web 现状：

1. `design/NagisHeart_Web_Architecture_v1_0.md`
2. `handoff/handoff_to_cc_20260713.md`
3. `web/index.html`
4. `web/src/main.js`
5. `web/src/controller/GameController.js`
6. `web/src/engine/`
7. `web/src/data/`
8. `web/src/ui/`
9. `web/styles/`

再读当前权威：

1. `00_harness/08_authority_current/01_product/NagisHeart_PRD_v2_0.md`
2. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md`
   - 重点 section 30：剧情回顾左右滑动分页、跳过本节落当前小章节结束页、章节目录边界、autoAdvance/`->`/空白选项过滤、dark 可读性。
3. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
4. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`
5. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
   - section 14：chapter/section opening、Chapter Clear / Section Clear、title/action chip。
   - section 15：HUD icon/title/action 统一 glass HUD、speaker/name 金色可读性。
   - section 16：chapter catalog、Dialog Android/Web no-real-blur fallback token。
6. `design/authority/icon_start_tt/TT_Icon_Start_Authority_Spec_v1_0.md`
7. `design/authority/icon_start_tt/start/`
8. `story-data/`

---

## 2. 本轮目标

明早 Ant大小姐希望看到“Web 端已经继续开发了”的明确回报，而不是只读报告。

你需要完成一个 Web MVP overnight implementation pass：

1. 保证 Web MVP 能本地打开 / 启动，并记录运行方式。
2. 对齐当前权威中最影响观感和可玩的 P0 项。
3. 输出 dev reply，说明完成了哪些、还剩哪些、如何验证。

---

## 3. P0 开发范围（按顺序做，时间不够就从上往下交付）

### P0-A. 启动与数据加载

- 确认 `web/` 能通过本地静态服务器打开。
- 若存在路径问题，优先修复 Web 读取 `story-data/`、背景资源、TT Start 资源的路径。
- 不改 story-data 内容；只修 Web 读取和显示。

### P0-B. Start / opening entry 对齐当前权威

- Web Start 应使用 TT Start v23 方向：
  - `design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png`
  - `design/authority/icon_start_tt/start/layers/start_title_overlay_v23.svg`
  - `design/authority/icon_start_tt/start/layers/start_button_static_v23.svg`
- START 需要 1.6s gentle breathing alpha。
- Web 竖屏 stage 保持移动端 9:16 / 9:20 体验，不改成横屏网页。
- 若无法直接复用 SVG/PNG 路径，必须说明 fallback，不得自行重绘字体。

### P0-C. Gameplay UI authority 对齐

按 `XoXo_UI_Final_MinSpec_20260712.md` 做最小可见实现：

- HUD：back / auto / save / backlog/menu icon buttons 与 title chip、action chip 共用 final glass HUD，不再裸白线压背景。
- title/action chip：轻玻璃 backing + 细描边 + shadow/halo，不做厚按钮。
- speaker/name：保留金色方向，使用 `#E4CA8F`，加小型轻衬底/halo，保证亮/复杂背景可读。
- Dialog：使用 section 16 fallback token，不做 80%+ 厚重深色大卡，不模糊弹窗自身文字。

### P0-D. 交互规则对齐

- 剧情回顾 / backlog：分页，不纵向无限滚屏；移动/触控优先支持左右滑动换页，不显示“上一页 / 下一页”文字按钮；可保留轻量页码 indicator。
- 玩家可见选项过滤：不要显示 `autoAdvance`、`->`、空白占位选项；引擎路由不受影响。
- story gameplay 默认 dark 可读性策略。

### P0-E. Chapter flow pages

- chapter/section opening：文字组必须有很浅的透明雾面托底，不能裸文字压背景。
- Chapter Clear / Section Clear：使用 `clear-card` 轻玻璃过渡页方向。
- Chapter catalog：如果 Web MVP 已有 `ChapterSelectOverlay.js`，按 section 16 最小实现系统级 dark glass 目录；如果时间不够，至少不要做旧/厚/系统默认风格，并在回报里列为 remaining。

---

## 4. P1 可做但不得抢 P0

- Save / Load UI 与 authority 对齐。
- Settings UI 细节对齐。
- Web BGM 播放与音量设置接入。
- PWA manifest / service worker。
- Web App Icon / favicon 使用 Ant 已确认的 TT 第三版 icon：
  - 第三版 = `icon/previews/icon_overview_contact_sheet.png` 顶部第三张 / 右上 `rounded rect mask preview`
  - dev source = `design/authority/icon_start_tt/icon/master/app_icon_tt_candidate_1024.png`

---

## 5. 禁止范围

- 不改 Android。
- 不改 story-data 正文、剧情节点、BG mapping 权威。
- 不改 `00_harness/08_authority_current/` 权威文件。
- 不从 `00_harness/99_archive/` 引用资源。
- 不把历史 CoCo / HiFi / Missing Pages 旧稿当最终权威。
- 不自行重设计 UI；只按 authority_current 实现。
- 不删除旧资源；发现废弃资源只回报 cleanup candidates。

---

## 6. 验证要求

至少做：

1. 本地静态打开 Web。
2. 走通：Start -> Prologue / Name -> Game 的最小路径。
3. 检查浏览器 console 是否有阻塞错误。
4. 截图或说明以下页面是否可见：
   - Start
   - Game dialogue
   - Backlog / 剧情回顾
   - Dialog / confirm 类弹窗（若路径可触发）
   - Chapter opening / clear / catalog（能触发多少写多少）

如果无法截图，也要写清楚无法截图原因和已做的静态验证。

---

## 7. 回报文件

完成后写：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_wewe_web_mvp_overnight_20260718.md`

回报必须包含：

1. 已读 authority 文件。
2. 修改文件清单。
3. 已完成 P0-A/B/C/D/E 哪些项。
4. 未完成项与原因。
5. 运行方式。
6. 验证结果。
7. 与 authority 一致的点。
8. fallback 或偏差点。
9. 需要 Ant 明早重点看的页面。
10. Cleanup status / candidates / done。

---

## 8. 完成定义

明早 PM / Ant 能看到：

- Web MVP 不是只读报告，而是已有可见开发推进；
- 当前权威中的 Start、HUD、speaker/dialogue、backlog/分页、chapter flow 至少有一组明显对齐；
- 剩余差异被明确列出，下一步可继续切片开发。
