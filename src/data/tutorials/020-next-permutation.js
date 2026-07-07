/**
 * Tutorial content for #020 — Next Permutation
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an array of integers representing a permutation of numbers, rearrange the numbers into the next lexicographically greater permutation (the next ordering if you listed all permutations in sorted order). If no greater permutation exists (the array is already the largest), rearrange to the smallest permutation (sorted ascending). Modify in-place.`,
    example: `[1, 2, 3] → next is [1, 3, 2]\n[3, 2, 1] → no greater permutation → [1, 2, 3]\n[1, 1, 5] → next is [1, 5, 1]\n✅ Answer for [1,2,3]: [1,3,2]`,
    keyInsight: `Find the rightmost "descent" — a position where nums[i] < nums[i+1]. Swap it with the smallest element to its right that is larger than it. Then reverse everything to the right of that position to get the minimal next arrangement.`,
  },

  approaches: {
    'STL next_permutation (Library)': {
      intuition: `In C++, the STL provides a built-in next_permutation() function that does exactly this in-place. In Java or Python you would call the equivalent library. This approach shows that the operation is common enough to be a standard library function — understand the concept, then use the tool.`,
      steps: [
        `In C++: call std::next_permutation(nums.begin(), nums.end()).`,
        `This function rearranges nums in-place to the next permutation.`,
        `If it was already the last permutation, it wraps to the first (sorted) permutation.`,
        `The return value (bool) indicates whether a next permutation exists — but for this problem we ignore it.`,
      ],
      example: `nums = [1, 2, 3]\n\nstd::next_permutation(nums.begin(), nums.end())\n→ [1, 3, 2]\n\nnums = [3, 2, 1]\nstd::next_permutation(...)\n→ [1, 2, 3] (wrapped around)\n✅ Answer: [1, 3, 2]`,
      keyInsight: `O(n) time, O(1) space. The STL implementation uses the same classic algorithm internally. Knowing the library call is useful in competitive programming; interviewers usually want you to implement it manually.`,
    },

    'Classic In-Place': {
      intuition: `Find the rightmost position i where nums[i] < nums[i+1] (the "pivot"). The suffix to the right is in descending order. Swap the pivot with the smallest element in the suffix that is still greater than the pivot. Then reverse the suffix to make it the smallest possible arrangement.`,
      steps: [
        `Step 1 — Find pivot: scan right to left, find largest i where nums[i] < nums[i+1].`,
        `  If no such i exists, the whole array is descending → reverse it and return.`,
        `Step 2 — Find successor: scan right to left, find largest j where nums[j] > nums[i].`,
        `Step 3 — Swap: swap nums[i] and nums[j].`,
        `Step 4 — Reverse: reverse the subarray from i+1 to end.`,
      ],
      example: `nums = [1, 3, 2]\n\nStep 1: scan right→left: nums[1]=3 > nums[2]=2 (descent), nums[0]=1 < nums[1]=3 → pivot i=0\nStep 2: scan right→left for first val > nums[0]=1: nums[2]=2 > 1 → j=2\nStep 3: swap nums[0] and nums[2] → [2, 3, 1]\nStep 4: reverse from index 1 → reverse [3,1] → [1,3]\nFinal: [2, 1, 3]\n✅ Answer: [2, 1, 3]`,
      keyInsight: `O(n) time, O(1) space. This is the algorithm used by std::next_permutation internally. The three steps — find pivot, find successor, swap, reverse — work because the suffix after the pivot is always sorted in descending order.`,
    },

    'Explicit Reverse (No Arrays.sort)': {
      intuition: `Exactly the same four-step algorithm, but implements the reversal step explicitly with a two-pointer swap rather than calling Arrays.sort or Collections.reverse. This makes it fully in-place and avoids any hidden sorting cost in the reversal.`,
      steps: [
        `Same Step 1: find pivot i (rightmost nums[i] < nums[i+1]).`,
        `If no pivot, call the explicit reverse function on the whole array.`,
        `Same Step 2: find successor j (rightmost nums[j] > nums[i]).`,
        `Same Step 3: swap nums[i] and nums[j].`,
        `Step 4 (explicit reverse): use two pointers left=i+1, right=n-1; swap nums[left] and nums[right]; left++, right-- until left >= right.`,
      ],
      example: `nums = [1, 5, 4, 3, 2]\n\nStep 1: check right-to-left: 4>3>2 descending, then 5>4 → pivot i=1 (nums[1]=5? No: we need nums[i]<nums[i+1])\n  nums[0]=1 < nums[1]=5 → i=0? No, let's re-check: rightmost i with nums[i]<nums[i+1]\n  i=4: 2<nothing, i=3: 3>2, i=2: 4>3, i=1: 5>4, i=0: 1<5 → pivot i=0\nStep 2: rightmost j where nums[j]>1: j=4(2)? No j=4 has 2>1 → j=4\nStep 3: swap nums[0],nums[4] → [2,5,4,3,1]\nStep 4: reverse [1..4]: two pointers swap → [2,1,3,4,5]\n✅ Answer: [2,1,3,4,5]`,
      keyInsight: `O(n) time, O(1) space. Functionally identical to Classic In-Place. The explicit reverse loop ensures no hidden O(n log n) cost from sorting; it confirms the reversal step is truly O(n).`,
    },

    'Two-Pass Scan (Verbose / Educational)': {
      intuition: `Break the algorithm into clearly named, separated phases with extra commentary variables to make every step visible. Find the pivot in one explicit loop, find the successor in a second explicit loop, swap them, then reverse the tail in a fourth explicit loop. Identical logic to Classic In-Place but structured for maximum readability in a teaching context.`,
      steps: [
        `Phase 1 — Find pivot: scan from right, find largest index i where nums[i] < nums[i+1]. If none, jump to Phase 4 directly.`,
        `Phase 2 — Find successor: scan from right, find largest index j where nums[j] > nums[i].`,
        `Phase 3 — Swap pivot and successor: swap nums[i] and nums[j].`,
        `Phase 4 — Reverse tail: reverse nums[i+1 .. n-1] using two explicit pointer variables left and right.`,
      ],
      example: `nums = [2, 3, 1]\n\nPhase 1: i=3→nothing, i=2→nothing, i=1: nums[1]=3 > nums[2]=1 skip; i=0: nums[0]=2 < nums[1]=3 → pivot i=0\nPhase 2: j=2: nums[2]=1 < nums[0]=2 skip; j=1: nums[1]=3 > 2 → successor j=1\nPhase 3: swap nums[0] and nums[1] → [3, 2, 1]\nPhase 4: reverse tail [1..2]: swap nums[1]=2 and nums[2]=1 → [3, 1, 2]\n✅ Answer: [3, 1, 2]`,
      keyInsight: `O(n) time, O(1) space. No algorithmic difference from Classic In-Place — the value is in the explicit naming of phases. Useful in interviews to narrate your thought process step-by-step, or as a starting scaffold that you then compact into the classic form.`,
    },

    'Sort-Based': {
      intuition: `Generate all permutations of the array, sort them lexicographically, find the current permutation in the list, and return the next one. If the current is the last, return the first (sorted). This is conceptually the most direct interpretation of "next permutation" but wildly impractical — included here to show why the in-place algorithm exists.`,
      steps: [
        `Generate all n! permutations of the array.`,
        `Sort the list of permutations lexicographically.`,
        `Find the index k of the current permutation in the sorted list.`,
        `Return permutations[(k+1) % n!].`,
      ],
      example: `nums = [1, 2, 3] → all permutations sorted:\n[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]\n\nCurrent [1,2,3] is index 0.\nNext = index 1 = [1,3,2]\n✅ Answer: [1, 3, 2]`,
      keyInsight: `O(n! × n) time, O(n!) space — completely impractical for n > 10. Its only purpose is to make the problem definition concrete: "next permutation" literally means the successor in the sorted list of all permutations. Understanding this motivates why the O(n) Classic In-Place algorithm is such a clever shortcut.`,
    },
  },
}
