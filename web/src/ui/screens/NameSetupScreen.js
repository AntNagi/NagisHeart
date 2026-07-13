export class NameSetupScreen {
  constructor(container, ctx) {
    this._ctx = ctx;
    this.el = document.createElement('div');
    this.el.className = 'screen name-setup-screen screen-enter';
    this.el.innerHTML = `
      <div class="name-setup-gold-line"></div>
      <div class="name-setup-title">你的名字</div>
      <div class="name-setup-subtitle">请输入你在这个故事中的名字</div>
      <div class="name-setup-input-group">
        <label class="name-setup-label">名字</label>
        <input class="name-setup-input" type="text" value="Ant" maxlength="12" autocomplete="off">
      </div>
      <button class="name-setup-confirm">开始</button>
    `;

    const input = this.el.querySelector('.name-setup-input');
    const confirmBtn = this.el.querySelector('.name-setup-confirm');

    confirmBtn.addEventListener('click', () => {
      const name = input.value.trim() || 'Ant';
      ctx.controller.startNewGame(name);
      ctx.router.navigate('game');
    });

    container.appendChild(this.el);
    input.focus();
  }

  destroy() { this.el.remove(); }
}
