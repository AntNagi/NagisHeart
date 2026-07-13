const KEY = 'nagi_settings';

const TEXT_SPEEDS = [
  { id: 'Slow', label: '慢', charDelayMs: 60 },
  { id: 'Normal', label: '正常', charDelayMs: 30 },
  { id: 'Fast', label: '快', charDelayMs: 10 },
  { id: 'Instant', label: '立即显示', charDelayMs: 0 },
];

const DISPLAY_THEMES = [
  { id: 'Dark', label: '深色' },
  { id: 'Light', label: '浅色' },
];

export { TEXT_SPEEDS, DISPLAY_THEMES };

export class SettingsManager {
  constructor() {
    this._settings = this._load();
  }

  get() { return { ...this._settings }; }

  update(partial) {
    Object.assign(this._settings, partial);
    this._save();
  }

  getTextSpeedMs() {
    const entry = TEXT_SPEEDS.find(s => s.id === this._settings.textSpeed);
    return entry ? entry.charDelayMs : 30;
  }

  getAutoDelayMs() {
    return 1000 + (5 - this._settings.autoSpeed) * 500;
  }

  _load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      if (raw) return { ...this._defaults(), ...raw };
    } catch {}
    return this._defaults();
  }

  _save() {
    localStorage.setItem(KEY, JSON.stringify(this._settings));
  }

  _defaults() {
    return {
      textSpeed: 'Normal',
      autoSpeed: 3,
      displayTheme: 'Dark',
    };
  }
}
