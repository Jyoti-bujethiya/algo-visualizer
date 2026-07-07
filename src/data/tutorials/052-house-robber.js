/**
 * Tutorial content for #052 — House Robber
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `You are a robber planning to rob houses along a street. Each house has some amount of money. The only constraint: you cannot rob two adjacent houses (the alarm will go off). Return the maximum amount you can rob.`,
    example: `houses = [2, 7, 9, 3, 1]\n→ Rob house 0 (2) + house 2 (9) + house 4 (1) = 12\n→ Or rob house 1 (7) + house 3 (3) = 10\n✅ Answer: 12`,
    keyInsight: `At every house you face exactly one choice: rob it (and skip the next) or skip it. The best answer at each house depends only on the two results before it.`,
  },

  approaches: {
    'Recursive Memoization (Top-Down DP)': {
      intuition: `Start from house 0 and ask: "what's the best I can do from here?"\n\nIf I rob this house, I get its money — but then I must jump to house i+2.\nIf I skip this house, I move to house i+1 and try again.\n\nI pick whichever gives more money. But this creates overlapping subproblems — the same house index gets asked repeatedly. We fix that by caching (memoising) each answer once computed.`,
      steps: [
        `Create a memo array filled with -1 (means "not yet computed").`,
        `Call robHelper(nums, 0, memo) — start from house 0.`,
        `Base case: if index ≥ length, no houses left → return 0.`,
        `If memo[i] is already filled, return it immediately (cache hit).`,
        `Otherwise compute: max(nums[i] + helper(i+2), helper(i+1)).`,
        `Store the result in memo[i] before returning.`,
      ],
      example: `houses = [2, 7, 9, 3, 1]\n\nhelper(0): max(2 + helper(2), helper(1))\nhelper(2): max(9 + helper(4), helper(3))\nhelper(4): max(1 + helper(6), helper(5)) = 1\nhelper(3): max(3 + helper(5), helper(4)) = 3\nhelper(2) = max(9+1, 3) = 10  ← cached\nhelper(1): max(7 + helper(3), helper(2)) = max(10, 10) = 10\nhelper(0) = max(2+10, 10) = 12 ✅`,
      keyInsight: `Without memoisation this is O(2ⁿ). With it, each index is computed exactly once → O(n) time, O(n) space for the cache + recursion stack.`,
    },

    'Bottom-Up DP': {
      intuition: `Instead of starting at house 0 and recursing forward, we build the answer from the ground up.\n\nWe define dp[i] = the most money we can rob from houses 0 through i.\n\nFor each new house i we ask: is it better to rob it (dp[i-2] + nums[i]) or skip it (dp[i-1])? We just pick the max.`,
      steps: [
        `Handle the edge case: if only 1 house, return nums[0].`,
        `Set dp[0] = nums[0] (only one house available).`,
        `Set dp[1] = max(nums[0], nums[1]) (best of the first two).`,
        `For i from 2 to n-1: dp[i] = max(dp[i-1], dp[i-2] + nums[i]).`,
        `Return dp[n-1] — the answer considering all houses.`,
      ],
      example: `houses = [2, 7, 9, 3, 1]\n\ndp[0] = 2\ndp[1] = max(2, 7) = 7\ndp[2] = max(7, 2+9) = 11\ndp[3] = max(11, 7+3) = 11\ndp[4] = max(11, 11+1) = 12 ✅`,
      keyInsight: `The recurrence dp[i] = max(dp[i-1], dp[i-2] + nums[i]) is the heart of this problem. Every DP house-robber variant reduces to this.`,
    },

    'Space-Optimized DP': {
      intuition: `Look at the bottom-up recurrence: dp[i] only ever uses dp[i-1] and dp[i-2]. We don't need the whole array — just two variables.\n\nWe call them prev2 (two steps back) and prev1 (one step back), and slide them forward as we go.`,
      steps: [
        `Start with prev2 = 0, prev1 = 0 (no houses yet).`,
        `For each house value num:`,
        `  cur = max(prev1, prev2 + num)  ← rob or skip`,
        `  prev2 = prev1  ← slide the window`,
        `  prev1 = cur`,
        `Return prev1 — the answer after the last house.`,
      ],
      example: `houses = [2, 7, 9, 3, 1]\n\nprev2=0, prev1=0\nnum=2: cur=max(0, 0+2)=2   → prev2=0, prev1=2\nnum=7: cur=max(2, 0+7)=7   → prev2=2, prev1=7\nnum=9: cur=max(7, 2+9)=11  → prev2=7, prev1=11\nnum=3: cur=max(11, 7+3)=11 → prev2=11, prev1=11\nnum=1: cur=max(11,11+1)=12 → prev2=11, prev1=12\nReturn 12 ✅`,
      keyInsight: `This is the interview-optimal solution. Same O(n) time, but O(1) space — you only ever need to remember the previous two best values.`,
    },

    'Rob/Skip State Machine': {
      intuition: `Model the problem as two explicit states:\n• robVal = best total if you ROB the current house\n• skipVal = best total if you SKIP the current house\n\nAt each house, the new rob value is (previous skip + current house money), and the new skip value is the max of the previous two states.`,
      steps: [
        `Start with robVal = 0, skipVal = 0.`,
        `For each house num:`,
        `  newRob  = skipVal + num  ← can only rob after a skip`,
        `  newSkip = max(robVal, skipVal)  ← best of previous states`,
        `  Update robVal = newRob, skipVal = newSkip.`,
        `Return max(robVal, skipVal).`,
      ],
      example: `houses = [2, 7, 9, 3, 1]\n\nrob=0,  skip=0\nnum=2: newRob=0+2=2,  newSkip=max(0,0)=0  → rob=2,  skip=0\nnum=7: newRob=0+7=7,  newSkip=max(2,0)=2  → rob=7,  skip=2\nnum=9: newRob=2+9=11, newSkip=max(7,2)=7  → rob=11, skip=7\nnum=3: newRob=7+3=10, newSkip=max(11,7)=11 → rob=10, skip=11\nnum=1: newRob=11+1=12,newSkip=max(10,11)=11 → rob=12,skip=11\nReturn max(12, 11) = 12 ✅`,
      keyInsight: `The state-machine framing makes the "no two adjacent" constraint completely explicit — you can only transition from skip → rob, never rob → rob.`,
    },

    'Concise prev/curr': {
      intuition: `The most minimal way to write it. Two variables: prev and curr.\n\nAt each step, the new best is max(curr, prev + num). Then slide: prev becomes the old curr, curr becomes the new best.`,
      steps: [
        `Start with prev = 0, curr = 0.`,
        `For each house num:`,
        `  temp = max(curr, prev + num)`,
        `  prev = curr`,
        `  curr = temp`,
        `Return curr.`,
      ],
      example: `houses = [2, 7, 9, 3, 1]\n\nprev=0, curr=0\nnum=2: temp=max(0,0+2)=2   → prev=0, curr=2\nnum=7: temp=max(2,0+7)=7   → prev=2, curr=7\nnum=9: temp=max(7,2+9)=11  → prev=7, curr=11\nnum=3: temp=max(11,7+3)=11 → prev=11,curr=11\nnum=1: temp=max(11,11+1)=12→ prev=11,curr=12\nReturn 12 ✅`,
      keyInsight: `This is Space-Optimized DP with a different variable naming convention. Both are correct — pick whichever reads more naturally to you.`,
    },
  },
}
