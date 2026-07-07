/*
 * LeetCode Problem #215: Kth Largest Element in an Array
 * Link: https://leetcode.com/problems/kth-largest-element-in-an-array/
 * Difficulty: Medium
 */
import java.util.*;

class Solution {

    // APPROACH 1: Quickselect | O(n) average time | O(log n) space
    // EXPLAIN: Partition in descending order; recurse only on the side containing position k-1.
    public int findKthLargest1(int[] nums, int k) {
        return quickselect(nums, 0, nums.length - 1, k - 1);
    }

    private int quickselect(int[] nums, int lo, int hi, int target) {
        if (lo == hi) return nums[lo];
        int p = partition(nums, lo, hi);
        if (p == target) return nums[p];
        else if (p < target) return quickselect(nums, p + 1, hi, target);
        else return quickselect(nums, lo, p - 1, target);
    }

    private int partition(int[] nums, int lo, int hi) {
        int pivot = nums[hi], i = lo;
        for (int j = lo; j < hi; j++) {
            if (nums[j] >= pivot) {
                int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp; i++;
            }
        }
        int tmp = nums[i]; nums[i] = nums[hi]; nums[hi] = tmp;
        return i;
    }

    // APPROACH 2: Min Heap of Size K | O(n log k) time | O(k) space
    // EXPLAIN: Maintain a min-heap of size k; the top is always the kth largest.
    public int findKthLargest2(int[] nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int num : nums) {
            minHeap.offer(num);
            if (minHeap.size() > k) minHeap.poll();
        }
        return minHeap.peek();
    }

    // APPROACH 3: Sort Descending | O(n log n) time | O(1) space
    // EXPLAIN: Sort in descending order and return nums[k-1].
    public int findKthLargest3(int[] nums, int k) {
        Arrays.sort(nums);
        return nums[nums.length - k];
    }

    // APPROACH 4: Max Heap (Extract k Times) | O(n + k log n) time | O(n) space
    // EXPLAIN: Build a max-heap, then pop k times to reach the kth largest.
    public int findKthLargest4(int[] nums, int k) {
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        for (int num : nums) maxHeap.offer(num);
        for (int i = 0; i < k - 1; i++) maxHeap.poll();
        return maxHeap.peek();
    }

    // APPROACH 5: nth_element via partial sort | O(n) average time | O(1) space
    // EXPLAIN: Use partial nth-element selection: rearrange so element at position k-1 is correct.
    public int findKthLargest5(int[] nums, int k) {
        // Simulate nth_element with a quickselect that stops early
        int lo = 0, hi = nums.length - 1, target = k - 1;
        while (lo < hi) {
            int p = partitionDesc(nums, lo, hi);
            if (p == target) return nums[p];
            else if (p < target) lo = p + 1;
            else hi = p - 1;
        }
        return nums[lo];
    }

    private int partitionDesc(int[] nums, int lo, int hi) {
        int pivot = nums[hi], i = lo;
        for (int j = lo; j < hi; j++) {
            if (nums[j] >= pivot) {
                int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp; i++;
            }
        }
        int tmp = nums[i]; nums[i] = nums[hi]; nums[hi] = tmp;
        return i;
    }
}

// Made with Bob
