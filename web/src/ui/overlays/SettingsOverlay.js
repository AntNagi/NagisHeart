import { TEXT_SPEEDS, DISPLAY_THEMES, FONT_SIZES, SKIP_SPEEDS } from '../../data/SettingsManager.js';

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
      if (row && row.dataset.setting !== 'bgmVolume' && row.dataset.setting !== 'dialogueOpacity') {
        this._toggle(row.dataset.setting);
      }
    });

    this._render();
  }

  _render() {
    const s = this._mgr.get();
    const tsLabel = TEXT_SPEEDS.find(t => t.id === s.textSpeed)?.label || '正常';
    const dtLabel = DISPLAY_THEMES.find(t => t.id === s.displayTheme)?.label || '深色';
    const fsLabel = FONT_SIZES.find(t => t.id === s.fontSize)?.label || '标准';
    const skLabel = SKIP_SPEEDS.find(t => t.id === s.skipSpeed)?.label || '正常';
    const bgmPercent = s.bgmVolume * 10;
    const opacityPercent = s.dialogueOpacity;

    this.el.innerHTML = `
      <div class="system-bg"><img src="../design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png" alt="" /></div>
      <div class="system-bg-overlay"></div>
      <div class="overlay-header">
        <button class="overlay-back-btn" data-action="close">←</button>
        <span class="overlay-title">系统设置</span>
        <span class="overlay-spacer"></span>
      </div>
      <div class="overlay-body">
        <h2 class="overlay-heading">系统设置</h2>
        <div class="settings-list">
          <div class="settings-section-title">文本</div>
          <div class="settings-row" data-setting="textSpeed">
            <span class="settings-label">文字速度</span>
            <span class="settings-value">${tsLabel}</span>
          </div>
          <div class="settings-row" data-setting="autoSpeed">
            <span class="settings-label">自动播放速度</span>
            <span class="settings-value">${s.autoSpeed}</span>
          </div>
          <div class="settings-row" data-setting="fontSize">
            <span class="settings-label">字号</span>
            <span class="settings-value">${fsLabel}</span>
          </div>

          <div class="settings-section-title">音频</div>
          <div class="settings-row settings-row-bgm" data-setting="bgmVolume">
            <span class="settings-label">BGM 音量</span>
            <div class="settings-bgm-control">
              <input type="range" class="settings-bgm-slider" min="0" max="10" step="1" value="${s.bgmVolume}" />
              <span class="settings-bgm-value">${bgmPercent}%</span>
            </div>
          </div>

          <div class="settings-section-title">显示</div>
          <div class="settings-row" data-setting="displayTheme">
            <span class="settings-label">显示模式</span>
            <span class="settings-value">${dtLabel}</span>
          </div>
          <div class="settings-row settings-row-bgm" data-setting="dialogueOpacity">
            <span class="settings-label">对话框透明度</span>
            <div class="settings-bgm-control">
              <input type="range" class="settings-opacity-slider" min="30" max="100" step="10" value="${opacityPercent}" />
              <span class="settings-opacity-value">${opacityPercent}%</span>
            </div>
          </div>

          <div class="settings-section-title">跳读</div>
          <div class="settings-row" data-setting="skipSpeed">
            <span class="settings-label">跳过速度</span>
            <span class="settings-value">${skLabel}</span>
          </div>
        </div>
      </div>
    `;

    // BGM slider
    const bgmSlider = this.el.querySelector('.settings-bgm-slider');
    const bgmValueEl = this.el.querySelector('.settings-bgm-value');
    if (bgmSlider) {
      bgmSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        const v = parseInt(e.target.value, 10);
        bgmValueEl.textContent = `${v * 10}%`;
        const current = this._mgr.get();
        current.bgmVolume = v;
        this._mgr.update(current);
      });
      bgmSlider.addEventListener('click', (e) => e.stopPropagation());
    }

    // Opacity slider
    const opSlider = this.el.querySelector('.settings-opacity-slider');
    const opValueEl = this.el.querySelector('.settings-opacity-value');
    if (opSlider) {
      opSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        const v = parseInt(e.target.value, 10);
        opValueEl.textContent = `${v}%`;
        const current = this._mgr.get();
        current.dialogueOpacity = v;
        this._mgr.update(current);
      });
      opSlider.addEventListener('click', (e) => e.stopPropagation());
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
      case 'fontSize': {
        const idx = FONT_SIZES.findIndex(t => t.id === s.fontSize);
        s.fontSize = FONT_SIZES[(idx + 1) % FONT_SIZES.length].id;
        break;
      }
      case 'skipSpeed': {
        const idx = SKIP_SPEEDS.findIndex(t => t.id === s.skipSpeed);
        s.skipSpeed = SKIP_SPEEDS[(idx + 1) % SKIP_SPEEDS.length].id;
        break;
      }
    }
    this._mgr.update(s);
    this._render();
  }

  destroy() { this.el.remove(); }
}
