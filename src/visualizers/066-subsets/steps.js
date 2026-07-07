// 066 — Subsets · steps.js
// Backtracking: at each index either include or exclude the element

// line indices:
// 0: function subsets(nums):
// 1:   result = []; current = []
// 2:   function backtrack(start):
// 3:     result.push([...current])
// 4:     for i = start to n-1:
// 5:       current.push(nums[i])
// 6:       backtrack(i + 1)
// 7:       current.pop()  // backtrack
// 8:   backtrack(0)
// 9:   return result

function push(steps, desc, current, result, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, current: [...current], result: result.map(r => [...r]), highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(nums) {
  const steps = []
  const n = nums.length
  const current = []
  const result = []
  const highlights = {}

  push(steps,
    `Subsets: nums=[${nums.join(', ')}]. Backtrack: at each step, either include or skip each element. Every node in the recursion tree is a valid subset.`,
    current, result, {}, 0
  )

  function backtrack(start) {
    result.push([...current])
    for (let i = 0; i < n; i++) highlights[i] = highlights[i] || 'done'
    push(steps,
      `Add subset [${current.join(', ')}] to results. Results so far: ${result.length}.`,
      current, result, { ...highlights }, 3
    )

    for (let i = start; i < n; i++) {
      highlights[i] = 'current'
      current.push(nums[i])
      push(steps,
        `Include nums[${i}]=${nums[i]}. Current: [${current.join(', ')}]. Recurse from index ${i+1}.`,
        current, result, { ...highlights }, 5
      )
      highlights[i] = 'compare'
      backtrack(i + 1)
      current.pop()
      highlights[i] = 'match'
      push(steps,
        `Backtrack: remove nums[${i}]=${nums[i]}. Current: [${current.join(', ')}].`,
        current, result, { ...highlights }, 7
      )
    }
  }

  backtrack(0)

  push(steps,
    `All ${result.length} subsets found: ${result.map(s => '['+s.join(',')+']').join(', ')}.`,
    current, result, { ...highlights }, 9, { done: true }
  )
  return steps
}
