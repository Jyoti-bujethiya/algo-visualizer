/**
 * Tutorial content for #014 — Longest Palindromic Substring
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a string, find the longest substring that reads the same forwards and backwards (a palindrome). Return that substring.`,
    example: `s = "babad"\n→ "bab" is a palindrome of length 3\n→ "aba" is also valid (same length)\n✅ Answer: "bab" (or "aba")`,
    keyInsight: `Every palindrome expands outward from a center. There are 2n-1 possible centers (each character, and each gap between characters). Expand around each center and track the longest result.`,
  },

  approaches: {
    'Brute Force': {
      intuition: `Try every possible substring by checking all pairs of start and end indices. For each substring, check if it's a palindrome by comparing characters from both ends moving inward. Keep track of the longest palindrome found.`,
      steps: [
        `Initialize bestStart=0, bestLen=1.`,
        `Outer loop i from 0 to n-1 (start index).`,
        `Inner loop j from i to n-1 (end index).`,
        `Check if s[i..j] is a palindrome using a two-pointer check.`,
        `If it is and length (j-i+1) > bestLen: update bestStart=i, bestLen=j-i+1.`,
        `Return s[bestStart..bestStart+bestLen-1].`,
      ],
      example: `s = "babad"\n\n"b" → palindrome len=1\n"ba" → not palindrome\n"bab" → palindrome len=3 ← new best\n"baba" → not palindrome\n"babad" → not palindrome\n"a" → palindrome\n"ab" → not\n"aba" → palindrome len=3 (tie)\n...\n✅ Answer: "bab"`,
      keyInsight: `O(n³) time (O(n²) pairs × O(n) palindrome check), O(1) space. Simple to code but impractical for strings longer than a few hundred characters.`,
    },

    'Expand Around Center': {
      intuition: `Every palindrome has a center. For odd-length palindromes the center is a single character; for even-length palindromes it's a gap between two characters. Try all 2n-1 possible centers and expand outward as long as the characters on both sides match. Track the longest expansion found.`,
      steps: [
        `Initialize bestStart=0, bestLen=1.`,
        `For each index i from 0 to n-1:`,
        `  Expand around i for odd-length (left=i, right=i).`,
        `  Expand around i,i+1 for even-length (left=i, right=i+1).`,
        `  In each expansion: while left >= 0 AND right < n AND s[left]==s[right]: left--, right++.`,
        `  Palindrome length = right - left - 1. Update best if longer.`,
        `Return best substring.`,
      ],
      example: `s = "babad"\n\nCenter at i=0('b'): b → len=1\nCenter at i=1('a'): bab → len=3 ← best!\n  (expand: left=1,right=1 → s[0]='b'=s[2]='b' → expand → s[-1] out of bounds → stop)\nCenter at i=2('b'): aba → len=3 (tie)\nCenter at i=3('a'): a → len=1\nCenter at gap 0-1: s[0]='b'≠s[1]='a' → len=0\n...\n✅ Answer: "bab"`,
      keyInsight: `O(n²) time, O(1) space. Much faster than brute force — the center-expansion intuition is the key insight that turns an O(n³) problem into O(n²). The gold-standard readable solution.`,
    },

    'Dynamic Programming': {
      intuition: `Build a 2D table where dp[i][j] = true if the substring s[i..j] is a palindrome. A substring is a palindrome if its outer characters match AND the inner substring is also a palindrome (dp[i+1][j-1] is true). Fill the table from shorter substrings to longer ones.`,
      steps: [
        `Create a boolean dp[n][n] table, all false.`,
        `All single characters are palindromes: set dp[i][i] = true for all i.`,
        `All adjacent equal characters are palindromes: set dp[i][i+1] = true when s[i] == s[i+1].`,
        `Fill for lengths 3 to n: dp[i][j] = (s[i] == s[j]) AND dp[i+1][j-1].`,
        `Track the longest dp[i][j] = true during filling.`,
        `Return the corresponding substring.`,
      ],
      example: `s = "babad"\n\nLength 1: dp[0][0]=dp[1][1]=dp[2][2]=dp[3][3]=dp[4][4]=true\nLength 2: s[0]s[1]='b','a'→false; s[1]s[2]='a','b'→false; s[2]s[3]='b','a'→false; s[3]s[4]='a','d'→false\nLength 3:\n  dp[0][2]: s[0]='b'==s[2]='b' AND dp[1][1]=true → true! len=3, best="bab"\n  dp[1][3]: s[1]='a'==s[3]='a' AND dp[2][2]=true → true! len=3 (tie)\n  dp[2][4]: s[2]='b'≠s[4]='d' → false\n✅ Answer: "bab"`,
      keyInsight: `O(n²) time, O(n²) space. Fills a table systematically — great if you need all palindromic substrings, not just the longest. The space overhead is the main downside versus Expand Around Center.`,
    },

    "Manacher's Algorithm": {
      intuition: `Transform the string by inserting separator characters (e.g., '#') between every character and at both ends — this unifies odd and even-length palindromes. Then scan left to right, maintaining a "rightmost palindrome boundary" and a center. For each position, mirror the known palindrome radius from the left side to skip redundant comparisons, then expand further if possible.`,
      steps: [
        `Transform s into t: "#a#b#a#b#a#d#" style (insert '#' between chars and at ends).`,
        `Initialize p[] (radius array), center c=0, rightBoundary r=0.`,
        `For each i in t: mirror = 2*c - i.`,
        `  If i < r: p[i] = min(r - i, p[mirror]) (reuse mirror's radius).`,
        `  Try to expand: while t[i+p[i]+1] == t[i-p[i]-1]: p[i]++.`,
        `  If i + p[i] > r: update c=i, r=i+p[i].`,
        `The longest palindrome in s has radius max(p[i]) and center i — convert back to original indices.`,
      ],
      example: `s = "babad"\nt = "#b#a#b#a#d#"\n\np[0]('#')=0, p[1]('b')=1 (expands to #b#)\np[2]('#')=0, p[3]('a')=1 → try expand: t[1]='b'==t[5]='b' → p[3]=2 → "bab" len=3!\np[5]('b')=1 → try expand: t[3]='a'==t[7]='a' → p[5]=2 → "aba" len=3 (tie)\n...\nmaxRadius=2 at center 3 → original palindrome "bab"\n✅ Answer: "bab"`,
      keyInsight: `O(n) time, O(n) space — the only linear algorithm for this problem. Each position's radius is set at most twice (once from mirror, once from expansion). Impressive but complex; worth knowing for advanced interviews.`,
    },

    'DP Space Optimized': {
      intuition: `The 2D DP table fills diagonally — each cell dp[i][j] only depends on dp[i+1][j-1] from the previous diagonal. Instead of storing the full n×n table, process each length from 1 up to n and use only two 1D arrays (current and previous diagonal) to save memory.`,
      steps: [
        `Initialize bestStart=0, bestLen=1. Use a boolean dp[n][n] table but process diagonally.`,
        `Set dp[i][i]=true for all i (length 1). Check all length-2 pairs for equals.`,
        `For length L from 3 to n: for each start i, end j=i+L-1:`,
        `  dp[i][j] = (s[i]==s[j]) && dp[i+1][j-1].`,
        `  If true and L > bestLen: update bestStart=i, bestLen=L.`,
        `Return s.substring(bestStart, bestStart+bestLen).`,
      ],
      example: `s = "cbbd"\n\nLength 1: all true (c,b,b,d)\nLength 2: dp[0][1]='c'≠'b'→false; dp[1][2]='b'=='b'→true! bestLen=2,bestStart=1\n          dp[2][3]='b'≠'d'→false\nLength 3: dp[0][2]='c'≠'b'→false; dp[1][3]='b'≠'d'→false\nLength 4: dp[0][3]='c'≠'d'→false\nbest = s[1..2] = "bb"\n✅ Answer: "bb"`,
      keyInsight: `O(n²) time, O(n²) space — same as full DP in this formulation, but the diagonal processing order is cleaner to implement correctly. Reducing to truly O(n) space requires tracking only two diagonals and is left as an extension.`,
    },
  },
}
