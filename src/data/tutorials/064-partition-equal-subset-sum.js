/**
 * Tutorial content for #064 — Partition Equal Subset Sum
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an array of positive integers, determine if it can be partitioned into two subsets with equal sum. Each element must go into exactly one subset.`,
    example: `nums = [1, 5, 11, 5]\n→ Subset 1: [11], Subset 2: [1, 5, 5] both sum to 11\n✅ Answer: true`,
    keyInsight: `Equal partition means each subset sums to totalSum / 2. If totalSum is odd, it's impossible. So the problem reduces to: can we find a subset that sums to exactly totalSum / 2? This is the classic 0/1 knapsack.`,
  },

  approaches: {
    '2D Boolean DP': {
      intuition: `Build a 2D boolean table dp[i][j] = "can we form sum j using the first i elements?" Seed dp[i][0]=true (empty subset sums to 0). For each element, either include it (dp[i-1][j-nums[i-1]]) or exclude it (dp[i-1][j]).`,
      steps: [
        `Compute target = totalSum / 2; if totalSum is odd, return false.`,
        `Create dp[n+1][target+1]; set dp[i][0]=true for all i.`,
        `For i from 1 to n, for j from 1 to target:`,
        `  dp[i][j] = dp[i-1][j] (exclude nums[i-1]).`,
        `  If j >= nums[i-1]: dp[i][j] |= dp[i-1][j - nums[i-1]] (include).`,
        `Return dp[n][target].`,
      ],
      example: `nums=[1,5,11,5], sum=22, target=11\n\nAfter num=1:  can reach: {0,1}\nAfter num=5:  can reach: {0,1,5,6}\nAfter num=11: can reach: {0,1,5,6,11,12,16,17}\nAfter num=5:  can reach 11? Yes (5+1+5=11 or 6+5=11) ✓\n✅ Answer: true`,
      keyInsight: `O(n × target) time and space. Explicit 2D table is easy to trace but uses O(n × target) memory.`,
    },

    'Space-Optimized 1D DP': {
      intuition: `The 2D DP only looks back one row. Use a single boolean array dp[j] = "can we form sum j?". Iterate nums one by one. For each num, iterate j from target down to num (right-to-left prevents using the same element twice).`,
      steps: [
        `Compute target = totalSum / 2; if odd, return false.`,
        `Create dp[target+1] all false; dp[0] = true.`,
        `For each num in nums:`,
        `  For j from target down to num:`,
        `    dp[j] |= dp[j - num].`,
        `Return dp[target].`,
      ],
      example: `nums=[1,5,11,5], target=11\n\ndp=[T,F,F,F,F,F,F,F,F,F,F,F]\nnum=1:  dp[1]=dp[0]=T → dp=[T,T,F,...]\nnum=5:  dp[6]=dp[1]=T; dp[5]=dp[0]=T\nnum=11: dp[11]=dp[0]=T ✓ → return true immediately\n✅ Answer: true`,
      keyInsight: `O(n × target) time, O(target) space. The right-to-left inner loop is critical — it ensures each element is used at most once (0/1 knapsack constraint).`,
    },

    'Memoization (Top-Down)': {
      intuition: `Recursively decide for each element: include it (reduce the remaining target) or skip it. Cache each (index, remaining-sum) pair so repeated sub-problems are solved once.`,
      steps: [
        `Compute target = totalSum / 2; if odd, return false.`,
        `Create memo[n][target+1] filled with -1.`,
        `Base cases: remaining==0 → true; index>=n or remaining<0 → false.`,
        `If memo[index][remaining] != -1, return it.`,
        `memo[index][remaining] = solve(index+1, remaining-nums[index]) OR solve(index+1, remaining).`,
        `Return memo[0][target].`,
      ],
      example: `nums=[1,5,11,5], target=11\n\nsolve(0,11): include 1 → solve(1,10); OR skip → solve(1,11)\nsolve(1,10): include 5 → solve(2,5); OR skip → solve(2,10)\nsolve(2,5): include 11→ solve(3,-6) false; skip → solve(3,5)\nsolve(3,5): include 5 → solve(4,0) → true ✅\n✅ Answer: true`,
      keyInsight: `O(n × target) time and space. Top-down naturally prunes paths early when remaining < 0, which can be faster in practice than filling the whole table.`,
    },

    'Bitset Optimisation': {
      intuition: `Represent reachable sums as a bitset (big integer or long). Initially bits[0]=1. For each number, shift the bitset left by num (meaning "add num to all achievable sums") and OR it with the current bitset. Check if bit at target position is set.`,
      steps: [
        `Compute target = totalSum / 2; if odd, return false.`,
        `Use a BigInteger or long bits = 1 (bit 0 is set).`,
        `For each num: bits |= (bits << num).`,
        `Return bit at position target is set.`,
      ],
      example: `nums=[1,5,11,5], target=11\n\nbits = 1 (binary: ...0001)\nnum=1:  bits |= bits<<1 → ...0011 (can reach 0 and 1)\nnum=5:  bits |= bits<<5 → can reach 0,1,5,6\nnum=11: bits |= bits<<11 → can reach 0,1,5,6,11,12,...\nBit 11 is set → return true\n✅ Answer: true`,
      keyInsight: `O(n × target / 64) time effectively — bitwise parallelism means up to 64 sum values are processed per CPU instruction. Space is O(target / 64). The fastest practical approach for large targets.`,
    },
  },
}
