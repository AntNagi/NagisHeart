#!/usr/bin/env node
/**
 * convert-story.js
 * Migrates story.js data into story-data/*.json files.
 * Run: node tools/convert-story.js
 */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'story.js');
const OUT = path.join(__dirname, '..', 'story-data');

const raw = fs.readFileSync(SRC, 'utf-8');

// ── helpers ──────────────────────────────────────────────

function extractObject(varName) {
  const re = new RegExp(`(?:const|let|var)\\s+${varName}\\s*=\\s*`, 'g');
  const m = re.exec(raw);
  if (!m) throw new Error(`Cannot find ${varName}`);
  let start = m.index + m[0].length;
  let depth = 0, i = start, inStr = false, strCh = '';
  for (; i < raw.length; i++) {
    const ch = raw[i];
    if (inStr) { if (ch === strCh && raw[i-1] !== '\\') inStr = false; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strCh = ch; continue; }
    if (ch === '{' || ch === '[') depth++;
    if (ch === '}' || ch === ']') { depth--; if (depth === 0) { i++; break; } }
  }
  const code = raw.slice(start, i);
  try {
    return (new Function('return ' + code))();
  } catch(e) {
    throw new Error(`Failed to eval ${varName}: ${e.message}`);
  }
}

function write(name, data) {
  const p = path.join(OUT, name);
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(`  ✓ ${name} (${JSON.stringify(data).length} bytes)`);
}

let dialogueIdCounter = {};
function makeLineId(nodeId, prefix, index) {
  return `${nodeId}_${prefix}${String(index + 1).padStart(3, '0')}`;
}

// ── 1. variables.json ────────────────────────────────────

function convertVariables() {
  console.log('\n[1/8] variables.json');
  const variables = {
    numeric: {
      bond:          { label: "关系亲密度", initial: 0, legacy: ["b"] },
      understanding: { label: "理解度",     initial: 0, legacy: ["I", "i", "u"] },
      distance:      { label: "距离",       initial: 0, legacy: ["D", "d"] },
      ego:           { label: "自主意志",   initial: 0, legacy: [] },
      control:       { label: "管控倾向",   initial: 0, legacy: [] },
      witness:       { label: "见证",       initial: 0, legacy: [] },
      independence:  { label: "独立性",     initial: 0, legacy: [] },
      habitWarm:     { label: "舒适依赖",   initial: 0, legacy: [] },
      habitDepend:   { label: "习惯依存",   initial: 0, legacy: [] },
      ordinaryHappiness:     { label: "普通幸福",     initial: 0, legacy: [] },
      publicCoupleExposure:  { label: "公开曝光",     initial: 0, legacy: [] },
      antSoft:       { label: "Ant柔化",    initial: 0, legacy: [] },
      nagiCare:      { label: "Nagi关心",   initial: 0, legacy: [] },
      egoHold:       { label: "EGO坚持",    initial: 0, legacy: [] },
      loveNotHabit:  { label: "爱非习惯",   initial: 0, legacy: [] },
      badRisk:       { label: "Bad风险",    initial: 0, legacy: [] },
      possess:       { label: "占有",       initial: 0, legacy: [] },
      controlSeed:   { label: "控制种子",   initial: 0, legacy: [] },
      nagiSelf:      { label: "Nagi自我",   initial: 0, legacy: [] },
      antIdealize:   { label: "Ant理想化",  initial: 0, legacy: [] },
    },
    flags: {
      mj:            { type: "string",  initial: null, legacy: ["line"] },
      path:          { type: "string",  initial: null, legacy: [] },
      route:         { type: "string",  initial: null, legacy: [] },
      finalChoice:   { type: "string",  initial: null, legacy: [] },
      finalFlag:     { type: "string",  initial: null, legacy: [] },
      kc3:           { type: "string",  initial: null, legacy: [] },
      nel:           { type: "string",  initial: null, legacy: [] },
      mDeep:         { type: "boolean", initial: false, legacy: [] },
      nagiResonate:  { type: "boolean", initial: false, legacy: [] },
      antCompress:   { type: "boolean", initial: false, legacy: [] },
      antManage:     { type: "boolean", initial: false, legacy: [] },
      antLightSeen:  { type: "boolean", initial: false, legacy: [] },
      antFragileSeen:{ type: "boolean", initial: false, legacy: [] },
      nagiRebel:     { type: "boolean", initial: false, legacy: [] },
      nagiRebelSeed: { type: "boolean", initial: false, legacy: [] },
      personalHonor: { type: "boolean", initial: false, legacy: [] },
      witnessFlag:   { type: "boolean", initial: false, legacy: [] },
      badLock:       { type: "boolean", initial: false, legacy: [] },
      nagiNameIndependent:  { type: "boolean", initial: false, legacy: [] },
      returnBySelf:         { type: "boolean", initial: false, legacy: [] },
      homeAsSavePoint:      { type: "boolean", initial: false, legacy: [] },
      nagiDiscomfortSeed:   { type: "boolean", initial: false, legacy: [] },
      publicCoupleExposureSeed: { type: "boolean", initial: false, legacy: [] },
    }
  };
  write('variables.json', variables);
}

