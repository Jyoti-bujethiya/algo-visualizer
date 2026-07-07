/*
 * LeetCode Problem #70: Climbing Stairs
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/climbing-stairs/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Recursive Memoization (Top-Down DP) | O(n) time | O(n) space
    // EXPLAIN: Cache overlapping subproblems of f(n)=f(n-1)+f(n-2) to avoid re-computation.
    // WHEN: Use when top-down thinking is natural and recursion depth is acceptable.

    public int climbStairs_memo(int n) {
        int[] memo = new int[n + 1];
        return helper(n, memo);
    }

    private int helper(int n, int[] memo) {
        if (n <= 1) return 1;
        if (memo[n] != 0) return memo[n];
        memo[n] = helper(n - 1, memo) + helper(n - 2, memo);
        return memo[n];
    }

    // APPROACH 2: Bottom-Up DP | O(n) time | O(n) space
    // EXPLAIN: Fill dp array from base cases up; dp[i] = dp[i-1] + dp[i-2].
    // WHEN: Use as the straightforward iterative DP solution — easy to explain.

    public int climbStairs_dp(int n) {
        if (n <= 1) return 1;
        int[] dp = new int[n + 1];
        dp[0] = 1;
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }

    // APPROACH 3: Space-Optimized DP | O(n) time | O(1) space
    // EXPLAIN: Keep only the last two Fibonacci values; discard the full array.
    // WHEN: Use in interviews as the optimal solution — constant space.

    public int climbStairs(int n) {
        if (n <= 1) return 1;
        int prev2 = 1, prev1 = 1;
        for (int i = 2; i <= n; i++) {
            int cur = prev1 + prev2;
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }

    // APPROACH 4: Matrix Exponentiation | O(log n) time | O(1) space
    // EXPLAIN: Represent Fibonacci as matrix power [[1,1],[1,0]]^n; use fast exponentiation.
    // WHEN: Use for very large n where even O(n) is too slow — academic/competitive programming.

    public int climbStairs_matrix(int n) {
        if (n <= 2) return n;
        long[][] base   = {{1, 1}, {1, 0}};
        long[][] result = matPow(base, n);
        return (int) result[0][0];
    }

    private long[][] matPow(long[][] m, int n) {
        if (n == 1) return m;
        if (n % 2 == 0) {
            long[][] half = matPow(m, n / 2);
            return matMul(half, half);
        }
        return matMul(m, matPow(m, n - 1));
    }

    private long[][] matMul(long[][] A, long[][] B) {
        long[][] C = new long[2][2];
        for (int i = 0; i < 2; i++)
            for (int j = 0; j < 2; j++)
                for (int k = 0; k < 2; k++)
                    C[i][j] += A[i][k] * B[k][j];
        return C;
    }

    // APPROACH 5: Mathematical Formula (Binet's Formula) | O(1) time | O(1) space
    // EXPLAIN: Closed-form Fibonacci using phi = (1+√5)/2; answer is F(n+1) rounded.
    // WHEN: Mathematical curiosity — floating-point precision limits practical use for large n.

    public int climbStairs_formula(int n) {
        double sqrt5 = Math.sqrt(5);
        double phi   = (1 + sqrt5) / 2;
        double psi   = (1 - sqrt5) / 2;
        return (int) Math.round((Math.pow(phi, n + 1) - Math.pow(psi, n + 1)) / sqrt5);
    }
}

// Made with Bob
