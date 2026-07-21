export class ChapterSelectOverlay {
  constructor(container, { controller, onClose, onJump }) {
    this._controller = controller;
    this._onClose = onClose;
    this._onJump = onJump;

    this.el = document.createElement('div');
    this.el.className = 'overlay catalog-overlay';
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
      <div class="system-bg"><img src="../design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png" alt="" /></div>
      <div class="system-bg-overlay"></div>
      <div class="catalog-panel">
        <div class="catalog-header">
          <h2 class="catalog-title">章节目录</h2>
          <div class="catalog-desc">选择已解锁的章节重新阅读</div>
        </div>
        <div class="catalog-list">
    `;

    for (const chapter of unlocked) {
      for (let i = 0; i < chapter.sections.length; i++) {
        const section = chapter.sections[i];
        const isVisited = visited.has(section.startNode);
        if (!isVisited) continue;

        const isCurrent = this._isSectionCurrent(chapter, i, currentNodeId);
        const state = this._controller.getSectionState(chapter.id, i, section.startNode);
        const stateClass = isCurrent ? 'current' : (state === 'COMPLETED' ? 'completed' : (state === 'SKIPPED_COMPLETED' ? 'completed' : 'locked'));
        const stateLabel = isCurrent ? '进行中' : (state === 'COMPLETED' ? '已完成' : (state === 'SKIPPED_COMPLETED' ? '已跳过' : ''));
        const clickable = state === 'COMPLETED' || state === 'SKIPPED_COMPLETED' || isCurrent;

        html += `
          <div class="catalog-item cut-small ${stateClass} ${clickable ? 'clickable' : ''}"
               data-start="${section.startNode}" data-chapter="${chapter.id}" data-section="${i}">
            <div class="catalog-item-text">
              <span class="catalog-item-title">${section.title}</span>
              <span class="catalog-item-sub">${chapter.name}</span>
            </div>
            ${stateLabel ? `<span class="catalog-item-state ${stateClass}">${stateLabel}</span>` : ''}
          </div>
        `;
      }
    }

    html += `
        </div>
        <div class="catalog-actions">
          <span class="catalog-action-secondary" data-action="close">返回</span>
          <span class="catalog-action-primary" data-action="continue">继续当前章节</span>
        </div>
      </div>
    `;

    this.el.innerHTML = html;

    this.el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.closest('[data-action="close"]')) { this._onClose(); return; }
      if (e.target.closest('[data-action="continue"]')) { this._onClose(); return; }
      const node = e.target.closest('.catalog-item.clickable');
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
    return false;
  }

  destroy() { this.el.remove(); }
}
