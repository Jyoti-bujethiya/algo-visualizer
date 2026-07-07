// 063 — Maximum Product Subarray · steps.js
// Track maxProd, minProd at each index (negatives flip sign)
// result = max seen

// line indices:
// 0: function maxProduct(nums):
// 1:   maxP = minP = result = nums[0]
// 2:   for i = 1 to n-1:
// 3:     if nums[i] < 0: swap(maxP, minP)
// 4:     maxP = max(nums[i], maxP * nums[i])
// 5:     minP = min(nums[i], minP * nums[i])
// 6:     result = max(result, maxP)
// 7:   return result

function push(steps, desc, dpMax, dpMin, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, dpMax: [...dpMax], dpMin: [...dpMin], highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(nums) {
  const steps = []
  const n = nums.length
  const dpMax = new Array(n).fill(null)
  const dpMin = new Array(n).fill(null)
  const highlights = {}

  dpMax[0] = nums[0]; dpMin[0] = nums[0]
  highlights['0'] = 'special'

  push(steps,
    `Max Product Subarray: nums=[${nums.join(', ')}]. At each index track both maxProd and minProd (negatives can flip to become max). Start: maxP=minP=nums[0]=${nums[0]}.`,
    dpMax, dpMin, { ...highlights }, 1, { result: nums[0] }
  )

  let maxP = nums[0], minP = nums[0], result = nums[0]

  for (let i = 1; i < n; i++) {
    highlights[String(i)] = 'current'
    const v = nums[i]

    if (v < 0) {
      push(steps,
        `i=${i}: nums[i]=${v} < 0 → swap maxP ↔ minP. maxP was ${maxP}, minP was ${minP}.`,
        dpMax, dpMin, { ...highlights }, 3
      );
      [maxP, minP] = [minP, maxP]
    }

    push(steps,
      `i=${i}: maxP = max(${v}, ${maxP}×${v}=${maxP*v}) = ${Math.max(v, maxP * v)}.  minP = min(${v}, ${minP}×${v}=${minP*v}) = ${Math.min(v, minP * v)}.`,
      dpMax, dpMin, { ...highlights }, 4
    )

    maxP = Math.max(v, maxP * v)
    minP = Math.min(v, minP * v)
    dpMax[i] = maxP
    dpMin[i] = minP
    result = Math.max(result, maxP)

    highlights[String(i)] = maxP === result ? 'match' : 'done'
    push(steps,
      `maxP=${maxP}, minP=${minP}. result so far = ${result}.`,
      dpMax, dpMin, { ...highlights }, 6, { result }
    )
  }

  push(steps,
    `Maximum product subarray = ${result}.`,
    dpMax, dpMin, { ...highlights }, 7, { result, done: true }
  )
  return steps
}
