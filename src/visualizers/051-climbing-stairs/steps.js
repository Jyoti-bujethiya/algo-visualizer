// 051 — Climbing Stairs · steps.js
// dp[i] = number of ways to reach step i
// dp[0] = 1, dp[1] = 1; dp[i] = dp[i-1] + dp[i-2]

// Tab (Bottom-up) line indices:
// 0: function climbStairs(n):
// 1:   dp = array of size n+1
// 2:   dp[0] = 1; dp[1] = 1
// 3:   for i = 2 to n:
// 4:     dp[i] = dp[i-1] + dp[i-2]
// 5:   return dp[n]

// Memo (Top-down) line indices:
// 0: function climbStairs(n):
// 1:   memo = {}
// 2:   function dp(i):
// 3:     if i <= 1: return 1
// 4:     if i in memo: return memo[i]
// 5:     memo[i] = dp(i-1) + dp(i-2)
// 6:     return memo[i]
// 7:   return dp(n)

function push(steps, desc, dp, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, dp: [...dp], highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(algo, n) {
  const steps = []
  const dp = new Array(n + 1).fill(null)
  const highlights = {}

  push(steps,
    `Climbing Stairs: n=${n}. At each step you can take 1 or 2 stairs. dp[i] = number of distinct ways to reach stair i.`,
    dp, {}, 0
  )

  if (algo === 'tab') {
    dp[0] = 1
    highlights['0'] = 'special'
    push(steps, 'Base case: dp[0] = 1 (one way to stand at ground — do nothing).', dp, { ...highlights }, 2)

    if (n >= 1) {
      dp[1] = 1
      highlights['1'] = 'special'
      push(steps, 'Base case: dp[1] = 1 (only one way to reach step 1 — take one step).', dp, { ...highlights }, 2)
    }

    for (let i = 2; i <= n; i++) {
      highlights[String(i - 1)] = 'compare'
      highlights[String(i - 2)] = 'compare'
      push(steps,
        `Computing dp[${i}]: look back at dp[${i-1}]=${dp[i-1]} and dp[${i-2}]=${dp[i-2]}.`,
        dp, { ...highlights }, 3
      )
      dp[i] = dp[i - 1] + dp[i - 2]
      highlights[String(i - 1)] = 'done'
      highlights[String(i - 2)] = 'done'
      highlights[String(i)] = 'current'
      push(steps,
        `dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1] - (i > 2 ? 0 : 0) + dp[i-2] - (i > 2 ? 0 : 0)} = ${dp[i]}.`,
        dp, { ...highlights }, 4,
        { result: dp[n] !== null ? dp[n] : undefined }
      )
      highlights[String(i)] = 'match'
    }

    push(steps,
      `Done! dp[${n}] = ${dp[n]}. There are ${dp[n]} distinct ways to climb ${n} stairs.`,
      dp, { ...highlights }, 5, { result: dp[n], done: true }
    )
  } else {
    // Memoized top-down
    const memo = {}
    const order = []

    function rec(i) {
      if (i <= 1) {
        memo[i] = 1
        dp[i] = 1
        highlights[String(i)] = 'special'
        push(steps, `dp(${i}) — base case → return 1.`, dp, { ...highlights }, 3)
        return 1
      }
      if (memo[i] !== undefined) {
        highlights[String(i)] = 'match'
        push(steps, `dp(${i}) already memoized = ${memo[i]}.`, dp, { ...highlights }, 4)
        return memo[i]
      }
      order.push(i)
      highlights[String(i)] = 'current'
      push(steps, `Computing dp(${i}) — will recurse into dp(${i-1}) and dp(${i-2}).`, dp, { ...highlights }, 5)
      const val = rec(i - 1) + rec(i - 2)
      memo[i] = val
      dp[i] = val
      highlights[String(i)] = 'match'
      push(steps, `dp(${i}) = dp(${i-1}) + dp(${i-2}) = ${val}. Memoized.`, dp, { ...highlights }, 6)
      return val
    }

    const result = rec(n)
    push(steps,
      `Done! dp(${n}) = ${result}. There are ${result} distinct ways to climb ${n} stairs.`,
      dp, { ...highlights }, 7, { result, done: true }
    )
  }

  return steps
}
