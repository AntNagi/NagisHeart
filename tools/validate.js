#!/usr/bin/env node
/**
 * validate.js — StoryDataValidator (T0.1)
 * Validates story-data/*.json integrity before engine consumption.
 * Run: node tools/validate.js
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'story-data');
const ASSETS = path.join(__dirname, '..', 'assets');

let errors = 0, warnings = 0;

function error(msg) { errors++; console.log(`  ❌ ERROR: ${msg}`); }
function warn(msg)  { warnings++; console.log(`  ⚠️  WARN: ${msg}`); }
function info(msg)  { console.log(`  ✅ ${msg}`); }

function load(name) {
  const p = path.join(DATA, name);
  if (!fs.existsSync(p)) { error(`Missing file: ${name}`); return null; }
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')); } catch(e) { error(`Invalid JSON in ${name}: ${e.message}`); return null; }
}

// ── load all data ────────────────────────────────────────

console.log('=== StoryDataValidator ===\n');

const nodes = load('nodes.json');
const flow = load('flow.json');
const routers = load('routers.json');
const chapters = load('chapters.json');
const endings = load('endings.json');
const variables = load('variables.json');
const prologue = load('prologue_short.json');
const sceneVisuals = load('scene_visuals.json');

if (!nodes || !flow || !routers || !chapters || !endings || !variables) {
  console.log(`\n❌ Cannot proceed: missing critical files. ${errors} errors.`);
  process.exit(1);
}

// Build known node set (nodes + router nodes)
const allNodeIds = new Set(Object.keys(nodes));
const routerNodeIds = new Set(Object.keys(routers));
for (const rid of routerNodeIds) allNodeIds.add(rid);

// Build known variable set (canonical + legacy)
const allVarNames = new Set();
const legacyToCanonical = {};
for (const [name, def] of Object.entries(variables.numeric || {})) {
  allVarNames.add(name);
  for (const alias of (def.legacy || [])) {
    allVarNames.add(alias);
    legacyToCanonical[alias] = name;
  }
}
for (const [name, def] of Object.entries(variables.flags || {})) {
  allVarNames.add(name);
  for (const alias of (def.legacy || [])) {
    allVarNames.add(alias);
    legacyToCanonical[alias] = name;
  }
}

// ── 1. Structure checks ─────────────────────────────────

console.log('[1] Flow chain targets');
let flowChecked = 0;
for (const [from, to] of Object.entries(flow.default || {})) {
  flowChecked++;
  if (!allNodeIds.has(to)) {
    error(`flow.default["${from}"] -> "${to}" — target not in nodes or routers`);
  }
}
for (const [route, overrides] of Object.entries(flow.byRoute || {})) {
  for (const [from, to] of Object.entries(overrides)) {
    flowChecked++;
    if (!allNodeIds.has(to)) {
      error(`flow.byRoute.${route}["${from}"] -> "${to}" — target not in nodes or routers`);
    }
  }
}
info(`${flowChecked} flow targets checked`);

console.log('\n[2] Router targets');
let routerChecked = 0;
for (const [routerId, router] of Object.entries(routers)) {
  if (router.fallback && !allNodeIds.has(router.fallback)) {
    error(`router "${routerId}" fallback -> "${router.fallback}" — target not found`);
  }
  for (const rule of (router.rules || [])) {
    routerChecked++;
    if (rule.target && !allNodeIds.has(rule.target)) {
      error(`router "${routerId}" rule target -> "${rule.target}" — target not found`);
    }
  }
}
info(`${routerChecked} router rules checked`);

console.log('\n[3] Choice transition targets');
let choiceChecked = 0;
for (const [nodeId, node] of Object.entries(nodes)) {
  for (const choice of (node.choices || [])) {
    choiceChecked++;
    if (choice.transition && choice.transition.type === 'goto') {
      if (!allNodeIds.has(choice.transition.target)) {
        error(`${nodeId} choice "${choice.label?.slice(0,20)}" goto "${choice.transition.target}" — target not found`);
      }
    }
  }
}
info(`${choiceChecked} choice transitions checked`);

// ── 2. Reachability ──────────────────────────────────────

console.log('\n[4] Reachability from p1');
const reachable = new Set();
function walkReachable(nodeId, visited) {
  if (visited.has(nodeId)) return;
  visited.add(nodeId);
  reachable.add(nodeId);

  // FN chain
  for (const [route, overrides] of Object.entries(flow.byRoute || {})) {
    if (overrides[nodeId]) walkReachable(overrides[nodeId], visited);
  }
  if (flow.default[nodeId]) walkReachable(flow.default[nodeId], visited);

  // Router targets
  if (routers[nodeId]) {
    const r = routers[nodeId];
    if (r.fallback) walkReachable(r.fallback, visited);
    for (const rule of (r.rules || [])) {
      if (rule.target) walkReachable(rule.target, visited);
    }
  }

  // Choice goto targets
  const node = nodes[nodeId];
  if (node) {
    for (const choice of (node.choices || [])) {
      if (choice.transition && choice.transition.type === 'goto' && choice.transition.target) {
        walkReachable(choice.transition.target, visited);
      }
    }
  }
}
walkReachable('p1', new Set());

const unreachableNodes = [];
for (const nodeId of Object.keys(nodes)) {
  if (!reachable.has(nodeId)) unreachableNodes.push(nodeId);
}
if (unreachableNodes.length > 0) {
  warn(`${unreachableNodes.length} unreachable nodes (not reachable from p1): ${unreachableNodes.slice(0, 10).join(', ')}${unreachableNodes.length > 10 ? '...' : ''}`);
} else {
  info(`All ${Object.keys(nodes).length} nodes reachable from p1`);
}

// ── 3. Dead-end detection ────────────────────────────────

console.log('\n[5] Dead-end detection');
let deadEnds = 0;
for (const [nodeId, node] of Object.entries(nodes)) {
  const hasChoiceTransition = (node.choices || []).some(c => c.transition);
  const hasFN = !!flow.default[nodeId] || Object.values(flow.byRoute || {}).some(r => r[nodeId]);
  const isEnding = (node.choices || []).some(c => c.transition && c.transition.type === 'ending');
  const isEgg = (node.choices || []).some(c => c.transition && c.transition.type === 'egg');

  if (!hasChoiceTransition && !hasFN && !isEnding && !isEgg) {
    // Check if it's a terminal ending node (end_*_2)
    if (!nodeId.match(/^end_\w+_2$/) && nodeId !== 'c8c2') {
      warn(`Node "${nodeId}" appears to be a dead end (no transition, no FN successor)`);
      deadEnds++;
    }
  }
}
if (deadEnds === 0) info('No dead ends detected');

// ── 4. Variable consistency ──────────────────────────────

console.log('\n[6] Variable consistency in effects');
let effectChecked = 0, legacyUsages = 0;
for (const [nodeId, node] of Object.entries(nodes)) {
  for (const choice of (node.choices || [])) {
    for (const eff of (choice.effects || [])) {
      effectChecked++;
      if (!allVarNames.has(eff.var)) {
        error(`${nodeId} choice "${choice.id}" effect var "${eff.var}" — not defined in variables.json`);
      }
      if (legacyToCanonical[eff.var]) {
        legacyUsages++;
      }
    }
  }
}
info(`${effectChecked} effects checked`);
if (legacyUsages > 0) {
  warn(`${legacyUsages} effects use legacy variable names (will work via alias but should be updated)`);
}

// ── 5. Condition variable references ─────────────────────

console.log('\n[7] Condition variable references');
function extractVarsFromCondition(cond) {
  if (!cond || cond === 'true' || cond === 'false') return [];
  // Strip string literals (both single and double quoted) before extracting identifiers
  const stripped = cond.replace(/'[^']*'/g, '').replace(/"[^"]*"/g, '');
  const tokens = stripped.match(/[a-zA-Z_]\w*/g) || [];
  const keywords = new Set(['true', 'false', 'null', 'undefined']);
  return tokens.filter(t => !keywords.has(t));
}

