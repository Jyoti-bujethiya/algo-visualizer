# LeetCode Problem #10: Regular Expression Matching
# Difficulty: Hard
# Link: https://leetcode.com/problems/regular-expression-matching/

from functools import lru_cache

# ─────────────────────────────────────────────
# APPROACH 1: Pure Recursion | O(2^(s+p)) time | O(s+p) space
# EXPLAIN: Branch on every '*' possibility (zero or more); exponential without caching.
# WHEN: Shows the brute-force structure — illustrate why memoization is necessary.

def isMatch_recursive(s: str, p: str) -> bool:
    if not p:
        return not s
    first_match = bool(s) and p[0] in (s[0], '.')
    if len(p) >= 2 and p[1] == '*':
        return isMatch_recursive(s, p[2:]) or (first_match and isMatch_recursive(s[1:], p))
    return first_match and isMatch_recursive(s[1:], p[1:])


# APPROACH 2: Memoized Recursion | O(sp) time | O(sp) space
# EXPLAIN: Same recursion but cache (i, j) index pairs to avoid recomputation.
# WHEN: Drop-in upgrade from pure recursion — easy to derive from APPROACH 1.

def isMatch_memo(s: str, p: str) -> bool:
    @lru_cache(maxsize=None)
    def dp(i, j):
        if j == len(p):
            return i == len(s)
        first = i < len(s) and p[j] in (s[i], '.')
        if j + 1 < len(p) and p[j + 1] == '*':
            return dp(i, j + 2) or (first and dp(i + 1, j))
        return first and dp(i + 1, j + 1)

    return dp(0, 0)


# APPROACH 3: Bottom-Up 2D DP | O(sp) time | O(sp) space
# EXPLAIN: dp[i][j] = whether s[i:] matches p[j:]; fill from bottom-right to top-left.
# WHEN: Canonical iterative DP for regex matching — no recursion, explicit state table.

def isMatch_dp(s: str, p: str) -> bool:
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[m][n] = True
    for i in range(m, -1, -1):
        for j in range(n - 1, -1, -1):
            first = i < m and p[j] in (s[i], '.')
            if j + 1 < n and p[j + 1] == '*':
                dp[i][j] = dp[i][j + 2] or (first and dp[i + 1][j])
            else:
                dp[i][j] = first and dp[i + 1][j + 1]
    return dp[0][0]


# APPROACH 4: Space-Optimized DP (rolling rows) | O(sp) time | O(p) space
# EXPLAIN: Only the previous and current DP rows are needed; use two 1-D arrays.
# WHEN: Use when s is long and O(sp) memory is prohibitive.

def isMatch_space_opt(s: str, p: str) -> bool:
    m, n = len(s), len(p)
    # prev[j] represents dp[i+1][j] (the row below)
    prev = [False] * (n + 1)
    prev[n] = True
    # initialise the bottom row (i == m)
    for j in range(n - 1, -1, -1):
        if j + 1 < n and p[j + 1] == '*':
            prev[j] = prev[j + 2]
    for i in range(m - 1, -1, -1):
        curr = [False] * (n + 1)
        for j in range(n - 1, -1, -1):
            first = p[j] in (s[i], '.')
            if j + 1 < n and p[j + 1] == '*':
                curr[j] = curr[j + 2] or (first and prev[j])
            else:
                curr[j] = first and prev[j + 1]
        prev = curr
    return prev[0]


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ('aa', 'a', False),
        ('aa', 'a*', True),
        ('ab', '.*', True),
        ('aab', 'c*a*b', True),
        ('mississippi', 'mis*is*p*.', False),
        ('', '.*', True),
        ('a', '.', True),
    ]
    for fn in (isMatch_recursive, isMatch_memo, isMatch_dp, isMatch_space_opt):
        for s, p, expected in cases:
            result = fn(s, p)
            assert result == expected, (
                f'{fn.__name__}({s!r}, {p!r}) = {result}, expected {expected}'
            )
    print('All tests passed.')

# Made with Bob
