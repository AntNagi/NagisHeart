# Nagi's Heart · SCRIPT V15 BG Mapping · CoCo/XoXo Draft v1.4

> Owner: CoCo Design  
> Source script: `design/Nagis_Heart_SCRIPT_V15_Calibrated.md`  
> BG source: `assets/bg/`  
> Date: 2026-07-12  
> Review status: v1.0 approved; v1.1 adds PM review adjustments; v1.2 adds newly imported WeChat image assets and normalized asset names; v1.3 adds TT meeting room and XoXo-generated functional BG assets; v1.4 rescans the full BG pool, upgrades chapter-1 opening to monitor room, and reduces weak crop / duplicate competition usage.

---

## 0. 口径

这份是按 SCRIPT V15 做的背景匹配草案。判断规则：

- 能明确贴合剧情地点 / 情绪 / 人物状态的，标 `已配`。
- 能临时使用但不是完全准确的，标 `临时代用`。
- 现有 bg 不足以支撑节点的，直接标 `空缺`，不硬配。
- 隐藏路由 / 系统判定节点不出画面，标 `系统`。
- 终局结算更适合单独做 Ending Card，不强行套普通 bg。
- 本轮暂不直接填满 `story-data/scene_visuals.json`，先沉淀匹配口径、补图优先级和 `mood` 字段建议。

---

## 0.1 v1.1 审核调整

本版吸收 PM / 用户审核意见：

1. 增加场景等级：`A 必须补图` / `B 后补` / `临时代用`。
2. 建议 `scene_visuals` 增加 `mood` 字段。
3. `p8_route` 从“已配”调整为“临时代用”，后续建议补机场 / 夜景 / 离别氛围素材。
4. 比赛类节点允许暂时复用 `goal.jpg`，但后续至少拆成 U-20 / 世界杯 / 最终决赛三套视觉。
5. Ending Card 保持独立设计，不使用普通 BG。

---

## 0.1.1 v1.2 微信图片补图调整

本轮在 `assets/bg/` 中发现 78 张 `微信图片_...` 开头的新图。为避免工程直接引用微信长文件名，已保留原图不动，并复制出以下规范命名资产。

| 新资产名 | 原始文件 | 建议用途 | 口径 |
|---|---|---|---|
| `poster_start_nagis_heart_keyart.jpg` | `微信图片_20260710212951_231_2.jpg` | 游戏开屏海报 / Start KV | 已带主视觉感，适合作为当前开屏海报候选。 |
| `bg_p1_nagi_cutin_first_seen.jpg` | `微信图片_20260710215600_249_2.jpg` | p1 / 第一眼看见 Nagi 的 cut-in | 只能补人物 cut-in，不能替代作战室主 BG。 |
| `bg_c1a_bluelock_bench_meeting_temp.jpg` | `微信图片_20260710222406_287_2.jpg` | c1a 蓝锁内部临代 | 有蓝锁内部/更衣区感，可临时代用初见，但仍缺会议室。 |
| `bg_nagi_daily_city_room_icecream.jpg` | `微信图片_20260710223524_299_2.jpg` | 日常 / 公寓 / 甜点 | 可补同居日常、普通幸福类节点。 |
| `bg_u20j_worldcup_goal_kick.jpg` | `微信图片_20260710223525_300_2.jpg` | U-20 / 世界杯比赛高光 | 比旧 `goal.jpg` 更像比赛节点。 |
| `bg_final_match_stadium_kick.jpg` | `微信图片_20260710223529_304_2.jpg` | Dream / Final Match | 可作为最终决赛 / 成名战候选。 |
| `bg_manchester_bedroom_city_night.jpg` | `微信图片_20260710223522_297_2.jpg` | 曼城夜景卧室 / 独处 | 适合 club_alone、dream_exist、p8_route 等夜景情绪。 |
| `bg_manchester_living_piano.jpg` | `微信图片_20260710223528_303_2.jpg` | 曼城公寓公共区 | 适合 club_arrival / club_alone 的生活空间补强。 |
| `bg_manchester_dining_sunlit.jpg` | `微信图片_20260710223530_305_2.jpg` | 餐厅 / 商务日常 | 可补 w_home、mt3、stay_intro 等明亮公寓感。 |
| `ending_candidate_crystal_king.jpg` | `微信图片_20260710223614_306_2.jpg` | 结局卡候选 | 可作为 GOOD / TRUE 彩蛋气质候选，但不直接定稿。 |
| `ending_true_nagi_soft_gaze.jpg` | `微信图片_20260710215921_254_2.jpg` | TRUE Ending Card | 适合“世界第一之后，他看向你”的安静结局感。 |
| `bg_home_soft_nagi_beanbag.jpg` | `微信图片_20260710223615_307_2.jpg` | 居家柔软日常 | 可替换旧 home_full 的部分同居日常。 |
| `bg_scarf_flower_delivery.jpg` | `微信图片_20260710222400_282_2.jpg` | e_scarf / 送花送围巾类 | 比旧 scarf 更偏花束与柔和关心。 |
| `bg_summer_festival_coconut.jpg` | `微信图片_20260710222401_283_2.jpg` | 夏日祭 / 夏日轻喜剧候选 | 氛围偏热闹，可作活动候选。 |
| `bg_bad_impact_kick_cutin.jpg` | `微信图片_20260710222950_296_2.jpg` | BAD / 冲突 / 激烈 cut-in | 适合作情绪插图，不是普通 BG。 |

