/*
 * LeetCode Problem #51: N-Queens
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/n-queens/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Backtracking with Column/Diagonal Sets | O(n!) time | O(n) space
    // EXPLAIN: Track occupied columns and diagonals via sets; place one queen per row.
    // WHEN: Most intuitive backtracking — O(1) conflict check via hash sets.
    public List<List<String>> solveNQueens_sets(int n) {
        List<List<String>> result = new ArrayList<>();
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');
        backtrackSets(0, n, board, new HashSet<>(), new HashSet<>(), new HashSet<>(), result);
        return result;
    }

    private void backtrackSets(int row, int n, char[][] board,
                                Set<Integer> cols, Set<Integer> diag1, Set<Integer> diag2,
                                List<List<String>> result) {
        if (row == n) {
            List<String> solution = new ArrayList<>();
            for (char[] r : board) solution.add(new String(r));
            result.add(solution); return;
        }
        for (int col = 0; col < n; col++) {
            if (cols.contains(col) || diag1.contains(row - col) || diag2.contains(row + col)) continue;
            cols.add(col); diag1.add(row - col); diag2.add(row + col);
            board[row][col] = 'Q';
            backtrackSets(row + 1, n, board, cols, diag1, diag2, result);
            board[row][col] = '.';
            cols.remove(col); diag1.remove(row - col); diag2.remove(row + col);
        }
    }

    // APPROACH 2: Backtracking with Boolean Arrays | O(n!) time | O(n) space
    // EXPLAIN: Use boolean arrays for columns and diagonals — better cache performance than sets.
    // WHEN: Slightly faster in practice due to array access vs hash lookup.
    public List<List<String>> solveNQueens_arrays(int n) {
        List<List<String>> result = new ArrayList<>();
        boolean[] cols = new boolean[n];
        boolean[] diag1 = new boolean[2 * n - 1];
        boolean[] diag2 = new boolean[2 * n - 1];
        backtrackArrays(0, n, cols, diag1, diag2, new int[n], result);
        return result;
    }

    private void backtrackArrays(int row, int n, boolean[] cols, boolean[] diag1, boolean[] diag2,
                                  int[] queens, List<List<String>> result) {
        if (row == n) {
            List<String> solution = new ArrayList<>();
            for (int c : queens) {
                char[] r = new char[n]; Arrays.fill(r, '.'); r[c] = 'Q';
                solution.add(new String(r));
            }
            result.add(solution); return;
        }
        for (int col = 0; col < n; col++) {
            int d1 = row - col + n - 1, d2 = row + col;
            if (cols[col] || diag1[d1] || diag2[d2]) continue;
            cols[col] = diag1[d1] = diag2[d2] = true; queens[row] = col;
            backtrackArrays(row + 1, n, cols, diag1, diag2, queens, result);
            cols[col] = diag1[d1] = diag2[d2] = false;
        }
    }

    // APPROACH 3: Backtracking with Bitmask | O(n!) time | O(n) space
    // EXPLAIN: Represent columns and diagonals as bitmasks; use bitwise ops for O(1) conflict check.
    // WHEN: Most optimal for n≤32; bitwise operations are fastest possible conflict checks.
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> result = new ArrayList<>();
        backtrackBitmask(0, n, 0, 0, 0, new int[n], result);
        return result;
    }

    private void backtrackBitmask(int row, int n, int cols, int diag1, int diag2,
                                   int[] queens, List<List<String>> result) {
        if (row == n) {
            List<String> solution = new ArrayList<>();
            for (int c : queens) {
                char[] r = new char[n]; Arrays.fill(r, '.'); r[c] = 'Q';
                solution.add(new String(r));
            }
            result.add(solution); return;
        }
        int available = ((1 << n) - 1) & ~(cols | diag1 | diag2);
        while (available != 0) {
            int bit = available & (-available);
            int col = Integer.numberOfTrailingZeros(bit);
            queens[row] = col;
            backtrackBitmask(row + 1, n, cols | bit, (diag1 | bit) << 1, (diag2 | bit) >> 1, queens, result);
            available &= available - 1;
        }
    }
}

// Made with Bob
