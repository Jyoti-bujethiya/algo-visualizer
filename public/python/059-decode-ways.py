# LeetCode Problem #91: Decode Ways
# Difficulty: Medium
# Link: https://leetcode.com/problems/decode-ways/

from functools import lru_cache

# ─────────────────────────────────────────────
# APPROACH 1: Recursive Memoization | O(n) time | O(n) space
# EXPLAIN: At each position try decoding 1 or 2 characters; cache index results.
# WHEN: Natural top-down derivation — clear branching on single vs double digit.

def numDecodings_memo(s: str) -> int:
    n = len(s)

    @lru_cache(maxsize=None)
    def dp(i):
        if i == n:
            return 1
        if s[i] == '0':
            return 0
        result = dp(i + 1)
        if i + 1 < n and (s[i] == '1' or (s[i] == '2' and s[i + 1] <= '6')):
            result += dp(i + 2)
        return result

    return dp(0)


# APPROACH 2: Bottom-Up DP (right-to-left) | O(n) time | O(n) space
# EXPLAIN: dp[i] = ways to decode s[i:]; iterate backwards through the string.
# WHEN: Explicit table makes the rolling accumulation easy to verify.

def numDecodings_dp(s: str) -> int:
    n = len(s)
    dp = [0] * (n + 1)
    dp[n] = 1
    for i in range(n - 1, -1, -1):
        if s[i] != '0':
            dp[i] = dp[i + 1]
            if i + 1 < n and (s[i] == '1' or (s[i] == '2' and s[i + 1] <= '6')):
                dp[i] += dp[i + 2]
    return dp[0]


# APPROACH 3: Space-Optimised DP (right-to-left) | O(n) time | O(1) space
# EXPLAIN: Only the next two DP values are needed; replace array with two variables.
# WHEN: Best production choice — O(1) space, same linear time.

def numDecodings_space_opt(s: str) -> int:
    n = len(s)
    dp1, dp2 = 1, 0   # dp1 = dp[i+1], dp2 = dp[i+2]
    for i in range(n - 1, -1, -1):
        cur = 0
        if s[i] != '0':
            cur = dp1
            if i + 1 < n and (s[i] == '1' or (s[i] == '2' and s[i + 1] <= '6')):
                cur += dp2
        dp1, dp2 = cur, dp1
    return dp1


# APPROACH 4: Bottom-Up DP (left-to-right) | O(n) time | O(n) space
# EXPLAIN: dp[i] = ways to decode s[:i]; fill left-to-right using single and double chars.
# WHEN: Alternative left-to-right formulation; some find it more natural than right-to-left.

def numDecodings_lr(s: str) -> int:
    n = len(s)
    if n == 0 or s[0] == '0':
        return 0
    dp = [0] * (n + 1)
    dp[0] = 1
    dp[1] = 1
    for i in range(2, n + 1):
        one_digit = int(s[i - 1])
        two_digits = int(s[i - 2:i])
        if one_digit >= 1:
            dp[i] += dp[i - 1]
        if 10 <= two_digits <= 26:
            dp[i] += dp[i - 2]
    return dp[n]


# APPROACH 5: Space-Optimized Left-to-Right | O(n) time | O(1) space
# EXPLAIN: Rolling two-variable version of the left-to-right DP — Fibonacci-like update.
# WHEN: Most compact correct implementation combining left-to-right with O(1) space.

def numDecodings_lr_opt(s: str) -> int:
    n = len(s)
    if n == 0 or s[0] == '0':
        return 0
    prev2, prev1 = 1, 1  # dp[i-2], dp[i-1]
    for i in range(2, n + 1):
        cur = 0
        one_digit = int(s[i - 1])
        two_digits = int(s[i - 2:i])
        if one_digit >= 1:
            cur += prev1
        if 10 <= two_digits <= 26:
            cur += prev2
        prev2, prev1 = prev1, cur
    return prev1


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ('12', 2),
        ('226', 3),
        ('06', 0),
        ('10', 1),
        ('2611055971756562', 4),
        ('1', 1),
    ]
    for fn in (numDecodings_memo, numDecodings_dp, numDecodings_space_opt,
               numDecodings_lr, numDecodings_lr_opt):
        for s, expected in cases:
            result = fn(s)
            assert result == expected, (
                f'{fn.__name__}({s!r}) = {result}, expected {expected}'
            )
    print('All tests passed.')

# Made with Bob
