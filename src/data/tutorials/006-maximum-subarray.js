/**
 * Tutorial content for #006 — Maximum Subarray
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an integer array (which may contain negative numbers), find the contiguous subarray that has the largest sum and return that sum. The subarray must contain at least one element.`,
    example: `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n→ The subarray [4, -1, 2, 1] has sum = 6\n✅ Answer: 6`,
    keyInsight: `If the running sum ever drops below zero, it's dead weight — any future subarray is better off starting fresh. This is the heart of Kadane's Algorithm.`,
  },

  approaches: {
    'Brute Force': {
      intuition: `Try every possible starting index and every possible ending index. For each pair, sum all elements between them and track the maximum. Three nested loops: two to define start/end, one to compute the sum.`,
      steps: [
        `Initialize maxSum = Integer.MIN_VALUE.`,
        `Outer loop i from 0 to n-1 (start of subarray).`,
        `Inner loop j from i to n-1 (end of subarray).`,
        `Innermost loop k from i to j: sum up nums[i..j].`,
        `Update maxSum = max(maxSum, current sum).`,
        `Return maxSum.`,
      ],
      example: `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n\nstart=0: [-2]=−2, [-2,1]=−1, [-2,1,−3]=−4, ...\nstart=3: [4]=4, [4,−1]=3, [4,−1,2]=5, [4,−1,2,1]=6 ← max!\n...\n✅ Answer: 6`,
      keyInsight: `O(n³) time, O(1) space. Exhaustive but very slow. Only practical for n < 200.`,
    },

    'Optimized Brute Force': {
      intuition: `Instead of a third inner loop to recompute the sum, extend the running sum as you expand the right boundary. This cuts one loop without changing the two-pointer idea: fix the start, try all ends and accumulate.`,
      steps: [
        `Initialize maxSum = Integer.MIN_VALUE.`,
        `Outer loop i from 0 to n-1 (start index).`,
        `Initialize currentSum = 0.`,
        `Inner loop j from i to n-1: currentSum += nums[j].`,
        `Update maxSum = max(maxSum, currentSum).`,
        `Return maxSum.`,
      ],
      example: `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n\ni=3 (start=4):\n  j=3: sum=4,  max=4\n  j=4: sum=3,  max=4\n  j=5: sum=5,  max=5\n  j=6: sum=6,  max=6 ← best\n  j=7: sum=1,  max=6\n  j=8: sum=5,  max=6\n✅ Answer: 6`,
      keyInsight: `O(n²) time, O(1) space. Twice as fast as O(n³) in practice, but still quadratic. Good stepping stone toward Kadane's.`,
    },

    "Kadane's Algorithm": {
      intuition: `Walk through the array once, maintaining a "current subarray sum". At each element, decide: is it better to extend the existing subarray (add this element) or start a brand new subarray here? If the current sum is negative, starting fresh is always better. Track the best sum seen at any point.`,
      steps: [
        `Initialize currentSum = nums[0], maxSum = nums[0].`,
        `Loop i from 1 to n-1.`,
        `currentSum = max(nums[i], currentSum + nums[i]).`,
        `  (This is "start fresh if negative, else extend")`,
        `maxSum = max(maxSum, currentSum).`,
        `Return maxSum.`,
      ],
      example: `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n\ni=0: cur=-2,  max=-2\ni=1: cur=max(1,-2+1)=1,   max=1\ni=2: cur=max(-3,1-3)=-2,  max=1\ni=3: cur=max(4,-2+4)=4,   max=4\ni=4: cur=max(-1,4-1)=3,   max=4\ni=5: cur=max(2,3+2)=5,    max=5\ni=6: cur=max(1,5+1)=6,    max=6\ni=7: cur=max(-5,6-5)=1,   max=6\ni=8: cur=max(4,1+4)=5,    max=6\n✅ Answer: 6`,
      keyInsight: `O(n) time, O(1) space — optimal. One of the most elegant algorithms in computer science. The decision at each step (extend or restart) is greedy and provably correct.`,
    },

    "Kadane's with Subarray Indices": {
      intuition: `Same as Kadane's, but also track where the best subarray starts and ends. Whenever we restart (current sum was negative), record the new start index. Whenever we update the global max, record the current start and end indices.`,
      steps: [
        `Initialize currentSum = nums[0], maxSum = nums[0].`,
        `Track start=0, end=0, tempStart=0.`,
        `Loop i from 1 to n-1:`,
        `  If currentSum < 0: currentSum = nums[i], tempStart = i (restart here).`,
        `  Else: currentSum += nums[i].`,
        `  If currentSum > maxSum: maxSum = currentSum, start = tempStart, end = i.`,
        `Return maxSum (and optionally nums[start..end]).`,
      ],
      example: `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n\ni=1: cur<0→restart, cur=1, tempStart=1, maxSum=1, start=1,end=1\ni=2: cur=1-3=-2, maxSum still 1\ni=3: cur<0→restart, cur=4, tempStart=3, maxSum=4, start=3,end=3\ni=4: cur=3, maxSum=4\ni=5: cur=5, maxSum=5, start=3,end=5\ni=6: cur=6, maxSum=6, start=3,end=6\n...\n✅ Subarray: nums[3..6] = [4,-1,2,1], sum=6`,
      keyInsight: `Same O(n) time, O(1) space as Kadane's but records the actual subarray. Useful when you need to return the subarray itself, not just the sum.`,
    },

    'Divide and Conquer': {
      intuition: `Split the array in half recursively. The maximum subarray either lives entirely in the left half, entirely in the right half, or crosses the midpoint. The crossing case is handled by expanding outward from the midpoint in both directions and summing the best halves. Combine the three candidates and return the max.`,
      steps: [
        `Base case: if left == right, return nums[left].`,
        `Compute mid = left + (right - left) / 2.`,
        `Recursively find maxLeft = solve(nums, left, mid) and maxRight = solve(nums, mid+1, right).`,
        `Compute crossMax: expand left from mid and right from mid+1, accumulating sums, track best each direction.`,
        `Return max(maxLeft, maxRight, crossMax).`,
      ],
      example: `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nmid = 4 (value -1)\n\nLeft half [-2,1,-3,4,-1]: recursion → 4\nRight half [2,1,-5,4]: recursion → 3\nCross: expand left from mid=4: -1,(-1+4)=3,(3-3)=0... best=3\n       expand right from mid+1=5: 2,(2+1)=3... best=3\n       crossMax = 3+3 = 6 ← wins!\n✅ Answer: 6`,
      keyInsight: `O(n log n) time, O(log n) stack space. Elegant divide-and-conquer but strictly worse than Kadane's O(n). Valuable academically to demonstrate the paradigm.`,
    },
  },
}
