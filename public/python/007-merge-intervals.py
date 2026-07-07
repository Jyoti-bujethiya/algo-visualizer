# LeetCode Problem #56: Merge Intervals
# Difficulty: Medium
# Link: https://leetcode.com/problems/merge-intervals/

# ─────────────────────────────────────────────
# APPROACH 1: Brute Force | O(n³) time | O(n) space
# EXPLAIN: Repeatedly scan all interval pairs and merge overlapping ones until no merges occur.
# WHEN: Never (too inefficient) — illustrates why sorting is necessary.

def merge_intervals_brute(intervals: list[list[int]]) -> list[list[int]]:
    result = [iv[:] for iv in intervals]
    merged = True
    while merged:
        merged = False
        temp: list[list[int]] = []
        used = [False] * len(result)
        for i in range(len(result)):
            if used[i]:
                continue
            cur = result[i][:]
            used[i] = True
            for j in range(i + 1, len(result)):
                if used[j]:
                    continue
                if cur[1] >= result[j][0] and cur[0] <= result[j][1]:
                    cur[0] = min(cur[0], result[j][0])
                    cur[1] = max(cur[1], result[j][1])
                    used[j] = True
                    merged = True
            temp.append(cur)
        result = temp
    return result


# ─────────────────────────────────────────────
# APPROACH 2: Sort + Linear Merge | O(n log n) time | O(n) space
# EXPLAIN: Sort intervals by start time, then greedily merge each interval into the last output interval if they overlap.
# WHEN: Standard and clean — the go-to approach for most interview and production scenarios.

def merge_intervals_sort(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:              # overlaps with the last merged interval
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged


# ─────────────────────────────────────────────
# APPROACH 3: Sorting with Lambda | O(n log n) time | O(n) space
# EXPLAIN: Same as sort + merge but uses a running start/end pair instead of mutating the last list element.
# WHEN: Cleaner functional style; avoids in-place mutation of the result list.

def merge_intervals_functional(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    result: list[list[int]] = []
    start, end = intervals[0]
    for s, e in intervals[1:]:
        if s <= end:
            end = max(end, e)
        else:
            result.append([start, end])
            start, end = s, e
    result.append([start, end])
    return result


# ─────────────────────────────────────────────
# APPROACH 4: Without Modifying Result | O(n log n) time | O(n) space
# EXPLAIN: Decompose each interval into +1 (start) and -1 (end) events, sweep through counting active intervals.
# WHEN: When you need to generalise to counting overlapping intervals or detecting the maximum overlap count.

def merge_intervals_sweep(intervals: list[list[int]]) -> list[list[int]]:
    events: list[tuple[int, int]] = []
    for start, end in intervals:
        events.append((start,  1))
        events.append((end,   -1))
    # At equal times process opens (1) before closes (-1)
    events.sort(key=lambda e: (e[0], -e[1]))

    result: list[list[int]] = []
    active = 0
    seg_start = 0
    for time, delta in events:
        if active == 0 and delta == 1:
            seg_start = time
        active += delta
        if active == 0:
            result.append([seg_start, time])
    return result


# ─────────────────────────────────────────────
if __name__ == "__main__":
    cases = [
        ([[1,3],[2,6],[8,10],[15,18]], [[1,6],[8,10],[15,18]]),
        ([[1,4],[4,5]],                [[1,5]]),
        ([[1,4],[2,3]],                [[1,4]]),
    ]
    import copy
    for intervals, expected in cases:
        assert merge_intervals_brute(copy.deepcopy(intervals))      == expected
        assert merge_intervals_sort(copy.deepcopy(intervals))       == expected
        assert merge_intervals_functional(copy.deepcopy(intervals)) == expected
        assert merge_intervals_sweep(copy.deepcopy(intervals))      == expected
    print("All tests passed.")

# Made with Bob
