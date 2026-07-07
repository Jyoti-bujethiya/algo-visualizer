# LeetCode Problem #51: N-Queens
# Difficulty: Hard
# Link: https://leetcode.com/problems/n-queens/

from typing import List

# ─────────────────────────────────────────────
# APPROACH 1: Backtracking with Column/Diagonal Sets | O(n!) time | O(n) space
# EXPLAIN: Track occupied columns and diagonals via sets; place one queen per row.
# WHEN: Most efficient backtracking — O(1) conflict check via hash sets.

def solveNQueens_backtrack(n: int) -> List[List[str]]:
    result = []
    cols = set()
    diag1 = set()   # row - col
    diag2 = set()   # row + col

    def backtrack(row, board):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)
            board[row][col] = 'Q'
            backtrack(row + 1, board)
            board[row][col] = '.'
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)

    board = [['.' for _ in range(n)] for _ in range(n)]
    backtrack(0, board)
    return result


# APPROACH 2: Backtracking with Boolean Arrays | O(n!) time | O(n) space
# EXPLAIN: Use boolean arrays for columns and diagonals instead of sets — better cache performance.
# WHEN: Slightly faster in practice due to array access vs hash lookup.

def solveNQueens_arrays(n: int) -> List[List[str]]:
    result = []
    cols = [False] * n
    diag1 = [False] * (2 * n - 1)   # row - col + n - 1
    diag2 = [False] * (2 * n - 1)   # row + col

    def backtrack(row, queens):
        if row == n:
            board = []
            for c in queens:
                board.append('.' * c + 'Q' + '.' * (n - c - 1))
            result.append(board)
            return
        for col in range(n):
            d1 = row - col + n - 1
            d2 = row + col
            if cols[col] or diag1[d1] or diag2[d2]:
                continue
            cols[col] = diag1[d1] = diag2[d2] = True
            queens.append(col)
            backtrack(row + 1, queens)
            queens.pop()
            cols[col] = diag1[d1] = diag2[d2] = False

    backtrack(0, [])
    return result


# APPROACH 3: Backtracking with Bitmask | O(n!) time | O(n) space
# EXPLAIN: Represent columns and diagonals as bitmasks; use bitwise ops for O(1) conflict check.
# WHEN: Most optimal for n≤32; bitwise operations are fastest possible conflict checks.

def solveNQueens_bitmask(n: int) -> List[List[str]]:
    result = []

    def backtrack(row, cols, diag1, diag2, queens):
        if row == n:
            board = ['.' * c + 'Q' + '.' * (n - c - 1) for c in queens]
            result.append(board)
            return
        available = ((1 << n) - 1) & ~(cols | diag1 | diag2)
        while available:
            bit = available & (-available)   # lowest set bit
            col = bit.bit_length() - 1
            queens.append(col)
            backtrack(row + 1,
                      cols | bit,
                      (diag1 | bit) << 1,
                      (diag2 | bit) >> 1,
                      queens)
            queens.pop()
            available &= available - 1

    backtrack(0, 0, 0, 0, [])
    return result


def solveNQueens(n: int) -> List[List[str]]:
    return solveNQueens_backtrack(n)


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    fns = [solveNQueens_backtrack, solveNQueens_arrays, solveNQueens_bitmask, solveNQueens]
    expected_4_count = 2
    expected_1 = [['Q']]
    for fn in fns:
        assert len(fn(4)) == expected_4_count, f'{fn.__name__}(4) count mismatch'
        assert fn(1) == expected_1, f'{fn.__name__}(1) mismatch'
    print('All tests passed.')

# Made with Bob
