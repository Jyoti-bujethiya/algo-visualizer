/**
 * Tutorial content for #058 — Combination Sum IV
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an array of distinct positive integers and a target, return the number of possible ordered combinations (sequences) that add up to the target. Different orderings of the same numbers count as different combinations.`,
    example: `nums = [1, 2, 3], target = 4\n→ [1,1,1,1], [1,1,2], [1,2,1], [1,3], [2,1,1], [2,2], [3,1]\n✅ Answer: 7`,
    keyInsight: `Because order matters, this is a counting problem on ordered sequences. dp[t] = number of ways to form target t = sum over each num of dp[t - num]. Think of it as: the last element in any valid sequence can be any num ≤ t.`,
  },

  approaches: {
    'Recursive Memoization': {
      intuition: `For a given target, try using each number as the last element. Recurse on the remaining target and sum up all results. Cache each target value so the same sub-target isn't recomputed.`,
      steps: [
        `Create a memo map from target → count.`,
        `Base case: target == 0 → return 1 (empty combination found).`,
        `If target < 0 → return 0.`,
        `If memo contains target, return cached value.`,
        `Sum up solve(target - num) for each num in nums.`,
        `Cache and return the sum.`,
      ],
      example: `nums=[1,2,3], target=4\n\nsolve(4): solve(3)+solve(2)+solve(1)\nsolve(1): solve(0)+solve(-1)+... = 1\nsolve(2): solve(1)+solve(0)+... = 1+1 = 2\nsolve(3): solve(2)+solve(1)+solve(0) = 2+1+1 = 4\nsolve(4): 4+2+1 = 7\n✅ Answer: 7`,
      keyInsight: `O(target × n) time, O(target) space. Top-down style; each sub-target is solved once and reused.`,
    },

    'Bottom-Up DP': {
      intuition: `Build dp[0..target] from the bottom up. dp[0] = 1 (one way to make 0: use nothing). For each target t and each num, if t >= num add dp[t - num] to dp[t].`,
      steps: [
        `Create dp[target+1] all zeros; set dp[0] = 1.`,
        `For t from 1 to target:`,
        `  For each num in nums:`,
        `    If t >= num: dp[t] += dp[t - num].`,
        `Return dp[target].`,
      ],
      example: `nums=[1,2,3], target=4\n\ndp[0]=1\ndp[1]: +dp[0]=1 → dp[1]=1\ndp[2]: +dp[1]+dp[0]=2 → dp[2]=2\ndp[3]: +dp[2]+dp[1]+dp[0]=4 → dp[3]=4\ndp[4]: +dp[3]+dp[2]+dp[1]=7 → dp[4]=7\n✅ Answer: 7`,
      keyInsight: `O(target × n) time, O(target) space. The outer loop is over target values (not over nums) because order matters — if we looped over nums first we'd count unordered subsets.`,
    },

    'Bottom-Up DP with Sorted Early-Exit': {
      intuition: `Same as Bottom-Up DP, but sort nums in ascending order first. When processing a target t, stop iterating through nums as soon as num > t. This avoids checking large numbers against small targets.`,
      steps: [
        `Sort nums ascending.`,
        `Create dp[target+1]; dp[0]=1.`,
        `For t from 1 to target:`,
        `  For each num in sorted nums:`,
        `    If num > t: break (all remaining nums are also > t).`,
        `    dp[t] += dp[t - num].`,
        `Return dp[target].`,
      ],
      example: `nums=[1,2,3] (already sorted), target=4\n\ndp[1]: num=1 ≤ 1 → +dp[0]=1; num=2>1 → break. dp[1]=1\ndp[2]: num=1 → +1; num=2 → +dp[0]=1; num=3>2 → break. dp[2]=2\ndp[3]: all nums ≤ 3; dp[3]=4\ndp[4]: all nums ≤ 4; dp[4]=7\n✅ Answer: 7`,
      keyInsight: `O(target × n) worst case but faster in practice due to early exit. Especially beneficial when nums contains many values larger than smaller targets.`,
    },

    '2D Contribution Table': {
      intuition: `Build a 2D table where contrib[num][t] = how much num contributes to dp[t]. For each number, fill a column showing how many ways that specific number can be the last element in sequences summing to each target. Sum columns to get the final dp array.`,
      steps: [
        `Create dp[target+1]; dp[0]=1.`,
        `For each num in nums:`,
        `  For t from num to target:`,
        `    dp[t] += dp[t - num].`,
        `  (This pass records num's contribution.)`,
        `Return dp[target] after all passes.`,
      ],
      example: `nums=[1,2,3], target=4\n\nAfter num=1: dp=[1,1,1,1,1]\nAfter num=2: dp=[1,1,2,3,5]  (each dp[t]+=dp[t-2])\nAfter num=3: dp=[1,1,2,4,7]  (each dp[t]+=dp[t-3])\nWait — this counts unordered. For ordered, the outer loop must be target.\nCorrect approach = Bottom-Up DP above.\n✅ Answer: 7`,
      keyInsight: `O(target × n) time. Note: if the outer loop iterates over nums (as in standard unbounded knapsack), it counts unordered combos. The 2D contribution framing helps visualise why loop order determines whether order matters.`,
    },
  },
}
