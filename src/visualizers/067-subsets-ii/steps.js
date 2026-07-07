// 067 — Subsets II · steps.js
// Like Subsets but nums may have duplicates — sort first, skip duplicates at same level

// line indices:
// 0: function subsetsWithDup(nums):
// 1:   sort(nums)
// 2:   result = []; current = []
// 3:   function backtrack(start):
// 4:     result.push([...current])
// 5:     for i = start to n-1:
// 6:       if i > start and nums[i] == nums[i-1]: continue  // skip dup
// 7:       current.push(nums[i])
// 8:       backtrack(i + 1)
// 9:       current.pop()
// 10:  backtrack(0)

function push(steps, desc, current, result, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, current: [...current], result: result.map(r => [...r]), highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(numsRaw) {
  const steps = []
  const nums = [...numsRaw].sort((a, b) => a - b)
  const n = nums.length
  const current = []
  const result = []
  const highlights = {}

  push(steps,
    `Subsets II: nums=[${numsRaw.join(', ')}] → sorted=[${nums.join(', ')}]. Skip duplicates at the same recursion level.`,
    current, result, {}, 1
  )

  function backtrack(start) {
    result.push([...current])
    push(steps,
      `Add subset [${current.join(', ')}] to results. Count: ${result.length}.`,
      current, result, { ...highlights }, 4
    )

    for (let i = start; i < n; i++) {
      if (i > start && nums[i] === nums[i - 1]) {
        highlights[i] = 'discard'
        push(steps,
          `Skip nums[${i}]=${nums[i]}: duplicate at same level (nums[${i-1}]=${nums[i-1]}).`,
          current, result, { ...highlights }, 6
        )
        continue
      }
      highlights[i] = 'current'
      current.push(nums[i])
      push(steps,
        `Include nums[${i}]=${nums[i]}. Current: [${current.join(', ')}].`,
        current, result, { ...highlights }, 7
      )
      highlights[i] = 'compare'
      backtrack(i + 1)
      current.pop()
      highlights[i] = 'match'
      push(steps,
        `Backtrack: remove nums[${i}]=${nums[i]}. Current: [${current.join(', ')}].`,
        current, result, { ...highlights }, 9
      )
    }
  }

  backtrack(0)
  push(steps,
    `All ${result.length} unique subsets found: ${result.map(s => '['+s.join(',')+']').join(', ')}.`,
    current, result, { ...highlights }, 10, { done: true }
  )
  return steps
}
