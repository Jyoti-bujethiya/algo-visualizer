/*
 * LeetCode Problem #33: Search in Rotated Sorted Array
 * Link: https://leetcode.com/problems/search-in-rotated-sorted-array/
 * Difficulty: Medium
 */
import java.util.*;

class Solution {

    // APPROACH 1: One-Pass Modified Binary Search | O(log n) time | O(1) space
    // EXPLAIN: One half is always sorted; determine which half and check if target lies within it.
    public int search1(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[left] <= nums[mid]) {
                if (nums[left] <= target && target < nums[mid]) right = mid - 1;
                else left = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[right]) left = mid + 1;
                else right = mid - 1;
            }
        }
        return -1;
    }

    // APPROACH 2: Find Pivot then Binary Search | O(log n) time | O(1) space
    // EXPLAIN: Binary-search for the rotation pivot, then standard binary search in the correct half.
    public int search2(int[] nums, int target) {
        int n = nums.length;
        int lo = 0, hi = n - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi]) lo = mid + 1;
            else hi = mid;
        }
        int pivot = lo;
        lo = (target < nums[0]) ? pivot : 0;
        hi = (target < nums[0]) ? n - 1 : pivot - 1;
        // handle no-rotation
        if (pivot == 0) { lo = 0; hi = n - 1; }
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    // APPROACH 3: Recursive Modified Binary Search | O(log n) time | O(log n) space
    // EXPLAIN: Recursive version of Approach 1; same sorted-half logic expressed recursively.
    public int search3(int[] nums, int target) {
        return searchHelper(nums, target, 0, nums.length - 1);
    }

    private int searchHelper(int[] nums, int target, int lo, int hi) {
        if (lo > hi) return -1;
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) return searchHelper(nums, target, lo, mid - 1);
            return searchHelper(nums, target, mid + 1, hi);
        } else {
            if (nums[mid] < target && target <= nums[hi]) return searchHelper(nums, target, mid + 1, hi);
            return searchHelper(nums, target, lo, mid - 1);
        }
    }

    // APPROACH 4: Linear Scan | O(n) time | O(1) space
    // EXPLAIN: Brute-force linear scan; baseline only.
    public int search4(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++)
            if (nums[i] == target) return i;
        return -1;
    }

    // APPROACH 5: Index Remapping Binary Search | O(log n) time | O(1) space
    // EXPLAIN: Find pivot first, then remap virtual indices through (mid + pivot) % n to unrotate the array.
    public int search5(int[] nums, int target) {
        int n = nums.length;
        int lo = 0, hi = n - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi]) lo = mid + 1;
            else hi = mid;
        }
        int pivot = lo;
        lo = 0; hi = n - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int realMid = (mid + pivot) % n;
            if (nums[realMid] == target) return realMid;
            else if (nums[realMid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
}

// Made with Bob
