# LeetCode Problem #416: Partition Equal Subset Sum
# Difficulty: Medium
# Link: https://leetcode.com/problems/partition-equal-subset-sum/

from functools import lru_cache
from typing import List

# ─────────────────────────────────────────────
# APPROACH 1: Recursive Memoization | O(n·sum) time | O(n·sum) space
# EXPLAIN: For each item decide include or exclude; cache (index, remaining target).
# WHEN: Clear top-down derivation of the 0/1 knapsack recurrence.

def canPartition_memo(nums: List[int]) -> bool:
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2

    @lru_cache(maxsize=None)
    def dp(i, rem):
        if rem == 0:
            return True
        if i == len(nums) or rem < 0:
            return False
        return dp(i + 1, rem - nums[i]) or dp(i + 1, rem)

    return dp(0, target)


# APPROACH 2: Bottom-Up DP (1-D bitset) | O(n·sum) time | O(sum) space
# EXPLAIN: Use a boolean set of reachable sums; for each number extend all current sums.
# WHEN: Best practical choice — concise, no recursion, O(sum) space via set / bitmask.

def canPartition_dp(nums: List[int]) -> bool:
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    dp = {0}
    for n in nums:
        dp = {s + n for s in dp} | dp
        if target in dp:
            return True
    return False


# APPROACH 3: 2D Bottom-Up DP | O(n·sum) time | O(n·sum) space
# EXPLAIN: dp[i][s] = can first i items form sum s; classic 0/1 knapsack table.
# WHEN: When you need to inspect intermediate dp values or reconstruct the partition.

def canPartition_2d(nums: List[int]) -> bool:
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    n = len(nums)
    dp = [[False] * (target + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = True
    for i in range(1, n + 1):
        for s in range(1, target + 1):
            dp[i][s] = dp[i - 1][s]
            if s >= nums[i - 1]:
                dp[i][s] = dp[i][s] or dp[i - 1][s - nums[i - 1]]
    return dp[n][target]


# APPROACH 4: 1-D Array DP (reverse iteration) | O(n·sum) time | O(sum) space
# EXPLAIN: Standard 0/1 knapsack with reverse-order inner loop to avoid item reuse.
# WHEN: Most memory-efficient array approach; canonical 0/1 knapsack reduction.

def canPartition_1d(nums: List[int]) -> bool:
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
    return dp[target]


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ([1, 5, 11, 5], True),
        ([1, 2, 3, 5], False),
        ([1, 1], True),
        ([1], False),
        ([3, 3, 3, 4, 5], True),
    ]
    for fn in (canPartition_memo, canPartition_dp, canPartition_2d, canPartition_1d):
        for nums, expected in cases:
            result = fn(nums)
            assert result == expected, (
                f'{fn.__name__}({nums}) = {result}, expected {expected}'
            )
    print('All tests passed.')

# Made with Bob
