/*
 * LeetCode Problem #48: Rotate Image
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/rotate-image/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Transpose + Reverse Rows | O(n²) time | O(1) space
    // EXPLAIN: Transpose along the main diagonal, then reverse each row for a 90° clockwise rotation.
    // WHEN: Optimal in-place solution; standard interview answer for 90° clockwise rotation.
    public void rotate(int[][] matrix) {
        int n = matrix.length;

        // Step 1: Transpose (swap matrix[i][j] with matrix[j][i])
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }

        // Step 2: Reverse each row
        for (int i = 0; i < n; i++) {
            int left = 0, right = n - 1;
            while (left < right) {
                int temp = matrix[i][left];
                matrix[i][left] = matrix[i][right];
                matrix[i][right] = temp;
                left++;
                right--;
            }
        }
    }

    // APPROACH 2: Reverse Rows + Transpose | O(n²) time | O(1) space
    // EXPLAIN: Reverse the row order (flip vertically), then transpose — also produces a 90° clockwise rotation.
    // WHEN: Alternative in-place approach; useful to know as a complement to approach 1.
    public void rotate_ReverseTranspose(int[][] matrix) {
        int n = matrix.length;

        // Step 1: Reverse row order (flip vertically)
        for (int i = 0; i < n / 2; i++) {
            int[] temp = matrix[i];
            matrix[i] = matrix[n - 1 - i];
            matrix[n - 1 - i] = temp;
        }

        // Step 2: Transpose
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
    }

    // APPROACH 3: Four-Way Cycle (Layer by Layer) | O(n²) time | O(1) space
    // EXPLAIN: For each layer, cyclically rotate four cells at a time: top→right→bottom→left→top.
    // WHEN: When you want to demonstrate the cyclic four-element swap pattern directly.
    public void rotate_FourWayCycle(int[][] matrix) {
        int n = matrix.length;
        for (int layer = 0; layer < n / 2; layer++) {
            int first = layer, last = n - 1 - layer;
            for (int i = first; i < last; i++) {
                int offset = i - first;
                int top = matrix[first][i];
                // left → top
                matrix[first][i] = matrix[last - offset][first];
                // bottom → left
                matrix[last - offset][first] = matrix[last][last - offset];
                // right → bottom
                matrix[last][last - offset] = matrix[i][last];
                // top → right
                matrix[i][last] = top;
            }
        }
    }

    // APPROACH 4: Copy to New Matrix | O(n²) time | O(n²) space
    // EXPLAIN: Allocate a result matrix; place each element at its rotated position (i,j) → (j, n-1-i), then copy back.
    // WHEN: When in-place is not required and a straightforward positional mapping is preferred.
    public void rotate_ExtraMatrix(int[][] matrix) {
        int n = matrix.length;
        int[][] res = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                res[j][n - 1 - i] = matrix[i][j];
            }
        }
        for (int i = 0; i < n; i++) {
            System.arraycopy(res[i], 0, matrix[i], 0, n);
        }
    }

    // APPROACH 5: Transpose + Reverse Columns (Counter-Clockwise) | O(n²) time | O(1) space
    // EXPLAIN: Transpose along the main diagonal, then reverse each column — produces a 90° counter-clockwise rotation.
    // WHEN: Included for completeness; when counter-clockwise rotation is required.
    public void rotateCCW(int[][] matrix) {
        int n = matrix.length;

        // Transpose
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }

        // Reverse each column
        for (int j = 0; j < n; j++) {
            int top = 0, bottom = n - 1;
            while (top < bottom) {
                int temp = matrix[top][j];
                matrix[top][j] = matrix[bottom][j];
                matrix[bottom][j] = temp;
                top++;
                bottom--;
            }
        }
    }
}

// Made with Bob
