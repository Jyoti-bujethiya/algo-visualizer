// 022 — Merge Two Sorted Lists · steps.js

const _PL022 = {'compare': 2, 'take-l1': 3, 'take-l2': 4, 'drain': 6, 'complete': 9}

function push(steps, desc, l1, l2, merged, pointers, extra = {}) {
  steps.push({ description: desc, l1: [...l1], l2: [...l2], merged: [...merged], pointers: { ...pointers }, codeLineIndex: extra.codeLineIndex ?? (_PL022[extra.phase] ?? -1), ...extra })
}

function genIterative(a, b) {
  const steps = []
  let i = 0, j = 0
  const merged = []

  push(steps, 'Use a dummy head and one pointer per list. Each step pick the smaller front node and advance that list.', a, b, merged, { i, j })

  while (i < a.length && j < b.length) {
    push(steps,
      `Comparing list-1 value ${a[i]} with list-2 value ${b[j]}.`,
      a, b, merged, { i, j }, { phase: 'compare' })
    if (a[i] <= b[j]) {
      merged.push(a[i])
      push(steps, `${a[i]} ≤ ${b[j]} — take from list 1 and advance its pointer.`, a, b, merged, { i: i + 1, j }, { phase: 'take-l1' })
      i++
    } else {
      merged.push(b[j])
      push(steps, `${b[j]} < ${a[i]} — take from list 2 and advance its pointer.`, a, b, merged, { i, j: j + 1 }, { phase: 'take-l2' })
      j++
    }
  }

  while (i < a.length) { merged.push(a[i]); i++ }
  while (j < b.length) { merged.push(b[j]); j++ }

  if (i < a.length || j < b.length) {
    push(steps, 'One list is exhausted — append the remaining nodes from the other list.', a, b, merged, { i, j }, { phase: 'drain' })
  }

  push(steps, `Merge complete! Result: ${merged.join(' → ')}.`, a, b, merged, { i: -1, j: -1 }, { phase: 'complete' })
  return steps
}

function genRecursive(a, b) {
  const steps = []
  const merged = []

  push(steps, 'Recursively pick the smaller head: take it, then recurse on the rest. The base case is when either list is empty.', a, b, merged, { i: 0, j: 0 })

  function rec(i, j) {
    if (i >= a.length && j >= b.length) return
    if (i >= a.length) {
      push(steps, `List 1 exhausted — append remaining list-2 nodes starting from ${b[j]}.`, a, b, merged, { i, j }, { phase: 'drain' })
      while (j < b.length) { merged.push(b[j++]) }
      return
    }
    if (j >= b.length) {
      push(steps, `List 2 exhausted — append remaining list-1 nodes starting from ${a[i]}.`, a, b, merged, { i, j }, { phase: 'drain' })
      while (i < a.length) { merged.push(a[i++]) }
      return
    }
    push(steps, `Comparing ${a[i]} (list 1) vs ${b[j]} (list 2) — pick the smaller to add next.`, a, b, merged, { i, j }, { phase: 'compare' })
    if (a[i] <= b[j]) {
      merged.push(a[i])
      push(steps, `Take ${a[i]} from list 1. Recurse with list-1 pointer moved forward.`, a, b, merged, { i: i + 1, j }, { phase: 'take-l1' })
      rec(i + 1, j)
    } else {
      merged.push(b[j])
      push(steps, `Take ${b[j]} from list 2. Recurse with list-2 pointer moved forward.`, a, b, merged, { i, j: j + 1 }, { phase: 'take-l2' })
      rec(i, j + 1)
    }
  }

  rec(0, 0)
  push(steps, `All nodes merged. Result: ${merged.join(' → ')}.`, a, b, merged, { i: -1, j: -1 }, { phase: 'complete' })
  return steps
}

export function generateSteps(algo, a, b) {
  if (algo === 'recursive') return genRecursive(a, b)
  return genIterative(a, b)
}
