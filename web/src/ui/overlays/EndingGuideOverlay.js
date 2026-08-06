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
    if (block.type === 'code' && block.text.includes('关系路线隐藏判定')) return this._renderRouteMap();
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

  _renderRouteMap() {
    return `<div class="ending-guide-route-map" role="img" aria-label="全结局总路线图">
      <svg viewBox="0 0 720 1010" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs><linearGradient id="route-map-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26364b" stop-opacity=".78"/><stop offset="1" stop-color="#0d1727" stop-opacity=".88"/></linearGradient></defs>
        <rect x="1" y="1" width="718" height="1008" rx="10" fill="url(#route-map-glass)" stroke="#f7f9fc" stroke-opacity=".16"/>
        <g fill="#f7f9fc" font-family="Noto Sans SC, sans-serif" text-anchor="middle">
          <text x="360" y="34" font-size="22" font-weight="600">总路线图</text>
          <text x="360" y="68" font-size="16" fill="#d7be86">第一部—第六部：累计值与关键状态</text>
          <text x="360" y="94" font-size="14" fill="#c8d0dc">理解程度 · 自主意志 · 控制倾向 · 距离 · 习惯依赖</text>
          <text x="360" y="120" font-size="14" fill="#c8d0dc">事业与光 · 真实脆弱 · Nagi 反抗 · 真实选择</text>
          <text x="360" y="160" font-size="17">关系路线隐藏判定</text>
          <text x="180" y="202" font-size="20" fill="#d7be86">M 线</text><text x="540" y="202" font-size="20" fill="#d7be86">J 线</text>
          <text x="180" y="228" font-size="14">理解 / 自主倾向</text><text x="540" y="228" font-size="14">管理 / 依赖倾向</text>
          <text x="180" y="276" font-size="16">第七部 M 线剧情</text><text x="540" y="276" font-size="16">第七部 J 线剧情</text>
          <text x="180" y="302" font-size="14">送围巾 · 还是感冒了</text><text x="540" y="302" font-size="14">任人打扮 · 软饭王哲学 · 借着醉意</text>
          <text x="360" y="370" font-size="17">终局资格隐藏判定</text>
          <text x="360" y="398" font-size="14">事业与光 · 真实脆弱 · 自主意志 · 控制倾向</text>
          <text x="360" y="422" font-size="14">距离 · 习惯依赖 · 真实选择 · Nagi 反抗</text>
          <text x="180" y="474" font-size="17" fill="#d7be86">M 线终局资格</text><text x="540" y="474" font-size="17" fill="#d7be86">J 线终局资格</text>
          <text x="180" y="518" font-size="18">没有你的世界</text><text x="540" y="518" font-size="18">还不是今天 / 远处的世界第一</text>
          <text x="180" y="558" font-size="15">梦境成立？</text><text x="540" y="558" font-size="15">两条中文章节分流</text>
          <text x="92" y="610" font-size="15">保留自己的世界</text><text x="268" y="610" font-size="15">为关系压缩自己</text>
          <text x="92" y="636" font-size="14">压缩人生 = 否</text><text x="268" y="636" font-size="14">压缩人生 = 是</text>
          <text x="92" y="700" font-size="16">见证荣誉</text><text x="92" y="726" font-size="16">个人荣誉</text><text x="92" y="752" font-size="16">名字独立</text>
          <text x="268" y="700" font-size="15">TRUE 条件不足</text>
          <text x="540" y="650" font-size="16">普通情侣</text><text x="620" y="700" font-size="16">坏结局锁定</text>
          <text x="92" y="822" font-size="18" fill="#d7be86">世界第一，与你</text><text x="268" y="822" font-size="18" fill="#c98a96">那么完美，那么爱你</text>
          <text x="540" y="822" font-size="18" fill="#9bb5cc">普通情侣</text><text x="620" y="822" font-size="18" fill="#c98a96">远处的世界第一</text>
        </g>
        <g fill="none" stroke="#f7f9fc" stroke-opacity=".68" stroke-width="2">
          <path d="M360 132v20M360 168v20M360 188H180M360 188h180M180 238v26M540 238v26M180 286v28M540 286v28M180 322v32M540 322v32M180 354H540M360 354v8M360 378v10M360 434v22M180 492v18M540 492v18M180 536v14M540 536v14M180 574v20M540 574v20M180 594H92M180 594h88M540 594v38M540 594h80M92 650v38M268 650v38M92 770v34M268 650v144M620 716v88M540 672v124M92 794h0M268 794h0M540 794h0M620 794h0"/>
        </g>
        <g fill="#f7f9fc"><path d="M354 148l6 10 6-10zM174 252l6 10 6-10zM534 252l6 10 6-10zM354 362l6 10 6-10zM174 504l6 10 6-10zM534 504l6 10 6-10zM86 682l6 10 6-10zM262 682l6 10 6-10zM534 620l6 10 6-10zM614 702l6 10 6-10zM86 798l6 10 6-10zM262 788l6 10 6-10zM534 788l6 10 6-10zM614 788l6 10 6-10z"/></g>
      </svg>
    </div>`;
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
