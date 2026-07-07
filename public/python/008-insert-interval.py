# LeetCode Problem #57: Insert Interval
# Difficulty: Medium
# Link: https://leetcode.com/problems/insert-interval/

# ─────────────────────────────────────────────
# APPROACH 1: Linear Scan | O(n) time | O(n) space
# EXPLAIN: Walk through three phases — intervals entirely before, overlapping, and entirely after the new interval.
# WHEN: Preferred when the input is already sorted; clean, readable, and optimal in time.

def insert_interval_linear(
    intervals: list[list[int]], new_interval: list[int]
) -> list[list[int]]:
    result: list[list[int]] = []
    i, n = 0, len(intervals)

    # Phase 1: add all intervals that end before new_interval starts
    while i < n and intervals[i][1] < new_interval[0]:
        result.append(intervals[i])
        i += 1

    # Phase 2: merge all overlapping intervals into new_interval
    while i < n and intervals[i][0] <= new_interval[1]:
        new_interval[0] = min(new_interval[0], intervals[i][0])
        new_interval[1] = max(new_interval[1], intervals[i][1])
        i += 1
    result.append(new_interval)

    # Phase 3: add all intervals that start after new_interval ends
    while i < n:
        result.append(intervals[i])
        i += 1

    return result


# ─────────────────────────────────────────────
# APPROACH 2: Binary Search for Boundaries | O(log n + n) time | O(n) space
# EXPLAIN: Use binary search to find where the new interval's start and end fall, then merge in O(log n) + O(n) copy.
# WHEN: When you want to showcase binary search usage; note that the copy is still O(n) so total complexity matches linear.

import bisect

def insert_interval_binary(
    intervals: list[list[int]], new_interval: list[int]
) -> list[list[int]]:
    if not intervals:
        return [new_interval]

    starts = [iv[0] for iv in intervals]
    ends   = [iv[1] for iv in intervals]

    # First interval whose start > new_interval[1] (no overlap from here onward)
    right = bisect.bisect_right(starts, new_interval[1])
    # First interval whose end >= new_interval[0] (potential overlap starts here)
    left  = bisect.bisect_left(ends, new_interval[0])

    if left == right:
        # No overlapping intervals — pure insertion
        merged = new_interval
    else:
        merged = [
            min(new_interval[0], intervals[left][0]),
            max(new_interval[1], intervals[right - 1][1]),
        ]

    return intervals[:left] + [merged] + intervals[right:]


# ─────────────────────────────────────────────
if __name__ == "__main__":
    cases = [
        ([[1,3],[6,9]],           [2,5],  [[1,5],[6,9]]),
        ([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8], [[1,2],[3,10],[12,16]]),
        ([],                      [5,7],  [[5,7]]),
        ([[1,5]],                 [2,3],  [[1,5]]),
    ]
    import copy
    for ivs, new_iv, expected in cases:
        assert insert_interval_linear(copy.deepcopy(ivs), list(new_iv))  == expected
        assert insert_interval_binary(copy.deepcopy(ivs), list(new_iv))  == expected
    print("All tests passed.")

# Made with Bob
