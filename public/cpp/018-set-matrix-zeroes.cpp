/*
 * Problem: Set Matrix Zeroes (LeetCode 73)
 * Link: https://leetcode.com/problems/set-matrix-zeroes/
 * Difficulty: Medium
 * Category: Arrays and Strings
 *
 * Description:
 * Given an m x n integer matrix, if an element is 0, set its entire row and
 * column to 0's. You must do it in place.
 *
 * Example 1:
 * Input:  [[1,1,1],[1,0,1],[1,1,1]]
 * Output: [[1,0,1],[0,0,0],[1,0,1]]
 *
 * Example 2:
 * Input:  [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
 * Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
 */

#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

/*
 * APPROACH 1: BRUTE FORCE (Extra matrix copy)
 * Time: O(m*n*(m+n)), Space: O(m*n)
 * Scan for zeroes, then zero out rows/cols in a copy.
 */
class Solution1 {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        vector<vector<int>> copy = matrix;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (copy[i][j] == 0) {
                    for (int k = 0; k < n; k++) matrix[i][k] = 0;
                    for (int k = 0; k < m; k++) matrix[k][j] = 0;
                }
            }
        }
    }
};

/*
 * APPROACH 2: HASH SETS (Record zero positions)
 * Time: O(m*n), Space: O(m+n)
 * First pass: record rows/cols that contain a zero.
 * Second pass: zero out those rows and columns.
 */
class Solution2 {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        unordered_set<int> zeroRows, zeroCols;

        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (matrix[i][j] == 0) {
                    zeroRows.insert(i);
                    zeroCols.insert(j);
                }

        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (zeroRows.count(i) || zeroCols.count(j))
                    matrix[i][j] = 0;
    }
};

/*
 * APPROACH 3: BOOLEAN ARRAYS
 * Time: O(m*n), Space: O(m+n)
 * Same as approach 2 but using plain bool arrays.
 */
class Solution3 {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        vector<bool> rowZero(m, false), colZero(n, false);

        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (matrix[i][j] == 0) {
                    rowZero[i] = true;
                    colZero[j] = true;
                }

        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (rowZero[i] || colZero[j])
                    matrix[i][j] = 0;
    }
};

/*
 * APPROACH 4: FIRST ROW/COL AS MARKERS (OPTIMAL O(1) space)
 * Time: O(m*n), Space: O(1)
 * Use first row and first column as marker arrays.
 * Handle the first row/col's own zero status with two flags.
 */
class Solution4 {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        bool firstRowZero = false, firstColZero = false;

        // Check if first row/col themselves contain a zero
        for (int j = 0; j < n; j++) if (matrix[0][j] == 0) firstRowZero = true;
        for (int i = 0; i < m; i++) if (matrix[i][0] == 0) firstColZero = true;

        // Use first row & col as markers for interior
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }

        // Zero out interior cells based on markers
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][0] == 0 || matrix[0][j] == 0)
                    matrix[i][j] = 0;

        // Zero out first row and col if needed
        if (firstRowZero) for (int j = 0; j < n; j++) matrix[0][j] = 0;
        if (firstColZero) for (int i = 0; i < m; i++) matrix[i][0] = 0;
    }
};

/*
 * APPROACH 5: TWO-PASS WITH SINGLE MARKER VARIABLE
 * Time: O(m*n), Space: O(1)
 * Variant of Approach 4 — use matrix[0][0] as shared marker,
 * track first-column zero separately with one variable.
 */
class Solution5 {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        bool firstColZero = false;

        for (int i = 0; i < m; i++) {
            if (matrix[i][0] == 0) firstColZero = true;
            for (int j = 1; j < n; j++)
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
        }

        for (int i = m - 1; i >= 0; i--) {
            for (int j = 1; j < n; j++)
                if (matrix[i][0] == 0 || matrix[0][j] == 0)
                    matrix[i][j] = 0;
            if (firstColZero) matrix[i][0] = 0;
        }
    }
};

void printMatrix(const vector<vector<int>>& m) {
    for (const auto& row : m) {
        for (int i = 0; i < (int)row.size(); i++) {
            if (i) cout << ",";
            cout << row[i];
        }
        cout << "\n";
    }
}

void test(vector<vector<int>> matrix, int approach) {
    cout << "Approach " << approach << ":\n";
    switch(approach) {
        case 1: { Solution1 s; s.setZeroes(matrix); break; }
        case 2: { Solution2 s; s.setZeroes(matrix); break; }
        case 3: { Solution3 s; s.setZeroes(matrix); break; }
        case 4: { Solution4 s; s.setZeroes(matrix); break; }
        case 5: { Solution5 s; s.setZeroes(matrix); break; }
    }
    printMatrix(matrix);
    cout << "\n";
}

int main() {
    vector<vector<int>> m1 = {{1,1,1},{1,0,1},{1,1,1}};
    vector<vector<int>> m2 = {{0,1,2,0},{3,4,5,2},{1,3,1,5}};

    for (int i = 1; i <= 5; i++) {
        test(m1, i);
        test(m2, i);
    }
    return 0;
}

// Made with Bob
