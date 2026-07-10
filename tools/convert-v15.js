#!/usr/bin/env node
/**
 * convert-v15.js — V15 SCRIPT Markdown → story-data/nodes.json
 *
 * PM P0 fixes:
 * 1. Multi-choice nodes split into sub-nodes (p2→p2, p2_s2, p2_s3)
 * 2. Router-only nodes (m_igate, route_mj_hidden, route_love_hidden) excluded
 * 3. Speaker = "Nagi" not "凪"
 * 4. display = "bottom" for narration
 * 5. Node-level effects → auto-advance choices
 * 6. Placeholder fields: bg, bgm, cg, autoSave, uiTheme
 */

const fs = require('fs');
const path = require('path');

const SCRIPT = path.join(__dirname, '..', 'design', 'Nagis_Heart_SCRIPT_V15_Calibrated.md');
const OUT = path.join(__dirname, '..', 'story-data', 'nodes.json');

const raw = fs.readFileSync(SCRIPT, 'utf-8');
const lines = raw.split('\n');

// Router-only nodes: exclude from nodes.json (they live in routers.json)
const ROUTER_ONLY = new Set(['m_igate', 'route_mj_hidden', 'route_love_hidden']);

const KNOWN_SPEAKERS = new Set([
  'Nagi', '{{playerName}}', 'JFA会长', '帝襟杏里', '绘心',
  'Reo', '玲王', '一一', '主持人', '团队', '记者', '凪', 'Ant'
]);

// PM fix #4: speaker = "Nagi" not "凪"
const SPEAKER_DISPLAY = {
  'Nagi': 'Nagi', '凪': 'Nagi',
  '{{playerName}}': '{{playerName}}', 'Ant': '{{playerName}}',
  'JFA会长': 'JFA会长', '帝襟杏里': '帝襟杏里', '绘心': '绘心',
  'Reo': '玲王', '玲王': '玲王', '一一': '一一',
  '主持人': '主持人', '团队': '团队', '记者': '记者'
};

const VAR_ALIASES = {
  'b': 'bond', 'B': 'bond',
  'i': 'understanding', 'I': 'understanding', 'u': 'understanding',
  'd': 'distance', 'D': 'distance',
  'EGO': 'ego', 'CONTROL': 'control', 'line': 'mj'
};

function resolveVar(name) { return VAR_ALIASES[name] || name; }

function isSpeakerLine(line) {
  const m = line.match(/^([^:：\[\]（]+)[：:]\s*(.+)/);
  if (!m) return null;
  const speaker = m[1].trim();
  if (KNOWN_SPEAKERS.has(speaker) || Object.values(SPEAKER_DISPLAY).includes(speaker)) {
    return { speaker, text: m[2].trim() };
  }
  return null;
}

