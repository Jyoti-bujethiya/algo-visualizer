/**
 * Tutorial content for #067 — Subsets II
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an integer array that may contain duplicates, return all possible subsets (the power set) with no duplicate subsets. Two subsets are considered duplicates if they contain the same elements in the same quantities.`,
    example: `nums = [1, 2, 2]\n→ [], [1], [2], [1,2], [2,2], [1,2,2]\n✅ Answer: 6 distinct subsets`,
    keyInsight: `Sort the array first. When backtracking, if the current element equals the previous element AND we're at the same depth level (not extending a branch that already took the duplicate), skip it. This ensures each duplicate is only used in sequence.`,
  },

  approaches: {
    'Backtracking with Skip Duplicates': {
      intuition: `Sort the array. In the backtracking loop, before adding an element, check if it's the same as the previous element at this level. If it is (and we didn't just come from that element in our current path), skip it to avoid generating a duplicate subset.`,
      steps: [
        `Sort nums.`,
        `Backtrack(start, current):`,
        `  Add copy of current to results.`,
        `  For i from start to n-1:`,
        `    If i > start AND nums[i] == nums[i-1]: skip (continue).`,
        `    Add nums[i], recurse(i+1, current), remove nums[i].`,
      ],
      example: `nums = [1, 2, 2]  sorted\n\nstart=0:\n  i=0 (1): [1]\n    i=1 (2): [1,2]\n      i=2 (2): [1,2,2]\n    i=2 (2): i>1 AND 2==2 → SKIP\n  i=1 (2): [2]\n    i=2 (2): [2,2]\n  i=2 (2): i>0 AND 2==2 → SKIP\nResults: [], [1], [1,2], [1,2,2], [2], [2,2]\n✅ Answer: 6 subsets`,
      keyInsight: `O(2ⁿ × n) time, O(n) extra space. The "i > start" check is the crucial guard — it allows the first occurrence of a value to be used while blocking its duplicates at the same level.`,
    },

    'Iterative Cascading with Duplicate Handling': {
      intuition: `Sort first. Iterate through nums. If the current number is a duplicate of the previous, only append it to the subsets added in the PREVIOUS round (not all existing subsets). Track the size of the result before the previous round to know which subsets are "new".`,
      steps: [
        `Sort nums. result = [[]], lastSize = 0, prevSize = 0.`,
        `For each num:`,
        `  If num == previous num: start = lastSize (only extend last round's new subsets).`,
        `  Else: start = 0.`,
        `  lastSize = result.size().`,
        `  For i from start to lastSize-1: add a copy of result[i] + num.`,
        `Return result.`,
      ],
      example: `nums = [1, 2, 2]  sorted\n\nStart: [[]], lastSize=0\nnum=1 (new): extend all from 0..0 → [[],[1]], lastSize=1\nnum=2 (new): extend all from 0..1 → [[],[1],[2],[1,2]], lastSize=2\nnum=2 (dup): extend only from lastSize=2..3 → add [2,2],[1,2,2]\nResult: [[],[1],[2],[1,2],[2,2],[1,2,2]]\n✅ Answer: 6 subsets`,
      keyInsight: `O(2ⁿ × n) time and space. Iterative and clean — the "start from lastSize" trick neatly handles duplicates without recursion.`,
    },

    'Frequency Map Backtracking': {
      intuition: `Count the frequency of each distinct value. Instead of scanning by index, iterate over distinct values. At each step, choose how many of the current value to include (0 up to its count). This naturally avoids duplicates because we never generate two subsets using the same multiset.`,
      steps: [
        `Build a sorted list of (value, count) pairs.`,
        `Backtrack(pos, current):`,
        `  If pos == number of distinct values: add current to results; return.`,
        `  Let (val, cnt) = pairs[pos].`,
        `  For k from 0 to cnt: add val k times, recurse(pos+1), remove those k vals.`,
      ],
      example: `nums = [1, 2, 2] → pairs = [(1,1), (2,2)]\n\npos=0 (1, count=1):\n  k=0 (skip 1): recurse on (2,2)\n    k=0: []\n    k=1: [2]\n    k=2: [2,2]\n  k=1 (take 1): recurse on (2,2)\n    k=0: [1]\n    k=1: [1,2]\n    k=2: [1,2,2]\n✅ Answer: 6 subsets`,
      keyInsight: `O(2ⁿ × n) time. Scales better in theory when there are many duplicates — fewer distinct values to iterate. Also avoids sorting and scanning duplicates.`,
    },

    'Bit Manipulation with Set': {
      intuition: `Sort the array, then iterate all 2ⁿ bitmasks. Decode each mask into a subset. Use a HashSet of sorted subsets to deduplicate. Any mask that would produce an already-seen subset is ignored.`,
      steps: [
        `Sort nums.`,
        `For mask from 0 to 2ⁿ-1:`,
        `  Build subset by checking each bit.`,
        `  Convert subset to a canonical form (sorted list or string).`,
        `  Add to set if not already seen.`,
        `Return all unique subsets.`,
      ],
      example: `nums = [1, 2, 2]  sorted\n\nmask=0 (000): []\nmask=1 (001): [1]\nmask=2 (010): [2]\nmask=3 (011): [1,2]\nmask=4 (100): [2]  ← duplicate, skip\nmask=5 (101): [1,2]  ← duplicate, skip\nmask=6 (110): [2,2]\nmask=7 (111): [1,2,2]\nUnique subsets = 6\n✅ Answer: 6 subsets`,
      keyInsight: `O(2ⁿ × n) time. Simple extension of the Subsets I bitmask approach — the HashSet handles deduplication automatically. Memory usage can be higher due to the set.`,
    },

    'Standard (entry point)': {
      intuition: `The public entry point that sorts the array and delegates to the internal backtracking-with-skip-duplicates helper. Sorting is the prerequisite that makes duplicate detection possible in O(1) per step.`,
      steps: [
        `Sort nums.`,
        `Initialise results list.`,
        `Call backtrack(0, [], results).`,
        `Return results.`,
      ],
      example: `nums = [1, 2, 2]\nSort → [1, 2, 2]\nDelegate to backtracking helper\n→ returns [[], [1], [1,2], [1,2,2], [2], [2,2]]\n✅ Answer: 6 subsets`,
      keyInsight: `O(2ⁿ × n) time — same as the underlying helper. The entry point enforces the sort invariant so no caller needs to remember to sort first.`,
    },
  },
}
