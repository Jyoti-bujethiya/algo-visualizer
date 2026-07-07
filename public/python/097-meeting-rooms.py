# LeetCode Problem #252: Meeting Rooms
# Difficulty: Easy
# Link: https://leetcode.com/problems/meeting-rooms/

from typing import List

# ─────────────────────────────────────────────
# APPROACH 1: Sort by Start Time | O(n log n) time | O(1) space
# EXPLAIN: Sort intervals by start time, then check if any interval starts before the previous one ends.
# WHEN: Optimal and standard; sorting guarantees we only need adjacent comparisons.

def solve_1(intervals: List[List[int]]) -> bool:
    if not intervals:
        return True
    intervals.sort()
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i - 1][1]:
            return False
    return True

# ─────────────────────────────────────────────
# APPROACH 2: Sort with Lambda Comparator | O(n log n) time | O(1) space
# EXPLAIN: Explicitly sort by start time using a key function, then check adjacent overlaps.
# WHEN: Equivalent to Approach 1 but more explicit about the sort key; useful for clarity.

def solve_2(intervals: List[List[int]]) -> bool:
    if not intervals:
        return True
    intervals.sort(key=lambda x: x[0])
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i - 1][1]:
            return False
    return True

# ─────────────────────────────────────────────
# APPROACH 3: Brute Force Check All Pairs | O(n²) time | O(1) space
# EXPLAIN: For every pair of intervals, check whether they overlap; return False on first overlap found.
# WHEN: No sorting required; only suitable for very small inputs.

def solve_3(intervals: List[List[int]]) -> bool:
    for i in range(len(intervals)):
        for j in range(i + 1, len(intervals)):
            a, b = intervals[i], intervals[j]
            if not (a[1] <= b[0] or b[1] <= a[0]):
                return False
    return True

# ─────────────────────────────────────────────
# APPROACH 4: Separate Start and End Arrays | O(n log n) time | O(n) space
# EXPLAIN: Sort starts and ends independently; if starts[i] < ends[i-1] there is an overlap.
# WHEN: Useful stepping stone toward the Meeting Rooms II sweep-line approach.

def solve_4(intervals: List[List[int]]) -> bool:
    if not intervals:
        return True
    starts = sorted(x[0] for x in intervals)
    ends   = sorted(x[1] for x in intervals)
    for i in range(1, len(starts)):
        if starts[i] < ends[i - 1]:
            return False
    return True

# ─────────────────────────────────────────────
# APPROACH 5: Sort and Track Max End | O(n log n) time | O(1) space
# EXPLAIN: Sort intervals; track the maximum end time seen so far and check against each new start.
# WHEN: Equivalent to Approach 1; makes the "max end" invariant explicit.

def solve_5(intervals: List[List[int]]) -> bool:
    if not intervals:
        return True
    intervals.sort()
    max_end = intervals[0][1]
    for i in range(1, len(intervals)):
        if intervals[i][0] < max_end:
            return False
        max_end = max(max_end, intervals[i][1])
    return True

# Made with Bob
