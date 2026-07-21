# Nagi’s Heart · Design V3.1 Latest

> 版本：Design V3.1  
> 基准剧本：`Nagis_Heart_SCRIPT_V14.md`  
> 来源底稿：`NagisHeart_Design_V2_1.md`  
> 用途：作为《Nagi’s Heart》当前全量剧情结构、节点迁移、系统变量、路线分流、结局判定与 story.js 路由调整的最新设计文档。  
> 核心说明：本文件在 Design V3.0 基础上同步 SCRIPT V14 第一部重构；第二部以后仍沿用当前 SCRIPT V14 继承的 V13.1 显示层减字版结构，第七部与第八部沿用当前 V13/V14 终局状态。旧 V2.1 中“第七部冬季分线篇 / 第八部春季终局篇 / w_letter → w_elegant → w_cozy → w_exist → w_restart → final_choice”已不再作为最新主线。

---

## 0. V3.1 更新摘要

### 0.0 相对 V3.0 的核心变化

V3.1 只做结构同步，不重排第二部以后的主线。核心变化集中在第一部：

- 补充 Ant 对 Nagi 的现实迷恋动因：她不只被 Nagi 的光击中，也被他以天赋和 EGO 轻盈越过规则、抵达不可企及之处的存在方式击中；这成为她保护欲、资源投入与 BAD 线控制风险的深层来源。

```text
第一部已按 SCRIPT V14 重构。
p1 / p2 / c1a 从旧显示层短节点扩展为完整剧情节点。
旧 e_select2 与旧 c1b 合并进新版 c1b「不麻烦的人」。
新版 c1b 的核心不再是简单“心意相通”，而是 Ant 主动夜聊、逐步了解 Nagi，并在关键节点成为他的精神补位。
```

因此第一部最新链路为：

```text
p1 → p2 → c1a → c1b → u20j
```


### 0.1 相对 V2.1 的核心变化

V2.1 的全量设计中，前五部基本仍可作为结构基准，第六部也已经接近当前版本。但 V2.1 的第七部、第八部以及结局链路已被后续创作大幅替换。

最新状态为：

```text
第一部：已按 SCRIPT V14 重构为完整剧情节点链。
第二至五部：仍以当前 SCRIPT V14 继承的 V13.1 显示层减字版为基准。
第六部：仍以 V11 的“豪门新星篇：新的房间，新的规则”为基准。
第七部：已替换为 V12 的“发布会后东京返日假期”情绪爆发篇。
第八部：已替换为 V13/V14 的“世界中心篇：他的名字”三路线终局篇。
```

### 0.2 当前最新主轴

旧 V2.1 的第八部主轴是：

```text
芭乐情书 → 优雅与世俗 → 暗爽 → 没有Ant的世界 → 春日再出发 → 最后抉择
```

当前 V13/V14 已改为：

```text
p8_route | 假期结束·春季名单
→ Dream线：他成名，Ant见证
→ Stay线：他暂未成名，Ant陪伴
→ Bad线：他成名，Ant加冕
```

### 0.3 当前最新终局命题

```text
当 Nagi 终于有机会拥有自己的名字时，
Ant是在看台上为他庆祝，
是在球员通道外接住还没成名的他，
还是冲进他的胜利里，把这场比赛变成亲手设计的加冕。
```

---

## 1. 总则

### 1.1 最高原则

```text
标题仍然是 Nagi’s Heart，不是 Ant’s Heart。
```

Ant 是玩家视角、恋爱对象、资源系统、压力源、镜子和路线分歧机制。但每一个关键节点最终都要回到：

- Nagi 如何爱；
- Nagi 如何回应；
- Nagi 如何逃避；
- Nagi 如何被期待；
- Nagi 如何不适于被安排；
- Nagi 如何主动选择；
- Nagi 如何确认自己的 EGO、感情、欲望和未来。

Ant 的爱是路径。Nagi 的心是终点。

### 1.2 表层与底层

```text
表层：乙女游戏恋爱、同居、亲密、轻喜剧、活动、约会、季节感。
底层：足球成长、世界舞台、资本与商业化、被安排的不适、Ant 的理想、Nagi 的主动性。
```

正文不应直接写成设计论文。不要让角色说出“控制”“造神”“自我压缩”“真实的 Nagi”这类设计词。正文要通过事件体现：

- 训练室灯有没有亮；
- 恢复训练是否被延后；
- 新房间有没有家的感觉；
- 采访时谁替他说话；
- 商业活动中他有没有被摆弄；
- Ant 是让他自己决定，还是替他排好；
- Nagi 是靠近，还是安静地收回一点；
- 关键战之后，Ant 是见证、陪伴，还是加冕。

---

## 2. 核心命题

《Nagi’s Heart》不是普通“攻略凪诚士郎”的游戏，也不是 Ant 的单人自我成长史。它的结构是：

```text
玩家通过 Ant 的心，去撞开 Nagi 的心。
```

Nagi 的外显性格很明确：懒、嫌麻烦、低反应、天才、被动、不想努力、好像只要舒服就可以。但他的真正成长不是从“懒人变努力家”，而是从“以为自己什么都无所谓”，到逐渐确认自己真正想要什么。

Ant 是让他无法继续假装无所谓的人。她看见他的光，也会把期待、资源、爱和压力一起带到他面前。她不是 Nagi 的答案，而是让 Nagi 看见自己反应的人。

### 2.1 Nagi 的成长核心

```text
不是：我要努力，我要变强，我要成为好男友。
而是：原来我也会想赢，想确认自己，想掌控比赛，想看见自己的可能性。
```

他的 EGO 更接近：

- 想掌控比赛；
- 想让世界在他脚下变成自己的形状；
- 想确认只有自己能做到的东西；
- 想成为世界中心般的存在；
- 想看到自己还能走到哪里。

他不会长篇宣言。变化要藏在短句、动作、停顿里。

### 2.2 Ant 的核心危险

Ant 成熟、理性、自律、判断力强。她不是普通成长型女主。她的问题不是“不够优秀”，而是：

```text
她太懂价值，但不太懂人。
她太懂如何让一束光更亮，却不太懂那束光也会累、会烦、会逃避、会不想被照亮。
```

她对 Nagi 的日常懒散有特权豁免：乱拖鞋、袜子塞沙发、低回应、不主动、嫌麻烦，这些在普通恋爱里可能致命，但在 Ant 眼里属于“光之外的东西”，甚至可爱。

真正会触发 Ant 焦虑的是：Nagi 把这种懒散延伸到训练、恢复、复盘、未来、豪门机会、世界舞台。


### 2.2.1 Ant 迷恋 Nagi 的现实心理动因

Ant 对 Nagi 的着迷不能只写成抽象的“光”或“神性”。她真正被击中的，还有 Nagi 极其现实、甚至有些庸俗的一面：他毫不费力地抵达了别人无法企及的高度。

Ant 是在规则下成长的人。她知道所有成绩都需要代价：努力、规划、自律、资源交换、长期紧绷、对结果负责。她很优秀，但她的优秀不是轻盈的，而是高标准和高控制换来的。

