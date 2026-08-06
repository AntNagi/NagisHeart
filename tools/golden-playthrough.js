#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'story-data');
const nodes = JSON.parse(fs.readFileSync(path.join(DATA, 'nodes.json'), 'utf-8'));
const flow = JSON.parse(fs.readFileSync(path.join(DATA, 'flow.json'), 'utf-8'));
const routers = JSON.parse(fs.readFileSync(path.join(DATA, 'routers.json'), 'utf-8'));
const variables = JSON.parse(fs.readFileSync(path.join(DATA, 'variables.json'), 'utf-8'));

function initState() {
  const state = {};
  for (const [name, def] of Object.entries(variables.numeric || {})) state[name] = def.default || 0;
  for (const [name, def] of Object.entries(variables.flags || {})) state[name] = def.default === undefined ? false : def.default;
  return state;
}

function applyEffect(state, eff) {
  if (eff.op === 'set') state[eff.var] = eff.val;
  else if (eff.op === 'add') state[eff.var] = (state[eff.var] || 0) + eff.val;
}

const KEY_VARS = ['path','control','distance','narrativeDistance','antCompress','witnessFlag','personalHonor',
  'nagiNameIndependent','antLightSeen','antFragileSeen','loveNotHabit','habitDepend',
  'nagiCare','badLock','nagiRebel','nagiDiscomfortSeed','mj','finalChoice','egoHold','trueFlag'];

function simulate(choiceMap) {
  const state = initState();
  const log = [];
  let current = 'p1';
  let steps = 0;

  while (current && steps < 200) {
    steps++;
    const node = nodes[current];

    if (!node) {
      const router = routers[current];
      if (!router) break;
      let matched = false;
      for (const rule of router.rules) {
        try {
          const fn = new Function(...Object.keys(state), 'return ' + rule.condition);
          if (fn(...Object.values(state))) {
            for (const eff of (rule.sideEffects || [])) applyEffect(state, eff);
            log.push('ROUTER ' + current + ' -> ' + rule.label + ' -> ' + rule.target);
            current = rule.target;
            matched = true;
            break;
          }
        } catch(e) {}
      }
      if (!matched) {
        for (const eff of (router.fallbackSideEffects || [])) applyEffect(state, eff);
        log.push('ROUTER ' + current + ' -> fallback -> ' + router.fallback);
        current = router.fallback;
      }
      continue;
    }

    const choices = node.choices || [];
    if (choices.length === 0) {
      // no choices, follow FN
    } else if (choices.length === 1 && choices[0].autoAdvance) {
      const c = choices[0];
      const keyEffs = (c.effects || []).filter(e => KEY_VARS.includes(e.var));
      if (keyEffs.length > 0) {
        log.push('AUTO ' + current + ': ' + keyEffs.map(e => e.var + (e.op === 'add' ? (e.val >= 0 ? '+' : '') + e.val : '=' + e.val)).join(', '));
      }
      for (const eff of (c.effects || [])) applyEffect(state, eff);
      if (c.transition && c.transition.type === 'goto') { current = c.transition.target; continue; }
      if (c.transition && c.transition.type === 'ending') {
        log.push('ENDING -> ' + c.transition.tier);
        return { log, state, ending: c.transition.tier };
      }
    } else {
      const picked = choiceMap[current] !== undefined ? choiceMap[current] : 0;
      const c = choices[Math.min(picked, choices.length - 1)];
      const keyEffs = (c.effects || []).filter(e => KEY_VARS.includes(e.var));
      log.push('CHOICE ' + current + ': "' + (c.label || '').substring(0, 40) + '"' +
        (keyEffs.length > 0 ? ' -> ' + keyEffs.map(e => e.var + (e.op === 'add' ? (e.val >= 0 ? '+' : '') + e.val : '=' + e.val)).join(', ') : ''));
      for (const eff of (c.effects || [])) applyEffect(state, eff);
      if (c.transition && c.transition.type === 'goto') { current = c.transition.target; continue; }
      if (c.transition && c.transition.type === 'ending') {
        log.push('ENDING -> ' + c.transition.tier);
        return { log, state, ending: c.transition.tier };
      }
    }

    let next = null;
    for (const [routeName, overrides] of Object.entries(flow.byRoute || {})) {
      if (overrides[current]) {
        if ((routeName === 'M' && state.mj === 'M') || (routeName === 'J' && state.mj === 'J') ||
            (routeName === 'dream' && state.path === 'dream') || (routeName === 'stay' && state.path === 'stay') ||
            (routeName === 'bad' && state.path === 'bad')) {
          next = overrides[current];
        }
      }
    }
    if (!next) next = flow.default[current];
    current = next;
  }
  return { log, state, ending: 'NO_ENDING (steps=' + steps + ')' };
}

