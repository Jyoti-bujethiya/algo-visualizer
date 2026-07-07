# LeetCode Problem #34: Find First and Last Position of Element in Sorted Array
# Difficulty: Medium
# Link: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/

import bisect

# ─────────────────────────────────────────────
# APPROACH 1: Linear Scan | O(n) time | O(1) space
# EXPLAIN: Walk once from both ends to find first and last occurrence.
# WHEN: When the array is small or nearly unsorted and you need a fallback without binary search.

def search_range_linear(nums: list[int], target: int) -> list[int]:
    first = last = -1
    for i, v in enumerate(nums):
        if v == target:
            if first == -1:
                first = i
            last = i
    return [first, last]


# ─────────────────────────────────────────────
# APPROACH 2: Two Binary Searches | O(log n) time | O(1) space
# EXPLAIN: Use bisect_left for the first position and bisect_right - 1 for the last.
# WHEN: Optimal — two independent binary searches, each O(log n); use in every production/interview context.

def search_range_binary(nums: list[int], target: int) -> list[int]:
    left  = bisect.bisect_left(nums, target)
    # If target not present, bisect_left lands on a different value
    if left >= len(nums) or nums[left] != target:
        return [-1, -1]
    right = bisect.bisect_right(nums, target) - 1
    return [left, right]


# ─────────────────────────────────────────────
# APPROACH 3: Manual Binary Search | O(log n) time | O(1) space
# EXPLAIN: Implement both left-boundary and right-boundary binary searches from scratch without the bisect module.
# WHEN: When you want to show explicit binary search implementation and handle edge cases manually.

def search_range_manual(nums: list[int], target: int) -> list[int]:
    def find_left(nums: list[int], target: int) -> int:
        lo, hi, pos = 0, len(nums) - 1, -1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                pos = mid
                hi  = mid - 1        # keep searching left
            elif nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return pos

    def find_right(nums: list[int], target: int) -> int:
        lo, hi, pos = 0, len(nums) - 1, -1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                pos = mid
                lo  = mid + 1        # keep searching right
            elif nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return pos

    return [find_left(nums, target), find_right(nums, target)]


# ─────────────────────────────────────────────
# APPROACH 4: Single Binary Search with Flag | O(log n) time | O(1) space
# EXPLAIN: One helper accepts a boolean; when find_first=True bias left, otherwise bias right — DRY version.
# WHEN: When you want a compact, single-function solution that avoids code duplication.

def search_range_flag(nums: list[int], target: int) -> list[int]:
    def binary_search(find_first: bool) -> int:
        lo, hi, pos = 0, len(nums) - 1, -1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                pos = mid
                if find_first:
                    hi = mid - 1
                else:
                    lo = mid + 1
            elif nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return pos

    return [binary_search(True), binary_search(False)]


# ─────────────────────────────────────────────
# APPROACH 5: Recursive Binary Search | O(log n) time | O(log n) space
# EXPLAIN: Implement both boundary searches recursively; stack depth is O(log n).
# WHEN: When a recursive solution is preferred or required to demonstrate recursion.

def search_range_recursive(nums: list[int], target: int) -> list[int]:
    def find_first(lo: int, hi: int) -> int:
        if lo > hi:
            return -1
        mid = (lo + hi) // 2
        if nums[mid] == target:
            left = find_first(lo, mid - 1)
            return left if left != -1 else mid
        elif nums[mid] < target:
            return find_first(mid + 1, hi)
        else:
            return find_first(lo, mid - 1)

    def find_last(lo: int, hi: int) -> int:
        if lo > hi:
            return -1
        mid = (lo + hi) // 2
        if nums[mid] == target:
            right = find_last(mid + 1, hi)
            return right if right != -1 else mid
        elif nums[mid] < target:
            return find_last(mid + 1, hi)
        else:
            return find_last(lo, mid - 1)

    n = len(nums)
    return [find_first(0, n - 1), find_last(0, n - 1)]


# ─────────────────────────────────────────────
if __name__ == "__main__":
    cases = [
        ([5,7,7,8,8,10], 8, [3, 4]),
        ([5,7,7,8,8,10], 6, [-1,-1]),
        ([],              0, [-1,-1]),
        ([1],             1, [0, 0]),
    ]
    for nums, target, expected in cases:
        assert search_range_linear(nums, target)    == expected
        assert search_range_binary(nums, target)    == expected
        assert search_range_manual(nums, target)    == expected
        assert search_range_flag(nums, target)      == expected
        assert search_range_recursive(nums, target) == expected
    print("All tests passed.")

# Made with Bob
