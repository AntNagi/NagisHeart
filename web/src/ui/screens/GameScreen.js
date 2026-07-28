import { GamePhase } from '../../controller/GameController.js';
import { SceneBackground } from '../components/SceneBackground.js';
import { DialogueBox } from '../components/DialogueBox.js';
import { NarrationOverlay } from '../components/NarrationOverlay.js';
import { ChoicePanel } from '../components/ChoicePanel.js';
import { HUD } from '../components/HUD.js';
import { TransitionCard } from '../components/TransitionCard.js';
import { NagiDialog } from '../components/NagiDialog.js';
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

    // Keyboard: Space/Enter for typewriter skip + advance, Esc for menu, Ctrl for skip
    this._onKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this._handleTap();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (this._activeOverlay) {
          this._closeOverlay();
        } else {
          // §29.3: 剧情 HUD 不保留其他菜单，Esc 直接返回主页
          this._ctx.router.navigate('start');
        }
      } else if (e.key === 'Control') {
        e.preventDefault();
        if (!this._controller.state.isSkipping) {
          this._controller.toggleSkip();
        }
      }
    };
    this._onKeyUp = (e) => {
      if (e.key === 'Control' && this._controller.state.isSkipping) {
        this._controller.toggleSkip();
      }
    };
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);

    // UI layer (pointer-events: none, children opt-in)
    this._uiLayer = document.createElement('div');
    this._uiLayer.className = 'game-ui-layer';
    this.el.appendChild(this._uiLayer);

    // Components
    this._hud = new HUD(this._uiLayer);
    this._dialogueBox = new DialogueBox(this._uiLayer);
    this._narration = new NarrationOverlay(this._uiLayer);
    // Fix: narration overlay blocks tap-area clicks. Forward taps to game's tap handling.
    this._narration.setOnNarrationTap(() => this._handleNarrationTap());
    this._choicePanel = new ChoicePanel(this._uiLayer);
    this._transitionCard = new TransitionCard(this._uiLayer);

    // TransitionCard tap advances Opening/Clear
    this._transitionCard.setOnTap(() => this._controller.onTap());

    // Active overlay
    this._activeOverlay = null;

    // HUD actions
    this._hud.setOnAction((action) => {
      switch (action) {
        case 'auto': this._controller.toggleAuto(); break;
        case 'save': this._openSaveLoad('save'); break;
        case 'backlog': this._openBacklog(); break;
        case 'back': this._ctx.router.navigate('start'); break;
        case 'skipSection': this._confirmSkipSection(); break;
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

    // Long narration takes priority
    if (state.displayType === 'long_narration' && this._narration.isActive) {
      if (this._narration.handleTap()) return;
      // Narration consumed but still active — force hide and advance
      this._narration.hide();
      this._controller.onTap();
      return;
    }

    // If narration is stuck in unexpected state, clean it up
    if (this._narration.isActive) {
      this._narration.hide();
    }

    if (this._dialogueBox.isAnimating) {
      this._dialogueBox.completeText();
      return;
    }
    this._controller.onTap();
  }

  // Fix: narration overlay blocks tap-area clicks. This handles taps on narration.
  _handleNarrationTap() {
    const state = this._controller.state;
    if (state.displayType === 'long_narration' && this._narration.isActive) {
      if (this._narration.handleTap()) return;
      this._narration.hide();
      this._controller.onTap();
      return;
    }
    if (this._narration.isActive) {
      this._narration.hide();
    }
    this._controller.onTap();
  }

  _confirmSkipSection() {
    if (this._activeOverlay) return;
    NagiDialog.show(this.el, {
      title: '跳过本节？',
      body: '跳过后将进入下一小节开始。\n如果已在最后一小节，则进入大章结束或结局流程。',
      dismiss: '取消',
      confirm: '确认跳过',
      onDismiss: () => {},
      onConfirm: () => { this._controller.skipToSectionClear(); },
    });
  }



  _openSaveLoad(mode) {
    this._activeOverlay = new SaveLoadOverlay(this.el, {
      controller: this._controller,
      mode,
      onClose: () => this._closeOverlay(),
      onLoaded: () => { this._closeOverlay(); },
      onSaved: () => { this._showToast('存档成功'); },
    });
  }

  _showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'game-toast';
    toast.textContent = message;
    this.el.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 1500);
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
      // Re-render to sync UI with controller state after overlay closes
      this._render(this._controller.state);
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

    // HUD — hide during full-screen Opening/Clear states
    const isFullscreenTransition = state.phase === GamePhase.ChapterTransition
      || state.phase === GamePhase.ChapterEnding
      || state.phase === GamePhase.SectionTransition
      || state.phase === GamePhase.SectionEnding;
    const isGameplay = state.phase === GamePhase.Dialogue || state.phase === GamePhase.Response || state.phase === GamePhase.Choice;
    this._hud.setVisible(!isFullscreenTransition);
    this._hud.update({
      sceneTitle: state.sceneTitle,
      isAutoPlaying: state.isAutoPlaying,
      showSkipSection: isGameplay,
    });

    // When an overlay is open, don't update gameplay layers
    if (this._activeOverlay) return;

    // Sync text speed from settings
    this._dialogueBox.setCharDelay(this._controller.getSettingsManager().getTextSpeedMs());

    // Determine which layer to show
    const isDialogue = state.phase === GamePhase.Dialogue || state.phase === GamePhase.Response;
    const isNarration = isDialogue && (state.displayType === 'fullscreen' || state.displayType === 'long_narration');
    const isBottomDialogue = isDialogue && !isNarration;
    const isChoice = state.phase === GamePhase.Choice;

    if (!isBottomDialogue) this._dialogueBox.hide();
    if (!isNarration) this._narration.hide();
    if (!isChoice) this._choicePanel.hide();
    if (!isFullscreenTransition) this._transitionCard.hide();

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
            onCatalog: () => this._openChapterSelect(),
            onNext: () => this._controller.onTap(),
          });
        }
        break;

      case GamePhase.SectionTransition:
        if (state.sectionTransition) {
          this._transitionCard.showSectionOpening(state.sectionTransition);
        }
        break;

      case GamePhase.SectionEnding:
        if (state.sectionTransition) {
          this._transitionCard.showSectionEnding({
            ...state.sectionTransition,
            onCatalog: () => this._openChapterSelect(),
            onNext: () => this._controller.onTap(),
          });
        }
        break;

      case GamePhase.Ending:
        this._ctx.router.navigate('ending', { ending: state.ending, bgAssetPath: state.bgAssetPath });
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
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
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
