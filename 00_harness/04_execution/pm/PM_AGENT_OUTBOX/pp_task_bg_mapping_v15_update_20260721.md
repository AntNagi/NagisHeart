# PP 任务：BG Mapping v1.5 全量替换

**来源**：Ant 全量重配 BG（Excel 节点匹配表 Antset 列）  
**权威文件**：`00_harness/08_authority_current/05_visual_mapping/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md`（已更新至 v1.5）  
**优先级**：P0  
**日期**：2026-07-21

---

## 任务说明

Ant 在 Excel 表里逐节点确认了最终 BG 图片匹配。`scene_visuals.json` 中的 `bg` 字段需要按下表更新。共 30 个节点的 bgAsset 发生变更。

另外：`assets/bg/birthay_at_home.jpg` 已改名为 `birthday_at_home.jpg`（修正 typo），代码中如有引用也要同步。

---

## 变更清单

| nodeId | 标题 | 旧 bgAsset | 新 bgAsset |
|---|---|---|---|
| prologue | 开场白 | `assets/bg/worldstage.jpg` | `assets/bg/remeet.jpg` |
| c1a | 会议室初见 | `assets/bg/bg_bluelock_meeting_contract_room.png` | `assets/bg/first_meet.png` |
| u20j | U-20日本代表战 | `assets/bg/bg_u20j_worldcup_goal_kick.jpg` | `assets/bg/vs_u20_japan_kick.jpg` |
| c6a | 聚少离多·从高光到淘汰 | `assets/bg/goal.jpg` | `assets/bg/falling_down.jpg` |
| e_bday | 被遗忘的生日 | `assets/bg/birthday.jpg` | `assets/bg/birthday_at_home.jpg` |
| wc_roster | 世界杯追加名单 | `assets/bg/dining_room.jpg` | `assets/bg/bar.png` |
| wc_offer | 豪门来信 | `assets/bg/living_room.jpg` | `assets/bg/bg_nagi_daily_city_room_icecream.jpg` |
| w_home | 归来·沙发上的拥抱 | `assets/bg/bg_home_soft_nagi_beanbag.jpg` | `assets/bg/living_room.jpg` |
| mt3 | 同居·这里太舒服了 | `assets/bg/bg_home_soft_nagi_beanbag.jpg` | `assets/bg/pillow.jpg` |
| e_intimate_cohabit | 同居·靠近 | `assets/bg/hug.jpg` | `assets/bg/nagi_with_cat.jpg` |
| e_cozy | 甜蜜同居·深夜等你 | `assets/bg/living_room.jpg` | `assets/bg/live_together_some_days.jpg` |
| w_noodle | 深夜·酸奶与泡面哲学 | `assets/bg/bg_nagi_daily_city_room_icecream.jpg` | `assets/bg/nagi_at_home_3.jpg` |
| w_game | 游戏冷战 | `assets/bg/gameroom.png` | `assets/bg/gaming_room.png` |
| e_morning | 早安赖床 | `assets/bg/bg_home_soft_nagi_beanbag.jpg` | `assets/bg/wakeup.jpg` |
| c4a | 七夕·蓝色玫瑰 | `assets/bg/qixi.jpg` | `assets/bg/white_suits.jpg` |
| c4d | 七夕之夜 | `assets/bg/qixi.jpg` | `assets/bg/bedroom.jpg` |
| e_festival | 夏日祭 | `assets/bg/bg_summer_festival_coconut.jpg` | `assets/bg/summer_festival.jpg` |
| e_scarf | 送围巾 | `assets/bg/bg_scarf_flower_delivery.jpg` | `assets/bg/scarf.jpg` |
| e_sick_fragile | 还是感冒了 | `assets/bg/afterwork.jpg` | `assets/bg/nagi_at_home_2.jpg` |
| dream_match | 他的名字 | `assets/bg/bg_final_match_stadium_kick.jpg` | `assets/bg/bg_bad_impact_kick_cutin.jpg` |
| dream_celebrate | 看台上的庆祝 | `assets/bg/bg_final_match_stadium_kick.jpg` | `assets/bg/star.jpg` |
| dream_home | 花园别墅 | `assets/bg/villa.jpg` | `assets/bg/new_home.jpg` |
| dream_final | 世界第一，与你 | `assets/bg/ending_true_nagi_soft_gaze.jpg` | `assets/bg/true_end.jpg` |
| stay_match | 还不是今天 | `assets/bg/teamV.jpg` | `assets/bg/ending_true_nagi_soft_gaze.jpg` |
| stay_intro | 他常回来 | `assets/bg/bg_home_soft_nagi_beanbag.jpg` | `assets/bg/back.jpg` |
| stay_cozy | 暗爽·可可白兰地 | `assets/bg/dining.jpg` | `assets/bg/bar.png` |
| bad_match | 加冕之夜 | `assets/bg/teamV.jpg` | `assets/bg/king.jpg` |
| bad_cold | 渐行渐远 | `assets/bg/bedroom.jpg` | `assets/bg/walk-in_closet.png` |
| bad_last | 我不是不想赢 | `assets/bg/bg_bad_impact_kick_cutin.jpg` | `assets/bg/pitch.jpg` |
| bad_far | 远处的世界第一 | `assets/bg/bg_bad_far_award_broadcast.png` | `assets/bg/goal_faraway.jpg` |

---

## 执行步骤

1. 打开 `story-data/scene_visuals.json`
2. 逐节点查找 `nodeId`，将 `bg` 字段替换为新 bgAsset 路径
3. 注意文件扩展名：有的是 `.jpg`，有的是 `.png`，按上表精确匹配
4. `birthday_at_home.jpg`：如果代码中有引用旧名 `birthay_at_home.jpg`，也要改
5. 完成后全文搜索确认旧路径不再出现

## 不要做

- 不改 `assets/bg/` 里的图片文件本身
- 不改权威 mapping 文档
- 不改其他 story-data JSON
- 不改 UI 代码
- c2（假期的消息）和 e_depart（NEL启程·闭关送别）保持原值不动

## 验证

- 逐节点核对 `scene_visuals.json` 的 bg 值与上表一致
- 确认所有新 bg 文件在 `assets/bg/` 中存在
- 编译通过后真机验证关键节点背景显示
