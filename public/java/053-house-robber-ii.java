/*
 * LeetCode Problem #213: House Robber II
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/house-robber-ii/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Two-Pass Linear DP | O(n) time | O(1) space
    // EXPLAIN: Run House Robber I on [0..n-2] and [1..n-1] separately; return the max.
    // WHEN: Use whenever houses form a circular arrangement — the canonical reduction.

    public int rob(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        if (n == 2) return Math.max(nums[0], nums[1]);
        return Math.max(robRange(nums, 0, n - 2), robRange(nums, 1, n - 1));
    }

    private int robRange(int[] nums, int lo, int hi) {
        int prev2 = 0, prev1 = 0;
        for (int i = lo; i <= hi; i++) {
            int cur = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }

    // APPROACH 2: Explicit Two-Pass with Result Array | O(n) time | O(n) space
    // EXPLAIN: Build two dp arrays for each linear subproblem; take the maximum.
    // WHEN: Use when you want to inspect intermediate dp values for debugging.

    public int rob_verbose(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        if (n == 2) return Math.max(nums[0], nums[1]);

        // Pass 1: exclude last house (indices 0..n-2)
        int[] dp1 = new int[n];
        dp1[0] = nums[0];
        dp1[1] = Math.max(nums[0], nums[1]);
        for (int i = 2; i < n - 1; i++)
            dp1[i] = Math.max(dp1[i - 1], dp1[i - 2] + nums[i]);

        // Pass 2: exclude first house (indices 1..n-1)
        int[] dp2 = new int[n];
        dp2[1] = nums[1];
        if (n > 2) dp2[2] = Math.max(nums[1], nums[2]);
        for (int i = 3; i < n; i++)
            dp2[i] = Math.max(dp2[i - 1], dp2[i - 2] + nums[i]);

        return Math.max(dp1[n - 2], dp2[n - 1]);
    }

    // APPROACH 3: Memoization (Top-Down) | O(n) time | O(n) space
    // EXPLAIN: Two recursive helpers each with memo arrays for [0..n-2] and [1..n-1] ranges.
    // WHEN: Use when top-down style is preferred and you want explicit range boundaries.

    public int rob_memo(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        if (n == 2) return Math.max(nums[0], nums[1]);
        int[] memo1 = new int[n]; Arrays.fill(memo1, -1);
        int[] memo2 = new int[n]; Arrays.fill(memo2, -1);
        return Math.max(
            robMemoHelper(nums, 0, n - 2, memo1),
            robMemoHelper(nums, 1, n - 1, memo2)
        );
    }

    private int robMemoHelper(int[] nums, int i, int hi, int[] memo) {
        if (i > hi) return 0;
        if (memo[i] != -1) return memo[i];
        memo[i] = Math.max(nums[i] + robMemoHelper(nums, i + 2, hi, memo),
                           robMemoHelper(nums, i + 1, hi, memo));
        return memo[i];
    }

    // APPROACH 4: Rob/Skip State Machine (Two-Pass) | O(n) time | O(1) space
    // EXPLAIN: Rob/skip explicit states applied twice over [0..n-2] and [1..n-1].
    // WHEN: Use as an alternative O(1) two-pass formulation emphasising state transitions.

    public int rob_rob_skip(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        if (n == 2) return Math.max(nums[0], nums[1]);
        return Math.max(robSkipRange(nums, 0, n - 2), robSkipRange(nums, 1, n - 1));
    }

    private int robSkipRange(int[] nums, int lo, int hi) {
        int robVal = 0, skipVal = 0;
        for (int i = lo; i <= hi; i++) {
            int newRob  = skipVal + nums[i];
            int newSkip = Math.max(robVal, skipVal);
            robVal  = newRob;
            skipVal = newSkip;
        }
        return Math.max(robVal, skipVal);
    }
}

// Made with Bob
