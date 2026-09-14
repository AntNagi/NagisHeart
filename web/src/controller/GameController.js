import { StoryEngine } from '../engine/StoryEngine.js';
import { GameState } from '../engine/GameState.js';
import { TemplateResolver } from '../engine/TemplateResolver.js';
import { SaveManager } from '../data/SaveManager.js';
import { ProgressManager } from '../data/ProgressManager.js';
import { SettingsManager } from '../data/SettingsManager.js';

export const GamePhase = {
  Loading: 'Loading',
  Dialogue: 'Dialogue',
  Choice: 'Choice',
  Response: 'Response',
  Ending: 'Ending',
  Error: 'Error',
  ChapterTransition: 'ChapterTransition',
  ChapterEnding: 'ChapterEnding',
  SectionTransition: 'SectionTransition',
  ReplayComplete: 'ReplayComplete',
};

const DEFAULT_NAGI_CALL = 'Nagi';

export class GameController extends EventTarget {
  constructor(storyData) {
    super();
    this._engine = new StoryEngine(storyData);
    this._variablesData = storyData.variables;
    this._chapters = storyData.chapters;
    this._prologueData = storyData.prologueShort;

    this._saveManager = new SaveManager();
    this._progressManager = new ProgressManager();
    this._settingsManager = new SettingsManager();
    this._templateResolver = new TemplateResolver();

    this._gameState = null;
    this._playerName = '';
    this._nagiCall = DEFAULT_NAGI_CALL;

    this._currentNode = null;
    this._currentDialogue = [];
    this._dialogueIndex = 0;
    this._currentChoices = [];
    this._responseQueue = [];
    this._responseIndex = 0;
    this._pendingNextId = null;
    this._backlog = [];
    this._autoTimer = null;
    this._skipTimer = null;

    this._currentChapterId = '';
    this._currentSectionIndex = 0;
    this._pendingNodeAfterTransition = null;
    this._pendingNextChapter = null;
    this._isReplayMode = false;
    this._replayBoundaryNodes = new Set();

    this._nodeToChapter = new Map();
    this._nodeToSectionIndex = new Map();
    for (const chapter of this._chapters) {
      for (let idx = 0; idx < chapter.sections.length; idx++) {
        const section = chapter.sections[idx];
        this._nodeToChapter.set(section.startNode, chapter);
        this._nodeToSectionIndex.set(section.startNode, idx);
        if (section.altStartNode) {
          this._nodeToChapter.set(section.altStartNode, chapter);
          this._nodeToSectionIndex.set(section.altStartNode, idx);
        }
      }
    }

    this._state = {
      phase: GamePhase.Loading,
      currentNodeId: '',
      sceneTitle: '',
      bgAssetPath: null,
      uiTheme: 'Dark',
      mood: null,
      mode: 'vn',
      speaker: '',
      text: '',
      displayType: 'bottom',
      longNarrationTexts: [],
      choices: [],
      ending: null,
      errorMessage: null,
      isAutoPlaying: false,
      isSkipping: false,
      chapterTransition: null,
      sectionTransition: null,
    };
  }

  get state() { return this._state; }

  getPrologueLines() { return this._prologueData.lines; }
  getBacklog() { return [...this._backlog]; }
  getChapters() { return this._chapters; }

  async hasAnySave() { return this._saveManager.hasAnySave(); }
  async hasAutoSave() { return this._saveManager.hasAutoSave(); }
  async hasCompletedFirstFlow() {
    if (this._progressManager.hasCompletedFirstFlow()) return true;
    const slots = await this._saveManager.listSlots();
    const slotWithName = slots.find(slot => (slot?.playerName || '').trim());
    if (slotWithName) {
      this._progressManager.setPlayerName(slotWithName.playerName);
      return true;
    }
    return false;
  }
  async getSaveSlots() { return this._saveManager.listSlots(); }
  getVisitedNodes() { return this._progressManager.getVisitedNodes(); }
  getUnlockedEndings() { return this._progressManager.getUnlockedEndings(); }
  getSectionState(chapterId, sectionIndex, startNode) {
    const isCurrent = this._currentChapterId === chapterId && this._currentSectionIndex === sectionIndex;
    const visited = this._progressManager.getVisitedNodes();
    return this._progressManager.getSectionState(chapterId, sectionIndex, isCurrent, visited.has(startNode));
  }
  getSettingsManager() { return this._settingsManager; }

