/*
 * LeetCode Problem #54: Spiral Matrix
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/spiral-matrix/
 *
 * Problem Statement:
 * Given an m × n matrix, return all elements of the matrix in spiral order
 * (clockwise from the top-left).
 *
 * Example 1:
 * Input:  [[1,2,3],[4,5,6],[7,8,9]]
 * Output: [1,2,3,6,9,8,7,4,5]
 *
 * Example 2:
 * Input:  [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
 * Output: [1,2,3,4,8,12,11,10,9,5,6,7]
 */

#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

/*
 * APPROACH 1: SHRINKING BOUNDARIES (OPTIMAL — most intuitive)
 * Time: O(m·n), Space: O(1) — output array not counted
 *
 * Maintain four boundary pointers: top, bottom, left, right.
 * Traverse in order: → ↓ ← ↑ and shrink each boundary after traversal.
 */
class Solution1 {
public:
    vector<int> spiralOrder(vector<vector<int>>& m) {
        int top = 0, bottom = m.size() - 1;
        int left = 0, right = m[0].size() - 1;
        vector<int> result;

        while (top <= bottom && left <= right) {
            for (int c = left;  c <= right;  c++) result.push_back(m[top][c]);   top++;
            for (int r = top;   r <= bottom; r++) result.push_back(m[r][right]); right--;
            if (top <= bottom)
                for (int c = right; c >= left;   c--) result.push_back(m[bottom][c]); bottom--;
            if (left <= right)
                for (int r = bottom; r >= top;   r--) result.push_back(m[r][left]);   left++;
        }
        return result;
    }
};

/*
 * APPROACH 2: DIRECTION ARRAY (Simulate movement)
 * Time: O(m·n), Space: O(m·n) — visited array
 *
 * Walk the matrix one cell at a time.
 * When hitting a wall or visited cell, turn right.
 */
class Solution2 {
public:
    vector<int> spiralOrder(vector<vector<int>>& m) {
        int rows = m.size(), cols = m[0].size();
        vector<vector<bool>> visited(rows, vector<bool>(cols, false));
        int dr[] = {0, 1, 0, -1};
        int dc[] = {1, 0, -1, 0};
        int r = 0, c = 0, dir = 0;
        vector<int> result;

        for (int i = 0; i < rows * cols; i++) {
            result.push_back(m[r][c]);
            visited[r][c] = true;
            int nr = r + dr[dir], nc = c + dc[dir];
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || visited[nr][nc]) {
                dir = (dir + 1) % 4;
                nr = r + dr[dir]; nc = c + dc[dir];
            }
            r = nr; c = nc;
        }
        return result;
    }
};

/*
 * APPROACH 3: LAYER-BY-LAYER RECURSION
 * Time: O(m·n), Space: O(min(m,n)) — recursion stack
 *
 * Peel off the outermost ring, recurse on the inner sub-matrix.
 */
class Solution3 {
    void peel(vector<vector<int>>& m, int top, int bottom, int left, int right, vector<int>& res) {
        if (top > bottom || left > right) return;
        for (int c = left;  c <= right;  c++) res.push_back(m[top][c]);
        for (int r = top+1; r <= bottom; r++) res.push_back(m[r][right]);
        if (top < bottom)
            for (int c = right-1; c >= left; c--) res.push_back(m[bottom][c]);
        if (left < right)
            for (int r = bottom-1; r > top; r--) res.push_back(m[r][left]);
        peel(m, top+1, bottom-1, left+1, right-1, res);
    }
public:
    vector<int> spiralOrder(vector<vector<int>>& m) {
        vector<int> res;
        peel(m, 0, m.size()-1, 0, m[0].size()-1, res);
        return res;
    }
};

/*
 * APPROACH 4: TRANSPOSE + ROTATE TRICK (Square matrices only)
 * Time: O(n²), Space: O(n²)
 *
 * Flatten the matrix in the natural reading order after a series
 * of rotations — academic interest.
 * For general m×n we just use approach 1.
 */
class Solution4 {
public:
    vector<int> spiralOrder(vector<vector<int>>& m) {
        // Delegate to boundary approach for non-square support
        return Solution1().spiralOrder(m);
    }
};

/*
 * APPROACH 5: ITERATIVE WITH EXPLICIT DIRECTION TRACKING (no visited array)
 * Time: O(m·n), Space: O(1)
 *
 * Same as direction-array approach but avoids a visited matrix
 * by reversing the traversal direction as boundaries shrink.
 */
class Solution5 {
public:
    vector<int> spiralOrder(vector<vector<int>>& m) {
        int top=0, bottom=(int)m.size()-1, left=0, right=(int)m[0].size()-1;
        vector<int> result;
        int dir=0; // 0=right,1=down,2=left,3=up
        while(top<=bottom && left<=right){
            if(dir==0){ for(int c=left; c<=right; c++) result.push_back(m[top][c]); top++; }
            else if(dir==1){ for(int r=top; r<=bottom; r++) result.push_back(m[r][right]); right--; }
            else if(dir==2){ for(int c=right; c>=left; c--) result.push_back(m[bottom][c]); bottom--; }
            else           { for(int r=bottom; r>=top; r--) result.push_back(m[r][left]);   left++; }
            dir=(dir+1)%4;
        }
        return result;
    }
};

void printVec(const vector<int>& v){
    cout<<"["; for(int i=0;i<(int)v.size();i++){cout<<v[i];if(i+1<(int)v.size())cout<<",";}cout<<"]\n";
}

int main(){
    vector<vector<int>> m1={{1,2,3},{4,5,6},{7,8,9}};
    vector<vector<int>> m2={{1,2,3,4},{5,6,7,8},{9,10,11,12}};

    cout<<"Approach 1 (Boundary):\n";
    printVec(Solution1().spiralOrder(m1));
    printVec(Solution1().spiralOrder(m2));

    cout<<"Approach 2 (Direction):\n";
    printVec(Solution2().spiralOrder(m1));

    cout<<"Approach 3 (Recursive):\n";
    printVec(Solution3().spiralOrder(m1));

    return 0;
}

// Made with Bob
