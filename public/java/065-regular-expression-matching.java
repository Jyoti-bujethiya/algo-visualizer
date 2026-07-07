/*
 * LeetCode Problem #10: Regular Expression Matching
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/regular-expression-matching/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Recursive (no memoization) | O(2^(s+p)) time | O(2^(s+p)) space
    // EXPLAIN: Directly recurse on the problem definition; exponential due to '*' branching without cache.
    // WHEN: Use only to understand the recurrence structure before adding memoization.

    public boolean isMatch_recursive(String s, String p) {
        if (p.isEmpty()) return s.isEmpty();
        boolean firstMatch = !s.isEmpty() &&
                (p.charAt(0) == s.charAt(0) || p.charAt(0) == '.');
        if (p.length() >= 2 && p.charAt(1) == '*') {
            // '*' matches zero occurrences OR one + recurse
            return isMatch_recursive(s, p.substring(2)) ||
                   (firstMatch && isMatch_recursive(s.substring(1), p));
        }
        return firstMatch && isMatch_recursive(s.substring(1), p.substring(1));
    }

    // APPROACH 2: Memoization (Top-Down) | O(s*p) time | O(s*p) space
    // EXPLAIN: Cache (i,j) index pairs from the recursive solution to avoid recomputation.
    // WHEN: Drop-in upgrade from pure recursion — same structure, polynomial time.

    public boolean isMatch_memo(String s, String p) {
        Boolean[][] memo = new Boolean[s.length() + 1][p.length() + 1];
        return memoHelper(s, p, 0, 0, memo);
    }

    private boolean memoHelper(String s, String p, int i, int j, Boolean[][] memo) {
        if (j == p.length()) return i == s.length();
        if (memo[i][j] != null) return memo[i][j];
        boolean firstMatch = i < s.length() && (p.charAt(j) == s.charAt(i) || p.charAt(j) == '.');
        boolean res;
        if (j + 1 < p.length() && p.charAt(j + 1) == '*') {
            res = memoHelper(s, p, i, j + 2, memo) ||
                  (firstMatch && memoHelper(s, p, i + 1, j, memo));
        } else {
            res = firstMatch && memoHelper(s, p, i + 1, j + 1, memo);
        }
        memo[i][j] = res;
        return res;
    }

    // APPROACH 3: 2D Bottom-Up DP (string-prefix prefix) | O(s*p) time | O(s*p) space
    // EXPLAIN: dp[i][j] = does s[i..] match p[j..]; fill table iterating s and p lengths.
    // WHEN: Use as the standard interview solution — polynomial time, easy to reason about.

    public boolean isMatch(String s, String p) {
        int m = s.length(), n = p.length();
        boolean[][] dp = new boolean[m + 1][n + 1];
        dp[m][n] = true;
        for (int i = m; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                boolean firstMatch = i < m &&
                        (p.charAt(j) == s.charAt(i) || p.charAt(j) == '.');
                if (j + 1 < n && p.charAt(j + 1) == '*') {
                    dp[i][j] = dp[i][j + 2] || (firstMatch && dp[i + 1][j]);
                } else {
                    dp[i][j] = firstMatch && dp[i + 1][j + 1];
                }
            }
        }
        return dp[0][0];
    }

    // APPROACH 4: Space-Optimized DP (1-D rolling array) | O(s*p) time | O(p) space
    // EXPLAIN: Only the previous and current DP rows are needed; use two arrays.
    // WHEN: Use when string is long and O(s*p) memory is prohibitive.

    public boolean isMatch_spaceOpt(String s, String p) {
        int m = s.length(), n = p.length();
        boolean[] prev = new boolean[n + 1], curr = new boolean[n + 1];
        prev[n] = true;
        // initialise first row (i == m)
        for (int j = n - 1; j >= 0; j--) {
            if (j + 1 < n && p.charAt(j + 1) == '*') prev[j] = prev[j + 2];
        }
        for (int i = m - 1; i >= 0; i--) {
            curr[n] = false;
            for (int j = n - 1; j >= 0; j--) {
                boolean firstMatch = p.charAt(j) == s.charAt(i) || p.charAt(j) == '.';
                if (j + 1 < n && p.charAt(j + 1) == '*') {
                    curr[j] = curr[j + 2] || (firstMatch && prev[j]);
                } else {
                    curr[j] = firstMatch && prev[j + 1];
                }
            }
            boolean[] tmp = prev; prev = curr; curr = tmp;
        }
        return prev[0];
    }
}

// Made with Bob
