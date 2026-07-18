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
    this._longPage = 0;
    this._onTap = onDone;
    this.el.style.display = '';
    this._renderLongPage();
  }

  handleTap() {
    if (this._mode === 'long') {
      this._longPage++;
      if (this._longPage >= this._longTexts.length) {
        this.hide();
        if (this._onTap) this._onTap();
        return true;
      }
      this._renderLongPage();
      return true;
    }
    return false;
  }

  _renderLongPage() {
    const text = this._longTexts[this._longPage] || '';
    const page = String(this._longPage + 1).padStart(2, '0');
    const total = String(this._longTexts.length).padStart(2, '0');
    this.el.className = 'long-narration';
    this.el.innerHTML = `
      <div class="long-narration-frame cut-medium">
        <div class="long-narration-text">${text}</div>
      </div>
      <div class="long-narration-pager">${page} / ${total}</div>
    `;
  }

  hide() {
    this.el.style.display = 'none';
    this._mode = null;
  }

  get isActive() { return this._mode !== null; }

  destroy() { this.el.remove(); }
}
