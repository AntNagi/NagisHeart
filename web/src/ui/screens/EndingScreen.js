import { repoAssetUrl } from '../../utils/assetPath.js';

export class EndingScreen {
  constructor(container, ctx) {
    this._ctx = ctx;
    this.el = document.createElement('div');
    this.el.className = 'screen authority-ending-screen screen-enter';

    const ending = ctx.ending;
    if (!ending) {
      console.error('[EndingScreen] missing ending payload; returning to catalog.');
      container.appendChild(this.el);
      requestAnimationFrame(() => ctx.router.navigate('start', { openCatalog: true }));
      return;
    }
    const bgAssetPath = ctx.bgAssetPath; // e.g. 'bg/true_end.jpg' (assets/ stripped)
    const bgSrc = bgAssetPath ? repoAssetUrl(`assets/${bgAssetPath}`) : this._getDefaultBg(ending);

    const tag = ending.tag;
    const title = ending.title;
    const desc = ending.description || '';
    const unlockText = ending.unlockText || '';

    this.el.innerHTML = `
      <div class="authority-ending-bg-img"><img src="${bgSrc}" alt="" /></div>
      <div class="authority-ending-scrim"></div>
      <div class="authority-ending-glow"></div>
      <div class="authority-ending-content">
        <div class="authority-ending-tag">${tag}</div>
        <div class="authority-ending-tag-line"></div>
        <div class="authority-ending-title">${title}</div>
        ${desc ? `<div class="authority-ending-desc">${desc}</div>` : ''}
        ${unlockText ? `
          <div class="authority-ending-unlock">
            <span class="authority-ending-unlock-dot"></span>
            <span>${unlockText}</span>
          </div>
        ` : ''}
      </div>
      <div class="authority-ending-home" data-action="home">返回主页</div>
    `;

    this.el.querySelector('[data-action="home"]').addEventListener('click', () => {
      ctx.router.navigate('start');
    });

    container.appendChild(this.el);
  }

  _getDefaultBg(ending) {
    const mood = (ending?.mood || 'normal').toLowerCase();
    const map = {
      true: repoAssetUrl('assets/bg/true_end.jpg'),
      good: repoAssetUrl('assets/bg/king.jpg'),
      normal: repoAssetUrl('assets/bg/ending_true_nagi_soft_gaze.jpg'),
      bad: repoAssetUrl('assets/bg/goal_faraway.jpg'),
    };
    return map[mood] || repoAssetUrl('assets/bg/true_end.jpg');
  }

  destroy() { this.el.remove(); }
}
