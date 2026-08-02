import {
  STORY_CHAPTER_PRESENTATIONS,
  STORY_IMPORTANT_NODES,
  storyRouteLabel,
  storyRoutePrefix,
  storyDisplayLines,
  questionMarks,
  PART8_ROUTE_ORDER,
} from '../../data/StoryMapPresentation.js';

/**
 * Story map — the web mirror of the Android `ChapterScreen`.
 *
 * Authority: MinSpec §27. Two levels: an eight-chapter overview, and a chapter
 * subpage where every section is its own node. Plain sections are a dot plus an
 * index plus a title with no card behind them (§27.2 forbids a card grid); only
 * key beats become picture nodes. Chapter 8 opens into three parallel routes.
 *
 * The old ChapterSelectOverlay catalogue this replaces was retired by
 * DEC-20260726: the chapter entry point goes straight into the map, with no
 * intermediate list.
 */
export class StoryMapOverlay {
  constructor(container, { controller, onClose, onJump }) {
    this._controller = controller;
    this._onClose = onClose;
    this._onJump = onJump;

    this._selectedChapterId = null;
    this._scrollMemory = {};

    this.el = document.createElement('div');
    this.el.className = 'overlay story-map-overlay';
    container.appendChild(this.el);

    this._onClick = this._handleClick.bind(this);
    this.el.addEventListener('click', this._onClick);

    this._render();
  }

  // ---------------------------------------------------------------- data

  _chapters() {
    return this._controller.getChapters()
      .filter(ch => ch.id !== 'prologue' && ch.sections?.length);
  }

  _sectionState(chapter, index) {
    const state = this._controller.getSectionState(
      chapter.id, index, chapter.sections[index].startNode,
    );
    if (state !== 'LOCKED') return state;
    if (this._scopeUnlockedByEnding(chapter.sections[index].scope)) return 'COMPLETED';
    return state;
  }

  _scopeUnlockedByEnding(scope) {
    if (!this._endingScopes) {
      const endings = this._controller.getUnlockedEndings();
      this._endingScopes = new Set();
      if (endings.has('end_true') || endings.has('end_good')) this._endingScopes.add('dream');
      if (endings.has('end_normal')) this._endingScopes.add('stay');
      if (endings.has('end_bad')) this._endingScopes.add('bad');
      if (endings.size > 0) {
        this._endingScopes.add('common');
        this._endingScopes.add('M');
        this._endingScopes.add('J');
      }
    }
    if (!scope || scope === 'common') return this._endingScopes.has('common');
    return this._endingScopes.has(scope);
  }

  _isOpen(state) {
    return state === 'COMPLETED' || state === 'SKIPPED_COMPLETED' || state === 'IN_PROGRESS';
  }

  _chapterUnlocked(chapter) {
    const visited = this._controller.getVisitedNodes();
    if (chapter.sections.some(s => visited.has(s.startNode))) return true;
    return chapter.sections.some(s => this._scopeUnlockedByEnding(s.scope));
  }

  _bg(nodeId) {
    return this._controller.getNodeBgPath?.(nodeId) || null;
  }

  // -------------------------------------------------------------- render

  _render() {
    const chapter = this._chapters().find(c => c.id === this._selectedChapterId);
    const body = chapter ? this._chapterHtml(chapter) : this._overviewHtml();

    this.el.innerHTML = `
      <div class="system-bg"><img src="../design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png" alt="" /></div>
      <div class="system-bg-overlay"></div>
      <div class="story-map-header">
        <button class="overlay-back-btn" data-action="back" aria-label="返回">←</button>
      </div>
      <div class="story-map-scroll" data-scroll>${body}</div>
    `;

    const scroller = this.el.querySelector('[data-scroll]');
    const key = this._selectedChapterId || '__overview__';
    if (scroller) {
      scroller.scrollTop = this._scrollMemory[key] || 0;
      scroller.addEventListener('scroll', () => {
        this._scrollMemory[key] = scroller.scrollTop;
      }, { passive: true });
    }

  }

  _playedSections(chapter) {
    return chapter.sections.reduce((n, _, i) => n + (this._isOpen(this._sectionState(chapter, i)) ? 1 : 0), 0);
  }

