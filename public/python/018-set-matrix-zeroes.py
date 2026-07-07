# LeetCode Problem #73: Set Matrix Zeroes
# Difficulty: Medium
# Link: https://leetcode.com/problems/set-matrix-zeroes/

import copy

# ─────────────────────────────────────────────
# APPROACH 1: Brute Force (Extra Copy) | O(m·n·(m+n)) time | O(m·n) space
# EXPLAIN: Make a deep copy; scan the original for zeros and zero-out rows/columns in the copy.
# WHEN: Simplest to reason about; fine when memory is not constrained.

def set_zeroes_extra(matrix: list[list[int]]) -> None:
    """Modifies matrix in-place."""
    m, n = len(matrix), len(matrix[0])
    orig = copy.deepcopy(matrix)
    for r in range(m):
        for c in range(n):
            if orig[r][c] == 0:
                for k in range(n):
                    matrix[r][k] = 0
                for k in range(m):
                    matrix[k][c] = 0


# ─────────────────────────────────────────────
# APPROACH 2: Hash Sets | O(m·n) time | O(m+n) space
# EXPLAIN: Record which rows and columns contain a zero using two sets; then apply zeroing in a second pass.
# WHEN: Clean O(m+n) space — the most readable O(n) solution.

def set_zeroes_sets(matrix: list[list[int]]) -> None:
    """Modifies matrix in-place."""
    zero_rows: set[int] = set()
    zero_cols: set[int] = set()
    for r, row in enumerate(matrix):
        for c, val in enumerate(row):
            if val == 0:
                zero_rows.add(r)
                zero_cols.add(c)
    for r in range(len(matrix)):
        for c in range(len(matrix[0])):
            if r in zero_rows or c in zero_cols:
                matrix[r][c] = 0


# ─────────────────────────────────────────────
# APPROACH 3: Boolean Arrays | O(m·n) time | O(m+n) space
# EXPLAIN: Same as approach 2 but use plain boolean lists instead of sets — lower overhead.
# WHEN: Preferred over sets when indices are bounded integers; slightly faster constant factor.

def set_zeroes_bool_arrays(matrix: list[list[int]]) -> None:
    """Modifies matrix in-place."""
    m, n = len(matrix), len(matrix[0])
    row_zero = [False] * m
    col_zero = [False] * n

    for r in range(m):
        for c in range(n):
            if matrix[r][c] == 0:
                row_zero[r] = True
                col_zero[c] = True

    for r in range(m):
        for c in range(n):
            if row_zero[r] or col_zero[c]:
                matrix[r][c] = 0


# ─────────────────────────────────────────────
# APPROACH 4: First Row/Col as Markers (O(1) space) | O(m·n) time | O(1) space
# EXPLAIN: Use the first row and first column as flag arrays; handle the (0,0) cell corner case separately.
# WHEN: When O(1) extra space is required — the classic in-place trick for this problem.

def set_zeroes_inplace(matrix: list[list[int]]) -> None:
    """Modifies matrix in-place with O(1) extra space."""
    m, n = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][c] == 0 for c in range(n))
    first_col_zero = any(matrix[r][0] == 0 for r in range(m))

    # Use first row/col as flags for interior cells
    for r in range(1, m):
        for c in range(1, n):
            if matrix[r][c] == 0:
                matrix[r][0] = 0
                matrix[0][c] = 0

    # Zero interior cells based on flags
    for r in range(1, m):
        for c in range(1, n):
            if matrix[r][0] == 0 or matrix[0][c] == 0:
                matrix[r][c] = 0

    # Zero first row and column if originally had a zero
    if first_row_zero:
        for c in range(n):
            matrix[0][c] = 0
    if first_col_zero:
        for r in range(m):
            matrix[r][0] = 0


# ─────────────────────────────────────────────
# APPROACH 5: Two-Pass Single Marker Variable | O(m·n) time | O(1) space
# EXPLAIN: Share matrix[0][0] between row-0 and col-0 flags; track first-column zero with one boolean variable.
# WHEN: Variant of approach 4 — slightly more compact; reinforces understanding of the first-row/col marker trick.

def set_zeroes_two_pass(matrix: list[list[int]]) -> None:
    """Modifies matrix in-place with O(1) extra space."""
    m, n = len(matrix), len(matrix[0])
    first_col_zero = False

    for r in range(m):
        if matrix[r][0] == 0:
            first_col_zero = True
        for c in range(1, n):
            if matrix[r][c] == 0:
                matrix[r][0] = 0
                matrix[0][c] = 0

    # Process bottom-up to avoid overwriting row-0 markers prematurely
    for r in range(m - 1, -1, -1):
        for c in range(1, n):
            if matrix[r][0] == 0 or matrix[0][c] == 0:
                matrix[r][c] = 0
        if first_col_zero:
            matrix[r][0] = 0


# ─────────────────────────────────────────────
if __name__ == "__main__":
    def run(fn, m):
        mat = copy.deepcopy(m)
        fn(mat)
        return mat

    m1 = [[1,1,1],[1,0,1],[1,1,1]]
    e1 = [[1,0,1],[0,0,0],[1,0,1]]
    assert run(set_zeroes_extra,       m1) == e1
    assert run(set_zeroes_sets,        m1) == e1
    assert run(set_zeroes_bool_arrays, m1) == e1
    assert run(set_zeroes_inplace,     m1) == e1
    assert run(set_zeroes_two_pass,    m1) == e1

    m2 = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
    e2 = [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
    assert run(set_zeroes_extra,       m2) == e2
    assert run(set_zeroes_sets,        m2) == e2
    assert run(set_zeroes_bool_arrays, m2) == e2
    assert run(set_zeroes_inplace,     m2) == e2
    assert run(set_zeroes_two_pass,    m2) == e2

    print("All tests passed.")

# Made with Bob
