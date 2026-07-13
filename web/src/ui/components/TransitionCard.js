export class TransitionCard {
  constructor(container) {
    this.el = document.createElement('div');
    this.el.style.display = 'none';
    container.appendChild(this.el);
  }

  showChapterOpening({ chapterName, chapterTitle, timeRange }) {
    this.el.style.display = '';
    this.el.className = 'chapter-card';
    this.el.innerHTML = `
      <div class="chapter-card-kicker">CHAPTER</div>
      <div class="chapter-card-name">${chapterName}</div>
      <div class="chapter-card-title">${chapterTitle}</div>
      ${timeRange ? `<div class="chapter-card-time">${timeRange}</div>` : ''}
      <div class="chapter-card-hint">点击继续</div>
    `;
  }

  showChapterEnding({ chapterName, chapterTitle, timeRange, bgPath }) {
    this.el.style.display = '';
    this.el.className = 'chapter-ending-card';
    this.el.innerHTML = `
      <div class="chapter-ending-overlay"></div>
      <div class="chapter-ending-content">
        <div class="chapter-card-kicker">CHAPTER CLEAR</div>
        <div class="chapter-card-name">${chapterName}</div>
        <div class="chapter-card-title">${chapterTitle}</div>
        ${timeRange ? `<div class="chapter-card-time">${timeRange}</div>` : ''}
        <div class="chapter-card-hint">点击继续</div>
      </div>
    `;
  }

  showSectionOpening({ chapterName, sectionTitle }) {
    this.el.style.display = '';
    this.el.className = 'chapter-card';
    this.el.innerHTML = `
      <div class="chapter-card-kicker">SECTION</div>
      <div class="chapter-card-name">${chapterName}</div>
      <div class="chapter-card-title">${sectionTitle}</div>
      <div class="chapter-card-hint">点击继续</div>
    `;
  }

  hide() {
    this.el.style.display = 'none';
    this.el.innerHTML = '';
  }

  destroy() { this.el.remove(); }
}
