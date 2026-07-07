// 076 — Valid Parentheses (Stack) · steps.js
// Use stack; push '(','{','['; on ')'}']' pop and check match

// line indices:
// 0: function isValid(s):
// 1:   stack = []
// 2:   for each char c in s:
// 3:     if c is open bracket: stack.push(c)
// 4:     else: if stack empty or top != match: return false
// 5:           stack.pop()
// 6:   return stack.isEmpty()

const MATCH = { ')': '(', ']': '[', '}': '{' }
const OPEN  = new Set(['(', '[', '{'])

function push(steps, desc, stack, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, stack: [...stack], highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(s) {
  const steps = []
  const stack = [], highlights = {}
  push(steps, `Valid Parentheses: s="${s}". Push open brackets onto stack; for close brackets, check that stack top matches.`, stack, {}, 0)

  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    highlights[i] = 'current'
    push(steps, `i=${i}: char='${c}'. Stack: [${stack.join('')}].`, stack, { ...highlights }, 2)

    if (OPEN.has(c)) {
      stack.push(c)
      highlights[i] = 'match'
      push(steps, `'${c}' is open — push to stack. Stack: [${stack.join('')}].`, stack, { ...highlights }, 3)
    } else {
      const expected = MATCH[c]
      if (stack.length === 0 || stack[stack.length - 1] !== expected) {
        highlights[i] = 'error'
        push(steps,
          `'${c}' is close — ${stack.length === 0 ? 'stack empty' : `top '${stack[stack.length-1]}' ≠ expected '${expected}'`}. Return FALSE.`,
          stack, { ...highlights }, 4, { result: false, done: true }
        )
        return steps
      }
      stack.pop()
      highlights[i] = 'match'
      push(steps, `'${c}' matches top — pop. Stack: [${stack.join('')}].`, stack, { ...highlights }, 5)
    }
  }

  const result = stack.length === 0
  push(steps,
    result ? `Stack empty — all brackets matched. Return TRUE.` : `Stack not empty: [${stack.join('')}] — unmatched open brackets. Return FALSE.`,
    stack, { ...highlights }, 6, { result, done: true }
  )
  return steps
}