Nagi 则相反。他依赖天赋和 EGO，轻飘飘地完成别人拼命也做不到的事，却对自己完成的惊人之事毫无意识。大家趋之若鹜的东西——才能、胜利、舞台、关注——对他常常像草芥。

这让 Ant 羡慕他，也让她想保护他。Nagi 是她无法成为的乌托邦：不用像她一样紧绷，却能抵达最高处；不必遵守她熟悉的成功规则，却拥有最纯粹的可能性。

因此，Ant 想让他踩着最好的资源、最短的路径、最高的效率，走上最高的舞台。她真心认为，除了 Nagi 之外，没有人配得上这样的安排；即使别人做到了，也不会像 Nagi 这样纯粹、轻盈、毫无自觉地接近奇迹。

这份欲望本身既浪漫又危险：

```text
成熟线：Ant 承认 Nagi 不是自己的理想载体，而是必须自己渴望、自己选择、自己抵达的人。
BAD 线：Ant 把 Nagi 推成她看见的最高答案，用最正确的资源和路径覆盖了 Nagi 自己的声音。
```

写作时不要让 Ant 直接长篇自白“你是我的乌托邦”。这层动机应体现在她看见 Nagi 不珍惜天赋时的震动、嫉妒、保护欲、资源投入和 BAD 线里的危险台词中。

### 2.3 真正危险的冲突

不是普通情侣吵架。

不是：

```text
Nagi 不回消息，Ant 生气。
Nagi 太懒，Ant 管他。
Nagi 不会照顾人，Ant 失望。
```

真正危险的是：

```text
Ant 太想保护那束光，最后把真实的 Nagi 压在光下面。
Nagi 不是不爱她，而是开始觉得自己在她身边也必须按正确方式发光。
```

Bad 线不是“不够爱”，而是“爱得太用力，理想压过了人”。

---

## 3. 时间线总览（V3）

| 时间 | 足球 / 外部阶段 | 关系阶段 | 篇章功能 | 对应篇章 |
|---|---|---|---|---|
| 2018.11 - 2019.2 | 蓝监启动、一次/二次选拔、U-20日本代表战 | 凝视 → 相识 | Ant 先看见 Nagi 的光，Nagi 发现 Ant 看得懂他 | 第一部 |
| 2019.2月底 - 3月初 | U-20战后开放日 | 心动爆发、关系迅速贴近 | 现实重逢，Nagi 进入 Ant 的生活 | 第二部 |
| 2019.3 - 5.6后 | NEL 高光 → 淘汰 → 生日 → Side-B | 第一次低谷与情绪出口 | Nagi 失去机会后意识到自己不是无所谓 | 第三部 |
| 2019.6 - 7月 | U-20世界杯淘汰赛、Side-B追加名单、豪门关注 | 世界重新看见他 | Nagi 在世界赛场关键进球，引出豪门来信 | 第四部 |
| 2019.7 - 8/9月 | 世界杯后、欧洲夏窗 | 正式同居、热恋、夏窗签约 | Ant 家太舒服，Nagi 不能永远躲在这里 | 第五部 |
| 2019.9 - 11月 | 加入曼城、第一赛季初 | 热恋后磨合 | 世界没有 Ant 家那么舒服；训练、媒体、商业化与被安排的不适浮出 | 第六部 |
| 2019.12 - 2020.1 | 发布会后东京返日假期 | 情绪爆发、M/J关系质感显影 | 同样爱他，但不同相处方式造成不同关系质感；形成 TRUE/GOOD 与 NORMAL/BAD 前置资格池 | 第七部 |
| 2020.1 - 5月前 | 第一赛季后半程、春季杯赛关键战 | 终局分流 | Nagi第一次个人荣誉机会；Ant在现场见证、陪伴或加冕 | 第八部 |
| 2020.5以后 | 大球星阶段 / 未来线 | 结局收束 | TRUE / GOOD / NORMAL / BAD | 结局篇 |

---

## 4. 篇章结构总览（V3）

```text
开场白
第一部 · 原作前置篇：他还没看见你，你已经看见了他
第二部 · 关系确立篇：开放日，突然进入彼此生活
第三部 · 前期低谷篇：NEL淘汰、生日与Side-B重返
第四部 · 世界看见他篇：U-20世界杯与豪门招募
第五部 · 世界杯后的夏天：同居、热恋与夏窗签约
第六部 · 豪门新星篇：新的房间，新的规则
第七部 · 发布会后东京返日假期：她站在光里
第八部 · 世界中心篇：他的名字
结局篇 · TRUE / GOOD / NORMAL / BAD
```

---

## 5. 前五部基准

前五部仍以当前 SCRIPT V14 中已经继承与修订的前五部为准。Design V3.1 不重排第二至五部；仅同步第一部 V14 重构。

### 5.1 第一部 · 原作前置篇

节点：

```text
p1 | 作战室·初遇
p2 | 投资的私心
c1a | 会议室初见
c1b | 不麻烦的人
u20j | U-20日本代表战·被日本看见
```

功能：

- `p1` 建立 Ant 第一次看见 Nagi 的核心场景。不是泛泛看见天才，而是在 V队对Z队的实时观察中，看见 Nagi 被洁等人刺激后短暂“睡醒”的瞬间。
- `p2` 建立投资私心。Ant 表面以成熟投资人身份签下蓝色监狱追加投资，内心真正让她不再犹豫的是 Nagi。
- `c1a` 是第一次单独见面。Ant 用投资人身份争取会面，但真正发生的是一场真诚到唐突的恋爱场景。她直接告诉 Nagi 自己看见了他进球之后那个“自己先看见自己”的瞬间，并在他离开前鼓起勇气加 LINE。
- `c1b` 合并旧 `e_select2` 与旧 `c1b` 功能。前半是 Ant 主动几乎每天找 Nagi 聊天，从他短句里拼出他的生活状态和内在变化；后半是关键节点中 Nagi 主动找她，包括选择洁、输给凛队后洁被抢走。核心不是简单“心意相通”，而是 Ant 成为 Nagi 的精神补位。
- `u20j` 完成第一部收束。Nagi 第一次被整个日本看见，与 `p1` 中“Ant 先看见他”形成呼应，并为后续“世界看见他”做前置。

### 5.2 第二部 · 关系确立篇

节点：

```text
c3 | 开放日
e_lemontea | 你的，我的
c2 | 假期的消息
e_invite | 高级公寓的邀请
e_lolly | 棒棒糖·自动刷脸
```

功能：

- `c3` 完成线下贴近和 Nagi 对 Ant 的自然接纳。
- `e_lemontea` 建立恋爱感和 Nagi 式低反应暧昧。
- `c2` 完成告白与关系确认。
- `e_invite/e_lolly` 建立 Ant 公寓、一一、自动刷脸和“这里不麻烦”的吸引力。

### 5.3 第三部 · 前期低谷篇

节点：

```text
e_depart | NEL启程·闭关送别
c6a | 聚少离多·从高光到淘汰
e_curry | Nagi做的咖喱饭
e_bday | 被遗忘的生日
e_hug | 拥抱
e_intimate | 亲密
side_b_return | Side-B·重返蓝色监狱
```

功能：

