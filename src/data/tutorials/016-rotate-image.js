/**
 * Tutorial content for #016 — Rotate Image
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an n×n matrix representing an image, rotate it 90 degrees clockwise in-place. You must modify the matrix directly without using another matrix.`,
    example: `[[1,2,3],\n [4,5,6],\n [7,8,9]]\n→ after 90° clockwise rotation:\n[[7,4,1],\n [8,5,2],\n [9,6,3]]\n✅ Answer: [[7,4,1],[8,5,2],[9,6,3]]`,
    keyInsight: `A 90° clockwise rotation = transpose the matrix (flip over the main diagonal) then reverse each row. These two simple operations together produce the rotation.`,
  },

  approaches: {
    'Transpose + Reverse Rows': {
      intuition: `Two-step trick: first transpose the matrix (swap matrix[i][j] with matrix[j][i] for all i < j), then reverse each row. The transpose moves columns to rows, and reversing the rows puts them in the right clockwise order. Both steps work in-place.`,
      steps: [
        `Step 1 — Transpose: loop i from 0 to n-1, loop j from i+1 to n-1.`,
        `  Swap matrix[i][j] and matrix[j][i].`,
        `Step 2 — Reverse each row: loop i from 0 to n-1.`,
        `  Reverse matrix[i] using two pointers (left=0, right=n-1, swap and move inward).`,
        `The matrix is now rotated 90° clockwise.`,
      ],
      example: `matrix = [[1,2,3],[4,5,6],[7,8,9]]\n\nTranspose (swap across diagonal):\n  swap(0,1)&(1,0): 2↔4 → [[1,4,7],[2,5,8],[3,6,9]]\n\nReverse each row:\n  row 0: [1,4,7] → [7,4,1]\n  row 1: [2,5,8] → [8,5,2]\n  row 2: [3,6,9] → [9,6,3]\n✅ Result: [[7,4,1],[8,5,2],[9,6,3]]`,
      keyInsight: `O(n²) time, O(1) extra space. Every cell is visited exactly twice (once in transpose, once in reverse). The transpose + reverse-row identity for 90° clockwise rotation is a standard trick worth memorizing.`,
    },

    'Reverse Rows + Transpose': {
      intuition: `The reverse order also works: first reverse the order of rows (flip the matrix vertically), then transpose. This produces the same 90° clockwise result. Useful to know because 90° counter-clockwise is: transpose first, then reverse rows — just the steps in the other order.`,
      steps: [
        `Step 1 — Reverse row order: swap matrix[i] with matrix[n-1-i] for i from 0 to n/2-1.`,
        `  (This flips the matrix vertically, first row swaps with last row, etc.)`,
        `Step 2 — Transpose: loop i from 0 to n-1, j from i+1 to n-1.`,
        `  Swap matrix[i][j] and matrix[j][i].`,
        `The matrix is now rotated 90° clockwise.`,
      ],
      example: `matrix = [[1,2,3],[4,5,6],[7,8,9]]\n\nReverse row order:\n  swap row 0 and row 2 → [[7,8,9],[4,5,6],[1,2,3]]\n\nTranspose:\n  swap(0,1)&(1,0): 8↔4 → ...\n  swap(0,2)&(2,0): 9↔1 → ...\n  swap(1,2)&(2,1): 6↔3 → ...\n  Result: [[7,4,1],[8,5,2],[9,6,3]]\n✅ Result: [[7,4,1],[8,5,2],[9,6,3]]`,
      keyInsight: `Same O(n²) time, O(1) space. Knowing both orderings helps: Transpose+ReverseRows = 90°CW, ReverseRows+Transpose = 90°CW (same!), Transpose+ReverseCols = 90°CCW. Handy cheat sheet.`,
    },

    'Four-Way Cycle (Layer by Layer)': {
      intuition: `Process the matrix layer by layer from the outside in. Within each layer, rotate four cells at a time in a cycle: top→right, right→bottom, bottom→left, left→top. Use a single temporary variable to do this four-way swap without any extra array. This is the most direct in-place rotation without the transpose trick.`,
      steps: [
        `Loop over layers: for layer from 0 to n/2-1.`,
        `Loop over elements in the layer: for i from layer to n-2-layer.`,
        `  offset = i - layer; last = n - 1 - layer.`,
        `  Save top = matrix[layer][i].`,
        `  top ← left:  matrix[layer][i]       = matrix[last-offset][layer].`,
        `  left ← bottom: matrix[last-offset][layer] = matrix[last][last-offset].`,
        `  bottom ← right: matrix[last][last-offset] = matrix[i][last].`,
        `  right ← saved top: matrix[i][last]   = top.`,
      ],
      example: `matrix = [[1,2,3],[4,5,6],[7,8,9]]\nlayer=0, last=2\n\ni=0 (offset=0): top=1\n  [0][0] = [2][0] = 7\n  [2][0] = [2][2] = 9\n  [2][2] = [0][2] = 3\n  [0][2] = top = 1\n  → corner cycle: 1→position(0,2), 3→(2,2), 9→(2,0), 7→(0,0) ✓\n\ni=1 (offset=1): top=2\n  [0][1]=4, [1][0]=8, [2][1]=6, [1][2]=2\n  → edges cycled\n\n✅ Result: [[7,4,1],[8,5,2],[9,6,3]]`,
      keyInsight: `O(n²) time, O(1) space. Rotates four cells per iteration with one temp variable — no additional data structures. More intuitive geometrically than the transpose trick but slightly more index arithmetic.`,
    },

    'Copy to New Matrix': {
      intuition: `Allocate a new n×n matrix and copy each cell from the original to its rotated position. The rotation formula for 90° clockwise is: newMatrix[j][n-1-i] = original[i][j]. This is the simplest code to write and verify, at the cost of O(n²) extra space.`,
      steps: [
        `Allocate result = new int[n][n].`,
        `For each i from 0 to n-1 and j from 0 to n-1:`,
        `  result[j][n-1-i] = matrix[i][j].`,
        `Copy result back into the original matrix (since the problem requires in-place modification).`,
      ],
      example: `matrix = [[1,2,3],[4,5,6],[7,8,9]], n=3\n\n(i=0,j=0): result[0][2] = 1\n(i=0,j=1): result[1][2] = 2\n(i=0,j=2): result[2][2] = 3\n(i=1,j=0): result[0][1] = 4\n(i=1,j=1): result[1][1] = 5\n(i=2,j=0): result[0][0] = 7\n...\nresult = [[7,4,1],[8,5,2],[9,6,3]]\nCopy back into matrix.\n✅ Result: [[7,4,1],[8,5,2],[9,6,3]]`,
      keyInsight: `O(n²) time, O(n²) extra space. The most readable approach — the rotation formula newMatrix[j][n-1-i] is a direct geometric mapping. Not truly in-place, but acceptable when memory is not constrained.`,
    },

    'Transpose + Reverse Columns (Counter-Clockwise)': {
      intuition: `To rotate 90° counter-clockwise (the opposite direction), transpose the matrix and then reverse each column (instead of each row). This mirrors the clockwise trick: Transpose + ReverseRows = 90°CW, Transpose + ReverseCols = 90°CCW. Useful to have alongside the clockwise version for completeness.`,
      steps: [
        `Step 1 — Transpose: swap matrix[i][j] and matrix[j][i] for all i < j.`,
        `Step 2 — Reverse each column: for each column j, swap matrix[i][j] and matrix[n-1-i][j] for i from 0 to n/2-1.`,
        `The matrix is now rotated 90° counter-clockwise.`,
      ],
      example: `matrix = [[1,2,3],[4,5,6],[7,8,9]]\n\nTranspose:\n  [[1,4,7],[2,5,8],[3,6,9]]\n\nReverse each column:\n  col 0: swap row0↔row2 → 1↔3 → [[3,4,7],[2,5,8],[1,6,9]]\n  col 1: swap → 4↔6\n  col 2: swap → 7↔9\n  Result: [[3,6,9],[2,5,8],[1,4,7]]\n✅ Counter-clockwise result: [[3,6,9],[2,5,8],[1,4,7]]`,
      keyInsight: `O(n²) time, O(1) space. Symmetric with the clockwise algorithm — swap only the second step (reverse rows vs. reverse columns). Memorize the pair: ReverseRows→CW, ReverseCols→CCW.`,
    },
  },
}
