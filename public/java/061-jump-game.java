/*
 * LeetCode Problem #55: Jump Game
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/jump-game/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Greedy (Forward) | O(n) time | O(1) space
    // EXPLAIN: Track the farthest index reachable; if current index ever exceeds it, return false.
    // WHEN: Use as the optimal solution — single pass, no extra space needed.

    public boolean canJump(int[] nums) {
        int maxReach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) return false;
            maxReach = Math.max(maxReach, i + nums[i]);
        }
        return true;
    }

    // APPROACH 2: Greedy (Backward) | O(n) time | O(1) space
    // EXPLAIN: Start from the end; shift the goal leftward whenever a position can reach it.
    // WHEN: Elegant alternative — scan right-to-left without any auxiliary structure.

    public boolean canJump_backward(int[] nums) {
        int lastPos = nums.length - 1;
        for (int i = nums.length - 2; i >= 0; i--) {
            if (i + nums[i] >= lastPos) lastPos = i;
        }
        return lastPos == 0;
    }

    // APPROACH 3: DP | O(n²) time | O(n) space
    // EXPLAIN: dp[i] = true if position i is reachable; for each reachable position extend forward.
    // WHEN: Use when you need to know which positions are reachable (not just the final answer).

    public boolean canJump_dp(int[] nums) {
        int n = nums.length;
        boolean[] dp = new boolean[n];
        dp[0] = true;
        for (int i = 0; i < n; i++) {
            if (!dp[i]) continue;
            for (int j = 1; j <= nums[i] && i + j < n; j++) {
                dp[i + j] = true;
            }
        }
        return dp[n - 1];
    }

    // APPROACH 4: BFS | O(n²) time | O(n) space
    // EXPLAIN: Each position is a node; edges connect to all reachable positions; BFS checks last.
    // WHEN: Use for a graph-traversal perspective that generalises to weighted jump games.

    public boolean canJump_bfs(int[] nums) {
        int n = nums.length;
        if (n == 1) return true;
        boolean[] visited = new boolean[n];
        int maxReach = 0;
        for (int i = 0; i <= maxReach && i < n; i++) {
            maxReach = Math.max(maxReach, i + nums[i]);
            if (maxReach >= n - 1) return true;
        }
        return false;
    }

    // APPROACH 5: Recursive Memoization | O(n²) time | O(n) space
    // EXPLAIN: For each position try all jumps recursively; cache results to avoid re-computation.
    // WHEN: Use as a top-down DP demonstration — not recommended over greedy but instructive.

    public boolean canJump_memo(int[] nums) {
        int[] memo = new int[nums.length]; // 0=unknown, 1=true, -1=false
        return helper(nums, 0, memo);
    }

    private boolean helper(int[] nums, int pos, int[] memo) {
        if (pos >= nums.length - 1) return true;
        if (memo[pos] != 0) return memo[pos] == 1;
        for (int jump = 1; jump <= nums[pos]; jump++) {
            if (helper(nums, pos + jump, memo)) {
                memo[pos] = 1;
                return true;
            }
        }
        memo[pos] = -1;
        return false;
    }
}

// Made with Bob
