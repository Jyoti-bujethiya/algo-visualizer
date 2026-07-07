/*
 * Problem: Search a 2D Matrix (LeetCode 74)
 * Link: https://leetcode.com/problems/search-a-2d-matrix/
 * Difficulty: Medium
 * Category: Sorting and Searching
 * 
 * Description:
 * Write an efficient algorithm that searches for a value in an m x n matrix.
 * Properties:
 * - Integers in each row are sorted from left to right
 * - First integer of each row is greater than last integer of previous row
 * 
 * Example 1:
 * Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
 * Output: true
 * 
 * Example 2:
 * Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
 * Output: false
 */

#include <iostream>
#include <vector>
using namespace std;

/*
 * APPROACH 1: TREAT AS 1D ARRAY (OPTIMAL)
 * Time: O(log(m*n)), Space: O(1)
 */
class Solution1 {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        if (matrix.empty() || matrix[0].empty()) return false;
        
        int m = matrix.size(), n = matrix[0].size();
        int left = 0, right = m * n - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            int midVal = matrix[mid / n][mid % n];
            
            if (midVal == target) return true;
            else if (midVal < target) left = mid + 1;
            else right = mid - 1;
        }
        return false;
    }
};

/*
 * APPROACH 2: TWO BINARY SEARCHES
 * Time: O(log m + log n), Space: O(1)
 */
class Solution2 {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        if (matrix.empty() || matrix[0].empty()) return false;
        
        int m = matrix.size(), n = matrix[0].size();
        
        // Find row
        int top = 0, bottom = m - 1;
        while (top <= bottom) {
            int mid = top + (bottom - top) / 2;
            if (matrix[mid][0] <= target && target <= matrix[mid][n-1]) {
                // Search in this row
                int left = 0, right = n - 1;
                while (left <= right) {
                    int midCol = left + (right - left) / 2;
                    if (matrix[mid][midCol] == target) return true;
                    else if (matrix[mid][midCol] < target) left = midCol + 1;
                    else right = midCol - 1;
                }
                return false;
            } else if (matrix[mid][0] > target) {
                bottom = mid - 1;
            } else {
                top = mid + 1;
            }
        }
        return false;
    }
};

/*
 * APPROACH 3: START FROM TOP-RIGHT
 * Time: O(m + n), Space: O(1)
 */
class Solution3 {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        if (matrix.empty() || matrix[0].empty()) return false;
        
        int row = 0, col = matrix[0].size() - 1;
        
        while (row < matrix.size() && col >= 0) {
            if (matrix[row][col] == target) return true;
            else if (matrix[row][col] > target) col--;
            else row++;
        }
        return false;
    }
};

/*
 * APPROACH 4: LINEAR SEARCH
 * Time: O(m*n), Space: O(1)
 */
class Solution4 {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        for (const auto& row : matrix) {
            for (int val : row) {
                if (val == target) return true;
            }
        }
        return false;
    }
};

/*
 * APPROACH 5: ROW-WISE BINARY SEARCH
 * Time: O(m * log n), Space: O(1)
 */
class Solution5 {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        for (const auto& row : matrix) {
            if (binary_search(row.begin(), row.end(), target)) {
                return true;
            }
        }
        return false;
    }
};

void test(vector<vector<int>> matrix, int target, int approach) {
    bool result;
    cout << "Target: " << target << " -> ";
    
    switch(approach) {
        case 1: { Solution1 sol; result = sol.searchMatrix(matrix, target); break; }
        case 2: { Solution2 sol; result = sol.searchMatrix(matrix, target); break; }
        case 3: { Solution3 sol; result = sol.searchMatrix(matrix, target); break; }
        case 4: { Solution4 sol; result = sol.searchMatrix(matrix, target); break; }
        case 5: { Solution5 sol; result = sol.searchMatrix(matrix, target); break; }
    }
    cout << (result ? "true" : "false") << "\n";
}

int main() {
    vector<vector<int>> matrix = {{1,3,5,7},{10,11,16,20},{23,30,34,60}};
    
    for (int i = 1; i <= 5; i++) {
        cout << "Approach " << i << ":\n";
        test(matrix, 3, i);
        test(matrix, 13, i);
        cout << "\n";
    }
    return 0;
}

// Made with Bob
