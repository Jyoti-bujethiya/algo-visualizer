# LeetCode Problem #70: Climbing Stairs
# Difficulty: Easy
# Link: https://leetcode.com/problems/climbing-stairs/

from typing import List
import math

# ─────────────────────────────────────────────
# APPROACH 1: Recursive Memoization (Top-Down DP) | O(n) time | O(n) space
# EXPLAIN: Cache f(n)=f(n-1)+f(n-2) top-down using lru_cache to avoid exponential blowup.
# WHEN: First instinct in interviews — easy to derive from the recurrence.

from functools import lru_cache

def climbStairs_memo(n: int) -> int:
    @lru_cache(maxsize=None)
    def dp(i):
        if i <= 1:
            return 1
        return dp(i - 1) + dp(i - 2)
    return dp(n)


# APPROACH 2: Bottom-Up DP | O(n) time | O(n) space
# EXPLAIN: Build a table from base cases up to n; dp[i] = dp[i-1] + dp[i-2].
# WHEN: When you want explicit tabulation that is easy to trace step by step.

def climbStairs_dp(n: int) -> int:
    if n <= 1:
        return 1
    dp = [0] * (n + 1)
    dp[0], dp[1] = 1, 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]


# APPROACH 3: Space-Optimised DP (Two Variables) | O(n) time | O(1) space
# EXPLAIN: Only the previous two values matter; roll them forward without an array.
# WHEN: Production-ready — minimal memory, identical speed.

def climbStairs_space_opt(n: int) -> int:
    if n <= 1:
        return 1
    prev2, prev1 = 1, 1
    for _ in range(2, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    return prev1


# APPROACH 4: Matrix Exponentiation | O(log n) time | O(1) space
# EXPLAIN: [[1,1],[1,0]]^n gives Fibonacci; fast binary exponentiation achieves O(log n).
# WHEN: For very large n where O(n) is too slow — competitive programming / academic.

def climbStairs_matrix(n: int) -> int:
    if n <= 2:
        return n

    def mat_mul(A, B):
        return [
            [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
            [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]],
        ]

    def mat_pow(m, p):
        if p == 1:
            return m
        if p % 2 == 0:
            half = mat_pow(m, p // 2)
            return mat_mul(half, half)
        return mat_mul(m, mat_pow(m, p - 1))

    base = [[1, 1], [1, 0]]
    result = mat_pow(base, n)
    return result[0][0]


# APPROACH 5: Mathematical Formula (Binet's) | O(1) time | O(1) space
# EXPLAIN: Closed-form Fibonacci via phi = (1+√5)/2; answer = F(n+1) rounded.
# WHEN: Mathematical elegance only — floating-point limits precision for large n.

def climbStairs_formula(n: int) -> int:
    sqrt5 = math.sqrt(5)
    phi   = (1 + sqrt5) / 2
    psi   = (1 - sqrt5) / 2
    return round((phi**(n + 1) - psi**(n + 1)) / sqrt5)


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [(1, 1), (2, 2), (3, 3), (4, 5), (5, 8), (10, 89)]
    for fn in (climbStairs_memo, climbStairs_dp, climbStairs_space_opt,
               climbStairs_matrix, climbStairs_formula):
        for n, expected in cases:
            result = fn(n)
            assert result == expected, f'{fn.__name__}({n}) = {result}, expected {expected}'
    print('All tests passed.')

# Made with Bob
