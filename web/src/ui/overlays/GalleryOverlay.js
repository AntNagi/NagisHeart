const ENDINGS_DEF = [
  { id: 'end_true', tag: 'TRUE END', emoji: '💛', title: '世界第一，与你' },
  { id: 'end_good', tag: 'GOOD END', emoji: '💙', title: '那么完美，那么爱他' },
  { id: 'end_normal', tag: 'NORMAL END', emoji: '🤍', title: '普通情侣' },
  { id: 'end_bad', tag: 'BAD END', emoji: '🖤', title: '好麻烦' },
];

export class GalleryOverlay {
  constructor(container, { controller, onClose }) {
    this._controller = controller;
    this._onClose = onClose;
    this._tab = 'ending'; // 'ending' | 'cg'

    this.el = document.createElement('div');
    this.el.className = 'overlay gallery-overlay';
    container.appendChild(this.el);

    this._render();
  }

  _render() {
    const unlocked = this._controller.getUnlockedEndings();

    let tabsHtml = `
      <div class="gallery-tabs">
        <button class="gallery-tab ${this._tab === 'ending' ? 'active' : ''}" data-tab="ending">结局图鉴</button>
        <button class="gallery-tab ${this._tab === 'cg' ? 'active' : ''}" data-tab="cg">CG 图鉴</button>
      </div>
    `;

    let gridHtml = '';
    if (this._tab === 'ending') {
      gridHtml = this._renderEndings(unlocked);
    } else {
      gridHtml = this._renderCG();
    }

    this.el.innerHTML = `
      <div class="system-bg"><img src="../design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png" alt="" /></div>
      <div class="system-bg-overlay"></div>
      <div class="overlay-header" style="position:relative;z-index:1;">
        <button class="overlay-back-btn" data-action="close">←</button>
        <span class="overlay-title">回忆画廊</span>
        <span class="overlay-spacer"></span>
      </div>
      <div class="gallery-panel">
        ${tabsHtml}
        <div class="gallery-grid">
          ${gridHtml}
        </div>
      </div>
    `;

    this.el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.closest('[data-action="close"]')) { this._onClose(); return; }
      const tab = e.target.closest('[data-tab]');
      if (tab) {
        this._tab = tab.dataset.tab;
        this._render();
      }
    });
  }

  _renderEndings(unlocked) {
    return ENDINGS_DEF.map(end => {
      const isUnlocked = unlocked.has(end.id);
      if (isUnlocked) {
        return `
          <div class="gallery-card gallery-card-unlocked">
            <div class="gallery-card-emoji">${end.emoji}</div>
            <div class="gallery-card-tag">${end.tag}</div>
            <div class="gallery-card-title">${end.title}</div>
          </div>
        `;
      }
      return `
        <div class="gallery-card gallery-card-locked">
          <div class="gallery-card-emoji">🔒</div>
          <div class="gallery-card-title">???</div>
        </div>
      `;
    }).join('');
  }

  _renderCG() {
    // CG tracking not yet implemented — show empty state per §23.1
    return `<div class="gallery-empty">还没有解锁任何 CG。<br/>继续推进故事，Nagi 会慢慢向你靠近。</div>`;
  }

  destroy() { this.el.remove(); }
}
