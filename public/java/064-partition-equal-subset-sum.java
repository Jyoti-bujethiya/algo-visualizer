/*
 * LeetCode Problem #416: Partition Equal Subset Sum
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/partition-equal-subset-sum/
 */
import java.util.*;

class Solution {

    // APPROACH 1: 2D Boolean DP | O(n*sum) time | O(n*sum) space
    // EXPLAIN: dp[i][s] = can we form sum s using first i numbers; classic 0/1 knapsack.
    // WHEN: Use when you need the full table to reconstruct which elements were selected.

    public boolean canPartition_2d(int[] nums) {
        int total = 0;
        for (int n : nums) total += n;
        if (total % 2 != 0) return false;
        int target = total / 2;
        int n = nums.length;
        boolean[][] dp = new boolean[n + 1][target + 1];
        dp[0][0] = true;
        for (int i = 1; i <= n; i++) {
            for (int s = 0; s <= target; s++) {
                dp[i][s] = dp[i - 1][s];
                if (s >= nums[i - 1]) dp[i][s] |= dp[i - 1][s - nums[i - 1]];
            }
        }
        return dp[n][target];
    }

    // APPROACH 2: Space-Optimized 1D DP | O(n*sum) time | O(sum) space
    // EXPLAIN: Reduce to a 1D bitset by iterating the sum dimension in reverse to avoid using same item twice.
    // WHEN: Use as the optimal solution — same time complexity but linear space.

    public boolean canPartition(int[] nums) {
        int total = 0;
        for (int n : nums) total += n;
        if (total % 2 != 0) return false;
        int target = total / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int num : nums) {
            // Traverse backwards so each item is used at most once
            for (int s = target; s >= num; s--) {
                dp[s] |= dp[s - num];
            }
        }
        return dp[target];
    }

    // APPROACH 3: Memoization (Top-Down) | O(n*sum) time | O(n*sum) space
    // EXPLAIN: Recursively include or exclude each item; cache (index, remaining) pairs.
    // WHEN: Top-down style is preferred; memoization avoids redundant sub-problem evaluation.

    public boolean canPartition_memo(int[] nums) {
        int total = 0;
        for (int n : nums) total += n;
        if (total % 2 != 0) return false;
        int target = total / 2;
        Boolean[][] memo = new Boolean[nums.length + 1][target + 1];
        return memoHelper(nums, 0, target, memo);
    }

    private boolean memoHelper(int[] nums, int idx, int rem, Boolean[][] memo) {
        if (rem == 0) return true;
        if (idx >= nums.length || rem < 0) return false;
        if (memo[idx][rem] != null) return memo[idx][rem];
        memo[idx][rem] = memoHelper(nums, idx + 1, rem - nums[idx], memo)
                       || memoHelper(nums, idx + 1, rem, memo);
        return memo[idx][rem];
    }

    // APPROACH 4: Bitset Optimisation | O(n*target/64) time | O(target) space
    // EXPLAIN: Represent reachable sums as a BitSet; shift bits by each num to extend sums.
    // WHEN: Java BitSet provides hardware-level parallelism — fastest practical approach.

    public boolean canPartition_bitset(int[] nums) {
        int total = 0;
        for (int n : nums) total += n;
        if (total % 2 != 0) return false;
        int target = total / 2;
        BitSet bits = new BitSet(target + 1);
        bits.set(0);
        for (int num : nums) {
            BitSet shifted = bits.get(0, target + 1 - num);
            // shift left by num using manual iteration
            for (int i = target; i >= num; i--) {
                if (bits.get(i - num)) bits.set(i);
            }
            if (bits.get(target)) return true;
        }
        return bits.get(target);
    }
}

// Made with Bob
