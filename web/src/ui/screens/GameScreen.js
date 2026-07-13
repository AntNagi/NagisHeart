import { GamePhase } from '../../controller/GameController.js';
import { SceneBackground } from '../components/SceneBackground.js';
import { DialogueBox } from '../components/DialogueBox.js';
import { NarrationOverlay } from '../components/NarrationOverlay.js';
import { ChoicePanel } from '../components/ChoicePanel.js';
import { HUD } from '../components/HUD.js';
import { TransitionCard } from '../components/TransitionCard.js';
import { GameMenuOverlay } from '../overlays/GameMenuOverlay.js';
import { SaveLoadOverlay } from '../overlays/SaveLoadOverlay.js';
import { SettingsOverlay } from '../overlays/SettingsOverlay.js';
import { BacklogOverlay } from '../overlays/BacklogOverlay.js';
import { ChapterSelectOverlay } from '../overlays/ChapterSelectOverlay.js';

export class GameScreen {
  constructor(container, ctx) {
    this._ctx = ctx;
    this._controller = ctx.controller;

    this.el = document.createElement('div');
    this.el.className = 'screen game-screen';

    // Scene background
    this._bg = new SceneBackground(this.el);

    // Tap area
    this._tapArea = document.createElement('div');
    this._tapArea.className = 'game-screen-tap-area';
    this._tapArea.addEventListener('click', () => this._handleTap());
    this.el.appendChild(this._tapArea);

    // UI layer (pointer-events: none, children opt-in)
    this._uiLayer = document.createElement('div');
    this._uiLayer.className = 'game-ui-layer';
    this.el.appendChild(this._uiLayer);

    // Components
    this._hud = new HUD(this._uiLayer);
    this._dialogueBox = new DialogueBox(this._uiLayer);
    this._narration = new NarrationOverlay(this._uiLayer);
    this._choicePanel = new ChoicePanel(this._uiLayer);
    this._transitionCard = new TransitionCard(this._uiLayer);

    // Active overlay
    this._activeOverlay = null;

    // HUD actions
    this._hud.setOnAction((action) => {
      switch (action) {
        case 'auto': this._controller.toggleAuto(); break;
        case 'skip': this._controller.toggleSkip(); break;
        case 'menu': this._openMenu(); break;
      }
    });

    // Listen to controller events
    this._onStateChange = (e) => this._render(e.detail);
    this._controller.addEventListener('statechange', this._onStateChange);

    container.appendChild(this.el);

    // Initial render
    this._render(this._controller.state);
  }

  _handleTap() {
    if (this._activeOverlay) return;
    const state = this._controller.state;
    if (this._narration.isActive && state.displayType === 'long_narration') {
      if (this._narration.handleTap()) return;
    }
    this._controller.onTap();
  }

  _openMenu() {
    if (this._activeOverlay) return;
    if (this._controller.state.isAutoPlaying) this._controller.toggleAuto();
    if (this._controller.state.isSkipping) this._controller.toggleSkip();
    this._activeOverlay = new GameMenuOverlay(this.el, {
      onClose: () => this._closeOverlay(),
      onSelect: (action) => {
        this._closeOverlay();
        switch (action) {
          case 'save': this._openSaveLoad('save'); break;
          case 'load': this._openSaveLoad('load'); break;
          case 'backlog': this._openBacklog(); break;
          case 'chapters': this._openChapterSelect(); break;
          case 'settings': this._openSettings(); break;
          case 'title': this._ctx.router.navigate('start'); break;
        }
      },
    });
  }

  _openSaveLoad(mode) {
    this._activeOverlay = new SaveLoadOverlay(this.el, {
      controller: this._controller,
      mode,
      onClose: () => this._closeOverlay(),
      onLoaded: () => { this._closeOverlay(); },
    });
  }

  _openBacklog() {
    this._activeOverlay = new BacklogOverlay(this.el, {
      controller: this._controller,
      onClose: () => this._closeOverlay(),
    });
  }

