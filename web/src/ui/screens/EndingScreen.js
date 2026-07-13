export class EndingScreen {
  constructor(container, ctx) {
    this._ctx = ctx;
    const ending = ctx.ending;
    this.el = document.createElement('div');
    this.el.className = 'screen ending-screen screen-enter';

    if (!ending) {
      this.el.innerHTML = `
        <div class="ending-tag">回看结束</div>
        <div class="ending-title">回看已完成</div>
        <button class="ending-back-btn">返回主菜单</button>
      `;
    } else {
      this.el.innerHTML = `
        <div class="ending-emoji">${ending.emoji}</div>
        <div class="ending-tag">${ending.tag}</div>
        <div class="ending-title">${ending.title}</div>
        <div class="ending-subtitle">${ending.subtitle}</div>
        <div class="ending-description">${ending.description}</div>
        <button class="ending-back-btn">返回主菜单</button>
      `;
    }

    this.el.querySelector('.ending-back-btn').addEventListener('click', () => {
      ctx.router.navigate('start');
    });

    container.appendChild(this.el);
  }

  destroy() { this.el.remove(); }
}
