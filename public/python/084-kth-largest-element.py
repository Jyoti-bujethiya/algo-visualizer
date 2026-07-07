# LeetCode Problem #215: Kth Largest Element in an Array
# Difficulty: Medium
# Link: https://leetcode.com/problems/kth-largest-element-in-an-array/

from typing import List
import heapq
import random

# ─────────────────────────────────────────────
# APPROACH 1: Min Heap of Size K | O(n log k) time | O(k) space
# EXPLAIN: Maintain a min-heap of exactly k elements; the heap top is always the kth largest.
# WHEN: Best when k is much smaller than n.

def solve_1(nums: List[int], k: int) -> int:
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]

# ─────────────────────────────────────────────
# APPROACH 2: Sort Descending | O(n log n) time | O(1) space
# EXPLAIN: Sort in descending order and return the element at index k-1.
# WHEN: When simplicity matters and n is small.

def solve_2(nums: List[int], k: int) -> int:
    nums.sort(reverse=True)
    return nums[k - 1]

# ─────────────────────────────────────────────
# APPROACH 3: Quickselect | O(n) average time | O(log n) space
# EXPLAIN: Partition around a random pivot; recurse only on the side containing the target index.
# WHEN: Best average-case performance; preferred in interviews for O(n) guarantee.

def solve_3(nums: List[int], k: int) -> int:
    target = len(nums) - k  # kth largest = element at index n-k in ascending order

    def partition(lo: int, hi: int) -> int:
        pivot_idx = random.randint(lo, hi)
        nums[pivot_idx], nums[hi] = nums[hi], nums[pivot_idx]
        pivot = nums[hi]
        i = lo
        for j in range(lo, hi):
            if nums[j] <= pivot:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
        nums[i], nums[hi] = nums[hi], nums[i]
        return i

    def quickselect(lo: int, hi: int) -> int:
        if lo == hi:
            return nums[lo]
        p = partition(lo, hi)
        if p == target:
            return nums[p]
        elif p < target:
            return quickselect(p + 1, hi)
        else:
            return quickselect(lo, p - 1)

    return quickselect(0, len(nums) - 1)

# ─────────────────────────────────────────────
# APPROACH 4: Max Heap (Extract k Times) | O(n + k log n) time | O(n) space
# EXPLAIN: Build a max-heap from all elements, then pop k times to reach the kth largest.
# WHEN: When k is close to n, or when you want a simple heap-based solution.

def solve_4(nums: List[int], k: int) -> int:
    max_heap = [-x for x in nums]
    heapq.heapify(max_heap)
    for _ in range(k - 1):
        heapq.heappop(max_heap)
    return -max_heap[0]

# ─────────────────────────────────────────────
# APPROACH 5: Counting Sort | O(n + R) time | O(R) space
# EXPLAIN: Use a frequency array over the bounded value range [-10^4, 10^4] and scan from high to low.
# WHEN: When values are bounded in a known small range (as guaranteed by constraints).

def solve_5(nums: List[int], k: int) -> int:
    OFFSET = 10000
    R = 20001
    cnt = [0] * R
    for n in nums:
        cnt[n + OFFSET] += 1
    remain = k
    for v in range(R - 1, -1, -1):
        remain -= cnt[v]
        if remain <= 0:
            return v - OFFSET
    return -1  # unreachable

# Made with Bob