  /** §27.12 — eight landmarks, unlocked ones lit, locked ones masked. */
  _overviewHtml() {
    const chapters = this._chapters();
    const cards = chapters.map((chapter, ci) => {
      const pres = STORY_CHAPTER_PRESENTATIONS[chapter.id];
      if (!pres) return '';
      const unlocked = this._chapterUnlocked(chapter);
      const cover = unlocked ? this._bg(pres.overviewCoverNode) : null;
      const played = this._playedSections(chapter);
      const total = Math.min(chapter.sections.length, 11);

      const title = unlocked
        ? (chapter.name || pres.number)
        : `<span class="masked">${questionMarks(chapter.name || pres.number)}</span>`;
      const subtitle = unlocked
        ? (chapter.title || pres.subtitle || '')
        : questionMarks(chapter.title || pres.subtitle || pres.title);

      const dots = Array.from({ length: total }, (_, i) =>
        `<span class="story-diamond ${i < played ? 'is-lit' : ''}"></span>`
      ).join('');

      const side = ci % 2 === 0 ? 'flex-end' : 'flex-start';
      const card = `
        <button class="story-landmark ${unlocked ? 'is-open' : 'is-locked'}"
                style="align-self:${side}"
                data-chapter="${chapter.id}" ${unlocked ? '' : 'disabled'}>
          <span class="story-landmark-frame">
            ${cover
              ? `<img src="../assets/${cover}" alt="" loading="lazy" />`
              : '<span class="story-landmark-seal" aria-hidden="true"></span>'}
          </span>
          <span class="story-landmark-info">
            <span class="story-landmark-kicker">Chapter ${ci + 1}</span>
            <span class="story-landmark-title">${title}</span>
            <span class="story-landmark-desc">${subtitle}</span>
          </span>
          <span class="story-landmark-dots">${dots}</span>
        </button>
      `;

      const connector = ci < chapters.length - 1
        ? this._overviewConnectorSvg(ci % 2 === 0, this._chapterUnlocked(chapters[ci + 1]))
        : '';

      return card + connector;
    }).join('');

    return `
      <div class="story-overview">
        <p class="story-kicker">CHAPTER 总览</p>
        <h2 class="story-heading">他的世界，正在展开</h2>
        <p class="story-sub">走过的故事会亮起来。点击亮起的章节，靠近那段记忆。</p>
        <div class="story-landmarks">${cards}</div>
        <p class="story-hint">向下浏览 · 走过的章节会亮起来</p>
      </div>
    `;
  }

  _overviewConnectorSvg(fromRight, nextLit) {
    const fromX = fromRight ? 62 : 38;
    const toX = fromRight ? 38 : 62;
    const color = nextLit ? 'rgba(215,190,134,0.70)' : 'rgba(154,168,186,0.26)';
    const w = nextLit ? 1.3 : 1.05;
    return `
      <svg class="story-overview-connector" viewBox="0 0 100 66" preserveAspectRatio="none" aria-hidden="true">
        <path d="M${fromX} 0 L${fromX} 33 L${toX} 33 L${toX} 66"
              fill="none" stroke="${color}" stroke-width="${w}"
              vector-effect="non-scaling-stroke"/>
      </svg>
    `;
  }

  _chapterHtml(chapter) {
    const pres = STORY_CHAPTER_PRESENTATIONS[chapter.id] || {};
    const chapters = this._chapters();
    const at = chapters.findIndex(c => c.id === chapter.id);
    const prev = chapters[at - 1];
    const next = chapters[at + 1];

    const body = chapter.id === 'part8'
      ? this._routeForkHtml(chapter)
      : this._linearNodesHtml(chapter);

    return `
      <div class="story-chapter">
        <header class="story-chapter-head">
          <p class="story-kicker">${pres.kicker || ''}</p>
          <h2 class="story-heading">${pres.title || chapter.name}</h2>
          <p class="story-sub">${pres.subtitle || ''}</p>
        </header>
        ${body}
        <nav class="story-pager">
          <button class="story-pager-arrow" data-chapter="${prev?.id || ''}"
                  ${prev ? '' : 'disabled'} aria-label="上一章">◀</button>
          <span class="story-pager-copy">
            <span class="story-pager-kicker">第 ${at + 1} 章</span>
            <span class="story-pager-title">${pres.title || chapter.name}</span>
            <span class="story-pager-count">${String(at + 1).padStart(2, '0')} / ${String(chapters.length).padStart(2, '0')}</span>
          </span>
          <button class="story-pager-arrow" data-chapter="${next?.id || ''}"
                  ${next ? '' : 'disabled'} aria-label="下一章">▶</button>
        </nav>
      </div>
    `;
  }

