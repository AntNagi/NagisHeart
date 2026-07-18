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

    const filtered = choices
      .map((c, i) => ({ ...c, originalIndex: i }))
      .filter(c => {
        const label = (c.label || '').trim();
        if (!label) return false;
        if (label === '->') return false;
        if (c.autoAdvance) return false;
        return true;
      });

    if (filtered.length === 0) {
      if (choices.length > 0) {
        onSelect(0);
      }
      return;
    }

    this.el.style.display = '';
    this.el.innerHTML = filtered.map(c =>
      `<button class="choice-button" data-index="${c.originalIndex}">${c.label}</button>`
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
