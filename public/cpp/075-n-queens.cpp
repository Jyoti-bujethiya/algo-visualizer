/*
 * LeetCode Problem #51: N-Queens
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/n-queens/
 */

#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Backtracking with Sets ====================
    /*
     * Time Complexity: O(n!)
     * Space Complexity: O(n)
     * EXPLAIN: Track occupied columns and diagonals via sets; place one queen per row.
     * WHEN: Most readable backtracking approach — standard interview answer.
     */
    vector<vector<string>> solveNQueens_sets(int n) {
        vector<vector<string>> result;
        vector<string> board(n, string(n, '.'));
        vector<bool> cols(n, false), diag1(2*n-1, false), diag2(2*n-1, false);

        function<void(int)> backtrack = [&](int row) {
            if (row == n) { result.push_back(board); return; }
            for (int col = 0; col < n; col++) {
                int d1 = row - col + n - 1, d2 = row + col;
                if (cols[col] || diag1[d1] || diag2[d2]) continue;
                cols[col] = diag1[d1] = diag2[d2] = true;
                board[row][col] = 'Q';
                backtrack(row + 1);
                board[row][col] = '.';
                cols[col] = diag1[d1] = diag2[d2] = false;
            }
        };

        backtrack(0);
        return result;
    }

    // ==================== APPROACH 2: Backtracking with Bitmask ====================
    /*
     * Time Complexity: O(n!)
     * Space Complexity: O(n)
     * EXPLAIN: Represent columns and diagonals as bitmasks; bitwise ops give O(1) conflict check.
     * WHEN: Most optimal for n≤32; fastest possible conflict detection.
     */
    vector<vector<string>> solveNQueens_bitmask(int n) {
        vector<vector<string>> result;
        vector<int> queens;

        function<void(int,int,int,int)> backtrack = [&](int row, int cols, int d1, int d2) {
            if (row == n) {
                vector<string> board(n, string(n, '.'));
                for (int r = 0; r < n; r++) board[r][queens[r]] = 'Q';
                result.push_back(board);
                return;
            }
            int available = ((1 << n) - 1) & ~(cols | d1 | d2);
            while (available) {
                int bit = available & (-available);
                int col = __builtin_ctz(bit);
                queens.push_back(col);
                backtrack(row+1, cols|bit, (d1|bit)<<1, (d2|bit)>>1);
                queens.pop_back();
                available &= available - 1;
            }
        };

        backtrack(0, 0, 0, 0);
        return result;
    }

    vector<vector<string>> solveNQueens(int n) {
        return solveNQueens_sets(n);
    }
};