本轮只把“明显能提升匹配度”的图写入节点表；商务会议、发布会、媒体室、舆论热搜、雨后训练基地等仍然保留空缺或临代，避免硬配。

## 0.1.2 v1.3 功能型 BG 补图调整

本轮参考现实足球俱乐部媒体室、签约桌、发布会、数据分析室、媒体监控墙、深夜电视回放与颁奖直播构图，补入以下功能型 BG。所有图片均为项目内新资产或 TT 提供资产的规范命名副本，避免直接引用临时文件名。

| 规范文件名 | 来源 | 建议用途 | 备注 |
|---|---|---|---|
| `bg_bluelock_meeting_contract_room.png` | `meetingroom.png` | p2 / c1a / transfer_contract 临代 | TT 提供。蓝锁会议室、数据屏、签字文件与战术板齐全。 |
| `bg_club_media_press_room.png` | XoXo 生成 | club_media | 训练基地媒体室 / 采访背景板 / 长桌麦克风。 |
| `bg_agency_launch_stage.png` | XoXo 生成 | e_agency_launch | 经纪公司发布会舞台，适合“她站在光里”。 |
| `bg_bad_plan_data_war_room.png` | XoXo 生成 | bad_plan | 深夜数据会议室 / 品牌预案 / 战术屏幕墙。 |
| `bg_bad_afterglow_media_wall.png` | XoXo 生成 | bad_afterglow | 舆论热搜 / 媒体监控墙 / 新闻流屏。 |
| `bg_stay_final_tv_glow_living_room.png` | XoXo 生成 | stay_final | 深夜电视微光，普通结局的余温。 |
| `bg_bad_far_award_broadcast.png` | XoXo 生成 | bad_far | 奖杯直播 / 远处的世界第一 / 距离感结局。 |

## 0.1.3 v1.4 全量重扫与去重调整

本轮按 Ant 的最新素材池重新扫了一遍 `assets/bg/`，重点处理三件事：
1. `bluelock_monitor_room.jpg` 正式接管第一部第一章 `p1`，不再把 cut-in 误当主 BG。  
2. 早期“图少时硬配”的公寓裁切图与泛用图，尽量替换为现有明确房间图：`living_room.jpg` / `dining_room.jpg` / `bar.png` / `gaming_room.png` / `bedroom.jpg` / `trainning_room.png`。  
3. 降低比赛图重复，避免多个重要比赛节点都压在同一张 `bg_u20j_worldcup_goal_kick.jpg` 上；U-20、淘汰低谷、世界赛高光、决赛失落尽量分开。

新增口径：
- `bluelock_monitor_room.jpg`：第一视觉锚点，优先给 `p1`。  
- `nagi_in_the_monitor_room.jpg`：保留为监控室章节的 cut-in / 人物插图，不作为主 BG。  
- 旧裁切图 `bg_c1b_home_full_living_couch_crop` / `bg_w_game_home_full_right_gaming_crop` / `bg_w_game_home_full_sofa_screen_crop` 退出主推荐，不再优先进入 scene mapping。  

---

## 0.2 scene_visuals 字段建议

当前不直接写入 `scene_visuals.json`。后续确认后，建议在现有字段基础上增加：

```json
{
  "visualPriority": "A | B | temp | none | system",
  "mood": "romance | daily | tension | competition | loneliness | triumph | loss | reflection"
}
```

字段说明：

| 字段 | 用途 | 是否参与剧情逻辑 |
|---|---|---|
| `visualPriority` | 视觉补图 / 代用等级，帮助 PM、设计、工程判断资源优先级 | 否 |
| `mood` | 给 UI 动效、BGM、转场、遮罩气质使用 | 否 |

`mood` 枚举：

