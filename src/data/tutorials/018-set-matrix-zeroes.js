/**
 * Tutorial content for #018 — Set Matrix Zeroes
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an m×n integer matrix, if any cell contains a 0, set its entire row and entire column to 0. Do this in-place without changing cells that weren't in the original row/column of a zero.`,
    example: `[[1,1,1],\n [1,0,1],\n [1,1,1]]\n→ cell (1,1) is 0 → zero out row 1 and column 1\n✅ Answer: [[1,0,1],[0,0,0],[1,0,1]]`,
    keyInsight: `You must record which rows and columns need zeroing BEFORE you start zeroing — otherwise new zeros from your edits will trigger more rows/columns incorrectly.`,
  },

  approaches: {
    'Extra Copy': {
      intuition: `Make a full copy of the matrix. Scan the original to find all zero cells. For each zero found, zero out the corresponding row and column in the copy. Return the copy as the answer. Simple but uses O(m×n) extra space.`,
      steps: [
        `Create a deep copy of the matrix.`,
        `Scan every cell (i, j) of the original matrix.`,
        `If original[i][j] == 0:`,
        `  Zero out the entire row i in the copy.`,
        `  Zero out the entire column j in the copy.`,
        `Replace the matrix with the copy (or return the copy).`,
      ],
      example: `matrix = [[1,1,1],[1,0,1],[1,1,1]]\ncopy   = [[1,1,1],[1,0,1],[1,1,1]]\n\nFound zero at (1,1):\n  Zero row 1 in copy: [[1,1,1],[0,0,0],[1,1,1]]\n  Zero col 1 in copy: [[1,0,1],[0,0,0],[1,0,1]]\n\n✅ Answer: [[1,0,1],[0,0,0],[1,0,1]]`,
      keyInsight: `O(m×n) time, O(m×n) extra space for the copy. Simple and correct but uses too much memory. The next approaches reduce space to O(m+n) or O(1).`,
    },

    'Row & Column Sets': {
      intuition: `Instead of copying the entire matrix, just remember which rows and which columns need to be zeroed. Use two sets. First pass: find all zero cells and record their row and column indices. Second pass: for each cell, zero it if its row or column is in the sets.`,
      steps: [
        `Create a Set<Integer> zeroRows and Set<Integer> zeroCols.`,
        `First pass: scan all cells. If matrix[i][j] == 0, add i to zeroRows and j to zeroCols.`,
        `Second pass: scan all cells again. If row i is in zeroRows OR col j is in zeroCols: set matrix[i][j] = 0.`,
        `Done — the matrix is modified in-place.`,
      ],
      example: `matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]\n\nFirst pass:\n  (0,0)=0 → zeroRows={0}, zeroCols={0}\n  (0,3)=0 → zeroRows={0}, zeroCols={0,3}\n\nSecond pass:\n  row 0 → all zeros\n  col 0 → all zeros\n  col 3 → all zeros\n\n✅ Result: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]`,
      keyInsight: `O(m×n) time, O(m+n) space (two sets). Much better than a full matrix copy. This is the standard readable solution — clean two-pass approach with minimal bookkeeping.`,
    },

    'Boolean Arrays': {
      intuition: `Same idea as Row & Column Sets, but use two simple boolean arrays (zeroRow[m] and zeroCol[n]) instead of hash sets. Arrays are faster to access and index than sets. First pass marks which rows and columns contain a zero; second pass applies the zeroing.`,
      steps: [
        `Allocate boolean zeroRow[m] and zeroCol[n], both initialized to false.`,
        `First pass: for each (i,j), if matrix[i][j] == 0: set zeroRow[i]=true and zeroCol[j]=true.`,
        `Second pass: for each (i,j), if zeroRow[i] OR zeroCol[j]: set matrix[i][j]=0.`,
        `Done — in-place modification.`,
      ],
      example: `matrix = [[1,1,1],[1,0,1],[1,1,1]]\n\nFirst pass: (1,1)=0 → zeroRow[1]=true, zeroCol[1]=true\n\nSecond pass:\n  (0,1): zeroCol[1] → 0\n  (1,0),(1,1),(1,2): zeroRow[1] → all 0\n  (2,1): zeroCol[1] → 0\n\n✅ Result: [[1,0,1],[0,0,0],[1,0,1]]`,
      keyInsight: `O(m×n) time, O(m+n) space. Functionally identical to Row & Column Sets but using primitive boolean arrays — faster in practice and cleaner for languages where array indexing is more idiomatic than set operations.`,
    },

    'First Row/Col as Markers': {
      intuition: `Reuse the first row and first column of the matrix itself as markers — eliminating the need for any extra arrays. If matrix[i][j]==0, mark matrix[i][0]=0 and matrix[0][j]=0. But first, separately record whether the first row and first column themselves originally contain zeros (since they will be overwritten). Apply zeroing in reverse order to avoid corrupting the markers before they're used.`,
      steps: [
        `Check if the first row has any zero: set firstRowZero=true/false.`,
        `Check if the first column has any zero: set firstColZero=true/false.`,
        `First pass (rows 1..m-1, cols 1..n-1): if matrix[i][j]==0, set matrix[i][0]=0 and matrix[0][j]=0.`,
        `Second pass (rows 1..m-1, cols 1..n-1): if matrix[i][0]==0 OR matrix[0][j]==0, set matrix[i][j]=0.`,
        `If firstRowZero: zero out all of row 0. If firstColZero: zero out all of col 0.`,
      ],
      example: `matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]\n\nfirstRowZero=true (row 0 has zeros), firstColZero=true (col 0 has a zero)\n\nMark phase (inner cells): no additional inner zeros found\n\nApply markers: (already only row/col 0 markers)\nZero first row (firstRowZero): [0,0,0,0]\nZero first col (firstColZero): col 0 all zeros\n✅ Result: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]`,
      keyInsight: `O(m×n) time, O(1) extra space. The most space-efficient approach — markers are stored in the matrix itself. The tricky part is handling the first row/col separately to avoid false markers contaminating the second pass.`,
    },

    'Two-Pass Single Marker Variable': {
      intuition: `A variant of the First Row/Col as Markers approach, but uses an explicit single boolean variable to track whether the first column needs zeroing, reducing the bookkeeping to one variable plus the first-row markers. This makes the code slightly easier to read while retaining O(1) space.`,
      steps: [
        `Set firstCol = false. Scan column 0 for any zero: if found, firstCol=true.`,
        `First pass (all rows, cols 1..n-1): if matrix[i][j]==0, set matrix[i][0]=0 and matrix[0][j]=0.`,
        `Second pass (rows m-1..0, cols 1..n-1): if matrix[i][0]==0 OR matrix[0][j]==0, zero matrix[i][j].`,
        `  (Bottom-to-top order preserves the first-row markers for the inner cells.)`,
        `If matrix[0][0]==0: zero entire first row.`,
        `If firstCol: zero entire first column.`,
      ],
      example: `matrix = [[1,0,1],[1,1,1],[1,1,1]]\n\nfirstCol=false (col 0 has no zeros)\nFirst pass: (0,1)=0 → matrix[0][0]=0, matrix[0][1]=0\n\nSecond pass (bottom-to-top):\n  row 2: matrix[2][0]=1,matrix[0][1]=0 → (2,1)=0\n  row 1: similar → (1,1)=0\n  row 0 handled by matrix[0][0] step\n\nmatrix[0][0]=0 → zero row 0: [0,0,0]\nfirstCol=false → skip\n✅ Result: [[0,0,0],[1,0,1],[1,0,1]]`,
      keyInsight: `O(m×n) time, O(1) space. The bottom-to-top second pass is the key insight — it reads the first-row markers before they could be overwritten by zeroing row 0, eliminating the need for a separate firstRowZero variable.`,
    },
  },
}
