export class TransitionCard {
  constructor(container) {
    this.el = document.createElement('div');
    this.el.style.display = 'none';
    this._onTap = null;
    this.el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this._onTap) this._onTap();
    });
    container.appendChild(this.el);
  }

  setOnTap(cb) { this._onTap = cb; }

  showChapterOpening({ chapterName, chapterTitle, timeRange }) {
    this.el.style.display = '';
    this.el.className = 'authority-chapter-opening';
    const eyebrow = this._chapterEyebrow(chapterName);
    this.el.innerHTML = `
      <div class="authority-opening-bg"></div>
      <div class="authority-opening-content">
        <div class="authority-opening-divider"></div>
        <div class="authority-opening-eyebrow">${eyebrow}</div>
        <div class="authority-opening-name">${chapterName}</div>
        <div class="authority-opening-title">${chapterTitle}</div>
        <div class="authority-opening-desc">轻触继续，进入本章内容。</div>
      </div>
      <div class="authority-opening-tap">轻触继续</div>
    `;
  }

  showChapterEnding({ chapterName, chapterTitle, nextLabel, onCatalog, onNext }) {
    this.el.style.display = '';
    this.el.className = 'authority-chapter-ending';
    this.el.innerHTML = `
      <div class="authority-ending-bg"></div>
      <div class="authority-ending-content">
        <div class="authority-clear-label">Chapter Clear</div>
        <div class="authority-clear-divider"></div>
        <div class="authority-clear-name">${chapterName}</div>
        <div class="authority-clear-title">${chapterTitle}</div>
        <div class="authority-clear-desc">本章完成。下一段故事已经在门后等着。</div>
      </div>
      <div class="authority-ending-actions">
        <div class="authority-ending-continue" data-action="next">${nextLabel || '进入下一章'}</div>
        <div class="authority-ending-home" data-action="catalog">返回主页</div>
      </div>
    `;

    this.el.querySelector('[data-action="catalog"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onCatalog) onCatalog();
    });
    this.el.querySelector('[data-action="next"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onNext) onNext();
    });
  }

  showSectionOpening({ chapterName, sectionTitle }) {
    this.el.style.display = '';
    this.el.className = 'authority-chapter-opening';
    this.el.innerHTML = `
      <div class="authority-opening-bg"></div>
      <div class="authority-opening-content">
        <div class="authority-opening-divider"></div>
        <div class="authority-opening-eyebrow">Section</div>
        <div class="authority-opening-name">${chapterName}</div>
        <div class="authority-opening-title">${sectionTitle}</div>
        <div class="authority-opening-desc">轻触继续，进入本节内容。</div>
      </div>
      <div class="authority-opening-tap">轻触继续</div>
    `;
    this.el.style.cursor = 'pointer';
  }

  showSectionEnding({ chapterName, sectionTitle, nextLabel, onCatalog, onNext }) {
    this.el.style.display = '';
    this.el.className = 'authority-chapter-ending';
    this.el.innerHTML = `
      <div class="authority-ending-bg"></div>
      <div class="authority-ending-content">
        <div class="authority-clear-label">Section Clear</div>
        <div class="authority-clear-divider"></div>
        <div class="authority-clear-name">${chapterName}</div>
        <div class="authority-clear-title">${sectionTitle}</div>
        <div class="authority-clear-desc">本节完成。下一段故事已经在门后等着。</div>
      </div>
      <div class="authority-ending-actions">
        <div class="authority-ending-continue" data-action="next">${nextLabel || '进入下一节'}</div>
        <div class="authority-ending-home" data-action="catalog">返回主页</div>
      </div>
    `;

    this.el.querySelector('[data-action="catalog"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onCatalog) onCatalog();
    });
    this.el.querySelector('[data-action="next"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onNext) onNext();
    });
  }

  hide() {
    this.el.style.display = 'none';
    this.el.innerHTML = '';
  }

  _chapterEyebrow(chapterName) {
    const map = { '一': '01', '二': '02', '三': '03', '四': '04', '五': '05', '六': '06', '七': '07', '八': '08', '九': '09' };
    for (const [cn, num] of Object.entries(map)) {
      if (chapterName.includes(cn)) return `Chapter ${num}`;
    }
    return 'Chapter';
  }

  destroy() { this.el.remove(); }
}
