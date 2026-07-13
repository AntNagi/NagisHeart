export class PrologueScreen {
  constructor(container, ctx) {
    this._ctx = ctx;
    this._lines = ctx.controller.getPrologueLines();
    this._index = 0;
    this._done = false;

    this.el = document.createElement('div');
    this.el.className = 'screen prologue-screen screen-enter';

    this._textEl = document.createElement('div');
    this._textEl.className = 'prologue-text';
    this.el.appendChild(this._textEl);

    this.el.addEventListener('click', () => this._advance());
    container.appendChild(this.el);

    this._showLine();
  }

  _showLine() {
    if (this._index >= this._lines.length) {
      this._ctx.router.navigate('nameSetup');
      return;
    }
    this._textEl.classList.remove('visible');
    setTimeout(() => {
      this._textEl.textContent = this._lines[this._index].text;
      this._textEl.classList.add('visible');
    }, 50);
  }

  _advance() {
    this._index++;
    this._showLine();
  }

  destroy() { this.el.remove(); }
}
