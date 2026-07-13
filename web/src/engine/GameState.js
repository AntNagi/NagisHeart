export class GameState {
  constructor(variablesData) {
    this._values = new Map();

    if (variablesData.numeric) {
      for (const [name, def] of Object.entries(variablesData.numeric)) {
        this._values.set(name, def.initial ?? def.default ?? 0);
      }
    }
    if (variablesData.flags) {
      for (const [name, def] of Object.entries(variablesData.flags)) {
        this._values.set(name, this._resolveInitial(def));
      }
    }
  }

  _resolveInitial(def) {
    const init = def.initial;
    if (init === undefined || init === null) {
      return def.type === 'boolean' ? false : '';
    }
    return init;
  }

  get(name) {
    const v = this._values.get(name);
    return v === undefined ? null : v;
  }

  getInt(name) {
    const v = this._values.get(name);
    if (typeof v === 'number') return v | 0;
    return 0;
  }

  getString(name) {
    const v = this._values.get(name);
    return v == null ? '' : String(v);
  }

  getBoolean(name) {
    const v = this._values.get(name);
    return typeof v === 'boolean' ? v : false;
  }

  set(name, value) {
    this._values.set(name, value);
  }

  applyEffect(effect) {
    const val = effect.val;
    switch (effect.op) {
      case 'add': {
        const current = this.getInt(effect.var);
        this._values.set(effect.var, current + (typeof val === 'number' ? val : parseInt(val, 10) || 0));
        break;
      }
      case 'set':
        this._values.set(effect.var, val);
        break;
    }
  }

  applyEffects(effects) {
    if (!effects) return;
    for (const e of effects) this.applyEffect(e);
  }

  snapshot() {
    const obj = {};
    for (const [k, v] of this._values) obj[k] = v;
    return obj;
  }

  toSerializable() {
    return this.snapshot();
  }

  restoreFrom(saved) {
    this._values.clear();
    for (const [k, v] of Object.entries(saved)) {
      this._values.set(k, v);
    }
  }
}