- `c6a` 必须让 NEL 的高光与淘汰并存，不能只写失败。
- `e_curry/e_bday` 表层是日常与生日，底层是 Nagi 回到普通生活后发现并不轻松。
- `e_hug/e_intimate` 是情绪出口，不是普通亲密福利。
- `side_b_return` 是 Nagi 自己重新走向蓝锁，不能写成 Ant 拯救他。

### 5.4 第四部 · 世界看见他篇

节点：

```text
wc_roster | 世界杯追加名单
wc_interval | 淘汰赛前训练·花环
wc_keygoal | 生死局·世界看见他
wc_offer | 豪门来信
```

功能：

- `wc_roster` 不是普通入选，而是“追加名单 → 淘汰赛首发 → 新变量”。
- `wc_interval` 保留花环原味，但功能是压力前夜的松弛和安静兴奋。
- `wc_keygoal` 是 Nagi 在世界赛场确认“球到脚下，世界变成他的形状”。
- `wc_offer` 只写豪门来信和世界开始抢他，不展开正式谈判，避免吃掉第五部夏窗功能。

### 5.5 第五部 · 世界杯后的夏天

节点：

```text
w_home | 归来·沙发上的拥抱
mt3 | 同居·这里太舒服了
m_igate | 亲密门（路由器）
m_shallow | 客气的距离
e_intimate_cohabit | 同居·靠近
e_cozy | 甜蜜同居·深夜等你
w_noodle | 深夜·酸奶与泡面哲学
w_game | 游戏冷战·ADC走脸事件
e_tipsy | 微醺之夜
e_morning | 早安赖床
c4 | 七夕·蓝色玫瑰与夏夜
e_festival | 夏日祭·浴衣与烟火
transfer_contract | 夏窗·签约桌上的好麻烦
```

功能：

- 第五部主轴为：`这里太舒服了`。
- `mt3` 不是 Ant 管理 Nagi，而是 Nagi 在 Ant 的家与爱里获得真正松弛，也暴露出“这里可能成为退路”的危险。
- `m_igate` 保留深/浅线分流。
- `m_shallow` 是“听话但变远”的浅线，不等同 Bad，但埋 control/D 风险。
- `e_intimate_cohabit` 是深线亲密，不是前期低谷 `e_intimate` 的重复。
- `transfer_contract` 是第五部尾巴，也是第六部入口。这里需要保留两个底层状态：Nagi 自己选，或 Ant 替他选。

---

## 6. 第六部 · 豪门新星篇：新的房间，新的规则

### 6.1 篇章功能

```text
2019.9 - 11月｜夏窗签约后，Nagi 赴欧加入曼城。俱乐部为他安排 Ant 家族旗下高奢服务式公寓，并接入一一 Manchester 节点。Ant 陪他适应最初几天后离开，Nagi 开始独居。第六部表层是异地恋、探访、轻甜小剧场和初入豪门；底层是 Ant 的资源、科技、商业判断与准经纪人本能已经可以覆盖欧洲，但训练、队友、媒体表达和真正的职业节奏仍只能由 Nagi 自己面对。
```

### 6.2 新节点顺序

```text
transfer_contract
→ club_arrival
→ club_alone
→ club_training
→ club_media
→ e_autumn
→ e_halloween
→ e_drive
→ route_mj_hidden
```

### 6.3 节点功能表

| 节点 | 功能 |
|---|---|
| `club_arrival` | 曼城高奢服务式公寓，属于 Ant 家族品牌，接入一一 Manchester 节点。表层是新房间，底层是 Ant 资源抵达欧洲。 |
| `club_alone` | Ant 陪住几天后离开，Nagi 独居。核心是“资源能到，人不能一直在”。 |
| `club_training` | 第一次合练。实时耳机能翻译语言，但不能翻译足球节奏。核心句：“耳机能翻译，但是球不会等我。” |
| `club_media` | 第一次公开采访。智能字幕/媒体系统把他的短句优化成漂亮表达。核心句：“那个系统乱翻译 / 它翻译得很对，但不像我。” |
| `e_autumn` | 九月初“读书之秋”。初秋节点，放在万圣节之前。功能是把旧日常搬到曼城，让 Nagi 开始在城市里自己找店。 |
| `e_halloween` | 十月底 Ant 飞曼城看他。万圣节是私人派对，不是商业活动。功能是“Ant去他的世界”。 |
| `e_drive` | 十一月中旬 Forza 联动。表层是炸场与僵尸凪，底层是商业曝光与 Nagi 原始表达的保留。 |
| `route_mj_hidden` | 技术路由。根据第六部关键选择、`control/D/i` 与倾向 flag 进入第七部 M/J，不显示给玩家。 |

### 6.4 第六部足球补充口径

V13/V14 第八章补足了 Nagi 秋冬正式比赛的背景，因此第六部不应被理解为“只有训练，没有比赛”。

第六部正面写的是：

```text
赴欧入住、独居、第一次合练、采访、城市适应和商业活动。
```

但底层时间线需要默认：

```text
9月：杯赛轮换 / 欧战小组赛短时间登场。
10-11月：联赛替补、杯赛轮换、欧战小组赛继续穿插。
12月：圣诞密集赛程和更多轮换机会。
```

这些正式比赛不必全部展开写，但必须默认已经发生，为第八章春季关键战做铺垫。

### 6.5 第六部隐藏分流规则

```text
M_score >= J_score → line="M" → e_agency_launch
J_score > M_score → line="J" → e_agency_launch
```

第六部末尾不再直接进入旧 `e_rain / e_softrice`，而是统一进入第七部新公共节点：

```text
e_agency_launch | 她站在光里
```

M/J 倾向仍由第六部选择决定，但第七部先经公共发布会节点，再展开 M/J 分支。

M倾向来源：

```text
club_arrival：选择“你可以自己决定怎么用”
club_media：选择“保留你的原句”
e_autumn：选择“下次地点你定 / 我跟着你走”
e_drive：偏向让 Nagi 保留原始表达、不被过度营业包装
```

J倾向来源：

```text
club_arrival：选择“我已经帮你同步好了”
club_media：选择“对外形象很重要，这样对你更好”
e_drive：偏向 Ant 替他过滤世界、让他只在 Ant 这里关机
```

### 6.6 第六部写作禁区

- 不写传统人工翻译，使用实时转译耳机、智能字幕和系统同步翻译。
- 不写 Ant 每场训练/采访都在现场。
- 不把万圣节写成商业活动；它是私人探访。
- 不把所有小剧场商业化。
- 不让 Ant 变成全职生活助理；她是资源网络和准经纪人判断，不是跑腿。
- 不让 Nagi 显得语言无能；他的困难是节奏、规则、表达被包装。
- 不再使用可见 `kc2` 重复提问。

---

## 7. 第七部 · 发布会后东京返日假期：她站在光里

### 7.1 V3 核心修正

旧 V2.1 第七部是“冬季分线篇：默契与较劲”，使用：

```text
M线：e_rain → e_sick → e_scarf → mt5 → mt2 → c5a
J线：e_softrice → e_dressup → e_jealous → e_quarrel → e_drunk → e_rain...
```

