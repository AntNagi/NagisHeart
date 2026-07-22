// Memory items: CG and END mixed in single grid per HTML authority
const MEMORY_ITEMS = [
  // CG items (placeholder - actual CG tracking not implemented)
  { type: 'cg', id: 'cg_01', label: 'CG 01', img: null },
  { type: 'cg', id: 'cg_02', label: 'CG 02', img: null },
  // END items
  { type: 'end', id: 'end_true', label: 'TRUE END', img: null },
  { type: 'end', id: 'end_good', label: 'GOOD END', img: null },
  { type: 'end', id: 'end_normal', label: 'NORMAL END', img: null },
  { type: 'end', id: 'end_bad', label: 'BAD END', img: null },
];

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
    const unlockedEndings = this._controller.getUnlockedEndings();

    const cardsHtml = MEMORY_ITEMS.map(item => {
      const isUnlocked = item.type === 'end' ? unlockedEndings.has(item.id) : false;
      
      if (isUnlocked) {
        return `
          <div class="memory-card" ${item.img ? `style="--img:url('${item.img}')"` : ''}>
            ${item.label}
            <span>已解锁</span>
          </div>
        `;
      }
      return `
        <div class="memory-card locked">
          ???
          <span>未解锁</span>
        </div>
      `;
    }).join('');

    this.el.innerHTML = `
      <div class="system-bg"><img src="../design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png" alt="" /></div>
      <div class="system-bg-overlay"></div>
      <div class="overlay-header">
        <button class="overlay-back-btn" data-action="close">←</button>
        <span class="overlay-title">回忆画廊</span>
        <span class="overlay-spacer"></span>
      </div>
      <div class="overlay-body">
        <h2 class="overlay-heading">回忆画廊</h2>
        <div class="gallery-grid">
          ${cardsHtml}
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
