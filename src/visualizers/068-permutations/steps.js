// 068 — Permutations · steps.js
// Backtracking: swap elements in-place to generate all permutations

// line indices:
// 0: function permute(nums):
// 1:   result = []
// 2:   function backtrack(start):
// 3:     if start == n: result.push([...nums]); return
// 4:     for i = start to n-1:
// 5:       swap(nums[start], nums[i])
// 6:       backtrack(start + 1)
// 7:       swap(nums[start], nums[i])  // restore
// 8:   backtrack(0)
// 9:   return result

function push(steps, desc, nums, result, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, current: [...nums], result: result.map(r => [...r]), highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(numsInit) {
  const steps = []
  const nums = [...numsInit]
  const n = nums.length
  const result = []
  const highlights = {}

  push(steps,
    `Permutations: nums=[${nums.join(', ')}]. Backtrack by swapping elements into the "fixed" prefix position. Every arrangement of n numbers is generated.`,
    nums, result, {}, 0
  )

  function backtrack(start) {
    if (start === n) {
      result.push([...nums])
      for (let i = 0; i < n; i++) highlights[i] = 'match'
      push(steps,
        `Full permutation found: [${nums.join(', ')}]. Total so far: ${result.length}.`,
        nums, result, { ...highlights }, 3
      )
      return
    }

    for (let i = start; i < n; i++) {
      // swap
      highlights[start] = 'current'; highlights[i] = 'compare'
      push(steps,
        `start=${start}: swap nums[${start}]=${nums[start]} ↔ nums[${i}]=${nums[i]}. Array: [${[...nums.slice(0, start), nums[i], ...nums.slice(start + 1, i), nums[start], ...nums.slice(i + 1)].join(', ')}].`,
        nums, result, { ...highlights }, 5
      );
      [nums[start], nums[i]] = [nums[i], nums[start]]
      highlights[start] = 'compare'
      push(steps,
        `After swap: [${nums.join(', ')}]. Recurse with start=${start + 1}.`,
        nums, result, { ...highlights }, 6
      )
      backtrack(start + 1)
      // restore
      ;[nums[start], nums[i]] = [nums[i], nums[start]]
      highlights[start] = 'done'; highlights[i] = 'done'
      push(steps,
        `Restore swap: nums[${start}] ↔ nums[${i}]. Array: [${nums.join(', ')}].`,
        nums, result, { ...highlights }, 7
      )
    }
  }

  backtrack(0)
  push(steps,
    `All ${result.length} permutations: ${result.map(p => '['+p.join(',')+']').join(', ')}.`,
    nums, result, { ...highlights }, 9, { done: true }
  )
  return steps
}
