/*
 * LeetCode Problem #153: Find Minimum in Rotated Sorted Array
 * Link: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
 * Difficulty: Medium
 */
import java.util.*;

class Solution {

    // APPROACH 1: Binary Search (Compare to Right) | O(log n) time | O(1) space
    // EXPLAIN: If nums[mid] > nums[right], minimum is in the right half; otherwise narrow to left including mid.
    public int findMin1(int[] nums) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > nums[right]) left = mid + 1;
            else right = mid;
        }
        return nums[left];
    }

    // APPROACH 2: Binary Search (Compare to Left with Early Exit) | O(log n) time | O(1) space
    // EXPLAIN: If range is already sorted (nums[left] < nums[right]), return nums[left] early.
    public int findMin2(int[] nums) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            if (nums[left] < nums[right]) return nums[left];
            int mid = left + (right - left) / 2;
            if (nums[mid] >= nums[left]) left = mid + 1;
            else right = mid;
        }
        return nums[left];
    }

    // APPROACH 3: Recursive Binary Search | O(log n) time | O(log n) space
    // EXPLAIN: Same logic as Approach 1 but expressed recursively with an early-exit for sorted ranges.
    public int findMin3(int[] nums) {
        return minHelper(nums, 0, nums.length - 1);
    }

    private int minHelper(int[] nums, int lo, int hi) {
        if (lo == hi) return nums[lo];
        if (nums[lo] < nums[hi]) return nums[lo];
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) return minHelper(nums, mid + 1, hi);
        else return minHelper(nums, lo, mid);
    }

    // APPROACH 4: Linear Scan | O(n) time | O(1) space
    // EXPLAIN: Track running minimum across all elements; no use of sorted structure.
    public int findMin4(int[] nums) {
        int min = nums[0];
        for (int num : nums) min = Math.min(min, num);
        return min;
    }

    // APPROACH 5: Arrays.stream min | O(n) time | O(1) space
    // EXPLAIN: Use Java streams to find the minimum; functionally equivalent to linear scan.
    public int findMin5(int[] nums) {
        return Arrays.stream(nums).min().getAsInt();
    }
}

// Made with Bob