| mood | 适用情绪 |
|---|---|
| `romance` | 恋爱、靠近、暧昧、亲密 |
| `daily` | 日常、同居、轻喜剧 |
| `tension` | 压迫、控制、争执、商业风险 |
| `competition` | 比赛、训练、竞技推进 |
| `loneliness` | 异地、独处、疏离 |
| `triumph` | 高光、胜利、世界看见他 |
| `loss` | 失败、错过、普通线落点、BAD 冷却 |
| `reflection` | 旁白、回望、人生分岔、内省 |

---

## 0.3 mood 初始映射

后续落入 `scene_visuals.json` 时可按这个方向填写，必要时由 PM 再按剧情节奏微调。

| mood | nodeId |
|---|---|
| `romance` | e_lemontea, e_invite, e_lolly, e_hug, e_intimate, e_intimate_cohabit, c4a, c4d, e_scarf, e_dressup, e_softrice, e_drunk, dream_return, dream_home, stay_daily |
| `daily` | c3, c2, e_curry, w_home, mt3, e_cozy, w_noodle, w_game, e_morning, e_festival, stay_intro, stay_cozy |
| `tension` | p2, transfer_contract, club_media, e_sick_fragile, e_agency_launch, bad_elegant, bad_plan, bad_match, bad_afterglow |
| `competition` | u20j, c6a, side_b_return, wc_roster, wc_interval, wc_keygoal, wc_offer, club_training, dream_match, dream_celebrate, stay_match |
| `loneliness` | e_depart, club_alone, dream_exist, bad_cold |
| `triumph` | wc_keygoal, wc_offer, e_agency_launch, dream_match, dream_final |
| `loss` | c6a, m_shallow, stay_match, stay_final, bad_last, bad_far |
| `reflection` | prologue, p1, c1a, p8_route, route_mj_hidden, route_love_hidden |

说明：一个节点可以有主 mood 和副 mood；落 JSON 时建议只填一个主 mood，副 mood 留在 designer note。

---

## 1. 空缺清单

这些节点当前不建议硬配现有 bg，需要补图、改用纯 UI 场景、或由 PM 决定降级表现。

| nodeId | 标题 | 缺口原因 | 建议补图方向 |
|---|---|---|---|
| bad_last | 我不是不想赢 | 雨后训练基地外缺图 | 雨夜训练基地外、通道、冷光积水 |

---

## 2. 场景等级

### 2.1 A 级：必须补图

这些节点直接影响主线第一印象、路线分岔或结局表现，不建议长期使用代图。

| nodeId | 标题 | mood | 补图方向 | 说明 |
|---|---|---|---|---|
| c1a | 会议室初见 | romance | 蓝色监狱内部会议室、签字文件、数据屏、冷白灯 | 第一次面对面，v1.3 已补 `bg_bluelock_meeting_contract_room.png`。 |
| transfer_contract | 夏窗·签约桌上的好麻烦 | tension | 盛夏商务会议室、合同、城市窗景 | 世界线转向豪门的重要现实节点。 |
| e_agency_launch | 她站在光里 | triumph | 发布会舞台、冷白追光、商务屏幕 | 女主高光节点，需要独立视觉。 |
| dream_final | TRUE / GOOD Ending Card | triumph / romance | 世界第一之后的安静凝视、冷白光、玩家存在感 | TRUE 可用 `ending_true_nagi_soft_gaze.jpg`；GOOD 可保留 `ending_candidate_crystal_king.jpg` 作为彩蛋候选。 |
| stay_final | NORMAL Ending Card | loss / daily | 深夜客厅、电视微光、普通情侣余温 | NORMAL 独立结局卡，不套普通 bg。 |
| bad_far | BAD Ending Card | loss / tension | 颁奖直播、奖杯、距离感、冷闪光 | BAD 独立结局卡，标题按产品口径“好麻烦”。 |

### 2.2 B 级：后补

这些节点可以先用 UI 或临时代用支撑，但后续补图会明显提升完整度。

| nodeId | 标题 | mood | 补图方向 |
|---|---|---|---|
| p2 | 投资的私心 | tension | 蓝锁会议室、桌面文件、签字页 |
| c1b | 不麻烦的人 | daily / romance | LINE 专用抽象背景或手机近景 |
| w_game | 游戏冷战·ADC走脸事件 | daily / tension | 电竞房、双屏、手柄、夜间沙发 |
| club_media | 它翻译得很对，但不像我 | tension | 训练基地媒体室、采访背景板、字幕屏 |
| bad_plan | 他的名字，由我来写 | tension | 深夜数据会议室、品牌预案、屏幕墙 |
| bad_afterglow | 全世界都看见你 | tension | 舆论屏幕、热搜界面、闪光灯 |
| bad_last | 我不是不想赢 | loss | 雨后训练基地外、冷光积水、通道 |
| p8_route | 假期结束·春季名单 | reflection | 机场、夜景、离别氛围、人生分岔 |

