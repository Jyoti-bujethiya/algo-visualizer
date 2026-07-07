# LeetCode Problem #215: Kth Largest Element in an Array
# Difficulty: Medium
# Link: https://leetcode.com/problems/kth-largest-element-in-an-array/

from typing import List
import heapq
import random

# ─────────────────────────────────────────────
# APPROACH 1: Quickselect | O(n) average time | O(1) space
# EXPLAIN: Partition around a pivot in descending order; recurse on the side containing the kth position.
# WHEN: Best average-case O(n); preferred when you want to avoid extra space.

def solve_1(nums: List[int], k: int) -> int:
    def partition(lo: int, hi: int) -> int:
        pivot = nums[hi]
        i = lo
        for j in range(lo, hi):
            if nums[j] >= pivot:  # descending partition for kth largest
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
        nums[i], nums[hi] = nums[hi], nums[i]
        return i

    def quickselect(lo: int, hi: int) -> int:
        if lo == hi:
            return nums[lo]
        p = partition(lo, hi)
        if p == k - 1:
            return nums[p]
        elif p < k - 1:
            return quickselect(p + 1, hi)
        else:
            return quickselect(lo, p - 1)

    return quickselect(0, len(nums) - 1)

# ─────────────────────────────────────────────
# APPROACH 2: Min Heap of Size K | O(n log k) time | O(k) space
# EXPLAIN: Maintain a min-heap of size k; the heap top is always the kth largest element seen so far.
# WHEN: Best when k << n; works well for streaming data.

def solve_2(nums: List[int], k: int) -> int:
    min_heap: list = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]

# ─────────────────────────────────────────────
# APPROACH 3: Sort Descending | O(n log n) time | O(1) space
# EXPLAIN: Sort in descending order and directly index position k-1.
# WHEN: Simplest implementation; acceptable for small arrays.

def solve_3(nums: List[int], k: int) -> int:
    nums.sort(reverse=True)
    return nums[k - 1]

# ─────────────────────────────────────────────
# APPROACH 4: Max Heap (Extract k Times) | O(n + k log n) time | O(n) space
# EXPLAIN: Build a max-heap, then pop k times to reach the kth largest.
# WHEN: When k is close to n; straightforward max-heap extraction.

def solve_4(nums: List[int], k: int) -> int:
    max_heap = [-x for x in nums]
    heapq.heapify(max_heap)
    for _ in range(k - 1):
        heapq.heappop(max_heap)
    return -max_heap[0]

# ─────────────────────────────────────────────
# APPROACH 5: heapq.nlargest | O(n log k) time | O(k) space
# EXPLAIN: Use Python's heapq.nlargest which returns the k largest elements; take the last one.
# WHEN: Most concise standard-library solution; nlargest uses a min-heap of size k internally.

def solve_5(nums: List[int], k: int) -> int:
    return heapq.nlargest(k, nums)[-1]

# Made with Bob
