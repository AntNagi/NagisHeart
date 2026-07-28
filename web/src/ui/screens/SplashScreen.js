export class SplashScreen {
  constructor(container, ctx) {
    this._ctx = ctx;
    this.el = document.createElement('div');
    this.el.className = 'screen splash-screen screen-enter';
    this.el.innerHTML = `
      <div class="start-poster">
        <img class="start-poster-layer" src="../design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png" alt="" />
        <img class="start-poster-layer" src="../design/authority/icon_start_tt/start/layers/start_title_overlay_v23.svg" alt="" />
        <img class="start-poster-layer start-breathing" src="../design/authority/icon_start_tt/start/layers/start_button_static_v23.svg" alt="" />
        <button class="start-hit" aria-label="Start"></button>
      </div>
    `;
    this.el.querySelector('.start-hit').addEventListener('click', () => {
      ctx.router.navigate('start');
    });
    container.appendChild(this.el);
  }

  destroy() { this.el.remove(); }
}
