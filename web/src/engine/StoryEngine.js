import { ConditionParser } from './ConditionParser.js';

export class StoryEngine {
  constructor({ nodes, flow, routers, sceneVisuals, endings }) {
    this._nodes = nodes;
    this._flow = flow;
    this._routers = routers;
    this._sceneVisuals = sceneVisuals;
    this._endings = endings;
    this._conditionParser = new ConditionParser();
    this._routerIds = new Set(Object.keys(routers));
    this._nodeIds = new Set(Object.keys(nodes));
  }

  isRouter(id) { return this._routerIds.has(id); }
  isNode(id) { return this._nodeIds.has(id); }

  resolve(id, state) {
    let currentId = id;
    const visited = new Set();

    while (!visited.has(currentId)) {
      visited.add(currentId);

      if (this.isRouter(currentId)) {
        const router = this._routers[currentId];
        const result = this._resolveRouter(router, state);
        state.applyEffects(result.sideEffects);
        currentId = result.targetId;
      } else if (this.isNode(currentId)) {
        return {
          type: 'found',
          nodeId: currentId,
          node: this._nodes[currentId],
          visual: this._sceneVisuals[currentId] || null
        };
      } else if (this._isEndingNode(currentId)) {
        const key = currentId.replace(/^end_/, '');
        const def = this._endings.definitions[key];
        if (!def) return { type: 'notFound', id: currentId, reason: 'Ending definition not found' };
        return { type: 'endingReached', endingId: currentId, definition: def };
      } else {
        return { type: 'notFound', id: currentId, reason: 'ID is neither a node nor a router' };
      }
    }

    return { type: 'notFound', id, reason: 'Router loop detected' };
  }

  getNextNodeId(currentId, state) {
    const byRoute = this._flow.byRoute || {};
    for (const [routeName, overrides] of Object.entries(byRoute)) {
      if (currentId in overrides) {
        let match = false;
        switch (routeName) {
          case 'M':     match = state.getString('mj') === 'M'; break;
          case 'J':     match = state.getString('mj') === 'J'; break;
          case 'dream': match = state.getString('path') === 'dream'; break;
          case 'stay':  match = state.getString('path') === 'stay'; break;
          case 'bad':   match = state.getString('path') === 'bad'; break;
        }
        if (match) return overrides[currentId];
      }
    }
    return this._flow.default[currentId] || null;
  }

  getVisibleChoices(choices, state) {
    if (!choices) return [];
    return choices.filter(c =>
      c.condition ? this._conditionParser.evaluate(c.condition, state) : true
    );
  }

  processChoiceTransition(choice) {
    if (!choice.transition) return null;
    switch (choice.transition.type) {
      case 'goto':   return choice.transition.target;
      case 'ending': return choice.transition.target || 'ending_resolver';
      default:       return null;
    }
  }

  getEndingDefinitions() {
    return this._endings.definitions;
  }

  // Resolve the ending_resolver router against current state → 'end_*' node id.
  // Used when the story is fast-forwarded (section-skip) past its final content.
  resolveEndingId(state) {
    const router = this._routers['ending_resolver'];
    if (!router) return null;
    const { targetId } = this._resolveRouter(router, state);
    return targetId || null;
  }

  _resolveRouter(router, state) {
    for (const rule of router.rules) {
      if (this._conditionParser.evaluate(rule.condition, state)) {
        return { targetId: rule.target, sideEffects: rule.sideEffects || [] };
      }
    }
    return { targetId: router.fallback, sideEffects: router.fallbackSideEffects || [] };
  }

  _isEndingNode(id) {
    if (!id.startsWith('end_')) return false;
    const key = id.replace(/^end_/, '');
    return key in this._endings.definitions;
  }
}
