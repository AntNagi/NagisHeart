export class BacklogOverlay {
  constructor(container, { controller, onClose }) {
    this._onClose = onClose;
    this._entries = controller.getBacklog();
    this._pageSize = 8;
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
        <button class="overlay-back-btn" data-action="close">←</button>
        <span class="overlay-title">剧情回顾</span>
        <span class="overlay-spacer"></span>
      </div>
      <div class="backlog-body">
    `;

    if (this._entries.length === 0) {
      html += '<div class="backlog-empty">暂无记录</div>';
    } else {
      for (let i = 0; i < pageEntries.length; i++) {
        const e = pageEntries[i];
        const isFirst = i === 0;
        html += '<div class="backlog-entry">';
        if (e.speaker) {
          html += `${!isFirst ? '<div class="backlog-gap"></div>' : ''}
            <div class="backlog-speaker">${e.speaker}</div>`;
        } else if (!isFirst) {
          html += '<div class="backlog-gap-sm"></div>';
        }
        html += `<div class="backlog-text">${e.text}</div></div>`;
      }
    }

    html += '</div>';

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
          this._bindEvents();
        } else if (this._touchDeltaX > 0 && this._currentPage > 0) {
          this._currentPage--;
          this._render();
          this._bindEvents();
        }
      }
      this._touchDeltaX = 0;
    });
  }

  destroy() { this.el.remove(); }
}
