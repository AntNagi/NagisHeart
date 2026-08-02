// Story map presentation tables — the web mirror of the Android
// `ui/screen/StoryMapLayout.kt`. Authority: MinSpec §27.11 / §27.15 / §27.16.
//
// These are UI presentation values, not story data. They must never be written
// back into story-data/chapters.json.

/** §27.16 — the map header uses its own short title and one-line subtitle. */
export const STORY_CHAPTER_PRESENTATIONS = {
  part1: {
    kicker: 'CHAPTER 01', number: '第一部', title: '初见',
    subtitle: '从作战室到 U-20，日本第一次看见他的名字。', overviewCoverNode: 'c1a',
  },
  part2: {
    kicker: 'CHAPTER 02', number: '第二部', title: '关系确立',
    subtitle: '开放日之后，彼此的生活第一次真正重叠。', overviewCoverNode: 'c3',
  },
  part3: {
    kicker: 'CHAPTER 03', number: '第三部', title: '淘汰与重返',
    subtitle: '刚确认彼此，就被赛程、失败与沉默推向远处。', overviewCoverNode: 'c6a',
  },
  part4: {
    kicker: 'CHAPTER 04', number: '第四部', title: '世界杯',
    subtitle: '从追加名单到生死局，他重新站回世界的视线中央。', overviewCoverNode: 'wc_keygoal',
  },
  part5: {
    kicker: 'CHAPTER 05', number: '第五部', title: '归来与同居',
    subtitle: '日常越靠越近，盛夏也把下一次远行带到门前。', overviewCoverNode: 'e_intimate_cohabit',
  },
  part6: {
    kicker: 'CHAPTER 06', number: '第六部', title: '曼城',
    subtitle: '陌生城市、语言与赛场，让两个人学会新的靠近方式。', overviewCoverNode: 'club_training',
  },
  part7: {
    kicker: 'CHAPTER 07', number: '第七部', title: '假日与心意',
    subtitle: '聚光灯之外，那些没说出口的心意在冬日里发热。', overviewCoverNode: 'e_softrice',
  },
  part8: {
    kicker: 'CHAPTER 08', number: '第八部', title: '世界中心',
    subtitle: '同一个春天，通向三种不同的未来。', overviewCoverNode: 'dream_final',
  },
};

/** §27.3 — only key beats get a picture node; everything else is a text node. */
export const STORY_IMPORTANT_NODES = new Set([
  'p1', 'c1a', 'u20j',
  'c3', 'e_lemontea', 'e_invite',
  'e_depart', 'c6a', 'e_hug', 'side_b_return',
  'wc_roster', 'wc_keygoal', 'wc_offer',
  'w_home', 'e_intimate_cohabit', 'w_game', 'e_morning', 'e_festival', 'transfer_contract',
  'club_arrival', 'club_training', 'e_halloween', 'e_drive',
  'e_agency_launch', 'e_scarf', 'e_softrice', 'e_drunk',
  'p8_route', 'dream_match', 'dream_return', 'dream_final',
  'stay_match', 'stay_daily', 'stay_final',
  'bad_plan', 'bad_match', 'bad_last', 'bad_far',
]);

/** §27.11 — authority route labels. Never show the raw `scope` value. */
export function storyRouteLabel(scope) {
  switch (scope) {
    case 'M': return 'M · 默契线';
    case 'J': return 'J · 较劲线';
    case 'dream': return 'DREAM · 世界第一';
    case 'stay': return 'STAY · 陪我';
    case 'bad': return 'BAD · 抓住我';
    default: return scope;
  }
}

/** §27.11 — chapter 8 uses route-prefixed indices, not the global 01–19. */
export function storyRoutePrefix(scope) {
  switch (scope) {
    case 'M': return 'M';
    case 'J': return 'J';
    case 'dream': return 'D';
    case 'stay': return 'S';
    case 'bad': return 'B';
    default: return '';
  }
}

/**
 * §27.15 — there is no mechanical rule for these breaks (`我不是不想这样赢` has no
 * punctuation, `夏窗·签约桌上的好麻烦` breaks mid-phrase and keeps its `·`), so the
 * table is authoritative. Everything not listed stays on one line.
 */
