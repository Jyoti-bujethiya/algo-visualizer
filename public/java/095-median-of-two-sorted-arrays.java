/*
 * LeetCode Problem #4: Median of Two Sorted Arrays
 * Link: https://leetcode.com/problems/median-of-two-sorted-arrays/
 * Difficulty: Hard
 */
import java.util.*;

class Solution {

    // APPROACH 1: Binary Search on Smaller Array | O(log(min(m,n))) time | O(1) space
    // EXPLAIN: Binary search a partition on the smaller array so that left halves together form the combined lower half.
    public double findMedianSortedArrays1(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) return findMedianSortedArrays1(nums2, nums1);
        int m = nums1.length, n = nums2.length;
        int left = 0, right = m;
        while (left <= right) {
            int p1 = (left + right) / 2;
            int p2 = (m + n + 1) / 2 - p1;
            int maxLeft1  = (p1 == 0) ? Integer.MIN_VALUE : nums1[p1 - 1];
            int minRight1 = (p1 == m) ? Integer.MAX_VALUE : nums1[p1];
            int maxLeft2  = (p2 == 0) ? Integer.MIN_VALUE : nums2[p2 - 1];
            int minRight2 = (p2 == n) ? Integer.MAX_VALUE : nums2[p2];
            if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
                if ((m + n) % 2 == 1) return Math.max(maxLeft1, maxLeft2);
                return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2.0;
            } else if (maxLeft1 > minRight2) right = p1 - 1;
            else left = p1 + 1;
        }
        return 0.0;
    }

    // APPROACH 2: Merge and Find Median | O(m+n) time | O(m+n) space
    // EXPLAIN: Merge both sorted arrays into one, then compute the median from the middle elements.
    public double findMedianSortedArrays2(int[] nums1, int[] nums2) {
        int[] merged = new int[nums1.length + nums2.length];
        int i = 0, j = 0, k = 0;
        while (i < nums1.length && j < nums2.length)
            merged[k++] = (nums1[i] < nums2[j]) ? nums1[i++] : nums2[j++];
        while (i < nums1.length) merged[k++] = nums1[i++];
        while (j < nums2.length) merged[k++] = nums2[j++];
        int n = merged.length;
        if (n % 2 == 1) return merged[n / 2];
        return (merged[n / 2 - 1] + merged[n / 2]) / 2.0;
    }

    // APPROACH 3: Two Pointers (No Merge Array) | O(m+n) time | O(1) space
    // EXPLAIN: Advance two pointers without allocating a merge array; stop at median position.
    public double findMedianSortedArrays3(int[] nums1, int[] nums2) {
        int m = nums1.length, n = nums2.length, total = m + n;
        int i = 0, j = 0, prev = 0, curr = 0;
        for (int c = 0; c <= total / 2; c++) {
            prev = curr;
            if (i < m && (j >= n || nums1[i] < nums2[j])) curr = nums1[i++];
            else curr = nums2[j++];
        }
        if (total % 2 == 1) return curr;
        return (prev + curr) / 2.0;
    }

    // APPROACH 4: Recursive Kth Element | O(log(m+n)) time | O(log(m+n)) space
    // EXPLAIN: Reduce to finding kth element by eliminating k/2 candidates per recursive call.
    public double findMedianSortedArrays4(int[] nums1, int[] nums2) {
        int total = nums1.length + nums2.length;
        if (total % 2 == 1) return findKth(nums1, 0, nums2, 0, total / 2 + 1);
        return (findKth(nums1, 0, nums2, 0, total / 2) +
                findKth(nums1, 0, nums2, 0, total / 2 + 1)) / 2.0;
    }

    private int findKth(int[] a, int i, int[] b, int j, int k) {
        if (i >= a.length) return b[j + k - 1];
        if (j >= b.length) return a[i + k - 1];
        if (k == 1) return Math.min(a[i], b[j]);
        int half = k / 2;
        int mid1 = (i + half - 1 < a.length) ? a[i + half - 1] : Integer.MAX_VALUE;
        int mid2 = (j + half - 1 < b.length) ? b[j + half - 1] : Integer.MAX_VALUE;
        if (mid1 < mid2) return findKth(a, i + half, b, j, k - half);
        else return findKth(a, i, b, j + half, k - half);
    }

    // APPROACH 5: Concatenate and Sort | O((m+n) log(m+n)) time | O(m+n) space
    // EXPLAIN: Combine both arrays, sort, then find the median directly.
    public double findMedianSortedArrays5(int[] nums1, int[] nums2) {
        int[] merged = new int[nums1.length + nums2.length];
        System.arraycopy(nums1, 0, merged, 0, nums1.length);
        System.arraycopy(nums2, 0, merged, nums1.length, nums2.length);
        Arrays.sort(merged);
        int n = merged.length;
        if (n % 2 == 1) return merged[n / 2];
        return (merged[n / 2 - 1] + merged[n / 2]) / 2.0;
    }
}

// Made with Bob
