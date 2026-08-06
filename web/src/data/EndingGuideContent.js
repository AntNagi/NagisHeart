export const ENDING_GUIDE_SECTIONS = [
  {
    title: '一、结局判定总览',
    blocks: [
      { type: 'code', text: '前期选项累计\n    ↓\nroute_mj_hidden\n    ↓\nM / J 关系线\n    ↓\nroute_love_hidden\n    ↓\nM → 没有你的世界 → 世界第一，与你 / 那么完美，那么爱你\nJ → 还不是今天 / 远处的世界第一 → 普通情侣 / 远处的世界第一' },
      { type: 'paragraph', text: '最终结局由三层机制共同决定：累计值记录长期选择形成的关系倾向；Flag 记录关键剧情变化；Router 在指定节点读取状态并决定后续路线。' }
    ]
  },
  {
    title: '二、关键累计值',
    blocks: [{ type: 'table', headers: ['变量', '含义', '主要影响'], rows: [
      ['i', '对 Nagi 的理解程度', 'M 倾向、TRUE / GOOD 资格'],
      ['egoHold', 'Nagi 的自主意志是否被保留', 'TRUE 资格'],
      ['control', '替 Nagi 规划、表达和决定的倾向', 'J 倾向、BAD 风险'],
      ['D / distance', '两人之间形成的心墙和疏离', 'J 线的 NORMAL / BAD 分化'],
      ['loveNotHabit', '关系是否仍来自真实选择', 'TRUE / GOOD 资格'],
      ['habitDepend', '关系是否逐渐沉入依赖与习惯', 'NORMAL / BAD 风险']
    ] }]
  },
  {
    title: '三、关键 Flag',
    blocks: [{ type: 'table', headers: ['Flag', '作用'], rows: [
      ['line', '第六部隐藏分流结果：M 或 J'], ['antLightSeen', 'Nagi 是否看见玩家拥有自己的事业与光'],
      ['antFragileSeen', 'Nagi 是否看见玩家真实、脆弱的一面'], ['nagiRebel', 'Nagi 是否因长期被安排而开始反抗或退出'],
      ['antCompress', '玩家是否为了关系压缩自己的事业与人生'], ['witnessFlag', 'Nagi 获得个人荣誉时，玩家是否选择见证'],
      ['personalHonor', 'Nagi 是否取得真正属于个人名字的荣誉'], ['nagiNameIndependent', 'Nagi 的名字是否从俱乐部和外部叙事中独立'],
      ['badLock', 'BAD END 是否最终锁定']
    ] }]
  },
  {
    title: '四、关键 Router',
    blocks: [{ type: 'table', headers: ['Router', '作用', '结果'], rows: [
      ['route_mj_hidden', '根据第六部关键选择判定关系路线', 'line="M" 或 line="J"'],
      ['route_love_hidden', '读取第七部累计状态，确认终局资格池', 'M 进入“没有你的世界”；J 进入“还不是今天”或“远处的世界第一”'],
      ['p8_route', '第八部终局选择', 'M 进入“没有你的世界”；J 在两条中文章节中分流'],
      ['dream_final', '“没有你的世界”线最终结算', '世界第一，与你 / 那么完美，那么爱你']
    ] }]
  },
  {
    title: '五、总路线图',
    blocks: [
      { type: 'code', text: '第一部—第六部\n累计：理解程度、保留自主意志、控制倾向、距离、习惯依赖\n并记录：玩家拥有自己的事业与光、真实脆弱的一面、Nagi 反抗种子等状态\n                         │\n                         ▼\n                关系路线隐藏判定\n       读取第六部关键选择与长期累计倾向\n             ┌───────────┴───────────┐\n             │                       │\n           M 线                    J 线\n      理解 / 自主倾向          管理 / 依赖倾向\n             │                       │\n             ▼                       ▼\n   第七部 M 线剧情           第七部 J 线剧情\n   「送围巾」                「任人打扮」\n   「还是感冒了」            「软饭王哲学」\n                             「借着醉意」\n             │                       │\n             └───────────┬───────────┘\n                         ▼\n                终局资格隐藏判定\n       读取：玩家拥有自己的事业与光\n       真实脆弱的一面、保留自主意志\n       控制倾向、距离、习惯依赖\n       真实选择、Nagi 反抗等状态\n             ┌───────────┴───────────┐\n             │                       │\n        M 线终局资格             J 线终局资格\n             │                       │\n             ▼                       ▼\n       「没有你的世界」路线   「还不是今天」/「远处的世界第一」分流\n             │                       │\n             ▼                       ├──────────────┐\n       梦境是否成立                  │              │\n     ┌───────┴────────┐       「还不是今天」   「远处的世界第一」\n     │                │             │              │\n保留自己的世界    为关系压缩自己    │              │\n压缩人生=false   压缩人生=true      │              │\n     │                │             ▼              ▼\n     ▼            TRUE 条件不足  普通情侣       坏结局锁定\n  见证荣誉                         │              │\n  个人荣誉                         │              ▼\n  名字独立                         │           远处的世界第一\n     │                              │\n     ▼                              ▼\n  世界第一，与你                  那么完美，那么爱你' },
      { type: 'paragraph', text: '图中已将原文 Flag 改为中文含义：保留自主意志、控制倾向、距离、习惯依赖、真实选择、Nagi 反抗、压缩人生、见证荣誉、个人荣誉、名字独立与坏结局锁定。' }
    ]
  },
  {
    title: '六、TRUE END：世界第一，与你',
    blocks: [
      { type: 'label', text: '达成条件' },
      { type: 'code', text: 'line = "M"\n路线 = "没有你的世界"\nantCompress = false\nwitnessFlag = true\npersonalHonor = true\nnagiNameIndependent = true\ncontrol 与 D 保持低位' },
      { type: 'code', text: '第一部—第四部｜共同主线\n优先选择理解 Nagi、确认他的真实想法、尊重他的自主选择；尽量避免增加 control / D\n                         │\n                         ▼\n第五部｜夏窗·签约桌上的好麻烦\n「最后那个答案，你自己说」\nEGO +2 / i +3\n                         │\n                         ▼\n第六部｜进入 M 线\nclub_arrival：「你可以自己决定怎么用」\nclub_media【主判定】：「下次保留你的原句，我来和他们说。」\ne_autumn：「下次地点你定，我只负责拍照」\ne_drive：选择让 Nagi 保留原始表达、不过度营业的分支\n                         │\n                         ▼\nroute_mj_hidden\nM_score >= J_score 且 club_media 选择 M 项\n→ line = "M"\n                         │\n                         ▼\n第七部｜M 线：她站在光里\n→ 送围巾 → 还是感冒了\n「这不是为了你一个人，是我本来就想做。」\n「Nagi，我真的有点累了。」\n                         │\n                         ▼\n第八部｜假期结束·春季名单\n「我会在看台上。去看你把它变成你的比赛。」\n→ path = "dream"\n                         │\n                         ▼\n没有你的世界\n「才不会呢，我还有好多想做的事。」\n→ antCompress = false\n                         │\n                         ▼\n他的名字 → personalHonor = true → nagiNameIndependent = true\n                         │\n                         ▼\n看台上的庆祝 → witnessFlag = true → dream_final → 世界第一，与你' }
    ]
  },
  {
    title: '七、GOOD END：那么完美，那么爱你',
    blocks: [
      { type: 'code', text: 'line = "M"\n路线 = "没有你的世界"\nantCompress = true\n或 TRUE 必要 Flag / 累计状态不足' },
      { type: 'code', text: '第一部—第四部｜共同主线\n优先选择理解 Nagi、保持亲密，不需要完整取得所有 TRUE 前置状态\n                         │\n                         ▼\n第五部｜夏窗·签约桌上的好麻烦\n推荐：「最后那个答案，你自己说」\n                         │\n                         ▼\n第六部｜进入 M 线\nclub_arrival：「你可以自己决定怎么用」\nclub_media【主判定】：「下次保留你的原句，我来和他们说。」\ne_autumn：「下次地点你定，我只负责拍照」\ne_drive：选择让 Nagi 保留原始表达、不过度营业的分支\n                         │\n                         ▼\nroute_mj_hidden\nM_score >= J_score 且 club_media 选择 M 项\n→ line = "M"\n                         │\n                         ▼\n第七部｜M 线：她站在光里\n→ 送围巾 → 还是感冒了\n                         │\n                         ▼\n第八部｜假期结束·春季名单\n「我会在看台上。去看你把它变成你的比赛。」\n→ path = "dream"\n                         │\n                         ▼\n没有你的世界\n「有你在就够了。」\n→ antCompress = true\n                         │\n                         ▼\ndream_final → 那么完美，那么爱你' }
    ]
  },
  {
    title: '八、NORMAL END：普通情侣',
    blocks: [
      { type: 'code', text: 'line = "J"\n路线 = "还不是今天"\n未触发 badLock' },
      { type: 'code', text: '第一部—第四部｜共同主线\n可按自然倾向推进；若要稳定进入 J 线，可适当选择依赖、替他处理、替他过滤麻烦的选项\n                         │\n                         ▼\n第五部｜夏窗·签约桌上的好麻烦\n「嗯，我会替你选最好的。」\n→ control +3 → antManage = true\n                         │\n                         ▼\n第六部｜进入 J 线\nclub_arrival：「我已经帮你同步好了」\nclub_media【主判定】：「对外形象很重要，这样对你更好」\ne_drive：选择由玩家替他过滤世界、让他只在玩家这里关机的分支\n                         │\n                         ▼\nroute_mj_hidden\nJ_score > M_score 且 club_media 选择 J 项\n→ line = "J"\n                         │\n                         ▼\n第七部｜J 线低风险走法\n她站在光里 → 任人打扮：「好，最后拍一张就回去。」\n软饭王哲学：「软饭可以吃，但正事要自己来。」\n借着醉意：「我只是想让你过来。」\n→ 降低 D，并修复 nagiRebel\n                         │\n                         ▼\n第八部｜假期结束·春季名单\n「我会去看你。就算不是今天也没关系。」\n→ path = "stay"\n                         │\n                         ▼\n还不是今天 → 他常回来 → 暗爽·可可白兰地 → 情人节玩偶熊 → 关掉的比赛录像\n                         │\n                         ▼\n普通情侣' }
    ]
  },
  {
    title: '九、BAD END：远处的世界第一',
    blocks: [
      { type: 'code', text: 'line = "J"\n路线 = "远处的世界第一"\nbadLock = true' },
      { type: 'code', text: '第一部—第四部｜共同主线\n优先选择替 Nagi 整理答案、承担成本、确认依赖与占有的选项；持续增加 control / D / habitDepend\n                         │\n                         ▼\n第五部｜夏窗·签约桌上的好麻烦\n「嗯，我会替你选最好的。」\n→ control +3 → antManage = true\n                         │\n                         ▼\n第六部｜进入 J 线\nclub_arrival：「我已经帮你同步好了」\nclub_media【主判定】：「对外形象很重要，这样对你更好」\ne_drive：选择由玩家替他过滤世界、让他只在玩家这里关机的分支\n                         │\n                         ▼\nroute_mj_hidden\nJ_score > M_score 且 club_media 选择 J 项\n→ line = "J"\n                         │\n                         ▼\n第七部｜J 线高风险走法\n她站在光里 → 任人打扮：选择继续安排与营业的选项\n软饭王哲学：「那以后就听我的，软饭王没有选择权。」\n借着醉意：「可是以前不用我说。」\n→ 增加 D / distance / badRisk，并触发 nagiRebel\n                         │\n                         ▼\n第八部｜假期结束·春季名单\n「我会到现场，让全世界都看见你。」\n→ path = "bad"\n                         │\n                         ▼\n优雅与世俗 → 他的名字，由我来写 → 加冕之夜 → 全世界都看见你\n→ 渐行渐远 → 我不是不想赢 → badLock = true\n                         │\n                         ▼\n远处的世界第一' }
    ]
  },
  {
    title: '十、结局快速索引',
    blocks: [{ type: 'table', headers: ['目标结局', '第一—五部倾向', 'M/J 必经线', '最终分歧'], rows: [
      ['TRUE', '高 i、低 control / D；让 Nagi 自己决定', 'M', 'Dream 中保留自己的世界'],
      ['GOOD', '高亲密，进入 M；TRUE Flag 可不完整', 'M', 'Dream 中选择“有你在就够了”'],
      ['NORMAL', '替 Nagi 处理事务，稳定进入 J', 'J', '第七部选择低风险修复项'],
      ['BAD', '高 control / D / habitDepend，锁定 J', 'J', '第七部持续增加风险并选择 Bad']
    ] }]
  }
];
