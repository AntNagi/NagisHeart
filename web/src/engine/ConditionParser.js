export class ConditionParser {
  evaluate(condition, state) {
    const tokens = this._tokenize(condition);
    const parser = new ExprParser(tokens, state);
    return parser.parseOr();
  }

  _tokenize(input) {
    const tokens = [];
    let i = 0;
    while (i < input.length) {
      if (/\s/.test(input[i])) { i++; continue; }

      if (input[i] === '(') { tokens.push({ type: 'LParen' }); i++; continue; }
      if (input[i] === ')') { tokens.push({ type: 'RParen' }); i++; continue; }

      if (input.startsWith('===', i)) { tokens.push({ type: 'Op', op: '===' }); i += 3; continue; }
      if (input.startsWith('!==', i)) { tokens.push({ type: 'Op', op: '!==' }); i += 3; continue; }
      if (input.startsWith('>=', i)) { tokens.push({ type: 'Op', op: '>=' }); i += 2; continue; }
      if (input.startsWith('<=', i)) { tokens.push({ type: 'Op', op: '<=' }); i += 2; continue; }
      if (input.startsWith('&&', i)) { tokens.push({ type: 'And' }); i += 2; continue; }
      if (input.startsWith('||', i)) { tokens.push({ type: 'Or' }); i += 2; continue; }
      if (input[i] === '>') { tokens.push({ type: 'Op', op: '>' }); i++; continue; }
      if (input[i] === '<') { tokens.push({ type: 'Op', op: '<' }); i++; continue; }
      if (input[i] === '!') { tokens.push({ type: 'Not' }); i++; continue; }

      if (input[i] === "'" || input[i] === '"') {
        const quote = input[i];
        i++;
        const start = i;
        while (i < input.length && input[i] !== quote) {
          if (input[i] === '\\') i++;
          i++;
        }
        tokens.push({ type: 'String', value: input.substring(start, i) });
        if (i < input.length) i++;
        continue;
      }

      if (/\d/.test(input[i]) || (input[i] === '-' && i + 1 < input.length && /\d/.test(input[i + 1]))) {
        const start = i;
        if (input[i] === '-') i++;
        while (i < input.length && /\d/.test(input[i])) i++;
        tokens.push({ type: 'Number', value: parseInt(input.substring(start, i), 10) });
        continue;
      }

      if (/[a-zA-Z_]/.test(input[i])) {
        const start = i;
        while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) i++;
        const word = input.substring(start, i);
        if (word === 'true') tokens.push({ type: 'Bool', value: true });
        else if (word === 'false') tokens.push({ type: 'Bool', value: false });
        else tokens.push({ type: 'Identifier', name: word });
        continue;
      }

      i++;
    }
    return tokens;
  }
}

class ExprParser {
  constructor(tokens, state) {
    this._tokens = tokens;
    this._state = state;
    this._pos = 0;
  }

  _peek() { return this._tokens[this._pos] || null; }
  _advance() { return this._tokens[this._pos++] || null; }

  parseOr() {
    let result = this._parseAnd();
    while (this._peek()?.type === 'Or') {
      this._advance();
      const right = this._parseAnd();
      result = result || right;
    }
    return result;
  }

  _parseAnd() {
    let result = this._parseComparison();
    while (this._peek()?.type === 'And') {
      this._advance();
      const right = this._parseComparison();
      result = result && right;
    }
    return result;
  }

  _parseComparison() {
    const left = this._parseAtom();
    const t = this._peek();
    if (t?.type === 'Op') {
      this._advance();
      const right = this._parseAtom();
      return this._compare(left, t.op, right);
    }
    return toBool(left);
  }

  _parseAtom() {
    const t = this._peek();
    if (!t) { this._advance(); return null; }

    switch (t.type) {
      case 'Number':  this._advance(); return t.value;
      case 'String':  this._advance(); return t.value;
      case 'Bool':    this._advance(); return t.value;
      case 'Identifier': this._advance(); return this._state.get(t.name);
      case 'LParen': {
        this._advance();
        const result = this.parseOr();
        if (this._peek()?.type === 'RParen') this._advance();
        return result;
      }
      case 'Not': {
        this._advance();
        return !toBool(this._parseAtom());
      }
      default:
        this._advance();
        return null;
    }
  }

  _compare(left, op, right) {
    switch (op) {
      case '===': return eq(left, right);
      case '!==': return !eq(left, right);
      case '>=':  return toNum(left) >= toNum(right);
      case '<=':  return toNum(left) <= toNum(right);
      case '>':   return toNum(left) > toNum(right);
      case '<':   return toNum(left) < toNum(right);
      default:    return false;
    }
  }
}

function eq(a, b) {
  if (a === b) return true;
  const sa = a == null ? 'null' : String(a);
  const sb = b == null ? 'null' : String(b);
  return sa === sb;
}

function toNum(v) {
  if (typeof v === 'number') return v | 0;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (typeof v === 'string') { const n = parseInt(v, 10); return isNaN(n) ? 0 : n; }
  return 0;
}

function toBool(v) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') return v !== '' && v !== 'false';
  if (v == null) return false;
  return true;
}
