export class AudioManager {
  constructor(settingsManager) {
    this._settings = settingsManager;
    this._audio = null;
    this._currentSrc = null;
    this._unlocked = false;

    this._applyVolume();
    this._settings.onBgmVolumeChange(() => this._applyVolume());

    const unlock = () => {
      this._unlocked = true;
      if (this._audio && this._audio.paused && this._settings.getBgmVolume() > 0) {
        this._audio.play().catch(() => {});
      }
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });
  }

  play(bgmPath) {
    if (!bgmPath) return;

    const src = `../assets/bgm.mp3`;

    if (this._currentSrc === src && this._audio) {
      if (this._audio.paused && this._unlocked && this._settings.getBgmVolume() > 0) {
        this._audio.play().catch(() => {});
      }
      return;
    }

    this.stop();
    this._currentSrc = src;
    this._audio = new Audio(src);
    this._audio.loop = true;
    this._applyVolume();

    if (this._unlocked && this._settings.getBgmVolume() > 0) {
      this._audio.play().catch(() => {});
    }
  }

  stop() {
    if (this._audio) {
      this._audio.pause();
      this._audio.src = '';
      this._audio = null;
      this._currentSrc = null;
    }
  }

  _applyVolume() {
    if (this._audio) {
      const vol = this._settings.getBgmVolume() / 10;
      this._audio.volume = vol;
      if (vol === 0 && !this._audio.paused) {
        this._audio.pause();
      } else if (vol > 0 && this._audio.paused && this._unlocked) {
        this._audio.play().catch(() => {});
      }
    }
  }
}