let condChecked = 0;
// Router conditions
for (const [routerId, router] of Object.entries(routers)) {
  for (const rule of (router.rules || [])) {
    if (rule.condition) {
      condChecked++;
      for (const v of extractVarsFromCondition(rule.condition)) {
        if (!allVarNames.has(v)) {
          error(`router "${routerId}" condition references unknown var "${v}": ${rule.condition}`);
        }
      }
    }
  }
}
// Ending conditions
for (const j of (endings.judgement || [])) {
  if (j.condition) {
    condChecked++;
    for (const v of extractVarsFromCondition(j.condition)) {
      if (!allVarNames.has(v)) {
        error(`ending "${j.tier}" condition references unknown var "${v}": ${j.condition}`);
      }
    }
  }
}
// Choice conditions
for (const [nodeId, node] of Object.entries(nodes)) {
  for (const choice of (node.choices || [])) {
    if (choice.condition) {
      condChecked++;
      for (const v of extractVarsFromCondition(choice.condition)) {
        if (!allVarNames.has(v)) {
          error(`${nodeId} choice "${choice.id}" condition references unknown var "${v}"`);
        }
      }
    }
  }
}
info(`${condChecked} conditions checked`);

// ── 6. Content checks ────────────────────────────────────

console.log('\n[8] Content checks — {{nagiCall}} context validation');
let hardcodedAnt = 0, nagiCallOk = 0, nagiCallBad = 0;