const failures = [];

function printResult(label, result, expected) {
  console.log('========== ' + label + ' ==========');
  result.log.forEach(l => console.log('  ' + l));
  const ok = expected === undefined || result.ending === expected;
  if (!ok) failures.push(`${label}: 预期 ${expected}，实际 ${result.ending}`);
  console.log('  RESULT: ' + result.ending +
    (expected === undefined ? '' : (ok ? '  ✅' : `  ❌ 预期 ${expected}`)));
  console.log('  --- Key State ---');
  for (const v of KEY_VARS) {
    if (result.state[v] !== 0 && result.state[v] !== false && result.state[v] !== undefined) {
      console.log('  ' + v + ' = ' + result.state[v]);
    }
  }
  console.log('');
}

// A. TRUE END attempt: gentlest choices, M route, dream, antCompress=false
printResult('A. TRUE END (gentle M-dream, antCompress=false)', simulate({
  'p2': 0, 'p2_s2': 0, 'p2_s3': 0,
  'c1a': 0, 'c1b': 0, 'c1b_s2': 0, 'c1b_s3': 0, 'c1b_s4': 0,
  'u20j': 0, 'c3': 0, 'c3_s2': 0,
  'e_lemontea_s2': 0, 'c2_s2': 0, 'e_lolly': 0, 'e_lolly_s2': 0,
  'c6a': 0, 'e_bday': 0, 'e_hug': 0, 'e_intimate': 0,
  'wc_keygoal': 0, 'wc_offer': 0,
  'mt3': 0,
  'e_cozy': 0, 'w_noodle': 0, 'w_game': 0, 'e_tipsy': 0,
  'c4': 0, 'c4a': 0, 'c4a_s2': 0, 'c4a_s3': 0, 'c4d': 0,
  'transfer_contract': 0,
  'club_arrival': 0, 'club_training': 0, 'club_media': 0,
  'e_autumn': 0, 'e_halloween': 0, 'e_drive': 0,
  'e_agency_launch': 0,
  'e_scarf': 0,
  'e_sick_fragile': 0,
  'p8_route': 0,
  'dream_exist': 0,
}), 'true');

// B. GOOD END attempt: dream path, antCompress=true
printResult('B. GOOD END (M-dream, antCompress=true)', simulate({
  'p2': 0, 'p2_s2': 0, 'p2_s3': 0,
  'c1a': 0, 'c1b': 0, 'c1b_s2': 0, 'c1b_s3': 0, 'c1b_s4': 0,
  'u20j': 0, 'c3': 0, 'c3_s2': 0,
  'e_lemontea_s2': 0, 'c2_s2': 0, 'e_lolly': 0, 'e_lolly_s2': 0,
  'c6a': 0, 'e_bday': 0, 'e_hug': 0, 'e_intimate': 0,
  'wc_keygoal': 0, 'wc_offer': 0,
  'mt3': 0,
  'e_cozy': 0, 'w_noodle': 0, 'w_game': 0, 'e_tipsy': 0,
  'c4': 0, 'c4a': 0, 'c4a_s2': 0, 'c4a_s3': 0, 'c4d': 0,
  'transfer_contract': 0,
  'club_arrival': 0, 'club_training': 0, 'club_media': 0,
  'e_autumn': 0, 'e_halloween': 0, 'e_drive': 0,
  'e_agency_launch': 0,
  'e_scarf': 0,
  'e_sick_fragile': 0,
  'p8_route': 0,
  'dream_exist': 1,
}), 'good');

