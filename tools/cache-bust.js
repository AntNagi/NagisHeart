/**
 * cache-bust.js — 用当前 git commit hash 更新 web/index.html 中的 ?v= 查询参数
 *
 * 用法：node tools/cache-bust.js
 * 建议在 git commit 之后、git push 之前跑一次，然后 amend 或再提交一次。
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '..', 'web', 'index.html');
const hash = execSync('git rev-parse --short HEAD').toString().trim();

let html = fs.readFileSync(indexPath, 'utf-8');
html = html.replace(/\?v=[a-f0-9]+/g, `?v=${hash}`);

// If no ?v= params exist yet, add them
html = html.replace(/(\.css|\.js)(")/g, (match, ext, quote) => {
  if (!match.includes('?v=')) return `${ext}?v=${hash}${quote}`;
  return match;
});

fs.writeFileSync(indexPath, html);
console.log(`[cache-bust] web/index.html updated to ?v=${hash}`);
