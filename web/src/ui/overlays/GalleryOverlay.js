// Latest UI authority: the gallery is a four-ending wall, without regular CG cards.
const ENDING_ITEMS = [
  {
    id: 'end_true',
    tag: 'TRUE END',
    title: '世界第一，与他',
    description: '你看见他的光，也承认那束光不是你制造的。于是他回头时，看见的也不是归处，而是同样站在光里的你。',
    img: '../../assets/bg/true_end.jpg',
    crop: 'center 34%',
  },
  {
    id: 'end_good',
    tag: 'GOOD END',
    title: '那么完美，那么爱他',
    description: '世界看见了他，你也完成了最漂亮的陪伴。爱是真的，光也是真的，只是还有一点话没有说到最深处。',
    img: '../../assets/bg/king.jpg',
    crop: 'center 30%',
    longTitle: true,
  },
  {
    id: 'end_normal',
    tag: 'NORMAL END',
    title: '普通情侣',
    description: '没有到最远处，也没有失去彼此。他把更多日子留给了你，这是普通情侣的春天。',
    img: '../../assets/bg/ending_true_nagi_soft_gaze.jpg',
    crop: 'center 18%',
  },
  {
    id: 'end_bad',
    tag: 'BAD END',
    title: '好麻烦',
    description: '他后来仍然赢了，甚至走向世界中心。但这一次，他不再让你靠近自己的世界。',
    img: '../../assets/bg/goal_faraway.jpg',
    crop: 'center 64%',
  },
];

export class GalleryOverlay {
  constructor(container, { controller, onClose, onReplayEnding }) {
    this._controller = controller;
    this._onClose = onClose;
    this._onReplayEnding = onReplayEnding;
    this._selectedItem = null;

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
          ${isUnlocked ? `<button class="memory-card-hit" data-action="detail" data-ending="${item.id}" aria-label="${item.tag} 详情"></button>` : ''}
        </div>
      `;
    }).join('');

    const detailHtml = this._selectedItem ? this._renderDetail(this._selectedItem) : '';

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
      ${detailHtml}
    `;

    this.el.onclick = (e) => {
      e.stopPropagation();
      if (e.target.closest('[data-action="close"]')) { this._onClose(); return; }
      if (e.target.closest('[data-action="detail"]')) {
        const endingId = e.target.closest('[data-action="detail"]').dataset.ending;
        const item = ENDING_ITEMS.find(it => it.id === endingId);
        if (item) {
          this._selectedItem = item;
          this._render();
        }
        return;
      }
      if (e.target.closest('[data-action="detail-close"]')) {
        this._selectedItem = null;
        this._render();
        return;
      }
      if (e.target.closest('[data-action="replay-ending"]')) {
        const endingId = e.target.closest('[data-action="replay-ending"]').dataset.ending;
        if (this._onReplayEnding) this._onReplayEnding(endingId);
        return;
      }
    };
  }

  _renderDetail(item) {
    return `
      <div class="gallery-detail">
        <div class="gallery-detail-bg" style="--img:url('${item.img}');--crop:${item.crop}"></div>
        <div class="gallery-detail-content">
          <div class="gallery-detail-tag">${item.tag}</div>
          <div class="gallery-detail-line"></div>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="gallery-detail-status">已解锁：${item.tag} / 回忆画廊</div>
          <button class="gallery-detail-action" data-action="replay-ending" data-ending="${item.id}">回看终章</button>
          <button class="gallery-detail-back" data-action="detail-close">返回画廊</button>
        </div>
      </div>
    `;
  }

  destroy() { this.el.remove(); }
}
