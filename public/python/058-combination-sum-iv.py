# LeetCode Problem #377: Combination Sum IV
# Difficulty: Medium
# Link: https://leetcode.com/problems/combination-sum-iv/

from functools import lru_cache
from typing import List

# ─────────────────────────────────────────────
# APPROACH 1: Recursive Memoization | O(t·n) time | O(t) space
# EXPLAIN: For each remaining target, try all numbers; sum of ways to reach (target - num).
# WHEN: Intuitive top-down; great for understanding the order-matters distinction.

def combinationSum4_memo(nums: List[int], target: int) -> int:
    @lru_cache(maxsize=None)
    def dp(rem):
        if rem == 0:
            return 1
        return sum(dp(rem - n) for n in nums if rem >= n)
    return dp(target)


# APPROACH 2: Bottom-Up DP | O(t·n) time | O(t) space
# EXPLAIN: dp[i] = number of ordered combinations summing to i; fill 1..target.
# WHEN: Best production choice — avoids recursion overhead, simple loop.

def combinationSum4_dp(nums: List[int], target: int) -> int:
    dp = [0] * (target + 1)
    dp[0] = 1
    for i in range(1, target + 1):
        for n in nums:
            if i >= n:
                dp[i] += dp[i - n]
    return dp[target]


# APPROACH 3: Bottom-Up DP with Sorted Early-Exit | O(t·n) time | O(t) space
# EXPLAIN: Sort nums ascending; break when num > i to skip unnecessary iterations.
# WHEN: Tiny practical speedup when nums contains large denominators.

def combinationSum4_sorted(nums: List[int], target: int) -> int:
    nums_sorted = sorted(nums)
    dp = [0] * (target + 1)
    dp[0] = 1
    for i in range(1, target + 1):
        for n in nums_sorted:
            if n > i:
                break
            dp[i] += dp[i - n]
    return dp[target]


# APPROACH 4: Top-Down with Explicit Cache Dict | O(t·n) time | O(t) space
# EXPLAIN: Manual dict cache instead of lru_cache — identical logic, explicit control.
# WHEN: Environments without lru_cache or where cache introspection is needed.

def combinationSum4_dict_cache(nums: List[int], target: int) -> int:
    cache: dict[int, int] = {0: 1}

    def dp(rem):
        if rem in cache:
            return cache[rem]
        total = sum(dp(rem - n) for n in nums if rem >= n)
        cache[rem] = total
        return total

    return dp(target)


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ([1, 2, 3], 4, 7),
        ([9], 3, 0),
        ([1, 2, 3], 0, 1),
        ([1], 1, 1),
        ([2, 1, 3], 35, 1132436852),
    ]
    for fn in (combinationSum4_memo, combinationSum4_dp, combinationSum4_sorted,
               combinationSum4_dict_cache):
        for nums, target, expected in cases:
            result = fn(nums, target)
            assert result == expected, (
                f'{fn.__name__}({nums}, {target}) = {result}, expected {expected}'
            )
    print('All tests passed.')

# Made with Bob
