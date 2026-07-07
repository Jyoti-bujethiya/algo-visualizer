/**
 * Tutorial content for #002 — Three Sum
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an integer array, find all unique triplets (three numbers at different positions) that add up to zero. The answer must not contain duplicate triplets.`,
    example: `nums = [-1, 0, 1, 2, -1, -4]\n→ [-1, -1, 2] and [-1, 0, 1] both sum to 0\n✅ Answer: [[-1, -1, 2], [-1, 0, 1]]`,
    keyInsight: `Fix one number, then use Two Sum on the rest of the array. Sorting first lets you skip duplicates and use the two-pointer technique efficiently.`,
  },

  approaches: {
    'Brute Force': {
      intuition: `Try every combination of three numbers with three nested loops. For each triplet that sums to zero, add it to the result set. Use a set to automatically avoid duplicate triplets. Very straightforward but extremely slow.`,
      steps: [
        `Sort the array (needed to deduplicate results consistently).`,
        `Use three nested loops: i from 0 to n-3, j from i+1 to n-2, k from j+1 to n-1.`,
        `Check if nums[i] + nums[j] + nums[k] == 0.`,
        `If yes, add the sorted triplet [nums[i], nums[j], nums[k]] to a result set.`,
        `Convert the set to a list and return it.`,
      ],
      example: `nums = [-4, -1, -1, 0, 1, 2] (sorted)\n\ni=0(-4), j=1(-1), k=2(-1): -4-1-1=-6 ✗\n...\ni=1(-1), j=2(-1), k=5(2): -1-1+2=0 ✅ add [-1,-1,2]\ni=1(-1), j=3(0),  k=4(1): -1+0+1=0 ✅ add [-1,0,1]\n...\n✅ Answer: [[-1,-1,2],[-1,0,1]]`,
      keyInsight: `O(n³) time, O(n) space for the result set. Fine for n ≤ 100, but far too slow for real inputs. The set handles duplicate triplets but not duplicate work.`,
    },

    'HashMap': {
      intuition: `Fix the first two numbers with two loops, then use a hash set to check if the third number (0 - first - second) exists in the array. Store seen values in a set to handle duplicates. This avoids the third loop but still requires careful duplicate management.`,
      steps: [
        `Sort the array to make duplicate skipping easier.`,
        `Outer loop: fix nums[i], skip if it equals the previous value.`,
        `Inner loop: fix nums[j] for j > i, skip duplicates similarly.`,
        `Compute need = 0 - nums[i] - nums[j].`,
        `Check if need exists in a hash set built from nums[j+1..n-1].`,
        `If found, add [nums[i], nums[j], need] to results.`,
      ],
      example: `nums = [-4, -1, -1, 0, 1, 2] (sorted)\n\ni=0(-4): skip (no valid j)\ni=1(-1):\n  j=2(-1): need=0-(-1)-(-1)=2, set has 2 ✅ add [-1,-1,2]\n  j=3(0):  need=0-(-1)-0=1,  set has 1 ✅ add [-1,0,1]\ni=2(-1): same as i=1 → skip duplicate\n✅ Answer: [[-1,-1,2],[-1,0,1]]`,
      keyInsight: `O(n²) time, O(n) space for the inner hash set. Better than brute force but more complex to implement than two pointers — mostly a stepping stone.`,
    },

    'Two Pointers': {
      intuition: `Sort the array, then fix one number at a time with the outer loop. For the remaining two numbers, use the two-pointer technique: one pointer at the start and one at the end of the remaining subarray. Move them inward based on whether the sum is too big or too small.`,
      steps: [
        `Sort the array.`,
        `Loop i from 0 to n-3. If nums[i] > 0, break (can't sum to zero with positives).`,
        `Skip i if nums[i] == nums[i-1] (duplicate first element).`,
        `Set left = i+1, right = n-1.`,
        `While left < right: compute sum = nums[i] + nums[left] + nums[right].`,
        `If sum == 0: record triplet, skip duplicate left values, skip duplicate right values, move both pointers.`,
        `If sum < 0: left++ (need larger). If sum > 0: right-- (need smaller).`,
      ],
      example: `nums = [-4, -1, -1, 0, 1, 2] (sorted)\n\ni=0(-4): left=1, right=5 → -4-1+2=-3<0→left++\n         left=2, right=5 → -4-1+2=-3<0→left++\n         ... no triplet\ni=1(-1): left=2, right=5 → -1-1+2=0 ✅ [-1,-1,2]\n         skip dup left, left=3, right=4\n         -1+0+1=0 ✅ [-1,0,1]\ni=2(-1): dup of i=1 → skip\n✅ Answer: [[-1,-1,2],[-1,0,1]]`,
      keyInsight: `O(n²) time, O(1) extra space (ignoring output). This is the classic optimal solution — sorting costs O(n log n) but the two-pointer inner pass is O(n) per fixed element.`,
    },

    'Optimized Two Pointers': {
      intuition: `Same two-pointer idea but with extra early-exit conditions. If the smallest possible sum with the current i is already > 0 (nums[i]+nums[i+1]+nums[i+2] > 0), every triplet from here will also be too big, so break entirely. If the largest possible sum with the current i is < 0 (nums[i]+nums[n-2]+nums[n-1] < 0), this i can never contribute, so skip it.`,
      steps: [
        `Sort the array.`,
        `Loop i from 0 to n-3. Skip duplicate nums[i].`,
        `Early break: if nums[i] + nums[i+1] + nums[i+2] > 0, all future triplets also > 0 → break.`,
        `Early continue: if nums[i] + nums[n-2] + nums[n-1] < 0, this i can't reach 0 → continue.`,
        `Set left = i+1, right = n-1 and run the standard two-pointer loop.`,
        `On match: record triplet, skip duplicates, advance both pointers.`,
        `On sum < 0: left++. On sum > 0: right--.`,
      ],
      example: `nums = [-4, -1, -1, 0, 1, 2] (sorted, n=6)\n\ni=0(-4): min sum=-4-1-1=-6<0, max=-4+1+2=-1<0 → skip (continue)\ni=1(-1): min=-1-1+0=-2<0 ✓, max=-1+1+2=2>0 ✓\n  left=2,right=5: -1-1+2=0 ✅, left=3,right=4: -1+0+1=0 ✅\ni=2(-1): duplicate → skip\n✅ Answer: [[-1,-1,2],[-1,0,1]]`,
      keyInsight: `Same O(n²) worst case, but the early break/continue prune large portions of the search space in practice, making it much faster on typical inputs.`,
    },
  },
}
