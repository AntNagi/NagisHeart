export class StartScreen {
  constructor(container, ctx) {
    this._ctx = ctx;
    this.el = document.createElement('div');
    this.el.className = 'screen start-screen screen-enter';

    this.el.innerHTML = `
      <div class="start-screen-overlay"></div>
      <div class="start-menu">
        <button class="start-btn" data-action="new">新的故事</button>
        <button class="start-btn" data-action="continue" disabled>继续</button>
        <div class="start-btn-divider"></div>
        <button class="start-btn" data-action="gallery" disabled>画廊</button>
      </div>
    `;

    this._continueBtn = this.el.querySelector('[data-action="continue"]');

    this.el.addEventListener('click', (e) => {
      const action = e.target.dataset?.action;
      if (action === 'new') {
        ctx.router.navigate('prologue');
      } else if (action === 'continue' && !e.target.disabled) {
        ctx.controller.continueGame().then(ok => {
          if (ok) ctx.router.navigate('game');
        });
      }
    });

    ctx.controller.hasAutoSave().then(has => {
      if (has) this._continueBtn.disabled = false;
    });

    container.appendChild(this.el);
  }

  destroy() { this.el.remove(); }
}
