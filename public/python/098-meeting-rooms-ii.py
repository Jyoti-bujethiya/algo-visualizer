# LeetCode Problem #253: Meeting Rooms II
# Difficulty: Medium
# Link: https://leetcode.com/problems/meeting-rooms-ii/

from typing import List
import heapq

# ─────────────────────────────────────────────
# APPROACH 1: Min Heap (End Times) | O(n log n) time | O(n) space
# EXPLAIN: Sort by start; use a min-heap of end times — if the earliest-ending room is free, reuse it; otherwise open a new one.
# WHEN: Optimal and standard; directly models room allocation with O(n log n) total.

def solve_1(intervals: List[List[int]]) -> int:
    if not intervals:
        return 0
    intervals.sort()
    min_heap = [intervals[0][1]]
    for i in range(1, len(intervals)):
        if intervals[i][0] >= min_heap[0]:
            heapq.heapreplace(min_heap, intervals[i][1])
        else:
            heapq.heappush(min_heap, intervals[i][1])
    return len(min_heap)

# ─────────────────────────────────────────────
# APPROACH 2: Chronological / Two Sorted Arrays | O(n log n) time | O(n) space
# EXPLAIN: Sort starts and ends separately; advance two pointers — each unmatched start needs a new room.
# WHEN: Elegant two-pointer sweep; avoids heap overhead while keeping the same complexity.

def solve_2(intervals: List[List[int]]) -> int:
    starts = sorted(x[0] for x in intervals)
    ends   = sorted(x[1] for x in intervals)
    rooms = max_rooms = 0
    j = 0
    for i in range(len(starts)):
        if starts[i] < ends[j]:
            rooms += 1
            max_rooms = max(max_rooms, rooms)
        else:
            rooms -= 1
            j += 1
    return max_rooms

# ─────────────────────────────────────────────
# APPROACH 3: Sweep Line (Events) | O(n log n) time | O(n) space
# EXPLAIN: Create +1 events at each start and -1 events at each end; sort and scan to find the peak concurrent count.
# WHEN: Most generalizable — works for any interval scheduling / resource counting problem.

def solve_3(intervals: List[List[int]]) -> int:
    events = []
    for start, end in intervals:
        events.append((start, 1))
        events.append((end, -1))
    # Sort: when times are equal, end (-1) before start (+1) to free room first
    events.sort(key=lambda x: (x[0], x[1]))
    rooms = max_rooms = 0
    for _, delta in events:
        rooms += delta
        max_rooms = max(max_rooms, rooms)
    return max_rooms

# ─────────────────────────────────────────────
# APPROACH 4: Multiset of End Times (Sorted List) | O(n log n) time | O(n) space
# EXPLAIN: Use a sorted list of active end times; for each new interval, remove the earliest end ≤ start if possible.
# WHEN: Mirrors the C++ multiset approach; useful when you need explicit tracking of which rooms end when.

def solve_4(intervals: List[List[int]]) -> int:
    import bisect
    if not intervals:
        return 0
    intervals.sort()
    end_times = [intervals[0][1]]
    for i in range(1, len(intervals)):
        start, end = intervals[i]
        # Find the earliest room that ends at or before current start
        idx = bisect.bisect_right(end_times, start) - 1
        if idx >= 0:
            end_times.pop(idx)
        bisect.insort(end_times, end)
    return len(end_times)

# ─────────────────────────────────────────────
# APPROACH 5: Priority Queue with (end, start) Pairs | O(n log n) time | O(n) space
# EXPLAIN: Push (end_time, start_time) into a min-heap; pop all rooms whose end ≤ current start before pushing.
# WHEN: Variant of Approach 1 that pops multiple expired rooms; useful when batch-freeing rooms matters.

def solve_5(intervals: List[List[int]]) -> int:
    if not intervals:
        return 0
    intervals.sort()
    heap: list = []
    max_rooms = 0
    for start, end in intervals:
        while heap and heap[0][0] <= start:
            heapq.heappop(heap)
        heapq.heappush(heap, (end, start))
        max_rooms = max(max_rooms, len(heap))
    return max_rooms

# Made with Bob
