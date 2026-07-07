// 064 — Partition Equal Subset Sum · steps.js
// 0/1 Knapsack: can we pick a subset summing to total/2?
// dp[j] = true if subset sums to j
// For each num: iterate j from target down to num: dp[j] |= dp[j-num]

// line indices:
// 0: function canPartition(nums):
// 1:   total = sum(nums); if total%2 != 0: return false
// 2:   target = total / 2
// 3:   dp = [false,...,false]; dp[0] = true
// 4:   for each num in nums:
// 5:     for j = target down to num:
// 6:       dp[j] = dp[j] || dp[j - num]
// 7:   return dp[target]

function push(steps, desc, dp, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, dp: [...dp], highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(nums) {
  const steps = []
  const total = nums.reduce((a, b) => a + b, 0)
  const highlights = {}

  push(steps,
    `Partition Equal Subset Sum: nums=[${nums.join(', ')}], total=${total}. We need a subset summing to ${total}/2=${total/2}. ${total % 2 !== 0 ? 'Total is odd — impossible!' : 'Total is even — proceed with 0/1 knapsack.'}`,
    [true, ...new Array(Math.ceil(total / 2)).fill(false)], {}, 0
  )

  if (total % 2 !== 0) {
    push(steps, 'Total is odd — cannot partition equally. Return false.', [false], {}, 1, { result: false, done: true })
    return steps
  }

  const target = total / 2
  const dp = new Array(target + 1).fill(false)
  dp[0] = true
  highlights['0'] = 'special'
  push(steps, `dp[0]=true (empty subset). dp[1..${target}]=false. target=${target}.`, dp, { ...highlights }, 3)

  for (const num of nums) {
    push(steps,
      `Processing num=${num}. Iterate j from ${target} down to ${num} and update dp[j] |= dp[j-${num}].`,
      dp, { ...highlights }, 4
    )
    for (let j = target; j >= num; j--) {
      highlights[String(j)] = 'current'
      highlights[String(j - num)] = 'compare'
      push(steps,
        `  j=${j}: dp[${j}]=${dp[j] ? 'T' : 'F'} || dp[${j-num}]=${dp[j-num] ? 'T' : 'F'} → ${(dp[j] || dp[j - num]) ? 'T' : 'F'}.`,
        dp, { ...highlights }, 6
      )
      dp[j] = dp[j] || dp[j - num]
      highlights[String(j)] = dp[j] ? 'match' : 'discard'
      highlights[String(j - num)] = dp[j - num] ? 'match' : 'discard'
    }
    push(steps, `After num=${num}: dp[${target}]=${dp[target] ? 'T' : 'F'}.`, dp, { ...highlights }, 6)
    if (dp[target]) {
      push(steps, `dp[${target}]=true — subset found! Return true.`, dp, { ...highlights }, 7, { result: true, done: true })
      return steps
    }
  }

  push(steps,
    `dp[${target}]=${dp[target] ? 'T' : 'F'}. ${dp[target] ? 'Partition possible!' : 'Cannot partition — return false.'}`,
    dp, { ...highlights }, 7, { result: dp[target], done: true }
  )
  return steps
}
