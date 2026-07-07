// 053 — House Robber II · steps.js
// Houses arranged in a circle. Cannot rob first and last simultaneously.
// Solution: max of rob(0..n-2) and rob(1..n-1)

// line indices:
// 0: function rob(nums):
// 1:   if n == 1: return nums[0]
// 2:   return max(robRange(0, n-2), robRange(1, n-1))
// 3: function robRange(start, end):
// 4:   prev2 = 0; prev1 = 0
// 5:   for i = start to end:
// 6:     curr = max(prev1, prev2 + nums[i])
// 7:     prev2 = prev1; prev1 = curr
// 8:   return prev1

function push(steps, desc, dpA, dpB, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, dpA: [...dpA], dpB: [...dpB], highlights: { ...highlights }, codeLineIndex, ...extra })
}

function robRange(nums, start, end, tag, dpArr, steps, highlights) {
  let prev2 = 0, prev1 = 0
  for (let i = start; i <= end; i++) {
    const idx = i - start
    highlights[`${tag}${idx}`] = 'current'
    const prev = push // capture
    void prev
    const curr = Math.max(prev1, prev2 + nums[i])
    dpArr[idx] = curr
    steps.push({
      description: `${tag === 'A' ? 'Range 0→n-2' : 'Range 1→n-1'}: house ${i}, nums[${i}]=${nums[i]}. max(${prev1}, ${prev2}+${nums[i]}) = ${curr}.`,
      dpA: tag === 'A' ? [...dpArr] : steps[steps.length - 1]?.dpA ?? [],
      dpB: tag === 'B' ? [...dpArr] : steps[steps.length - 1]?.dpB ?? [],
      highlights: { ...highlights },
      codeLineIndex: 6,
    })
    highlights[`${tag}${idx}`] = 'match'
    prev2 = prev1
    prev1 = curr
  }
  return prev1
}

export function generateSteps(nums) {
  const steps = []
  const n = nums.length
  const highlights = {}

  steps.push({
    description: `House Robber II: ${n} houses in a CIRCLE [${nums.join(', ')}]. Cannot rob adjacent or first+last. Split into two sub-problems: rob 0→n-2, rob 1→n-1.`,
    dpA: new Array(n - 1).fill(null),
    dpB: new Array(n - 1).fill(null),
    highlights: {},
    codeLineIndex: 0,
  })

  if (n === 1) {
    steps.push({ description: 'Only 1 house — return nums[0].', dpA: [nums[0]], dpB: [], highlights: {}, codeLineIndex: 1, result: nums[0], done: true })
    return steps
  }

  const dpA = new Array(n - 1).fill(null)
  const dpB = new Array(n - 1).fill(null)

  steps.push({
    description: `Sub-problem A: rob houses 0 to ${n-2} (exclude last house).`,
    dpA: [...dpA], dpB: [...dpB], highlights: { ...highlights }, codeLineIndex: 3,
  })

  const resA = robRange(nums, 0, n - 2, 'A', dpA, steps, highlights)

  steps.push({
    description: `Sub-problem A result = ${resA}. Now sub-problem B: rob houses 1 to ${n-1} (exclude first house).`,
    dpA: [...dpA], dpB: [...dpB], highlights: { ...highlights }, codeLineIndex: 3,
    resultA: resA,
  })

  const resB = robRange(nums, 1, n - 1, 'B', dpB, steps, highlights)

  const result = Math.max(resA, resB)
  steps.push({
    description: `max(subA=${resA}, subB=${resB}) = ${result}. Final answer: ${result}.`,
    dpA: [...dpA], dpB: [...dpB], highlights: { ...highlights }, codeLineIndex: 2,
    resultA: resA, resultB: resB, result, done: true,
  })

  return steps
}
