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
      if (row) this._toggle(row.dataset.setting);
    });

    this._render();
  }

  _render() {
    const s = this._mgr.get();
    const tsLabel = TEXT_SPEEDS.find(t => t.id === s.textSpeed)?.label || '正常';
    const dtLabel = DISPLAY_THEMES.find(t => t.id === s.displayTheme)?.label || '深色';
    const bgmLabel = `${s.bgmVolume * 10}%`;

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
          <div class="settings-row" data-setting="bgmVolume">
            <span class="settings-label">BGM 音量</span>
            <span class="settings-value">${bgmLabel}</span>
          </div>
          <div class="settings-row" data-setting="displayTheme">
            <span class="settings-label">显示模式</span>
            <span class="settings-value">${dtLabel}</span>
          </div>
        </div>
      </div>
    `;
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
      case 'bgmVolume':
        s.bgmVolume = s.bgmVolume >= 10 ? 0 : s.bgmVolume + 1;
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
