/*
 * LeetCode Problem #84: Largest Rectangle in Histogram
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/largest-rectangle-in-histogram/
 */

#include <vector>
#include <stack>
#include <algorithm>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Monotonic Stack ====================
    /*
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     * EXPLAIN: Maintain an increasing stack of indices; when current bar is shorter, pop and compute area.
     * WHEN: Standard O(n) solution — the canonical stack approach for this problem.
     */
    int largestRectangleArea_stack(vector<int>& heights) {
        stack<int> st;
        int maxArea = 0;
        int n = heights.size();

        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];
            while (!st.empty() && h < heights[st.top()]) {
                int height = heights[st.top()]; st.pop();
                int width  = st.empty() ? i : i - st.top() - 1;
                maxArea = max(maxArea, height * width);
            }
            st.push(i);
        }
        return maxArea;
    }

    // ==================== APPROACH 2: Brute Force ====================
    /*
     * Time Complexity: O(n²)
     * Space Complexity: O(1)
     * EXPLAIN: For each pair (i,j) compute the minimum height and area; track maximum.
     * WHEN: Educational — too slow for large n but illustrates the problem structure.
     */
    int largestRectangleArea_brute(vector<int>& heights) {
        int n = heights.size(), maxArea = 0;
        for (int i = 0; i < n; i++) {
            int minH = heights[i];
            for (int j = i; j < n; j++) {
                minH = min(minH, heights[j]);
                maxArea = max(maxArea, minH * (j - i + 1));
            }
        }
        return maxArea;
    }

    // ==================== APPROACH 3: Divide and Conquer ====================
    /*
     * Time Complexity: O(n log n) average, O(n²) worst
     * Space Complexity: O(log n)
     * EXPLAIN: Split at the minimum height bar; recursively solve left and right sub-arrays.
     * WHEN: Demonstrates D&C tree structure; O(log n) space on balanced inputs.
     */
    int largestRectangleArea_dc(vector<int>& heights) {
        function<int(int,int)> dc = [&](int lo, int hi) -> int {
            if (lo > hi) return 0;
            int minIdx = lo;
            for (int k = lo; k <= hi; k++)
                if (heights[k] < heights[minIdx]) minIdx = k;
            return max({heights[minIdx] * (hi - lo + 1),
                        dc(lo, minIdx - 1),
                        dc(minIdx + 1, hi)});
        };
        return dc(0, (int)heights.size() - 1);
    }

    int largestRectangleArea(vector<int>& heights) {
        return largestRectangleArea_stack(heights);
    }
};
