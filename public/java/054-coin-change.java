/*
 * LeetCode Problem #322: Coin Change
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/coin-change/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Recursive Memoization (Top-Down DP) | O(S*n) time | O(S) space
    // EXPLAIN: For each remaining amount S, try every coin and cache the min-coin result.
    // WHEN: Use when top-down recursion is clearer; S = target amount, n = coins count.

    public int coinChange_memo(int[] coins, int amount) {
        int[] memo = new int[amount + 1];
        Arrays.fill(memo, -1);
        int result = dfs(coins, amount, memo);
        return result == Integer.MAX_VALUE ? -1 : result;
    }

    private int dfs(int[] coins, int rem, int[] memo) {
        if (rem == 0) return 0;
        if (rem < 0) return Integer.MAX_VALUE;
        if (memo[rem] != -1) return memo[rem];
        int best = Integer.MAX_VALUE;
        for (int c : coins) {
            int sub = dfs(coins, rem - c, memo);
            if (sub != Integer.MAX_VALUE)
                best = Math.min(best, sub + 1);
        }
        memo[rem] = best;
        return best;
    }

    // APPROACH 2: BFS (Shortest Path) | O(S*n) time | O(S) space
    // EXPLAIN: Treat coin change as BFS from 0 to amount; first time we reach amount is fewest coins.
    // WHEN: Use when you think of it as a shortest-path problem on an implicit graph.

    public int coinChange_bfs(int[] coins, int amount) {
        if (amount == 0) return 0;
        boolean[] visited = new boolean[amount + 1];
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(0);
        visited[0] = true;
        int level = 0;
        while (!queue.isEmpty()) {
            level++;
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int cur = queue.poll();
                for (int c : coins) {
                    int next = cur + c;
                    if (next == amount) return level;
                    if (next < amount && !visited[next]) {
                        visited[next] = true;
                        queue.offer(next);
                    }
                }
            }
        }
        return -1;
    }

    // APPROACH 3: Bottom-Up DP | O(S*n) time | O(S) space
    // EXPLAIN: dp[i] = fewest coins to make amount i; fill from 1 to amount using each coin.
    // WHEN: Use as the canonical interview answer — avoids recursion stack overhead.

    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);      // sentinel "infinity"
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (c <= i) {
                    dp[i] = Math.min(dp[i], dp[i - c] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }

    // APPROACH 4: Bottom-Up DP with Sorted Early-Exit | O(S*n) time | O(S) space
    // EXPLAIN: Same as Approach 3 but sort coins ascending and break when coin > remaining amount.
    // WHEN: Minor optimisation when coins have large denominators — avoids unnecessary iterations.

    public int coinChange_sorted(int[] coins, int amount) {
        Arrays.sort(coins);
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (c > i) break;
                dp[i] = Math.min(dp[i], dp[i - c] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}

// Made with Bob
