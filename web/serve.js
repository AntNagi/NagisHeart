const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const root = path.resolve(__dirname, '..');
const port = 3000;

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

// 版本水印：实时从 git 算，不依赖任何人记得打标。
// 同时报告工作区是否有未提交改动——"你看到的"是否等于"已提交的"一目了然。
function liveVersion() {
  const { execSync } = require('child_process');
  const run = (cmd) => execSync(cmd, { cwd: root, encoding: 'utf8' }).trim();
  try {
    const dirty = run('git status --porcelain -- web/ story-data/ assets/').length > 0;
    return {
      hash: run('git log -1 --format=%h'),
      time: run('git log -1 --format=%cI').slice(5, 16).replace('T', ' '),
      subject: run('git log -1 --format=%s').slice(0, 60),
      dirty,
      source: 'live',
    };
  } catch (e) {
    return { hash: 'unknown', time: '', subject: '', dirty: false, source: 'error' };
  }
}

http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;
  if (pathname === '/version.json') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(liveVersion()));
    return;
  }
  let fp = path.join(root, decodeURIComponent(pathname));
  if (fs.existsSync(fp) && fs.statSync(fp).isDirectory()) {
    fp = path.join(fp, 'index.html');
  }
  if (!fs.existsSync(fp)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(fp).toLowerCase();
  res.writeHead(200, {
    'Content-Type': mime[ext] || 'application/octet-stream',
    'Access-Control-Allow-Origin': '*',
    // 本地验收期禁用缓存，排除"看到旧版"这一类干扰
    'Cache-Control': 'no-store, must-revalidate',
  });
  fs.createReadStream(fp).pipe(res);
}).listen(port, () => {
  console.log(`Serving NagisHeart on http://localhost:${port}`);
});