### 2.3 临时代用

这些节点可以先进入 `scene_visuals` 的临代候选，但应保留 `visualPriority: "temp"`，方便后续替换。

| nodeId | 临代 bg | mood | 替换方向 |
|---|---|---|---|
| u20j | `assets/bg/bg_u20j_worldcup_goal_kick.jpg` | competition / triumph | 已转正，保留为 U-20 主高光 |
| c2 | `assets/bg/lemontea.jpg` | romance | 消息段可改 LINE Mode |
| e_depart | `assets/bg/living_room.jpg` | loneliness | 送别 / 收行李专图 |
| c6a | `assets/bg/goal.jpg` | competition / loss | 与 U-20 / 世界赛高光拆开，保留淘汰低谷感 |
| side_b_return | `assets/bg/living_room.jpg` | reflection | 白色邀请函特写 |
| wc_roster | `assets/bg/dining_room.jpg` | reflection | 平板名单 / 吧台文件 |
| wc_offer | `assets/bg/living_room.jpg` | reflection / transition | 豪门来信 / 家中收到下一阶段通知 |
| m_shallow | `assets/bg/trainning_room.png` | tension | 训练室执行感 |
| w_noodle | `assets/bg/wakeup.jpg` | daily | 酸奶 / 泡面道具 |
| e_tipsy | `assets/bg/bar.png` | romance | 游戏椅 + 微醺互动 |
| c4d | `assets/bg/qixi.jpg` | romance | 蓝玫瑰 / 蛋糕夜景 |
| club_alone | `assets/bg/apartment.jpg` | loneliness | 曼城独居 / 雨夜窗景 |
| e_sick_fragile | `assets/bg/afterwork.jpg` | tension / romance | 书房病弱照护 |
| e_drunk | `assets/bg/bar.png` | romance / tension | 沙发 / 吧台醉意 |
| dream_exist | `assets/bg/bedroom.jpg` | loneliness | 欧洲酒店雨夜 |
| dream_celebrate | `assets/bg/bg_final_match_stadium_kick.jpg` | triumph | 看台庆祝 |
| stay_match | `assets/bg/teamV.jpg` | loss | 决赛失落版本 |
| bad_elegant | `assets/bg/dining_room.jpg` | tension | 曼城公寓恢复餐 |
| bad_match | `assets/bg/teamV.jpg` | tension | 包厢 / 加冕压迫感 |

---

## 3. 节点匹配表

