# TASK-20260725-001 Android 剧情地图实现报告

更新时间：2026-07-25  
负责人：Sai

## 本次改动范围

- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/ChapterScreen.kt`
  - 移除旧“章节目录”列表页，改为原生两层剧情地图：
    - 外层：8 章总览。
    - 内层：单章小节节点地图。
  - 外层不显示“剧情地图”大标题，沿用系统固定背景和当前返回按钮样式。
  - 进入章节使用 `AnimatedContent`，`fade + scale`，时长 280ms，符合 240-320ms 过渡口径。
  - 小节节点按 `chapters.json.sections[]` 渲染，不合并相邻小节。
  - 第八章按 `scope` 分为并列路线，优先顺序：`dream / stay / bad`，未写死成单线。
  - 已读/当前节点高亮；未读节点压暗，不展示状态文案、锁、check、百分比、chip。
  - 未读节点标题显示为同长度 `?`，重点未读节点不放图。
  - 可进入节点：
    - `IN_PROGRESS` 调 `onJumpToNode(startNode)`。
    - `COMPLETED / SKIPPED_COMPLETED` 调 `onReplaySection(startNode, chapterId, sectionIndex)`，保持安全回看链路。
  - 图片节点 BG 来源为 `viewModel.getNodeBgPath(section.startNode)`，即 `StoryEngine.getNodeBg()`，不引用设计预览图。
  - 章节和章节内滚动位置用 `LazyListState` 保存，返回总览/切换章节时保留当前位置。

- `android/app/src/main/java/com/antnagi/nagisheart/ui/viewmodel/GameViewModel.kt`
  - 新增只读接口：
    - `getNodeBgPath(nodeId: String): String?`
  - 该接口直接返回 `StoryEngine.getNodeBg(nodeId)`，只读，不改剧情数据、路由、存档或 progress。

- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/StartScreen.kt`
  - 主入口文案从“章节目录”改为“剧情地图”。

## 明确未改内容

- 未修改剧情正文。
- 未修改节点顺序、路线逻辑、flow、router。
- 未修改 `story-data/chapters.json`、`story-data/scene_visuals.json` 或 Android assets 里的 story-data。
- 未引用、复制或加载 `design/concepts/story_map_xoxo_v1/` 下的 PNG / SVG / generator。
- 未改 Web、TT Start、App Icon、画廊、结局页。
- 未删除资源。

## BG 与 focus 实现口径

实现链路：

```text
chapters.json.sections[].startNode
→ GameViewModel.getNodeBgPath(startNode)
→ StoryEngine.getNodeBg(startNode)
→ scene_visuals.json[startNode].bg
→ file:///android_asset/<bgPath>
```

Compose 裁剪口径：

- 使用 `ContentScale.Crop`，但不做全局统一 centerCrop。
- `storyMapImageAlignment(bgPath)` 按稳定 BG key 分配 alignment：
  - `goal_faraway` → `BiasAlignment(0, 0.22)`
  - `soft_gaze` → `BiasAlignment(0, -0.62)`
  - `true_end` → `BiasAlignment(0, -0.34)`
  - `king` → `BiasAlignment(-0.08, -0.38)`
  - `nagi` → `BiasAlignment(0, -0.34)`
  - `face / portrait` → `BiasAlignment(0, -0.42)`
  - 其他环境 / 道具 BG → `Alignment.Center`

## startNode → bg → focus 抽样/全量表

> 数据由 `story-data/chapters.json` + `story-data/scene_visuals.json` 读取；未授权补 mapping，因此缺失只记录，不修改。