  _openChapterSelect() {
    this._activeOverlay = new ChapterSelectOverlay(this.el, {
      controller: this._controller,
      onClose: () => this._closeOverlay(),
      onJump: (startNode, chapterId, sectionIndex) => {
        this._closeOverlay();
        this._controller.replayFromSection(startNode, chapterId, sectionIndex);
      },
    });
  }

  _openSettings() {
    this._activeOverlay = new SettingsOverlay(this.el, {
      settingsManager: this._controller.getSettingsManager(),
      onClose: () => this._closeOverlay(),
      onThemeChange: (theme) => {
        document.getElementById('app').setAttribute('data-theme', theme.toLowerCase());
      },
    });
  }

  _closeOverlay() {
    if (this._activeOverlay) {
      this._activeOverlay.destroy();
      this._activeOverlay = null;
    }
  }

  _render(state) {
    // Theme
    document.getElementById('app').setAttribute('data-theme',
      (state.uiTheme || 'Dark').toLowerCase());

    // Background
    if (state.bgAssetPath) {
      this._bg.update(state.bgAssetPath);
    }

    // HUD
    this._hud.update({
      sceneTitle: state.sceneTitle,
      isAutoPlaying: state.isAutoPlaying,
      isSkipping: state.isSkipping,
    });

    // Determine which layer to show
    const isDialogue = state.phase === GamePhase.Dialogue || state.phase === GamePhase.Response;
    const isNarration = isDialogue && (state.displayType === 'fullscreen' || state.displayType === 'long_narration');
    const isBottomDialogue = isDialogue && !isNarration;
    const isChoice = state.phase === GamePhase.Choice;
    const isTransition = state.phase === GamePhase.ChapterTransition
      || state.phase === GamePhase.ChapterEnding
      || state.phase === GamePhase.SectionTransition;

    if (!isBottomDialogue) this._dialogueBox.hide();
    if (!isNarration) this._narration.hide();
    if (!isChoice) this._choicePanel.hide();
    if (!isTransition) this._transitionCard.hide();

    switch (state.phase) {
      case GamePhase.Dialogue:
      case GamePhase.Response:
        this._renderDialogue(state);
        break;

      case GamePhase.Choice:
        this._choicePanel.show(state.choices, (idx) => {
          this._controller.onChoiceSelected(idx);
        });
        break;

      case GamePhase.ChapterTransition:
        if (state.chapterTransition) {
          this._transitionCard.showChapterOpening(state.chapterTransition);
        }
        break;

      case GamePhase.ChapterEnding:
        if (state.chapterTransition) {
          this._transitionCard.showChapterEnding({
            ...state.chapterTransition,
            bgPath: state.bgAssetPath,
          });
        }
        break;

      case GamePhase.SectionTransition:
        if (state.sectionTransition) {
          this._transitionCard.showSectionOpening(state.sectionTransition);
        }
        break;

      case GamePhase.Ending:
        this._ctx.router.navigate('ending', { ending: state.ending });
        break;

      case GamePhase.Error:
        console.error('Game error:', state.errorMessage);
        break;
    }
  }

  _renderDialogue(state) {
    switch (state.displayType) {
      case 'fullscreen':
        this._narration.showFullscreen(state.text);
        break;
      case 'long_narration':
        this._narration.showLongNarration(state.longNarrationTexts, () => {
          this._controller.onTap();
        });
        break;
      default:
        this._dialogueBox.update({
          speaker: state.speaker,
          text: state.text,
          display: 'bottom',
        });
        break;
    }
  }

  destroy() {
    this._closeOverlay();
    this._controller.removeEventListener('statechange', this._onStateChange);
    this._bg.destroy();
    this._dialogueBox.destroy();
    this._narration.destroy();
    this._choicePanel.destroy();
    this._hud.destroy();
    this._transitionCard.destroy();
    this.el.remove();
  }
}
