/**
 * Tutorial content for #005 — Product of Array Except Self
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an integer array, return a new array where each element at index i is the product of all elements in the original array except the one at index i. You must not use division, and the solution should run in O(n) time.`,
    example: `nums = [1, 2, 3, 4]\n→ result[0] = 2×3×4 = 24\n→ result[1] = 1×3×4 = 12\n→ result[2] = 1×2×4 = 8\n→ result[3] = 1×2×3 = 6\n✅ Answer: [24, 12, 8, 6]`,
    keyInsight: `For each position, the answer is (product of everything to the left) × (product of everything to the right). Compute these two products in two separate passes.`,
  },

  approaches: {
    'Brute Force': {
      intuition: `For each element, loop through the entire array and multiply all the other elements together. Skip the current index. Easy to understand but does a lot of repeated multiplication.`,
      steps: [
        `Create a result array of the same size.`,
        `Outer loop i from 0 to n-1.`,
        `Inner loop j from 0 to n-1: multiply all nums[j] where j ≠ i.`,
        `Store the product in result[i].`,
        `Return the result array.`,
      ],
      example: `nums = [1, 2, 3, 4]\n\ni=0: skip 0 → 2×3×4 = 24\ni=1: skip 1 → 1×3×4 = 12\ni=2: skip 2 → 1×2×4 = 8\ni=3: skip 3 → 1×2×3 = 6\n✅ Answer: [24, 12, 8, 6]`,
      keyInsight: `O(n²) time, O(1) extra space (ignoring output). Too slow for large arrays — for n=100,000 this is 10 billion multiplications.`,
    },

    'Division': {
      intuition: `Compute the total product of all elements, then divide by each element to get the "product of everything except self". This is simple and O(n), but the problem forbids division — and it also fails when any element is zero.`,
      steps: [
        `Compute totalProduct = product of all non-zero elements. Count zeros.`,
        `If there are 2+ zeros, every result is 0.`,
        `If there is exactly 1 zero, only the position of the zero gets a non-zero result.`,
        `If no zeros, result[i] = totalProduct / nums[i].`,
        `Return the result.`,
      ],
      example: `nums = [1, 2, 3, 4]\ntotalProduct = 1×2×3×4 = 24\n\nresult[0] = 24/1 = 24\nresult[1] = 24/2 = 12\nresult[2] = 24/3 = 8\nresult[3] = 24/4 = 6\n✅ Answer: [24, 12, 8, 6]\n\n(But nums=[1,0,3,4] would fail with plain division!)`,
      keyInsight: `O(n) time, O(1) extra space. Simple but requires careful zero-handling. Not allowed in the problem constraints — shown here to contrast with the preferred approach.`,
    },

    'Prefix + Suffix Arrays': {
      intuition: `Build two arrays: prefix[i] = product of all elements before index i, and suffix[i] = product of all elements after index i. The answer at each position is just prefix[i] × suffix[i]. Three clean passes over the array.`,
      steps: [
        `Build prefix[]: prefix[0]=1; for i≥1: prefix[i] = prefix[i-1] * nums[i-1].`,
        `Build suffix[]: suffix[n-1]=1; for i<n-1 going right-to-left: suffix[i] = suffix[i+1] * nums[i+1].`,
        `Build result[]: result[i] = prefix[i] * suffix[i].`,
        `Return result.`,
      ],
      example: `nums   = [1,  2,  3,  4]\nprefix = [1,  1,  2,  6]   (products before each index)\nsuffix = [24, 12, 4,  1]   (products after each index)\n\nresult[0] = 1  × 24 = 24\nresult[1] = 1  × 12 = 12\nresult[2] = 2  ×  4 = 8\nresult[3] = 6  ×  1 = 6\n✅ Answer: [24, 12, 8, 6]`,
      keyInsight: `O(n) time, O(n) space (two helper arrays). Very readable — the prefix/suffix pattern appears in many other problems so it's worth mastering.`,
    },

    'Optimized Space': {
      intuition: `Instead of two separate arrays, use the output array itself to store prefix products in the first pass, then multiply in the suffix products in a single reverse pass using just one running variable. This eliminates the need for the suffix array.`,
      steps: [
        `Initialize result[0]=1. Forward pass: result[i] = result[i-1] * nums[i-1] (prefix products in-place).`,
        `Initialize suffix=1. Reverse pass from i=n-1 down to 0:`,
        `  result[i] *= suffix  (multiply in the suffix product).`,
        `  suffix *= nums[i]    (extend the running suffix product).`,
        `Return result.`,
      ],
      example: `nums = [1, 2, 3, 4]\n\nForward (prefix into result):\nresult = [1, 1, 2, 6]\n\nReverse (multiply suffix in):\nsuffix=1\ni=3: result[3]=6*1=6,  suffix=1*4=4\ni=2: result[2]=2*4=8,  suffix=4*3=12\ni=1: result[1]=1*12=12, suffix=12*2=24\ni=0: result[0]=1*24=24, suffix=24*1=24\n✅ Answer: [24, 12, 8, 6]`,
      keyInsight: `O(n) time, O(1) extra space (only the output array). This is the interview-optimal answer — same logic as prefix+suffix but cleverly reuses the output array to cut space in half.`,
    },
  },
}
