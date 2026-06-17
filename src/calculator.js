'use strict';

function tokenize(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (/[0-9.]/.test(ch)) {
      let num = '';
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        num += expr[i]; i++;
      }
      tokens.push({ type: 'NUMBER', value: parseFloat(num) });
      continue;
    }
    if ('+-*/'.includes(ch)) {
      tokens.push({ type: 'OP', value: ch });
      i++;
      continue;
    }
    if (ch === '(' || ch === ')') {
      tokens.push({ type: 'PAREN', value: ch });
      i++;
      continue;
    }
    if (ch === ',') {
      tokens.push({ type: 'COMMA' });
      i++;
      continue;
    }
    if (/[a-zA-Z]/.test(ch)) {
      let name = '';
      while (i < expr.length && /[a-zA-Z]/.test(expr[i])) {
        name += expr[i]; i++;
      }
      if (name.toLowerCase() === 'ans') {
        tokens.push({ type: 'ANS' });
      } else {
        throw new Error('Unknown function: ' + name);
      }
      continue;
    }
    throw new Error('Unexpected character: ' + ch);
  }
  return tokens;
}

function shuntingYard(tokens) {
  const output = [];
  const ops = [];
  let expectUnary = true;

  for (const token of tokens) {
    if (token.type === 'NUMBER' || token.type === 'ANS') {
      output.push(token);
      expectUnary = false;
    } else if (token.type === 'FUNC') {
      ops.push(token);
      expectUnary = true;
    } else if (token.type === 'COMMA') {
      while (ops.length > 0 && ops[ops.length - 1].type !== 'PAREN' && ops[ops.length - 1].value !== '(') {
        output.push(ops.pop());
      }
    } else if (token.type === 'OP') {
      if (expectUnary && token.value === '-') {
        output.push({ type: 'NUMBER', value: 0 });
      }
      const prec = { '+': 1, '-': 1, '*': 2, '/': 2 };
      while (ops.length > 0 && ops[ops.length - 1].type === 'OP' &&
             prec[ops[ops.length - 1].value] >= prec[token.value]) {
        output.push(ops.pop());
      }
      ops.push(token);
      expectUnary = true;
    } else if (token.type === 'PAREN' && token.value === '(') {
      ops.push(token);
      expectUnary = true;
    } else if (token.type === 'PAREN' && token.value === ')') {
      while (ops.length > 0 && !(ops[ops.length - 1].type === 'PAREN' && ops[ops.length - 1].value === '(')) {
        output.push(ops.pop());
      }
      ops.pop();
      if (ops.length > 0 && ops[ops.length - 1].type === 'FUNC') {
        output.push(ops.pop());
      }
      expectUnary = false;
    }
  }

  while (ops.length > 0) {
    output.push(ops.pop());
  }

  return output;
}

function evaluateRPN(tokens, lastResult) {
  const stack = [];

  for (const token of tokens) {
    if (token.type === 'NUMBER') {
      stack.push(token.value);
    } else if (token.type === 'ANS') {
      stack.push(typeof lastResult === 'number' ? lastResult : parseFloat(lastResult) || 0);
    } else if (token.type === 'OP') {
      const b = stack.pop();
      const a = stack.pop();
      switch (token.value) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/':
          if (b === 0) throw new Error('Division by zero');
          stack.push(a / b);
          break;
        default: throw new Error('Unknown operator: ' + token.value);
      }
    } else if (token.type === 'FUNC') {
      throw new Error('Unsupported function: ' + token.value);
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid expression');
  }

  return stack[0];
}

function evaluateExpression(expr, lastResult) {
  if (!expr || /^\s*$/.test(expr)) {
    throw new Error('Empty expression');
  }
  const tokens = tokenize(expr);
  const rpn = shuntingYard(tokens);
  const result = evaluateRPN(rpn, lastResult);

  if (!isFinite(result)) {
    throw new Error('Result is not finite');
  }

  return result;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { evaluateExpression, tokenize, shuntingYard, evaluateRPN };
}
