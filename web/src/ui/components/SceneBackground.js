import { repoAssetUrl } from '../../utils/assetPath.js';

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
    newImg.src = repoAssetUrl(`assets/${bgPath}`);

    // Preload image before showing
    const showImage = () => {
      newImg.style.transition = `opacity var(--duration-scene) var(--ease-out)`;
      requestAnimationFrame(() => { newImg.style.opacity = '1'; });
      setTimeout(() => {
        if (this._img.parentNode === this.el) this.el.removeChild(this._img);
        this._img = newImg;
      }, 900);
    };

    newImg.onload = showImage;
    newImg.onerror = () => {
      console.error('[SceneBackground] failed to load bg:', bgPath, newImg.src);
    };

    // Fallback: if image takes too long, show it anyway after 300ms
    const timeout = setTimeout(() => {
      if (newImg.style.opacity === '0') {
        console.warn('[SceneBackground] bg load timeout:', bgPath, newImg.src);
        showImage();
      }
    }, 300);

    newImg.addEventListener('load', () => clearTimeout(timeout), { once: true });
    newImg.addEventListener('error', () => clearTimeout(timeout), { once: true });

    this.el.appendChild(newImg);
  }

  destroy() { this.el.remove(); }
}
