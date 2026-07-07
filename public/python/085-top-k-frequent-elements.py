# LeetCode Problem #347: Top K Frequent Elements
# Difficulty: Medium
# Link: https://leetcode.com/problems/top-k-frequent-elements/

from typing import List
import heapq
from collections import defaultdict

# ─────────────────────────────────────────────
# APPROACH 1: Min Heap of Size K | O(n log k) time | O(n) space
# EXPLAIN: Count frequencies then maintain a min-heap of size k keyed by frequency.
# WHEN: Best when k is much smaller than the number of unique elements.

def solve_1(nums: List[int], k: int) -> List[int]:
    freq = defaultdict(int)
    for num in nums:
        freq[num] += 1
    # min-heap of (frequency, num)
    min_heap: list = []
    for num, count in freq.items():
        heapq.heappush(min_heap, (count, num))
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return [item[1] for item in min_heap]

# ─────────────────────────────────────────────
# APPROACH 2: Bucket Sort | O(n) time | O(n) space
# EXPLAIN: Place each element into a frequency bucket and collect from highest bucket down.
# WHEN: When O(n) time is required; frequency range is bounded by array length.

def solve_2(nums: List[int], k: int) -> List[int]:
    freq = defaultdict(int)
    for num in nums:
        freq[num] += 1
    buckets: List[List[int]] = [[] for _ in range(len(nums) + 1)]
    for num, count in freq.items():
        buckets[count].append(num)
    result = []
    for i in range(len(buckets) - 1, -1, -1):
        for num in buckets[i]:
            result.append(num)
            if len(result) == k:
                return result
    return result

# ─────────────────────────────────────────────
# APPROACH 3: Quickselect on Frequency | O(n) average time | O(n) space
# EXPLAIN: Build (num, freq) pairs and use quickselect to partially sort by frequency descending.
# WHEN: When average O(n) time is acceptable; avoids full sort.

def solve_3(nums: List[int], k: int) -> List[int]:
    freq = defaultdict(int)
    for num in nums:
        freq[num] += 1
    pairs = list(freq.items())  # (num, count)

    def partition(lo: int, hi: int) -> int:
        pivot = pairs[hi][1]
        i = lo
        for j in range(lo, hi):
            if pairs[j][1] >= pivot:  # descending order
                pairs[i], pairs[j] = pairs[j], pairs[i]
                i += 1
        pairs[i], pairs[hi] = pairs[hi], pairs[i]
        return i

    def quickselect(lo: int, hi: int) -> None:
        if lo >= hi:
            return
        p = partition(lo, hi)
        if p == k - 1:
            return
        elif p < k - 1:
            quickselect(p + 1, hi)
        else:
            quickselect(lo, p - 1)

    quickselect(0, len(pairs) - 1)
    return [pairs[i][0] for i in range(k)]

# ─────────────────────────────────────────────
# APPROACH 4: Sort by Frequency | O(n log n) time | O(n) space
# EXPLAIN: Count frequencies, sort all unique elements by frequency descending, take first k.
# WHEN: When simplicity is preferred over raw efficiency.

def solve_4(nums: List[int], k: int) -> List[int]:
    freq = defaultdict(int)
    for num in nums:
        freq[num] += 1
    sorted_items = sorted(freq.keys(), key=lambda x: -freq[x])
    return sorted_items[:k]

# ─────────────────────────────────────────────
# APPROACH 5: Max Heap | O(n log n) time | O(n) space
# EXPLAIN: Push all (freq, num) pairs into a max-heap and extract k times.
# WHEN: When k is close to n and you want a heap-based solution without bucket sort.

def solve_5(nums: List[int], k: int) -> List[int]:
    freq = defaultdict(int)
    for num in nums:
        freq[num] += 1
    # negate frequency to simulate max-heap with heapq (min-heap)
    max_heap = [(-count, num) for num, count in freq.items()]
    heapq.heapify(max_heap)
    result = []
    for _ in range(k):
        _, num = heapq.heappop(max_heap)
        result.append(num)
    return result

# Made with Bob