当前 V14 继承 V12 修正后，第七部已替换为：

```text
发布会后东京返日假期。
经纪公司发布会后，Ant站在光里。
Nagi在返日期间重新看见Ant：不是只看见她爱自己，也看见她的光、脆弱、任性、控制欲与真实需求。
```

### 7.2 第七部功能

```text
2019.12 - 2020.1｜发布会后，Nagi短暂返日。第七部表层是东京假期、发布会余波、M/J不同亲密小剧场；底层是关系模式资格池：TRUE/GOOD资格来自 Nagi看见Ant的光与脆弱，Ant也没有完全丢掉自己；NORMAL/BAD风险来自 Ant享受Nagi依赖、纵容和确认欲，Nagi通过配合、吃醋、亲密回应她，但底层问题没有真正解决。
```

第七部只处理资格池，不做最终END。

### 7.3 当前节点结构

```text
route_mj_hidden
→ e_agency_launch | 她站在光里
→ M线:
   e_scarf | 送围巾
   e_sick_fragile | 还是感冒了
→ J线:
   e_dressup | 任人打扮
   e_softrice | 软饭王哲学
   e_drunk | 借着醉意
→ route_love_hidden | 爱还是习惯隐藏判定
→ p8_route | 假期结束·春季名单
```

### 7.4 e_agency_launch | 她站在光里

功能：

```text
第七部公共入口。Ant经纪公司/个人事业正式被看见。Nagi第一次不是只看见“为他服务的Ant”，而是看见站在光里的Ant。
```

作用：

- 建立 Ant 独立事业与光芒；
- 让 Nagi意识到 Ant不是单纯围着自己转；
- 引出 M/J 两种关系质感；
- 为第八章 TRUE 条件中的 `antCompress=false` 提供前置。

### 7.5 M线：送围巾 / 还是感冒了

M线核心：

```text
Nagi看见Ant强大，也看见Ant脆弱。
他不会成熟地照顾人，但会有真实反应。
Ant可以软下来，但没有彻底丢掉自己。
```

节点：

```text
e_scarf | 送围巾
e_sick_fragile | 还是感冒了
```

功能：

- `e_scarf`：冬季围巾，不再作为旧M线长链的一环，而是返日假期里 Nagi式低反应关心。
- `e_sick_fragile`：Ant的脆弱被Nagi看见。Nagi不需要说漂亮话，只要真实地停下来、靠近、照顾一点点。

M线倾向进入 TRUE/GOOD前置池：

```text
antLightSeen = true
antFragileSeen = true
loveNotHabit+1
control不增加
```

### 7.6 J线：任人打扮 / 软饭王哲学 / 借着醉意

J线核心：

```text
Nagi愿意配合Ant。
Ant享受被确认、被纵容、被依赖。
这条线很甜，但底层是 habitWarm、control、D、nagiRebelSeed 的风险积累。
```

节点：

```text
e_dressup | 任人打扮
e_softrice | 软饭王哲学
e_drunk | 借着醉意
```

功能：

- `e_dressup`：Ant任性摆弄，Nagi愿意配合。甜，但有“被摆弄”风险。
- `e_softrice`：软饭王哲学是轻喜剧糖点，表层甜，底层是 Nagi在Ant舒适圈里的顺滑依赖。
- `e_drunk`：Ant借着醉意暴露确认欲、任性与脆弱；Nagi回应她，但不一定解决根因。

J线倾向进入 NORMAL/BAD前置池：

```text
habitWarm+2
control+1
loveNotHabit+1
可能增加 D / nagiRebelSeed
```

### 7.7 route_love_hidden | 爱还是习惯隐藏判定

当前第七部不再使用可见 `c5a | 爱还是习惯`。

改为隐藏判定：

```text
route_love_hidden | 爱还是习惯隐藏判定
```

TRUE/GOOD前置池条件：

```text
antLightSeen = true
antFragileSeen = true
Nagi看见Ant的脆弱后做出真实反应
Ant可以软下来，但没有彻底丢掉自己
egoHold 足够
control / habitDepend 不高
```

NORMAL/BAD前置池条件：

```text
habitWarm 较高
Ant享受Nagi的依赖与纵容
Ant任性、控制、确认欲被放大
Nagi通过配合、吃醋、亲密回应她
但底层问题没有真正解决
control / D / nagiRebel / distance 任一过高
```

### 7.8 第七部删除 / 降级节点

以下旧V2.1节点不再作为第七部主线：

```text
e_rain | 雨天共撑一伞
mt5 | 他的温柔·与你的分寸
mt2 | 已读不回的夜
e_jealous | 只在乎你吃醋
e_quarrel | 收手还是闹大
c5a | 爱还是习惯（可见节点）
圣诞节相关内容
```

处理方式：

- `e_rain / mt5 / mt2 / e_jealous / e_quarrel`：删除或备用，不进第七部主链。
- `c5a`：降级为 `route_love_hidden` 技术判定。
- 圣诞节相关内容：不进第七部，部分素材已迁移至 Stay线或备用池。

---

## 8. 第八部 · 世界中心篇：他的名字

### 8.1 V3 核心修正

旧 V2.1 第八部是：

```text
w_letter → w_elegant → w_cozy → w_exist → w_restart → final_choice
```

当前 V13/V14 已替换为：

```text
p8_route | 假期结束·春季名单
→ Dream线：他成名，你见证
→ Stay线：他暂未成名，你陪伴
→ Bad线：他成名，你加冕
```

### 8.2 第八部功能

```text
2020.1 - 5月前｜Nagi夏季加入曼城后，已经通过秋冬的正式比赛、轮换、媒体曝光和商业合作证明自己有价值。但他的曝光还没有完全脱离“曼城新援 / 日本天才 / 世界杯余热 / 俱乐部平台 / Ant经纪资源”的背景。春季关键战，是他第一次真正把“凪诚士郎”这个名字从球队光环里单独打出来的机会。
```

### 8.3 第八部最新命题

```text
Ant三条线都必须去现场。

Dream：Nagi成名，Ant在看台上见证、庆祝，但不抢主语。
Stay：Ant在现场，Nagi暂未成名；她陪伴这个还没站到中心的Nagi。
Bad：Nagi成名，Ant现场强烈庆祝、制造话题、推动商业操作，把这场胜利变成“亲手加冕”。
```

最简对照：

```text
Dream = 他成名，你见证。
Stay = 他暂未成名，你陪伴。
Bad = 他成名，你加冕。
```

### 8.4 第八部公共节点

```text
p8_route | 假期结束·春季名单
```

功能：

- 承接第七部东京假期结束；
- 补足 Nagi 秋冬正式比赛、媒体曝光、商业合作和曼城平台加成；
- 说明春季杯赛决赛名单出现；
- 明确 Ant 一定会去现场；
- 通过一个选择进入 Dream / Stay / Bad 三线。

路由选项：

```text
选项① 世界第一 | 我会在看台上。去看你把它变成你的比赛。
→ Dream线

选项② 陪我 | 我会去看你。就算不是今天也没关系。
→ Stay线

选项③ 抓住我 | 我会到现场，让全世界都看见你。
→ Bad线
```

