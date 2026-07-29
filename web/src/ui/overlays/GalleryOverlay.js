// Latest UI authority: the gallery is a four-ending wall, without regular CG cards.
const ENDING_ITEMS = [
  {
    id: 'end_true',
    tag: 'TRUE END',
    title: '世界第一，与他',
    img: '../../assets/bg/true_end.jpg',
    crop: 'center 34%',
  },
  {
    id: 'end_good',
    tag: 'GOOD END',
    title: '那么完美，那么爱他',
    img: '../../assets/bg/king.jpg',
    crop: 'center 30%',
    longTitle: true,
  },
  {
    id: 'end_normal',
    tag: 'NORMAL END',
    title: '普通情侣',
    img: '../../assets/bg/ending_true_nagi_soft_gaze.jpg',
    crop: 'center 18%',
  },
  {
    id: 'end_bad',
    tag: 'BAD END',
    title: '好麻烦',
    img: '../../assets/bg/goal_faraway.jpg',
    crop: 'center 64%',
  },
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
    const unlockedCount = ENDING_ITEMS.filter(item => unlockedEndings.has(item.id)).length;

    const cardsHtml = ENDING_ITEMS.map(item => {
      const isUnlocked = unlockedEndings.has(item.id);
      const cardStyle = isUnlocked
        ? ` style="--img:url('${item.img}');--crop:${item.crop}"`
        : '';

      return `
        <div class="memory-card ending-memory${isUnlocked ? '' : ' locked'}"${cardStyle}>
          <div class="ending-tag">${isUnlocked ? item.tag : '???'}</div>
          <div class="ending-title${item.longTitle ? ' long' : ''}">${isUnlocked ? item.title : '未解锁'}</div>
        </div>
      `;
    }).join('');

    this.el.innerHTML = `
      <div class="system-bg"><img src="../design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png" alt="" /></div>
      <div class="system-bg-overlay"></div>
      <div class="overlay-header">
        <button class="overlay-back-btn" data-action="close" aria-label="返回">←</button>
        <span class="overlay-title" aria-hidden="true"></span>
        <span class="overlay-spacer"></span>
      </div>
      <div class="overlay-body">
        <div class="gallery-hero">
          <h2>回忆画廊</h2>
          <small>已解锁 ${unlockedCount} / ${ENDING_ITEMS.length}</small>
        </div>
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
