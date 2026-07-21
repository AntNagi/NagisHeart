import { NagiDialog } from '../components/NagiDialog.js';

export class SaveLoadOverlay {
  constructor(container, { controller, mode, onClose, onLoaded }) {
    this._controller = controller;
    this._mode = mode;
    this._onClose = onClose;
    this._onLoaded = onLoaded;
    this._container = container;

    this.el = document.createElement('div');
    this.el.className = 'overlay save-load-overlay';
    container.appendChild(this.el);

    this._render();
  }

  async _render() {
    const isSave = this._mode === 'save';
    const slots = await this._controller.getSaveSlots();

    let html = `
      <div class="system-bg"><img src="../design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png" alt="" /></div>
      <div class="system-bg-overlay"></div>
      <div class="overlay-header">
        <button class="overlay-back-btn" data-action="close">←</button>
        <span class="overlay-title">存档进度</span>
        <span class="overlay-spacer"></span>
      </div>
      <div class="overlay-body">
        <h2 class="overlay-heading">${isSave ? '选择存档位' : '选择进度'}</h2>
        <div class="save-slot-list">
    `;

    for (let i = 1; i <= 10; i++) {
      const slot = slots[i];
      const isEmpty = !slot;
      const clickable = isSave || !isEmpty;
      html += `
        <div class="save-slot-row ${clickable ? 'clickable' : 'disabled'}" data-slot="${i}">
          <div class="save-slot-info">
            <div class="save-slot-title">${isEmpty ? `存档位 ${i}` : (slot.sceneTitle || `存档位 ${i}`)}</div>
            <div class="save-slot-time">${isEmpty ? '空白' : this._formatTime(slot.timestamp)}</div>
          </div>
        </div>
      `;
    }

    html += '</div></div>';
    this.el.innerHTML = html;

    this.el.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = e.target.closest('[data-action="close"]');
      if (action) { this._onClose(); return; }

      const row = e.target.closest('[data-slot]');
      if (!row || row.classList.contains('disabled')) return;
      const slotId = parseInt(row.dataset.slot, 10);
      this._handleSlotClick(slotId, slots[slotId]);
    });
  }

  async _handleSlotClick(slotId, existingSlot) {
    if (this._mode === 'save') {
      if (existingSlot) {
        const ok = await NagiDialog.confirm(this._container, {
          title: '覆盖存档',
          body: `存档位 ${slotId} 已有内容，确定覆盖？`,
          dismiss: '取消',
          confirm: '覆盖',
        });
        if (!ok) return;
      }
      await this._controller.saveGame(slotId);
      this._render();
    } else {
      const ok = await this._controller.loadGame(slotId);
      if (ok && this._onLoaded) this._onLoaded();
    }
  }

  _formatTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  destroy() { this.el.remove(); }
}