// ── 2. flow.json ─────────────────────────────────────────

function convertFlow() {
  console.log('\n[2/8] flow.json');
  const FN = extractObject('FN');
  const FN_PATH = extractObject('FN_PATH');

  // Fix first part chain: remove e_select2
  delete FN.e_select2;
  FN.c1a = 'c1b';  // p1->p2->c1a->c1b->u20j

  write('flow.json', {
    default: FN,
    byRoute: FN_PATH
  });
}

// ── 3. chapters.json ─────────────────────────────────────

function convertChapters() {
  console.log('\n[3/8] chapters.json');
  const CHAPTERS = extractObject('CHAPTERS');

  // Also extract NODEBG for bg mapping
  let NODEBG;
  try { NODEBG = extractObject('NODEBG'); } catch(e) { NODEBG = {}; }

  const chapters = CHAPTERS.map((ch, ci) => ({
    id: `part${ci + 1}`,
    name: ch.n,
    title: ch.title,
    background: ch.bg || null,
    sections: ch.sections.map((sec, si) => ({
      name: sec.n,
      title: sec.title,
      startNode: sec.start,
      background: sec.bg || null,
      routed: sec.routed || false,
    }))
  }));
  write('chapters.json', chapters);
}

// ── 4. endings.json ──────────────────────────────────────

function convertEndings() {
  console.log('\n[4/8] endings.json');
  const ENDINGS = extractObject('ENDINGS');

  const endings = {
    definitions: {},
    judgement: [
      { tier: "bad",    condition: "path == 'cling' || distance >= 6",                                                                     node: "end_bad_1" },
      { tier: "true",   condition: "nagiResonate && !antCompress && distance <= 3 && path == 'dream' && finalFlag == 'support'",            node: "end_true_1" },
      { tier: "good",   condition: "!antCompress && path == 'dream'",                                                                       node: "end_good_1" },
      { tier: "normal", condition: "true",                                                                                                  node: "end_normal_1" },
    ]
  };

  for (const [tier, e] of Object.entries(ENDINGS)) {
    endings.definitions[tier] = {
      tag: e.tag,
      emoji: e.emoji,
      title: e.title,
      description: e.desc.replace(/<br\/?>/g, '\n'),
      subtitle: e.sub,
      eggScene: tier === 'true' ? 'c8c' : null,
    };
  }
  write('endings.json', endings);
}

// ── 5. routers.json ──────────────────────────────────────

function convertRouters() {
  console.log('\n[5/8] routers.json');

  const routers = {
    m_igate: {
      rules: [
        {
          condition: "control >= 2 || D >= 3",
          sideEffects: [{ var: "mDeep", op: "set", val: false }],
          target: "m_shallow"
        },
        {
          condition: "ego >= 1 || I >= 2",
          sideEffects: [{ var: "mDeep", op: "set", val: true }],
          target: "e_intimate_cohabit"
        }
      ],
      fallback: "m_shallow"
    },
    route_mj_hidden: {
      rules: [],
      fallback: "e_agency_launch"
    },
    route_agency_post: {
      rules: [
        { condition: "mj == 'M'", target: "e_scarf" },
        { condition: "mj == 'J'", target: "e_dressup" }
      ],
      fallback: "e_dressup"
    },
    route_drunk_check: {
      rules: [
        { condition: "nagiRebel == true", target: "e_drunk_rebel" }
      ],
      fallback: "e_drunk"
    },
    route_love_hidden: {
      rules: [],
      fallback: "p8_route"
    },
    route_dream_final: {
      rules: [
        {
          condition: "path == 'dream' && !antCompress && witnessFlag && personalHonor && nagiNameIndependent && control <= 3 && D <= 3",
          target: "dream_final_true"
        }
      ],
      fallback: "dream_final_good"
    }
  };
  write('routers.json', routers);
}

