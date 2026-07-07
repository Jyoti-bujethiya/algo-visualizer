/*
 * LeetCode Problem #42: Trapping Rain Water
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/trapping-rain-water/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Brute Force | O(n²) time | O(1) space
    // EXPLAIN: For each bar, scan left and right to find the tallest walls, then compute trapped water.
    // WHEN: Educational baseline only; too slow for large inputs.
    public int trap_BruteForce(int[] height) {
        int n = height.length;
        int totalWater = 0;
        for (int i = 0; i < n; i++) {
            int leftMax = 0, rightMax = 0;
            for (int j = 0; j <= i; j++) leftMax = Math.max(leftMax, height[j]);
            for (int j = i; j < n; j++) rightMax = Math.max(rightMax, height[j]);
            totalWater += Math.min(leftMax, rightMax) - height[i];
        }
        return totalWater;
    }

    // APPROACH 2: Prefix & Suffix Arrays | O(n) time | O(n) space
    // EXPLAIN: Precompute max height to the left and right of each bar; water at i = min(maxL, maxR) - height[i].
    // WHEN: Easy to reason about; good when clarity is preferred over memory optimisation.
    public int trap_PrefixSuffix(int[] height) {
        int n = height.length;
        if (n == 0) return 0;

        int[] maxLeft = new int[n];
        int[] maxRight = new int[n];

        maxLeft[0] = height[0];
        for (int i = 1; i < n; i++) {
            maxLeft[i] = Math.max(maxLeft[i - 1], height[i]);
        }

        maxRight[n - 1] = height[n - 1];
        for (int i = n - 2; i >= 0; i--) {
            maxRight[i] = Math.max(maxRight[i + 1], height[i]);
        }

        int water = 0;
        for (int i = 0; i < n; i++) {
            water += Math.min(maxLeft[i], maxRight[i]) - height[i];
        }
        return water;
    }

    // APPROACH 3: Two Pointers | O(n) time | O(1) space
    // EXPLAIN: Maintain left/right max on the fly; the side with the smaller max determines water trapped.
    // WHEN: Optimal — O(n) time and O(1) space; preferred in interviews.
    public int trap_TwoPointers(int[] height) {
        int left = 0, right = height.length - 1;
        int maxLeft = 0, maxRight = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= maxLeft) {
                    maxLeft = height[left];
                } else {
                    water += maxLeft - height[left];
                }
                left++;
            } else {
                if (height[right] >= maxRight) {
                    maxRight = height[right];
                } else {
                    water += maxRight - height[right];
                }
                right--;
            }
        }
        return water;
    }

    // APPROACH 4: Monotonic Stack | O(n) time | O(n) space
    // EXPLAIN: Use a stack to track bars; when a taller bar is found, pop and compute trapped water horizontally.
    // WHEN: Useful when thinking in terms of horizontal water layers between bars.
    public int trap_Stack(int[] height) {
        Deque<Integer> stack = new ArrayDeque<>();
        int water = 0;
        for (int i = 0; i < height.length; i++) {
            while (!stack.isEmpty() && height[i] > height[stack.peek()]) {
                int top = stack.pop();
                if (stack.isEmpty()) break;
                int distance = i - stack.peek() - 1;
                int boundedHeight = Math.min(height[i], height[stack.peek()]) - height[top];
                water += distance * boundedHeight;
            }
            stack.push(i);
        }
        return water;
    }
}

// Made with Bob
