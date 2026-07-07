/*
 * LeetCode Problem #704: Binary Search
 * Link: https://leetcode.com/problems/binary-search/
 * Difficulty: Easy
 */
import java.util.*;

class Solution {

    // APPROACH 1: Iterative Binary Search | O(log n) time | O(1) space
    // EXPLAIN: Maintain left/right pointers and halve the search space each iteration.
    public int search1(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    // APPROACH 2: Recursive Binary Search | O(log n) time | O(log n) space
    // EXPLAIN: Same logic as iterative but expressed as a recursive helper.
    public int search2(int[] nums, int target) {
        return helper(nums, target, 0, nums.length - 1);
    }

    private int helper(int[] nums, int target, int left, int right) {
        if (left > right) return -1;
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) return helper(nums, target, mid + 1, right);
        else return helper(nums, target, left, mid - 1);
    }

    // APPROACH 3: Binary Search with Standard Library | O(log n) time | O(1) space
    // EXPLAIN: Use Arrays.binarySearch; returns index if found, negative value otherwise.
    public int search3(int[] nums, int target) {
        int idx = Arrays.binarySearch(nums, target);
        return idx >= 0 ? idx : -1;
    }

    // APPROACH 4: Linear Search | O(n) time | O(1) space
    // EXPLAIN: Simple scan; baseline only — shows the cost that binary search avoids.
    public int search4(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++)
            if (nums[i] == target) return i;
        return -1;
    }

    // APPROACH 5: Binary Search with Bounds Check | O(log n) time | O(1) space
    // EXPLAIN: Add early exit if target is outside [nums[0], nums[n-1]] before the main loop.
    public int search5(int[] nums, int target) {
        if (nums.length == 0 || target < nums[0] || target > nums[nums.length - 1]) return -1;
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}

// Made with Bob
