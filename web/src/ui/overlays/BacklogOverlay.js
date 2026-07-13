export class BacklogOverlay {
  constructor(container, { controller, onClose }) {
    this._onClose = onClose;

    this.el = document.createElement('div');
    this.el.className = 'overlay backlog-overlay';
    container.appendChild(this.el);

    const entries = controller.getBacklog();

    let html = `
      <div class="overlay-header">
        <button class="overlay-back-btn" data-action="close">←</button>
        <span class="overlay-title">剧情回顾</span>
        <span class="overlay-spacer"></span>
      </div>
      <div class="backlog-body">
    `;

    if (entries.length === 0) {
      html += '<div class="backlog-empty">暂无记录</div>';
    } else {
      for (let i = 0; i < entries.length; i++) {
        const e = entries[i];
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
    this.el.innerHTML = html;

    this.el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.closest('[data-action="close"]')) this._onClose();
    });

    const body = this.el.querySelector('.backlog-body');
    if (body) body.scrollTop = body.scrollHeight;
  }

  destroy() { this.el.remove(); }
}
