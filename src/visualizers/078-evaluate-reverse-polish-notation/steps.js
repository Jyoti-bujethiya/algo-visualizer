// 078 — Evaluate Reverse Polish Notation · steps.js
// Push numbers; on operator, pop two, apply op, push result

// line indices:
// 0: function evalRPN(tokens):
// 1:   stack = []
// 2:   for each token:
// 3:     if token is number: stack.push(token)
// 4:     else (operator):
// 5:       b = stack.pop(); a = stack.pop()
// 6:       stack.push(apply(a, op, b))
// 7:   return stack.pop()

const OPS = new Set(['+', '-', '*', '/'])

function push(steps, desc, stack, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, stack: [...stack], highlights: { ...highlights }, codeLineIndex, ...extra })
}

function apply(a, op, b) {
  switch (op) {
    case '+': return a + b
    case '-': return a - b
    case '*': return a * b
    case '/': return Math.trunc(a / b)
  }
}

export function generateSteps(tokens) {
  const steps = []
  const stack = [], highlights = {}
  push(steps, `Evaluate RPN: [${tokens.join(', ')}]. Push numbers; on operator pop two operands, compute, push result.`, stack, {}, 0)

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    highlights[i] = 'current'
    push(steps, `Token[${i}]="${t}". Stack: [${stack.join(', ')}].`, stack, { ...highlights }, 2)

    if (!OPS.has(t)) {
      stack.push(Number(t))
      highlights[i] = 'match'
      push(steps, `Number ${t} → push. Stack: [${stack.join(', ')}].`, stack, { ...highlights }, 3)
    } else {
      const b = stack.pop(), a = stack.pop()
      highlights[i] = 'compare'
      const res = apply(a, t, b)
      push(steps, `Operator '${t}': pop b=${b}, pop a=${a}. Compute ${a}${t}${b} = ${res} → push.`, stack, { ...highlights }, 5)
      stack.push(res)
      highlights[i] = 'match'
      push(steps, `Stack: [${stack.join(', ')}].`, stack, { ...highlights }, 6)
    }
  }

  const result = stack[stack.length - 1]
  push(steps, `Final result = ${result}.`, stack, { ...highlights }, 7, { result, done: true })
  return steps
}
