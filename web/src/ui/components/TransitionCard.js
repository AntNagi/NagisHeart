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
    this.el.className = 'chapter-card';
    this.el.innerHTML = `
      <div class="chapter-card-backing cut-medium">
        <div class="chapter-card-kicker">CHAPTER</div>
        <div class="chapter-card-name">${chapterName}</div>
        <div class="chapter-card-title">${chapterTitle}</div>
        ${timeRange ? `<div class="chapter-card-time">${timeRange}</div>` : ''}
        <div class="chapter-card-hint">轻触继续</div>
      </div>
    `;
  }

  showChapterEnding({ chapterName, chapterTitle, nextLabel, onCatalog, onNext }) {
    this.el.style.display = '';
    this.el.className = 'chapter-ending-card';
    this.el.innerHTML = `
      <div class="chapter-ending-overlay"></div>
      <div class="clear-card cut-medium">
        <div class="clear-card-label">CHAPTER CLEAR</div>
        <div class="clear-card-title">${chapterName}</div>
        <div class="clear-card-subtitle">${chapterTitle}</div>
        <div class="clear-card-body">本章已完成，可返回目录或继续下一章。</div>
        <div class="clear-card-actions">
          <span class="clear-card-action-secondary" data-action="catalog">返回目录</span>
          <span class="clear-card-action-primary" data-action="next">${nextLabel || '继续下一章'}</span>
        </div>
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
    this.el.className = 'chapter-card';
    this.el.innerHTML = `
      <div class="chapter-card-backing cut-medium">
        <div class="chapter-card-kicker">SECTION</div>
        <div class="chapter-card-name">${chapterName}</div>
        <div class="chapter-card-title">${sectionTitle}</div>
        <div class="chapter-card-hint">轻触继续</div>
      </div>
    `;
    this.el.style.cursor = 'pointer';
  }

  showSectionEnding({ chapterName, sectionTitle, nextLabel, onCatalog, onNext }) {
    this.el.style.display = '';
    this.el.className = 'chapter-ending-card';
    this.el.innerHTML = `
      <div class="chapter-ending-overlay"></div>
      <div class="clear-card cut-medium">
        <div class="clear-card-label">SECTION CLEAR</div>
        <div class="clear-card-title">${chapterName}</div>
        <div class="clear-card-subtitle">${sectionTitle}</div>
        <div class="clear-card-body">本节已完成，可返回目录或继续下一节。</div>
        <div class="clear-card-actions">
          <span class="clear-card-action-secondary" data-action="catalog">返回目录</span>
          <span class="clear-card-action-primary" data-action="next">${nextLabel || '进入下一节'}</span>
        </div>
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

  destroy() { this.el.remove(); }
}
