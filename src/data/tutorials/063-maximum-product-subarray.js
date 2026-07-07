/**
 * Tutorial content for #063 — Maximum Product Subarray
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Find the contiguous subarray within an integer array that has the largest product, and return that product. The array can contain negative numbers and zeros.`,
    example: `nums = [2, 3, -2, 4]\n→ Subarray [2, 3] has product 6\n✅ Answer: 6`,
    keyInsight: `A negative number flips the sign of the product, so you need to track BOTH the current maximum and the current minimum. A negative max times a negative number becomes a new max!`,
  },

  approaches: {
    'Brute Force': {
      intuition: `Try every possible subarray by fixing a start index and extending to every end index. Multiply as you go, updating the global maximum. Simple but slow.`,
      steps: [
        `Set result = nums[0].`,
        `For i from 0 to n-1:`,
        `  Set product = 1.`,
        `  For j from i to n-1:`,
        `    product *= nums[j].`,
        `    result = max(result, product).`,
        `Return result.`,
      ],
      example: `nums = [2, 3, -2, 4]\n\ni=0: [2]=2, [2,3]=6, [2,3,-2]=-12, [2,3,-2,4]=-48\ni=1: [3]=3, [3,-2]=-6, [3,-2,4]=-24\ni=2: [-2]=-2, [-2,4]=-8\ni=3: [4]=4\nmax = 6\n✅ Answer: 6`,
      keyInsight: `O(n²) time, O(1) space. Easy to implement but inefficient for large arrays — use DP approaches instead.`,
    },

    'DP tracking min and max': {
      intuition: `Scan through the array maintaining curMax (largest product ending here) and curMin (smallest product ending here). At each step, the new max is the largest of: just nums[i], extending the old max, or extending the old min (in case nums[i] is negative). Update the global answer with curMax.`,
      steps: [
        `Set curMax = nums[0], curMin = nums[0], result = nums[0].`,
        `For i from 1 to n-1:`,
        `  Let temp = curMax.`,
        `  curMax = max(nums[i], nums[i]*curMax, nums[i]*curMin).`,
        `  curMin = min(nums[i], nums[i]*temp,  nums[i]*curMin).`,
        `  result = max(result, curMax).`,
        `Return result.`,
      ],
      example: `nums = [2, 3, -2, 4]\n\ncurMax=2, curMin=2, res=2\ni=1 (3): curMax=max(3,6,6)=6; curMin=min(3,6,6)=3; res=6\ni=2 (-2): curMax=max(-2,-12,-6)=-2; curMin=min(-2,-12,-6)=-12; res=6\ni=3 (4): curMax=max(4,-8,-48)=4; curMin=min(4,-8,-48)=-48; res=6\n✅ Answer: 6`,
      keyInsight: `O(n) time, O(1) space. The simultaneous min/max tracking is the key insight — it handles negative×negative flips automatically.`,
    },

    'Kadane Variant (swap on negative)': {
      intuition: `Similar to tracking min/max, but expressed differently: when the current number is negative, swap curMax and curMin before multiplying. A negative number turns the maximum into the minimum and vice versa, so the swap makes the recurrence symmetric.`,
      steps: [
        `Set curMax = nums[0], curMin = nums[0], result = nums[0].`,
        `For i from 1 to n-1:`,
        `  If nums[i] < 0: swap(curMax, curMin).`,
        `  curMax = max(nums[i], nums[i] * curMax).`,
        `  curMin = min(nums[i], nums[i] * curMin).`,
        `  result = max(result, curMax).`,
        `Return result.`,
      ],
      example: `nums = [2, 3, -2, 4]\n\ncurMax=2, curMin=2, res=2\ni=1 (3 > 0): curMax=max(3,6)=6; curMin=min(3,6)=3; res=6\ni=2 (-2 < 0): swap → curMax=3,curMin=6\n  curMax=max(-2,-6)=-2; curMin=min(-2,-12)=-12; res=6\ni=3 (4 > 0): curMax=max(4,-8)=4; curMin=min(4,-48)=-48; res=6\n✅ Answer: 6`,
      keyInsight: `O(n) time, O(1) space. The swap trick is a clean alternative formulation — mathematically equivalent to the explicit three-way max/min.`,
    },

    'Two-Pass (Left→Right and Right→Left)': {
      intuition: `Scan the array twice — once left-to-right and once right-to-left — computing the running product both ways. Reset to 1 whenever you hit a zero. The maximum product subarray is captured in one of the two directions because negatives are "cancelled" by reversing direction.`,
      steps: [
        `Set result = max of all elements (handles single-element arrays).`,
        `Forward pass: product = 1; for each num: product *= num; result = max(result, product); if product == 0, reset product = 1.`,
        `Backward pass: product = 1; for each num in reverse: product *= num; result = max(result, product); if product == 0, reset product = 1.`,
        `Return result.`,
      ],
      example: `nums = [2, 3, -2, 4]\n\nForward:  2→6→-12→-48; max so far=6\nBackward: 4→-8→-24→-48; max so far=6\nBoth passes give 6\n✅ Answer: 6`,
      keyInsight: `O(n) time, O(1) space. An elegant observation: if there are an even number of negatives in a subarray, the full array (or sub-segment between zeros) is the maximum. The two-pass trick finds this without explicit counting.`,
    },

    'Divide by Zeros': {
      intuition: `Zeros divide the array into independent segments — any subarray crossing a zero has product zero. Split the array at every zero, solve each segment independently (product of all positives and an even number of negatives wins), and return the best result.`,
      steps: [
        `Split nums into segments at every 0.`,
        `For each segment: compute prefix products and suffix products.`,
        `The max product in a segment is max(all prefix products, all suffix products).`,
        `Return the overall maximum across all segments.`,
      ],
      example: `nums = [2, 3, -2, 4]\nNo zeros, one segment: [2,3,-2,4]\nPrefix products: 2, 6, -12, -48\nSuffix products: -48, -24, -8, 4\nMax = 6\n✅ Answer: 6`,
      keyInsight: `O(n) time, O(1) space. More conceptual overhead than the min/max DP approach, but clarifies why zeros are boundary markers and why the two-pass method works.`,
    },
  },
}
