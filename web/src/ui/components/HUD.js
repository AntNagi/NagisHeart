export class HUD {
  constructor(container) {
    this.el = document.createElement('div');
    this.el.className = 'hud';
    this.el.innerHTML = `
      <div class="hud-left">
        <button class="hud-btn hud-glass" data-action="back" aria-label="返回">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="hud-scene-title hud-glass"></div>
      </div>
      <div class="hud-right">
        <button class="hud-btn hud-glass" data-action="auto" aria-label="自动播放">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M5 3.5l9 5.5-9 5.5V3.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="hud-btn hud-glass" data-action="save" aria-label="存档">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 3h8l3 3v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" stroke-width="1.3"/>
            <rect x="6" y="10" width="6" height="4" rx="0.5" stroke="currentColor" stroke-width="1.1"/>
          </svg>
        </button>
        <button class="hud-btn hud-glass" data-action="backlog" aria-label="剧情回顾">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 5h10M4 9h10M4 13h7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
        </button>
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

    this._onAction = null;

    this.el.addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.target.closest('[data-action]');
      const action = btn?.dataset?.action;
      if (action && this._onAction) this._onAction(action);
    });

    container.appendChild(this.el);
  }

  setOnAction(cb) { this._onAction = cb; }

  setVisible(visible) {
    this.el.style.display = visible ? '' : 'none';
  }

  update({ sceneTitle, isAutoPlaying, showSkipSection }) {
    this._titleEl.textContent = sceneTitle || '';
    this._titleEl.style.display = sceneTitle ? '' : 'none';
    this._autoBtn.classList.toggle('active', isAutoPlaying);
    this._actionChip.style.display = showSkipSection ? '' : 'none';
  }

  destroy() { this.el.remove(); }
}
