/**
 * Tutorial content for #061 — Jump Game
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `You are at index 0 of an array. Each element tells you the maximum number of positions you can jump forward from that index. Return true if you can reach the last index, false otherwise.`,
    example: `[2, 3, 1, 1, 4] → true  (0→1→4, or 0→2→3→4)\n[3, 2, 1, 0, 4] → false (index 3 always reached but has value 0, can't pass)\n✅ Answer: true / false`,
    keyInsight: `Track the furthest index you can ever reach. If you arrive at a position beyond your current reach, you're stuck. If your reach ever touches or passes the last index, you can make it.`,
  },

  approaches: {
    'Greedy (Forward)': {
      intuition: `Scan left to right, updating the furthest index reachable from all positions visited so far. If at any point the current index is beyond that furthest reach, you're stuck and return false. If the furthest reach ever hits or passes the last index, return true immediately.`,
      steps: [
        `Set maxReach = 0.`,
        `For i from 0 to n-1:`,
        `  If i > maxReach: return false (can't reach here).`,
        `  maxReach = max(maxReach, i + nums[i]).`,
        `  If maxReach >= n-1: return true.`,
        `Return true.`,
      ],
      example: `nums = [2, 3, 1, 1, 4]\n\ni=0: maxReach=max(0, 0+2)=2\ni=1: maxReach=max(2, 1+3)=4 ≥ 4 → return true\n✅ Answer: true\n\nnums = [3, 2, 1, 0, 4]\ni=0: maxReach=3\ni=1: maxReach=max(3,3)=3\ni=2: maxReach=max(3,3)=3\ni=3: maxReach=max(3,3)=3\ni=4: 4 > 3 → return false\n✅ Answer: false`,
      keyInsight: `O(n) time, O(1) space. The greedy approach is optimal — no DP table needed, just a single pass with one variable.`,
    },

    'Greedy (Backward)': {
      intuition: `Work backwards from the last index. Maintain a "goal" — initially the last index. Scan right-to-left: if from position i you can reach the goal (i + nums[i] >= goal), update goal to i. If goal reaches 0, you can make it from the start.`,
      steps: [
        `Set goal = n-1.`,
        `For i from n-2 down to 0:`,
        `  If i + nums[i] >= goal: goal = i.`,
        `Return goal == 0.`,
      ],
      example: `nums = [2, 3, 1, 1, 4]\n\ngoal=4\ni=3: 3+1=4 ≥ 4 → goal=3\ni=2: 2+1=3 ≥ 3 → goal=2\ni=1: 1+3=4 ≥ 2 → goal=1\ni=0: 0+2=2 ≥ 1 → goal=0\nReturn goal==0 → true\n✅ Answer: true`,
      keyInsight: `O(n) time, O(1) space. Elegant alternative to forward greedy — "can index i save us from needing to reach all the way to the last index?"`,
    },

    'DP': {
      intuition: `Create a boolean dp array where dp[i] = true means index i is reachable. Start with dp[0]=true. For each reachable index, mark all indices within jump range as reachable too.`,
      steps: [
        `Create dp[n] all false; dp[0] = true.`,
        `For i from 0 to n-1:`,
        `  If dp[i] is false, skip.`,
        `  For j from i+1 to min(i + nums[i], n-1):`,
        `    dp[j] = true.`,
        `Return dp[n-1].`,
      ],
      example: `nums = [2, 3, 1, 1, 4]\n\ndp=[T,F,F,F,F]\ni=0: mark dp[1]=T, dp[2]=T\ni=1: mark dp[2]=T, dp[3]=T, dp[4]=T\ndp=[T,T,T,T,T]\nReturn dp[4]=true\n✅ Answer: true`,
      keyInsight: `O(n²) time worst case, O(n) space. Less efficient than greedy but more explicit about which indices are reachable.`,
    },

    'BFS': {
      intuition: `Treat each index as a node. From index i you can jump to any index in [i+1, i+nums[i]]. BFS explores all reachable nodes level by level. If the last index enters the queue or is found, return true.`,
      steps: [
        `Enqueue index 0; mark 0 as visited.`,
        `While queue is not empty:`,
        `  Dequeue index i.`,
        `  For j from i+1 to min(i+nums[i], n-1):`,
        `    If j == n-1: return true.`,
        `    If not visited: enqueue j, mark visited.`,
        `Return false.`,
      ],
      example: `nums = [2, 3, 1, 1, 4]\n\nQueue: [0]\nPop 0: enqueue 1, 2; visited={0,1,2}\nPop 1: j=4 == n-1 → return true ✅\n✅ Answer: true`,
      keyInsight: `O(n²) time worst case, O(n) space. BFS is overkill here — greedy is far superior — but shows how jump-game maps to graph reachability.`,
    },

    'Recursive Memoization': {
      intuition: `From index i, try every possible jump length (1 to nums[i]) and recurse. Cache each index as reachable (true) or not (false). If any recursive path reaches the last index, return true.`,
      steps: [
        `Create memo[n] filled with -1 (unknown).`,
        `Base case: i >= n-1 → return true.`,
        `If memo[i] != -1, return memo[i].`,
        `For jump from 1 to nums[i]: if solve(i + jump) is true → memo[i]=true, return true.`,
        `memo[i] = false; return false.`,
      ],
      example: `nums = [2, 3, 1, 1, 4]\n\nsolve(0): try jump 1 → solve(1)\nsolve(1): try jump 3 → solve(4); 4>=4 → true ✅\nsolve(1)=true, solve(0)=true\n✅ Answer: true`,
      keyInsight: `O(n²) time worst case, O(n) space (memo + call stack). More complex than needed for this problem — greedy is always preferred in interviews.`,
    },
  },
}
