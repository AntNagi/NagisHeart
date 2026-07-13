export class ChapterSelectOverlay {
  constructor(container, { controller, onClose, onJump }) {
    this._controller = controller;
    this._onClose = onClose;
    this._onJump = onJump;

    this.el = document.createElement('div');
    this.el.className = 'overlay chapter-select-overlay';
    container.appendChild(this.el);

    this._render();
  }

  _render() {
    const chapters = this._controller.getChapters();
    const visited = this._controller.getVisitedNodes();
    const currentNodeId = this._controller.state.currentNodeId;

    const unlocked = chapters.filter(ch =>
      ch.id !== 'prologue' && ch.sections.some(s => visited.has(s.startNode))
    );

    let html = `
      <div class="overlay-header">
        <button class="overlay-back-btn" data-action="close">←</button>
        <span class="overlay-title">章节目录</span>
        <span class="overlay-spacer"></span>
      </div>
      <div class="overlay-body">
        <h2 class="overlay-heading">章节目录</h2>
        <div class="chapter-timeline">
    `;

    for (const chapter of unlocked) {
      for (let i = 0; i < chapter.sections.length; i++) {
        const section = chapter.sections[i];
        const isVisited = visited.has(section.startNode);
        if (!isVisited) continue;

        const isCurrent = this._isSectionCurrent(chapter, i, currentNodeId);
        const state = this._controller.getSectionState(chapter.id, i, section.startNode);
        const stateClass = isCurrent ? 'in-progress' : (state === 'COMPLETED' ? 'completed' : (state === 'SKIPPED_COMPLETED' ? 'skipped' : 'locked'));
        const stateLabel = isCurrent ? '进行中' : (state === 'COMPLETED' ? '已完成' : (state === 'SKIPPED_COMPLETED' ? '已跳过' : ''));
        const clickable = state === 'COMPLETED' || state === 'SKIPPED_COMPLETED' || isCurrent;

        html += `
          <div class="timeline-node ${stateClass} ${clickable ? 'clickable' : ''}"
               data-start="${section.startNode}" data-chapter="${chapter.id}" data-section="${i}">
            <div class="timeline-diamond"></div>
            <div class="timeline-content">
              <div class="timeline-title-row">
                <span class="timeline-title">${section.title}</span>
                ${stateLabel ? `<span class="timeline-state">${stateLabel}</span>` : ''}
              </div>
              <div class="timeline-subtitle">${chapter.name}</div>
            </div>
          </div>
        `;
      }
    }

    html += '</div></div>';
    this.el.innerHTML = html;

    this.el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.closest('[data-action="close"]')) { this._onClose(); return; }
      const node = e.target.closest('.timeline-node.clickable');
      if (node) {
        const startNode = node.dataset.start;
        const chapterId = node.dataset.chapter;
        const sectionIdx = parseInt(node.dataset.section, 10);
        if (this._onJump) this._onJump(startNode, chapterId, sectionIdx);
      }
    });
  }

  _isSectionCurrent(chapter, sectionIndex, currentNodeId) {
    const section = chapter.sections[sectionIndex];
    if (!section) return false;
    if (section.startNode === currentNodeId) return true;
    if (section.altStartNode === currentNodeId) return true;
    const nextSection = chapter.sections[sectionIndex + 1];
    if (!nextSection) return false;
    return false;
  }

  destroy() { this.el.remove(); }
}
