/*
 * LeetCode Problem #347: Top K Frequent Elements
 * Link: https://leetcode.com/problems/top-k-frequent-elements/
 * Difficulty: Medium
 */
import java.util.*;

class Solution {

    // APPROACH 1: Min Heap of Size K | O(n log k) time | O(n) space
    // EXPLAIN: Count frequencies, then maintain a min-heap of size k keyed by frequency.
    public int[] topKFrequent1(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) freq.merge(num, 1, Integer::sum);
        PriorityQueue<int[]> minHeap = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            minHeap.offer(new int[]{e.getValue(), e.getKey()});
            if (minHeap.size() > k) minHeap.poll();
        }
        int[] result = new int[k];
        for (int i = 0; i < k; i++) result[i] = minHeap.poll()[1];
        return result;
    }

    // APPROACH 2: Bucket Sort | O(n) time | O(n) space
    // EXPLAIN: Place elements into frequency buckets; collect from highest bucket downward.
    @SuppressWarnings("unchecked")
    public int[] topKFrequent2(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) freq.merge(num, 1, Integer::sum);
        List<Integer>[] buckets = new List[nums.length + 1];
        for (int i = 0; i <= nums.length; i++) buckets[i] = new ArrayList<>();
        for (Map.Entry<Integer, Integer> e : freq.entrySet())
            buckets[e.getValue()].add(e.getKey());
        int[] result = new int[k];
        int idx = 0;
        for (int i = buckets.length - 1; i >= 0 && idx < k; i--)
            for (int num : buckets[i]) { result[idx++] = num; if (idx == k) break; }
        return result;
    }

    // APPROACH 3: Quickselect on Frequency | O(n) average time | O(n) space
    // EXPLAIN: Convert to (num, freq) pairs and use quickselect to partially sort by frequency descending.
    public int[] topKFrequent3(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) freq.merge(num, 1, Integer::sum);
        int[][] pairs = new int[freq.size()][2];
        int idx = 0;
        for (Map.Entry<Integer, Integer> e : freq.entrySet())
            pairs[idx++] = new int[]{e.getKey(), e.getValue()};
        quickselect(pairs, 0, pairs.length - 1, k - 1);
        int[] result = new int[k];
        for (int i = 0; i < k; i++) result[i] = pairs[i][0];
        return result;
    }

    private void quickselect(int[][] arr, int lo, int hi, int k) {
        if (lo >= hi) return;
        int p = partitionByFreq(arr, lo, hi);
        if (p == k) return;
        else if (p < k) quickselect(arr, p + 1, hi, k);
        else quickselect(arr, lo, p - 1, k);
    }

    private int partitionByFreq(int[][] arr, int lo, int hi) {
        int pivot = arr[hi][1], i = lo;
        for (int j = lo; j < hi; j++) {
            if (arr[j][1] >= pivot) {
                int[] tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; i++;
            }
        }
        int[] tmp = arr[i]; arr[i] = arr[hi]; arr[hi] = tmp;
        return i;
    }

    // APPROACH 4: Sort by Frequency | O(n log n) time | O(n) space
    // EXPLAIN: Count frequencies, sort all unique elements by frequency descending, take first k.
    public int[] topKFrequent4(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) freq.merge(num, 1, Integer::sum);
        List<Integer> keys = new ArrayList<>(freq.keySet());
        keys.sort((a, b) -> freq.get(b) - freq.get(a));
        int[] result = new int[k];
        for (int i = 0; i < k; i++) result[i] = keys.get(i);
        return result;
    }

    // APPROACH 5: Max Heap | O(n log n) time | O(n) space
    // EXPLAIN: Push all (freq, num) into a max-heap keyed by frequency, extract k times.
    public int[] topKFrequent5(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) freq.merge(num, 1, Integer::sum);
        PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a, b) -> b[0] - a[0]);
        for (Map.Entry<Integer, Integer> e : freq.entrySet())
            maxHeap.offer(new int[]{e.getValue(), e.getKey()});
        int[] result = new int[k];
        for (int i = 0; i < k; i++) result[i] = maxHeap.poll()[1];
        return result;
    }
}

// Made with Bob
