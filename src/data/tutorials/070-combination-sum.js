/**
 * Tutorial content for #070 — Combination Sum
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an array of distinct positive integers and a target, find all unique combinations where the numbers sum to the target. Each number may be used an unlimited number of times. Order doesn't matter — [2,2,3] and [2,3,2] are the same combination.`,
    example: `candidates = [2, 3, 6, 7], target = 7\n→ [2, 2, 3] and [7]\n✅ Answer: [[2,2,3],[7]]`,
    keyInsight: `To avoid duplicates like [2,3,2] and [3,2,2], always move forward in the candidates array (or stay at the same index since reuse is allowed). This ensures each combination is generated in non-decreasing order.`,
  },

  approaches: {
    'Backtracking with Reuse': {
      intuition: `Backtrack through candidates starting from a given index. At each step, add a candidate to the current combination and recurse — crucially, pass the SAME index (not index+1) to allow reuse of the same candidate. If the target hits 0, we found a valid combination.`,
      steps: [
        `Backtrack(start, remaining, current):`,
        `  If remaining == 0: add copy of current; return.`,
        `  If remaining < 0: return (overshot).`,
        `  For i from start to end:`,
        `    Add candidates[i], recurse(i, remaining - candidates[i], current), remove last.`,
      ],
      example: `candidates=[2,3,6,7], target=7\n\nstart=0, rem=7:\n  pick 2 (rem=5):\n    pick 2 (rem=3):\n      pick 2 (rem=1):\n        pick 2 (rem=-1): stop\n        pick 3 (rem=-2): stop\n      pick 3 (rem=0): → [2,2,3] ✓\n      pick 6/7: overshoot\n    pick 3 (rem=2): → pick 2 rem=0 → [2,3,2]? No! start=2 so only 3,6,7\n  pick 3 (rem=4): → pick 3 rem=1 → ... no; pick 4? No candidates\n  pick 6 (rem=1): no\n  pick 7 (rem=0): → [7] ✓\n✅ Answer: [[2,2,3],[7]]`,
      keyInsight: `O(n^(t/m)) time where t=target, m=min candidate (branching factor × depth). O(t/m) extra stack space. Classic backtracking for combination problems.`,
    },

    'Backtracking with Early Pruning': {
      intuition: `Same as standard backtracking, but sort the candidates first. In the inner loop, if a candidate exceeds the remaining target, break immediately — all subsequent candidates are also too large. This prunes the search tree significantly.`,
      steps: [
        `Sort candidates ascending.`,
        `Backtrack(start, remaining, current):`,
        `  If remaining == 0: add copy; return.`,
        `  For i from start to end:`,
        `    If candidates[i] > remaining: break (sorted, so rest also too large).`,
        `    Add candidates[i], recurse(i, remaining - candidates[i]), remove last.`,
      ],
      example: `candidates=[2,3,6,7] sorted, target=7\n\nstart=0, rem=7:\n  pick 2 (rem=5):\n    pick 2 (rem=3):\n      pick 2 (rem=1): pick 2→-1 break; pick 3→-2 break\n      pick 3 (rem=0) → [2,2,3] ✓\n      pick 6: 6>3 → BREAK ✂\n    pick 3 (rem=2): pick 3→-1 break; pick 6→break\n    pick 6: 6>5 → BREAK ✂\n  pick 3 (rem=4): pick 3(rem=1):all too big; pick 6→BREAK ✂\n  pick 6 (rem=1): all too big → BREAK ✂\n  pick 7 (rem=0) → [7] ✓\n✅ Answer: [[2,2,3],[7]]`,
      keyInsight: `Same asymptotic complexity but significantly faster in practice. Sorting is O(n log n) but pays off immediately with early breaks.`,
    },

    'Include/Exclude Decision Tree': {
      intuition: `For each candidate, decide: include it (possibly multiple times) OR skip it and never use it again. This produces a binary-style decision tree where one branch always moves to the next candidate (exclude) and the other stays on the current candidate (include one more).`,
      steps: [
        `Backtrack(index, remaining, current):`,
        `  If remaining == 0: add copy; return.`,
        `  If index >= n OR remaining < 0: return.`,
        `  Option A — include candidates[index]: add it, recurse(index, remaining - candidates[index]).`,
        `  Option B — skip candidates[index]: remove last if included, recurse(index+1, remaining).`,
      ],
      example: `candidates=[2,3,6,7], target=7\n\nAt index=0 (2):\n  Include: current=[2], recurse(0, 5)\n    Include: current=[2,2], recurse(0, 3)\n      Include: [2,2,2], recurse(0,1)\n        Include: [2,2,2,2] rem=-1 stop\n        Exclude: recurse(1, 1)\n          Include 3: rem=-2 stop\n          Exclude: recurse(2,1)...\n      Exclude: recurse(1, 3)\n        Include 3: [2,2,3] rem=0 → ADD ✓\n  Exclude: recurse(1, 7) → eventually [7] ✓\n✅ Answer: [[2,2,3],[7]]`,
      keyInsight: `O(2^(t/m) × n) time in the worst case. Explicitly models include/exclude decisions, which makes the choice tree transparent. Equivalent to the standard approach but with a different branching structure.`,
    },

    'Dynamic Programming': {
      intuition: `Build a dp table where dp[t] is the list of all combinations summing to t. Start with dp[0] = [[]] (empty combination). For each target value, for each candidate that fits, extend combinations from dp[t-candidate].`,
      steps: [
        `Create dp[target+1] where dp[0]=[[]].`,
        `For t from 1 to target:`,
        `  For each candidate c ≤ t:`,
        `    For each combo in dp[t-c]:`,
        `      If last element of combo ≤ c (or combo is empty): add combo+[c] to dp[t].`,
        `Return dp[target].`,
      ],
      example: `candidates=[2,3,6,7], target=7\n\ndp[0]=[[]], dp[2]=[[2]], dp[3]=[[3]], dp[4]=[[2,2]]\ndp[5]=[[2,3]], dp[6]=[[2,2,2],[3,3],[6]]\ndp[7]=[[2,2,3],[7]]\n✅ Answer: [[2,2,3],[7]]`,
      keyInsight: `O(target × n × output) time and space. DP stores all intermediate combinations, which can be memory-heavy. Backtracking is generally preferred for this problem.`,
    },

    'Standard (entry point — pruned backtracking)': {
      intuition: `The entry point that sorts candidates and calls the pruned backtracking helper. Sorting once upfront enables the early-exit optimisation throughout the entire search.`,
      steps: [
        `Sort candidates.`,
        `Initialise results list.`,
        `Call backtrack(candidates, target, 0, [], results).`,
        `Return results.`,
      ],
      example: `candidates=[2,3,6,7], target=7\ncombinationSum([2,3,6,7], 7)\n→ sorts, calls pruned backtracking\n→ returns [[2,2,3],[7]]\n✅ Answer: [[2,2,3],[7]]`,
      keyInsight: `O(n^(t/m)) time — same as pruned backtracking. The entry point exists to enforce sorting and clean API separation.`,
    },
  },
}
