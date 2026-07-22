import { NagiDialog } from '../components/NagiDialog.js';

export class PrologueScreen {
  constructor(container, ctx) {
    this._ctx = ctx;
    this._lines = ctx.controller.getPrologueLines();
    this._index = 0;

    this.el = document.createElement('div');
    this.el.className = 'screen prologue-screen screen-enter';

    this.el.innerHTML = `
      <div class="system-bg">
        <img src="../design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png" alt="" />
      </div>
      <div class="system-bg-overlay splash"></div>
      <button class="prologue-skip-btn">跳过</button>
      <div class="prologue-counter"></div>
      <div class="prologue-text"></div>
      <div class="prologue-hint">轻触继续</div>
    `;

    this._textEl = this.el.querySelector('.prologue-text');
    this._counterEl = this.el.querySelector('.prologue-counter');
    const skipBtn = this.el.querySelector('.prologue-skip-btn');

    this.el.addEventListener('click', (e) => {
      if (e.target.closest('.prologue-skip-btn')) return;
      this._advance();
    });

    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      NagiDialog.show(this.el, {
        title: '跳过开场白？',
        body: '跳过后将直接进入名字设置。',
        dismiss: '取消',
        confirm: '确认跳过',
        onDismiss: () => {},
        onConfirm: () => { this._ctx.router.navigate('nameSetup'); },
      });
    });

    container.appendChild(this.el);
    this._showLine();
  }

  _showLine() {
    if (this._index >= this._lines.length) {
      this._ctx.router.navigate('nameSetup');
      return;
    }
    this._counterEl.textContent = `开场白 ${String(this._index + 1).padStart(2, '0')} / ${String(this._lines.length).padStart(2, '0')}`;
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
