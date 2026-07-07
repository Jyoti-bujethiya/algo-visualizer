/**
 * Tutorial content for #062 — Edit Distance
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given two strings, find the minimum number of operations (insert a character, delete a character, or replace a character) needed to convert the first string into the second. This is called the Levenshtein distance.`,
    example: `word1 = "horse", word2 = "ros"\n→ horse → rorse (replace 'h' with 'r')\n→ rorse → rose  (delete 'r')\n→ rose  → ros   (delete 'e')\n✅ Answer: 3`,
    keyInsight: `If the last characters match, no operation needed for them: dp[i][j] = dp[i-1][j-1]. If they differ: dp[i][j] = 1 + min(delete=dp[i-1][j], insert=dp[i][j-1], replace=dp[i-1][j-1]).`,
  },

  approaches: {
    '2D Bottom-Up DP': {
      intuition: `Build a 2D table dp[i][j] = minimum edits to convert word1[0..i-1] into word2[0..j-1]. The first row/column represent converting to/from an empty string (just insertions or deletions). Fill the rest with the classic three-way recurrence.`,
      steps: [
        `Create dp[m+1][n+1]; dp[i][0]=i (delete all), dp[0][j]=j (insert all).`,
        `For i from 1 to m, for j from 1 to n:`,
        `  If word1[i-1]==word2[j-1]: dp[i][j] = dp[i-1][j-1] (no cost).`,
        `  Else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).`,
        `Return dp[m][n].`,
      ],
      example: `word1="horse", word2="ros"\n\n    ""  r  o  s\n""   0  1  2  3\nh    1  1  2  3\no    2  2  1  2\nr    3  2  2  2\ns    4  3  3  2\ne    5  4  4  3\n\ndp[5][3] = 3\n✅ Answer: 3`,
      keyInsight: `O(m×n) time and space. The classic and most readable solution — standard in every algorithms textbook.`,
    },

    'Recursive Memoization (Top-Down)': {
      intuition: `Solve recursively from the end of both strings. If last characters match, recurse inward with no cost. If not, try all three operations, recurse, and take the minimum. Memo caches (i, j) pairs to avoid exponential blowup.`,
      steps: [
        `Create memo[m+1][n+1] filled with -1.`,
        `Base cases: i==0 → return j; j==0 → return i (insert/delete all remaining).`,
        `If memo[i][j] != -1, return it.`,
        `If word1[i-1]==word2[j-1]: memo[i][j] = solve(i-1, j-1).`,
        `Else: memo[i][j] = 1 + min(solve(i-1,j), solve(i,j-1), solve(i-1,j-1)).`,
        `Return memo[i][j].`,
      ],
      example: `word1="horse", word2="ros"\n\nsolve(5,3): 'e'!='s' → 1+min(solve(4,3), solve(5,2), solve(4,2))\nsolve(4,3): 's'=='s' → solve(3,2)\nsolve(3,2): 'r'=='r' → solve(2,1)\nsolve(2,1): 'o'=='o' → solve(1,0)=1\nsolve(3,2)=1, solve(4,3)=1... eventually solve(5,3)=3\n✅ Answer: 3`,
      keyInsight: `O(m×n) time and space. Top-down is often easier to reason about since it follows the natural recursive definition.`,
    },

    'Space-Optimized DP (two rows)': {
      intuition: `dp[i][j] only depends on the current row and the row above. Replace the 2D table with two 1D arrays — prev and curr. Process row by row, swapping after each row.`,
      steps: [
        `Create prev[n+1] (base: prev[j]=j) and curr[n+1].`,
        `For i from 1 to m:`,
        `  curr[0] = i.`,
        `  For j from 1 to n:`,
        `    If word1[i-1]==word2[j-1]: curr[j]=prev[j-1].`,
        `    Else: curr[j]=1+min(prev[j], curr[j-1], prev[j-1]).`,
        `  Swap prev and curr.`,
        `Return prev[n].`,
      ],
      example: `word1="horse", word2="ros"\n\nprev=[0,1,2,3]\nRow 'h': curr=[1,1,2,3] → prev=[1,1,2,3]\nRow 'o': curr=[2,2,1,2] → prev=[2,2,1,2]\nRow 'r': curr=[3,2,2,2] → prev=[3,2,2,2]\nRow 's': curr=[4,3,3,2] → prev=[4,3,3,2]\nRow 'e': curr=[5,4,4,3] → return 3\n✅ Answer: 3`,
      keyInsight: `O(m×n) time, O(n) space. The two-row swap is a standard technique for reducing 2D DP to linear space.`,
    },

    'Single-Array Space-Optimized DP': {
      intuition: `Go further — use only one array. The key challenge: dp[i][j] needs dp[i-1][j-1] (the diagonal), but when we update dp[j] in place the old dp[j] is above and dp[j-1] is already updated. Save the diagonal in a temp variable before overwriting.`,
      steps: [
        `Create dp[n+1]; dp[j] = j for all j (base row).`,
        `For i from 1 to m:`,
        `  prev = dp[0]; dp[0] = i.`,
        `  For j from 1 to n:`,
        `    temp = dp[j].  ← save diagonal before overwrite`,
        `    If word1[i-1]==word2[j-1]: dp[j] = prev.`,
        `    Else: dp[j] = 1 + min(prev, dp[j], dp[j-1]).`,
        `    prev = temp.  ← the saved value becomes diagonal for next j`,
        `Return dp[n].`,
      ],
      example: `word1="horse", word2="ros"\n\ndp=[0,1,2,3]\nRow 'h' (i=1): dp[0]=1\n  j=1: prev=0,temp=dp[1]=1; 'h'!='r' → dp[1]=1+min(0,1,1)=1; prev=1\n  j=2: prev=1,temp=2; 'h'!='o' → dp[2]=1+min(1,2,1)=2; prev=2\n  j=3: prev=2,temp=3; 'h'!='s' → dp[3]=1+min(2,3,2)=3; prev=3\n... (continue for each row) ... final dp=[5,4,4,3], return 3\n✅ Answer: 3`,
      keyInsight: `O(m×n) time, O(n) space with only a single array. The "prev diagonal" pattern appears in many 2D DP space optimisations.`,
    },

    'Pure Recursive (no memo)': {
      intuition: `Plain recursion with no caching — purely to illustrate the recurrence. At every step, try all three operations (or no-op if characters match) and return the minimum depth. This is exponentially slow but shows the structure clearly.`,
      steps: [
        `Base cases: i==0 → return j; j==0 → return i.`,
        `If word1[i-1]==word2[j-1]: return solve(i-1, j-1).`,
        `Else: return 1 + min(solve(i-1,j), solve(i,j-1), solve(i-1,j-1)).`,
      ],
      example: `word1="horse", word2="ros"\n\nEach call branches into up to 3 sub-calls.\nExponential — only practical for very short strings.\nCorrect result: 3\n✅ Answer: 3 (but very slow)`,
      keyInsight: `O(3^(m+n)) time, O(m+n) stack space. Never use this in practice — it's purely pedagogical to show the recurrence before optimisation.`,
    },
  },
}