const STORY_TITLE_BREAKS = {
  '同居·靠近 / 客气的距离': ['同居·靠近', '客气的距离'],
  '游戏冷战·ADC走脸事件': ['游戏冷战', 'ADC走脸事件'],
  '夏窗·签约桌上的好麻烦': ['夏窗·签约桌上的', '好麻烦'],
  '它翻译得很对，但不像我': ['它翻译得很对', '但不像我'],
  '花园别墅·秘密基地': ['花园别墅', '秘密基地'],
  '暗爽·可可白兰地': ['暗爽', '可可白兰地'],
  '他的名字，由我来写': ['他的名字', '由我来写'],
  '我不是不想这样赢': ['我不是不想', '这样赢'],
};

export function storyDisplayLines(title) {
  return STORY_TITLE_BREAKS[title] || [title];
}

/**
 * §27.4 — a locked title shows one question mark per visible character.
 * Punctuation does not count.
 */
export function questionMarks(title) {
  const visible = (title || '').replace(/[·，,、。：:／/\s]/g, '').length;
  return '?'.repeat(Math.max(visible, 1));
}

/** Generic chapter layout: alternating sides, matching the Android map. */
export function storyNodeCenterFraction(index) {
  return index % 2 === 0 ? 0.34 : 0.68;
}

/* ------------------------------------------------------------------------ *
 * Chapter 8 fork geometry.
 *
 * Authored in the same 360 x 1120 unit space the Android map uses, transcribed
 * from the v7 1080px canvas at dp = px / 3 (§27.8). The whole map is scaled to
 * the container width rather than re-flowed, so the composition is identical.
 * ------------------------------------------------------------------------ */

export const PART8_MAP = { width: 360, height: 1120 };

/** Route column centres. */
export const PART8_COLUMN_X = { dream: 60, stay: 180, bad: 300 };

/** Route order left to right. */
export const PART8_ROUTE_ORDER = ['dream', 'stay', 'bad'];

/** Part 7 hidden relationship split, shown as two explicit map routes. */
export const PART7_ROUTE_ORDER = ['M', 'J'];

/** Common opener card. */
export const PART8_COMMON = { x: 80, y: 0, w: 200, h: 112, label: '01 · 共同线' };

/** Text nodes are 116 wide, centred on the column: left = columnX - 58. */
export const PART8_NODE_WIDTH = 116;
export const PART8_LABEL_Y = 146;

/** Picture nodes in the fork. */
export const PART8_IMAGE_SIZE = { w: 124, h: 68 };

/** y per text node, by route. 0 marks a slot occupied by a picture node. */
const PART8_TEXT_Y = {
  dream: [184, 0, 444, 574, 704, 0],
  stay: [184, 314, 444, 574, 0],
  bad: [184, 0, 444, 0, 704, 834, 0],
};

/** Picture node positions, keyed `scope:index`. */
const PART8_IMAGE_XY = {
  'dream:1': [0, 300],
  'dream:5': [0, 820],
  'stay:4': [118, 690],
  'bad:1': [236, 300],
  'bad:3': [236, 560],
  'bad:6': [236, 923],
};

export function part8ImagePosition(scope, index) {
  return PART8_IMAGE_XY[`${scope}:${index}`] || null;
}

/**
 * Sections added after the v7 tables were drawn — the ending epilogues — fall
 * through to an even 130-unit step, matching the Android `getOrElse` fallback.
 */
export function part8TextNodeY(scope, index) {
  const table = PART8_TEXT_Y[scope];
  const y = table?.[index];
  return y === undefined ? 184 + index * 130 : y;
}

/** The gold branch trunk out of the common opener (§27.10 right angles only). */
export const PART8_TRUNK = [
  [[180, 100], [180, 137], [60, 137], [60, 160]],
  [[180, 137], [180, 160]],
  [[180, 137], [300, 137], [300, 160]],
];

/** Soft vertical guide down each route. */
export const PART8_GUIDE = { top: 160, bottom: 1080 };
