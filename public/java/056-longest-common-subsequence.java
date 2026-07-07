/*
 * LeetCode Problem #1143: Longest Common Subsequence
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/longest-common-subsequence/
 */
import java.util.*;

class Solution {

    // APPROACH 1: 2D Bottom-Up DP | O(m*n) time | O(m*n) space
    // EXPLAIN: dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]; match extends diagonal, else take max adjacent.
    // WHEN: Use when you need to reconstruct the actual LCS string or inspect the full table.

    public int longestCommonSubsequence_2d(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1))
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                else
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        return dp[m][n];
    }

    // APPROACH 2: Recursive Memoization (Top-Down) | O(m*n) time | O(m*n) space
    // EXPLAIN: At each (i,j), if chars match extend; else try skipping either string; cache results.
    // WHEN: Use when the recursive structure is more intuitive to derive on a whiteboard.

    public int longestCommonSubsequence_memo(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] memo = new int[m + 1][n + 1];
        for (int[] row : memo) Arrays.fill(row, -1);
        return memoHelper(text1, text2, m, n, memo);
    }

    private int memoHelper(String s1, String s2, int i, int j, int[][] memo) {
        if (i == 0 || j == 0) return 0;
        if (memo[i][j] != -1) return memo[i][j];
        if (s1.charAt(i - 1) == s2.charAt(j - 1))
            memo[i][j] = 1 + memoHelper(s1, s2, i - 1, j - 1, memo);
        else
            memo[i][j] = Math.max(memoHelper(s1, s2, i - 1, j, memo),
                                  memoHelper(s1, s2, i, j - 1, memo));
        return memo[i][j];
    }

    // APPROACH 3: Space-Optimized DP (two rows) | O(m*n) time | O(min(m,n)) space
    // EXPLAIN: Only keep the previous and current DP row; reduce space from O(m*n) to O(min(m,n)).
    // WHEN: Use when input strings are very long and memory is constrained.

    public int longestCommonSubsequence(String text1, String text2) {
        if (text1.length() < text2.length()) {
            String tmp = text1; text1 = text2; text2 = tmp;
        }
        int m = text1.length(), n = text2.length();
        int[] prev = new int[n + 1], curr = new int[n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1))
                    curr[j] = prev[j - 1] + 1;
                else
                    curr[j] = Math.max(prev[j], curr[j - 1]);
            }
            int[] tmp = prev; prev = curr; curr = tmp;
            Arrays.fill(curr, 0);
        }
        return prev[n];
    }

    // APPROACH 4: Single-Array Space-Optimized DP | O(m*n) time | O(min(m,n)) space
    // EXPLAIN: Use a single row with a prev variable tracking the diagonal; in-place update.
    // WHEN: Most memory-efficient variant — slightly trickier but saves the extra array.

    public int longestCommonSubsequence_singleArray(String text1, String text2) {
        if (text1.length() < text2.length()) {
            String tmp = text1; text1 = text2; text2 = tmp;
        }
        int m = text1.length(), n = text2.length();
        int[] dp = new int[n + 1];
        for (int i = 1; i <= m; i++) {
            int prev = 0;
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (text1.charAt(i - 1) == text2.charAt(j - 1))
                    dp[j] = prev + 1;
                else
                    dp[j] = Math.max(dp[j], dp[j - 1]);
                prev = temp;
            }
        }
        return dp[n];
    }

    // APPROACH 5: LCS with Path Reconstruction | O(m*n) time | O(m*n) space
    // EXPLAIN: 2D DP + backtrack through the table to recover the actual LCS string.
    // WHEN: Use when you need the literal LCS string, not just its length.

    public String getLCS(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                if (text1.charAt(i - 1) == text2.charAt(j - 1))
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                else
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        // backtrack
        StringBuilder sb = new StringBuilder();
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                sb.append(text1.charAt(i - 1)); i--; j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) i--;
            else j--;
        }
        return sb.reverse().toString();
    }

    // APPROACH 6: getLCS length (wraps getLCS) | O(m*n) time | O(m*n) space
    // EXPLAIN: Return just the length from the reconstruction approach.
    // WHEN: Convenience wrapper combining length output with path recovery capability.

    public int longestCommonSubsequence_withPath(String text1, String text2) {
        return getLCS(text1, text2).length();
    }
}

// Made with Bob
