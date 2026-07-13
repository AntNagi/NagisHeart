export class DialogueBox {
  constructor(container) {
    this.el = document.createElement('div');
    this.el.className = 'dialogue-box';
    this.el.style.display = 'none';
    this.el.innerHTML = `
      <div class="dialogue-speaker"></div>
      <div class="dialogue-text"></div>
      <div class="dialogue-continue"></div>
    `;
    this._speakerEl = this.el.querySelector('.dialogue-speaker');
    this._textEl = this.el.querySelector('.dialogue-text');
    container.appendChild(this.el);
    this._typewriterTimer = null;
    this._currentText = '';
  }

  update({ speaker, text, display }) {
    if (display !== 'bottom') {
      this.hide();
      return;
    }
    this.show();
    this._speakerEl.textContent = speaker || '';
    this._speakerEl.style.display = speaker ? '' : 'none';
    if (text !== this._currentText) {
      this._currentText = text;
      this._animateText(text);
    }
  }

  _animateText(text) {
    if (this._typewriterTimer) {
      clearTimeout(this._typewriterTimer);
      this._typewriterTimer = null;
    }
    const chars = [...text];
    let i = 0;
    this._textEl.textContent = '';
    const step = () => {
      i += 1;
      this._textEl.textContent = chars.slice(0, i).join('');
      if (i < chars.length) {
        this._typewriterTimer = setTimeout(step, 16);
      } else {
        this._typewriterTimer = null;
      }
    };
    if (chars.length > 0) {
      this._typewriterTimer = setTimeout(step, 16);
    }
  }

  show() { this.el.style.display = ''; }
  hide() { this.el.style.display = 'none'; }
  destroy() {
    if (this._typewriterTimer) clearTimeout(this._typewriterTimer);
    this.el.remove();
  }
}
