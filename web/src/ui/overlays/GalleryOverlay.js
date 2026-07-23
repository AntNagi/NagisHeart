// Memory items: CG and END mixed in single grid per HTML authority
// Ending cards use BG image + bottom scrim + tag/title per Android TASK-20260723-002
const MEMORY_ITEMS = [
  // CG items (placeholder - actual CG tracking not implemented)
  { type: 'cg', id: 'cg_01', label: 'CG 01', img: null },
  { type: 'cg', id: 'cg_02', label: 'CG 02', img: null },
  // END items — with BG and crop rule per ending mood
  { type: 'end', id: 'end_true', label: 'TRUE END', mood: 'true',
    img: 'assets/bg/true_end.jpg', cropY: '35%' },
  { type: 'end', id: 'end_good', label: 'GOOD END', mood: 'good',
    img: 'assets/bg/king.jpg', cropY: '35%' },
  { type: 'end', id: 'end_normal', label: 'NORMAL END', mood: 'normal',
    img: 'assets/bg/ending_true_nagi_soft_gaze.jpg', cropY: '21%' },
  { type: 'end', id: 'end_bad', label: 'BAD END', mood: 'bad',
    img: 'assets/bg/goal_faraway.jpg', cropY: '35%' },
];

// Ending definitions for tag + title display
const ENDING_DEFS = {
  end_true:   { tag: 'TRUE END',   title: '世界第一，与你' },
  end_good:   { tag: 'GOOD END',   title: '那么完美，那么爱他' },
  end_normal: { tag: 'NORMAL END', title: '普通情侣' },
  end_bad:    { tag: 'BAD END',    title: '好麻烦' },
};

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
      
      if (item.type === 'end' && isUnlocked) {
        const def = ENDING_DEFS[item.id] || { tag: item.label, title: '' };
        return `
          <div class="memory-card ending-card" style="--img:url('${item.img}');--crop-y:${item.cropY || '35%'}">
            <div class="ending-card-scrim"></div>
            <div class="ending-card-info">
              <span class="ending-card-tag">${def.tag}</span>
              <span class="ending-card-title">${def.title}</span>
            </div>
          </div>
        `;
      }
      if (item.type === 'end' && !isUnlocked) {
        return `
          <div class="memory-card locked">
            ???
            <span>未解锁</span>
          </div>
        `;
      }
      // CG card (placeholder)
      return `
        <div class="memory-card cg-card locked">
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
