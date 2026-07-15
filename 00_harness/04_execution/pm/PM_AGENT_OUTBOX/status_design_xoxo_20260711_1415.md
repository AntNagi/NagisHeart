# Status Intake - Design XoXo

## 1. My Scope

- 我负责什么：P0 HiFi 视觉方向、开屏/首页/流程页、App 图标、路线页、系统页设计语言、背景资产映射、设计验收标准与开发切图交付。
- 我不负责什么：剧情结构裁决、Android 技术架构、开发排期、最终功能 QA；我做过少量本机 Android 辅助落地与编译验证，但不能代替 yiyi 的开发责任或 Laud/DeDe 的测试结论。
- 我当前采用的口径：P0 HiFi + Android vertical slice；LINE 完整演出按 Phase 2 处理，MVP 只要求字段与降级播放能力。

## 2. Latest Progress

| Item | Status | Evidence |
|---|---|---|
| P0 HiFi 内页设计方向 | In Progress | `D:\Nagi's Heart\NagisHeart\design\NagisHeart_P0_HiFi_Design_XoXo_v2_0.html`；Ant老板反馈“Dark 版本还行”“内页还行”，属于方向认可，不是整套最终确认。 |
| P0 HiFi 评审结论 | In Progress | `D:\Nagi's Heart\NagisHeart\design\XoXo_P0_HiFi_UI_Review_v1_1.md` 明确标注 Review Draft；尚未生成与最新规则一致的中文 Final Spec。 |
| App 图标 | Done | `D:\Nagi's Heart\NagisHeart\handoff\yiyi_start_flow_redesign_20260711_neutral\app_icon\app_icon_clean_no_shadow_1024.png`；Ant老板明确回复“icon 可以了”，同图去除黑眼圈阴影后获确认。 |
| 开屏主视觉 | In Progress | 最新无框文字操作版：`D:\Nagi's Heart\NagisHeart\handoff\yiyi_start_flow_redesign_20260711_v3_text_actions\start_pages\start_poster_v2_pillow.png`。已落实“开屏不等于首页、开屏只有 START、标题烘焙进图、START 为文字型操作”，但最新 v3 尚无 Ant老板最终视觉确认。 |
| 首页设计规则 | In Progress | 已确认规则：开屏后进入首页；首页有主要操作；系统交互中文、居中、纯文字、无背景框；首页与系统页共用一张背景。当前本机采用 `home_main.jpg`，该具体图片选择尚未获得 Ant老板确认。 |
| 开场白 / 名字 / 章节开始 / 章节过渡 | In Progress | `D:\Nagi's Heart\NagisHeart\handoff\yiyi_start_flow_redesign_20260711_v3_text_actions\flow_pages\`；已按居中和文字操作规则重排，但整组未获最终视觉确认。 |
| Route 路线页 | In Progress | `D:\Nagi's Heart\NagisHeart\design\NagisHeart_Route_Page_Design_XoXo_v1_0.html` 及 `design\exports\route_page_v1_0\`；已有设计与导出，不存在明确的 Ant老板“采用”结论。 |
| Android 系统页背景/中文/首页分层辅助落地 | In Progress | 本机共享工程已加入 `SystemPageBackground.kt`，开屏与首页分路由，主页/章节/回忆/设置使用同一背景；`assembleDebug` 成功并在 emulator-5554 看过开屏、首页、章节。但这是 XoXo 的辅助实现，尚未由 yiyi 接管确认，也未由 Laud/DeDe 用最新 APK 复验。 |
| 背景 Mapping | Done | `D:\Nagi's Heart\NagisHeart\design\NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md`；已补齐 `gameroom.png`、`easygoing _person.jpg`、会议室及功能性背景，当前无空缺项。 |
| 首体验设计验收 | Done | `D:\Nagi‘s Heart\PM_AGENT_OUTBOX\design_reply_20260711_1327.md`；默认名、Prologue、玩家名替换、debug label、键盘布局均判定本轮必须修，已指向 Laud 复验。 |

## 3. Overall Progress

- 总进度：78%
- 已完成：图标确认与切图；背景 Mapping；P0 内页设计方向；Route 首版；开屏/流程页多轮设计；首体验验收标准；系统页共用背景的本机辅助验证。
- 进行中：新版开屏 v3、首页、流程页、Route 与 P0 HiFi 的最终视觉确认；中文 Final Spec；开发交接版本收口。
- 未开始：基于最终确认稿的统一版本号交付包；全 P0 页面逐屏 Laud 复验闭环；四结局卡的完整最终视觉确认。
- 我认为当前是否能进入下一阶段：No。可以进入“最新源码/APK 对齐后的开发与复验”，但不能宣布 P0 HiFi 最终验收完成。

## 4. Remaining Work

| Priority | Task | Owner | Dependency | Estimate |
|---|---|---|---|---|
| P0 | Ant老板确认最新开屏 v3：标题、构图、纯文字 START、Tap to start | Ant老板 / XoXo | 查看最新 PNG | 0.5 天内可收口 |
| P0 | 确认首页/系统页共用的具体背景图；当前暂用 `home_main.jpg` | Ant老板 / XoXo | 主页实机截图 | 0.5 天 |
| P0 | 将最新确认规则写成中文 P0 HiFi Final Spec，并标明“开屏 ≠ 首页” | XoXo | 上述两项确认 | 0.5 天 |
| P0 | yiyi 接管并核对最新共享 Android 改动，产出唯一最新 APK | yiyi | PM 指定源码基线 | 0.5-1 天（开发估时需 yiyi 确认） |
| P0 | Laud 复验开屏→首页→姓名→Prologue→p1；同时核对 debug、变量和键盘 | Laud | 最新 APK | 0.5 天 |
| P1 | Route 页由 Ant老板做最终视觉确认并进入开发任务 | Ant老板 / XoXo / yiyi | 当前 Route v1.0 | 0.5 天设计确认，开发另估 |
| P1 | 四结局卡与 Gallery 完整视觉最终稿 | XoXo | 结局图资产与 P0 优先级 | 1 天 |
| P2 | LINE 专属演出与聊天样式深化 | XoXo / yiyi | Phase 2 口径 | 后置 |

