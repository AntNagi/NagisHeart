import { TEXT_SPEEDS, DISPLAY_THEMES } from '../../data/SettingsManager.js';

export class SettingsOverlay {
  constructor(container, { settingsManager, onClose, onThemeChange }) {
    this._mgr = settingsManager;
    this._onClose = onClose;
    this._onThemeChange = onThemeChange;

    this.el = document.createElement('div');
    this.el.className = 'overlay settings-overlay';
    container.appendChild(this.el);

    this.el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.closest('[data-action="close"]')) { this._onClose(); return; }
      const row = e.target.closest('[data-setting]');
      if (row && row.dataset.setting !== 'bgmVolume') this._toggle(row.dataset.setting);
    });

    this._render();
  }

  _render() {
    const s = this._mgr.get();
    const tsLabel = TEXT_SPEEDS.find(t => t.id === s.textSpeed)?.label || '正常';
    const dtLabel = DISPLAY_THEMES.find(t => t.id === s.displayTheme)?.label || '深色';
    const bgmPercent = s.bgmVolume * 10;

    this.el.innerHTML = `
      <div class="overlay-header">
        <button class="overlay-back-btn" data-action="close">←</button>
        <span class="overlay-title">系统设置</span>
        <span class="overlay-spacer"></span>
      </div>
      <div class="overlay-body">
        <h2 class="overlay-heading">系统设置</h2>
        <div class="settings-list">
          <div class="settings-row" data-setting="textSpeed">
            <span class="settings-label">文字速度</span>
            <span class="settings-value">${tsLabel}</span>
          </div>
          <div class="settings-row" data-setting="autoSpeed">
            <span class="settings-label">自动播放速度</span>
            <span class="settings-value">${s.autoSpeed}</span>
          </div>
          <div class="settings-row settings-row-bgm" data-setting="bgmVolume">
            <span class="settings-label">BGM 音量</span>
            <div class="settings-bgm-control">
              <input type="range" class="settings-bgm-slider" min="0" max="10" step="1" value="${s.bgmVolume}" />
              <span class="settings-bgm-value">${bgmPercent}%</span>
            </div>
          </div>
          <div class="settings-row" data-setting="displayTheme">
            <span class="settings-label">显示模式</span>
            <span class="settings-value">${dtLabel}</span>
          </div>
        </div>
      </div>
    `;

    const slider = this.el.querySelector('.settings-bgm-slider');
    const valueEl = this.el.querySelector('.settings-bgm-value');
    if (slider) {
      slider.addEventListener('input', (e) => {
        e.stopPropagation();
        const v = parseInt(e.target.value, 10);
        valueEl.textContent = `${v * 10}%`;
        const current = this._mgr.get();
        current.bgmVolume = v;
        this._mgr.update(current);
      });
      slider.addEventListener('click', (e) => e.stopPropagation());
    }
  }

  _toggle(key) {
    const s = this._mgr.get();
    switch (key) {
      case 'textSpeed': {
        const idx = TEXT_SPEEDS.findIndex(t => t.id === s.textSpeed);
        s.textSpeed = TEXT_SPEEDS[(idx + 1) % TEXT_SPEEDS.length].id;
        break;
      }
      case 'autoSpeed':
        s.autoSpeed = s.autoSpeed >= 5 ? 1 : s.autoSpeed + 1;
        break;
      case 'displayTheme': {
        const idx = DISPLAY_THEMES.findIndex(t => t.id === s.displayTheme);
        s.displayTheme = DISPLAY_THEMES[(idx + 1) % DISPLAY_THEMES.length].id;
        if (this._onThemeChange) this._onThemeChange(s.displayTheme);
        break;
      }
    }
    this._mgr.update(s);
    this._render();
  }

  destroy() { this.el.remove(); }
}
