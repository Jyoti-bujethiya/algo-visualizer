/*
 * LeetCode Problem #34: Find First and Last Position of Element in Sorted Array
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Linear Scan | O(n) time | O(1) space
    // EXPLAIN: Walk the array once; update first on the first occurrence and last on every occurrence.
    // WHEN: Fallback for small or unsorted arrays; not acceptable when O(log n) is explicitly required.
    public int[] searchRange_Linear(int[] nums, int target) {
        int first = -1, last = -1;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) {
                if (first == -1) first = i;
                last = i;
            }
        }
        return new int[]{first, last};
    }

    // APPROACH 2: Two Binary Searches | O(log n) time | O(1) space
    // EXPLAIN: Run one binary search biased toward the left bound and another toward the right bound.
    // WHEN: Optimal — two independent O(log n) passes; always use this for sorted arrays.
    public int[] searchRange(int[] nums, int target) {
        return new int[]{findFirst(nums, target), findLast(nums, target)};
    }

    private int findFirst(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1, index = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) {
                index = mid;
                hi = mid - 1; // bias left
            } else if (nums[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return index;
    }

    private int findLast(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1, index = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) {
                index = mid;
                lo = mid + 1; // bias right
            } else if (nums[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return index;
    }

    // APPROACH 3: STL-Style (Arrays.binarySearch analogue) | O(log n) time | O(1) space
    // EXPLAIN: Manually implement lower_bound (first position ≥ target) and upper_bound (first position > target).
    // WHEN: When you want to show awareness of the lower/upper_bound library idiom in Java.
    public int[] searchRange_Bounds(int[] nums, int target) {
        int lo = lowerBound(nums, target);
        if (lo >= nums.length || nums[lo] != target) return new int[]{-1, -1};
        int hi = lowerBound(nums, target + 1) - 1;
        return new int[]{lo, hi};
    }

    // Returns first index where nums[i] >= val
    private int lowerBound(int[] nums, int val) {
        int lo = 0, hi = nums.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < val) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    // APPROACH 4: Single Binary Search with Flag | O(log n) time | O(1) space
    // EXPLAIN: One parameterised helper: when findFirst=true bias left; otherwise bias right.
    // WHEN: DRY approach — one function replaces two; clean when code reuse is valued.
    public int[] searchRange_Flag(int[] nums, int target) {
        return new int[]{
            binarySearch(nums, target, true),
            binarySearch(nums, target, false)
        };
    }

    private int binarySearch(int[] nums, int target, boolean findFirst) {
        int lo = 0, hi = nums.length - 1, res = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) {
                res = mid;
                if (findFirst) hi = mid - 1;
                else           lo = mid + 1;
            } else if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return res;
    }

    // APPROACH 5: Recursive Binary Search | O(log n) time | O(log n) space
    // EXPLAIN: Implement both boundary searches recursively — count recursion depth as O(log n) stack space.
    // WHEN: When a recursive solution is required or preferred for clarity; stack depth O(log n) is acceptable.
    public int[] searchRange_Recursive(int[] nums, int target) {
        return new int[]{
            findFirstRec(nums, target, 0, nums.length - 1),
            findLastRec(nums, target, 0, nums.length - 1)
        };
    }

    private int findFirstRec(int[] nums, int target, int lo, int hi) {
        if (lo > hi) return -1;
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) {
            int left = findFirstRec(nums, target, lo, mid - 1);
            return left == -1 ? mid : left;
        }
        return nums[mid] < target ? findFirstRec(nums, target, mid + 1, hi)
                                  : findFirstRec(nums, target, lo, mid - 1);
    }

    private int findLastRec(int[] nums, int target, int lo, int hi) {
        if (lo > hi) return -1;
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) {
            int right = findLastRec(nums, target, mid + 1, hi);
            return right == -1 ? mid : right;
        }
        return nums[mid] < target ? findLastRec(nums, target, mid + 1, hi)
                                  : findLastRec(nums, target, lo, mid - 1);
    }
}

// Made with Bob
