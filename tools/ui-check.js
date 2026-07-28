/**
 * ui-check.js — UI 体检（机械对账，非品味判断）
 *
 * 用法：node tools/ui-check.js            跑全部
 *       node tools/ui-check.js S1-dim     只跑 id 含 "S1-dim" 的断言
 *
 * 它做什么：按 tools/ui-checks.json 把 Web 驱动到各个状态，读运行时 computed style /
 * DOM 事实，逐条与权威规定的值比对，输出通过/不通过清单。
 *
 * 它不做什么：不判断好不好看、该不该改、优先级——那是 Ant 的事。
 * 断言里的期望值必须能在 authority 原文里找到，禁止在清单里发明数值。
 *
 * 退出码：0 = 全过；1 = 有不通过或清单过期。
 */

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const CFG = JSON.parse(fs.readFileSync(path.join(__dirname, 'ui-checks.json'), 'utf8'));
const BASE = 'http://localhost:3000';
const VIEWPORT = { width: 393, height: 852, deviceScaleFactor: 2 };
const filter = process.argv[2] || '';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---- 权威漂移检测：清单同步时的哈希 vs MANIFEST 现值 ---- */
function checkAuthorityFreshness() {
  const manifest = fs.readFileSync(path.join(ROOT, 'authority', 'MANIFEST.md'), 'utf8');
  const stale = [];
  for (const [rel, expected] of Object.entries(CFG.authorityHashes)) {
    if (rel.startsWith('_')) continue;
    const row = manifest.split('\n').find((l) => l.includes('`' + rel + '`'));
    const current = row && (row.match(/`([0-9A-F]{32})`/) || [])[1];
    if (!current) { stale.push(`${rel}: MANIFEST 中找不到该条目`); continue; }
    if (current !== expected) stale.push(`${rel}: 权威已变更（MANIFEST ${current} ≠ 清单 ${expected}）`);
  }
  return stale;
}

/* ---- 断言实现：每条都是可判定的事实 ---- */
const ASSERTS = {
  exists: (el) => (el ? null : '元素不存在于 DOM'),
  visible: (el, _c, info) =>
    !el ? '元素不存在于 DOM'
      : info.rect.w > 0 && info.rect.h > 0 && info.style.visibility !== 'hidden' && info.style.display !== 'none' && Number(info.style.opacity) > 0.05
        ? null : `元素不可见（${info.rect.w}x${info.rect.h}, opacity=${info.style.opacity}, display=${info.style.display}）`,
  clickable: (el, _c, info) =>
    !el ? '元素不存在于 DOM'
      : info.disabled ? '元素 disabled'
        : info.topAtCenter !== 'self' ? `中心点被遮挡：${info.topAtCenter}`
          : info.style.pointerEvents === 'none' ? 'pointer-events: none'
            : null,
  notDisabled: (el, _c, info) => (!el ? '元素不存在于 DOM' : info.disabled ? '元素 disabled（入口不可达）' : null),
  styleContainsAll: (el, check, info) => {
    if (!el) return '元素不存在于 DOM';
    const actual = info.style[check.property] || '';
    const missing = check.expect.filter((frag) => !actual.includes(frag));
    return missing.length ? `${check.property} 缺少：${missing.join(' / ')}\n         实际：${actual.slice(0, 220)}` : null;
  },
  noHorizontalOverflow: (el, _c, info) =>
    info.scrollW > info.clientW + 1 ? `横向溢出 ${info.scrollW - info.clientW}px` : null,
};

