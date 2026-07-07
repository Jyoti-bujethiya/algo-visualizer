# LeetCode Problem #72: Edit Distance
# Difficulty: Hard
# Link: https://leetcode.com/problems/edit-distance/

from functools import lru_cache

# ─────────────────────────────────────────────
# APPROACH 1: Recursive Memoization | O(mn) time | O(mn) space
# EXPLAIN: At each (i,j), if chars match advance both pointers; else take min of
#          insert, delete, replace and add 1.
# WHEN: Top-down formulation directly mirrors the problem definition.

def minDistance_memo(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)

    @lru_cache(maxsize=None)
    def dp(i, j):
        if i == m:
            return n - j
        if j == n:
            return m - i
        if word1[i] == word2[j]:
            return dp(i + 1, j + 1)
        return 1 + min(dp(i + 1, j),    # delete
                       dp(i, j + 1),    # insert
                       dp(i + 1, j + 1))  # replace

    return dp(0, 0)


# APPROACH 2: Bottom-Up 2D DP | O(mn) time | O(mn) space
# EXPLAIN: dp[i][j] = edit distance between word1[:i] and word2[:j]; fill row by row.
# WHEN: Classic tabulation — easy to read and explain in interviews.

def minDistance_dp(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]


# APPROACH 3: Space-Optimised DP (two rows) | O(mn) time | O(n) space
# EXPLAIN: Only the current and previous rows are needed; a single rolling array suffices.
# WHEN: When memory is constrained — same time complexity, space cut to O(n).

def minDistance_space_opt(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    prev = list(range(n + 1))
    for i in range(1, m + 1):
        curr = [i] + [0] * n
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                curr[j] = prev[j - 1]
            else:
                curr[j] = 1 + min(prev[j], curr[j - 1], prev[j - 1])
        prev = curr
    return prev[n]


# APPROACH 4: Single-Array In-Place DP | O(mn) time | O(min(m,n)) space
# EXPLAIN: One rolling array with a saved diagonal; most memory-efficient iterative form.
# WHEN: Production use where even O(n) two-row feels heavy; slightly trickier to reason.

def minDistance_single_array(word1: str, word2: str) -> int:
    if len(word1) < len(word2):
        word1, word2 = word2, word1
    m, n = len(word1), len(word2)
    dp = list(range(n + 1))
    for i in range(1, m + 1):
        prev = dp[0]
        dp[0] = i
        for j in range(1, n + 1):
            temp = dp[j]
            if word1[i - 1] == word2[j - 1]:
                dp[j] = prev
            else:
                dp[j] = 1 + min(dp[j], dp[j - 1], prev)
            prev = temp
    return dp[n]


# APPROACH 5: Pure Recursive (no memo) | O(3^(m+n)) time | O(m+n) space
# EXPLAIN: Directly recurse on the problem — exponential without caching; educational only.
# WHEN: Shows the recursive structure before adding memoization; never use in production.

def minDistance_recursive(word1: str, word2: str) -> int:
    def recurse(i, j):
        if i == len(word1): return len(word2) - j
        if j == len(word2): return len(word1) - i
        if word1[i] == word2[j]:
            return recurse(i + 1, j + 1)
        return 1 + min(recurse(i + 1, j), recurse(i, j + 1), recurse(i + 1, j + 1))
    return recurse(0, 0)


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ('horse', 'ros', 3),
        ('intention', 'execution', 5),
        ('', '', 0),
        ('a', '', 1),
        ('', 'b', 1),
        ('abc', 'abc', 0),
    ]
    # skip recursive for long inputs (exponential)
    for fn in (minDistance_memo, minDistance_dp, minDistance_space_opt, minDistance_single_array):
        for w1, w2, expected in cases:
            result = fn(w1, w2)
            assert result == expected, (
                f'{fn.__name__}({w1!r}, {w2!r}) = {result}, expected {expected}'
            )
    # only test recursive on short inputs
    for w1, w2, expected in cases[:4]:
        result = minDistance_recursive(w1, w2)
        assert result == expected, f'minDistance_recursive({w1!r}, {w2!r}) = {result}'
    print('All tests passed.')

# Made with Bob
