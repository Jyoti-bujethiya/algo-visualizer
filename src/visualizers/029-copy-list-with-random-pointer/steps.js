// 029 — Copy List with Random Pointer · steps.js

const _PL029 = {'create': 1, 'wire': 3, 'complete': -1, 'interleave': 2}
// Nodes have val, next, and random (index of target node, or -1 = null)

function push(steps, desc, original, copy, pointers, extra = {}) {
  steps.push({ description: desc, original: original.map(n => ({ ...n })), copy: copy.map(n => ({ ...n })), pointers: { ...pointers }, codeLineIndex: extra.codeLineIndex ?? (_PL029[extra.phase] ?? -1), ...extra })
}

function genHashMap(nodes) {
  const steps = []
  const n = nodes.length
  const original = nodes.map((node, i) => ({ ...node, id: i, state: '' }))
  const copy = Array.from({ length: n }, (_, i) => ({ val: nodes[i].val, id: i, state: 'special', next: -1, random: -1 }))

  push(steps,
    'Pass 1: create all copy nodes. Pass 2: wire up their next and random pointers using a map from original → copy.',
    original, copy.map(n => ({ ...n, state: '' })), {})

  push(steps, 'Pass 1 — Create new nodes with the same values, but pointers not yet set.', original, copy.map(n => ({ ...n, state: '' })), {}, { phase: 'create' })

  for (let i = 0; i < n; i++) {
    push(steps,
      `Created copy node ${i} with value ${nodes[i].val}. It has no next or random links yet.`,
      original, copy.map((c, idx) => ({ ...c, state: idx <= i ? 'special' : '' })),
      { [i]: 'curr' }, { phase: 'create', currIdx: i })
  }

  push(steps, 'Pass 2 — Wire pointers: for each node, set copy[i].next = copy[original[i].next] and copy[i].random = copy[original[i].random].', original, copy, {}, { phase: 'wire' })

  for (let i = 0; i < n; i++) {
    const nextIdx   = i + 1 < n ? i + 1 : -1
    const randomIdx = nodes[i].random  // -1 or index

    copy[i].next   = nextIdx
    copy[i].random = randomIdx
    copy[i].state  = 'match'

    push(steps,
      `Wiring copy node ${i} (value ${nodes[i].val}): next → ${nextIdx >= 0 ? `copy[${nextIdx}] (val ${nodes[nextIdx].val})` : 'null'}, random → ${randomIdx >= 0 ? `copy[${randomIdx}] (val ${nodes[randomIdx].val})` : 'null'}.`,
      original, copy.map((c, idx) => ({ ...c, state: idx <= i ? 'match' : 'special' })),
      { [i]: 'curr' }, { phase: 'wire', currIdx: i })
  }

  push(steps,
    `Deep copy complete! All ${n} nodes cloned with correct next and random links.`,
    original, copy.map(c => ({ ...c, state: 'match' })), {}, { phase: 'complete' })
  return steps
}

function genInterleave(nodes) {
  const steps = []
  const n = nodes.length
  const original = nodes.map((node, i) => ({ ...node, id: i, state: '' }))

  push(steps,
    'O(1) space approach: (1) interleave copies between each original node, (2) set random pointers, (3) separate the two lists.',
    original, [], {})

  // Step 1: interleave
  push(steps, 'Step 1 — Insert a copy of each node right after the original: A→B→C becomes A→A\'→B→B\'→C→C\'.',
    original, [], {}, { phase: 'interleave' })

  const interleaved = []
  for (let i = 0; i < n; i++) {
    interleaved.push({ val: nodes[i].val, id: i * 2,     state: '' })
    interleaved.push({ val: nodes[i].val, id: i * 2 + 1, state: 'special' })
    push(steps, `Inserted copy of node ${nodes[i].val} right after it.`,
      interleaved.map((nd, idx) => ({ ...nd, state: idx % 2 === 1 && idx <= i * 2 + 1 ? 'special' : '' })),
      [], { [i * 2]: 'orig', [i * 2 + 1]: 'copy' }, { phase: 'interleave', currIdx: i })
  }

  // Step 2: set randoms
  push(steps, 'Step 2 — Set random pointers on each copy: copy.random = original.random.next (its copy).', interleaved, [], {}, { phase: 'set-random' })
  for (let i = 0; i < n; i++) {
    const rnd = nodes[i].random
    push(steps,
      `copy[${i}].random = ${rnd >= 0 ? `copy of node ${nodes[rnd].val} (original idx ${rnd})` : 'null'}.`,
      interleaved, [], { [i * 2 + 1]: 'curr' }, { phase: 'set-random', currIdx: i })
  }

  // Step 3: separate
  const copy = nodes.map((node, i) => ({ val: node.val, id: i, state: 'match', next: i + 1 < n ? i + 1 : -1, random: node.random }))
  push(steps,
    'Step 3 — Unweave: restore original next pointers and extract the copy list.',
    original, copy, {}, { phase: 'complete' })
  push(steps,
    `Deep copy complete! ${n} nodes cloned in O(n) time and O(1) space.`,
    original, copy, {}, { phase: 'complete' })
  return steps
}

export function generateSteps(algo, nodes) {
  if (algo === 'interleave') return genInterleave(nodes)
  return genHashMap(nodes)
}