  /** Chapters 1–7: nodes alternate sides, joined by right-angle connectors. */
  _linearNodesHtml(chapter) {
    const items = chapter.sections.map((section, index) => {
      const state = this._sectionState(chapter, index);
      const open = this._isOpen(state);
      const important = STORY_IMPORTANT_NODES.has(section.startNode);
      const cf = index % 2 === 0 ? 0.34 : 0.68;
      const label = String(index + 1).padStart(2, '0');

      const node = important
        ? this._pictureNodeHtml({ section, index, state, open, label, cf })
        : this._textNodeHtml({ section, index, state, open, label, cf });

      const pieces = [];
      if (index > 0) {
        const prevCf = (index - 1) % 2 === 0 ? 0.34 : 0.68;
        const prevImportant = STORY_IMPORTANT_NODES.has(chapter.sections[index - 1].startNode);
        const nextLit = open;
        pieces.push(`<li class="story-row">${this._nodeConnectorSvg(prevCf, cf, prevImportant, important, nextLit)}</li>`);
      }
      pieces.push(`<li class="story-row ${important ? 'story-row-pic' : 'story-row-text'}">${node}</li>`);

      return pieces.join('');
    }).join('');

    return `<ol class="story-nodes">${items}</ol>`;
  }

  _nodeConnectorSvg(fromFrac, toFrac, fromBig, toBig, lit) {
    const color = lit ? 'rgba(215,190,134,0.70)' : 'rgba(154,168,186,0.26)';
    const w = lit ? 1.3 : 1.05;
    const fromX = fromFrac * 100;
    const toX = toFrac * 100;
    return `
      <svg class="story-connector-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M${fromX} 0 L${fromX} 50 L${toX} 50 L${toX} 100"
              fill="none" stroke="${color}" stroke-width="${w}"
              vector-effect="non-scaling-stroke"/>
      </svg>`;
  }

  _textNodeHtml({ section, index, state, open, label, cf }) {
    const nodeOnRight = cf > 0.5;
    const lines = open
      ? storyDisplayLines(section.title).map(l => `<span>${l}</span>`).join('')
      : `<span>${questionMarks(section.title)}</span>`;

    return `
      <button class="story-node story-node-text ${open ? 'is-open' : 'is-locked'}"
              style="--center:${cf}"
              data-start="${section.startNode}" data-section="${index}"
              ${open ? '' : 'disabled'}>
        <span class="story-node-dot" aria-hidden="true"></span>
        <span class="story-node-copy ${nodeOnRight ? 'align-end' : 'align-start'}">
          <span class="story-node-index">${label}</span>
          <span class="story-node-title">${lines}</span>
        </span>
      </button>
    `;
  }

  _pictureNodeHtml({ section, index, state, open, label, cf }) {
    const bg = open ? this._bg(section.startNode) : null;
    const lines = open
      ? storyDisplayLines(section.title).map(l => `<span>${l}</span>`).join('')
      : `<span>${questionMarks(section.title)}</span>`;

    return `
      <button class="story-node story-node-pic ${open ? 'is-open' : 'is-locked'}"
              style="--center:${cf}"
              data-start="${section.startNode}" data-section="${index}"
              ${open ? '' : 'disabled'}>
        <span class="story-node-art">
          ${bg
            ? `<img src="../assets/${bg}" alt="" loading="lazy" />`
            : '<span class="story-node-seal" aria-hidden="true"></span>'}
        </span>
        <span class="story-node-gradient"></span>
        <span class="story-node-caption">
          <span class="story-node-index">${label}</span>
          <span class="story-node-title">${lines}</span>
        </span>
      </button>
    `;
  }

