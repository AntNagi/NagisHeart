# Status Intake - Design TT

## 1. My Scope

- 我负责什么：平面设计 / 视觉物料方向，包括背景图、开屏海报 / KV、启动图、候选视觉素材、图标或 app mark 的平面资产建议。
- 我不负责什么：Android UI 交互实现、Compose 组件、P0 UI 验收结论、路由 / 变量替换 / 存档等工程逻辑。
- 我当前采用的口径：P0 HiFi + MVP 视觉资产口径。TT 只判断平面资产是否存在、是否可交付、是否已接入工程；不替代 XoXo 的 UI 体验验收。

## 2. Latest Progress

| Item | Status | Evidence |
|---|---|---|
| P2 投资签字 / 接待室背景 | Done / Android integrated | `D:\Nagi's Heart\NagisHeart\android\app\src\main\assets\bg\bg_bluelock_meeting_contract_room.png`; `scene_visuals.json` 中 `p2` / `p2_s2` / `p2_s3` 均映射到该图 |
| transfer_contract 合同谈判桌 | Done / Android integrated | `scene_visuals.json` 中 `transfer_contract.bg = assets/bg/bg_bluelock_meeting_contract_room.png` |
| club_media 媒体室 / 采访背景板 | Done / Android integrated | `D:\Nagi's Heart\NagisHeart\android\app\src\main\assets\bg\bg_club_media_press_room.png`; `scene_visuals.json` 中 `club_media` 已映射 |
| e_agency_launch 经纪公司发布会 | Done / Android integrated | `D:\Nagi's Heart\NagisHeart\android\app\src\main\assets\bg\bg_agency_launch_stage.png`; `scene_visuals.json` 中 `e_agency_launch` 已映射 |
| stay_final 深夜电视微光 | Done / Android integrated | `D:\Nagi's Heart\NagisHeart\android\app\src\main\assets\bg\bg_stay_final_tv_glow_living_room.png`; `scene_visuals.json` 中 `stay_final` 已映射 |
| bad_plan 深夜会议室 / 数据屏 | Done / Android integrated | `D:\Nagi's Heart\NagisHeart\android\app\src\main\assets\bg\bg_bad_plan_data_war_room.png`; `scene_visuals.json` 中 `bad_plan` 已映射 |
| bad_afterglow 舆论热搜 / 闪光灯 | Done / Android integrated | `D:\Nagi's Heart\NagisHeart\android\app\src\main\assets\bg\bg_bad_afterglow_media_wall.png`; `scene_visuals.json` 中 `bad_afterglow` 已映射 |
| bad_far 颁奖典礼 / 奖杯结局 | Done / Android integrated | `D:\Nagi's Heart\NagisHeart\android\app\src\main\assets\bg\bg_bad_far_award_broadcast.png`; `scene_visuals.json` 中 `bad_far` 已映射 |
| c1b LINE 聊天氛围 | In Progress / integration mismatch | 工程有候选图 `bg_c1b_home_full_living_couch_crop.png`，但 `scene_visuals.json` 中 `c1b` / `c1b_s2` / `c1b_s3` / `c1b_s4` 的 `bg` 仍为 `null` |
| w_game 电竞房 / 双排游戏 | In Progress / draft + integration mismatch | 工程有候选图 `bg_w_game_home_full_right_gaming_crop.png`、`bg_w_game_home_full_sofa_screen_crop.png`、`gameroom.png`，但 `scene_visuals.json` 中 `w_game.bg` 仍为 `null`; TT 本线程新草图已归档到 `D:\Nagi‘s Heart\PM_AGENT_OUTBOX\tt_visual_drafts\tt_w_game_esports_room_draft_20260711_1234.png` |
| 启动图 / 开屏 KV | Done / Android integrated | `D:\Nagi's Heart\NagisHeart\android\app\src\main\assets\bg\poster_start_nagis_heart_keyart.png`; `SplashScreen.kt` 直接引用 `file:///android_asset/bg/poster_start_nagis_heart_keyart.png` |
| App launcher icon | Done / Android resource present, authorship not verified | `res/mipmap-* / ic_launcher.png` 和 `ic_launcher_round.png` 存在；`AndroidManifest.xml` 使用 `@mipmap/ic_launcher` |
| 功能图标 / HUD 图标 | Blocked / not delivered as drawable assets | `NagiIcon.kt` 定义 `ic_back`、`ic_menu`、`ic_auto`、`ic_skip`、`ic_backlog`、`ic_save`、`ic_gallery` 等资源名，但 `res/drawable` 目录不存在；`mipmap-anydpi/ic_launcher.xml` 还引用 `@drawable/ic_app_mark` |

## 3. Overall Progress

- 总进度：70%
- 已完成：开屏 KV / 启动图已接入；指定背景清单中 8 项已进入 Android 源目录并在 `scene_visuals.json` 映射；launcher mipmap 资源存在。
- 进行中：`c1b` 与 `w_game` 的最终图选择、命名、节点映射确认；`w_game` 新版电竞房草图已生成但尚未接入 Android。
- 未开始 / 未闭环：功能图标 drawable 资源包，含 HUD / 系统入口 / app mark 前景图；c1b LINE 氛围图是否要使用现有候选图还是重画。
- 我认为当前是否能进入下一阶段：No。原因不是 TT 阻塞启动 / 姓名 / Prologue 路由，而是 P0 主线包含 `c1b`，当前 `c1b.bg = null` 会影响 P0 视觉完整度。

## 4. Remaining Work

