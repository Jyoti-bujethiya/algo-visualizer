/**
 * Tutorial content for #072 — Palindrome Partitioning
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a string, partition it such that every substring in the partition is a palindrome. Return all possible palindrome partitions.`,
    example: `s = "aab"\n→ ["a","a","b"] and ["aa","b"]\n✅ Answer: [["a","a","b"],["aa","b"]]`,
    keyInsight: `At each position, try every suffix of the remaining string. If that suffix is a palindrome, add it to the current partition and recurse on the rest. A precomputed palindrome table turns the "is it a palindrome?" check from O(n) to O(1).`,
  },

  approaches: {
    'Backtracking with Palindrome Check': {
      intuition: `Use backtracking: from a start index, try every end index. Check if s[start..end] is a palindrome by scanning both ends inward. If it is, add that substring to the current partition and recurse from end+1. When start reaches the end of the string, the current partition is complete.`,
      steps: [
        `Backtrack(start, current):`,
        `  If start == s.length(): add copy of current; return.`,
        `  For end from start to s.length()-1:`,
        `    If isPalindrome(s, start, end):`,
        `      Add s[start..end] to current, recurse(end+1), remove last.`,
      ],
      example: `s = "aab"\n\nstart=0:\n  end=0 ("a" palindrome): [a]\n    start=1:\n      end=1 ("a"): [a,a]\n        start=2: end=2 ("b"): [a,a,b] → ADD ✓\n      end=2 ("ab" not palindrome): skip\n  end=1 ("aa" palindrome): [aa]\n    start=2: end=2 ("b"): [aa,b] → ADD ✓\n  end=2 ("aab" not palindrome): skip\n✅ Answer: [["a","a","b"],["aa","b"]]`,
      keyInsight: `O(n × 2ⁿ) time — palindrome check is O(n) and there are up to 2ⁿ⁻¹ partitions. Simple and correct; the DP table version is faster.`,
    },

    'Backtracking with DP Palindrome Table': {
      intuition: `Precompute a 2D boolean table dp[i][j] = "is s[i..j] a palindrome?" in O(n²) time. Then run the same backtracking as above, but replace every isPalindrome() call with an O(1) table lookup. This eliminates redundant character comparisons.`,
      steps: [
        `Precompute isPalin[i][j] for all pairs using DP: single chars and two equal chars are base cases; dp[i][j] = s[i]==s[j] AND dp[i+1][j-1].`,
        `Backtrack(start, current):`,
        `  If start == n: add copy; return.`,
        `  For end from start to n-1:`,
        `    If isPalin[start][end]: add s[start..end], recurse(end+1), remove last.`,
      ],
      example: `s = "aab"\nPalin table:\n  isPalin[0][0]=T, isPalin[1][1]=T, isPalin[2][2]=T\n  isPalin[0][1]=T ("aa"), isPalin[1][2]=F ("ab"), isPalin[0][2]=F ("aab")\n\nBacktracking now does O(1) lookups:\n→ same partitions found: [["a","a","b"],["aa","b"]]\n✅ Answer: [["a","a","b"],["aa","b"]]`,
      keyInsight: `O(n² + 2ⁿ × n) time, O(n²) space for the table. The upfront O(n²) investment makes each palindrome check O(1) — a big win when the string is long.`,
    },

    'Backtracking with Memoised Palindrome Check': {
      intuition: `Instead of a full precomputed table, use a memo map that caches palindrome check results on demand. Only substrings that are actually queried get cached. This is lazier than precomputing the full table but avoids computing palindrome results for substrings never visited.`,
      steps: [
        `Create a memo map from (i,j) → boolean.`,
        `isPalin(i,j): if i>=j return true; check memo; else s[i]==s[j] AND isPalin(i+1,j-1); cache and return.`,
        `Backtrack as before, calling the memoised isPalin.`,
      ],
      example: `s = "aab"\n\nisPalin(0,1): s[0]='a'==s[1]='a' AND isPalin(1,0) → T; cache (0,1)=T\nisPalin(1,2): s[1]='a'≠s[2]='b' → F; cache (1,2)=F\n\nBacktracking uses memo:\n→ [["a","a","b"],["aa","b"]]\n✅ Answer: [["a","a","b"],["aa","b"]]`,
      keyInsight: `O(n² + 2ⁿ × n) time worst case, O(n²) space. Lazy memoisation vs eager precomputation — same asymptotic complexity, but lazy avoids computing answers for unvisited substrings.`,
    },

    'Iterative DP': {
      intuition: `Build the answer bottom-up. dp[i] = list of all palindrome partitions for s[0..i-1]. For each end index i, scan every start index j. If s[j..i-1] is a palindrome, extend every partition in dp[j] by appending s[j..i-1].`,
      steps: [
        `Precompute the palindrome table.`,
        `Create dp[n+1]; dp[0] = [[]] (one empty partition).`,
        `For i from 1 to n:`,
        `  For j from 0 to i-1:`,
        `    If isPalin[j][i-1]: for each part in dp[j]: dp[i] += part + [s[j..i-1]].`,
        `Return dp[n].`,
      ],
      example: `s = "aab"\n\ndp[0]=[[]]\ndp[1]: j=0, "a" isPalin → dp[1]=[["a"]]\ndp[2]: j=0, "aa" isPalin → [["aa"]]; j=1, "a" isPalin → [["a","a"]]\ndp[2]=[["aa"],["a","a"]]\ndp[3]: j=0, "aab" not palindrome; j=1, "ab" not; j=2, "b" is → extend dp[2]\ndp[3]=[["aa","b"],["a","a","b"]]\n✅ Answer: [["aa","b"],["a","a","b"]]`,
      keyInsight: `O(n² × 2ⁿ) time — building up partitions iteratively. More complex to implement than backtracking and uses more memory (stores all partial results), but avoids recursion.`,
    },

    'Standard (entry point — DP table backtracking)': {
      intuition: `The public entry point that precomputes the full palindrome DP table once, then launches the backtracking search. Combining precomputation and backtracking gives the best of both worlds: O(1) palindrome lookups inside a clean recursive search.`,
      steps: [
        `Precompute isPalin[n][n] table.`,
        `Initialise results list.`,
        `Call backtrack(0, [], results, isPalin).`,
        `Return results.`,
      ],
      example: `s = "aab"\nPrecompute palindrome table (O(n²))\nLaunch backtracking with O(1) lookups\n→ [["a","a","b"],["aa","b"]]\n✅ Answer: [["a","a","b"],["aa","b"]]`,
      keyInsight: `O(n² + 2ⁿ × n) time, O(n²) space. The standard optimal solution: precompute once, use many times. This is what you'd implement in an interview.`,
    },
  },
}