/* ---- 采集一个选择器的全部事实 ---- */
const PROBE = (sel) => {
  const el = document.querySelector(sel);
  const body = document.documentElement;
  if (!el) return { found: false, scrollW: body.scrollWidth, clientW: body.clientWidth };
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const top = document.elementFromPoint(cx, cy);
  return {
    found: true,
    rect: { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y) },
    disabled: !!el.disabled,
    topAtCenter: top === el ? 'self' : top ? top.tagName.toLowerCase() + '.' + ([...top.classList].join('.') || '-') : 'none',
    style: {
      backgroundImage: cs.backgroundImage, background: cs.background, color: cs.color,
      fontSize: cs.fontSize, lineHeight: cs.lineHeight, opacity: cs.opacity,
      display: cs.display, visibility: cs.visibility, pointerEvents: cs.pointerEvents,
      padding: cs.padding, margin: cs.margin, borderColor: cs.borderColor,
    },
    scrollW: body.scrollWidth, clientW: body.clientWidth,
  };
};

function startServer() {
  return new Promise((resolve) => {
    const proc = spawn(process.execPath, [path.join(ROOT, 'web', 'serve.js')], { stdio: 'ignore' });
    const ping = async (n) => {
      try { if ((await fetch(BASE + '/web/')).ok) return resolve(proc); } catch (_) {}
      if (n > 40) { console.error('server 起不来'); process.exit(1); }
      setTimeout(() => ping(n + 1), 250);
    };
    ping(0);
  });
}

async function driveTo(page, state) {
  for (const step of state.steps) {
    if (step.goto) await page.goto(BASE + step.goto, { waitUntil: 'networkidle0' });
    if (step.click) {
      const el = await page.$(step.click);
      if (!el) throw new Error(`驱动失败：找不到 ${step.click}`);
      await el.evaluate((e) => e.click()); // 绕过 disabled 拦截，让断言层去判 disabled
    }
    if (step.waitFor) {
      try { await page.waitForSelector(step.waitFor, { timeout: step.timeout || 8000 }); }
      catch (_) { throw new Error(`驱动失败：等不到 ${step.waitFor}`); }
    }
    await sleep(350);
  }
}

(async () => {
  const stale = checkAuthorityFreshness();
  if (stale.length) {
    console.log('⚠️  清单可能过期 —— 权威已变更但 ui-checks.json 未同步：');
    stale.forEach((s) => console.log('   ' + s));
    console.log('   请先按权威原文更新断言，再更新 authorityHashes。\n');
  }

  const server = await startServer();
  const browser = await puppeteer.launch({ headless: 'new', args: ['--disable-gpu'] });
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  const results = [];
  for (const state of CFG.states) {
    const checks = CFG.checks.filter((c) => c.states.includes(state.id) && c.id.includes(filter));
    if (!checks.length) continue;

    let driveErr = null;
    try { await driveTo(page, state); } catch (e) { driveErr = e.message; }

    // 驱动失败只报一次，其余断言标 blocked——不重复刷屏，也不虚增失败数
    if (driveErr) {
      results.push({ id: `DRIVE-${state.id}`, authority: `进入「${state.desc}」的路径`, state: state.id, pass: false, why: driveErr });
      checks.forEach((c) => results.push({ ...c, state: state.id, blocked: true }));
      continue;
    }
    for (const check of checks) {
      const info = await page.evaluate(PROBE, check.selector);
      const why = ASSERTS[check.assert](info.found ? {} : null, check, info);
      results.push({ ...check, state: state.id, pass: !why, why });
    }
  }

  await browser.close();
  server.kill();

  const fail = results.filter((r) => !r.pass && !r.blocked);
  const blocked = results.filter((r) => r.blocked);
  const pass = results.filter((r) => r.pass);
  console.log('='.repeat(64));
  for (const r of results) {
    console.log(`${r.blocked ? '⏸' : r.pass ? '✅' : '❌'} [${r.state}] ${r.id}${r.blocked ? '（前置驱动失败，未测）' : ''}`);
    if (!r.pass && !r.blocked) {
      console.log(`   权威：${r.authority}`);
      console.log(`   实际：${r.why}`);
    }
  }
  console.log('='.repeat(64));
  console.log(`通过 ${pass.length} · 不通过 ${fail.length}${blocked.length ? ` · 未测 ${blocked.length}` : ''}（共 ${results.length}）`);
  process.exit(fail.length || stale.length ? 1 : 0);
})();
