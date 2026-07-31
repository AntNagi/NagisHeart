import {
  STORY_CHAPTER_PRESENTATIONS,
  STORY_IMPORTANT_NODES,
  storyRouteLabel,
  storyRoutePrefix,
  storyDisplayLines,
  questionMarks,
  PART8_MAP,
  PART8_COLUMN_X,
  PART8_ROUTE_ORDER,
  PART8_COMMON,
  PART8_NODE_WIDTH,
  PART8_LABEL_Y,
  PART8_IMAGE_SIZE,
  PART8_TRUNK,
  PART8_GUIDE,
  part8ImagePosition,
  part8TextNodeY,
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
    return this._controller.getSectionState(
      chapter.id, index, chapter.sections[index].startNode,
    );
  }

  _isOpen(state) {
    return state === 'COMPLETED' || state === 'SKIPPED_COMPLETED' || state === 'IN_PROGRESS';
  }

  _chapterUnlocked(chapter) {
    const visited = this._controller.getVisitedNodes();
    return chapter.sections.some(s => visited.has(s.startNode));
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

    this._fitForkMap();
  }

  /**
   * The chapter 8 map is authored in fixed 360x1120 units so it matches the
   * Android composition exactly; scale it to whatever width we actually have.
   */
  _fitForkMap() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    const viewport = this.el.querySelector('.story-fork-viewport');
    if (!viewport) return;

    const map = viewport.querySelector('.story-fork-map');
    const svg = viewport.querySelector('.story-fork-lines');

    // The v7 canvas is 1120 units tall, but the ending epilogues were added to
    // chapter 8 after those tables were drawn, so the last node on a route can
    // sit past the bottom. Measure the real content instead of trusting 1120.
    const contentHeight = () => {
      let bottom = PART8_MAP.height;
      for (const node of map.querySelectorAll('.story-fork-node')) {
        bottom = Math.max(bottom, node.offsetTop + node.offsetHeight);
      }
      return Math.ceil(bottom + 24);
    };

    const apply = () => {
      const width = viewport.getBoundingClientRect().width;
      if (!width) return;
      const height = contentHeight();
      const scale = width / PART8_MAP.width;

      map.style.height = `${height}px`;
      if (svg) {
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${PART8_MAP.width} ${height}`);
        for (const guide of svg.querySelectorAll('.story-fork-guide')) {
          const x = guide.dataset.x;
          guide.setAttribute('d', `M${x} ${PART8_GUIDE.top} L${x} ${height - 40}`);
        }
      }

      viewport.style.setProperty('--map-scale', scale);
      viewport.style.height = `${height * scale}px`;
    };

    apply();
    // Setting the height above can bring the scrollbar in, which narrows the
    // viewport again; re-measure once the browser has settled or the map ends up
    // a scrollbar's width too wide and the BAD column is clipped.
    requestAnimationFrame(apply);

    this._resizeObserver = new ResizeObserver(apply);
    this._resizeObserver.observe(viewport);
  }

  /** §27.12 — eight landmarks, unlocked ones lit, locked ones masked. */
  _overviewHtml() {
    const cards = this._chapters().map(chapter => {
      const pres = STORY_CHAPTER_PRESENTATIONS[chapter.id];
      if (!pres) return '';
      const unlocked = this._chapterUnlocked(chapter);
      const cover = unlocked ? this._bg(pres.overviewCoverNode) : null;

      // §27.4 — a locked chapter shows neither its picture nor its title.
      const title = unlocked
        ? pres.title
        : `<span class="masked">${questionMarks(pres.title)}</span>`;

      return `
        <button class="story-landmark ${unlocked ? 'is-open' : 'is-locked'}"
                data-chapter="${chapter.id}" ${unlocked ? '' : 'disabled'}>
          <span class="story-landmark-art">
            ${cover
              ? `<img src="../assets/${cover}" alt="" loading="lazy" />`
              : '<span class="story-landmark-seal" aria-hidden="true"></span>'}
          </span>
          <span class="story-landmark-copy">
            <span class="story-landmark-sub">${pres.number}</span>
            <span class="story-landmark-title">${title}</span>
          </span>
        </button>
      `;
    }).join('');

    return `
      <div class="story-overview">
        <p class="story-kicker">CHAPTER 总览</p>
        <h2 class="story-heading">他的世界，正在展开</h2>
        <p class="story-sub">走过的故事会亮起来。点击亮起的章节，靠近那段记忆。</p>
        <div class="story-landmarks">${cards}</div>
        <p class="story-hint">点击章节，图片将拉近并展开全部小节</p>
      </div>
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
      const side = index % 2 === 0 ? 'left' : 'right';
      const label = String(index + 1).padStart(2, '0');

      const node = important
        ? this._pictureNodeHtml({ section, index, state, open, label })
        : this._textNodeHtml({ section, index, state, open, label });

      const connector = index === 0 ? '' : `
        <span class="story-link story-link-${index % 2 === 0 ? 'to-left' : 'to-right'}"
              aria-hidden="true"></span>`;

      return `<li class="story-row story-row-${side}">${connector}${node}</li>`;
    }).join('');

    return `<ol class="story-nodes">${items}</ol>`;
  }

  _textNodeHtml({ section, index, state, open, label }) {
    const lines = open
      ? storyDisplayLines(section.title).map(l => `<span>${l}</span>`).join('')
      : `<span>${questionMarks(section.title)}</span>`;

    return `
      <button class="story-node story-node-text ${open ? 'is-open' : 'is-locked'}"
              data-start="${section.startNode}" data-section="${index}"
              ${open ? '' : 'disabled'}>
        <span class="story-node-dot" aria-hidden="true"></span>
        <span class="story-node-copy">
          <span class="story-node-index">${label}</span>
          <span class="story-node-title">${lines}</span>
        </span>
      </button>
    `;
  }

  _pictureNodeHtml({ section, index, state, open, label }) {
    const bg = open ? this._bg(section.startNode) : null;
    const lines = open
      ? storyDisplayLines(section.title).map(l => `<span>${l}</span>`).join('')
      : `<span>${questionMarks(section.title)}</span>`;

    return `
      <button class="story-node story-node-pic ${open ? 'is-open' : 'is-locked'}"
              data-start="${section.startNode}" data-section="${index}"
              ${open ? '' : 'disabled'}>
        <span class="story-node-art">
          ${bg
            ? `<img src="../assets/${bg}" alt="" loading="lazy" />`
            : '<span class="story-node-seal" aria-hidden="true"></span>'}
        </span>
        <span class="story-node-caption">
          <span class="story-node-index">${label}</span>
          <span class="story-node-title">${lines}</span>
        </span>
      </button>
    `;
  }

  /**
   * §27.11 — chapter 8, transcribed from the same 360x1120 unit map the Android
   * screen uses. Nodes are absolutely placed rather than flowed: the `common`
   * opener sits above the fork (it is not a fourth column), each route keeps its
   * own guide line, and picture nodes hang off their guide at authored offsets.
   * The whole map is scaled to the container width, so the composition holds.
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
      pieces.push(this._forkImageNode({
        ...first,
        label: PART8_COMMON.label,
        x: PART8_COMMON.x, y: PART8_COMMON.y,
        w: PART8_COMMON.w, h: PART8_COMMON.h,
      }));
    }

    for (const scope of PART8_ROUTE_ORDER) {
      const columnX = PART8_COLUMN_X[scope];
      const left = columnX - PART8_NODE_WIDTH / 2;

      pieces.push(`
        <p class="story-fork-label" style="left:${left}px;top:${PART8_LABEL_Y}px;width:${PART8_NODE_WIDTH}px">
          ${storyRouteLabel(scope)}
        </p>
      `);

      routes[scope].forEach((entry, i) => {
        const label = `${storyRoutePrefix(scope)}${i + 1}`;
        const image = part8ImagePosition(scope, i);
        if (image) {
          pieces.push(this._forkImageNode({
            ...entry, label,
            x: image[0], y: image[1],
            w: PART8_IMAGE_SIZE.w, h: PART8_IMAGE_SIZE.h,
          }));
        } else {
          pieces.push(this._forkTextNode({
            ...entry, label,
            x: left, y: part8TextNodeY(scope, i),
          }));
        }
      });
    }

    return `
      <div class="story-fork-viewport">
        <div class="story-fork-map" style="width:${PART8_MAP.width}px;height:${PART8_MAP.height}px">
          ${this._forkRoutesSvg()}
          ${pieces.join('')}
        </div>
      </div>
    `;
  }

  _forkRoutesSvg() {
    const trunk = PART8_TRUNK.map(corners => {
      const d = corners.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
      return `<path d="${d}" fill="none" stroke="rgba(215,190,134,0.76)" stroke-width="2.6"/>`;
    }).join('');

    const guides = PART8_ROUTE_ORDER.map(scope => {
      const x = PART8_COLUMN_X[scope];
      return `<path class="story-fork-guide" data-x="${x}"
                    d="M${x} ${PART8_GUIDE.top} L${x} ${PART8_GUIDE.bottom}"
                    fill="none" stroke="rgba(220,228,237,0.18)" stroke-width="1.4"/>`;
    }).join('');

    return `<svg class="story-fork-lines" width="${PART8_MAP.width}" height="${PART8_MAP.height}"
                 viewBox="0 0 ${PART8_MAP.width} ${PART8_MAP.height}"
                 aria-hidden="true">${guides}${trunk}</svg>`;
  }

  _forkTextNode({ section, index, state, label, x, y }) {
    const open = this._isOpen(state);
    const lines = open
      ? storyDisplayLines(section.title).map(l => `<span>${l}</span>`).join('')
      : `<span>${questionMarks(section.title)}</span>`;

    return `
      <button class="story-fork-node story-fork-text ${open ? 'is-open' : 'is-locked'}"
              style="left:${x}px;top:${y}px;width:${PART8_NODE_WIDTH}px"
              data-start="${section.startNode}" data-section="${index}"
              ${open ? '' : 'disabled'}>
        <span class="story-fork-dot" aria-hidden="true"></span>
        <span class="story-fork-index">${label}</span>
        <span class="story-fork-title">${lines}</span>
      </button>
    `;
  }

  _forkImageNode({ section, index, state, label, x, y, w, h }) {
    const open = this._isOpen(state);
    const bg = open ? this._bg(section.startNode) : null;
    const lines = open
      ? storyDisplayLines(section.title).map(l => `<span>${l}</span>`).join('')
      : `<span>${questionMarks(section.title)}</span>`;

    return `
      <button class="story-fork-node story-fork-pic ${open ? 'is-open' : 'is-locked'}"
              style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"
              data-start="${section.startNode}" data-section="${index}"
              ${open ? '' : 'disabled'}>
        ${bg ? `<img src="../assets/${bg}" alt="" loading="lazy" />` : ''}
        <span class="story-fork-caption">
          <span class="story-fork-index">${label}</span>
          <span class="story-fork-title">${lines}</span>
        </span>
      </button>
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

    const node = e.target.closest('.story-node[data-start]');
    if (node && !node.disabled && this._onJump) {
      this._onJump(
        node.dataset.start,
        this._selectedChapterId,
        parseInt(node.dataset.section, 10),
      );
    }
  }

  destroy() {
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    this.el.removeEventListener('click', this._onClick);
    this.el.remove();
  }
}
