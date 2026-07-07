/**
 * Tutorial content for #060 — Unique Paths
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `A robot is on an m×n grid at the top-left corner. It can only move right or down. How many unique paths are there to reach the bottom-right corner?`,
    example: `m = 3, n = 7\n→ 28 distinct paths from top-left to bottom-right\n✅ Answer: 28`,
    keyInsight: `Each cell can only be reached from the cell above or from the cell to the left. So paths[i][j] = paths[i-1][j] + paths[i][j-1]. The first row and first column all have exactly 1 path.`,
  },

  approaches: {
    '2D DP': {
      intuition: `Create a full 2D grid where dp[i][j] is the number of ways to reach row i, column j. Every cell in the first row and first column has exactly 1 path (you can only travel right or down respectively). Fill the rest using the sum of the cell above and the cell to the left.`,
      steps: [
        `Create dp[m][n] filled with 1 (first row and first column stay 1).`,
        `For i from 1 to m-1:`,
        `  For j from 1 to n-1:`,
        `    dp[i][j] = dp[i-1][j] + dp[i][j-1].`,
        `Return dp[m-1][n-1].`,
      ],
      example: `m=3, n=3 (simpler example)\n\n1  1  1\n1  2  3\n1  3  6\n\ndp[2][2] = 6\n✅ Answer (m=3,n=7): 28`,
      keyInsight: `O(m×n) time and space. The most visual approach — filling in the table lets you see the path counts grow.`,
    },

    'Space-Optimized DP (single row)': {
      intuition: `dp[i][j] only needs the row above it and the cell to its left. Process row by row with a single 1D array. When we update dp[j] in place, the old dp[j] is the value from the row above, and dp[j-1] is already the updated left neighbour.`,
      steps: [
        `Create dp[n] filled with 1.`,
        `For each row i from 1 to m-1:`,
        `  For each column j from 1 to n-1:`,
        `    dp[j] += dp[j-1].  (dp[j] was row-above; dp[j-1] is left neighbour)`,
        `Return dp[n-1].`,
      ],
      example: `m=3, n=3\n\nStart: dp=[1,1,1]\nRow 1: j=1→dp[1]=1+1=2; j=2→dp[2]=1+2=3 → dp=[1,2,3]\nRow 2: j=1→dp[1]=2+1=3; j=2→dp[2]=3+3=6 → dp=[1,3,6]\nReturn dp[2]=6\n✅ Answer (m=3,n=7): 28`,
      keyInsight: `O(m×n) time, O(n) space. The in-place row update is a classic 2D → 1D DP space reduction.`,
    },

    'Combinatorics (Math)': {
      intuition: `To travel from (0,0) to (m-1, n-1) you always make exactly (m-1) down moves and (n-1) right moves — a total of (m+n-2) moves. The number of ways to arrange these moves is a binomial coefficient: C(m+n-2, m-1).`,
      steps: [
        `Total moves = (m-1) + (n-1) = m+n-2.`,
        `Choose which (m-1) of those moves are "down": C(m+n-2, m-1).`,
        `Compute using: numerator = (m+n-2)! / (m-1)!, denominator = (n-1)!`,
        `Or iteratively: result = 1; for i in 0..min(m,n)-2: result = result * (m+n-2-i) / (i+1).`,
        `Return the integer result.`,
      ],
      example: `m=3, n=7\nTotal moves = 8; choose 2 down moves from 8.\nC(8,2) = 8! / (2! × 6!) = (8×7) / (2×1) = 28\n✅ Answer: 28`,
      keyInsight: `O(min(m,n)) time, O(1) space. The fastest solution by far — no grid needed, just arithmetic.`,
    },

    'Recursive Memoization': {
      intuition: `From any cell, count paths recursively: paths(i,j) = paths(i-1,j) + paths(i,j-1). Base cases: cells in row 0 or column 0 have exactly 1 path. Cache each (i,j) pair to avoid exponential re-computation.`,
      steps: [
        `Create a memo map (or 2D array) of size m×n, filled with -1.`,
        `If i==0 or j==0, return 1.`,
        `If memo[i][j] != -1, return it.`,
        `memo[i][j] = solve(i-1, j) + solve(i, j-1).`,
        `Return memo[m-1][n-1].`,
      ],
      example: `m=3, n=3\n\nsolve(2,2) = solve(1,2) + solve(2,1)\nsolve(1,2) = solve(0,2) + solve(1,1) = 1 + 2 = 3\nsolve(2,1) = solve(1,1) + solve(2,0) = 2 + 1 = 3\nsolve(2,2) = 3 + 3 = 6\n✅ Answer (m=3,n=7): 28`,
      keyInsight: `O(m×n) time and space. Top-down memoisation is clean but recursion adds stack overhead; prefer iterative for large grids.`,
    },

    'Two-Row DP': {
      intuition: `Instead of a single rolling row, explicitly maintain two rows — "prev" (the row above) and "curr" (the current row being filled). This makes it very clear which values are coming from above vs from the left.`,
      steps: [
        `Create prev[n] and curr[n], both filled with 1.`,
        `For each row i from 1 to m-1:`,
        `  curr[0] = 1 (leftmost cell always has 1 path).`,
        `  For j from 1 to n-1: curr[j] = prev[j] + curr[j-1].`,
        `  Swap prev and curr.`,
        `Return prev[n-1].`,
      ],
      example: `m=3, n=3\n\nprev=[1,1,1], curr=[1,1,1]\nRow 1: curr=[1,2,3]; swap → prev=[1,2,3]\nRow 2: curr=[1,3,6]; swap → prev=[1,3,6]\nReturn prev[2]=6\n✅ Answer (m=3,n=7): 28`,
      keyInsight: `O(m×n) time, O(n) space. Slightly clearer than the single-row approach at the cost of one extra array allocation.`,
    },
  },
}
