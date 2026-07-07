# LeetCode Problem #84: Largest Rectangle in Histogram
# Difficulty: Hard
# Link: https://leetcode.com/problems/largest-rectangle-in-histogram/

from typing import List

# ─────────────────────────────────────────────
# APPROACH 1: Monotonic Stack (Optimal) | O(n) time | O(n) space
# EXPLAIN: Maintain an increasing stack of indices; when current bar is shorter, pop and compute area.
# WHEN: Standard O(n) solution — the canonical stack approach for this problem.

def largestRectangleArea_stack(heights: List[int]) -> int:
    stack = []   # indices, heights are non-decreasing
    max_area = 0
    n = len(heights)

    for i in range(n + 1):
        h = 0 if i == n else heights[i]
        while stack and h < heights[stack[-1]]:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)

    return max_area


# APPROACH 2: Brute Force | O(n²) time | O(1) space
# EXPLAIN: For each pair (i, j) compute the minimum height and area; track maximum.
# WHEN: Educational — too slow for large n but illustrates the problem structure.

def largestRectangleArea_brute(heights: List[int]) -> int:
    n = len(heights)
    max_area = 0
    for i in range(n):
        min_h = heights[i]
        for j in range(i, n):
            min_h = min(min_h, heights[j])
            max_area = max(max_area, min_h * (j - i + 1))
    return max_area


# APPROACH 3: Divide and Conquer | O(n log n) average, O(n²) worst time | O(log n) space
# EXPLAIN: Split at the minimum height bar; recursively solve left and right sub-arrays.
# WHEN: O(log n) space on balanced input; demonstrates D&C tree structure.

def largestRectangleArea_divideConquer(heights: List[int]) -> int:
    def dc(lo, hi):
        if lo > hi:
            return 0
        min_idx = lo
        for k in range(lo, hi + 1):
            if heights[k] < heights[min_idx]:
                min_idx = k
        return max(
            heights[min_idx] * (hi - lo + 1),
            dc(lo, min_idx - 1),
            dc(min_idx + 1, hi),
        )
    return dc(0, len(heights) - 1)


def largestRectangleArea(heights: List[int]) -> int:
    return largestRectangleArea_stack(heights)


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ([2, 1, 5, 6, 2, 3], 10),
        ([2, 4],               4),
        ([1],                  1),
        ([0],                  0),
    ]
    fns = [largestRectangleArea_stack, largestRectangleArea_brute,
           largestRectangleArea_divideConquer, largestRectangleArea]
    for fn in fns:
        for heights, expected in cases:
            assert fn(list(heights)) == expected, f'{fn.__name__}({heights}) mismatch'
    print('All tests passed.')

# Made with Bob
