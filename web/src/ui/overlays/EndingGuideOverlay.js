import { ENDING_GUIDE_SECTIONS } from '../../data/EndingGuideContent.js';

export class EndingGuideOverlay {
  constructor(container, { onClose }) {
    this._onClose = onClose;
    this.el = document.createElement('div');
    this.el.className = 'overlay ending-guide-overlay';
    container.appendChild(this.el);
    this._render();
    this.el.addEventListener('click', (event) => {
      event.stopPropagation();
      if (event.target.closest('[data-action="close"]')) this._onClose();
    });
  }

  _renderBlock(block) {
    if (block.type === 'code') return `<pre class="ending-guide-code"><code>${this._escape(this._localizeRouteText(block.text))}</code></pre>`;
    if (block.type === 'label') return `<h3 class="ending-guide-label">${block.text}</h3>`;
    if (block.type === 'table') {
      const head = block.headers.map((cell) => `<th scope="col">${this._escape(cell)}</th>`).join('');
      const rows = block.rows.map((row) => `<tr>${row.map((cell) => `<td>${this._escape(cell)}</td>`).join('')}</tr>`).join('');
      return `<div class="ending-guide-table-wrap"><table class="ending-guide-table"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
    }
    return `<p class="ending-guide-paragraph">${this._escape(block.text)}</p>`;
  }

  _escape(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  _localizeRouteText(value) {
    return String(value)
      .replace(/path = "dream"/g, '进入「没有你的世界」')
      .replace(/path = "stay"/g, '进入「还不是今天」')
      .replace(/path = "bad"/g, '进入「远处的世界第一」')
      .replace(/Dream｜没有你的世界/g, '没有你的世界')
      .replace(/Dream/g, '没有你的世界')
      .replace(/Stay \/ Bad/g, '还不是今天 / 远处的世界第一')
      .replace(/TRUE END/g, '世界第一，与你')
      .replace(/GOOD END/g, '那么完美，那么爱你')
      .replace(/NORMAL END/g, '普通情侣')
      .replace(/BAD END/g, '远处的世界第一');
  }

  _render() {
    const sections = ENDING_GUIDE_SECTIONS.map((section) => `
      <section class="ending-guide-section">
        <h2>${this._escape(section.title)}</h2>
        ${section.blocks.map((block) => this._renderBlock(block)).join('')}
      </section>
    `).join('');

    this.el.innerHTML = `
      <div class="system-bg"><img src="../design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png" alt="" /></div>
      <div class="system-bg-overlay"></div>
      <div class="overlay-header ending-guide-header">
        <button class="overlay-back-btn" data-action="close" aria-label="返回">←</button>
        <span class="overlay-title">结局攻略</span>
        <span class="overlay-spacer"></span>
      </div>
      <main class="ending-guide-body" aria-label="结局攻略正文">
        <div class="ending-guide-intro">
          <p class="ending-guide-kicker">NAGI’S HEART</p>
          <h1>全结局官方攻略</h1>
          <div class="ending-guide-pills" aria-label="攻略路线">
            <span>M 线 · 没有你的世界</span><span>J 线 · 还不是今天 / 远处的世界第一</span><span>四种结局</span>
          </div>
        </div>
        ${sections}
      </main>
    `;
  }

  destroy() { this.el.remove(); }
}
