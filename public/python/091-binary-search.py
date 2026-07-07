# LeetCode Problem #704: Binary Search
# Difficulty: Easy
# Link: https://leetcode.com/problems/binary-search/

from typing import List
import bisect

# ─────────────────────────────────────────────
# APPROACH 1: Iterative Binary Search | O(log n) time | O(1) space
# EXPLAIN: Maintain left/right pointers and halve the search space each iteration.
# WHEN: Optimal and preferred; standard iterative implementation with no stack overhead.

def solve_1(nums: List[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# ─────────────────────────────────────────────
# APPROACH 2: Recursive Binary Search | O(log n) time | O(log n) space
# EXPLAIN: Same logic as iterative but expressed as a recursive helper function.
# WHEN: When recursive thinking is preferred; adds O(log n) stack depth.

def solve_2(nums: List[int], target: int) -> int:
    def helper(left: int, right: int) -> int:
        if left > right:
            return -1
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            return helper(mid + 1, right)
        else:
            return helper(left, mid - 1)

    return helper(0, len(nums) - 1)

# ─────────────────────────────────────────────
# APPROACH 3: bisect (Standard Library) | O(log n) time | O(1) space
# EXPLAIN: Use Python's bisect.bisect_left to find the insertion point, then verify.
# WHEN: When leveraging the standard library is acceptable; most concise implementation.

def solve_3(nums: List[int], target: int) -> int:
    idx = bisect.bisect_left(nums, target)
    if idx < len(nums) and nums[idx] == target:
        return idx
    return -1

# ─────────────────────────────────────────────
# APPROACH 4: Linear Search | O(n) time | O(1) space
# EXPLAIN: Scan every element until target is found; baseline comparison only.
# WHEN: Only for understanding why binary search is better; never use on sorted arrays.

def solve_4(nums: List[int], target: int) -> int:
    for i, num in enumerate(nums):
        if num == target:
            return i
    return -1

# ─────────────────────────────────────────────
# APPROACH 5: Binary Search with Bounds Check | O(log n) time | O(1) space
# EXPLAIN: Add early exit if target is outside [nums[0], nums[-1]] before the main loop.
# WHEN: When many queries fall outside the array range and early-exit saves real work.

def solve_5(nums: List[int], target: int) -> int:
    if not nums or target < nums[0] or target > nums[-1]:
        return -1
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Made with Bob
