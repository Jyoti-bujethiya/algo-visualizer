# LeetCode Problem #48: Rotate Image
# Difficulty: Medium
# Link: https://leetcode.com/problems/rotate-image/

import copy

# ─────────────────────────────────────────────
# APPROACH 1: Transpose + Reverse Rows (In-Place) | O(n²) time | O(1) space
# EXPLAIN: Transpose along the main diagonal, then reverse each row — two simple passes achieve 90° CW rotation.
# WHEN: The canonical in-place solution; clean and O(1) extra space.

def rotate_inplace(matrix: list[list[int]]) -> None:
    """Modifies matrix in-place."""
    n = len(matrix)
    # Step 1: transpose (swap matrix[r][c] with matrix[c][r])
    for r in range(n):
        for c in range(r + 1, n):
            matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]
    # Step 2: reverse each row
    for row in matrix:
        row.reverse()


# ─────────────────────────────────────────────
# APPROACH 2: Reverse Rows + Transpose | O(n²) time | O(1) space
# EXPLAIN: Reverse the row order (flip the matrix vertically), then transpose — also gives 90° clockwise.
# WHEN: Alternative in-place approach; useful when you want a different decomposition.

def rotate_reverse_transpose(matrix: list[list[int]]) -> None:
    """Modifies matrix in-place."""
    n = len(matrix)
    # Step 1: reverse row order
    matrix.reverse()
    # Step 2: transpose
    for r in range(n):
        for c in range(r + 1, n):
            matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]


# ─────────────────────────────────────────────
# APPROACH 3: Four-Way Cycle (Layer by Layer) | O(n²) time | O(1) space
# EXPLAIN: Process each ring from outside in; for each position perform a 4-cell cyclic swap.
# WHEN: Demonstrates the direct cyclic rotation without using transpose as an intermediate step.

def rotate_four_way(matrix: list[list[int]]) -> None:
    """Modifies matrix in-place."""
    n = len(matrix)
    for layer in range(n // 2):
        first, last = layer, n - 1 - layer
        for i in range(first, last):
            offset = i - first
            top = matrix[first][i]
            # left → top
            matrix[first][i] = matrix[last - offset][first]
            # bottom → left
            matrix[last - offset][first] = matrix[last][last - offset]
            # right → bottom
            matrix[last][last - offset] = matrix[i][last]
            # top → right
            matrix[i][last] = top


# ─────────────────────────────────────────────
# APPROACH 4: Copy New Matrix | O(n²) time | O(n²) space
# EXPLAIN: For a 90° clockwise rotation, element at (r, c) moves to (c, n-1-r); copy to a fresh matrix.
# WHEN: When a simple, readable solution matters more than in-place constraint.

def rotate_extra(matrix: list[list[int]]) -> list[list[int]]:
    n      = len(matrix)
    result = [[0] * n for _ in range(n)]
    for r in range(n):
        for c in range(n):
            result[c][n - 1 - r] = matrix[r][c]
    return result


# ─────────────────────────────────────────────
# APPROACH 5: Transpose + Reverse Columns (Counter-Clockwise) | O(n²) time | O(1) space
# EXPLAIN: Transpose along the main diagonal, then reverse each column — produces 90° counter-clockwise rotation.
# WHEN: Included for completeness; use when counter-clockwise rotation is needed.

def rotate_ccw(matrix: list[list[int]]) -> None:
    """Modifies matrix in-place (counter-clockwise 90°)."""
    n = len(matrix)
    # Step 1: transpose
    for r in range(n):
        for c in range(r + 1, n):
            matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]
    # Step 2: reverse each column
    for c in range(n):
        top, bottom = 0, n - 1
        while top < bottom:
            matrix[top][c], matrix[bottom][c] = matrix[bottom][c], matrix[top][c]
            top += 1
            bottom -= 1


# ─────────────────────────────────────────────
if __name__ == "__main__":
    m1 = [[1,2,3],[4,5,6],[7,8,9]]
    e1_cw  = [[7,4,1],[8,5,2],[9,6,3]]

    # Approach 1
    m = copy.deepcopy(m1)
    rotate_inplace(m)
    assert m == e1_cw

    # Approach 2
    m = copy.deepcopy(m1)
    rotate_reverse_transpose(m)
    assert m == e1_cw

    # Approach 3
    m = copy.deepcopy(m1)
    rotate_four_way(m)
    assert m == e1_cw

    # Approach 4 (returns new matrix)
    assert rotate_extra(m1) == e1_cw

    # three CCW == one CW (approach 5 verification)
    m = copy.deepcopy(m1)
    rotate_ccw(m); rotate_ccw(m); rotate_ccw(m)
    assert m == e1_cw

    print("All tests passed.")

# Made with Bob
