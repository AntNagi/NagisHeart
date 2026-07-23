export class EndingScreen {
  constructor(container, ctx) {
    this._ctx = ctx;
    const ending = ctx.ending;
    const bgPath = ctx.bgAssetPath || this._getDefaultBg(ending);

    this.el = document.createElement('div');
    this.el.className = 'screen authority-ending-screen screen-enter';

    const tag = ending?.tag || 'ENDING';
    const title = ending?.title || '回看已完成';
    const desc = ending?.description || '';
    const unlockText = ending?.unlockText || '';

    this.el.innerHTML = `
      <div class="authority-ending-bg-img"><img src="${bgPath}" alt="" /></div>
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
      true: 'assets/bg/true_end.jpg',
      good: 'assets/bg/king.jpg',
      normal: 'assets/bg/ending_true_nagi_soft_gaze.jpg',
      bad: 'assets/bg/goal_faraway.jpg',
    };
    return map[mood] || 'assets/bg/true_end.jpg';
  }

  destroy() { this.el.remove(); }
}
