// 027 — Reorder List · steps.js

const _PL027 = {'find-mid': 1, 'mid-found': 1, 'reverse-done': 5, 'interleave': 8, 'complete': -1}
// L0→L1→…→Ln-1→Ln  becomes  L0→Ln→L1→Ln-1→L2→Ln-2→…

function push(steps, desc, nodes, pointers, extra = {}) {
  steps.push({ description: desc, nodes: nodes.map(n => ({ ...n })), pointers: { ...pointers }, codeLineIndex: extra.codeLineIndex ?? (_PL027[extra.phase] ?? -1), ...extra })
}

function genThreeStep(arr) {
  const steps = []
  const n = arr.length

  push(steps,
    'Three-step algorithm: (1) find the middle, (2) reverse the second half, (3) interleave the two halves.',
    arr.map((val, i) => ({ val, id: i })), {})

  if (n <= 1) {
    push(steps, 'List has only one node — nothing to reorder.', arr.map((val, i) => ({ val, id: i, state: 'match' })), {}, { phase: 'complete', result: [...arr] })
    return steps
  }

  // Step 1: find middle via slow/fast
  let slow = 0, fast = 0
  push(steps, 'Step 1 — Find the middle using slow/fast pointers.', arr.map((val, i) => ({ val, id: i })), { [slow]: 'slow', [fast]: 'fast' }, { phase: 'find-mid' })
  while (fast + 1 < n && fast + 2 < n) {
    slow++; fast += 2
    push(steps,
      `Slow → position ${slow} (${arr[slow]}), fast → position ${fast} (${arr[fast]}).`,
      arr.map((val, i) => ({ val, id: i })), { [slow]: 'slow', [fast]: 'fast' }, { slow, fast, phase: 'find-mid' })
  }
  const mid = slow
  push(steps, `Middle is at position ${mid} (value ${arr[mid]}). The second half starts at position ${mid + 1}.`, arr.map((val, i) => ({ val, id: i })), { [mid]: 'mid' }, { mid, phase: 'mid-found' })

  // Step 2: reverse second half
  const first  = arr.slice(0, mid + 1)
  const second = arr.slice(mid + 1).reverse()
  push(steps,
    `Step 2 — Reverse the second half. First half: [${first.join(', ')}]. Reversed second half: [${second.join(', ')}].`,
    arr.map((val, i) => ({ val, id: i, state: i <= mid ? 'compare' : 'special' })), {},
    { phase: 'reverse-done', first, second })

  // Step 3: interleave
  const result = []
  let li = 0, ri = 0
  while (li < first.length || ri < second.length) {
    if (li < first.length) {
      result.push(first[li])
      push(steps,
        `Take ${first[li]} from the front of the first half. Result so far: [${result.join(', ')}].`,
        result.map((val, i) => ({ val, id: i, state: 'match' })), {},
        { phase: 'interleave', li, ri, result: [...result] })
      li++
    }
    if (ri < second.length) {
      result.push(second[ri])
      push(steps,
        `Take ${second[ri]} from the front of the (reversed) second half. Result so far: [${result.join(', ')}].`,
        result.map((val, i) => ({ val, id: i, state: 'match' })), {},
        { phase: 'interleave', li, ri, result: [...result] })
      ri++
    }
  }

  push(steps,
    `Reorder complete! Final list: ${result.join(' → ')}.`,
    result.map((val, i) => ({ val, id: i, state: 'match' })), {},
    { phase: 'complete', result })
  return steps
}

export function generateSteps(_algo, arr) {
  return genThreeStep(arr)
}
