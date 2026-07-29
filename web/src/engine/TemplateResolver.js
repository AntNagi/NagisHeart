export class TemplateResolver {
  constructor(playerName = '') {
    this.playerName = playerName;
  }

  resolve(text) {
    if (!text) return '';
    return text
      .replace(/\{\{playerName\}\}/g, this.playerName)
      .replace(/\{\{nagiCall\}\}/g, 'Nagi');
  }
}
