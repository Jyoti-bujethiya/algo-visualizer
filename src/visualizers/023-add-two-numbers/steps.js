// 023 — Add Two Numbers · steps.js

const _PL023 = {'add': 2, 'carry': 3, 'complete': -1}
// Numbers are stored in reverse order in linked lists (e.g. 342 → [2,4,3])

function push(steps, desc, d1, d2, result, pointers, extra = {}) {
  steps.push({ description: desc, d1: [...d1], d2: [...d2], result: [...result], pointers: { ...pointers }, codeLineIndex: extra.codeLineIndex ?? (_PL023[extra.phase] ?? -1), ...extra })
}

function genSim(a, b) {
  const steps = []
  const result = []
  let carry = 0, i = 0, j = 0

  push(steps,
    `Add digit-by-digit from the least-significant end. Keep a carry when the sum ≥ 10. Both lists are already in reverse order so we start straight away.`,
    a, b, result, { i, j, carry })

  while (i < a.length || j < b.length || carry) {
    const d1 = i < a.length ? a[i] : 0
    const d2 = j < b.length ? b[j] : 0
    const sum = d1 + d2 + carry
    const digit = sum % 10
    const newCarry = Math.floor(sum / 10)

    push(steps,
      `Column ${i}: digit from list 1 = ${d1}, digit from list 2 = ${d2}, carry in = ${carry}. Sum = ${d1}+${d2}+${carry} = ${sum}. Write digit ${digit}${newCarry ? `, carry ${newCarry} forward` : ''}.`,
      a, b, result, { i, j, carry },
      { phase: 'add', colIdx: Math.max(i, j) })

    result.push(digit)
    carry = newCarry
    i++; j++

    if (carry && i >= a.length && j >= b.length) {
      push(steps, `No more digits from either list but carry = ${carry} remains — add it as a new node.`, a, b, result, { i, j, carry }, { phase: 'carry' })
    }
  }

  const numA = parseInt([...a].reverse().join(''))
  const numB = parseInt([...b].reverse().join(''))
  push(steps,
    `Done! ${numA} + ${numB} = ${numA + numB}. Result list (least-significant first): ${result.join(' → ')}.`,
    a, b, result, { i: -1, j: -1, carry: 0 }, { phase: 'complete' })
  return steps
}

export function generateSteps(_algo, a, b) {
  return genSim(a, b)
}
