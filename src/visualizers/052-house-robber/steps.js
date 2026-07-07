// 052 — House Robber · steps.js
// dp[i] = max money robbing houses 0..i
// dp[i] = max(dp[i-1], dp[i-2] + nums[i])

// Tab line indices:
// 0: function rob(nums):
// 1:   n = nums.length
// 2:   if n == 0: return 0
// 3:   dp[0] = nums[0]
// 4:   dp[1] = max(nums[0], nums[1])
// 5:   for i = 2 to n-1:
// 6:     dp[i] = max(dp[i-1], dp[i-2] + nums[i])
// 7:   return dp[n-1]

function push(steps, desc, dp, nums, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, dp: [...dp], nums, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(algo, nums) {
  const steps = []
  const n = nums.length
  const dp = new Array(n).fill(null)
  const highlights = {}

  push(steps,
    `House Robber: ${n} houses with amounts [${nums.join(', ')}]. You cannot rob adjacent houses. Find the maximum amount you can rob.`,
    dp, nums, {}, 0
  )

  if (n === 0) {
    steps.push({ description: 'Empty array — return 0.', dp: [], nums: [], highlights: {}, codeLineIndex: 2, result: 0, done: true })
    return steps
  }

  dp[0] = nums[0]
  highlights['0'] = 'special'
  push(steps, `Base case: dp[0] = nums[0] = ${nums[0]}.`, dp, nums, { ...highlights }, 3)

  if (n >= 2) {
    dp[1] = Math.max(nums[0], nums[1])
    highlights['1'] = 'special'
    push(steps,
      `Base case: dp[1] = max(nums[0], nums[1]) = max(${nums[0]}, ${nums[1]}) = ${dp[1]}.`,
      dp, nums, { ...highlights }, 4
    )
  }

  for (let i = 2; i < n; i++) {
    highlights[String(i - 1)] = 'compare'
    highlights[String(i - 2)] = 'compare'
    highlights[`n${i}`] = 'compare' // nums highlight
    push(steps,
      `i=${i}: compare dp[${i-1}]=${dp[i-1]} (skip house ${i}) vs dp[${i-2}]=${dp[i-2]} + nums[${i}]=${nums[i]} = ${dp[i-2] + nums[i]}.`,
      dp, nums, { ...highlights }, 5
    )
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i])
    highlights[String(i - 1)] = 'match'
    highlights[String(i - 2)] = 'match'
    highlights[String(i)] = 'current'
    push(steps,
      `dp[${i}] = max(${dp[i-1]}, ${dp[i-2] + nums[i]}) = ${dp[i]}.`,
      dp, nums, { ...highlights }, 6, { result: dp[n - 1] !== null ? dp[n - 1] : undefined }
    )
    highlights[String(i)] = 'match'
  }

  push(steps,
    `Done! Maximum money = dp[${n-1}] = ${dp[n-1]}.`,
    dp, nums, { ...highlights }, 7, { result: dp[n - 1], done: true }
  )
  return steps
}
