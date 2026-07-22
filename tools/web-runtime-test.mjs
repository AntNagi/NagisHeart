#!/usr/bin/env node
// Headless runtime test that loads the REAL web runtime (GameController + StoryEngine)
// and drives it like a player: (1) SKIP section-by-section to an ending, and
// (2) the 4 golden choice paths to verify each ending tier is reachable.
//
// Browser globals used by the runtime are shimmed in-memory: localStorage,
// indexedDB, CustomEvent. No DOM is required (controller/engine are pure logic).

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, '..', 'story-data');

// ── Browser shims ───────────────────────────────────────────────────────────
const _ls = new Map();
globalThis.localStorage = {
  getItem: (k) => (_ls.has(k) ? _ls.get(k) : null),
  setItem: (k, v) => _ls.set(k, String(v)),
  removeItem: (k) => _ls.delete(k),
  clear: () => _ls.clear(),
};

if (typeof globalThis.CustomEvent === 'undefined') {
  globalThis.CustomEvent = class extends Event {
    constructor(type, opts = {}) { super(type); this.detail = opts.detail; }
  };
}

class FakeRequest {
  constructor() { this.onsuccess = null; this.onerror = null; this.onupgradeneeded = null; this.result = undefined; }
  _succeed(result) { this.result = result; queueMicrotask(() => this.onsuccess && this.onsuccess({ target: this })); }
}
const _dbs = {};
class FakeTx {
  constructor(db) { this._db = db; this.oncomplete = null; this.onerror = null; }
  objectStore(name) {
    const store = this._db._stores[name];
    const tx = this;
    return {
      put(val) { store.data.set(val[store.keyPath], val); tx._complete(); return new FakeRequest(); },
      get(key) { const r = new FakeRequest(); r._succeed(store.data.get(key)); return r; },
      getAll() { const r = new FakeRequest(); r._succeed([...store.data.values()]); return r; },
      delete(key) { store.data.delete(key); tx._complete(); return new FakeRequest(); },
    };
  }
  _complete() { queueMicrotask(() => this.oncomplete && this.oncomplete()); }
}
globalThis.indexedDB = {
  open(name) {
    const req = new FakeRequest();
    queueMicrotask(() => {
      let db = _dbs[name];
      const isNew = !db;
      if (isNew) {
        db = {
          name, _stores: {}, objectStoreNames: [],
          createObjectStore(n, opts) { this._stores[n] = { keyPath: opts.keyPath, data: new Map() }; this.objectStoreNames.push(n); return this._stores[n]; },
          transaction() { return new FakeTx(this); },
        };
        _dbs[name] = db;
      }
      req.result = db;
      if (isNew && req.onupgradeneeded) req.onupgradeneeded({ target: req });
      if (req.onsuccess) req.onsuccess({ target: req });
    });
    return req;
  },
};

// ── Load story data (mirrors DataLoader.loadAll output) ──────────────────────
const readJson = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf-8'));
const storyData = {
  nodes: readJson('nodes.json'),
  flow: readJson('flow.json'),
  routers: readJson('routers.json'),
  sceneVisuals: readJson('scene_visuals.json'),
  endings: readJson('endings.json'),
  variables: readJson('variables.json'),
  chapters: readJson('chapters.json'),
  prologueShort: readJson('prologue_short.json'),
};

const { GameController, GamePhase } = await import('../web/src/controller/GameController.js');

const tick = () => new Promise((r) => setTimeout(r, 0));

const TRANSITION_PHASES = new Set([
  GamePhase.ChapterEnding, GamePhase.ChapterTransition,
  GamePhase.SectionEnding, GamePhase.SectionTransition,
]);

// ── Golden choice paths (from tools/golden-playthrough.js) ───────────────────
const PATHS = {
  TRUE: { 'dream_exist': 0 },
  GOOD: { 'dream_exist': 1 },
  NORMAL: { 'p8_route': 1 },
  BAD: {
    'p2': 1, 'p2_s2': 1, 'c1a': 1, 'c1b': 1, 'c1b_s2': 1, 'c1b_s3': 1,
    'u20j': 1, 'c3': 1, 'e_lolly': 1, 'wc_offer': 1, 'c4a': 1,
    'club_media': 1, 'e_agency_launch': 2, 'e_scarf': 1, 'e_sick_fragile': 1, 'p8_route': 2,
  },
};

function newController() {
  _ls.clear();
  for (const k of Object.keys(_dbs)) delete _dbs[k];
  return new GameController(storyData);
}

