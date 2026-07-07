/**
 * Tutorial content for #065 — Regular Expression Matching
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Implement regular expression matching where '.' matches any single character and '*' matches zero or more of the preceding element. The match must cover the entire string s.`,
    example: `s = "aa", p = "a*"\n→ "a*" means "zero or more a's" → matches "aa"\n✅ Answer: true`,
    keyInsight: `The '*' is the tricky part. When you see '*', look at the character before it (call it c). You can either skip the "c*" pattern entirely (zero uses) or match one c and keep the pattern (one or more uses). Handle '.' as matching anything.`,
  },

  approaches: {
    'Recursive (no memoization)': {
      intuition: `Pure recursion to show the structure before optimisation. At each step, if p[1]=='*', try using zero c's (skip c*) or one c followed by more (if s[0] matches c). Otherwise, match single characters and recurse.`,
      steps: [
        `Base case: if pattern is empty, return s is empty.`,
        `First char matches = (p is non-empty) and (p[0]=='.' or p[0]==s[0]).`,
        `If p.length >= 2 and p[1] == '*':`,
        `  return isMatch(s, p.substring(2))  ← zero uses of c*`,
        `       OR (firstCharMatches AND isMatch(s.substring(1), p)).  ← one use`,
        `Else: return firstCharMatches AND isMatch(s.substring(1), p.substring(1)).`,
      ],
      example: `s="aa", p="a*"\n\nisMatch("aa","a*"):\n  p[1]='*' → try zero: isMatch("aa","") → false\n           try one:  'a'=='a' AND isMatch("a","a*")\nisMatch("a","a*"):\n  try zero: isMatch("a","") → false\n  try one:  'a'=='a' AND isMatch("","a*")\nisMatch("","a*"):\n  try zero: isMatch("","") → true ✅\n✅ Answer: true`,
      keyInsight: `O(2^(s+p)) worst case. Never use without memoisation — shown only to understand the recurrence.`,
    },

    'Memoization (Top-Down)': {
      intuition: `Same recursive logic, but cache each (i, j) pair — i = position in s, j = position in p. Many sub-problems repeat (especially with patterns like "a*a*a*"), so memoisation cuts exponential to polynomial time.`,
      steps: [
        `Create memo[m+1][n+1] filled with -1.`,
        `Base case: if j == n, return i == m.`,
        `First-char-matches: i < m and (p[j]=='.' or p[j]==s[i]).`,
        `If j+1 < n and p[j+1]=='*':`,
        `  memo[i][j] = solve(i,j+2) OR (firstMatch AND solve(i+1,j)).`,
        `Else: memo[i][j] = firstMatch AND solve(i+1,j+1).`,
        `Return memo[i][j].`,
      ],
      example: `s="aa", p="a*"\n\nsolve(0,0): p[1]='*' → solve(0,2) OR ('a'=='a' AND solve(1,0))\nsolve(0,2): j=2==n=2, i=0≠m=2 → false\nsolve(1,0): p[1]='*' → solve(1,2) OR ('a'=='a' AND solve(2,0))\nsolve(1,2): false\nsolve(2,0): j=2==n, i=2==m → true ✅\n✅ Answer: true`,
      keyInsight: `O(m×n) time and space. Each (i,j) pair is computed exactly once — the standard solution for this problem.`,
    },

    '2D Bottom-Up DP (string-prefix prefix)': {
      intuition: `Build a 2D table dp[i][j] = "does s[0..i-1] match p[0..j-1]?". Fill from the base case dp[0][0]=true outward. The '*' case sets dp[i][j] based on either zero uses (dp[i][j-2]) or one+ uses (dp[i-1][j] if chars match).`,
      steps: [
        `Create dp[m+1][n+1]; dp[0][0] = true.`,
        `Fill dp[0][j]: patterns like "a*", "a*b*" can match empty s.`,
        `  If p[j-1]=='*': dp[0][j] = dp[0][j-2].`,
        `For i from 1 to m, j from 1 to n:`,
        `  If p[j-1]=='*': dp[i][j] = dp[i][j-2]  (zero uses)`,
        `    OR (p[j-2]=='.' or p[j-2]==s[i-1]) AND dp[i-1][j].  (one+ uses)`,
        `  Else if p[j-1]=='.' or p[j-1]==s[i-1]: dp[i][j] = dp[i-1][j-1].`,
        `Return dp[m][n].`,
      ],
      example: `s="aa", p="a*"\n\n    ""  a  *\n""   T  F  T\na    F  T  T\na    F  F  T\n\ndp[2][2] = true\n✅ Answer: true`,
      keyInsight: `O(m×n) time and space. Bottom-up avoids recursion overhead and is easy to trace with the table.`,
    },

    'Space-Optimized DP (1-D rolling array)': {
      intuition: `dp[i][j] only needs the previous row (dp[i-1][...]) and the current row (dp[i][...]). Replace the 2D table with two 1D arrays. Process row by row, swapping after each.`,
      steps: [
        `Create prev[n+1] and curr[n+1]; initialise prev for the empty-string row.`,
        `For i from 1 to m:`,
        `  curr[0] = false.`,
        `  For j from 1 to n:`,
        `    Fill curr[j] using same logic as 2D DP, reading prev for dp[i-1][...] values.`,
        `  Swap prev and curr.`,
        `Return prev[n].`,
      ],
      example: `s="aa", p="a*"\n\nprev=[T,F,T]  (empty string vs patterns)\nRow 'a' (i=1):\n  j=1 ('a'): 'a'=='a' → curr[1]=prev[0]=T\n  j=2 ('*'): zero uses → curr[2]=curr[0]=F; one use: 'a'=='a' AND prev[2]=T → curr[2]=T\nprev=[F,T,T]\nRow 'a' (i=2): same logic → prev=[F,F,T]\nReturn prev[2]=true\n✅ Answer: true`,
      keyInsight: `O(m×n) time, O(n) space. Use this when the string lengths are large and 2D memory is a concern.`,
    },
  },
}