### 8.5 V14中的历史校对项

当前 V14 正文工作稿中如仍沿用以下历史手误，可在后续校对中处理，可在后续校对中处理，不影响结构：

```text
“去看你它变成你的比赛” → 建议改为“去看你把它变成你的比赛”
“Ant\:Nagi, 我们谈谈。” → 建议改为“Ant: Nagi，我们谈谈。”
“bad_last | 我是不想这样赢” → 标题建议统一为“我不是不想这样赢”或“我不是不想赢”
残留 &#x20; → 清理
```

---

## 9. Dream线 · 他成名，你见证

### 9.1 功能

Dream线不是“Ant牺牲自己让Nagi成功”。

真正核心是：

```text
Nagi终于用自己的球，把“凪诚士郎”这个名字从曼城、俱乐部、商业曝光和团队光环里剥离出来。
Ant就在现场。
她为他开心，为他庆祝，但不把这场胜利变成自己的作品。
同时，Ant也不能把自己的世界压缩成只有Nagi。
```

### 9.2 节点结构

```text
p8_route[dream]
→ dream_exist | 没有Ant的世界
→ dream_match | 他的名字
→ dream_celebrate | 看台上的庆祝
→ dream_return | 久别重逢
→ dream_home | 花园别墅·秘密基地
→ dream_final | 世界第一，与你
→ TRUE / GOOD
```

### 9.3 dream_exist | 没有Ant的世界

功能：

```text
TRUE资格节点。Ant必须承认，即使她坐在离Nagi很近的地方，球场上那九十分钟也有一个她进不去的世界。
```

嵌入旧素材：

```text
w_exist | 失眠夜·没有Ant的世界
```

当前处理：

- 改成赛前欧洲酒店/视频通话；
- 表层是深夜聊天；
- 底层是 Ant 的自我压缩风险；
- Nagi不做哲学开导，只本能担心。

关键选项：

```text
选项① 理性 | 才不会呢，我还有好多想做的事
→ antCompress=false
→ TRUE资格加强

选项② 心动 | 有你在就够了
→ antCompress=true
→ 阻止TRUE，仅可GOOD或降线

选项③ 作 | 那你可不能比我先死啊
→ loveNotHabit+1
→ trueFlag不增加
```

### 9.4 dream_match | 他的名字

功能：

```text
Nagi在春季杯赛决赛里完成第一次真正意义上的个人荣誉。
这场比赛结束后，媒体标题第一次不再只是“曼城的年轻天才”，而是“凪诚士郎改变了比赛”。
```

比赛定位：

```text
春季杯赛决赛 / 国内杯赛决赛
个人荣誉：决赛全场最佳 / MVP
```

比赛节奏：

```text
上半场：他被体系包住，像一个好用但不够稳定的天才变量。
中段：对手开始针对他，他一度消失。
转折：他不再等队友、体系或Ant的安排，而是自己判断那个瞬间。
高潮：一次停球 / 一次反向跑位 / 一脚决定比赛的进球或助攻。
结果：曼城赢，Nagi拿到决赛全场最佳。
```

Dream线关键：

```text
Ant在现场。
她懂价值。
她能操作。
但哨声响起之后，她只是看。
```

### 9.5 dream_celebrate | 看台上的庆祝

功能：

```text
区分 Dream 与 Bad 的赛后处理。
Dream不是 Ant不庆祝，而是她的庆祝更平淡、克制、纯粹。她是在为Nagi开心，而不是在为自己的造星计划成功而激动。
```

处理方式：

```text
她站在看台上，和所有人一起鼓掌。
经纪团队询问是否立刻发布预设庆祝内容。
Ant说：等俱乐部先发。
品牌方询问是否立刻联动。
Ant说：明天再谈。
今晚先让他赢。
```

### 9.6 dream_return | 久别重逢

嵌入素材：

```text
Episode 02 久别重逢
```

功能：

```text
Nagi不是被Ant召回来的。
不是躲进Ant家里。
不是因为世界太累所以逃回来。
他是在完成自己的战斗之后，自己选择回到Ant身边。
```

### 9.7 dream_home | 花园别墅·秘密基地

嵌入素材：

```text
Episode 11 花园别墅计划
```

当前处理：

- 赛季结束后，Nagi假期；
- Ant买下下一处别墅花园作为假期新家；
- Nagi抱着白色康乃馨问：“Ant，这盆……放哪儿啊？”
- 他一次次拿来不同颜色的花，一次次问放哪里；
- Ant很耐心地让他一盆盆放到上一盆旁边；
- 这段不再硬讲“存档点”，而是通过生活感表达归处。

### 9.8 dream_final | 世界第一，与你 / GOOD

TRUE条件：

```text
antCompress=false
witnessFlag=true
control低
personalHonor=true
nagiNameIndependent=true
```

TRUE END：

```text
TRUE END｜世界第一，与你
```

GOOD条件：

```text
Dream线达成，但 antCompress=true 或 nagiResonate不足。
```

GOOD END：

```text
GOOD END｜那么完美，那么爱你
```

---

## 10. Stay线 · 他暂未成名，你陪伴

### 10.1 功能

Stay线不是失败线，也不是Ant没去现场。

核心是：

```text
Ant去了现场。
Nagi也上场了。
他有亮点，但没有成为决定比赛的人。
他离那个位置很近，但不是今天。

他仍然踢球，仍然在曼城成长，仍然有曝光和未来。
但他和Ant选择了更柔软、更稳定、更接近日常恋人的节奏。
```

### 10.2 节点结构

```text
p8_route[stay]
→ stay_match | 还不是今天
→ stay_intro | 他常回来
→ stay_cozy | 暗爽·可可白兰地
→ stay_daily | 情人节玩偶熊
→ stay_final | 关掉的比赛录像
→ NORMAL END
```

### 10.3 stay_match | 还不是今天

功能：

```text
Ant在现场。
Nagi上场了。
他有漂亮触球，但没有成为决定比赛的人。
球队可能赢了，但MVP不是他。
```

核心句：

```text
不是今天。没关系。
```

### 10.4 stay_intro | 他常回来

功能：

```text
春季关键战没有成为他的成名战。Nagi仍在曼城踢球，但很多东西没有一下子涌过来。
Ant和团队保留更温和的安排：减少连续曝光，压掉不必要采访，留出恢复窗口和返日窗口。
```

核心：

```text
他不是世界中心。
但他真的回来。
```

### 10.5 stay_cozy | 暗爽·可可白兰地

嵌入旧素材：

```text
w_cozy | 暗爽·可可白兰地
```

功能：

```text
普通情侣线的私密占有与甜蜜满足。
别人不知道。
只有Ant知道。
别人看见的是球员、天才、新援、商业图像。
只有Ant知道他会这样窝在沙发里，懒洋洋地说喜欢她。
```

### 10.6 stay_daily | 情人节玩偶熊

嵌入素材：

```text
Episode 23 情人节约会
```

功能：

```text
证明 Normal / Stay 有真实幸福。
Nagi不是不会爱。
他只是爱得很低反应、很奇怪、很懒，但很真。
```

### 10.7 stay_final | 关掉的比赛录像

功能：

