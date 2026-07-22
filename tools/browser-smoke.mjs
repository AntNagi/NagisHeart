// Real-browser smoke test via Puppeteer against the live dev server.
// Flow: Splash → Start(新的故事) → Prologue(skip) → NameSetup → Game, then
// repeatedly uses the in-game section-skip to fast-forward to the Ending screen.
// Captures console/page errors and screenshots the ending.

import puppeteer from 'puppeteer';

const BASE = 'http://localhost:3000/web/';
const failures = [];
const consoleErrors = [];
const log = (s) => console.log(s);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 430, height: 860 });
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message));

const clickSel = (sel) => page.evaluate((s) => {
  const el = document.querySelector(s);
  if (el && el.offsetParent !== null) { el.click(); return true; }
  return false;
}, sel);

try {
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 20000 });
  await sleep(700);
  log('[1] loaded ' + BASE);

  // Splash → Start
  await clickSel('.start-hit');
  await sleep(500);
  log('[2] splash → start: ' + (await clickSel('[data-action="new"]') ? 'clicked 新的故事' : 'start-row not found'));
  await sleep(500);

  // Prologue → skip → confirm
  if (await clickSel('.prologue-skip-btn')) {
    await sleep(300);
    await clickSel('.nagi-dialog-scrim [data-role="confirm"]');
    log('[3] prologue skipped');
  } else {
    log('[3] prologue skip btn not present');
  }
  await sleep(600);

  // NameSetup → confirm (input defaults to "Ant")
  log('[4] name setup: ' + (await clickSel('.name-setup-confirm-area') ? 'entered story' : 'confirm not found'));
  await sleep(800);

  // Game loop → drive to ending via section-skip
  let guard = 0;
  let endingTitle = null;
  let endingTag = null;
  while (guard++ < 200) {
    if (await page.$('.ending-card')) {
      endingTitle = await page.$eval('.ending-card-title', (e) => e.textContent.trim()).catch(() => null);
      endingTag = await page.$eval('.ending-card-tag', (e) => e.textContent.trim()).catch(() => null);
      break;
    }
    // Choice → pick first
    if (await clickSel('.choice-button')) { await sleep(200); continue; }
    // Chapter/Section ending card → next
    if (await clickSel('.chapter-ending-card [data-action="next"]')) { await sleep(200); continue; }
    // Opening transition card → tap
    if (await clickSel('.chapter-card')) { await sleep(200); continue; }
    // Section-skip via HUD chip + confirm
    if (await clickSel('[data-action="skipSection"]')) {
      await sleep(200);
      await clickSel('.nagi-dialog-scrim [data-role="confirm"]');
      await sleep(200);
      continue;
    }
    // Fallback: tap to advance dialogue
    await clickSel('.game-screen-tap-area');
    await sleep(120);
  }

  if (endingTitle) {
    log(`[5] ✅ reached ending — ${endingTag || ''} "${endingTitle}" (after ${guard} loop steps)`);
    await page.screenshot({ path: 'tools/_smoke_ending.png' });
    log('    screenshot: tools/_smoke_ending.png');
  } else {
    failures.push('did not reach ending screen within ' + guard + ' steps');
    await page.screenshot({ path: 'tools/_smoke_stuck.png' });
    log('[5] ❌ did not reach ending; screenshot: tools/_smoke_stuck.png');
  }
} catch (e) {
  failures.push('exception: ' + e.message);
  log('EXCEPTION: ' + e.message);
} finally {
  if (consoleErrors.length) {
    log('\n--- console/page errors (' + consoleErrors.length + ') ---');
    consoleErrors.slice(0, 20).forEach((e) => log('  ' + e));
  } else {
    log('\n--- no console/page errors ---');
  }
  await browser.close();
}

const ok = failures.length === 0 && consoleErrors.length === 0;
log('\n' + (ok ? '✅ SMOKE PASS' : '❌ SMOKE ISSUES: ' + failures.join('; ')));
process.exit(ok ? 0 : 1);
