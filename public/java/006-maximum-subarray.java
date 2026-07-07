/*
 * LeetCode Problem #53: Maximum Subarray
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/maximum-subarray/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Brute Force | O(n³) time | O(1) space
    // EXPLAIN: Check all possible subarrays, recalculating each sum from scratch with three nested loops.
    // WHEN: Never in practice — only as a correctness baseline before optimisation.
    public int maxSubArray_BruteCubic(int[] nums) {
        int n = nums.length;
        int maxSum = Integer.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                int sum = 0;
                for (int k = i; k <= j; k++) sum += nums[k];
                maxSum = Math.max(maxSum, sum);
            }
        }
        return maxSum;
    }

    // APPROACH 2: Optimized Brute Force | O(n²) time | O(1) space
    // EXPLAIN: Try every subarray starting at each index, accumulating sums incrementally.
    // WHEN: Only for tiny inputs as a correctness reference; Kadane's is always better.
    public int maxSubArray_BruteForce(int[] nums) {
        int maxSum = Integer.MIN_VALUE;
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            int currentSum = 0;
            for (int j = i; j < n; j++) {
                currentSum += nums[j];
                maxSum = Math.max(maxSum, currentSum);
            }
        }
        return maxSum;
    }

    // APPROACH 3: Kadane's Algorithm | O(n) time | O(1) space
    // EXPLAIN: Extend the current subarray if it's beneficial; otherwise restart from the current element.
    // WHEN: Optimal linear solution — the standard interview answer for maximum subarray.
    public int maxSubArray_Kadane(int[] nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum;
    }

    // APPROACH 4: Kadane's with Subarray Indices | O(n) time | O(1) space
    // EXPLAIN: Same as Kadane's but records start/end indices of the maximum subarray.
    // WHEN: When the actual subarray (not just the sum) needs to be returned.
    public int maxSubArray_KadaneWithIndices(int[] nums, int[] startEnd) {
        int maxSum = nums[0], currentSum = nums[0];
        int start = 0, end = 0, tempStart = 0;
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > currentSum + nums[i]) {
                currentSum = nums[i];
                tempStart = i;
            } else {
                currentSum += nums[i];
            }
            if (currentSum > maxSum) {
                maxSum = currentSum;
                start = tempStart;
                end = i;
            }
        }
        if (startEnd != null && startEnd.length >= 2) {
            startEnd[0] = start;
            startEnd[1] = end;
        }
        return maxSum;
    }

    // APPROACH 5: Divide and Conquer | O(n log n) time | O(log n) space
    // EXPLAIN: Split array in half; maximum subarray lies entirely in left, right, or crosses the midpoint.
    // WHEN: Academic interest; demonstrates divide-and-conquer but O(n log n) is suboptimal here.
    public int maxSubArray_DivideConquer(int[] nums) {
        return helper(nums, 0, nums.length - 1);
    }

    private int helper(int[] nums, int left, int right) {
        if (left == right) return nums[left];
        int mid = left + (right - left) / 2;
        int leftMax  = helper(nums, left, mid);
        int rightMax = helper(nums, mid + 1, right);
        int crossMax = crossSum(nums, left, mid, right);
        return Math.max(Math.max(leftMax, rightMax), crossMax);
    }

    private int crossSum(int[] nums, int left, int mid, int right) {
        int leftSum = Integer.MIN_VALUE, sum = 0;
        for (int i = mid; i >= left; i--) {
            sum += nums[i];
            leftSum = Math.max(leftSum, sum);
        }
        int rightSum = Integer.MIN_VALUE;
        sum = 0;
        for (int i = mid + 1; i <= right; i++) {
            sum += nums[i];
            rightSum = Math.max(rightSum, sum);
        }
        return leftSum + rightSum;
    }
}

// Made with Bob
