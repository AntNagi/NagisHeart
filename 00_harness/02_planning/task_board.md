# 任务板

> 用途：当前唯一正式任务源（含优先级，不再有单独 priorities 文件）。
> 原则：只有写进本文件、明确负责人和状态的事项，才算正式可执行任务。新任务追加在最上方。协作规则 v2 见 `00_harness/README.md`。
> 2026-07-21 大扫除：历史任务全量归档至 `task_board_archive_20260715_20260721.md`，本板只保留活跃任务 + 关闭台账。
> QA 口径（2026-07-21 起）：agent QA 停用，**Ant 本人实机/浏览器测试是唯一验收关口**；开发交付物应尽量是截图/对比图而非文字清单。

---

## 当前优先级

1. feibo 搭截图对比验收工具（权威 HTML 期望图基准库 + Web 对比报告，基建）→ 支撑 `TASK-20260721-006`
2. `TASK-20260721-006` Web 90 项对齐验收 - Ant
3. `TASK-20260719-016` locked 标题隐私修复 - PP
4. `TASK-20260719-004` 代码健康专项 - PP 执行 / feibo 把关；`TASK-20260721-003` V3_1 审计 - PM 一一 执行 / feibo 指导
5. 小项：002 回顾末行裁切（PP）、004 补 BG（lulu/TT）、005 开放日复验（Ant）——由 PM 一一 跟催

---

## 活跃任务

### TASK-20260721-006
- 标题：Web 90 项 authority 对齐浏览器验收
- 负责人：Ant（验收）
- 状态：ready
- 优先级：P1
- 说明：07-21 已提交的 90 项 Web UI 对齐（commit `e728137`，明细见 `web/SYNC_LOG_20260721_WEB_UI_AUTHORITY.md`）需 Ant 桌面 + 移动视口过一遍。通过则 Web 线收口；不符项拍图回报，feibo/Wewe 修。
- 最新更新时间：2026-07-21

### TASK-20260719-016
- 标题：Android 章节目录 locked 标题隐私修复
- 负责人：PP（Android）
- 状态：assigned
- 优先级：P1
- 说明：locked 条目须显示中性文案（如"？？？"或"未解锁章节"），不暴露未来真实标题；unlocked/current/completed 不变。**feibo 07-21 代码核验：仍未修**——`ChapterScreen.kt:205` locked 行仍渲染 `item.sectionTitle` 真实标题（仅压 alpha 0.52）。本条目即完整任务说明，无需读旧任务单。
- 完成定义：locked 显示中性文案；unlocked/current/completed 仍显示真实标题；截图两种状态给 Ant。
- 最新更新时间：2026-07-21

### TASK-20260721-002
- 标题：剧情回顾最后一行裁切重修
- 负责人：PP（Android）
- 状态：ready
- 优先级：P2
- 说明：Ant 07-20 实机复验最后一行仍显示不全；MinSpec §21.2 第 4 行原"已通过"记录已作废（07-21 修正）。根因方向：`BacklogScreen.kt` 固定 `ENTRIES_PER_PAGE = 8`，与 §17.4"固定 8 条导致裁切"禁止项冲突；改为按可用高度动态分页或保证末行完整。
- 完成定义：小屏/大屏实机截图证明末行完整。
- 最新更新时间：2026-07-21

### TASK-20260719-004
- 标题：Android/Web release-readiness 代码健康专项（token 归一 + 死代码 + 结构）
- 负责人：PP（执行）/ feibo（把关）
- 状态：queued
- 优先级：P1
- 说明：原 0719 只读审计任务，按 feibo 07-21 诊断重定scope：① token 归一——Android UI 层约 200 处硬编码 `Color(0x…)`（GameScreen 57 处）、Web 123 处硬编码 rgba 收进 token 层，加静态检查防回潮；② 死代码清除——`SectionClearScreen.kt`、`Routes.SECTION_CLEAR`、`advanceAfterSectionClear()`（0719-011/013 确认的 cleanup candidates）；③ GameScreen(34KB)/GameViewModel(30KB) 职责拆分评估。
- 最新更新时间：2026-07-21

### TASK-20260721-003
- 标题：V3_1 ↔ story-data 全量差异审计
- 负责人：PM 一一（执行）/ feibo（指导）
- 状态：queued
- 优先级：P1
- 说明：剧情逻辑 coreDesign（V3.1）与运行数据逐项比对，输出差异裁决表交 Ant。已实锤一处：GOOD END 标题 V3_1"那么完美，那么爱你" vs 运行数据"那么完美，那么爱他"。
- 最新更新时间：2026-07-21

### TASK-20260721-004
- 标题：补齐 2 张缺失 BG
- 负责人：lulu / TT（视觉）
- 状态：pending
- 优先级：P2
- 说明：`assets/bg/goal.jpg`（c6a 节点）、`assets/bg/bg_scarf_flower_delivery.jpg`（e_scarf 节点）引用缺失（validate.js WARN）。补图或改 `scene_visuals.json` 映射二选一。
- 最新更新时间：2026-07-21

### TASK-20260721-005
- 标题：开放日"剧情和选项乱掉"实机复验
- 负责人：Ant（复验）
- 状态：pending
- 优先级：P2
- 说明：该 bug 全 harness 无记录无修复账，疑似修复随 Android 工作区回滚丢失。story-data 数据层已核验正常（c3 链路/选项目标/校验器全过）。Ant 在当前版本实机走第二部第一节"开放日"：不复现即关闭；复现则拍图，feibo 直接修引擎显示层。
- 最新更新时间：2026-07-21

