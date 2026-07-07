# LeetCode Problem #74: Search a 2D Matrix
# Difficulty: Medium
# Link: https://leetcode.com/problems/search-a-2d-matrix/

from typing import List
import bisect

# ─────────────────────────────────────────────
# APPROACH 1: Treat as 1D Array | O(log(m*n)) time | O(1) space
# EXPLAIN: Map a virtual 1D index to 2D (row = mid//n, col = mid%n) and run standard binary search.
# WHEN: Optimal — single binary search over the entire matrix; clearest formulation.

def solve_1(matrix: List[List[int]], target: int) -> bool:
    if not matrix or not matrix[0]:
        return False
    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1
    while left <= right:
        mid = left + (right - left) // 2
        val = matrix[mid // n][mid % n]
        if val == target:
            return True
        elif val < target:
            left = mid + 1
        else:
            right = mid - 1
    return False

# ─────────────────────────────────────────────
# APPROACH 2: Two Binary Searches | O(log m + log n) time | O(1) space
# EXPLAIN: Binary search for the correct row, then binary search within that row.
# WHEN: When separating the row-find and column-find concerns makes the code clearer.

def solve_2(matrix: List[List[int]], target: int) -> bool:
    if not matrix or not matrix[0]:
        return False
    m, n = len(matrix), len(matrix[0])
    top, bottom = 0, m - 1
    while top <= bottom:
        mid_row = top + (bottom - top) // 2
        if matrix[mid_row][0] <= target <= matrix[mid_row][n - 1]:
            row = matrix[mid_row]
            left, right = 0, n - 1
            while left <= right:
                mid_col = left + (right - left) // 2
                if row[mid_col] == target:
                    return True
                elif row[mid_col] < target:
                    left = mid_col + 1
                else:
                    right = mid_col - 1
            return False
        elif matrix[mid_row][0] > target:
            bottom = mid_row - 1
        else:
            top = mid_row + 1
    return False

# ─────────────────────────────────────────────
# APPROACH 3: Start from Top-Right | O(m + n) time | O(1) space
# EXPLAIN: Start at top-right corner; move left if current > target, down if current < target.
# WHEN: Also works on matrices where rows are not strictly chained (LeetCode 240 variant).

def solve_3(matrix: List[List[int]], target: int) -> bool:
    if not matrix or not matrix[0]:
        return False
    row, col = 0, len(matrix[0]) - 1
    while row < len(matrix) and col >= 0:
        if matrix[row][col] == target:
            return True
        elif matrix[row][col] > target:
            col -= 1
        else:
            row += 1
    return False

# ─────────────────────────────────────────────
# APPROACH 4: Linear Search | O(m*n) time | O(1) space
# EXPLAIN: Scan every element; correct but ignores all sorted structure.
# WHEN: Baseline only; never optimal for a sorted matrix.

def solve_4(matrix: List[List[int]], target: int) -> bool:
    for row in matrix:
        for val in row:
            if val == target:
                return True
    return False

# ─────────────────────────────────────────────
# APPROACH 5: Row-wise Binary Search | O(m * log n) time | O(1) space
# EXPLAIN: For each row, use bisect to binary-search within that row.
# WHEN: When only column-sorting is guaranteed, not row-to-row chaining.

def solve_5(matrix: List[List[int]], target: int) -> bool:
    for row in matrix:
        idx = bisect.bisect_left(row, target)
        if idx < len(row) and row[idx] == target:
            return True
    return False

# Made with Bob
