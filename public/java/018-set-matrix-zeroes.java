/*
 * LeetCode Problem #73: Set Matrix Zeroes
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/set-matrix-zeroes/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Extra Copy | O(m·n) time | O(m·n) space
    // EXPLAIN: Copy the matrix; use the copy to detect original zeros before marking rows/cols in the original.
    // WHEN: Simplest to reason about; use when memory is not a concern.
    public void setZeroes_Extra(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean[][] zeroes = new boolean[m][n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 0) zeroes[i][j] = true;
            }
        }
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (zeroes[i][j]) {
                    // Zero out row i
                    for (int k = 0; k < n; k++) matrix[i][k] = 0;
                    // Zero out col j
                    for (int k = 0; k < m; k++) matrix[k][j] = 0;
                }
            }
        }
    }

    // APPROACH 2: Row & Column Sets | O(m·n) time | O(m + n) space
    // EXPLAIN: Record which rows and columns contain a zero, then zero them out in a second pass.
    // WHEN: Clean and readable; a good balance between simplicity and memory efficiency.
    public void setZeroes_Sets(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        Set<Integer> zeroRows = new HashSet<>();
        Set<Integer> zeroCols = new HashSet<>();

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 0) {
                    zeroRows.add(i);
                    zeroCols.add(j);
                }
            }
        }
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (zeroRows.contains(i) || zeroCols.contains(j)) {
                    matrix[i][j] = 0;
                }
            }
        }
    }

    // APPROACH 3: Boolean Arrays | O(m·n) time | O(m + n) space
    // EXPLAIN: Same as approach 2 but use plain boolean arrays instead of hash sets — lower overhead.
    // WHEN: Preferred over sets when the row/column indices are bounded integers; slightly faster in practice.
    public void setZeroes_BoolArrays(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean[] rowZero = new boolean[m];
        boolean[] colZero = new boolean[n];

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 0) {
                    rowZero[i] = true;
                    colZero[j] = true;
                }
            }
        }
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (rowZero[i] || colZero[j]) matrix[i][j] = 0;
            }
        }
    }

    // APPROACH 4: First Row/Col as Markers | O(m·n) time | O(1) space
    // EXPLAIN: Use the first row and first column as flag arrays; handle their own zero status separately.
    // WHEN: Optimal space — O(1) extra; required when the problem explicitly bans extra space.
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean firstRowZero = false;
        boolean firstColZero = false;

        // Check if first row has a zero
        for (int j = 0; j < n; j++) {
            if (matrix[0][j] == 0) { firstRowZero = true; break; }
        }
        // Check if first col has a zero
        for (int i = 0; i < m; i++) {
            if (matrix[i][0] == 0) { firstColZero = true; break; }
        }

        // Use first row/col to flag zeros for the rest of the matrix
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }

        // Zero out cells based on flags
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                    matrix[i][j] = 0;
                }
            }
        }

        if (firstRowZero) Arrays.fill(matrix[0], 0);
        if (firstColZero) {
            for (int i = 0; i < m; i++) matrix[i][0] = 0;
        }
    }

    // APPROACH 5: Two-Pass Single Marker Variable | O(m·n) time | O(1) space
    // EXPLAIN: Share matrix[0][0] between row-0 and col-0 flags; track first-column zero with a single boolean.
    // WHEN: Variant of approach 4 — slightly more compact; shows a deeper understanding of the marker trick.
    public void setZeroes_TwoPass(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean firstColZero = false;

        // First pass: mark using first row and col; track col-0 separately
        for (int i = 0; i < m; i++) {
            if (matrix[i][0] == 0) firstColZero = true;
            for (int j = 1; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }

        // Second pass (bottom-up to preserve row-0 markers)
        for (int i = m - 1; i >= 0; i--) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                    matrix[i][j] = 0;
                }
            }
            if (firstColZero) matrix[i][0] = 0;
        }
    }
}

// Made with Bob
