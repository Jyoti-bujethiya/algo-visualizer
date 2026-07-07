// 026 — Linked List Cycle II · steps.js

const _PL026 = {'detect': 1, 'phase2-start': 5, 'locate': 6, 'complete': -1}
// Find the start node of the cycle (if any)

function push(steps, desc, nodes, pointers, extra = {}) {
  steps.push({ description: desc, nodes: nodes.map(n => ({ ...n })), pointers: { ...pointers }, codeLineIndex: extra.codeLineIndex ?? (_PL026[extra.phase] ?? -1), ...extra })
}

function genFloyd(arr, cycleAt) {
  const steps = []
  const nodes = arr.map((val, i) => ({ val, id: i, state: '' }))

  push(steps,
    'Phase 1 — detect: move slow one step and fast two steps until they meet (proves a cycle). Phase 2 — locate: reset one pointer to head and walk both one step at a time; they meet exactly at the cycle entry.',
    nodes, {})

  if (arr.length === 0 || cycleAt < 0) {
    push(steps, cycleAt < 0 ? 'No cycle in this list.' : 'Empty list.', nodes, {}, { phase: 'complete', cycleStart: -1 })
    return steps
  }

  // Phase 1: find meeting point
  let slow = 0, fast = 0
  push(steps, 'Phase 1: start both pointers at the head.', nodes, { [slow]: 'slow', [fast]: 'fast' }, { slow, fast, phase: 'detect' })

  const maxSteps = arr.length * 2 + 4
  let meetAt = -1
  for (let s = 0; s < maxSteps; s++) {
    const nf1 = fast + 1 >= arr.length ? cycleAt : fast + 1
    const nf2 = nf1   + 1 >= arr.length ? cycleAt : nf1   + 1
    const ns  = slow  + 1 >= arr.length ? cycleAt : slow  + 1
    slow = ns; fast = nf2
    if (slow === fast) { meetAt = slow; break }
    push(steps,
      `Slow → position ${slow} (${arr[slow]}), fast → position ${fast} (${arr[fast]}). Not yet equal.`,
      nodes, { [slow]: 'current', [fast]: 'special' }, { slow, fast, phase: 'detect' })
  }

  if (meetAt < 0) {
    push(steps, 'No cycle found.', nodes, {}, { phase: 'complete', cycleStart: -1 })
    return steps
  }

  nodes[meetAt].state = 'compare'
  push(steps,
    `Pointers met at position ${meetAt} (value ${arr[meetAt]}). A cycle exists. Now Phase 2: reset one pointer to head and keep the other at the meeting point.`,
    nodes, { [meetAt]: 'meet' }, { slow, fast, meetAt, phase: 'phase2-start' })

  // Phase 2: find cycle entry
  let ptr1 = 0, ptr2 = meetAt
  push(steps, `ptr1 starts at head (position 0), ptr2 stays at meeting point (position ${meetAt}). Move both one step at a time.`,
    nodes, { [ptr1]: 'ptr1', [ptr2]: 'ptr2' }, { ptr1, ptr2, phase: 'locate' })

  while (ptr1 !== ptr2) {
    ptr1 = ptr1 + 1 >= arr.length ? cycleAt : ptr1 + 1
    ptr2 = ptr2 + 1 >= arr.length ? cycleAt : ptr2 + 1
    push(steps,
      `ptr1 → position ${ptr1} (${arr[ptr1]}), ptr2 → position ${ptr2} (${arr[ptr2]}).${ptr1 === ptr2 ? ' They met — this is the cycle entry!' : ''}`,
      nodes, { [ptr1]: 'ptr1', [ptr2]: 'ptr2' }, { ptr1, ptr2, phase: 'locate' })
  }

  nodes[ptr1].state = 'match'
  push(steps,
    `Cycle entry found at position ${ptr1} (value ${arr[ptr1]}). This is the node where the tail loops back.`,
    nodes, { [ptr1]: 'entry' }, { ptr1, ptr2, phase: 'complete', cycleStart: ptr1 })
  return steps
}

export function generateSteps(_algo, arr, cycleAt) {
  return genFloyd(arr, cycleAt)
}