const ALLOWED_NAGICALL_SPEAKERS = new Set(['{{playerName}}']);

function checkNagiCall(nodeId, lineId, text, speaker, context) {
  if (!text || !text.includes('{{nagiCall}}')) return;
  if (context === 'choice-label') {
    nagiCallOk++;
    return;
  }
  if (ALLOWED_NAGICALL_SPEAKERS.has(speaker)) {
    nagiCallOk++;
    return;
  }
  nagiCallBad++;
  const speakerLabel = speaker || '(旁白)';
  error(`${nodeId}/${lineId}: {{nagiCall}} in ${speakerLabel}'s line — only allowed in player dialogue. Text: "${text.substring(0, 60)}"`);
}

function checkHardcodedAnt(nodeId, lineId, text) {
  if (!text) return;
  if (/\bAnt\b/.test(text) && !text.includes('{{playerName}}')) {
    hardcodedAnt++;
  }
}

for (const [nodeId, node] of Object.entries(nodes)) {
  for (const line of (node.dialogue || [])) {
    checkNagiCall(nodeId, line.id, line.text, line.speaker, 'dialogue');
    checkHardcodedAnt(nodeId, line.id, line.text);
  }
  for (const choice of (node.choices || [])) {
    checkNagiCall(nodeId, choice.id, choice.label, null, 'choice-label');
    checkHardcodedAnt(nodeId, choice.id, choice.label);
    for (const r of (choice.responses || [])) {
      checkNagiCall(nodeId, r.id, r.text, r.speaker, 'response');
      checkHardcodedAnt(nodeId, r.id, r.text);
    }
  }
}
if (nagiCallBad === 0) {
  info(`All ${nagiCallOk} {{nagiCall}} usages are in valid context (player dialogue / choice labels)`);
} else {
  info(`{{nagiCall}}: ${nagiCallOk} valid, ${nagiCallBad} invalid`);
}
if (hardcodedAnt > 0) {
  warn(`${hardcodedAnt} texts contain hardcoded "Ant" — may need {{playerName}} substitution`);
}

// ── 7. Dialogue ID uniqueness ────────────────────────────

console.log('\n[9] Dialogue ID uniqueness');
let dupeIds = 0;
for (const [nodeId, node] of Object.entries(nodes)) {
  const ids = new Set();
  for (const line of (node.dialogue || [])) {
    if (ids.has(line.id)) { error(`${nodeId}: duplicate dialogue id "${line.id}"`); dupeIds++; }
    ids.add(line.id);
  }
  for (const choice of (node.choices || [])) {
    if (ids.has(choice.id)) { error(`${nodeId}: duplicate choice id "${choice.id}"`); dupeIds++; }
    ids.add(choice.id);
    for (const r of (choice.responses || [])) {
      if (ids.has(r.id)) { error(`${nodeId}: duplicate response id "${r.id}"`); dupeIds++; }
      ids.add(r.id);
    }
  }
}
if (dupeIds === 0) info('All dialogue/choice/response IDs unique within nodes');

