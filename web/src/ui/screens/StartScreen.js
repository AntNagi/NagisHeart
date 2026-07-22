import { SettingsOverlay } from '../overlays/SettingsOverlay.js';
import { ChapterSelectOverlay } from '../overlays/ChapterSelectOverlay.js';
import { GalleryOverlay } from '../overlays/GalleryOverlay.js';
import { NagiDialog } from '../components/NagiDialog.js';

export class StartScreen {
  constructor(container, ctx) {
    this._ctx = ctx;
    this._activeOverlay = null;
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
          <button class="home-sub-btn" data-action="gallery">回忆画廊</button>
          <button class="home-sub-btn" data-action="settings">系统设置</button>
          <button class="home-sub-btn" data-action="saves">存档进度</button>
        </div>
      </div>
    `;

    this._continueRow = this.el.querySelector('[data-action="continue"]');

    this.el.addEventListener('click', (e) => {
      if (this._activeOverlay) return;
      const row = e.target.closest('[data-action]');
      if (!row) return;
      const action = row.dataset.action;
      if (action === 'new') {
        this._handleNewGame();
      } else if (action === 'continue' && row.dataset.disabled !== 'true') {
        ctx.controller.continueGame().then(ok => {
          if (ok) ctx.router.navigate('game');
        });
      } else if (action === 'catalog') {
        this._openCatalog();
      } else if (action === 'gallery') {
        this._openGallery();
      } else if (action === 'settings') {
        this._openSettings();
      } else if (action === 'saves' && row.dataset.disabled !== 'true') {
        ctx.controller.continueGame().then(ok => {
          if (ok) ctx.router.navigate('game');
        });
      }
    });

    ctx.controller.hasAutoSave().then(has => {
      if (has) {
        this._continueRow.removeAttribute('data-disabled');
        const savesRow = this.el.querySelector('[data-action="saves"]');
        if (savesRow) savesRow.removeAttribute('data-disabled');
      }
    });

    container.appendChild(this.el);
  }

  _closeOverlay() {
    if (this._activeOverlay) {
      this._activeOverlay.destroy();
      this._activeOverlay = null;
    }
  }

  _handleNewGame() {
    this._ctx.controller.hasAutoSave().then(has => {
      if (has) {
        NagiDialog.show(this.el, {
          title: '新的故事',
          body: '当前有进行中的故事，开始新故事将覆盖自动存档。确认开始吗？',
          dismiss: '取消',
          confirm: '确认开始',
          onDismiss: () => {},
          onConfirm: () => { this._ctx.router.navigate('prologue'); },
        });
      } else {
        this._ctx.router.navigate('prologue');
      }
    });
  }

  _openCatalog() {
    this._activeOverlay = new ChapterSelectOverlay(this.el, {
      controller: this._ctx.controller,
      onClose: () => this._closeOverlay(),
      onJump: (startNode, chapterId, sectionIndex) => {
        this._closeOverlay();
        this._ctx.controller.replayFromSection(startNode, chapterId, sectionIndex);
        this._ctx.router.navigate('game');
      },
    });
  }

  _openSettings() {
    this._activeOverlay = new SettingsOverlay(this.el, {
      settingsManager: this._ctx.controller.getSettingsManager(),
      onClose: () => this._closeOverlay(),
      onThemeChange: (theme) => {
        document.getElementById('app').setAttribute('data-theme', theme.toLowerCase());
      },
    });
  }

  _openGallery() {
    this._activeOverlay = new GalleryOverlay(this.el, {
      controller: this._ctx.controller,
      onClose: () => this._closeOverlay(),
    });
  }

  destroy() {
    this._closeOverlay();
    this.el.remove();
  }
}
