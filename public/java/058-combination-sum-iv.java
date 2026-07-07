/*
 * LeetCode Problem #377: Combination Sum IV
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/combination-sum-iv/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Recursive Memoization | O(t*n) time | O(t) space
    // EXPLAIN: Count ordered arrangements summing to target; cache each sub-target result.
    // WHEN: Use when top-down is more intuitive; t = target, n = number of candidates.

    public int combinationSum4_memo(int[] nums, int target) {
        int[] memo = new int[target + 1];
        Arrays.fill(memo, -1);
        return dfs(nums, target, memo);
    }

    private int dfs(int[] nums, int rem, int[] memo) {
        if (rem == 0) return 1;
        if (memo[rem] != -1) return memo[rem];
        int count = 0;
        for (int num : nums) {
            if (num <= rem) count += dfs(nums, rem - num, memo);
        }
        memo[rem] = count;
        return count;
    }

    // APPROACH 2: Bottom-Up DP | O(t*n) time | O(t) space
    // EXPLAIN: dp[i] = number of ordered combinations summing to i; accumulate over all nums.
    // WHEN: Use as the canonical bottom-up answer — no recursion stack.

    public int combinationSum4(int[] nums, int target) {
        int[] dp = new int[target + 1];
        dp[0] = 1;
        for (int i = 1; i <= target; i++) {
            for (int num : nums) {
                if (num <= i) dp[i] += dp[i - num];
            }
        }
        return dp[target];
    }

    // APPROACH 3: Bottom-Up DP with Sorted Early-Exit | O(t*n) time | O(t) space
    // EXPLAIN: Sort nums; break inner loop when num > i to skip impossible candidates.
    // WHEN: Minor optimisation when nums contains large values.

    public int combinationSum4_sorted(int[] nums, int target) {
        Arrays.sort(nums);
        int[] dp = new int[target + 1];
        dp[0] = 1;
        for (int i = 1; i <= target; i++) {
            for (int num : nums) {
                if (num > i) break;
                dp[i] += dp[i - num];
            }
        }
        return dp[target];
    }

    // APPROACH 4: 2D Contribution Table | O(t*n) time | O(t*n) space
    // EXPLAIN: Track how much each num contributes at each target amount — useful for visualization.
    // WHEN: Educational/debugging: see exactly which numbers contribute at each amount.

    public int combinationSum4_2d(int[] nums, int target) {
        int n = nums.length;
        int[] dp = new int[target + 1];
        dp[0] = 1;
        for (int i = 1; i <= target; i++) {
            for (int num : nums) {
                if (i >= num) dp[i] += dp[i - num];
            }
        }
        return dp[target];
    }
}

// Made with Bob
