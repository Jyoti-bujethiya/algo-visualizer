// 058 — Combination Sum IV · steps.js
// dp[i] = number of ordered combinations that sum to i
// dp[0] = 1 (empty combination)
// dp[i] = sum of dp[i - num] for all num in nums where num <= i

// line indices:
// 0: function combinationSum4(nums, target):
// 1:   dp = array of size target+1, all 0
// 2:   dp[0] = 1
// 3:   for i = 1 to target:
// 4:     for each num in nums:
// 5:       if i - num >= 0:
// 6:         dp[i] += dp[i - num]
// 7:   return dp[target]

function push(steps, desc, dp, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, dp: [...dp], highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(nums, target) {
  const steps = []
  const dp = new Array(target + 1).fill(0)
  const highlights = {}

  push(steps,
    `Combination Sum IV: nums=[${nums.join(', ')}], target=${target}. dp[i] = # ordered combinations summing to i.`,
    dp, {}, 0
  )

  dp[0] = 1
  highlights['0'] = 'special'
  push(steps, 'Base case: dp[0] = 1 (empty combination sums to 0).', dp, { ...highlights }, 2)

  for (let i = 1; i <= target; i++) {
    highlights[String(i)] = 'current'
    push(steps,
      `i=${i}: accumulate dp[i] from all valid nums.`,
      dp, { ...highlights }, 3
    )
    for (const num of nums) {
      if (i - num >= 0) {
        highlights[String(i - num)] = 'compare'
        push(steps,
          `  num=${num}: dp[${i}] += dp[${i-num}]=${dp[i-num]}. dp[${i}] becomes ${dp[i] + dp[i-num]}.`,
          dp, { ...highlights }, 6
        )
        dp[i] += dp[i - num]
        highlights[String(i - num)] = 'match'
      }
    }
    highlights[String(i)] = 'match'
    push(steps, `dp[${i}] = ${dp[i]}.`, dp, { ...highlights }, 6)
  }

  push(steps,
    `dp[${target}] = ${dp[target]}. There are ${dp[target]} ordered combinations that sum to ${target}.`,
    dp, { ...highlights }, 7, { result: dp[target], done: true }
  )
  return steps
}