### TASK-20260721-007
- 标题：MinSpec 效果的 Compose 翻译规范
- 负责人：lulu（UI）/ feibo（把关）
- 状态：pending
- 优先级：P2
- 说明：MinSpec 中 CSS 专属效果（backdrop blur、clip-path 切角、mask 渐隐、radial 高光等）在 Compose 无直接等价物，历史上开发各自"近似"导致反复打回。lulu 逐项定死 Android 替代方案（写进 MinSpec §17 fallback 列或新增小节），此后开发无裁量权。
- 完成定义：每个不可直译效果都有唯一指定的 Compose 实现口径；按权威修改流程更新 MANIFEST 哈希。
- 最新更新时间：2026-07-21

### TASK-20260721-001
- 标题：权威文档收拢隔离（authority/ 建立）+ 周末场外协作补账
- 负责人：feibo（CTO）
- 状态：done
- 优先级：P0
- 说明：详见本任务归档版及 `authority/MANIFEST.md`。七份权威 + 2 KV 包收拢，快照区退役，check-authority.ps1 上线。
- 最新更新时间：2026-07-21

---

## 关闭台账（2026-07-21 大扫除）

> 全文见 `task_board_archive_20260715_20260721.md`。closed-done=目标已达成；closed-superseded=被后续工作取代；closed-cancelled=模式变更不再执行。

| 任务 | 处置 | 一句话理由 |
|---|---|---|
| 0715-001 UI合版 | closed-done | 合版产物已成为 UI 权威（authority/ui/） |
| 0715-002 TT icon/start包 | closed-done | 包已交付；Start V23 + Icon V4 safezone 已定权威 |
| 0716-001 BGM候选判断 | closed-done | BGM 已确认接入 |
| 0717-001 Start v23接入 | closed-done | `d7c48b2` 已接入并实机使用 |
| 0717-002/003/006/007/011/014/016 | closed-done | 设计/审计交付完成（原状态即 done 或 review 通过后被采用） |
| 0717-004 Gradle wrapper | closed-cancelled | gradlew 至今不存在；构建走 Ant 的 Android Studio，需 CI 时另开任务 |
| 0717-005 资源缺口修复 | closed-superseded | 被 PP 07-20 系列提交覆盖 |
| 0717-008 长屏 Strategy A | closed-done | 已实现并随 V23 实机使用 |
| 0717-009 剧情/BG/交互遗留闭环 | closed-done | 箭头过滤/翻页/文案/BG 修复 07-21 逐项验活于当前代码 |
| 0717-010 弹窗层级 | closed-superseded | NagiDialog 后续按 §17.3 重做 |
| 0717-012 Wewe入职审计 | closed-done | 已并入后续 Web 实现 |
| 0717-013/015 HUD/回顾/弹窗回修 | closed-superseded | yiyi 离职；被 PP 周末 §21.2 全量 audit 覆盖 |
| 0718-001 废弃资源清理 | closed-done | 已归档收口 |
| 0718-002/007/008 App Icon 系列 | closed-done | V4 safezone 已定权威并接入（res 与包 hash 一致，07-21 验证） |
| 0718-003/005 Web MVP/P1 | closed-superseded | 被 07-21 90 项对齐覆盖；验收转 `TASK-20260721-006` |
| 0718-004 UI ownership gate | closed-done | Android UI 职责已转 PP，gate 目的达成 |
| 0718-006 实机功能三 bug | closed-done | BGM/opening bg/opening 点击修复 07-21 验活 |
| 0718-010/011/013/014/015/016/017/018 Web QA 循环 | closed-cancelled | agent QA 停用；Web 验收转 Ant 本人（017 报告已交付存档） |
| 0718-012 PP Phase 2 | closed-superseded | 被周末 §21.2 全量 audit 覆盖 |
| 0719-001 可读性 authority 补齐 | closed-done | 已并入 MinSpec/HTML，随 authority/ 收拢 |
| 0719-002 主流程根因审计 | closed-superseded | 被 0719-011 映射审计替代 |
| 0719-003 对齐门禁 | closed-done | 已写入 loop/模板 |
| 0719-006 Dialog/HUD 根因调查 | closed-done | 报告交付 |
| 0719-007 Dialog/HUD 最小修复 | closed-superseded | 被周末 §21.2 audit 覆盖 |
| 0719-008 结局页 authority | closed-done | Ant 已确认 §18 |
| 0719-009 P0 logic+UI pass | closed-superseded | 被周末场外重做取代；evidence 流程由 Ant 实机测试取代 |
| 0719-010 DeDe 短回归 | closed-cancelled | agent QA 停用 |
| 0719-011 全量映射审计 | closed-done | 报告已交付采纳；SectionClear 残留转 0719-004 |
| 0719-012 XoXo 映射审阅 | closed-done | 审阅完成，产出 0719-013 |
| 0719-013 Section Clear 移除 | closed-done | `6a0fa6c` 落地；死代码清理转 0719-004 |
| 0719-014 Laud QA 扫描 | closed-done | 报告交付存档；后续 agent QA 停用 |
| 0719-015 结局验证 hook | closed-done | 证据齐；`6a3b51f` 已移除 debug hooks |

---

## 任务状态

- `pending`：已记录，但暂未进入可执行状态
- `ready`：已澄清，可以开始执行
- `in_progress`：已有明确负责人正在做
- `blocked`：被阻塞，需要额外输入或条件
- `review`：执行已完成，等待复核（最终验收=Ant 实机/浏览器）
- `done`：已确认完成
- `queued`：排队中，按优先级依次执行

## 任务模板

### TASK-YYYYMMDD-XXX
- 标题：
- 负责人：
- 状态：pending
- 优先级：P1
- 说明：
- 完成定义：
- 最新更新时间：
