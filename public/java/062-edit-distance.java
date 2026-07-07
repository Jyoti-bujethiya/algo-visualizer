/*
 * LeetCode Problem #72: Edit Distance
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/edit-distance/
 */
import java.util.*;

class Solution {

    // APPROACH 1: 2D Bottom-Up DP | O(m*n) time | O(m*n) space
    // EXPLAIN: dp[i][j] = min operations to convert word1[0..i-1] to word2[0..j-1]; three choices: insert, delete, replace.
    // WHEN: Use when the full DP table is needed for traceback or teaching.

    public int minDistance_2d(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1))
                    dp[i][j] = dp[i - 1][j - 1];
                else
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],
                                    Math.min(dp[i - 1][j], dp[i][j - 1]));
            }
        }
        return dp[m][n];
    }

    // APPROACH 2: Recursive Memoization (Top-Down) | O(m*n) time | O(m*n) space
    // EXPLAIN: Recursively solve sub-problems; cache (i,j) results to avoid recomputation.
    // WHEN: Use when the recursive structure is easier to derive on a whiteboard.

    public int minDistance_memo(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] memo = new int[m + 1][n + 1];
        for (int[] row : memo) Arrays.fill(row, -1);
        return memoHelper(word1, word2, m, n, memo);
    }

    private int memoHelper(String w1, String w2, int i, int j, int[][] memo) {
        if (i == 0) return j;
        if (j == 0) return i;
        if (memo[i][j] != -1) return memo[i][j];
        if (w1.charAt(i - 1) == w2.charAt(j - 1))
            memo[i][j] = memoHelper(w1, w2, i - 1, j - 1, memo);
        else
            memo[i][j] = 1 + Math.min(memoHelper(w1, w2, i, j - 1, memo),
                             Math.min(memoHelper(w1, w2, i - 1, j, memo),
                                      memoHelper(w1, w2, i - 1, j - 1, memo)));
        return memo[i][j];
    }

    // APPROACH 3: Space-Optimized DP (two rows) | O(m*n) time | O(n) space
    // EXPLAIN: Use two 1-D arrays swapped row-by-row to reduce space from O(m*n) to O(n).
    // WHEN: Use when strings are very long and O(m*n) memory is prohibitive.

    public int minDistance_opt(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[] prev = new int[n + 1], curr = new int[n + 1];
        for (int j = 0; j <= n; j++) prev[j] = j;
        for (int i = 1; i <= m; i++) {
            curr[0] = i;
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1))
                    curr[j] = prev[j - 1];
                else
                    curr[j] = 1 + Math.min(prev[j - 1], Math.min(prev[j], curr[j - 1]));
            }
            int[] tmp = prev; prev = curr; curr = tmp;
        }
        return prev[n];
    }

    // APPROACH 4: Single-Array Space-Optimized DP | O(m*n) time | O(min(m,n)) space
    // EXPLAIN: Use one row plus a prev variable tracking the diagonal; in-place update.
    // WHEN: Use in production when space matters — same time, smallest memory footprint.

    public int minDistance(String word1, String word2) {
        if (word1.length() < word2.length()) { String t = word1; word1 = word2; word2 = t; }
        int m = word1.length(), n = word2.length();
        int[] dp = new int[n + 1];
        for (int j = 0; j <= n; j++) dp[j] = j;
        for (int i = 1; i <= m; i++) {
            int prev = dp[0];
            dp[0] = i;
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (word1.charAt(i - 1) == word2.charAt(j - 1))
                    dp[j] = prev;
                else
                    dp[j] = 1 + Math.min(prev, Math.min(dp[j], dp[j - 1]));
                prev = temp;
            }
        }
        return dp[n];
    }

    // APPROACH 5: Pure Recursive (no memo) | O(3^(m+n)) time | O(m+n) space
    // EXPLAIN: Directly recurse on the problem definition — shows structure but is exponential.
    // WHEN: Educational only — illustrates why memoization is essential.

    public int minDistance_recursive(String word1, String word2) {
        return recurse(word1, word2, word1.length(), word2.length());
    }

    private int recurse(String w1, String w2, int i, int j) {
        if (i == 0) return j;
        if (j == 0) return i;
        if (w1.charAt(i - 1) == w2.charAt(j - 1)) return recurse(w1, w2, i - 1, j - 1);
        return 1 + Math.min(recurse(w1, w2, i, j - 1),
                   Math.min(recurse(w1, w2, i - 1, j),
                            recurse(w1, w2, i - 1, j - 1)));
    }
}

// Made with Bob
