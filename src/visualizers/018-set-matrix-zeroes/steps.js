// Set Matrix Zeroes — LeetCode #73 — pure step generators (no DOM)

function clone(m) { return m.map(r => [...r]) }

function genMarkers(matrix) {
  const steps = []
  const m = clone(matrix)
  const rows = m.length, cols = m[0].length

  steps.push({ matrix: clone(m), phase: 'init', codeLineIndex: 0, highlight: [], description: `Use the first row and first column as markers — no extra space needed. First check if they themselves contain zeros, then scan the interior.`, zeroRows: [], zeroCols: [] })

  const firstRowZero = m[0].some(v => v === 0)
  const firstColZero = m.some(r => r[0] === 0)
  steps.push({ matrix: clone(m), phase: 'check-flags', codeLineIndex: 0, highlight: [], description: `Checked: the first row ${firstRowZero ? 'contains' : 'does not contain'} a zero, and the first column ${firstColZero ? 'contains' : 'does not contain'} a zero. Remember these flags for later.`, zeroRows: [], zeroCols: [] })

  steps.push({ matrix: clone(m), phase: 'mark', codeLineIndex: 3, highlight: [], description: 'Scanning the interior (ignoring the first row and column). When we find a zero, mark its row and column in the first row and first column.', zeroRows: [], zeroCols: [] })
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (m[i][j] === 0) {
        steps.push({ matrix: clone(m), phase: 'found-zero', codeLineIndex: 4, highlight: [[i, j]], description: `Found a zero at row ${i}, column ${j}. Mark row ${i} by setting cell (${i},0) to zero, and mark column ${j} by setting cell (0,${j}) to zero.`, zeroRows: [], zeroCols: [] })
        m[i][0] = 0; m[0][j] = 0
        steps.push({ matrix: clone(m), phase: 'marked', codeLineIndex: 5, highlight: [[i, 0], [0, j]], description: `Markers placed. These first-row and first-column cells will tell us which rows and columns to zero out.`, zeroRows: [], zeroCols: [] })
      }
    }
  }

  steps.push({ matrix: clone(m), phase: 'apply', codeLineIndex: 7, highlight: [], description: `Marking pass complete. Now apply the markers: zero out any interior cell whose row or column was marked.`, zeroRows: [], zeroCols: [] })
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (m[i][0] === 0 || m[0][j] === 0) {
        steps.push({ matrix: clone(m), phase: 'zeroing', codeLineIndex: 8, highlight: [[i, j]], description: `Row ${i} or column ${j} was marked — setting cell (${i},${j}) to zero.`, zeroRows: [], zeroCols: [] })
        m[i][j] = 0
      }
    }
  }

  if (firstRowZero) {
    steps.push({ matrix: clone(m), phase: 'first-row', codeLineIndex: 11, highlight: Array.from({ length: cols }, (_, j) => [0, j]), description: `The first row originally contained a zero, so zero out the entire first row now.`, zeroRows: [], zeroCols: [] })
    for (let j = 0; j < cols; j++) m[0][j] = 0
  }
  if (firstColZero) {
    steps.push({ matrix: clone(m), phase: 'first-col', codeLineIndex: 12, highlight: Array.from({ length: rows }, (_, i) => [i, 0]), description: `The first column originally contained a zero, so zero out the entire first column now.`, zeroRows: [], zeroCols: [] })
    for (let i = 0; i < rows; i++) m[i][0] = 0
  }

  steps.push({ matrix: clone(m), phase: 'complete', codeLineIndex: 12, highlight: [], description: `Done! All rows and columns containing a zero have been zeroed out — using only constant extra space.`, zeroRows: [], zeroCols: [] })
  return steps
}

function genBooleans(matrix) {
  const steps = []
  const m = clone(matrix)
  const rows = m.length, cols = m[0].length
  const rowZero = Array(rows).fill(false)
  const colZero = Array(cols).fill(false)

  steps.push({ matrix: clone(m), phase: 'init', codeLineIndex: 0, highlight: [], description: `Allocate two boolean arrays — one for rows, one for columns. First pass: scan every cell and flag any row or column that contains a zero.`, zeroRows: [], zeroCols: [] })

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (m[i][j] === 0) {
        rowZero[i] = true; colZero[j] = true
        steps.push({ matrix: clone(m), phase: 'scan', codeLineIndex: 2, highlight: [[i, j]], description: `Zero found at (${i},${j}). Flagging row ${i} and column ${j}.`, zeroRows: rowZero.reduce((a, v, k) => v ? [...a, k] : a, []), zeroCols: colZero.reduce((a, v, k) => v ? [...a, k] : a, []) })
      }
    }
  }

  steps.push({ matrix: clone(m), phase: 'apply', codeLineIndex: 4, highlight: [], description: `Scan complete. Now zero out every cell whose row or column is flagged.`, zeroRows: rowZero.reduce((a, v, k) => v ? [...a, k] : a, []), zeroCols: colZero.reduce((a, v, k) => v ? [...a, k] : a, []) })

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (rowZero[i] || colZero[j]) {
        m[i][j] = 0
        steps.push({ matrix: clone(m), phase: 'zeroing', codeLineIndex: 5, highlight: [[i, j]], description: `Row ${i} or column ${j} is flagged — setting cell (${i},${j}) to zero.`, zeroRows: rowZero.reduce((a, v, k) => v ? [...a, k] : a, []), zeroCols: colZero.reduce((a, v, k) => v ? [...a, k] : a, []) })
      }
    }
  }

  steps.push({ matrix: clone(m), phase: 'complete', codeLineIndex: 6, highlight: [], description: `All done! Matrix zeroed in two passes using O(m+n) extra space.`, zeroRows: rowZero.reduce((a, v, k) => v ? [...a, k] : a, []), zeroCols: colZero.reduce((a, v, k) => v ? [...a, k] : a, []) })
  return steps
}

