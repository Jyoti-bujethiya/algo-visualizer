/**
 * Tutorial content for #066 — Subsets
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an array of unique integers, return all possible subsets (the power set). The result must not contain duplicate subsets, and order of elements within a subset doesn't matter.`,
    example: `nums = [1, 2, 3]\n→ [], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]\n✅ Answer: 8 subsets`,
    keyInsight: `For each element, you make a binary choice: include it or exclude it. With n elements and 2 choices each, there are exactly 2ⁿ subsets total.`,
  },

  approaches: {
    'Backtracking (DFS)': {
      intuition: `Use depth-first search. At each step, add the current partial subset to the results, then try adding each remaining element (from a given start index onward) one at a time. Backtrack by removing the last element after exploring.`,
      steps: [
        `Start with an empty current list and a start index of 0.`,
        `Add a copy of the current list to results (every prefix is a valid subset).`,
        `For i from start to n-1: add nums[i], recurse with start=i+1, then remove nums[i].`,
      ],
      example: `nums = [1, 2, 3]\n\nDFS tree:\n[] ← add\n  [1] ← add\n    [1,2] ← add\n      [1,2,3] ← add\n    [1,3] ← add\n  [2] ← add\n    [2,3] ← add\n  [3] ← add\nResult: 8 subsets\n✅ Answer: 8 subsets`,
      keyInsight: `O(2ⁿ × n) time (2ⁿ subsets, each copied in O(n)), O(n) extra space for the recursion stack. The most intuitive approach.`,
    },

    'Iterative Cascading': {
      intuition: `Start with a result containing just the empty set. For each number, take every existing subset and create a new subset by adding the number to it. After processing all numbers, result contains all 2ⁿ subsets.`,
      steps: [
        `result = [[]].`,
        `For each num in nums:`,
        `  For each existing subset in result (snapshot the current size):`,
        `    Create a new subset = existing subset + num.`,
        `    Append the new subset to result.`,
        `Return result.`,
      ],
      example: `nums = [1, 2, 3]\n\nStart: [[]]\nnum=1: add [1] → [[], [1]]\nnum=2: add [2],[1,2] → [[], [1], [2], [1,2]]\nnum=3: add [3],[1,3],[2,3],[1,2,3] → all 8 subsets\n✅ Answer: 8 subsets`,
      keyInsight: `O(2ⁿ × n) time and space. Iterative — no recursion stack. Each pass doubles the result set.`,
    },

    'Bit Manipulation': {
      intuition: `For n elements, there are 2ⁿ subsets, each corresponding to a number from 0 to 2ⁿ-1. Bit k of the number tells you whether element k is included. Iterate all numbers 0..2ⁿ-1 and decode each bitmask.`,
      steps: [
        `For mask from 0 to 2ⁿ-1:`,
        `  Create an empty subset.`,
        `  For bit from 0 to n-1: if (mask >> bit) & 1 == 1, add nums[bit].`,
        `  Add subset to results.`,
        `Return results.`,
      ],
      example: `nums = [1, 2, 3]  (n=3, 2³=8 masks)\n\nmask=0 (000): []\nmask=1 (001): [1]\nmask=2 (010): [2]\nmask=3 (011): [1,2]\nmask=4 (100): [3]\nmask=5 (101): [1,3]\nmask=6 (110): [2,3]\nmask=7 (111): [1,2,3]\n✅ Answer: 8 subsets`,
      keyInsight: `O(2ⁿ × n) time and space. Elegant bit-counting approach — every subset maps perfectly to a unique integer.`,
    },

    'Include/Exclude Backtracking': {
      intuition: `At each index, make an explicit binary decision: include the element OR exclude it. This produces a full binary decision tree of depth n. Each leaf represents a complete subset.`,
      steps: [
        `At index i, if i == n: add current subset to results; return.`,
        `Choice 1 — include: add nums[i], recurse(i+1), remove nums[i].`,
        `Choice 2 — exclude: recurse(i+1) without adding.`,
      ],
      example: `nums = [1, 2, 3]\n\nsolve(0):\n  include 1 → solve(1)\n    include 2 → solve(2)\n      include 3 → [1,2,3]\n      exclude 3 → [1,2]\n    exclude 2 → solve(2)\n      include 3 → [1,3]\n      exclude 3 → [1]\n  exclude 1 → solve(1)\n    ... → [2,3],[2],[3],[]\n✅ Answer: 8 subsets`,
      keyInsight: `O(2ⁿ × n) time and O(n) extra space. Slightly more verbose than DFS-with-start-index but makes the include/exclude nature of subset generation explicit.`,
    },

    'Standard (entry point — uses backtracking)': {
      intuition: `The public-facing method that sets up the results list and calls the internal backtracking helper. The setup is trivial — its purpose is to provide a clean API entry point.`,
      steps: [
        `Initialise an empty results list.`,
        `Call backtrack(nums, 0, [], results).`,
        `Return results.`,
      ],
      example: `nums = [1, 2, 3]\nsubsets([1,2,3]) → calls backtrack(nums,0,[],results)\n→ returns [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]\n✅ Answer: 8 subsets`,
      keyInsight: `O(2ⁿ × n) time — same as the underlying backtracking approach. This entry point exists for clean API design; all the work is in the recursive helper.`,
    },
  },
}
