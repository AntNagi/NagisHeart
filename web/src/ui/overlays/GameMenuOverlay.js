export class GameMenuOverlay {
  constructor(container, { onSelect, onClose }) {
    this._onClose = onClose;

    this.el = document.createElement('div');
    this.el.className = 'overlay game-menu-overlay';

    this.el.innerHTML = `
      <div class="game-menu-backdrop"></div>
      <div class="game-menu-panel">
        <div class="game-menu-items">
          <button class="game-menu-btn" data-action="save">存档</button>
          <button class="game-menu-btn" data-action="load">读档</button>
          <button class="game-menu-btn" data-action="backlog">回顾</button>
          <button class="game-menu-btn" data-action="chapters">章节</button>
          <button class="game-menu-btn" data-action="settings">设置</button>
          <button class="game-menu-btn" data-action="title">标题</button>
        </div>
        <button class="game-menu-close" data-action="close">返回</button>
      </div>
    `;

    this.el.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (!action) return;
      if (action === 'close') { this._onClose(); return; }
      if (onSelect) onSelect(action);
    });

    this.el.querySelector('.game-menu-backdrop').addEventListener('click', (e) => {
      e.stopPropagation();
      this._onClose();
    });

    container.appendChild(this.el);
  }

  destroy() { this.el.remove(); }
}
