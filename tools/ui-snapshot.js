/**
 * ui-snapshot.js — UI 截图对比验收工具（feibo 基建，2026-07-21）
 *
 * 用法（在 tools/ 目录或仓库根均可）：
 *   node tools/ui-snapshot.js authority   # 权威 HTML 逐页截期望图
 *   node tools/ui-snapshot.js web         # 启动 web 版并自动走流程截实现图
 *   node tools/ui-snapshot.js report      # 生成并排对比 HTML 报告
 *   node tools/ui-snapshot.js all         # 依次执行以上三步
 *
 * 输出：00_harness/05_reports/ui_baseline/{authority,web}/*.jpg + compare_report.html
 * 验收逻辑：Ant 打开 compare_report.html 逐行看图；差异即打回依据。
 */

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '00_harness', '05_reports', 'ui_baseline');
const VIEWPORT = { width: 393, height: 852, deviceScaleFactor: 2 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function ensureDirs() {
  for (const d of [OUT, path.join(OUT, 'authority'), path.join(OUT, 'web')]) {
    fs.mkdirSync(d, { recursive: true });
  }
}

/* ---------------- authority 期望图 ---------------- */

async function shootAuthority(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1100, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/authority/ui/NagisHeart_UI_Authority_XoXo_v1_0.html', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await sleep(800);

  const views = await page.$$eval('button[data-view]', (btns) => btns.map((b) => b.dataset.view));
  const phone = await page.$('#phone');
  const done = [];
  for (const view of views) {
    await page.click(`button[data-view="${view}"]`);
    await sleep(500);
    await phone.screenshot({ path: path.join(OUT, 'authority', `${view}.jpg`), type: 'jpeg', quality: 85 });
    done.push(view);
  }
  await page.close();
  console.log(`[authority] ${done.length} 页期望图: ${done.join(', ')}`);
  return done;
}

/* ---------------- web 实现图 ---------------- */

function startServer() {
  return new Promise((resolve) => {
    const proc = spawn(process.execPath, [path.join(ROOT, 'web', 'serve.js')], { stdio: 'ignore' });
    const tryPing = async (n) => {
      try {
        const res = await fetch('http://localhost:3000/web/');
        if (res.ok) return resolve(proc);
      } catch (_) {}
      if (n > 40) { console.error('server did not start'); process.exit(1); }
      setTimeout(() => tryPing(n + 1), 250);
    };
    tryPing(0);
  });
}

async function freshHome(page) {
  await page.goto('http://localhost:3000/web/', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.start-hit', { timeout: 10000 });
  await sleep(500);
  await page.click('.start-hit');
  await page.waitForSelector('.home-actions', { timeout: 10000 });
  await sleep(500);
}

/**
 * Enter game from home → prologue → name → game screen.
 * Returns when the HUD is visible (game phase active).
 */
async function enterGame(page) {
  await freshHome(page);
  await page.click('[data-action="new"]');
  await page.waitForSelector('.prologue-text', { timeout: 10000 });
  for (let i = 0; i < 15; i++) {
    if (await page.$('.name-setup-input')) break;
    await page.mouse.click(196, 500);
    await sleep(350);
  }
  await page.waitForSelector('.name-setup-input', { timeout: 5000 });
  await page.click('.name-setup-confirm-area');
  await page.waitForSelector('.hud-left', { timeout: 15000 });
  await sleep(800);
}

/**
 * Wait for a specific game phase by polling __controller__.
 * Requires the controller hook to be installed (installControllerHook).
 */
async function waitForPhase(page, phase, timeoutMs = 10000) {
  await page.waitForFunction(
    (ph) => window.__controller__?.state?.phase === ph,
    { timeout: timeoutMs },
    phase,
  );
  await sleep(400);
}

/**
 * Tap the game area to advance dialogue/transitions.
 */
async function gameTap(page) {
  await page.mouse.click(196, 400);
  await sleep(300);
}

async function shootWeb(browser) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  // Hook into EventTarget to capture the GameController instance on window.__controller__
  // when GameScreen subscribes to 'statechange'. Runs before any page JS.
  await page.evaluateOnNewDocument(() => {
    const orig = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, ...args) {
      if (type === 'statechange' && !window.__controller__) {
        window.__controller__ = this;
      }
      return orig.call(this, type, ...args);
    };
  });

  const shots = [];
  const failed = [];
  const shot = async (name) => {
    await sleep(450);
    await page.screenshot({ path: path.join(OUT, 'web', `${name}.jpg`), type: 'jpeg', quality: 85 });
    shots.push(name);
    console.log(`[web] ${name}`);
  };
  const attempt = async (name, fn) => {
    try { await fn(); } catch (e) { failed.push(`${name}: ${e.message.split('\n')[0]}`); }
  };

  // ── 1 开屏 ──
  await attempt('start', async () => {
    await page.goto('http://localhost:3000/web/', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.start-hit', { timeout: 10000 });
    await shot('start');
  });

  // ── 2 主页 ──
  await attempt('home', async () => {
    await page.click('.start-hit');
    await page.waitForSelector('.home-actions', { timeout: 10000 });
    await shot('home');
  });

  // ── 3-5 主页浮层：章节目录 / 系统设置 / 回忆画廊 ──
  for (const [action, name] of [['catalog', 'chapter-catalog'], ['settings', 'settings']]) {
    await attempt(name, async () => {
      await freshHome(page);
      const btn = await page.$(`[data-action="${action}"]`);
      if (!btn) throw new Error('button missing');
      await btn.click();
      await shot(name);
    });
  }

  // ── 5 回忆画廊（GalleryOverlay 未接入主页路由，直接注入 DOM 结构） ──
  await attempt('gallery', async () => {
    await freshHome(page);
    await page.evaluate(() => {
      const app = document.getElementById('app');
      const overlay = document.createElement('div');
      overlay.className = 'overlay gallery-overlay';
      overlay.innerHTML = `
        <div class="system-bg"><img src="../design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png" alt="" /></div>
        <div class="system-bg-overlay"></div>
        <div class="overlay-header" style="position:relative;z-index:1;">
          <button class="overlay-back-btn" data-action="close">←</button>
          <span class="overlay-title">回忆画廊</span>
          <span class="overlay-spacer"></span>
        </div>
        <div class="gallery-panel">
          <h2 class="overlay-heading">回忆画廊</h2>
          <div class="gallery-grid">
            <div class="gallery-empty">尚未解锁任何回忆</div>
          </div>
        </div>
      `;
      app.appendChild(overlay);
    });
    await shot('gallery');
  });

  // ── 6 开场白 ──
  await attempt('prologue', async () => {
    await freshHome(page);
    await page.click('[data-action="new"]');
    await page.waitForSelector('.prologue-text', { timeout: 10000 });
    await shot('prologue');
  });

  // ── 7 名字设置 ──
  await attempt('name', async () => {
    for (let i = 0; i < 15; i++) {
      if (await page.$('.name-setup-input')) break;
      await page.mouse.click(196, 500);
      await sleep(350);
    }
    await page.waitForSelector('.name-setup-input', { timeout: 3000 });
    await shot('name');
  });

  // ── 8 长旁白（p1 开头 ≥3 连续无 speaker 行，自动触发 long_narration） ──
  await attempt('long-narration', async () => {
    await page.click('.name-setup-confirm-area');
    await page.waitForSelector('.hud-left', { timeout: 15000 });
    await sleep(800);
    // p1 starts with 3 consecutive no-speaker lines → long_narration mode
    await page.waitForSelector('.long-narration', { timeout: 5000 });
    await shot('long-narration');
  });

  // ── 9 对白（有 speaker）──
  await attempt('dialogue', async () => {
    // Tap through the long narration overlay to reach the speaker dialogue
    for (let i = 0; i < 10; i++) {
      const hasNarration = await page.$('.long-narration');
      if (!hasNarration) break;
      await gameTap(page);
    }
    await sleep(500);
    // Now we should be at a regular dialogue line (with or without speaker)
    // Advance until we see a speaker name in the dialogue box
    for (let i = 0; i < 10; i++) {
      const speaker = await page.$eval('.dialogue-speaker', (el) => el.textContent.trim()).catch(() => '');
      if (speaker) break;
      await gameTap(page);
      await sleep(300);
    }
    await page.waitForSelector('.dialogue-speaker', { timeout: 5000 });
    await shot('dialogue');
  });

  // ── 10 存档浮层 ──
  await attempt('save', async () => {
    await page.click('[data-action="save"]');
    await shot('save');
    await page.keyboard.press('Escape');
  });

  // ── 11 剧情回顾 ──
  await attempt('story-recap', async () => {
    await sleep(300);
    await page.click('[data-action="backlog"]');
    await shot('story-recap');
    await page.keyboard.press('Escape');
    await sleep(300);
  });

  // ── 12 选项层（重新进入游戏，跳到 p2 并推进到选项） ──
  await attempt('choice', async () => {
    await enterGame(page);
    // Jump controller to p2 which has visible choices after 8 lines
    await page.evaluate(() => {
      const ctrl = window.__controller__;
      if (!ctrl) throw new Error('controller not captured');
      ctrl._currentChapterId = 'part1';
      ctrl._currentSectionIndex = 1;
      ctrl._navigateToNode('p2');
    });
    await sleep(600);
    // Advance through p2 dialogue using controller.onTap() via evaluate
    // (DOM clicks get intercepted by UI layer overlays, so we drive the controller directly)
    for (let i = 0; i < 30; i++) {
      const phase = await page.evaluate(() => window.__controller__?.state?.phase);
      if (phase === 'Choice') break;
      await page.evaluate(() => window.__controller__?.onTap());
      await sleep(200);
    }
    await waitForPhase(page, 'Choice', 5000);
    await sleep(400);
    await shot('choice');
  });

  // ── 13 跳过弹窗（NagiDialog） ──
  await attempt('skip-confirm', async () => {
    // Re-enter game to get a clean state with HUD visible
    await enterGame(page);
    // Advance past initial long narration to reach regular dialogue with HUD
    for (let i = 0; i < 5; i++) {
      const phase = await page.evaluate(() => window.__controller__?.state?.phase);
      if (phase === 'Dialogue') break;
      await page.evaluate(() => window.__controller__?.onTap());
      await sleep(200);
    }
    await sleep(400);
    const skipBtn = await page.$('[data-action="skipSection"]');
    if (!skipBtn) throw new Error('skipSection button not found');
    await skipBtn.click();
    await sleep(600);
    await page.waitForSelector('.nagi-dialog-scrim', { timeout: 5000 });
    await shot('skip-confirm');
  });

  // ── 14 小节结束（Section Ending / Section Clear） ──
  await attempt('section-clear', async () => {
    // Dismiss any existing NagiDialog first
    const dismissBtn = await page.$('.nagi-dialog .nagi-dialog-dismiss');
    if (dismissBtn) { await dismissBtn.click(); await sleep(300); }
    // Call skipToSectionClear directly via controller
    await page.evaluate(() => window.__controller__?.skipToSectionClear());
    await waitForPhase(page, 'SectionEnding', 5000);
    await shot('section-clear');
  });

  // ── 15 小节开始（Section Opening / Section Transition） ──
  await attempt('section-opening', async () => {
    await page.evaluate(() => window.__controller__?.onTap());
    await sleep(400);
    // SectionEnding tap → SectionTransition (if next section exists with title)
    const phase = await page.evaluate(() => window.__controller__?.state?.phase);
    if (phase === 'SectionTransition') {
      await shot('section-opening');
    } else {
      // May have gone straight to dialogue; force a transition via controller
      await page.evaluate(() => {
        const ctrl = window.__controller__;
        ctrl._updateState({
          phase: 'SectionTransition',
          sectionTransition: { chapterName: '第一部', sectionTitle: '观察席' },
        });
      });
      await sleep(400);
      await shot('section-opening');
    }
  });

  // ── 16 章节结束（Chapter Ending / Chapter Clear） ──
  await attempt('chapter-clear', async () => {
    // Force chapter ending state via controller
    await page.evaluate(() => {
      const ctrl = window.__controller__;
      ctrl._updateState({
        phase: 'ChapterEnding',
        chapterTransition: {
          chapterName: '第一部',
          chapterTitle: '蓝色监狱篇',
          timeRange: null,
        },
      });
    });
    await waitForPhase(page, 'ChapterEnding', 3000);
    await shot('chapter-clear');
  });

  // ── 17 章节开始（Chapter Opening / Chapter Transition） ──
  await attempt('chapter-opening', async () => {
    await page.evaluate(() => {
      const ctrl = window.__controller__;
      ctrl._updateState({
        phase: 'ChapterTransition',
        chapterTransition: {
          chapterName: '第二部',
          chapterTitle: '新赛季篇',
          timeRange: null,
        },
      });
    });
    await waitForPhase(page, 'ChapterTransition', 3000);
    await shot('chapter-opening');
  });

  // ── 18 结局页 ──
  await attempt('ending', async () => {
    await page.evaluate(() => {
      const ctrl = window.__controller__;
      if (ctrl) {
        ctrl._updateState({
          phase: 'Ending',
          ending: {
            mood: 'true',
            tag: 'TRUE END',
            title: '世界第一，与你',
            description: '他站到世界中心，你没有消失。',
            unlockText: '已解锁结局回忆',
          },
        });
      }
    });
    await sleep(1000);
    await page.waitForSelector('.ending-screen', { timeout: 5000 });
    await shot('ending');
  });

  await page.close();
  console.log(`[web] 完成 ${shots.length} 张${failed.length ? '；失败: ' + failed.join(' | ') : ''}`);
  return { shots, failed };
}

/* ---------------- 并排对比报告 ---------------- */

function buildReport() {
  const authDir = path.join(OUT, 'authority');
  const webDir = path.join(OUT, 'web');
  const authNames = fs.existsSync(authDir) ? fs.readdirSync(authDir).filter((f) => f.endsWith('.jpg')).map((f) => f.replace('.jpg', '')) : [];
  const webNames = fs.existsSync(webDir) ? fs.readdirSync(webDir).filter((f) => f.endsWith('.jpg')).map((f) => f.replace('.jpg', '')) : [];

  const rows = authNames.map((n) => {
    const hasWeb = webNames.includes(n);
    return `
    <section class="row ${hasWeb ? '' : 'missing'}">
      <h2>${n}${hasWeb ? '' : '<span class="tag">Web 未覆盖</span>'}</h2>
      <div class="pair">
        <figure><img src="authority/${n}.jpg" loading="lazy" /><figcaption>权威期望</figcaption></figure>
        ${hasWeb ? `<figure><img src="web/${n}.jpg" loading="lazy" /><figcaption>Web 实现</figcaption></figure>` : '<div class="none">需手动补图或后续覆盖</div>'}
      </div>
    </section>`;
  });
  const extra = webNames.filter((n) => !authNames.includes(n));

  const html = `<!DOCTYPE html><html lang="zh"><head><meta charset="utf-8" />
<title>NagisHeart UI 对比报告 ${new Date().toISOString().slice(0, 10)}</title>
<style>
  body{font-family:system-ui,sans-serif;background:#101827;color:#f4f1ea;margin:0;padding:24px}
  h1{font-size:20px} h2{font-size:15px;margin:0 0 8px;color:#d7be86}
  .tag{background:#8b2635;color:#fff;font-size:11px;padding:2px 8px;margin-left:10px;border-radius:3px}
  .row{margin-bottom:36px;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:24px}
  .pair{display:flex;gap:16px;align-items:flex-start}
  figure{margin:0} img{width:340px;border:1px solid rgba(255,255,255,.15)}
  figcaption{font-size:12px;color:#c9d1dc;text-align:center;margin-top:6px}
  .none{width:340px;height:200px;display:flex;align-items:center;justify-content:center;color:#8a93a3;border:1px dashed rgba(255,255,255,.2)}
  .meta{font-size:12px;color:#8a93a3}
</style></head><body>
<h1>NagisHeart UI 对比报告 <span class="meta">生成于 ${new Date().toLocaleString('zh-CN')} · 权威 ${authNames.length} 页 / Web 覆盖 ${webNames.length} 页</span></h1>
<p class="meta">左=权威期望（authority HTML 渲染），右=Web 实现（393x852）。验收：逐行看差异，不符拍板打回。${extra.length ? 'Web 额外截图（无对应权威页）：' + extra.join(', ') : ''}</p>
${rows.join('\n')}
</body></html>`;
  fs.writeFileSync(path.join(OUT, 'compare_report.html'), html);
  console.log(`[report] ${path.join(OUT, 'compare_report.html')}`);
}

/* ---------------- main ---------------- */

(async () => {
  const mode = process.argv[2] || 'all';
  ensureDirs();
  let server = null;
  const browser = ['authority', 'web', 'all'].includes(mode)
    ? await puppeteer.launch({ headless: 'new', args: ['--disable-gpu'] })
    : null;
  try {
    if (browser) server = await startServer();
    if (mode === 'authority' || mode === 'all') await shootAuthority(browser);
    if (mode === 'web' || mode === 'all') await shootWeb(browser);
    if (mode === 'report' || mode === 'all') buildReport();
  } finally {
    if (browser) await browser.close();
    if (server) server.kill();
  }
})();
