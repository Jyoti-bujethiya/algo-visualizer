/**
 * Tutorial content for #069 — Permutations II
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a collection of integers that might contain duplicates, return all unique permutations. Two permutations are duplicates if they contain the same elements in the same order.`,
    example: `nums = [1, 1, 2]\n→ [1,1,2], [1,2,1], [2,1,1]\n✅ Answer: 3 unique permutations`,
    keyInsight: `Sort first. During backtracking, if the current element equals the previous one AND the previous one has NOT been used yet (meaning we're at the same depth-level, not in an ongoing branch), skip it to avoid generating a duplicate permutation.`,
  },

  approaches: {
    'Backtracking with Sorting and Skip Duplicates': {
      intuition: `Sort the array. Use a "used" boolean array. For each position, try every unused element. Skip if the element equals the previous element AND the previous element is not currently in use — this ensures each duplicate value is placed in sequence, never in parallel.`,
      steps: [
        `Sort nums.`,
        `Backtrack(current, used):`,
        `  If current.size() == n: add copy; return.`,
        `  For i from 0 to n-1:`,
        `    If used[i]: skip.`,
        `    If i > 0 AND nums[i]==nums[i-1] AND NOT used[i-1]: skip (duplicate branch).`,
        `    Mark used[i]=true, add nums[i], recurse, unmark, remove last.`,
      ],
      example: `nums = [1, 1, 2]  sorted\n\ncurrent=[], used=[F,F,F]\ni=0 (1, not used): mark, [1] ...\ni=1 (1, dup of i=0 AND used[0]=F → SKIP)\ni=2 (2): [2] ...\n\nFrom [1] (used[0]=T):\n  i=1 (1, used[0]=T so NOT skipped): [1,1] → [1,1,2] ✓\n  i=2 (2): [1,2] → [1,2,1] ✓\n\nFrom [2] (used[2]=T):\n  i=0 (1): [2,1] → [2,1,1] ✓\n  i=1 (1, dup of i=0, used[0]=F → SKIP)\n✅ Answer: 3 permutations`,
      keyInsight: `O(n! × n) time, O(n) extra space. The "NOT used[i-1]" condition is the key — it prunes duplicate branches at the same recursion level.`,
    },

    'Backtracking with Swap and Set': {
      intuition: `Use the swap-based backtracking (fix element at each position), but guard duplicates with a HashSet at each recursion level. If nums[j] is already in the set for this position, skip the swap — we've already explored that choice.`,
      steps: [
        `Backtrack(start):`,
        `  If start==n: add copy of nums; return.`,
        `  Create a seen set for this level.`,
        `  For j from start to n-1:`,
        `    If nums[j] is in seen: skip.`,
        `    Add nums[j] to seen.`,
        `    Swap nums[start] and nums[j], recurse(start+1), swap back.`,
      ],
      example: `nums = [1, 1, 2]\n\nstart=0, seen={}:\n  j=0 (1): seen={1}; swap noop; recurse(1)\n    start=1, seen={}:\n      j=1 (1): seen={1}; recurse(2) → [1,1,2] ✓\n      j=2 (2): seen={1,2}; swap → [1,2,1]; recurse(2) → [1,2,1] ✓\n  j=1 (1): already in seen → skip\n  j=2 (2): seen={1,2}; swap → [2,1,1]; recurse(1)\n    ... → [2,1,1] ✓\n✅ Answer: 3 permutations`,
      keyInsight: `O(n! × n) time. The per-level HashSet deduplicates without requiring sorting, at the cost of O(n) per level of extra memory.`,
    },

    'Frequency Map Backtracking': {
      intuition: `Build a frequency map of each distinct value. At each position, try placing each distinct value (not each array index). Decrement the count when you place a value, increment when you backtrack. This naturally generates each unique permutation exactly once.`,
      steps: [
        `Build a sorted map of value → count.`,
        `Backtrack(current, countMap):`,
        `  If current.size() == n: add copy; return.`,
        `  For each distinct value v with count > 0:`,
        `    Decrement count[v], add v to current.`,
        `    Recurse.`,
        `    Increment count[v], remove last from current.`,
      ],
      example: `nums = [1, 1, 2] → map = {1:2, 2:1}\n\ncurrent=[]:\n  Try 1: map={1:1,2:1}, current=[1]\n    Try 1: map={1:0,2:1}, current=[1,1]\n      Try 2: map={1:0,2:0}, current=[1,1,2] → add ✓\n    Try 2: map={1:1,2:0}, current=[1,2]\n      Try 1: current=[1,2,1] → add ✓\n  Try 2: map={1:2,2:0}, current=[2]\n    Try 1 twice: current=[2,1,1] → add ✓\n✅ Answer: 3 permutations`,
      keyInsight: `O(n! × k) time where k is distinct values. Avoids sorting and skip-logic; naturally deduplicates by iterating over values, not indices.`,
    },

    'Iterative Insertion with Set': {
      intuition: `Extend Iterative Insertion from Permutations I with a global HashSet. Start from [[nums[0]]]. For each new number, insert it at all positions in all existing permutations, but only add to results if that permutation hasn't been seen before.`,
      steps: [
        `result = [[nums[0]]], seen = {[nums[0]]}.`,
        `For i from 1 to n-1:`,
        `  For each existing perm:`,
        `    For each position j from 0 to perm.length:`,
        `      Create new perm with nums[i] inserted at j.`,
        `      If not in seen: add to new result, add to seen.`,
        `  result = new result.`,
        `Return result.`,
      ],
      example: `nums = [1, 1, 2]\n\nStart: [[1]]\nInsert 1: [1,1],[1,1] (pos 0 and 1, but [1,1] is duplicate) → {[1,1]}\nInsert 2 into [1,1]: [2,1,1],[1,2,1],[1,1,2] → all new\nResult: [[2,1,1],[1,2,1],[1,1,2]]\n✅ Answer: 3 permutations`,
      keyInsight: `O(n! × n) time. Iterative approach — no recursion — but requires a HashSet for deduplication which adds memory and hashing overhead.`,
    },

    'Next Permutation': {
      intuition: `Sort nums, add it to results, then repeatedly generate the next lexicographic permutation until the sequence wraps back to the sorted order. This produces all unique permutations in sorted order, naturally handling duplicates since identical permutations are never generated as "next" states.`,
      steps: [
        `Sort nums; count total = n! / (freq1! × freq2! × ...).`,
        `Add sorted nums to results.`,
        `Repeat (total - 1) times:`,
        `  Find largest i where nums[i] < nums[i+1].`,
        `  Find largest j where nums[j] > nums[i]; swap.`,
        `  Reverse suffix starting at i+1.`,
        `  Add copy.`,
        `Return results.`,
      ],
      example: `nums = [1, 1, 2]  sorted\n\n[1,1,2] → add\nNext: i=1 (nums[1]=1<nums[2]=2), j=2; swap → [1,2,1]; reverse from 2 → [1,2,1] → add\nNext: i=0 (nums[0]=1<nums[1]=2), j=2; swap → [2,1,1]; reverse from 1 → [2,1,1] → add\nWraps back to [1,1,2] → stop\n✅ Answer: 3 permutations`,
      keyInsight: `O(n! × n) time. Generates permutations in lexicographic order. Duplicates in the input never produce duplicate permutations because "next permutation" skips them structurally.`,
    },
  },
}