| Part | nodeId | 标题 | 状态 | bgAsset | uiTheme | 裁切 / 安全区 | CoCo note |
|---|---|---|---|---|---|---|---|
| Prologue | prologue | 开场白 | 已配 | `assets/bg/worldstage.jpg` | dark | 焦点在上中部眼睛，底部留旁白区 | 适合“世界在他脚下改变形状”的命运感。 |
| 1 | p1 | 作战室·初遇 | 已配 | `assets/bg/bluelock_monitor_room.jpg` | dark | 屏幕墙和观察席放上半部，底部留旁白区；`nagi_in_the_monitor_room.jpg` / `bg_p1_nagi_cutin_first_seen.jpg` 仅作 cut-in 叠层 | 正式改用监控室主 BG，开篇第一视觉回到“蓝锁观察 / 被看见”的世界观锚点。 |
| 1 | p2 | 投资的私心 | 已配 | `assets/bg/bg_bluelock_meeting_contract_room.png` | light / auto | 桌面文件和签字页在下半部，底部 UI 需加柔白遮罩 | TT 会议室图含签字文件、蓝锁标识和数据屏，匹配投资签字场景。 |
| 1 | c1a | 会议室初见 | 已配 | `assets/bg/bg_bluelock_meeting_contract_room.png` | light / auto | 会议室纵深明确，底部桌面可承接对话框 | 替换 v1.2 的蓝锁长凳临代。 |
| 1 | c1b | 不麻烦的人 | 已配 | `assets/bg/easygoing _person.jpg` | dark / auto | 人物近景偏情绪图，底部需加深色文本托底 | Owner 指定用于“不麻烦的人”。 |
| 1 | u20j | U-20日本代表战·被日本看见 | 已配 | `assets/bg/bg_u20j_worldcup_goal_kick.jpg` | dark | 人物动作占中下，底部文本需深色遮罩 | 比旧 `goal.jpg` 更明确是大赛高光，可用于“被日本看见”。 |
| 2 | c3 | 开放日 | 已配 | `assets/bg/openday.jpg` | light | 横图需 9:16 重裁，焦点保留人物 / 宿舍感 | 对应开放日和宿舍探访。 |
| 2 | e_lemontea | 你的，我的 | 已配 | `assets/bg/lemontea.jpg` | light | 人物右侧，文字区放底部或左下 | 文件名和剧情饮品强匹配。 |
| 2 | c2 | 假期的消息 | 临时代用 | `assets/bg/lemontea.jpg` | light | LINE 弹层需提高可读性 | 节点前半是假期日常，后半是消息推进；可同图承接。 |
| 2 | e_invite | 高级公寓的邀请 | 已配 | `assets/bg/apartment.jpg` | light | 人物居中偏上，底部叙事层避开手部饮料 | 高层公寓感强，适合邀请。 |
| 2 | e_lolly | 棒棒糖·自动刷脸 | 已配 | `assets/bg/lolly.jpg` | light | 脸部上中，底部对话区 | 对应棒棒糖小事件。 |
| 3 | e_depart | NEL启程·闭关送别 | 临时代用 | `assets/bg/living_room.jpg` | dark / auto | 取客厅远景与楼梯纵深，底部保留送别对白区 | 比 `home_full.jpg` 更完整，也避免继续使用早期泛用全景；仍缺明确行李特写。 |
| 3 | c6a | 聚少离多·从高光到淘汰 | 临时代用 | `assets/bg/goal.jpg` | dark | 亮部压暗、饱和度降低，底部对白区加冷遮罩 | 刻意与 `u20j` / `wc_keygoal` 拆开，保留“比赛过后只剩失落”的低谷氛围。 |
| 3 | e_curry | Nagi做的咖喱饭 | 已配 | `assets/bg/curry.jpg` | light | 厨房和人物居中，底部可读 | 高匹配。 |
| 3 | e_bday | 被遗忘的生日 | 已配 | `assets/bg/birthday.jpg` | dark / auto | 蛋糕在中部，避免 UI 遮挡蜡烛 | 高匹配。 |
| 3 | e_hug | 拥抱 | 已配 | `assets/bg/hug.jpg` | dark | 人物贴近，底部文本需深色毛玻璃 | 高匹配。 |
| 3 | e_intimate | 亲密 | 已配 | `assets/bg/bedroom.jpg` | dark | 横图裁中间床区，避开顶部 HUD 过亮 | 适合亲密节点，不直接露骨。 |
| 3 | side_b_return | Side-B·重返蓝色监狱 | 临时代用 | `assets/bg/living_room.jpg` | light / auto | 保留客厅与楼梯视线，底部文本避开前景桌面 | 比旧 `livingroom.jpg` 空间更干净，适合“在家里收到下一段命运通知”。 |
| 4 | wc_roster | 世界杯追加名单 | 临时代用 | `assets/bg/dining_room.jpg` | light / auto | 保留长桌和桌面留白，便于叠加“名单 / 平板”信息层 | 比旧 `livingroom.jpg` 更像正式查看名单与讨论去向的节点。 |
| 4 | wc_interval | 淘汰赛前训练·花环 | 已配 | `assets/bg/summer.jpg` | light | 人物头部和花环不能被 HUD 遮挡 | 花环、夏日、球场气质匹配。 |
| 4 | wc_keygoal | 生死局·世界看见他 | 已配 | `assets/bg/bg_u20j_worldcup_goal_kick.jpg` | dark | 射门动作是主体，底部加深 | 比旧 `goal.jpg` 更适合世界赛高光。 |
| 4 | wc_offer | 豪门来信 | 临时代用 | `assets/bg/living_room.jpg` | light / auto | 保留客厅与楼梯视线，底部文本避开前景桌面 | 改用东京公寓共享空间，承接“在家里收到下一阶段通知”的叙事情境，避免继续使用旧 `back.jpg` 泛用图。 |
| 5 | w_home | 归来·沙发上的拥抱 | 已配 | `assets/bg/bg_home_soft_nagi_beanbag.jpg` | light | 人物与懒人沙发居中，底部文本避开腿部 | 比旧 `home_full.jpg` 更有人物和“这里太舒服了”的柔软感。 |
| 5 | mt3 | 同居·这里太舒服了 | 已配 | `assets/bg/bg_home_soft_nagi_beanbag.jpg` | light | 人物居中，底部保留叙事层 | 强匹配 Nagi 在 Ant 家松弛下来的感觉。 |
| 5 | m_igate | 亲密门（路由器） | 系统 | N/A | N/A | N/A | 内部判定，不显示给玩家。 |
| 5 | m_shallow | 客气的距离 | 临时代用 | `assets/bg/trainning_room.png` | dark | 训练屏和器械放上中部，底部对白区单独压暗 | 从卧室切到训练房，距离感更像“他把状态锁回训练模式”。 |
| 5 | e_intimate_cohabit | 同居·靠近 | 已配 | `assets/bg/hug.jpg` | dark | 人物面部安全区优先 | 可复用亲密拥抱图。 |
| 5 | e_cozy | 甜蜜同居·深夜等你 | 已配 | `assets/bg/living_room.jpg` | dark / auto | 客厅中下部留给对话，楼梯与暖灯放上半部 | 比旧 `home_full.jpg` 更像真正住人的共享空间，也能和其他公寓节点拉开层次。 |
| 5 | w_noodle | 深夜·酸奶与泡面哲学 | 临时代用 | `assets/bg/bg_nagi_daily_city_room_icecream.jpg` | light | 甜点和手机在中下，底部文本需避开桌面 | 道具不是酸奶 / 泡面，但“深夜吃东西 + 懒散日常”更贴近。 |
| 5 | w_game | 游戏冷战·ADC走脸事件 | 已配 | `assets/bg/gameroom.png` | dark | 双人电竞桌和大屏在中上部，底部沙发暗区可承接文本 | Owner 指定使用 gameroom，匹配双排游戏 / 冷战节点。 |
| 5 | e_tipsy | 微醺之夜 | 临时代用 | `assets/bg/bar.png` | dark | 保留吧台灯光与高脚椅，底部对白区单独压暗 | 比旧 `dining.jpg` 更直接是“喝酒的那一角”，微醺情绪更明确。 |
| 5 | e_morning | 早安赖床 | 已配 | `assets/bg/bg_home_soft_nagi_beanbag.jpg` | light | 居家柔光，人物偏中 | 比旧 `morning.jpg` 更像室内赖床/懒散延展。 |
| 5 | c4 | 七夕·蓝色玫瑰与夏夜 | 系统 | N/A | N/A | N/A | 章节总节点，画面由 c4a / c4d 承接。 |
| 5 | c4a | 七夕·蓝色玫瑰 | 已配 | `assets/bg/qixi.jpg` | light | 人物和饮品在中上，底部文本 | 七夕约会感可用。 |
| 5 | c4d | 七夕之夜 | 临时代用 | `assets/bg/qixi.jpg` | dark / auto | 夜间亲密段需加深底部 | 缺蓝玫瑰 / 蛋糕特写，暂用同日约会图承接。 |
| 5 | e_festival | 夏日祭·浴衣与烟火 | 已配 | `assets/bg/bg_summer_festival_coconut.jpg` | light / auto | 人物近景，底部文本需半透明托底 | 更有夏日活动和轻喜剧感；若要烟火夜景仍可回退 `summerfestival.jpg`。 |
| 5 | transfer_contract | 夏窗·签约桌上的好麻烦 | 临时代用 | `assets/bg/bg_bluelock_meeting_contract_room.png` | light / auto | 合同桌面安全区充足，底部可放选择 / 对话 | 文件桌和签字页可承接合同谈判，但后续若要豪门夏窗质感可再补专图。 |
| 6 | club_arrival | 曼城·新的房间 | 已配 | `assets/bg/bg_manchester_living_piano.jpg` | light | 大窗、钢琴、城市高层空间完整，底部可读 | 比旧 `back.jpg` 更像豪门公寓首次抵达。 |
| 6 | club_alone | 一个人的曼城 | 已配 | `assets/bg/bg_manchester_bedroom_city_night.jpg` | dark / auto | 城市窗景是主体，床区在右下，适合孤独感 | 明确异国高层夜景，适合“资源能到，人不能一直在”。 |
| 6 | club_training | 耳机能翻译，球不会等我 | 已配 | `assets/bg/pitch.jpg` | light | 人物主体上中，底部文本 | 训练场匹配。 |
| 6 | club_media | 它翻译得很对，但不像我 | 已配 | `assets/bg/bg_club_media_press_room.png` | dark / auto | 记者席在底部偏暗，长桌和麦克风在中部 | 训练基地媒体室 / 采访背景板匹配。 |
| 6 | e_autumn | 读书之秋 | 已配 | `assets/bg/autumn.jpg` | light | 秋景和人物上半保留 | 高匹配。 |
| 6 | e_halloween | 万圣夜·专属恶魔 | 已配 | `assets/bg/Halloween.jpg` | dark | 南瓜和人物不要被底部遮挡 | 高匹配。 |
| 6 | e_drive | 飙车实录 | 已配 | `assets/bg/drive.jpg` | dark / auto | 人物脸部上中，底部对话 | 高匹配。 |
| 6 | route_mj_hidden | 第六部隐藏分流 | 系统 | N/A | N/A | N/A | 内部判定，不显示给玩家。 |
| 7 | e_agency_launch | 她站在光里 | 已配 | `assets/bg/bg_agency_launch_stage.png` | light / auto | 舞台与发言台在中上部，底部观众席可压暗 | 经纪公司发布会舞台，适合作女主高光节点。 |
| 7M | e_scarf | 送围巾 | 已配 | `assets/bg/bg_scarf_flower_delivery.jpg` | light | 花束和人物上半安全，底部文本避开手部 | 更像“送围巾/送花式关心”的柔软节点；旧 `scarf.jpg` 可作备用。 |
| 7M | e_sick_fragile | 还是感冒了 | 临时代用 | `assets/bg/afterwork.jpg` | light / auto | 桌面和城市窗景保留 | 可表达下班疲惫，但缺书房病弱照护。 |
| 7J | e_dressup | 任人打扮 | 已配 | `assets/bg/dressup.jpg` | light | 商店背景和人物保留 | 高匹配。 |
| 7J | e_softrice | 软饭王哲学 | 已配 | `assets/bg/softrice.jpg` | light | 食物和人物上半保留 | 高匹配。 |
| 7J | e_drunk | 借着醉意 | 临时代用 | `assets/bg/bar.png` | dark | 吧台灯光保留，底部文本加深 | 与 `e_tipsy` 共享同一酒吧角，但构图上更偏夜深后的靠近与失衡。 |
| 7 | route_love_hidden | 爱还是习惯隐藏判定 | 系统 | N/A | N/A | N/A | 内部判定，不显示给玩家。 |
| 8 | p8_route | 假期结束·春季名单 | 临时代用 | `assets/bg/bg_manchester_bedroom_city_night.jpg` | dark | 城市窗景和床区留白较好，适合分岔前夜 | 仍不是机场 / 离别，但比旧 bedroom 更有“世界在窗外”的分岔感。 |
| Dream | dream_exist | 没有你的世界 | 临时代用 | `assets/bg/bg_manchester_bedroom_city_night.jpg` | dark | 城市夜景和空床区可承载孤独旁白 | 仍缺欧洲酒店雨夜，但比旧 bedroom 更适合“没有你的世界”。 |
| Dream | dream_match | 他的名字 | 已配 | `assets/bg/bg_final_match_stadium_kick.jpg` | dark | 射门动作在中部，底部加深 | 更适合最终决赛 / 成名战。 |
| Dream | dream_celebrate | 看台上的庆祝 | 临时代用 | `assets/bg/bg_final_match_stadium_kick.jpg` | dark | 可承接比赛后庆祝前一刻，尽量取高光与观众席亮带 | 继续用决赛图，但不再和前面低谷比赛共用同一张。 |
| Dream | dream_return | 久别重逢 | 已配 | `assets/bg/remeet.jpg` | dark / auto | 人物上中，城市夜景保留 | 重逢感匹配。 |
| Dream | dream_home | 花园别墅·秘密基地 | 已配 | `assets/bg/villa.jpg` | light | 花园和人物保留，底部文本 | 高匹配。 |
| Dream | dream_final | 世界第一，与你 | 已配 | `assets/bg/ending_true_nagi_soft_gaze.jpg` | light / ending | 人脸近景占右侧，左侧与底部可叠加柔白渐变承载 Ending 标题 | TRUE 走“世界第一之后看向你”的安静结局感，不强求奖杯构图。 |
| Stay | stay_match | 还不是今天 | 临时代用 | `assets/bg/teamV.jpg` | dark | 取倒地与抬手构图，整体降亮压冷，底部对白区加深 | 从“高光射门”换成更像失手后余震的画面，和 Dream 线明确分开。 |
| Stay | stay_intro | 他常回来 | 已配 | `assets/bg/bg_home_soft_nagi_beanbag.jpg` | light | 室内日常和懒散坐姿明确 | 普通情侣节奏更强。 |
| Stay | stay_cozy | 暗爽·可可白兰地 | 已配 | `assets/bg/dining.jpg` | dark | 吧台灯光保留 | 高匹配。 |
| Stay | stay_daily | 情人节玩偶熊 | 已配 | `assets/bg/valentine.jpg` | light | 熊和气球在中上，底部对话 | 高匹配。 |
| Stay | stay_final | 关掉的比赛录像 | 已配 | `assets/bg/bg_stay_final_tv_glow_living_room.png` | dark / ending | 电视冷光在中上部，茶几和沙发底部留 Ending UI | 深夜比赛回放和普通结局余温明确。 |
| Bad | bad_elegant | 优雅与世俗 | 临时代用 | `assets/bg/dining_room.jpg` | dark / auto | 长桌与夜景放中上部，底部文本加深 | 比旧 `apartment.jpg` 更像“吃完那顿恢复餐后，关系却更冷”的空间。 |
| Bad | bad_plan | 他的名字，由我来写 | 已配 | `assets/bg/bg_bad_plan_data_war_room.png` | dark | 数据屏在上半部，会议桌底部留对白安全区 | 深夜数据会议室 / 预案屏幕墙匹配。 |
| Bad | bad_match | 加冕之夜 | 临时代用 | `assets/bg/teamV.jpg` | dark | 取压迫感更强的抬手/倒地构图，整体偏冷 | 不再复用普通 `goal.jpg`，让 BAD 线比赛画面更不舒服、更带代价感。 |
| Bad | bad_afterglow | 全世界都看见你 | 已配 | `assets/bg/bg_bad_afterglow_media_wall.png` | dark | 屏幕墙信息密集，底部桌面暗区可承接文本 | 舆论热搜、媒体监控、新闻流屏匹配。 |
| Bad | bad_cold | 渐行渐远 | 已配 | `assets/bg/bedroom.jpg` | dark | 视频通话式构图，底部留白 | 夜间视频通话匹配。 |
| Bad | bad_last | 我不是不想赢 | 临时代用 / cut-in | `assets/bg/bg_bad_impact_kick_cutin.jpg` | dark | 只适合激烈情绪 cut-in，不适合长对话背景 | 仍缺雨后训练基地外；本图可用于冲突瞬间或 BAD 情绪闪回。 |
| Bad | bad_far | 远处的世界第一 | 已配 | `assets/bg/bg_bad_far_award_broadcast.png` | dark / ending | 奖杯直播在上半部，前景桌面留出孤独距离感 | BAD 结局按“远处观看世界第一”处理，避免和 TRUE 近景温柔感撞。 |

