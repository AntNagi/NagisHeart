export const ENDING_GUIDE_SECTIONS = [
  {
    title: '一、结局判定总览',
    blocks: [
      { type: 'code', text: '前期选项累计\n    ↓\nroute_mj_hidden\n    ↓\nM / J 关系线\n    ↓\nroute_love_hidden\n    ↓\nM → Dream → TRUE / GOOD\nJ → Stay / Bad → NORMAL / BAD' },
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
      ['route_love_hidden', '读取第七部累计状态，确认终局资格池', 'M 进入 Dream；J 进入 Stay / Bad'],
      ['p8_route', '第八部终局选择', 'M 进入 Dream；J 在 Stay / Bad 中分流'],
      ['dream_final', 'Dream 线最终结算', 'TRUE 或 GOOD']
    ] }]
  },
  {
    title: '五、总路线图',
    blocks: [
      { type: 'code', text: '第一部—第六部：累计 i / egoHold / control / D / habitDepend\n                         ↓\n                route_mj_hidden\n                 ↙       ↘\n              M 线       J 线\n               ↓         ↓\n         第七部剧情   第七部剧情\n               ↘       ↙\n                route_love_hidden\n                 ↙       ↘\n             Dream     Stay / Bad\n              ↓          ↓\n          TRUE/GOOD   NORMAL/BAD' },
      { type: 'paragraph', text: '第一部至第六部的累计值与关键状态决定 M / J 分流；第七部状态再决定终局资格；M 线进入 Dream，J 线进入 Stay / Bad。' }
    ]
  },
  {
    title: '六、TRUE END｜世界第一，与你',
    blocks: [
      { type: 'label', text: '达成条件' },
      { type: 'code', text: 'line = "M"\npath = "dream"\nantCompress = false\nwitnessFlag = true\npersonalHonor = true\nnagiNameIndependent = true\ncontrol 与 D 保持低位' },
      { type: 'paragraph', text: '共同主线优先理解 Nagi、尊重他的自主选择，尽量避免增加 control / D。第五部选择“最后那个答案，你自己说”；第六部进入 M 线并选择“你可以自己决定怎么用”“下次保留你的原句，我来和他们说”。第八部选择“我会在看台上。去看你把它变成你的比赛。”，Dream 中选择“才不会呢，我还有好多想做的事。”，随后完成个人荣誉与见证条件。' }
    ]
  },
  {
    title: '七、GOOD END｜那么完美，那么爱你',
    blocks: [
      { type: 'code', text: 'line = "M"\npath = "dream"\nantCompress = true\n或 TRUE 必要 Flag / 累计状态不足' },
      { type: 'paragraph', text: '先进入 M → Dream 主线。共同主线保持亲密，第五、六部选择理解与尊重自主的选项；第八部选择“我会在看台上。去看你把它变成你的比赛。”，Dream 中选择“有你在就够了”，即可进入 GOOD END。' }
    ]
  },
  {
    title: '八、NORMAL END｜普通情侣',
    blocks: [
      { type: 'code', text: 'line = "J"\npath = "stay"\n未触发 badLock' },
      { type: 'paragraph', text: '稳定进入 J 线可适当选择替 Nagi 处理事务的选项。第五部选择“嗯，我会替你选最好的”，第六部选择“我已经帮你同步好了”“对外形象很重要，这样对你更好”。第八部选择“我会去看你。就算不是今天也没关系。”，第七部继续选择低风险、修复关系的分支，进入 NORMAL END。' }
    ]
  },
  {
    title: '九、BAD END｜远处的世界第一',
    blocks: [
      { type: 'code', text: 'line = "J"\npath = "bad"\nbadLock = true' },
      { type: 'paragraph', text: '先进入 J 线，再持续增加 control / D / habitDepend。第五、六部选择替 Nagi 规划与过滤外部世界的选项；第七部选择继续安排与营业，并在“借着醉意”分支增加距离；第八部选择“我会到现场，让全世界都看见你”，最终锁定 BAD END。' }
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
