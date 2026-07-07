// 061 — Jump Game · steps.js
// Greedy: track maxReach; if i > maxReach → stuck
// DP: dp[i] = can we reach index i?

// Greedy line indices:
// 0: function canJump(nums):
// 1:   maxReach = 0
// 2:   for i = 0 to n-1:
// 3:     if i > maxReach: return false
// 4:     maxReach = max(maxReach, i + nums[i])
// 5:   return true

// DP line indices:
// 0: function canJump(nums):
// 1:   dp = [false, ..., false]; dp[0] = true
// 2:   for i = 1 to n-1:
// 3:     for j = 0 to i-1:
// 4:       if dp[j] and j + nums[j] >= i:
// 5:         dp[i] = true; break
// 6:   return dp[n-1]

function push(steps, desc, dp, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, dp: [...dp], highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(algo, nums) {
  const steps = []
  const n = nums.length
  const highlights = {}

  if (algo === 'greedy') {
    const dp = nums.map(() => null) // display: maxReach bar
    let maxReach = 0

    push(steps,
      `Jump Game (Greedy): nums=[${nums.join(', ')}]. Track maxReach — furthest index reachable so far. If current index i > maxReach, we're stuck.`,
      dp, {}, 0
    )

    for (let i = 0; i < n; i++) {
      highlights[String(i)] = 'current'
      push(steps,
        `i=${i}: nums[${i}]=${nums[i]}. maxReach=${maxReach}. ${i > maxReach ? 'i > maxReach — STUCK! Return false.' : `Can reach here. New maxReach = max(${maxReach}, ${i}+${nums[i]}=${i+nums[i]}) = ${Math.max(maxReach, i + nums[i])}.`}`,
        dp, { ...highlights }, 2
      )
      if (i > maxReach) {
        highlights[String(i)] = 'error'
        push(steps, `Cannot reach index ${i} — return false.`, dp, { ...highlights }, 3, { result: false, done: true })
        return steps
      }
      maxReach = Math.max(maxReach, i + nums[i])
      dp[i] = maxReach
      highlights[String(i)] = maxReach >= n - 1 ? 'match' : 'done'
      push(steps,
        `maxReach updated to ${maxReach}.${maxReach >= n - 1 ? ' Can reach the last index!' : ''}`,
        dp, { ...highlights }, 4, { maxReach }
      )
    }

    push(steps, `Greedy complete! maxReach=${maxReach} ≥ n-1=${n-1}. Return true.`, dp, { ...highlights }, 5, { result: true, done: true })
  } else {
    // DP
    const dp = new Array(n).fill(false)
    dp[0] = true
    highlights['0'] = 'special'

    push(steps,
      `Jump Game (DP): dp[i] = can we reach index i? dp[0]=true (we start here).`,
      dp, { ...highlights }, 1
    )

    for (let i = 1; i < n; i++) {
      highlights[String(i)] = 'current'
      push(steps, `i=${i}: check if any j < ${i} with dp[j]=true can jump to ${i}.`, dp, { ...highlights }, 2)
      for (let j = 0; j < i; j++) {
        highlights[String(j)] = 'compare'
        if (dp[j] && j + nums[j] >= i) {
          dp[i] = true
          highlights[String(j)] = 'match'
          highlights[String(i)] = 'match'
          push(steps, `j=${j}: dp[${j}]=true and ${j}+nums[${j}]=${j+nums[j]} >= ${i}. dp[${i}]=true!`, dp, { ...highlights }, 5)
          break
        }
        highlights[String(j)] = 'discard'
      }
      if (!dp[i]) {
        highlights[String(i)] = 'error'
        push(steps, `dp[${i}] = false — no path reaches here.`, dp, { ...highlights }, 5)
      }
    }

    push(steps,
      `dp[${n-1}] = ${dp[n-1]}. ${dp[n-1] ? 'Can reach the end!' : 'Cannot reach the end.'}`,
      dp, { ...highlights }, 6, { result: dp[n - 1], done: true }
    )
  }
  return steps
}
