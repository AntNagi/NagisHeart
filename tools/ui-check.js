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
 * 退出码：0 = 全过；1 = 有不通过、未测或运行错误。
 */

const fs = require('fs');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CFG = JSON.parse(fs.readFileSync(path.join(__dirname, 'ui-checks.json'), 'utf8'));
const BASE = 'http://localhost:3000';
const PORT = 3000;
const VIEWPORT = { width: 393, height: 852, deviceScaleFactor: 2 };
const GLOBAL_TIMEOUT_MS = 120_000;
const LAUNCH_TIMEOUT_MS = 20_000;
const EVALUATE_TIMEOUT_MS = 8_000;
const filter = process.argv[2] || '';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function withTimeout(promise, timeoutMs, label) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} 超时（${timeoutMs}ms）`)), timeoutMs);
    }),
  ]).finally(() => clearTimeout(timer));
}

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

function isPortOccupied(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port });
    socket.setTimeout(800);
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('timeout', () => { socket.destroy(); resolve(false); });
    socket.once('error', () => resolve(false));
  });
}

async function startServer() {
  if (await isPortOccupied(PORT)) {
    throw new Error(`端口 ${PORT} 已被占用；为避免静默复用既有服务，体检已停止`);
  }
  return new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, [path.join(ROOT, 'web', 'serve.js')], { stdio: 'ignore' });
    let settled = false;
    proc.once('exit', (code, signal) => {
      if (!settled) reject(new Error(`Web 服务提前退出（code=${code}, signal=${signal}）`));
    });
    const ping = async (n) => {
      try {
        if ((await fetch(BASE + '/web/')).ok) {
          settled = true;
          return resolve(proc);
        }
      } catch (_) {}
      if (n > 40) {
        settled = true;
        proc.kill();
        return reject(new Error('Web 服务在 10 秒内未就绪'));
      }
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
      await withTimeout(
        el.evaluate((e) => e.click()),
        EVALUATE_TIMEOUT_MS,
        `page.evaluate 点击 ${step.click}`,
      ); // 绕过 disabled 拦截，让断言层去判 disabled
    }
    if (step.waitFor) {
      try { await page.waitForSelector(step.waitFor, { timeout: step.timeout || 8000 }); }
      catch (_) { throw new Error(`驱动失败：等不到 ${step.waitFor}`); }
    }
    await sleep(350);
  }
}

function plannedResults() {
  const planned = [];
  for (const state of CFG.states) {
    for (const check of CFG.checks.filter((c) => c.states.includes(state.id) && c.id.includes(filter))) {
      planned.push({ ...check, state: state.id });
    }
  }
  return planned;
}

function fillUntested(results, reason) {
  const seen = new Set(results.filter((r) => !r.id.startsWith('DRIVE-')).map((r) => `${r.state}\0${r.id}`));
  for (const item of plannedResults()) {
    if (!seen.has(`${item.state}\0${item.id}`)) {
      results.push({ ...item, pass: false, blocked: true, why: reason });
    }
  }
}

function printResults(results, stale, fatalReason = '') {
  const fail = results.filter((r) => !r.pass && !r.blocked);
  const blocked = results.filter((r) => r.blocked);
  const pass = results.filter((r) => r.pass);
  console.log('='.repeat(64));
  for (const r of results) {
    console.log(`${r.blocked ? '⏸' : r.pass ? '✅' : '❌'} [${r.state}] ${r.id}${r.blocked ? '（未测）' : ''}`);
    if (!r.pass) {
      if (r.authority) console.log(`   权威：${r.authority}`);
      console.log(`   实际：${r.why || fatalReason || '未知错误'}`);
    }
  }
  console.log('='.repeat(64));
  console.log(`通过 ${pass.length} · 不通过 ${fail.length}${blocked.length ? ` · 未测 ${blocked.length}` : ''}（共 ${results.length}）`);
  if (fatalReason) console.error(`运行失败：${fatalReason}`);
  if (stale.length) {
    console.warn('\n⚠️  结束提醒：清单 authority hash 落后；以上结果仍已执行，仅供参考：');
    stale.forEach((s) => console.warn('   ' + s));
  }
}

(async () => {
  const results = [];
  let server = null;
  let browser = null;
  const stale = checkAuthorityFreshness();
  if (stale.length) {
    console.log('⚠️  清单可能过期 —— 权威已变更但 ui-checks.json 未同步：');
    stale.forEach((s) => console.log('   ' + s));
    console.log('   本轮仍会继续执行全部断言，并在结尾复述此警告。\n');
  }

  const globalTimer = setTimeout(() => {
    const why = `全局超时（${GLOBAL_TIMEOUT_MS}ms）`;
    fillUntested(results, why);
    printResults(results, stale, why);
    if (browser?.process()) browser.process().kill();
    if (server) server.kill();
    process.exit(1);
  }, GLOBAL_TIMEOUT_MS);

  try {
    console.log('正在检查本地端口…');
    server = await startServer();

    console.log('正在启动浏览器…');
    let puppeteer;
    try {
      puppeteer = require('puppeteer');
    } catch (e) {
      throw new Error(`浏览器驱动不可用：${e.message}`);
    }
    browser = await withTimeout(
      puppeteer.launch({ headless: 'new', args: ['--disable-gpu'], timeout: LAUNCH_TIMEOUT_MS }),
      LAUNCH_TIMEOUT_MS,
      'puppeteer.launch',
    );
    const page = await browser.newPage();
    page.setDefaultTimeout(EVALUATE_TIMEOUT_MS);
    await page.setViewport(VIEWPORT);

    for (const state of CFG.states) {
      const checks = CFG.checks.filter((c) => c.states.includes(state.id) && c.id.includes(filter));
      if (!checks.length) continue;

      console.log(`正在检查：${state.desc}…`);
      let driveErr = null;
      try { await driveTo(page, state); } catch (e) { driveErr = e.message; }

      if (driveErr) {
        results.push({ id: `DRIVE-${state.id}`, authority: `进入「${state.desc}」的路径`, state: state.id, pass: false, why: driveErr });
        checks.forEach((c) => results.push({ ...c, state: state.id, pass: false, blocked: true, why: driveErr }));
        continue;
      }
      for (const check of checks) {
        try {
          const info = await withTimeout(
            page.evaluate(PROBE, check.selector),
            EVALUATE_TIMEOUT_MS,
            `page.evaluate ${state.id}/${check.id}`,
          );
          const why = ASSERTS[check.assert](info.found ? {} : null, check, info);
          results.push({ ...check, state: state.id, pass: !why, why });
        } catch (e) {
          results.push({ ...check, state: state.id, pass: false, why: e.message });
        }
      }
    }

    printResults(results, stale);
    const hasFailure = results.some((r) => !r.pass);
    process.exitCode = hasFailure ? 1 : 0;
  } catch (e) {
    fillUntested(results, e.message);
    printResults(results, stale, e.message);
    process.exitCode = 1;
  } finally {
    clearTimeout(globalTimer);
    if (browser) {
      await withTimeout(browser.close(), 5_000, 'browser.close').catch(() => {
        if (browser?.process()) browser.process().kill();
      });
    }
    if (server) server.kill();
  }
})();
