export class NarrationOverlay {
  constructor(container) {
    this.el = document.createElement('div');
    this.el.style.display = 'none';
    container.appendChild(this.el);
    this._mode = null;
    this._longPage = 0;
    this._longTexts = [];
    this._onTap = null;
    this._currentFullscreenText = '';
    this._onNarrationTap = null;

    // Fix: narration overlay blocks tap-area clicks (z-index 6 > 5).
    // Add click handler to forward taps to game's tap handling.
    this.el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this._onNarrationTap) this._onNarrationTap();
    });
  }

  showFullscreen(text) {
    if (this._mode === 'fullscreen' && this._currentFullscreenText === text) return;
    this._mode = 'fullscreen';
    this._currentFullscreenText = text;
    this.el.style.display = '';
    this.el.className = 'narration-fullscreen';
    this.el.innerHTML = `<div class="narration-fullscreen-text">${text}</div>`;
  }

  showLongNarration(texts, onDone) {
    if (this._mode === 'long' && this._longTexts === texts) return;
    this._mode = 'long';
    this._longTexts = texts;
    this._onTap = onDone;
    this.el.style.display = '';
    this._renderLongNarration();
  }

  handleTap() {
    if (this._mode === 'long') {
      this.hide();
      if (this._onTap) this._onTap();
      return true;
    }
    return false;
  }

  _renderLongNarration() {
    const paragraphs = this._longTexts.map(t => `<p>${t}</p>`).join('');
    this.el.className = 'long-narration';
    this.el.innerHTML = `
      <div class="long-narration-frame cut-medium">
        <div class="long-narration-text">${paragraphs}</div>
      </div>
    `;
  }

  hide() {
    this.el.style.display = 'none';
    this._mode = null;
  }

  get isActive() { return this._mode !== null; }

  setOnNarrationTap(cb) { this._onNarrationTap = cb; }

  destroy() { this.el.remove(); }
}