| Chapter | # | startNode | title | bg | focus |
|---|---:|---|---|---|---|
| part1 | 1 | p1 | 作战室·初遇 | assets/bg/bluelock_monitor_room.jpg | center |
| part1 | 2 | p2 | 投资的私心 | assets/bg/bg_bluelock_meeting_contract_room.png | center |
| part1 | 3 | c1a | 会议室初见 | assets/bg/first_meet.png | center |
| part1 | 4 | c1b | 不麻烦的人 | assets/bg/easygoing _person.jpg | center |
| part1 | 5 | u20j | U-20日本代表战·被日本看见 | assets/bg/vs_u20_japan_kick.jpg | center |
| part2 | 1 | c3 | 开放日 | assets/bg/openday.jpg | center |
| part2 | 2 | e_lemontea | 你的，我的 | assets/bg/lemontea.jpg | center |
| part2 | 3 | c2 | 假期的消息 | assets/bg/message_in_holiday.jpg | center |
| part2 | 4 | e_invite | 高级公寓的邀请 | assets/bg/apartment.jpg | center |
| part2 | 5 | e_lolly | 棒棒糖·自动刷脸 | assets/bg/lolly.jpg | center |
| part3 | 1 | e_depart | NEL启程·闭关送别 | assets/bg/nel_start.png | center |
| part3 | 2 | c6a | 聚少离多·从高光到淘汰 | assets/bg/falling_down.jpg | center |
| part3 | 3 | e_curry | Nagi做的咖喱饭 | assets/bg/curry.jpg | center |
| part3 | 4 | e_bday | 被遗忘的生日 | assets/bg/birthday_at_home.jpg | center |
| part3 | 5 | e_hug | 拥抱 | assets/bg/hug.jpg | center |
| part3 | 6 | e_intimate | 亲密 | assets/bg/bedroom.jpg | center |
| part3 | 7 | side_b_return | Side-B·重返蓝色监狱 | assets/bg/living_room.jpg | center |
| part4 | 1 | wc_roster | 世界杯追加名单 | assets/bg/bar.png | center |
| part4 | 2 | wc_interval | 淘汰赛前训练·花环 | assets/bg/summer.jpg | center |
| part4 | 3 | wc_keygoal | 生死局·世界看见他 | assets/bg/bg_u20j_worldcup_goal_kick.jpg | center |
| part4 | 4 | wc_offer | 豪门来信 | assets/bg/bg_nagi_daily_city_room_icecream.jpg | BiasAlignment(0, -0.34) |
| part5 | 1 | w_home | 归来·沙发上的拥抱 | assets/bg/living_room.jpg | center |
| part5 | 2 | mt3 | 同居·这里太舒服了 | assets/bg/pillow.jpg | center |
| part5 | 3 | e_intimate_cohabit | 同居·靠近 / 客气的距离 | assets/bg/nagi_with_cat.jpg | BiasAlignment(0, -0.34) |
| part5 | 4 | e_cozy | 甜蜜同居·深夜等你 | assets/bg/live_together_some_days.jpg | center |
| part5 | 5 | w_noodle | 深夜·酸奶与泡面哲学 | assets/bg/nagi_at_home_3.jpg | BiasAlignment(0, -0.34) |
| part5 | 6 | w_game | 游戏冷战·ADC走脸事件 | assets/bg/gaming_room.png | center |
| part5 | 7 | e_tipsy | 微醺之夜 | assets/bg/bar.png | center |
| part5 | 8 | e_morning | 早安赖床 | assets/bg/wakeup.jpg | center |
| part5 | 9 | c4 | 七夕·蓝色玫瑰与夏夜 | missing in direct startNode mapping | safe no-image fallback |
| part5 | 10 | e_festival | 夏日祭·浴衣与烟火 | assets/bg/summer_festival.jpg | center |
| part5 | 11 | transfer_contract | 夏窗·签约桌上的好麻烦 | assets/bg/bg_bluelock_meeting_contract_room.png | center |
| part6 | 1 | club_arrival | 曼城·新的房间 | assets/bg/bg_manchester_living_piano.jpg | center |
| part6 | 2 | club_alone | 一个人的曼城 | assets/bg/bg_manchester_bedroom_city_night.jpg | center |
| part6 | 3 | club_training | 耳机能翻译，球不会等我 | assets/bg/pitch.jpg | center |
| part6 | 4 | club_media | 它翻译得很对，但不像我 | assets/bg/bg_club_media_press_room.png | center |
| part6 | 5 | e_autumn | 读书之秋 | assets/bg/autumn.jpg | center |
| part6 | 6 | e_halloween | 万圣夜·专属恶魔 | assets/bg/Halloween.jpg | center |
| part6 | 7 | e_drive | 飙车实录 | assets/bg/drive.jpg | center |
| part7 | 1 | e_agency_launch | 她站在光里 | assets/bg/bg_agency_launch_stage.png | center |
| part7 | 2 | e_scarf | 送围巾 | assets/bg/scarf.jpg | center |
| part7 | 3 | e_sick_fragile | 还是感冒了 | assets/bg/nagi_at_home_2.jpg | BiasAlignment(0, -0.34) |
| part7 | 4 | e_dressup | 任人打扮 | assets/bg/dressup.jpg | center |
| part7 | 5 | e_softrice | 软饭王哲学 | assets/bg/softrice.jpg | center |
| part7 | 6 | e_drunk | 借着醉意 | assets/bg/bar.png | center |
| part8 | 1 | p8_route | 假期结束·春季名单 | assets/bg/bg_manchester_bedroom_city_night.jpg | center |
| part8 | 2 | dream_exist | 没有你的世界 | assets/bg/bg_manchester_bedroom_city_night.jpg | center |
| part8 | 3 | dream_match | 他的名字 | assets/bg/bg_bad_impact_kick_cutin.jpg | center |
| part8 | 4 | dream_celebrate | 看台上的庆祝 | assets/bg/star.jpg | center |
| part8 | 5 | dream_return | 久别重逢 | assets/bg/remeet.jpg | center |
| part8 | 6 | dream_home | 花园别墅·秘密基地 | assets/bg/new_home.jpg | center |
| part8 | 7 | dream_final | 世界第一，与你 | assets/bg/true_end.jpg | BiasAlignment(0, -0.34) |
| part8 | 8 | stay_match | 还不是今天 | assets/bg/ending_true_nagi_soft_gaze.jpg | BiasAlignment(0, -0.62) |
| part8 | 9 | stay_intro | 他常回来 | assets/bg/back.jpg | center |
| part8 | 10 | stay_cozy | 暗爽·可可白兰地 | assets/bg/bar.png | center |
| part8 | 11 | stay_daily | 情人节玩偶熊 | assets/bg/valentine.jpg | center |
| part8 | 12 | stay_final | 关掉的比赛录像 | assets/bg/bg_stay_final_tv_glow_living_room.png | center |
| part8 | 13 | bad_elegant | 优雅与世俗 | assets/bg/dining_room.jpg | center |
| part8 | 14 | bad_plan | 他的名字，由我来写 | assets/bg/bg_bad_plan_data_war_room.png | center |
| part8 | 15 | bad_match | 加冕之夜 | assets/bg/king.jpg | BiasAlignment(-0.08, -0.38) |
| part8 | 16 | bad_afterglow | 全世界都看见你 | assets/bg/bg_bad_afterglow_media_wall.png | center |
| part8 | 17 | bad_cold | 渐行渐远 | assets/bg/walk-in_closet.png | center |
| part8 | 18 | bad_last | 我不是不想这样赢 | assets/bg/pitch.jpg | center |
| part8 | 19 | bad_far | 远处的世界第一 | assets/bg/goal_faraway.jpg | BiasAlignment(0, 0.22) |

