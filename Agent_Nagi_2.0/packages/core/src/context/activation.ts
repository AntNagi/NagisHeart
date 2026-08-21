export type ActivationContext = Readonly<Record<string, unknown>>;

function valueAtPath(context: ActivationContext, path: string): unknown {
  let value: unknown = context;
  for (const segment of path.split(".")) {
    if (!value || typeof value !== "object") return undefined;
    value = (value as Record<string, unknown>)[segment];
  }
  return value;
}

function splitTopLevel(expression: string, operator: "&&" | "||"): readonly string[] {
  const parts: string[] = [];
  let start = 0;
  let depth = 0;
  let quote: "'" | '"' | undefined;
  for (let index = 0; index < expression.length; index += 1) {
    const character = expression[index];
    if (quote) {
      if (character === quote && expression[index - 1] !== "\\") quote = undefined;
      continue;
    }
    if (character === "'" || character === '"') quote = character;
    else if (character === "(") depth += 1;
    else if (character === ")") depth -= 1;
    else if (depth === 0 && expression.startsWith(operator, index)) {
      parts.push(expression.slice(start, index));
      start = index + operator.length;
      index += operator.length - 1;
    }
  }
  return parts.length === 0 ? [expression] : [...parts, expression.slice(start)];
}

function stripOuterParentheses(expression: string): string {
  let result = expression.trim();
  while (result.startsWith("(") && result.endsWith(")")) {
    let depth = 0;
    let balanced = true;
    for (let index = 0; index < result.length; index += 1) {
      if (result[index] === "(") depth += 1;
      if (result[index] === ")") depth -= 1;
      if (depth === 0 && index < result.length - 1) balanced = false;
    }
    if (!balanced) break;
    result = result.slice(1, -1).trim();
  }
  return result;
}

function parseLiteral(raw: string): unknown {
  const value = raw.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (/^-?\d+(?:\.\d+)?$/u.test(value)) return Number(value);
  if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
    return value.slice(1, -1);
  }
  return undefined;
}

function evaluateAtom(expression: string, context: ActivationContext): boolean {
  const value = expression.trim();
  if (value.startsWith("!") && !value.startsWith("!=")) return !evaluateAtom(value.slice(1), context);
  const comparison = /^(?<path>[A-Za-z_][\w.]*)\s*(?<operator>==|!=|>=|<=|>|<)\s*(?<literal>.+)$/u.exec(value);
  if (comparison?.groups) {
    const path = comparison.groups.path;
    const operator = comparison.groups.operator;
    const literal = comparison.groups.literal;
    if (!path || !operator || !literal) return false;
    const left = valueAtPath(context, path);
    const right = parseLiteral(literal);
    if (right === undefined) return false;
    switch (operator) {
      case "==": return left === right;
      case "!=": return left !== right;
      case ">": return typeof left === "number" && typeof right === "number" && left > right;
      case ">=": return typeof left === "number" && typeof right === "number" && left >= right;
      case "<": return typeof left === "number" && typeof right === "number" && left < right;
      case "<=": return typeof left === "number" && typeof right === "number" && left <= right;
    }
  }
  return Boolean(valueAtPath(context, value));
}

export function evaluateActivation(expression: string | undefined, context: ActivationContext): boolean {
  if (!expression?.trim()) return true;
  const orParts = splitTopLevel(stripOuterParentheses(expression), "||");
  return orParts.some((orPart) => splitTopLevel(stripOuterParentheses(orPart), "&&").every((part) => evaluateAtom(stripOuterParentheses(part), context)));
}
