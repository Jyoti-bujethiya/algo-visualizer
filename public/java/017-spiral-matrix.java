/*
 * LeetCode Problem #54: Spiral Matrix
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/spiral-matrix/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Shrinking Boundaries | O(m·n) time | O(1) space
    // EXPLAIN: Maintain top/bottom/left/right boundaries; traverse each side inward and shrink the boundary.
    // WHEN: Classic matrix traversal — clean and handles all rectangular dimensions correctly.
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        if (matrix.length == 0) return result;

        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;

        while (top <= bottom && left <= right) {
            // Traverse right
            for (int col = left; col <= right; col++) {
                result.add(matrix[top][col]);
            }
            top++;

            // Traverse down
            for (int row = top; row <= bottom; row++) {
                result.add(matrix[row][right]);
            }
            right--;

            // Traverse left (only if rows remain)
            if (top <= bottom) {
                for (int col = right; col >= left; col--) {
                    result.add(matrix[bottom][col]);
                }
                bottom--;
            }

            // Traverse up (only if columns remain)
            if (left <= right) {
                for (int row = bottom; row >= top; row--) {
                    result.add(matrix[row][left]);
                }
                left++;
            }
        }
        return result;
    }

    // APPROACH 2: Direction Array (Simulation) | O(m·n) time | O(m·n) space
    // EXPLAIN: Walk one cell at a time in the current direction; when blocked, rotate 90° clockwise using a direction array.
    // WHEN: Easy to extend to irregular grids; explicit visited matrix makes logic crystal-clear.
    public List<Integer> spiralOrder_Direction(int[][] matrix) {
        int rows = matrix.length, cols = matrix[0].length;
        boolean[][] visited = new boolean[rows][cols];
        int[] dr = {0, 1, 0, -1};
        int[] dc = {1, 0, -1, 0};
        int r = 0, c = 0, dir = 0;
        List<Integer> result = new ArrayList<>();

        for (int i = 0; i < rows * cols; i++) {
            result.add(matrix[r][c]);
            visited[r][c] = true;
            int nr = r + dr[dir], nc = c + dc[dir];
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || visited[nr][nc]) {
                dir = (dir + 1) % 4;
                nr = r + dr[dir];
                nc = c + dc[dir];
            }
            r = nr;
            c = nc;
        }
        return result;
    }

    // APPROACH 3: Layer Recursion (Peel Outer Ring) | O(m·n) time | O(min(m,n)) space
    // EXPLAIN: Recursively collect the outermost ring, then recurse on the inner sub-matrix until empty.
    // WHEN: Natural recursive decomposition; call-stack depth is O(min(m,n)) which is acceptable.
    public List<Integer> spiralOrder_Recursive(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        peel(matrix, 0, matrix.length - 1, 0, matrix[0].length - 1, result);
        return result;
    }

    private void peel(int[][] m, int top, int bottom, int left, int right, List<Integer> res) {
        if (top > bottom || left > right) return;
        for (int c = left;  c <= right;  c++) res.add(m[top][c]);
        for (int r = top+1; r <= bottom; r++) res.add(m[r][right]);
        if (top < bottom)
            for (int c = right-1; c >= left; c--) res.add(m[bottom][c]);
        if (left < right)
            for (int r = bottom-1; r > top; r--) res.add(m[r][left]);
        peel(m, top+1, bottom-1, left+1, right-1, res);
    }

    // APPROACH 4: Transpose + Rotate Trick | O(m·n) time | O(m·n) space
    // EXPLAIN: Delegates to the boundary-shrink approach — the transpose trick applies only to square matrices,
    //          so the general rectangular case always falls back to approach 1.
    // WHEN: Academic interest; for general m×n use approach 1.
    public List<Integer> spiralOrder_TransposeRotate(int[][] matrix) {
        // Reuse approach 1 for full m×n support
        return spiralOrder(matrix);
    }

    // APPROACH 5: Direction Tracking (No Visited Array) | O(m·n) time | O(1) space
    // EXPLAIN: Like approach 2 but avoids the visited matrix by shrinking boundaries as each direction is exhausted.
    // WHEN: When you want the direction-simulation style but cannot afford O(m·n) extra space.
    public List<Integer> spiralOrder_DirectionTracking(int[][] matrix) {
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;
        List<Integer> result = new ArrayList<>();
        int dir = 0; // 0=right, 1=down, 2=left, 3=up

        while (top <= bottom && left <= right) {
            if (dir == 0) { for (int c = left;   c <= right;  c++) result.add(matrix[top][c]);   top++;    }
            else if (dir == 1) { for (int r = top;    r <= bottom; r++) result.add(matrix[r][right]);  right--;  }
            else if (dir == 2) { for (int c = right;  c >= left;   c--) result.add(matrix[bottom][c]); bottom--; }
            else               { for (int r = bottom; r >= top;    r--) result.add(matrix[r][left]);   left++;   }
            dir = (dir + 1) % 4;
        }
        return result;
    }
}

// Made with Bob
