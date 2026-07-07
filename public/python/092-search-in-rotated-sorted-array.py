# LeetCode Problem #33: Search in Rotated Sorted Array
# Difficulty: Medium
# Link: https://leetcode.com/problems/search-in-rotated-sorted-array/

from typing import List

# ─────────────────────────────────────────────
# APPROACH 1: One-Pass Modified Binary Search | O(log n) time | O(1) space
# EXPLAIN: One half of the array is always sorted; use that fact to decide which half to search.
# WHEN: Optimal — single binary search pass, no preprocessing.

def solve_1(nums: List[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:          # left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:                                # right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1

# ─────────────────────────────────────────────
# APPROACH 2: Find Pivot then Binary Search | O(log n) time | O(1) space
# EXPLAIN: First binary-search for the rotation pivot, then standard binary search in the correct half.
# WHEN: When separating concerns (find pivot, then search) makes the logic clearer.

def solve_2(nums: List[int], target: int) -> int:
    def find_pivot() -> int:
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = lo + (hi - lo) // 2
            if nums[mid] > nums[hi]:
                lo = mid + 1
            else:
                hi = mid
        return lo

    def binary_search(lo: int, hi: int) -> int:
        while lo <= hi:
            mid = lo + (hi - lo) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return -1

    n = len(nums)
    pivot = find_pivot()
    if pivot == 0 or target < nums[0]:
        return binary_search(pivot, n - 1)
    return binary_search(0, pivot - 1)

# ─────────────────────────────────────────────
# APPROACH 3: Recursive Modified Binary Search | O(log n) time | O(log n) space
# EXPLAIN: Recursive version of Approach 1; same sorted-half logic but expressed recursively.
# WHEN: When recursive style aids comprehension during explanation.

def solve_3(nums: List[int], target: int) -> int:
    def helper(lo: int, hi: int) -> int:
        if lo > hi:
            return -1
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                return helper(lo, mid - 1)
            return helper(mid + 1, hi)
        else:
            if nums[mid] < target <= nums[hi]:
                return helper(mid + 1, hi)
            return helper(lo, mid - 1)

    return helper(0, len(nums) - 1)

# ─────────────────────────────────────────────
# APPROACH 4: Linear Scan | O(n) time | O(1) space
# EXPLAIN: Simple linear scan; rotation does not affect correctness, only efficiency.
# WHEN: Baseline only; illustrates the cost avoided by binary search.

def solve_4(nums: List[int], target: int) -> int:
    for i, num in enumerate(nums):
        if num == target:
            return i
    return -1

# ─────────────────────────────────────────────
# APPROACH 5: Index Remapping Binary Search | O(log n) time | O(1) space
# EXPLAIN: Remap each index through the pivot offset so the array appears unrotated to binary search.
# WHEN: Elegant alternative that unifies the rotation into index arithmetic rather than case analysis.

def solve_5(nums: List[int], target: int) -> int:
    n = len(nums)
    # find pivot (index of minimum element)
    lo, hi = 0, n - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    pivot = lo
    # Binary search treating the rotated array as [0..n-1] remapped
    lo, hi = 0, n - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        real_mid = (mid + pivot) % n
        if nums[real_mid] == target:
            return real_mid
        elif nums[real_mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

# Made with Bob
