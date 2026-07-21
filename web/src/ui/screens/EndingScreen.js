export class EndingScreen {
  constructor(container, ctx) {
    this._ctx = ctx;
    const ending = ctx.ending;
    this.el = document.createElement('div');
    this.el.className = 'screen ending-screen screen-enter';

    const mood = (ending?.mood || 'normal').toLowerCase();
    const tag = ending?.tag || 'ENDING';
    const title = ending?.title || '回看已完成';
    const desc = ending?.description || '';
    const unlockText = ending?.unlockText || '';

    this.el.innerHTML = `
      <div class="ending-overlay"></div>
      <div class="ending-card">
        <div class="ending-card-tag ${mood}">${tag}</div>
        <div class="ending-card-title">${title}</div>
        ${desc ? `<div class="ending-card-desc">${desc}</div>` : ''}
        ${unlockText ? `
          <div class="ending-unlock">
            <span class="ending-unlock-dot"></span>
            <span>${unlockText}</span>
          </div>
        ` : ''}
        <div class="ending-action-primary" data-action="home">返回主页</div>
      </div>
    `;

    this.el.querySelector('[data-action="home"]').addEventListener('click', () => {
      ctx.router.navigate('start');
    });

    container.appendChild(this.el);
  }

  destroy() { this.el.remove(); }
}
