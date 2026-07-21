export class StartScreen {
  constructor(container, ctx) {
    this._ctx = ctx;
    this.el = document.createElement('div');
    this.el.className = 'screen start-screen screen-enter';

    this.el.innerHTML = `
      <div class="start-screen-bg">
        <img src="../design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png" alt="" />
      </div>
      <div class="start-screen-overlay"></div>
      <div class="start-screen-title-layer">
        <img src="../design/authority/icon_start_tt/start/layers/start_title_overlay_v23.svg" alt="" />
      </div>
      <div class="home-actions">
        <div class="home-main">
          <div class="home-main-row" data-action="new">
            <span class="home-main-label">新的故事</span>
            <span class="home-main-desc">开始全新旅程</span>
          </div>
          <div class="home-main-row" data-action="continue" data-disabled="true">
            <span class="home-main-label">继续</span>
            <span class="home-main-desc">读取存档进度</span>
          </div>
        </div>
        <div class="home-divider"></div>
        <div class="home-sub">
          <button class="home-sub-btn" data-action="catalog">章节目录</button>
          <button class="home-sub-btn" data-action="gallery" disabled>回忆画廊</button>
          <button class="home-sub-btn" data-action="settings">系统设置</button>
          <button class="home-sub-btn" data-action="about">关于</button>
        </div>
      </div>
    `;

    this._continueRow = this.el.querySelector('[data-action="continue"]');

    this.el.addEventListener('click', (e) => {
      const row = e.target.closest('[data-action]');
      if (!row) return;
      const action = row.dataset.action;
      if (action === 'new') {
        ctx.router.navigate('prologue');
      } else if (action === 'continue' && row.dataset.disabled !== 'true') {
        ctx.controller.continueGame().then(ok => {
          if (ok) ctx.router.navigate('game');
        });
      } else if (action === 'catalog') {
        ctx.router.navigate('game');
      } else if (action === 'settings') {
        ctx.router.navigate('game');
      }
    });

    ctx.controller.hasAutoSave().then(has => {
      if (has) this._continueRow.removeAttribute('data-disabled');
    });

    container.appendChild(this.el);
  }

  destroy() { this.el.remove(); }
}
