export class HUD {
  constructor(container) {
    this.el = document.createElement('div');
    this.el.className = 'hud';
    this.el.innerHTML = `
      <div class="hud-scene-title"></div>
      <div class="hud-actions">
        <button class="hud-btn" data-action="auto">AUTO</button>
        <button class="hud-btn" data-action="skip">SKIP</button>
        <button class="hud-btn" data-action="menu">MENU</button>
      </div>
    `;
    this._titleEl = this.el.querySelector('.hud-scene-title');
    this._autoBtn = this.el.querySelector('[data-action="auto"]');
    this._skipBtn = this.el.querySelector('[data-action="skip"]');

    this._onAction = null;

    this.el.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = e.target.dataset?.action;
      if (action && this._onAction) this._onAction(action);
    });

    container.appendChild(this.el);
  }

  setOnAction(cb) { this._onAction = cb; }

  update({ sceneTitle, isAutoPlaying, isSkipping }) {
    this._titleEl.textContent = sceneTitle || '';
    this._autoBtn.classList.toggle('active', isAutoPlaying);
    this._skipBtn.classList.toggle('active', isSkipping);
  }

  destroy() { this.el.remove(); }
}