// ── 6. nodes.json ────────────────────────────────────────

// Legacy variable name mapping for effects
const LEGACY_VAR_MAP = {
  b: 'bond', u: 'understanding', i: 'understanding',
  I: 'understanding', D: 'distance', d: 'distance',
};

function mapVarName(v) {
  return LEGACY_VAR_MAP[v] || v;
}

function convertDialogueLine(nodeId, item, index) {
  const id = makeLineId(nodeId, 'd', index);
  if (typeof item === 'string') {
    // bare string = nagi dialogue in response context
    return { id, speaker: 'nagi', text: item };
  }
  const speaker = item.who || 'sys';
  const line = { id, speaker, text: item.t };
  if (speaker === 'sys') {
    line.display = 'bottom';
  }
  return line;
}

function convertNagiResponses(nodeId, choiceIdx, nagiArr) {
  if (!nagiArr || !Array.isArray(nagiArr)) return [];
  return nagiArr.map((item, ri) => {
    const id = makeLineId(nodeId, `c${String(choiceIdx + 1).padStart(3, '0')}_r`, ri);
    if (typeof item === 'string') {
      return { id, speaker: 'nagi', text: item };
    }
    const speaker = item.who || 'sys';
    const line = { id, speaker, text: item.t };
    if (speaker === 'sys') line.display = 'bottom';
    return line;
  });
}

function buildEffects(choice) {
  const effects = [];
  if (choice.b)   effects.push({ var: 'bond', op: 'add', val: choice.b });
  if (choice.u)   effects.push({ var: 'understanding', op: 'add', val: choice.u });
  if (choice.i)   effects.push({ var: 'understanding', op: 'add', val: choice.i });
  if (choice.I)   effects.push({ var: 'understanding', op: 'add', val: choice.I });
  if (choice.d)   effects.push({ var: 'distance', op: 'add', val: choice.d });
  if (choice.D)   effects.push({ var: 'distance', op: 'add', val: choice.D });
  if (choice.ego) effects.push({ var: 'ego', op: 'add', val: choice.ego });
  if (choice.control) effects.push({ var: 'control', op: 'add', val: choice.control });

  // Generic effects from choice.set
  // In old code, set.line -> mj, boolean flags use =, numeric vars use +=
  if (choice.set) {
    const SET_TO_VAR = { line: 'mj' };
    const ADD_VARS = new Set([
      'habitWarm','habitDepend','ordinaryHappiness','publicCoupleExposure',
      'antSoft','nagiCare','egoHold','loveNotHabit',
      'distance','badRisk','possess','controlSeed','nagiSelf','antIdealize',
    ]);
    for (const [k, v] of Object.entries(choice.set)) {
      const varName = SET_TO_VAR[k] || mapVarName(k);
      if (ADD_VARS.has(k) && typeof v === 'number') {
        effects.push({ var: varName, op: 'add', val: v });
      } else {
        effects.push({ var: varName, op: 'set', val: v });
      }
    }
  }
  // Flag: in old code, c.flag is a string assigned to finalFlag
  if (choice.flag) {
    if (typeof choice.flag === 'string') {
      effects.push({ var: 'finalFlag', op: 'set', val: choice.flag });
    } else {
      for (const [k, v] of Object.entries(choice.flag)) {
        effects.push({ var: k, op: 'set', val: v });
      }
    }
  }
  if (choice.route) effects.push({ var: 'path', op: 'set', val: choice.route });
  return effects;
}

function buildTransition(choice) {
  if (choice.end) {
    if (choice.endTier) return { type: 'ending', tier: choice.endTier };
    if (choice.endBad) return { type: 'ending', tier: 'bad' };
    return { type: 'ending' };
  }
  if (choice.egg) return { type: 'egg' };
  if (choice.next) return { type: 'goto', target: choice.next };
  if (choice.sec) return { type: 'section_end' };
  return { type: 'section_end' };
}

function guessDisplayTag(type) {
  const map = {
    '心动': '心动', '理性': '认真', '作': '撒娇',
    '见证': '理解', '靠近': '靠近', '推': '推他一把',
    '沉默': '沉默', '陪伴': '留在这里', '放手': '让他自己决定',
    '管控': '认真', '温柔': '靠近', '克制': '沉默',
  };
  return map[type] || type || '心动';
}

