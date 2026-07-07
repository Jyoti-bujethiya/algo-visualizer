/*
 * LeetCode Problem #91: Decode Ways
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/decode-ways/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Recursive Memoization | O(n) time | O(n) space
    // EXPLAIN: Decode one or two characters at a time; cache by start index to avoid re-work.
    // WHEN: Use when recursive structure is easier to reason about first.

    public int numDecodings_memo(String s) {
        Integer[] memo = new Integer[s.length()];
        return decode(s, 0, memo);
    }

    private int decode(String s, int i, Integer[] memo) {
        if (i == s.length()) return 1;
        if (s.charAt(i) == '0') return 0;
        if (memo[i] != null) return memo[i];
        int ways = decode(s, i + 1, memo);
        if (i + 1 < s.length()) {
            int two = Integer.parseInt(s.substring(i, i + 2));
            if (two >= 10 && two <= 26) ways += decode(s, i + 2, memo);
        }
        memo[i] = ways;
        return ways;
    }

    // APPROACH 2: Bottom-Up DP (right-to-left) | O(n) time | O(n) space
    // EXPLAIN: dp[i] = ways to decode s[i..n-1]; fill right-to-left considering 1- and 2-char codes.
    // WHEN: Use for the iterative DP formulation — avoids recursion overhead.

    public int numDecodings_dp(String s) {
        int n = s.length();
        int[] dp = new int[n + 1];
        dp[n] = 1;
        for (int i = n - 1; i >= 0; i--) {
            if (s.charAt(i) != '0') {
                dp[i] = dp[i + 1];
                if (i + 1 < n) {
                    int two = Integer.parseInt(s.substring(i, i + 2));
                    if (two <= 26) dp[i] += dp[i + 2];
                }
            }
        }
        return dp[0];
    }

    // APPROACH 3: Space-Optimized DP | O(n) time | O(1) space
    // EXPLAIN: Replace the dp array with two scalar variables; slide them left-to-right.
    // WHEN: Use when space matters — identical logic to Approach 2 but O(1) space.

    public int numDecodings(String s) {
        int n = s.length();
        int next2 = 1, next1 = 0;
        for (int i = n - 1; i >= 0; i--) {
            int cur = 0;
            if (s.charAt(i) != '0') {
                cur = next2;
                if (i + 1 < n) {
                    int two = Integer.parseInt(s.substring(i, i + 2));
                    if (two <= 26) cur += next1;
                }
            }
            next1 = next2;
            next2 = cur;
        }
        return next2;
    }

    // APPROACH 4: Bottom-Up DP (left-to-right) | O(n) time | O(n) space
    // EXPLAIN: dp[i] = ways to decode s[0..i-1]; fill left-to-right using single and double chars.
    // WHEN: Alternative left-to-right formulation; some find it more natural than right-to-left.

    public int numDecodings_lr(String s) {
        int n = s.length();
        if (n == 0 || s.charAt(0) == '0') return 0;
        int[] dp = new int[n + 1];
        dp[0] = 1;
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            int oneDigit = s.charAt(i - 1) - '0';
            int twoDigits = Integer.parseInt(s.substring(i - 2, i));
            if (oneDigit >= 1) dp[i] += dp[i - 1];
            if (twoDigits >= 10 && twoDigits <= 26) dp[i] += dp[i - 2];
        }
        return dp[n];
    }

    // APPROACH 5: Space-Optimized Left-to-Right | O(n) time | O(1) space
    // EXPLAIN: Rolling two-variable version of the left-to-right DP — Fibonacci-like update.
    // WHEN: Use as the most compact correct implementation for production.

    public int numDecodings_lr_opt(String s) {
        int n = s.length();
        if (n == 0 || s.charAt(0) == '0') return 0;
        int prev2 = 1, prev1 = 1;
        for (int i = 2; i <= n; i++) {
            int cur = 0;
            int oneDigit  = s.charAt(i - 1) - '0';
            int twoDigits = Integer.parseInt(s.substring(i - 2, i));
            if (oneDigit >= 1) cur += prev1;
            if (twoDigits >= 10 && twoDigits <= 26) cur += prev2;
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}

// Made with Bob