// Drive with onTap for dialogue + choices from map. Returns result summary.
function drivePlaythrough(controller, choiceMap) {
  let guard = 0;
  const maxErrors = [];
  while (guard++ < 5000) {
    const s = controller.state;
    if (s.phase === GamePhase.Ending) {
      return { ok: true, ending: s.ending, errorMessage: s.errorMessage, steps: guard };
    }
    if (s.phase === GamePhase.Error) {
      return { ok: false, error: s.errorMessage, steps: guard };
    }
    if (s.phase === GamePhase.Choice) {
      const id = s.currentNodeId;
      const idx = Object.prototype.hasOwnProperty.call(choiceMap, id) ? choiceMap[id] : 0;
      controller.onChoiceSelected(Math.min(idx, s.choices.length - 1));
    } else if (s.phase === GamePhase.Dialogue || s.phase === GamePhase.Response) {
      controller.onTap();
    } else if (TRANSITION_PHASES.has(s.phase)) {
      controller.onTap();
    } else {
      return { ok: false, error: `unexpected phase: ${s.phase}`, steps: guard };
    }
  }
  return { ok: false, error: 'guard limit reached (possible infinite loop)', steps: guard };
}

// Drive using SKIP (skipToSectionClear) aggressively; pick choices when forced.
function driveSkip(controller, choiceMap) {
  let guard = 0;
  while (guard++ < 5000) {
    const s = controller.state;
    if (s.phase === GamePhase.Ending) {
      return { ok: true, ending: s.ending, errorMessage: s.errorMessage, steps: guard };
    }
    if (s.phase === GamePhase.Error) {
      return { ok: false, error: s.errorMessage, steps: guard };
    }
    if (s.phase === GamePhase.Choice) {
      const id = s.currentNodeId;
      const idx = Object.prototype.hasOwnProperty.call(choiceMap, id) ? choiceMap[id] : 0;
      controller.onChoiceSelected(Math.min(idx, s.choices.length - 1));
    } else if (s.phase === GamePhase.Dialogue || s.phase === GamePhase.Response) {
      controller.skipToSectionClear();
    } else if (TRANSITION_PHASES.has(s.phase)) {
      controller.onTap();
    } else {
      return { ok: false, error: `unexpected phase: ${s.phase}`, steps: guard };
    }
  }
  return { ok: false, error: 'guard limit reached (possible infinite loop)', steps: guard };
}

// ── Run ──────────────────────────────────────────────────────────────────────
const results = [];
function log(line) { console.log(line); }

log('══════════════════════════════════════════════════════════');
log(' NagisHeart Web Runtime Test — real GameController/StoryEngine');
log('══════════════════════════════════════════════════════════\n');

// TEST 1: SKIP section-by-section reaches a REAL ending without error/loop
{
  const c = newController();
  c.startNewGame('Ant');
  const r = driveSkip(c, {});
  await tick(); await tick();
  const autosave = await c.hasAutoSave();
  const hasRealEnding = r.ok && r.ending && r.ending.title;
  const pass = hasRealEnding && autosave === false;
  results.push(pass);
  log(`[TEST 1] SKIP (section-skip) → ending`);
  log(`  result: ${r.ok ? 'reached ending "' + (r.ending ? r.ending.title : r.errorMessage) + '"' : 'FAIL ' + r.error}`);
  log(`  steps: ${r.steps}, endingIsReal: ${!!hasRealEnding}, autosaveAfterEnding: ${autosave}`);
  log(`  ${pass ? '✅ PASS' : '❌ FAIL'}\n`);
}

// TEST 2: 4 golden paths reach the correct ending (match by endingNode)
const EXPECT = { TRUE: 'end_true', GOOD: 'end_good', NORMAL: 'end_normal', BAD: 'end_bad' };
for (const [name, map] of Object.entries(PATHS)) {
  const c = newController();
  c.startNewGame('Ant');
  const r = drivePlaythrough(c, map);
  await tick(); await tick();
  const autosave = await c.hasAutoSave();
  const node = r.ending ? r.ending.endingNode : null;
  const expected = EXPECT[name];
  const pass = r.ok && node === expected && autosave === false;
  results.push(pass);
  log(`[TEST 2:${name}] golden path → ${expected}`);
  log(`  result: ${r.ok ? 'endingNode=' + node + ' title="' + (r.ending ? r.ending.title : '') + '"' : 'FAIL ' + r.error}`);
  log(`  steps: ${r.steps}, autosaveAfterEnding: ${autosave}`);
  log(`  ${pass ? '✅ PASS' : '❌ FAIL' + (node !== expected ? ` (expected ${expected}, got ${node})` : '')}\n`);
}

const passCount = results.filter(Boolean).length;
log('══════════════════════════════════════════════════════════');
log(` SUMMARY: ${passCount}/${results.length} passed`);
log('══════════════════════════════════════════════════════════');
process.exit(passCount === results.length ? 0 : 1);
