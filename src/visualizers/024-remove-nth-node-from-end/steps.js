// 024 — Remove Nth Node From End · steps.js

const _PL024 = {'count': 0, 'locate': 2, 'remove': 4, 'complete': 6, 'init': 0, 'advance-fast': 2, 'move-together': 3}

function push(steps, desc, nodes, pointers, extra = {}) {
  steps.push({ description: desc, nodes: nodes.map(n => ({ ...n })), pointers: { ...pointers }, codeLineIndex: extra.codeLineIndex ?? (_PL024[extra.phase] ?? -1), ...extra })
}

function genTwoPass(arr, n) {
  const steps = []
  const nodes = arr.map((val, i) => ({ val, id: i, state: '' }))
  const len = arr.length
  const targetIdx = len - n  // 0-based index of node to remove

  push(steps, `Two-pass approach: first count the length, then remove the node at position (length − n) from the front.`, nodes, {})

  push(steps, `Pass 1: walk the entire list to find its length = ${len}.`, nodes, {}, { phase: 'count' })

  push(steps, `Length is ${len}. The node to remove is at position ${targetIdx} from the front (that is, the ${n}th from the end).`, nodes,
    { [targetIdx]: 'curr' }, { phase: 'locate', targetIdx })

  nodes[targetIdx].state = 'error'
  const prev = targetIdx - 1
  push(steps,
    `${prev >= 0 ? `Re-linking: node ${arr[prev]} skips over node ${arr[targetIdx]} to point directly to ${targetIdx + 1 < len ? arr[targetIdx + 1] : 'null'}.` : `Removing the head — new head is node ${arr[1] ?? 'null'}.`}`,
    nodes, { ...(prev >= 0 ? { [prev]: 'prev' } : {}), [targetIdx]: 'remove' }, { phase: 'remove', targetIdx })

  const result = arr.filter((_, i) => i !== targetIdx)
  const finalNodes = result.map((val, i) => ({ val, id: i, state: 'match' }))
  push(steps, `Node removed. Resulting list: ${result.join(' → ')}.`, finalNodes, {}, { phase: 'complete', result })
  return steps
}

function genTwoPointer(arr, n) {
  const steps = []
  const nodes = arr.map((val, i) => ({ val, id: i, state: '' }))
  const len = arr.length

  push(steps, 'Fast-slow pointer trick: advance the fast pointer n steps ahead, then move both together until fast reaches the end. Slow then sits just before the node to remove.', nodes, {})

  let fast = 0
  push(steps, `Start: place both fast and slow at the head (position 0).`, nodes, { 0: 'fast', 0: 'slow' }, { fast: 0, slow: -1, phase: 'init' })

  for (let k = 0; k < n; k++) {
    fast++
    push(steps,
      `Advance fast pointer ${k + 1} of ${n} steps — now at position ${fast} (value ${arr[fast] ?? 'past end'}).`,
      nodes, { ...(fast < len ? { [fast]: 'fast' } : {}) }, { fast, slow: -1, phase: 'advance-fast' })
  }

  let slow = -1  // -1 = dummy node before head
  push(steps, `Fast is ${n} steps ahead. Now move both forward together until fast reaches the last node.`, nodes,
    { ...(fast < len ? { [fast]: 'fast' } : {}) }, { fast, slow, phase: 'move-together' })

  while (fast < len - 1) {
    fast++; slow++
    push(steps,
      `Move both: fast → position ${fast} (${arr[fast]}), slow → position ${slow} (${arr[slow]}). Slow is now just before the target.`,
      nodes, { [fast]: 'fast', [slow]: 'slow' }, { fast, slow, phase: 'move-together' })
  }

  const targetIdx = slow + 1
  nodes[targetIdx].state = 'error'
  push(steps,
    `Fast is at the last node. Slow (position ${slow >= 0 ? slow : 'dummy'}) is just before the node to remove (position ${targetIdx}, value ${arr[targetIdx]}).`,
    nodes,
    { ...(slow >= 0 ? { [slow]: 'slow' } : {}), [targetIdx]: 'remove' },
    { fast, slow, targetIdx, phase: 'remove' })

  const result = arr.filter((_, i) => i !== targetIdx)
  const finalNodes = result.map((val, i) => ({ val, id: i, state: 'match' }))
  push(steps, `Removed node ${arr[targetIdx]}. Result: ${result.join(' → ')}.`, finalNodes, {}, { phase: 'complete', result })
  return steps
}

export function generateSteps(algo, arr, n) {
  if (algo === 'twopass') return genTwoPass(arr, n)
  return genTwoPointer(arr, n)
}
