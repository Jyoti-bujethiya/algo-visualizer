// 075 — N-Queens · steps.js
// Place n queens on n×n board; backtrack row by row
// Validity: no queens in same col, diagonal, or anti-diagonal

// line indices:
// 0: function solveNQueens(n):
// 1:   board = n×n empty; result=[]
// 2:   cols=set; diag1=set; diag2=set
// 3:   function backtrack(row):
// 4:     if row==n: record solution
// 5:     for col = 0 to n-1:
// 6:       if col/diag1/diag2 conflict: continue
// 7:       place queen; mark sets
// 8:       backtrack(row+1)
// 9:       remove queen; unmark sets
// 10:  backtrack(0)

function push(steps, desc, board, highlights, solutions, codeLineIndex, extra = {}) {
  steps.push({ description: desc, board: board.map(r => [...r]), highlights: { ...highlights }, solutions: solutions.map(s => [...s]), codeLineIndex, ...extra })
}

export function generateSteps(n) {
  const steps = []
  const board = Array.from({ length: n }, () => new Array(n).fill(0))
  const highlights = {}
  const solutions = []
  const cols = new Set(), diag1 = new Set(), diag2 = new Set()

  push(steps, `N-Queens: place ${n} queens on a ${n}×${n} board — no two queens attack each other. Backtrack row by row.`, board, {}, solutions, 0)

  function backtrack(row) {
    if (row === n) {
      const sol = board.map(r => r.indexOf(1))
      solutions.push(sol)
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) highlights[`${r},${c}`] = board[r][c] ? 'placed' : ''
      push(steps, `Solution #${solutions.length} found! Queens at cols: [${sol.join(',')}].`, board, { ...highlights }, solutions, 4)
      return
    }
    for (let col = 0; col < n; col++) {
      const conflict = cols.has(col) || diag1.has(row - col) || diag2.has(row + col)
      highlights[`${row},${col}`] = conflict ? 'error' : 'trying'
      push(steps, `Row ${row}, col ${col}: ${conflict ? 'CONFLICT (col/diag) — skip.' : 'safe — place queen.'}`, board, { ...highlights }, solutions, conflict ? 6 : 7)
      if (conflict) { highlights[`${row},${col}`] = ''; continue }
      board[row][col] = 1
      cols.add(col); diag1.add(row - col); diag2.add(row + col)
      highlights[`${row},${col}`] = 'placed'
      push(steps, `Placed queen at (${row},${col}). Recurse to row ${row+1}.`, board, { ...highlights }, solutions, 8)
      backtrack(row + 1)
      board[row][col] = 0
      cols.delete(col); diag1.delete(row - col); diag2.delete(row + col)
      highlights[`${row},${col}`] = 'done'
      push(steps, `Backtrack: removed queen from (${row},${col}).`, board, { ...highlights }, solutions, 9)
      highlights[`${row},${col}`] = ''
    }
  }

  backtrack(0)
  push(steps, `Found ${solutions.length} solution${solutions.length !== 1 ? 's' : ''} for N=${n}.`, board, { ...highlights }, solutions, 10, { done: true })
  return steps
}
