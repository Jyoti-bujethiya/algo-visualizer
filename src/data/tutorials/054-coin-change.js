/**
 * Tutorial content for #054 — Coin Change
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `You have an infinite supply of coins of given denominations. Find the minimum number of coins needed to make up a given amount. If it is impossible to make the amount, return -1.`,
    example: `coins = [1, 2, 5], amount = 11\n→ 5 + 5 + 1 = 11  (3 coins)\n✅ Answer: 3`,
    keyInsight: `For each amount a, the best answer is 1 + the best answer for (a - coin) across all valid coins. This is an overlapping subproblem — fill a table from amount 0 upward.`,
  },

  approaches: {
    'Recursive Memoization (Top-Down DP)': {
      intuition: `Start from the target amount and recursively try subtracting every coin. Cache each sub-amount so it is solved only once. If no coin leads to a valid breakdown, the sub-amount returns -1 (impossible).`,
      steps: [
        `Create a memo map (or array) indexed by remaining amount.`,
        `Base case: amount 0 → return 0 coins.`,
        `If amount < 0 → return -1 (impossible).`,
        `Check memo — if already solved, return cached value.`,
        `Try every coin: res = 1 + solve(amount - coin).`,
        `Store and return the minimum valid result, or -1 if none.`,
      ],
      example: `coins=[1,2,5], amount=11\n\nsolve(11): try coin 5 → 1+solve(6)\nsolve(6):  try coin 5 → 1+solve(1)\nsolve(1):  try coin 1 → 1+solve(0) = 1\nsolve(6) = 1+1 = 2  ← cached\nsolve(11) = 1+2 = 3\n✅ Answer: 3`,
      keyInsight: `O(amount × coins) time, O(amount) space for the memo. Much faster than plain recursion which would be exponential.`,
    },

    'BFS (Shortest Path)': {
      intuition: `Think of each amount as a node in a graph. An edge connects amount a to amount a-coin for each coin. The minimum coins to reach 0 from the target is the shortest path. BFS finds shortest paths naturally — each BFS level adds exactly one more coin.`,
      steps: [
        `Start a queue with (amount, 0 coins).`,
        `Mark each visited amount to avoid re-processing.`,
        `Pop from queue; for each coin, compute next = current - coin.`,
        `If next == 0, return coins + 1.`,
        `If next > 0 and not visited, enqueue (next, coins + 1).`,
        `If queue empties, return -1.`,
      ],
      example: `coins=[1,2,5], amount=11\n\nLevel 0: {11}\nLevel 1 (1 coin): {10, 9, 6}   (11-1, 11-2, 11-5)\nLevel 2 (2 coins): {5, 4, 1} from 6  → 6-5=1, 6-2=4, 6-1=5\nLevel 3 (3 coins): 1-1=0 ✅\n✅ Answer: 3`,
      keyInsight: `O(amount × coins) time, O(amount) space. BFS guarantees the first time we reach 0 is via the fewest coins — no backtracking needed.`,
    },

    'Bottom-Up DP': {
      intuition: `Build a dp array where dp[a] = minimum coins to make amount a. Start from 0 and fill up to the target. For each amount, try every coin and take the best. dp[0] = 0 is the seed; all others start at infinity (impossible).`,
      steps: [
        `Create dp array of size amount+1, filled with amount+1 (a sentinel for "impossible").`,
        `Set dp[0] = 0.`,
        `For a from 1 to amount:`,
        `  For each coin: if coin <= a, dp[a] = min(dp[a], 1 + dp[a - coin]).`,
        `Return dp[amount] if it is ≤ amount, otherwise -1.`,
      ],
      example: `coins=[1,2,5], amount=11\n\ndp[0]=0\ndp[1]=min(∞, 1+dp[0])=1\ndp[2]=min(∞, 1+dp[1], 1+dp[0])=1\ndp[5]=1, dp[6]=2, dp[10]=2, dp[11]=3\n✅ Answer: dp[11]=3`,
      keyInsight: `O(amount × coins) time, O(amount) space. The standard and most commonly expected solution — simple, correct, and efficient.`,
    },

    'Bottom-Up DP with Sorted Early-Exit': {
      intuition: `Same as Bottom-Up DP, but sort the coins in descending order first. When iterating through coins for a given amount, stop as soon as a coin is larger than the remaining amount. This prunes unnecessary work for large coin values.`,
      steps: [
        `Sort coins in descending order.`,
        `Create dp array of size amount+1, filled with amount+1.`,
        `Set dp[0] = 0.`,
        `For a from 1 to amount:`,
        `  For each coin (sorted desc): if coin > a, skip; else dp[a] = min(dp[a], 1 + dp[a - coin]).`,
        `Return dp[amount] <= amount ? dp[amount] : -1.`,
      ],
      example: `coins=[1,2,5] sorted desc → [5,2,1], amount=11\n\ndp[3]: coin=5 skip (5>3); coin=2 → 1+dp[1]=2; coin=1 → 1+dp[2]=2 → dp[3]=2\ndp[11]: coin=5 → 1+dp[6]=3 ✅\n✅ Answer: 3`,
      keyInsight: `Same O(amount × coins) worst case, but the early-exit on sorted coins reduces inner loop iterations in practice — a micro-optimisation over the standard version.`,
    },
  },
}
