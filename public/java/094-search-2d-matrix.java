/*
 * LeetCode Problem #74: Search a 2D Matrix
 * Link: https://leetcode.com/problems/search-a-2d-matrix/
 * Difficulty: Medium
 */
import java.util.*;

class Solution {

    // APPROACH 1: Treat as 1D Array | O(log(m*n)) time | O(1) space
    // EXPLAIN: Map a virtual 1D index to 2D via row = mid/n, col = mid%n and run binary search.
    public boolean searchMatrix1(int[][] matrix, int target) {
        if (matrix.length == 0 || matrix[0].length == 0) return false;
        int m = matrix.length, n = matrix[0].length;
        int left = 0, right = m * n - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            int val = matrix[mid / n][mid % n];
            if (val == target) return true;
            else if (val < target) left = mid + 1;
            else right = mid - 1;
        }
        return false;
    }

    // APPROACH 2: Two Binary Searches | O(log m + log n) time | O(1) space
    // EXPLAIN: Binary search for the correct row, then binary search within that row.
    public boolean searchMatrix2(int[][] matrix, int target) {
        if (matrix.length == 0 || matrix[0].length == 0) return false;
        int m = matrix.length, n = matrix[0].length;
        int top = 0, bottom = m - 1;
        while (top <= bottom) {
            int midRow = top + (bottom - top) / 2;
            if (matrix[midRow][0] <= target && target <= matrix[midRow][n - 1]) {
                int left = 0, right = n - 1;
                while (left <= right) {
                    int midCol = left + (right - left) / 2;
                    if (matrix[midRow][midCol] == target) return true;
                    else if (matrix[midRow][midCol] < target) left = midCol + 1;
                    else right = midCol - 1;
                }
                return false;
            } else if (matrix[midRow][0] > target) bottom = midRow - 1;
            else top = midRow + 1;
        }
        return false;
    }

    // APPROACH 3: Start from Top-Right | O(m + n) time | O(1) space
    // EXPLAIN: Begin at top-right corner; move left if too large, down if too small.
    public boolean searchMatrix3(int[][] matrix, int target) {
        if (matrix.length == 0 || matrix[0].length == 0) return false;
        int row = 0, col = matrix[0].length - 1;
        while (row < matrix.length && col >= 0) {
            if (matrix[row][col] == target) return true;
            else if (matrix[row][col] > target) col--;
            else row++;
        }
        return false;
    }

    // APPROACH 4: Linear Search | O(m*n) time | O(1) space
    // EXPLAIN: Scan every element; correct but ignores all sorted structure.
    public boolean searchMatrix4(int[][] matrix, int target) {
        for (int[] row : matrix)
            for (int val : row)
                if (val == target) return true;
        return false;
    }

    // APPROACH 5: Row-wise Binary Search | O(m * log n) time | O(1) space
    // EXPLAIN: For each row, run binary search within that row.
    public boolean searchMatrix5(int[][] matrix, int target) {
        for (int[] row : matrix) {
            int lo = 0, hi = row.length - 1;
            while (lo <= hi) {
                int mid = lo + (hi - lo) / 2;
                if (row[mid] == target) return true;
                else if (row[mid] < target) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return false;
    }
}

// Made with Bob
