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
    newImg.src = `../assets/${bgPath}`;
    newImg.onload = () => {
      newImg.style.transition = `opacity var(--duration-scene) var(--ease-out)`;
      requestAnimationFrame(() => { newImg.style.opacity = '1'; });
      setTimeout(() => {
        if (this._img.parentNode === this.el) this.el.removeChild(this._img);
        this._img = newImg;
      }, 900);
    };
    newImg.onerror = () => {
      newImg.style.opacity = '1';
      if (this._img.parentNode === this.el) this.el.removeChild(this._img);
      this._img = newImg;
    };
    this.el.appendChild(newImg);
  }

  destroy() { this.el.remove(); }
}
