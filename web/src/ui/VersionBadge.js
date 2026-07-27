/**
 * 版本水印（验收辅助，非产品 UI）
 *
 * 目的：让 Ant 一眼确认"我现在看的这一版，是不是开发说他改完的那一版"。
 * 版本号由本地 serve.js 实时从 git 计算，开发无法遗漏或伪造。
 *
 * 显示：左下角小字 `#hash · MM-DD hh:mm`；工作区有未提交改动时追加红色 `+未提交`。
 * 关闭：URL 加 `?nobadge`，或点击徽标本身。
 * 上线前必须移除或加生产环境开关（见 task_board 版本水印条目）。
 */
export async function mountVersionBadge() {
  if (new URLSearchParams(location.search).has('nobadge')) return;

  let v;
  try {
    v = await (await fetch('/version.json', { cache: 'no-store' })).json();
  } catch (_) {
    return; // 非本地 server（如 GitHub Pages）静默跳过
  }

  console.log(
    `%c NagisHeart %c ${v.hash}${v.dirty ? ' +未提交' : ''} %c ${v.time}  ${v.subject}`,
    'background:#101827;color:#D7BE86;font-weight:bold',
    v.dirty ? 'background:#8B2635;color:#fff' : 'background:#1E3A5F;color:#E8EEF6',
    'color:#8A93A3',
  );

  const el = document.createElement('div');
  el.textContent = `#${v.hash} · ${v.time}${v.dirty ? ' +未提交' : ''}`;
  el.title = v.subject;
  el.style.cssText = [
    'position:fixed', 'left:6px', 'bottom:4px', 'z-index:99999',
    'font:10px/1.4 ui-monospace,Menlo,Consolas,monospace',
    'padding:2px 6px', 'border-radius:3px', 'pointer-events:auto', 'cursor:pointer',
    'background:rgba(9,14,24,0.55)', 'backdrop-filter:blur(4px)',
    `color:${v.dirty ? '#E8A0AC' : 'rgba(232,238,246,0.62)'}`,
    'user-select:none',
  ].join(';');
  el.addEventListener('click', () => el.remove());
  document.body.appendChild(el);
}
