/*
 * LeetCode Problem #239: Sliding Window Maximum
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/sliding-window-maximum/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Brute Force | O(n·k) time | O(1) space
    // EXPLAIN: For each window position, scan all k elements to find the maximum.
    // WHEN: Only for tiny inputs or to verify the deque solution's correctness.
    public int[] maxSlidingWindow_BruteForce(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];
        for (int i = 0; i <= n - k; i++) {
            int max = nums[i];
            for (int j = i + 1; j < i + k; j++) {
                max = Math.max(max, nums[j]);
            }
            result[i] = max;
        }
        return result;
    }

    // APPROACH 2: Monotonic Deque | O(n) time | O(k) space
    // EXPLAIN: Keep a deque of indices in decreasing value order; front always holds the current window max.
    // WHEN: Optimal — the classic O(n) solution for sliding window maximum problems.
    public int[] maxSlidingWindow_Deque(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];
        Deque<Integer> deque = new ArrayDeque<>();

        for (int i = 0; i < n; i++) {
            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
                deque.pollFirst();
            }
            while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {
                deque.pollLast();
            }
            deque.offerLast(i);

            if (i >= k - 1) {
                result[i - k + 1] = nums[deque.peekFirst()];
            }
        }
        return result;
    }

    // APPROACH 3: Sparse Table (Static Range Max) | O(n log n) build + O(1) query | O(n log n) space
    // EXPLAIN: Pre-build a sparse table for range-max queries; each window query is answered in O(1).
    // WHEN: When k varies across many queries on the same array — amortises the build cost.
    public int[] maxSlidingWindow_SparseTable(int[] nums, int k) {
        int n = nums.length;
        int LOG = 1;
        while ((1 << LOG) <= k) LOG++;
        int[][] sparse = new int[LOG][n];
        sparse[0] = Arrays.copyOf(nums, n);
        for (int j = 1; j < LOG; j++) {
            for (int i = 0; i + (1 << j) <= n; i++) {
                sparse[j][i] = Math.max(sparse[j - 1][i], sparse[j - 1][i + (1 << (j - 1))]);
            }
        }

        int[] result = new int[n - k + 1];
        for (int i = 0; i <= n - k; i++) {
            int len = k;
            int p = 31 - Integer.numberOfLeadingZeros(len); // floor(log2(len))
            result[i] = Math.max(sparse[p][i], sparse[p][i + len - (1 << p)]);
        }
        return result;
    }

    // APPROACH 4: Two-Pass Block Decomposition | O(n) time | O(n) space
    // EXPLAIN: Split array into blocks of size k; prefix/suffix max within blocks gives window max in O(1).
    // WHEN: Alternative O(n) approach without a deque — straightforward array-based solution.
    public int[] maxSlidingWindow_BlockDecomp(int[] nums, int k) {
        int n = nums.length;
        int[] left  = new int[n];
        int[] right = new int[n];

        for (int i = 0; i < n; i++) {
            left[i] = (i % k == 0) ? nums[i] : Math.max(left[i - 1], nums[i]);
        }
        for (int i = n - 1; i >= 0; i--) {
            right[i] = (i % k == k - 1 || i == n - 1) ? nums[i] : Math.max(right[i + 1], nums[i]);
        }

        int[] result = new int[n - k + 1];
        for (int i = 0; i <= n - k; i++) {
            result[i] = Math.max(right[i], left[i + k - 1]);
        }
        return result;
    }

    // APPROACH 5: TreeMap (Sorted Container) | O(n log k) time | O(k) space
    // EXPLAIN: Maintain a TreeMap of (value -> count) for the window; max is always the last key.
    // WHEN: When a sorted view of the window is needed beyond just the maximum.
    public int[] maxSlidingWindow_TreeMap(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];
        TreeMap<Integer, Integer> map = new TreeMap<>();

        for (int i = 0; i < n; i++) {
            map.merge(nums[i], 1, Integer::sum);
            if (i >= k) {
                int old = nums[i - k];
                if (map.get(old) == 1) map.remove(old);
                else map.merge(old, -1, Integer::sum);
            }
            if (i >= k - 1) {
                result[i - k + 1] = map.lastKey();
            }
        }
        return result;
    }
}

// Made with Bob