| Priority | Task | Owner | Dependency | Estimate |
|---|---|---|---|---|
| P0 | 决定并接入 `c1b` 背景，或确认 LINE 场景本轮允许无背景 / 使用默认背景 | TT / XoXo / yiyi | PM 统一口径：MVP 是否必须有 c1b 背景；XoXo 确认视觉方向；yiyi 修改 `scene_visuals.json` | 15-30 分钟，若重画则 30-60 分钟 |
| P1 | 决定 `w_game` 使用工程现有候选图还是 TT 新草图，并更新 `scene_visuals.json` | TT / XoXo / yiyi | XoXo 选图；yiyi 接入 | 15-30 分钟，若重画则 30-60 分钟 |
| P1 | 功能图标资源包补齐到 `res/drawable` 或改为 Compose vector 实现 | XoXo / TT / yiyi | PM 确认图标归属：TT 做平面资产，还是 XoXo 交互视觉包 | 1-2 小时 |
| P2 | 对已接入背景做移动端 9:16 安全区复查 | TT / XoXo | 需要最新 Android 截图或模拟器截图 | 30-60 分钟 |
| P2 | 给背景资产补一张 asset manifest，记录章节、文件名、状态、是否可替换 | TT / PM | 需要 PM 允许新增视觉资产登记表 | 30 分钟 |

## 5. Known Issues / Risks

| ID | Issue | Severity | Evidence | Suggested Next Step |
|---|---|---|---|---|
| TT-001 | XoXo 说缺的 10 张背景里，8 张实际已在 Android 源目录并映射，信息源可能不是最新工程 | P1 | `scene_visuals.json` 映射已包含 p2 / transfer_contract / club_media / e_agency_launch / stay_final / bad_plan / bad_afterglow / bad_far | PM 让 XoXo 按最新 `scene_visuals.json` 和最新 APK 重新核对缺口 |
| TT-002 | `c1b` 有候选背景文件但节点仍为 `bg: null`，会影响 MVP 主线视觉完整度 | P0/P1 | `scene_visuals.json` 中 `c1b*` 为 null；源目录存在 `bg_c1b_home_full_living_couch_crop.png` | XoXo 选用候选图或要求 TT 重画；yiyi 接入 |
| TT-003 | `w_game` 有候选图和 TT 新草图，但节点仍为 `bg: null` | P1 | `scene_visuals.json` 中 `w_game.bg = null`; 候选图在 assets/bg；新草图在 `PM_AGENT_OUTBOX/tt_visual_drafts` | 选定一张并接入，避免视觉资产和剧情节点脱节 |
| TT-004 | 功能图标枚举存在但 drawable 资源目录缺失，可能导致按钮图标不可见或 app mark 前景缺失 | P1 | `NagiIcon.kt` 资源名列表；`res/drawable` 不存在；`ic_launcher.xml` 引用 `@drawable/ic_app_mark` | yiyi 编译确认；XoXo/TT 补资源或改实现 |
| TT-005 | 当前无法确认模拟器安装包是否包含最新视觉资产 | P1 | DeDe 状态已指出当前模拟器包可能不是 yiyi 最新源码 | yiyi 提供最新 APK 路径或重新部署后截图复验 |

## 6. Conflicts With Others

- 我认为已完成，但其他人可能认为未完成：XoXo 提到缺 `p2`、`transfer_contract`、`club_media`、`e_agency_launch`、`stay_final`、`bad_plan`、`bad_afterglow`、`bad_far`。从 Android 源目录和 `scene_visuals.json` 看，这 8 项已有工程接入证据。可能是 XoXo 看的不是最新源码 / 最新包，或关注的是画面质量而非是否存在。
- 我认为未完成，但其他人可能认为已完成：`c1b` 和 `w_game`。源目录里有候选图，容易被误判为已交付；但节点映射仍是 `bg: null`，从玩家路径看还不能算闭环。
- 需要 PM 统一口径的地方：TT 是否只交环境背景和开屏 KV，还是也要负责功能图标 drawable；`c1b` 的 LINE 氛围是否本轮必须有专属背景；`w_game` 是否进入 P0/P1 本轮。

## 7. Need PM / Ant Decision

| Decision Needed | Options | Recommendation | Why |
|---|---|---|---|
| `c1b` 是否本轮必须补背景 | A. 必须补；B. 允许 null / 默认背景；C. 后置 Phase 2 | 推荐 A | MVP 主线包含 `c1b`，无背景会让 P0 视觉闭环不完整 |
| `w_game` 采用哪张图 | A. 用现有 `bg_w_game_*`; B. 用 TT 新草图；C. 重画 | 推荐 A 或 B 先接入，后续再精修 | 当前首要问题是节点映射为空，不是完全没有素材 |
| 功能图标归属 | A. TT 输出平面图标资源；B. XoXo 输出 UI 图标规范；C. yiyi 用 Compose vector 临时补齐 | 推荐 B+C，TT 只做 app mark / KV 风格把关 | 功能图标更接近 UI 系统，不应默认算 TT 平面范围 |
| 已接入背景是否需要逐张视觉复核 | A. 现在复核；B. 等最新 APK 统一截图后复核 | 推荐 B | 当前最大风险是源码 / APK 不一致，直接看源文件不能替代移动端截图验收 |

## 8. Next 3 Actions

1. 请 XoXo 基于最新 `scene_visuals.json` 确认：`c1b` 用现有候选图、重画 LINE 氛围图，还是本轮允许留空。
2. 请 yiyi 确认最新 APK 是否包含 `assets/bg` 中已接入的背景，并把 `c1b` / `w_game` 的 `bg: null` 是否为故意留空反馈给 PM。
3. TT 继续补齐本轮指定背景缺口：优先 `c1b`，其次 `w_game` 最终版；功能图标等 PM 确认归属后再进入。
