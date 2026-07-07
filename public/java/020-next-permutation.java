/*
 * LeetCode Problem #31: Next Permutation
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/next-permutation/
 */
import java.util.*;

class Solution {

    // APPROACH 1: STL next_permutation (Library) | O(n) time | O(1) space
    // EXPLAIN: Replicate what C++ std::next_permutation does — for completeness; Java has no direct equivalent.
    // WHEN: Reference implementation to understand the algorithm before coding it manually.
    public void nextPermutation_STL(int[] nums) {
        // Java has no built-in next_permutation; implement it exactly as approach 2
        nextPermutation(nums);
    }

    // APPROACH 2: Classic In-Place | O(n) time | O(1) space
    // EXPLAIN: Find the rightmost descent, swap with the next larger element to its right, then reverse the suffix.
    // WHEN: The only practical approach — exploits the structure of permutation ordering directly.
    public void nextPermutation(int[] nums) {
        int n = nums.length;

        // Step 1: Find rightmost index i where nums[i] < nums[i+1]
        int i = n - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) {
            i--;
        }

        if (i >= 0) {
            // Step 2: Find rightmost index j where nums[j] > nums[i]
            int j = n - 1;
            while (nums[j] <= nums[i]) {
                j--;
            }
            // Step 3: Swap nums[i] and nums[j]
            int temp = nums[i];
            nums[i] = nums[j];
            nums[j] = temp;
        }

        // Step 4: Reverse the suffix starting at i+1
        int left = i + 1, right = n - 1;
        while (left < right) {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            left++;
            right--;
        }
    }

    // APPROACH 3: Explicit Reverse (No Arrays.sort) | O(n) time | O(1) space
    // EXPLAIN: Same four-step algorithm as approach 2 but the suffix reversal is spelled out without helpers.
    // WHEN: When you want to be explicit about each operation and avoid any library call.
    public void nextPermutation_ExplicitReverse(int[] nums) {
        int n = nums.length;
        int i = n - 2;

        while (i >= 0 && nums[i] >= nums[i + 1]) i--;

        if (i >= 0) {
            int j = n - 1;
            while (nums[j] <= nums[i]) j--;
            int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
        }

        // Manual reverse of suffix
        int lo = i + 1, hi = n - 1;
        while (lo < hi) {
            int tmp = nums[lo]; nums[lo] = nums[hi]; nums[hi] = tmp;
            lo++; hi--;
        }
    }

    // APPROACH 4: Two-Pass Scan (Verbose / Educational) | O(n) time | O(1) space
    // EXPLAIN: Same as approach 2 but uses descriptive variable names (pivot, swapIdx) to highlight the four conceptual steps.
    // WHEN: Teaching or explaining the algorithm — very readable for code review or whiteboard discussions.
    public void nextPermutation_TwoPass(int[] nums) {
        int n = nums.length;

        // Pass 1: find "dip" — last index where ascending order breaks
        int pivot = -1;
        for (int i = n - 2; i >= 0; i--) {
            if (nums[i] < nums[i + 1]) { pivot = i; break; }
        }

        if (pivot == -1) {
            // Entirely non-increasing → return smallest permutation
            Arrays.sort(nums);
            return;
        }

        // Pass 2: find smallest in suffix that is greater than pivot element
        int swapIdx = -1;
        for (int j = n - 1; j > pivot; j--) {
            if (nums[j] > nums[pivot]) { swapIdx = j; break; }
        }

        int tmp = nums[pivot]; nums[pivot] = nums[swapIdx]; nums[swapIdx] = tmp;

        // Reverse suffix
        int lo = pivot + 1, hi = n - 1;
        while (lo < hi) {
            tmp = nums[lo]; nums[lo] = nums[hi]; nums[hi] = tmp;
            lo++; hi--;
        }
    }

    // APPROACH 5: Sort-Based | O(n log n) time | O(1) space
    // EXPLAIN: Same pivot-and-swap logic but sort the suffix instead of reversing it — correct because suffix is descending.
    // WHEN: Slightly less optimal than reversing but works; shows understanding that sorting a desc array = O(n).
    public void nextPermutation_SortBased(int[] nums) {
        int n = nums.length;
        int i = n - 2;

        while (i >= 0 && nums[i] >= nums[i + 1]) i--;

        if (i >= 0) {
            int j = n - 1;
            while (nums[j] <= nums[i]) j--;
            int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
        }

        // Sort suffix (works because it is in descending order after the swap)
        Arrays.sort(nums, i + 1, n);
    }
}

// Made with Bob