---

## 4. 背景复用建议

同一张图可以复用，但要通过 UI theme、遮罩和裁切区分情绪。

| bgAsset | 建议用途 |
|---|---|
| `bg_u20j_worldcup_goal_kick.jpg` | 只保留给 U-20 / 世界赛“被看见”的正向高光节点。 |
| `bg_final_match_stadium_kick.jpg` | Dream 线决赛与庆祝前一刻，不再回退给普通低谷比赛。 |
| `teamV.jpg` | 失手、压迫、BAD / Stay 线比赛低谷节点。 |
| `living_room.jpg` | 东京公寓的共享空间、等人、回家、送别前后。 |
| `dining_room.jpg` | 正式谈话、名单查看、恢复餐、夜间对坐。 |
| `bar.png` | 微醺、借着醉意、可可白兰地等酒精相关节点。 |
| `trainning_room.png` | 训练模式、执行感、情感抽离、关系变冷。 |
| `bedroom.jpg` | 亲密或深夜独处节点；不再默认承担所有“夜景 / 疏离”场景。 |
| `worldstage.jpg` | Prologue、Dream 成名战、世界中心感。 |
| `apartment.jpg` | 高层公寓、曼城公寓、Bad 线冷感日常。 |

---

## 5. 需要补的背景包

按优先级建议补这些图，否则 V15 前半和商业线会显得跳。

