/*
 * LeetCode Problem #198: House Robber
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/house-robber/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Recursive Memoization (Top-Down DP) | O(n) time | O(n) space
    // EXPLAIN: At each house decide to rob it (skip next) or skip it; cache results.
    // WHEN: Use when the recursive structure is easier to reason about first.

    public int rob_memo(int[] nums) {
        int[] memo = new int[nums.length];
        Arrays.fill(memo, -1);
        return robHelper(nums, 0, memo);
    }

    private int robHelper(int[] nums, int i, int[] memo) {
        if (i >= nums.length) return 0;
        if (memo[i] != -1) return memo[i];
        memo[i] = Math.max(
            nums[i] + robHelper(nums, i + 2, memo),
            robHelper(nums, i + 1, memo)
        );
        return memo[i];
    }

    // APPROACH 2: Bottom-Up DP | O(n) time | O(n) space
    // EXPLAIN: dp[i] = max money from houses 0..i; dp[i] = max(dp[i-1], dp[i-2]+nums[i]).
    // WHEN: Use as the clean iterative DP formulation for interviews.

    public int rob_dp(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        int[] dp = new int[n];
        dp[0] = nums[0];
        dp[1] = Math.max(nums[0], nums[1]);
        for (int i = 2; i < n; i++) {
            dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
        }
        return dp[n - 1];
    }

    // APPROACH 3: Space-Optimized DP | O(n) time | O(1) space
    // EXPLAIN: Track only prev2 and prev1 instead of the full dp array.
    // WHEN: Use as the optimal solution — same logic, constant space.

    public int rob(int[] nums) {
        int prev2 = 0, prev1 = 0;
        for (int num : nums) {
            int cur = Math.max(prev1, prev2 + num);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }

    // APPROACH 4: Rob/Skip State Machine | O(n) time | O(1) space
    // EXPLAIN: Explicitly track rob and skip states each step; return max at end.
    // WHEN: Use as an alternative O(1) formulation emphasising the two-state decision.

    public int rob_rob_skip(int[] nums) {
        int robVal = 0, skipVal = 0;
        for (int num : nums) {
            int newRob  = skipVal + num;
            int newSkip = Math.max(robVal, skipVal);
            robVal  = newRob;
            skipVal = newSkip;
        }
        return Math.max(robVal, skipVal);
    }

    // APPROACH 5: Concise prev/curr | O(n) time | O(1) space
    // EXPLAIN: curr = max(curr, prev + num); swap after each step — most concise variant.
    // WHEN: Use when you want the shortest possible correct implementation.

    public int rob_concise(int[] nums) {
        int prev = 0, curr = 0;
        for (int num : nums) {
            int temp = Math.max(curr, prev + num);
            prev = curr;
            curr = temp;
        }
        return curr;
    }
}

// Made with Bob
