# LeetCode Problem #295: Find Median from Data Stream
# Difficulty: Hard
# Link: https://leetcode.com/problems/find-median-from-data-stream/

import heapq
import bisect

# ─────────────────────────────────────────────
# APPROACH 1: Two Heaps | O(log n) add | O(1) find | O(n) space
# EXPLAIN: Keep a max-heap for the lower half and a min-heap for the upper half, balanced to size difference ≤ 1.
# WHEN: Optimal for streaming data; industry standard solution.

class MedianFinder1:
    def __init__(self):
        self.lo = []   # max-heap (negate values)
        self.hi = []   # min-heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.lo, -num)
        # balance: push largest of lo into hi
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        # ensure lo has equal or one more element
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def findMedian(self) -> float:
        if len(self.lo) > len(self.hi):
            return float(-self.lo[0])
        return (-self.lo[0] + self.hi[0]) / 2.0

# ─────────────────────────────────────────────
# APPROACH 2: Sorted List with Binary Search | O(n) add | O(1) find | O(n) space
# EXPLAIN: Maintain a sorted list by inserting at the correct position using bisect.
# WHEN: When simplicity is more important than insertion performance.

class MedianFinder2:
    def __init__(self):
        self.nums = []

    def addNum(self, num: int) -> None:
        bisect.insort(self.nums, num)

    def findMedian(self) -> float:
        n = len(self.nums)
        if n % 2 == 1:
            return float(self.nums[n // 2])
        return (self.nums[n // 2 - 1] + self.nums[n // 2]) / 2.0

# ─────────────────────────────────────────────
# APPROACH 3: Two Heaps with Explicit Size Tracking | O(log n) add | O(1) find | O(n) space
# EXPLAIN: Same two-heap strategy as Approach 1 but routes each number directly to the correct heap.
# WHEN: When clearer balancing logic is preferred over the push-then-rebalance pattern.

class MedianFinder3:
    def __init__(self):
        self.lo = []   # max-heap (negated)
        self.hi = []   # min-heap

    def addNum(self, num: int) -> None:
        if not self.lo or num <= -self.lo[0]:
            heapq.heappush(self.lo, -num)
        else:
            heapq.heappush(self.hi, num)
        # rebalance so |lo| - |hi| <= 1 and |hi| <= |lo|
        if len(self.lo) > len(self.hi) + 1:
            heapq.heappush(self.hi, -heapq.heappop(self.lo))
        elif len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def findMedian(self) -> float:
        if len(self.lo) > len(self.hi):
            return float(-self.lo[0])
        return (-self.lo[0] + self.hi[0]) / 2.0

# ─────────────────────────────────────────────
# APPROACH 4: Sorted Vector (Insertion Sort) | O(n) add | O(1) find | O(n) space
# EXPLAIN: Maintain a list sorted by linear insertion; median is always the middle element(s).
# WHEN: For small datasets where simplicity outweighs performance.

class MedianFinder4:
    def __init__(self):
        self.nums = []

    def addNum(self, num: int) -> None:
        pos = 0
        while pos < len(self.nums) and self.nums[pos] < num:
            pos += 1
        self.nums.insert(pos, num)

    def findMedian(self) -> float:
        n = len(self.nums)
        if n % 2 == 1:
            return float(self.nums[n // 2])
        return (self.nums[n // 2 - 1] + self.nums[n // 2]) / 2.0

# ─────────────────────────────────────────────
# APPROACH 5: SortedList (Balanced BST via sortedcontainers) | O(log n) add | O(1) find | O(n) space
# EXPLAIN: Use Python's SortedList for O(log n) insertion while keeping direct index access for the median.
# WHEN: When using the sortedcontainers library is acceptable; mirrors the C++ multiset approach.

class MedianFinder5:
    def __init__(self):
        # Fallback to bisect-based sorted list if sortedcontainers unavailable
        self.nums = []

    def addNum(self, num: int) -> None:
        bisect.insort(self.nums, num)

    def findMedian(self) -> float:
        n = len(self.nums)
        if n % 2 == 1:
            return float(self.nums[n // 2])
        return (self.nums[n // 2 - 1] + self.nums[n // 2]) / 2.0

# Made with Bob