// C. NORMAL END: stay path
printResult('C. NORMAL END (stay path)', simulate({
  'p2': 0, 'p2_s2': 0, 'p2_s3': 0,
  'c1a': 0, 'c1b': 0, 'c1b_s2': 0, 'c1b_s3': 0, 'c1b_s4': 0,
  'u20j': 0, 'c3': 0, 'c3_s2': 0,
  'e_lemontea_s2': 0, 'c2_s2': 0, 'e_lolly': 0, 'e_lolly_s2': 0,
  'c6a': 0, 'e_bday': 0, 'e_hug': 0, 'e_intimate': 0,
  'wc_keygoal': 0, 'wc_offer': 0,
  'mt3': 0,
  'e_cozy': 0, 'w_noodle': 0, 'w_game': 0, 'e_tipsy': 0,
  'c4': 0, 'c4a': 0, 'c4a_s2': 0, 'c4a_s3': 0, 'c4d': 0,
  'transfer_contract': 0,
  // NORMAL 属于 J 池：club_media 必须选 J 项(1)，否则 mj=M 只会落到 GOOD。
  'club_arrival': 0, 'club_training': 0, 'club_media': 1,
  'e_autumn': 0, 'e_halloween': 0, 'e_drive': 0,
  'e_agency_launch': 0,
  'e_scarf': 0,
  'e_sick_fragile': 0,
  // 下标是 node.choices 的原始下标（未按 condition 过滤）：[2]=stay/ordinary。
  'p8_route': 2,
}), 'normal');

// D. BAD END: high control choices, bad path
printResult('D. BAD END (high control, bad path)', simulate({
  'p2': 1, 'p2_s2': 1, 'p2_s3': 0,
  'c1a': 1, 'c1b': 1, 'c1b_s2': 1, 'c1b_s3': 1, 'c1b_s4': 0,
  'u20j': 1, 'c3': 1, 'c3_s2': 0,
  'e_lemontea_s2': 0, 'c2_s2': 0, 'e_lolly': 1, 'e_lolly_s2': 0,
  'c6a': 0, 'e_bday': 0, 'e_hug': 0, 'e_intimate': 0,
  'wc_keygoal': 0, 'wc_offer': 1,
  'mt3': 0,
  'e_cozy': 0, 'w_noodle': 0, 'w_game': 0, 'e_tipsy': 0,
  'c4': 0, 'c4a': 1, 'c4a_s2': 0, 'c4a_s3': 0, 'c4d': 0,
  'transfer_contract': 0,
  'club_arrival': 0, 'club_training': 0, 'club_media': 1,
  'e_autumn': 0, 'e_halloween': 0, 'e_drive': 0,
  'e_agency_launch': 2,
  'e_scarf': 1,
  'e_sick_fragile': 1,
  // 原始下标 [3]=bad/coronation；[2] 是 stay，选错会落到 NORMAL。
  'p8_route': 3,
}), 'bad');

// E. 长期管理倾向翻盘：一路强控，但在 club_media 选了 M 项。
// mt3/transfer_contract/club_arrival/club_training 全取高 control 项 → control=7 (>=5)，
// 即使最后收手选 M，route_mj_hidden 仍应判入 J 线并置 mjByTendency。
printResult('E. 管理倾向翻盘 (高 control + club_media 选 M)', simulate({
  'p2': 1, 'p2_s2': 1, 'p2_s3': 0,
  'c1a': 1, 'c1b': 1, 'c1b_s2': 1, 'c1b_s3': 1, 'c1b_s4': 0,
  'u20j': 1, 'c3': 1, 'c3_s2': 0,
  'e_lemontea_s2': 0, 'c2_s2': 0, 'e_lolly': 1, 'e_lolly_s2': 0,
  'c6a': 0, 'e_bday': 0, 'e_hug': 0, 'e_intimate': 0,
  'wc_keygoal': 0, 'wc_offer': 1,
  'mt3': 1,
  'e_cozy': 0, 'w_noodle': 0, 'w_game': 0, 'e_tipsy': 0,
  'c4': 0, 'c4a': 1, 'c4a_s2': 0, 'c4a_s3': 0, 'c4d': 0,
  'transfer_contract': 1,
  'club_arrival': 1, 'club_training': 1, 'club_media': 0,
  'e_autumn': 0, 'e_halloween': 0, 'e_drive': 0,
  'e_agency_launch': 2,
  'e_scarf': 1,
  'e_sick_fragile': 1,
  'p8_route': 2,
}), 'normal');

console.log('='.repeat(50));
if (failures.length === 0) {
  console.log(`✅ PASSED — ${5} 条黄金路径全部到达预期结局`);
} else {
  console.log(`❌ FAILED — ${failures.length} 条路径未到达预期结局`);
  failures.forEach(f => console.log('  ' + f));
  process.exitCode = 1;
}