```text
NORMAL END 前的轻遗憾。
Nagi的光没有熄灭，只是变安静了。
```

核心画面：

```text
深夜，Nagi重播那场春季决赛。
屏幕里另一个球员举起全场最佳奖杯。
Nagi关掉视频，说：那个球，我也能停。
Ant说：我知道。
```

NORMAL END：

```text
NORMAL END｜普通情侣
```

---

## 11. Bad线 · 他成名，你加冕

### 11.1 功能

Bad线不是 Ant不支持Nagi。

恰恰相反，Bad线里的 Ant 可能是最想让他赢的。

核心是：

```text
Nagi也会在这场比赛中成名。
但Ant不是克制见证，而是强烈参与庆祝和话题制造。
她让这场成名战同时变成“Ant亲手加冕Nagi”的故事。
```

### 11.2 节点结构

```text
p8_route[bad]
→ bad_elegant | 优雅与世俗
→ bad_plan | 他的名字，由我来写
→ bad_match | 加冕之夜
→ bad_afterglow | 全世界都看见你
→ bad_cold | 渐行渐远
→ bad_last | 我不是不想这样赢
→ bad_far | 远处的世界第一
→ BAD END
```

### 11.3 bad_elegant | 优雅与世俗

嵌入旧素材：

```text
w_elegant | 优雅与世俗
```

功能：

```text
Bad线最漂亮的第一颗毒糖。
表层是普通日常聊天。
底层是Ant的造神欲漏出来。
```

重点：

- Nagi只是吃饭，会饿，会困，会嫌难吃；
- Ant突然觉得他“不该这么普通”；
- Nagi完全不懂；
- 这不是争吵，是Ant心里危险的部分露了一下眼睛。

### 11.4 bad_plan | 他的名字，由我来写

功能：

```text
Ant把造神欲转化成实际操作。
赛前资料、媒体预案、品牌联动、采访话术、舆论窗口都被整理出来。
所有东西都专业、正确、漂亮。没有一项是坏的。
```

核心句：

```text
不是“只要他进球”。
是要让所有人知道，那颗球只能由他来进。
```

### 11.5 bad_match | 加冕之夜

功能：

```text
Bad线的成名战。足球结果可以与Dream线类似：Nagi完成决定性表现，球队获胜，拿到全场最佳。
区别在于Ant如何处理这一刻。
```

Ant现场处理：

```text
终场哨响后。
赛后庆祝区 / 家属与贵宾获准入场。
Ant穿过贵宾通道进入场边。
镜头捕捉到她奔向Nagi的瞬间。
她抱住他。
全场灯光、镜头、社交媒体同时转向他们。
```

核心：

```text
那一刻太美了。
美到像她亲手写好的结局。
```

### 11.6 bad_afterglow | 全世界都看见你

功能：

```text
写 Bad线赛后商业与舆论操作。
Dream线是顺势承接，不抢主语。
Bad线是强势放大，把“比赛胜利”推成“话题事件”。
```

媒体标题变化：

```text
Nagi全场最佳
→ Nagi全场最佳，Ant现场庆祝
→ 年轻投资人亲临球场，见证天才男友封神之夜
→ 凪诚士郎背后的女人：她如何打造下一位世界巨星
```

Nagi反应：

```text
好亮。
好多。
好吵。
Ant也被看见了。
标题里有Ant。
```

### 11.7 bad_cold | 渐行渐远

功能：

```text
Nagi开始从这套“正确方案”和“加冕叙事”里退出。
不是激烈吵架。
他不会成熟地控诉“你控制我”。
他只会变得更短、更懒、更难联系、更不愿意把自己的球交给她解释。
```

核心台词：

```text
凪: 因为都像Ant安排的。
凪: 球也是。
Ant: 我没有替你踢球。
凪: 知道。
凪: 所以更麻烦。
```

### 11.8 bad_last | 我不是不想这样赢

功能：

```text
Bad线核心摊牌。
他确实赢了，也确实被世界看见了，但他并不快乐。
```

核心台词：

```text
凪: 我不是不想赢。但我不想这样赢。
```

Nagi不需要完整解释，只能说：

```text
不知道。
但是那不像我。
Ant看见的那个我，很厉害。
但我不是一直都是那个。
```

### 11.9 bad_far | 远处的世界第一

功能：

```text
BAD END收束。
Nagi后来仍然赢了，甚至走向世界中心。
但Ant不再能站在他身边。
```

BAD END：

```text
BAD END｜远处的世界第一
```

---

## 12. 系统变量与旗标（V3）

### 12.1 数值变量

| 变量 | 含义 | 作用 |
|---|---|---|
| `B` / `b` | 亲密度 | 控制亲密、甜日常、深线入口 |
| `I` / `i` / `u` | 懂他指数 / 理解度 | TRUE 必要基础之一 |
| `D` / `d` | 心墙 / 距离伤害值 | BAD 风险 |
| `EGO` / `ego` | Nagi 主动性 / 自我选择 | 支撑 Dream/TRUE 质量 |
| `CONTROL` / `control` | Ant 管理/安排倾向 | J线、Bad风险 |
| `habitWarm` | 舒适依赖 / 普通幸福 | Stay/NORMAL倾向 |
| `ordinaryHappiness` | 普通情侣幸福值 | Stay线质量 |
| `publicCoupleExposure` | 公开情侣曝光度 | Bad线舆论绑定风险 |

### 12.2 布尔旗标

| 旗标 | 初始值 | 含义 |
|---|---:|---|
| `nagiResonate` | false | Nagi 对 Ant 的 EGO / 独立自我产生共鸣 |
| `antCompress` | false | Ant 为爱压缩自己 |
| `antManage` | false | Ant 替 Nagi 做重大选择/安排 |
| `mDeep` | false | 第五部同居深线 |
| `cohabitShallow` | false | 第五部浅线/客气距离 |
| `antLightSeen` | false | Nagi看见Ant站在光里 |
| `antFragileSeen` | false | Nagi看见Ant的脆弱 |
| `loveNotHabit` | false/number | 爱不是单纯习惯的证明 |
| `personalHonor` | false | Nagi是否拿到第一次真正个人荣誉 |
| `nagiNameIndependent` | false | Nagi名字是否从俱乐部光环里独立出来 |
| `witnessFlag` | false | Dream线中Ant是否见证但不抢主语 |
| `publicCoupleExposureSeed` | false | Bad线公开曝光风险种子 |
| `nagiDiscomfortSeed` | false | Nagi开始对加冕叙事不适 |
| `nagiRebel` / `nagiRebelSeed` | false | Nagi开始从被安排中退出 |
| `badLock` | false | Bad线锁定 |
| `returnBySelf` | false | Nagi完成战斗后自己回来 |
| `homeAsSavePoint` | false | 家是归处，不是笼子 |

### 12.3 字符串旗标

| 旗标 | 可选值 | 触发节点 | 含义 |
|---|---|---|---|
| `line` | `M` / `J` | `route_mj_hidden` | 默契线 / 较劲线倾向 |
| `path` | `dream` / `stay` / `bad` | `p8_route` | 第八章三线 |
| `finalChoice` | `witness` / `ordinary` / `coronation` | `p8_route` | 第八章核心选择 |
| `finalFlag` | `support` / `waver` / `release` / `accompany` / `clip` | 可保留旧系统兼容 | 终章最后抉择兼容字段 |