  /**
   * Story map picture nodes read their image through the authority chain in
   * MinSpec §27.5: chapters.json section -> startNode -> scene_visuals[startNode].bg.
   * Never guess an image from the design preview sheets.
   */
  getNodeBgPath(nodeId) {
    const visual = this._engine.getSceneVisual(nodeId);
    return visual?.bg?.replace(/^assets\//, '') || null;
  }

  replayFromSection(startNode, chapterId, sectionIndex) {
    this._isReplayMode = true;
    const chapter = this._chapters.find(c => c.id === chapterId);
    if (chapter) {
      const nextSection = chapter.sections[sectionIndex + 1];
      this._replayBoundaryNodes.clear();
      if (nextSection) this._replayBoundaryNodes.add(nextSection.startNode);
    }
    this._currentChapterId = chapterId;
    this._currentSectionIndex = sectionIndex;
    this._gameState = new GameState(this._variablesData);
    this._templateResolver = new TemplateResolver(this._playerName);
    this._backlog = [];
    const resolution = this._engine.resolve(startNode, this._gameState);
    if (resolution.type === 'found') {
      const bgPath = resolution.visual?.bg?.replace(/^assets\//, '') || null;
      this._pendingNodeAfterTransition = resolution;
      const section = chapter?.sections[sectionIndex];
      if (startNode.startsWith('ep_')) {
        const parts = (section?.title || '').split('·');
        this._updateState({
          phase: GamePhase.ChapterTransition,
          currentNodeId: '',
          sceneTitle: '',
          bgAssetPath: bgPath,
          speaker: '',
          text: '',
          choices: [],
          chapterTransition: {
            chapterName: parts[0]?.trim() || section?.title || '',
            chapterTitle: parts.slice(1).join('·').trim() || '',
            isEpilogue: true,
          },
        });
      } else {
        this._updateState({
          phase: GamePhase.SectionTransition,
          currentNodeId: '',
          sceneTitle: '',
          bgAssetPath: bgPath,
          speaker: '',
          text: '',
          choices: [],
          sectionTransition: {
            chapterName: chapter?.name || '',
            sectionTitle: section?.title || '',
            sectionLabel: this._sectionLabel(chapter, sectionIndex),
          },
        });
      }
    } else {
      this._navigateToNode(startNode);
    }
  }

  replayEnding(endingId) {
    const epilogueByEnding = {
      end_true: 'ep_true',
      true: 'ep_true',
      end_good: 'ep_good',
      good: 'ep_good',
      end_normal: 'ep_normal',
      normal: 'ep_normal',
      end_bad: 'ep_bad',
      bad: 'ep_bad',
    };
    const startNode = epilogueByEnding[endingId];
    if (!startNode) return false;

    const chapter = this._chapters.find(ch =>
      ch.sections?.some(section => section.startNode === startNode)
    );
    if (!chapter) return false;

    const sectionIndex = chapter.sections.findIndex(section => section.startNode === startNode);
    if (sectionIndex < 0) return false;

    this.replayFromSection(startNode, chapter.id, sectionIndex);
    return true;
  }

  // ── Lifecycle ──

  startNewGame(name) {
    const resolvedName = (name || this._progressManager.getPlayerName()).trim();
    if (!resolvedName) return false;
    this._playerName = resolvedName;
    if (name) this._progressManager.setPlayerName(resolvedName);
    this._nagiCall = DEFAULT_NAGI_CALL;
    this._templateResolver = new TemplateResolver(this._playerName);
    this._gameState = new GameState(this._variablesData);
    this._backlog = [];
    const ch = this._nodeToChapter.get('p1');
    this._currentChapterId = ch ? ch.id : '';
    this._currentSectionIndex = 0;
    this._isReplayMode = false;
    this._replayBoundaryNodes.clear();
    const resolution = this._engine.resolve('p1', this._gameState);
    this._pendingNodeAfterTransition = resolution.type === 'found' ? resolution : 'p1';
    this._pendingNextChapter = null;
    this._updateState({
      phase: GamePhase.ChapterTransition,
      currentNodeId: '',
      sceneTitle: '',
      bgAssetPath: null,
      speaker: '',
      text: '',
      choices: [],
      chapterTransition: {
        chapterName: ch?.name || '第一部',
        chapterTitle: ch?.title || '',
        timeRange: ch?.timeRange || null,
      },
      sectionTransition: null,
    });
    return true;
  }

  async continueGame() {
    const slot = await this._saveManager.loadAutoSave();
    if (!slot) return false;
    this._playerName = slot.playerName || this._progressManager.getPlayerName();
    if (this._playerName) this._progressManager.setPlayerName(this._playerName);
    this._nagiCall = DEFAULT_NAGI_CALL;
    this._templateResolver = new TemplateResolver(this._playerName);
    this._gameState = new GameState(this._variablesData);
    this._gameState.restoreFrom(slot.variables);
    const ch = this._nodeToChapter.get(slot.nodeId);
    if (ch) this._currentChapterId = ch.id;
    this._navigateToNode(slot.nodeId);
    return true;
  }

  async loadGame(slotId) {
    const slot = await this._saveManager.load(slotId);
    if (!slot) return false;
    this._playerName = slot.playerName || this._progressManager.getPlayerName();
    if (this._playerName) this._progressManager.setPlayerName(this._playerName);
    this._nagiCall = DEFAULT_NAGI_CALL;
    this._templateResolver = new TemplateResolver(this._playerName);
    this._gameState = new GameState(this._variablesData);
    this._gameState.restoreFrom(slot.variables);
    const ch = this._nodeToChapter.get(slot.nodeId);
    if (ch) this._currentChapterId = ch.id;
    this._navigateToNode(slot.nodeId);
    return true;
  }

  async saveGame(slotId) {
    await this._saveManager.save({
      id: slotId,
      nodeId: this._state.currentNodeId,
      playerName: this._playerName,
      nagiCall: this._nagiCall,
      variables: this._gameState.toSerializable(),
      timestamp: Date.now(),
      sceneTitle: this._state.sceneTitle,
    });
  }

  async saveAutoProgress() {
    if (this._isReplayMode) return;
    await this.saveGame(0);
  }

  // ── User actions ──

  onTap() {
    switch (this._state.phase) {
      case GamePhase.Dialogue:
        if (this._state.displayType === 'long_narration') {
          this._showDialogueLine();
        } else {
          this._advanceDialogue();
        }
        break;
      case GamePhase.Response:
        this._advanceResponse();
        break;
      case GamePhase.ChapterEnding: {
        const nextChapter = this._pendingNextChapter;
        this._pendingNextChapter = null;
        if (nextChapter) {
          this._updateState({
            phase: GamePhase.ChapterTransition,
            chapterTransition: {
              chapterName: nextChapter.name,
              chapterTitle: nextChapter.title,
              timeRange: nextChapter.timeRange || null,
            },
          });
        } else {
          const pending = this._pendingNodeAfterTransition;
          this._pendingNodeAfterTransition = null;
          this._enterPendingNode(pending);
        }
        break;
      }
      case GamePhase.ChapterTransition: {
        const pending = this._pendingNodeAfterTransition;
        const wasEpilogue = this._state?.chapterTransition?.isEpilogue;
        if (!wasEpilogue && this._showPendingSectionOpening(pending)) break;
        this._pendingNodeAfterTransition = null;
        this._enterPendingNode(pending);
        break;
      }
      case GamePhase.SectionTransition: {
        const pending = this._pendingNodeAfterTransition;
        this._pendingNodeAfterTransition = null;
        this._enterPendingNode(pending);
        break;
      }
    }
  }

  onChoiceSelected(choiceIndex) {
    if (this._state.phase !== GamePhase.Choice) return;
    const choices = this._state.choices;
    if (choiceIndex < 0 || choiceIndex >= choices.length) return;
    const choice = choices[choiceIndex];

    // §14.4: Record player choice in backlog
    const choiceLabel = this._templateResolver.resolve(choice.label);
    this._backlog.push({ speaker: '', text: `你选择了：${choiceLabel}`, isChoice: true });

    this._gameState.applyEffects(choice.effects);

    if (this._handleEndingTransition(choice)) return;

    this._pendingNextId = this._engine.processChoiceTransition(choice);

    if (choice.responses && choice.responses.length > 0) {
      this._responseQueue = choice.responses;
      this._responseIndex = 0;
      this._showResponseLine();
    } else {
      this._advanceAfterChoice();
    }
  }

  toggleAuto() {
    if (this._state.isAutoPlaying) {
      this._stopAuto();
    } else {
      this._stopSkip();
      this._updateState({ isAutoPlaying: true });
      this._startAutoTimer();
    }
  }

  toggleSkip() {
    if (this._state.isSkipping) {
      this._stopSkip();
    } else {
      this._stopAuto();
      this._updateState({ isSkipping: true });
      this._startSkipLoop();
    }
  }

  skipSection() {
    this.skipToSectionClear();
  }

  skipToSectionClear() {
    this._stopAuto();
    this._stopSkip();
    const chapter = this._chapters.find(c => c.id === this._currentChapterId);
    if (!chapter) return;
    this._progressManager.markSectionSkipped(this._currentChapterId, this._currentSectionIndex);

    // §31.2: skip directly to next in-scope section start / chapter ending / ending flow.
    // Sections carry a scope (common/dream/stay/bad/M/J); skip must respect the
    // player's current path so it never surfaces content from another branch.
    let nextSectionIndex = this._currentSectionIndex + 1;
    while (nextSectionIndex < chapter.sections.length
           && !this._isSectionInScope(chapter.sections[nextSectionIndex])) {
      nextSectionIndex++;
    }
    if (nextSectionIndex < chapter.sections.length) {
      const nextStartNode = chapter.sections[nextSectionIndex].startNode;
      this._backlog = [];
      this._navigateToNode(nextStartNode);
    } else {
      // Last in-scope section of chapter → go to chapter ending
      const chapterIndex = this._chapters.findIndex(c => c.id === this._currentChapterId);
      if (chapterIndex >= 0 && chapterIndex + 1 < this._chapters.length) {
        const nextChapter = this._chapters[chapterIndex + 1];
        if (nextChapter.sections.length > 0) {
          const nextStartNode = nextChapter.sections[0].startNode;
          this._currentChapterId = nextChapter.id;
          this._currentSectionIndex = 0;
          this._backlog = [];
          const resolution = this._engine.resolve(nextStartNode, this._gameState);
          if (resolution.type === 'found') {
            this._pendingNodeAfterTransition = resolution;
            this._pendingNextChapter = nextChapter;
            this._updateState({
              phase: GamePhase.ChapterEnding,
              chapterTransition: {
                chapterName: chapter.name,
                chapterTitle: chapter.title,
                timeRange: chapter.timeRange || null,
              },
            });
          } else {
            // Next chapter's opening resolves straight to an ending → resolve it
            this._resolveEndingFromState();
          }
        }
      } else {
        // No more chapters → resolve real ending via ending_resolver
        this._resolveEndingFromState();
      }
    }
  }

  // Skip-section, story-map jumps and saves can land past route_mj_hidden without
  // running it, leaving mj empty: M/J sections all skip and p8_route shows no choices.
  _ensureMj() {
    if (this._gameState.getString('mj')) return;
    const routerChapter = this._nodeToChapter.get('e_agency_launch'); // route_mj_hidden's exit
    const at = this._chapters.findIndex(c => c.id === this._currentChapterId);
    if (at < 0 || at < this._chapters.indexOf(routerChapter)) return;
    this._engine.applyRouterEffects('route_mj_hidden', this._gameState);
  }

  // Section scope gating for skip: 'common' (or none) always allowed; branch
  // scopes require the matching path/mj variable to be set.
  _isSectionInScope(section) {
    const scope = section.scope;
    if (!scope || scope === 'common') return true;
    if (scope === 'dream' || scope === 'stay' || scope === 'bad') {
      return this._gameState.getString('path') === scope;
    }
    if (scope === 'M' || scope === 'J') {
      return this._gameState.getString('mj') === scope;
    }
    return true;
  }

  // Evaluate endings.json judgement (via ending_resolver router) on current
  // state and present the resulting ending. ending nodes (end_*) are real story
  // nodes, so we resolve the id then show its definition directly.
  _resolveEndingFromState() {
    const endId = this._engine.resolveEndingId(this._gameState);
    if (endId) {
      const key = endId.replace(/^end_/, '');
      const def = this._engine.getEndingDefinitions()[key];
      if (def) {
        this._showEnding({ endingId: endId, definition: def });
        return;
      }
    }
    this._updateState({ phase: GamePhase.Ending, ending: null });
  }

  getCurrentSectionTitle() {
    const chapter = this._chapters.find(c => c.id === this._currentChapterId);
    return chapter?.sections[this._currentSectionIndex]?.title || '';
  }

  isSkipAvailable() {
    const chapter = this._chapters.find(c => c.id === this._currentChapterId);
    if (!chapter) return false;
    const section = chapter.sections[this._currentSectionIndex];
    if (!section) return false;
    if (section.startNode && section.startNode.startsWith('ep_')) return false;
    return true;
  }

  // ── Navigation ──

  _enterPendingNode(pending) {
    if (!pending) return;
    if (typeof pending === 'string') {
      this._navigateToNode(pending);
      return;
    }
    this._enterNode(pending);
  }

  _sectionLabel(chapter, sectionIndex) {
    const section = chapter?.sections?.[sectionIndex];
    const scope = section?.scope;
    if (scope === 'dream' || scope === 'stay' || scope === 'bad') {
      let scopeCount = 0;
      for (let i = 0; i <= sectionIndex; i++) {
        if (chapter.sections[i].scope === scope) scopeCount++;
      }
      const routeName = scope === 'dream' ? 'Dream' : scope === 'stay' ? 'Stay' : 'Bad';
      return `${routeName} · 第${scopeCount}节`;
    }
    return `第${sectionIndex + 1}节`;
  }

  _showPendingSectionOpening(pending) {
    if (!pending) return false;
    const found = typeof pending === 'string' ? this._engine.resolve(pending, this._gameState) : pending;
    if (!found || found.type !== 'found') return false;

    const chapter = this._nodeToChapter.get(found.nodeId);
    const sectionIndex = this._nodeToSectionIndex.get(found.nodeId);
    if (!chapter || sectionIndex === undefined) return false;

    const section = chapter.sections[sectionIndex];
    if (!section?.title) return false;
    const bgPath = found.visual?.bg?.replace(/^assets\//, '') || null;

    this._pendingNodeAfterTransition = found;
    this._currentChapterId = chapter.id;
    this._currentSectionIndex = sectionIndex;
    if (section.startNode?.startsWith('ep_')) {
      const parts = (section.title || '').split('·');
      this._updateState({
        phase: GamePhase.ChapterTransition,
        bgAssetPath: bgPath,
        chapterTransition: {
          chapterName: parts[0]?.trim() || section.title,
          chapterTitle: parts.slice(1).join('·').trim() || '',
          isEpilogue: true,
        },
      });
    } else {
      this._updateState({
        phase: GamePhase.SectionTransition,
        bgAssetPath: bgPath,
        sectionTransition: {
          chapterName: chapter.name,
          sectionTitle: section.title,
          sectionLabel: this._sectionLabel(chapter, sectionIndex),
        },
      });
    }
    return true;
  }

  exitReplay() {
    this._isReplayMode = false;
    this._replayBoundaryNodes.clear();
  }

  _emitReplayComplete() {
    this._stopAuto();
    this._stopSkip();
    const chapter = this._chapters.find(c => c.id === this._currentChapterId);
    const section = chapter?.sections[this._currentSectionIndex];
    this._updateState({
      phase: GamePhase.ReplayComplete,
      replayInfo: {
        chapterName: chapter?.name || '',
        sectionTitle: section?.title || '',
      },
    });
  }

  _navigateToNode(targetId) {
    if (this._isReplayMode && this._replayBoundaryNodes.has(targetId)) {
      this._emitReplayComplete();
      return;
    }

    const resolution = this._engine.resolve(targetId, this._gameState);
    switch (resolution.type) {
      case 'found':
        this._enterNode(resolution);
        break;
      case 'endingReached':
        if (this._isReplayMode) {
          this._emitReplayComplete();
        } else {
          this._showEnding(resolution);
        }
        break;
      case 'notFound':
        this._updateState({
          phase: GamePhase.Error,
          errorMessage: `${resolution.id}: ${resolution.reason}`,
        });
        break;
    }
  }

  _enterNode(found) {
    const { nodeId, node, visual } = found;

    if (!this._isReplayMode) {
      this._progressManager.markNodeVisited(nodeId);
    }

    // Chapter boundary detection
    if (!this._isReplayMode) {
      const newChapter = this._nodeToChapter.get(nodeId);
      if (newChapter && newChapter.id !== this._currentChapterId && this._currentChapterId) {
        this._progressManager.markSectionCompleted(this._currentChapterId, this._currentSectionIndex);
        const oldChapter = this._chapters.find(c => c.id === this._currentChapterId);
        this._currentChapterId = newChapter.id;
        this._currentSectionIndex = -1;
        this._backlog = [];
        this._pendingNodeAfterTransition = found;
        this._pendingNextChapter = newChapter;
        this._updateState({
          phase: GamePhase.ChapterEnding,
          chapterTransition: {
            chapterName: oldChapter?.name || '',
            chapterTitle: oldChapter?.title || '',
            timeRange: oldChapter?.timeRange || null,
          },
        });
        return;
      }
      if (newChapter) this._currentChapterId = newChapter.id;

      const newSectionIndex = this._nodeToSectionIndex.get(nodeId);
      if (newSectionIndex !== undefined) {
        if (newSectionIndex !== this._currentSectionIndex && this._currentChapterId && this._currentSectionIndex >= 0) {
          this._progressManager.markSectionCompleted(this._currentChapterId, this._currentSectionIndex);
          this._backlog = [];
          const chapter = this._chapters.find(c => c.id === this._currentChapterId);
          const oldSection = chapter?.sections[this._currentSectionIndex];
          const newSection = chapter?.sections[newSectionIndex];
          if (oldSection?.title) {
            const bgPath = found?.visual?.bg?.replace(/^assets\//, '') || null;
            this._currentSectionIndex = newSectionIndex;
            this._pendingNodeAfterTransition = found;
            if (newSection?.startNode?.startsWith('ep_')) {
              const parts = (newSection.title || '').split('·');
              this._updateState({
                phase: GamePhase.ChapterTransition,
                bgAssetPath: bgPath,
                chapterTransition: {
                  chapterName: parts[0]?.trim() || newSection.title,
                  chapterTitle: parts.slice(1).join('·').trim() || '',
                  isEpilogue: true,
                },
              });
            } else {
              this._updateState({
                phase: GamePhase.SectionTransition,
                bgAssetPath: bgPath,
                sectionTransition: {
                  chapterName: chapter.name,
                  sectionTitle: newSection?.title || '',
                  sectionLabel: this._sectionLabel(chapter, newSectionIndex),
                },
              });
            }
            return;
          }
          this._currentSectionIndex = newSectionIndex;
        } else {
          this._currentSectionIndex = newSectionIndex;
        }
      }
    }

    this._currentNode = node;
    this._currentDialogue = node.dialogue || [];
    this._dialogueIndex = 0;
    this._ensureMj();
    this._currentChoices = this._engine.getVisibleChoices(node.choices, this._gameState);
    this._responseQueue = [];
    this._responseIndex = 0;
    this._pendingNextId = null;

    const bgPath = visual?.bg?.replace(/^assets\//, '') || null;

    this._updateState({
      currentNodeId: nodeId,
      sceneTitle: node.sceneTitle || '',
      bgAssetPath: bgPath,
      uiTheme: 'Dark',
      mood: visual?.mood || null,
      mode: node.mode || 'vn',
      speaker: '',
      text: '',
      choices: [],
      ending: null,
      errorMessage: null,
    });

    if (visual?.bg || visual?.bgm) {
      this.dispatchEvent(new CustomEvent('scenechange', {
        detail: { bg: bgPath, uiTheme: 'Dark', mood: visual?.mood, bgm: visual?.bgm || null },
      }));
    }

    // Auto-advance single autoAdvance choice with no dialogue
    if (this._currentDialogue.length === 0 && this._currentChoices.length === 1 && this._currentChoices[0].autoAdvance) {
      const choice = this._currentChoices[0];
      this._gameState.applyEffects(choice.effects);
      if (this._handleEndingTransition(choice)) return;
      const nextId = this._engine.processChoiceTransition(choice)
        || this._engine.getNextNodeId(nodeId, this._gameState);
      if (nextId) { this._navigateToNode(nextId); return; }
    }

    if (this._currentDialogue.length > 0) {
      this._showDialogueLine();
    } else if (this._currentChoices.length > 0) {
      this._presentChoices();
    } else {
      const nextId = this._engine.getNextNodeId(nodeId, this._gameState);
      if (nextId) this._navigateToNode(nextId);
    }

    this.saveAutoProgress();
  }

  // ── Dialogue ──

  _showDialogueLine() {
    if (this._dialogueIndex >= this._currentDialogue.length) {
      this._onDialogueComplete();
      return;
    }

    const line = this._currentDialogue[this._dialogueIndex];

    // Long narration detection
    if (!line.speaker && line.display !== 'fullscreen') {
      const block = [];
      let lookahead = this._dialogueIndex;
      while (lookahead < this._currentDialogue.length) {
        const next = this._currentDialogue[lookahead];
        if (next.speaker || next.display === 'fullscreen') break;
        block.push(this._templateResolver.resolve(next.text));
        lookahead++;
      }
      if (block.length >= 3) {
        for (const t of block) {
          this._backlog.push({ speaker: '', text: t });
        }
        this._dialogueIndex = lookahead;
        this._updateState({
          phase: GamePhase.Dialogue,
          speaker: '',
          text: '',
          displayType: 'long_narration',
          longNarrationTexts: block,
          choices: [],
        });
        return;
      }
    }

    const resolvedText = this._templateResolver.resolve(line.text);
    const resolvedSpeaker = this._templateResolver.resolve(line.speaker || '');
    this._backlog.push({ speaker: resolvedSpeaker, text: resolvedText });

    this._updateState({
      phase: GamePhase.Dialogue,
      speaker: resolvedSpeaker,
      text: resolvedText,
      displayType: line.display || 'bottom',
      longNarrationTexts: [],
      choices: [],
    });

    if (this._state.isAutoPlaying) this._startAutoTimer();
  }

  _advanceDialogue() {
    this._dialogueIndex++;
    this._showDialogueLine();
  }

  _onDialogueComplete() {
    if (this._currentChoices.length === 0) {
      const nextId = this._engine.getNextNodeId(this._state.currentNodeId, this._gameState);
      if (nextId) this._navigateToNode(nextId);
    } else if (this._currentChoices.length === 1 && this._currentChoices[0].autoAdvance) {
      const choice = this._currentChoices[0];
      this._gameState.applyEffects(choice.effects);
      if (this._handleEndingTransition(choice)) return;
      this._pendingNextId = this._engine.processChoiceTransition(choice);
      if (choice.responses && choice.responses.length > 0) {
        this._responseQueue = choice.responses;
        this._responseIndex = 0;
        this._showResponseLine();
      } else {
        this._advanceAfterChoice();
      }
    } else {
      this._presentChoices();
    }
  }

  _presentChoices() {
    this._stopAuto();
    this._stopSkip();
    const resolved = this._currentChoices.map(c => ({
      ...c,
      label: this._templateResolver.resolve(c.label),
    }));
    this._updateState({
      phase: GamePhase.Choice,
      choices: resolved,
    });
  }

  // ── Response ──

  _showResponseLine() {
    if (this._responseIndex >= this._responseQueue.length) {
      this._advanceAfterChoice();
      return;
    }
    const line = this._responseQueue[this._responseIndex];
    const resolvedText = this._templateResolver.resolve(line.text);
    const resolvedSpeaker = this._templateResolver.resolve(line.speaker || '');
    this._backlog.push({ speaker: resolvedSpeaker, text: resolvedText });

    this._updateState({
      phase: GamePhase.Response,
      speaker: resolvedSpeaker,
      text: resolvedText,
      displayType: line.display || 'bottom',
      choices: [],
    });

    if (this._state.isAutoPlaying) this._startAutoTimer();
  }

  _advanceResponse() {
    this._responseIndex++;
    this._showResponseLine();
  }

  _advanceAfterChoice() {
    const nextId = this._pendingNextId
      || this._engine.getNextNodeId(this._state.currentNodeId, this._gameState);
    this._pendingNextId = null;
    if (nextId) this._navigateToNode(nextId);
  }

  _handleEndingTransition(choice) {
    if (choice.transition?.type !== 'ending') return false;
    const tier = choice.transition.tier;
    if (tier) {
      const def = this._engine.getEndingDefinitions()[tier];
      if (def) {
        this._stopAuto();
        this._stopSkip();
        if (this._isReplayMode) {
          this._emitReplayComplete();
          return true;
        }
        const endingId = `end_${tier}`;
        this._progressManager.unlockEnding(endingId);
        this._saveManager.deleteAutoSave();

        // Look up ending's scene visual for background image
        const visual = this._engine.getSceneVisual(endingId);
        const bgPath = visual?.bg?.replace(/^assets\//, '') || null;

        this._updateState({ phase: GamePhase.Ending, ending: def, bgAssetPath: bgPath });
        return true;
      }
    }
    return false;
  }

  // ── Ending ──

  _showEnding(resolution) {
    this._stopAuto();
    this._stopSkip();
    if (this._isReplayMode) {
      this._emitReplayComplete();
      return;
    }
    this._progressManager.unlockEnding(resolution.endingId);
    this._saveManager.deleteAutoSave();

    // Look up ending's scene visual for background image
    const visual = this._engine.getSceneVisual(resolution.endingId);
    const bgPath = visual?.bg?.replace(/^assets\//, '') || null;

    this._updateState({
      phase: GamePhase.Ending,
      ending: resolution.definition,
      bgAssetPath: bgPath,
    });
  }

  // ── Auto / Skip ──

  _stopAuto() {
    if (this._autoTimer) { clearTimeout(this._autoTimer); this._autoTimer = null; }
    if (this._state.isAutoPlaying) this._updateState({ isAutoPlaying: false });
  }

  _stopSkip() {
    if (this._skipTimer) { clearInterval(this._skipTimer); this._skipTimer = null; }
    if (this._state.isSkipping) this._updateState({ isSkipping: false });
  }

  _startAutoTimer() {
    if (this._autoTimer) clearTimeout(this._autoTimer);
    const delay = this._settingsManager.getAutoDelayMs();
    this._autoTimer = setTimeout(() => {
      const phase = this._state.phase;
      if (phase === GamePhase.Dialogue || phase === GamePhase.Response) {
        this.onTap();
      }
    }, delay);
  }

  _startSkipLoop() {
    if (this._skipTimer) clearInterval(this._skipTimer);
    const delay = this._settingsManager.getSkipDelayMs();
    const interval = delay === 0 ? 10 : delay;
    this._skipTimer = setInterval(() => {
      const phase = this._state.phase;
      if (phase === GamePhase.Dialogue || phase === GamePhase.Response) {
        this.onTap();
      } else {
        this._stopSkip();
      }
    }, interval);
  }

  // ── State update ──

  _updateState(partial) {
    Object.assign(this._state, partial);
    this.dispatchEvent(new CustomEvent('statechange', { detail: this._state }));
  }
}
