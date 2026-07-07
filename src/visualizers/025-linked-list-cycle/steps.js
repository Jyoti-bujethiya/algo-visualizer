// 025 — Linked List Cycle · steps.js

const _PL025 = {'init': 0, 'move': 1, 'visit': 1, 'complete': 5}

function push(steps, desc, nodes, pointers, extra = {}) {
  steps.push({ description: desc, nodes: nodes.map(n => ({ ...n })), pointers: { ...pointers }, codeLineIndex: extra.codeLineIndex ?? (_PL025[extra.phase] ?? -1), ...extra })
}

// arr: node values, cycleAt: index that tail points back to (-1 = no cycle)
function genFloyd(arr, cycleAt) {
  const steps = []
  const nodes = arr.map((val, i) => ({ val, id: i, state: '' }))

  push(steps, 'Floyd\'s cycle detection: move a slow pointer one step and a fast pointer two steps at a time. If they ever meet, there is a cycle.', nodes, {})

  if (arr.length === 0) {
    push(steps, 'Empty list — no cycle possible.', nodes, {}, { phase: 'complete', hasCycle: false })
    return steps
  }

  let slow = 0, fast = 0
  push(steps, 'Start both pointers at the head.', nodes, { [slow]: 'slow', [fast]: 'fast' }, { slow, fast, phase: 'init' })

  const maxSteps = arr.length * 2 + 4
  for (let step = 0; step < maxSteps; step++) {
    // advance fast two steps (with cycle wrap)
    const nextFast1 = fast + 1 >= arr.length ? (cycleAt >= 0 ? cycleAt : -1) : fast + 1
    if (nextFast1 === -1) {
      push(steps, `Fast pointer reached null — no cycle exists.`, nodes, { [slow]: 'slow' }, { slow, fast: -1, phase: 'complete', hasCycle: false })
      return steps
    }
    const nextFast2 = nextFast1 + 1 >= arr.length ? (cycleAt >= 0 ? cycleAt : -1) : nextFast1 + 1
    if (nextFast2 === -1) {
      push(steps, `Fast pointer reached null — no cycle exists.`, nodes, { [slow]: 'slow' }, { slow, fast: -1, phase: 'complete', hasCycle: false })
      return steps
    }

    const nextSlow = slow + 1 >= arr.length ? (cycleAt >= 0 ? cycleAt : -1) : slow + 1
    if (nextSlow === -1) {
      push(steps, 'Slow pointer reached null — no cycle.', nodes, {}, { slow: -1, fast: -1, phase: 'complete', hasCycle: false })
      return steps
    }

    slow = nextSlow
    fast = nextFast2

    const hlMap = {}
    if (slow === fast) {
      hlMap[slow] = 'match'
      nodes[slow].state = 'match'
      push(steps, `Fast and slow met at node ${arr[slow]} (position ${slow})! A cycle exists.`, nodes, hlMap, { slow, fast, phase: 'complete', hasCycle: true })
      return steps
    }
    hlMap[slow] = 'current'
    hlMap[fast] = 'special'
    push(steps,
      `Slow moves to position ${slow} (value ${arr[slow]}). Fast moves to position ${fast} (value ${arr[fast]}). Not the same yet — keep going.`,
      nodes, hlMap, { slow, fast, phase: 'move' })
  }

  push(steps, 'No cycle found.', nodes, {}, { phase: 'complete', hasCycle: false })
  return steps
}

function genSet(arr, cycleAt) {
  const steps = []
  const nodes = arr.map((val, i) => ({ val, id: i, state: '' }))
  const seen = new Set()

  push(steps, 'Walk the list, storing each visited node in a set. If we visit the same node twice, there is a cycle.', nodes, {})

  const maxSteps = arr.length + 4
  let cur = 0
  for (let step = 0; step < maxSteps; step++) {
    if (cur < 0 || cur >= arr.length) {
      push(steps, 'Reached null — no cycle found.', nodes, {}, { phase: 'complete', hasCycle: false })
      return steps
    }
    if (seen.has(cur)) {
      nodes[cur].state = 'error'
      push(steps, `Node ${arr[cur]} (position ${cur}) has already been visited — cycle detected here!`, nodes, { [cur]: 'curr' }, { cur, phase: 'complete', hasCycle: true })
      return steps
    }
    seen.add(cur)
    nodes[cur].state = 'current'
    push(steps,
      `Visiting node ${arr[cur]} (position ${cur}). Added to the seen set — ${seen.size} node(s) visited so far.`,
      nodes, { [cur]: 'curr' }, { cur, seen: [...seen], phase: 'visit' })
    cur = cur + 1 >= arr.length ? (cycleAt >= 0 ? cycleAt : -1) : cur + 1
  }

  push(steps, 'No cycle found.', nodes, {}, { phase: 'complete', hasCycle: false })
  return steps
}

export function generateSteps(algo, arr, cycleAt) {
  if (algo === 'set') return genSet(arr, cycleAt)
  return genFloyd(arr, cycleAt)
}
