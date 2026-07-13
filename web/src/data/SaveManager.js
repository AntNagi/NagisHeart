const DB_NAME = 'NagisHeart';
const STORE_NAME = 'saves';
const DB_VERSION = 1;

export class SaveManager {
  constructor() {
    this._db = null;
  }

  async _open() {
    if (this._db) return this._db;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
      };
      req.onsuccess = () => { this._db = req.result; resolve(this._db); };
      req.onerror = () => reject(req.error);
    });
  }

  async save(slot) {
    const db = await this._open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(slot);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }

  async load(slotId) {
    const db = await this._open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(slotId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async listSlots() {
    const db = await this._open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => {
        const slots = new Array(11).fill(null);
        for (const s of req.result) {
          if (s.id >= 0 && s.id <= 10) slots[s.id] = s;
        }
        resolve(slots);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async hasAnySave() {
    const slots = await this.listSlots();
    return slots.some(s => s !== null);
  }

  async hasAutoSave() {
    const slot = await this.load(0);
    return slot !== null;
  }

  async loadAutoSave() {
    return this.load(0);
  }

  async deleteAutoSave() {
    const db = await this._open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(0);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }
}
