/*
 * LeetCode Problem #48: Rotate Image
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/rotate-image/
 *
 * Problem Statement:
 * You are given an n × n 2D matrix representing an image.
 * Rotate the image by 90 degrees (clockwise) IN-PLACE.
 * You must modify the matrix directly without allocating another 2D matrix.
 *
 * Example 1:
 * Input:  [[1,2,3],[4,5,6],[7,8,9]]
 * Output: [[7,4,1],[8,5,2],[9,6,3]]
 *
 * Example 2:
 * Input:  [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
 * Output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
 */

#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

/*
 * APPROACH 1: TRANSPOSE + REVERSE ROWS (OPTIMAL — In-Place)
 * Time: O(n²), Space: O(1)
 *
 * Key Insight:
 *   Clockwise 90° = Transpose (flip along main diagonal) + Reverse each row.
 *   Step 1: matrix[i][j] ↔ matrix[j][i]   (transpose)
 *   Step 2: reverse each row               (horizontal flip)
 */
class Solution1 {
public:
    void rotate(vector<vector<int>>& m) {
        int n = m.size();
        // Transpose
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                swap(m[i][j], m[j][i]);
        // Reverse each row
        for (int i = 0; i < n; i++)
            reverse(m[i].begin(), m[i].end());
    }
};

/*
 * APPROACH 2: REVERSE ROWS + TRANSPOSE (Counter-clockwise helper)
 * Time: O(n²), Space: O(1)
 *
 * Counter-clockwise 90° = Transpose + Reverse each column.
 * Clockwise 90°          = Reverse rows + Transpose.
 */
class Solution2 {
public:
    void rotate(vector<vector<int>>& m) {
        int n = m.size();
        // Reverse the entire matrix vertically (reverse row order)
        for (int i = 0; i < n / 2; i++)
            swap(m[i], m[n - 1 - i]);
        // Transpose
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                swap(m[i][j], m[j][i]);
    }
};

/*
 * APPROACH 3: FOUR-WAY CYCLE (Layer-by-layer)
 * Time: O(n²), Space: O(1)
 *
 * Process each "layer" (ring) from outermost to innermost.
 * For each element in a layer, do a 4-way cyclic swap:
 *   top → right → bottom → left → top
 */
class Solution3 {
public:
    void rotate(vector<vector<int>>& m) {
        int n = m.size();
        for (int layer = 0; layer < n / 2; layer++) {
            int first = layer, last = n - 1 - layer;
            for (int i = first; i < last; i++) {
                int offset = i - first;
                int top = m[first][i];
                // left → top
                m[first][i] = m[last - offset][first];
                // bottom → left
                m[last - offset][first] = m[last][last - offset];
                // right → bottom
                m[last][last - offset] = m[i][last];
                // top → right
                m[i][last] = top;
            }
        }
    }
};

/*
 * APPROACH 4: COPY TO NEW MATRIX (Extra Space)
 * Time: O(n²), Space: O(n²)
 *
 * For each element at (i, j) in original:
 *   new_matrix[j][n-1-i] = original[i][j]
 */
class Solution4 {
public:
    void rotate(vector<vector<int>>& m) {
        int n = m.size();
        vector<vector<int>> res(n, vector<int>(n));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                res[j][n - 1 - i] = m[i][j];
        m = res;
    }
};

/*
 * APPROACH 5: TRANSPOSE + REVERSE COLUMNS (Anti-clockwise)
 * Time: O(n²), Space: O(1)
 * (Counter-clockwise rotation — included for completeness)
 *   = Transpose + reverse each column
 */
class Solution5 {
public:
    void rotateCCW(vector<vector<int>>& m) {
        int n = m.size();
        // Transpose
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                swap(m[i][j], m[j][i]);
        // Reverse each column
        for (int j = 0; j < n; j++)
            for (int i = 0; i < n / 2; i++)
                swap(m[i][j], m[n - 1 - i][j]);
    }
    void rotate(vector<vector<int>>& m) { rotateCCW(m); rotateCCW(m); rotateCCW(m); }
};

void printMatrix(const vector<vector<int>>& m) {
    for (const auto& row : m) {
        for (int v : row) cout << v << " ";
        cout << "\n";
    }
    cout << "\n";
}

int main() {
    vector<vector<int>> m1 = {{1,2,3},{4,5,6},{7,8,9}};
    vector<vector<int>> m2 = {{5,1,9,11},{2,4,8,10},{13,3,6,7},{15,14,12,16}};

    cout << "Approach 1 (Transpose+Reverse):\n";
    { Solution1 s; s.rotate(m1); printMatrix(m1); }

    cout << "Approach 3 (Four-way cycle):\n";
    { Solution3 s; s.rotate(m2); printMatrix(m2); }

    return 0;
}

// Made with Bob
