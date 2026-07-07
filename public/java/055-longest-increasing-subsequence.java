/*
 * LeetCode Problem #300: Longest Increasing Subsequence
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/longest-increasing-subsequence/
 */
import java.util.*;

class Solution {

    // APPROACH 1: DP O(n²) | O(n²) time | O(n) space
    // EXPLAIN: dp[i] = LIS ending at index i; for each j<i where nums[j]<nums[i], dp[i]=max(dp[i],dp[j]+1).
    // WHEN: Use for small n or when you need to reconstruct the actual subsequence.

    public int lengthOfLIS_dp(int[] nums) {
        int n = nums.length;
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        int maxLen = 1;
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
            maxLen = Math.max(maxLen, dp[i]);
        }
        return maxLen;
    }

    // APPROACH 2: DP with Reconstruction | O(n²) time | O(n) space
    // EXPLAIN: Same as Approach 1 but also track parent pointers to reconstruct the actual LIS.
    // WHEN: Use when you need to print the actual subsequence, not just its length.

    public int lengthOfLIS_reconstruct(int[] nums) {
        int n = nums.length;
        int[] dp = new int[n];
        int[] parent = new int[n];
        Arrays.fill(dp, 1);
        Arrays.fill(parent, -1);
        int maxLen = 1, maxIdx = 0;
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;
                    parent[i] = j;
                }
            }
            if (dp[i] > maxLen) { maxLen = dp[i]; maxIdx = i; }
        }
        // Reconstruct (stored but not returned)
        List<Integer> lis = new ArrayList<>();
        for (int cur = maxIdx; cur != -1; cur = parent[cur]) lis.add(nums[cur]);
        Collections.reverse(lis);
        return maxLen;
    }

    // APPROACH 3: Binary Search (Patience Sorting) | O(n log n) time | O(n) space
    // EXPLAIN: Maintain a tails[] array; binary search to find the insertion position for each element.
    // WHEN: Use in production or when n is large (≥10^4) — optimal time complexity.

    public int lengthOfLIS(int[] nums) {
        List<Integer> tails = new ArrayList<>();
        for (int num : nums) {
            int lo = 0, hi = tails.size();
            while (lo < hi) {
                int mid = (lo + hi) / 2;
                if (tails.get(mid) < num) lo = mid + 1;
                else hi = mid;
            }
            if (lo == tails.size()) tails.add(num);
            else tails.set(lo, num);
        }
        return tails.size();
    }

    // APPROACH 4: Binary Search with Manual Implementation | O(n log n) time | O(n) space
    // EXPLAIN: Same as Approach 3 but with a hand-written binary search for better understanding.
    // WHEN: Use when you need to demonstrate binary search mechanics explicitly.

    public int lengthOfLIS_manualBS(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int num : nums) {
            int lo = 0, hi = size;
            while (lo < hi) {
                int mid = (lo + hi) / 2;
                if (tails[mid] < num) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = num;
            if (lo == size) size++;
        }
        return size;
    }

    // APPROACH 5: Segment Tree | O(n log n) time | O(n) space
    // EXPLAIN: Coordinate-compress values; segment tree stores max LIS length for ranges.
    // WHEN: Use for advanced range-query scenarios or when extending to variants of the problem.

    public int lengthOfLIS_segTree(int[] nums) {
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        // coordinate compress
        Map<Integer,Integer> rank = new HashMap<>();
        int r = 0;
        for (int v : sorted) if (!rank.containsKey(v)) rank.put(v, r++);
        int n = r;
        int[] tree = new int[2 * n + 2];
        int max = 0;
        for (int num : nums) {
            int pos = rank.get(num);
            int best = query(tree, 0, pos - 1, n);
            int newLen = best + 1;
            max = Math.max(max, newLen);
            update(tree, pos, newLen, n);
        }
        return max;
    }

    private int query(int[] tree, int lo, int hi, int n) {
        int res = 0;
        for (lo += n, hi += n + 1; lo < hi; lo >>= 1, hi >>= 1) {
            if ((lo & 1) == 1) res = Math.max(res, tree[lo++]);
            if ((hi & 1) == 1) res = Math.max(res, tree[--hi]);
        }
        return res;
    }

    private void update(int[] tree, int pos, int val, int n) {
        pos += n;
        tree[pos] = Math.max(tree[pos], val);
        for (pos >>= 1; pos >= 1; pos >>= 1)
            tree[pos] = Math.max(tree[2 * pos], tree[2 * pos + 1]);
    }
}

// Made with Bob
