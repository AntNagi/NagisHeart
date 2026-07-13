export class ChoicePanel {
  constructor(container) {
    this.el = document.createElement('div');
    this.el.className = 'choice-panel';
    this.el.style.display = 'none';
    container.appendChild(this.el);
    this._onSelect = null;
  }

  show(choices, onSelect) {
    this._onSelect = onSelect;
    this.el.style.display = '';
    this.el.innerHTML = choices.map((c, i) =>
      `<button class="choice-button" data-index="${i}">${c.label}</button>`
    ).join('');

    this.el.querySelectorAll('.choice-button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.index, 10);
        this.hide();
        if (this._onSelect) this._onSelect(idx);
      });
    });
  }

  hide() {
    this.el.style.display = 'none';
    this.el.innerHTML = '';
  }

  destroy() { this.el.remove(); }
}
