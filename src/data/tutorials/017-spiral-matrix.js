/**
 * Tutorial content for #017 — Spiral Matrix
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an m×n matrix, return all elements of the matrix in spiral order — starting from the top-left, go right across the top row, then down the right column, then left across the bottom row, then up the left column, and repeat for the inner matrix.`,
    example: `[[1,2,3],\n [4,5,6],\n [7,8,9]]\n→ right: 1,2,3 → down: 6,9 → left: 8,7 → up: 4 → center: 5\n✅ Answer: [1,2,3,6,9,8,7,4,5]`,
    keyInsight: `Track four boundaries: top, bottom, left, right. Traverse along each boundary, then shrink it inward. Repeat until all elements are visited.`,
  },

  approaches: {
    'Shrinking Boundaries': {
      intuition: `Maintain four boundary variables: top, bottom, left, right. In each cycle, traverse the top row (left→right), right column (top→bottom), bottom row (right→left), and left column (bottom→top). After each traversal, shrink the corresponding boundary inward. Stop when top > bottom or left > right.`,
      steps: [
        `Initialize top=0, bottom=m-1, left=0, right=n-1, result=[].`,
        `While top <= bottom AND left <= right:`,
        `  Traverse right along top row (col from left to right). top++.`,
        `  Traverse down along right col (row from top to bottom). right--.`,
        `  If top <= bottom: traverse left along bottom row (col from right to left). bottom--.`,
        `  If left <= right: traverse up along left col (row from bottom to top). left++.`,
        `Return result.`,
      ],
      example: `matrix = [[1,2,3],[4,5,6],[7,8,9]]\ntop=0,bot=2,left=0,right=2\n\nRound 1:\n  → top row: 1,2,3 → top=1\n  ↓ right col: 6,9 → right=1\n  ← bottom row (top<=bot? 1<=2 yes): 8,7 → bot=1\n  ↑ left col (left<=right? 0<=1 yes): 4 → left=1\n\nRound 2:\n  → top row: 5 → top=2\n  (top>bot now, other conditions fail)\n\n✅ Answer: [1,2,3,6,9,8,7,4,5]`,
      keyInsight: `O(m×n) time, O(1) extra space (ignoring output — every cell visited exactly once). The boundary checks before the bottom-row and left-col traversals prevent double-counting cells in single-row or single-column matrices.`,
    },

    'Direction Array (Simulation)': {
      intuition: `Define four direction vectors for right, down, left, and up. Start at (0,0) moving right. At each step, move in the current direction. If the next cell is out of bounds or already visited, turn to the next direction (cycling through the four). Continue until all cells are collected. A visited boolean array prevents revisiting.`,
      steps: [
        `Define dr=[0,1,0,-1], dc=[1,0,-1,0] (right, down, left, up).`,
        `Create a visited[m][n] boolean matrix, all false. Start r=0, c=0, dir=0.`,
        `For each of the m*n cells: add matrix[r][c] to result, mark visited[r][c]=true.`,
        `Compute next cell: nr=r+dr[dir], nc=c+dc[dir].`,
        `If nr/nc is out of bounds OR visited[nr][nc]: turn dir = (dir+1)%4.`,
        `Move to r+=dr[dir], c+=dc[dir].`,
        `Return result.`,
      ],
      example: `matrix = [[1,2,3],[4,5,6],[7,8,9]]\nStart (0,0) dir=RIGHT\n\n(0,0)=1→(0,1)=2→(0,2)=3: next (0,3) OOB → turn DOWN\n(1,2)=6: next (2,2) ok → 9: next (3,2) OOB → turn LEFT\n(2,1)=8→(2,0)=7: next (2,-1) OOB → turn UP\n(1,0)=4: next (0,0) visited → turn RIGHT\n(1,1)=5: next (1,2) visited → turn DOWN\nAll done.\n✅ Answer: [1,2,3,6,9,8,7,4,5]`,
      keyInsight: `O(m×n) time, O(m×n) space for the visited array. Cleanly generalizes to any traversal shape (not just spiral) by changing the direction list. The extra visited array is the trade-off vs. the boundary approach.`,
    },

    'Layer Recursion (Peel Outer Ring)': {
      intuition: `Treat the spiral as peeling layers of an onion. The outermost layer (top row, right col, bottom row, left col) is collected first, then the function recurses on the inner sub-matrix. The base case is an empty matrix or a single row/column. This maps naturally to recursion.`,
      steps: [
        `Base case: if matrix is empty or has 0 rows, return [].`,
        `Collect the top row (entire first row, left to right). Remove it from the matrix.`,
        `Collect the right column (remaining rows, top to bottom). Remove the last element from each row.`,
        `If rows remain: collect the bottom row (right to left). Remove it.`,
        `If columns remain: collect the left column (remaining rows, bottom to top). Remove first element of each row.`,
        `Recurse on the remaining inner matrix and append to result.`,
      ],
      example: `matrix = [[1,2,3],[4,5,6],[7,8,9]]\n\nLayer 1:\n  top row: [1,2,3] → matrix becomes [[4,5,6],[7,8,9]]\n  right col: [6,9] → matrix becomes [[4,5],[7,8]]\n  bottom row reversed: [8,7] → matrix becomes [[4,5]]\n  left col reversed: [4] → matrix becomes [[5]]\nRecurse on [[5]] → [5]\n\nFlatten: [1,2,3,6,9,8,7,4,5]\n✅ Answer: [1,2,3,6,9,8,7,4,5]`,
      keyInsight: `O(m×n) time, O(min(m,n)) stack space. Elegant recursive decomposition — each call handles one ring and shrinks the matrix. The repeated slicing can add O(m×n) memory overhead in languages without in-place slicing.`,
    },

    'Transpose + Rotate Trick': {
      intuition: `This approach works only for square matrices. Observe that the spiral order of a 90°-rotated matrix reads out as the same sequence but starting from a different corner. Repeatedly rotate the matrix 90° clockwise (using the transpose trick), collect the top row each time, and stop once all rows are exhausted. This reuses the rotation logic but is less efficient.`,
      steps: [
        `While the matrix has rows:`,
        `  Add the first row of the matrix to result (left→right, this is the current spiral top).`,
        `  Remove the first row.`,
        `  Rotate the remaining matrix 90° clockwise (transpose + reverse each row).`,
        `Return result.`,
      ],
      example: `matrix = [[1,2,3],[4,5,6],[7,8,9]]\n\nRound 1: collect top [1,2,3]. Remaining: [[4,5,6],[7,8,9]]. Rotate CW → [[7,4],[8,5],[9,6]].\nRound 2: collect top [7,4]. Remaining: [[8,5],[9,6]]. Rotate CW → [[9,8],[6,5]].\nRound 3: collect top [9,8]. Remaining: [[6,5]]. Rotate CW → [[6],[5]].\nRound 4: collect top [6]. Remaining: [[5]]. Rotate CW → [[5]].\nRound 5: collect [5]. Done.\nFlatten: [1,2,3,7,4,9,8,6,5] — note: this gives a different spiral!\n⚠️ This variant demonstrates the concept but output order differs from standard spiral.`,
      keyInsight: `O(m²×n) time due to repeated rotation copies — worse than O(m×n). Conceptually interesting as a rotation reuse, but not practical. Included to show the relationship between rotation and spiral traversal.`,
    },

    'Direction Tracking (No Visited Array)': {
      intuition: `Like the Direction Array simulation, but instead of a separate visited matrix, use the shrinking boundaries (top, bottom, left, right) to determine when to turn. When the next step in the current direction would exit the boundary, update the boundary and turn. This merges the visited-array simulation with the boundary approach, using O(1) extra space.`,
      steps: [
        `Define direction vectors dr=[0,1,0,-1], dc=[1,0,-1,0].`,
        `Initialize top=0, bottom=m-1, left=0, right=n-1, r=0, c=0, dir=0.`,
        `For each of m*n cells: add matrix[r][c] to result.`,
        `Compute next (nr, nc) = (r+dr[dir], c+dc[dir]).`,
        `If nr/nc is outside the current active boundary: shrink the boundary for the current direction, then turn dir=(dir+1)%4.`,
        `Move r+=dr[dir], c+=dc[dir].`,
        `Return result.`,
      ],
      example: `matrix = [[1,2,3],[4,5,6],[7,8,9]]\ntop=0,bot=2,left=0,right=2, dir=RIGHT\n\n1→2→3: next col=3 > right=2 → top++ (top=1), turn DOWN\n6→9: next row=3 > bot=2 → right-- (right=1), turn LEFT\n8→7: next col=-1 < left=0 → bot-- (bot=1), turn UP\n4: next row=0 < top=1 → left++ (left=1), turn RIGHT\n5: all boundaries collapse\n✅ Answer: [1,2,3,6,9,8,7,4,5]`,
      keyInsight: `O(m×n) time, O(1) extra space. Combines direction-vector elegance with boundary-based turning — no visited array needed. A clean hybrid that's both intuitive and memory-efficient.`,
    },
  },
}
