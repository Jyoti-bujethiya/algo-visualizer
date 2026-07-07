# LeetCode Problem #62: Unique Paths
# Difficulty: Medium
# Link: https://leetcode.com/problems/unique-paths/

from functools import lru_cache
from math import comb

# ─────────────────────────────────────────────
# APPROACH 1: Recursive Memoization | O(mn) time | O(mn) space
# EXPLAIN: At each cell, paths = paths from cell below + paths from cell to the right.
# WHEN: Cleanest recursive derivation — base cases are the bottom row and right column.

def uniquePaths_memo(m: int, n: int) -> int:
    @lru_cache(maxsize=None)
    def dp(r, c):
        if r == m - 1 or c == n - 1:
            return 1
        return dp(r + 1, c) + dp(r, c + 1)
    return dp(0, 0)


# APPROACH 2: Bottom-Up 2D DP | O(mn) time | O(mn) space
# EXPLAIN: dp[r][c] = number of unique paths to reach (r,c) from (0,0).
# WHEN: Standard interview DP — explicit grid table is easy to trace.

def uniquePaths_dp(m: int, n: int) -> int:
    dp = [[1] * n for _ in range(m)]
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
    return dp[m - 1][n - 1]


# APPROACH 3: Math (Combinatorics) | O(min(m,n)) time | O(1) space
# EXPLAIN: Total steps = (m-1) down + (n-1) right; choose which steps go down = C(m+n-2, m-1).
# WHEN: Best when you recognise the combinatorial structure — one line, no grid needed.

def uniquePaths_math(m: int, n: int) -> int:
    return comb(m + n - 2, m - 1)


# APPROACH 4: Space-Optimized DP (single row) | O(mn) time | O(n) space
# EXPLAIN: Re-use a single row; dp[j] += dp[j-1] encodes the 2D recurrence in-place.
# WHEN: Memory-efficient solution for large grids; drop-in for the 2D approach.

def uniquePaths_1d(m: int, n: int) -> int:
    dp = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j - 1]
    return dp[n - 1]


# APPROACH 5: Two-Row Rolling DP | O(mn) time | O(n) space
# EXPLAIN: Alternate prev/curr arrays explicitly — clearer separation of rows.
# WHEN: When you prefer explicit prev/curr over in-place single-row mutation.

def uniquePaths_two_row(m: int, n: int) -> int:
    if m == 1 or n == 1:
        return 1
    prev = [1] * n
    for _ in range(1, m):
        curr = [1] * n
        for j in range(1, n):
            curr[j] = curr[j - 1] + prev[j]
        prev = curr
    return prev[n - 1]


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        (3, 7, 28),
        (3, 2, 3),
        (1, 1, 1),
        (7, 3, 28),
        (3, 3, 6),
    ]
    for fn in (uniquePaths_memo, uniquePaths_dp, uniquePaths_math,
               uniquePaths_1d, uniquePaths_two_row):
        for m, n, expected in cases:
            result = fn(m, n)
            assert result == expected, (
                f'{fn.__name__}({m}, {n}) = {result}, expected {expected}'
            )
    print('All tests passed.')

# Made with Bob
