/**
 * Tutorial content for #059 — Decode Ways
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `A message encoded as digits where 'A'=1, 'B'=2, ..., 'Z'=26. Count the number of ways to decode the digit string. '0' cannot be decoded alone, and leading zeros make a sequence invalid.`,
    example: `s = "226"\n→ "2","2","6" = "BBF"\n→ "22","6" = "VF"\n→ "2","26" = "BZ"\n✅ Answer: 3`,
    keyInsight: `At each position, you can decode one digit (if non-zero) or two digits (if the two-digit number is 10–26). The total ways dp[i] = (ways using 1 digit) + (ways using 2 digits).`,
  },

  approaches: {
    'Recursive Memoization': {
      intuition: `Start from the beginning of the string and at each step decide: decode one character, or decode two characters (if valid). Cache each index so it's only solved once.`,
      steps: [
        `Create memo array of size n+1, filled with -1.`,
        `Base case: index == n → return 1 (valid decoding complete).`,
        `If s[index] == '0' → return 0 (can't decode a standalone zero).`,
        `Count one-digit decode: ways = solve(index + 1).`,
        `If index+1 < n and two-digit number s[index..index+1] is 10-26: ways += solve(index + 2).`,
        `Cache and return ways.`,
      ],
      example: `s = "226"\n\nsolve(0): s[0]='2' ≠ '0'\n  one-digit: solve(1)\n  two-digit: "22"=22 ≤ 26 → solve(2)\nsolve(1): s[1]='2'\n  one-digit: solve(2)\n  two-digit: "26"=26 ≤ 26 → solve(3)=1\n  → solve(1) = solve(2) + 1\nsolve(2): s[2]='6'\n  one-digit: solve(3)=1\n  two-digit: "6x" — only 1 char left\n  → solve(2) = 1\nsolve(1) = 1 + 1 = 2\nsolve(0) = 2 + 1 = 3\n✅ Answer: 3`,
      keyInsight: `O(n) time, O(n) space. Top-down style mirrors the natural recursive thinking about the problem.`,
    },

    'Bottom-Up DP (right-to-left)': {
      intuition: `Build dp from the end of the string leftward. dp[i] = number of ways to decode s[i..n-1]. dp[n] = 1 (base), dp[i] adds ways from one-digit decode and two-digit decode if valid.`,
      steps: [
        `Create dp[n+1]; dp[n] = 1, dp[n-1] = (s[n-1] != '0') ? 1 : 0.`,
        `For i from n-2 down to 0:`,
        `  If s[i] != '0': dp[i] = dp[i+1].`,
        `  If two-digit s[i..i+1] is 10-26: dp[i] += dp[i+2].`,
        `Return dp[0].`,
      ],
      example: `s = "226"\n\ndp[3]=1\ndp[2]= s[2]='6'≠'0' → dp[3]=1; no two-digit → dp[2]=1\ndp[1]= s[1]='2' → dp[2]=1; "26"≤26 → +dp[3]=1 → dp[1]=2\ndp[0]= s[0]='2' → dp[1]=2; "22"≤26 → +dp[2]=1 → dp[0]=3\n✅ Answer: 3`,
      keyInsight: `O(n) time, O(n) space. Right-to-left iteration feels natural: dp[i] answers "how many ways from here to the end?"`,
    },

    'Space-Optimized DP': {
      intuition: `The right-to-left DP only uses dp[i+1] and dp[i+2]. Replace the array with two variables: next1 (dp[i+1]) and next2 (dp[i+2]). Slide them leftward as we iterate.`,
      steps: [
        `Set next1 = 1 (dp[n]), next2 = 0.`,
        `Process last character: if s[n-1] != '0', set a = 1 else 0.`,
        `Slide: next2 = next1, next1 = a.`,
        `For i from n-2 down to 0:`,
        `  cur = 0; if s[i]!='0' cur = next1; if two-digit valid cur += next2.`,
        `  next2 = next1; next1 = cur.`,
        `Return next1.`,
      ],
      example: `s = "226"\n\nnext1=1, next2=0\ni=2 (s='6'): cur=next1=1; no two-digit; → next2=1, next1=1\ni=1 (s='2'): cur=next1=1; "26"≤26 → +next2=1 → cur=2; → next2=1, next1=2\ni=0 (s='2'): cur=next1=2; "22"≤26 → +next2=1 → cur=3\nReturn 3\n✅ Answer: 3`,
      keyInsight: `O(n) time, O(1) space. Reduces the full dp array to just two rolling variables.`,
    },

    'Bottom-Up DP (left-to-right)': {
      intuition: `Build dp from the start of the string rightward. dp[i] = ways to decode s[0..i-1]. dp[0]=1 (empty string). For each position i, check if the last one or two characters form a valid code.`,
      steps: [
        `Create dp[n+1]; dp[0] = 1.`,
        `For i from 1 to n:`,
        `  One-digit: if s[i-1] != '0', dp[i] += dp[i-1].`,
        `  Two-digit: if i >= 2 and s[i-2..i-1] is 10-26, dp[i] += dp[i-2].`,
        `Return dp[n].`,
      ],
      example: `s = "226"\n\ndp[0]=1\ndp[1]: s[0]='2'≠'0' → +dp[0]=1 → dp[1]=1\ndp[2]: s[1]='2' → +dp[1]=1; "22"≤26 → +dp[0]=1 → dp[2]=2\ndp[3]: s[2]='6' → +dp[2]=2; "26"≤26 → +dp[1]=1 → dp[3]=3\n✅ Answer: 3`,
      keyInsight: `O(n) time, O(n) space. Left-to-right is arguably the more intuitive direction — dp[i] = "how many ways to decode the first i characters?"`,
    },

    'Space-Optimized Left-to-Right': {
      intuition: `The left-to-right DP only uses dp[i-1] and dp[i-2]. Keep just two variables — prev1 (dp[i-1]) and prev2 (dp[i-2]) — and slide them rightward.`,
      steps: [
        `Set prev2 = 1 (dp[0]), prev1 = (s[0] != '0') ? 1 : 0 (dp[1]).`,
        `For i from 2 to n:`,
        `  cur = 0; if s[i-1]!='0' cur = prev1; if s[i-2..i-1] is 10-26 cur += prev2.`,
        `  prev2 = prev1; prev1 = cur.`,
        `Return prev1.`,
      ],
      example: `s = "226"\n\nprev2=1 (dp[0]), prev1=1 (dp[1])\ni=2: s[1]='2'→cur=prev1=1; "22"≤26→cur+=prev2=1 → cur=2; prev2=1,prev1=2\ni=3: s[2]='6'→cur=prev1=2; "26"≤26→cur+=prev2=1 → cur=3\nReturn 3\n✅ Answer: 3`,
      keyInsight: `O(n) time, O(1) space. The cleanest production solution — left-to-right feel with constant space.`,
    },
  },
}
