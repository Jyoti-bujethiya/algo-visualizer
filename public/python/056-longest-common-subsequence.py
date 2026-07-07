# LeetCode Problem #1143: Longest Common Subsequence
# Difficulty: Medium
# Link: https://leetcode.com/problems/longest-common-subsequence/

from functools import lru_cache

# ─────────────────────────────────────────────
# APPROACH 1: Recursive Memoization | O(mn) time | O(mn) space
# EXPLAIN: At each pair of indices, either characters match (extend LCS) or skip one string.
# WHEN: Clean top-down derivation; use when the recurrence is the focus.

def longestCommonSubsequence_memo(text1: str, text2: str) -> int:
    @lru_cache(maxsize=None)
    def dp(i, j):
        if i == len(text1) or j == len(text2):
            return 0
        if text1[i] == text2[j]:
            return 1 + dp(i + 1, j + 1)
        return max(dp(i + 1, j), dp(i, j + 1))
    return dp(0, 0)


# APPROACH 2: Bottom-Up 2D DP | O(mn) time | O(mn) space
# EXPLAIN: dp[i][j] = LCS of text1[:i] and text2[:j]; fill row by row.
# WHEN: Standard interview answer — explicit table, easy to trace.

def longestCommonSubsequence_dp(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]


# APPROACH 3: Space-Optimised DP (two rows) | O(mn) time | O(min(m,n)) space
# EXPLAIN: Only the current and previous row are needed; use two 1-D arrays.
# WHEN: Memory is tight — cuts space from O(mn) to O(n).

def longestCommonSubsequence_space_opt(text1: str, text2: str) -> int:
    if len(text1) < len(text2):
        text1, text2 = text2, text1
    n = len(text2)
    prev = [0] * (n + 1)
    for ch1 in text1:
        curr = [0] * (n + 1)
        for j, ch2 in enumerate(text2, 1):
            if ch1 == ch2:
                curr[j] = 1 + prev[j - 1]
            else:
                curr[j] = max(prev[j], curr[j - 1])
        prev = curr
    return prev[n]


# APPROACH 4: Single-Array In-Place DP | O(mn) time | O(min(m,n)) space
# EXPLAIN: Use one 1-D array updating in-place with a saved diagonal value (prev variable).
# WHEN: Most memory-efficient; useful when even two arrays feel heavy.

def longestCommonSubsequence_single_array(text1: str, text2: str) -> int:
    if len(text1) < len(text2):
        text1, text2 = text2, text1
    n = len(text2)
    dp = [0] * (n + 1)
    for ch1 in text1:
        prev = 0
        for j in range(1, n + 1):
            temp = dp[j]
            if ch1 == text2[j - 1]:
                dp[j] = prev + 1
            else:
                dp[j] = max(dp[j], dp[j - 1])
            prev = temp
    return dp[n]


# APPROACH 5: LCS with Path Reconstruction | O(mn) time | O(mn) space
# EXPLAIN: Build 2D DP table then backtrack to recover the actual LCS string.
# WHEN: When you need the literal LCS string, not just its length.

def longestCommonSubsequence_with_path(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    # backtrack
    lcs = []
    i, j = m, n
    while i > 0 and j > 0:
        if text1[i - 1] == text2[j - 1]:
            lcs.append(text1[i - 1]); i -= 1; j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return dp[m][n]  # also sets lcs = list(reversed(lcs))


# APPROACH 6: Standard Solution (alias) | O(mn) time | O(mn) space
# EXPLAIN: Canonical 2D DP — most commonly used in interviews.
# WHEN: Use when a simple, unambiguous implementation is required.

def longestCommonSubsequence(text1: str, text2: str) -> int:
    return longestCommonSubsequence_dp(text1, text2)


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ('abcde', 'ace', 3),
        ('abc', 'abc', 3),
        ('abc', 'def', 0),
        ('bl', 'yby', 1),
    ]
    for fn in (longestCommonSubsequence_memo, longestCommonSubsequence_dp,
               longestCommonSubsequence_space_opt, longestCommonSubsequence_single_array,
               longestCommonSubsequence_with_path, longestCommonSubsequence):
        for t1, t2, expected in cases:
            result = fn(t1, t2)
            assert result == expected, (
                f'{fn.__name__}({t1!r}, {t2!r}) = {result}, expected {expected}'
            )
    print('All tests passed.')

# Made with Bob