## 校验记录

- `node tools/validate.js`
  - 结果：PASSED，0 errors，1 existing warning（9 条 hardcoded `Ant` 文本）。
- `powershell -ExecutionPolicy Bypass -File tools/check-tokens.ps1`
  - 结果：OK。
- `rg -n "design/concepts/story_map_xoxo_v1|story_map_xoxo_v1" android/app/src/main`
  - 结果：无匹配；Android runtime 未引用设计预览目录。
- Android Kotlin 构建：
  - 本机没有 `android/gradlew`。
  - 系统 `gradle :app:compileDebugKotlin` 失败，原因为 `gradle` 命令不存在。
  - 因此无法在本机生成 Android Studio 编译结果和实机截图。

## 截图/录屏状态

任务要求的截图/录屏尚未由本机生成，原因是当前环境没有可用 Gradle/Android 构建入口，也没有模拟器截图链路。

需要 Ant 或有 Android Studio 构建环境的机器补充：

1. 八章总览截图。
2. 一个普通章节子页截图。
3. 第五章长页截图。
4. 第八章三路线并列截图。
5. 已读 / 未读相邻节点对比截图。
6. 至少四张含 Nagi 的真实 BG 节点裁剪截图。
7. 至少一张无 Nagi 的环境 / 道具 BG 节点截图。
8. 进入章节、滚动、进回看、返回恢复位置的连续截图或录屏。

