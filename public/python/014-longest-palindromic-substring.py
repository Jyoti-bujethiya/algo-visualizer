# LeetCode Problem #5: Longest Palindromic Substring
# Difficulty: Medium
# Link: https://leetcode.com/problems/longest-palindromic-substring/

# ─────────────────────────────────────────────
# APPROACH 1: Brute Force | O(n³) time | O(1) space
# EXPLAIN: Check every substring for palindrome property using a helper; keep the longest found.
# WHEN: Only for tiny inputs — O(n³) is prohibitive even for n ≈ 1000.

def longest_palindrome_brute(s: str) -> str:
    def is_palindrome(l: int, r: int) -> bool:
        while l < r:
            if s[l] != s[r]:
                return False
            l += 1; r -= 1
        return True

    n   = len(s)
    best = s[0] if s else ""
    for i in range(n):
        for j in range(i + 1, n):
            if is_palindrome(i, j) and (j - i + 1) > len(best):
                best = s[i: j + 1]
    return best


# ─────────────────────────────────────────────
# APPROACH 2: Expand Around Center | O(n²) time | O(1) space
# EXPLAIN: For each index (and each pair of adjacent indices) expand outward while characters match.
# WHEN: Clean O(n²) with tiny constant — the most practical solution for interview settings.

def longest_palindrome_expand(s: str) -> str:
    if not s:
        return ""
    start = end = 0

    def expand(l: int, r: int) -> tuple:
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1; r += 1
        return l + 1, r - 1            # last valid palindrome bounds

    for i in range(len(s)):
        l1, r1 = expand(i, i)          # odd length
        l2, r2 = expand(i, i + 1)      # even length
        if r1 - l1 > end - start:
            start, end = l1, r1
        if r2 - l2 > end - start:
            start, end = l2, r2
    return s[start: end + 1]


# ─────────────────────────────────────────────
# APPROACH 3: Dynamic Programming | O(n²) time | O(n²) space
# EXPLAIN: dp[i][j] is True if s[i..j] is a palindrome; fill by length, using the two-character base case.
# WHEN: When you need to enumerate or count all palindromic substrings alongside finding the longest.

def longest_palindrome_dp(s: str) -> str:
    n = len(s)
    if n == 0:
        return ""
    dp = [[False] * n for _ in range(n)]
    start = 0
    max_len = 1
    # All single characters are palindromes
    for i in range(n):
        dp[i][i] = True
    # Check length-2 substrings
    for i in range(n - 1):
        dp[i][i + 1] = (s[i] == s[i + 1])
        if dp[i][i + 1]:
            start   = i
            max_len = 2
    # Check lengths 3..n
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = (s[i] == s[j]) and dp[i + 1][j - 1]
            if dp[i][j] and length > max_len:
                start   = i
                max_len = length
    return s[start: start + max_len]


# ─────────────────────────────────────────────
# APPROACH 4: Manacher's Algorithm | O(n) time | O(n) space
# EXPLAIN: Transform string with separators, then propagate palindrome radius using a center-mirror trick.
# WHEN: When strictly O(n) is required; rarely asked in interviews but impressive to know.

def longest_palindrome_manacher(s: str) -> str:
    # Transform: "abc" -> "#a#b#c#"
    t = "#" + "#".join(s) + "#"
    n = len(t)
    p = [0] * n           # p[i] = radius of palindrome centred at t[i]
    center = right = 0
    for i in range(n):
        if i < right:
            mirror = 2 * center - i
            p[i] = min(right - i, p[mirror])
        # Attempt to expand
        l, r = i - p[i] - 1, i + p[i] + 1
        while l >= 0 and r < n and t[l] == t[r]:
            p[i] += 1
            l -= 1; r += 1
        if i + p[i] > right:
            center, right = i, i + p[i]
    # Find the maximum radius and map back
    max_r = max(p)
    ci    = p.index(max_r)
    start = (ci - max_r) // 2
    return s[start: start + max_r]


# ─────────────────────────────────────────────
# APPROACH 5: DP Space Optimized | O(n²) time | O(n) space
# EXPLAIN: Use two 1-D arrays (prev and curr) instead of the full n×n DP table — one diagonal at a time.
# WHEN: When you want DP correctness but cannot afford O(n²) memory.

def longest_palindrome_dp_optimized(s: str) -> str:
    n = len(s)
    if n == 0:
        return ""
    start = 0
    max_len = 1
    prev = [False] * n
    cur  = [False] * n

    for i in range(n - 1, -1, -1):
        cur = [False] * n
        cur[i] = True                      # dp[i][i] is always True
        for j in range(i + 1, n):
            if s[i] == s[j]:
                cur[j] = True if j == i + 1 else prev[j - 1]
            else:
                cur[j] = False
            if cur[j] and j - i + 1 > max_len:
                max_len = j - i + 1
                start   = i
        prev = cur

    return s[start: start + max_len]


# ─────────────────────────────────────────────
if __name__ == "__main__":
    cases = [
        ("babad",  {"bab", "aba"}),   # two valid answers
        ("cbbd",   {"bb"}),
        ("a",      {"a"}),
        ("racecar", {"racecar"}),
    ]
    for s, valid in cases:
        assert longest_palindrome_brute(s)        in valid
        assert longest_palindrome_expand(s)       in valid
        assert longest_palindrome_dp(s)           in valid
        assert longest_palindrome_manacher(s)     in valid
        assert longest_palindrome_dp_optimized(s) in valid
    print("All tests passed.")

# Made with Bob