  /**
   * §27.11 — chapter 8: vertical flow layout matching Android StoryPartEightMap.
   * Common opener → branch hub → each route with its own header + normal nodes.
   */
  _routeForkHtml(chapter) {
    const common = [];
    const routes = { dream: [], stay: [], bad: [] };

    chapter.sections.forEach((section, index) => {
      const entry = { section, index, state: this._sectionState(chapter, index) };
      if (section.scope && routes[section.scope]) routes[section.scope].push(entry);
      else common.push(entry);
    });

    const pieces = [];

    const first = common[0];
    if (first) {
      const open = this._isOpen(first.state);
      pieces.push(`<li class="story-row story-row-pic">${this._pictureNodeHtml({
        section: first.section, index: first.index, state: first.state,
        open, label: '01 · 共同线', cf: 0.5,
      })}</li>`);
    }

    pieces.push(`<li class="story-branch-hub">${this._branchHubHtml()}</li>`);

    PART8_ROUTE_ORDER.forEach((scope, routeOrdinal) => {
      const route = routes[scope] || [];
      if (!route.length) return;

      pieces.push(`<li class="story-route-header">
        <span class="story-route-kicker">ROUTE ${String(routeOrdinal + 1).padStart(2, '0')}</span>
        <span class="story-route-label">${storyRouteLabel(scope)}</span>
      </li>`);

      pieces.push('<li class="story-route-spacer"></li>');

      route.forEach((entry, ri) => {
        const open = this._isOpen(entry.state);
        const important = STORY_IMPORTANT_NODES.has(entry.section.startNode);
        const cf = ri % 2 === 0 ? 0.34 : 0.68;
        const label = `${storyRoutePrefix(scope)}${ri + 1}`;

        if (ri > 0) {
          const prevCf = (ri - 1) % 2 === 0 ? 0.34 : 0.68;
          const prevImportant = STORY_IMPORTANT_NODES.has(route[ri - 1].section.startNode);
          pieces.push(`<li class="story-row">${this._nodeConnectorSvg(prevCf, cf, prevImportant, important, open)}</li>`);
        }

        const node = important
          ? this._pictureNodeHtml({ section: entry.section, index: entry.index, state: entry.state, open, label, cf })
          : this._textNodeHtml({ section: entry.section, index: entry.index, state: entry.state, open, label, cf });

        pieces.push(`<li class="story-row ${important ? 'story-row-pic' : 'story-row-text'}">${node}</li>`);
      });

      pieces.push('<li class="story-route-gap"></li>');
    });

    return `<ol class="story-nodes">${pieces.join('')}</ol>`;
  }

  _branchHubHtml() {
    return `
      <svg class="story-branch-svg" viewBox="0 0 100 132" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path d="M50 0 L50 42 L17 42 L17 78" fill="none" stroke="rgba(215,190,134,0.58)" stroke-width="1.2" vector-effect="non-scaling-stroke"/>
        <path d="M50 42 L50 78" fill="none" stroke="rgba(215,190,134,0.58)" stroke-width="1.2" vector-effect="non-scaling-stroke"/>
        <path d="M50 42 L83 42 L83 78" fill="none" stroke="rgba(215,190,134,0.58)" stroke-width="1.2" vector-effect="non-scaling-stroke"/>
      </svg>
      <div class="story-branch-gates">
        <span class="story-branch-gate">DREAM</span>
        <span class="story-branch-gate">STAY</span>
        <span class="story-branch-gate">BAD</span>
      </div>
    `;
  }

  // -------------------------------------------------------------- events

  _handleClick(e) {
    e.stopPropagation();

    if (e.target.closest('[data-action="back"]')) {
      if (this._selectedChapterId) {
        this._selectedChapterId = null;
        this._render();
      } else {
        this._onClose();
      }
      return;
    }

    const pager = e.target.closest('.story-pager-arrow[data-chapter]');
    if (pager && pager.dataset.chapter) {
      this._selectedChapterId = pager.dataset.chapter;
      this._render();
      return;
    }

    const landmark = e.target.closest('.story-landmark[data-chapter]');
    if (landmark && !landmark.disabled) {
      this._selectedChapterId = landmark.dataset.chapter;
      this._render();
      return;
    }

    const node = e.target.closest('.story-node[data-start], .story-fork-node[data-start]');
    if (node && !node.disabled && this._onJump) {
      this._onJump(
        node.dataset.start,
        this._selectedChapterId,
        parseInt(node.dataset.section, 10),
      );
    }
  }

  destroy() {
    this.el.removeEventListener('click', this._onClick);
    this.el.remove();
  }
}
