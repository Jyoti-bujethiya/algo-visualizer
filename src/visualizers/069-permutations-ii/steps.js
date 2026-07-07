// 069 — Permutations II · steps.js
// Like Permutations but with possible duplicate numbers → sort + visited set

// line indices:
// 0: function permuteUnique(nums):
// 1:   sort(nums); result = []; used = []
// 2:   function backtrack(current):
// 3:     if current.length == n: result.push([...current])
// 4:     for i = 0 to n-1:
// 5:       if used[i]: continue
// 6:       if i > 0 and nums[i]==nums[i-1] and !used[i-1]: continue  // skip dup
// 7:       used[i] = true; current.push(nums[i])
// 8:       backtrack(current)
// 9:       used[i] = false; current.pop()
// 10:  backtrack([])

function push(steps, desc, current, result, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, current: [...current], result: result.map(r => [...r]), highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(numsRaw) {
  const steps = []
  const nums = [...numsRaw].sort((a, b) => a - b)
  const n = nums.length
  const result = []
  const used = new Array(n).fill(false)
  const highlights = {}

  push(steps,
    `Permutations II: nums=[${numsRaw.join(', ')}] → sorted=[${nums.join(', ')}]. Skip duplicate choices at the same level using sort + visited array.`,
    [], result, {}, 1
  )

  function backtrack(current) {
    if (current.length === n) {
      result.push([...current])
      for (let i = 0; i < n; i++) highlights[i] = 'match'
      push(steps,
        `Permutation found: [${current.join(', ')}]. Total: ${result.length}.`,
        current, result, { ...highlights }, 3
      )
      return
    }

    for (let i = 0; i < n; i++) {
      if (used[i]) { continue }
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
        highlights[i] = 'discard'
        push(steps,
          `Skip i=${i} (nums[${i}]=${nums[i]}): duplicate of nums[${i-1}]=${nums[i-1]} at same level.`,
          current, result, { ...highlights }, 6
        )
        continue
      }
      used[i] = true
      highlights[i] = 'current'
      current.push(nums[i])
      push(steps,
        `Use nums[${i}]=${nums[i]}. Current: [${current.join(', ')}].`,
        current, result, { ...highlights }, 7
      )
      highlights[i] = 'compare'
      backtrack(current)
      used[i] = false
      current.pop()
      highlights[i] = 'done'
      push(steps,
        `Unuse nums[${i}]=${nums[i]}. Current: [${current.join(', ')}].`,
        current, result, { ...highlights }, 9
      )
    }
  }

  backtrack([])
  push(steps,
    `All ${result.length} unique permutations generated.`,
    [], result, { ...highlights }, 10, { done: true }
  )
  return steps
}
