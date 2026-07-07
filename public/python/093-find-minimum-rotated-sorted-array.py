# LeetCode Problem #153: Find Minimum in Rotated Sorted Array
# Difficulty: Medium
# Link: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/

from typing import List

# ─────────────────────────────────────────────
# APPROACH 1: Binary Search (Compare to Right) | O(log n) time | O(1) space
# EXPLAIN: If nums[mid] > nums[right], minimum is in the right half; otherwise in the left half including mid.
# WHEN: Optimal — standard O(log n) solution for rotated sorted array minimum.

def solve_1(nums: List[int]) -> int:
    left, right = 0, len(nums) - 1
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    return nums[left]

# ─────────────────────────────────────────────
# APPROACH 2: Binary Search (Compare to Left) | O(log n) time | O(1) space
# EXPLAIN: Short-circuit if the range is already sorted (nums[left] < nums[right]); otherwise compare to left.
# WHEN: Slightly different formulation that exits early when a subarray is already sorted.

def solve_2(nums: List[int]) -> int:
    left, right = 0, len(nums) - 1
    while left < right:
        if nums[left] < nums[right]:
            return nums[left]
        mid = left + (right - left) // 2
        if nums[mid] >= nums[left]:
            left = mid + 1
        else:
            right = mid
    return nums[left]

# ─────────────────────────────────────────────
# APPROACH 3: Recursive Binary Search | O(log n) time | O(log n) space
# EXPLAIN: Same binary search logic but expressed recursively with early-exit for sorted ranges.
# WHEN: When recursive formulation aids explanation of the invariant.

def solve_3(nums: List[int]) -> int:
    def helper(lo: int, hi: int) -> int:
        if lo == hi:
            return nums[lo]
        if nums[lo] < nums[hi]:
            return nums[lo]
        mid = lo + (hi - lo) // 2
        if nums[mid] > nums[hi]:
            return helper(mid + 1, hi)
        else:
            return helper(lo, mid)

    return helper(0, len(nums) - 1)

# ─────────────────────────────────────────────
# APPROACH 4: Linear Scan | O(n) time | O(1) space
# EXPLAIN: Scan every element and track the running minimum; no assumptions about rotation.
# WHEN: Baseline only; use when the array may contain duplicates or special structure is unclear.

def solve_4(nums: List[int]) -> int:
    min_val = nums[0]
    for num in nums:
        min_val = min(min_val, num)
    return min_val

# ─────────────────────────────────────────────
# APPROACH 5: Built-in min() | O(n) time | O(1) space
# EXPLAIN: Delegate to Python's built-in min function; internally a linear scan.
# WHEN: When brevity is acceptable in non-competitive contexts or quick prototyping.

def solve_5(nums: List[int]) -> int:
    return min(nums)

# Made with Bob