function parseEffectLine(effectStr) {
  const effects = [];
  let transition = null;

  const transMatch = effectStr.match(/→\s*(.+)/);
  let varPart = effectStr;
  if (transMatch) {
    const transStr = transMatch[1].trim();
    varPart = effectStr.substring(0, transMatch.index).trim();
    if (transStr.startsWith('跳转 ')) {
      transition = { type: 'goto', target: transStr.replace('跳转 ', '').trim() };
    } else if (transStr.includes('跳转') && !transStr.includes('本节')) {
      const parts = transStr.split(/[；;]/);
      const targets = [];
      for (const p of parts) {
        const m = p.match(/跳转\s*(\S+)/);
        if (m) targets.push(m[1]);
      }
      if (targets.length === 1) transition = { type: 'goto', target: targets[0] };
    }
  }

  varPart = varPart.replace(/设置\s*/g, '');
  const tokens = varPart.split(/[\s;；]+/).filter(t => t && t !== '→');

  for (const token of tokens) {
    if (/不增加|不变|未完全|阻止|仅可|风险|可修复|高时|TRUE|GOOD|降线/.test(token)) continue;

    const setMatch = token.match(/^(\w+)=(.+)$/);
    if (setMatch) {
      const varName = resolveVar(setMatch[1]);
      let val = setMatch[2];
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (!isNaN(Number(val))) val = Number(val);
      else val = val.replace(/^["']|["']$/g, '');
      effects.push({ var: varName, op: 'set', val });
      continue;
    }

    const addMatch = token.match(/^(\w+)([+-])(\d+)$/);
    if (addMatch) {
      effects.push({
        var: resolveVar(addMatch[1]),
        op: 'add',
        val: parseInt(addMatch[3]) * (addMatch[2] === '+' ? 1 : -1)
      });
    }
  }
  return { effects, transition };
}

function parseChoiceHeader(line) {
  const tagMatch = line.match(/^选项[A-Z①②③④⑤\d]+\s+(\S+)\s*\|\s*(.+)$/);
  if (tagMatch) return { internalTag: tagMatch[1], label: tagMatch[2].trim() };
  const simpleMatch = line.match(/^选项[A-Z①②③④⑤\d]+\s*\|\s*(.+)$/);
  if (simpleMatch) return { internalTag: '', label: simpleMatch[1].trim() };
  return { internalTag: '', label: line };
}

// ═══ Phase 1: Collect raw lines per node ═══

const rawNodes = {}; // nodeId → { title, lines[] }
let curId = null;
for (const line of lines) {
  const t = line.trim();
  const m = t.match(/^#{3,4}\s*---\s*(\S+)\s*\|\s*(.+?)\s*---/);
  if (m) {
    curId = m[1];
    rawNodes[curId] = { title: m[2].replace(/【.*?】/g, '').trim(), lines: [] };
    continue;
  }
  if (curId) rawNodes[curId].lines.push(line);
}

// ═══ Phase 2: Parse each node into ordered segments ═══
// Segment types: { type:'dialogue', lines:[] }, { type:'choices', options:[] }, { type:'autoEffect', effects:[], transition:{} }

function parseNodeSegments(nodeId, rawLines) {
  const segments = [];
  let curDialogue = [];
  let curOptions = [];
  let curOption = null; // { label, internalTag, responses:[], effects:[], transition:null }
  let curResponses = [];
  let inOption = false;

  function pushDialogue() {
    if (curDialogue.length > 0) {
      segments.push({ type: 'dialogue', lines: [...curDialogue] });
      curDialogue = [];
    }
  }

  function finishOption() {
    if (curOption) {
      curOption.responses = curResponses;
      curOptions.push(curOption);
      curOption = null;
      curResponses = [];
      inOption = false;
    }
  }

  function finishChoiceGroup() {
    finishOption();
    if (curOptions.length > 0) {
      segments.push({ type: 'choices', options: [...curOptions] });
      curOptions = [];
    }
  }

  for (let i = 0; i < rawLines.length; i++) {
    const t = rawLines[i].trim();
    if (t === '' || t === '---') continue;
    if (t.startsWith('>') || t.startsWith('```') || t.startsWith('# ') || t.startsWith('## ') || t.startsWith('### ') || t.startsWith('#### ')) continue;

    // [选择] marker
    if (t === '[选择]') {
      finishChoiceGroup();
      pushDialogue();
      continue;
    }

    // Option header
    const optMatch = t.match(/^选项[A-Z①②③④⑤\d]/);
    if (optMatch) {
      // If we're not currently in a choice group, start one
      if (!inOption && curOptions.length === 0) {
        pushDialogue();
      }
      finishOption();
      const parsed = parseChoiceHeader(t);
      curOption = { label: parsed.label, internalTag: parsed.internalTag || undefined, responses: [], effects: [], transition: null };
      if (!curOption.internalTag) delete curOption.internalTag;
      curResponses = [];
      inOption = true;
      continue;
    }

    // Effect lines
    const effectMatch = t.match(/^(?:效果|\[效果\])[：:]\s*(.+)/);
    const effectBlock = t === '[效果]';

    if (effectMatch) {
      const parsed = parseEffectLine(effectMatch[1]);
      if (inOption && curOption) {
        curOption.effects = parsed.effects;
        curOption.transition = parsed.transition;
        finishOption();
        // Peek: if next content is another option, stay in choice mode
        let nextIsOption = false;
        for (let j = i + 1; j < rawLines.length; j++) {
          const peek = rawLines[j].trim();
          if (peek === '' || peek === '---') continue;
          if (peek.match(/^选项[A-Z①②③④⑤\d]/)) nextIsOption = true;
          break;
        }
        if (!nextIsOption) finishChoiceGroup();
      } else {
        // Node-level auto-advance effect
        finishChoiceGroup();
        pushDialogue();
        segments.push({ type: 'autoEffect', effects: parsed.effects, transition: parsed.transition });
      }
      continue;
    }

    if (effectBlock) {
      const nextLine = rawLines[i + 1]?.trim();
      if (nextLine) {
        const parsed = parseEffectLine(nextLine);
        if (inOption && curOption) {
          curOption.effects = parsed.effects;
          curOption.transition = parsed.transition;
          finishOption();
          let nextIsOption = false;
          for (let j = i + 2; j < rawLines.length; j++) {
            const peek = rawLines[j].trim();
            if (peek === '' || peek === '---') continue;
            if (peek.match(/^选项[A-Z①②③④⑤\d]/)) nextIsOption = true;
            break;
          }
          if (!nextIsOption) finishChoiceGroup();
        } else {
          finishChoiceGroup();
          pushDialogue();
          segments.push({ type: 'autoEffect', effects: parsed.effects, transition: parsed.transition });
        }
        i++;
      }
      continue;
    }

    // Dialogue/narration content
    if (t.startsWith('[旁白]')) {
      const text = t.replace(/^\[旁白\]\s*/, '');
      if (!text) continue;
      const entry = { speaker: '', text, display: 'bottom' };
      if (inOption) curResponses.push(entry);
      else curDialogue.push(entry);
      continue;
    }

    const speakerMatch = isSpeakerLine(t);
    if (speakerMatch) {
      const displayName = SPEAKER_DISPLAY[speakerMatch.speaker] || speakerMatch.speaker;
      const entry = { speaker: displayName, text: speakerMatch.text };
      if (inOption) curResponses.push(entry);
      else curDialogue.push(entry);
      continue;
    }
  }

  finishChoiceGroup();
  pushDialogue();

  return segments;
}

// ═══ Phase 3: Build nodes from segments, split multi-choice ═══

const outputNodes = {};
const flowPatches = []; // { from, to } entries to add to flow.json
const flowRemoves = []; // nodeIds whose flow entry should move to last sub-node

function buildNode(nodeId, title, dialogueLines, choices, autoEffect) {
  let dCounter = 0;
  let cCounter = 0;

  const dialogue = dialogueLines.map(d => {
    dCounter++;
    const entry = {
      id: `${nodeId}_d${String(dCounter).padStart(3, '0')}`,
      speaker: d.speaker,
      text: d.text
    };
    if (d.display) entry.display = d.display;
    return entry;
  });

  const builtChoices = [];
  if (choices && choices.length > 0) {
    for (const opt of choices) {
      cCounter++;
      const choiceId = `${nodeId}_c${String(cCounter).padStart(3, '0')}`;
      let rCounter = 0;
      const responses = (opt.responses || []).map(r => {
        rCounter++;
        const entry = {
          id: `${choiceId}_r${String(rCounter).padStart(3, '0')}`,
          speaker: r.speaker,
          text: r.text
        };
        if (r.display) entry.display = r.display;
        return entry;
      });

      const choice = { id: choiceId, label: opt.label };
      if (opt.internalTag) choice.internalTag = opt.internalTag;
      if (opt.effects && opt.effects.length > 0) choice.effects = opt.effects;
      if (opt.transition) choice.transition = opt.transition;
      if (responses.length > 0) choice.responses = responses;
      builtChoices.push(choice);
    }
  }

  // Auto-advance effect → single continue choice
  if (autoEffect) {
    cCounter++;
    const choiceId = `${nodeId}_c${String(cCounter).padStart(3, '0')}`;
    const choice = { id: choiceId, label: '→', autoAdvance: true };
    if (autoEffect.effects && autoEffect.effects.length > 0) choice.effects = autoEffect.effects;
    if (autoEffect.transition) choice.transition = autoEffect.transition;
    builtChoices.push(choice);
  }

  return {
    mode: 'vn',
    sceneTitle: title,
    dialogue,
    choices: builtChoices,
    bg: null,
    bgm: null,
    cg: null,
    autoSave: false,
    uiTheme: 'default'
  };
}

for (const [nodeId, rawNode] of Object.entries(rawNodes)) {
  // PM fix #2: skip router-only nodes
  if (ROUTER_ONLY.has(nodeId)) continue;

  const segments = parseNodeSegments(nodeId, rawNode.lines);

  // Count choice groups
  const choiceSegments = segments.filter(s => s.type === 'choices');
  const hasMultiChoice = choiceSegments.length > 1;

  if (!hasMultiChoice) {
    // Single or zero choice blocks — build as single node
    const allDialogue = segments.filter(s => s.type === 'dialogue').flatMap(s => s.lines);
    const choices = choiceSegments[0]?.options || [];
    const autoEffect = segments.find(s => s.type === 'autoEffect');
    outputNodes[nodeId] = buildNode(nodeId, rawNode.title, allDialogue, choices, autoEffect);
  } else {
    // Multi-choice: split into sub-nodes
    // Group segments into chunks: each chunk = (dialogue* + choices|autoEffect)
    const chunks = [];
    let curChunk = { dialogue: [], choices: null, autoEffect: null };

    for (const seg of segments) {
      if (seg.type === 'dialogue') {
        if (curChunk.choices || curChunk.autoEffect) {
          // Previous chunk complete, start new
          chunks.push(curChunk);
          curChunk = { dialogue: [...seg.lines], choices: null, autoEffect: null };
        } else {
          curChunk.dialogue.push(...seg.lines);
        }
      } else if (seg.type === 'choices') {
        curChunk.choices = seg.options;
      } else if (seg.type === 'autoEffect') {
        curChunk.autoEffect = seg;
      }
    }
    chunks.push(curChunk);

    // Remove empty trailing chunks
    while (chunks.length > 0 && chunks[chunks.length - 1].dialogue.length === 0 && !chunks[chunks.length - 1].choices && !chunks[chunks.length - 1].autoEffect) {
      chunks.pop();
    }

    // Build sub-nodes
    const subNodeIds = [];
    for (let ci = 0; ci < chunks.length; ci++) {
      const subId = ci === 0 ? nodeId : `${nodeId}_s${ci + 1}`;
      subNodeIds.push(subId);
    }

    for (let ci = 0; ci < chunks.length; ci++) {
      const chunk = chunks[ci];
      const subId = subNodeIds[ci];
      const nextSubId = ci < chunks.length - 1 ? subNodeIds[ci + 1] : null;

      // For choices without explicit transitions in non-last chunks,
      // add transition to next sub-node
      if (chunk.choices && nextSubId) {
        for (const opt of chunk.choices) {
          if (!opt.transition) {
            opt.transition = { type: 'goto', target: nextSubId };
          }
        }
      }

      const node = buildNode(subId, rawNode.title, chunk.dialogue, chunk.choices, chunk.autoEffect);
      outputNodes[subId] = node;
    }

    // Flow patch: last sub-node inherits parent's FN chain position
    if (subNodeIds.length > 1) {
      const lastSubId = subNodeIds[subNodeIds.length - 1];
      flowPatches.push({ originalNode: nodeId, lastSubNode: lastSubId });
    }
  }
}

// ═══ Phase 4: Clean up and output ═══

for (const node of Object.values(outputNodes)) {
  if (node.choices.length === 0) delete node.choices;
  for (const c of (node.choices || [])) {
    if (c.effects && c.effects.length === 0) delete c.effects;
    if (c.responses && c.responses.length === 0) delete c.responses;
  }
}

// Stats
let totalD = 0, totalC = 0, totalR = 0, speakerD = 0, narrD = 0;
for (const node of Object.values(outputNodes)) {
  totalD += (node.dialogue || []).length;
  for (const d of (node.dialogue || [])) {
    if (d.speaker) speakerD++; else narrD++;
  }
  totalC += (node.choices || []).length;
  for (const c of (node.choices || [])) {
    totalR += (c.responses || []).length;
  }
}

const json = JSON.stringify(outputNodes, null, 2);
fs.writeFileSync(OUT, json, 'utf-8');

console.log(`✅ Converted ${Object.keys(outputNodes).length} nodes (${Object.keys(rawNodes).length} raw, ${Object.keys(rawNodes).length - Object.keys(outputNodes).length + (Object.keys(outputNodes).length - Object.keys(rawNodes).length)} split sub-nodes)`);
console.log(`   ${totalD} dialogue lines (${speakerD} speaker, ${narrD} narration)`);
console.log(`   ${totalC} choices`);
console.log(`   ${totalR} choice responses`);
console.log(`   Output: ${OUT} (${(Buffer.byteLength(json) / 1024).toFixed(0)} KB)`);

if (flowPatches.length > 0) {
  console.log('\n⚠️  Flow patches needed (update flow.json):');
  for (const p of flowPatches) {
    console.log(`   ${p.originalNode} → move FN entry to ${p.lastSubNode}`);
  }
}
