export class TemplateResolver {
  constructor(playerName = '', nagiCall = 'Nagi少爷') {
    this.playerName = playerName;
    this.nagiCall = nagiCall;
  }

  resolve(text) {
    if (!text) return '';
    return text
      .replace(/\{\{playerName\}\}/g, this.playerName)
      .replace(/\{\{nagiCall\}\}/g, this.nagiCall);
  }
}
