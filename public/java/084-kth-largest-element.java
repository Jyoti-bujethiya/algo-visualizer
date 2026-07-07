/*
 * LeetCode Problem #215: Kth Largest Element in an Array
 * Link: https://leetcode.com/problems/kth-largest-element-in-an-array/
 * Difficulty: Medium
 */
import java.util.*;

class Solution {

    // APPROACH 1: Min Heap of Size K | O(n log k) time | O(k) space
    // EXPLAIN: Maintain a min-heap of exactly k elements; the top is the kth largest.
    public int findKthLargest1(int[] nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int num : nums) {
            minHeap.offer(num);
            if (minHeap.size() > k) minHeap.poll();
        }
        return minHeap.peek();
    }

    // APPROACH 2: Sort Descending | O(n log n) time | O(1) space
    // EXPLAIN: Sort in descending order and return the element at index k-1.
    public int findKthLargest2(int[] nums, int k) {
        Arrays.sort(nums);
        return nums[nums.length - k];
    }

    // APPROACH 3: Quickselect | O(n) average time | O(log n) space
    // EXPLAIN: Partition array in descending order around a pivot; recurse only on the relevant side.
    public int findKthLargest3(int[] nums, int k) {
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
            if (nums[j] >= pivot) { // descending order
                int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
                i++;
            }
        }
        int tmp = nums[i]; nums[i] = nums[hi]; nums[hi] = tmp;
        return i;
    }

    // APPROACH 4: Max Heap (Extract k Times) | O(n + k log n) time | O(n) space
    // EXPLAIN: Build a max-heap from all elements, then pop k times.
    public int findKthLargest4(int[] nums, int k) {
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        for (int num : nums) maxHeap.offer(num);
        for (int i = 0; i < k - 1; i++) maxHeap.poll();
        return maxHeap.peek();
    }

    // APPROACH 5: Counting Sort | O(n + R) time | O(R) space
    // EXPLAIN: Use a frequency array over the bounded range [-10^4, 10^4] and scan from high to low.
    public int findKthLargest5(int[] nums, int k) {
        int OFFSET = 10000, R = 20001;
        int[] cnt = new int[R];
        for (int n : nums) cnt[n + OFFSET]++;
        int remain = k;
        for (int v = R - 1; v >= 0; v--) {
            remain -= cnt[v];
            if (remain <= 0) return v - OFFSET;
        }
        return -1;
    }
}

// Made with Bob
