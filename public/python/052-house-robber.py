# LeetCode Problem #198: House Robber
# Difficulty: Medium
# Link: https://leetcode.com/problems/house-robber/

from typing import List

# ─────────────────────────────────────────────
# APPROACH 1: Recursive Memoization | O(n) time | O(n) space
# EXPLAIN: At each house choose max(rob current + skip one, skip current); cache results.
# WHEN: Natural top-down derivation from the recurrence relation.

from functools import lru_cache

def rob_memo(nums: List[int]) -> int:
    @lru_cache(maxsize=None)
    def dp(i):
        if i >= len(nums):
            return 0
        return max(nums[i] + dp(i + 2), dp(i + 1))
    return dp(0)


# APPROACH 2: Bottom-Up DP | O(n) time | O(n) space
# EXPLAIN: dp[i] = max money robbing from house i onward; fill backwards.
# WHEN: Explicit table makes each sub-decision visible during review.

def rob_dp(nums: List[int]) -> int:
    n = len(nums)
    if n == 0:
        return 0
    dp = [0] * (n + 2)
    for i in range(n - 1, -1, -1):
        dp[i] = max(nums[i] + dp[i + 2], dp[i + 1])
    return dp[0]


# APPROACH 3: Space-Optimised DP | O(n) time | O(1) space
# EXPLAIN: Only next two future values are needed; two rolling variables replace the array.
# WHEN: Best production choice — O(1) space with same linear time.

def rob_space_opt(nums: List[int]) -> int:
    rob1, rob2 = 0, 0
    for n in nums:
        rob1, rob2 = rob2, max(rob2, rob1 + n)
    return rob2


# APPROACH 4: Rob/Skip State Machine | O(n) time | O(1) space
# EXPLAIN: Track two states explicitly — rob current vs skip current — updating each step.
# WHEN: Alternative O(1) framing that makes the state transitions crystal-clear.

def rob_rob_skip(nums: List[int]) -> int:
    rob_val, skip_val = 0, 0
    for num in nums:
        new_rob  = skip_val + num
        new_skip = max(rob_val, skip_val)
        rob_val, skip_val = new_rob, new_skip
    return max(rob_val, skip_val)


# APPROACH 5: Concise prev/curr Rolling | O(n) time | O(1) space
# EXPLAIN: Standard Kadane-like rolling update: curr = max(prev + num, curr).
# WHEN: Most concise O(1) formulation; widely seen in accepted submissions.

def rob(nums: List[int]) -> int:
    prev, curr = 0, 0
    for num in nums:
        prev, curr = curr, max(curr, prev + num)
    return curr


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ([1, 2, 3, 1], 4),
        ([2, 7, 9, 3, 1], 12),
        ([0], 0),
        ([2, 1], 2),
        ([1, 2], 2),
    ]
    for fn in (rob_memo, rob_dp, rob_space_opt, rob_rob_skip, rob):
        for nums, expected in cases:
            result = fn(nums)
            assert result == expected, f'{fn.__name__}({nums}) = {result}, expected {expected}'
    print('All tests passed.')

# Made with Bob
