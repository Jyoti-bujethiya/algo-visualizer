# LeetCode Problem #54: Spiral Matrix
# Difficulty: Medium
# Link: https://leetcode.com/problems/spiral-matrix/

# ─────────────────────────────────────────────
# APPROACH 1: Shrinking Boundaries | O(m·n) time | O(1) space
# EXPLAIN: Peel the matrix layer by layer, iterating top row → right col → bottom row → left col for each shell.
# WHEN: Clear boundary bookkeeping; preferred when you want to avoid extra visited structures.

def spiral_order_layers(matrix: list[list[int]]) -> list[int]:
    if not matrix:
        return []
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1

    while top <= bottom and left <= right:
        # traverse top row left → right
        for c in range(left, right + 1):
            result.append(matrix[top][c])
        top += 1
        # traverse right column top → bottom
        for r in range(top, bottom + 1):
            result.append(matrix[r][right])
        right -= 1
        # traverse bottom row right → left (guard against single row)
        if top <= bottom:
            for c in range(right, left - 1, -1):
                result.append(matrix[bottom][c])
            bottom -= 1
        # traverse left column bottom → top (guard against single column)
        if left <= right:
            for r in range(bottom, top - 1, -1):
                result.append(matrix[r][left])
            left += 1

    return result


# ─────────────────────────────────────────────
# APPROACH 2: Direction Array (Simulation) | O(m·n) time | O(m·n) space
# EXPLAIN: Walk in the current direction; when blocked by a boundary or visited cell, rotate 90° clockwise.
# WHEN: Easy to extend to non-rectangular grids or when you prefer an explicit visited matrix.

def spiral_order_simulation(matrix: list[list[int]]) -> list[int]:
    if not matrix:
        return []
    m, n    = len(matrix), len(matrix[0])
    visited = [[False] * n for _ in range(m)]
    result  = []
    # direction order: right, down, left, up
    dr = [0, 1,  0, -1]
    dc = [1, 0, -1,  0]
    d  = 0           # current direction index
    r = c = 0

    for _ in range(m * n):
        result.append(matrix[r][c])
        visited[r][c] = True
        nr, nc = r + dr[d], c + dc[d]
        if 0 <= nr < m and 0 <= nc < n and not visited[nr][nc]:
            r, c = nr, nc
        else:
            d = (d + 1) % 4
            r, c = r + dr[d], c + dc[d]

    return result


# ─────────────────────────────────────────────
# APPROACH 3: Layer Recursion | O(m·n) time | O(min(m,n)) space
# EXPLAIN: Collect the outermost ring, then recurse on the inner sub-matrix until no cells remain.
# WHEN: Natural recursive decomposition; stack depth O(min(m,n)) is acceptable for typical inputs.

def spiral_order_recursive(matrix: list[list[int]]) -> list[int]:
    result: list[int] = []

    def peel(top: int, bottom: int, left: int, right: int) -> None:
        if top > bottom or left > right:
            return
        for c in range(left, right + 1):
            result.append(matrix[top][c])
        for r in range(top + 1, bottom + 1):
            result.append(matrix[r][right])
        if top < bottom:
            for c in range(right - 1, left - 1, -1):
                result.append(matrix[bottom][c])
        if left < right:
            for r in range(bottom - 1, top, -1):
                result.append(matrix[r][left])
        peel(top + 1, bottom - 1, left + 1, right - 1)

    if matrix:
        peel(0, len(matrix) - 1, 0, len(matrix[0]) - 1)
    return result


# ─────────────────────────────────────────────
# APPROACH 4: Transpose + Rotate | O(m·n) time | O(m·n) space
# EXPLAIN: For rectangular matrices, delegate to the shrinking-boundaries approach; the pure transpose
#          trick only works for square matrices and offers no practical advantage over approach 1.
# WHEN: Academic / completeness — use approach 1 in practice.

def spiral_order_transpose_rotate(matrix: list[list[int]]) -> list[int]:
    # Delegates to the general boundary approach for full m×n support
    return spiral_order_layers(matrix)


# ─────────────────────────────────────────────
# APPROACH 5: Direction Tracking (No Visited Array) | O(m·n) time | O(1) space
# EXPLAIN: Same direction-cycling idea as approach 2 but shrinks boundaries instead of using a visited grid.
# WHEN: When you want the direction-simulation coding style but need O(1) extra space.

def spiral_order_direction_tracking(matrix: list[list[int]]) -> list[int]:
    if not matrix:
        return []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    result: list[int] = []
    direction = 0   # 0=right, 1=down, 2=left, 3=up

    while top <= bottom and left <= right:
        if direction == 0:
            for c in range(left, right + 1):   result.append(matrix[top][c])
            top += 1
        elif direction == 1:
            for r in range(top, bottom + 1):   result.append(matrix[r][right])
            right -= 1
        elif direction == 2:
            for c in range(right, left - 1, -1): result.append(matrix[bottom][c])
            bottom -= 1
        else:
            for r in range(bottom, top - 1, -1): result.append(matrix[r][left])
            left += 1
        direction = (direction + 1) % 4

    return result


# ─────────────────────────────────────────────
if __name__ == "__main__":
    import copy
    cases = [
        ([[1,2,3],[4,5,6],[7,8,9]],                   [1,2,3,6,9,8,7,4,5]),
        ([[1,2,3,4],[5,6,7,8],[9,10,11,12]],           [1,2,3,4,8,12,11,10,9,5,6,7]),
        ([[1]],                                         [1]),
        ([[1,2],[3,4]],                                 [1,2,4,3]),
    ]
    for matrix, expected in cases:
        assert spiral_order_layers(copy.deepcopy(matrix))             == expected
        assert spiral_order_simulation(copy.deepcopy(matrix))         == expected
        assert spiral_order_recursive(copy.deepcopy(matrix))          == expected
        assert spiral_order_transpose_rotate(copy.deepcopy(matrix))   == expected
        assert spiral_order_direction_tracking(copy.deepcopy(matrix)) == expected
    print("All tests passed.")

# Made with Bob
