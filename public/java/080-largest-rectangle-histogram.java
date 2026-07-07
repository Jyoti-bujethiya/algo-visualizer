/*
 * LeetCode Problem #84: Largest Rectangle in Histogram
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/largest-rectangle-in-histogram/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Monotonic Stack (Optimal) | O(n) time | O(n) space
    // EXPLAIN: Maintain an increasing stack of indices; when current bar is shorter, pop and compute area.
    // WHEN: Standard O(n) solution — the canonical stack approach for this problem.
    public int largestRectangleArea_stack(int[] heights) {
        int n = heights.length, maxArea = 0;
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];
            while (!stack.isEmpty() && h < heights[stack.peek()]) {
                int height = heights[stack.pop()];
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }
        return maxArea;
    }

    // APPROACH 2: Brute Force | O(n²) time | O(1) space
    // EXPLAIN: For each pair (i,j) track minimum height; area = minH * (j-i+1).
    // WHEN: Educational — illustrates the problem structure; too slow for large n.
    public int largestRectangleArea_brute(int[] heights) {
        int n = heights.length, maxArea = 0;
        for (int i = 0; i < n; i++) {
            int minH = heights[i];
            for (int j = i; j < n; j++) {
                minH = Math.min(minH, heights[j]);
                maxArea = Math.max(maxArea, minH * (j - i + 1));
            }
        }
        return maxArea;
    }

    // APPROACH 3: Stack with Sentinel (clean version) | O(n) time | O(n) space
    // EXPLAIN: Add height-0 sentinels at both ends; simplifies boundary handling.
    // WHEN: Cleaner code at the cost of one extra allocation — preferred in interviews.
    public int largestRectangleArea(int[] heights) {
        int n = heights.length;
        int[] h = new int[n + 2];
        System.arraycopy(heights, 0, h, 1, n);
        // h[0] = 0 (left sentinel), h[n+1] = 0 (right sentinel)
        Deque<Integer> stack = new ArrayDeque<>();
        int maxArea = 0;
        for (int i = 0; i < h.length; i++) {
            while (!stack.isEmpty() && h[i] < h[stack.peek()]) {
                int height = h[stack.pop()];
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }
        return maxArea;
    }
}

// Made with Bob
