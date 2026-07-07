/*
 * LeetCode Problem #62: Unique Paths
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/unique-paths/
 */
import java.util.*;

class Solution {

    // APPROACH 1: 2D DP | O(m*n) time | O(m*n) space
    // EXPLAIN: dp[i][j] = paths from (0,0) to (i,j); each cell = sum of cell above and cell to the left.
    // WHEN: Use for clear visualization of how paths accumulate — great for teaching.

    public int uniquePaths_2d(int m, int n) {
        int[][] dp = new int[m][n];
        for (int i = 0; i < m; i++) dp[i][0] = 1;
        for (int j = 0; j < n; j++) dp[0][j] = 1;
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
        return dp[m - 1][n - 1];
    }

    // APPROACH 2: Space-Optimized DP (single row) | O(m*n) time | O(n) space
    // EXPLAIN: Re-use a single row array; dp[j] += dp[j-1] effectively computes the 2D recurrence.
    // WHEN: Use when memory is constrained — reduces space from O(m*n) to O(n).

    public int uniquePaths_opt(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[j] += dp[j - 1];
            }
        }
        return dp[n - 1];
    }

    // APPROACH 3: Combinatorics (Math) | O(min(m,n)) time | O(1) space
    // EXPLAIN: Total paths = C(m+n-2, m-1) — choose how many down-moves from all moves.
    // WHEN: Use for O(1) space; requires careful overflow handling with long arithmetic.

    public int uniquePaths(int m, int n) {
        long result = 1;
        int total = m + n - 2;
        int k = Math.min(m - 1, n - 1);
        for (int i = 1; i <= k; i++) {
            result = result * (total - k + i) / i;
        }
        return (int) result;
    }

    // APPROACH 4: Recursive Memoization | O(m*n) time | O(m*n) space
    // EXPLAIN: paths(i,j) = paths(i-1,j) + paths(i,j-1); cache with 2D memo table.
    // WHEN: Use when top-down recursion is more natural to derive on a whiteboard.

    public int uniquePaths_memo(int m, int n) {
        int[][] memo = new int[m][n];
        for (int[] row : memo) Arrays.fill(row, -1);
        return memoHelper(m - 1, n - 1, memo);
    }

    private int memoHelper(int i, int j, int[][] memo) {
        if (i == 0 || j == 0) return 1;
        if (memo[i][j] != -1) return memo[i][j];
        memo[i][j] = memoHelper(i - 1, j, memo) + memoHelper(i, j - 1, memo);
        return memo[i][j];
    }

    // APPROACH 5: Two-Row DP | O(m*n) time | O(n) space
    // EXPLAIN: Alternate between prev and curr arrays; explicit two-array rolling.
    // WHEN: Use when you prefer explicit separation of prev/curr rows over in-place update.

    public int uniquePaths_twoRow(int m, int n) {
        if (m == 1 || n == 1) return 1;
        int[] prev = new int[n];
        int[] curr = new int[n];
        Arrays.fill(prev, 1);
        for (int i = 1; i < m; i++) {
            curr[0] = 1;
            for (int j = 1; j < n; j++) {
                curr[j] = curr[j - 1] + prev[j];
            }
            int[] tmp = prev; prev = curr; curr = tmp;
        }
        return prev[n - 1];
    }
}

// Made with Bob
