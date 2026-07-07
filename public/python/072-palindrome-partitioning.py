# LeetCode Problem #131: Palindrome Partitioning
# Difficulty: Medium
# Link: https://leetcode.com/problems/palindrome-partitioning/

from typing import List

# ─────────────────────────────────────────────
# APPROACH 1: Backtracking with Palindrome Check | O(n·2ⁿ) time | O(n) space
# EXPLAIN: Try all substrings from current index; if palindrome, add and recurse on remainder.
# WHEN: Simple and intuitive — the standard interview answer.

def partition_backtrack(s: str) -> List[List[str]]:
    result = []

    def is_palindrome(left, right):
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True

    def backtrack(start, current):
        if start == len(s):
            result.append(list(current))
            return
        for end in range(start, len(s)):
            if is_palindrome(start, end):
                current.append(s[start:end + 1])
                backtrack(end + 1, current)
                current.pop()

    backtrack(0, [])
    return result


# APPROACH 2: Backtracking with DP Palindrome Table | O(n²) preprocess + O(2ⁿ) time | O(n²) space
# EXPLAIN: Precompute dp[i][j]=True if s[i..j] is a palindrome; use O(1) lookup in backtracking.
# WHEN: Best when the string is long — amortises palindrome check cost across all calls.

def partition_dp(s: str) -> List[List[str]]:
    n = len(s)
    dp = [[False] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = True
    for i in range(n - 1):
        dp[i][i + 1] = (s[i] == s[i + 1])
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = (s[i] == s[j]) and dp[i + 1][j - 1]

    result = []

    def backtrack(start, current):
        if start == n:
            result.append(list(current))
            return
        for end in range(start, n):
            if dp[start][end]:
                current.append(s[start:end + 1])
                backtrack(end + 1, current)
                current.pop()

    backtrack(0, [])
    return result


# APPROACH 3: Backtracking with Memoised Palindrome Check | O(n·2ⁿ) time | O(n²) space
# EXPLAIN: Cache palindrome results for (left, right) pairs; avoid recomputing the same check.
# WHEN: Middle ground between approaches 1 and 2 — simple code with memoisation.

def partition_memo(s: str) -> List[List[str]]:
    cache = {}

    def is_palindrome(left, right):
        if (left, right) in cache:
            return cache[(left, right)]
        l, r = left, right
        while l < r:
            if s[l] != s[r]:
                cache[(left, right)] = False
                return False
            l += 1
            r -= 1
        cache[(left, right)] = True
        return True

    result = []

    def backtrack(start, current):
        if start == len(s):
            result.append(list(current))
            return
        for end in range(start, len(s)):
            if is_palindrome(start, end):
                current.append(s[start:end + 1])
                backtrack(end + 1, current)
                current.pop()

    backtrack(0, [])
    return result


# APPROACH 4: Iterative DP | O(n²·2ⁿ) time | O(n·2ⁿ) space
# EXPLAIN: dp[i] stores all valid partitions of s[:i]; extend by palindromic substrings ending at i.
# WHEN: Iterative alternative to recursion; useful when stack depth is a concern.

def partition_iterative(s: str) -> List[List[str]]:
    n = len(s)
    dp: List[List[List[str]]] = [[] for _ in range(n + 1)]
    dp[0] = [[]]

    def is_palindrome(l, r):
        while l < r:
            if s[l] != s[r]:
                return False
            l += 1
            r -= 1
        return True

    for i in range(1, n + 1):
        for j in range(i):
            if is_palindrome(j, i - 1):
                palindrome = s[j:i]
                for prev in dp[j]:
                    dp[i].append(prev + [palindrome])
    return dp[n]


# APPROACH 5: Standard (entry point — DP table backtracking) | O(n²+2ⁿ) time | O(n²) space
# EXPLAIN: Standard canonical solution used in LeetCode submissions.
# WHEN: Default choice combining optimal palindrome precomputation with backtracking.

def partition(s: str) -> List[List[str]]:
    return partition_dp(s)


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    def normalise(parts):
        return sorted(tuple(p) for p in parts)

    cases = [
        ("aab", [["a", "a", "b"], ["aa", "b"]]),
        ("a",   [["a"]]),
    ]
    fns = [partition_backtrack, partition_dp, partition_memo,
           partition_iterative, partition]
    for fn in fns:
        for s, expected in cases:
            assert normalise(fn(s)) == normalise(expected), f'{fn.__name__}({s!r}) mismatch'
    print('All tests passed.')

# Made with Bob