## 2026-07-26 Sai follow-up

Ant 实机反馈：

- 第一层 / 第二层剧情地图缺少底图级背景路径线。
- 多张含 Nagi 的剧情图在横向缩略卡里未框住脸和眼睛。

已补 Android：

- `ChapterScreen.kt`
  - 2026-07-26 二次修正：撤掉错误的静态全屏背景线。
  - 新增 `StoryMapNodeConnector(fromIndex, toIndex)`，连接线作为 `LazyColumn` 内容的一部分插入节点之间，随节点 / 图片一起滚动和错落移动。
  - 连接线按节点位置计算起止点：
    - center 节点中心 `0.50w`
    - left 节点中心 `0.28w`
    - right 节点中心 `0.72w`
  - 连接线使用 `Canvas` 曲线路径：蓝色弱 glow `authorityBlueGlow alpha 0.16 / 3.6dp` + 金色主线 `speakerGold alpha 0.34 / 1.25dp`，起终点有弱金色节点圆点。
  - `storyMapImageAlignment(bgPath)` 从泛化规则改为具体 BG key override，补齐以下 Nagi / 人物图焦点：
    - `first_meet` → `BiasAlignment(0, -0.96)`
    - `easygoing` → `BiasAlignment(0, -1.00)`
    - `nel_start` → `BiasAlignment(0, -0.92)`
    - `falling_down` → `BiasAlignment(0, -1.00)`
    - `lolly` → `BiasAlignment(-0.06, -0.82)`
    - `birthday_at_home` → `BiasAlignment(0, -0.70)`
    - `hug` → `BiasAlignment(0, -0.76)`
    - `bedroom` → `BiasAlignment(0, -0.72)`
    - `pillow` → `BiasAlignment(0, -0.78)`
    - `wakeup` → `BiasAlignment(0, -0.78)`
    - `drive` → `BiasAlignment(0, -0.72)`
    - `scarf` → `BiasAlignment(0, -0.72)`
    - `dressup` → `BiasAlignment(0, -0.76)`
    - `softrice` → `BiasAlignment(0, -0.72)`
    - `remeet` → `BiasAlignment(0, -0.76)`
    - `back` → `BiasAlignment(0, -0.72)`
    - `valentine` → `BiasAlignment(0, -0.72)`
    - `bad_impact` → `BiasAlignment(0, -0.68)`
    - `nagi_with_cat` → `BiasAlignment(0, -0.72)`
    - `nagi_at_home_2` → `BiasAlignment(0, -0.70)`
    - `nagi_at_home_3` → `BiasAlignment(0, -0.68)`
    - `daily_city_room_icecream` → `BiasAlignment(0, -0.84)`
    - `soft_gaze` → `BiasAlignment(0, -0.90)`
    - `true_end` → `BiasAlignment(0, -0.84)`
    - `king` → `BiasAlignment(-0.08, -0.86)`

- `SplashScreen.kt`
  - 顺手修掉 Start 暗角残留导致的编译报错风险：`NagiTokens.startVignette` 改为已有的 `NagiTokens.authorityVoid`。

校验：

- `node tools/validate.js`：通过，0 errors / 1 existing hardcoded-Ant warning。
- `powershell -ExecutionPolicy Bypass -File tools/check-tokens.ps1`：通过。
- `git diff --check`：通过，仅 CRLF 提示。
- `rg` screen 层确认无 `design/concepts/story_map_xoxo_v1`、`story_map_xoxo_v1`、旧“章节目录”/“选择章节重新阅读”引用。

## 2026-07-26 Sai rollback note

Ant 反馈坐标线实现不符合设计稿且画面挤压错乱。已撤回本轮坐标版 / 自创路线实现，恢复到上一版错落卡片结构；不再保留 `StoryMapDesignRoute`、`DesignSlot`、`chapterDesignLayout`、`Canvas` 路线绘制等实验实现。图片 focus 修正保留。
