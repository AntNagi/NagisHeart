export class Router {
  constructor(container) {
    this._container = container;
    this._routes = {};
    this._currentScreen = null;
    this._currentName = null;
    this._context = {};
  }

  register(name, ScreenClass) {
    this._routes[name] = ScreenClass;
  }

  setContext(ctx) {
    this._context = ctx;
  }

  navigate(name, params = {}) {
    if (this._currentScreen?.destroy) {
      this._currentScreen.destroy();
    }
    this._container.innerHTML = '';
    this._currentName = name;

    const ScreenClass = this._routes[name];
    if (!ScreenClass) {
      console.error(`Route not found: ${name}`);
      return;
    }

    this._currentScreen = new ScreenClass(this._container, {
      ...this._context,
      ...params,
      router: this,
    });
  }

  getCurrentRoute() {
    return this._currentName;
  }
}
