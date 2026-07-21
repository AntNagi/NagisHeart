export class GalleryOverlay {
  constructor(container, { controller, onClose }) {
    this._controller = controller;
    this._onClose = onClose;

    this.el = document.createElement('div');
    this.el.className = 'overlay gallery-overlay';
    container.appendChild(this.el);

    this._render();
  }

  _render() {
    this.el.innerHTML = `
      <div class="system-bg"><img src="../design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png" alt="" /></div>
      <div class="system-bg-overlay"></div>
      <div class="overlay-header" style="position:relative;z-index:1;">
        <button class="overlay-back-btn" data-action="close">←</button>
        <span class="overlay-title">回忆画廊</span>
        <span class="overlay-spacer"></span>
      </div>
      <div class="gallery-panel">
        <h2 class="overlay-heading">回忆画廊</h2>
        <div class="gallery-grid">
          <div class="gallery-empty">尚未解锁任何回忆</div>
        </div>
      </div>
    `;

    this.el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.closest('[data-action="close"]')) { this._onClose(); return; }
    });
  }

  destroy() { this.el.remove(); }
}
