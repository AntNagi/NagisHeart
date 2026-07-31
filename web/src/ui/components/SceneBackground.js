export class SceneBackground {
  constructor(container) {
    this.el = document.createElement('div');
    this.el.className = 'scene-bg';
    this._img = document.createElement('img');
    this._img.alt = '';
    this.el.appendChild(this._img);
    container.appendChild(this.el);
    this._currentBg = null;
  }

  update(bgPath) {
    if (!bgPath || bgPath === this._currentBg) return;
    this._currentBg = bgPath;
    const newImg = document.createElement('img');
    newImg.alt = '';
    newImg.style.opacity = '0';

    let shown = false;
    const showImage = () => {
      if (shown) return;
      shown = true;
      newImg.style.transition = `opacity var(--duration-scene) var(--ease-out)`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { newImg.style.opacity = '1'; });
      });
      const oldImg = this._img;
      this._img = newImg;
      setTimeout(() => {
        if (oldImg.parentNode === this.el) this.el.removeChild(oldImg);
      }, 900);
    };

    newImg.onload = showImage;
    newImg.onerror = showImage;
    this.el.appendChild(newImg);
    newImg.src = `../assets/${bgPath}`;
    setTimeout(() => showImage(), 300);
  }

  destroy() { this.el.remove(); }
}
