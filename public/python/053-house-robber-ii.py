# LeetCode Problem #213: House Robber II
# Difficulty: Medium
# Link: https://leetcode.com/problems/house-robber-ii/

from typing import List
from functools import lru_cache

# ─────────────────────────────────────────────
# APPROACH 1: Two-Pass Linear DP | O(n) time | O(1) space
# EXPLAIN: Houses form a circle so first and last cannot both be robbed; solve two
#          linear sub-problems (exclude last, exclude first) and return the max.
# WHEN: The canonical approach — reduces circular constraint to two linear passes.

def rob_circular(nums: List[int]) -> int:
    def rob_linear(houses: List[int]) -> int:
        rob1, rob2 = 0, 0
        for h in houses:
            rob1, rob2 = rob2, max(rob2, rob1 + h)
        return rob2

    if len(nums) == 1:
        return nums[0]
    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))


# APPROACH 2: Memoized Recursion with Range | O(n) time | O(n) space
# EXPLAIN: Recursive helper with lru_cache takes explicit start/end indices to
#          express the two sub-problems (skip-first vs skip-last) cleanly.
# WHEN: When you prefer a top-down style and want the two ranges explicit.

def rob_circular_memo(nums: List[int]) -> int:
    n = len(nums)
    if n == 1:
        return nums[0]

    def make_rob(lo: int, hi: int):
        @lru_cache(maxsize=None)
        def dp(i: int) -> int:
            if i > hi:
                return 0
            return max(nums[i] + dp(i + 2), dp(i + 1))
        return dp(lo)

    return max(make_rob(0, n - 2), make_rob(1, n - 1))


# APPROACH 3: Two-Pass with Explicit DP Array | O(n) time | O(n) space
# EXPLAIN: Build two full dp arrays for each linear sub-problem; useful for tracing.
# WHEN: When you need intermediate dp values for debugging or visualization.

def rob_circular_dp_array(nums: List[int]) -> int:
    n = len(nums)
    if n == 1:
        return nums[0]
    if n == 2:
        return max(nums[0], nums[1])

    def rob_range(lo: int, hi: int) -> int:
        length = hi - lo + 1
        if length == 1:
            return nums[lo]
        dp = [0] * length
        dp[0] = nums[lo]
        dp[1] = max(nums[lo], nums[lo + 1])
        for i in range(2, length):
            dp[i] = max(dp[i - 1], dp[i - 2] + nums[lo + i])
        return dp[-1]

    return max(rob_range(0, n - 2), rob_range(1, n - 1))


# APPROACH 4: Rob/Skip State Machine — Two Passes | O(n) time | O(1) space
# EXPLAIN: Apply the rob/skip state-machine from House Robber I on each of the two ranges.
# WHEN: Alternative O(1) formulation of the two-pass idea using explicit state variables.

def rob_circular_rob_skip(nums: List[int]) -> int:
    n = len(nums)
    if n == 1:
        return nums[0]
    if n == 2:
        return max(nums[0], nums[1])

    def rob_range(lo: int, hi: int) -> int:
        rob_val, skip_val = 0, 0
        for i in range(lo, hi + 1):
            new_rob  = skip_val + nums[i]
            new_skip = max(rob_val, skip_val)
            rob_val, skip_val = new_rob, new_skip
        return max(rob_val, skip_val)

    return max(rob_range(0, n - 2), rob_range(1, n - 1))


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ([2, 3, 2], 3),
        ([1, 2, 3, 1], 4),
        ([1, 2, 3], 3),
        ([0], 0),
        ([1], 1),
    ]
    for fn in (rob_circular, rob_circular_memo, rob_circular_dp_array, rob_circular_rob_skip):
        for nums, expected in cases:
            result = fn(nums)
            assert result == expected, f'{fn.__name__}({nums}) = {result}, expected {expected}'
    print('All tests passed.')

# Made with Bob
