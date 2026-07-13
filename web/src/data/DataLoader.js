export class DataLoader {
  constructor(baseUrl = '../story-data') {
    this._baseUrl = baseUrl;
  }

  async loadAll() {
    const [nodes, flow, routers, sceneVisuals, endings, variables, chapters, prologueShort] =
      await Promise.all([
        this._fetch('nodes.json'),
        this._fetch('flow.json'),
        this._fetch('routers.json'),
        this._fetch('scene_visuals.json'),
        this._fetch('endings.json'),
        this._fetch('variables.json'),
        this._fetch('chapters.json'),
        this._fetch('prologue_short.json'),
      ]);

    return { nodes, flow, routers, sceneVisuals, endings, variables, chapters, prologueShort };
  }

  async _fetch(file) {
    const resp = await fetch(`${this._baseUrl}/${file}`);
    if (!resp.ok) throw new Error(`Failed to load ${file}: ${resp.status}`);
    return resp.json();
  }
}
