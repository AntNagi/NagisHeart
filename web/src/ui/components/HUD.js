export class HUD {
  constructor(container) {
    this.el = document.createElement('div');
    this.el.className = 'hud';
    this.el.innerHTML = `
      <div class="hud-left">
        <div class="hud-scene-title hud-glass"></div>
      </div>
      <div class="hud-right">
        <button class="hud-btn hud-glass" data-action="auto">AUTO</button>
        <button class="hud-btn hud-glass" data-action="skip">SKIP</button>
        <button class="hud-btn hud-glass" data-action="menu">MENU</button>
      </div>
    `;

    this._actionChip = document.createElement('button');
    this._actionChip.className = 'hud-action-chip hud-glass';
    this._actionChip.style.display = 'none';
    this._actionChip.dataset.action = 'skipSection';
    this._actionChip.textContent = '跳过本节';
    this.el.appendChild(this._actionChip);

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

  update({ sceneTitle, isAutoPlaying, isSkipping, showSkipSection }) {
    this._titleEl.textContent = sceneTitle || '';
    this._titleEl.style.display = sceneTitle ? '' : 'none';
    this._autoBtn.classList.toggle('active', isAutoPlaying);
    this._skipBtn.classList.toggle('active', isSkipping);
    this._actionChip.style.display = showSkipSection ? '' : 'none';
  }

  destroy() { this.el.remove(); }
}