---

## 13. 关键分流点（V3）

### 13.1 第五部深/浅线分流

节点：

```text
m_igate
```

逻辑：

```text
若亲密值高、D/control 未超阈值 → e_intimate_cohabit
若 D/control 偏高 → m_shallow
```

### 13.2 第六部 M/J 隐藏分流

节点：

```text
route_mj_hidden
```

说明：

```text
不再展示可见 kc2 / kc2_rewrite。
```

结果：

```text
M_score >= J_score → line="M"
J_score > M_score → line="J"
```

但第七部入口统一为：

```text
e_agency_launch | 她站在光里
```

### 13.3 第七部爱/习惯隐藏判定

节点：

```text
route_love_hidden
```

结果：

```text
TRUE/GOOD资格池：antLightSeen=true, antFragileSeen=true, loveNotHabit高, control低
NORMAL/BAD资格池：habitWarm高, control高, D/distance/nagiRebel任一偏高
```

### 13.4 第八部终局三线分流

节点：

```text
p8_route | 假期结束·春季名单
```

选项：

```text
我会在看台上。去看你把它变成你的比赛 → path="dream", finalChoice="witness"
我会去看你。就算不是今天也没关系 → path="stay", finalChoice="ordinary"
我会到现场，让全世界都看见你 → path="bad", finalChoice="coronation"
```

---

## 14. 结局判定逻辑（V3）

### 14.1 推荐判定顺序

```text
1. BAD:
   path === "bad"
   || badLock === true
   || D >= 6
   || control 高且 nagiDiscomfortSeed / nagiRebel 为 true

2. TRUE:
   path === "dream"
   && antCompress === false
   && witnessFlag === true
   && personalHonor === true
   && nagiNameIndependent === true
   && control 低
   && D <= 3

3. GOOD:
   path === "dream"
   && personalHonor === true
   但 antCompress === true 或 nagiResonate不足

4. NORMAL:
   path === "stay"
   或未触发 BAD / TRUE / GOOD
```

### 14.2 TRUE END「世界第一，与你」

条件：

- `path = dream`
- `finalChoice = witness`
- `antCompress = false`
- `witnessFlag = true`
- `personalHonor = true`
- `nagiNameIndependent = true`
- `control` 低
- `D <= 3`

情绪：

```text
他站到世界中心，你没有消失。
你看见他的光，也承认那束光不是你制造的。
于是他回头时，看见的也不只是经纪人、资源、系统或归处，而是同样在自己战场上发光的Ant。
```

### 14.3 GOOD END「那么完美，那么爱你」

条件：

- `path = dream`
- `personalHonor = true`
- 但 `antCompress=true` 或 `nagiResonate` 不足

情绪：

```text
世界看见了他，你也完成了最漂亮的陪伴。
爱是真的，光也是真的。
只是有些话没有完全说到最深处，于是这份完美里仍有一点轻微的不对称。
```

### 14.4 NORMAL END「普通情侣」

条件：

- `path = stay`
- 未触发 BAD

情绪：

```text
没有到最远处，也没有失去彼此。
那个懒散、低反应、会把喜欢说得很少的Nagi，把更多日子留给了你。
这不是世界第一的神话，这是普通情侣的春天。
```

### 14.5 BAD END「远处的世界第一」

条件：

- `path = bad`
- `badLock=true`
- 或 `control` 高、`publicCoupleExposure` 高、`nagiDiscomfortSeed=true`

情绪：

```text
Nagi后来仍然赢了，甚至走向世界中心。
但这次成名被Ant推成了“她亲手加冕他”的故事。
最终，他不再让她靠近自己的世界。
```

---

## 15. 最新 FN 链建议（V3）

### 15.1 前五部主链

```text
p1 → p2 → c1a → c1b → u20j
u20j → c3 → e_lemontea → c2 → e_invite → e_lolly
e_lolly → e_depart → c6a → e_curry → e_bday → e_hug → e_intimate → side_b_return
side_b_return → wc_roster → wc_interval → wc_keygoal → wc_offer
wc_offer → w_home → mt3 → m_igate
```

第五部深线：

```text
m_igate[deep] → e_intimate_cohabit → e_cozy → w_noodle → w_game → e_tipsy → e_morning → c4 → e_festival → transfer_contract
```

第五部浅线：

```text
m_igate[shallow] → m_shallow → e_cozy → w_noodle → w_game → e_tipsy → e_morning → c4 → e_festival → transfer_contract
```

### 15.2 第六部主链

```text
transfer_contract
→ club_arrival
→ club_alone
→ club_training
→ club_media
→ e_autumn
→ e_halloween
→ e_drive
→ route_mj_hidden
```

### 15.3 第七部主链

统一入口：

```text
route_mj_hidden → e_agency_launch
```

M线：

```text
e_agency_launch[M]
→ e_scarf
→ e_sick_fragile
→ route_love_hidden
→ p8_route
```

J线：

```text
e_agency_launch[J]
→ e_dressup
→ e_softrice
→ e_drunk
→ route_love_hidden
→ p8_route
```

### 15.4 第八部主链

公共路由：

```text
p8_route
```

Dream：

```text
p8_route[dream]
→ dream_exist
→ dream_match
→ dream_celebrate
→ dream_return
→ dream_home
→ dream_final
→ TRUE / GOOD 判定
```

Stay：

```text
p8_route[stay]
→ stay_match
→ stay_intro
→ stay_cozy
→ stay_daily
→ stay_final
→ NORMAL
```

Bad：

```text
p8_route[bad]
→ bad_elegant
→ bad_plan
→ bad_match
→ bad_afterglow
→ bad_cold
→ bad_last
→ bad_far
→ BAD
```

---

## 16. 最新 CHAPTERS 建议（V3）

### 开场白

- PROLOGUE

### 第一部 · 原作前置篇

1. 作战室·初遇 `p1`
2. 投资的私心 `p2`
3. 会议室初见 `c1a`
4. 不麻烦的人 `c1b`
5. U-20日本代表战·被日本看见 `u20j`

### 第二部 · 关系确立篇

1. 开放日 `c3`
2. 你的，我的 `e_lemontea`
3. 假期的消息 `c2`
4. 高级公寓的邀请 `e_invite`
5. 棒棒糖·自动刷脸 `e_lolly`

### 第三部 · 前期低谷篇

1. NEL启程·闭关送别 `e_depart`
2. 聚少离多·从高光到淘汰 `c6a`
3. Nagi做的咖喱饭 `e_curry`
4. 被遗忘的生日 `e_bday`
5. 拥抱 `e_hug`
6. 亲密 `e_intimate`
7. Side-B·重返蓝色监狱 `side_b_return`

### 第四部 · 世界看见他篇

1. 世界杯追加名单 `wc_roster`
2. 淘汰赛前训练·花环 `wc_interval`
3. 生死局·世界看见他 `wc_keygoal`
4. 豪门来信 `wc_offer`

