/**
 * Tutorial content for #056 — Longest Common Subsequence
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given two strings, find the length of their longest common subsequence (LCS). A subsequence is formed by deleting some characters from a string without changing the order of the remaining characters.`,
    example: `text1 = "abcde", text2 = "ace"\n→ Common subsequence: "ace"\n✅ Answer: 3`,
    keyInsight: `If the last characters match, they must be in the LCS: LCS(i,j) = 1 + LCS(i-1,j-1). If they don't match, the LCS comes from skipping one character from either string: LCS(i,j) = max(LCS(i-1,j), LCS(i,j-1)).`,
  },

  approaches: {
    '2D Bottom-Up DP': {
      intuition: `Build a 2D table dp[i][j] = length of LCS of text1[0..i-1] and text2[0..j-1]. Fill it row by row using the classic recurrence. The final answer is in the bottom-right cell.`,
      steps: [
        `Create dp[m+1][n+1] filled with 0 (0th row/column are base cases: empty string vs anything = 0).`,
        `For i from 1 to m, for j from 1 to n:`,
        `  If text1[i-1] == text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1.`,
        `  Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).`,
        `Return dp[m][n].`,
      ],
      example: `text1="abcde", text2="ace"\n\n    ""  a  c  e\n""   0  0  0  0\na    0  1  1  1\nb    0  1  1  1\nc    0  1  2  2\nd    0  1  2  2\ne    0  1  2  3\n\ndp[5][3] = 3\n✅ Answer: 3`,
      keyInsight: `O(m×n) time and space. The foundation for all LCS variants — easy to trace and understand.`,
    },

    'Recursive Memoization (Top-Down)': {
      intuition: `Solve recursively from the end of both strings. At each step, either the last characters match (take both and recurse inward) or they don't (try skipping the end of either string and take the better result). Cache each (i, j) pair to avoid repeated work.`,
      steps: [
        `Create a 2D memo table initialised to -1.`,
        `Base case: if i < 0 or j < 0, return 0.`,
        `If memo[i][j] != -1, return cached value.`,
        `If text1[i] == text2[j]: return 1 + solve(i-1, j-1).`,
        `Else: return max(solve(i-1, j), solve(i, j-1)).`,
        `Cache and return result.`,
      ],
      example: `text1="abcde", text2="ace"\n\nsolve(4,2): 'e'=='e' → 1+solve(3,1)\nsolve(3,1): 'd'!='c' → max(solve(2,1), solve(3,0))\nsolve(2,1): 'c'=='c' → 1+solve(1,0)\nsolve(1,0): 'b'!='a' → max(solve(0,0), solve(1,-1))\nsolve(0,0): 'a'=='a' → 1+solve(-1,-1) = 1\nsolve(1,0) = 1, solve(2,1)=2, solve(3,1)=2\nsolve(4,2) = 1+2 = 3\n✅ Answer: 3`,
      keyInsight: `O(m×n) time and space — same as the bottom-up table. Top-down is sometimes more natural when the recurrence feels recursive.`,
    },

    'Space-Optimized DP (two rows)': {
      intuition: `The 2D DP only ever reads the current row and the row above it. So we can keep just two 1D arrays — prev and curr — and alternate between them, cutting space from O(m×n) to O(n).`,
      steps: [
        `Create two arrays prev[n+1] and curr[n+1], both filled with 0.`,
        `For each row i (character of text1):`,
        `  For each column j (character of text2):`,
        `    If text1[i-1]==text2[j-1]: curr[j] = prev[j-1] + 1.`,
        `    Else: curr[j] = max(prev[j], curr[j-1]).`,
        `  Copy curr into prev.`,
        `Return prev[n].`,
      ],
      example: `text1="abcde", text2="ace"\n\nAfter row 'a': prev=[0,1,1,1]\nAfter row 'b': prev=[0,1,1,1]\nAfter row 'c': prev=[0,1,2,2]\nAfter row 'd': prev=[0,1,2,2]\nAfter row 'e': prev=[0,1,2,3]\nReturn 3\n✅ Answer: 3`,
      keyInsight: `O(m×n) time, O(n) space. Use when one string is long and memory matters; the two-row swap is a common DP space reduction pattern.`,
    },

    'Single-Array Space-Optimized DP': {
      intuition: `We can reduce to a single 1D array by processing carefully. The only tricky part is that dp[j-1] gets overwritten before we can use it as the "diagonal" (dp[i-1][j-1]). Save the diagonal value in a temp variable before overwriting.`,
      steps: [
        `Create dp[n+1] filled with 0.`,
        `For each character in text1:`,
        `  prev = 0 (saves the diagonal — dp[i-1][j-1]).`,
        `  For j from 1 to n:`,
        `    temp = dp[j]  (will become the new diagonal next iteration)`,
        `    If text1[i-1]==text2[j-1]: dp[j] = prev + 1.`,
        `    Else: dp[j] = max(dp[j], dp[j-1]).`,
        `    prev = temp.`,
        `Return dp[n].`,
      ],
      example: `text1="abcde", text2="ace"\n\nInitial dp=[0,0,0,0]\nRow 'a': prev=0; j=1('a'=='a'):dp[1]=0+1=1; j=2:dp[2]=max(0,1)=1; j=3:dp[3]=1\n→ dp=[0,1,1,1]\n... (each row as before) ...\nFinal dp=[0,1,2,3]\nReturn 3\n✅ Answer: 3`,
      keyInsight: `O(m×n) time, O(n) space with only a single array allocated. The "prev diagonal" trick is worth memorising for any 2D DP space optimisation.`,
    },

    'LCS with Path Reconstruction': {
      intuition: `Same 2D DP but additionally store a direction table (UP, LEFT, or DIAGONAL) at each cell. After filling the table, trace back from dp[m][n] following the arrows to reconstruct the actual LCS string, not just its length.`,
      steps: [
        `Fill dp[m+1][n+1] as in 2D Bottom-Up DP.`,
        `At each cell, record direction: DIAG if chars matched, UP or LEFT otherwise (whichever was larger).`,
        `Trace back from (m, n): if DIAG, prepend the matching character; if UP or LEFT, follow the arrow.`,
        `The collected characters form the LCS.`,
        `Return the length (or the string itself).`,
      ],
      example: `text1="abcde", text2="ace"\n\nTracing from dp[5][3]:\n(5,3) DIAG → 'e', go to (4,2)\n(4,2) UP → go to (3,2)\n(3,2) DIAG → 'c', go to (2,1)\n(2,1) UP → go to (1,1)\n(1,1) DIAG → 'a', go to (0,0)\nLCS = "ace"\n✅ Answer: 3 (LCS = "ace")`,
      keyInsight: `O(m×n) time and space. The path reconstruction is essential for problems that need the actual common subsequence, not just the count.`,
    },

    'getLCS length (wraps getLCS)': {
      intuition: `A thin wrapper that calls the full LCS reconstruction helper and simply returns the length of the resulting string. It demonstrates how to reuse the reconstruction logic when you only need the numeric answer, avoiding code duplication.`,
      steps: [
        `Call getLCS(text1, text2) which performs full reconstruction.`,
        `Return the length of the returned LCS string.`,
      ],
      example: `text1="abcde", text2="ace"\n\ngetLCS("abcde","ace") → "ace"\nReturn "ace".length() = 3\n✅ Answer: 3`,
      keyInsight: `O(m×n) time and space — no performance difference from full reconstruction. This approach is about code organisation: expose a simple integer API backed by the heavier reconstruction logic.`,
    },
  },
}
