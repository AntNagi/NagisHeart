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

const FONT_SIZES = [
  { id: 'Small', label: '小', scale: 0.9 },
  { id: 'Normal', label: '标准', scale: 1.0 },
  { id: 'Large', label: '大', scale: 1.15 },
];

const SKIP_SPEEDS = [
  { id: 'Normal', label: '正常', delayMs: 50 },
  { id: 'Fast', label: '快速', delayMs: 20 },
  { id: 'Instant', label: '瞬间', delayMs: 0 },
];

export { TEXT_SPEEDS, DISPLAY_THEMES, FONT_SIZES, SKIP_SPEEDS };

export class SettingsManager {
  constructor() {
    this._settings = this._load();
    this._listeners = [];
  }

  get() { return { ...this._settings }; }

  update(partial) {
    Object.assign(this._settings, partial);
    this._save();
    this._notify();
  }

  getTextSpeedMs() {
    const entry = TEXT_SPEEDS.find(s => s.id === this._settings.textSpeed);
    return entry ? entry.charDelayMs : 30;
  }

  getAutoDelayMs() {
    return 1000 + (5 - this._settings.autoSpeed) * 500;
  }

  getBgmVolume() {
    return this._settings.bgmVolume;
  }

  getFontSizeScale() {
    const entry = FONT_SIZES.find(s => s.id === this._settings.fontSize);
    return entry ? entry.scale : 1.0;
  }

  getSkipDelayMs() {
    const entry = SKIP_SPEEDS.find(s => s.id === this._settings.skipSpeed);
    return entry ? entry.delayMs : 50;
  }

  getDialogueOpacity() {
    return this._settings.dialogueOpacity;
  }

  onBgmVolumeChange(cb) {
    this._listeners.push(cb);
  }

  _notify() {
    for (const cb of this._listeners) cb(this._settings);
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
      bgmVolume: 5,
      fontSize: 'Normal',
      dialogueOpacity: 80,
      skipSpeed: 'Normal',
    };
  }
}
