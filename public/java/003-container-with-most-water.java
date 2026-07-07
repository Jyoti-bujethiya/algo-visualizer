/*
 * LeetCode Problem #11: Container With Most Water
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/container-with-most-water/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Brute Force | O(n²) time | O(1) space
    // EXPLAIN: Compute the area for every pair of lines and track the maximum.
    // WHEN: Only for very small arrays; useful as a correctness baseline.
    public int maxArea_BruteForce(int[] height) {
        int maxWater = 0;
        int n = height.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = i + 1; j < n; j++) {
                int water = Math.min(height[i], height[j]) * (j - i);
                maxWater = Math.max(maxWater, water);
            }
        }
        return maxWater;
    }

    // APPROACH 2: Two Pointers | O(n) time | O(1) space
    // EXPLAIN: Start with widest container; always move the shorter pointer inward to find a taller wall.
    // WHEN: Optimal — always use this in interviews and production.
    public int maxArea_TwoPointers(int[] height) {
        int left = 0, right = height.length - 1;
        int maxWater = 0;
        while (left < right) {
            int water = Math.min(height[left], height[right]) * (right - left);
            maxWater = Math.max(maxWater, water);
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxWater;
    }

    // APPROACH 3: Two Pointers with Optimization | O(n) time | O(1) space
    // EXPLAIN: Same greedy two-pointer logic but skips lines no taller than the current boundary wall.
    // WHEN: Same worst case as approach 2 but faster in practice when many short lines exist.
    public int maxArea_Optimized(int[] height) {
        int left = 0, right = height.length - 1;
        int maxWater = 0;
        while (left < right) {
            int water = Math.min(height[left], height[right]) * (right - left);
            maxWater = Math.max(maxWater, water);
            if (height[left] < height[right]) {
                int cur = height[left];
                while (left < right && height[left] <= cur) left++;
            } else {
                int cur = height[right];
                while (left < right && height[right] <= cur) right--;
            }
        }
        return maxWater;
    }
}

// Made with Bob
