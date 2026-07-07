# LeetCode Problem #973: K Closest Points to Origin
# Difficulty: Medium
# Link: https://leetcode.com/problems/k-closest-points-to-origin/

from typing import List
import heapq
import random

def dist2(p: List[int]) -> int:
    return p[0] * p[0] + p[1] * p[1]

# ─────────────────────────────────────────────
# APPROACH 1: Sort by Distance² | O(n log n) time | O(1) space
# EXPLAIN: Sort all points by squared Euclidean distance and return the first k.
# WHEN: Simplest approach; fine when n is small or code clarity matters most.

def solve_1(points: List[List[int]], k: int) -> List[List[int]]:
    points.sort(key=dist2)
    return points[:k]

# ─────────────────────────────────────────────
# APPROACH 2: Max Heap of Size K | O(n log k) time | O(k) space
# EXPLAIN: Maintain a max-heap of size k; evict the farthest point whenever the heap exceeds k.
# WHEN: Best when k << n; avoids sorting the full array.

def solve_2(points: List[List[int]], k: int) -> List[List[int]]:
    max_heap: list = []
    for i, p in enumerate(points):
        heapq.heappush(max_heap, (-dist2(p), i))
        if len(max_heap) > k:
            heapq.heappop(max_heap)
    return [points[i] for _, i in max_heap]

# ─────────────────────────────────────────────
# APPROACH 3: Quickselect (nth_element) | O(n) average time | O(1) space
# EXPLAIN: Partially partition the array so the first k elements are the k closest (unsorted).
# WHEN: Best average-case performance; equivalent to C++ nth_element.

def solve_3(points: List[List[int]], k: int) -> List[List[int]]:
    def partition(lo: int, hi: int) -> int:
        pivot_idx = random.randint(lo, hi)
        points[pivot_idx], points[hi] = points[hi], points[pivot_idx]
        pivot = dist2(points[hi])
        i = lo
        for j in range(lo, hi):
            if dist2(points[j]) <= pivot:
                points[i], points[j] = points[j], points[i]
                i += 1
        points[i], points[hi] = points[hi], points[i]
        return i

    def quickselect(lo: int, hi: int) -> None:
        if lo >= hi:
            return
        p = partition(lo, hi)
        if p == k:
            return
        elif p < k:
            quickselect(p + 1, hi)
        else:
            quickselect(lo, p - 1)

    quickselect(0, len(points) - 1)
    return points[:k]

# ─────────────────────────────────────────────
# APPROACH 4: Partial Sort | O(n log k) time | O(1) space
# EXPLAIN: Use heapq.nsmallest which internally uses a partial sort and returns the k smallest items.
# WHEN: Cleanest one-liner using the standard library; mirrors C++ partial_sort behaviour.

def solve_4(points: List[List[int]], k: int) -> List[List[int]]:
    return heapq.nsmallest(k, points, key=dist2)

# ─────────────────────────────────────────────
# APPROACH 5: Manual Quickselect | O(n) average time | O(log n) space
# EXPLAIN: Explicit in-place quickselect partitioning by squared distance.
# WHEN: When you want full control over the algorithm without library calls.

def solve_5(points: List[List[int]], k: int) -> List[List[int]]:
    def partition(lo: int, hi: int) -> int:
        pivot = dist2(points[hi])
        i = lo
        for j in range(lo, hi):
            if dist2(points[j]) <= pivot:
                points[i], points[j] = points[j], points[i]
                i += 1
        points[i], points[hi] = points[hi], points[i]
        return i

    def quickselect(lo: int, hi: int) -> None:
        if lo >= hi:
            return
        p = partition(lo, hi)
        if p == k:
            return
        elif p < k:
            quickselect(p + 1, hi)
        else:
            quickselect(lo, p - 1)

    quickselect(0, len(points) - 1)
    return points[:k]

# Made with Bob
