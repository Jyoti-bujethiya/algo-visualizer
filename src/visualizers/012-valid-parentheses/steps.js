// 012 – Valid Parentheses — pure step generator

const MATCH = { ')': '(', '}': '{', ']': '[' }
const IS_CLOSE = c => ')}]'.includes(c)

// CODE.stack   = ['stack = []', 'for c in s:', '  if closing(c):', '    if empty or top != match(c): return false', '    stack.pop()', '  else: stack.push(c)', 'return stack.empty()']
// CODE.replace = ['while "()" or "[]" or "{}" in s:', '  s.erase(pair)', 'return s.empty()']
const STACK_LINE   = { init: 0, loop: 1, isclose: 2, chktop: 3, pop: 4, push: 5, ret: 6 }
const REPLACE_LINE = { loop: 0, erase: 1, ret: 2 }

function pushStack(steps, desc, codeKey, stack, charIdx, result) {
  steps.push({ description: desc, codeKey, stack: [...stack], charIdx, result, codeLineIndex: STACK_LINE[codeKey] ?? -1 })
}
function pushReplace(steps, desc, codeKey, stack, charIdx, result) {
  steps.push({ description: desc, codeKey, stack: [...stack], charIdx, result, codeLineIndex: REPLACE_LINE[codeKey] ?? -1 })
}

function genStack(str) {
  const steps = []
  const s = str
  const stack = []

  pushStack(steps, 'Use a stack to track unmatched opening brackets. Every time we see a closing bracket, check if it matches the most recent opening one.', 'init', stack, -1, null)

  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (IS_CLOSE(c)) {
      pushStack(steps, `"${c}" is a closing bracket. Check if the top of the stack is the matching opener.`, 'isclose', stack, i, null)
      if (stack.length === 0 || stack[stack.length - 1] !== MATCH[c]) {
        pushStack(steps, `The top of the stack is "${stack[stack.length-1] || 'empty'}" but we need "${MATCH[c]}" — these don't match. The string is invalid.`,
          'chktop', stack, i, false)
        break
      }
      pushStack(steps, `"${c}" matches the top "${stack[stack.length-1]}" — remove it from the stack.`, 'pop', stack, i, null)
      stack.pop()
      pushStack(steps, `Stack after removing the matched pair: [${stack.join('') || 'empty'}].`, 'pop', stack, i, null)
    } else {
      pushStack(steps, `"${c}" is an opening bracket — push it onto the stack to wait for its matching closer.`, 'push', stack, i, null)
      stack.push(c)
      pushStack(steps, `Stack now holds: [${stack.join('')}].`, 'push', stack, i, null)
    }
  }

  const last = steps[steps.length - 1]
  if (last?.result !== false) {
    const valid = stack.length === 0
    pushStack(steps,
      valid
        ? 'Reached the end with an empty stack — every opener was matched. The string is valid!'
        : `Reached the end but the stack still has ${stack.length} unmatched opener(s). The string is invalid.`,
      'ret', stack, -1, valid)
  }
  return steps
}

function genReplace(str) {
  const steps = []
  let s = str
  const PAIRS = ['()', '[]', '{}']

  pushReplace(steps, `Keep removing adjacent matched pairs until none are left. If the string empties out, it was valid.`, 'loop', [], -1, null)

  let maxIter = s.length * s.length + 10
  while (maxIter-- > 0) {
    let found = null
    for (const p of PAIRS) {
      const idx = s.indexOf(p)
      if (idx !== -1) { found = { pair: p, idx }; break }
    }
    if (!found) break
    s = s.slice(0, found.idx) + s.slice(found.idx + 2)
    pushReplace(steps, `Found a matched pair "${found.pair}" — removing it. Remaining: "${s || '(empty)'}"`, 'erase', [], -1, null)
  }

  const valid = s.length === 0
  pushReplace(steps,
    valid
      ? 'String is now empty — all brackets were matched. Valid!'
      : `Still have "${s}" left — contains unmatched brackets. Invalid.`,
    'ret', [], -1, valid)
  return steps
}

export function generateSteps(algo, str) {
  if (algo === 'replace') return genReplace(str)
  return genStack(str)
}
