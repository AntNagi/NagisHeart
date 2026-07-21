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
const AUTHORITY_HTML = path.join(ROOT, 'authority', 'ui', 'NagisHeart_UI_Authority_XoXo_v1_0.html');
const VIEWPORT = { width: 393, height: 852, deviceScaleFactor: 2 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function ensureDirs() {
  for (const d of [OUT, path.join(OUT, 'authority'), path.join(OUT, 'web')]) {
    fs.mkdirSync(d, { recursive: true });
  }
}

/* ---------------- authority 期望图 ---------------- */

async function shootAuthority(browser) {
  // 权威板是单 #phone + data-view 切换的 18 视图设计板；经本地 server 加载以保证相对资源解析。
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
    await sleep(500); // 视图过渡 + 背景图切换
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

async function shootWeb(browser) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  const shots = [];
  const failed = [];
  const shot = async (name) => {
    await sleep(450); // 等过渡动画
    await page.screenshot({ path: path.join(OUT, 'web', `${name}.jpg`), type: 'jpeg', quality: 85 });
    shots.push(name);
    console.log(`[web] ${name}`);
  };
  const attempt = async (name, fn) => {
    try { await fn(); } catch (e) { failed.push(`${name}: ${e.message.split('\n')[0]}`); }
  };

  // 1 开屏
  await attempt('start', async () => {
    await page.goto('http://localhost:3000/web/', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.start-hit', { timeout: 10000 });
    await shot('start');
  });

  // 2 主页
  await attempt('home', async () => {
    await page.click('.start-hit');
    await page.waitForSelector('.home-actions', { timeout: 10000 });
    await shot('home');
  });

  // 3-5 主页浮层：章节目录 / 系统设置 / 回忆画廊（每个都从干净主页进入）
  for (const [action, name] of [['catalog', 'chapter-catalog'], ['settings', 'settings'], ['gallery', 'gallery']]) {
    await attempt(name, async () => {
      await freshHome(page);
      const btn = await page.$(`[data-action="${action}"]:not([disabled])`);
      if (!btn) throw new Error('button disabled or missing');
      await btn.click();
      await shot(name);
    });
  }

  // 6 开场白
  await attempt('prologue', async () => {
    await freshHome(page);
    await page.click('[data-action="new"]');
    await page.waitForSelector('.prologue-text', { timeout: 10000 });
    await shot('prologue');
  });

  // 7 名字设置（连点开场白直到出现输入框）
  await attempt('name', async () => {
    for (let i = 0; i < 15; i++) {
      if (await page.$('.name-setup-input')) break;
      await page.mouse.click(196, 500);
      await sleep(350);
    }
    await page.waitForSelector('.name-setup-input', { timeout: 3000 });
    await shot('name');
  });

  // 8 剧情对白页（确认名字进入游戏）
  await attempt('dialogue', async () => {
    await page.click('.name-setup-confirm-area');
    await page.waitForSelector('.hud-left', { timeout: 15000 });
    await sleep(800); // 等背景与对白渲染
    await shot('dialogue');
  });

  // 9 存档浮层（游戏内 HUD save）
  await attempt('save', async () => {
    await page.click('[data-action="save"]');
    await shot('save');
    await page.keyboard.press('Escape');
  });

  // 10 剧情回顾（HUD backlog）
  await attempt('story-recap', async () => {
    await sleep(300);
    await page.click('[data-action="backlog"]');
    await shot('story-recap');
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