1. A 级：蓝色监狱作战室：p1。
2. A 级：蓝色监狱会议室初见：c1a。
3. A 级：合同谈判会议室：transfer_contract。
4. A 级：经纪公司发布会舞台：e_agency_launch。
5. A 级：Ending Card 四套：TRUE / GOOD / NORMAL / BAD。
6. B 级：投资接待室 / 签字桌：p2。
7. B 级：LINE 专用抽象背景 / 手机近景：c1b、c2 前后消息段。
8. B 级：电竞房：w_game。
9. B 级：训练基地媒体室：club_media。
10. B 级：深夜数据会议室：bad_plan。
11. B 级：舆论热搜 / 闪光灯扩散：bad_afterglow。
12. B 级：雨后训练基地外：bad_last。
13. B 级：机场 / 夜景 / 离别氛围：p8_route。

---

## 6. 给 PM 的确认点

1. `p1 / p2 / c1a` 是否要补蓝色监狱设施图，还是用抽象 UI + 屏幕 cut-in 表现。
2. `c1b / c2` 的消息段是否全部走 LINE Mode，不单独占剧情 bg。
3. 比赛节点首版可复用 `goal.jpg`，但后续至少补 U-20 / World Cup / Final 三套球场差异。
4. BAD 线是否需要独立冷商业视觉包，避免和 Dream 线共用世界舞台感。
5. Ending Card 由 CoCo 单独出四类视觉，不从现有普通 bg 中挑图。
6. V15 文本里 `bad_far` 的系统行仍是 `BAD END｜远处的世界第一`，但当前产品口径已改为 `BAD END：好麻烦`。结局卡和 UI 展示必须按产品口径。