function guessInternalTag(type) {
  const map = {
    '心动': 'affection', '理性': 'understanding', '作': 'push',
    '见证': 'witness', '靠近': 'affection', '推': 'push',
    '沉默': 'avoid', '陪伴': 'comfort', '放手': 'release',
    '管控': 'control', '温柔': 'comfort', '克制': 'witness',
  };
  return map[type] || 'affection';
}

function convertNodes() {
  console.log('\n[6/8] nodes.json');
  const STORY = extractObject('STORY');

  let NODEBG;
  try { NODEBG = extractObject('NODEBG'); } catch(e) { NODEBG = {}; }

  let SCENE;
  try { SCENE = extractObject('SCENE'); } catch(e) { SCENE = {}; }

  const nodes = {};
  let totalNodes = 0, totalLines = 0, totalChoices = 0;

  for (const [nodeId, node] of Object.entries(STORY)) {
    if (node.router) {
      // router nodes go into routers.json, skip
      continue;
    }

    totalNodes++;
    const dialogue = (node.auto || []).map((item, idx) =>
      convertDialogueLine(nodeId, item, idx)
    );
    totalLines += dialogue.length;

    const choices = (node.choices || []).map((c, ci) => {
      totalChoices++;
      const choiceId = makeLineId(nodeId, 'c', ci);
      return {
        id: choiceId,
        label: c.label,
        displayTag: guessDisplayTag(c.type),
        internalTag: guessInternalTag(c.type),
        playerLine: c.ant || c.label,
        responses: convertNagiResponses(nodeId, ci, c.nagi),
        effects: buildEffects(c),
        transition: buildTransition(c),
        condition: null,
        confirmRequired: false,
      };
    });

    nodes[nodeId] = {
      mode: 'vn',
      dialogue,
      choices,
      bg: NODEBG[nodeId] || null,
      bgm: null,
      cg: null,
      autoSave: true,
      mapMeta: {
        visibleWhen: null,
        unlockCondition: null,
        routeScope: null,
        spoilerLevel: 0,
      }
    };

    // Add scene title if available
    if (SCENE[nodeId]) {
      nodes[nodeId].sceneTitle = SCENE[nodeId];
    }
  }

  // Add placeholder ending nodes referenced in FN/SCENE but not yet in STORY
  const endingPlaceholders = [
    'end_true_1','end_true_2','end_good_1','end_good_2',
    'end_normal_1','end_normal_2','end_bad_1','end_bad_2'
  ];
  for (const eid of endingPlaceholders) {
    if (!nodes[eid]) {
      nodes[eid] = {
        mode: 'vn',
        dialogue: [{ id: `${eid}_d001`, speaker: 'sys', text: `[TODO: ${SCENE[eid] || eid} 结局剧情待写]`, display: 'fullscreen' }],
        choices: [],
        bg: NODEBG[eid] || null,
        bgm: null,
        cg: null,
        autoSave: true,
        sceneTitle: SCENE[eid] || eid,
        mapMeta: { visibleWhen: null, unlockCondition: null, routeScope: null, spoilerLevel: 0 },
        _placeholder: true,
      };
      totalNodes++;
    }
  }

  write('nodes.json', nodes);
  console.log(`    ${totalNodes} nodes, ${totalLines} dialogue lines, ${totalChoices} choices`);
}

// ── 7. prologue.json ─────────────────────────────────────

function convertPrologue() {
  console.log('\n[7/8] prologue.json');
  const PROLOGUE_LINES = extractObject('PROLOGUE_LINES');
  write('prologue.json', {
    lines: PROLOGUE_LINES.map((text, i) => ({
      id: `prologue_${String(i + 1).padStart(3, '0')}`,
      text,
    }))
  });
}

// ── 8. version.json ──────────────────────────────────────

function writeVersion() {
  console.log('\n[8/8] version.json');
  write('version.json', {
    version: 1,
    minEngineVersion: 1,
    migratedFrom: 'story.js',
    migratedAt: new Date().toISOString(),
  });
}

// ── main ─────────────────────────────────────────────────

console.log('=== Nagi\'s Heart: story.js → story-data/ migration ===');
console.log(`Source: ${SRC}`);
console.log(`Output: ${OUT}`);

convertVariables();
convertFlow();
convertChapters();
convertEndings();
convertRouters();
convertNodes();
convertPrologue();
writeVersion();

console.log('\n=== Migration complete ===');
console.log('Next: run  node tools/validate.js  to check data integrity');
