// Rotate Image — LeetCode #48 — pure step generators (no DOM)
// CODE.transpose line→ tloop:1, tswap:2, rloop:4, rrev:5
// CODE.cycle     line→ layer:0, elem:1, save:2, move:3
// CODE.copy      line→ init:0, loop:1, assign:2, ret:3
const CK = { tloop:1, tswap:2, rloop:4, rrev:5, layer:0, elem:1, save:2, move:3, init:0, loop:1, assign:2, ret:3 }

function deepCopy(m) { return m.map(r => [...r]) }

function genTranspose(matrix) {
  const steps = []
  const m = deepCopy(matrix)
  const n = m.length

  steps.push({ desc: 'Rotating 90° clockwise can be done in two simple in-place passes: first transpose the matrix (flip across the diagonal), then reverse each row.', codeKey: 'tloop', codeLineIndex: CK['tloop'], matrix: deepCopy(m), highlights: [], phase: '' })
  steps.push({ desc: 'Pass 1 — Transpose: swap each element above the diagonal with its mirror below it.', codeKey: 'tloop', codeLineIndex: CK['tloop'], matrix: deepCopy(m), highlights: [], phase: '' })

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      steps.push({ desc: `Swapping position (${i},${j}) (value ${m[i][j]}) with position (${j},${i}) (value ${m[j][i]}).`, codeKey: 'tswap', codeLineIndex: CK['tswap'], matrix: deepCopy(m), highlights: [{ r: i, c: j, type: 'swap' }, { r: j, c: i, type: 'swap' }], phase: '' })
      const tmp = m[i][j]; m[i][j] = m[j][i]; m[j][i] = tmp
      steps.push({ desc: `Swap done. Row ${i} and column ${i} now have their values exchanged at this position.`, codeKey: 'tswap', codeLineIndex: CK['tswap'], matrix: deepCopy(m), highlights: [{ r: i, c: j, type: 'done' }, { r: j, c: i, type: 'done' }], phase: '' })
    }
  }
  steps.push({ desc: 'Transpose complete. Every element is now mirrored across the main diagonal.', codeKey: 'rloop', codeLineIndex: CK['rloop'], matrix: deepCopy(m), highlights: [], phase: '' })
  steps.push({ desc: 'Pass 2 — Reverse each row: this finishes the 90° clockwise rotation.', codeKey: 'rloop', codeLineIndex: CK['rloop'], matrix: deepCopy(m), highlights: [], phase: '' })

  for (let i = 0; i < n; i++) {
    steps.push({ desc: `Reversing row ${i}: [${m[i].join(', ')}].`, codeKey: 'rrev', codeLineIndex: CK['rrev'], matrix: deepCopy(m), highlights: m[i].map((_, c) => ({ r: i, c, type: 'row' })), phase: '' })
    m[i].reverse()
    steps.push({ desc: `Row ${i} reversed to [${m[i].join(', ')}].`, codeKey: 'rrev', codeLineIndex: CK['rrev'], matrix: deepCopy(m), highlights: m[i].map((_, c) => ({ r: i, c, type: 'done' })), phase: '' })
  }
  steps.push({ desc: 'Rotation complete! The matrix has been rotated 90° clockwise in place.', codeKey: 'rrev', codeLineIndex: CK['rrev'], matrix: deepCopy(m), highlights: [], phase: 'complete' })
  return steps
}

function ringCells(first, last) {
  const cells = []
  for (let c = first; c <= last; c++) cells.push({ r: first, c, type: 'ring' })
  for (let r = first + 1; r <= last; r++) cells.push({ r, c: last, type: 'ring' })
  for (let c = last - 1; c >= first; c--) cells.push({ r: last, c, type: 'ring' })
  for (let r = last - 1; r > first; r--) cells.push({ r, c: first, type: 'ring' })
  return cells
}

function genCycle(matrix) {
  const steps = []
  const m = deepCopy(matrix)
  const n = m.length
  steps.push({ desc: 'Process the matrix layer by layer, from the outer ring inward. Within each layer, rotate four cells at a time in a cycle: top → right → bottom → left → top.', codeKey: 'layer', codeLineIndex: CK['layer'], matrix: deepCopy(m), highlights: [], phase: '' })

  for (let layer = 0; layer < Math.floor(n / 2); layer++) {
    const first = layer, last = n - 1 - layer
    steps.push({ desc: `Processing layer ${layer} (the ring from corner (${first},${first}) to corner (${last},${last})).`, codeKey: 'layer', codeLineIndex: CK['layer'], matrix: deepCopy(m), highlights: ringCells(first, last), phase: '' })
    for (let i = first; i < last; i++) {
      const off = i - first
      const top = m[first][i]
      steps.push({ desc: `Save the top cell (${top}). Now shift: left → top, bottom → left, right → bottom, and put the saved top into right.`, codeKey: 'save', codeLineIndex: CK['save'], matrix: deepCopy(m), highlights: [{ r: first, c: i, type: 'top' }, { r: i, c: last, type: 'right' }, { r: last, c: last - off, type: 'bottom' }, { r: last - off, c: first, type: 'left' }], phase: '' })
      m[first][i] = m[last - off][first]
      m[last - off][first] = m[last][last - off]
      m[last][last - off] = m[i][last]
      m[i][last] = top
      steps.push({ desc: `Four-way cycle done for this position. All four cells have rotated one step clockwise.`, codeKey: 'move', codeLineIndex: CK['move'], matrix: deepCopy(m), highlights: [{ r: first, c: i, type: 'done' }, { r: i, c: last, type: 'done' }, { r: last, c: last - off, type: 'done' }, { r: last - off, c: first, type: 'done' }], phase: '' })
    }
  }
  steps.push({ desc: 'All layers processed. The matrix has been rotated 90° clockwise in place.', codeKey: 'move', codeLineIndex: CK['move'], matrix: deepCopy(m), highlights: [], phase: 'complete' })
  return steps
}

function genCopy(matrix) {
  const steps = []
  const orig = deepCopy(matrix)
  const n = orig.length
  const res = Array.from({ length: n }, () => new Array(n).fill(0))
  steps.push({ desc: 'Allocate a new result matrix. Copy each element from the source to its rotated position: the element at row i, column j goes to row j, column (n-1-i) in the result.', codeKey: 'init', codeLineIndex: CK['init'], matrix: deepCopy(orig), highlights: [], phase: '' })

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const di = j, dj = n - 1 - i
      const step = { desc: `Value ${orig[i][j]} at (${i},${j}) moves to (${di},${dj}) in the result.`, codeKey: 'assign', codeLineIndex: CK['assign'], matrix: deepCopy(orig), highlights: [{ r: i, c: j, type: 'src' }], phase: 'copy' }
      res[di][dj] = orig[i][j]
      step.resMatrix = deepCopy(res)
      steps.push(step)
    }
  }
  steps.push({ desc: 'All elements placed. Copy the result back to get the rotated matrix.', codeKey: 'ret', codeLineIndex: CK['ret'], matrix: deepCopy(res), highlights: [], phase: 'complete' })
  return steps
}

export function generateSteps(algo, matrix) {
  if (algo === 'transpose') return genTranspose(matrix)
  if (algo === 'cycle') return genCycle(matrix)
  return genCopy(matrix)
}
