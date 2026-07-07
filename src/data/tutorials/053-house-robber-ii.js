/**
 * Tutorial content for #053 — House Robber II
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `You are a robber and the houses are arranged in a circle — the first house and the last house are neighbours. You cannot rob two adjacent houses. Given an array of house values, return the maximum amount you can rob tonight without triggering the alarm.`,
    example: `houses = [2, 3, 2]\n→ Cannot rob house 0 and house 2 together (they are adjacent in the circle)\n→ Best: rob house 1 alone = 3\n✅ Answer: 3`,
    keyInsight: `Because the street is circular, robbing the first house prevents robbing the last. Break the circle into two linear sub-problems: houses 0..n-2 (skip last) and houses 1..n-1 (skip first). The answer is the max of both.`,
  },

  approaches: {
    'Two-Pass Linear DP': {
      intuition: `The circular constraint means first and last can't both be robbed. So solve two independent linear House Robber I problems: one that excludes the last house, one that excludes the first. Take the maximum. Each pass uses the O(1)-space sliding-variable trick.`,
      steps: [
        `Handle base cases: n=1 → return nums[0]; n=2 → return max(nums[0], nums[1]).`,
        `Run robRange(nums, 0, n-2): the linear robber on houses 0 to n-2.`,
        `Run robRange(nums, 1, n-1): the linear robber on houses 1 to n-1.`,
        `Return the maximum of the two results.`,
        `Inside robRange: use prev2, prev1 sliding variables; cur = max(prev1, prev2 + nums[i]).`,
      ],
      example: `houses = [2, 3, 2]\n\nPass 1 (indices 0..1): houses [2, 3]\n  prev2=0, prev1=0\n  i=0: cur=max(0,0+2)=2 → prev2=0, prev1=2\n  i=1: cur=max(2,0+3)=3 → result1=3\n\nPass 2 (indices 1..2): houses [3, 2]\n  i=1: cur=max(0,0+3)=3 → prev2=0, prev1=3\n  i=2: cur=max(3,0+2)=3 → result2=3\n\nmax(3, 3) = 3\n✅ Answer: 3`,
      keyInsight: `O(n) time and O(1) space. The two-pass decomposition is the standard interview answer for any circular DP variant.`,
    },

    'Explicit Two-Pass with Result Array': {
      intuition: `Same two-pass idea, but instead of O(1) variables we allocate full dp arrays for each pass. This is more verbose but lets you inspect every intermediate value — useful for debugging or visualisation.`,
      steps: [
        `Handle base cases for n=1 and n=2.`,
        `Build dp1[0..n-2]: dp1[0]=nums[0], dp1[1]=max(nums[0],nums[1]), then dp1[i]=max(dp1[i-1], dp1[i-2]+nums[i]).`,
        `Build dp2[1..n-1]: dp2[1]=nums[1], dp2[2]=max(nums[1],nums[2]), then dp2[i]=max(dp2[i-1], dp2[i-2]+nums[i]).`,
        `Return max(dp1[n-2], dp2[n-1]).`,
      ],
      example: `houses = [2, 3, 2]  (n=3)\n\ndp1 (indices 0..1):\n  dp1[0]=2, dp1[1]=max(2,3)=3\n\ndp2 (indices 1..2):\n  dp2[1]=3, dp2[2]=max(3,2)=3\n\nmax(dp1[1], dp2[2]) = max(3, 3) = 3\n✅ Answer: 3`,
      keyInsight: `O(n) time and O(n) space. Use this when you need to trace or display the dp table; use Two-Pass Linear DP in production for O(1) space.`,
    },

    'Memoization (Top-Down)': {
      intuition: `Solve each range recursively with memoisation. Two separate memo arrays guard the two subproblems: [0..n-2] and [1..n-1]. At each index, choose whether to rob the current house (skip two ahead) or skip it (advance one).`,
      steps: [
        `Handle base cases for n=1 and n=2.`,
        `Create memo1 and memo2, both size n, filled with -1.`,
        `Call robMemoHelper(nums, 0, n-2, memo1) for the first range.`,
        `Call robMemoHelper(nums, 1, n-1, memo2) for the second range.`,
        `Inside helper: if i > hi return 0; if memo[i] != -1 return it; else memo[i] = max(nums[i] + helper(i+2), helper(i+1)).`,
        `Return max of both helper results.`,
      ],
      example: `houses = [2, 3, 2]\n\nRange [0..1]:\n  helper(0): max(2+helper(2), helper(1))\n    helper(2): 2>1 → 0\n    helper(1): max(3+helper(3), helper(2)) = max(3+0,0) = 3\n  helper(0) = max(2+0, 3) = 3\n\nRange [1..2]:\n  helper(1): max(3+helper(3), helper(2))\n    helper(3): 3>2 → 0\n    helper(2): max(2+helper(4), helper(3)) = 2\n  helper(1) = max(3+0, 2) = 3\n\nmax(3, 3) = 3\n✅ Answer: 3`,
      keyInsight: `O(n) time and O(n) space. Top-down style is natural if you think recursively; the memo arrays avoid redundant re-computation.`,
    },

    'Rob/Skip State Machine (Two-Pass)': {
      intuition: `Model each pass as an explicit rob/skip state machine. At each house, robVal is the best total if you rob this house (so you must have skipped the previous), and skipVal is the best if you skip (free to do either next). Run this machine twice over the two sub-ranges and take the max.`,
      steps: [
        `Handle base cases for n=1 and n=2.`,
        `For each range, start robVal=0, skipVal=0.`,
        `For each house i in the range: newRob = skipVal + nums[i]; newSkip = max(robVal, skipVal).`,
        `Update robVal = newRob, skipVal = newSkip.`,
        `Return max(robVal, skipVal) for the range.`,
        `Overall answer = max of the two range results.`,
      ],
      example: `houses = [2, 3, 2]\n\nRange [0..1]: houses [2, 3]\n  rob=0, skip=0\n  i=0 (2): newRob=0+2=2, newSkip=max(0,0)=0 → rob=2, skip=0\n  i=1 (3): newRob=0+3=3, newSkip=max(2,0)=2 → rob=3, skip=2\n  result1 = max(3,2) = 3\n\nRange [1..2]: houses [3, 2]\n  rob=0, skip=0\n  i=1 (3): rob=3, skip=0\n  i=2 (2): newRob=0+2=2, newSkip=max(3,0)=3 → rob=2, skip=3\n  result2 = max(2,3) = 3\n\nmax(3, 3) = 3\n✅ Answer: 3`,
      keyInsight: `O(n) time and O(1) space. The state-machine framing makes the adjacency constraint crystal-clear: you can only enter a "rob" state from a "skip" state.`,
    },
  },
}
