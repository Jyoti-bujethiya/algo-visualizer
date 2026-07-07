# LeetCode Problem #4: Median of Two Sorted Arrays
# Difficulty: Hard
# Link: https://leetcode.com/problems/median-of-two-sorted-arrays/

from typing import List

# ─────────────────────────────────────────────
# APPROACH 1: Binary Search on Smaller Array | O(log(min(m,n))) time | O(1) space
# EXPLAIN: Binary search a partition point on the smaller array; the correct partition satisfies maxLeft <= minRight on both sides.
# WHEN: Optimal — required by the problem's O(log(m+n)) constraint.

def solve_1(nums1: List[int], nums2: List[int]) -> float:
    if len(nums1) > len(nums2):
        return solve_1(nums2, nums1)
    m, n = len(nums1), len(nums2)
    left, right = 0, m
    while left <= right:
        p1 = (left + right) // 2
        p2 = (m + n + 1) // 2 - p1
        max_left1  = float('-inf') if p1 == 0 else nums1[p1 - 1]
        min_right1 = float('inf')  if p1 == m else nums1[p1]
        max_left2  = float('-inf') if p2 == 0 else nums2[p2 - 1]
        min_right2 = float('inf')  if p2 == n else nums2[p2]
        if max_left1 <= min_right2 and max_left2 <= min_right1:
            if (m + n) % 2 == 1:
                return float(max(max_left1, max_left2))
            return (max(max_left1, max_left2) + min(min_right1, min_right2)) / 2.0
        elif max_left1 > min_right2:
            right = p1 - 1
        else:
            left = p1 + 1
    return 0.0

# ─────────────────────────────────────────────
# APPROACH 2: Merge and Find Median | O(m+n) time | O(m+n) space
# EXPLAIN: Merge both sorted arrays into one, then directly compute the median from the middle.
# WHEN: Simple and correct; use when O(m+n) space is acceptable.

def solve_2(nums1: List[int], nums2: List[int]) -> float:
    merged = []
    i = j = 0
    while i < len(nums1) and j < len(nums2):
        if nums1[i] < nums2[j]:
            merged.append(nums1[i]); i += 1
        else:
            merged.append(nums2[j]); j += 1
    merged.extend(nums1[i:])
    merged.extend(nums2[j:])
    n = len(merged)
    if n % 2 == 1:
        return float(merged[n // 2])
    return (merged[n // 2 - 1] + merged[n // 2]) / 2.0

# ─────────────────────────────────────────────
# APPROACH 3: Two Pointers (No Merge Array) | O(m+n) time | O(1) space
# EXPLAIN: Advance two pointers without allocating a merge array; stop at the median position.
# WHEN: O(m+n) time with O(1) space; good when memory is constrained.

def solve_3(nums1: List[int], nums2: List[int]) -> float:
    m, n = len(nums1), len(nums2)
    total = m + n
    i = j = 0
    prev = curr = 0
    for _ in range(total // 2 + 1):
        prev = curr
        if i < m and (j >= n or nums1[i] < nums2[j]):
            curr = nums1[i]; i += 1
        else:
            curr = nums2[j]; j += 1
    if total % 2 == 1:
        return float(curr)
    return (prev + curr) / 2.0

# ─────────────────────────────────────────────
# APPROACH 4: Recursive Kth Element | O(log(m+n)) time | O(log(m+n)) space
# EXPLAIN: Reduce to finding the kth element by eliminating k//2 elements per recursive call.
# WHEN: Elegant recursive formulation of the O(log(m+n)) solution.

def solve_4(nums1: List[int], nums2: List[int]) -> float:
    def find_kth(i: int, j: int, k: int) -> int:
        if i >= len(nums1):
            return nums2[j + k - 1]
        if j >= len(nums2):
            return nums1[i + k - 1]
        if k == 1:
            return min(nums1[i], nums2[j])
        half = k // 2
        mid1 = nums1[i + half - 1] if i + half - 1 < len(nums1) else float('inf')
        mid2 = nums2[j + half - 1] if j + half - 1 < len(nums2) else float('inf')
        if mid1 < mid2:
            return find_kth(i + half, j, k - half)
        else:
            return find_kth(i, j + half, k - half)

    total = len(nums1) + len(nums2)
    if total % 2 == 1:
        return float(find_kth(0, 0, total // 2 + 1))
    return (find_kth(0, 0, total // 2) + find_kth(0, 0, total // 2 + 1)) / 2.0

# ─────────────────────────────────────────────
# APPROACH 5: Concatenate and Sort | O((m+n) log(m+n)) time | O(m+n) space
# EXPLAIN: Combine both arrays, sort, then find the median directly.
# WHEN: Simplest implementation; not optimal but useful as a quick validation.

def solve_5(nums1: List[int], nums2: List[int]) -> float:
    merged = sorted(nums1 + nums2)
    n = len(merged)
    if n % 2 == 1:
        return float(merged[n // 2])
    return (merged[n // 2 - 1] + merged[n // 2]) / 2.0

# Made with Bob
