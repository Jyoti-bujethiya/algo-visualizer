/**
 * Tutorial content for #011 — Sliding Window Maximum
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an integer array and a window size k, slide a window of size k across the array from left to right and return the maximum value in each window position.`,
    example: `nums = [1,3,-1,-3,5,3,6,7], k = 3\n→ Window [1,3,-1] → max=3\n→ Window [3,-1,-3] → max=3\n→ Window [-1,-3,5] → max=5\n→ ... and so on\n✅ Answer: [3,3,5,5,6,7]`,
    keyInsight: `A monotonic deque (decreasing) always has the maximum at its front. When the window slides, remove outdated indices from the front and smaller elements from the back — then the front is always the current max.`,
  },

  approaches: {
    'Brute Force': {
      intuition: `For each window position, scan all k elements to find the maximum. Simple: just loop through each window and keep track of the largest value seen. Inefficient because you re-examine elements that belong to multiple windows.`,
      steps: [
        `Initialize result array of size n-k+1.`,
        `Loop i from 0 to n-k (window start).`,
        `For each window, loop j from i to i+k-1 and find the max.`,
        `Store the max in result[i].`,
        `Return result.`,
      ],
      example: `nums = [1,3,-1,-3,5,3,6,7], k=3\n\ni=0: max(1,3,-1)=3\ni=1: max(3,-1,-3)=3\ni=2: max(-1,-3,5)=5\ni=3: max(-3,5,3)=5\ni=4: max(5,3,6)=6\ni=5: max(3,6,7)=7\n✅ Answer: [3,3,5,5,6,7]`,
      keyInsight: `O(n×k) time, O(1) space (ignoring output). For k=1000 and n=100,000 this is 100 million operations. The deque approach brings it down to O(n).`,
    },

    'Monotonic Deque': {
      intuition: `Maintain a deque (double-ended queue) of indices in decreasing order of their values. The front of the deque is always the index of the current window's maximum. Before adding a new index, pop from the back any indices whose values are smaller (they can never be the max). Also pop from the front when those indices fall out of the window.`,
      steps: [
        `Initialize an empty deque and result array.`,
        `Loop i from 0 to n-1:`,
        `  Remove from front: while deque is not empty AND deque.front() <= i-k, pop front.`,
        `  Remove from back: while deque is not empty AND nums[deque.back()] <= nums[i], pop back.`,
        `  Add i to back of deque.`,
        `  Once i >= k-1 (first full window formed): result.add(nums[deque.front()]).`,
        `Return result.`,
      ],
      example: `nums = [1,3,-1,-3,5,3,6,7], k=3\n\ni=0(1):  deque=[0]\ni=1(3):  pop 0 (1<3). deque=[1]\ni=2(-1): deque=[1,2]. i=2≥2: result=[nums[1]]=[ 3]\ni=3(-3): deque=[1,2,3]. remove front? 1>0 ok. result=[3, nums[1]]=[ 3,3]\ni=4(5):  pop 3(-3),2(-1),1(3) all <5. deque=[4]. remove front? ok. result=[3,3, 5]\ni=5(3):  deque=[4,5]. result=[3,3,5, 5]\ni=6(6):  pop 5(3)<6,4(5)<6. deque=[6]. result=[3,3,5,5, 6]\ni=7(7):  pop 6(6)<7. deque=[7]. result=[3,3,5,5,6, 7]\n✅ Answer: [3,3,5,5,6,7]`,
      keyInsight: `O(n) time, O(k) space. Each element is added to and removed from the deque at most once. The deque's decreasing invariant guarantees the front is always the window maximum.`,
    },

    'Sparse Table (Static Range Max)': {
      intuition: `Pre-process the array into a sparse table that answers "what is the maximum in range [l, r]?" in O(1). A sparse table stores the maximum for every interval of length 2^j starting at every index. Then each window query is answered immediately using two overlapping power-of-2 intervals.`,
      steps: [
        `Build sparse table: st[i][j] = max of nums[i..i+2^j-1].`,
        `st[i][0] = nums[i].`,
        `For j from 1 to log2(n): st[i][j] = max(st[i][j-1], st[i+2^(j-1)][j-1]).`,
        `For each window [i, i+k-1]: compute p = floor(log2(k)).`,
        `Query = max(st[i][p], st[i+k-2^p][p]).`,
        `Collect all window query results and return.`,
      ],
      example: `nums = [1,3,-1,-3,5,3,6,7], k=3\n\nSparse table built (st[i][0]=nums[i], st[i][1]=max of pairs, st[i][2]=max of quads)\np = floor(log2(3)) = 1, overlap = 3 - 2^1 = 1\n\nWindow [0,2]: max(st[0][1], st[1][1]) = max(3,3) = 3\nWindow [1,3]: max(st[1][1], st[2][1]) = max(3,5) = 3 (wait, st[2][1]=max(-1,-3)=-1... recalc)\n  Actually st[i][1]=max(nums[i],nums[i+1]):\n  st[1][1]=max(3,-1)=3, st[2][1]=max(-1,-3)=-1\n  Query[1..3]: max(st[1][1], st[2][1])=max(3,-1)=3 ✓\n...\n✅ Answer: [3,3,5,5,6,7]`,
      keyInsight: `O(n log n) build, O(1) per query, O(n log n) space. Ideal when you need many window-max queries on a static array. Overkill here but a powerful general pattern for range-max problems.`,
    },

    'Two-Pass Block Decomposition': {
      intuition: `Divide the array into blocks of size k. For each position, compute the "prefix max" from the start of its block and the "suffix max" from the end of its block. Any window of size k spans at most two blocks, so the window max is max(suffixMax[i], prefixMax[i+k-1]).`,
      steps: [
        `Divide array into blocks of size k.`,
        `Build prefixMax[]: from the start of each block, accumulate max forward.`,
        `Build suffixMax[]: from the end of each block, accumulate max backward.`,
        `For each window starting at i: windowMax = max(suffixMax[i], prefixMax[i+k-1]).`,
        `Collect results and return.`,
      ],
      example: `nums = [1,3,-1, -3,5,3, 6,7], k=3 (block size = k)\nBlock 0: [1,3,-1], Block 1: [-3,5,3], Block 2: [6,7]\n\nsuffixMax: [3,3,-1, 5,5,3, 7,7]\nprefixMax: [1,3,3, -3,5,5, 6,7]\n\nWindow [0,2]: max(suffixMax[0], prefixMax[2]) = max(3,3) = 3\nWindow [1,3]: max(suffixMax[1], prefixMax[3]) = max(3,-3) = 3\nWindow [2,4]: max(suffixMax[2], prefixMax[4]) = max(-1,5) = 5\nWindow [3,5]: max(suffixMax[3], prefixMax[5]) = max(5,5) = 5\n...\n✅ Answer: [3,3,5,5,6,7]`,
      keyInsight: `O(n) time, O(n) space. No special data structure needed — just two extra arrays. The prefix/suffix trick within blocks is reusable in many "sliding window with range queries" problems.`,
    },

    'TreeMap (Sorted Container)': {
      intuition: `Use a TreeMap (a sorted map from value to count) as the window's data structure. Inserting or removing an element costs O(log k), but the maximum is always the last key in the TreeMap — retrievable in O(log k). When the window slides, remove the outgoing element (decrement its count, remove from map if zero) and add the incoming one.`,
      steps: [
        `Initialize a TreeMap<Integer, Integer> map (value → frequency) and result array.`,
        `For i from 0 to n-1:`,
        `  Add nums[i] to map (increment its count).`,
        `  If i >= k-1: record map.lastKey() as the window max in result.`,
        `  Remove the outgoing element nums[i-k+1]: decrement its count; if count reaches 0, remove the key.`,
        `Return result.`,
      ],
      example: `nums = [1,3,-1,-3,5,3,6,7], k=3\n\ni=0: map={1:1}\ni=1: map={1:1,3:1}\ni=2: map={-1:1,1:1,3:1} → result=[3] → remove nums[0]=1 → map={-1:1,3:1}\ni=3: map={-3:1,-1:1,3:1} → result=[3,3] → remove nums[1]=3 → map={-3:1,-1:1}\ni=4: map={-3:1,-1:1,5:1} → result=[3,3,5] → remove -1 → map={-3:1,5:1}\ni=5: map={-3:1,3:1,5:1} → result=[3,3,5,5] → remove -3\ni=6: map={3:1,5:1,6:1} → result=[3,3,5,5,6] → remove 5\ni=7: map={3:1,6:1,7:1} → result=[3,3,5,5,6,7]\n✅ Answer: [3,3,5,5,6,7]`,
      keyInsight: `O(n log k) time, O(k) space. Slower than the deque's O(n) but useful when the problem requires more than just the maximum (e.g., median or rank queries), since TreeMap supports arbitrary order statistics.`,
    },
  },
}
