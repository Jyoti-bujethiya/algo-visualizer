/**
 * Tutorial content for #068 — Permutations
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an array of distinct integers, return all possible permutations. Every permutation uses each element exactly once and in a different order.`,
    example: `nums = [1, 2, 3]\n→ [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]\n✅ Answer: 6 permutations`,
    keyInsight: `A permutation places one element in each position. For position i, try every element not yet used. With n elements, there are n! total permutations.`,
  },

  approaches: {
    'Backtracking with Swap': {
      intuition: `Fix elements one position at a time by swapping. For position i, try swapping nums[i] with every element at index j ≥ i. After the swap, recurse for position i+1. Then swap back (undo) to try the next choice.`,
      steps: [
        `Backtrack(start):`,
        `  If start == n: add a copy of nums to results; return.`,
        `  For j from start to n-1:`,
        `    Swap nums[start] and nums[j].`,
        `    Recurse(start + 1).`,
        `    Swap back nums[start] and nums[j].`,
      ],
      example: `nums = [1, 2, 3]\n\nstart=0: swap(0,0)→[1,2,3]; recurse(1)\n  start=1: swap(1,1)→[1,2,3]; recurse(2)\n    start=2: add [1,2,3]\n  swap(1,2)→[1,3,2]; recurse(2)\n    add [1,3,2]; swap back\nstart=0: swap(0,1)→[2,1,3]; recurse(1)\n  ... → [2,1,3], [2,3,1]\nstart=0: swap(0,2)→[3,2,1]; recurse(1)\n  ... → [3,2,1], [3,1,2]\n✅ Answer: 6 permutations`,
      keyInsight: `O(n! × n) time (n! permutations, each copied in O(n)), O(n) extra space. Elegant in-place approach — no auxiliary data structures.`,
    },

    'Backtracking with Used Array': {
      intuition: `Maintain a boolean "used" array. Build the permutation position by position: at each step, try every unused element. Mark it used before recursing, unmark it after. When the current permutation is full (length == n), add it to results.`,
      steps: [
        `Create used[n] = all false and an empty current list.`,
        `Backtrack():`,
        `  If current.size() == n: add copy to results; return.`,
        `  For i from 0 to n-1:`,
        `    If used[i]: skip.`,
        `    Mark used[i]=true, add nums[i].`,
        `    Recurse().`,
        `    Unmark used[i]=false, remove last.`,
      ],
      example: `nums = [1, 2, 3]\n\ncurrent=[], used=[F,F,F]\nTry i=0 (1): current=[1], used=[T,F,F]\n  Try i=1 (2): current=[1,2], used=[T,T,F]\n    Try i=2 (3): current=[1,2,3] → add\n  Try i=2 (3): current=[1,3] → add [1,3,2]\n... (all 6 permutations found)\n✅ Answer: 6 permutations`,
      keyInsight: `O(n! × n) time and O(n) extra space. Cleaner to reason about than swap-based, at the cost of an auxiliary "used" array.`,
    },

    'Iterative Insertion': {
      intuition: `Build permutations incrementally. Start with [[1]]. For each new number, insert it at every possible position in every existing permutation. Each existing permutation of length k generates k+1 new permutations.`,
      steps: [
        `result = [[nums[0]]].`,
        `For each subsequent num nums[i]:`,
        `  For each existing permutation perm:`,
        `    For each insertion position j from 0 to perm.length:`,
        `      Create a new list with num inserted at position j.`,
        `      Add to new result.`,
        `  Replace result with new result.`,
        `Return result.`,
      ],
      example: `nums = [1, 2, 3]\n\nStart: [[1]]\nInsert 2: [2,1], [1,2]\nInsert 3 into [2,1]: [3,2,1],[2,3,1],[2,1,3]\nInsert 3 into [1,2]: [3,1,2],[1,3,2],[1,2,3]\nAll 6 permutations\n✅ Answer: 6 permutations`,
      keyInsight: `O(n! × n) time and space. Iterative — avoids recursion entirely. Requires building new lists at each step.`,
    },

    'Next Permutation (STL-style)': {
      intuition: `Start from the lexicographically smallest permutation (sorted). Repeatedly find the "next permutation" using the standard algorithm until we've cycled through all n! permutations and wrapped back to the start.`,
      steps: [
        `Sort nums to get the smallest permutation; add it.`,
        `Repeat n!-1 times:`,
        `  Find largest i where nums[i] < nums[i+1].`,
        `  Find largest j where nums[j] > nums[i]; swap nums[i] and nums[j].`,
        `  Reverse the suffix starting at i+1.`,
        `  Add copy of nums.`,
        `Return results.`,
      ],
      example: `nums = [1, 2, 3] (already sorted)\n\nStart: [1,2,3] → add\nNext: i=1 (nums[1]<nums[2]), j=2; swap → [1,3,2]; reverse from 2 → [1,3,2] → add\nNext: i=0, j=2; swap → [3,1,2]; reverse from 1 → [3,1,2]... wait\nActual sequence: [1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]\n✅ Answer: 6 permutations`,
      keyInsight: `O(n! × n) time. Generates permutations in sorted (lexicographic) order, which is useful when a specific ordering is required.`,
    },

    'Standard (entry point — uses swap backtracking)': {
      intuition: `The clean entry point that initialises results and calls the swap-based backtracking helper. Delegates all work to the helper.`,
      steps: [
        `Initialise an empty results list.`,
        `Call backtrack(nums, 0, results).`,
        `Return results.`,
      ],
      example: `nums = [1, 2, 3]\npermute([1,2,3]) → calls backtrack(nums, 0, results)\n→ returns all 6 permutations\n✅ Answer: 6 permutations`,
      keyInsight: `O(n! × n) time — same as swap backtracking. Entry point only; no independent logic.`,
    },
  },
}
