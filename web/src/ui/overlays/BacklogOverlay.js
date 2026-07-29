export class BacklogOverlay {
  constructor(container, { controller, onClose }) {
    this._onClose = onClose;
    this._entries = controller.getBacklog();
    this._pageSize = 9;
    this._totalPages = Math.max(1, Math.ceil(this._entries.length / this._pageSize));
    this._currentPage = this._totalPages - 1;

    this.el = document.createElement('div');
    this.el.className = 'overlay backlog-overlay';
    container.appendChild(this.el);

    this._touchStartX = 0;
    this._touchDeltaX = 0;

    this._render();
    this._bindEvents();
  }

  _render() {
    const start = this._currentPage * this._pageSize;
    const pageEntries = this._entries.slice(start, start + this._pageSize);

    let html = `
      <div class="overlay-header">
        <button class="overlay-back-btn" data-action="close" aria-label="返回">←</button>
        <span class="overlay-title">剧情回顾</span>
        <span class="overlay-spacer"></span>
      </div>
      <div class="recap-page">
        <div class="recap-inner">
    `;

    if (this._entries.length === 0) {
      html += '<div class="backlog-empty">暂无记录</div>';
    } else {
      let prevKind = '';
      let prevSpeaker = '';

      for (const e of pageEntries) {
        if (e.isChoice) {
          html += `<p class="recap-narr recap-choice">${e.text}</p>`;
          prevKind = 'narr';
          prevSpeaker = '';
          continue;
        }

        if (e.speaker) {
          const isContinuation = prevKind === 'dialogue' && prevSpeaker === e.speaker;
          html += `<div class="recap-line${isContinuation ? ' cont' : ''}">`;
          if (!isContinuation) html += `<p class="recap-who">${e.speaker}</p>`;
          html += `<p class="recap-say">${e.text}</p></div>`;
          prevKind = 'dialogue';
          prevSpeaker = e.speaker;
        } else {
          html += `<p class="recap-narr">${e.text}</p>`;
          prevKind = 'narr';
          prevSpeaker = '';
        }
      }
    }

    html += '</div></div>';

    if (this._totalPages > 1) {
      html += `<div class="backlog-pager">${this._currentPage + 1} / ${this._totalPages}</div>`;
    }

    this.el.innerHTML = html;
  }

  _bindEvents() {
    this.el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.closest('[data-action="close"]')) this._onClose();
    });

    this.el.addEventListener('touchstart', (e) => {
      this._touchStartX = e.touches[0].clientX;
      this._touchDeltaX = 0;
    }, { passive: true });

    this.el.addEventListener('touchmove', (e) => {
      this._touchDeltaX = e.touches[0].clientX - this._touchStartX;
    }, { passive: true });

    this.el.addEventListener('touchend', () => {
      if (Math.abs(this._touchDeltaX) > 50) {
        if (this._touchDeltaX < 0 && this._currentPage < this._totalPages - 1) {
          this._currentPage++;
          this._render();
        } else if (this._touchDeltaX > 0 && this._currentPage > 0) {
          this._currentPage--;
          this._render();
        }
      }
      this._touchDeltaX = 0;
    });
  }

  destroy() { this.el.remove(); }
}
