export class HUD {
  constructor(container) {
    this.el = document.createElement('div');
    this.el.className = 'hud';
    this.el.innerHTML = `
      <div class="hud-left">
        <button class="hud-btn hud-glass-icon" data-action="back" aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M14.5 6.5L9 12L14.5 17.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="hud-scene-title hud-glass-title"></div>
      </div>
      <div class="hud-right">
        <button class="hud-btn hud-glass-icon" data-action="auto" aria-label="自动播放">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M8 17L8 7L16.5 12Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M18.5 8.5C19.5 9.5 20 10.7 20 12C20 13.3 19.5 14.5 18.5 15.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.65"/>
          </svg>
        </button>
        <button class="hud-btn hud-glass-icon" data-action="save" aria-label="存档">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M7 5L17 5L17 19L12 16L7 19Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M9.5 8L14.5 8" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" opacity="0.7"/>
          </svg>
        </button>
        <button class="hud-btn hud-glass-icon" data-action="backlog" aria-label="剧情回顾">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M7 4.5L15.5 4.5L18 7L18 19.5L7 19.5Z" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/>
            <path d="M10 10L15 10M10 13L15 13M10 16L13.2 16" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" opacity="0.75"/>
          </svg>
        </button>
      </div>
    `;

    this._actionChip = document.createElement('button');
    this._actionChip.className = 'hud-action-chip hud-glass-title';
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
