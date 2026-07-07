// 028 — Merge K Sorted Lists · steps.js

const _PL028 = {'init': 0, 'extract': 2, 'push': 3, 'complete': -1, 'pass': 0, 'merge': 2}

function push(steps, desc, lists, merged, extra = {}) {
  steps.push({ description: desc, lists: lists.map(l => [...l]), merged: [...merged], codeLineIndex: extra.codeLineIndex ?? (_PL028[extra.phase] ?? -1), ...extra })
}

function genMinHeap(lists) {
  const steps = []
  const merged = []

  // Represent heap as sorted array for visualisation
  // Each entry: { val, listIdx, elemIdx }
  const heap = []
  for (let li = 0; li < lists.length; li++) {
    if (lists[li].length > 0) heap.push({ val: lists[li][0], listIdx: li, elemIdx: 0 })
  }
  heap.sort((a, b) => a.val - b.val)

  const ptrs = lists.map(() => 0)  // current pointer into each list

  push(steps,
    `Load the first element of each list into a min-heap. Always extract the minimum, then push the next element from that list.`,
    lists, merged, { heap: heap.map(h => h.val), ptrs: [...ptrs], phase: 'init' })

  while (heap.length > 0) {
    const min = heap.shift()
    merged.push(min.val)
    ptrs[min.listIdx]++

    push(steps,
      `Extracted minimum ${min.val} from list ${min.listIdx}. Merged so far: [${merged.join(', ')}].`,
      lists, merged,
      { heap: heap.map(h => h.val), ptrs: [...ptrs], activeList: min.listIdx, phase: 'extract' })

    const nextIdx = ptrs[min.listIdx]
    if (nextIdx < lists[min.listIdx].length) {
      const next = { val: lists[min.listIdx][nextIdx], listIdx: min.listIdx, elemIdx: nextIdx }
      // insert into sorted heap
      let ins = 0
      while (ins < heap.length && heap[ins].val <= next.val) ins++
      heap.splice(ins, 0, next)
      push(steps,
        `Pushed next element ${next.val} from list ${min.listIdx} into the heap. Heap: [${heap.map(h => h.val).join(', ')}].`,
        lists, merged,
        { heap: heap.map(h => h.val), ptrs: [...ptrs], activeList: min.listIdx, phase: 'push' })
    }
  }

  push(steps,
    `All lists drained. Merged result: [${merged.join(', ')}].`,
    lists, merged, { heap: [], ptrs: [...ptrs], phase: 'complete' })
  return steps
}

function genDivideConquer(lists) {
  const steps = []
  const merged = []

  push(steps,
    'Divide and conquer: pair up lists and merge pairs repeatedly. Each round halves the number of lists until only one remains.',
    lists, merged, { phase: 'init' })

  let current = lists.map(l => [...l])
  let round = 0

  while (current.length > 1) {
    round++
    const next = []
    for (let i = 0; i < current.length; i += 2) {
      if (i + 1 >= current.length) {
        next.push(current[i])
        push(steps, `Round ${round}: list ${i} has no pair — pass it through unchanged.`, current, merged, { phase: 'pass', round })
        continue
      }
      const a = current[i], b = current[i + 1]
      const m = []
      let li = 0, ri = 0
      while (li < a.length && ri < b.length) {
        if (a[li] <= b[ri]) m.push(a[li++]); else m.push(b[ri++])
      }
      while (li < a.length) m.push(a[li++])
      while (ri < b.length) m.push(b[ri++])
      next.push(m)
      push(steps,
        `Round ${round}: merged lists ${i} and ${i+1} → [${m.join(', ')}].`,
        current, merged, { phase: 'merge', round, mergedPair: m, pairA: i, pairB: i + 1 })
    }
    current = next
  }

  const result = current[0] ?? []
  for (const v of result) merged.push(v)
  push(steps,
    `All rounds done. Final merged result: [${result.join(', ')}].`,
    current, merged, { phase: 'complete' })
  return steps
}

export function generateSteps(algo, lists) {
  if (algo === 'divconq') return genDivideConquer(lists)
  return genMinHeap(lists)
}
