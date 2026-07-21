export class NameSetupScreen {
  constructor(container, ctx) {
    this._ctx = ctx;
    this.el = document.createElement('div');
    this.el.className = 'screen name-setup-screen screen-enter';
    this.el.innerHTML = `
      <div class="system-bg">
        <img src="../design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png" alt="" />
      </div>
      <div class="system-bg-overlay splash"></div>
      <div class="name-setup-content">
        <div class="name-setup-top-label">开始之前</div>
        <div class="name-setup-title">写下你的名字</div>
        <div class="name-setup-subtitle">在这个故事中，他会用这个名字呼唤你</div>
        <div class="name-setup-input-group">
          <label class="name-setup-label">你的名字</label>
          <input class="name-setup-input" type="text" value="Ant" maxlength="12" autocomplete="off" placeholder="输入你的名字">
        </div>
        <div class="name-setup-confirm-area">
          <div class="name-setup-confirm-main">进入故事</div>
          <div class="name-setup-confirm-hint">轻触确认</div>
        </div>
      </div>
    `;

    const input = this.el.querySelector('.name-setup-input');
    const confirmArea = this.el.querySelector('.name-setup-confirm-area');

    confirmArea.addEventListener('click', () => {
      const name = input.value.trim() || 'Ant';
      ctx.controller.startNewGame(name);
      ctx.router.navigate('game');
    });

    container.appendChild(this.el);
    input.focus();
  }

  destroy() { this.el.remove(); }
}