function genHashSets(matrix) {
  const steps = []
  const m = clone(matrix)
  const rows = m.length, cols = m[0].length
  const zeroRowsSet = new Set(), zeroColsSet = new Set()

  steps.push({ matrix: clone(m), phase: 'init', codeLineIndex: 0, highlight: [], description: `Use two sets to record which rows and columns contain a zero. Then zero out every cell in those rows and columns.`, zeroRows: [], zeroCols: [] })

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (m[i][j] === 0) {
        zeroRowsSet.add(i); zeroColsSet.add(j)
        steps.push({ matrix: clone(m), phase: 'scan', codeLineIndex: 1, highlight: [[i, j]], description: `Zero at (${i},${j}). Added row ${i} to the zero-rows set and column ${j} to the zero-cols set.`, zeroRows: [...zeroRowsSet], zeroCols: [...zeroColsSet] })
      }
    }
  }

  steps.push({ matrix: clone(m), phase: 'apply', codeLineIndex: 3, highlight: [], description: `Found zeros in rows {${[...zeroRowsSet].join(', ')}} and columns {${[...zeroColsSet].join(', ')}}. Zeroing those rows and columns now.`, zeroRows: [...zeroRowsSet], zeroCols: [...zeroColsSet] })

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (zeroRowsSet.has(i) || zeroColsSet.has(j)) {
        m[i][j] = 0
        steps.push({ matrix: clone(m), phase: 'zeroing', codeLineIndex: 4, highlight: [[i, j]], description: `Row ${i} or column ${j} is in the sets — setting (${i},${j}) to zero.`, zeroRows: [...zeroRowsSet], zeroCols: [...zeroColsSet] })
      }
    }
  }

  steps.push({ matrix: clone(m), phase: 'complete', codeLineIndex: 5, highlight: [], description: `Done! All relevant rows and columns have been zeroed.`, zeroRows: [...zeroRowsSet], zeroCols: [...zeroColsSet] })
  return steps
}

function genBrute(matrix) {
  const steps = []
  const m = clone(matrix)
  const copy = clone(matrix)
  const rows = m.length, cols = m[0].length

  steps.push({ matrix: clone(m), phase: 'init', codeLineIndex: 0, highlight: [], description: `Make a full copy of the matrix. Scan the copy for zeros, but zero out the original — this prevents zeroed cells from interfering with detection.`, zeroRows: [], zeroCols: [] })

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (copy[i][j] === 0) {
        steps.push({ matrix: clone(m), phase: 'found-zero', codeLineIndex: 1, highlight: [[i, j]], description: `The copy has a zero at (${i},${j}). Zero out the entire row ${i} and the entire column ${j} in the original.`, zeroRows: [], zeroCols: [] })
        for (let k = 0; k < cols; k++) m[i][k] = 0
        for (let k = 0; k < rows; k++) m[k][j] = 0
        steps.push({ matrix: clone(m), phase: 'zeroed', codeLineIndex: 3, highlight: [...Array.from({ length: cols }, (_, k) => [i, k]), ...Array.from({ length: rows }, (_, k) => [k, j])], description: `Row ${i} and column ${j} have been fully zeroed.`, zeroRows: [], zeroCols: [] })
      }
    }
  }

  steps.push({ matrix: clone(m), phase: 'complete', codeLineIndex: 3, highlight: [], description: `Done! All rows and columns containing a zero have been zeroed out.`, zeroRows: [], zeroCols: [] })
  return steps
}

export function generateSteps(algo, matrix) {
  if (algo === 'markers')  return genMarkers(matrix)
  if (algo === 'booleans') return genBooleans(matrix)
  if (algo === 'hashsets') return genHashSets(matrix)
  return genBrute(matrix)
}