### 第五部 · 世界杯后的夏天

1. 归来·沙发上的拥抱 `w_home`
2. 同居·这里太舒服了 `mt3`
3. 同居·靠近 / 客气的距离 `e_intimate_cohabit / m_shallow`
4. 甜蜜同居·深夜等你 `e_cozy`
5. 深夜·酸奶与泡面哲学 `w_noodle`
6. 游戏冷战·ADC走脸事件 `w_game`
7. 微醺之夜 `e_tipsy`
8. 早安赖床 `e_morning`
9. 七夕·蓝色玫瑰与夏夜 `c4`
10. 夏日祭·浴衣与烟火 `e_festival`
11. 夏窗·签约桌上的好麻烦 `transfer_contract`

### 第六部 · 豪门新星篇

1. 曼城·新的房间 `club_arrival`
2. 一个人的曼城 `club_alone`
3. 耳机能翻译，球不会等我 `club_training`
4. 它翻译得很对，但不像我 `club_media`
5. 读书之秋 `e_autumn`
6. 万圣夜·专属恶魔 `e_halloween`
7. 飙车实录 `e_drive`
8. 第六部隐藏分流 `route_mj_hidden`

### 第七部 · 发布会后东京返日假期

公共：

1. 她站在光里 `e_agency_launch`

M线：

2. 送围巾 `e_scarf`
3. 还是感冒了 `e_sick_fragile`

J线：

2. 任人打扮 `e_dressup`
3. 软饭王哲学 `e_softrice`
4. 借着醉意 `e_drunk`

合流：

5. 爱还是习惯隐藏判定 `route_love_hidden`

### 第八部 · 世界中心篇：他的名字

公共：

1. 假期结束·春季名单 `p8_route`

Dream线：

2. 没有Ant的世界 `dream_exist`
3. 他的名字 `dream_match`
4. 看台上的庆祝 `dream_celebrate`
5. 久别重逢 `dream_return`
6. 花园别墅·秘密基地 `dream_home`
7. 世界第一，与你 `dream_final`

Stay线：

2. 还不是今天 `stay_match`
3. 他常回来 `stay_intro`
4. 暗爽·可可白兰地 `stay_cozy`
5. 情人节玩偶熊 `stay_daily`
6. 关掉的比赛录像 `stay_final`

Bad线：

2. 优雅与世俗 `bad_elegant`
3. 他的名字，由我来写 `bad_plan`
4. 加冕之夜 `bad_match`
5. 全世界都看见你 `bad_afterglow`
6. 渐行渐远 `bad_cold`
7. 我不是不想这样赢 `bad_last`
8. 远处的世界第一 `bad_far`

### 结局篇

1. TRUE END「世界第一，与你」
2. GOOD END「那么完美，那么爱你」
3. NORMAL END「普通情侣」
4. BAD END「远处的世界第一」

---

## 17. 旧素材处理表（V3）

| 旧素材 / 小剧场 | 最新位置 | 处理方式 | 原因 |
|---|---|---|---|
| `w_letter | 芭乐情书` | 删除 / 降级支线 | 不进主链 | 功能偏轻，只证明笨拙真心，终局重量不足 |
| `w_elegant | 优雅与世俗` | Bad线 `bad_elegant` | 保留重写 | 暴露 Ant 造神欲，是 Bad 最漂亮的毒糖 |
| `w_cozy | 暗爽·可可白兰地` | Stay线 `stay_cozy` | 保留重写 | 普通情侣线的私密占有与甜蜜满足 |
| `w_exist | 没有Ant的世界` | Dream线 `dream_exist` | 保留重写 | TRUE 条件：Ant不能把自己压缩成Nagi附属 |
| `w_restart | 春日再出发` | 删除 / 被 `p8_route` 替代 | 不进主链 | 春季再出发功能已被春季名单与成名战承接 |
| `final_choice` | 删除 / 被 `p8_route` 替代 | 不进主链 | p8_route 一次性完成终局路由 |
| `Episode 02 久别重逢` | Dream线 `dream_return` | 保留核心场景，降尺度 | Nagi完成战斗后自己回来，不是逃避 |
| `Episode 11 花园别墅计划` | Dream线 `dream_home` | 保留核心画面 | 花园别墅是归处，不是退路 |
| `Episode 23 情人节约会` | Stay线 `stay_daily` | 保留核心糖点 | 证明 Normal/Stay 有真实幸福 |
| `Episode 13 Nagi求婚` | TRUE END 彩蛋 / 后日谈 | 不进主线 | 适合作为世界第一后轻喜剧奖励 |
| `c6b / p5_intro` | 删除 | 不进主链 | 避免终局选择重复 |
| 旧 `c6_cold / end_bad` | Bad线重写 | 保留“冷却/远处观看”功能 | Bad核心改为“不想这样赢” |

---

## 18. 写作禁区（V3）

### 18.1 Nagi 禁区

禁止把 Nagi 写成成熟霸总或心理咨询师。

不要让他说：

```text
Ant，你不能把我神化。
Ant，你应该拥有自己的人生。
Ant，你不能控制我。
```

他应该说：

```text
好多。
不懂。
Ant好奇怪。
不是这个。
我不是不想赢。
但我不想这样赢。
```

### 18.2 Ant 禁区

禁止把 Ant 写成普通恋爱脑。

她不是简单“不想让Nagi走”，而是：

```text
太会爱。
太会安排。
太早看见他的光。
太想让那束光以最漂亮的方式被世界看见。
```

### 18.3 Dream 禁区

Dream不是 Ant 放弃自己，也不是 Nagi离开她。

Dream必须同时成立：

```text
Nagi拥有自己的名字。
Ant保留自己的世界。
Ant在现场见证，但不抢主语。
Nagi完成战斗后自己回来。
```

### 18.4 Stay 禁区

Stay不是失败线，也不是Ant缺席。

Stay必须成立：

```text
Ant去了现场。
Nagi暂时没有成名。
但她仍然陪伴这个还没站到中心的Nagi。
```

### 18.5 Bad 禁区

Bad不是 Ant不爱，也不是 Nagi不成功。

Bad最狠的结果是：

```text
Nagi成名，甚至后来仍然走向世界中心。
但这次成名被Ant推成了“她亲手加冕他”的故事。
最终，他不再让她靠近自己的世界。
```

---

## 19. 最新一句话总纲（Design V3）

```text
第五部让 Nagi 发现：Ant 家太舒服，但他不能永远躲在那里。
第六部让 Nagi 发现：Ant 的资源已经抵达曼城，但真正走进世界仍然只能靠他自己。
第七部让 Nagi 看见：Ant不只是爱他的恋人，她也站在自己的光里，也会脆弱、任性、想确认。
第八部让两人面对最后问题：当Nagi第一次拥有自己的名字时，Ant是在现场见证他、陪伴他，还是亲手为他加冕。
结局则证明：同一份爱，因是否读懂彼此，走向四种不同停靠方式。
```

---

*Design V3.1 输出日期：2026-07-06*  
*基准：SCRIPT V14 + Design V3.0 + Part1 V14重构 + Part7 V12重排 + Part8 V13/V14三线终局设计。*
