const KEY_VISITED = 'nagi_visited_nodes';
const KEY_ENDINGS = 'nagi_unlocked_endings';
const KEY_SECTIONS = 'nagi_section_states';
const KEY_PROFILE = 'nagi_player_profile';

export class ProgressManager {
  constructor() {
    this._visited = new Set(this._loadArray(KEY_VISITED));
    this._endings = new Set(this._loadArray(KEY_ENDINGS));
    this._sections = this._loadObj(KEY_SECTIONS);
  }

  markNodeVisited(nodeId) {
    this._visited.add(nodeId);
    this._saveArray(KEY_VISITED, this._visited);
  }

  getVisitedNodes() { return this._visited; }

  unlockEnding(endingId) {
    this._endings.add(endingId);
    this._saveArray(KEY_ENDINGS, this._endings);
  }

  getUnlockedEndings() { return this._endings; }

  getPlayerProfile() {
    return this._loadObj(KEY_PROFILE);
  }

  getPlayerName() {
    return (this.getPlayerProfile().playerName || '').trim();
  }

  hasCompletedFirstFlow() {
    const profile = this.getPlayerProfile();
    return Boolean(profile.firstFlowCompleted && (profile.playerName || '').trim());
  }

  setPlayerName(playerName) {
    const name = (playerName || '').trim();
    if (!name) return;
    this._saveObj(KEY_PROFILE, {
      ...this.getPlayerProfile(),
      playerName: name,
      firstFlowCompleted: true,
    });
  }

  _sectionKey(chapterId, sectionIndex) { return `${chapterId}:${sectionIndex}`; }

  markSectionCompleted(chapterId, sectionIndex) {
    this._sections[this._sectionKey(chapterId, sectionIndex)] = 'COMPLETED';
    this._saveObj(KEY_SECTIONS, this._sections);
  }

  markSectionSkipped(chapterId, sectionIndex) {
    this._sections[this._sectionKey(chapterId, sectionIndex)] = 'SKIPPED_COMPLETED';
    this._saveObj(KEY_SECTIONS, this._sections);
  }

  getSectionState(chapterId, sectionIndex, isCurrent, isUnlocked) {
    const key = this._sectionKey(chapterId, sectionIndex);
    const stored = this._sections[key];
    if (stored) return stored;
    if (isCurrent) return 'IN_PROGRESS';
    if (isUnlocked) return 'COMPLETED';
    return 'LOCKED';
  }

  _loadArray(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  }

  _saveArray(key, set) {
    localStorage.setItem(key, JSON.stringify([...set]));
  }

  _loadObj(key) {
    try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; }
  }

  _saveObj(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
  }
}
