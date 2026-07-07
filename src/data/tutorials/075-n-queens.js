/**
 * Tutorial content for #075 — N-Queens
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Place n queens on an n×n chessboard so that no two queens attack each other. Queens attack along rows, columns, and both diagonals. Return all distinct solutions, each as a list of board rows (using '.' for empty and 'Q' for a queen).`,
    example: `n = 4\n→ Solution 1:         Solution 2:\n  . Q . .             . . Q .\n  . . . Q             Q . . .\n  Q . . .             . . . Q\n  . . Q .             . Q . .\n✅ Answer: 2 solutions`,
    keyInsight: `Place one queen per row. When placing in row r, track which columns, left-diagonals (r-c is constant), and right-diagonals (r+c is constant) are already under attack. Only place a queen where all three are free.`,
  },

  approaches: {
    'Backtracking with Column/Diagonal Sets': {
      intuition: `Use three HashSets to track attacked columns, left-diagonals (identified by row-col), and right-diagonals (row+col). When placing a queen in (row, col), check all three sets. If the position is safe, add to all three sets, recurse to the next row, then remove from all three sets (backtrack).`,
      steps: [
        `Create sets: cols, diag1 (r-c), diag2 (r+c).`,
        `Backtrack(row, board):`,
        `  If row == n: add board to results; return.`,
        `  For col from 0 to n-1:`,
        `    If col, row-col, or row+col is in any attacked set: skip.`,
        `    Place queen: board[row][col]='Q', add to all three sets.`,
        `    Recurse(row+1).`,
        `    Remove queen: board[row][col]='.', remove from sets.`,
      ],
      example: `n = 4\n\nrow=0: try col=0,1,2,3\n  col=1: safe → board[0][1]='Q'; cols={1}, d1={-1}, d2={1}\n  row=1: col=0 (d2 conflict skip?), col=3: safe\n    board[1][3]='Q'; cols={1,3}, d1={-1,-2}, d2={1,4}\n  row=2: col=0: safe\n    board[2][0]='Q'\n  row=3: col=2: safe → complete solution [.Q.., ...Q, Q..., ..Q.] ✓\n✅ Answer: 2 solutions`,
      keyInsight: `O(n!) time (pruned), O(n) extra space. HashSets give O(1) lookup. This is the standard clean interview solution.`,
    },

    'Backtracking with Boolean Arrays': {
      intuition: `Same algorithm, but replace the HashSets with fixed-size boolean arrays. Columns need an array of size n. Left-diagonals (r-c) range from -(n-1) to n-1, stored offset by n-1. Right-diagonals (r+c) range from 0 to 2n-2. Boolean arrays are faster to access than HashSets.`,
      steps: [
        `Create: usedCols[n], usedDiag1[2n-1] (for r-c+n-1), usedDiag2[2n-1] (for r+c).`,
        `Backtrack(row):`,
        `  If row == n: add board; return.`,
        `  For col from 0 to n-1:`,
        `    Let d1 = row-col+n-1, d2 = row+col.`,
        `    If usedCols[col] OR usedDiag1[d1] OR usedDiag2[d2]: skip.`,
        `    Set all three true, board[row][col]='Q', recurse(row+1), unset all, board='.' .`,
      ],
      example: `n = 4\n\nSame search as HashSet version.\nusedCols[1]=T, usedDiag1[2]=T (0-1+3), usedDiag2[1]=T (0+1)\nrow=1: check each col against boolean arrays...\n→ 2 solutions found\n✅ Answer: 2 solutions`,
      keyInsight: `O(n!) time, O(n) extra space. Boolean arrays are cache-friendly and faster than HashSets — preferred when performance is critical.`,
    },

    'Backtracking with Bitmask': {
      intuition: `Represent attacked columns and diagonals as integers (bitmasks) rather than arrays or sets. A bit at position p being 1 means column/diagonal p is under attack. Use bitwise operations to check and mark attacks. This is extremely fast due to hardware-level parallelism.`,
      steps: [
        `cols = 0, diag1 = 0, diag2 = 0 (all bits 0 = no attacks).`,
        `Backtrack(row):`,
        `  If row == n: add board; return.`,
        `  For col from 0 to n-1:`,
        `    If (cols >> col) & 1 OR (diag1 >> (row-col+n-1)) & 1 OR (diag2 >> (row+col)) & 1: skip.`,
        `    Set bits: cols |= 1<<col, diag1 |= 1<<(row-col+n-1), diag2 |= 1<<(row+col).`,
        `    Recurse(row+1).`,
        `    Unset bits: cols ^= 1<<col, diag1 ^= ..., diag2 ^= ...`,
      ],
      example: `n = 4\n\nrow=0, col=1:\n  cols = 0b0010 (bit 1 set)\n  diag1 bit at (0-1+3)=2: diag1=0b100\n  diag2 bit at (0+1)=1: diag2=0b010\nrow=1, try col=3:\n  Check col bit 3: (cols>>3)&1=0 ✓\n  Check diag1 bit at (1-3+3)=1: (diag1>>1)&1=0 ✓\n  Check diag2 bit at (1+3)=4: (diag2>>4)&1=0 ✓ → place!\n... → 2 solutions\n✅ Answer: 2 solutions`,
      keyInsight: `O(n!) time, O(n) space. Bitmask operations are single CPU instructions — the fastest implementation. Especially powerful when using the "available columns" bitmask trick to iterate only safe columns.`,
    },
  },
}
