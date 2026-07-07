/**
 * Tutorial content for #001 — Two Sum
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an array of integers and a target number, find two numbers in the array that add up to the target and return their indices. You can assume there is exactly one solution, and you may not use the same element twice.`,
    example: `nums = [2, 7, 11, 15], target = 9\n→ nums[0] + nums[1] = 2 + 7 = 9\n✅ Answer: [0, 1]`,
    keyInsight: `For each number x, the number you need to pair with it is exactly (target - x). If you can look that up instantly, you're done in one pass.`,
  },

  approaches: {
    'Brute Force': {
      intuition: `Try every pair of numbers and check if they add up to the target. Use two nested loops: the outer loop picks the first number, the inner loop tries every number after it as the second. Simple to understand, but slow for large arrays.`,
      steps: [
        `Loop i from 0 to n-2 (outer loop picks the first element).`,
        `Loop j from i+1 to n-1 (inner loop picks every subsequent element).`,
        `Check if nums[i] + nums[j] == target.`,
        `If yes, return [i, j] immediately.`,
        `If no pair is found after all loops, return [] (problem guarantees a solution exists).`,
      ],
      example: `nums = [2, 7, 11, 15], target = 9\n\ni=0, j=1: 2+7=9  ✅ → return [0, 1]\n\n(We got lucky early — worst case checks all pairs)`,
      keyInsight: `O(n²) time, O(1) space. Simple but too slow for large inputs — with n=10,000 you'd do 50 million comparisons.`,
    },

    'Hash Map (One Pass)': {
      intuition: `As you walk through the array, for each number you ask: "Have I already seen the number I need to pair with this one?" Store every number you've visited in a hash map so you can answer that question in O(1). If the complement is there, you're done — otherwise record the current number and move on.`,
      steps: [
        `Create an empty hash map (number → index).`,
        `Loop through the array with index i.`,
        `Calculate complement = target - nums[i].`,
        `Check if complement is already in the map.`,
        `If yes, return [map.get(complement), i].`,
        `If no, put nums[i] → i into the map and continue.`,
      ],
      example: `nums = [2, 7, 11, 15], target = 9\n\ni=0: complement=7, map={} → not found → map={2:0}\ni=1: complement=2, map={2:0} → FOUND at index 0\n✅ Answer: [0, 1]`,
      keyInsight: `O(n) time, O(n) space. The hash map trades memory for speed — each number is visited exactly once. This is the gold-standard interview answer.`,
    },

    'Two Pointers (Sorted copy)': {
      intuition: `If you sort the array, you can use two pointers — one at each end — and squeeze them toward the middle. If the sum is too big, move the right pointer left; if too small, move the left pointer right. The catch: sorting scrambles indices, so you must save the original indices before sorting.`,
      steps: [
        `Create a copy of the array paired with original indices: [(value, index), ...].`,
        `Sort the copy by value.`,
        `Set left = 0, right = n-1.`,
        `While left < right: compute sum = copy[left].value + copy[right].value.`,
        `If sum == target, return [copy[left].index, copy[right].index].`,
        `If sum < target, move left pointer right (need bigger number).`,
        `If sum > target, move right pointer left (need smaller number).`,
      ],
      example: `nums = [2, 7, 11, 15], target = 9\nSorted copy: [(2,0),(7,1),(11,2),(15,3)]\n\nleft=0, right=3: 2+15=17 > 9 → right--\nleft=0, right=2: 2+11=13 > 9 → right--\nleft=0, right=1: 2+7=9 ✅ → return [0, 1]`,
      keyInsight: `O(n log n) time (dominated by sort), O(n) space for the copy. Slower than Hash Map, but shows off two-pointer technique which is reused in many problems.`,
    },
  },
}