## 5. Known Issues / Risks

| ID | Issue | Severity | Evidence | Suggested Next Step |
|---|---|---|---|---|
| DES-001 | 最新设计分散在 v1.1 Review、v2 HTML、v3 PNG 与多个 handoff 包，开发可能取错版本 | P0 | `design\`、`handoff\yiyi_*` 存在多代文件 | Ant确认后建立单一 `FINAL` 交付包，旧包标注废弃，不覆盖历史。 |
| DES-002 | Ant已确认设计原则，但未确认 v3 开屏和首页具体成图 | P0 | 聊天指令明确，缺少对最新 PNG 的“采用”回复 | 只做一轮聚焦视觉确认，不再扩方案。 |
| DES-003 | 最新源码与模拟器历史截图/Laud 审计可能不一致 | P0 | `qa_reply_20260711_1315.md`、`QA_Design_Compliance_Audit_Laud_v1.md` 与本机 14:00 后改动时间不同 | PM 固定 commit/目录快照和 APK，测试只认该构建。 |
| DES-004 | `XoXo_P0_HiFi_UI_Review_v1_1.md` 仍为英文主体且明确是 Draft，不符合 Ant“文档中文”要求 | P1 | 文件正文与 Status 字段 | 最终确认后生成中文 Final Spec，不把 v1.1 当正式交付。 |
| DES-005 | 本机辅助 Android 修改跨越了纯设计职责，Owner 容易混乱 | P1 | 新增 `SystemPageBackground.kt`、Start/Splash/系统页调整 | yiyi 进行代码 review 与接管；XoXo 只保留设计验收权。 |
| DES-006 | Laud 审计含 HUD/Menu/Auto/Skip/nagiCall/Backlog 等超出当前五项首体验问题，P0 范围可能膨胀 | P1 | `QA_Design_Compliance_Audit_Laud_v1.md` 共 24 项 | PM 决定本轮目标是 vertical slice 还是完整 P0 HiFi。 |

## 6. Conflicts With Others

- 我认为已完成，但其他人可能认为未完成：图标设计已被 Ant明确确认；背景 Mapping 已补齐。其他项不能以“有文件”视作最终完成。
- 我认为未完成，但其他人可能认为已完成：开屏 v3、首页具体画面、Route、流程页、P0 Final Spec 都尚未得到最终确认；本机编译成功也不等于 yiyi 开发完成或 Laud 验收通过。
- 需要 PM 统一口径的地方：
  - Laud 的 `QA_Design_Compliance_Audit_Laud_v1.md` 覆盖的是 yiyi 当时 latest，还是今天 14:00 后的共享源码，当前无法等同。
  - yiyi 最新源码、XoXo 本机辅助改动、模拟器已安装 APK 三者尚未绑定为同一版本。
  - DeDe 与 Laud 的职责需区分：建议 DeDe 做功能/剧情主流程 QA，Laud 做设计符合性与最终实机视觉验收。
  - TT 的责任边界未固定：当前更适合负责平面 KV/专门插画，不应与 XoXo 的系统 UI 验收重复。
  - 现有 HiFi 评审强调切角/毛玻璃，但 Ant最新明确要求交互为居中文字型按钮、无背景框；最新口头规则优先，旧文档需更新。

## 7. Need PM / Ant Decision

| Decision Needed | Options | Recommendation | Why |
|---|---|---|---|
| 本轮目标 | A. 先过 Android vertical slice；B. 一次完成全部 P0 HiFi | 先 A | 当前首体验路由、变量、debug、键盘仍需闭环；先保证从开屏到 p1 体验成立。 |
| 开屏 v3 是否采用 | A. 采用当前 pillow 无框文字版；B. 指定单一修改点后再验 | B（仅允许一轮单点修改） | 当前已按最新规则完成，但尚无最终视觉确认，继续多方案会制造版本漂移。 |
| 首页/系统背景 | A. 采用当前 `home_main.jpg`；B. 从现有 bg 指定另一张 | Ant在实机截图中二选一 | “共用一张图”已确认，具体图未确认。 |
| Route 是否进入本轮 | A. 与 vertical slice 同步开发；B. P0 主链通过后开发 | B | Route 不阻塞首次进入 p1，但应保留为紧随其后的 P1。 |
| Laud / DeDe 分工 | A. 两人重复全测；B. DeDe 功能、Laud 设计符合性 | B | 减少重复证据和结论冲突。 |
| LINE 口径 | A. MVP 降级 VN；B. 本轮完整 LINE 演出 | A | 与 `TECH_TASKS_v1.1.md` 的 Phase 2 边界一致。 |

## 8. Next 3 Actions

1. PM 固定唯一 Android 源码快照与 APK，标明 yiyi Owner，并让 Laud/DeDe 只对该版本复验。
2. Ant老板集中确认两张图：开屏 v3 与首页共用背景；XoXo 据此生成中文 Final Spec 和单一 FINAL 交付包。
3. yiyi 按 FINAL 包实现后，由 Laud 执行设计验收、DeDe 执行 vertical slice 功能回归，结果回写 PM outbox。