// ── 8. Chapter section startNode validation ──────────────

console.log('\n[10] Chapter section startNode validation');
let secChecked = 0;
for (const ch of chapters) {
  for (const sec of (ch.sections || [])) {
    secChecked++;
    if (!allNodeIds.has(sec.startNode)) {
      error(`Chapter "${ch.name}" section "${sec.title}" startNode "${sec.startNode}" — not found`);
    }
  }
}
info(`${secChecked} chapter sections checked`);

// ── 9. Ending judgement node validation ──────────────────

console.log('\n[11] Ending judgement nodes');
for (const j of (endings.judgement || [])) {
  if (j.node && !allNodeIds.has(j.node)) {
    error(`Ending "${j.tier}" node "${j.node}" — not found`);
  }
}
info('Ending judgement nodes checked');

// ── 10. Asset references (bg) ────────────────────────────

console.log('\n[12] Background asset references (scene_visuals.json)');
let bgChecked = 0, bgMissing = 0;
if (sceneVisuals) {
  const checkedBgs = new Set();
  for (const [nodeId, vis] of Object.entries(sceneVisuals)) {
    if (vis.bg && !checkedBgs.has(vis.bg)) {
      checkedBgs.add(vis.bg);
      bgChecked++;
      const bgPath = path.join(__dirname, '..', vis.bg);
      if (!fs.existsSync(bgPath)) {
        warn(`${nodeId} bg "${vis.bg}" — file not found`);
        bgMissing++;
      }
    }
  }
}
info(`${bgChecked} unique bg paths checked, ${bgMissing} missing`);

// ── 13. Four-ending path reachability ───────────────────

console.log('\n[13] Ending path reachability');
const endingNodes = ['end_true', 'end_good', 'end_normal', 'end_bad'];
for (const en of endingNodes) {
  if (!nodes[en]) {
    error(`Ending node "${en}" missing from nodes.json`);
  } else if (!reachable.has(en)) {
    error(`Ending node "${en}" not reachable from p1`);
  } else {
    info(`${en} — reachable ✓`);
  }
}

// ── 14. Ending title consistency ────────────────────────

console.log('\n[14] Ending title consistency (endings.json ↔ nodes.json)');
if (endings.definitions) {
  for (const [tier, def] of Object.entries(endings.definitions)) {
    const en = def.endingNode;
    if (en && nodes[en]) {
      if (nodes[en].sceneTitle !== def.title) {
        warn(`${tier}: endings.json title "${def.title}" ≠ nodes.json sceneTitle "${nodes[en].sceneTitle}"`);
      } else {
        info(`${tier}: "${def.title}" — consistent`);
      }
    }
  }
}

// ── 15. Sub-node FN chain integrity ─────────────────────

console.log('\n[15] Sub-node FN chain integrity');
let subNodeOk = 0, subNodeBroken = 0;
for (const nodeId of Object.keys(nodes)) {
  if (/_s\d+$/.test(nodeId)) {
    const hasFN = !!flow.default[nodeId] || Object.values(flow.byRoute || {}).some(r => r[nodeId]);
    const hasChoiceGoto = (nodes[nodeId].choices || []).some(c => c.transition && c.transition.type === 'goto');
    const hasEndingTransition = (nodes[nodeId].choices || []).some(c => c.transition && c.transition.type === 'ending');
    if (hasFN || hasChoiceGoto || hasEndingTransition) {
      subNodeOk++;
    } else {
      subNodeBroken++;
      error(`Sub-node "${nodeId}" has no FN successor or choice transition — broken chain`);
    }
  }
}
info(`${subNodeOk} sub-nodes have valid successors${subNodeBroken > 0 ? `, ${subNodeBroken} broken` : ''}`);

// ── Summary ──────────────────────────────────────────────

console.log('\n' + '='.repeat(50));
if (errors === 0) {
  console.log(`✅ PASSED — 0 errors, ${warnings} warnings`);
} else {
  console.log(`❌ FAILED — ${errors} errors, ${warnings} warnings`);
}
process.exit(errors > 0 ? 1 : 0);
