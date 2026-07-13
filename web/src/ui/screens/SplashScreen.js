export class SplashScreen {
  constructor(container, ctx) {
    this._ctx = ctx;
    this.el = document.createElement('div');
    this.el.className = 'screen splash-screen screen-enter';
    this.el.innerHTML = `
      <div class="splash-title">Nagi's Heart</div>
      <div class="splash-start">START</div>
    `;
    this.el.addEventListener('click', () => {
      ctx.router.navigate('start');
    });
    container.appendChild(this.el);
  }

  destroy() { this.el.remove(); }
}
